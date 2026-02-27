import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";

export type ScrollDirection = "up" | "down" | "idle";

export interface ScrollState {
  progress: number;
  velocity: number;
  direction: ScrollDirection;
  isScrolling: boolean;
}

export interface SmoothScrollOptions {
  onScroll?: (state: ScrollState) => void;
  scrollEndDelay?: number;
  lenisOptions?: ConstructorParameters<typeof Lenis>[0];
}

export interface SmoothScrollControls {
  lenis: Lenis | null;
  scrollTo: (
    target: HTMLElement | string | number,
    opts?: Parameters<Lenis["scrollTo"]>[1]
  ) => void;
  pause: () => void;
  resume: () => void;
  jump: (y: number) => void;
}

const expoEaseOut = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

const adaptiveDuration = (velocity: number): number => {
  const abs = Math.abs(velocity);
  const mapped = 2.4 - (abs / 60) * 1.6;
  return Math.min(2.4, Math.max(0.8, mapped));
};

function shouldUseNativeScroll(): boolean {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isMobileViewport = window.innerWidth < 1024;
  return prefersReducedMotion || (isCoarsePointer && isMobileViewport);
}

export function useSmoothScroll(options: SmoothScrollOptions = {}): SmoothScrollControls {
  const { onScroll, scrollEndDelay = 150, lenisOptions } = options;

  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number>(0);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);

  const onScrollRef = useRef(onScroll);
  useEffect(() => {
    onScrollRef.current = onScroll;
  }, [onScroll]);

  const scrollTo = useCallback<SmoothScrollControls["scrollTo"]>((target, opts) => {
    if (!lenisRef.current) {
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (typeof target === "string") {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    lenisRef.current.scrollTo(target as HTMLElement | string | number, {
      duration: 1.8,
      easing: expoEaseOut,
      ...opts,
    });
  }, []);

  const pause = useCallback(() => lenisRef.current?.stop(), []);
  const resume = useCallback(() => lenisRef.current?.start(), []);
  const jump = useCallback((y: number) => {
    if (!lenisRef.current) {
      window.scrollTo({ top: y, behavior: "auto" });
      return;
    }
    lenisRef.current.scrollTo(y, { immediate: true });
  }, []);

  useEffect(() => {
    if (shouldUseNativeScroll()) return;

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

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);

    lenis.on("scroll", ({ scroll, limit, velocity }: { scroll: number; limit: number; velocity: number }) => {
      const progress = limit > 0 ? scroll / limit : 0;
      const deltaY = scroll - lastScrollY.current;
      const direction: ScrollDirection = Math.abs(deltaY) < 0.5 ? "idle" : deltaY > 0 ? "down" : "up";
      lastScrollY.current = scroll;

      if (Math.abs(velocity) > 0) {
        const mutableLenis = lenis as unknown as { options: { duration: number } };
        mutableLenis.options.duration = adaptiveDuration(velocity);
      }

      isScrollingRef.current = true;
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        const mutableLenis = lenis as unknown as { options: { duration: number } };
        mutableLenis.options.duration = 1.8;
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

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, {
        offset: -80,
        duration: 2,
        easing: expoEaseOut,
      });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lenisOptions, scrollEndDelay]);

  return {
    get lenis() {
      return lenisRef.current;
    },
    scrollTo,
    pause,
    resume,
    jump,
  };
}

export function useScrollProgress(controls: SmoothScrollControls): number {
  const progressRef = useRef(0);

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
  void controls;
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
