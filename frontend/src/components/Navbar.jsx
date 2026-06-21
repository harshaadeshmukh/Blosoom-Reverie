import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Reviews', to: '/connect' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ivory/95 backdrop-blur-sm shadow-sm' : 'bg-ivory'
      } border-b border-border-soft animate-fade-in`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="group shrink-0">
          <div className="font-playfair italic text-base text-charcoal leading-tight">
            Blosoom Reverie
          </div>
          <div className="text-[8px] md:text-[9px] tracking-[2px] md:tracking-[3.5px] text-rose uppercase mt-0.5 whitespace-nowrap">
            Handmade Gifting Studio
          </div>
        </Link>

        {/* Nav Links & Button */}
        <div className="flex items-center gap-3 md:gap-7">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-[10px] md:text-[11px] tracking-[0.8px] transition-colors duration-300 group whitespace-nowrap ${
                location.pathname === link.to
                  ? 'text-charcoal'
                  : 'text-text-muted hover:text-charcoal'
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-rose transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
          <Link
            to="/custom-order"
            className="bg-charcoal text-ivory text-[9px] md:text-[11px] tracking-[1px] md:tracking-[1.5px] px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-rose hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-4px_rgba(26,15,15,0.3)] transition-all duration-300 uppercase font-inter font-medium flex items-center whitespace-nowrap shrink-0"
          >
            Order Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
