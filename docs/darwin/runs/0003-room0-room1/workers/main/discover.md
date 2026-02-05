# Discover Report - Worker main
## Run: 0003-room0-room1
## Keywords: room, entry, market, stall, typewriter, flicker, hints, creepy, oversaturated
## Lens: component_architecture
## Entry Point: src/components/

---

## Phase 0: Memory-Informed Context (VERIFIED)

### Architecture Hints (Verified)
| Claim from Memory | Verification Status | Evidence |
|-------------------|---------------------|----------|
| React 19 + Vite stack | VERIFIED | package.json:14 `"react": "^19.2.4"` |
| Howler.js for audio | VERIFIED | package.json:12 `"howler": "^2.2.4"` |
| usePersistedState for localStorage | VERIFIED | src/hooks/useRoom.js:2 imports it |
| CSS Variables for themes | VERIFIED | src/styles/variables.css:1-35 |
| Creepster font for Room 0-1 | VERIFIED | index.html:10 Google Fonts import |
| Solution obfuscation with base64 | VERIFIED | src/utils/solutions.js:2-4 `btoa()` |

### Terminology Mapping (Memory -> Code)
| Memory Term | Actual Code Term | Location |
|-------------|------------------|----------|
| "creepy theme" | --creepy-bg, --creepy-text, --creepy-glow | variables.css:3-5 |
| "hint system" | useHint(roomId) | src/hooks/useRoom.js:45-57 |
| "room state" | gameState.rooms[N] | src/hooks/useRoom.js:4-16 |
| "Transition animation" | Transition component | src/components/Transition.jsx |

### Integration Points Identified
- Room components render in App.jsx:29 (placeholder exists)
- useRoom hook provides: nextRoom, completeRoom, useHint, recordAttempt
- HintButton calls onHintUsed(roomId, level)
- TextInput validates on Enter key, returns boolean

---

## Phase 1: Search Strategy

| Type | Keywords | Source |
|------|----------|--------|
| Literal | room, entry, market, stall, typewriter, flicker | Feature request |
| Literal | hints, creepy, oversaturated | Feature request |
| Project Terms | Room0, Room1, creepy-bg, font-creepy | Memory + TECH-SPEC |
| Synonyms | text-reveal, typing-effect, glitch, animation | Domain knowledge |
| Anti-seeds | error, fail, invalid-date, wrong-answer | Error handling |
| Framework | useState, useEffect, setInterval, keyframes | React/CSS patterns |
| Integration | useRoom, useAudio, validate, SOLUTIONS | Codebase modules |

---

## Phase 2: Mandatory Anchors

### Package Manifest
| Dependency | Version | Purpose for Feature |
|------------|---------|---------------------|
| react | ^19.2.4 | UI components |
| react-dom | ^19.2.4 | DOM rendering |
| howler | ^2.2.4 | Typewriter sound, ambient audio |
| vite | ^7.3.1 | Build tool |

### Application Entry Points
| File | Line | Purpose |
|------|------|---------|
| src/main.jsx | 7 | React root render |
| src/App.jsx | 1 | App component with room routing |
| src/App.jsx | 29 | Placeholder for room components |

### Type/Pattern Definitions
| Pattern | Location | Relevance |
|---------|----------|-----------|
| Room state structure | src/hooks/useRoom.js:4-16 | Room 0/1 state tracking |
| Solution validation | src/utils/solutions.js:9-13 | Date + word validation |
| CSS theming | src/styles/variables.css:1-35 | Creepy theme vars |

---

## Phase 3: Surface Inventory

### High Relevance

| File | Anchor | Relevance |
|------|--------|-----------|
| SPEC-v2.md | Lines 55-95 | Room 0 complete specification |
| SPEC-v2.md | Lines 97-165 | Room 1 complete specification |
| src/components/TextInput.jsx | :1-53 | Reusable for date/text input |
| src/components/HintButton.jsx | :1-51 | Progressive hint reveal |
| src/components/Transition.jsx | :1-23 | Room transition animation |
| src/hooks/useRoom.js | :1-78 | Game state management |
| src/hooks/useAudio.js | :1-18 | Audio playback (typewriter, ambient) |
| src/utils/solutions.js | :1-13 | Solution 0: '10052024', Solution 1: 'ristora' |
| src/styles/variables.css | :1-35 | Creepy theme: --creepy-bg, --creepy-text |

### Medium Relevance

| File | Anchor | Relevance |
|------|--------|-----------|
| src/App.jsx | :23-36 | Room routing placeholder |
| src/styles/components.module.css | :1-125 | Component styling patterns |
| src/styles/global.css | :1-50 | Base styling, body background |
| TECH-SPEC.md | :1-230 | Implementation patterns |
| index.html | :10 | Font loading (Creepster, Inter) |

### Low Relevance

| File | Anchor | Relevance |
|------|--------|-----------|
| src/components/RunawayButton.jsx | :1-50 | Room 6 only |
| src/components/ClickableArea.jsx | :1-35 | Room 2 only |
| src/components/ComponentDemo.jsx | :1-100 | Demo page only |
| src/components/MobileBlocker.jsx | :1-20 | Mobile detection |

### Symbols Found

| Symbol | Type | Location | Purpose |
|--------|------|----------|---------|
| TextInput | Component | src/components/TextInput.jsx:12 | Date/text entry |
| HintButton | Component | src/components/HintButton.jsx:12 | Hint reveal |
| Transition | Component | src/components/Transition.jsx:14 | Animation wrapper |
| useRoom | Hook | src/hooks/useRoom.js:18 | State management |
| useAudio | Hook | src/hooks/useAudio.js:5 | Sound playback |
| validate | Function | src/utils/solutions.js:9 | Answer checking |
| SOLUTIONS | Object | src/utils/solutions.js:5 | Room solutions |

