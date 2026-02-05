# Implementation Plan - Room 0 (Entry) and Room 1 (Market)
## Run: 0003-room0-room1
## Worker: main
## Lens: component_architecture

---

## Scope Anchor

**Goal**: Implement Room 0 (Entry) and Room 1 (Market) per SPEC-v2.md specifications.

**Constraints**:
- MUST: Use existing shared components (TextInput, HintButton, Transition)
- MUST: Wire room completion to useRoom.completeRoom/nextRoom
- MUST: Support both date formats for Room 0 (10052024, 10/05/2024, etc.)
- MUST: Include accessibility (prefers-reduced-motion for flicker)
- MUST NOT: Create new global state systems (use useRoom)
- MUST NOT: Add routing library (conditional rendering only)
- MUST NOT: Hard-code colors (use CSS variables)

**Success Criteria**:
- [ ] Room 0 displays typewriter text with sound
- [ ] Room 0 accepts date input and validates correctly
- [ ] Room 0 shows screen flicker with Biggie easter egg frame
- [ ] Room 0 transitions to Room 1 on success
- [ ] Room 1 displays 7 market stalls (6 visible, 1 partially hidden)
- [ ] Room 1 accepts "RISTORA" and validates correctly
- [ ] Room 1 transitions to Room 2 on success
- [ ] Both rooms have 3 progressive hints
- [ ] Hints are persisted to game state

---

## Evidence Summary

| Fact | Source | Anchor |
|------|--------|--------|
| TextInput validates on Enter key | discover.md | src/components/TextInput.jsx:23 |
| HintButton accepts hints array + onHintUsed | discover.md | src/components/HintButton.jsx:12-20 |
| useRoom provides nextRoom, completeRoom, useHint | discover.md | src/hooks/useRoom.js:26-57 |
| Room 0 initial state missing hintsUsed | explore.md:H-01 | src/hooks/useRoom.js:7 |
| validate() normalizes with regex `/[\s\-\/\.]/g` | explore.md | src/utils/solutions.js:10 |
| Solution 0 = hash('10052024') | discover.md | src/utils/solutions.js:6 |
| Solution 1 = hash('ristora') | discover.md | src/utils/solutions.js:7 |
| Creepy theme vars defined | discover.md | src/styles/variables.css:3-5 |
| App.jsx room routing is placeholder | explore.md:H-11 | src/App.jsx:29-35 |
| public/audio/ is empty | explore.md:H-02 | Bash: ls public/audio |
| Transition uses opacity+transform only | explore.md | src/styles/components.module.css:98-107 |
| useAudio creates Howl with src, loop, volume | discover.md | src/hooks/useAudio.js:9-13 |
| Google Fonts loaded: Creepster, Inter | discover.md | index.html:10 |

---

## Implementation Ledger

### Phase A: Infrastructure Fixes

#### Task A.1: Fix Room 0 initial state
- **Objective**: Add hintsUsed to Room 0 state structure
- **Files**: MODIFY src/hooks/useRoom.js
- **Evidence**: H-01 in explore.md
- **Change**:
  ```javascript
  // Line 7: Change from
  0: { completed: false, attempts: 0 },
  // To
  0: { completed: false, attempts: 0, hintsUsed: 0 },
  ```
- **Definition of Done**: Room 0 state matches Room 1-6 structure
- **Risks**: H-01
- **Mitigation**: Direct fix

#### Task A.2: Create rooms directory
- **Objective**: Establish rooms folder structure
- **Files**: CREATE src/rooms/ directory
- **Evidence**: TECH-SPEC.md project structure
- **Definition of Done**: Directory exists
- **Risks**: None
- **Mitigation**: N/A

#### Task A.3: Create audio placeholders
- **Objective**: Create placeholder audio files or document audio requirements
- **Files**: CREATE docs/AUDIO-REQUIREMENTS.md
- **Evidence**: H-02 in explore.md
- **Definition of Done**: Audio file requirements documented with sources
- **Risks**: H-02
- **Mitigation**: Document requirements; useAudio gracefully handles missing files

---

### Phase B: Room 0 - Core Component

