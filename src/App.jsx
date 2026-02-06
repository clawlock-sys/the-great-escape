// src/App.jsx
import { useState, useEffect } from 'react';
import { useRoom } from './hooks/useRoom';
import { MobileBlocker } from './components/MobileBlocker';
import { ComponentDemo } from './components/ComponentDemo';
import { Room0Entry } from './rooms/Room0Entry';
import { Room1Market } from './rooms/Room1Market';
import { Room2Apartment } from './rooms/Room2Apartment';
import { Room3Restaurant } from './rooms/Room3Restaurant';
import { Room4Music } from './rooms/Room4Music';
import { Room5Lair } from './rooms/Room5Lair';
import { Room6Finale } from './rooms/Room6Finale';
import './styles/transitions.css';

// Transition configs between rooms
const ROOM_TRANSITIONS = {
  '0-1': {
    type: 'biggie-market',
    text: 'A market. Saturday morning. The beginning.',
  },
  '1-2': {
    type: 'text',
    text: 'The letters whisper a place... somewhere you both know well.',
  },
  '2-3': {
    type: 'text',
    text: 'Ristorante Illando... where it all began.',
  },
  '3-4': {
    type: 'text',
    text: 'The meal ends. But the music plays on...',
  },
  '4-5': {
    type: 'text',
    text: 'One more door. The gatekeeper awaits.',
  },
  '5-6': {
    type: 'text',
    text: '',  // No text, just fade to finale
  },
};

function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const { gameState, nextRoom, completeRoom, useHint, recordAttempt, resetGame } = useRoom();
  const [showTransition, setShowTransition] = useState(false);
  const [transitionConfig, setTransitionConfig] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState(0); // 0: biggie flash, 1: black, 2: sign, 3: text

  // Check for query params
  const urlParams = new URLSearchParams(window.location.search);
  const demoMode = urlParams.get('demo');
  const resetRequested = urlParams.get('reset') === 'true';

  // Handle reset via URL param (?reset=true)
  useEffect(() => {
    if (resetRequested) {
      resetGame();
      // Remove the reset param from URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [resetRequested]);

  // Handle reset via Ctrl+Shift+R keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        resetGame();
        // Force reload to ensure clean state
        window.location.reload();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame]);

  // Demo page accessible via ?demo=components
  if (demoMode === 'components') {
    return <ComponentDemo />;
  }

  if (isMobile) {
    return <MobileBlocker />;
  }

  const handleRoomComplete = (roomId) => {
    completeRoom(roomId);

    // Check if there's a transition for this room change
    const nextRoomId = roomId + 1;
    const transitionKey = `${roomId}-${nextRoomId}`;
    const config = ROOM_TRANSITIONS[transitionKey];

    if (config) {
      setTransitionConfig(config);
      setTransitionPhase(0);
      setShowTransition(true);
    } else {
      nextRoom();
    }
  };

  // Handle multi-phase transition
  useEffect(() => {
    if (!showTransition || !transitionConfig) return;

    if (transitionConfig.type === 'biggie-market') {
      // Phase 0: Biggie flash (500ms)
      // Phase 1: Black screen (500ms)
      // Phase 2: Market sign fade in (2000ms)
      // Phase 3: Text (2000ms)
      const timings = [500, 500, 2000, 2000];

      if (transitionPhase < timings.length) {
        const timer = setTimeout(() => {
          setTransitionPhase(prev => prev + 1);
        }, timings[transitionPhase]);
        return () => clearTimeout(timer);
      } else {
        // Transition complete
        setShowTransition(false);
        setTransitionConfig(null);
        setTransitionPhase(0);
        nextRoom();
      }
    } else {
      // Simple text transition - 3.5s feels more responsive
      const timer = setTimeout(() => {
        setShowTransition(false);
        setTransitionConfig(null);
        setTransitionPhase(0);
        nextRoom();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showTransition, transitionPhase, transitionConfig]);

  const handleHintUsed = (roomId, level) => {
    useHint(roomId);
  };

  const renderTransition = () => {
    if (!transitionConfig) return null;

    if (transitionConfig.type === 'biggie-market') {
      return (
        <div className="transition-container">
          {/* Phase 0: Biggie flash */}
          {transitionPhase === 0 && (
            <div className="transition-biggie-flash">
              <img
                src={`${import.meta.env.BASE_URL}images/biggie/biggie-silhouette.svg`}
                alt=""
                className="biggie-flash-img"
              />
            </div>
          )}

          {/* Phase 1: Black screen */}
          {transitionPhase === 1 && (
            <div className="transition-black" />
          )}

          {/* Phase 2: Market sign */}
          {transitionPhase === 2 && (
            <div className="transition-sign-container">
              <img
                src={`${import.meta.env.BASE_URL}assets/room1/market-sign.png`}
                alt="Little Italy Market"
                className="transition-market-sign"
              />
            </div>
          )}

          {/* Phase 3: Text */}
          {transitionPhase >= 3 && (
            <div className="transition-text-container">
              <img
                src={`${import.meta.env.BASE_URL}assets/room1/market-sign.png`}
                alt="Little Italy Market"
                className="transition-market-sign visible"
              />
              <p className="transition-text">{transitionConfig.text}</p>
            </div>
          )}
        </div>
      );
    }

    // Simple text transition
    return (
      <div className="transition-container">
        <p className="transition-text">{transitionConfig.text}</p>
      </div>
    );
  };

  const renderRoom = () => {
    // Show transition screen if active
    if (showTransition) {
      return renderTransition();
    }

    switch (gameState.currentRoom) {
      case 0:
        return (
          <Room0Entry
            onComplete={() => handleRoomComplete(0)}
            onHintUsed={handleHintUsed}
          />
        );
      case 1:
        return (
          <Room1Market
            onComplete={() => handleRoomComplete(1)}
            onHintUsed={handleHintUsed}
          />
        );
      case 2:
        return (
          <Room2Apartment
            onComplete={() => handleRoomComplete(2)}
            onHintUsed={handleHintUsed}
          />
        );
      case 3:
        return (
          <Room3Restaurant
            onComplete={() => handleRoomComplete(3)}
            onHintUsed={handleHintUsed}
          />
        );
      case 4:
        return (
          <Room4Music
            onComplete={() => handleRoomComplete(4)}
            onHintUsed={handleHintUsed}
          />
        );
      case 5:
        return (
          <Room5Lair
            onComplete={() => handleRoomComplete(5)}
            onHintUsed={handleHintUsed}
          />
        );
      case 6:
        return (
          <Room6Finale
            onComplete={() => handleRoomComplete(6)}
          />
        );
      default:
        return (
          <div className="app">
            <h1 style={{ fontFamily: 'var(--font-creepy)', fontSize: '3rem' }}>
              Room {gameState.currentRoom}
            </h1>
            <p style={{ marginTop: '1rem', color: '#666' }}>
              Coming soon...
            </p>
          </div>
        );
    }
  };

  return renderRoom();
}

export default App;
