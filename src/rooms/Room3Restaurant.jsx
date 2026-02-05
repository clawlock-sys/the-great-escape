import { useState, useEffect, useCallback, useMemo } from 'react';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useAudio } from '../hooks/useAudio';
import { validate } from '../utils/solutions';
import styles from '../styles/Room3.module.css';

// Letters for the puzzle: FEBRUARY EIGHTH (their first date) + decoys (O, C, N)
const SOLUTION_LETTERS = ['F', 'E', 'B', 'R', 'U', 'A', 'R', 'Y', 'E', 'I', 'G', 'H', 'T', 'H'];
const DECOY_LETTERS = ['O', 'C', 'N'];
const ALL_LETTERS = [...SOLUTION_LETTERS, ...DECOY_LETTERS];

// Shuffle array helper
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create initial tiles with unique IDs
const createInitialTiles = () => {
  const shuffled = shuffleArray(ALL_LETTERS);
  return shuffled.map((letter, index) => ({
    id: `tile-${index}`,
    letter,
    inSlot: null, // null = on table, number = slot index
  }));
};

// Hotspot positions for misdirections
const HOTSPOTS = {
  menu: { top: '35%', left: '25%', width: '12%', height: '15%' },
  wine: { top: '30%', left: '55%', width: '8%', height: '20%' },
  receipt: { top: '50%', left: '40%', width: '10%', height: '8%' },
  candle: { top: '25%', left: '45%', width: '6%', height: '12%' },
  breadsticks: { top: '45%', left: '60%', width: '10%', height: '10%' },
};

const HINTS = [
  'The tiles remember a day. Not a place.',
  'When did you first sit across from each other here?',
  'Unscramble: FEBRUARY EIGHTH — your first date.',
];

