import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A small orchestration/graph metaphor: nodes in orbit, connected by pulsing
// links — evokes distributed systems / microservice orchestration rather than
// generic decorative particles. This is the one deliberately bold animated
// moment on the page; everything else stays calm.

const NODE_COUNT = 14;

function useNodePositions() {
  return useMemo(() => {
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
      const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
      const radius = 2.6;
      nodes.push(
        new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        )
      );
    }
    return nodes;
  }, []);
}

function OrchestrationGraph() {
  const groupRef = useRef();
  const nodes = useNodePositions();

  const edges = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < nodes.length; i++) {
      // connect each node to its 2 nearest neighbours by index distance,
      // producing a readable mesh rather than an all-to-all tangle
      pairs.push([i, (i + 1) % nodes.length]);
      pairs.push([i, (i + 3) % nodes.length]);
    }
    return pairs;
  }, [nodes]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
    }
  });

  const colors = ["#F2A65A", "#5EEAD4", "#8B7FD1"];

  return (
    <group ref={groupRef}>
      {edges.map(([a, b], i) => {
        const points = [nodes[a], nodes[b]];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={`edge-${i}`} geometry={geometry}>
            <lineBasicMaterial color="#2A3448" transparent opacity={0.6} />
          </line>
        );
      })}
      {nodes.map((pos, i) => (
        <mesh key={`node-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={colors[i % colors.length]} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial color="#5EEAD4" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <OrchestrationGraph />
        </Suspense>
      </Canvas>
    </div>
  );
}
