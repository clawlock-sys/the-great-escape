import { useState, useEffect, useCallback } from 'react';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useAudio } from '../hooks/useAudio';
import styles from '../styles/Room2.module.css';

// Zone definitions for the apartment
const ZONES = {
  living: {
    id: 'living',
    name: 'Living Room',
    background: '/assets/room2/zone-living.png',
    // Clickable area on overview
    overviewPosition: { top: '20%', left: '5%', width: '35%', height: '75%' },
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    background: '/assets/room2/zone-kitchen.png',
    overviewPosition: { top: '20%', left: '35%', width: '30%', height: '75%' },
  },
  bedroom: {
    id: 'bedroom',
    name: 'Bedroom',
    background: '/assets/room2/zone-bedroom.png',
    overviewPosition: { top: '20%', left: '60%', width: '38%', height: '75%' },
  },
};

// Nash photo locations with letters - spells ILLANDO
// Positions are now relative to their ZONE backgrounds
const NASH_PHOTOS = [
  {
    id: 1,
    location: 'couch cushion',
    zone: 'living',
    letter: 'I',
    hint: 'Behind the couch cushion',
    image: '/assets/room2/nash1.jpeg',
    // Position within zoomed living room view
    position: { top: '55%', left: '60%', width: '8%', height: '10%' },
  },
  {
    id: 2,
    location: 'fridge',
    zone: 'kitchen',
    letter: 'L',
    hint: 'Inside the fridge',
    image: '/assets/room2/nash2.JPEG',
    position: { top: '30%', left: '20%', width: '7%', height: '12%' },
  },
  {
    id: 3,
    location: 'bedroom wall',
    zone: 'bedroom',
    letter: 'L',
    hint: 'Hanging on the bedroom wall',
    image: '/assets/room2/nash3.png',
    position: { top: '25%', left: '15%', width: '8%', height: '10%' },
  },
  {
    id: 4,
    location: 'bookshelf',
    zone: 'living',
    letter: 'A',
    hint: 'Inside a book on the shelf',
    image: '/assets/room2/nash4.jpeg',
    position: { top: '35%', left: '25%', width: '6%', height: '8%' },
  },
  {
    id: 5,
    location: 'under table',
    zone: 'kitchen',
    letter: 'N',
    hint: 'Taped under the table',
    image: '/assets/room2/nash5.jpeg',
    position: { top: '75%', left: '55%', width: '8%', height: '8%' },
  },
  {
    id: 6,
    location: 'dresser drawer',
    zone: 'bedroom',
    letter: 'D',
    hint: 'In the dresser drawer',
    image: '/assets/room2/nash6.jpeg',
    position: { top: '60%', left: '70%', width: '7%', height: '10%' },
  },
  {
    id: 7,
    location: 'kitchen cabinet',
    zone: 'kitchen',
    letter: 'O',
    hint: 'In the kitchen cabinets',
    image: '/assets/room2/nash7.jpeg',
    position: { top: '20%', left: '65%', width: '8%', height: '10%' },
  },
  {
    id: 8,
    location: 'mirror',
    zone: 'bedroom',
    letter: '?',
    hint: 'In the mirror reflection',
    image: '/assets/room2/nash3.png',
    position: { top: '40%', left: '45%', width: '8%', height: '12%' },
    requiresAllOthers: true,
  },
];