export function Room3Restaurant({ onComplete, onHintUsed }) {
  // Initialize tiles with useMemo to avoid re-shuffle on re-render
  const initialTiles = useMemo(() => createInitialTiles(), []);

  const [tiles, setTiles] = useState(initialTiles);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [candleFlicker, setCandleFlicker] = useState(false);
  const [showBreadstickMsg, setShowBreadstickMsg] = useState(false);

  // Audio
  const ambient = useAudio('/audio/ambient-jazz.mp3', { loop: true, volume: 0.25 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // Get tiles currently in answer slots (sorted by slot index)
  const getAnswerWord = useCallback(() => {
    const slotTiles = tiles
      .filter((t) => t.inSlot !== null)
      .sort((a, b) => a.inSlot - b.inSlot);
    return slotTiles.map((t) => t.letter).join('');
  }, [tiles]);

  // Handle tile click
  const handleTileClick = useCallback((tileId) => {
    if (selectedTileId === null) {
      // Select this tile
      setSelectedTileId(tileId);
    } else if (selectedTileId === tileId) {
      // Deselect
      setSelectedTileId(null);
    } else {
      // Swap the two tiles' positions
      setTiles((prev) => {
        const newTiles = [...prev];
        const tile1 = newTiles.find((t) => t.id === selectedTileId);
        const tile2 = newTiles.find((t) => t.id === tileId);
        if (tile1 && tile2) {
          const tempSlot = tile1.inSlot;
          tile1.inSlot = tile2.inSlot;
          tile2.inSlot = tempSlot;
        }
        return newTiles;
      });
      setSelectedTileId(null);
    }
  }, [selectedTileId]);

  // Handle clicking an empty answer slot
  const handleSlotClick = useCallback((slotIndex) => {
    if (selectedTileId === null) return;

    // Check if slot is already occupied
    const occupyingTile = tiles.find((t) => t.inSlot === slotIndex);
    if (occupyingTile) {
      // Swap: selected tile goes to slot, occupying tile goes to selected's old position
      setTiles((prev) => {
        const newTiles = [...prev];
        const selectedTile = newTiles.find((t) => t.id === selectedTileId);
        const slotTile = newTiles.find((t) => t.inSlot === slotIndex);
        if (selectedTile && slotTile) {
          const tempSlot = selectedTile.inSlot;
          selectedTile.inSlot = slotIndex;
          slotTile.inSlot = tempSlot;
        }
        return newTiles;
      });
    } else {
      // Move selected tile to empty slot
      setTiles((prev) =>
        prev.map((t) =>
          t.id === selectedTileId ? { ...t, inSlot: slotIndex } : t
        )
      );
    }
    setSelectedTileId(null);
  }, [selectedTileId, tiles]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    const answer = getAnswerWord();
    const isValid = validate(3, answer);

    if (isValid) {
      onComplete?.();
    } else {
      setShowWrongAnswer(true);
      setIsShaking(true);
      setTimeout(() => {
        setShowWrongAnswer(false);
        setIsShaking(false);
      }, 2000);
    }
  }, [getAnswerWord, onComplete]);

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  // Misdirection handlers
  const handleCandleClick = () => {
    setCandleFlicker(true);
    setTimeout(() => setCandleFlicker(false), 500);
  };

  const handleBreadsticksClick = () => {
    setShowBreadstickMsg(true);
    setTimeout(() => setShowBreadstickMsg(false), 2000);
  };

  // Tiles on table (not in slots)
  const tableTiles = tiles.filter((t) => t.inSlot === null);

  // Create array of 14 slots (FEBRUARY EIGHTH = 14 letters)
  const answerSlots = Array.from({ length: 14 }, (_, i) => {
    const tileInSlot = tiles.find((t) => t.inSlot === i);
    return { index: i, tile: tileInSlot };
  });

  return (
    <Transition isVisible={isVisible}>
      <div className={styles.room3}>
        {/* Candlelit overlay */}
        <div className={`${styles.candleOverlay} ${candleFlicker ? styles.flicker : ''}`} />

        {/* Debug toggle */}
        <button className={styles.debugToggle} onClick={() => setDebugMode((p) => !p)}>
          {debugMode ? 'Hide' : 'Debug'}
        </button>

        {/* Misdirection hotspots */}
        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.menu}
          onClick={() => setShowModal('menu')}
          title={debugMode ? 'Menu' : ''}
        >
          {debugMode && <span className={styles.hotspotLabel}>Menu</span>}
        </div>

        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.wine}
          onClick={() => setShowModal('wine')}
          title={debugMode ? 'Wine' : ''}
        >
          {debugMode && <span className={styles.hotspotLabel}>Wine</span>}
        </div>

        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.receipt}
          onClick={() => setShowModal('receipt')}
          title={debugMode ? 'Receipt' : ''}
        >
          {debugMode && <span className={styles.hotspotLabel}>Receipt</span>}
        </div>

        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.candle}
          onClick={handleCandleClick}
          title={debugMode ? 'Candle' : ''}
        >
          {debugMode && <span className={styles.hotspotLabel}>Candle</span>}
        </div>

        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.breadsticks}
          onClick={handleBreadsticksClick}
          title={debugMode ? 'Bread' : ''}
        >
          {debugMode && <span className={styles.hotspotLabel}>Bread</span>}
        </div>

        {/* Breadstick message */}
        {showBreadstickMsg && (
          <div className={styles.breadstickMsg}>
            Just breadsticks. Delicious, but not helpful.
          </div>
        )}

        {/* Tile area - scattered on table */}
        <div className={styles.tileArea}>
          {tableTiles.map((tile) => (
            <div
              key={tile.id}
              className={`${styles.tile} ${
                selectedTileId === tile.id ? styles.tileSelected : ''
              } ${isShaking ? styles.tileShake : ''}`}
              onClick={() => handleTileClick(tile.id)}
            >
              {tile.letter}
            </div>
          ))}
        </div>

        {/* Answer slots */}
        <div className={styles.answerArea}>
          <div className={styles.answerSlots}>
            {answerSlots.map(({ index, tile }) => (
              <div
                key={index}
                className={`${styles.answerSlot} ${
                  tile ? styles.answerSlotFilled : ''
                } ${isShaking && tile ? styles.tileShake : ''}`}
                onClick={() => (tile ? handleTileClick(tile.id) : handleSlotClick(index))}
              >
                {tile && (
                  <span
                    className={`${styles.slotLetter} ${
                      selectedTileId === tile.id ? styles.tileSelected : ''
                    }`}
                  >
                    {tile.letter}
                  </span>
                )}
              </div>
            ))}
          </div>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Check Answer
          </button>
        </div>

        {/* Bottom panel */}
        <div className={styles.bottomPanel}>
          <p className={styles.prompt}>
            "Unscramble the tiles. Remember the day."
          </p>
          <div className={styles.controls}>
            <HintButton hints={HINTS} onHintUsed={handleHintUsed} roomId={3} />
            {showWrongAnswer && (
              <p className={styles.wrongAnswer}>That's not right...</p>
            )}
          </div>
        </div>

        {/* Modals */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setShowModal(null)}>
                ×
              </button>

              {showModal === 'menu' && (
                <div className={styles.menuModal}>
                  <h2>MENU</h2>
                  <div className={styles.menuSection}>
                    <h3>ANTIPASTI</h3>
                    <p>• Bruschetta al Pomodoro</p>
                  </div>
                  <div className={styles.menuSection}>
                    <h3>PRIMI</h3>
                    <p>• Risotto ai Funghi</p>
                  </div>
                  <div className={styles.menuSection}>
                    <h3>SECONDI</h3>
                    <p>• Ossobuco alla Milanese</p>
                  </div>
                  <div className={styles.menuSection}>
                    <h3>DOLCI</h3>
                    <p>• Tiramisu Classico</p>
                  </div>
                </div>
              )}

              {showModal === 'wine' && (
                <div className={styles.wineModal}>
                  <div className={styles.wineLabel}>
                    <h2>CASA DEL CUORE</h2>
                    <p className={styles.wineYear}>Reserve 2024</p>
                    <p className={styles.wineRegion}>San Diego Valley</p>
                  </div>
                </div>
              )}

              {showModal === 'receipt' && (
                <div className={styles.receiptModal}>
                  <h2>RISTORANTE ILANDO</h2>
                  <div className={styles.receiptLine} />
                  <p>Table: 7</p>
                  <p>Server: Valentina</p>
                  <p>Date: ██/██/████</p>
                  <div className={styles.receiptLine} />
                  <p className={styles.receiptNote}>
                    "The perfect evening is spelled out on the table."
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

export default Room3Restaurant;
