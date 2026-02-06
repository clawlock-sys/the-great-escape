import { useState, useEffect, useCallback } from 'react';
import { TextInput } from '../components/TextInput';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useTypewriter } from '../hooks/useTypewriter';
import { useAudio } from '../hooks/useAudio';
import { validate } from '../utils/solutions';
import styles from '../styles/Room0.module.css';

const NARRATIVE_TEXT = `You've been pulled into the spaces between moments. Trapped in memories that aren't quite yours... or are they?

Someone is watching. Something red. Something soft. Something that knows your name.

Find your way out. Remember what matters. Escape.

When did it begin? Enter the date. MM.DD.YYYY`;

const HINTS = [
  'A market. A Saturday. Fall had just arrived.',
  'The tenth month. The fifth day.',
  'October 2024.',
];

export function Room0Entry({ onComplete, onHintUsed }) {
  const [inputValue, setInputValue] = useState('');
  const [isFlickering, setIsFlickering] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);
  const [showBiggie, setShowBiggie] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);

  const { displayText, isComplete: textComplete } = useTypewriter(NARRATIVE_TEXT, 60);

  // Audio hooks (gracefully handle missing files)
  const ambient = useAudio('/audio/ambient-drone.mp3', { loop: true, volume: 0.1 });
  const typewriterSound = useAudio('/audio/typewriter-click.mp3', { volume: 0.1 });

  // Play typewriter sound as text updates
  useEffect(() => {
    if (displayText && !textComplete) {
      typewriterSound.play();
    }
  }, [displayText, textComplete]);

  // Start ambient on mount
  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // Random flicker effect at varied intervals with faint Biggie flash
  useEffect(() => {
    let timerId;
    const intervals = [3000, 5000, 8000, 12000, 15000]; // Varied intervals

    const scheduleFlicker = () => {
      const delay = intervals[Math.floor(Math.random() * intervals.length)];
      timerId = setTimeout(() => {
        setIsFlickering(true);
        setShowBiggie(true); // Always show Biggie during flicker

        // Hide Biggie after flash (300ms for visibility)
        setTimeout(() => setShowBiggie(false), 300);
        setTimeout(() => setIsFlickering(false), 400);
        scheduleFlicker();
      }, delay);
    };

    scheduleFlicker();
    return () => clearTimeout(timerId);
  }, []);

  const handleValidate = useCallback((value) => {
    const isValid = validate(0, value);

    if (isValid) {
      onComplete?.();
      return true;
    } else {
      // Trigger red flash and wrong answer text
      setShowRedFlash(true);
      setShowWrongAnswer(true);
      setTimeout(() => setShowRedFlash(false), 300);
      setTimeout(() => setShowWrongAnswer(false), 2000);
      return false;
    }
  }, [onComplete]);

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  const roomClasses = [
    styles.room0,
    isFlickering && styles.flicker,
    showRedFlash && styles.redFlash,
  ].filter(Boolean).join(' ');

  return (
    <Transition isVisible={isVisible}>
      <div className={roomClasses}>
        {showBiggie && <div className={styles.biggieFrame} />}

        <div className={styles.terminalOverlay}>
          <p className={styles.typewriterText}>
            {displayText}
            {!textComplete && <span className={styles.cursor} />}
          </p>

          {textComplete && (
            <div className={styles.inputContainer}>
              <TextInput
                value={inputValue}
                onChange={setInputValue}
                onValidate={handleValidate}
                placeholder="Enter date (MM.DD.YYYY)"
              />
              <HintButton
                hints={HINTS}
                onHintUsed={handleHintUsed}
                roomId={0}
              />
              {showWrongAnswer && (
                <p className={styles.wrongAnswer}>That's not when it started. Try again.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
}

export default Room0Entry;
