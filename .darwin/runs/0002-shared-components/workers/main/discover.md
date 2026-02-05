# Discover Report - Worker main
## Run: 0002-shared-components
## Keywords: TextInput, HintButton, ClickableArea, Transition, RunawayButton, component, CSS Module, validation, hint, animation
## Lens: component_architecture
## Entry Point: src/components/

---

## Phase 0: Memory-Informed Context (VERIFIED)

### Architecture Hints (VERIFIED against code)

| Claim from Memory | Verification Status | Evidence |
|-------------------|---------------------|----------|
| React 19 + Vite stack | VERIFIED | package.json:19-20 shows react ^19.2.4, vite ^7.3.1 |
| Howler.js for audio | VERIFIED | package.json:18 shows howler ^2.2.4 |
| usePersistedState hook exists | VERIFIED | src/hooks/usePersistedState.js exists |
| localStorage key pattern | VERIFIED | src/hooks/useRoom.js:21 uses 'valentine-escape-state' |
| CSS Variables theming | VERIFIED | src/styles/variables.css:1-35 defines all theme variables |
| Font variables defined | VERIFIED | variables.css:29-31 defines --font-creepy, --font-elegant, --font-body |
| Transition variables defined | VERIFIED | variables.css:33-34 defines --transition-slow, --transition-fast |

### Terminology Confirmed

| Memory Term | Code Term | Location |
|-------------|-----------|----------|
| creepy theme | --creepy-bg, --creepy-text, --creepy-glow | variables.css:4-6 |
| warm theme | --warm-bg, --warm-text, --warm-accent | variables.css:9-11 |
| moody theme | --moody-bg, --moody-text, --moody-accent | variables.css:14-16 |
| eerie theme | --eerie-bg, --eerie-text, --eerie-glow | variables.css:19-21 |
| finale theme | --finale-bg, --finale-text, --finale-accent | variables.css:24-26 |

---

## Phase 1: Keyword Generation

| Type | Keywords | Source |
|------|----------|--------|
| Literal | TextInput, HintButton, ClickableArea, Transition, RunawayButton | feature-request.md |
| Project Terms | usePersistedState, useRoom, useHint, validate | Serena memory + hooks |
| Synonyms | input, button, hotspot, animation, fade, slide | Domain |
| Anti-seeds | error, fail, invalid, disabled | Standard |
| Framework | useState, useRef, useEffect, CSS Modules, module.css | React patterns |
| Integration | gameState, hintsUsed, onFind, onCatch | useRoom.js API |

---

## Phase 2: Mandatory Anchors

### Package Manifest

| Field | Value | Location |
|-------|-------|----------|
| name | valentine-escape-room | package.json:2 |
| react | ^19.2.4 | package.json:19 |
| react-dom | ^19.2.4 | package.json:20 |
| vite | ^7.3.1 | package.json:24 |
| type | module | package.json:4 |

### Application Entry

| File | Purpose | Anchor |
|------|---------|--------|
| src/main.jsx | ReactDOM.createRoot | :7-11 |
| src/App.jsx | Main app component | :5-28 |
| src/styles/global.css | Global styles + variable import | :1-53 |

### Type Definitions

No TypeScript - project uses vanilla JavaScript with JSX.

---

## Phase 3: Surface Inventory

### High Relevance (Direct Implementation Targets)

| File | Relevance | Anchor | Notes |
|------|-----------|--------|-------|
| TECH-SPEC.md | Reference implementations | :124-177 RunawayButton, :180-212 ClickableArea | MUST follow these patterns |
| src/styles/variables.css | CSS variables | :1-35 | All theme variables defined |
| src/hooks/useRoom.js | Game state management | :20-98 | useHint at :45-57, hintsUsed tracking |
| src/hooks/usePersistedState.js | State persistence pattern | :4-19 | Pattern for stateful components |
| src/styles/global.css | Global styles | :1-53 | Base styling patterns |

### Medium Relevance (Integration Points)

| File | Relevance | Anchor | Notes |
|------|-----------|--------|-------|
| src/App.jsx | Component mounting location | :15-27 | Will host demo page |
| src/utils/solutions.js | Validation pattern | :16-21 | validate() function pattern |
| src/components/MobileBlocker.jsx | Existing component pattern | :2-10 | Simple functional component pattern |

### Low Relevance (Context Only)

| File | Relevance | Notes |
|------|-----------|-------|
| src/hooks/useAudio.js | Audio hook exists | Not needed for components |
| vite.config.js | Build config | Standard Vite setup |

### Package Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.4 | UI framework (useState, useRef, useEffect) |
| react-dom | ^19.2.4 | DOM rendering |
| howler | ^2.2.4 | Audio (not used in components) |
| vite | ^7.3.1 | Build tool, CSS Module support built-in |

