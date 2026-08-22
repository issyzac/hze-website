import React, { useEffect, useRef, useState } from "react";
import { getRoute, navigate, scrollToAnchor, useRoute, type Route } from "../lib/router";
import { useActiveSection } from "../hooks/useActiveSection";

interface HeaderProps {
  instagramUrl?: string;
  xUrl?: string;
  logoSrc?: string;
}

// `route` entries are their own page; the rest are sections of home.
const NAV: { name: string; href: string; route?: Route }[] = [
  { name: "Home", href: "#home" },
  { name: "Shop", href: "#products" },
  { name: "Ritual", href: "#/rituals", route: "rituals" },
  { name: "Stories", href: "#our-story" },
  { name: "Events", href: "#events" },
  { name: "Visit Us", href: "#contact" },
];

// Stable id per item: the route name, or the section it scrolls to.
const keyOf = (item: (typeof NAV)[number]) => item.route ?? item.href.replace("#", "");

// Scroll-spy order follows the page, not the menu.
const SECTION_IDS = ["home", "our-story", "products", "events", "contact"];

export default function Header({
  instagramUrl = "https://www.instagram.com/harakatizaenzi",
  xUrl = "https://x.com/harakatizaenzi",
  logoSrc = "/assets/Hze-logo.png",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const route = useRoute();
  const { active: activeSection, lock } = useActiveSection(SECTION_IDS, route === "home");

  // Off home the page itself is the "section"; on home the scroll position wins.
  const activeKey = route === "home" ? activeSection : route;

  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide the desktop indicator under whichever link is active.
  useEffect(() => {
    const update = () => {
      const link = linkRefs.current[activeKey];
      const wrap = navRef.current;
      if (!link || !wrap) {
        setPill((p) => (p.visible ? { ...p, visible: false } : p));
        return;
      }
      const a = link.getBoundingClientRect();
      const b = wrap.getBoundingClientRect();
      setPill({ left: a.left - b.left, width: a.width, visible: true });
    };

    update();
    // Re-measure once layout/webfonts settle — label widths shift with them.
    const frame = requestAnimationFrame(update);
    document.fonts?.ready.then(update).catch(() => {});
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [activeKey]);

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
    // Pin the highlight so it doesn't strobe through every section on the way.
    lock(id);
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
          <nav ref={navRef} className="hidden md:flex relative items-center gap-7 lg:gap-9">
            {NAV.map((item) => {
              const key = keyOf(item);
              const isActive = key === activeKey;
              return (
                <a
                  key={item.name}
                  ref={(el) => {
                    linkRefs.current[key] = el;
                  }}
                  href={item.href}
                  onClick={(e) => handleNav(e, item.href, item.route)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative font-sans tracking-tight py-2 transition-colors duration-300 ${
                    isActive
                      ? "text-hze-red font-medium"
                      : "text-enzi-db hover:text-coffee-gold"
                  }`}
                >
                  {item.name}
                  {/* Hover hint — grows from the left, hidden once active. */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-coffee-gold/60 transition-transform duration-300 ${
                      isActive ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}

            {/* Sliding bean — an invisible track carries it between links. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[10px] transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: pill.width,
                transform: `translateX(${pill.left}px)`,
                opacity: pill.visible ? 1 : 0,
              }}
            >
              {/* The bean itself, centred on the active link. */}
              <svg
                width="13"
                height="10"
                viewBox="0 0 13 10"
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_1px_0.5px_rgba(58,36,21,0.55))]"
              >
                <g transform="rotate(-20 6.5 5)">
                  <ellipse cx="6.5" cy="5" rx="5.5" ry="2.9" fill="#3A2415" />
                  <path
                    d="M1.9 5.4C3.6 3.8 4.8 6.5 6.5 5s3.1-1.2 4.6.4"
                    fill="none"
                    stroke="#EDE5CF"
                    strokeOpacity="0.7"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </span>
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
          {NAV.map((item) => {
            const key = keyOf(item);
            const isActive = key === activeKey;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNav(e, item.href, item.route)}
                aria-current={isActive ? "page" : undefined}
                className={`relative overflow-hidden px-6 py-4 font-sans min-h-[48px] flex items-center transition-colors duration-300 ${
                  isActive
                    ? "text-hze-red font-medium bg-hze-red/[0.06]"
                    : "text-enzi-db/90 hover:text-coffee-gold hover:bg-coffee-brown/5"
                }`}
              >
                {/* Roast-bar that slides in on the active row. */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-[3px] origin-top rounded-[0.5px] bg-gradient-to-b from-hze-red to-clay shadow-[1px_0_2px_rgba(58,36,21,0.25)] transition-transform duration-300 ease-out ${
                    isActive ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <span
                  className={`transition-transform duration-300 ease-out ${
                    isActive ? "translate-x-1.5" : "translate-x-0"
                  }`}
                >
                  {item.name}
                </span>
              </a>
            );
          })}
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
