import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const OCCASIONS = [
  'Birthdays',
  'Anniversaries',
  'Graduations',
  'Friendships',
  'Proposals',
  'Just because',
];

export default function Occasions() {
  const ref = useRef(null);
  const navigate = useNavigate();

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
    <section ref={ref} className="bg-blush py-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="reveal">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-px bg-rose inline-block" />
            <span className="text-[9px] tracking-[4px] text-rose uppercase">Perfect for</span>
          </div>
          <h2 className="font-playfair text-[34px] italic text-charcoal leading-[1.2] mt-2">
            Every moment
            <br />that matters.
          </h2>
        </div>

        <div className="reveal mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#DDD0C8]">
          {OCCASIONS.map((occ, i) => (
            <div
              key={i}
              onClick={() => navigate('/custom-order')}
              className="bg-blush px-7 py-6 flex items-center justify-between cursor-pointer
                         transition-all duration-300 hover:bg-white hover:pl-9 group"
            >
              <span className="font-playfair text-[17px] italic text-charcoal">{occ}</span>
              <span className="text-rose text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
