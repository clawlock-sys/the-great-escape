import { useState, useEffect, useCallback, useRef } from 'react';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useAudio } from '../hooks/useAudio';
import styles from '../styles/Room4.module.css';

// Lyric fragments - correct ones from "I Love You, I'm Sorry"
const LYRIC_FRAGMENTS = [
  // Correct fragments
  { id: 'correct-1', text: '"I love you"', isCorrect: true, found: false },
  { id: 'correct-2', text: '"I\'m sorry"', isCorrect: true, found: false },
  { id: 'correct-3', text: '"maybe I should go"', isCorrect: true, found: false },
  { id: 'correct-4', text: '"hurt you all along"', isCorrect: true, found: false },
  { id: 'correct-5', text: '"couldn\'t let you go"', isCorrect: true, found: false },
  // Decoy fragments from other songs
  { id: 'decoy-1', text: '"slow down crazy child"', isCorrect: false, found: false },
  { id: 'decoy-2', text: '"my funny valentine"', isCorrect: false, found: false },
  { id: 'decoy-3', text: '"back to being friends"', isCorrect: false, found: false },
  { id: 'decoy-4', text: '"the largest in the game"', isCorrect: false, found: false },
];

// Hotspot positions for finding lyrics
const HOTSPOTS = [
  { id: 'napkin-1', fragmentId: 'correct-1', top: '55%', left: '15%', width: '8%', height: '6%', label: 'Napkin' },
  { id: 'coaster-1', fragmentId: 'correct-2', top: '62%', left: '78%', width: '7%', height: '5%', label: 'Coaster' },
  { id: 'graffiti-1', fragmentId: 'correct-3', top: '25%', left: '8%', width: '10%', height: '8%', label: 'Wall' },
  { id: 'poster-1', fragmentId: 'correct-4', top: '18%', left: '85%', width: '8%', height: '12%', label: 'Poster' },
  { id: 'receipt-1', fragmentId: 'correct-5', top: '70%', left: '45%', width: '8%', height: '5%', label: 'Receipt' },
  { id: 'decoy-napkin', fragmentId: 'decoy-1', top: '58%', left: '35%', width: '7%', height: '5%', label: 'Napkin' },
  { id: 'decoy-coaster', fragmentId: 'decoy-2', top: '65%', left: '60%', width: '6%', height: '5%', label: 'Coaster' },
  { id: 'decoy-graffiti', fragmentId: 'decoy-3', top: '30%', left: '70%', width: '9%', height: '7%', label: 'Scribble' },
  { id: 'decoy-poster', fragmentId: 'decoy-4', top: '22%', left: '25%', width: '8%', height: '10%', label: 'Flyer' },
];

// Beat pattern for the rhythm game (timing in ms from start)
// Pattern based on "I Love You, I'm Sorry" tempo
const BEAT_PATTERN = [0, 400, 800, 1400, 1800]; // 5 beats
const TIMING_TOLERANCE = 200; // ±200ms tolerance

const HINTS = [
  'The lyrics are scattered across the bar. Look for scraps.',
  'Find at least 3 fragments from YOUR song, then approach the jukebox.',
  'The song is "I Love You, I\'m Sorry" - tap the rhythm when the beats light up.',
];