#### Task B.1: Create useTypewriter hook
- **Objective**: Reusable typewriter text effect
- **Files**: CREATE src/hooks/useTypewriter.js
- **Evidence**: Context7 setInterval pattern; discover.md Phase 4
- **Implementation**:
  ```javascript
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
  ```
- **Definition of Done**: Hook returns { displayText, isComplete }
- **Risks**: H-06 (cleanup)
- **Mitigation**: clearInterval in cleanup function

#### Task B.2: Create Room0.module.css
- **Objective**: Room 0 specific styles with flicker animation
- **Files**: CREATE src/styles/Room0.module.css
- **Evidence**: SPEC-v2.md:55 atmosphere description
- **Implementation**:
  ```css
  .room0 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: var(--creepy-bg);
    color: var(--creepy-text);
    font-family: var(--font-creepy);
  }

  .typewriterText {
    font-size: 1.5rem;
    text-align: center;
    max-width: 600px;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .inputContainer {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .flicker {
    animation: flicker 0.15s ease-in-out;
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    25% { opacity: 0.4; }
    50% { opacity: 0.8; }
    75% { opacity: 0.2; }
  }

  .redFlash {
    animation: redFlash 0.3s ease-out;
  }

  @keyframes redFlash {
    0%, 100% { background-color: var(--creepy-bg); }
    50% { background-color: var(--eerie-text); }
  }

  .biggieFrame {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/images/biggie/biggie-silhouette.png') center center no-repeat;
    background-size: contain;
    opacity: 0.3;
    pointer-events: none;
    z-index: 100;
  }

  /* Accessibility: Respect motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .flicker,
    .redFlash {
      animation: none;
    }
  }
  ```
- **Definition of Done**: CSS includes flicker, redFlash, biggieFrame, prefers-reduced-motion
- **Risks**: H-07
- **Mitigation**: prefers-reduced-motion media query

#### Task B.3: Create Room0Entry.jsx
- **Objective**: Complete Room 0 component
- **Files**: CREATE src/rooms/Room0Entry.jsx
- **Evidence**: SPEC-v2.md:55-95
- **Implementation**:
  ```javascript
  import { useState, useEffect, useCallback } from 'react';
  import { TextInput } from '../components/TextInput';
  import { HintButton } from '../components/HintButton';
  import { Transition } from '../components/Transition';
  import { useTypewriter } from '../hooks/useTypewriter';
  import { useAudio } from '../hooks/useAudio';
  import { validate } from '../utils/solutions';
  import styles from '../styles/Room0.module.css';

  const NARRATIVE_TEXT = `"The door will only open for the one who remembers."

"When did it begin? The first moment. The first day."

"Enter the date. MM.DD.YYYY"`;

  const HINTS = [
    'A market. A Saturday. Fall had just arrived.',
    'The tenth month. The fifth day.',
    'October 2024.',
  ];

  export function Room0Entry({ onComplete, onHintUsed }) {
    const [inputValue, setInputValue] = useState('');
    const [isFlickering, setIsFlickering] = useState(false);
    const [showRedFlash, setShowRedFlash] = useState(false);
    const [showBiggie, setShowBiggie] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const { displayText, isComplete: textComplete } = useTypewriter(NARRATIVE_TEXT, 60);

    // Audio hooks (gracefully handle missing files)
    const ambient = useAudio('/audio/ambient-drone.mp3', { loop: true, volume: 0.3 });
    const typewriterSound = useAudio('/audio/typewriter-click.mp3', { volume: 0.2 });

    // Start ambient on mount
    useEffect(() => {
      ambient.play();
      setIsVisible(true);
      return () => ambient.stop();
    }, []);

    // Random flicker effect
    useEffect(() => {
      const scheduleFlicker = () => {
        const delay = 3000 + Math.random() * 5000; // 3-8s
        return setTimeout(() => {
          setIsFlickering(true);

          // Randomly show Biggie (1 in 5 chance)
          if (Math.random() < 0.2) {
            setShowBiggie(true);
            setTimeout(() => setShowBiggie(false), 50); // ~3 frames
          }

          setTimeout(() => setIsFlickering(false), 200);
          scheduleFlicker();
        }, delay);
      };

      const timerId = scheduleFlicker();
      return () => clearTimeout(timerId);
    }, []);

    const handleValidate = useCallback((value) => {
      const isValid = validate(0, value);

      if (isValid) {
        onComplete?.();
        return true;
      } else {
        // Trigger red flash
        setShowRedFlash(true);
        setTimeout(() => setShowRedFlash(false), 300);
        return false;
      }
    }, [onComplete]);

    const handleHintUsed = useCallback((roomId, level) => {
      onHintUsed?.(roomId, level);
    }, [onHintUsed]);

    const roomClasses = [
      styles.room0,
      isFlickering && styles.flicker,
      showRedFlash && styles.redFlash,
    ].filter(Boolean).join(' ');

    return (
      <Transition isVisible={isVisible}>
        <div className={roomClasses}>
          {showBiggie && <div className={styles.biggieFrame} />}

          <p className={styles.typewriterText}>
            {displayText}
          </p>

          {textComplete && (
            <div className={styles.inputContainer}>
              <TextInput
                value={inputValue}
                onChange={setInputValue}
                onValidate={handleValidate}
                placeholder="Enter date (MM.DD.YYYY)"
              />
              <HintButton
                hints={HINTS}
                onHintUsed={handleHintUsed}
                roomId={0}
              />
            </div>
          )}
        </div>
      </Transition>
    );
  }

  export default Room0Entry;
  ```
