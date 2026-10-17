#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const BIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(BIN_DIR, '..');
const SCHEMA_PATH = path.join(PACKAGE_ROOT, 'schemas', 'sqlite', 'cms-local-runtime.v2.sql');
const UPGRADE_PATH = path.join(PACKAGE_ROOT, 'schemas', 'sqlite', 'upgrade-v1-to-v2.sql');
const PACKAGE_JSON_PATH = path.join(PACKAGE_ROOT, 'package.json');

function readPackageVersion() {
  try {
    return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8')).version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

function parseArgs(argv) {
  const out = { command: argv[0] ?? 'help', root: process.cwd(), json: false, project: null };
  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') out.json = true;
    else if (arg === '--root') out.root = path.resolve(argv[++i] ?? '.');
    else if (arg === '--project') out.project = argv[++i] ?? null;
    else if (arg === '--help' || arg === '-h') out.command = 'help';
    else throw new Error(`unknown argument: ${arg}`);
  }
  return out;
}

function slug(value) {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'cms-site';
}

function pathsFor(root) {
  return {
    root,
    stateDir: path.join(root, '.agentsam', 'cms'),
    dbPath: path.join(root, '.agentsam', 'cms.sqlite'),
    contentPath: path.join(root, '.agentsam', 'cms-content'),
    receiptPath: path.join(root, '.agentsam', 'cms', 'runtime.json'),
  };
}

async function openDatabase(dbPath) {
  const { DatabaseSync } = await import('node:sqlite');
  return new DatabaseSync(dbPath);
}

function print(value, asJson) {
  if (asJson || typeof value !== 'string') {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }
  process.stdout.write(`${value}\n`);
}

async function upgradeLegacyRuntime(dbPath) {
  if (!fs.existsSync(dbPath)) return;
  let db = await openDatabase(dbPath);
  const oldSchema = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='cms_sections'").get();
  db.close();
  if (!oldSchema) return;
  fs.copyFileSync(dbPath, dbPath + '.pre-v2.sqlite');
  db = await openDatabase(dbPath);
  const names = ['sites', 'pages', 'sections', 'blocks', 'revisions', 'publications', 'assets'];
  try {
    db.exec('PRAGMA foreign_keys=OFF; BEGIN IMMEDIATE;');
    for (const name of names) db.exec('ALTER TABLE cms_' + name + ' RENAME TO cms_legacy_' + name);
    db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    db.exec(fs.readFileSync(UPGRADE_PATH, 'utf8'));
    for (const name of names) db.exec('DROP TABLE cms_legacy_' + name);
    db.exec('COMMIT; PRAGMA foreign_keys=ON;');
    const integrity = db.prepare('PRAGMA integrity_check').get();
    const violations = db.prepare('PRAGMA foreign_key_check').all();
    if (integrity.integrity_check !== 'ok' || violations.length) {
      throw new Error('v1-to-v2 integrity check failed; preserved backup at .agentsam/cms.sqlite.pre-v2.sqlite');
    }
  } catch (error) {
    try { db.exec('ROLLBACK;'); } catch {}
    throw error;
  } finally { db.close(); }
}

async function initRuntime(options) {
  const p = pathsFor(options.root);
  const projectId = slug(options.project ?? path.basename(options.root));
  fs.mkdirSync(p.stateDir, { recursive: true });
  fs.mkdirSync(p.contentPath, { recursive: true });

  if (!fs.existsSync(SCHEMA_PATH)) {
    throw new Error('bundled sqlite schema missing from package');
  }

  await upgradeLegacyRuntime(p.dbPath);
  const db = await openDatabase(p.dbPath);
  try {
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    db.exec('PRAGMA user_version = 2;');
  } finally {
    db.close();
  }

  const receipt = {
    schema: 'inneranimalmedia.cms.local-runtime-receipt.v2',
    project: { id: projectId },
    provider: 'sqlite',
    mode: 'local_authority',
    database: { path: '.agentsam/cms.sqlite' },
    objectStorage: { provider: 'filesystem', path: '.agentsam/cms-content' },
    schemaRef: 'package:@inneranimalmedia/cms-runtime/sqlite-schema',
    package: { name: '@inneranimalmedia/cms-runtime', version: readPackageVersion() },
  };
  fs.writeFileSync(p.receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);

  print(
    {
      ok: true,
      project: projectId,
      root: '.',
      database: '.agentsam/cms.sqlite',
      content: '.agentsam/cms-content',
      receipt: '.agentsam/cms/runtime.json',
      next: ['cms-runtime doctor', 'agentsam tools', 'agentsam skills'],
    },
    options.json,
  );
}

async function inspectRuntime(options) {
  const p = pathsFor(options.root);
  if (!fs.existsSync(p.dbPath)) {
    throw new Error(`cms runtime not initialized in ${options.root}; run cms-runtime inip`);
  }

  const db = await openDatabase(p.dbPath);
  try {
    const integrity = db.prepare('PRAGMA integrity_check').get();
    const schemaVersion = db.prepare('PRAGMA user_version').get()?.user_version;
    const counts = {};
    for (const table of ['cms_sites','cms_pages','cms_page_sections','cms_section_blocks','cms_revisions','cms_publications','cms_assets']) {
      counts[table] = Number(db.prepare(`SELECT count(*) AS n FROM ${table}`).get().n);
    }
    print({
      ok: String(integrity.integrity_check) === 'ok',
      schema: 'inneranimalmedia.cms.local-runtime.v2',
      schemaVersion, project: slug(options.project ?? path.basename(options.root)),
      provider: 'sqlite', mode: 'local_authority',
      database: '.agentsam/cms.sqlite', counts,
      capabilityAuthority: 'agentsam',
    }, true);
  } finally {
    db.close();
  }
}


function help() {
  process.stdout.write(`@inneranimalmedia/cms-runtime

Portable CMS runtime bootstrap. Commands resolve bundled package assets; no developer checkout path is required.

Usage:
  cms-runtime init [--project ID] [--root PATH] [--json]
  cms-runtime doctor [--root PATH] [--json]

Typical clean-machine flow:
  mkdir my-site && cd my-site
  npm install -D @inneranimalmedia/cms-runtime
  npx cms-runtime init --project my-site
  npx cms-runtime doctor
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  switch (options.command) {
    case 'init':
      await initRuntime(options);
      break;
    case 'doctor':
      await inspectRuntime(options);
      break;
    case 'help':
      help();
      break;
    default:
      throw new Error(`unknown command: ${options.command}`);
  }
}

main().catch((error) => {
  process.stderr.write(`cms-runtime: ${error?.message ?? error}\n`);
  process.exitCode = 1;
});