---

## Phase 4: Framework Patterns (Context7)

### React Patterns for Typewriter Effect

| Pattern | Source | Application |
|---------|--------|-------------|
| useEffect + setInterval | Context7: /websites/react_dev | Character-by-character reveal |
| Functional state updater | Context7: /websites/react_dev | `setCount(c => c + 1)` prevents stale closure |
| Cleanup on unmount | Context7: /websites/react_dev | `return () => clearInterval(id)` |

**Typewriter Implementation Pattern (from Context7):**
```javascript
useEffect(() => {
  const id = setInterval(() => {
    setCharIndex(c => c + 1); // Functional updater avoids stale closure
  }, 50); // ~50ms per character for typewriter effect
  return () => clearInterval(id);
}, []); // Empty deps = run once
```

### CSS Animation Patterns

| Pattern | Source | Application |
|---------|--------|-------------|
| @keyframes opacity | Context7: /websites/css-tricks_almanac | Screen flicker effect |
| animation-composition | Context7: /websites/css-tricks_almanac | Layer multiple animations |

**Flicker Implementation Pattern:**
```css
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes red-flash {
  0%, 100% { background-color: var(--creepy-bg); }
  50% { background-color: var(--eerie-text); }
}
```

### Howler.js Patterns

| Pattern | Source | Application |
|---------|--------|-------------|
| Howl with sprites | Context7: /goldfire/howler.js | Single file, multiple sounds |
| fade() method | Context7: /goldfire/howler.js | Ambient fade in/out |
| Sound ID control | Context7: /goldfire/howler.js | Individual sound instance control |

---

## Phase 4.5: Configuration System Intelligence

### Configuration Systems Detected

| System | Config Location | Governs |
|--------|-----------------|---------|
| Vite base path | vite.config.js | Asset URLs for GH Pages |
| CSS Variables | variables.css | Theme colors per room |
| Solution hashes | solutions.js | Answer validation |

### Handoff Flags for H-CFG Analysis
- **Vite base path**: May affect audio/image URLs in production
- **CSS Variables scoping**: Room-specific overrides needed
- **localStorage**: State persistence key = 'valentine-escape-state'

---

## Phase 5: Initial Observations

### Room 0 (Entry) Requirements Summary
From SPEC-v2.md:55-95:

| Requirement | Implementation Need |
|-------------|---------------------|
| Black screen | `background: var(--creepy-bg)` (#0a0a0f) |
| Typewriter text | Custom hook with setInterval + char reveal |
| Typewriter sound | useAudio with per-character play |
| Screen flicker | CSS @keyframes animation |
| Date input (10052024) | TextInput with validation |
| Wrong answer: red flicker | CSS animation trigger on error |
| 3 hints | HintButton with hints array |
| Biggie silhouette | Single-frame image in flicker sequence |
| Low ambient drone | useAudio with loop: true |

### Room 1 (Market) Requirements Summary
From SPEC-v2.md:97-165:

| Requirement | Implementation Need |
|-------------|---------------------|
| Oversaturated morning | Custom CSS filter or bg gradient |
| 7 market stalls | Visual layout component |
| Vendor names: RISTORA | Data structure with letters |
| Stall #7 hidden | CSS partial visibility |
| Text input: "RISTORA" | TextInput with validation |
| 3 hints | HintButton with hints array |
| Misdirections | Clickable decoy elements |
| Distant crowd murmur | useAudio ambient |

### Files to Create

| File | Purpose |
|------|---------|
| src/rooms/Room0Entry.jsx | Entry room component |
| src/rooms/Room1Market.jsx | Market room component |
| src/styles/Room0.module.css | Room 0 specific styles |
| src/styles/Room1.module.css | Room 1 specific styles |
| src/hooks/useTypewriter.js | Typewriter text effect |

### Existing Components to Reuse

| Component | Usage |
|-----------|-------|
| TextInput | Date input (Room 0), word input (Room 1) |
| HintButton | 3 hints per room |
| Transition | Room enter/exit animation |
| useRoom | State management |
| useAudio | Ambient + sound effects |
| validate | Solution checking |

---

## Phase 6: Handoff to Explore

### Priority Areas for Deep Exploration

1. **TextInput Integration** - How does it connect to useRoom.recordAttempt and validation flow?
2. **Typewriter Effect** - setInterval timing, sound synchronization, state management
3. **Screen Flicker Animation** - CSS keyframes, trigger mechanism, Biggie frame insertion
4. **Room Transition** - How to wire Transition component to room changes
5. **Audio System** - Multiple simultaneous sounds (ambient + typewriter + effects)
6. **Solution Validation** - Date format normalization, case sensitivity

### Questions for Exploration
- How to trigger CSS animation on wrong answer without re-render?
- How to insert single Biggie frame in flicker sequence?
- How to handle multiple date formats (10052024, 10/05/2024, 10.05.2024)?
- How to create "oversaturated" visual effect for Room 1?
- How to partially hide stall #7 while keeping it clickable?

---

## Phase 7: Memory Write-Back

### Verified New Learnings

These items were verified against code and Context7 documentation:

1. **Typewriter Pattern**: useEffect + setInterval with functional updater prevents stale closure issues (Context7 verified)
2. **CSS Flicker**: @keyframes with opacity changes, can layer with animation-composition
3. **Room State Structure**: gameState.rooms[N] contains completed, attempts, hintsUsed
4. **Solution Format**: validate() normalizes input by removing spaces, dashes, slashes, dots and lowercasing
5. **Transition Component**: Uses opacity + transform (no layout shift per H-08)

### Memory Update Written
No memory update needed - existing memories are accurate and comprehensive.