- **Definition of Done**: Component renders, accepts input, validates, shows flicker
- **Risks**: H-04, H-05, H-06
- **Mitigation**: Callbacks wired; useEffect cleanup

---

### Phase C: Room 1 - Core Component

#### Task C.1: Create Room1.module.css
- **Objective**: Room 1 specific styles with oversaturated effect
- **Files**: CREATE src/styles/Room1.module.css
- **Evidence**: SPEC-v2.md:97 atmosphere description
- **Implementation**:
  ```css
  .room1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(180deg, #fff8e7 0%, #ffe4b5 100%);
    filter: saturate(1.3) brightness(1.05);
    font-family: var(--font-body);
  }

  .marketScene {
    position: relative;
    width: 100%;
    max-width: 1000px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stall {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform var(--transition-fast);
  }

  .stall:hover {
    transform: translateY(-4px);
  }

  .stallName {
    font-family: var(--font-elegant);
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .stallFirstLetter {
    color: var(--creepy-text);
    font-weight: 700;
  }

  .stallItems {
    font-size: 0.9rem;
    color: #718096;
  }

  .stallHidden {
    opacity: 0.4;
    transform: translateX(30%) scale(0.9);
    filter: grayscale(0.5);
  }

  .stallHidden:hover {
    opacity: 0.7;
    transform: translateX(30%) scale(0.95);
  }

  .prompt {
    font-family: var(--font-elegant);
    font-size: 1.25rem;
    font-style: italic;
    color: #2d3748;
    margin-bottom: 1rem;
    text-align: center;
  }

  .inputContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: 400px;
  }

  .wrongAnswer {
    color: var(--eerie-text);
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  ```
- **Definition of Done**: CSS includes stalls grid, hidden stall, oversaturated filter
- **Risks**: H-12
- **Mitigation**: filter: saturate(1.3)

