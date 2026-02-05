# Explore Report - Worker main
## Run: 0001-phase0-foundation
## Keywords: [foundation, hooks, state, audio, mobile, routing, css, variables]
## Lens: implementation_blueprint
## Entry Point: TECH-SPEC.md (provides all code patterns)

---

## Phase 1: Dependency Tracing

### File Dependency Graph

```
Entry Point (index.html:14)
    |
    v
main.jsx
    |-- imports: React, ReactDOM, App, global.css
    v
App.jsx
    |-- imports: React, useRoom, MobileBlocker
    |-- conditionally renders: Room0-Room6 (future phases)
    v
useRoom.js
    |-- imports: usePersistedState
    |-- exports: { gameState, nextRoom, completeRoom, useHint, resetGame }
    v
usePersistedState.js
    |-- imports: React (useState, useEffect)
    |-- uses: localStorage API
    |
MobileBlocker.jsx
    |-- imports: React
    |-- uses: navigator.userAgent
    |
useAudio.js
    |-- imports: React (useRef, useEffect), Howl from 'howler'
    |-- exports: { play, stop, fade }
    |
solutions.js
    |-- imports: none (pure JS)
    |-- uses: btoa (browser global)
    |-- exports: SOLUTIONS, validate
```

### External Dependencies

| Dependency | Import From | Used By | Purpose |
|------------|-------------|---------|---------|
| React | 'react' | All .jsx files | UI framework |
| ReactDOM | 'react-dom/client' | main.jsx | DOM mounting |
| Howl | 'howler' | useAudio.js | Audio playback |
| localStorage | Browser API | usePersistedState.js | State persistence |
| btoa | Browser API | solutions.js | Base64 encoding |
| navigator.userAgent | Browser API | MobileBlocker.jsx | Mobile detection |

---

## Phase 2: Coupling Analysis

### Couplings (A -> B)

| From | To | Type | Evidence | Risk |
|------|-----|------|----------|------|
| App.jsx | useRoom | State | Must call hook | None |
| App.jsx | MobileBlocker | Component | Conditional render | None |
| useRoom | usePersistedState | Hook | State persistence | H-01 |
| useAudio | Howler.js | External | Audio API | H-02 |
| solutions | btoa | Browser | Encoding | None |

### Decouplings (A X B)

| Component A | Component B | Evidence | Implication |
|-------------|-------------|----------|-------------|
| useAudio | useRoom | No shared state | Audio independent of game state |
| solutions | useRoom | No imports | Validation is pure function |
| MobileBlocker | useRoom | No state access | Blocker checks UA only |
| variables.css | Any JS | CSS-only | No JS coupling to styles |

---

## Phase 3: Code Pattern Extraction

### Pattern 1: usePersistedState (TECH-SPEC.md:82-96)

```javascript
import { useState, useEffect } from 'react';

export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
```

**Line-by-line evidence:**
- TECH-SPEC.md:83 - import statement
- TECH-SPEC.md:85 - function signature
- TECH-SPEC.md:86-89 - lazy initialization with localStorage
- TECH-SPEC.md:91-93 - effect for persistence
- TECH-SPEC.md:95 - return tuple

---

### Pattern 2: useAudio (TECH-SPEC.md:99-122)

```javascript
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
```

**Line-by-line evidence:**
- TECH-SPEC.md:100-101 - imports
- TECH-SPEC.md:103 - function signature with options
- TECH-SPEC.md:104 - useRef for sound instance
- TECH-SPEC.md:106-113 - effect creates Howl, returns cleanup
- TECH-SPEC.md:115-119 - returned methods

---

### Pattern 3: CSS Variables (TECH-SPEC.md:269-304)

```css
/* variables.css */
:root {
  /* Room 0-1: Creepy */
  --creepy-bg: #0a0a0f;
  --creepy-text: #8b0000;
  --creepy-glow: rgba(139, 0, 0, 0.3);

  /* Room 2-3: Warmer */
  --warm-bg: #1a1a2e;
  --warm-text: #eee;
  --warm-accent: #e94560;

  /* Room 4: Moody */
  --moody-bg: #16213e;
  --moody-text: #a5b4fc;
  --moody-accent: #7c3aed;

  /* Room 5: Eerie */
  --eerie-bg: #0f0f0f;
  --eerie-text: #ff4444;
  --eerie-glow: rgba(255, 0, 0, 0.2);

  /* Room 6: Celebration */
  --finale-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --finale-text: #fff;
  --finale-accent: #f472b6;

  /* Common */
  --font-creepy: 'Creepster', cursive;
  --font-elegant: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;

  --transition-slow: 0.5s ease;
  --transition-fast: 0.2s ease;
}
```

