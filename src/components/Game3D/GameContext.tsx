import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import * as THREE from 'three';

export interface GameContextType {
  batteryCount: number;
  score: number;
  message: string | null;
  messageType: 'success' | 'error' | 'info' | null;
  nearMachine: boolean;
  playerPos: React.MutableRefObject<THREE.Vector3>;
  addBattery: () => void;
  setMessage: (msg: string | null, type?: 'success' | 'error' | 'info') => void;
  setNearMachine: (near: boolean) => void;
  deliverBatteries: (isTrusted: boolean) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [batteryCount, setBatteryCount] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessageState] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const [nearMachine, setNearMachine] = useState(false);
  const playerPos = useRef(new THREE.Vector3(0, 1.7, 5));
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addBattery = useCallback(() => {
    setBatteryCount((prev) => prev + 1);
  }, []);

  const setMessage = useCallback((msg: string | null, type: 'success' | 'error' | 'info' | null = null) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
    setMessageState(msg);
    setMessageType(type);
    if (msg) {
      messageTimeoutRef.current = setTimeout(() => {
        setMessageState(null);
        setMessageType(null);
      }, 4000);
    }
  }, []);

  const deliverBatteries = useCallback((isTrusted: boolean) => {
    setBatteryCount((prev) => {
      if (prev === 0) {
        setMessage('Teslim edecek piliniz yok!', 'info');
        return prev;
      }
      if (isTrusted) {
        const points = 50 * prev;
        setScore((s) => s + points);
        setMessage(`Piller güvenle geri dönüştürüldü! +${points} puan`, 'success');
      } else {
        const penalty = 30 * prev;
        setScore((s) => s - penalty);
        setMessage(
          `Bu merkez yetkisiz! Piller uygunsuz işlendi. -${penalty} puan. Yetkili merkezleri tercih edin!`,
          'error'
        );
      }
      return 0;
    });
  }, [setMessage]);

  return (
    <GameContext.Provider
      value={{
        batteryCount,
        score,
        message,
        messageType,
        nearMachine,
        playerPos,
        addBattery,
        setMessage,
        setNearMachine,
        deliverBatteries,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
