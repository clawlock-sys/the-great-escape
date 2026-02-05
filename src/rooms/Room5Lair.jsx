import { useState, useEffect, useCallback } from 'react';
import { TextInput } from '../components/TextInput';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useTypewriter } from '../hooks/useTypewriter';
import { useAudio } from '../hooks/useAudio';
import { validate } from '../utils/solutions';
import styles from '../styles/Room5.module.css';

const BIGGIE_INTRO = [
  "You found me.",
  "I've been watching since the beginning. Every room. Every memory.",
  "I am the keeper of the final door. But you cannot pass without answering.",
  "WHEN DID YOU FIRST SPEAK THE TRUTH? The real truth. The three words.",
];

const HINTS = [
  'Three words. Eight letters. One day.',
  'It was already Valentine\'s Day when you said it.',
  '02-14-2025.',
];

export function Room5Lair({ onComplete, onHintUsed }) {
  const [inputValue, setInputValue] = useState('');
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [wrongMessage, setWrongMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPhase, setSuccessPhase] = useState(0);
  const [jumpScare, setJumpScare] = useState(false);
  const [eyesGlowing, setEyesGlowing] = useState(false);

  // Typewriter for current line
  const { displayText, isComplete } = useTypewriter(
    BIGGIE_INTRO[currentLineIndex] || '',
    50
  );

  // Audio
  const ambient = useAudio('/audio/ambient-rumble.mp3', { loop: true, volume: 0.2 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // Progress through intro lines
  useEffect(() => {
    if (isComplete && currentLineIndex < BIGGIE_INTRO.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (isComplete && currentLineIndex === BIGGIE_INTRO.length - 1) {
      // Show input after last line
      const timer = setTimeout(() => {
        setShowInput(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, currentLineIndex]);

  // Random eye glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setEyesGlowing(true);
        setTimeout(() => setEyesGlowing(false), 500);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleValidate = useCallback((value) => {
    const isValid = validate(5, value);

    if (isValid) {
      setShowSuccess(true);
      setSuccessPhase(0);

      // Progress through success messages
      const timers = [
        setTimeout(() => setSuccessPhase(1), 2000),
        setTimeout(() => setSuccessPhase(2), 4000),
        setTimeout(() => onComplete?.(), 6000),
      ];

      return () => timers.forEach(clearTimeout);
    } else {
      setWrongMessage("No. That's not when the words were real. Think. Feel. Remember.");
      setShowWrongAnswer(true);
      setTimeout(() => setShowWrongAnswer(false), 3000);
      return false;
    }
  }, [onComplete]);

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  const handleEyeClick = () => {
    setJumpScare(true);
    setTimeout(() => setJumpScare(false), 500);
  };

  const successMessages = [
    "Yes. February 14th, 2025. The day you said it and meant it forever.",
    "The door is open. Go. She's waiting.",
    "...pretty girl.",
  ];

  return (
    <Transition isVisible={isVisible}>
      <div className={`${styles.room5} ${jumpScare ? styles.jumpScare : ''}`}>
        {/* Dark overlay with moving shadows */}
        <div className={styles.shadowOverlay} />

        {/* Spotlight effect */}
        <div className={styles.spotlight} />

        {/* Biggie on pedestal */}
        <div className={`${styles.biggieContainer} ${showSuccess ? styles.biggieSuccess : ''}`}>
          <div className={styles.pedestal} />
          <div className={styles.biggie}>
            <img
              src={`${import.meta.env.BASE_URL}images/biggie/biggie-lair.png`}
              alt="Biggie"
              className={styles.biggieImage}
              onError={(e) => {
                // Fallback to silhouette if lair image doesn't exist
                e.target.src = `${import.meta.env.BASE_URL}images/biggie/biggie-silhouette.svg`;
              }}
            />
            {/* Clickable eyes for jumpscare */}
            <div
              className={`${styles.biggieEyes} ${eyesGlowing ? styles.eyesGlowing : ''}`}
              onClick={handleEyeClick}
            />
          </div>
          <div className={styles.biggieGlow} />
        </div>

        {/* Biggie's speech */}
        <div className={styles.speechContainer}>
          {!showSuccess ? (
            <p className={styles.biggieText}>
              "{displayText}"
              {!isComplete && <span className={styles.cursor}>|</span>}
            </p>
          ) : (
            <div className={styles.successText}>
              {successPhase >= 0 && (
                <p className={styles.biggieText}>"{successMessages[0]}"</p>
              )}
              {successPhase >= 1 && (
                <p className={styles.biggieText}>"{successMessages[1]}"</p>
              )}
              {successPhase >= 2 && (
                <p className={`${styles.biggieText} ${styles.prettyGirl}`}>
                  "{successMessages[2]}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        {showInput && !showSuccess && (
          <div className={styles.inputArea}>
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onValidate={handleValidate}
              placeholder="MM-DD-YYYY"
            />
            <HintButton hints={HINTS} onHintUsed={handleHintUsed} roomId={5} />
            {showWrongAnswer && (
              <p className={styles.wrongAnswer}>"{wrongMessage}"</p>
            )}
          </div>
        )}

        {/* Light flood effect on success */}
        {showSuccess && successPhase >= 2 && (
          <div className={styles.lightFlood} />
        )}
      </div>
    </Transition>
  );
}

export default Room5Lair;
