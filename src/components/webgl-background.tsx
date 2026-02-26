import { useEffect, useRef, useCallback } from "react";

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: [number, number, number];
    shape: number; // 0 = circle, 1 = dash, 2 = small dot
    angle: number;
    rotationSpeed: number;
}

interface WebGLBackgroundProps {
    isDark: boolean;
}

export default function WebGLBackground({ isDark }: WebGLBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const scrollRef = useRef(0);

    const createParticles = useCallback(
        (width: number, height: number) => {
            const particles: Particle[] = [];
            // Spread particles across 3x viewport height for scroll coverage
            const totalHeight = height * 3;
            const count = Math.min(Math.floor((width * height) / 3500), 400);

            // Color palettes for light and dark modes
            const darkColors: [number, number, number][] = [
                [108, 99, 255],   // Purple
                [0, 212, 255],    // Cyan
                [255, 107, 157],  // Pink
                [100, 100, 200],  // Muted blue
                [150, 140, 255],  // Light purple
                [80, 200, 220],   // Teal
            ];

            const lightColors: [number, number, number][] = [
                [59, 130, 246],   // Blue
                [99, 102, 241],   // Indigo
                [139, 92, 246],   // Violet
                [79, 70, 229],    // Dark indigo
                [37, 99, 235],    // Royal blue
                [96, 165, 250],   // Light blue
            ];

            const colors = isDark ? darkColors : lightColors;

            for (let i = 0; i < count; i++) {
                const x = Math.random() * width;
                const y = Math.random() * totalHeight;
                particles.push({
                    x,
                    y,
                    baseX: x,
                    baseY: y,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 4 + 1,
                    opacity: isDark
                        ? Math.random() * 0.5 + 0.1
                        : Math.random() * 0.35 + 0.08,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    shape: Math.floor(Math.random() * 3),
                    angle: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                });
            }
            return particles;
        },
        [isDark]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
            particlesRef.current = createParticles(
                window.innerWidth,
                window.innerHeight
            );
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouseRef.current.x = e.touches[0].clientX;
                mouseRef.current.y = e.touches[0].clientY;
            }
        };

        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("scroll", handleScroll);

        const animate = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);

            const mouse = mouseRef.current;
            const scroll = scrollRef.current;
            const interactionRadius = 180;
            const pushStrength = 50;

            particlesRef.current.forEach((p) => {
                // Calculate screen-space Y position
                const screenY = p.y - scroll;

                // Only render particles visible on screen (with margin)
                if (screenY < -100 || screenY > h + 100) return;

                // Mouse interaction — push particles away from cursor
                const dx = mouse.x - p.x;
                const dy = mouse.y - screenY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < interactionRadius && dist > 0) {
                    const force = (interactionRadius - dist) / interactionRadius;
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * force * pushStrength * 0.08;
                    p.y -= Math.sin(angle) * force * pushStrength * 0.08;
                }

                // Spring back to original position
                p.x += (p.baseX - p.x) * 0.02;
                p.y += (p.baseY - p.y) * 0.02;

                // Gentle floating motion
                p.x += p.vx;
                p.y += p.vy;
                p.baseX += Math.sin(Date.now() * 0.0005 + p.baseY * 0.01) * 0.1;

                // Rotation
                p.angle += p.rotationSpeed;

                // Dynamic opacity boost when near mouse
                let dynamicOpacity = p.opacity;
                if (dist < interactionRadius * 1.5) {
                    dynamicOpacity = Math.min(p.opacity + 0.3, 0.9);
                }

                // Draw particle
                ctx.save();
                ctx.translate(p.x, screenY);
                ctx.rotate(p.angle);
                ctx.globalAlpha = dynamicOpacity;

                const [r, g, b] = p.color;

                if (p.shape === 0) {
                    // Circle
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fill();

                    // Glow on hover
                    if (dist < interactionRadius) {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
                        ctx.fill();
                    }
                } else if (p.shape === 1) {
                    // Dash / line
                    ctx.beginPath();
                    ctx.moveTo(-p.size * 2, 0);
                    ctx.lineTo(p.size * 2, 0);
                    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.lineWidth = 1.5;
                    ctx.lineCap = "round";
                    ctx.stroke();
                } else {
                    // Small dot with ring
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fill();

                    if (dist < interactionRadius) {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                ctx.restore();
            });

            // Draw connection lines between nearby particles close to mouse
            if (mouse.x > 0 && mouse.y > 0) {
                const nearParticles = particlesRef.current.filter((p) => {
                    const screenY = p.y - scroll;
                    const dx2 = mouse.x - p.x;
                    const dy2 = mouse.y - screenY;
                    return Math.sqrt(dx2 * dx2 + dy2 * dy2) < interactionRadius * 1.2;
                });

                const lineColor = isDark
                    ? "108, 99, 255"
                    : "59, 130, 246";

                for (let i = 0; i < nearParticles.length; i++) {
                    for (let j = i + 1; j < nearParticles.length; j++) {
                        const a = nearParticles[i];
                        const b = nearParticles[j];
                        const ddx = a.x - b.x;
                        const screenYA = a.y - scroll;
                        const screenYB = b.y - scroll;
                        const ddy = screenYA - screenYB;
                        const d = Math.sqrt(ddx * ddx + ddy * ddy);

                        if (d < 120) {
                            ctx.beginPath();
                            ctx.moveTo(a.x, screenYA);
                            ctx.lineTo(b.x, screenYB);
                            ctx.strokeStyle = `rgba(${lineColor}, ${0.12 * (1 - d / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [createParticles, isDark]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
}
