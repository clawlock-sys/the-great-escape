import styles from '../styles/components.module.css';

/**
 * Room transition animation wrapper
 *
 * Animates children with opacity and transform (no layout shift per H-08).
 * Uses --transition-slow CSS variable for timing.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to wrap
 * @param {boolean} props.isVisible - Controls visibility/animation
 * @param {string} [props.className] - Additional CSS classes
 */
export function Transition({ children, isVisible, className = '' }) {
  const transitionClasses = [
    styles.transition,
    isVisible && styles.transitionEnter,
    !isVisible && styles.transitionExit,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={transitionClasses}>{children}</div>;
}

export default Transition;