**Line-by-line evidence:**
- TECH-SPEC.md:271-275 - Creepy theme
- TECH-SPEC.md:277-280 - Warm theme
- TECH-SPEC.md:282-285 - Moody theme
- TECH-SPEC.md:287-290 - Eerie theme
- TECH-SPEC.md:292-295 - Finale theme
- TECH-SPEC.md:297-303 - Common variables

---

### Pattern 4: Game State Structure (TECH-SPEC.md:216-233)

```javascript
const initialGameState = {
  currentRoom: 0,
  rooms: {
    0: { completed: false, attempts: 0 },
    1: { completed: false, attempts: 0, hintsUsed: 0 },
    2: { completed: false, foundNashes: [], attempts: 0, hintsUsed: 0 },
    3: { completed: false, attempts: 0, hintsUsed: 0 },
    4: { completed: false, attempts: 0, hintsUsed: 0 },
    5: { completed: false, attempts: 0, hintsUsed: 0 },
    6: { completed: false },
  },
  totalHintsUsed: 0,
  startTime: null,
  endTime: null,
};
```

**Line-by-line evidence:**
- TECH-SPEC.md:218 - currentRoom starts at 0
- TECH-SPEC.md:219-228 - rooms object with per-room state
- TECH-SPEC.md:222 - Room 2 has foundNashes array
- TECH-SPEC.md:229-231 - totalHintsUsed, startTime, endTime

---

### Pattern 5: Solution Validation (TECH-SPEC.md:242-263)

```javascript
// utils/solutions.js
const hash = (str) => {
  // Simple hash for obfuscation (not security)
  return btoa(str.toLowerCase().replace(/\s/g, ''));
};

export const SOLUTIONS = {
  0: hash('10052024'),     // Date: Oct 5, 2024
  1: hash('ristora'),      // Market vendor initials
  2: hash('ilando'),       // Nash letters
  3: hash('octoberfifth'), // Anagram answer
  4: 'i-love-you-im-sorry', // Selection, not typed
  5: hash('02142025'),     // Date: Feb 14, 2025
};

export const validate = (room, answer) => {
  const normalized = answer.toLowerCase().replace(/[\s\-\/\.]/g, '');
  return hash(normalized) === SOLUTIONS[room] ||
         SOLUTIONS[room] === normalized;
};
```

**Line-by-line evidence:**
- TECH-SPEC.md:243-246 - hash function
- TECH-SPEC.md:248-255 - SOLUTIONS object
- TECH-SPEC.md:257-260 - validate function with normalization

---

### Pattern 6: Mobile Blocker (TECH-SPEC.md:337-349)

```jsx
// Logic from App.jsx
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  return (
    <div className="mobile-blocker">
      <h1>locked emoji</h1>
      <p>This experience requires a laptop.</p>
      <p>Please open on a computer for the full escape room.</p>
    </div>
  );
}
```

**Line-by-line evidence:**
- TECH-SPEC.md:338 - isMobile regex check
- TECH-SPEC.md:340-348 - blocker JSX

---

## Phase 3.5: Constraint Registry

### Constraints from feature-request.md

