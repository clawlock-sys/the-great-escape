import { useEffect } from 'react';
import styles from '../styles/StallModal.module.css';

export function StallModal({ stall, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!stall) return null;

  const isAbandoned = stall.id === 7;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.imageContainer}>
          <img
            src={`${import.meta.env.BASE_URL}${stall.image.slice(1)}`}
            alt={stall.name}
            className={styles.stallImage}
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          {/* Glowing "A" overlay for abandoned stall */}
          {isAbandoned && (
            <div className={styles.glowingLetter}>A</div>
          )}
        </div>

        <div className={styles.stallInfo}>
          <h2 className={styles.stallName}>
            <span className={styles.firstLetter}>{stall.name[0]}</span>
            {stall.name.slice(1)}
          </h2>
          <p className={styles.stallItems}>{stall.items}</p>
        </div>
      </div>
    </div>
  );
}

export default StallModal;
