import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useGame } from './GameContext';

const MACHINES = [
  { pos: [-35, 0, -29] as [number, number, number], isTrusted: true },
  { pos: [35, 0, -29] as [number, number, number], isTrusted: true },
  { pos: [-35, 0, 41] as [number, number, number], isTrusted: true },
  { pos: [35, 0, 41] as [number, number, number], isTrusted: false },
  { pos: [0, 0, -44] as [number, number, number], isTrusted: false },
  { pos: [-20, 0, 26] as [number, number, number], isTrusted: false },
];

const InteractionChecker: React.FC = () => {
  const { playerPos, setNearMachine, deliverBatteries } = useGame();
  const nearestTrustedRef = useRef<boolean | null>(null);

  useFrame(() => {
    const player = playerPos.current;
    let near = false;
    let trusted: boolean | null = null;
    for (const m of MACHINES) {
      const dist = Math.sqrt((m.pos[0] - player.x) ** 2 + (m.pos[2] - player.z) ** 2);
      if (dist < 4) {
        near = true;
        trusted = m.isTrusted;
        break;
      }
    }
    setNearMachine(near);
    nearestTrustedRef.current = trusted;
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const trusted = nearestTrustedRef.current;
        if (trusted !== null) {
          deliverBatteries(trusted);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [deliverBatteries]);

  return null;
};

export default InteractionChecker;
