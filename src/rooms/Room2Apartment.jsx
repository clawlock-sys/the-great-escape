import { useState, useEffect, useCallback } from 'react';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useAudio } from '../hooks/useAudio';
import styles from '../styles/Room2.module.css';

// Nash photo locations with letters - spells ILLANDO
const NASH_PHOTOS = [
  {
    id: 1,
    location: 'couch',
    zone: 'living',
    letter: 'I',
    hint: 'Behind the couch cushion',
    image: '/assets/room2/nash1.jpeg',
    position: { top: '50%', left: '38%', width: '10%', height: '12%' },
  },
  {
    id: 2,
    location: 'fridge',
    zone: 'kitchen',
    letter: 'L',
    hint: 'Inside the fridge',
    image: '/assets/room2/nash2.JPEG',
    position: { top: '28%', left: '44%', width: '8%', height: '18%' },
  },
  {
    id: 3,
    location: 'bedroom wall',
    zone: 'bedroom',
    letter: 'L',
    hint: 'Hanging on the bedroom wall',
    image: '/assets/room2/nash3.png',
    position: { top: '38%', left: '74%', width: '10%', height: '12%' },
  },
  {
    id: 4,
    location: 'book',
    zone: 'living',
    letter: 'A',
    hint: 'Inside a book on the shelf',
    image: '/assets/room2/nash4.jpeg',
    position: { top: '65%', left: '24%', width: '6%', height: '8%' },
  },
  {
    id: 5,
    location: 'table',
    zone: 'kitchen',
    letter: 'N',
    hint: 'Taped under the table',
    image: '/assets/room2/nash5.jpeg',
    position: { top: '68%', left: '45%', width: '12%', height: '10%' },
  },
  {
    id: 6,
    location: 'dresser',
    zone: 'bedroom',
    letter: 'D',
    hint: 'In the dresser drawer',
    image: '/assets/room2/nash6.jpeg',
    position: { top: '42%', left: '58%', width: '8%', height: '12%' },
  },
  {
    id: 7,
    location: 'cabinets',
    zone: 'kitchen',
    letter: 'O',
    hint: 'In the kitchen cabinets',
    image: '/assets/room2/nash7.jpeg',
    position: { top: '20%', left: '55%', width: '10%', height: '10%' },
  },
  {
    id: 8,
    location: 'mirror',
    zone: 'bedroom',
    letter: '?',
    hint: 'In the mirror reflection',
    image: '/assets/room2/nash3.png', // Reuse image for mirror
    position: { top: '38%', left: '71%', width: '8%', height: '12%' },
    requiresAllOthers: true, // Only visible after finding 7 real photos
  },
];

// Red herring fake Nashes
const FAKE_NASHES = [
  {
    id: 'fake1',
    image: '/assets/room2/decoy1.jpeg',
    position: { top: '58%', left: '22%', width: '10%', height: '10%' }, // TV area
  },
  {
    id: 'fake2',
    image: '/assets/room2/decoy2.png',
    position: { top: '42%', left: '52%', width: '8%', height: '8%' }, // Table by fridge
  },
];

// Biggie on the bed
const BIGGIE_POSITION = { top: '52%', left: '72%', width: '8%', height: '10%' };

// Window lock puzzle
const WINDOW_POSITION = { top: '32%', left: '16%', width: '14%', height: '25%' };
const TARGET_WORD = ['I', 'L', 'L', 'A', 'N', 'D', 'O'];

// Generate dial options: correct letter + 4 random
const generateDialOptions = (correctLetter) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const others = alphabet.split('').filter((l) => l !== correctLetter);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 4);
  const options = [correctLetter, ...shuffled].sort(() => Math.random() - 0.5);
  return options;
};

// Pre-generate dial options (static per session)
const DIAL_OPTIONS = TARGET_WORD.map(generateDialOptions);

