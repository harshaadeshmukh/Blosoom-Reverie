import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CollectionCard from './CollectionCard';

import { COLLECTIONS } from '../data/collections';

export default function Collections() {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((r) => {
      observer.observe(r);
      if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('visible');
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-ivory-soft py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="reveal flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-5 h-px bg-rose inline-block" />
              <span className="text-[9px] tracking-[4px] text-rose uppercase">Collections</span>
            </div>
            <h2 className="font-playfair text-[34px] italic text-charcoal leading-[1.2]">
              Find the one
              <br />that speaks.
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-[10px] tracking-[1.5px] text-rose uppercase cursor-pointer transition-all duration-300 hover:tracking-[3px]"
          >
            View All &nbsp;→
          </Link>
        </div>

        {/* Grid */}
        <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-soft">
          {COLLECTIONS.map((c, i) => (
            <CollectionCard
              key={i}
              num={c.num}
              name={c.short_name.split('\n').join('\n')}
              desc={c.description}
              tag={c.tag}
              onClick={() => navigate('/collections')}
            />
          ))}
          <CollectionCard dark onClick={() => navigate('/custom-order')} />
        </div>
      </div>
    </section>
  );
}