// Interactive objects per zone (red herrings with flavor text)
const INTERACTIVE_OBJECTS = {
  living: [
    { id: 'tv', name: 'TV', position: { top: '30%', left: '45%', width: '15%', height: '20%' }, text: 'The TV is off. Your reflection stares back, distorted.' },
    { id: 'plant', name: 'Plant', position: { top: '20%', left: '80%', width: '10%', height: '25%' }, text: 'A healthy monstera. No secrets hidden in its leaves.' },
    { id: 'rug', name: 'Rug', position: { top: '70%', left: '40%', width: '25%', height: '15%' }, text: 'You lift the rug. Just dust bunnies.' },
    { id: 'lamp', name: 'Lamp', position: { top: '25%', left: '10%', width: '8%', height: '20%' }, text: 'The lamp flickers. For a moment, you see a shadow...' },
    { id: 'window-living', name: 'Window', position: { top: '15%', left: '55%', width: '20%', height: '30%' }, text: 'San Diego sunshine streams in. Nothing unusual outside.' },
  ],
  kitchen: [
    { id: 'sink', name: 'Sink', position: { top: '40%', left: '40%', width: '12%', height: '15%' }, text: 'Dishes from last night. A coffee mug reads "World\'s Best..."' },
    { id: 'stove', name: 'Stove', position: { top: '35%', left: '75%', width: '15%', height: '20%' }, text: 'The stovetop is cold. Someone was cooking pasta recently.' },
    { id: 'fruit-bowl', name: 'Fruit Bowl', position: { top: '65%', left: '30%', width: '10%', height: '10%' }, text: 'Bananas going brown. Nothing hidden underneath.' },
    { id: 'calendar', name: 'Calendar', position: { top: '20%', left: '10%', width: '8%', height: '12%' }, text: 'February 2025. A date is circled in red: the 14th.' },
    { id: 'toaster', name: 'Toaster', position: { top: '45%', left: '55%', width: '8%', height: '8%' }, text: 'A normal toaster. Why did you check this?' },
  ],
  bedroom: [
    { id: 'pillow', name: 'Pillow', position: { top: '55%', left: '25%', width: '15%', height: '12%' }, text: 'You fluff the pillow. Something red catches your eye... just a thread.' },
    { id: 'closet', name: 'Closet', position: { top: '30%', left: '85%', width: '12%', height: '40%' }, text: 'Clothes hanging neatly. A familiar hoodie you\'ve borrowed.' },
    { id: 'nightstand', name: 'Nightstand', position: { top: '50%', left: '10%', width: '10%', height: '15%' }, text: 'A book, a glass of water, and a charging phone. Nothing unusual.' },
    { id: 'biggie-bed', name: 'Something Red', position: { top: '48%', left: '40%', width: '10%', height: '12%' }, text: '"Not yet." The red bunny seems to whisper.', isBiggie: true },
    { id: 'window-bedroom', name: 'Window', position: { top: '15%', left: '55%', width: '18%', height: '25%' }, text: 'The window lock catches your attention...' , triggersWindowPuzzle: true },
  ],
};

// Fake Nashes per zone
const FAKE_NASHES = {
  living: [
    { id: 'fake-living-1', position: { top: '65%', left: '15%', width: '8%', height: '10%' }, image: '/assets/room2/decoy1.jpeg' },
  ],
  kitchen: [
    { id: 'fake-kitchen-1', position: { top: '55%', left: '15%', width: '7%', height: '9%' }, image: '/assets/room2/decoy2.png' },
  ],
  bedroom: [
    { id: 'fake-bedroom-1', position: { top: '70%', left: '55%', width: '8%', height: '10%' }, image: '/assets/room2/decoy1.jpeg' },
  ],
};

// Window lock puzzle
const TARGET_WORD = ['I', 'L', 'L', 'A', 'N', 'D', 'O'];

const generateDialOptions = (correctLetter) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const others = alphabet.split('').filter((l) => l !== correctLetter);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 4);
  return [correctLetter, ...shuffled].sort(() => Math.random() - 0.5);
};

const DIAL_OPTIONS = TARGET_WORD.map(generateDialOptions);

