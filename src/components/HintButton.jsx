import { useState } from 'react';
import styles from '../styles/components.module.css';

/**
 * Progressive hint reveal button (3 levels)
 *
 * @param {Object} props
 * @param {string[]} props.hints - Array of 3 hint strings
 * @param {function} props.onHintUsed - Called when hint revealed: (roomId, hintLevel) => void
 * @param {number} props.roomId - Room ID for game state tracking
 * @param {string} [props.className] - Additional CSS classes
 */
export function HintButton({
  hints,
  onHintUsed,
  roomId,
  className = '',
}) {
  const [hintLevel, setHintLevel] = useState(0); // 0 = no hints, 1-3 = hints shown

  const handleClick = () => {
    if (hintLevel >= 3) return; // All hints revealed

    const newLevel = hintLevel + 1;
    setHintLevel(newLevel);
    onHintUsed?.(roomId, newLevel);
  };

  const isDisabled = hintLevel >= 3;

  const buttonClasses = [
    styles.hintButton,
    isDisabled && styles.hintButtonDisabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={buttonClasses}
        aria-label={isDisabled ? 'All hints used' : `Get hint ${hintLevel + 1} of 3`}
      >
        {isDisabled ? 'No more hints' : `Hint (${hintLevel}/3 used)`}
      </button>

      {hintLevel > 0 && (
        <div className={styles.hintContent}>
          {hints.slice(0, hintLevel).map((hint, index) => (
            <p key={index}>
              <strong>Hint {index + 1}:</strong> {hint}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default HintButton;
