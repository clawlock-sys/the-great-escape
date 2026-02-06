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
  menu: { top: '58%', left: '22%', width: '12%', height: '15%' },
  wine: { top: '58%', left: '78%', width: '8%', height: '20%' },
  receipt: { top: '86%', left: '35%', width: '10%', height: '8%' },
  candle: { top: '25%', left: '45%', width: '6%', height: '12%' },
  breadsticks: { top: '64%', left: '65%', width: '10%', height: '10%' },
};

const HINTS = [
  'Shez and Riya walk in for the first time.',
  'Receipt: The order number is a date. Wine: Roman numerals make a year. Menu: Italian holds the key.',
  'Unscramble: FEBRUARY EIGHTH — your first visit.',
];

// Fisher-Yates shuffle
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function Room3Restaurant({ onComplete, onHintUsed }) {
  const [unlockedGroups, setUnlockedGroups] = useState({
    RECEIPT: false,
    WINE: false,
    MENU: false,
  });
  
  const [tiles, setTiles] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [candleFlicker, setCandleFlicker] = useState(false);
  const [showBreadstickMsg, setShowBreadstickMsg] = useState(false);

  // Puzzle inputs
  const [receiptInput, setReceiptInput] = useState('');
  const [wineInput, setWineInput] = useState('');
  const [menuInput, setMenuInput] = useState('');

  const ambient = useAudio('/audio/ambient-jazz.mp3', { loop: true, volume: 0.1 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // When a group is unlocked, add its letters to the table (shuffled)
  useEffect(() => {
    let newLetters = [];
    if (unlockedGroups.RECEIPT) newLetters = [...newLetters, ...GROUPS.RECEIPT];
    if (unlockedGroups.WINE) newLetters = [...newLetters, ...GROUPS.WINE];
    if (unlockedGroups.MENU) newLetters = [...newLetters, ...GROUPS.MENU];

    // Add decoys if everything is unlocked
    if (unlockedGroups.RECEIPT && unlockedGroups.WINE && unlockedGroups.MENU) {
      newLetters = [...newLetters, ...DECOY_LETTERS];
    }

    // Shuffle the letters so they're not in order
    const shuffledLetters = shuffleArray(newLetters);

    setTiles(shuffledLetters.map((letter, index) => ({
      id: `tile-${letter}-${index}`,
      letter,
      inSlot: null,
    })));
  }, [unlockedGroups]);

  const handleTileClick = useCallback((tileId) => {
    setTiles((prev) => {
      const tile = prev.find((t) => t.id === tileId);
      if (!tile || tile.inSlot !== null) return prev;
      // Find the next empty slot
      const occupiedSlots = new Set(prev.filter((t) => t.inSlot !== null).map((t) => t.inSlot));
      let nextSlot = null;
      for (let i = 0; i < 14; i++) {
        if (!occupiedSlots.has(i)) {
          nextSlot = i;
          break;
        }
      }
      if (nextSlot === null) return prev;
      return prev.map((t) => t.id === tileId ? { ...t, inSlot: nextSlot } : t);
    });
  }, []);

  const handleSlotClick = useCallback((slotIndex) => {
    // Remove tile from slot back to the pool
    setTiles((prev) =>
      prev.map((t) => t.inSlot === slotIndex ? { ...t, inSlot: null } : t)
    );
  }, []);

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
    // Order #0214 = Feb 14 (Valentine's Day)
    if (receiptInput === '214' || receiptInput === '0214') {
      setUnlockedGroups(prev => ({ ...prev, RECEIPT: true }));
      setShowModal(null);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const checkWinePuzzle = () => {
    // Est. II·VIII = 2008 (Feb 8 as a year)
    if (wineInput === '2008') {
      setUnlockedGroups(prev => ({ ...prev, WINE: true }));
      setShowModal(null);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const checkMenuPuzzle = () => {
    // OTTO = Italian for 8
    if (menuInput.toUpperCase() === 'OTTO') {
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

        {/* Clickable Objects */}
        <div className={styles.hotspot} style={HOTSPOTS.menu} onClick={() => setShowModal('menu')} />
        <div className={styles.hotspot} style={HOTSPOTS.wine} onClick={() => setShowModal('wine')} />
        <div className={styles.hotspot} style={HOTSPOTS.receipt} onClick={() => setShowModal('receipt')} />
        <div className={styles.hotspot} style={HOTSPOTS.candle} onClick={() => setCandleFlicker(true)} />
        <div className={styles.hotspot} style={HOTSPOTS.breadsticks} onClick={() => setShowBreadstickMsg(true)} />

        {showBreadstickMsg && (
          <div className={styles.breadstickMsg} onAnimationEnd={() => setShowBreadstickMsg(false)}>
            "Just breadsticks. Delicious, but not helpful."
          </div>
        )}

        {/* Floating clue progress at top */}
        {!allUnlocked && (
          <div className={styles.lockedMessage}>
            <p className={styles.prompt}>"The perfect evening is hidden in the details."</p>
            <div className={styles.progress}>
              {unlockedGroups.RECEIPT && <span className={styles.unlocked}>Receipt 📝</span>}
              {unlockedGroups.WINE && <span className={styles.unlocked}>Wine 🍷</span>}
              {unlockedGroups.MENU && <span className={styles.unlocked}>Menu 🍴</span>}
            </div>
          </div>
        )}

        {/* Table Area for Tiles */}
        {allUnlocked && (
          <div className={styles.tileArea}>
            {tiles.filter(t => t.inSlot === null).map((tile) => (
              <div
                key={tile.id}
                className={`${styles.tile} ${isShaking ? styles.tileShake : ''}`}
                onClick={() => handleTileClick(tile.id)}
              >
                {tile.letter}
              </div>
            ))}
          </div>
        )}

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
                    onClick={() => tile && handleSlotClick(i)}
                  >
                    {tile && <span className={styles.slotLetter}>{tile.letter}</span>}
                  </div>
                );
              })}
            </div>
            <button className={styles.submitButton} onClick={handleSubmit}>Check Answer</button>
          </div>
        )}

        <div className={styles.controls}>
          <HintButton hints={HINTS} onHintUsed={onHintUsed} roomId={3} />
          {showWrongAnswer && <p className={styles.wrongAnswer}>That's not right...</p>}
        </div>

        {/* Modals for Puzzles */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setShowModal(null)}>×</button>

              {showModal === 'receipt' && (
                <div className={styles.receiptModal}>
                  <h2>RISTORANTE ILLANDO</h2>
                  <p className={styles.orderNumber}>Order #0214</p>
                  <div className={styles.receiptLine} />
                  <p>Table: 7 &nbsp;•&nbsp; 8:02 PM</p>
                  <p>Server: Valentina</p>
                  <div className={styles.receiptLine} />
                  <p>Bruschetta: $12</p>
                  <p>Risotto: $24</p>
                  <p>Ravioli a la Vodka: $18</p>
                  <p>Tiramisu: $14</p>
                  <div className={styles.receiptLine} />
                  <p className={styles.receiptTotal}>Total: $68.00</p>
                  {unlockedGroups.RECEIPT ? (
                    <div className={styles.unlockedAnswer}>
                      <p className={styles.unlockedText}>✔ Clue Found!</p>
                      <p className={styles.answerReveal}>Order #0214 → 02/14</p>
                    </div>
                  ) : (
                    <div className={styles.puzzleInput}>
                      <p>Enter the order number:</p>
                      <input
                        type="text"
                        value={receiptInput}
                        onChange={(e) => setReceiptInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkReceiptPuzzle()}
                        placeholder="####"
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
                    <p className={styles.wineEst}>Est. II·VIII</p>
                    <p className={styles.wineTagline}>"A vintage for anniversaries"</p>
                    <p className={styles.wineRegion}>San Diego Valley</p>
                  </div>
                  {unlockedGroups.WINE ? (
                    <div className={styles.unlockedAnswer}>
                      <p className={styles.unlockedText}>✔ Clue Found!</p>
                      <p className={styles.answerReveal}>II·VIII → 2008</p>
                    </div>
                  ) : (
                    <div className={styles.puzzleInput}>
                      <p>What year was this winery established?</p>
                      <input
                        type="text"
                        value={wineInput}
                        onChange={(e) => setWineInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkWinePuzzle()}
                        placeholder="YYYY"
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
                    <p>• Ravioli a la Vodka</p>
                  </div>
                  <div className={styles.menuSection}>
                    <h3>SECONDI</h3>
                    <p>• Ossobuco alla Milanese</p>
                  </div>
                  <div className={styles.menuSection}>
                    <h3>DOLCI</h3>
                    <p>• Tiramisu Classico</p>
                  </div>
                  <p className={styles.chefNote}>★ Chef's Table — seating for OTTO guests</p>
                  {unlockedGroups.MENU ? (
                    <div className={styles.unlockedAnswer}>
                      <p className={styles.unlockedText}>✔ Clue Found!</p>
                      <p className={styles.answerReveal}>OTTO → 8 in Italian</p>
                    </div>
                  ) : (
                    <div className={styles.puzzleInput}>
                      <p>What is the chef's lucky word?</p>
                      <input
                        type="text"
                        value={menuInput}
                        onChange={(e) => setMenuInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkMenuPuzzle()}
                        placeholder="Italian word"
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
