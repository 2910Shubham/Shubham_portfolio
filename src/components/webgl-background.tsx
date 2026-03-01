import { useEffect, useRef, useCallback, useMemo } from "react";
import { useDeviceClass } from "@/hooks/useDeviceClass";

/*
 * Ocean-Depth WebGL Background
 *
 * Micro-interactions:
 *   Mouse/Touch drag -> underwater glow + current distortion
 *   Click/Tap -> bubble burst ripple
 */

const VERT = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;

  uniform vec2  u_resolution;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_scroll;
  uniform float u_isDark;
  uniform float u_quality;

  #define MAX_RIPPLES 5
  uniform vec3 u_ripples[MAX_RIPPLES];

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1, 0)), f.x),
      mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x),
      f.y
    );
  }

  float fbmAdaptive(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for(int i = 0; i < 6; i++) {
      if(float(i) < (u_quality >= 1.0 ? 6.0 : u_quality >= 0.6 ? 4.0 : 2.0)) {
        val += amp * noise(p * freq);
        p = rot * p;
        freq *= 2.0;
        amp *= 0.5;
      }
    }
    return val;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);
    float t = u_time;

    vec3 voidBlack = vec3(0.02, 0.02, 0.03);
    vec3 color = voidBlack;

    vec2 mouseUV = vec2(u_mouse.x * aspect, u_mouse.y);
    float md = distance(st, mouseUV);
    vec2 warp = st;
    float warpStr = smoothstep(0.4, 0.0, md) * 0.15;
    warp += normalize(st - mouseUV + 0.001) * warpStr;

    float n1 = fbmAdaptive(warp * 2.0 + vec2(t * 0.05, t * 0.03));
    vec3 purple = vec3(0.18, 0.10, 0.55);
    color += purple * n1 * 0.45;

    float n2 = fbmAdaptive(warp * 3.5 + vec2(-t * 0.07, t * 0.04));
    vec3 indigo = vec3(0.31, 0.28, 0.90);
    color += indigo * n2 * 0.25;

    float n3 = fbmAdaptive(warp * 4.0 + vec2(t * 0.03, -t * 0.06));
    float goldMask = smoothstep(0.72, 0.85, n3);
    vec3 gold = vec3(0.96, 0.62, 0.04);
    color += gold * goldMask * 0.35;

    float mouseGlow = smoothstep(0.5, 0.0, md);
    color += vec3(0.15, 0.12, 0.35) * mouseGlow * 0.4;

    for (int i = 0; i < MAX_RIPPLES; i++) {
      vec3 rp = u_ripples[i];
      if (rp.z > 0.0) {
        float age = t - rp.z;
        if (age < 3.0) {
          vec2 rc = vec2(rp.x * aspect, rp.y);
          float d = distance(st, rc);
          float radius = age * 0.5;
          float ring = smoothstep(radius - 0.04, radius, d) *
                       smoothstep(radius + 0.04, radius, d);
          float fade = 1.0 - age / 3.0;
          color += ring * fade * vec3(0.20, 0.15, 0.50);
        }
      }
    }

    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      vec2 pos = vec2(
        hash(vec2(fi, 0.0)),
        fract(hash(vec2(fi, 1.0)) + t * (0.01 + hash(vec2(fi, 2.0)) * 0.015))
      );
      float size = 0.001 + hash(vec2(fi, 3.0)) * 0.002;
      float d = distance(uv, pos);
      float p = smoothstep(size, size * 0.2, d) * 0.4;
      vec3 pColor = mod(fi, 3.0) < 1.0 ? vec3(0.50, 0.45, 0.90) : vec3(0.96, 0.62, 0.04);
      color += p * pColor;
    }

    float vignette = smoothstep(0.0, 0.7, distance(uv, vec2(0.5)));
    color *= 1.0 - vignette * 0.4;

    if (u_isDark < 0.5) {
      vec3 lightBase = vec3(0.94, 0.93, 0.97);
      lightBase -= n1 * 0.02 * vec3(0.01, 0.02, 0.05);
      lightBase += n3 * goldMask * 0.015 * gold;
      lightBase += mouseGlow * 0.01;
      lightBase *= 1.0 - vignette * 0.08;
      gl_FragColor = vec4(lightBase, 1.0);
      return;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface WebGLBackgroundProps {
  isDark: boolean;
}

type QualitySettings = {
  quality: number;
  pixelRatio: number;
  rippleSlots: number;
  frameSkip: number;
  uniformThrottle: number;
};

type WebGLMetrics = {
  deviceTier: "low" | "mid" | "high";
  isRAFRunning: boolean;
  isTabVisible: boolean;
  frameCount: number;
  currentQuality: number;
  pixelRatio: number;
  skippedFrames: number;
};

export default function WebGLBackground({ isDark }: WebGLBackgroundProps) {
  const tier = useDeviceClass();
  const qualitySettings = useMemo<QualitySettings>(() => {
    if (tier === "low") {
      return { quality: 0.3, pixelRatio: 0.75, rippleSlots: 2, frameSkip: 2, uniformThrottle: 48 };
    }
    if (tier === "mid") {
      return { quality: 0.6, pixelRatio: 1.0, rippleSlots: 3, frameSkip: 1, uniformThrottle: 32 };
    }
    return { quality: 1.0, pixelRatio: 1.5, rippleSlots: 5, frameSkip: 1, uniformThrottle: 16 };
  }, [tier]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const ripplesRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const startTimeRef = useRef(performance.now() / 1000);
  const rafRef = useRef(0);
  const lastUniformUpdateRef = useRef(0);
  const toneModuleRef = useRef<any>(null);
  const boomPlayerRef = useRef<any>(null);
  const boomBusRef = useRef<any>(null);
  const boomReadyRef = useRef(false);
  const lastBoomAtRef = useRef(0);
  const frameCountRef = useRef(0);
  const skippedFramesRef = useRef(0);
  const isTabVisibleRef = useRef(true);
  const isRAFRunningRef = useRef(false);
  const pixelRatioRef = useRef(0);
  const qualityRef = useRef(qualitySettings.quality);

  const updateMetrics = useCallback(() => {
    if (typeof window === "undefined") return;
    (
      window as Window & {
        __webglMetrics?: WebGLMetrics;
      }
    ).__webglMetrics = {
      deviceTier: tier,
      isRAFRunning: isRAFRunningRef.current,
      isTabVisible: isTabVisibleRef.current,
      frameCount: frameCountRef.current,
      currentQuality: qualityRef.current,
      pixelRatio: pixelRatioRef.current,
      skippedFrames: skippedFramesRef.current,
    };
  }, [tier]);

  useEffect(() => {
    let disposed = false;

    const setupBoom = async () => {
      try {
        const Tone = await import("tone");
        if (disposed) return;

        const filter = new Tone.Filter(1800, "lowpass");
        const compressor = new Tone.Compressor(-22, 3);
        const limiter = new Tone.Limiter(-1);
        const gain = new Tone.Gain(0.0);

        filter.connect(compressor);
        compressor.connect(limiter);
        limiter.connect(gain);
        gain.toDestination();

        const player = new Tone.Player({
          url: encodeURI("/video/Boom 1.mp3"),
          autostart: false,
          fadeIn: 0.01,
          fadeOut: 0.28,
        }).connect(filter);

        toneModuleRef.current = Tone;
        boomBusRef.current = { filter, compressor, limiter, gain };
        boomPlayerRef.current = player;
        boomReadyRef.current = true;
      } catch (error) {
        console.warn("Boom sound init failed:", error);
      }
    };

    setupBoom();

    return () => {
      disposed = true;
      boomReadyRef.current = false;

      try { boomPlayerRef.current?.dispose?.(); } catch {}
      boomPlayerRef.current = null;

      const bus = boomBusRef.current;
      if (bus) {
        try { bus.filter?.dispose?.(); } catch {}
        try { bus.compressor?.dispose?.(); } catch {}
        try { bus.limiter?.dispose?.(); } catch {}
        try { bus.gain?.dispose?.(); } catch {}
      }

      boomBusRef.current = null;
      toneModuleRef.current = null;
    };
  }, []);

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const gl = (canvas.getContext("webgl", { alpha: false, antialias: false }) ||
      canvas.getContext("experimental-webgl", { alpha: false, antialias: false })) as
      | WebGLRenderingContext
      | null;
    if (!gl) return false;
    glRef.current = gl;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("Ocean frag:", gl.getShaderInfoLog(fs));
      return false;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Ocean link:", gl.getProgramInfoLog(prog));
      return false;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    for (const n of ["u_resolution", "u_time", "u_mouse", "u_scroll", "u_isDark", "u_quality"]) {
      uniformsRef.current[n] = gl.getUniformLocation(prog, n);
    }
    for (let i = 0; i < 5; i++) {
      uniformsRef.current[`u_ripples[${i}]`] = gl.getUniformLocation(prog, `u_ripples[${i}]`);
    }

    return true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { quality, pixelRatio, rippleSlots, frameSkip, uniformThrottle } = qualitySettings;
    const qualityValue = quality;
    let currentDpr = tier === "low" ? pixelRatio : Math.min(window.devicePixelRatio, pixelRatio);
    qualityRef.current = qualityValue;
    pixelRatioRef.current = currentDpr;

    // Initialize metrics — no NODE_ENV guard, always set
    (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics = {
      deviceTier: "high",
      isRAFRunning: false,
      isTabVisible: true,
      frameCount: 0,
      currentQuality: 0,
      pixelRatio: 0,
      skippedFrames: 0,
    };
    if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
      (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.deviceTier = tier;
      (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.currentQuality = qualityValue;
      (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.pixelRatio = currentDpr;
    }

    const hasGL = initGL();
    if (!hasGL) {
      const resize = () => {
        currentDpr = tier === "low" ? pixelRatio : Math.min(window.devicePixelRatio, pixelRatio);
        pixelRatioRef.current = currentDpr;
        canvas.width = window.innerWidth * currentDpr;
        canvas.height = window.innerHeight * currentDpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.deviceTier = tier;
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.currentQuality = qualityValue;
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.pixelRatio = currentDpr;
        }
        updateMetrics();
      };
      resize();
      window.addEventListener("resize", resize);

      const onMouse = (e: MouseEvent) => {
        mouseRef.current.x = e.clientX / window.innerWidth;
        mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
      };
      window.addEventListener("mousemove", onMouse);

      const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
      const onScroll = () => {
        scrollRef.current = window.scrollY / (maxScroll() || 1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const onClick = (e: MouseEvent) => {
        const now = performance.now() / 1000 - startTimeRef.current;
        ripplesRef.current.push({
          x: e.clientX / window.innerWidth,
          y: 1.0 - e.clientY / window.innerHeight,
          time: now,
        });
        if (ripplesRef.current.length > rippleSlots) ripplesRef.current.shift();
      };
      window.addEventListener("click", onClick);

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        e.preventDefault();
        const t = e.touches[0];
        mouseRef.current.x = t.clientX / canvas.width;
        mouseRef.current.y = 1.0 - t.clientY / canvas.height;
      };
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 0) return;
        const t = e.touches[0];
        const now = performance.now() / 1000 - startTimeRef.current;
        ripplesRef.current.push({
          x: t.clientX / window.innerWidth,
          y: 1.0 - t.clientY / window.innerHeight,
          time: now,
        });
        if (ripplesRef.current.length > rippleSlots) ripplesRef.current.shift();
      };
      canvas.addEventListener("touchmove", onTouchMove, { passive: false });
      canvas.addEventListener("touchstart", onTouchStart, { passive: true });

      let loopFrameCount = 0;
      const render = () => {
        frameCountRef.current += 1;
        if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isRAFRunning = true;
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.frameCount += 1;
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isTabVisible = !document.hidden;
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.currentQuality = qualityValue;
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.pixelRatio = currentDpr;
        }
        loopFrameCount += 1;
        if (frameSkip > 1 && loopFrameCount % frameSkip !== 0) {
          skippedFramesRef.current += 1;
          if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
            (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.skippedFrames += 1;
          }
          updateMetrics();
          rafRef.current = requestAnimationFrame(render);
          return;
        }
        updateMetrics();
        rafRef.current = requestAnimationFrame(render);
      };

      const startRenderLoop = () => {
        if (rafRef.current !== 0) return;
        isRAFRunningRef.current = true;
        updateMetrics();
        rafRef.current = requestAnimationFrame(render);
      };
      const stopRenderLoop = () => {
        if (rafRef.current === 0) return;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        isRAFRunningRef.current = false;
        updateMetrics();
      };
      const onVisibilityChange = () => {
        isTabVisibleRef.current = !document.hidden;
        if (document.hidden) {
          if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
            (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isRAFRunning = false;
            (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isTabVisible = false;
          }
          stopRenderLoop();
        } else {
          startRenderLoop();
        }
        updateMetrics();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);
      isTabVisibleRef.current = !document.hidden;
      updateMetrics();
      startRenderLoop();

      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("click", onClick);
        canvas.removeEventListener("touchmove", onTouchMove);
        canvas.removeEventListener("touchstart", onTouchStart);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        stopRenderLoop();
        if (typeof window !== "undefined") {
          delete (window as Window & { __webglMetrics?: unknown }).__webglMetrics;
        }
      };
    }

    const gl = glRef.current!;
    const u = uniformsRef.current;

    const updateMouseUniform = (force = false) => {
      const now = performance.now();
      if (!force && now - lastUniformUpdateRef.current < uniformThrottle) return;
      gl.uniform2f(u["u_mouse"]!, mouseRef.current.x, mouseRef.current.y);
      lastUniformUpdateRef.current = now;
    };

    const triggerRipple = (clientX: number, clientY: number) => {
      const now = performance.now() / 1000 - startTimeRef.current;
      ripplesRef.current.push({
        x: clientX / window.innerWidth,
        y: 1.0 - clientY / window.innerHeight,
        time: now,
      });
      if (ripplesRef.current.length > rippleSlots) ripplesRef.current.shift();
    };

    const resize = () => {
      currentDpr = tier === "low" ? pixelRatio : Math.min(window.devicePixelRatio, pixelRatio);
      pixelRatioRef.current = currentDpr;
      canvas.width = window.innerWidth * currentDpr;
      canvas.height = window.innerHeight * currentDpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.deviceTier = tier;
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.currentQuality = qualityValue;
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.pixelRatio = currentDpr;
      }
      updateMetrics();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
      updateMouseUniform();
    };
    window.addEventListener("mousemove", onMouse);

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
    const onScroll = () => { scrollRef.current = window.scrollY / (maxScroll() || 1); };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onClick = (e: MouseEvent) => {
      triggerRipple(e.clientX, e.clientY);

      if (!isDark || !boomReadyRef.current) return;

      const clickMs = performance.now();
      if (clickMs - lastBoomAtRef.current < 80) return;
      lastBoomAtRef.current = clickMs;

      const Tone = toneModuleRef.current;
      const bus = boomBusRef.current;
      const player = boomPlayerRef.current;
      if (!Tone || !bus?.gain || !player) return;

      void Tone.start()
        .then(() => {
          const startAt = Tone.now();
          const peakGain = 0.42;
          const tailGain = 0.22;
          const nextVolumeDb = -17 + Math.random() * 2;

          player.playbackRate = 0.96 + Math.random() * 0.05;
          player.volume.rampTo(nextVolumeDb, 0.04);

          bus.gain.gain.cancelAndHoldAtTime(startAt);
          bus.gain.gain.setValueAtTime(0.0, startAt);
          bus.gain.gain.linearRampToValueAtTime(peakGain, startAt + 0.03);
          bus.gain.gain.exponentialRampToValueAtTime(tailGain, startAt + 0.28);

          player.stop(startAt);
          player.start(startAt + 0.005);
        })
        .catch(() => {
          // Ignore gesture/init races.
        });
    };
    window.addEventListener("click", onClick);

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      const t = e.touches[0];
      mouseRef.current.x = t.clientX / canvas.width;
      mouseRef.current.y = 1.0 - t.clientY / canvas.height;
      updateMouseUniform();
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      triggerRipple(t.clientX, t.clientY);
    };
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });

    let loopFrameCount = 0;
    const render = (_timestamp: number) => {
      frameCountRef.current += 1;
      if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isRAFRunning = true;
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.frameCount += 1;
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isTabVisible = !document.hidden;
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.currentQuality = qualityValue;
        (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.pixelRatio = currentDpr;
      }
      loopFrameCount += 1;
      if (frameSkip > 1 && loopFrameCount % frameSkip !== 0) {
        skippedFramesRef.current += 1;
        if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.skippedFrames += 1;
        }
        updateMetrics();
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const t = performance.now() / 1000 - startTimeRef.current;
      gl.uniform2f(u["u_resolution"]!, canvas.width, canvas.height);
      gl.uniform1f(u["u_time"]!, t);
      gl.uniform1f(u["u_scroll"]!, scrollRef.current);
      gl.uniform1f(u["u_isDark"]!, isDark ? 1.0 : 0.0);
      gl.uniform1f(u["u_quality"]!, qualityValue);
      for (let i = 0; i < 5; i++) {
        if (i < rippleSlots) {
          const rp = ripplesRef.current[i];
          gl.uniform3f(u[`u_ripples[${i}]`]!, rp?.x ?? 0, rp?.y ?? 0, rp?.time ?? 0);
        } else {
          gl.uniform3f(u[`u_ripples[${i}]`]!, 0, 0, 0);
        }
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      updateMetrics();
      rafRef.current = requestAnimationFrame(render);
    };

    const startRenderLoop = () => {
      if (rafRef.current !== 0) return;
      isRAFRunningRef.current = true;
      updateMetrics();
      rafRef.current = requestAnimationFrame(render);
    };
    const stopRenderLoop = () => {
      if (rafRef.current === 0) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      isRAFRunningRef.current = false;
      updateMetrics();
    };
    const onVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (document.hidden) {
        if ((window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics) {
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isRAFRunning = false;
          (window as Window & { __webglMetrics?: WebGLMetrics }).__webglMetrics!.isTabVisible = false;
        }
        stopRenderLoop();
      } else {
        startRenderLoop();
      }
      updateMetrics();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    isTabVisibleRef.current = !document.hidden;
    updateMouseUniform(true);
    updateMetrics();
    startRenderLoop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopRenderLoop();
      if (typeof window !== "undefined") {
        delete (window as Window & { __webglMetrics?: unknown }).__webglMetrics;
      }
    };
  }, [initGL, isDark, qualitySettings, tier, updateMetrics]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 0,
        opacity: isDark ? 1 : 0.12,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
