# Explore Report - Worker main
## Run: 0003-room0-room1
## Keywords: room, entry, market, stall, typewriter, flicker, hints, creepy, oversaturated
## Lens: component_architecture
## Entry Point: src/components/

---

## Phase 1: Dependency Tracing

### TextInput (src/components/TextInput.jsx:12)

**Inbound References:**
| Caller | Location | Purpose |
|--------|----------|---------|
| ComponentDemo.jsx | :2, :83-88 | Demo page integration |

**Outbound Dependencies:**
| Dependency | Location | Purpose |
|------------|----------|---------|
| React.useState | :1 | Status state (null/error/success) |
| styles (CSS Module) | :2 | Component styling |
| components.module.css | :2 | .textInput, .textInputError, .textInputSuccess |

**API Contract:**
```javascript
{
  value: string,           // Controlled input value
  onChange: (newValue) => void,
  onValidate: (value) => boolean,  // Called on Enter
  placeholder?: string,
  className?: string,
  disabled?: boolean
}
```

---

### HintButton (src/components/HintButton.jsx:12)

**Inbound References:**
| Caller | Location | Purpose |
|--------|----------|---------|
| ComponentDemo.jsx | :3, :98-107 | Demo page integration |

**Outbound Dependencies:**
| Dependency | Location | Purpose |
|------------|----------|---------|
| React.useState | :1 | hintLevel state (0-3) |
| styles (CSS Module) | :2 | .hintButton, .hintButtonDisabled, .hintContent |

**API Contract:**
```javascript
{
  hints: string[],               // Array of 3 hint strings
  onHintUsed: (roomId, level) => void,
  roomId: number,
  className?: string
}
```

---

### Transition (src/components/Transition.jsx:14)

**Inbound References:**
| Caller | Location | Purpose |
|--------|----------|---------|
| ComponentDemo.jsx | :6, :173-186 | Demo page integration |

**Outbound Dependencies:**
| Dependency | Location | Purpose |
|------------|----------|---------|
| styles (CSS Module) | :1 | .transition, .transitionEnter, .transitionExit |

**API Contract:**
```javascript
{
  children: React.ReactNode,
  isVisible: boolean,
  className?: string
}
```

---

### useRoom (src/hooks/useRoom.js:20)

**Inbound References:**
| Caller | Location | Purpose |
|--------|----------|---------|
| App.jsx | :2, :8 | Game state access |

**Outbound Dependencies:**
| Dependency | Location | Purpose |
|------------|----------|---------|
| usePersistedState | :2 | localStorage persistence |

**API Contract (returns):**
```javascript
{
  gameState: GameState,
  nextRoom: () => void,
  completeRoom: (roomId) => void,
  useHint: (roomId) => void,
  recordAttempt: (roomId) => void,
  findNash: (roomId, nashId) => void,
  resetGame: () => void
}
```

---

### useAudio (src/hooks/useAudio.js:5)

**Inbound References:**
| Caller | Location | Purpose |
|--------|----------|---------|
| (None yet) | - | Not integrated |

**Outbound Dependencies:**
| Dependency | Location | Purpose |
|------------|----------|---------|
| Howl (howler) | :2 | Audio engine |
| React.useRef | :3 | Sound instance storage |
| React.useEffect | :3 | Lifecycle management |

**API Contract:**
```javascript
useAudio(src: string, options?: { loop?: boolean, volume?: number })
// Returns: { play, stop, fade }
```

---

### validate (src/utils/solutions.js:9)

**Inbound References:**
| Caller | Location | Purpose |
|--------|----------|---------|
| (None yet) | - | Not integrated |

**Outbound Dependencies:**
| Dependency | Location | Purpose |
|------------|----------|---------|
| hash (internal) | :2 | Base64 encoding |
| SOLUTIONS | :5 | Room solutions map |

**Normalization Logic:**
```javascript
answer.toLowerCase().replace(/[\s\-\/\.]/g, '')
// Strips: spaces, dashes, slashes, dots
// Example: "10/05/2024" -> "10052024"
// Example: "RISTORA" -> "ristora"
```

---

## Phase 2: Coupling Analysis

### Coupled Components

| From | To | Type | Evidence | Risk |
|------|-----|------|----------|------|
| Room0 (planned) | TextInput | Props | date entry | None |
| Room0 (planned) | HintButton | Props | 3 hints | None |
| Room0 (planned) | useRoom | Hook | state tracking | H-01 |
| Room0 (planned) | useAudio | Hook | typewriter/ambient | H-02 |
| Room0 (planned) | validate | Function | date check | H-03 |
| Room1 (planned) | TextInput | Props | word entry | None |
| Room1 (planned) | HintButton | Props | 3 hints | None |
| Room1 (planned) | useRoom | Hook | state tracking | H-01 |
| Room1 (planned) | useAudio | Hook | ambient | H-02 |
| Room1 (planned) | validate | Function | RISTORA check | H-03 |
| TextInput | onValidate callback | Prop | validation trigger | H-04 |
| HintButton | onHintUsed callback | Prop | hint tracking | H-05 |

