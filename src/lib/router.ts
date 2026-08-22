// Minimal client-side router.
//
// The site is a static SPA with no known server rewrite rules, so routes live in
// the hash (`#/careers`). That deep-links and survives a refresh on any static
// host. A real path (`/careers`) is still honoured if the host happens to serve
// index.html there.

import { useSyncExternalStore } from "react";

export type Route = "home" | "careers" | "rituals";

const ROUTE_EVENT = "hze:routechange";

const listeners = new Set<() => void>();

const notify = () => {
  window.dispatchEvent(new Event(ROUTE_EVENT));
  listeners.forEach((fn) => fn());
};

export const getRoute = (): Route => {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.replace(/^#/, "");
  if (hash.startsWith("/careers")) return "careers";
  if (hash.startsWith("/rituals")) return "rituals";
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path.endsWith("/careers") || path.endsWith("/jobs")) return "careers";
  if (path.endsWith("/rituals") || path.endsWith("/ritual")) return "rituals";
  return "home";
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
};

export const useRoute = (): Route =>
  useSyncExternalStore(subscribe, getRoute, () => "home" as Route);

/**
 * Navigate between routes.
 * `anchor` is an element id to scroll to once the home route is rendered.
 */
export const navigate = (route: Route, anchor?: string) => {
  if (route !== "home") {
    if (getRoute() !== route) {
      window.location.hash = `/${route}`;
    } else {
      notify();
    }
    return;
  }

  // Home: drop the hash without leaving a bare "#" in the address bar.
  const clean = window.location.pathname + window.location.search;
  window.history.pushState(null, "", clean);
  notify();

  if (anchor) {
    // Wait a frame so the home sections are mounted before measuring.
    requestAnimationFrame(() => scrollToAnchor(anchor));
  }
};

export const scrollToAnchor = (id: string) => {
  const el = document.getElementById(id.replace(/^#/, ""));
  if (!el) return;
  const header = document.querySelector("header");
  const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
  const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
  window.scrollTo({ top, behavior: "smooth" });
};
