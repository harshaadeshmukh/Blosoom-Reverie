import { useEffect, useRef, useState } from 'react';
import TestimonialCard from './TestimonialCard';

export default function Testimonials() {
  const ref = useRef(null);
  const [reviews, setReviews] = useState([]);
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = window.innerWidth > 768 ? 384 : 284;
      
      if (direction === 'right') {
        // If near end, loop back to start
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        // If near start, loop to end
        if (container.scrollLeft <= 10) {
          container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    if (reviews.length === 0 || isHovered) return;
    
    // Auto scroll every 3.5 seconds
    const interval = setInterval(() => {
      scroll('right');
    }, 2500);
    
    return () => clearInterval(interval);
  }, [reviews, isHovered]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/api/reviews/?public=true`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const formattedReviews = data
            .filter((r) => (r.rating ?? 5) >= 3)
            .map((r) => ({
              quote: r.message,
              name: r.name,
              city: '',
              rating: r.rating ?? 5,
            delay: '',
            image_url: r.image_url ? (r.image_url.startsWith('data:') ? r.image_url : `${API_URL}${r.image_url}`) : null,
          }));

          setReviews(formattedReviews);
        }
      })
      .catch((err) => console.error('Failed to fetch reviews:', err));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    // Use timeout to ensure dynamic items are rendered before observing
    setTimeout(() => {
      if (!el) return;
      el.querySelectorAll('.reveal').forEach((r) => {
        observer.observe(r);
        if (r.getBoundingClientRect().top < window.innerHeight) r.classList.add('visible');
      });
    }, 100);
    return () => observer.disconnect();
  }, [reviews]);

  return (
    <section ref={ref} className="bg-charcoal pt-8 pb-10 md:pt-10 md:pb-10 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="reveal flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-2">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-5 h-px bg-rose-muted inline-block" />
              <span className="text-[9px] tracking-[4px] text-rose-muted uppercase">Kind words</span>
            </div>
            <h2 className="font-playfair text-[34px] italic text-text-warm leading-[1.2] mt-2">
              They said it
              <br />better than us.
            </h2>
          </div>
          
          {reviews.length > 0 && (
            <div className="flex gap-3 pb-2">
              <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-rose-muted/50 flex items-center justify-center text-rose-muted hover:bg-rose-muted hover:text-charcoal transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-rose-muted/50 flex items-center justify-center text-rose-muted hover:bg-rose-muted hover:text-charcoal transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          )}
        </div>

        <div className="mt-10 overflow-hidden pt-6 pb-0">
          {reviews.length > 0 ? (
            <>
              <style>
                {`
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                  .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}
              </style>
              <div
                ref={scrollContainerRef}
                className="flex items-stretch gap-6 px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-6"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsHovered(true)}
                onTouchEnd={() => setIsHovered(false)}
              >
                {reviews.map((t, i) => (
                  <div key={i} className="w-[300px] md:w-[360px] flex-shrink-0 snap-center">
                    <TestimonialCard {...t} index={i} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-charcoal text-text-muted italic font-playfair">
              No reviews yet. Be the first to leave one!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
