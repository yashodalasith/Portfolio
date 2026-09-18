import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

// Real inertia-based smooth scroll — the single biggest "feels expensive"
// lever a site has, independent of any individual section's effects. Native
// browser scroll is instant/linear; Lenis makes the whole page carry weight
// and settle, which is what most people are actually reacting to when they
// call a site "buttery" — it's rarely the individual animations.
//
// Skipped entirely under prefers-reduced-motion: inertia scrolling is
// exactly the kind of vestibular-trigger motion that preference exists to
// avoid, so reduced-motion visitors get plain native scroll, full stop.
export default function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    // Exposed so anchor links elsewhere (Navbar, Hero) can call
    // lenis.scrollTo() instead of relying on native hash-jump, which would
    // otherwise fight Lenis's own scroll position each frame.
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    // Intercept in-page anchor clicks site-wide so they scroll smoothly
    // through Lenis instead of native hash-jumping underneath it.
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.3 });
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduceMotion]);

  return null;
}
