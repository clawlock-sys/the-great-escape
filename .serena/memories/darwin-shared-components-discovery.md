# Darwin Shared Components Discovery - 0002

## Session Date: 2026-02-04

## Component Architecture Patterns (VERIFIED)

### CSS Module Pattern (Vite built-in)
- Import: `import styles from './Component.module.css'`
- Usage: `className={styles.className}`
- Conditional: Template literals for multiple classes
- Location: src/styles/components.module.css (to be created)

### Reference Implementations (VERIFIED from TECH-SPEC.md)
- RunawayButton: TECH-SPEC.md:124-177
  - Internal state: attempts, position {x, y}
  - Uses useRef for DOM measurement
  - Parent must have explicit dimensions
  - TAUNTS array for progressive text
  
- ClickableArea: TECH-SPEC.md:180-212
  - Percentage-based positioning (x, y, width, height as %)
  - Parent MUST have position: relative
  - Props: id, x, y, width, height, found, onFind, isDecoy

### State Management Integration
- useRoom.useHint(roomId): src/hooks/useRoom.js:45-57
  - Increments totalHintsUsed
  - Tracks per-room hintsUsed count
  - HintButton should call onHintUsed(roomId, level)

### CSS Variables Available
From src/styles/variables.css:1-35

| Theme | Variables |
|-------|-----------|
| Creepy | --creepy-bg, --creepy-text, --creepy-glow |
| Warm | --warm-bg, --warm-text, --warm-accent |
| Moody | --moody-bg, --moody-text, --moody-accent |
| Eerie | --eerie-bg, --eerie-text, --eerie-glow |
| Finale | --finale-bg, --finale-text, --finale-accent |

| Fonts | Variable |
|-------|----------|
| Creepy | --font-creepy ('Creepster') |
| Elegant | --font-elegant ('Playfair Display') |
| Body | --font-body ('Inter') |

| Timing | Variable |
|--------|----------|
| Slow | --transition-slow (0.5s ease) |
| Fast | --transition-fast (0.2s ease) |

## Hazards Identified

| H-ID | Hazard | Mitigation |
|------|--------|------------|
| H-01 | RunawayButton parent null | Null check before getBoundingClientRect |
| H-02 | ClickableArea positioning | Parent must be position: relative |
| H-03 | HintButton state tracking | Pass roomId prop for useRoom integration |
| H-04 | TextInput validation timing | Validate on Enter key, not onChange |
| H-05 | Hardcoded colors | Always use var(--*) CSS variables |
| H-08 | Transition layout shift | Use only opacity + transform |

## Design Decisions Made

1. CSS Modules in single shared file (components.module.css) per spec
2. TextInput validates on Enter key press for better UX
3. HintButton manages internal hint level state (0-3)
4. Transition uses CSS transitions, not React 19 ViewTransition API
5. Demo page accessible via query param ?demo=components

## Files to Create

| File | Purpose |
|------|---------|
| src/styles/components.module.css | Shared component styles |
| src/components/TextInput.jsx | Text input with validation |
| src/components/HintButton.jsx | Progressive hint reveal |
| src/components/ClickableArea.jsx | Image hotspot |
| src/components/RunawayButton.jsx | Escaping button |
| src/components/Transition.jsx | Animation wrapper |
| src/components/ComponentDemo.jsx | Test page |
