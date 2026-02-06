// src/hooks/useAudio.js
import { Howl } from 'howler';
import { useRef, useEffect } from 'react';

export function useAudio(src, options = {}) {
  const soundRef = useRef(null);

  useEffect(() => {
    // Prefix with base URL for GitHub Pages compatibility
    const fullPath = src.startsWith('http') ? src : `${import.meta.env.BASE_URL}${src.startsWith('/') ? src.slice(1) : src}`;
    
    soundRef.current = new Howl({
      src: [fullPath],
      loop: options.loop || false,
      volume: options.volume || 0.5,
      preload: true,
      html5: true,
    });
    return () => soundRef.current?.unload();
  }, [src]);

  return {
    play: (startTime) => {
      const id = soundRef.current?.play();
      if (startTime && id !== undefined) {
        soundRef.current?.seek(startTime, id);
      }
      return id;
    },
    stop: () => soundRef.current?.stop(),
    seek: (time) => soundRef.current?.seek(time),
    fade: (from, to, duration) => soundRef.current?.fade(from, to, duration),
  };
}