// Generate random initial dial positions (not showing the answer)
const generateInitialDialValues = () => {
  return TARGET_WORD.map((_, idx) => {
    // Find the correct answer position
    const correctPos = DIAL_OPTIONS[idx].indexOf(TARGET_WORD[idx]);
    // Pick a random position that's NOT the correct one
    let pos;
    do {
      pos = Math.floor(Math.random() * 5);
    } while (pos === correctPos);
    return pos;
  });
};

const HINTS = [
  "He's everywhere. Eight times, to be exact. But one is lying.",
  'Each face holds a letter. The letters hold a place.',
  'I-L-L-A-N-D-O. The place where the night was perfect.',
];

// Variants of the "nashed" message
const NASHED_MESSAGES = [
  "YOU JUST GOT NASHED!",
  "NASHED AGAIN!",
  "GET NASHED, LOSER!",
  "NASH'D!",
  "YOU'VE BEEN NASHED!",
  "BOOM! NASHED!",
  "NASHED TO THE MAX!",
];

export function Room2Apartment({ onComplete, onHintUsed }) {
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [foundNashes, setFoundNashes] = useState(new Set());
  const [showModal, setShowModal] = useState(null);
  const [debugMode, setDebugMode] = useState(true); // Enabled by default for hotspot alignment

  // Window lock puzzle state
  const [showWindowZoom, setShowWindowZoom] = useState(false);
  const [showDialPuzzle, setShowDialPuzzle] = useState(false);
  const [dialValues, setDialValues] = useState(() => generateInitialDialValues()); // Random start, not the answer

  // Audio
  const ambient = useAudio('/audio/ambient-lofi.mp3', { loop: true, volume: 0.3 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // Count real (non-decoy) photos found
  const realPhotosFound = [...foundNashes].filter((id) => {
    const photo = NASH_PHOTOS.find((p) => p.id === id);
    return photo && !photo.isDecoy && !photo.requiresAllOthers;
  }).length;

  // Mirror Nash only appears after 7 real photos found
  const mirrorUnlocked = realPhotosFound >= 7;

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  const handleNashClick = (nash) => {
    // Check if mirror and not unlocked
    if (nash.requiresAllOthers && !mirrorUnlocked) {
      return; // Can't click yet
    }

    setFoundNashes((prev) => new Set([...prev, nash.id]));

    setShowModal({
      type: 'nash',
      nash,
      isNew: !foundNashes.has(nash.id),
      nashedMessage: NASHED_MESSAGES[Math.floor(Math.random() * NASHED_MESSAGES.length)],
    });
  };

  const handleFakeNashClick = (fake) => {
    setShowModal({
      type: 'fake',
      id: fake.id,
    });
  };

  const handleBiggieClick = () => {
    setShowModal({
      type: 'biggie',
    });
  };

  const closeModal = () => {
    setShowModal(null);
  };

  // Window lock puzzle handlers
  const handleWindowClick = () => {
    setShowWindowZoom(true);
  };

  const handleLockClick = () => {
    setShowDialPuzzle(true);
  };

  const handleDialRotate = (dialIndex, direction) => {
    setDialValues((prev) => {
      const newValues = [...prev];
      newValues[dialIndex] = (newValues[dialIndex] + direction + 5) % 5;
      return newValues;
    });
  };

  const checkDialSolution = () => {
    return dialValues.every((val, idx) => DIAL_OPTIONS[idx][val] === TARGET_WORD[idx]);
  };

  const toggleDebug = () => {
    setDebugMode((prev) => !prev);
  };

  // The target word with Nash ID positions: I(1) L(2) L(3) A(4) N(5) D(6) O(7)
  const targetWord = [
    { letter: 'I', nashId: 1 },
    { letter: 'L', nashId: 2 },
    { letter: 'L', nashId: 3 },
    { letter: 'A', nashId: 4 },
    { letter: 'N', nashId: 5 },
    { letter: 'D', nashId: 6 },
    { letter: 'O', nashId: 7 },
  ];

  return (
    <Transition isVisible={isVisible}>
      <div className={styles.room2}>
        {/* Zone labels for context */}
        <div className={styles.zoneLabel} style={{ top: '10%', left: '5%' }}>
          Living Room
        </div>
        <div className={styles.zoneLabel} style={{ top: '10%', left: '50%' }}>
          Kitchen
        </div>
        <div className={styles.zoneLabel} style={{ top: '10%', left: '85%' }}>
          Bedroom
        </div>

        {/* Nash photo hotspots */}
        {NASH_PHOTOS.map((nash) => {
          const isFound = foundNashes.has(nash.id);
          const isVisible = !nash.requiresAllOthers || mirrorUnlocked;

          if (!isVisible) return null;

          return (
            <div
              key={nash.id}
              className={`${styles.hotspot} ${styles.nashHotspot} ${
                isFound ? styles.nashFound : ''
              } ${debugMode ? styles.hotspotDebug : ''}`}
              style={{
                top: nash.position.top,
                left: nash.position.left,
                width: nash.position.width,
                height: nash.position.height,
              }}
              onClick={() => handleNashClick(nash)}
              title={debugMode ? `Nash ${nash.id}: ${nash.location}` : ''}
            >
              {debugMode && <span className={styles.hotspotLabel}>N{nash.id}</span>}
              {isFound && <span className={styles.foundMarker}>✓</span>}
            </div>
          );
        })}

        {/* Fake Nash hotspots */}
        {FAKE_NASHES.map((fake) => (
          <div
            key={fake.id}
            className={`${styles.hotspot} ${styles.fakeHotspot} ${
              debugMode ? styles.hotspotDebug : ''
            }`}
            style={{
              top: fake.position.top,
              left: fake.position.left,
              width: fake.position.width,
              height: fake.position.height,
            }}
            onClick={() => handleFakeNashClick(fake)}
            title={debugMode ? `Fake: ${fake.id}` : ''}
          >
            {debugMode && <span className={styles.hotspotLabel}>F</span>}
          </div>
        ))}

        {/* Biggie on bed */}
        <div
          className={`${styles.hotspot} ${styles.biggieHotspot} ${
            debugMode ? styles.hotspotDebug : ''
          }`}
          style={{
            top: BIGGIE_POSITION.top,
            left: BIGGIE_POSITION.left,
            width: BIGGIE_POSITION.width,
            height: BIGGIE_POSITION.height,
          }}
          onClick={handleBiggieClick}
          title={debugMode ? 'Biggie' : ''}
        >
          {debugMode && <span className={styles.hotspotLabel}>B</span>}
        </div>

        {/* Window hotspot */}
        <div
          className={`${styles.hotspot} ${styles.windowHotspot} ${
            debugMode ? styles.hotspotDebug : ''
          }`}
          style={{
            top: WINDOW_POSITION.top,
            left: WINDOW_POSITION.left,
            width: WINDOW_POSITION.width,
            height: WINDOW_POSITION.height,
          }}
          onClick={handleWindowClick}
          title={debugMode ? 'Window' : ''}
        >
          {debugMode && <span className={styles.hotspotLabel}>W</span>}
        </div>

        {/* Debug toggle */}
        <button className={styles.debugToggle} onClick={toggleDebug}>
          {debugMode ? 'Hide' : 'Debug'}
        </button>

        {/* Progress panel */}
        <div className={styles.progressPanel}>
          <div className={styles.nashCount}>
            Nash Photos: {foundNashes.size}/{NASH_PHOTOS.length}
          </div>
          <div className={styles.letterDisplay}>
            {targetWord.map((slot, idx) => {
              const isFound = foundNashes.has(slot.nashId);
              return (
                <span
                  key={idx}
                  className={`${styles.letterSlot} ${isFound ? styles.letterFound : ''}`}
                >
                  {isFound ? slot.letter : '?'}
                </span>
              );
            })}
          </div>
          {mirrorUnlocked && !foundNashes.has(8) && (
            <div className={styles.mirrorHint}>
              Something appeared in the mirror...
            </div>
          )}
        </div>

        {/* Bottom panel */}
        <div className={styles.bottomPanel}>
          <p className={styles.prompt}>
            "I'm everywhere but nowhere. Come find me."
          </p>
        </div>

        {/* Window zoom modal */}
        {showWindowZoom && (
          <div
            className={styles.windowZoomOverlay}
            onClick={() => !showDialPuzzle && setShowWindowZoom(false)}
          >
            <div className={styles.windowZoomContainer} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowWindowZoom(false);
                  setShowDialPuzzle(false);
                }}
              >
                ×
              </button>

              <img
                src={`${import.meta.env.BASE_URL}assets/room2/Lock.png`}
                alt="Window Lock"
                className={styles.lockImage}
                onClick={handleLockClick}
              />

              {showDialPuzzle && (
                <div className={styles.dialPuzzleContainer}>
                  <div className={styles.dialPuzzle}>
                    {DIAL_OPTIONS.map((options, idx) => (
                      <div key={idx} className={styles.dialContainer}>
                        <button onClick={() => handleDialRotate(idx, -1)}>▲</button>
                        <div className={styles.dialDisplay}>{options[dialValues[idx]]}</div>
                        <button onClick={() => handleDialRotate(idx, 1)}>▼</button>
                      </div>
                    ))}
                    <button
                      className={styles.submitDial}
                      onClick={() => {
                        if (checkDialSolution()) {
                          onComplete?.();
                        } else {
                          setShowWrongAnswer(true);
                          setTimeout(() => setShowWrongAnswer(false), 2000);
                        }
                      }}
                    >
                      Unlock
                    </button>
                  </div>
                  <div className={styles.dialControls}>
                    <HintButton hints={HINTS} onHintUsed={handleHintUsed} roomId={2} />
                    {showWrongAnswer && (
                      <p className={styles.dialWrongAnswer}>
                        Wrong combination...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={closeModal}>
                ×
              </button>

              {showModal.type === 'nash' && (
                <div className={styles.nashModal}>
                  <div className={`${styles.nashPhoto} ${showModal.nash.id === 3 ? styles.photoCover : ''}`}>
                    <img
                      src={`${import.meta.env.BASE_URL}${showModal.nash.image.slice(1)}`}
                      alt="Nash"
                    />
                  </div>

                  {showModal.nash.isDecoy ? (
                    <p className={styles.nashMessage}>
                      *Nash waves cheerfully but holds nothing*
                    </p>
                  ) : showModal.nash.letter === '?' ? (
                    <p className={styles.nashMessage}>
                      *Nash holds up a sign with a single "?"*
                    </p>
                  ) : (
                    <>
                      <p className={styles.nashMessage}>
                        {showModal.nashedMessage}
                      </p>
                      <div className={styles.revealedLetter}>
                        {showModal.nash.letter}
                      </div>
                    </>
                  )}

                  <p className={styles.locationHint}>
                    Found: {showModal.nash.hint}
                  </p>
                </div>
              )}

              {showModal.type === 'fake' && (
                <div className={styles.fakeModal}>
                  <div className={styles.fakePhoto}>
                    <img
                      src={`${import.meta.env.BASE_URL}${FAKE_NASHES.find(f => f.id === showModal.id).image.slice(1)}`}
                      alt="Not Nash"
                    />
                  </div>
                  <p className={styles.fakeMessage}>That's not him...</p>
                </div>
              )}

              {showModal.type === 'biggie' && (
                <div className={styles.biggieModal}>
                  <div className={styles.biggieImage}>
                    <img
                      src={`${import.meta.env.BASE_URL}assets/room2/biggie.jpeg`}
                      alt="Biggie"
                    />
                  </div>
                  <p className={styles.biggieMessage}>"Not yet."</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Transition>
  );
}

export default Room2Apartment;
