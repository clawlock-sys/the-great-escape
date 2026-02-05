import { useState, useEffect, useCallback, useMemo } from 'react';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useAudio } from '../hooks/useAudio';
import { validate } from '../utils/solutions';
import styles from '../styles/Room3.module.css';

// Letters for the puzzle: FEBRUARY EIGHTH (14 letters)
const SOLUTION_LETTERS = ['F', 'E', 'B', 'R', 'U', 'A', 'R', 'Y', 'E', 'I', 'G', 'H', 'T', 'H'];
const DECOY_LETTERS = ['O', 'C', 'N'];

// Letter groups to unlock
const GROUPS = {
  RECEIPT: ['F', 'E', 'B', 'R', 'U'],
  WINE: ['A', 'R', 'Y', 'E', 'I'],
  MENU: ['G', 'H', 'T', 'H'],
};

// Hotspot positions
const HOTSPOTS = {
  menu: { top: '35%', left: '25%', width: '12%', height: '15%' },
  wine: { top: '30%', left: '55%', width: '8%', height: '20%' },
  receipt: { top: '50%', left: '40%', width: '10%', height: '8%' },
  candle: { top: '25%', left: '45%', width: '6%', height: '12%' },
  breadsticks: { top: '45%', left: '60%', width: '10%', height: '10%' },
};

const HINTS = [
  'Check the receipt, the wine label, and the menu. Each has a secret to reveal.',
  'Receipt: Add the table number to the price of dessert. Wine: Add the roses and lilies.',
  'Unscramble: FEBRUARY EIGHTH — your first date.',
];

