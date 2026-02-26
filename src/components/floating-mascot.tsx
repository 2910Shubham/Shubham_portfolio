import { useEffect, useRef, useState, memo } from "react";
import GreenScreenVideo from "./green-screen-video";

/*
 * FloatingMascot — The cat companion
 *
 * HERO STATE (scroll = 0):
 *   Sits at the center of the orbital system in the hero section
 *   280×340, centered in the right column
 *
 * FLOATING STATE (scroll > 0):
 *   Shrinks to ~180px, slides to the far right edge
 *   Follows the user down the page (position: fixed)
 *   Shy: moves AWAY from the cursor if it's close
 *   Click: flees to the opposite side + shows a message bubble
 */

const messages = [
    "Hey, don't click me! 😤",
    "I'm shy, stop that! 🙈",
    "Go check the projects! 🚀",
    "You found my weak spot! 💫",
    "I'm just vibing here... 🎵",
    "Let's build something cool! 🛠️",
    "Need a developer? Hire Shubham! 😎",
];

const FloatingMascot = memo(function FloatingMascot() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState(messages[0]);
    const [isDark, setIsDark] = useState(false);
    const msgTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stateRef = useRef({
        mouseX: -1000,
        mouseY: -1000,
        pushX: 0,
        pushY: 0,
        bobPhase: 0,
        scrollProgress: 0,
        lastScrollY: 0,
        scrollVelocity: 0,
        tiltX: 0,
        fleeX: 0, // extra displacement from click-to-flee
        fleeY: 0,
    });
    const rafRef = useRef(0);

    // Theme detection
    useEffect(() => {
        const check = () => setIsDark(document.documentElement.classList.contains("dark"));
        check();
        const obs = new MutationObserver(check);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => obs.disconnect();
    }, []);

    // Click handler — flee + show message
    const handleClick = () => {
        const s = stateRef.current;
        // Flee to opposite side of where mouse is
        const vw = window.innerWidth;
        s.fleeX = s.mouseX > vw / 2 ? -200 : 200;
        s.fleeY = -80 + Math.random() * 60;

        // Show random message
        const newMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(newMsg);
        setShowMessage(true);
        if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current);
        msgTimeoutRef.current = setTimeout(() => setShowMessage(false), 2500);
    };

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
            // Transition from hero to floating over first 400px of scroll
            s.scrollProgress = Math.min(1, newScroll / 400);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("scroll", onScroll, { passive: true });

        const animate = () => {
            const el = containerRef.current;
            if (!el) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }

            const p = s.scrollProgress; // 0 = hero, 1 = floating

            // ─── Scale ───
            // Hero: 1.0, Floating: 0.55
            const scale = 1.0 - p * 0.45;

            // ─── Position ───
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Hero position: find the exact center of the orbital system element
            const orbitalEl = document.getElementById("orbital-system");
            let heroX: number, heroY: number;
            if (orbitalEl) {
                const orbRect = orbitalEl.getBoundingClientRect();
                heroX = orbRect.left + orbRect.width / 2;
                heroY = orbRect.top + orbRect.height / 2;
            } else {
                // Fallback if element not found
                heroX = vw * 0.75;
                heroY = vh * 0.45;
            }

            // Floating position: far right, 45% down viewport
            const floatX = vw - 140;
            const floatY = vh * 0.45;

            // Interpolate
            const baseX = heroX + p * (floatX - heroX);
            const baseY = heroY + p * (floatY - heroY);

            // ─── Mouse avoidance (shy behavior) ───
            const dx = s.mouseX - baseX;
            const dy = s.mouseY - baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const avoidRadius = 180;
            const pushStrength = 100 * p; // Only avoid when floating

            if (dist < avoidRadius && dist > 0 && p > 0.3) {
                const force = (1 - dist / avoidRadius) * pushStrength;
                const angle = Math.atan2(dy, dx);
                s.pushX += (-Math.cos(angle) * force - s.pushX) * 0.06;
                s.pushY += (-Math.sin(angle) * force - s.pushY) * 0.06;
            } else {
                s.pushX *= 0.93;
                s.pushY *= 0.93;
            }

            if (Math.abs(s.pushX) < 0.1) s.pushX = 0;
            if (Math.abs(s.pushY) < 0.1) s.pushY = 0;

            // ─── Flee decay ───
            s.fleeX *= 0.94;
            s.fleeY *= 0.94;
            if (Math.abs(s.fleeX) < 0.2) s.fleeX = 0;
            if (Math.abs(s.fleeY) < 0.2) s.fleeY = 0;

            // ─── Floating bob + sway (only when floating) ───
            s.bobPhase += 0.02;
            const bob = Math.sin(s.bobPhase) * 8 * p;
            const sway = Math.sin(s.bobPhase * 0.7) * 4 * p;

            // ─── Scroll velocity tilt ───
            s.tiltX += (-s.scrollVelocity * 0.3 - s.tiltX) * 0.05;
            s.tiltX = Math.max(-15, Math.min(15, s.tiltX));
            s.scrollVelocity *= 0.95;

            const totalX = baseX + sway + s.pushX + s.fleeX;
            const totalY = baseY + bob + s.pushY + s.fleeY;
            const rotation = s.tiltX * 0.3 * p;

            // Clamp to viewport
            const clampedX = Math.max(60, Math.min(vw - 60, totalX));
            const clampedY = Math.max(60, Math.min(vh - 60, totalY));

            el.style.left = `${clampedX}px`;
            el.style.top = `${clampedY}px`;
            el.style.transform =
                `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
            el.style.opacity = "1";

            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="hidden lg:block"
            onClick={handleClick}
            style={{
                position: "fixed",
                left: "70%",
                top: "45%",
                zIndex: 30,
                cursor: "pointer",
                willChange: "transform",
                transformOrigin: "center center",
                opacity: 0, // starts invisible, animate sets it to 1
            }}
        >
            {/* The mascot video */}
            <div style={{
                width: 280,
                height: 340,
                filter: isDark
                    ? "drop-shadow(0 0 30px rgba(79,70,229,0.35)) drop-shadow(0 16px 24px rgba(0,0,0,0.4))"
                    : "drop-shadow(0 0 25px rgba(55,48,163,0.2)) drop-shadow(0 12px 20px rgba(13,11,26,0.12))",
                transition: "filter 0.3s ease",
            }}>
                <GreenScreenVideo
                    src="/video/5f8ac36069c54ea2a81c2b9ba67c8fb5.mp4"
                    className="w-full h-full"
                    keyColor={[0.0, 0.85, 0.0]}
                    similarity={0.35}
                    smoothness={0.12}
                    spill={0.6}
                    maxTilt={6}
                />
            </div>

            {/* Speech bubble on click */}
            {showMessage && (
                <div style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "10px 16px",
                    borderRadius: 14,
                    marginBottom: 10,
                    background: isDark ? "#F59E0B" : "#D97706",
                    color: isDark ? "#050508" : "#F5F0E8",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    animation: "mascot-bubble 0.25s ease-out forwards",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    zIndex: 40,
                }}>
                    {message}
                    <div style={{
                        position: "absolute",
                        bottom: -7,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "7px solid transparent",
                        borderRight: "7px solid transparent",
                        borderTop: `7px solid ${isDark ? "#F59E0B" : "#D97706"}`,
                    }} />
                </div>
            )}

            {/* Hover hint — subtle tooltip when mouse is nearby */}
            <style>{`
        @keyframes mascot-bubble {
          from { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.9); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
});

export default FloatingMascot;
