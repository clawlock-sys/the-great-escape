import { useState } from 'react';
import { TextInput } from './TextInput';
import { HintButton } from './HintButton';
import { ClickableArea } from './ClickableArea';
import { RunawayButton } from './RunawayButton';
import { Transition } from './Transition';
import styles from '../styles/components.module.css';

/**
 * Demo page showing all components in isolation
 */
export function ComponentDemo() {
  // TextInput state
  const [inputValue, setInputValue] = useState('');
  const [inputStatus, setInputStatus] = useState(null);

  // ClickableArea state
  const [foundAreas, setFoundAreas] = useState({});

  // Transition state
  const [showTransition, setShowTransition] = useState(true);

  // Theme state
  const [theme, setTheme] = useState('warm');

  const themes = ['creepy', 'warm', 'moody', 'eerie', 'finale'];

  const handleValidate = (value) => {
    const isValid = value.toLowerCase() === 'riya';
    setInputStatus(isValid ? 'success' : 'error');
    return isValid;
  };

  const handleHintUsed = (roomId, level) => {
    console.log(`Room ${roomId}: Hint ${level} used`);
  };

  const handleAreaFind = (id, isDecoy) => {
    if (isDecoy) {
      console.log(`Clicked decoy area: ${id}`);
    } else {
      setFoundAreas((prev) => ({ ...prev, [id]: true }));
      console.log(`Found area: ${id}`);
    }
  };

  const handleCatch = () => {
    alert('You caught the button! 💕');
  };

  const getThemeStyles = () => {
    const themeVars = {
      creepy: { bg: 'var(--creepy-bg)', text: 'var(--creepy-text)' },
      warm: { bg: 'var(--warm-bg)', text: 'var(--warm-text)' },
      moody: { bg: 'var(--moody-bg)', text: 'var(--moody-text)' },
      eerie: { bg: 'var(--eerie-bg)', text: 'var(--eerie-text)' },
      finale: { bg: 'var(--warm-bg)', text: 'var(--finale-text)' },
    };
    return themeVars[theme] || themeVars.warm;
  };

  const themeStyles = getThemeStyles();

  return (
    <div className={styles.demo} style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}>
      <h1>Component Demo</h1>

      {/* Theme Selector */}
      <div className={styles.demoSection}>
        <h2>Theme Selector</h2>
        <div className={styles.themeSelector}>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`${styles.themeButton} ${theme === t ? styles.themeButtonActive : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* TextInput Demo */}
      <div className={styles.demoSection}>
        <h2>TextInput</h2>
        <p>Type "riya" and press Enter for success, anything else for error.</p>
        <TextInput
          value={inputValue}
          onChange={setInputValue}
          onValidate={handleValidate}
          placeholder='Type "riya" and press Enter'
        />
        {inputStatus && (
          <p style={{ marginTop: '0.5rem' }}>
            Status: <strong>{inputStatus}</strong>
          </p>
        )}
      </div>

      {/* HintButton Demo */}
      <div className={styles.demoSection}>
        <h2>HintButton</h2>
        <p>Click to reveal hints progressively (3 levels).</p>
        <HintButton
          hints={[
            'First hint: Look carefully...',
            'Second hint: It might be hidden...',
            'Third hint: Check the corners!',
          ]}
          onHintUsed={handleHintUsed}
          roomId={1}
        />
      </div>

      {/* ClickableArea Demo */}
      <div className={styles.demoSection}>
        <h2>ClickableArea</h2>
        <p>Click the hidden areas to find them. One is a decoy!</p>
        <div className={styles.demoContainer}>
          <ClickableArea
            id="area1"
            x={10}
            y={10}
            width={20}
            height={25}
            found={foundAreas['area1']}
            onFind={handleAreaFind}
          />
          <ClickableArea
            id="area2"
            x={60}
            y={40}
            width={25}
            height={30}
            found={foundAreas['area2']}
            onFind={handleAreaFind}
          />
          <ClickableArea
            id="decoy"
            x={30}
            y={60}
            width={15}
            height={20}
            found={foundAreas['decoy']}
            onFind={handleAreaFind}
            isDecoy
          />
        </div>
        <p style={{ marginTop: '0.5rem' }}>
          Found: {Object.keys(foundAreas).filter((k) => !k.includes('decoy')).length}/2
        </p>
      </div>

      {/* RunawayButton Demo */}
      <div className={styles.demoSection}>
        <h2>RunawayButton</h2>
        <p>Try to click the button! It will try to escape.</p>
        <div className={styles.demoContainer} style={{ height: '200px' }}>
          <RunawayButton onCatch={handleCatch} />
        </div>
      </div>

      {/* Transition Demo */}
      <div className={styles.demoSection}>
        <h2>Transition</h2>
        <p>Toggle visibility to see the fade animation.</p>
        <button
          onClick={() => setShowTransition(!showTransition)}
          className={styles.themeButton}
          style={{ marginBottom: '1rem' }}
        >
          Toggle ({showTransition ? 'Visible' : 'Hidden'})
        </button>
        <Transition isVisible={showTransition}>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--moody-accent)',
              borderRadius: '8px',
              color: 'white',
            }}
          >
            This content fades in and out smoothly using only opacity and transform.
          </div>
        </Transition>
      </div>
    </div>
  );
}

export default ComponentDemo;