#### Task C.2: Create Room1Market.jsx
- **Objective**: Complete Room 1 component
- **Files**: CREATE src/rooms/Room1Market.jsx
- **Evidence**: SPEC-v2.md:97-165
- **Implementation**:
  ```javascript
  import { useState, useEffect, useCallback } from 'react';
  import { TextInput } from '../components/TextInput';
  import { HintButton } from '../components/HintButton';
  import { Transition } from '../components/Transition';
  import { useAudio } from '../hooks/useAudio';
  import { validate } from '../utils/solutions';
  import styles from '../styles/Room1.module.css';

  const STALLS = [
    { id: 1, name: "Rosie's Roots", items: 'Radishes, Carrots', hidden: false },
    { id: 2, name: "Ivy's Organics", items: 'Kale, Spinach', hidden: false },
    { id: 3, name: 'Sunrise Blooms', items: 'Lilies, Roses', hidden: false },
    { id: 4, name: 'Terra Fruits', items: 'Apples, Pears', hidden: false },
    { id: 5, name: 'Oak Barrel Honey', items: 'Wildflower, Clover', hidden: false },
    { id: 6, name: 'Red Barn Eggs', items: 'Free Range, Organic', hidden: false },
    { id: 7, name: 'Abandoned', items: '???', hidden: true },
  ];

  const HINTS = [
    'The vendors have names. Look closer at who\'s selling.',
    'First impressions matter. First letters too.',
    'Six stalls in light. One in shadow. Seven letters.',
  ];

  export function Room1Market({ onComplete, onHintUsed }) {
    const [inputValue, setInputValue] = useState('');
    const [showWrongAnswer, setShowWrongAnswer] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Audio
    const ambient = useAudio('/audio/ambient-market.mp3', { loop: true, volume: 0.3 });

    useEffect(() => {
      ambient.play();
      setIsVisible(true);
      return () => ambient.stop();
    }, []);

    const handleValidate = useCallback((value) => {
      const isValid = validate(1, value);

      if (isValid) {
        onComplete?.();
        return true;
      } else {
        setShowWrongAnswer(true);
        setTimeout(() => setShowWrongAnswer(false), 2000);
        return false;
      }
    }, [onComplete]);

    const handleHintUsed = useCallback((roomId, level) => {
      onHintUsed?.(roomId, level);
    }, [onHintUsed]);

    const renderStallName = (name) => {
      const firstLetter = name[0];
      const rest = name.slice(1);
      return (
        <>
          <span className={styles.stallFirstLetter}>{firstLetter}</span>
          {rest}
        </>
      );
    };

    return (
      <Transition isVisible={isVisible}>
        <div className={styles.room1}>
          <div className={styles.marketScene}>
            {STALLS.map((stall) => (
              <div
                key={stall.id}
                className={`${styles.stall} ${stall.hidden ? styles.stallHidden : ''}`}
              >
                <div className={styles.stallName}>
                  {renderStallName(stall.name)}
                </div>
                <div className={styles.stallItems}>{stall.items}</div>
              </div>
            ))}
          </div>

          <p className={styles.prompt}>"What word do the stalls whisper?"</p>

          <div className={styles.inputContainer}>
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onValidate={handleValidate}
              placeholder="Enter the word..."
            />
            <HintButton
              hints={HINTS}
              onHintUsed={handleHintUsed}
              roomId={1}
            />
            {showWrongAnswer && (
              <p className={styles.wrongAnswer}>That's not what they whisper...</p>
            )}
          </div>
        </div>
      </Transition>
    );
  }

  export default Room1Market;
  ```
- **Definition of Done**: Component renders 7 stalls, accepts input, validates
- **Risks**: H-04, H-05
- **Mitigation**: Callbacks wired to parent

---

### Phase D: App Integration

#### Task D.1: Update App.jsx with room routing
- **Objective**: Wire room components to App
- **Files**: MODIFY src/App.jsx
- **Evidence**: H-11 in explore.md
- **Implementation**:
  ```javascript
  import { useRoom } from './hooks/useRoom';
  import { MobileBlocker } from './components/MobileBlocker';
  import { ComponentDemo } from './components/ComponentDemo';
  import { Room0Entry } from './rooms/Room0Entry';
  import { Room1Market } from './rooms/Room1Market';

  function App() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const { gameState, nextRoom, completeRoom, useHint, recordAttempt } = useRoom();

    const urlParams = new URLSearchParams(window.location.search);
    const demoMode = urlParams.get('demo');

    if (demoMode === 'components') {
      return <ComponentDemo />;
    }

    if (isMobile) {
      return <MobileBlocker />;
    }

    const handleRoomComplete = (roomId) => {
      completeRoom(roomId);
      nextRoom();
    };

    const handleHintUsed = (roomId, level) => {
      useHint(roomId);
    };

    const renderRoom = () => {
      switch (gameState.currentRoom) {
        case 0:
          return (
            <Room0Entry
              onComplete={() => handleRoomComplete(0)}
              onHintUsed={handleHintUsed}
            />
          );
        case 1:
          return (
            <Room1Market
              onComplete={() => handleRoomComplete(1)}
              onHintUsed={handleHintUsed}
            />
          );
        default:
          return (
            <div className="app">
              <h1 style={{ fontFamily: 'var(--font-creepy)', fontSize: '3rem' }}>
                Room {gameState.currentRoom}
              </h1>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                Coming soon...
              </p>
            </div>
          );
      }
    };

    return renderRoom();
  }

  export default App;
  ```
