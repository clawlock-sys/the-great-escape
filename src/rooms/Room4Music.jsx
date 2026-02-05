import { useState, useEffect, useCallback } from 'react';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useAudio } from '../hooks/useAudio';
import styles from '../styles/Room4.module.css';

// The songs - only one is correct
const SONGS = [
  {
    id: 'bigxdaplug',
    title: 'The Largest',
    artist: 'BigXDaPlug',
    isCorrect: false,
  },
  {
    id: 'i-love-you-im-sorry',
    title: 'I Love You, I\'m Sorry',
    artist: 'Gracie Abrams',
    isCorrect: true,
  },
  {
    id: 'sombr',
    title: 'back to friends',
    artist: 'sombr',
    isCorrect: false,
  },
  {
    id: 'vienna',
    title: 'Vienna',
    artist: 'Billy Joel',
    isCorrect: false,
  },
  {
    id: 'valentine',
    title: 'Valentine',
    artist: 'Laufey',
    isCorrect: false,
  },
];

const HINTS = [
  'Not just any love song. YOUR love song.',
  'Gracie knows.',
  'I Love You, I\'m Sorry.',
];

export function Room4Music({ onComplete, onHintUsed }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [showWrongChoice, setShowWrongChoice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Audio
  const ambient = useAudio('/audio/ambient-static.mp3', { loop: true, volume: 0.15 });

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => ambient.stop();
  }, []);

  const handleSongSelect = useCallback((song) => {
    setSelectedSong(song);
    setIsPlaying(true);
    setShowWrongChoice(false);

    // Simulate playing for a moment
    setTimeout(() => {
      setIsPlaying(false);
      if (song.isCorrect) {
        setShowSuccess(true);
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      } else {
        setShowWrongChoice(true);
        setTimeout(() => setShowWrongChoice(false), 2000);
      }
    }, 1500);
  }, [onComplete]);

  const handleHintUsed = useCallback((roomId, level) => {
    onHintUsed?.(roomId, level);
  }, [onHintUsed]);

  return (
    <Transition isVisible={isVisible}>
      <div className={styles.room4}>
        {/* Purple/blue lighting overlay */}
        <div className={styles.lightingOverlay} />

        {/* Jukebox note */}
        <div className={styles.jukeboxNote}>
          <p>"Play them in order. The order of us."</p>
          <p>"First feeling. First words. First always."</p>
        </div>

        {/* Records on the wall */}
        <div className={styles.recordsWall}>
          {SONGS.map((song) => (
            <div
              key={song.id}
              className={`${styles.record} ${
                selectedSong?.id === song.id ? styles.recordSelected : ''
              } ${isPlaying && selectedSong?.id === song.id ? styles.recordSpinning : ''}`}
              onClick={() => !isPlaying && handleSongSelect(song)}
            >
              <div className={styles.recordDisc}>
                <div className={styles.recordLabel}>
                  <span className={styles.songTitle}>{song.title}</span>
                  <span className={styles.songArtist}>{song.artist}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jukebox display */}
        <div className={styles.jukebox}>
          <div className={styles.jukeboxScreen}>
            {!selectedSong && (
              <p className={styles.jukeboxPrompt}>Select a record...</p>
            )}
            {selectedSong && isPlaying && (
              <div className={styles.nowPlaying}>
                <div className={styles.waveform}>
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <p>Now Playing...</p>
                <p className={styles.currentSong}>{selectedSong.title}</p>
              </div>
            )}
            {selectedSong && !isPlaying && showWrongChoice && (
              <div className={styles.wrongChoice}>
                <p>That's not the one...</p>
                <p className={styles.tryAgain}>Try another song.</p>
              </div>
            )}
            {showSuccess && (
              <div className={styles.successMessage}>
                <p>Yes... that's the one.</p>
                <p className={styles.songMemory}>"I Love You, I'm Sorry"</p>
              </div>
            )}
          </div>
          <div className={styles.jukeboxGlow} />
        </div>

        {/* Bottom panel */}
        <div className={styles.bottomPanel}>
          <p className={styles.prompt}>
            "Which song holds the memory?"
          </p>
          <div className={styles.controls}>
            <HintButton hints={HINTS} onHintUsed={handleHintUsed} roomId={4} />
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default Room4Music;
