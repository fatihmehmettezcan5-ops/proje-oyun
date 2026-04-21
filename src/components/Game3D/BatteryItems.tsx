import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from './GameContext';

interface BatteryData {
  id: number;
  position: [number, number, number];
}

function generateBatteries(): BatteryData[] {
  const batteries: BatteryData[] = [];
  const positions: [number, number, number][] = [
    [5, 0.3, 8],
    [-8, 0.3, 5],
    [12, 0.3, -10],
    [-15, 0.3, -12],
    [20, 0.3, 15],
    [-22, 0.3, 18],
    [8, 0.3, -25],
    [-5, 0.3, -30],
    [28, 0.3, -5],
    [-28, 0.3, 8],
    [3, 0.3, 35],
    [-18, 0.3, -35],
    [15, 0.3, 28],
    [-10, 0.3, 22],
    [32, 0.3, 22],
    [-32, 0.3, -22],
    [0, 0.3, 45],
    [25, 0.3, -35],
    [-25, 0.3, 35],
    [10, 0.3, -45],
  ];

  for (let i = 0; i < positions.length; i++) {
    batteries.push({
      id: i,
      position: positions[i],
    });
  }
  return batteries;
}

const BatteryItem: React.FC<{ data: BatteryData; onCollect: (id: number) => void }> = ({
  data,
  onCollect,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { playerPos } = useGame();

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.02;
    const pos = meshRef.current.position;
    const player = playerPos.current;
    const dist = Math.sqrt((pos.x - player.x) ** 2 + (pos.z - player.z) ** 2);
    if (dist < 1.5) {
      onCollect(data.id);
    }
  });

  return (
    <mesh ref={meshRef} position={data.position}>
      <cylinderGeometry args={[0.08, 0.08, 0.25, 6]} />
      <meshLambertMaterial color="#FFD700" emissive="#FFAA00" emissiveIntensity={0.4} />
    </mesh>
  );
};

const BatteryItems: React.FC = () => {
  const [batteries, setBatteries] = useState<BatteryData[]>(() => generateBatteries());
  const { addBattery } = useGame();
  const collectedRef = useRef<Set<number>>(new Set());

  const handleCollect = (id: number) => {
    if (collectedRef.current.has(id)) return;
    collectedRef.current.add(id);
    addBattery();
    setBatteries((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <group>
      {batteries.map((b) => (
        <BatteryItem key={b.id} data={b} onCollect={handleCollect} />
      ))}
    </group>
  );
};

export default BatteryItems;
