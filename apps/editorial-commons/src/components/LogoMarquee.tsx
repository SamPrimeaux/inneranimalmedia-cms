import React from 'react';

export const LogoMarquee: React.FC = () => {
  const logos = [
    { name: 'VOGUE', font: 'font-serif tracking-widest' },
    { name: 'GQ', font: 'font-bold tracking-tighter' },
    { name: 'DAZED', font: 'font-extrabold tracking-widest' },
    { name: '032C', font: 'font-mono font-bold tracking-tight' },
    { name: 'NUMÉRO', font: 'font-serif tracking-widest italic' },
    { name: 'HYPEBEAST', font: 'font-bold tracking-wider' }
  ];

  return (
    <section className="relative z-20 bg-white h-[110px] md:h-[134px] border-b border-black/10 flex items-center overflow-hidden select-none">
      <div className="animate-marquee flex items-center whitespace-nowrap text-xl sm:text-2xl text-neutral-400 font-semibold tracking-wider">
        {logos.map((logo, idx) => (
          <div
            key={idx}
            className="w-[218px] flex items-center justify-center hover:text-black transition-colors duration-300"
          >
            <span className={`${logo.font} text-neutral-400 hover:text-black transition-colors`}>
              {logo.name}
            </span>
          </div>
        ))}

        {/* Duplicate track for seamless infinite marquee loop */}
        {logos.map((logo, idx) => (
          <div
            key={`dup-${idx}`}
            className="w-[218px] flex items-center justify-center hover:text-black transition-colors duration-300"
          >
            <span className={`${logo.font} text-neutral-400 hover:text-black transition-colors`}>
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
