import { useState, useEffect, useCallback, useRef } from 'react';
import { TextInput } from '../components/TextInput';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useTypewriter } from '../hooks/useTypewriter';
import { useAudio } from '../hooks/useAudio';
import { validate } from '../utils/solutions';
import { Howl } from 'howler';
import styles from '../styles/Room5.module.css';

const BIGGIE_INTRO = [
  "You found me.",
  "I've been watching since the beginning. Every room. Every memory.",
  "I am the keeper of the final door. But you cannot pass without answering.",
  "WHEN DID YOU FIRST SPEAK THE TRUTH? The real truth. The three words.",
];

const BIGGIE_VOICES = {
  INTRO_0: '/audio/biggie-found.mp3',
  INTRO_1: '/audio/biggie-watching.mp3',
  INTRO_2: '/audio/biggie-keeper.mp3',
  INTRO_3: '/audio/biggie-truth.mp3',
  WRONG: '/audio/biggie-wrong.mp3',
  CORRECT: '/audio/biggie-correct.mp3',
  WAITING: '/audio/biggie-waiting.mp3',
  PRETTY_GIRL: '/audio/biggie-pretty-girl.mp3',
};

const HINTS = [
  'Three words. Eight letters. One day.',
  'It was already Valentine\'s Day when you said it.',
  '02-14-2025.',
];

