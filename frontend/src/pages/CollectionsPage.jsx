import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { COLLECTIONS } from '../data/collections';

export default function CollectionsPage() {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((r) => {
      observer.observe(r);
      if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('visible');
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-ivory min-h-screen pt-24">
      {/* Page header */}
      <div className="bg-ivory-soft py-12 px-6 md:px-10 border-b border-border-soft">
        <div className="max-w-7xl mx-auto">
          <div className="reveal flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-rose inline-block" />
            <span className="text-[9px] tracking-[4px] text-rose uppercase">Collections</span>
          </div>
          <h1 className="reveal font-playfair text-[36px] md:text-[60px] italic text-charcoal leading-[1.1]">
            Every bouquet,
            <br />a story.
          </h1>
          <p className="reveal delay-100 text-[13px] font-light text-text-muted leading-[1.9] mt-6 max-w-lg">
            Five distinct collections — each built around a specific feeling, moment, and set of
            people. All handmade, all personal, all entirely yours.
          </p>
        </div>
      </div>

      {/* Collections list */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="space-y-1">
          {COLLECTIONS.map((c, i) => (
            <div
              key={i}
              className="reveal group border border-border-soft bg-ivory transition-all duration-300 hover:bg-ivory-soft"
            >
              <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 items-start">
                <div className="font-playfair text-[11px] italic text-rose pt-1">{c.num}</div>
                <div>
                  <h2 className="font-playfair text-[28px] italic text-charcoal mb-3">{c.name}</h2>
                  <p className="text-[13px] font-light text-text-muted leading-[1.8] mb-4">{c.detail}</p>
                  <span className="inline-block text-[9px] tracking-[2px] text-[#8C4A40] border border-rose-muted px-2.5 py-1 uppercase">
                    {c.tag}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/custom-order')}
                  className="md:self-center bg-charcoal text-ivory text-[10px] tracking-[2px] px-6 py-3 uppercase
                             font-inter transition-all duration-300 hover:bg-rose whitespace-nowrap w-full md:w-auto mt-2"
                >
                  Order This
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
