import { useEffect, useRef } from 'react';

export default function About() {
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

  const pillars = [
    { num: '01', title: 'Signature Black Wrap', desc: 'Elegant black paper wrapping tied with premium satin ribbon' },
    { num: '02', title: 'Memories on Sticks', desc: 'Your personal photos and quirky quotes printed and arranged on bamboo sticks' },
    { num: '03', title: 'Custom Cutouts', desc: 'From evil eyes to foil balloons, we add the little things they love' },
    { num: '04', title: 'Handwritten Notes', desc: 'Finished with a custom message card written just for them' },
  ];

  return (
    <section ref={ref} className="bg-ivory py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-20 items-start">
        {/* Left */}
        <div className="reveal">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-rose inline-block" />
            <span className="text-[9px] tracking-[4px] text-rose uppercase">Our story</span>
          </div>
          <h2 className="font-playfair text-[34px] italic text-charcoal leading-[1.2]">
            Not a florist.
            <br />A memory
            <br />maker.
          </h2>
        </div>

        {/* Right */}
        <div className="reveal delay-100">
          <p className="text-[13px] font-light text-text-muted leading-[1.95] mb-5">
            At Blosoom Reverie, every arrangement begins not with flowers — but with a person. We
            take your photographs, your inside jokes, your shared moments, and build them into
            something you can hold. A bouquet that is unmistakably, irreplaceably yours.
          </p>
          <p className="text-[13px] font-light text-text-muted leading-[1.95] mb-6">
            No templates. No repeats. Every stem, wrap, sticker and ribbon is chosen with purpose —
            because the right gift does not just look beautiful. It says something only you could say.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {pillars.map((p, i) => (
              <div
                key={i}
                className={`reveal delay-${(i + 1) * 100} flex items-start gap-4 bg-ivory-soft
                            border border-border-soft rounded-sm p-5
                            cursor-default transition-all duration-300 hover:bg-white hover:shadow-sm`}
              >
                <span className="text-[10px] font-inter font-medium tracking-widest text-rose bg-white border border-border-soft rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {p.num}
                </span>
                <div>
                  <div className="text-[13px] font-medium text-charcoal mb-1">{p.title}</div>
                  <div className="text-[11px] font-light text-text-light leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
