import styles from '../styles/components.module.css';

/**
 * Positioned hotspot for image puzzles
 *
 * IMPORTANT: Parent container MUST have position: relative for percentage-based
 * positioning to work correctly.
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier for this area
 * @param {number} props.x - Left position as percentage (0-100)
 * @param {number} props.y - Top position as percentage (0-100)
 * @param {number} props.width - Width as percentage (0-100)
 * @param {number} props.height - Height as percentage (0-100)
 * @param {boolean} props.found - Whether this area has been found
 * @param {function} props.onFind - Called when clicked: (id, isDecoy) => void
 * @param {boolean} [props.isDecoy] - Whether this is a decoy (wrong answer)
 */
export function ClickableArea({
  id,
  x,
  y,
  width,
  height,
  found,
  onFind,
  isDecoy = false,
}) {
  const handleClick = () => {
    if (found) return;
    onFind(id, isDecoy);
  };

  return (
    <div
      className={`${styles.area} ${found ? styles.areaFound : ''}`}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={found ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-pressed={found}
    />
  );
}

export default ClickableArea;
