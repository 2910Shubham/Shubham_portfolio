import { useEffect, useRef, useCallback } from "react";

/*
 * Ocean-Depth WebGL Background
 *
 * Scroll journey through the ocean:
 *   0.0 → Surface: bright turquoise, caustic light patterns, sun rays
 *   0.3 → Shallow reef: medium blue-green, softer caustics
 *   0.6 → Twilight zone: dark navy, fading light, sparse particles
 *   1.0 → Abyss: near-black, bioluminescent specks
 *
 * Micro-interactions:
 *   Mouse → underwater glow + current distortion
 *   Click → bubble burst ripple
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

  #define MAX_RIPPLES 5
  uniform vec3 u_ripples[MAX_RIPPLES];

  // ─── Noise utilities ───
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(41.1, 289.7))) * 18756.34);
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

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  // ─── Voronoi for caustic patterns ───
  float voronoi(vec2 p) {
    vec2 g = floor(p), f = fract(p);
    float d = 1.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y));
      vec2 r = o + hash(g + o) * 0.8 + 0.1 - f;
      d = min(d, dot(r, r));
    }
    return sqrt(d);
  }

  // ─── Caustic light pattern ───
  float caustic(vec2 p, float t) {
    float c1 = voronoi(p * 4.0 + vec2(t * 0.3, t * 0.2));
    float c2 = voronoi(p * 5.5 + vec2(-t * 0.15, t * 0.35));
    return pow(1.0 - c1, 2.0) * pow(1.0 - c2, 2.0) * 4.0;
  }

  // ─── Light rays from above ───
  float lightRays(vec2 uv, float t) {
    float rays = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float x = uv.x + sin(t * 0.2 + fi * 2.1) * 0.3;
      float ray = smoothstep(0.08, 0.0, abs(x - 0.3 - fi * 0.2));
      ray *= smoothstep(0.0, 0.8, uv.y); // stronger from top
      rays += ray * 0.15;
    }
    return rays;
  }

  // ─── Floating particles (bubbles / plankton) ───
  float particles(vec2 uv, float t, float density) {
    float p = 0.0;
    for (int i = 0; i < 15; i++) {
      float fi = float(i);
      vec2 pos = vec2(
        hash(vec2(fi, 0.0)),
        fract(hash(vec2(fi, 1.0)) + t * (0.02 + hash(vec2(fi, 2.0)) * 0.03))
      );
      float size = 0.002 + hash(vec2(fi, 3.0)) * 0.003;
      float d = distance(uv, pos);
      p += smoothstep(size, size * 0.3, d) * density;
    }
    return p;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);
    float t = u_time;
    float depth = u_scroll; // 0 = surface, 1 = abyss

    // ════════════════════════════════════════
    //  OCEAN DEPTH COLORS
    // ════════════════════════════════════════

    // Surface (0.0) → warm turquoise
    vec3 surfaceTop    = vec3(0.00, 0.55, 0.65);
    vec3 surfaceBottom = vec3(0.00, 0.35, 0.50);

    // Shallow (0.3) → medium ocean blue
    vec3 shallowTop    = vec3(0.00, 0.30, 0.50);
    vec3 shallowBottom = vec3(0.00, 0.18, 0.38);

    // Twilight (0.6) → dark navy
    vec3 twilightTop    = vec3(0.00, 0.10, 0.25);
    vec3 twilightBottom = vec3(0.00, 0.05, 0.15);

    // Abyss (1.0) → near-black
    vec3 abyssTop    = vec3(0.01, 0.02, 0.08);
    vec3 abyssBottom = vec3(0.00, 0.01, 0.04);

    // Blend zone colors based on depth
    vec3 topColor, bottomColor;
    if (depth < 0.33) {
      float t2 = depth / 0.33;
      topColor    = mix(surfaceTop, shallowTop, t2);
      bottomColor = mix(surfaceBottom, shallowBottom, t2);
    } else if (depth < 0.66) {
      float t2 = (depth - 0.33) / 0.33;
      topColor    = mix(shallowTop, twilightTop, t2);
      bottomColor = mix(shallowBottom, twilightBottom, t2);
    } else {
      float t2 = (depth - 0.66) / 0.34;
      topColor    = mix(twilightTop, abyssTop, t2);
      bottomColor = mix(twilightBottom, abyssBottom, t2);
    }

    vec3 color = mix(bottomColor, topColor, uv.y);

    // ════════════════════════════════════════
    //  CAUSTIC LIGHT (fades with depth)
    // ════════════════════════════════════════

    float causticIntensity = smoothstep(0.6, 0.0, depth);
    float caust = caustic(st, t);
    color += caust * causticIntensity * vec3(0.05, 0.12, 0.10);

    // ════════════════════════════════════════
    //  LIGHT RAYS (visible only near surface)
    // ════════════════════════════════════════

    float rayIntensity = smoothstep(0.4, 0.0, depth);
    float rays = lightRays(uv, t);
    color += rays * rayIntensity * vec3(0.15, 0.25, 0.20);

    // ════════════════════════════════════════
    //  UNDERWATER CURRENT (noise distortion)
    // ════════════════════════════════════════

    float currentNoise = fbm(st * 2.0 + vec2(t * 0.1, t * 0.05));
    color += currentNoise * 0.015 * (1.0 - depth * 0.5);

    // ════════════════════════════════════════
    //  PARTICLES — bubbles near surface, bioluminescence in deep
    // ════════════════════════════════════════

    // Bubbles (surface to mid)
    float bubbleDensity = smoothstep(0.7, 0.0, depth) * 0.6;
    float bubbles = particles(uv, t, bubbleDensity);
    color += bubbles * vec3(0.3, 0.5, 0.5);

    // Bioluminescence (deep only)
    float bioDepth = smoothstep(0.5, 0.9, depth);
    float biolum = particles(uv * 1.5 + 0.5, t * 0.5, bioDepth * 0.8);
    color += biolum * vec3(0.1, 0.4, 0.6);

    // Occasional bright bioluminescent flashes
    float flash = hash(floor(st * 20.0 + floor(t * 0.3)));
    flash = step(0.997, flash) * bioDepth;
    color += flash * vec3(0.0, 0.5, 0.8) * (sin(t * 3.0 + flash * 100.0) * 0.5 + 0.5);

    // ════════════════════════════════════════
    //  MOUSE — underwater glow
    // ════════════════════════════════════════

    vec2 mouseUV = vec2(u_mouse.x * aspect, u_mouse.y);
    float md = distance(st, mouseUV);
    float mouseGlow = smoothstep(0.5, 0.0, md);
    vec3 glowColor = mix(vec3(0.05, 0.15, 0.12), vec3(0.02, 0.08, 0.15), depth);
    color += mouseGlow * glowColor;

    // ════════════════════════════════════════
    //  CLICK RIPPLES — bubble burst rings
    // ════════════════════════════════════════

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
          color += ring * fade * vec3(0.08, 0.18, 0.22);

          // Inner bright bubble
          float inner = smoothstep(0.05, 0.0, abs(d - radius * 0.3)) * fade;
          color += inner * vec3(0.05, 0.12, 0.15) * 0.5;
        }
      }
    }

    // ════════════════════════════════════════
    //  LIGHT MODE — soft ocean tint
    // ════════════════════════════════════════

    if (u_isDark < 0.5) {
      // Light mode: subtle aqua-tinted white
      vec3 lightSurface = vec3(0.92, 0.97, 0.98);
      vec3 lightDeep = vec3(0.85, 0.92, 0.95);
      vec3 lightColor = mix(lightSurface, lightDeep, depth);

      // Add subtle caustic in light mode too
      lightColor += caust * 0.02 * causticIntensity;
      lightColor += currentNoise * 0.01;

      // Mouse glow
      lightColor += mouseGlow * 0.015;

      // Click ripples
      for (int i = 0; i < MAX_RIPPLES; i++) {
        vec3 rp2 = u_ripples[i];
        if (rp2.z > 0.0) {
          float age2 = t - rp2.z;
          if (age2 < 2.0) {
            vec2 rc2 = vec2(rp2.x * aspect, rp2.y);
            float d2 = distance(st, rc2);
            float r2 = age2 * 0.5;
            float ring2 = smoothstep(r2 - 0.04, r2, d2) *
                          smoothstep(r2 + 0.04, r2, d2);
            lightColor -= ring2 * (1.0 - age2 / 2.0) * 0.03;
          }
        }
      }

      gl_FragColor = vec4(lightColor, 1.0);
      return;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface WebGLBackgroundProps {
    isDark: boolean;
}

export default function WebGLBackground({ isDark }: WebGLBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({});
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const scrollRef = useRef(0);
    const ripplesRef = useRef<{ x: number; y: number; time: number }[]>([]);
    const startTimeRef = useRef(performance.now() / 1000);
    const rafRef = useRef(0);

    const initGL = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
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

        for (const n of ["u_resolution", "u_time", "u_mouse", "u_scroll", "u_isDark"])
            uniformsRef.current[n] = gl.getUniformLocation(prog, n);
        for (let i = 0; i < 5; i++)
            uniformsRef.current[`u_ripples[${i}]`] = gl.getUniformLocation(prog, `u_ripples[${i}]`);

        return true;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !initGL()) return;
        const gl = glRef.current!;
        const u = uniformsRef.current;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 1.5);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        const onMouse = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX / window.innerWidth;
            mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
        };
        window.addEventListener("mousemove", onMouse);

        const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
        const onScroll = () => { scrollRef.current = window.scrollY / (maxScroll() || 1); };
        window.addEventListener("scroll", onScroll, { passive: true });

        const onClick = (e: MouseEvent) => {
            const now = performance.now() / 1000 - startTimeRef.current;
            ripplesRef.current.push({
                x: e.clientX / window.innerWidth,
                y: 1.0 - e.clientY / window.innerHeight,
                time: now,
            });
            if (ripplesRef.current.length > 5) ripplesRef.current.shift();
        };
        window.addEventListener("click", onClick);

        const render = () => {
            const t = performance.now() / 1000 - startTimeRef.current;
            gl.uniform2f(u["u_resolution"]!, canvas.width, canvas.height);
            gl.uniform1f(u["u_time"]!, t);
            gl.uniform2f(u["u_mouse"]!, mouseRef.current.x, mouseRef.current.y);
            gl.uniform1f(u["u_scroll"]!, scrollRef.current);
            gl.uniform1f(u["u_isDark"]!, isDark ? 1.0 : 0.0);
            for (let i = 0; i < 5; i++) {
                const rp = ripplesRef.current[i];
                gl.uniform3f(u[`u_ripples[${i}]`]!, rp?.x ?? 0, rp?.y ?? 0, rp?.time ?? 0);
            }
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("click", onClick);
            cancelAnimationFrame(rafRef.current);
        };
    }, [initGL, isDark]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
        />
    );
}
