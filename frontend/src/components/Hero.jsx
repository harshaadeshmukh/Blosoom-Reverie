import { Link } from 'react-router-dom';

const POLAROIDS = [
  { src: '/images/bouquet1.jpg', cap: 'custom', anim: 'animate-float-a', delay: '0s', cls: 'w-[70px] md:w-[160px] h-[82px] md:h-[190px] left-[2%] md:left-[8%]  top-[6%]' },
  { src: '/images/bouquet2.jpg', cap: 'birthday', anim: 'animate-float-b', delay: '0.4s', cls: 'w-[60px] md:w-[134px]  h-[72px] md:h-[160px] left-[18%] md:left-[24%] top-[25%]' },
  { src: '/images/bouquet3.jpg', cap: '21st', anim: 'animate-float-c', delay: '0.8s', cls: 'w-[66px] md:w-[154px]  h-[78px] md:h-[182px] left-[35%] md:left-[39%] top-[2%]' },
  { src: '/images/bouquet4.jpg', cap: 'love', anim: 'animate-float-d', delay: '0.2s', cls: 'w-[60px] md:w-[140px]  h-[72px] md:h-[166px] left-[52%] md:left-[56%] top-[22%]' },
  { src: '/images/bouquet3.jpg', cap: 'flowers', anim: 'animate-float-a', delay: '1.1s', cls: 'w-[70px] md:w-[160px] h-[82px] md:h-[190px] left-[68%] md:left-[73%] top-[4%]' },
  { src: '/images/bouquet2.jpg', cap: 'forever', anim: 'animate-float-b', delay: '0.6s', cls: 'w-[56px] md:w-[128px]  h-[68px] md:h-[154px]  left-[82%] md:left-[86%] top-[20%]' },
];

export default function Hero() {
  return (
    <section className="bg-ivory-soft pt-24 md:pt-20 lg:pt-24 pb-0 relative overflow-hidden">

      {/* ── Hero text ── */}
      <div className="text-center max-w-2xl mx-auto px-4 relative z-10">

        <h1 className="font-playfair text-[34px] sm:text-[44px] md:text-[52px] italic font-normal text-charcoal leading-[1.12] mb-2
                       opacity-0 animate-fade-up [animation-delay:0.25s]">
          A bouquet built
          <br />
          from <em className="not-italic text-rose">your</em> memories.
        </h1>

        <p className="text-[13px] font-light text-text-muted leading-[1.9] mb-0 max-w-lg mx-auto
                      opacity-0 animate-fade-up [animation-delay:0.4s]">
          Photo bouquets, sticker arrangements and memory gifts — each one
          handcrafted, personalised, and impossible to replicate.
        </p>


      </div>

      {/* ── Floating polaroid stage (All Devices) ── */}
      <div className="relative h-[180px] md:h-[260px] mt-0">
        {POLAROIDS.map((p, i) => (
          <div
            key={i}
            className={`absolute bg-white p-2 pb-5 md:p-3 md:pb-8 shadow-[0_8px_20px_rgba(44,26,26,0.12)] rounded-sm ${p.anim} ${p.cls}`}
            style={{ animationDelay: p.delay }}
          >
            <img src={p.src} alt="" className="block w-full h-full object-cover rounded-sm" fetchPriority={i < 2 ? "high" : "auto"} />
            <div className="absolute bottom-1 md:bottom-2 left-0 right-0 text-center font-playfair text-[9px] md:text-[13px] italic text-text-dim">{p.cap}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
