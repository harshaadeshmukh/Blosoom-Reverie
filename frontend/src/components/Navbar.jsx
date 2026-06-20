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
    { label: 'Custom Orders', to: '/custom-order' },
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
        <Link to="/" className="group">
          <div className="font-playfair italic text-base text-charcoal leading-tight">
            Blosoom Reverie
          </div>
          <div className="text-[9px] tracking-[3.5px] text-rose uppercase mt-0.5">
            Handmade Gifting Studio
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-[11px] tracking-[0.8px] transition-colors duration-300 group ${
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
            className="bg-charcoal text-ivory text-[10px] tracking-[2px] px-5 py-2.5 uppercase font-inter transition-all duration-300 hover:bg-rose hover:-translate-y-px"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <MobileMenu links={links} />
      </div>
    </nav>
  );
}

function MobileMenu({ links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-charcoal p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        <div className="w-5 h-px bg-charcoal mb-1.5 transition-all duration-300" />
        <div className="w-5 h-px bg-charcoal mb-1.5 transition-all duration-300" />
        <div className="w-3 h-px bg-charcoal transition-all duration-300" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-ivory border-b border-border-soft shadow-lg py-4 px-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-sm text-text-muted tracking-wider uppercase hover:text-charcoal transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/custom-order"
            onClick={() => setOpen(false)}
            className="bg-charcoal text-ivory text-[10px] tracking-[2px] px-5 py-2.5 uppercase text-center transition-all duration-300 hover:bg-rose"
          >
            Order Now
          </Link>
        </div>
      )}
    </div>
  );
}
