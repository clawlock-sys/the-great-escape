import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { HintButton } from '../components/HintButton';
import { Transition } from '../components/Transition';
import { useAudio } from '../hooks/useAudio';
import styles from '../styles/Room4.module.css';

// ═══════════════════════════════════════════
// PUZZLE 1: Drink Menu + Amplifier
// ═══════════════════════════════════════════

const DRINK_MENU = [
  { name: 'Velvet Sonic Boom', desc: 'Triple-distilled reverb with a splash of echo', price: '$14' },
  { name: 'The Sub-Woofer', desc: 'Low Frequency, High Amplitude — handle with bass', price: '$11', isClue: true },
  { name: 'Treble Trouble', desc: 'Sharp highs shaken over ice', price: '$13' },
  { name: 'The Feedback Loop', desc: 'It just keeps coming back for more', price: '$12' },
  { name: 'Purple Noise', desc: 'Smooth static with a violet twist', price: '$15' },
  { name: 'Decibel Daiquiri', desc: 'Dangerously loud, surprisingly sweet', price: '$16' },
];

const FREQ_THRESHOLD = 25;
const AMP_THRESHOLD = 75;

// ═══════════════════════════════════════════
// PUZZLE 2: Broken Tape — Wave Matching
// ═══════════════════════════════════════════

const TARGET_WAVE = { shape: 'sawtooth', wavelength: 65, phase: 33 };
const WAVE_SHAPES = ['sine', 'square', 'sawtooth'];
const WL_TOLERANCE = 8;
const PHASE_TOLERANCE = 10;

// ═══════════════════════════════════════════
// PUZZLE 3: Vinyl Crate — Logic Sorting
// ═══════════════════════════════════════════

const VINYL_RECORDS = [
  { id: 'blues', title: 'Midnight Blues', artist: 'Ray Carver', genre: 'Blues', year: 1958, color: '#3498db' },
  { id: 'synth', title: 'Electric Dreams', artist: 'Nova Circuit', genre: 'Synth-pop', year: 1984, color: '#a855f7' },
  { id: 'indie', title: 'Broken Heartstrings', artist: 'Lila West', genre: 'Indie', year: 2019, color: '#ec4899' },
  { id: 'soul', title: 'Soul on Fire', artist: 'Della Reeves', genre: 'Soul', year: 1972, color: '#ef4444' },
];

const CORRECT_ORDER = ['soul', 'blues', 'synth', 'indie'];

const VINYL_RIDDLE = [
  'The oldest soul begins the queue.',
  'A sad melody must follow near.',
  'Then dreams electric, bright and clear.',
  'The newest heartbreak ends the line.',
];

// ═══════════════════════════════════════════
// RECORD PLAYER — Final Phase
// ═══════════════════════════════════════════

const FINAL_RECORDS = [
  { id: 'largest', title: 'The Largest', artist: 'BigXDaPlug', color: '#dc2626', audio: `${import.meta.env.BASE_URL}audio/bigx-clip.mp3` },
  { id: 'gracie', title: "I Love You, I'm Sorry", artist: 'Gracie Abrams', color: '#86efac', audio: `${import.meta.env.BASE_URL}audio/gracie-abrams-clip.mp3` },
  { id: 'sombr', title: 'back to friends', artist: 'sombr', color: '#f59e0b', audio: `${import.meta.env.BASE_URL}audio/sombr-clip.mp3` },
  { id: 'vienna', title: 'Vienna', artist: 'Billy Joel', color: '#60a5fa', audio: `${import.meta.env.BASE_URL}audio/billy-joel-clip.mp3` },
  { id: 'laufey', title: 'Valentine', artist: 'Laufey', color: '#f472b6', audio: `${import.meta.env.BASE_URL}audio/laufey-clip.mp3` },
];

const HINTS = [
  'Three puzzles, three records. Look for the drink menu, a broken tape, and a vinyl crate.',
  'The drink menu hides a clue about sound. Apply it to the amplifier.',
  'Match your wave to the target. For the crate — genre matters more than age.',
];

// ═══════════════════════════════════════════
// WAVE PATH GENERATION
// ═══════════════════════════════════════════

