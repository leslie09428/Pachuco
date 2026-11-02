"use client";

import { Suspense } from "react";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Pachuco({ hablando }: { hablando: boolean }) {
  const grupo = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/pachuco.glb");
  const { escala, posicion } = useMemo(() => {
    const bounds = new THREE.Box3().setFromObject(scene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const escala = 3 / Math.max(size.y, 0.001);

    return {
      escala,
      posicion: [
        -center.x * escala,
        -bounds.min.y * escala,
        -center.z * escala,
      ] as [number, number, number],
    };
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (grupo.current) {
      grupo.current.rotation.y = Math.sin(t * 0.5) * 0.55;
      grupo.current.position.y =
        Math.abs(Math.sin(t * 2)) * 0.04 +
        (hablando ? Math.abs(Math.sin(t * 8)) * 0.035 : 0);
      grupo.current.rotation.x = hablando ? Math.sin(t * 8) * 0.025 : 0;
    }
  });

  return (
    <group ref={grupo} position={[0, 0.05, 0]}>
      <primitive object={scene} scale={escala} position={posicion} />
    </group>
  );
}

export default function Pachuco3D({ hablando }: { hablando: boolean }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.2, 5.2], fov: 42 }}
      aria-label="Personaje pachuco en 3D"
      className="!touch-auto"
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Luces de mural: turquesa y oro */}
      <pointLight position={[-4, 2, 2]} intensity={12} color="#2d5f5f" />
      <pointLight position={[4, 3, 1]} intensity={10} color="#f4b942" />

      <Suspense fallback={null}>
        <Pachuco hablando={hablando} />
      </Suspense>

      {/* Discos de suelo al estilo mural */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 48]} />
        <meshStandardMaterial color="#4a1c1c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.45, 48]} />
        <meshStandardMaterial color="#f4b942" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.78, 48]} />
        <meshStandardMaterial color="#2d5f5f" roughness={0.6} />
      </mesh>

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.55}
        scale={6}
        blur={2.4}
        far={4}
      />
      <OrbitControls
        target={[0, 1.6, 0]}
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={0.5}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
