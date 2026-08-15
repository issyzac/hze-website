import React, { useEffect, useState } from "react";
import { getRoute, navigate, scrollToAnchor, useRoute, type Route } from "../lib/router";

interface HeaderProps {
  instagramUrl?: string;
  xUrl?: string;
  logoSrc?: string;
}

export default function Header({
  instagramUrl = "https://www.instagram.com/harakatizaenzi",
  xUrl = "https://x.com/harakatizaenzi",
  logoSrc = "/assets/Hze-logo.png",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const route = useRoute();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // `route` entries are their own page; the rest are sections of home.
  const nav: { name: string; href: string; route?: Route }[] = [
    { name: "Home", href: "#home" },
    { name: "Shop", href: "#products" },
    { name: "Ritual", href: "#/rituals", route: "rituals" },
    { name: "Stories", href: "#our-story" },
    { name: "Events", href: "#events" },
    { name: "Visit Us", href: "#contact" },
  ];

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    route?: Route,
  ) => {
    e.preventDefault();
    setOpen(false);
    if (route) {
      navigate(route);
      return;
    }
    const id = href.replace("#", "");
    // Off the home route these sections are not mounted — go home first.
    if (getRoute() !== "home") {
      navigate("home", id);
    } else {
      scrollToAnchor(id);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? "bg-white/95 backdrop-blur border-b border-coffee-brown/20 shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo — left */}
          <a href="#home" onClick={(e) => handleNav(e, "#home")} className="shrink-0">
            <img
              src={logoSrc}
              alt="Harakati za Enzi Roastery Logo"
              className="h-9 sm:h-11 w-auto select-none"
            />
          </a>

          {/* Desktop nav — center */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {nav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNav(e, item.href, item.route)}
                className={`font-sans tracking-tight transition-colors py-2 ${
                  item.route && route === item.route
                    ? "text-hze-red font-medium border-b-2 border-hze-red"
                    : "text-enzi-db hover:text-coffee-gold"
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Socials — right (desktop) + burger (mobile) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hidden md:flex text-coffee-gold/90 hover:text-coffee-gold transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
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
              className="hidden md:flex text-coffee-gold/90 hover:text-coffee-gold transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.901 2H21l-6.64 7.59L22 22h-6.9l-4.8-6.3L4.8 22H3l7.18-8.21L2 2h7l4.3 5.7L18.901 2Zm-2.42 18h2.09L7.62 4h-2.1l10.97 16Z"/>
              </svg>
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center text-enzi-db hover:text-coffee-gold focus:outline-none min-h-[48px] min-w-[48px]"
              aria-label="Toggle menu"
              aria-expanded={open}
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
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
              onClick={(e) => handleNav(e, item.href, item.route)}
              className={`px-6 py-4 hover:bg-coffee-brown/5 font-sans min-h-[48px] flex items-center ${
                item.route && route === item.route
                  ? "text-hze-red font-medium"
                  : "text-enzi-db/90 hover:text-coffee-gold"
              }`}
            >
              {item.name}
            </a>
          ))}
          <div className="flex items-center gap-2 px-6 py-3 border-t border-coffee-brown/10">
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-coffee-gold/90 hover:text-coffee-gold min-h-[44px] min-w-[44px] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="3.5"/>
                <circle cx="17.5" cy="6.5" r="1"/>
              </svg>
            </a>
            <a href={xUrl} target="_blank" rel="noreferrer" aria-label="X (Twitter)" className="text-coffee-gold/90 hover:text-coffee-gold min-h-[44px] min-w-[44px] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.901 2H21l-6.64 7.59L22 22h-6.9l-4.8-6.3L4.8 22H3l7.18-8.21L2 2h7l4.3 5.7L18.901 2Zm-2.42 18h2.09L7.62 4h-2.1l10.97 16Z"/>
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
