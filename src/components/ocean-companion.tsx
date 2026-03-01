import { useEffect, useRef, memo } from "react";

/*
 * OceanCompanion — The cat sprite
 *
 * Start: Large cat on right side of hero
 * Scroll: Shrinks slightly, detaches, floats alongside user
 * Mouse: Moves AWAY from cursor when it gets close (shy octopus)
 */

const OceanCompanion = memo(function OceanCompanion() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({
        // Mouse avoidance
        mouseX: -1000,
        mouseY: -1000,
        pushX: 0,
        pushY: 0,
        // Floating
        targetY: 0,
        currentY: 0,
        scrollVelocity: 0,
        lastScrollY: 0,
        tiltX: 0,
        bobPhase: 0,
        scrollProgress: 0,
    });
    const rafRef = useRef(0);

    useEffect(() => {
        const s = stateRef.current;

        const onMouseMove = (e: MouseEvent) => {
            s.mouseX = e.clientX;
            s.mouseY = e.clientY;
        };

        const onScroll = () => {
            const newScroll = window.scrollY;
            s.scrollVelocity = newScroll - s.lastScrollY;
            s.lastScrollY = newScroll;
            s.scrollProgress = Math.min(1, newScroll / 300);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("scroll", onScroll, { passive: true });

        const animate = () => {
            const el = containerRef.current;
            if (!el) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }

            const s = stateRef.current;
            const p = s.scrollProgress;

            // ─── Scale ───
            const scale = 1.0 - p * 0.15;

            // ─── Base position ───
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            // Hero: cat on the far right side (5% from edge)
            const heroRightPx = vw * 0.05;
            // Floating: partially off the right edge so it doesn't block content
            const floatRightPx = -80;
            const baseRight = heroRightPx + p * (floatRightPx - heroRightPx);
            const baseTopPercent = 45 + p * 5;
            const baseTopPx = (baseTopPercent / 100) * vh;

            // ─── Mouse avoidance ───
            // Calculate cat center position in screen coords
            const catCenterX = vw - baseRight - 250 * scale; // rough center
            const catCenterY = baseTopPx;

            const dx = s.mouseX - catCenterX;
            const dy = s.mouseY - catCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const avoidRadius = 200; // px — proximity threshold
            const pushStrength = 120; // px — max push distance

            if (dist < avoidRadius && dist > 0) {
                const force = (1 - dist / avoidRadius) * pushStrength;
                const angle = Math.atan2(dy, dx);
                // Push AWAY from cursor
                s.pushX += (-Math.cos(angle) * force - s.pushX) * 0.08;
                s.pushY += (-Math.sin(angle) * force - s.pushY) * 0.08;
            } else {
                // Spring back
                s.pushX *= 0.92;
                s.pushY *= 0.92;
            }

            // Zero out tiny values
            if (Math.abs(s.pushX) < 0.1) s.pushX = 0;
            if (Math.abs(s.pushY) < 0.1) s.pushY = 0;

            // ─── Floating behavior ───
            s.bobPhase += 0.02;
            const bob = Math.sin(s.bobPhase) * 8 * p;
            const sway = Math.sin(s.bobPhase * 0.7) * 3 * p;

            // Scroll velocity tilt
            s.tiltX += (-s.scrollVelocity * 0.3 - s.tiltX) * 0.05;
            s.tiltX = Math.max(-15, Math.min(15, s.tiltX));
            s.scrollVelocity *= 0.95;

            const totalX = sway + s.pushX;
            const totalY = bob + s.pushY;
            const rotation = s.tiltX * 0.3 * p;

            el.style.right = `${baseRight}px`;
            el.style.top = `${baseTopPercent}%`;
            el.style.transform =
                `translate(0, -50%) translateX(${totalX}px) translateY(${totalY}px) scale(${scale}) rotate(${rotation}deg)`;

            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="hidden lg:block"
            style={{
                position: "fixed",
                right: "25%",
                top: "45%",
                zIndex: 30,
                pointerEvents: "none",
                willChange: "transform",
                transformOrigin: "center center",
            }}
        >
            <video
                src="/video/mascot2.webm"
                className="w-[500px] h-[600px] object-contain"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
            />
        </div>
    );
});

export default OceanCompanion;
