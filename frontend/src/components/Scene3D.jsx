import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// One continuous idea for the whole page, not seven different ones: a single
// sparse field of points extending back into deep space, with the camera
// slowly moving *forward through it* as the visitor scrolls. The hero's
// glowing core sits at the very front of that field and quietly becomes
// part of it as you scroll past — there's one throughline, not a slideshow
// of unrelated 3D "worlds." This is deliberately calm: the job of this
// layer is to give the page depth and a sense of motion, not to compete
// with the content sitting on top of it.
// ---------------------------------------------------------------------------

const FIELD_DEPTH = 40; // how far back the point field extends, in scene units
const POINT_COUNT_DESKTOP = 260;
const POINT_COUNT_COMPACT = 130;

function readThemeColor(name, fallback) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function useThemeColors() {
  const [colors, setColors] = useState(() => ({
    cyan: readThemeColor("--color-cyan", "#5EEAD4"),
    violet: readThemeColor("--color-violet", "#8B7FD1"),
  }));
  useEffect(() => {
    const update = () =>
      setColors({
        cyan: readThemeColor("--color-cyan", "#5EEAD4"),
        violet: readThemeColor("--color-violet", "#8B7FD1"),
      });
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return colors;
}

function useCompactViewport() {
  const [compact, setCompact] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

// Tracks overall scroll progress (0 → 1 across the whole document) and
// pointer position, in refs so the render loop never triggers a re-render.
function useScrollProgress() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.current = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
        ticking = false;
      });
    };
    const onPointer = (e) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { progress, pointer };
}

// A handful of the field's points are slightly larger and brighter —
// "waypoints" the camera passes, giving scroll a sense of progress without
// needing to swap the whole scene's geometry per section.
function PointField({ count, color, reduceMotion }) {
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const spread = 3.2 + t * 2.5; // widens slightly as it recedes, like a corridor
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * spread;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r * 0.6;
      pos[i * 3 + 2] = -t * FIELD_DEPTH;
      sz[i] = Math.random() < 0.08 ? 0.09 : 0.03; // rare brighter waypoints
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  const pointsRef = useRef();

  useFrame((state) => {
    if (!reduceMotion && pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.045} sizeAttenuation transparent opacity={0.55} depthWrite={false} toneMapped={false} />
    </points>
  );
}

// The hero's signature piece — present once, at the very start of the
// journey. As the visitor scrolls it recedes into the point field with
// everything else, rather than being swapped for a different metaphor.
function SignatureCore({ progress, pointer, colors, reduceMotion }) {
  const meshRef = useRef();
  const matRef = useRef();

  useFrame((state) => {
    const p = progress.current;
    const fadeOut = THREE.MathUtils.clamp(1 - p * 6, 0, 1); // fully gone by ~17% scroll
    if (meshRef.current) {
      meshRef.current.visible = fadeOut > 0.01;
      meshRef.current.rotation.x = reduceMotion ? 0.1 : Math.sin(state.clock.elapsedTime * 0.12) * 0.1 + pointer.current.y * 0.15;
      meshRef.current.rotation.y += reduceMotion ? 0 : 0.0015;
      meshRef.current.scale.setScalar(0.9 + fadeOut * 0.1);
    }
    if (matRef.current) {
      matRef.current.opacity = 0.9 * fadeOut;
      if (!reduceMotion) matRef.current.distort = 0.3 + Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    }
  });

  return (
    <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={reduceMotion ? 0 : 0.2} floatIntensity={reduceMotion ? 0 : 0.4}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          ref={matRef}
          color={colors.violet}
          emissive={colors.violet}
          emissiveIntensity={0.7}
          distort={0.3}
          speed={reduceMotion ? 0 : 1.6}
          roughness={0.25}
          metalness={0.25}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

function Journey({ reduceMotion, compact }) {
  const colors = useThemeColors();
  const { progress, pointer } = useScrollProgress();

  useFrame(({ camera }) => {
    const targetZ = 6 - progress.current * FIELD_DEPTH * 0.82;
    const targetX = reduceMotion ? 0 : pointer.current.x * 0.25;
    const targetY = reduceMotion ? 0 : pointer.current.y * 0.12;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.lookAt(0, 0, camera.position.z - 5);
  });

  return (
    <>
      <SignatureCore progress={progress} pointer={pointer} colors={colors} reduceMotion={reduceMotion} />
      <PointField count={compact ? POINT_COUNT_COMPACT : POINT_COUNT_DESKTOP} color={colors.cyan} reduceMotion={reduceMotion} />
    </>
  );
}

class CanvasBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Scene3D: falling back to static gradient after render error:", error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function StaticFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 opacity-20 blur-3xl"
      style={{ background: "radial-gradient(circle at 50% 20%, var(--color-violet) 0%, transparent 60%)" }}
    />
  );
}

export default function Scene3D() {
  const reduceMotion = useReducedMotion();
  const compact = useCompactViewport();

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <CanvasBoundary fallback={<StaticFallback />}>
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={compact ? 1 : [1, 1.5]} frameloop={reduceMotion ? "demand" : "always"}>
          <Suspense fallback={null}>
            <Journey reduceMotion={reduceMotion} compact={compact} />
            {!reduceMotion && !compact && (
              <EffectComposer multisampling={0}>
                <Bloom intensity={0.4} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
                <ChromaticAberration
                  blendFunction={BlendFunction.NORMAL}
                  offset={[0.0012, 0.0018]}
                  radialModulation={true}
                  modulationOffset={0.4}
                />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