- **Definition of Done**: Rooms render based on currentRoom, transitions work
- **Risks**: H-11
- **Mitigation**: Switch statement covers all cases

---

### Phase E: Validation & Testing

#### Task E.1: Verify date format normalization
- **Objective**: Confirm all date formats work for Room 0
- **Files**: (manual test)
- **Evidence**: H-03, C-01
- **Test Cases**:
  | Input | Expected | Normalized |
  |-------|----------|------------|
  | 10052024 | true | 10052024 |
  | 10/05/2024 | true | 10052024 |
  | 10.05.2024 | true | 10052024 |
  | 10-05-2024 | true | 10052024 |
  | 10 05 2024 | true | 10052024 |
  | WRONG | false | wrong |
- **Definition of Done**: All formats validate correctly
- **Risks**: H-03
- **Mitigation**: validate() regex handles all separators

#### Task E.2: Verify RISTORA normalization
- **Objective**: Confirm case-insensitive for Room 1
- **Files**: (manual test)
- **Evidence**: C-07
- **Test Cases**:
  | Input | Expected |
  |-------|----------|
  | RISTORA | true |
  | ristora | true |
  | Ristora | true |
  | RiStOrA | true |
  | WRONG | false |
- **Definition of Done**: All cases validate correctly
- **Risks**: None
- **Mitigation**: validate() lowercases input

---

## Blast Radius Map

### Impacted Surfaces

| Surface | Why | Risk Level |
|---------|-----|------------|
| src/hooks/useRoom.js | Room 0 state fix | Low |
| src/App.jsx | Room routing | High |
| src/rooms/ (new) | New components | High |
| src/styles/Room0.module.css (new) | New styles | Medium |
| src/styles/Room1.module.css (new) | New styles | Medium |
| src/hooks/useTypewriter.js (new) | New hook | Medium |

### Decoupled Surfaces (Safe)

| Surface | Evidence |
|---------|----------|
| src/components/ | Read-only usage of existing components |
| src/hooks/useAudio.js | No modifications |
| src/utils/solutions.js | No modifications |
| src/styles/variables.css | No modifications |
| src/styles/components.module.css | No modifications |

---

## Hazards & Mitigations

| H-ID | Hazard | Mitigation | Verification |
|------|--------|------------|--------------|
| H-01 | Room 0 missing hintsUsed | Task A.1: Add to initial state | Check useRoom.js:7 |
| H-02 | Audio files missing | Task A.3: Document requirements; graceful fallback | Manual test without audio |
| H-03 | Date format rejection | Task E.1: Test all formats | Unit test validate(0, ...) |
| H-04 | TextInput not wired to completion | Tasks B.3, C.2: onComplete callback | Integration test |
| H-05 | HintButton not wired to state | Tasks B.3, C.2: onHintUsed callback | Check gameState.totalHintsUsed |
| H-06 | Typewriter memory leak | Task B.1: clearInterval cleanup | Inspect devtools |
| H-07 | Flicker accessibility | Task B.2: prefers-reduced-motion | Manual test with setting |
| H-08 | Transition layout shift | Already mitigated | Verify opacity+transform only |
| H-09 | Biggie image missing | Task A.3: Document in requirements | Manual test |
| H-10 | No wrong answer feedback | Tasks B.3, C.2: showRedFlash, showWrongAnswer | Visual test |
| H-11 | App.jsx routing missing | Task D.1: Switch statement | E2E test |
| H-12 | Oversaturated undefined | Task C.1: filter: saturate(1.3) | Visual test |
| H-13 | Timer not started | Handled by nextRoom() | Check startTime after completion |
| H-14 | Audio conflicts | One ambient per room; cleanup on unmount | Manual test |
| H-CFG-01 | Vite base path | Verify in vite.config.js | Production build test |
| H-CFG-02 | localStorage collision | Unique key exists | N/A |
| H-CFG-03 | Audio path mismatch | Relative to public/ | Production build test |

---

## Test & Validation Plan

### New Tests

