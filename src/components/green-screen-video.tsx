import { useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";

// ─── WebGL Chroma Key Shader ───
const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_video;
  uniform vec3 u_keyColor;
  uniform float u_similarity;
  uniform float u_smoothness;
  uniform float u_spill;

  // Convert RGB to YCbCr for better chroma keying
  vec2 rgbToCbCr(vec3 rgb) {
    float cb = 0.5 + (-0.168736 * rgb.r - 0.331264 * rgb.g + 0.5 * rgb.b);
    float cr = 0.5 + (0.5 * rgb.r - 0.418688 * rgb.g - 0.081312 * rgb.b);
    return vec2(cb, cr);
  }

  void main() {
    vec4 color = texture2D(u_video, v_texCoord);
    
    // Get CbCr for both pixel and key color
    vec2 pixelCbCr = rgbToCbCr(color.rgb);
    vec2 keyCbCr = rgbToCbCr(u_keyColor);
    
    // Calculate distance in CbCr space
    float dist = distance(pixelCbCr, keyCbCr);
    
    // Create alpha mask with smooth edges
    float alpha = smoothstep(u_similarity, u_similarity + u_smoothness, dist);
    
    // Spill suppression — reduce green channel bleed on edges
    float spillAmount = 1.0 - smoothstep(u_similarity * 0.8, u_similarity + u_smoothness * 1.5, dist);
    color.g = mix(color.g, min(color.r, color.b) * 0.8, spillAmount * u_spill);
    
    // Slight edge refinement: darken semi-transparent edges to avoid green fringing
    float edgeDarken = smoothstep(0.0, 0.15, alpha);
    color.rgb *= mix(0.85, 1.0, edgeDarken);
    
    gl_FragColor = vec4(color.rgb, alpha);
  }
`;

// ─── Smooth lerp helper ───
function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

interface GreenScreenVideoProps {
    src: string;
    className?: string;
    /** Green key color [r, g, b] in 0–1 range. Default: bright green [0.0, 1.0, 0.0] */
    keyColor?: [number, number, number];
    /** How close a colour must be to the key to be removed (0–1). Default: 0.35 */
    similarity?: number;
    /** Edge smoothness (0–1). Default: 0.12 */
    smoothness?: number;
    /** Spill suppression strength (0–1). Default: 0.6 */
    spill?: number;
    /** Max tilt angle in degrees. Default: 15 */
    maxTilt?: number;
}

const GreenScreenVideo = memo(function GreenScreenVideo({
    src,
    className = "",
    keyColor = [0.0, 0.85, 0.0],
    similarity = 0.35,
    smoothness = 0.12,
    spill = 0.6,
    maxTilt = 15,
}: GreenScreenVideoProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const textureRef = useRef<WebGLTexture | null>(null);
    const rafRef = useRef<number>(0);

    // ─── Cursor-follow 3D tilt state ───
    const tiltRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
    const tiltRafRef = useRef<number>(0);

    const initGL = useCallback(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const gl = canvas.getContext("webgl", {
            premultipliedAlpha: false,
            alpha: true,
        });
        if (!gl) {
            console.error("WebGL not available");
            return;
        }
        glRef.current = gl;

        // Compile shaders
        const vs = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vs, VERTEX_SHADER);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error("Vertex shader error:", gl.getShaderInfoLog(vs));
            return;
        }

        const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fs, FRAGMENT_SHADER);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            console.error("Fragment shader error:", gl.getShaderInfoLog(fs));
            return;
        }

        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }
        programRef.current = program;
        gl.useProgram(program);

        // ─── Geometry: full-screen quad ───
        const positions = new Float32Array([
            -1, -1, 1, -1, -1, 1,
            1, -1, 1, 1, -1, 1,
        ]);
        const texCoords = new Float32Array([
            0, 1, 1, 1, 0, 0,
            1, 1, 1, 0, 0, 0,
        ]);

        const posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        const aPosition = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const texBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
        const aTexCoord = gl.getAttribLocation(program, "a_texCoord");
        gl.enableVertexAttribArray(aTexCoord);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

        // ─── Texture ───
        const texture = gl.createTexture()!;
        textureRef.current = texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // ─── Uniforms ───
        gl.uniform1i(gl.getUniformLocation(program, "u_video"), 0);
        gl.uniform3f(gl.getUniformLocation(program, "u_keyColor"), ...keyColor);
        gl.uniform1f(gl.getUniformLocation(program, "u_similarity"), similarity);
        gl.uniform1f(gl.getUniformLocation(program, "u_smoothness"), smoothness);
        gl.uniform1f(gl.getUniformLocation(program, "u_spill"), spill);

        // Enable blending for transparent output
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }, [keyColor, similarity, smoothness, spill]);

    const render = useCallback(() => {
        const gl = glRef.current;
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!gl || !video || !canvas || video.paused || video.ended) {
            rafRef.current = requestAnimationFrame(render);
            return;
        }

        // Match canvas size to video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 480;
            canvas.height = video.videoHeight || 640;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        // Upload current video frame as texture
        gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

        // Clear & draw
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        rafRef.current = requestAnimationFrame(render);
    }, []);

    // ─── 3D Tilt Animation Loop (smooth lerp) ───
    const animateTilt = useCallback(() => {
        const t = tiltRef.current;
        const container = containerRef.current;
        if (!container) return;

        // Lerp toward target — 0.08 gives a smooth, springy feel
        t.currentX = lerp(t.currentX, t.targetX, 0.08);
        t.currentY = lerp(t.currentY, t.targetY, 0.08);

        container.style.transform =
            `perspective(800px) rotateY(${t.currentX}deg) rotateX(${t.currentY}deg)`;

        tiltRafRef.current = requestAnimationFrame(animateTilt);
    }, []);

    // ─── Global mouse tracking for tilt ───
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalise mouse offset from element center (-1 to 1)
            const offsetX = (e.clientX - centerX) / (rect.width / 2);
            const offsetY = (e.clientY - centerY) / (rect.height / 2);

            // Clamp and set target tilt angles
            tiltRef.current.targetX = Math.max(-1, Math.min(1, offsetX)) * maxTilt;
            tiltRef.current.targetY = Math.max(-1, Math.min(1, -offsetY)) * maxTilt; // inverted Y for natural feel
        };

        const handleMouseLeave = () => {
            // Smoothly return to neutral when cursor leaves the window
            tiltRef.current.targetX = 0;
            tiltRef.current.targetY = 0;
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);

        // Start tilt animation loop
        tiltRafRef.current = requestAnimationFrame(animateTilt);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(tiltRafRef.current);
        };
    }, [maxTilt, animateTilt]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleCanPlay = () => {
            initGL();
            video.play().catch(() => { });
            rafRef.current = requestAnimationFrame(render);
        };

        video.addEventListener("canplay", handleCanPlay);

        // If video is already ready (cached)
        if (video.readyState >= 3) {
            handleCanPlay();
        }

        return () => {
            video.removeEventListener("canplay", handleCanPlay);
            cancelAnimationFrame(rafRef.current);
        };
    }, [initGL, render]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className={`relative ${className}`}
            style={{ perspective: "800px" }}
        >
            {/* Hidden video element — source for WebGL */}
            <video
                ref={videoRef}
                src={src}
                crossOrigin="anonymous"
                loop
                muted
                playsInline
                autoPlay
                style={{ display: "none" }}
            />

            {/* 3D tilt container — this element rotates toward the cursor */}
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    transition: "none",
                }}
            >
                {/* WebGL chroma-keyed output */}
                <canvas
                    ref={canvasRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        background: "transparent",
                    }}
                />
            </div>

            {/* Subtle glow behind the person */}
            <div
                className="absolute inset-0 -z-10 blur-3xl opacity-30"
                style={{
                    background:
                        "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)",
                }}
            />
        </motion.div>
    );
});

export default GreenScreenVideo;
