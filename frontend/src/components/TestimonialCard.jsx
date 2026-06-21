import { useEffect, useRef, useState } from 'react';

export default function TestimonialCard({ quote, name, city, image_url, rating = 5, index = 0 }) {
  const clampedRating = Math.min(5, Math.max(0, rating));
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
      className={`bg-charcoal-mid rounded-2xl group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_24px_rgba(26,15,15,0.4)] flex flex-col-reverse md:flex-row border border-white/5 h-full items-stretch overflow-hidden
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      style={{ transitionProperty: 'opacity, transform, box-shadow', transitionDuration: isVisible ? '650ms' : '0ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className="flex flex-col flex-1 gap-5 md:gap-6 p-6 md:p-8">

      {/* Stars */}
      <div className="flex items-center gap-0.5 md:gap-1">
        {[1, 2, 3, 4, 5].map((s) => {
          const full = clampedRating >= s;
          const half = !full && clampedRating >= s - 0.5;
          return (
            <span key={s} className="relative inline-block text-xl md:text-2xl lg:text-3xl leading-none" style={{ color: '#3D2424', opacity: 0.35 }}>
              ★
              {(full || half) && (
                <span
                  className="absolute left-0 top-0 overflow-hidden whitespace-nowrap"
                  style={{ color: '#C4968A', opacity: 1, width: full ? '100%' : '50%' }}
                >
                  ★
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Quote */}
      <div className="relative flex-grow mt-1 md:mt-0">
        <span className="absolute -top-4 md:-top-6 -left-2 md:-left-4 text-[60px] md:text-[90px] font-playfair italic text-white/[0.03] leading-none pointer-events-none select-none">"</span>
        <p className="font-playfair text-[14px] md:text-[16px] lg:text-[17px] italic text-text-warm leading-[1.8] md:leading-[1.9] relative z-10">
          "{quote}"
        </p>
      </div>

      {/* Divider + Author */}
      <div className="mt-1 md:mt-2">
        <div className="w-6 md:w-8 h-[1px] bg-rose-muted/40 mb-2 md:mb-3 transition-all duration-500 group-hover:w-12 md:group-hover:w-16 group-hover:bg-rose-muted" />
        <div className="text-[9px] md:text-[11px] lg:text-[12px] tracking-[1.5px] md:tracking-[2px] text-rose-muted uppercase font-inter font-medium">
          {name}{city ? <>&nbsp;·&nbsp;{city}</> : null}
        </div>
      </div>

      </div>

      {/* Image */}
      {image_url && (
        <div className="w-full md:w-[55%] lg:w-[50%] h-[320px] md:h-auto md:min-h-[460px] relative shrink-0">
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
