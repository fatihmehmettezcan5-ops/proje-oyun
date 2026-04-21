import React from 'react';
import { Text } from '@react-three/drei';
import VendingMachine from './VendingMachine';

interface FacilityData {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  isTrusted: boolean;
  machineOffset: [number, number, number];
}

const FACILITIES: FacilityData[] = [
  // Yetkili (Güvenilir) Merkezler
  {
    name: 'Taşınabilir Pil Üreticileri ve İthalatçıları Derneği (TAP)',
    position: [-35, 0, -35],
    size: [14, 7, 10],
    color: '#C4A882',
    isTrusted: true,
    machineOffset: [0, 0, 6],
  },
  {
    name: 'Akümülatör ve Geri Kazanım Sanayicileri Derneği (AKÜDER)',
    position: [35, 0, -35],
    size: [14, 7, 10],
    color: '#A0785A',
    isTrusted: true,
    machineOffset: [0, 0, 6],
  },
  {
    name: 'Tüm Akü İthalatçıları ve Üreticileri Derneği (TÜMAKÜDER)',
    position: [-35, 0, 35],
    size: [14, 7, 10],
    color: '#7BA7BC',
    isTrusted: true,
    machineOffset: [0, 0, 6],
  },
  // Yetkisiz (Sahte/Güvenilmez) Merkezler
  {
    name: 'EcoCycle Teknoloji ve Geri Dönüşüm A.Ş.',
    position: [35, 0, 35],
    size: [14, 7, 10],
    color: '#B8A99A',
    isTrusted: false,
    machineOffset: [0, 0, 6],
  },
  {
    name: 'Yeşil Enerji Toplama ve İşleme Merkezi',
    position: [0, 0, -50],
    size: [14, 7, 10],
    color: '#9E9E9E',
    isTrusted: false,
    machineOffset: [0, 0, 6],
  },
  {
    name: 'Sürdürülebilir Atık Yönetim Hizmetleri Ltd.',
    position: [-20, 0, 20],
    size: [14, 7, 10],
    color: '#D4C4A8',
    isTrusted: false,
    machineOffset: [0, 0, 6],
  },
];

const Facility: React.FC<{ data: FacilityData }> = ({ data }) => {
  const [bx, by, bz] = data.size;
  const textPos: [number, number, number] = [data.position[0], data.position[1] + by + 0.8, data.position[2]];
  const machinePos: [number, number, number] = [
    data.position[0] + data.machineOffset[0],
    data.position[1] + data.machineOffset[1],
    data.position[2] + data.machineOffset[2],
  ];

  return (
    <group>
      {/* Ana bina */}
      <mesh position={[data.position[0], by / 2, data.position[2]]} castShadow receiveShadow>
        <boxGeometry args={data.size} />
        <meshLambertMaterial color={data.color} />
      </mesh>
      {/* Çatı */}
      <mesh position={[data.position[0], by + 0.3, data.position[2]]} castShadow>
        <boxGeometry args={[bx + 0.6, 0.6, bz + 0.6]} />
        <meshLambertMaterial color="#555555" />
      </mesh>
      {/* Kapı */}
      <mesh position={[data.position[0], 1.2, data.position[2] + bz / 2 + 0.01]}>
        <boxGeometry args={[2, 2.4, 0.1]} />
        <meshLambertMaterial color="#3D3D3D" />
      </mesh>
      {/* Pencere sol */}
      <mesh position={[data.position[0] - 3, 3, data.position[2] + bz / 2 + 0.01]}>
        <boxGeometry args={[1.5, 1.5, 0.05]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
      {/* Pencere sağ */}
      <mesh position={[data.position[0] + 3, 3, data.position[2] + bz / 2 + 0.01]}>
        <boxGeometry args={[1.5, 1.5, 0.05]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
      {/* İsim tabelası */}
      <Text
        position={textPos}
        fontSize={0.9}
        color="#1A202C"
        anchorX="center"
        anchorY="middle"
        maxWidth={16}
        textAlign="center"
      >
        {data.name}
      </Text>
      {/* Otomat */}
      <VendingMachine position={machinePos} isTrusted={data.isTrusted} />
    </group>
  );
};

const Facilities: React.FC = () => {
  return (
    <group>
      {FACILITIES.map((f, i) => (
        <Facility key={i} data={f} />
      ))}
    </group>
  );
};

export default Facilities;
