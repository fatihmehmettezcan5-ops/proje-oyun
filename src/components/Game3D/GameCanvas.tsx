import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GameProvider } from './GameContext';
import Player from './Player';
import WorldMap from './WorldMap';
import Facilities from './Facilities';
import BatteryItems from './BatteryItems';
import InteractionChecker from './InteractionChecker';

const GameCanvas: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const onLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  const handlePointerLock = () => {
    const canvas = document.querySelector('canvas');
    if (canvas && !isLocked) {
      canvas.requestPointerLock();
    }
  };

  return (
    <GameProvider>
      <div
        style={{ width: '100%', height: '100%', position: 'relative' }}
        onClick={handlePointerLock}
      >
        {!isLocked && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              zIndex: 20,
              cursor: 'pointer',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Geri Dönüşüm 3D</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Ekrana tıklayarak başlayın</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '0.5rem' }}>
                WASD: Hareket | Fare: Bakınma | Space: Zıplama | E: Etkileşim
              </p>
            </div>
          </div>
        )}

        <Canvas
          shadows
          dpr={[0.75, 1]}
          camera={{ fov: 70, near: 0.1, far: 200 }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Düşük kalite gölgeler */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[50, 80, 30]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-camera-near={0.5}
            shadow-camera-far={200}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          <hemisphereLight args={['#87CEEB', '#555555', 0.3]} />

          <Suspense fallback={null}>
            <WorldMap />
            <Facilities />
            <BatteryItems />
            <Player />
            <InteractionChecker />
          </Suspense>
        </Canvas>
      </div>
    </GameProvider>
  );
};

export default GameCanvas;