export function Room4Music({ onComplete, onHintUsed }) {
  const [fragments] = useState(LYRIC_FRAGMENTS);
  const [collectedFragments, setCollectedFragments] = useState([]);
  const [phase, setPhase] = useState('explore'); // 'explore' | 'rhythm' | 'success'
  const [showFragment, setShowFragment] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);

  // Easter egg: "The Largest" red flash
  const [largestEasterEgg, setLargestEasterEgg] = useState(false);

  // Rhythm game state
  const [rhythmActive, setRhythmActive] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [showBeatFeedback, setShowBeatFeedback] = useState(null);
  const rhythmStartTime = useRef(null);
  const beatTimeouts = useRef([]);
  const playerTapsRef = useRef([]);

  // Audio
  const ambient = useAudio('/audio/ambient-static.mp3', { loop: true, volume: 0.15 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => {
      ambient.stop();
      beatTimeouts.current.forEach(clearTimeout);
    };
  }, []);

  // Count correct fragments collected
  const correctCount = collectedFragments.filter(
    (f) => fragments.find((fr) => fr.id === f)?.isCorrect
  ).length;

  const canAccessJukebox = correctCount >= 3;

  // Handle hotspot click
  const handleHotspotClick = useCallback((hotspot) => {
    const fragment = fragments.find((f) => f.id === hotspot.fragmentId);
    if (!fragment || collectedFragments.includes(fragment.id)) return;

    // Easter egg: "The Largest" triggers red flash loop
    if (fragment.id === 'decoy-4') {
      setLargestEasterEgg(true);
      // Stop after 5 seconds
      setTimeout(() => setLargestEasterEgg(false), 5000);
    }

    // Show the fragment
    setShowFragment(fragment);

    // Add to collected
    setCollectedFragments((prev) => [...prev, fragment.id]);

    // Auto-dismiss after 2s
    setTimeout(() => setShowFragment(null), 2500);
  }, [fragments, collectedFragments]);

  // Start rhythm game
  const startRhythmGame = useCallback(() => {
    if (!canAccessJukebox) return;

    setPhase('rhythm');
    setRhythmActive(true);
    playerTapsRef.current = [];
    setBeatIndex(0);
    rhythmStartTime.current = Date.now();

    // Clear any existing timeouts
    beatTimeouts.current.forEach(clearTimeout);
    beatTimeouts.current = [];

    // Schedule beat highlights
    BEAT_PATTERN.forEach((time, idx) => {
      const timeout = setTimeout(() => {
        setBeatIndex(idx);
        // Clear highlight after 300ms
        setTimeout(() => setBeatIndex(-1), 300);
      }, time + 1000); // +1s for "get ready"
      beatTimeouts.current.push(timeout);
    });

    // End rhythm game after pattern completes
    const endTimeout = setTimeout(() => {
      checkRhythmResult();
    }, BEAT_PATTERN[BEAT_PATTERN.length - 1] + 1500);
    beatTimeouts.current.push(endTimeout);
  }, [canAccessJukebox]);

  // Handle player tap during rhythm game
  const handleRhythmTap = useCallback(() => {
    if (!rhythmActive || !rhythmStartTime.current) return;

    const tapTime = Date.now() - rhythmStartTime.current - 1000; // Subtract get-ready time
    playerTapsRef.current = [...playerTapsRef.current, tapTime];

    // Visual feedback
    setShowBeatFeedback('tap');
    setTimeout(() => setShowBeatFeedback(null), 150);
  }, [rhythmActive]);

  // Check rhythm result
  const checkRhythmResult = useCallback(() => {
    setRhythmActive(false);

    // Check if player hit all beats within tolerance
    const taps = playerTapsRef.current;

    if (taps.length < BEAT_PATTERN.length - 1) {
      // Too few taps
      setShowWrongAnswer(true);
      setTimeout(() => {
        setShowWrongAnswer(false);
        setPhase('explore');
      }, 2000);
      return;
    }

    // Check timing accuracy
    let hits = 0;
    const usedTaps = new Set();

    BEAT_PATTERN.forEach((beatTime) => {
      for (let i = 0; i < taps.length; i++) {
        if (usedTaps.has(i)) continue;
        if (Math.abs(taps[i] - beatTime) <= TIMING_TOLERANCE) {
          hits++;
          usedTaps.add(i);
          break;
        }
      }
    });

    if (hits >= 4) {
      // Success! (4 out of 5 beats)
      setPhase('success');
      setTimeout(() => {
        onComplete?.();
      }, 2500);
    } else {
      // Failed
      setShowWrongAnswer(true);
      setTimeout(() => {
        setShowWrongAnswer(false);
        setPhase('explore');
        playerTapsRef.current = [];
      }, 2000);
    }
  }, [onComplete]);

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  return (
    <Transition isVisible={isVisible}>
      <div className={styles.room4}>
        {/* Purple/blue lighting overlay */}
        <div className={styles.lightingOverlay} />

        {/* Debug toggle */}
        <button className={styles.debugToggle} onClick={() => setDebugMode((p) => !p)}>
          {debugMode ? 'Hide' : 'Debug'}
        </button>

        {/* Phase indicator */}
        <div className={styles.phaseIndicator}>
          {phase === 'explore' && (
            <p>Find lyric fragments around the bar. {correctCount}/3 correct found.</p>
          )}
          {phase === 'rhythm' && (
            <p>Tap the rhythm! Follow the beat.</p>
          )}
        </div>

        {/* Lyric hotspots (explore phase) */}
        {phase === 'explore' && HOTSPOTS.map((hotspot) => {
          const isCollected = collectedFragments.includes(hotspot.fragmentId);
          return (
            <div
              key={hotspot.id}
              className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''} ${
                isCollected ? styles.hotspotCollected : ''
              }`}
              style={{
                top: hotspot.top,
                left: hotspot.left,
                width: hotspot.width,
                height: hotspot.height,
              }}
              onClick={() => !isCollected && handleHotspotClick(hotspot)}
              title={debugMode ? hotspot.label : ''}
            >
              {debugMode && <span className={styles.hotspotLabel}>{hotspot.label}</span>}
            </div>
          );
        })}

        {/* Fragment popup */}
        {showFragment && (
          <div className={styles.fragmentPopup}>
            <div className={`${styles.fragmentCard} ${showFragment.isCorrect ? styles.fragmentCorrect : styles.fragmentDecoy}`}>
              <p className={styles.fragmentText}>{showFragment.text}</p>
              <p className={styles.fragmentHint}>
                {showFragment.isCorrect ? '✓ This feels right...' : '✗ Not quite...'}
              </p>
            </div>
          </div>
        )}

        {/* Collected fragments display */}
        <div className={styles.collectedBar}>
          <span className={styles.collectedLabel}>Fragments:</span>
          {collectedFragments.map((fragId) => {
            const frag = fragments.find((f) => f.id === fragId);
            return (
              <span
                key={fragId}
                className={`${styles.collectedFragment} ${
                  frag?.isCorrect ? styles.fragmentGood : styles.fragmentBad
                }`}
              >
                {frag?.text}
              </span>
            );
          })}
        </div>

        {/* Jukebox (always visible but interactive only when ready) */}
        <div
          className={`${styles.jukebox} ${canAccessJukebox ? styles.jukeboxReady : ''}`}
          onClick={phase === 'explore' && canAccessJukebox ? startRhythmGame : undefined}
        >
          <div className={styles.jukeboxScreen}>
            {phase === 'explore' && !canAccessJukebox && (
              <p className={styles.jukeboxPrompt}>Find more lyrics first...</p>
            )}
            {phase === 'explore' && canAccessJukebox && (
              <div className={styles.jukeboxReady}>
                <p>Click to play the rhythm</p>
                <p className={styles.songTitle}>"I Love You, I'm Sorry"</p>
              </div>
            )}
            {phase === 'rhythm' && (
              <div className={styles.rhythmGame} onClick={handleRhythmTap}>
                <p className={styles.rhythmInstruction}>TAP when beats light up!</p>
                <div className={styles.beatLane}>
                  {BEAT_PATTERN.map((_, idx) => (
                    <div
                      key={idx}
                      className={`${styles.beatCircle} ${
                        beatIndex === idx ? styles.beatActive : ''
                      }`}
                    />
                  ))}
                </div>
                <div className={`${styles.tapZone} ${showBeatFeedback ? styles.tapFlash : ''}`}>
                  TAP HERE
                </div>
              </div>
            )}
            {phase === 'success' && (
              <div className={styles.successMessage}>
                <p>Yes... that's the one.</p>
                <p className={styles.songMemory}>"I Love You, I'm Sorry"</p>
              </div>
            )}
            {showWrongAnswer && phase !== 'success' && (
              <div className={styles.wrongChoice}>
                <p>The rhythm wasn't quite right...</p>
                <p className={styles.tryAgain}>Try again.</p>
              </div>
            )}
          </div>
          <div className={styles.jukeboxGlow} />
        </div>

        {/* Bottom panel */}
        <div className={styles.bottomPanel}>
          <p className={styles.prompt}>
            "Which song holds the memory? Find its words, then feel its beat."
          </p>
          <div className={styles.controls}>
            <HintButton hints={HINTS} onHintUsed={handleHintUsed} roomId={4} />
          </div>
        </div>

        {/* Easter egg: "The Largest" red flash */}
        {largestEasterEgg && (
          <div className={styles.largestEasterEgg}>
            <div className={styles.redFlashOverlay} />
            <div className={styles.largestText}>
              BIG X DA PLUG! 🔥
            </div>
          </div>
        )}
      </div>
    </Transition>
  );
}

export default Room4Music;