### Decoupled Surfaces (Safe)

| Component A | Component B | Evidence | Implication |
|-------------|-------------|----------|-------------|
| Room0 | Room1 | Different state keys | Can develop independently |
| TextInput | HintButton | No shared state | Compose freely |
| useRoom | useAudio | No shared deps | Independent hooks |
| CSS Modules | Components | Scoped styles | No naming collisions |

---

## Phase 3: Hazard Registry

| H-ID | Category | Hazard | Evidence | Failure Mode | Severity |
|------|----------|--------|----------|--------------|----------|
| H-01 | State | Room 0 missing hintsUsed in initial state | useRoom.js:7 `{ completed: false, attempts: 0 }` | HintButton will fail to track | Medium |
| H-02 | Asset | Audio files not present | public/audio/ is empty | No typewriter sound, no ambient | High |
| H-03 | Data | Date format "10.05.2024" not normalized | solutions.js:10 strips `[\s\-\/\.]` but hash uses '10052024' | Correct answers rejected | Critical |
| H-04 | Integration | TextInput onValidate return not connected to room completion | TextInput.jsx:23 only sets local status | Room never completes | Critical |
| H-05 | Integration | HintButton onHintUsed not wired to useRoom.useHint | No existing integration code | Hints not persisted to game state | Medium |
| H-06 | State | Typewriter effect needs cleanup on unmount | useEffect interval pattern | Memory leak, continued playback | Medium |
| H-07 | UX | Screen flicker needs accessible option | No prefers-reduced-motion check | Seizure risk, accessibility fail | High |
| H-08 | Animation | Transition uses only opacity+transform | components.module.css:98-107 | Layout shift (per memory) | Low (mitigated) |
| H-09 | Asset | Biggie silhouette image missing | public/images/biggie/ is empty | Easter egg broken | Low |
| H-10 | UX | No "wrong answer" visual feedback in TextInput | TextInput.jsx sets status but Room must handle | Confusing user experience | Medium |
| H-11 | Integration | App.jsx room routing is placeholder | App.jsx:29-35 shows static message | Rooms don't render | Critical |
| H-12 | CSS | Oversaturated effect for Room 1 undefined | No filter/saturation in variables.css | Incorrect atmosphere | Medium |
| H-13 | State | startTime only set on nextRoom | useRoom.js:30 | Entry room never starts timer | Low |
| H-14 | Async | Multiple useAudio instances may conflict | useAudio creates new Howl per call | Audio overlap, resource waste | Medium |

---

## Phase 3.5: Constraint Registry

| C-ID | Type | Constraint | Source | Verified | Evidence |
|------|------|------------|--------|----------|----------|
| C-01 | REQUIREMENT | Room 0 accepts both date formats | SPEC-v2.md:65 | PARTIAL | validate() normalizes, but needs testing |
| C-02 | REQUIREMENT | 3 hints per room | SPEC-v2.md:72-75, 142-144 | YES | HintButton supports 3 hints |
| C-03 | REQUIREMENT | Typewriter text effect | SPEC-v2.md:55 | NO | Not implemented |
| C-04 | REQUIREMENT | Screen flicker animation | SPEC-v2.md:55 | NO | Not implemented |
| C-05 | REQUIREMENT | Biggie silhouette easter egg | SPEC-v2.md:77 | NO | Image missing |
| C-06 | REQUIREMENT | 7 stalls (6 visible, 1 hidden) | SPEC-v2.md:103-115 | NO | Not implemented |
| C-07 | REQUIREMENT | Solution: RISTORA | SPEC-v2.md:123 | YES | solutions.js:8 |
| C-08 | LIMITATION | No routing library | Memory | YES | App.jsx uses conditional rendering |
| C-09 | LIMITATION | CSS Modules only | Memory | YES | components.module.css pattern |
| C-10 | INVARIANT | Room transitions via nextRoom() | useRoom.js:26-32 | YES | Sets currentRoom + 1 |
| C-11 | PREFERENCE | CSS Variables for theming | Memory | YES | variables.css:1-35 |

---

## Phase 3.6: Configuration Hazard Detection

| H-ID | Category | Config Item | Assumption | Risk | Evidence |
|------|----------|-------------|------------|------|----------|
| H-CFG-01 | Configuration | Vite base path | Assets load at /valentine-escape-room/ | Wrong path = 404s in production | vite.config.js not checked |
| H-CFG-02 | Configuration | localStorage key | 'valentine-escape-state' unique | Key collision with other apps | usePersistedState.js:6 |
| H-CFG-03 | Configuration | Audio paths | Relative to public/ | Path mismatch = silent failures | public/audio/ empty |

