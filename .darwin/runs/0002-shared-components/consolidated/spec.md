# Implementation Plan - Shared Escape Room Components
## Run: 0002-shared-components
## Worker: main
## Lens: component_architecture

---

## Scope Anchor

**Goal**: Create 5 reusable React components + CSS Module + demo page for Valentine's escape room puzzles.

**Constraints**:
- MUST: Use CSS Modules for all component styling
- MUST: Use existing CSS variables from variables.css
- MUST: Follow TECH-SPEC.md patterns for RunawayButton and ClickableArea
- MUST: Make components themeable across room palettes
- MUST NOT: Add new npm dependencies
- MUST NOT: Modify existing hooks or TECH-SPEC.md

**Success Criteria**:
- [ ] SC-01: All 5 components render without errors
- [ ] SC-02: Components work with CSS variable theming (creepy, warm, moody, eerie, finale)
- [ ] SC-03: Demo page shows all components in isolation
- [ ] SC-04: No console errors in demo

---

## Evidence Summary

| Fact | Source | Anchor |
|------|--------|--------|
| RunawayButton reference implementation | TECH-SPEC.md | :124-177 |
| ClickableArea reference implementation | TECH-SPEC.md | :180-212 |
| CSS variables defined | variables.css | :1-35 |
| Transition timing variables | variables.css | :33-34 (--transition-slow: 0.5s, --transition-fast: 0.2s) |
| Font variables defined | variables.css | :29-31 |
| useRoom.useHint exists | src/hooks/useRoom.js | :45-57 |
| validate() function exists | src/utils/solutions.js | :16-21 |
| No CSS Modules exist yet | Glob search | 0 results for *.module.css |
| Single existing component | src/components/MobileBlocker.jsx | :1-10 |
| React 19.2.4 (forward-compatible with React 18 patterns) | package.json | :19 |

**Note on React Version**: Feature spec C-08 references React 18, but the actual project uses React 19.2.4 (package.json:19). React 19 is forward-compatible with React 18 component patterns. No code changes required.

---

## Implementation Ledger

### Phase A: Foundation (CSS Module)

#### Task A.1: Create components.module.css
- **Objective**: Establish shared CSS Module with all component styles
- **Files**: CREATE src/styles/components.module.css
- **Evidence**: No CSS Modules exist (Glob returned 0)
- **Definition of Done**:
  - [ ] File exists with base styles for all 5 components
  - [ ] All color values use CSS variables
  - [ ] All timing values use --transition-slow/fast
  - [ ] All fonts use --font-* variables
- **Risks**: H-05 (hardcoded colors)
- **Mitigation**: Audit every color/font value uses var()

**Detailed CSS Structure**:
```css
/* src/styles/components.module.css */

/* TextInput */
.textInput { ... }
.textInputError { ... }
.textInputSuccess { ... }

/* HintButton */
.hintButton { ... }
.hintButtonDisabled { ... }
.hintContent { ... }

/* ClickableArea */
.area { ... }
.areaFound { ... }

/* RunawayButton */
.runaway { ... }

/* Transition */
.transition { ... }
.transitionEnter { ... }
.transitionExit { ... }
```

---

### Phase B: Simple Components

#### Task B.1: Create TextInput.jsx
- **Objective**: Styled text input with validation callback
- **Files**: CREATE src/components/TextInput.jsx
- **Evidence**: C-01 requires validation callback prop
- **Definition of Done**:
  - [ ] Accepts value, onChange, onValidate, placeholder props
  - [ ] Shows error/success state via className
  - [ ] Validates on Enter key press (not onChange per H-04)
  - [ ] Uses CSS Module styles
- **Risks**: H-04 (validation timing)
- **Mitigation**: Validate on Enter key (form submit pattern)

**Props Interface**:
```javascript
/**
 * @param {Object} props
 * @param {string} props.value - Controlled input value
 * @param {function} props.onChange - Called on input change: (newValue) => void
 * @param {function} props.onValidate - Called on Enter: (value) => boolean
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.disabled] - Disable input
 */
```

#### Task B.2: Create ClickableArea.jsx
- **Objective**: Positioned hotspot for image puzzles
- **Files**: CREATE src/components/ClickableArea.jsx
- **Evidence**: TECH-SPEC.md:180-212 reference implementation
- **Definition of Done**:
  - [ ] Accepts id, x, y, width, height, found, onFind, isDecoy props
  - [ ] Uses percentage-based positioning
  - [ ] Shows found state visually
  - [ ] Implements click handler per spec
