import { useEffect, useRef } from 'react';
import CtaBand from '../components/CtaBand';

const PILLARS = [
  {
    index: 'i.',
    title: 'The beginning',
    body: 'Blosoom Reverie was born in Pimpri in 2024 — not from a shop or a supplier, but from a single observation: the most meaningful gifts are ones that could only have come from you.',
  },
  {
    index: 'ii.',
    title: 'A different kind of gifting',
    body: 'We do not arrange flowers. We arrange memories. Every piece starts with a conversation, a set of photos, and a story — and ends with something the recipient will keep long after the occasion is over.',
  },
  {
    index: 'iii.',
    title: 'Made by hand, always',
    body: 'Every single bouquet is cut, assembled and wrapped entirely by hand — no machines, no templates, no shortcuts. We take the time because the person you are gifting it to deserves that.',
  },
  {
    index: 'iv.',
    title: 'Our promise',
    body: 'We will never repeat an arrangement. Every order is one of a kind — built for one person, from one story, at one specific moment in their life.',
  },
];

export default function AboutPage() {
  const ref = useRef(null);

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
      {/* Hero */}
      <div className="bg-ivory-soft py-12 px-6 md:px-10 border-b border-border-soft">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-end">
          <div>
            <div className="reveal flex items-center gap-2.5 mb-4">
              <span className="w-5 h-px bg-rose inline-block" />
              <span className="text-[9px] tracking-[4px] text-rose uppercase">Our Story</span>
            </div>
            <h1 className="reveal font-playfair text-[36px] md:text-[64px] italic text-charcoal leading-[1.08]">
              Not a florist.
              <br />A memory
              <br />maker.
            </h1>
          </div>
          <p className="reveal delay-100 text-[14px] font-light text-text-muted leading-[2] pb-2">
            We are a small, handmade gifting studio based in Pimpri, Maharashtra. We work with
            personal photographs, stickers, notes and ribbons — building them into bouquets that
            feel like a hug from someone who knows you completely.
          </p>
        </div>
      </div>

      {/* Story pillars */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-px bg-border-soft">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="reveal bg-ivory p-7 md:p-14 group cursor-default transition-all duration-300 hover:bg-ivory-soft"
            >
              <div className="font-playfair text-[11px] italic text-rose mb-4">{p.index}</div>
              <h2 className="font-playfair text-[24px] italic text-charcoal mb-4">{p.title}</h2>
              <p className="text-[13px] font-light text-text-muted leading-[1.9]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <CtaBand />
    </div>
  );
}
