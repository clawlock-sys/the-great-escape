# Valentine Escape Room — Darwin Build Phases

## Overview

This document breaks SPEC-v2.md and TECH-SPEC.md into Darwin-compatible phases.
Each phase is a complete, testable increment that can be built via `/darwin`.

**Total Phases:** 8
**Target:** All phases complete by Feb 13th

---

## Phase 0: Foundation (Serena + Scaffold)

**Goal:** Project scaffold with core infrastructure

**Darwin Request:**
```
Build foundation for React escape room game per TECH-SPEC.md:
1. Vite + React 18 scaffold (already done via npm init)
2. CSS Variables (variables.css) with all room themes
3. usePersistedState hook (localStorage persistence)
4. useAudio hook (Howler.js wrapper)
5. useRoom hook (room state management)
6. Mobile blocker component
7. Solution validator (solutions.js with hashed answers)
8. Basic App.jsx shell with room routing

Test: `npm run dev` runs, shows mobile blocker on mobile UA, blank state on desktop.
```

**Files Created:**
- src/styles/variables.css
- src/styles/global.css
- src/hooks/usePersistedState.js
- src/hooks/useAudio.js
- src/hooks/useRoom.js
- src/utils/solutions.js
- src/components/MobileBlocker.jsx
- src/App.jsx
- src/main.jsx

**Verify:** Build passes, dev server runs, localStorage persists between reloads.

---

## Phase 1: Shared Components

**Goal:** Reusable puzzle components

**Darwin Request:**
```
Build shared components for escape room per TECH-SPEC.md:
1. TextInput.jsx - styled text input with validation callback
2. HintButton.jsx - progressive hint reveal (3 levels)
3. ClickableArea.jsx - positioned hotspot for image puzzles
4. Transition.jsx - room transition animation wrapper
5. RunawayButton.jsx - the famous NO button that escapes cursor
6. components.module.css - shared component styles

Test: Storybook-like test page showing each component in isolation.
```

**Files Created:**
- src/components/TextInput.jsx
- src/components/HintButton.jsx
- src/components/ClickableArea.jsx
- src/components/Transition.jsx
- src/components/RunawayButton.jsx
- src/styles/components.module.css

**Verify:** Each component renders, RunawayButton escapes cursor, hints progress.

---

## Phase 2: Room 0 (Entry) + Room 1 (Market)

**Goal:** First two rooms - creepy atmosphere

**Darwin Request:**
```
Build Room 0 (Entry) and Room 1 (Market) per SPEC-v2.md:

ROOM 0 - Entry:
- Black screen, typewriter text effect
- Date input accepting 10052024 or 10/05/2024 formats
- Screen flicker on wrong answer
- 3 progressive hints
- Biggie silhouette easter egg in flicker
- CSS: creepy theme (--creepy-bg, --creepy-text)

ROOM 1 - Market:
- 7 market stalls with vendor names (first letters = RISTORA)
- Stall #7 partially hidden/collapsed
- Misdirections: item first letters, prices, SOLD OUT sign
- Text input for answer
- 3 progressive hints
- CSS: slightly oversaturated, unsettling morning light

Test: Can solve Room 0 with "10052024", advances to Room 1, solve with "RISTORA".
```

**Files Created:**
- src/rooms/Room0Entry.jsx
- src/rooms/Room1Market.jsx
- src/styles/Room0.module.css
- src/styles/Room1.module.css

**Verify:** Full playthrough Room 0→1, hints work, wrong answers trigger feedback.

---

## Phase 3: Room 2 (Apartment - Nash Hunt)

**Goal:** Most complex room - clickable image hunt

**Darwin Request:**
```
Build Room 2 (Apartment/Nash Hunt) per SPEC-v2.md:

- Isometric/flat apartment view with zones: living room, kitchen, bedroom, bathroom
- 8 Nash photos hidden (letters: I, L, A, N, D, O, and decoy + mirror trick)
- 3 decoy "fake Nashes" that show "That's not him..."
- Clickable Biggie on bed says "Not yet."
- Mirror Nash only appears after finding 6 others
- Letter assembly mechanic
- Misdirections: cat, locked drawer, calendar numbers
- 3 progressive hints
- CSS: warm but uncanny, slightly wrong proportions

Test: Find all 8 Nashes in correct order, letters spell ILANDO, advances to Room 3.
```

**Files Created:**
- src/rooms/Room2Apartment.jsx
- src/styles/Room2.module.css

**Verify:** All Nashes findable, decoys work, mirror trick works, Biggie easter egg.

---

## Phase 4: Room 3 (Restaurant) + Room 4 (Music)

**Goal:** Anagram puzzle + song selection

**Darwin Request:**
```
Build Room 3 (Restaurant) and Room 4 (Music) per SPEC-v2.md:

ROOM 3 - Ristorante Ilando:
- Candlelit table scene with clickable items (menu, wine, receipt, candle, bread)
- Scrabble letter tiles scattered: O-C-T-O-B-E-R-F-I-F-T-H + decoy tiles (V, L, N)
- Anagram mechanic: arrange tiles or type answer
- Accept "OCTOBER FIFTH" or "OCTOBERFIFTH"
- Wrong guess: tiles shake and resettle
- 3 progressive hints
- CSS: candlelit warm, Italian mood

ROOM 4 - Music Room:
- Jukebox with 5 record slots
- Records: Golden Hour, I Love You I'm Sorry, First Date, San Diego, Valentine
- Only "I Love You, I'm Sorry" is correct
- Play button triggers transition on correct selection
- Misdirections: other songs seem relevant
- 3 progressive hints
- CSS: purple/moody vinyl lounge

Test: Solve Room 3 with anagram, Room 4 with correct song selection.
```

