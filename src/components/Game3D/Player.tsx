import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from './GameContext';

const SPEED = 8.0;
const JUMP_FORCE = 6.0;
const GRAVITY = 18.0;
const PLAYER_HEIGHT = 1.7;

const keys: Record<string, boolean> = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  Space: false,
};

const Player: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const direction = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(false);
  const canJump = useRef(true);
  const { playerPos } = useGame();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Başlangıç pozisyonu
    camera.position.set(0, PLAYER_HEIGHT, 5);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const controls = controlsRef.current;
    if (!controls || !controls.isLocked) return;

    // Yerçekimi
    velocity.current.y -= GRAVITY * dt;

    // Zıplama
    if (keys.Space && isGrounded.current && canJump.current) {
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
      canJump.current = false;
    }
    if (!keys.Space) {
      canJump.current = true;
    }

    // Yatay hareket yönü
    direction.current.set(0, 0, 0);
    if (keys.KeyW) direction.current.z -= 1;
    if (keys.KeyS) direction.current.z += 1;
    if (keys.KeyA) direction.current.x -= 1;
    if (keys.KeyD) direction.current.x += 1;
    direction.current.normalize();

    // Kameraya göre yön döndür
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    const moveDir = new THREE.Vector3()
      .addScaledVector(forward, -direction.current.z)
      .addScaledVector(right, direction.current.x);

    if (moveDir.length() > 0) {
      moveDir.normalize();
      velocity.current.x = moveDir.x * SPEED;
      velocity.current.z = moveDir.z * SPEED;
    } else {
      velocity.current.x = 0;
      velocity.current.z = 0;
    }

    // Pozisyon güncelleme
    const nextPos = camera.position.clone();
    nextPos.x += velocity.current.x * dt;
    nextPos.z += velocity.current.z * dt;
    nextPos.y += velocity.current.y * dt;

    // Basit zemin çarpışması
    if (nextPos.y < PLAYER_HEIGHT) {
      nextPos.y = PLAYER_HEIGHT;
      velocity.current.y = 0;
      isGrounded.current = true;
    } else {
      isGrounded.current = false;
    }

    // Basit duvar çarpışması (sınırlar)
    const boundary = 140;
    if (nextPos.x < -boundary) nextPos.x = -boundary;
    if (nextPos.x > boundary) nextPos.x = boundary;
    if (nextPos.z < -boundary) nextPos.z = -boundary;
    if (nextPos.z > boundary) nextPos.z = boundary;

    camera.position.copy(nextPos);
    playerPos.current.copy(camera.position);
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => console.log('locked')}
      onUnlock={() => console.log('unlocked')}
    />
  );
};

export default Player;