---

## Phase 4: Reference Implementation Analysis

### RunawayButton (TECH-SPEC.md:124-177)

| Aspect | Value | Evidence |
|--------|-------|----------|
| State | attempts (number), position {x, y} | :140-141 |
| Ref | buttonRef for DOM measurements | :142 |
| Key behavior | onMouseEnter triggers position change | :144-158 |
| Props | onCatch (callback) | :139 |
| Styling | CSS Module import | :127 |
| Animation | inline transition style, speed decreases | :161, :170 |
| Visual effects | fontSize shrinks with attempts | :171 |
| TAUNTS array | 7 progressive messages | :129-137 |

### ClickableArea (TECH-SPEC.md:180-212)

| Aspect | Value | Evidence |
|--------|-------|----------|
| Props | id, x, y, width, height, found, onFind, isDecoy | :184-192 |
| Positioning | CSS percentage-based (left, top, width, height) | :203-206 |
| State | controlled (found prop from parent) | :194 |
| Click handler | calls onFind(id, isDecoy) | :196 |
| Styling | CSS Module with conditional found class | :201 |

---

## Phase 4.5: Framework Patterns (Context7)

### React View Transitions (React 19)

| Pattern | Source | Applicability |
|---------|--------|---------------|
| ViewTransition component | React 19 dev docs | Could use for Transition.jsx |
| enter/exit animation props | React 19 ViewTransition | Modern approach but may be overkill |
| CSS pseudo-selectors | ::view-transition-old/new | Advanced, not needed |

**Decision**: Use simpler CSS transitions with --transition-slow/fast variables for Transition.jsx. ViewTransition API is newer and adds complexity not needed for this project.

### CSS Modules (Vite)

| Pattern | Notes |
|---------|-------|
| Import syntax | `import styles from './Component.module.css'` |
| Class binding | `className={styles.className}` |
| Conditional | `className={\`${styles.base} ${condition ? styles.active : ''}\`}` |
| Vite support | Built-in, no configuration needed |

---

## Phase 5: Initial Observations

### Existing Patterns to Follow

1. **Functional components**: MobileBlocker.jsx uses simple function export pattern
2. **Named exports**: `export function ComponentName()` pattern used
3. **No CSS Modules yet**: Will be first CSS Module files created
4. **Hook patterns**: useState for state, useRef for DOM, useEffect for side effects

### Gaps Identified

1. **No components.module.css exists**: Must create
2. **No CSS Module import patterns yet**: Establishing first
3. **No animation/transition components exist**: Creating Transition.jsx from scratch
4. **Demo page does not exist**: Creating ComponentDemo.jsx from scratch

### Key Constraints

| C-ID | Constraint | Impact |
|------|------------|--------|
| C-06 | All components use CSS Modules | Must import from .module.css |
| C-10 | Must use existing CSS variable naming | Use var(--creepy-*), etc. |
| C-11 | Components stateless/controlled where possible | Props-based API |

### Design Decisions Needed

1. **HintButton progressive hints**: How to manage 3 hint levels internally vs. props
2. **TextInput validation**: Callback timing (onChange vs onBlur vs onSubmit)
3. **Transition animation style**: Fade, slide, or combination

---

## Phase 6: Handoff to Explore

### Priority Areas for Deep Exploration

1. **RunawayButton mechanics**: Trace the exact mouse-escape behavior, ensure parent boundary calculation works
2. **ClickableArea positioning**: Verify percentage-based positioning works within image containers
3. **HintButton state management**: Determine if hints are internal state or controlled via props
4. **TextInput validation integration**: How validate() from solutions.js should interact with component
5. **CSS Module organization**: Single shared file vs. per-component files

### Questions for Exploration

1. How does useRoom.useHint() coordinate with HintButton?
2. What animation timing feels right for Transition (slow: 0.5s vs fast: 0.2s)?
3. Should RunawayButton have catch detection (actually clickable) or is it purely escapist?
4. What happens to ClickableArea when found=true (visual feedback)?

---

## Configuration Systems

No configuration systems detected. Pure client-side React application with CSS-only theming via CSS variables.

---

## Surface Inventory Summary

| Category | Count | Key Items |
|----------|-------|-----------|
| High Relevance | 5 | TECH-SPEC.md, variables.css, useRoom.js, usePersistedState.js, global.css |
| Medium Relevance | 3 | App.jsx, solutions.js, MobileBlocker.jsx |
| Low Relevance | 2 | useAudio.js, vite.config.js |
| Dependencies | 4 | react, react-dom, howler, vite |

**Ready for EXPLORE phase.**