export function Room3Restaurant({ onComplete, onHintUsed }) {
  const [unlockedGroups, setUnlockedGroups] = useState({
    RECEIPT: false,
    WINE: false,
    MENU: false,
  });
  
  const [tiles, setTiles] = useState([]);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [candleFlicker, setCandleFlicker] = useState(false);
  const [showBreadstickMsg, setShowBreadstickMsg] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Puzzle inputs
  const [receiptInput, setReceiptInput] = useState('');
  const [wineInput, setWineInput] = useState('');
  const [menuInput, setMenuInput] = useState('');

  const ambient = useAudio('/audio/ambient-jazz.mp3', { loop: true, volume: 0.25 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // When a group is unlocked, add its letters to the table
  useEffect(() => {
    let newLetters = [];
    if (unlockedGroups.RECEIPT) newLetters = [...newLetters, ...GROUPS.RECEIPT];
    if (unlockedGroups.WINE) newLetters = [...newLetters, ...GROUPS.WINE];
    if (unlockedGroups.MENU) newLetters = [...newLetters, ...GROUPS.MENU];
    
    // Add decoys if everything is unlocked
    if (unlockedGroups.RECEIPT && unlockedGroups.WINE && unlockedGroups.MENU) {
      newLetters = [...newLetters, ...DECOY_LETTERS];
    }

    setTiles(newLetters.map((letter, index) => ({
      id: `tile-${letter}-${index}`,
      letter,
      inSlot: null,
    })));
  }, [unlockedGroups]);

  const handleTileClick = useCallback((tileId) => {
    if (selectedTileId === null) {
      setSelectedTileId(tileId);
    } else if (selectedTileId === tileId) {
      setSelectedTileId(null);
    } else {
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

  const handleSlotClick = useCallback((slotIndex) => {
    if (selectedTileId === null) return;
    const occupyingTile = tiles.find((t) => t.inSlot === slotIndex);
    if (occupyingTile) {
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
      setTiles((prev) =>
        prev.map((t) =>
          t.id === selectedTileId ? { ...t, inSlot: slotIndex } : t
        )
      );
    }
    setSelectedTileId(null);
  }, [selectedTileId, tiles]);

  const handleSubmit = useCallback(() => {
    const slotTiles = tiles
      .filter((t) => t.inSlot !== null)
      .sort((a, b) => a.inSlot - b.inSlot);
    const answer = slotTiles.map((t) => t.letter).join('');
    
    if (validate(3, answer)) {
      onComplete?.();
    } else {
      setShowWrongAnswer(true);
      setIsShaking(true);
      setTimeout(() => {
        setShowWrongAnswer(false);
        setIsShaking(false);
      }, 2000);
    }
  }, [tiles, onComplete]);

  // Puzzle validation logic
  const checkReceiptPuzzle = () => {
    if (receiptInput === '21') {
      setUnlockedGroups(prev => ({ ...prev, RECEIPT: true }));
      setShowModal(null);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const checkWinePuzzle = () => {
    if (wineInput === '10') {
      setUnlockedGroups(prev => ({ ...prev, WINE: true }));
      setShowModal(null);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const checkMenuPuzzle = () => {
    if (menuInput === '4') {
      setUnlockedGroups(prev => ({ ...prev, MENU: true }));
      setShowModal(null);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const allUnlocked = unlockedGroups.RECEIPT && unlockedGroups.WINE && unlockedGroups.MENU;

  return (
    <Transition isVisible={isVisible}>
      <div className={styles.room3}>
        <div className={`${styles.candleOverlay} ${candleFlicker ? styles.flicker : ''}`} />

        {/* Debug toggle */}
        <button className={styles.debugToggle} onClick={() => setDebugMode((p) => !p)}>
          {debugMode ? 'Hide' : 'Debug'}
        </button>

        {/* Clickable Objects */}
        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.menu}
          onClick={() => setShowModal('menu')}
        >
          {debugMode && <span className={styles.hotspotLabel}>Menu</span>}
        </div>
        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.wine}
          onClick={() => setShowModal('wine')}
        >
          {debugMode && <span className={styles.hotspotLabel}>Wine</span>}
        </div>
        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.receipt}
          onClick={() => setShowModal('receipt')}
        >
          {debugMode && <span className={styles.hotspotLabel}>Receipt</span>}
        </div>
        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.candle}
          onClick={() => setCandleFlicker(true)}
        >
          {debugMode && <span className={styles.hotspotLabel}>Candle</span>}
        </div>
        <div
          className={`${styles.hotspot} ${debugMode ? styles.hotspotDebug : ''}`}
          style={HOTSPOTS.breadsticks}
          onClick={() => setShowBreadstickMsg(true)}
        >
          {debugMode && <span className={styles.hotspotLabel}>Bread</span>}
        </div>

        {showBreadstickMsg && (
          <div className={styles.breadstickMsg} onAnimationEnd={() => setShowBreadstickMsg(false)}>
            "Just breadsticks. Delicious, but not helpful."
          </div>
        )}

        {/* Table Area for Tiles */}
        <div className={styles.tileArea}>
          {allUnlocked ? (
            tiles.filter(t => t.inSlot === null).map((tile) => (
              <div
                key={tile.id}
                className={`${styles.tile} ${selectedTileId === tile.id ? styles.tileSelected : ''} ${isShaking ? styles.tileShake : ''}`}
                onClick={() => handleTileClick(tile.id)}
              >
                {tile.letter}
              </div>
            ))
          ) : (
            <div className={styles.lockedMessage}>
              <p>The table is empty. Find the clues in the room.</p>
              <div className={styles.progress}>
                <span className={unlockedGroups.RECEIPT ? styles.unlocked : ''}>Receipt 📝</span>
                <span className={unlockedGroups.WINE ? styles.unlocked : ''}>Wine 🍷</span>
                <span className={unlockedGroups.MENU ? styles.unlocked : ''}>Menu 🍴</span>
              </div>
            </div>
          )}
        </div>

        {/* Answer Slots */}
        {allUnlocked && (
          <div className={styles.answerArea}>
            <div className={styles.answerSlots}>
              {Array.from({ length: 14 }).map((_, i) => {
                const tile = tiles.find((t) => t.inSlot === i);
                return (
                  <div
                    key={i}
                    className={`${styles.answerSlot} ${tile ? styles.answerSlotFilled : ''}`}
                    onClick={() => (tile ? handleTileClick(tile.id) : handleSlotClick(i))}
                  >
                    {tile && <span className={styles.slotLetter}>{tile.letter}</span>}
                  </div>
                );
              })}
            </div>
            <button className={styles.submitButton} onClick={handleSubmit}>Check Answer</button>
          </div>
        )}

        <div className={styles.bottomPanel}>
          <p className={styles.prompt}>"The perfect evening is hidden in the details."</p>
          <div className={styles.controls}>
            <HintButton hints={HINTS} onHintUsed={onHintUsed} roomId={3} />
            {showWrongAnswer && <p className={styles.wrongAnswer}>That's not right...</p>}
          </div>
        </div>

        {/* Modals for Puzzles */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setShowModal(null)}>×</button>

              {showModal === 'receipt' && (
                <div className={styles.receiptModal}>
                  <h2>RISTORANTE ILANDO</h2>
                  <div className={styles.receiptLine} />
                  <p>Table: 7</p>
                  <p>Server: Valentina</p>
                  <p>Bruschetta: $12</p>
                  <p>Risotto: $24</p>
                  <p>Tiramisu: $14</p>
                  <div className={styles.receiptLine} />
                  {unlockedGroups.RECEIPT ? (
                    <p className={styles.unlockedText}>✔ Clue Found!</p>
                  ) : (
                    <div className={styles.puzzleInput}>
                      <p>Enter Sum of Table # and Price of Dessert:</p>
                      <input 
                        type="number" 
                        value={receiptInput} 
                        onChange={(e) => setReceiptInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkReceiptPuzzle()}
                        autoFocus
                      />
                      <button onClick={checkReceiptPuzzle}>Unlock</button>
                    </div>
                  )}
                </div>
              )}

              {showModal === 'wine' && (
                <div className={styles.wineModal}>
                  <div className={styles.wineLabel}>
                    <h2>CASA DEL CUORE</h2>
                    <p className={styles.wineYear}>Reserve 2024</p>
                    <p>"Two roses. Eight lilies."</p>
                    <p className={styles.wineRegion}>San Diego Valley</p>
                  </div>
                  {unlockedGroups.WINE ? (
                    <p className={styles.unlockedText}>✔ Clue Found!</p>
                  ) : (
                    <div className={styles.puzzleInput}>
                      <p>Enter the total number of flowers:</p>
                      <input 
                        type="number" 
                        value={wineInput} 
                        onChange={(e) => setWineInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkWinePuzzle()}
                        autoFocus
                      />
                      <button onClick={checkWinePuzzle}>Unlock</button>
                    </div>
                  )}
                </div>
              )}

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
                  {unlockedGroups.MENU ? (
                    <p className={styles.unlockedText}>✔ Clue Found!</p>
                  ) : (
                    <div className={styles.puzzleInput}>
                      <p>How many menu sections are listed?</p>
                      <input 
                        type="number" 
                        value={menuInput} 
                        onChange={(e) => setMenuInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkMenuPuzzle()}
                        autoFocus
                      />
                      <button onClick={checkMenuPuzzle}>Unlock</button>
                    </div>
                  )}
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
