// src/App.jsx
import { useRoom } from './hooks/useRoom';
import { MobileBlocker } from './components/MobileBlocker';
import { ComponentDemo } from './components/ComponentDemo';

function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const { gameState } = useRoom();

  // Check for demo mode via query param
  const urlParams = new URLSearchParams(window.location.search);
  const demoMode = urlParams.get('demo');

  // Demo page accessible via ?demo=components
  if (demoMode === 'components') {
    return <ComponentDemo />;
  }

  if (isMobile) {
    return <MobileBlocker />;
  }

  // Room components will be added in future phases
  // For now, show placeholder with current room state
  return (
    <div className="app">
      <h1 style={{ fontFamily: 'var(--font-creepy)', fontSize: '3rem' }}>
        Valentine Escape Room
      </h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Current Room: {gameState.currentRoom}
      </p>
      <p style={{ marginTop: '0.5rem', color: '#444', fontSize: '0.9rem' }}>
        Room components will be added in Phase 2+
      </p>
    </div>
  );
}

export default App;
