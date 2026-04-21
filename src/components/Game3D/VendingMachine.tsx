import React, { useRef } from 'react';
import * as THREE from 'three';

interface VendingMachineProps {
  position: [number, number, number];
  isTrusted: boolean;
}

const VendingMachine: React.FC<VendingMachineProps> = ({ position }) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={position}>
      {/* Ana gövde */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.2, 2.2, 1]} />
        <meshLambertMaterial color="#4A5568" />
      </mesh>
      {/* Üst panel */}
      <mesh position={[0, 1.8, 0.51]} castShadow>
        <boxGeometry args={[1, 0.3, 0.05]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      {/* Ekran/Panel ışığı */}
      <mesh position={[0, 1.4, 0.51]}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshLambertMaterial color="#63B3ED" emissive="#4299E1" emissiveIntensity={0.3} />
      </mesh>
      {/* Atık yuvası */}
      <mesh position={[0, 0.6, 0.51]}>
        <boxGeometry args={[0.5, 0.3, 0.05]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      {/* Ayaklar */}
      <mesh position={[-0.4, 0.05, -0.3]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.15]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      <mesh position={[0.4, 0.05, -0.3]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.15]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      <mesh position={[-0.4, 0.05, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.15]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      <mesh position={[0.4, 0.05, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.15]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
    </group>
  );
};

export default VendingMachine;
