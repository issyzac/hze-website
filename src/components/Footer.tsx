import React from "react";
import { getRoute, navigate, scrollToAnchor } from "../lib/router";

interface FooterProps {
  instagramUrl?: string;
  xUrl?: string;
}

const footerNav = [
  { name: "Shop", href: "#products" },
  { name: "Stories", href: "#our-story" },
  { name: "Events", href: "#events" },
  { name: "Visit Us", href: "#contact" },
];

export default function Footer({
  instagramUrl = "https://www.instagram.com/harakatizaenzi",
  xUrl = "https://x.com/harakatizaenzi",
}: FooterProps) {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    if (getRoute() !== "home") {
      navigate("home", id);
    } else {
      scrollToAnchor(id);
    }
  };

  return (
    <footer className="bg-coffee-dark text-coffee-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <img
              src="/assets/Hze-logo.png"
              alt="Harakati za Enzi logo"
              className="h-12 w-auto mb-4 brightness-0 invert opacity-90"
            />
            <p className="font-['RoobertRegular'] text-coffee-cream/80 leading-7 max-w-sm">
              Tanzanian specialty coffee roasted with precision, creating
              dignified work and places to belong.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-coffee-cream/70 hover:text-coffee-gold transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
              <a
                href={xUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="text-coffee-cream/70 hover:text-coffee-gold transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.901 2H21l-6.64 7.59L22 22h-6.9l-4.8-6.3L4.8 22H3l7.18-8.21L2 2h7l4.3 5.7L18.901 2Zm-2.42 18h2.09L7.62 4h-2.1l10.97 16Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav className="md:col-span-3" aria-label="Footer">
            <h3 className="font-['RoobertMedium'] text-sm uppercase tracking-[0.15em] text-coffee-gold mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerNav.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNav(e, item.href)}
                    className="font-['RoobertRegular'] text-coffee-cream/80 hover:text-coffee-gold transition-colors inline-block py-1.5"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => navigate("careers")}
                  className="font-['RoobertRegular'] text-coffee-cream/80 hover:text-coffee-gold transition-colors inline-flex items-center gap-2 py-1.5"
                >
                  Careers
                  <span className="text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 bg-coffee-gold text-coffee-dark">
                    Hiring
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Visit */}
          <div className="md:col-span-2">
            <h3 className="font-['RoobertMedium'] text-sm uppercase tracking-[0.15em] text-coffee-gold mb-4">
              Visit
            </h3>
            <address className="not-italic font-['RoobertRegular'] text-coffee-cream/80 leading-7">
              HZE Mbezi · HZE Victoria
              <br />
              Dar es Salaam, Tanzania
            </address>
            <p className="font-['RoobertRegular'] text-coffee-cream/80 leading-7 mt-3">
              Monday – Saturday
              <br />
              7:30 AM – 10:00 PM
            </p>
          </div>

          {/* Movement Dispatch */}
          <div className="md:col-span-3">
            <h3 className="font-['RoobertMedium'] text-sm uppercase tracking-[0.15em] text-coffee-gold mb-4">
              Movement Dispatch
            </h3>
            <p className="font-['RoobertRegular'] text-coffee-cream/80 leading-7 mb-4">
              Stories, releases, brew guides, and gatherings — no noise.
            </p>
            <a
              href="#contact"
              onClick={(e) => handleNav(e, "#contact")}
              className="inline-flex items-center justify-center px-5 py-3 border border-coffee-gold text-coffee-gold hover:bg-coffee-gold hover:text-coffee-dark transition-colors font-['RoobertMedium'] text-sm min-h-[48px]"
            >
              Join the Movement Dispatch
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-coffee-cream/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-['RoobertRegular'] text-sm text-coffee-cream/60">
            © {new Date().getFullYear()} Harakati za Enzi. Roasted in Tanzania.
          </p>
          <p className="font-['RoobertRegular'] text-sm text-coffee-cream/60">
            Kahawa na Harakati — coffee and movement.
          </p>
        </div>
      </div>
    </footer>
  );
}
