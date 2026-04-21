import './App.css';
import GameCanvas from './components/Game3D/GameCanvas';
import GameUI from './components/Game3D/GameUI';

export default function App() {
  return (
    <div className="game-canvas-container">
      <GameCanvas />
      <GameUI />
      <div className="crosshair" />
    </div>
  );
}
