"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const PALETA = {
  traje: "#2e2440",
  camisa: "#fdf3e3",
  corbata: "#f4b942",
  piel: "#b97a4e",
  sombrero: "#241c30",
  zapato: "#171018",
  oro: "#f4b942",
};

/** Cadena de reloj colgante, curvada con una bézier. */
function Cadena() {
  const curva = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.4, 2.05, 0.3),
        new THREE.Vector3(0, 1.3, 0.5),
        new THREE.Vector3(0.32, 1.15, 0.32),
      ),
    [],
  );
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curva, 40, 0.018, 8, false]} />
        <meshStandardMaterial
          color={PALETA.oro}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
      {/* El reloj en el bolsillo */}
      <mesh position={[0.32, 1.13, 0.32]}>
        <cylinderGeometry args={[0.07, 0.07, 0.03, 24]} />
        <meshStandardMaterial
          color={PALETA.oro}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Pachuco() {
  const grupo = useRef<THREE.Group>(null);
  const brazoDerecho = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (grupo.current) {
      grupo.current.rotation.y = Math.sin(t * 0.5) * 0.55;
      grupo.current.position.y = Math.abs(Math.sin(t * 2)) * 0.04;
    }
    if (brazoDerecho.current) {
      // Saludo con la mano derecha
      brazoDerecho.current.rotation.z = -2.1 + Math.sin(t * 4) * 0.25;
    }
  });

  return (
    <group ref={grupo} position={[0, 0.05, 0]}>
      {/* Zapatos puntiagudos */}
      {[-0.19, 0.19].map((x) => (
        <mesh key={x} position={[x, 0.09, 0.1]} castShadow>
          <boxGeometry args={[0.2, 0.16, 0.5]} />
          <meshStandardMaterial color={PALETA.zapato} roughness={0.3} />
        </mesh>
      ))}

      {/* Pantalón zoot: amplio arriba, ceñido al tobillo */}
      {[-0.19, 0.19].map((x) => (
        <mesh key={`p${x}`} position={[x, 0.58, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.13, 0.9, 16]} />
          <meshStandardMaterial color={PALETA.traje} roughness={0.8} />
        </mesh>
      ))}

      {/* Saco largo, holgado abajo */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.72, 1.15, 20]} />
        <meshStandardMaterial color={PALETA.traje} roughness={0.8} />
      </mesh>

      {/* Hombros anchos */}
      <mesh position={[0, 2.12, 0]} castShadow>
        <boxGeometry args={[1.35, 0.22, 0.55]} />
        <meshStandardMaterial color={PALETA.traje} roughness={0.8} />
      </mesh>

      {/* Camisa y corbata */}
      <mesh position={[0, 1.95, 0.18]}>
        <cylinderGeometry args={[0.13, 0.16, 0.3, 12]} />
        <meshStandardMaterial color={PALETA.camisa} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.95, 0.26]}>
        <boxGeometry args={[0.07, 0.32, 0.04]} />
        <meshStandardMaterial color={PALETA.corbata} roughness={0.5} />
      </mesh>

      <Cadena />

      {/* Brazo izquierdo */}
      <group position={[-0.68, 2.05, 0]} rotation={[0, 0, 0.45]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.68, 12]} />
          <meshStandardMaterial color={PALETA.traje} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color={PALETA.piel} roughness={0.6} />
        </mesh>
      </group>

      {/* Brazo derecho: el que saluda */}
      <group ref={brazoDerecho} position={[0.68, 2.05, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.68, 12]} />
          <meshStandardMaterial color={PALETA.traje} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color={PALETA.piel} roughness={0.6} />
        </mesh>
      </group>

      {/* Cuello */}
      <mesh position={[0, 2.32, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.18, 12]} />
        <meshStandardMaterial color={PALETA.piel} roughness={0.6} />
      </mesh>

      {/* Cabeza */}
      <mesh position={[0, 2.55, 0]} castShadow>
        <sphereGeometry args={[0.27, 24, 24]} />
        <meshStandardMaterial color={PALETA.piel} roughness={0.6} />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh key={`o${x}`} position={[x, 2.6, 0.24]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          <meshStandardMaterial color="#171018" roughness={0.4} />
        </mesh>
      ))}
      {/* Bigote */}
      <mesh position={[0, 2.47, 0.26]}>
        <boxGeometry args={[0.16, 0.045, 0.04]} />
        <meshStandardMaterial color="#171018" roughness={0.5} />
      </mesh>

      {/* Sombrero de ala ancha con pluma */}
      <mesh position={[0, 2.87, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 24]} />
        <meshStandardMaterial color={PALETA.sombrero} roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.01, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.28, 20]} />
        <meshStandardMaterial color={PALETA.sombrero} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.91, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.06, 20]} />
        <meshStandardMaterial color={PALETA.oro} roughness={0.4} />
      </mesh>
      <mesh position={[0.3, 3.06, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.04, 0.3, 0.02]} />
        <meshStandardMaterial color="#e8637e" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Pachuco3D() {
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

      <Pachuco />

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