**Files Created:**
- src/rooms/Room3Restaurant.jsx
- src/rooms/Room4Music.jsx
- src/styles/Room3.module.css
- src/styles/Room4.module.css

**Verify:** Anagram solvable, tile interaction works, song selection works.

---

## Phase 5: Room 5 (Biggie's Lair) + Room 6 (Finale)

**Goal:** Climax rooms - eerie reveal + celebration

**Darwin Request:**
```
Build Room 5 (Biggie's Lair) and Room 6 (Finale) per SPEC-v2.md:

ROOM 5 - Biggie's Lair:
- Dark room, spotlight on Biggie (red jellycat)
- Eyes follow cursor
- Biggie "speaks" via appearing text
- Date input for "first I love you": 02-14-2025
- Wrong: "No. That's not when the words were real..."
- Right: "Yes. February 14th, 2025..." + "...pretty girl."
- Jumpscare-lite easter egg on eye click
- 3 progressive hints
- CSS: eerie, dark, red glow

ROOM 6 - Finale:
- Warm starry San Diego skyline
- Narrative text reveal
- THE QUESTION: "Will you be my Valentine?"
- YES button (normal, centered)
- NO button (runaway behavior from Phase 1)
- NO taunts: "no" → "please?" → "come on..." → "Thai food" → "Biggie says"
- YES triggers: confetti, music, "I knew you'd say yes" message
- Optional: photo fade-in, voice message placeholder
- CSS: celebration gradient, warm

Test: Solve Room 5 with date, Room 6 YES works, NO button escapes.
```

**Files Created:**
- src/rooms/Room5Biggie.jsx
- src/rooms/Room6Finale.jsx
- src/styles/Room5.module.css
- src/styles/Room6.module.css
- src/utils/confetti.js

**Verify:** Biggie eyes track, date validates, NO escapes, YES confetti works.

---

## Phase 6: Audio Integration

**Goal:** Sound design across all rooms

**Darwin Request:**
```
Integrate audio per TECH-SPEC.md:

1. Ambient tracks per room (loop):
   - Room 0-1: ambient-drone (creepy)
   - Room 2-3: ambient-cozy (warm)
   - Room 4: ambient-moody (purple)
   - Room 5: ambient-eerie (dark rumble)
   - Room 6: gracie-abrams-clip

2. UI sounds (one-shot):
   - success-chime on room complete
   - fail-buzz on wrong answer
   - confetti-pop on YES click
   - typewriter-tick for Room 0 text

3. Audio crossfade between rooms
4. Mute button in corner
5. Placeholder audio files if real ones not available

Test: Audio plays per room, fades between, mute works.
```

**Files Created:**
- public/audio/*.mp3 (placeholders)
- src/components/MuteButton.jsx
- Updates to all room files for audio hooks

**Verify:** Audio loops, crossfades, mute persists.

---

## Phase 7: Polish + Testing

**Goal:** Final integration, edge cases, testing

**Darwin Request:**
```
Polish and test the complete escape room:

1. Full playthrough test (start to finish)
2. Edge cases:
   - Refresh mid-room (localStorage restore)
   - All hint combinations
   - Wrong answer spam
   - NO button keyboard bypass (Tab+Enter easter egg)
3. Transitions between all rooms smooth
4. Loading states where needed
5. Favicon and meta tags
6. README with setup instructions
7. Playwright tests for critical paths:
   - Room 0→6 happy path
   - Hint system
   - NO button behavior

Test: Playwright suite passes, manual playthrough smooth.
```

**Files Created:**
- tests/e2e/escape-room.spec.js
- README.md (updated)
- Various bug fixes

**Verify:** All tests pass, no console errors, smooth experience.

---

## Phase 8: Deploy

**Goal:** Live on GitHub Pages

**Darwin Request:**
```
Deploy to GitHub Pages:

1. Verify vite.config.js base path
2. npm run build (production build)
3. npm run deploy (gh-pages)
4. Verify live URL works
5. Test on fresh browser (no localStorage)
6. Share link format ready

Test: Live URL loads, playable end-to-end.
```

**Deliverable:** Live URL to share with Riya

---

## Orchestration Notes

- Each phase should be a single `/darwin` invocation
- Monitor `docs/darwin/` for artifacts
- If Darwin gets stuck, use `/darwin-skeptic` to audit
- If plan needs revision, use `/darwin-revise`
- Checkpoint after each phase before continuing

## Asset Placeholders

Until Shez provides real assets:
- Nash photos: colored rectangles with letter overlay
- Biggie: red circle with eyes
- Backgrounds: CSS gradients
- Audio: silent or royalty-free placeholders

Real assets can be swapped in without code changes.