---

## Phase 4: Lens-Specific Analysis (component_architecture)

### Component Hierarchy (Planned)

```
App.jsx
  |-- MobileBlocker (conditional)
  |-- ComponentDemo (conditional: ?demo=components)
  |-- Room0Entry (when currentRoom === 0)
  |     |-- Transition (wrapper)
  |     |-- TypewriterText (custom)
  |     |-- TextInput (date entry)
  |     |-- HintButton (3 hints)
  |     |-- BiggieFlicker (easter egg)
  |
  |-- Room1Market (when currentRoom === 1)
        |-- Transition (wrapper)
        |-- MarketScene (visual layout)
        |     |-- Stall (x7, one hidden)
        |-- TextInput (word entry)
        |-- HintButton (3 hints)
```

### Component Responsibilities

| Component | State Owned | Side Effects | Props In | Events Out |
|-----------|-------------|--------------|----------|------------|
| Room0Entry | charIndex (typewriter), isFlickering | useAudio (2x: ambient, typewriter) | gameState | onComplete |
| Room1Market | (none internal) | useAudio (ambient) | gameState | onComplete |
| TypewriterText | charIndex | setInterval | text, speed | onComplete |
| MarketScene | (none) | none | stalls[] | onStallClick |
| Stall | (none) | none | vendor, items, hidden | onClick |

### Pattern Recommendations

1. **Typewriter Hook**: Extract to `useTypewriter(text, speed)` returning `{ displayText, isComplete }`
2. **Room Wrapper**: Create `RoomContainer` with common layout + transition logic
3. **Audio Manager**: Consider singleton pattern for multiple audio sources
4. **Flicker Component**: CSS-only with @keyframes, trigger via className toggle

---

## Phase 5: Component Architecture Deep Dive

### Room0Entry Component Design

**State Requirements:**
- `charIndex: number` - Current character position in typewriter
- `isFlickering: boolean` - Whether screen is flickering
- `showBiggie: boolean` - Easter egg frame visible
- `inputValue: string` - Controlled TextInput value
- `isComplete: boolean` - Room solved

**Effect Dependencies:**
1. Typewriter interval: `[text]`
2. Ambient audio: `[]` (mount only)
3. Flicker trigger: `[isFlickering]`

**Critical Timing:**
- Typewriter: ~50-80ms per character (SPEC says "letter by letter")
- Flicker: Random 3-8s intervals with 100-300ms flash
- Biggie frame: Single frame during one flicker (16ms at 60fps)

### Room1Market Component Design

**State Requirements:**
- `inputValue: string` - Controlled TextInput value
- `isComplete: boolean` - Room solved

**Visual Structure:**
```
.market-scene
  .stalls-container
    .stall.stall-1 (visible)
    .stall.stall-2 (visible)
    ...
    .stall.stall-6 (visible)
    .stall.stall-7.hidden (partially visible)
  .input-area
    TextInput
    HintButton
```

**Oversaturated Effect:**
```css
.market-scene {
  filter: saturate(1.3) brightness(1.1);
  background: linear-gradient(180deg, #fff8e7 0%, #ffe4b5 100%);
}
```

---

## Handoff to Plan

### Key Constraints for Implementation

1. **MUST fix H-01**: Add hintsUsed to Room 0 initial state
2. **MUST address H-02**: Create audio file placeholders or provide fallback
3. **MUST verify H-03**: Test all date formats normalize correctly
4. **MUST wire H-04**: TextInput success -> useRoom.completeRoom -> nextRoom
5. **MUST wire H-05**: HintButton -> useRoom.useHint
6. **MUST implement C-03/C-04**: Typewriter + flicker effects
7. **MUST implement H-07**: prefers-reduced-motion media query
8. **MUST implement H-11**: Room routing in App.jsx

### Test Strategy Outline

| Hazard | Test Type | Assertion |
|--------|-----------|-----------|
| H-01 | Unit | Room 0 state includes hintsUsed |
| H-03 | Unit | validate(0, "10/05/2024") === true |
| H-04 | Integration | TextInput Enter -> room completes |
| H-05 | Integration | HintButton click -> totalHintsUsed++ |
| H-07 | Manual | Verify flicker respects prefers-reduced-motion |
| H-11 | E2E | currentRoom 0 renders Room0Entry |

### Implementation Order

1. Fix state structure (H-01)
2. Create Room0Entry.jsx + Room0.module.css
3. Implement typewriter hook
4. Add CSS flicker animation
5. Wire validation flow (H-04)
6. Wire hint tracking (H-05)
7. Create Room1Market.jsx + Room1.module.css
8. Implement market stall layout
9. Add App.jsx routing (H-11)
10. Add audio (H-02) when assets available