const generateInitialDialValues = () => {
  return TARGET_WORD.map((_, idx) => {
    const correctPos = DIAL_OPTIONS[idx].indexOf(TARGET_WORD[idx]);
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
  const [activeZone, setActiveZone] = useState(null); // null = overview, 'living'|'kitchen'|'bedroom' = zoomed
  const [foundNashes, setFoundNashes] = useState(new Set());
  const [showModal, setShowModal] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Window lock puzzle state
  const [showWindowZoom, setShowWindowZoom] = useState(false);
  const [showDialPuzzle, setShowDialPuzzle] = useState(false);
  const [dialValues, setDialValues] = useState(() => generateInitialDialValues());
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);

  // Audio
  const ambient = useAudio('/audio/ambient-lofi.mp3', { loop: true, volume: 0.3 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // Count real photos found (excluding mirror)
  const realPhotosFound = [...foundNashes].filter((id) => {
    const photo = NASH_PHOTOS.find((p) => p.id === id);
    return photo && !photo.requiresAllOthers;
  }).length;

  const mirrorUnlocked = realPhotosFound >= 7;

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  const handleZoneClick = (zoneId) => {
    setActiveZone(zoneId);
  };

  const handleBackToOverview = () => {
    setActiveZone(null);
  };

  const handleNashClick = (nash) => {
    if (nash.requiresAllOthers && !mirrorUnlocked) return;

    setFoundNashes((prev) => new Set([...prev, nash.id]));
    setShowModal({
      type: 'nash',
      nash,
      isNew: !foundNashes.has(nash.id),
      nashedMessage: NASHED_MESSAGES[Math.floor(Math.random() * NASHED_MESSAGES.length)],
    });
  };

  const handleFakeNashClick = (fake) => {
    setShowModal({ type: 'fake', id: fake.id, image: fake.image });
  };

  const handleObjectClick = (obj) => {
    if (obj.triggersWindowPuzzle) {
      setShowWindowZoom(true);
    } else {
      setShowModal({ type: 'object', text: obj.text, isBiggie: obj.isBiggie });
    }
  };

  const closeModal = () => setShowModal(null);

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

  // Letter display for progress
  const targetWord = [
    { letter: 'I', nashId: 1 },
    { letter: 'L', nashId: 2 },
    { letter: 'L', nashId: 3 },
    { letter: 'A', nashId: 4 },
    { letter: 'N', nashId: 5 },
    { letter: 'D', nashId: 6 },
    { letter: 'O', nashId: 7 },
  ];

  // Get Nash photos for current zone
  const currentZoneNashes = activeZone
    ? NASH_PHOTOS.filter((n) => n.zone === activeZone)
    : [];

  // Get interactive objects for current zone
  const currentZoneObjects = activeZone ? INTERACTIVE_OBJECTS[activeZone] || [] : [];

  // Get fake Nashes for current zone
  const currentZoneFakes = activeZone ? FAKE_NASHES[activeZone] || [] : [];

  return (
    <Transition isVisible={isVisible}>
      <div
        className={styles.room2}
        style={activeZone ? {
          backgroundImage: `url('${import.meta.env.BASE_URL}${ZONES[activeZone].background.slice(1)}')`
        } : undefined}
      >
        {/* Overview Mode: Zone Selection */}
        {!activeZone && (
          <>
            <div className={styles.overviewTitle}>
              <h2>The Apartment</h2>
              <p>Click a room to explore</p>
            </div>

            {Object.values(ZONES).map((zone) => {
              const nashesInZone = NASH_PHOTOS.filter((n) => n.zone === zone.id && !n.requiresAllOthers);
              const foundInZone = nashesInZone.filter((n) => foundNashes.has(n.id)).length;

              return (
                <div
                  key={zone.id}
                  className={`${styles.zoneSelector} ${debugMode ? styles.hotspotDebug : ''}`}
                  style={{
                    top: zone.overviewPosition.top,
                    left: zone.overviewPosition.left,
                    width: zone.overviewPosition.width,
                    height: zone.overviewPosition.height,
                  }}
                  onClick={() => handleZoneClick(zone.id)}
                >
                  <div className={styles.zoneSelectorLabel}>
                    <span className={styles.zoneName}>{zone.name}</span>
                    <span className={styles.zoneProgress}>
                      {foundInZone}/{nashesInZone.length} found
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Zoomed Zone Mode */}
        {activeZone && (
          <>
            {/* Back button */}
            <button className={styles.backButton} onClick={handleBackToOverview}>
              ← Back to Overview
            </button>

            {/* Zone title */}
            <div className={styles.zoneTitle}>
              {ZONES[activeZone].name}
            </div>

            {/* Interactive objects (red herrings) */}
            {currentZoneObjects.map((obj) => (
              <div
                key={obj.id}
                className={`${styles.hotspot} ${styles.objectHotspot} ${debugMode ? styles.hotspotDebug : ''}`}
                style={{
                  top: obj.position.top,
                  left: obj.position.left,
                  width: obj.position.width,
                  height: obj.position.height,
                }}
                onClick={() => handleObjectClick(obj)}
                title={debugMode ? obj.name : ''}
              >
                {debugMode && <span className={styles.hotspotLabel}>{obj.name.charAt(0)}</span>}
              </div>
            ))}

            {/* Fake Nashes */}
            {currentZoneFakes.map((fake) => (
              <div
                key={fake.id}
                className={`${styles.hotspot} ${styles.fakeHotspot} ${debugMode ? styles.hotspotDebug : ''}`}
                style={{
                  top: fake.position.top,
                  left: fake.position.left,
                  width: fake.position.width,
                  height: fake.position.height,
                }}
                onClick={() => handleFakeNashClick(fake)}
                title={debugMode ? 'Fake' : ''}
              >
                {debugMode && <span className={styles.hotspotLabel}>F</span>}
              </div>
            ))}

            {/* Nash photos in this zone */}
            {currentZoneNashes.map((nash) => {
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
                  title={debugMode ? `Nash ${nash.id}` : ''}
                >
                  {debugMode && <span className={styles.hotspotLabel}>N{nash.id}</span>}
                  {isFound && <span className={styles.foundMarker}>✓</span>}
                </div>
              );
            })}
          </>
        )}

        {/* Debug toggle */}
        <button className={styles.debugToggle} onClick={() => setDebugMode((p) => !p)}>
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
            {activeZone
              ? `Searching ${ZONES[activeZone].name}...`
              : '"I\'m everywhere but nowhere. Come find me."'}
          </p>
          {!activeZone && (
            <HintButton hints={HINTS} onHintUsed={handleHintUsed} roomId={2} />
          )}
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
                onClick={() => setShowDialPuzzle(true)}
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
                      <p className={styles.dialWrongAnswer}>Wrong combination...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Nash/Fake/Object */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={closeModal}>×</button>

              {showModal.type === 'nash' && (
                <div className={styles.nashModal}>
                  <div className={`${styles.nashPhoto} ${showModal.nash.id === 3 ? styles.photoCover : ''}`}>
                    <img
                      src={`${import.meta.env.BASE_URL}${showModal.nash.image.slice(1)}`}
                      alt="Nash"
                    />
                  </div>
                  {showModal.nash.letter === '?' ? (
                    <p className={styles.nashMessage}>*Nash holds up a sign with a single "?"*</p>
                  ) : (
                    <>
                      <p className={styles.nashMessage}>{showModal.nashedMessage}</p>
                      <div className={styles.revealedLetter}>{showModal.nash.letter}</div>
                    </>
                  )}
                  <p className={styles.locationHint}>Found: {showModal.nash.hint}</p>
                </div>
              )}

              {showModal.type === 'fake' && (
                <div className={styles.fakeModal}>
                  <div className={styles.fakePhoto}>
                    <img
                      src={`${import.meta.env.BASE_URL}${showModal.image.slice(1)}`}
                      alt="Not Nash"
                    />
                  </div>
                  <p className={styles.fakeMessage}>That's not him...</p>
                </div>
              )}

              {showModal.type === 'object' && (
                <div className={styles.objectModal}>
                  <p className={showModal.isBiggie ? styles.biggieMessage : styles.objectText}>
                    {showModal.text}
                  </p>
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