| C-ID | Type | Constraint | Source | Verified | Evidence |
|------|------|------------|--------|----------|----------|
| C-001 | REQUIREMENT | Use React 18+ with Vite | feature-request.md | YES | package.json:19 (React 19.2.4) |
| C-002 | REQUIREMENT | CSS Modules + CSS Variables | feature-request.md | INHERITED | TECH-SPEC.md:269-304 |
| C-003 | REQUIREMENT | Howler.js for audio | feature-request.md | YES | package.json:18 |
| C-004 | REQUIREMENT | Persist state to localStorage | feature-request.md | INHERITED | TECH-SPEC.md:82-96 |
| C-005 | REQUIREMENT | Block mobile user agents | feature-request.md | INHERITED | TECH-SPEC.md:337-349 |
| C-006 | REQUIREMENT | Obfuscate solutions (base64) | feature-request.md | INHERITED | TECH-SPEC.md:243-246 |
| C-007 | REQUIREMENT | Support 7 rooms (0-6) | feature-request.md | INHERITED | TECH-SPEC.md:218-228 |
| C-010 | LIMITATION | React 19 installed (not 18) | package.json:19 | YES | Compatible patterns |
| C-011 | LIMITATION | No routing library | TECH-SPEC.md | YES | Conditional rendering only |
| C-012 | INVARIANT | Mobile users cannot play | feature-request.md | INHERITED | MobileBlocker check |
| C-013 | INVARIANT | Room state persists | feature-request.md | INHERITED | usePersistedState |

### Constraint Conflicts

None detected. All constraints are compatible.

---

## Phase 3.6: Hazard Registry

| H-ID | Category | Hazard | Evidence | Failure Mode | Severity |
|------|----------|--------|----------|--------------|----------|
| H-01 | State | localStorage quota exceeded | TECH-SPEC.md:91-93 - no try/catch | Silent failure, state not saved | Medium |
| H-02 | Integration | Howler.js src not found | TECH-SPEC.md:108 - no error handling | Audio fails silently | Low |
| H-03 | State | JSON.parse fails on corrupt data | TECH-SPEC.md:87 - no try/catch | App crashes on load | High |
| H-04 | Compatibility | btoa undefined in non-browser | solutions.js - browser API | Build fails in SSR | Low |
| H-05 | State | useEffect dependency array | TECH-SPEC.md:114 - [src] only | Options changes ignored | Low |
| H-06 | UX | No loading state | App.jsx - missing | Flash of wrong content | Low |
| H-07 | State | Room 6 missing state fields | TECH-SPEC.md:227 - only completed | Inconsistent state shape | Low |

### Hazard Analysis

**H-01: localStorage quota**
- Risk: localStorage has 5-10MB limit
- Impact: Game state is small (<1KB), extremely unlikely
- Mitigation: Add try/catch wrapper (optional for this project)

**H-02: Howler.js src not found**
- Risk: Audio file doesn't exist
- Impact: No audio, but game playable
- Mitigation: Phase 0 doesn't use audio files, defer to Phase 6

**H-03: JSON.parse corrupt data**
- Risk: localStorage data manually edited or corrupted
- Impact: App won't load
- Mitigation: Wrap in try/catch, fallback to defaultValue
- **RECOMMENDED FIX**

**H-04: btoa in non-browser**
- Risk: Server-side rendering would fail
- Impact: This is client-only, no SSR
- Mitigation: None needed

**H-05: useEffect dependency**
- Risk: Changing options doesn't recreate Howl
- Impact: Minimal for this use case (options constant)
- Mitigation: Add options to deps or use useMemo

**H-06: No loading state**
- Risk: Brief flash before hydration
- Impact: Minor UX issue
- Mitigation: CSS in index.html for initial state

**H-07: Room 6 state inconsistency**
- Risk: Room 6 object differs from others
- Impact: Type checking issues, code inconsistency
- Mitigation: Add consistent fields to Room 6

---

## Phase 4: Lens-Specific Analysis (implementation_blueprint)

### Implementation Blueprint Findings

#### File Creation Sequence

Based on dependency analysis, files must be created in this order:

1. **src/styles/variables.css** - No dependencies
2. **src/styles/global.css** - Must import variables.css
3. **src/hooks/usePersistedState.js** - React only
4. **src/hooks/useAudio.js** - React + Howler
5. **src/hooks/useRoom.js** - Depends on usePersistedState
6. **src/utils/solutions.js** - No dependencies
7. **src/components/MobileBlocker.jsx** - React only
8. **src/App.jsx** - Depends on useRoom, MobileBlocker
9. **src/main.jsx** - Depends on App, global.css

#### Patterns to Derive (not in TECH-SPEC.md)

