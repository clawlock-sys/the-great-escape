import { useState, useEffect, useCallback } from 'react';
import { TextInput } from '../components/TextInput';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { StallModal } from '../components/StallModal';
import { useAudio } from '../hooks/useAudio';
import { validate } from '../utils/solutions';
import styles from '../styles/Room1.module.css';

const STALLS = [
  {
    id: 1,
    name: "Rosie's Roots",
    items: 'Radishes, Carrots',
    image: '/assets/room1/stalls/rosies-roots.png',
    // Front Left
    position: { top: '58%', left: '14%', width: '14%', height: '22%' },
  },
  {
    id: 2,
    name: "Ivy's Organics",
    items: 'Kale, Spinach',
    image: '/assets/room1/stalls/ivys-organics.jpg',
    // Mid Left - shifted left
    position: { top: '52%', left: '22%', width: '12%', height: '20%' },
  },
  {
    id: 3,
    name: 'Sunrise Blooms',
    items: 'Lilies, Roses',
    image: '/assets/room1/stalls/sunrise-blooms.png',
    // Back Left - up and left
    position: { top: '38%', left: '35%', width: '10%', height: '18%' },
  },
  {
    id: 4,
    name: 'Terra Fruits',
    items: 'Apples, Pears',
    image: '/assets/room1/stalls/terra-fruits.png',
    // Back Center - up and left
    position: { top: '38%', left: '46%', width: '10%', height: '18%' },
  },
  {
    id: 5,
    name: 'Oak Barrel Honey',
    items: 'Wildflower, Clover',
    image: '/assets/room1/stalls/oak-barrel-honey.png',
    // Back Right - shifted left
    position: { top: '38%', left: '56%', width: '10%', height: '18%' },
  },
  {
    id: 6,
    name: 'Red Barn Eggs',
    items: 'Free Range, Organic',
    image: '/assets/room1/stalls/red-barn-eggs.png',
    // Mid Right - up and left
    position: { top: '48%', left: '68%', width: '12%', height: '20%' },
  },
  {
    id: 7,
    name: 'Abandoned',
    items: '???',
    image: '/assets/room1/stalls/Abandoned.png',
    // Front Right - lower and right
    position: { top: '55%', left: '80%', width: '12%', height: '22%' },
  },
];

const HINTS = [
  "The vendors have names. Look closer at who's selling.",
  'First impressions matter. First letters too.',
  'Six stalls in light. One in shadow. Seven letters.',
];

export function Room1Market({ onComplete, onHintUsed }) {
  const [inputValue, setInputValue] = useState('');
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMicroGlitch, setIsMicroGlitch] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [visitedStalls, setVisitedStalls] = useState(new Set());

  // Audio
  const ambient = useAudio('/audio/ambient-market.mp3', { loop: true, volume: 0.3 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // Occasional micro-glitch for unease (every 10-20 seconds)
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 10000 + Math.random() * 10000;
      return setTimeout(() => {
        setIsMicroGlitch(true);
        setTimeout(() => setIsMicroGlitch(false), 150);
        scheduleGlitch();
      }, delay);
    };

    const timerId = scheduleGlitch();
    return () => clearTimeout(timerId);
  }, []);

  const handleValidate = useCallback((value) => {
    const isValid = validate(1, value);

    if (isValid) {
      onComplete?.();
      return true;
    } else {
      setShowWrongAnswer(true);
      setTimeout(() => setShowWrongAnswer(false), 2000);
      return false;
    }
  }, [onComplete]);

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  const handleStallClick = (stall) => {
    setSelectedStall(stall);
    setVisitedStalls((prev) => new Set([...prev, stall.id]));
  };

  const handleCloseModal = () => {
    setSelectedStall(null);
  };

  const toggleDebug = () => {
    setDebugMode((prev) => !prev);
  };

  const roomClasses = [
    styles.room1,
    isMicroGlitch && styles.microGlitch,
  ].filter(Boolean).join(' ');

  return (
    <Transition isVisible={isVisible}>
      <div className={roomClasses}>
        {/* Hotspots over the background stalls */}
        <div className={styles.hotspotContainer}>
          {STALLS.map((stall) => (
            <div
              key={stall.id}
              className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''} ${
                visitedStalls.has(stall.id) ? styles.hotspotVisited : ''
              } ${stall.id === 7 ? styles.hotspotAbandoned : ''}`}
              style={{
                top: stall.position.top,
                left: stall.position.left,
                width: stall.position.width,
                height: stall.position.height,
              }}
              onClick={() => handleStallClick(stall)}
              title={debugMode ? stall.name : ''}
            >
              {debugMode && (
                <span className={styles.hotspotLabel}>{stall.id}</span>
              )}
            </div>
          ))}
        </div>

        {/* Debug toggle */}
        <button className={styles.debugToggle} onClick={toggleDebug}>
          {debugMode ? 'Hide Hotspots' : 'Debug'}
        </button>

        {/* Prompt and input at bottom */}
        <div className={styles.bottomPanel}>
          <p className={styles.prompt}>"What word do the stalls whisper?"</p>

          <div className={styles.inputContainer}>
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onValidate={handleValidate}
              placeholder="Enter the word..."
            />
            <HintButton
              hints={HINTS}
              onHintUsed={handleHintUsed}
              roomId={1}
            />
            {showWrongAnswer && (
              <p className={styles.wrongAnswer}>That's not what they whisper...</p>
            )}
          </div>

          {/* Progress indicator */}
          <div className={styles.visitedIndicator}>
            {visitedStalls.size}/7 stalls explored
          </div>
        </div>

        {/* Stall modal */}
        <StallModal stall={selectedStall} onClose={handleCloseModal} />

        {/* Subtle "no people" indicator */}
        <span className={styles.emptyNotice}>...where did everyone go?</span>
      </div>
    </Transition>
  );
}

export default Room1Market;
