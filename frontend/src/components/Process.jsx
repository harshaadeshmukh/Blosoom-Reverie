import { useEffect, useRef } from 'react';
import ProcessStep from './ProcessStep';

const STEPS = [
  {
    num: '01',
    title: 'Share your photos & brief',
    body: 'WhatsApp us the photos, occasion, messages and colour preferences — we handle the rest',
  },
  {
    num: '02',
    title: 'We design & handcraft it',
    body: 'Photos are printed, cut and arranged with stickers and decor — entirely by hand, every time',
  },
  {
    num: '03',
    title: 'Wrapped & gift-ready',
    body: 'Packed in our signature wrap with ribbon and your personalised handwritten note card',
  },
  {
    num: '04',
    title: 'Delivered or collected',
    body: 'Choose home delivery or collect directly — always completed with care and on time',
  },
];

export default function Process() {
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
    <section ref={ref} className="bg-ivory py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="reveal">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-rose inline-block" />
            <span className="text-[9px] tracking-[4px] text-rose uppercase">How it works</span>
          </div>
          <h2 className="font-playfair text-[34px] italic text-charcoal leading-[1.2] mt-2">
            From your phone
            <br />to their hands.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-12 border-t border-border-soft">
          {STEPS.map((s, i) => (
            <ProcessStep
              key={i}
              num={s.num}
              title={s.title}
              body={s.body}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
