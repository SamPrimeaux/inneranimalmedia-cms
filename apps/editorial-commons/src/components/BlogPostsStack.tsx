import { useEditorialBrand } from '../portable/EditorialHost';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const BlogPostsStack: React.FC = () => {
  const brand = useEditorialBrand();
  const { BLOG_POSTS } = useEditorialData();
  const featuredPost = BLOG_POSTS[0];
  const secondaryPosts = BLOG_POSTS.slice(1);

  return (
    <section id="editorial" className="relative z-20 bg-white text-[#111111] py-24 px-6 md:px-10 border-b border-black/10">
      <div className="max-w-[1440px] mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8b181b] font-bold block mb-1">
              THE {brand.name} JOURNAL
            </span>
            <h2 className="text-3xl font-bold uppercase tracking-[0.1em] text-black">
              EDITORIAL ESSAYS
            </h2>
          </div>
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-mono">
            VOLUME 04 · ISSUE AUTUMN 26
          </span>
        </div>

        {/* Sticky Split Stacking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Featured Post PINNED sticky top:80px */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <article className="group bg-neutral-50 rounded-sm overflow-hidden border border-black/10 hover:border-black/30 hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-900 relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest">
                  FEATURED DISCOURSE
                </span>
              </div>
              <div className="p-6 md:p-8 space-y-3 bg-white">
                <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                  {featuredPost.date} · {featuredPost.readTime}
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-black group-hover:text-[#8b181b] transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black group-hover:text-[#8b181b] transition-colors">
                    <span>READ FULL ESSAY</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column: Stacked Cards (sticky stacking deck effect) */}
          <div className="lg:col-span-6 space-y-8">
            {secondaryPosts.map((post, idx) => (
              <article
                key={post.id}
                className="group lg:sticky lg:top-28 bg-white rounded-sm overflow-hidden border border-black/10 hover:border-black/30 hover:shadow-2xl transition-all duration-300 shadow-md"
                style={{ top: `${110 + idx * 30}px` }}
              >
                <div className="aspect-[16/9] overflow-hidden bg-neutral-900 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 backdrop-blur text-black text-[9px] font-bold uppercase tracking-widest">
                    {post.tag}
                  </span>
                </div>
                <div className="p-6 space-y-2.5 bg-white">
                  <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
                    {post.date} · {post.readTime}
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-black group-hover:text-[#8b181b] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-black group-hover:text-[#8b181b] transition-colors">
                      <span>READ ESSAY</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
