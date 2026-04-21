import React, { useMemo } from 'react';

interface BuildingData {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

const BUILDING_COLORS = [
  '#C4A882', // bej
  '#8C8C8C', // gri
  '#A0785A', // kahverengi
  '#7BA7BC', // açık mavi
  '#F5F5DC', // krem
  '#B8A99A', // taş
  '#9E9E9E', // beton gri
  '#D4C4A8', // açık bej
];

function generateBuildings(): BuildingData[] {
  const buildings: BuildingData[] = [];
  const streetWidth = 12;
  const blockSize = 30;
  const rows = 3;
  const cols = 3;

  for (let r = -rows; r <= rows; r++) {
    for (let c = -cols; c <= cols; c++) {
      // Sokak boşluğu bırak
      if (Math.abs(r) === 0 || Math.abs(c) === 0) continue;

      const baseX = c * blockSize + (c > 0 ? streetWidth / 2 : -streetWidth / 2);
      const baseZ = r * blockSize + (r > 0 ? streetWidth / 2 : -streetWidth / 2);

      // Her blokta 1-3 bina
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const w = 6 + Math.random() * 10;
        const d = 6 + Math.random() * 10;
        const h = 8 + Math.random() * 20;
        const x = baseX + (Math.random() - 0.5) * (blockSize - w - 4);
        const z = baseZ + (Math.random() - 0.5) * (blockSize - d - 4);
        const color = BUILDING_COLORS[Math.floor(Math.random() * BUILDING_COLORS.length)];

        buildings.push({
          position: [x, h / 2, z],
          size: [w, h, d],
          color,
        });
      }
    }
  }

  return buildings;
}

const Building: React.FC<{ data: BuildingData }> = ({ data }) => {
  return (
    <mesh position={data.position} castShadow receiveShadow>
      <boxGeometry args={data.size} />
      <meshLambertMaterial color={data.color} />
    </mesh>
  );
};

const WorldMap: React.FC = () => {
  const buildings = useMemo(() => generateBuildings(), []);

  return (
    <group>
      {/* Zemin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshLambertMaterial color="#555555" />
      </mesh>

      {/* Kaldırımlar - ana caddeler */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[300, 4]} />
        <meshLambertMaterial color="#777777" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[4, 300]} />
        <meshLambertMaterial color="#777777" />
      </mesh>

      {/* Binalar */}
      {buildings.map((b, i) => (
        <Building key={i} data={b} />
      ))}

      {/* Basit ağaçlar (silindir + koni) - düşük poligon */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 80 + Math.random() * 40;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={`tree-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 3, 6]} />
              <meshLambertMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0, 4, 0]} castShadow>
              <coneGeometry args={[2, 4, 6]} />
              <meshLambertMaterial color="#2E7D32" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export default WorldMap;
