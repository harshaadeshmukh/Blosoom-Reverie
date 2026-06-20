import { useEffect, useRef, useState } from 'react';
import TestimonialCard from './TestimonialCard';

export default function Testimonials() {
  const ref = useRef(null);
  const [reviews, setReviews] = useState([]);

  const shouldMarquee = reviews.length >= 4;

  const baseReviews = shouldMarquee 
    ? Array(Math.ceil(10 / reviews.length)).fill(reviews).flat() 
    : reviews;
  const marqueeReviews = shouldMarquee ? [...baseReviews, ...baseReviews] : reviews;

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/api/reviews/`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const formattedReviews = data.map((r) => ({
            quote: r.message,
            name: r.name,
            city: '',
            rating: r.rating ?? 5,
            delay: '',
            image_url: r.image_url ? `${API_URL}${r.image_url}` : null,
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
    <section ref={ref} className="bg-charcoal py-20 md:py-28 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="reveal flex justify-between items-end mb-2">
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
        </div>

        <div className="mt-10 overflow-hidden group py-6">
          {reviews.length > 0 ? (
            <div
              className={`flex items-stretch gap-6 px-6 ${shouldMarquee ? 'w-max marquee-container' : 'justify-center flex-wrap'}`}
              style={shouldMarquee ? { '--marquee-duration': `${reviews.length * 4.5}s` } : {}}
            >
              {shouldMarquee && (
                <style>
                  {`
                    @keyframes marquee {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(calc(-50% - 12px)); }
                    }
                    .marquee-container {
                      animation: marquee var(--marquee-duration) linear infinite;
                    }
                    .group:hover .marquee-container {
                      animation-play-state: paused;
                    }
                  `}
                </style>
              )}
              {/* Render the heavily duplicated array to ensure seamless looping on all screens */}
              {marqueeReviews.map((t, i) => (
                <div key={i} className="w-[260px] md:w-[360px] flex-shrink-0">
                  <TestimonialCard {...t} />
                </div>
              ))}
            </div>
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
