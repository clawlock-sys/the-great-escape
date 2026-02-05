// src/hooks/useAudio.js
import { Howl } from 'howler';
import { useRef, useEffect } from 'react';

export function useAudio(src, options = {}) {
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      loop: options.loop || false,
      volume: options.volume || 0.5,
    });
    return () => soundRef.current?.unload();
  }, [src]);

  return {
    play: () => soundRef.current?.play(),
    stop: () => soundRef.current?.stop(),
    fade: (from, to, duration) => soundRef.current?.fade(from, to, duration),
  };
}
