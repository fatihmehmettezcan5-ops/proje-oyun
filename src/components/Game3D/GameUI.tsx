import React from 'react';
import { useGame } from './GameContext';

const GameUI: React.FC = () => {
  const { batteryCount, score, message, messageType, nearMachine } = useGame();

  const getMessageColor = () => {
    switch (messageType) {
      case 'success':
        return '#48BB78';
      case 'error':
        return '#F56565';
      case 'info':
        return '#63B3ED';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 15,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Üst bilgi barı */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 24,
          background: 'rgba(0,0,0,0.55)',
          padding: '10px 24px',
          borderRadius: 8,
          color: 'white',
          fontSize: 16,
          fontWeight: 600,
          backdropFilter: 'blur(4px)',
        }}
      >
        <span>🔋 Pil: {batteryCount}</span>
        <span>⭐ Skor: {score}</span>
      </div>

      {/* E tuşu etkileşim mesajı */}
      {nearMachine && batteryCount > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            padding: '12px 24px',
            borderRadius: 8,
            color: '#FFE082',
            fontSize: 16,
            fontWeight: 600,
            textAlign: 'center',
            animation: 'pulse 1.5s infinite',
          }}
        >
          Pilleri teslim etmek için E'ye bas
        </div>
      )}

      {/* Sonuç mesajı */}
      {message && (
        <div
          style={{
            position: 'absolute',
            bottom: 180,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            padding: '14px 28px',
            borderRadius: 10,
            color: getMessageColor(),
            fontSize: 16,
            fontWeight: 600,
            textAlign: 'center',
            maxWidth: 500,
            lineHeight: 1.5,
            border: `2px solid ${getMessageColor()}`,
          }}
        >
          {message}
        </div>
      )}

      {/* Kontroller ipucu */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          background: 'rgba(0,0,0,0.4)',
          padding: '8px 14px',
          borderRadius: 6,
          color: 'rgba(255,255,255,0.7)',
          fontSize: 12,
        }}
      >
        WASD: Hareket | Fare: Bakınma | Space: Zıplama | E: Etkileşim
      </div>
    </div>
  );
};

export default GameUI;
