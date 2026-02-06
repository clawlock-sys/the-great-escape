import { useState, useEffect, useCallback, useRef } from 'react';
import { Transition } from '../components/Transition';
import { useTypewriter } from '../hooks/useTypewriter';
import { useAudio } from '../hooks/useAudio';
import styles from '../styles/Room6.module.css';

const INTRO_LINES = [
  "You escaped.",
  "Through the market where we met. Through the home we've built. Through the dinner that started everything. Through our song. Past the guardian of my heart.",
  "You remembered. You always do.",
  "Riya...",
];

const NO_BUTTON_TEXTS = {
  0: 'no',
  3: 'please?',
  5: 'come on...',
  7: "I'll buy you Thai food",
  10: 'Biggie says you have to',
};

export function Room6Finale({ onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noButtonSize, setNoButtonSize] = useState(1);
  const [keyboardNo, setKeyboardNo] = useState(false);

  const noButtonRef = useRef(null);
  const containerRef = useRef(null);

  // Typewriter for current line
  const { displayText, isComplete } = useTypewriter(
    INTRO_LINES[currentLineIndex] || '',
    40
  );

  // Audio
  const ambient = useAudio('/audio/gracie-abrams-full.mp3', { loop: true, volume: 0.3 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  // Progress through intro lines
  useEffect(() => {
    if (isComplete && currentLineIndex < INTRO_LINES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isComplete && currentLineIndex === INTRO_LINES.length - 1) {
      const timer = setTimeout(() => {
        setShowQuestion(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, currentLineIndex]);

  // Get current NO button text
  const getNoButtonText = () => {
    const thresholds = Object.keys(NO_BUTTON_TEXTS)
      .map(Number)
      .sort((a, b) => b - a);
    for (const threshold of thresholds) {
      if (noButtonAttempts >= threshold) {
        return NO_BUTTON_TEXTS[threshold];
      }
    }
    return 'no';
  };

  // Handle NO button hover/approach
  const handleNoButtonHover = useCallback(() => {
    if (noButtonAttempts >= 15) return; // Already shrunk

    setNoButtonAttempts((prev) => prev + 1);

    // Calculate escape direction
    const container = containerRef.current;
    const button = noButtonRef.current;
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    // Random direction with increasing speed
    const speed = Math.min(50 + noButtonAttempts * 15, 200);
    const angle = Math.random() * Math.PI * 2;
    let newX = noButtonPos.x + Math.cos(angle) * speed;
    let newY = noButtonPos.y + Math.sin(angle) * speed;

    // Keep within bounds
    const maxX = containerRect.width / 2 - buttonRect.width / 2 - 20;
    const maxY = containerRect.height / 2 - buttonRect.height / 2 - 100;
    newX = Math.max(-maxX, Math.min(maxX, newX));
    newY = Math.max(-maxY, Math.min(maxY, newY));

    setNoButtonPos({ x: newX, y: newY });

    // Shrink after 15 attempts
    if (noButtonAttempts >= 14) {
      setNoButtonSize(0.01); // 1 pixel effectively
    }
  }, [noButtonAttempts, noButtonPos]);

  // Handle YES click
  const handleYesClick = () => {
    setShowConfetti(true);
    // Keep playing the song
    setTimeout(() => {
      setShowFinalMessage(true);
    }, 1000);
  };

  // Handle keyboard NO (easter egg)
  const handleNoClick = () => {
    setKeyboardNo(true);
    setTimeout(() => {
      setKeyboardNo(false);
      handleYesClick(); // Redirect to YES anyway
    }, 2000);
  };

  // Generate confetti pieces
  const renderConfetti = () => {
    const pieces = [];
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff8fb1', '#a855f7'];
    for (let i = 0; i < 150; i++) {
      const style = {
        '--x': `${Math.random() * 100}vw`,
        '--delay': `${Math.random() * 3}s`,
        '--duration': `${3 + Math.random() * 2}s`,
        '--color': colors[Math.floor(Math.random() * colors.length)],
        '--rotation': `${Math.random() * 360}deg`,
      };
      pieces.push(<div key={i} className={styles.confettiPiece} style={style} />);
    }
    return pieces;
  };

  return (
    <Transition isVisible={isVisible}>
      <div className={styles.room6} ref={containerRef}>
        {/* Starry background */}
        <div className={styles.stars} />
        <div className={styles.starsOverlay} />

        {/* Warm glow */}
        <div className={styles.warmGlow} />

        {/* Intro text */}
        {!showQuestion && (
          <div className={styles.introContainer}>
            <p key={currentLineIndex} className={styles.introText}>
              {displayText}
              {!isComplete && <span className={styles.cursor}>|</span>}
            </p>
          </div>
        )}

        {/* The Question */}
        {showQuestion && !showFinalMessage && (
          <div className={styles.questionContainer}>
            <h1 className={styles.question}>Will you be my Valentine?</h1>

            <div className={styles.buttonContainer}>
              <button className={styles.yesButton} onClick={handleYesClick}>
                YES
              </button>

              {noButtonSize > 0.01 && (
                <button
                  ref={noButtonRef}
                  className={styles.noButton}
                  style={{
                    transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px) scale(${noButtonSize})`,
                  }}
                  onMouseEnter={handleNoButtonHover}
                  onClick={handleNoClick}
                >
                  {getNoButtonText()}
                </button>
              )}
            </div>

            {keyboardNo && (
              <p className={styles.keyboardEasterEgg}>
                fine, but Biggie is disappointed
              </p>
            )}
          </div>
        )}

        {/* Confetti */}
        {showConfetti && <div className={styles.confettiContainer}>{renderConfetti()}</div>}

        {/* Final Message */}
        {showFinalMessage && (
          <div className={styles.finalContainer}>
            <p className={styles.knewIt}>I knew you'd say yes. 💕</p>
            <div className={styles.finalMessage}>
              <p>I love you, pretty girl.</p>
              <p className={styles.signature}>... even when you're being a little gremlin</p>
            </div>
          </div>
        )}
      </div>
    </Transition>
  );
}

export default Room6Finale;
