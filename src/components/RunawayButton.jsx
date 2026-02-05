import { useState, useRef } from 'react';
import styles from '../styles/components.module.css';

/**
 * Button that escapes the cursor on hover
 *
 * IMPORTANT: Parent container MUST have position: relative and defined dimensions
 * for the escape positioning to work correctly.
 *
 * @param {Object} props
 * @param {function} [props.onCatch] - Called when button is clicked: () => void
 * @param {string} [props.className] - Additional CSS classes
 */

const TAUNTS = [
  'no',
  'please?',
  'come on...',
  "I'll buy you Thai food",
  'Biggie says you have to',
  '...',
  'fine, be that way',
];

export function RunawayButton({ onCatch, className = '' }) {
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    const btn = buttonRef.current;
    const parent = btn?.parentElement;

    // H-01 mitigation: Null check before getBoundingClientRect
    if (!btn || !parent) return;

    const parentRect = parent.getBoundingClientRect();

    // Calculate escape direction (away from cursor)
    const maxX = parentRect.width - btn.offsetWidth;
    const maxY = parentRect.height - btn.offsetHeight;

    // Random position weighted away from current
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setPosition({ x: newX, y: newY });
    setAttempts((a) => a + 1);
  };

  const handleClick = () => {
    onCatch?.();
  };

  // H-10 mitigation: Cap speed at 0.1s minimum
  const speed = Math.max(0.1, 0.3 - attempts * 0.02);

  // Font shrinks with attempts (min 8px)
  const fontSize = Math.max(8, 14 - attempts * 0.5);

  const buttonClasses = [styles.runaway, className].filter(Boolean).join(' ');

  return (
    <button
      ref={buttonRef}
      type="button"
      className={buttonClasses}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: `transform ${speed}s ease-out`,
        fontSize: `${fontSize}px`,
      }}
    >
      {TAUNTS[Math.min(attempts, TAUNTS.length - 1)]}
    </button>
  );
}

export default RunawayButton;