- **Risks**: H-02 (parent positioning)
- **Mitigation**: Add JSDoc requiring position:relative parent

**Implementation Notes**:
- Copy pattern from TECH-SPEC.md:180-212
- Parent container MUST have `position: relative` for percentages to work
- found state shows subtle highlight or checkmark

---

### Phase C: Stateful Components

#### Task C.1: Create HintButton.jsx
- **Objective**: Progressive hint reveal (3 levels)
- **Files**: CREATE src/components/HintButton.jsx
- **Evidence**: C-02 requires 3 progressive hints
- **Definition of Done**:
  - [ ] Accepts hints[] array prop (3 strings)
  - [ ] Accepts onHintUsed callback prop
  - [ ] Accepts roomId prop for useRoom integration (H-03)
  - [ ] Internal state tracks current hint level (0-3)
  - [ ] Click reveals next hint, calls onHintUsed
  - [ ] Button disables after all hints revealed
- **Risks**: H-03 (useRoom coordination), H-09 (hints prop type)
- **Mitigation**: Add roomId prop, document hints array structure

**Props Interface**:
```javascript
/**
 * @param {Object} props
 * @param {string[]} props.hints - Array of 3 hint strings
 * @param {function} props.onHintUsed - Called when hint revealed: (roomId, hintLevel) => void
 * @param {number} props.roomId - Room ID for game state tracking
 * @param {string} [props.className] - Additional CSS classes
 */
```

**State Machine**:
```
State: hintLevel = 0 (no hints shown)
Click -> hintLevel = 1, show hints[0], call onHintUsed(roomId, 1)
Click -> hintLevel = 2, show hints[1], call onHintUsed(roomId, 2)
Click -> hintLevel = 3, show hints[2], call onHintUsed(roomId, 3), disable button
```

#### Task C.2: Create RunawayButton.jsx
- **Objective**: Button that escapes cursor on hover
- **Files**: CREATE src/components/RunawayButton.jsx
- **Evidence**: TECH-SPEC.md:124-177 reference implementation
- **Definition of Done**:
  - [ ] Implements TAUNTS array from spec
  - [ ] Internal attempts and position state
  - [ ] Uses useRef for button measurement
  - [ ] Calculates escape position on mouseEnter
  - [ ] Speed decreases with attempts (gets harder)
  - [ ] Font shrinks with attempts
  - [ ] Accepts onCatch callback
- **Risks**: H-01 (parent dimensions), H-07 (state reset), H-10 (too fast)
- **Mitigation**: Null check parent, document parent requirements, cap minimum speed

**Implementation Notes**:
- Follow TECH-SPEC.md:124-177 exactly
- Add null check: `if (!btn || !parent) return;`
- Cap speed at 0.1s minimum per H-10
- Parent must have defined dimensions

---

### Phase D: Wrapper Component

#### Task D.1: Create Transition.jsx
- **Objective**: Room transition animation wrapper
- **Files**: CREATE src/components/Transition.jsx
- **Evidence**: C-04 requires animation wrapper
- **Definition of Done**:
  - [ ] Accepts children, isVisible props
  - [ ] Animates opacity on mount/unmount
  - [ ] Uses --transition-slow for timing
  - [ ] No layout shift (opacity + transform only per H-08)
- **Risks**: H-08 (layout shift)
- **Mitigation**: Use only opacity and transform CSS properties

**Props Interface**:
```javascript
/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to wrap
 * @param {boolean} props.isVisible - Controls visibility/animation
 * @param {string} [props.className] - Additional CSS classes
 */
```

**Animation Strategy**:
```css
.transition {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.transitionVisible {
  opacity: 1;
  transform: translateY(0);
}
```

---

### Phase E: Demo Page

#### Task E.1: Create ComponentDemo.jsx
- **Objective**: Test page showing all components
- **Files**: CREATE src/components/ComponentDemo.jsx
- **Evidence**: C-07 requires demo page
- **Definition of Done**:
  - [ ] Imports all 5 components
  - [ ] Renders each component with test props
  - [ ] Shows different states (error, success, found, etc.)
  - [ ] Demonstrates theme switching
  - [ ] No console errors
- **Risks**: None (test page only)

