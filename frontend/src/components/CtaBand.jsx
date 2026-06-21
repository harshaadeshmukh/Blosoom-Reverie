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
          <div className="text-[9px] md:text-[10px] font-inter font-medium tracking-[3px] text-[#7A4A40] uppercase mb-3">
            Custom orders open
          </div>
          <h2 className="font-playfair text-[32px] md:text-[38px] font-normal text-charcoal leading-[1.15] tracking-[-0.02em]">
            Have something
            <br /><span className="italic text-[#5A2A24]">special in mind?</span>
          </h2>
        </div>

        <div className="reveal delay-100">
          <p className="font-playfair italic text-[14px] md:text-[15px] text-[#5A2A24]/90 leading-[1.8] tracking-[0.02em] mb-6 max-w-[280px]">
            Send us your photos, share the story. We will build something made for no one else
            but them.
          </p>
          <Link
            to="/custom-order"
            className="inline-flex items-center justify-center w-full md:w-auto bg-ivory text-charcoal text-[10px] md:text-[11px] tracking-[1.5px] px-8 py-3 rounded-full uppercase font-inter font-medium transition-all duration-500 shadow-[0_2px_10px_rgba(44,26,26,0.05)] hover:shadow-[0_12px_24px_rgba(44,26,26,0.15)] hover:-translate-y-0.5 hover:bg-white"
          >
            Begin Your Order
          </Link>
        </div>
      </div>
    </section>
  );
}
