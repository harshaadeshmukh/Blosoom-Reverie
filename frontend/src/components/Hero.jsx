import { Link } from 'react-router-dom';

const POLAROIDS = [
  { src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=200&h=240&fit=crop', cap: '2023',   anim: 'animate-float-a', delay: '0s',   cls: 'w-[100px] h-[118px] left-[8%]  top-[6%]'  },
  { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=240&fit=crop', cap: 'us',     anim: 'animate-float-b', delay: '0.4s', cls: 'w-[84px]  h-[100px] left-[26%] top-[32%]' },
  { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=240&fit=crop', cap: 'forever',anim: 'animate-float-c', delay: '0.8s', cls: 'w-[96px]  h-[114px] left-[42%] top-[2%]'  },
  { src: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?w=200&h=240&fit=crop', cap: 'friends',anim: 'animate-float-d', delay: '0.2s', cls: 'w-[88px]  h-[104px] left-[58%] top-[28%]' },
  { src: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=200&h=240&fit=crop', cap: 'love',   anim: 'animate-float-a', delay: '1.1s', cls: 'w-[100px] h-[118px] left-[75%] top-[4%]'  },
  { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&h=240&fit=crop', cap: 'always', anim: 'animate-float-b', delay: '0.6s', cls: 'w-[80px]  h-[96px]  left-[88%] top-[36%]' },
];

export default function Hero() {
  return (
    <section className="bg-ivory-soft pt-20 pb-0 relative overflow-hidden">

      {/* ── Hero text ── */}
      <div className="text-center max-w-2xl mx-auto px-4 relative z-10">

        <div className="flex items-center justify-center gap-2.5 mb-5 opacity-0 animate-fade-in [animation-delay:0.1s]">
          <span className="h-px bg-rose animate-line-grow" style={{ width: '28px' }} />
          <span className="text-[9px] tracking-[4px] text-rose uppercase">Pimpri · Since 2024</span>
        </div>

        <h1 className="font-playfair text-[34px] sm:text-[44px] md:text-[52px] italic font-normal text-charcoal leading-[1.12] mb-5
                       opacity-0 animate-fade-up [animation-delay:0.25s]">
          A bouquet built
          <br />
          from <em className="not-italic text-rose">your</em> memories.
        </h1>

        <p className="text-[13px] font-light text-text-muted leading-[1.9] mb-8 max-w-lg mx-auto
                      opacity-0 animate-fade-up [animation-delay:0.4s]">
          Photo bouquets, sticker arrangements and memory gifts — each one
          handcrafted, personalised, and impossible to replicate.
        </p>

        {/* CTAs — stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center
                        opacity-0 animate-fade-up [animation-delay:0.55s]">
          <Link
            to="/collections"
            className="text-center bg-charcoal text-ivory text-[10px] tracking-[2.5px] px-7 py-3.5 uppercase
                       font-inter transition-all duration-300 hover:bg-rose hover:-translate-y-0.5"
          >
            Explore Collections
          </Link>
          <Link
            to="/custom-order"
            className="text-center border border-rose-muted text-charcoal text-[10px] tracking-[2px] px-7 py-3.5 uppercase
                       font-inter transition-all duration-300 hover:bg-charcoal hover:text-ivory hover:border-charcoal"
          >
            Custom Order
          </Link>
        </div>
      </div>

      {/* ── Mobile: horizontal polaroid strip ── */}
      <div className="md:hidden mt-8 overflow-x-auto flex gap-4 px-6 pb-6 snap-x snap-mandatory">
        {POLAROIDS.map((p, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-center bg-white p-1.5 pb-5 shadow-[0_6px_16px_rgba(44,26,26,0.12)] rounded-sm relative"
            style={{ width: 76, height: 92 }}
          >
            <img src={p.src} alt="" className="block w-full h-full object-cover rounded-sm" loading="lazy" />
            <div className="absolute bottom-1 left-0 right-0 text-center font-playfair text-[7px] italic text-text-dim">{p.cap}</div>
          </div>
        ))}
      </div>

      {/* ── Desktop: floating polaroid stage ── */}
      <div className="relative h-[260px] mt-6 hidden md:block">
        {POLAROIDS.map((p, i) => (
          <div
            key={i}
            className={`absolute bg-white p-2 pb-5 shadow-[0_8px_20px_rgba(44,26,26,0.12)] rounded-sm ${p.anim} ${p.cls}`}
            style={{ animationDelay: p.delay }}
          >
            <img src={p.src} alt="" className="block w-full h-full object-cover rounded-sm" loading="lazy" />
            <div className="absolute bottom-1 left-0 right-0 text-center font-playfair text-[9px] italic text-text-dim">{p.cap}</div>
          </div>
        ))}
        <div className="absolute left-1/2 bottom-0 font-playfair text-[12px] italic text-rose animate-drift-ribbon origin-top">
          — wrapped with love —
        </div>
      </div>
    </section>
  );
}
