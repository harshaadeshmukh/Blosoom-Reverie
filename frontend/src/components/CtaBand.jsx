import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function CtaBand() {
  const ref = useRef(null);

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
    <section ref={ref} className="bg-rose py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div className="reveal">
          <div className="text-[9px] tracking-[4px] text-[#7A4A40] uppercase mb-3">
            Custom orders open
          </div>
          <h2 className="font-playfair text-[32px] italic text-charcoal leading-[1.2]">
            Have something
            <br />special in mind?
          </h2>
        </div>

        <div className="reveal delay-100">
          <p className="text-[12px] font-light text-[#5A2A24] leading-[1.9] mb-5 max-w-[260px]">
            Send us your photos, share the story. We will build something made for no one else
            but them.
          </p>
          <Link
            to="/custom-order"
            className="inline-block w-full md:w-auto text-center bg-ivory text-charcoal text-[10px] tracking-[2.5px] px-7 py-3.5
                       uppercase font-inter transition-all duration-300 hover:bg-charcoal hover:text-ivory"
          >
            Begin Your Order
          </Link>
        </div>
      </div>
    </section>
  );
}