**Demo Structure**:
```jsx
export function ComponentDemo() {
  return (
    <div className={styles.demo}>
      <h1>Component Demo</h1>

      {/* TextInput Demo */}
      <section>
        <h2>TextInput</h2>
        <TextInput ... />
      </section>

      {/* HintButton Demo */}
      <section>
        <h2>HintButton</h2>
        <HintButton hints={["Hint 1", "Hint 2", "Hint 3"]} ... />
      </section>

      {/* ClickableArea Demo */}
      <section>
        <h2>ClickableArea</h2>
        <div style={{ position: 'relative', width: 400, height: 300 }}>
          <ClickableArea x={10} y={10} width={20} height={20} ... />
        </div>
      </section>

      {/* RunawayButton Demo */}
      <section>
        <h2>RunawayButton</h2>
        <div style={{ position: 'relative', width: 400, height: 200 }}>
          <RunawayButton onCatch={() => alert('Caught!')} />
        </div>
      </section>

      {/* Transition Demo */}
      <section>
        <h2>Transition</h2>
        <Transition isVisible={showTransition}>
          <p>Animated content</p>
        </Transition>
      </section>
    </div>
  );
}
```

#### Task E.2: Add Demo Route to App.jsx
- **Objective**: Make demo page accessible for testing
- **Files**: MODIFY src/App.jsx
- **Evidence**: Need way to view demo during development
- **Definition of Done**:
  - [ ] Demo accessible via query param `?demo=components`
  - [ ] Does not affect production flow
- **Risks**: None

---

## Blast Radius Map

### Impacted Surfaces

| Surface | Why | Risk Level |
|---------|-----|------------|
| src/components/ | Creating 6 new files | Low (new files) |
| src/styles/components.module.css | Creating new file | Low (new file) |
| src/App.jsx | Adding demo route | Low (additive) |

### Decoupled Surfaces (Safe)

| Surface | Evidence |
|---------|----------|
| src/hooks/ | No modifications needed |
| src/utils/ | No modifications needed |
| src/styles/variables.css | Read only |
| src/styles/global.css | Read only |
| TECH-SPEC.md | Never modify (constraint) |

---

## Hazards & Mitigations

| H-ID | Hazard | Mitigation | Verification |
|------|--------|------------|--------------|
| H-01 | RunawayButton parent null | Add null check: `if (!btn || !parent) return;` | Unit test with no parent |
| H-02 | ClickableArea wrong positioning | JSDoc: "Parent MUST have position: relative" | Visual test in demo |
| H-03 | HintButton not tracking game state | Add roomId prop, call onHintUsed(roomId, level) | Integration test with useRoom |
| H-04 | TextInput validation timing | Validate on Enter key only, not onChange | User test in demo |
| H-05 | Hardcoded colors | Audit: every color uses var(--*) | CSS review |
| H-06 | No keyboard support | Add onKeyDown for Enter on interactive elements | Keyboard test in demo |
| H-07 | RunawayButton state reset | Document: parent should not remount with key | Documentation |
| H-08 | Transition layout shift | Use only opacity + transform | CSS review |
| H-09 | HintButton hints type | JSDoc: hints must be string[] length 3 | Runtime guard |
| H-10 | RunawayButton too fast | Cap speed: `Math.max(0.1, 0.3 - attempts * 0.02)` | Manual test |

---

## Test & Validation Plan

### Manual Tests (Demo Page)

| Test | Component | Validates | Steps |
|------|-----------|-----------|-------|
| T-01 | TextInput | Value + Enter | Type text, press Enter, verify callback |
| T-02 | TextInput | Error state | Enter invalid value, verify red styling |
| T-03 | HintButton | Progressive | Click 3 times, verify 3 hints shown |
| T-04 | HintButton | Disabled | Click 4 times, verify button disabled |
| T-05 | ClickableArea | Click + found | Click area, verify found state |
| T-06 | ClickableArea | Decoy | Click decoy, verify isDecoy=true in callback |
| T-07 | RunawayButton | Escape | Hover, verify button moves away |
| T-08 | RunawayButton | Speed decrease | Hover 5+ times, verify faster escape |
| T-09 | RunawayButton | Catch | Actually click button, verify onCatch |
| T-10 | Transition | Fade in | Toggle visibility, verify smooth fade |

### Test <-> Hazard <-> Task Mapping

| H-ID | Test | Task |
|------|------|------|
| H-01 | T-07, T-08 | C.2 |
| H-02 | T-05 | B.2 |
| H-03 | T-03, T-04 | C.1 |
| H-04 | T-01, T-02 | B.1 |
| H-08 | T-10 | D.1 |
| H-10 | T-08 | C.2 |

### Build Verification

| Check | Command | Expected |
|-------|---------|----------|
| Build passes | `npm run build` | Exit 0, no errors |
| Dev server runs | `npm run dev` | Localhost accessible |
| No console errors | Browser devtools | 0 errors in console |

