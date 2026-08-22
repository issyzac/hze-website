import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks which in-page section is currently under the header.
 *
 * A plain IntersectionObserver picks the wrong section for tall/short
 * neighbours, so this measures against the header line instead: the active
 * section is the last one whose top has scrolled past it.
 *
 * `lock(id)` pins an id while a smooth scroll is in flight — without it the
 * highlight flickers through every section the page travels over on a click.
 */
export const useActiveSection = (ids: string[], enabled = true) => {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const lockedUntil = useRef(0);
  const frame = useRef(0);

  // ids is a fresh array each render; compare by value so the effect is stable.
  const key = ids.join("|");

  const lock = useCallback((id: string) => {
    // Long enough to cover a smooth scroll across the page; `scrollend`
    // releases it earlier where supported.
    lockedUntil.current = performance.now() + 1200;
    setActive(id);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const sectionIds = key.split("|").filter(Boolean);

    const measure = () => {
      frame.current = 0;
      if (performance.now() < lockedUntil.current) return;

      const header = document.querySelector("header");
      const line = (header ? header.offsetHeight : 0) + 24;

      // Bottom of the page: the last section can be too short to ever cross
      // the header line, so claim it outright.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;

      let current = sectionIds[0] ?? "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
        else break;
      }
      if (atBottom) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          if (document.getElementById(sectionIds[i])) {
            current = sectionIds[i];
            break;
          }
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(measure);
    };

    const onScrollEnd = () => {
      lockedUntil.current = 0;
      measure();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [key, enabled]);

  return { active, lock };
};