| Test | Type | Validates | Location |
|------|------|-----------|----------|
| validate-room0-dates.test.js | Unit | H-03 Date formats | src/__tests__/ |
| validate-room1-word.test.js | Unit | C-07 RISTORA | src/__tests__/ |
| useTypewriter.test.js | Unit | B.1 Hook behavior | src/__tests__/ |
| room0-integration.test.js | Integration | H-04, H-05, H-11 | src/__tests__/ |
| room1-integration.test.js | Integration | H-04, H-05, H-11 | src/__tests__/ |

### Test <-> Hazard <-> Task Mapping

| H-ID | Test | Task |
|------|------|------|
| H-01 | Check state structure | A.1 |
| H-03 | validate-room0-dates.test.js | E.1 |
| H-04 | room0-integration.test.js | B.3, C.2 |
| H-05 | room0-integration.test.js | B.3, C.2 |
| H-06 | useTypewriter.test.js | B.1 |
| H-07 | Manual: prefers-reduced-motion | B.2 |
| H-11 | room0-integration.test.js | D.1 |

---

## Proof Obligations

| Claim | How to Verify |
|-------|---------------|
| TextInput validates on Enter | read_file src/components/TextInput.jsx:23 |
| HintButton accepts hints array | read_file src/components/HintButton.jsx:12-20 |
| useRoom.nextRoom increments currentRoom | read_file src/hooks/useRoom.js:26-32 |
| validate normalizes input | read_file src/utils/solutions.js:10 |
| Creepy theme vars exist | read_file src/styles/variables.css:3-5 |
| Room 0 solution is 10052024 | read_file src/utils/solutions.js:6 |
| Room 1 solution is ristora | read_file src/utils/solutions.js:7 |
| App.jsx is placeholder | read_file src/App.jsx:29-35 |

---

## Ambiguities & RFIs

| Question | Options | Consequence |
|----------|---------|-------------|
| Typewriter sound per character or continuous? | A: Per char (many plays), B: Continuous loop | UX difference; A more authentic |
| Biggie silhouette frequency? | A: 1 in 5 flickers, B: Every flicker | Easter egg rarity |
| Wrong answer text for Room 0? | A: "That's not when it started", B: Just red flash | Per SPEC, should show text |

**Blocked until resolved**: None - default to SPEC-v2.md behavior

---

## Assumption Registry

| A-ID | Assumption | Classification | Evidence | Risk if Wrong |
|------|------------|----------------|----------|---------------|
| A-01 | Typewriter speed 60ms/char | IMPLICIT | SPEC says "letter by letter" | Easy to adjust |
| A-02 | Flicker interval 3-8s | IMPLICIT | Reasonable for "occasional" | Easy to adjust |
| A-03 | Biggie 1-in-5 flickers | IMPLICIT | Easter egg should be rare | Easy to adjust |
| A-04 | Audio files will be added later | VERIFIED | public/audio/ exists but empty | Graceful fallback |
| A-05 | Oversaturated = saturate(1.3) | IMPLICIT | Standard CSS filter approach | Easy to adjust |
| A-06 | Grid layout for stalls | IMPLICIT | Clean visual arrangement | Could use flex |
| A-07 | Stall 7 partially visible (30% offset) | IMPLICIT | "partially hidden/collapsed" | Easy to adjust |

---

## Handoff

Ready for Skeptic review.

**Proof Obligations**: 8
**Hazards Mitigated**: 17/17
**Tasks Defined**: 9
**Assumptions**: 7 (0 USER DECISION)

---

## File Summary

### Files to CREATE

| File | Purpose | Task |
|------|---------|------|
| src/rooms/Room0Entry.jsx | Entry room component | B.3 |
| src/rooms/Room1Market.jsx | Market room component | C.2 |
| src/styles/Room0.module.css | Room 0 styles | B.2 |
| src/styles/Room1.module.css | Room 1 styles | C.1 |
| src/hooks/useTypewriter.js | Typewriter effect hook | B.1 |
| docs/AUDIO-REQUIREMENTS.md | Audio file specs | A.3 |

### Files to MODIFY

| File | Change | Task |
|------|--------|------|
| src/hooks/useRoom.js | Add hintsUsed to Room 0 | A.1 |
| src/App.jsx | Add room routing | D.1 |

### Files to CREATE (directory)

| Directory | Purpose | Task |
|-----------|---------|------|
| src/rooms/ | Room components | A.2 |
