import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ScrollDirection = "up" | "down" | "idle";

export interface ScrollState {
    progress: number;         // 0 → 1, full-page scroll progress
    velocity: number;         // px/frame — useful for parallax intensity
    direction: ScrollDirection;
    isScrolling: boolean;
}

export interface SmoothScrollOptions {
    /** Called on every scroll frame with live scroll state */
    onScroll?: (state: ScrollState) => void;
    /** Milliseconds of inactivity before `isScrolling` flips to false (default 150) */
    scrollEndDelay?: number;
    /** Override default Lenis config */
    lenisOptions?: ConstructorParameters<typeof Lenis>[0];
}

export interface SmoothScrollControls {
    /** The raw Lenis instance */
    lenis: Lenis | null;
    /** Smoothly scroll to a target (element, selector, or y-position) */
    scrollTo: (
        target: HTMLElement | string | number,
        opts?: Parameters<Lenis["scrollTo"]>[1]
    ) => void;
    /** Pause Lenis (e.g. when a modal is open) */
    pause: () => void;
    /** Resume after pause */
    resume: () => void;
    /** Instantly jump to a position without animation */
    jump: (y: number) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Easings
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Expo ease-out — fast start, ultrasoft landing.
 * Better than cubic for longer durations: it resolves with near-zero velocity
 * which eliminates the "clunk" you get at the end of cubic ease-in-out.
 */
const expoEaseOut = (t: number): number =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * Velocity-adaptive duration: fast flicks feel snappy, slow deliberate scrolls
 * feel luxurious. Clamp between 0.8 s and 2.4 s.
 */
const adaptiveDuration = (velocity: number): number => {
    const abs = Math.abs(velocity);
    // Map [0 .. 60] px/frame → [2.4 .. 0.8] s  (inverse, clamped)
    const mapped = 2.4 - (abs / 60) * 1.6;
    return Math.min(2.4, Math.max(0.8, mapped));
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useSmoothScroll
 *
 * Initialises Lenis with premium defaults, patches anchor clicks and
 * scrollIntoView, and exposes a rich control surface + live scroll state.
 *
 * @example
 * const { scrollTo, pause, resume } = useSmoothScroll({
 *   onScroll: ({ progress, direction }) => {
 *     setShowHeader(direction === 'up' || progress < 0.05);
 *   },
 * });
 */
export function useSmoothScroll(
    options: SmoothScrollOptions = {}
): SmoothScrollControls {
    const { onScroll, scrollEndDelay = 150, lenisOptions } = options;

    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number>(0);
    const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastScrollY = useRef<number>(0);
    const isScrollingRef = useRef<boolean>(false);

    // Stable callback ref so callers don't need to memoise onScroll
    const onScrollRef = useRef(onScroll);
    useEffect(() => { onScrollRef.current = onScroll; }, [onScroll]);

    // ── Reduced motion check ──────────────────────────────────────────────────
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Controls (stable refs, safe to spread into JSX) ──────────────────────
    const scrollTo = useCallback<SmoothScrollControls["scrollTo"]>(
        (target, opts) => {
            lenisRef.current?.scrollTo(target as HTMLElement, {
                duration: 1.8,
                easing: expoEaseOut,
                ...opts,
            });
        },
        []
    );

    const pause = useCallback(() => lenisRef.current?.stop(), []);
    const resume = useCallback(() => lenisRef.current?.start(), []);
    const jump = useCallback((y: number) => {
        lenisRef.current?.scrollTo(y, { immediate: true });
    }, []);

    // ── Initialise ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (prefersReducedMotion) return; // respect user preference

        const lenis = new Lenis({
            duration: 1.8,
            easing: expoEaseOut,
            smoothWheel: true,
            wheelMultiplier: 0.85,
            touchMultiplier: 1.4,
            infinite: false,
            ...lenisOptions,
        });

        lenisRef.current = lenis;

        // ── rAF loop ─────────────────────────────────────────────────────────
        const raf = (time: number) => {
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        };
        rafIdRef.current = requestAnimationFrame(raf);

        // ── Scroll listener: state + velocity-adaptive duration ──────────────
        lenis.on("scroll", ({ scroll, limit, velocity }: {
            scroll: number;
            limit: number;
            velocity: number;
        }) => {
            const progress = limit > 0 ? scroll / limit : 0;
            const deltaY = scroll - lastScrollY.current;
            const direction: ScrollDirection =
                Math.abs(deltaY) < 0.5 ? "idle" : deltaY > 0 ? "down" : "up";
            lastScrollY.current = scroll;

            // Update Lenis duration on the fly based on current velocity
            // (cast to any since Lenis doesn't expose options as writable in typings)
            if (Math.abs(velocity) > 0) {
                (lenis as any).options.duration = adaptiveDuration(velocity);
            }

            // Mark scrolling active
            isScrollingRef.current = true;
            if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
            scrollEndTimerRef.current = setTimeout(() => {
                isScrollingRef.current = false;
                // Reset to comfortable default when scroll stops
                (lenis as any).options.duration = 1.8;
                onScrollRef.current?.({
                    progress,
                    velocity: 0,
                    direction: "idle",
                    isScrolling: false,
                });
            }, scrollEndDelay);

            onScrollRef.current?.({
                progress,
                velocity,
                direction,
                isScrolling: true,
            });
        });

        // ── Anchor click patch ────────────────────────────────────────────────
        const handleAnchorClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
                "a[href^='#']"
            );
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            lenis.scrollTo(target as HTMLElement, {
                offset: -80, // sensible default for fixed nav headers
                duration: 2,
                easing: expoEaseOut,
            });
        };

