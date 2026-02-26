import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import GreenScreenVideo from "@/components/green-screen-video";

interface StartupLoaderProps {
  visible: boolean;
  onFinish: () => void;
}

function getViewportCenter() {
  if (typeof window === "undefined") return { x: 720, y: 420 };
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export default function StartupLoader({ visible, onFinish }: StartupLoaderProps) {
  const [phase, setPhase] = useState<"spin" | "fly">("spin");
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : true,
  );
  const [center, setCenter] = useState(getViewportCenter);
  const [target, setTarget] = useState<{ x: number; y: number }>(() => {
    if (typeof window === "undefined") return { x: 980, y: 420 };
    return { x: window.innerWidth * 0.76, y: window.innerHeight * 0.45 };
  });

  const mascotAnim = useMemo(() => {
    if (phase === "fly") {
      return {
        left: [center.x, target.x],
        top: [center.y, target.y],
        x: 0,
        y: 0,
        rotate: [300, 0],
        scale: [1, 0.86],
      };
    }

    return {
      left: center.x,
      top: center.y,
      x: 0,
      y: 0,
      rotate: [0, 160, 320],
      scale: [0.98, 1, 0.98],
    };
  }, [phase, center.x, center.y, target.x, target.y]);

  useEffect(() => {
    if (!visible) return;

    setPhase("spin");

    const syncTarget = () => {
      const orb = document.getElementById("orbital-system");
      if (orb) {
        const rect = orb.getBoundingClientRect();
        setTarget({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      } else {
        setTarget({ x: window.innerWidth * 0.76, y: window.innerHeight * 0.45 });
      }
    };

    syncTarget();
    const flyTimer = window.setTimeout(() => {
      syncTarget();
      setPhase("fly");
    }, 1150);
    const finishTimer = window.setTimeout(() => onFinish(), 2000);

    return () => {
      window.clearTimeout(flyTimer);
      window.clearTimeout(finishTimer);
    };
  }, [visible, onFinish]);

  useEffect(() => {
    const onResize = () => {
      const nextCenter = getViewportCenter();
      setCenter(nextCenter);
      if (phase !== "fly") {
        setTarget({ x: window.innerWidth * 0.76, y: window.innerHeight * 0.45 });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  useEffect(() => {
    const html = document.documentElement;
    const syncTheme = () => setIsDark(html.classList.contains("dark"));
    syncTheme();

    const obs = new MutationObserver(syncTheme);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 90% 60% at 55% 40%, rgba(79,70,229,0.14) 0%, rgba(5,5,8,1) 60%), #050508"
              : "radial-gradient(ellipse 80% 58% at 55% 42%, rgba(79,70,229,0.08) 0%, rgba(245,240,232,0.95) 62%), var(--li-bg)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[52vw] h-[52vw] max-w-[620px] max-h-[620px] rounded-full blur-[90px]"
              style={{ background: isDark ? "rgba(129,140,248,0.22)" : "rgba(79,70,229,0.12)" }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{
                left: center.x,
                top: center.y,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
              }}
              animate={mascotAnim}
              transition={
                phase === "fly"
                  ? { duration: 0.86, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 1.08, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                position: "absolute",
                left: center.x,
                top: center.y,
                width: 220,
                height: 268,
                marginLeft: -110,
                marginTop: -134,
                filter: "drop-shadow(0 0 28px rgba(129,140,248,0.45)) drop-shadow(0 10px 22px rgba(0,0,0,0.45))",
              }}
            >
              <GreenScreenVideo
                src="/video/5f8ac36069c54ea2a81c2b9ba67c8fb5.mp4"
                className="w-full h-full"
                keyColor={[0.0, 0.85, 0.0]}
                similarity={0.35}
                smoothness={0.12}
                spill={0.6}
                maxTilt={0}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
