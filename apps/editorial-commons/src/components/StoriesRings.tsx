import React from 'react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const StoriesRings: React.FC = () => {
  const { STORIES_DATA } = useEditorialData();
  const { setActiveStoryIndex } = useCart();

  return (
    <section className="relative z-20 bg-white text-[#111111] pt-14 pb-12 border-b border-black/5">
      <div className="max-w-[1440px] mx-auto px-6 text-center space-y-8">
        {/* S05: "THE SELECTED" heading with red echo */}
        <div className="relative inline-block select-none">
          <span
            aria-hidden="true"
            className="absolute -top-[1.5px] -left-[2px] text-3xl sm:text-4xl font-bold tracking-[0.14em] uppercase text-[#8b181b]/35 blur-[0.5px]"
          >
            THE SELECTED
          </span>
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-[0.14em] uppercase text-[#111111]">
            THE SELECTED
          </h2>
        </div>

        {/* S06: 5 Circular Story Rings */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto py-2 no-scrollbar">
          {STORIES_DATA.map((story, index) => (
            <button
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="group flex flex-col items-center gap-2.5 focus:outline-none cursor-pointer shrink-0"
              aria-label={`Open story: ${story.title}`}
            >
              {/* Ring Container: 2px ring + dark gap */}
              <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#8b181b] via-neutral-300 to-[#8b181b] group-hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="p-[2px] rounded-full bg-white">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-900">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#111111] group-hover:text-[#8b181b] transition-colors">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
