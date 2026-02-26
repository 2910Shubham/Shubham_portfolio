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

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);
    float t = u_time;

    // ════════════════════════════════════════
    //  VOID BASE — #050508
    // ════════════════════════════════════════
    vec3 voidBlack = vec3(0.02, 0.02, 0.03);
    vec3 color = voidBlack;

    // ════════════════════════════════════════
    //  MOUSE WARP — cursor warps noise locally
    // ════════════════════════════════════════
    vec2 mouseUV = vec2(u_mouse.x * aspect, u_mouse.y);
    float md = distance(st, mouseUV);
    vec2 warp = st;
    float warpStr = smoothstep(0.4, 0.0, md) * 0.15;
    warp += normalize(st - mouseUV + 0.001) * warpStr;

    // ════════════════════════════════════════
    //  LAYER 1: Deep purple fluid blobs
    // ════════════════════════════════════════
    float n1 = fbm(warp * 2.0 + vec2(t * 0.05, t * 0.03));
    vec3 purple = vec3(0.18, 0.10, 0.55);
    color += purple * n1 * 0.45;

    // ════════════════════════════════════════
    //  LAYER 2: Electric indigo streaks
    // ════════════════════════════════════════
    float n2 = fbm(warp * 3.5 + vec2(-t * 0.07, t * 0.04));
    vec3 indigo = vec3(0.31, 0.28, 0.90);
    color += indigo * n2 * 0.25;

    // ════════════════════════════════════════
    //  LAYER 3: Sparse molten gold highlights
    // ════════════════════════════════════════
    float n3 = fbm(warp * 4.0 + vec2(t * 0.03, -t * 0.06));
    float goldMask = smoothstep(0.72, 0.85, n3);
    vec3 gold = vec3(0.96, 0.62, 0.04);
    color += gold * goldMask * 0.35;

    // ════════════════════════════════════════
    //  MOUSE GLOW — soft light around cursor
    // ════════════════════════════════════════
    float mouseGlow = smoothstep(0.5, 0.0, md);
    color += vec3(0.15, 0.12, 0.35) * mouseGlow * 0.4;

    // ════════════════════════════════════════
    //  CLICK RIPPLES
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
          color += ring * fade * vec3(0.20, 0.15, 0.50);
        }
      }
    }

    // ════════════════════════════════════════
    //  FLOATING PARTICLES (sparse)
    // ════════════════════════════════════════
    for (int i = 0; i < 12; i++) {
      float fi = float(i);
      vec2 pos = vec2(
        hash(vec2(fi, 0.0)),
        fract(hash(vec2(fi, 1.0)) + t * (0.01 + hash(vec2(fi, 2.0)) * 0.015))
      );
      float size = 0.001 + hash(vec2(fi, 3.0)) * 0.002;
      float d = distance(uv, pos);
      float p = smoothstep(size, size * 0.2, d) * 0.4;
      // Alternate between indigo and gold particles
      vec3 pColor = mod(fi, 3.0) < 1.0 ? vec3(0.50, 0.45, 0.90) : vec3(0.96, 0.62, 0.04);
      color += p * pColor;
    }

    // ════════════════════════════════════════
    //  VIGNETTE — darken edges 40%
    // ════════════════════════════════════════
    float vignette = smoothstep(0.0, 0.7, distance(uv, vec2(0.5)));
    color *= 1.0 - vignette * 0.4;

    // ════════════════════════════════════════
    //  LIGHT MODE — subtle indigo-tinted white
    // ════════════════════════════════════════
    if (u_isDark < 0.5) {
      vec3 lightBase = vec3(0.94, 0.93, 0.97);
      // Add very subtle fluid movement
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
