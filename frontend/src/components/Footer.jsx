import { Link } from 'react-router-dom';

const NAV_LINKS = ['Home', 'Order Now', 'Review'];
const CONNECT = [
  { label: 'Email', href: 'mailto:creative.studio22004@gmail.com' },
  { label: 'WhatsApp', href: 'https://wa.me/918625902160' },
  { label: 'Instagram', href: 'https://instagram.com/blossomreverie.gifts' },
];
const FIND = [
  { label: 'Pune, Maharashtra' },
  { label: 'India' }
];

const ROUTE_MAP = {
  Home: '/',
  'Order Now': '/custom-order',
  'Review': '/connect',
};

export default function Footer() {
  return (
    <footer className="bg-charcoal-deep pt-14 pb-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <div className="font-playfair text-[18px] italic text-text-warm mb-1.5">
              Blosoom Reverie
            </div>
            <div className="text-[9px] tracking-[3px] text-rose-muted uppercase mb-4">
              Crafted with love · Wrapped in memories
            </div>
            <p className="text-[11px] font-light text-text-sand leading-[1.8]">
              A handmade gifting studio based in Pune, Maharashtra. Every bouquet is made by
              hand, built around your story, and wrapped with intention.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <div className="text-[9px] tracking-[3px] text-rose-muted uppercase mb-4">Navigate</div>
            <div className="flex flex-col gap-2.5">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l}
                  to={ROUTE_MAP[l]}
                  className="text-[12px] font-light text-rose-muted transition-all duration-300
                             hover:text-text-warm hover:pl-1.5"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect Link */}
          <div>
            <div className="text-[9px] tracking-[3px] text-rose-muted uppercase mb-4">Connect</div>
            <div className="flex flex-col gap-2.5">
              {CONNECT.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] font-light text-rose-muted transition-all duration-300
                             hover:text-text-warm hover:pl-1.5"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          {/* Find Us */}
          <div>
            <div className="text-[9px] tracking-[3px] text-rose-muted uppercase mb-4">Find Us</div>
            <div className="flex flex-col gap-2.5">
              {FIND.map((f, i) => (
                f.href ? (
                  <a
                    key={i}
                    href={f.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] font-light text-rose-muted transition-all duration-300 hover:text-text-warm hover:pl-1.5"
                  >
                    {f.label}
                  </a>
                ) : (
                  <span
                    key={i}
                    className="text-[12px] font-light text-rose-muted"
                  >
                    {f.label}
                  </span>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-charcoal-mid pt-5 flex flex-col sm:flex-row justify-between gap-2">
          <span className="text-[10px] text-[#7A5A50] tracking-[1px]">
            © {new Date().getFullYear()} Blosoom Reverie. All rights reserved.
          </span>
          <span className="text-[10px] text-[#7A5A50] tracking-[1px]">Made with love in India</span>
        </div>
      </div>
    </footer>
  );
}
