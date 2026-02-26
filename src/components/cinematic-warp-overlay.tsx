import { useEffect, useRef } from "react";
import * as THREE from "three";

type CinematicWarpOverlayProps = {
  progress: number;
  active: boolean;
  zIndex?: number;
};

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  vec2 p = uv - center;
  float dist = length(p);

  float barrel = 0.18 * uProgress;
  vec2 warped = uv + p * dist * barrel;

  float ripple = sin(26.0 * dist - uTime * 4.2) * 0.012 * uProgress;
  warped += normalize(p + 1e-6) * ripple;

  float grain = noise(warped * uResolution.xy * 0.004 + uTime * 0.4) - 0.5;

  float ca = 0.010 * uProgress;
  vec2 dir = normalize(p + 1e-6);
  float r = smoothstep(0.75, 0.02, length((warped + dir * ca) - center));
  float g = smoothstep(0.75, 0.02, length(warped - center));
  float b = smoothstep(0.75, 0.02, length((warped - dir * ca) - center));
  vec3 chroma = vec3(r, g, b);

  float ring = exp(-32.0 * abs(dist - (0.22 + 0.25 * uProgress)));
  vec3 portal = vec3(0.58, 0.42, 1.0) * ring * (0.6 + 0.4 * sin(uTime * 2.8));

  vec3 color = chroma * 0.16 * uProgress + portal + grain * 0.10 * uProgress;
  float alpha = clamp(uProgress * 0.72, 0.0, 0.82);

  gl_FragColor = vec4(color, alpha);
}
`;

export default function CinematicWarpOverlay({
  progress,
  active,
  zIndex = 9996,
}: CinematicWarpOverlayProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const uniformsRef = useRef<{
    uResolution: { value: any };
    uTime: { value: number };
    uProgress: { value: number };
  } | null>(null);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(active);
  const progressRef = useRef(progress);
  const startRef = useRef(performance.now());

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    progressRef.current = progress;
    if (uniformsRef.current) {
      uniformsRef.current.uProgress.value = progress;
    }
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0 },
      uProgress: { value: progressRef.current },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const render = () => {
      const now = performance.now();
      uniforms.uTime.value = (now - startRef.current) / 1000;
      uniforms.uProgress.value = progressRef.current;

      if (activeRef.current || progressRef.current > 0.001) {
        renderer.render(scene, camera);
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
      uniformsRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: "none",
        opacity: active || progress > 0.001 ? 1 : 0,
        transition: "opacity 180ms ease",
      }}
    />
  );
}