**main.jsx** (Standard Vite pattern):
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**useRoom.js** (Derived from state structure):
```javascript
import { usePersistedState } from './usePersistedState';

const initialGameState = {
  // ... from TECH-SPEC.md:218-232
};

export function useRoom() {
  const [gameState, setGameState] = usePersistedState('valentine-escape-state', initialGameState);

  const nextRoom = () => {
    setGameState(prev => ({
      ...prev,
      currentRoom: prev.currentRoom + 1,
      startTime: prev.startTime || Date.now()
    }));
  };

  const completeRoom = (roomId) => {
    setGameState(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: { ...prev.rooms[roomId], completed: true }
      }
    }));
  };

  const useHint = (roomId) => {
    setGameState(prev => ({
      ...prev,
      totalHintsUsed: prev.totalHintsUsed + 1,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          hintsUsed: (prev.rooms[roomId].hintsUsed || 0) + 1
        }
      }
    }));
  };

  const recordAttempt = (roomId) => {
    setGameState(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          attempts: prev.rooms[roomId].attempts + 1
        }
      }
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return {
    gameState,
    nextRoom,
    completeRoom,
    useHint,
    recordAttempt,
    resetGame,
  };
}
```

**global.css** (Derived from context):
```css
@import './variables.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
  width: 100%;
}

body {
  font-family: var(--font-body);
  background: var(--creepy-bg);
  color: var(--creepy-text);
  overflow: hidden;
}

.mobile-blocker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 2rem;
  background: var(--creepy-bg);
  color: var(--creepy-text);
}
```

**MobileBlocker.jsx** (Extracted from App pattern):
```javascript
export function MobileBlocker() {
  return (
    <div className="mobile-blocker">
      <h1>Locked</h1>
      <p>This experience requires a laptop.</p>
      <p>Please open on a computer for the full escape room.</p>
    </div>
  );
}
```

**App.jsx** (Derived from patterns):
```javascript
import { useRoom } from './hooks/useRoom';
import { MobileBlocker } from './components/MobileBlocker';

function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const { gameState } = useRoom();

  if (isMobile) {
    return <MobileBlocker />;
  }

  // Placeholder for room routing (future phases)
  return (
    <div className="app">
      <h1>Valentine Escape Room</h1>
      <p>Current Room: {gameState.currentRoom}</p>
      <p>Room components will be added in future phases.</p>
    </div>
  );
}

export default App;
```

---

## Phase 5: Handoff to Plan

### Key Constraints for Implementation

1. **MUST** create files in dependency order (variables -> global -> hooks -> utils -> components -> App -> main)
2. **MUST** use exact CSS variable values from TECH-SPEC.md:269-304
3. **MUST** use exact usePersistedState code from TECH-SPEC.md:82-96
4. **MUST** use exact useAudio code from TECH-SPEC.md:99-122
5. **MUST** use exact solutions.js code from TECH-SPEC.md:242-263
6. **SHOULD** add try/catch to JSON.parse in usePersistedState (H-03 mitigation)
7. **SHOULD** keep MobileBlocker as separate component for reusability

### Files to Create (9 total)

| # | File | Lines | Source |
|---|------|-------|--------|
| 1 | src/styles/variables.css | ~35 | TECH-SPEC.md:269-304 |
| 2 | src/styles/global.css | ~25 | Derived |
| 3 | src/hooks/usePersistedState.js | ~15 | TECH-SPEC.md:82-96 |
| 4 | src/hooks/useAudio.js | ~25 | TECH-SPEC.md:99-122 |
| 5 | src/hooks/useRoom.js | ~60 | Derived from TECH-SPEC.md:218-232 |
| 6 | src/utils/solutions.js | ~20 | TECH-SPEC.md:242-263 |
| 7 | src/components/MobileBlocker.jsx | ~15 | TECH-SPEC.md:337-349 |
| 8 | src/App.jsx | ~25 | Derived |
| 9 | src/main.jsx | ~10 | Standard Vite |

### Hazard Summary

| H-ID | Severity | Mitigation Strategy |
|------|----------|---------------------|
| H-01 | Medium | Accept risk (state < 1KB) |
| H-02 | Low | Defer to Phase 6 |
| H-03 | High | Add try/catch to JSON.parse |
| H-04 | Low | No action (client-only) |
| H-05 | Low | Accept (options constant) |
| H-06 | Low | CSS initial state in global.css |
| H-07 | Low | Normalize Room 6 state |