        document.addEventListener("click", handleAnchorClick);

        // ── scrollIntoView patch ──────────────────────────────────────────────
        const originalScrollIntoView = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function (
            arg?: boolean | ScrollIntoViewOptions
        ) {
            if (typeof arg === "object" && arg?.behavior === "smooth") {
                lenis.scrollTo(this as HTMLElement, {
                    offset: 0,
                    duration: 2,
                    easing: expoEaseOut,
                });
            } else {
                originalScrollIntoView.call(this, arg);
            }
        };

        // ── window.scrollTo patch ─────────────────────────────────────────────
        const originalWindowScrollTo = window.scrollTo.bind(window);
        window.scrollTo = ((...args: Parameters<typeof window.scrollTo>) => {
            const opts = args[0];
            if (
                typeof opts === "object" &&
                opts !== null &&
                (opts as ScrollToOptions).behavior === "smooth"
            ) {
                lenis.scrollTo((opts as ScrollToOptions).top ?? 0, {
                    duration: 1.8,
                    easing: expoEaseOut,
                });
            } else {
                originalWindowScrollTo(...(args as [number, number]));
            }
        }) as typeof window.scrollTo;

        // ── Cleanup ───────────────────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(rafIdRef.current);
            if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
            document.removeEventListener("click", handleAnchorClick);
            Element.prototype.scrollIntoView = originalScrollIntoView;
            window.scrollTo = originalWindowScrollTo;
            lenis.destroy();
            lenisRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        get lenis() { return lenisRef.current; },
        scrollTo,
        pause,
        resume,
        jump,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: useScrollProgress
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lightweight hook for components that only need the scroll progress value.
 *
 * @example
 * const progress = useScrollProgress(lenisControls);
 * // → 0 at top, 1 at bottom, updates every frame
 */
export function useScrollProgress(
    controls: SmoothScrollControls
): number {
    const progressRef = useRef(0);
    // For reactive updates, wire this into your state management of choice.
    // Kept as a ref here to avoid unnecessary re-renders in animation loops.
    useEffect(() => {
        const lenis = controls.lenis;
        if (!lenis) return;
        const handler = ({ scroll, limit }: { scroll: number; limit: number }) => {
            progressRef.current = limit > 0 ? scroll / limit : 0;
        };
        lenis.on("scroll", handler);
        return () => lenis.off("scroll", handler);
    }, [controls.lenis]);
    return progressRef.current;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: useScrollReveal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Observes an element and fires `onEnter` / `onLeave` in sync with Lenis's
 * virtual scroll position rather than the browser's paint, preventing the
 * flicker you get when IntersectionObserver fires ahead of a smooth scroll.
 *
 * @example
 * const ref = useScrollReveal(controls, {
 *   onEnter: (el) => el.classList.add('visible'),
 *   onLeave: (el) => el.classList.remove('visible'),
 *   threshold: 0.15,
 * });
 * return <section ref={ref}>…</section>;
 */
export function useScrollReveal(
    controls: SmoothScrollControls,
    {
        onEnter,
        onLeave,
        threshold = 0.1,
        rootMargin = "0px",
    }: {
        onEnter?: (el: Element) => void;
        onLeave?: (el: Element) => void;
        threshold?: number;
        rootMargin?: string;
    }
) {
    const elRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) onEnter?.(entry.target);
                    else onLeave?.(entry.target);
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [onEnter, onLeave, threshold, rootMargin]);

    return elRef;
}