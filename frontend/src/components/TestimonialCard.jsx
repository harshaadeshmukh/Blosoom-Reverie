import { useEffect, useRef, useState } from 'react';

export default function TestimonialCard({ quote, name, city, image_url, rating = 5, index = 0 }) {
  const clampedRating = Math.min(5, Math.max(0, Math.round(rating)));
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const staggerMs = Math.min(index % 4, 3) * 90;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setIsVisible(true), staggerMs);
          observer.unobserve(el);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.35, rootMargin: '0px -40px 0px -40px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerMs]);

  return (
    <div
      ref={cardRef}
      className={`bg-charcoal-mid rounded-2xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(26,15,15,0.4)] flex flex-col md:flex-row border border-white/5 h-full items-stretch overflow-hidden
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      style={{ transitionProperty: 'opacity, transform, box-shadow', transitionDuration: isVisible ? '650ms' : '0ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="flex flex-col flex-1 gap-5 md:gap-6 p-6 md:p-8">

      {/* Stars */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: clampedRating }).map((_, i) => (
          <svg key={i} className="w-5 h-5 text-rose drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <div className="relative flex-grow">
        <span className="absolute -top-5 -left-3 text-[70px] font-playfair italic text-white/[0.03] leading-none pointer-events-none select-none">"</span>
        <p className="font-playfair text-[15px] italic text-text-warm leading-[1.8] relative z-10">
          "{quote}"
        </p>
      </div>

      {/* Divider + Author */}
      <div className="mt-2">
        <div className="w-8 h-[1px] bg-rose-muted/40 mb-3 transition-all duration-500 group-hover:w-16 group-hover:bg-rose-muted" />
        <div className="text-[10px] tracking-[2px] text-rose-muted uppercase font-inter font-medium">
          {name}{city ? <>&nbsp;·&nbsp;{city}</> : null}
        </div>
      </div>

      </div>

      {/* Image */}
      {image_url && (
        <div className="w-full md:w-[280px] h-[320px] md:h-auto md:min-h-[360px] relative shrink-0">
          <img
            src={image_url}
            alt={`${name}'s gift`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/50 to-transparent opacity-50 group-hover:opacity-10 transition-opacity duration-500" />
        </div>
      )}



    </div>
  );
}
