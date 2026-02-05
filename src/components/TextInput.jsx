import { useState } from 'react';
import styles from '../styles/components.module.css';

/**
 * Styled text input with validation callback
 * @param {Object} props
 * @param {string} props.value - Controlled input value
 * @param {function} props.onChange - Called on input change: (newValue) => void
 * @param {function} props.onValidate - Called on Enter: (value) => boolean
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.disabled] - Disable input
 */
export function TextInput({
  value,
  onChange,
  onValidate,
  placeholder = '',
  className = '',
  disabled = false,
}) {
  const [status, setStatus] = useState(null); // null | 'error' | 'success'

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onValidate) {
      const isValid = onValidate(value);
      setStatus(isValid ? 'success' : 'error');
    }
  };

  const handleChange = (e) => {
    // Reset status when user types
    if (status) setStatus(null);
    onChange?.(e.target.value);
  };

  const inputClasses = [
    styles.textInput,
    status === 'error' && styles.textInputError,
    status === 'success' && styles.textInputSuccess,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClasses}
    />
  );
}

export default TextInput;
