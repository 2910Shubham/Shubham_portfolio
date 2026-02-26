import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth scrolling and keeps it running via rAF.
 * Also patches native anchor-click smooth-scroll to go through Lenis
 * so `scrollIntoView({ behavior: "smooth" })` still works.
 */
export function useSmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,           // scroll duration in seconds — higher = smoother
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out expo
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // ─── rAF loop ───
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // ─── Patch anchor clicks so smooth "scrollTo" goes through Lenis ───
        const handleAnchorClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("a[href^='#']");
            if (!target) return;

            const href = target.getAttribute("href");
            if (!href || href === "#") return;

            const el = document.querySelector(href);
            if (el) {
                e.preventDefault();
                lenis.scrollTo(el as HTMLElement, { offset: 0 });
            }
        };

        document.addEventListener("click", handleAnchorClick);

        return () => {
            document.removeEventListener("click", handleAnchorClick);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return lenisRef;
}
