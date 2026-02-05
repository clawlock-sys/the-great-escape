import { useState, useEffect } from 'react';

export function useTypewriter(text, speed = 50) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    let charIndex = 0;
    setDisplayText('');
    setIsComplete(false);

    const id = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsComplete(true);
        clearInterval(id);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return { displayText, isComplete };
}