---

## Proof Obligations

| Claim | How to Verify |
|-------|---------------|
| RunawayButton follows TECH-SPEC | Compare RunawayButton.jsx lines to TECH-SPEC.md:124-177 |
| ClickableArea follows TECH-SPEC | Compare ClickableArea.jsx lines to TECH-SPEC.md:180-212 |
| All colors use CSS variables | `grep -v "var(--" components.module.css | grep -E "#[0-9a-fA-F]+"` returns 0 |
| All transitions use variables | `grep "transition" components.module.css` shows var(--transition-*) |
| Demo shows all components | Read ComponentDemo.jsx, find 5 component imports |
| H-01 mitigated | Find null check in RunawayButton.jsx handleMouseEnter |
| H-03 mitigated | Find roomId prop in HintButton.jsx |
| H-08 mitigated | Transition.jsx CSS uses only opacity/transform |

---

## Assumption Registry

| A-ID | Assumption | Classification | Evidence | Risk if Wrong |
|------|------------|----------------|----------|---------------|
| A-01 | HintButton manages internal hint level state | DESIGN DECISION | Cleaner API than controlled | Minor API change |
| A-02 | Transition uses CSS, not React 19 ViewTransition | VERIFIED | Simpler, existing var() usage | Need refactor |
| A-03 | Demo page accessible via query param not route | IMPLICIT | No router in project | Minor change if router added |
| A-04 | RunawayButton onCatch is optional | IMPLICIT | TECH-SPEC shows but may not be used | Add default no-op |
| A-05 | TextInput validates on Enter, not onChange | DESIGN DECISION | Better UX, avoid premature errors | Minor behavior change |

---

## File Creation Checklist

| File | Task | Status |
|------|------|--------|
| src/styles/components.module.css | A.1 | PENDING |
| src/components/TextInput.jsx | B.1 | PENDING |
| src/components/ClickableArea.jsx | B.2 | PENDING |
| src/components/HintButton.jsx | C.1 | PENDING |
| src/components/RunawayButton.jsx | C.2 | PENDING |
| src/components/Transition.jsx | D.1 | PENDING |
| src/components/ComponentDemo.jsx | E.1 | PENDING |
| src/App.jsx | E.2 | PENDING (MODIFY) |

---

## Hazard Coverage Check

| H-ID | In Explore? | Mitigation in Plan? | Test for Mitigation? |
|------|-------------|---------------------|----------------------|
| H-01 | Yes | Yes (Task C.2) | Yes (T-07, T-08) |
| H-02 | Yes | Yes (Task B.2 JSDoc) | Yes (T-05) |
| H-03 | Yes | Yes (Task C.1 roomId) | Yes (T-03, T-04) |
| H-04 | Yes | Yes (Task B.1 Enter key) | Yes (T-01, T-02) |
| H-05 | Yes | Yes (Task A.1 audit) | Yes (Proof Obligation) |
| H-06 | Yes | Yes (Tasks B.1, C.1) | Yes (Manual keyboard test) |
| H-07 | Yes | Yes (Documentation) | N/A (doc only) |
| H-08 | Yes | Yes (Task D.1 CSS) | Yes (T-10) |
| H-09 | Yes | Yes (Task C.1 JSDoc) | Yes (Runtime) |
| H-10 | Yes | Yes (Task C.2 cap) | Yes (T-08) |

All hazards mitigated.

---

## Handoff

Ready for Implementation.

| Metric | Value |
|--------|-------|
| Proof Obligations | 8 |
| Hazards Mitigated | 10/10 |
| Tasks Defined | 8 |
| Files to Create | 7 |
| Files to Modify | 1 |
| Assumptions | 5 (0 USER DECISION) |

---

## Appendix: CSS Variable Reference

From src/styles/variables.css:

**Theme Colors**:
- Creepy (Room 0-1): --creepy-bg, --creepy-text, --creepy-glow
- Warm (Room 2-3): --warm-bg, --warm-text, --warm-accent
- Moody (Room 4): --moody-bg, --moody-text, --moody-accent
- Eerie (Room 5): --eerie-bg, --eerie-text, --eerie-glow
- Finale (Room 6): --finale-bg, --finale-text, --finale-accent

**Fonts**:
- --font-creepy: 'Creepster', cursive
- --font-elegant: 'Playfair Display', serif
- --font-body: 'Inter', sans-serif

**Transitions**:
- --transition-slow: 0.5s ease
- --transition-fast: 0.2s ease
