import React, { useEffect, useState } from "react";

interface HeaderProps {
  instagramUrl?: string;
  xUrl?: string;
  logoSrc?: string;
}


export default function Header({
  instagramUrl = "https://instagram.com/your-handle",
  xUrl = "https://x.com/your-handle",
  logoSrc = "/assets/Hze-logo.png",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#who-we-are" },
    { name: "Values", href: "#our-values" },
    { name: "Stories", href: "#our-story" },
    { name: "Impact", href: "#impact" },
    { name: "Contact Us", href: "#contact" },
  ];

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - headerHeight, behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur border-b border-coffee-brown/20" : "bg-white"
      }`}
    >
      {/* Top bar: socials + mobile menu button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Mobile menu button (left) */}
          <button
            className="md:hidden inline-flex items-center justify-center p-3 text-enzi-db hover:text-coffee-gold focus:outline-none min-h-[48px] min-w-[48px]"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h17"/>
                <path d="M3 12h15"/>
                <path d="M3 18h13"/>
              </svg>
            )}
          </button>

          {/* spacer keeps logo centered */}
          <div className="md:flex-1" />

          {/* Social icons (right) */}
          <div className="flex items-center gap-4 sm:gap-5 mt-8">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-coffee-gold/90 hover:text-coffee-gold transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              {/* Instagram icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="3.5"/>
                <circle cx="17.5" cy="6.5" r="1"/>
              </svg>
            </a>
            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="text-coffee-gold/90 hover:text-coffee-gold transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
            >
              {/* X icon */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.901 2H21l-6.64 7.59L22 22h-6.9l-4.8-6.3L4.8 22H3l7.18-8.21L2 2h7l4.3 5.7L18.901 2Zm-2.42 18h2.09L7.62 4h-2.1l10.97 16Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 md:py-6 mt-4 md:mt-0 flex justify-center">
          <a href="#home" onClick={(e) => handleNav(e, "#home")} className="block">
            <img
              src={logoSrc}
              alt="Harakati za Enzi Roastery Logo"
              className="h-12 sm:h-14 md:h-16 w-auto select-none scale-[1.02]"
            />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="hidden md:flex items-center justify-center gap-8 pb-4">
          {nav.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className="text-enzi-db font-['RoobertRegular'] tracking-tight hover:text-coffee-gold transition-colors relative py-2"
            >
              <span className="inline-block">{item.name}</span>
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-[2px] w-0 bg-coffee-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
  <nav className="mx-4 mb-3 border border-coffee-brown/20 bg-white shadow-sm">
          {nav.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNav(e, item.href)}
              className="block px-6 py-4 text-enzi-db/90 hover:text-coffee-gold hover:bg-coffee-brown/5 font-['RoobertRegular'] min-h-[48px] flex items-center"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