// Glitch text variations
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?░▒▓█▀▄';
const glitchText = (text) => {
  return text.split('').map((char) => {
    if (Math.random() > 0.85 && char !== ' ') {
      return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    return char;
  }).join('');
};

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

  // Premium effects state
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [heartbeatIntensity, setHeartbeatIntensity] = useState(1);
  const [screenFlicker, setScreenFlicker] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [staticNoise, setStaticNoise] = useState(0);
  const [breathPhase, setBreathPhase] = useState(0);

  const containerRef = useRef(null);
  const lastMouseMove = useRef(Date.now());
  const voiceRef = useRef(null);

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
    return () => {
      ambient.stop();
      voiceRef.current?.stop();
    };
  }, []);

  // Helper to play Biggie's voice
  const playVoice = (key) => {
    voiceRef.current?.stop();
    voiceRef.current = new Howl({
      src: [BIGGIE_VOICES[key]],
      volume: 0.8,
    });
    voiceRef.current.play();
  };

  // Play intro voices
  useEffect(() => {
    if (isVisible && !showInput && !showSuccess) {
      playVoice(`INTRO_${currentLineIndex}`);
    }
  }, [currentLineIndex, isVisible]);

  // Mouse tracking for dynamic spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
      lastMouseMove.current = Date.now();

      // Increase heartbeat when mouse moves fast
      const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
      if (speed > 10) {
        setHeartbeatIntensity((prev) => Math.min(prev + 0.1, 2));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Heartbeat decay and breathing effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Decay heartbeat intensity when still
      if (Date.now() - lastMouseMove.current > 500) {
        setHeartbeatIntensity((prev) => Math.max(prev - 0.05, 0.8));
      }

      // Breathing cycle
      setBreathPhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Random screen effects
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      // Random screen flicker
      if (Math.random() > 0.95) {
        setScreenFlicker(true);
        setTimeout(() => setScreenFlicker(false), 100);
      }

      // Random glitch
      if (Math.random() > 0.92) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }

      // Random static noise level
      setStaticNoise(Math.random() * 0.15);
    }, 200);

    return () => clearInterval(flickerInterval);
  }, []);

  // Progress through intro lines
  useEffect(() => {
    if (isComplete && currentLineIndex < BIGGIE_INTRO.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
      }, 2500); // Wait longer for voice to finish
      return () => clearTimeout(timer);
    } else if (isComplete && currentLineIndex === BIGGIE_INTRO.length - 1) {
      const timer = setTimeout(() => {
        setShowInput(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, currentLineIndex]);

  // Random eye glow effect - more frequent
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        setEyesGlowing(true);
        setTimeout(() => setEyesGlowing(false), 300 + Math.random() * 400);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleValidate = useCallback((value) => {
    const isValid = validate(5, value);

    if (isValid) {
      setShowSuccess(true);
      setSuccessPhase(0);
      playVoice('CORRECT');

      const timer1 = setTimeout(() => {
        setSuccessPhase(1);
        playVoice('WAITING');
      }, 5000);

      const timer2 = setTimeout(() => {
        setSuccessPhase(2);
        playVoice('PRETTY_GIRL');
      }, 9000);

      const timer3 = setTimeout(() => onComplete?.(), 12000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Intense wrong answer effect
      setScreenFlicker(true);
      setGlitchActive(true);
      playVoice('WRONG');
      setTimeout(() => {
        setScreenFlicker(false);
        setGlitchActive(false);
      }, 500);

      setWrongMessage("No. That's not when the words were real. Think. Feel. Remember.");
      setShowWrongAnswer(true);
      setTimeout(() => setShowWrongAnswer(false), 4000);
      return false;
    }
  }, [onComplete]);

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  const handleEyeClick = () => {
    setJumpScare(true);
    setScreenFlicker(true);
    setGlitchActive(true);
    setTimeout(() => {
      setJumpScare(false);
      setScreenFlicker(false);
      setGlitchActive(false);
    }, 500);
  };

  const successMessages = [
    "Yes. February 14th, 2025. The day you said it and meant it forever.",
    "The door is open. Go. She's waiting.",
    "...pretty girl.",
  ];

  // Calculate breathing scale
  const breathScale = 1 + Math.sin(breathPhase * 0.0628) * 0.02;

  // Render glitched text
  const renderText = (text) => {
    if (glitchActive) {
      return glitchText(text);
    }
    return text;
  };

  return (
    <Transition isVisible={isVisible}>
      <div
        ref={containerRef}
        className={`${styles.room5} ${jumpScare ? styles.jumpScare : ''} ${screenFlicker ? styles.screenFlicker : ''}`}
        style={{
          '--mouse-x': `${mousePos.x}%`,
          '--mouse-y': `${mousePos.y}%`,
          '--heartbeat': heartbeatIntensity,
          '--breath-scale': breathScale,
          '--static-opacity': staticNoise,
        }}
      >
        {/* Static noise overlay */}
        <div className={styles.staticNoise} />

        {/* Dark overlay with moving shadows */}
        <div className={styles.shadowOverlay} />

        {/* Dynamic spotlight following cursor */}
        <div className={styles.dynamicSpotlight} />

        {/* Secondary ambient spotlight */}
        <div className={styles.spotlight} />

        {/* Vignette */}
        <div className={styles.vignette} />

        {/* Heartbeat pulse overlay */}
        <div className={styles.heartbeatOverlay} />

        {/* Biggie on pedestal */}
        <div className={`${styles.biggieContainer} ${showSuccess ? styles.biggieSuccess : ''}`}>
          <div className={styles.pedestal} />
          <div className={styles.biggie}>
            <img
              src={`${import.meta.env.BASE_URL}images/biggie/biggie-lair.png`}
              alt="Biggie"
              className={styles.biggieImage}
              onError={(e) => {
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
            <p className={`${styles.biggieText} ${glitchActive ? styles.glitchText : ''}`}>
              "{renderText(displayText)}"
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
              <p className={`${styles.wrongAnswer} ${styles.glitchText}`}>
                "{renderText(wrongMessage)}"
              </p>
            )}
          </div>
        )}

        {/* Light flood effect on success */}
        {showSuccess && successPhase >= 2 && (
          <div className={styles.lightFlood} />
        )}

        {/* Ambient particles */}
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                '--delay': `${i * 0.5}s`,
                '--x': `${Math.random() * 100}%`,
                '--duration': `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>
    </Transition>
  );
}

export default Room5Lair;