function generateWavePath(shape, wl, phase, width = 300, height = 80) {
  const points = [];
  const centerY = height / 2;
  const amp = height / 2 - 5;
  const phaseOffset = (phase / 100) * wl;

  for (let x = 0; x <= width; x += 2) {
    const t = ((x + phaseOffset) % wl + wl) % wl;
    const norm = t / wl;
    let y;

    switch (shape) {
      case 'sine':
        y = centerY - amp * Math.sin(2 * Math.PI * norm);
        break;
      case 'square':
        y = centerY - amp * (norm < 0.5 ? 1 : -1);
        break;
      case 'sawtooth':
        y = centerY - amp * (2 * norm - 1);
        break;
      default:
        y = centerY;
    }
    points.push(`${x},${y.toFixed(1)}`);
  }

  return `M ${points.join(' L ')}`;
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export function Room4Music({ onComplete, onHintUsed }) {
  const [isVisible, setIsVisible] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Progress
  const [records, setRecords] = useState([false, false, false]);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [justUnlocked, setJustUnlocked] = useState(null);

  // Puzzle 1: Amplifier
  const [frequency, setFrequency] = useState(50);
  const [amplitude, setAmplitude] = useState(50);
  const [clueFound, setClueFound] = useState(false);
  const [ampFeedback, setAmpFeedback] = useState(null);

  // Puzzle 2: Wave
  const [waveShape, setWaveShape] = useState('sine');
  const [wavelength, setWavelength] = useState(50);
  const [wavePhase, setWavePhase] = useState(0);

  // Puzzle 3: Vinyl sort
  const [vinylSequence, setVinylSequence] = useState([]);
  const [vinylShake, setVinylShake] = useState(false);

  // Record player
  const [wrongRecord, setWrongRecord] = useState(false);
  const [largestEasterEgg, setLargestEasterEgg] = useState(false);
  const [success, setSuccess] = useState(false);

  const ambient = useAudio('/audio/my-way-instrumental.mp3', { loop: true, volume: 0.2 });
  const gracieClip = useAudio('/audio/gracie-abrams-clip.mp3', { loop: false, volume: 0.6 });
  const bigxClip = useAudio('/audio/bigx-clip.mp3', { loop: false, volume: 0.6 });
  const sombrClip = useAudio('/audio/sombr-clip.mp3', { loop: false, volume: 0.6 });
  const billyClip = useAudio('/audio/billy-joel-clip.mp3', { loop: false, volume: 0.6 });
  const laufeyClip = useAudio('/audio/laufey-clip.mp3', { loop: false, volume: 0.6 });

  const audioMap = useRef({ gracie: gracieClip, largest: bigxClip, sombr: sombrClip, vienna: billyClip, laufey: laufeyClip });
  audioMap.current = { gracie: gracieClip, largest: bigxClip, sombr: sombrClip, vienna: billyClip, laufey: laufeyClip };

  const stopAllClips = useCallback(() => {
    Object.values(audioMap.current).forEach((c) => c.stop());
  }, []);

  useEffect(() => {
    ambient.play();
    setIsVisible(true);
    return () => {
      ambient.stop();
      stopAllClips();
    };
  }, []);

  const allRecordsFound = records.every(Boolean);

  useEffect(() => {
    if (allRecordsFound && !activePuzzle && !success) {
      const t = setTimeout(() => setActivePuzzle('recordPlayer'), 1500);
      return () => clearTimeout(t);
    }
  }, [allRecordsFound, activePuzzle, success]);

  const unlockRecord = useCallback((index) => {
    setRecords((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setJustUnlocked(index);
    setTimeout(() => {
      setJustUnlocked(null);
      setActivePuzzle(null);
    }, 1200);
  }, []);

  // ── Puzzle 1: Amplifier ──
  const checkAmplifier = useCallback(() => {
    if (frequency <= FREQ_THRESHOLD && amplitude >= AMP_THRESHOLD) {
      setAmpFeedback('success');
      setTimeout(() => unlockRecord(0), 800);
    } else {
      setAmpFeedback('wrong');
      setTimeout(() => setAmpFeedback(null), 1500);
    }
  }, [frequency, amplitude, unlockRecord]);

  // ── Puzzle 2: Wave matching ──
  const waveMatches = useMemo(() => {
    return (
      waveShape === TARGET_WAVE.shape &&
      Math.abs(wavelength - TARGET_WAVE.wavelength) <= WL_TOLERANCE &&
      Math.abs(wavePhase - TARGET_WAVE.phase) <= PHASE_TOLERANCE
    );
  }, [waveShape, wavelength, wavePhase]);

  useEffect(() => {
    if (waveMatches && activePuzzle === 'mixtape' && !records[1]) {
      const t = setTimeout(() => unlockRecord(1), 800);
      return () => clearTimeout(t);
    }
  }, [waveMatches, activePuzzle, records, unlockRecord]);

  // ── Puzzle 3: Vinyl sorting ──
  const checkVinylOrder = useCallback(() => {
    const isCorrect = vinylSequence.every((id, i) => id === CORRECT_ORDER[i]);
    if (isCorrect) {
      unlockRecord(2);
    } else {
      setVinylShake(true);
      setTimeout(() => setVinylShake(false), 600);
    }
  }, [vinylSequence, unlockRecord]);

  const addToSequence = useCallback((id) => {
    setVinylSequence((prev) => {
      if (prev.includes(id) || prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const removeFromSequence = useCallback((id) => {
    setVinylSequence((prev) => prev.filter((v) => v !== id));
  }, []);

  // ── Record Player ──
  const handleRecordSelect = useCallback(
    (record) => {
      stopAllClips();
      const clip = audioMap.current[record.id];

      if (record.id === 'largest') {
        setLargestEasterEgg(true);
        clip?.play();
        setTimeout(() => setLargestEasterEgg(false), 5000);
      } else if (record.id === 'gracie') {
        setSuccess(true);
        setActivePuzzle(null);
        clip?.play();
        ambient.stop();
        setTimeout(() => onComplete?.(), 4000);
      } else {
        clip?.play();
        setWrongRecord(true);
        setTimeout(() => {
          setWrongRecord(false);
          clip?.stop();
        }, 3000);
      }
    },
    [onComplete, ambient, stopAllClips]
  );

  const handleHintUsed = useCallback(
    (roomId, level) => {
      onHintUsed?.(roomId, level);
    },
    [onHintUsed]
  );

  // Wave SVG paths
  const targetPath = useMemo(
    () => generateWavePath(TARGET_WAVE.shape, TARGET_WAVE.wavelength, TARGET_WAVE.phase),
    []
  );
  const playerPath = useMemo(
    () => generateWavePath(waveShape, wavelength, wavePhase),
    [waveShape, wavelength, wavePhase]
  );

  const availableVinyls = VINYL_RECORDS.filter((v) => !vinylSequence.includes(v.id));

  return (
    <Transition isVisible={isVisible}>
      <div className={styles.room4}>
        <div className={styles.lightingOverlay} />

        <button className={styles.debugToggle} onClick={() => setDebugMode((p) => !p)}>
          {debugMode ? 'Hide' : 'Debug'}
        </button>

        {/* Progress */}
        <div className={styles.progressBar}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${styles.recordSlot} ${records[i] ? styles.recordFound : ''} ${
                justUnlocked === i ? styles.recordJustFound : ''
              }`}
            >
              <div className={styles.recordDisc} />
              <span className={styles.recordLabel}>{records[i] ? 'Found' : `Record ${i + 1}`}</span>
            </div>
          ))}
        </div>

        {/* ═══ Puzzle Stations ═══ */}
        {!success && !activePuzzle && (
          <>
            <div
              className={`${styles.station} ${styles.stationMenu} ${records[0] ? styles.stationSolved : ''}`}
              onClick={() => !records[0] && setActivePuzzle('drinkMenu')}
            >
              <div className={styles.stationIcon}>MENU</div>
              <div className={styles.stationLabel}>Drink Menu</div>
              {debugMode && <span className={styles.debugLbl}>P1</span>}
            </div>

            {clueFound && !records[0] && (
              <div
                className={`${styles.station} ${styles.stationAmp} ${styles.stationNew}`}
                onClick={() => setActivePuzzle('amplifier')}
              >
                <div className={styles.stationIcon}>AMP</div>
                <div className={styles.stationLabel}>Amplifier</div>
                {debugMode && <span className={styles.debugLbl}>P1b</span>}
              </div>
            )}

            <div
              className={`${styles.station} ${styles.stationTape} ${records[1] ? styles.stationSolved : ''}`}
              onClick={() => !records[1] && setActivePuzzle('mixtape')}
            >
              <div className={styles.stationIcon}>TAPE</div>
              <div className={styles.stationLabel}>Broken Tape</div>
              {debugMode && <span className={styles.debugLbl}>P2</span>}
            </div>

            <div
              className={`${styles.station} ${styles.stationCrate} ${records[2] ? styles.stationSolved : ''}`}
              onClick={() => !records[2] && setActivePuzzle('vinylCrate')}
            >
              <div className={styles.stationIcon}>CRATE</div>
              <div className={styles.stationLabel}>Vinyl Crate</div>
              {debugMode && <span className={styles.debugLbl}>P3</span>}
            </div>

            {allRecordsFound && (
              <div
                className={`${styles.station} ${styles.stationPlayer} ${styles.stationNew}`}
                onClick={() => setActivePuzzle('recordPlayer')}
              >
                <div className={styles.stationIcon}>PLAY</div>
                <div className={styles.stationLabel}>Record Player</div>
              </div>
            )}
          </>
        )}

        {/* ═══ DRINK MENU OVERLAY ═══ */}
        {activePuzzle === 'drinkMenu' && (
          <div
            className={styles.overlay}
            onClick={() => {
              setClueFound(true);
              setActivePuzzle(null);
            }}
          >
            <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.menuTitle}>The Sound Bar</h2>
              <div className={styles.menuGrid}>
                {DRINK_MENU.map((drink, i) => (
                  <div key={i} className={`${styles.menuItem} ${drink.isClue ? styles.menuClue : ''}`}>
                    <div className={styles.menuItemHeader}>
                      <span className={styles.drinkName}>{drink.name}</span>
                      <span className={styles.drinkPrice}>{drink.price}</span>
                    </div>
                    <p className={styles.drinkDesc}>{drink.desc}</p>
                  </div>
                ))}
              </div>
              <button
                className={styles.overlayClose}
                onClick={() => {
                  setClueFound(true);
                  setActivePuzzle(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ═══ AMPLIFIER OVERLAY ═══ */}
        {activePuzzle === 'amplifier' && (
          <div className={styles.overlay} onClick={() => setActivePuzzle(null)}>
            <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.ampTitle}>Amplifier Controls</h2>
              <div className={styles.ampControls}>
                <div className={styles.ampRow}>
                  <label className={styles.ampLabel}>Frequency</label>
                  <div className={styles.sliderRow}>
                    <span className={styles.sliderEnd}>LOW</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className={styles.slider}
                    />
                    <span className={styles.sliderEnd}>HIGH</span>
                  </div>
                </div>
                <div className={styles.ampRow}>
                  <label className={styles.ampLabel}>Amplitude</label>
                  <div className={styles.sliderRow}>
                    <span className={styles.sliderEnd}>LOW</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={amplitude}
                      onChange={(e) => setAmplitude(Number(e.target.value))}
                      className={styles.slider}
                    />
                    <span className={styles.sliderEnd}>HIGH</span>
                  </div>
                </div>

                <div className={styles.speakerViz}>
                  <div
                    className={styles.speakerCone}
                    style={{
                      transform: `scale(${0.5 + (amplitude / 100) * 0.7})`,
                      animationDuration: `${0.05 + (frequency / 100) * 0.45}s`,
                    }}
                  />
                </div>

                <button className={styles.ampSubmit} onClick={checkAmplifier}>
                  Set Levels
                </button>

                {ampFeedback === 'wrong' && (
                  <p className={styles.ampWrong}>The speaker barely responds...</p>
                )}
                {ampFeedback === 'success' && (
                  <p className={styles.ampSuccess}>The bass drops deep. A record slides out.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══ WAVE MATCHER OVERLAY ═══ */}
        {activePuzzle === 'mixtape' && (
          <div className={styles.overlay} onClick={() => setActivePuzzle(null)}>
            <div
              className={`${styles.overlayContent} ${styles.waveOverlay}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.waveTitle}>Broken Tape — Match the Signal</h2>
              <p className={styles.waveHint}>Reconstruct the original waveform to decode the tape.</p>

              <div className={styles.waveDisplay}>
                <svg viewBox="0 0 300 80" className={styles.waveSvg} preserveAspectRatio="none">
                  <path d={targetPath} className={styles.targetWave} />
                  <path
                    d={playerPath}
                    className={`${styles.playerWave} ${waveMatches ? styles.waveMatched : ''}`}
                  />
                </svg>
                <div className={styles.waveLegend}>
                  <span className={styles.legendTarget}>Target</span>
                  <span className={styles.legendPlayer}>Yours</span>
                </div>
              </div>

              <div className={styles.waveControls}>
                <div className={styles.waveControl}>
                  <label>Shape</label>
                  <div className={styles.shapeButtons}>
                    {WAVE_SHAPES.map((s) => (
                      <button
                        key={s}
                        className={`${styles.shapeBtn} ${waveShape === s ? styles.shapeBtnActive : ''}`}
                        onClick={() => setWaveShape(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.waveControl}>
                  <label>Wavelength</label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={wavelength}
                    onChange={(e) => setWavelength(Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>
                <div className={styles.waveControl}>
                  <label>Phase</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={wavePhase}
                    onChange={(e) => setWavePhase(Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>
              </div>

              {waveMatches && <div className={styles.waveMatchBanner}>SIGNAL MATCHED</div>}
            </div>
          </div>
        )}

        {/* ═══ VINYL CRATE OVERLAY ═══ */}
        {activePuzzle === 'vinylCrate' && (
          <div className={styles.overlay} onClick={() => setActivePuzzle(null)}>
            <div
              className={`${styles.overlayContent} ${styles.crateOverlay}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.crateTitle}>Vinyl Crate</h2>

              <div className={styles.riddleCard}>
                <p className={styles.riddleHeader}>A note tucked inside reads:</p>
                {VINYL_RIDDLE.map((line, i) => (
                  <p key={i} className={styles.riddleLine}>
                    {line}
                  </p>
                ))}
              </div>

              <div className={styles.sequenceSlots}>
                {[0, 1, 2, 3].map((i) => {
                  const rec = VINYL_RECORDS.find((v) => v.id === vinylSequence[i]);
                  return (
                    <div
                      key={i}
                      className={`${styles.seqSlot} ${
                        vinylShake && vinylSequence.length === 4 ? styles.seqShake : ''
                      }`}
                      onClick={() => rec && removeFromSequence(rec.id)}
                    >
                      {rec ? (
                        <div className={styles.seqFilled} style={{ borderColor: rec.color }}>
                          <span>{rec.title}</span>
                        </div>
                      ) : (
                        <span className={styles.seqEmpty}>{i + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={styles.vinylGrid}>
                {availableVinyls.map((v) => (
                  <div key={v.id} className={styles.vinylCard} onClick={() => addToSequence(v.id)}>
                    <div
                      className={styles.vinylCardDisc}
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${v.color}, #1a1a2e)`,
                      }}
                    />
                    <div className={styles.vinylCardInfo}>
                      <span className={styles.vinylCardTitle}>{v.title}</span>
                      <span className={styles.vinylCardArtist}>{v.artist}</span>
                      <span className={styles.vinylCardMeta}>
                        {v.genre} &middot; {v.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {vinylSequence.length === 4 && (
                <button className={styles.checkOrderBtn} onClick={checkVinylOrder}>
                  Check Order
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ RECORD PLAYER OVERLAY ═══ */}
        {activePuzzle === 'recordPlayer' && (
          <div className={styles.overlay}>
            <div className={`${styles.overlayContent} ${styles.playerOverlay}`}>
              <h2 className={styles.playerTitle}>Choose a Record</h2>
              <p className={styles.playerPrompt}>Three records recovered. Which one holds the memory?</p>
              <div className={styles.finalRecords}>
                {FINAL_RECORDS.map((r) => (
                  <div key={r.id} className={styles.finalCard} onClick={() => handleRecordSelect(r)}>
                    <div
                      className={styles.finalDisc}
                      style={{
                        background: `radial-gradient(circle at 40% 40%, ${r.color}44, #0a0a1a)`,
                        borderColor: r.color,
                      }}
                    >
                      <div className={styles.discHole} />
                    </div>
                    <span className={styles.finalSong}>{r.title}</span>
                    <span className={styles.finalArtist}>{r.artist}</span>
                  </div>
                ))}
              </div>
              {wrongRecord && <p className={styles.wrongText}>That&apos;s not the one...</p>}
            </div>
          </div>
        )}

        {/* ═══ SUCCESS ═══ */}
        {success && (
          <div className={styles.successOverlay}>
            <div className={styles.successContent}>
              <div className={styles.spinningVinyl}>
                <div className={styles.vinylHole} />
              </div>
              <p className={styles.successText}>Yes... that&apos;s the one.</p>
              <p className={styles.successSong}>&quot;I Love You, I&apos;m Sorry&quot;</p>
              <p className={styles.successArtist}>Gracie Abrams</p>
            </div>
          </div>
        )}

        {/* Bottom panel */}
        <div className={styles.bottomPanel}>
          <p className={styles.prompt}>
            {success
              ? ''
              : allRecordsFound
                ? '"Three records found. One holds the memory..."'
                : '"Every record tells a story. Find all three to unlock the truth."'}
          </p>
          <div className={styles.controls}>
            <HintButton hints={HINTS} onHintUsed={handleHintUsed} roomId={4} />
          </div>
        </div>

        {/* Easter egg */}
        {largestEasterEgg && (
          <div className={styles.largestEasterEgg}>
            <div className={styles.redFlashOverlay} />
            <div className={styles.largestText}>BIG X DA PLUG!</div>
          </div>
        )}
      </div>
    </Transition>
  );
}

export default Room4Music;
