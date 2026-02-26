import { useEffect, useRef } from "react";

export default function MouseFollower() {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const trailRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const outer = outerRef.current;
        const inner = innerRef.current;
        if (!outer || !inner) return;

        let mouseX = -100;
        let mouseY = -100;
        let outerX = -100;
        let outerY = -100;
        let isHovering = false;

        const trails = trailRefs.current;
        const trailPositions = trails.map(() => ({ x: -100, y: -100 }));

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instantly position the inner dot
            inner.style.left = `${mouseX}px`;
            inner.style.top = `${mouseY}px`;
        };

        const handleMouseDown = () => {
            outer.style.transform = "translate(-50%, -50%) scale(0.7)";
            inner.style.transform = "translate(-50%, -50%) scale(1.5)";
        };

        const handleMouseUp = () => {
            outer.style.transform = isHovering
                ? "translate(-50%, -50%) scale(1.8)"
                : "translate(-50%, -50%) scale(1)";
            inner.style.transform = "translate(-50%, -50%) scale(1)";
        };

        // Detect hovering over interactive elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest("a, button, input, textarea, select, [role='button']")
            ) {
                isHovering = true;
                outer.style.transform = "translate(-50%, -50%) scale(1.8)";
                outer.style.borderColor = "rgba(59, 130, 246, 0.6)";
                outer.style.background = "rgba(59, 130, 246, 0.06)";
                inner.style.background = "rgba(59, 130, 246, 0.9)";
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.closest("a, button, input, textarea, select, [role='button']")
            ) {
                isHovering = false;
                outer.style.transform = "translate(-50%, -50%) scale(1)";
                outer.style.borderColor = "rgba(99, 102, 241, 0.5)";
                outer.style.background = "transparent";
                inner.style.background = "rgba(99, 102, 241, 0.9)";
            }
        };

        const animate = () => {
            // Smooth follow for outer ring
            outerX += (mouseX - outerX) * 0.12;
            outerY += (mouseY - outerY) * 0.12;
            outer.style.left = `${outerX}px`;
            outer.style.top = `${outerY}px`;

            // Trail dots follow with increasing lag
            for (let i = 0; i < trails.length; i++) {
                const prev = i === 0 ? { x: mouseX, y: mouseY } : trailPositions[i - 1];
                trailPositions[i].x += (prev.x - trailPositions[i].x) * (0.2 - i * 0.03);
                trailPositions[i].y += (prev.y - trailPositions[i].y) * (0.2 - i * 0.03);
                trails[i].style.left = `${trailPositions[i].x}px`;
                trails[i].style.top = `${trailPositions[i].y}px`;
            }

            requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
            cancelAnimationFrame(animId);
        };
    }, []);

    // Hide on touch-only devices
    const isTouchOnly =
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches &&
        !window.matchMedia("(pointer: fine)").matches;

    if (isTouchOnly) return null;

    return (
        <>
            {/* Trail dots */}
            {[0, 1, 2, 3, 4].map((i) => (
                <div
                    key={`trail-${i}`}
                    ref={(el) => {
                        if (el) trailRefs.current[i] = el;
                    }}
                    style={{
                        position: "fixed",
                        width: `${4 - i * 0.5}px`,
                        height: `${4 - i * 0.5}px`,
                        borderRadius: "50%",
                        background: `rgba(99, 102, 241, ${0.4 - i * 0.07})`,
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        zIndex: 9997,
                        transition: "background 0.3s ease",
                    }}
                />
            ))}

            {/* Outer ring – follows with lag */}
            <div
                ref={outerRef}
                style={{
                    position: "fixed",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(99, 102, 241, 0.5)",
                    background: "transparent",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 9998,
                    transition:
                        "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.15s ease",
                    mixBlendMode: "difference" as const,
                }}
            />

            {/* Inner dot – instant */}
            <div
                ref={innerRef}
                style={{
                    position: "fixed",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.9)",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 9999,
                    transition: "background 0.3s ease, transform 0.15s ease",
                }}
            />
        </>
    );
}
