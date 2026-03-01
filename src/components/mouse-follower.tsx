import { useEffect, useRef, useState } from "react";
import { useDeviceClass } from "@/hooks/useDeviceClass";

function spawnTapRipple(x: number, y: number) {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed;
    left: ${x}px; top: ${y}px;
    width: 0; height: 0;
    border-radius: 50%;
    border: 2px solid rgba(139, 92, 246, 0.6);
    transform: translate(-50%, -50%);
    animation: tapRipple 0.6s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

export default function MouseFollower() {
  const tier = useDeviceClass();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    setIsCoarsePointer(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (tier !== "low" || !isCoarsePointer) return;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      spawnTapRipple(t.clientX, t.clientY);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => window.removeEventListener("touchstart", onTouchStart);
  }, [tier, isCoarsePointer]);

  useEffect(() => {
    if (tier === "low" && isCoarsePointer) return;

    const outer = outerRef.current;
    if (!outer) return;
    const inner = innerRef.current;
    const trails = trailRefs.current;

    let mouseX = -100;
    let mouseY = -100;
    let outerX = -100;
    let outerY = -100;
    let isHovering = false;
    const showFullCursor = tier === "high";
    const trailPositions = trails.map(() => ({ x: -100, y: -100 }));
    let animId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (showFullCursor && inner) {
        inner.style.left = `${mouseX}px`;
        inner.style.top = `${mouseY}px`;
      }
    };

    const handleMouseDown = () => {
      outer.style.transform = "translate(-50%, -50%) scale(0.7)";
      if (showFullCursor && inner) {
        inner.style.transform = "translate(-50%, -50%) scale(1.5)";
      }
    };

    const handleMouseUp = () => {
      outer.style.transform = isHovering
        ? "translate(-50%, -50%) scale(1.8)"
        : "translate(-50%, -50%) scale(1)";
      if (showFullCursor && inner) {
        inner.style.transform = "translate(-50%, -50%) scale(1)";
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) {
        isHovering = true;
        outer.style.transform = "translate(-50%, -50%) scale(1.8)";
        outer.style.borderColor = "rgba(245, 158, 11, 0.6)";
        outer.style.background = "rgba(245, 158, 11, 0.06)";
        if (showFullCursor && inner) {
          inner.style.background = "rgba(245, 158, 11, 0.9)";
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) {
        isHovering = false;
        outer.style.transform = "translate(-50%, -50%) scale(1)";
        outer.style.borderColor = "rgba(240, 244, 255, 0.35)";
        outer.style.background = "transparent";
        if (showFullCursor && inner) {
          inner.style.background = "rgba(245, 158, 11, 0.9)";
        }
      }
    };

    const animate = () => {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      outer.style.left = `${outerX}px`;
      outer.style.top = `${outerY}px`;

      if (showFullCursor) {
        for (let i = 0; i < trails.length; i++) {
          const prev = i === 0 ? { x: mouseX, y: mouseY } : trailPositions[i - 1];
          trailPositions[i].x += (prev.x - trailPositions[i].x) * (0.2 - i * 0.03);
          trailPositions[i].y += (prev.y - trailPositions[i].y) * (0.2 - i * 0.03);
          trails[i].style.left = `${trailPositions[i].x}px`;
          trails[i].style.top = `${trailPositions[i].y}px`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, [tier, isCoarsePointer]);

  if (tier === "low" && isCoarsePointer) {
    return null;
  }

  const isHigh = tier === "high";

  return (
    <>
      {isHigh &&
        [0, 1, 2, 3, 4].map((i) => (
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
              background: `rgba(245, 158, 11, ${0.3 - i * 0.05})`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 9997,
              transition: "background 0.3s ease",
            }}
          />
        ))}

      <div
        ref={outerRef}
        style={{
          position: "fixed",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1.5px solid rgba(240, 244, 255, 0.35)",
          background: "transparent",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9998,
          transition:
            "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.15s ease",
          mixBlendMode: "difference" as const,
        }}
      />

      {isHigh && (
        <div
          ref={innerRef}
          style={{
            position: "fixed",
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "rgba(245, 158, 11, 0.9)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            transition: "background 0.3s ease, transform 0.15s ease",
          }}
        />
      )}
    </>
  );
}
