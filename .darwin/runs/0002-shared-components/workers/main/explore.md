# Explore Report - Worker main
## Run: 0002-shared-components
## Keywords: TextInput, HintButton, ClickableArea, Transition, RunawayButton, component, CSS Module, validation, hint, animation
## Lens: component_architecture
## Entry Point: src/components/

---

## Phase 1: Dependency Tracing

### RunawayButton Dependencies (TECH-SPEC.md:124-177)

**Inbound (What will use this):**
| Consumer | Purpose | Integration Point |
|----------|---------|-------------------|
| Room0Entry.jsx | "NO" button that escapes | onCatch callback |
| Room5Biggie.jsx (potential) | Biggie-themed escape | onCatch callback |

**Outbound (What it uses):**
| Dependency | Location | Purpose |
|------------|----------|---------|
| React.useState | :126 | attempts, position state |
| React.useRef | :126 | buttonRef for DOM measurement |
| CSS Module | :127 | styles.runaway |
| Parent DOM | :146-147 | getBoundingClientRect for bounds |

### ClickableArea Dependencies (TECH-SPEC.md:180-212)

**Inbound:**
| Consumer | Purpose | Integration Point |
|----------|---------|-------------------|
| Room2Apartment.jsx | Nash hunt hotspots | onFind(id, isDecoy) |

**Outbound:**
| Dependency | Location | Purpose |
|------------|----------|---------|
| CSS Module | :182 | styles.area, styles.found |
| Props (controlled) | :184-192 | id, x, y, width, height, found, onFind, isDecoy |

### HintButton Dependencies (to be designed)

**Inbound:**
| Consumer | Purpose | Integration Point |
|----------|---------|-------------------|
| All Room components | Progressive hints | onClick, onHintUsed callback |

**Outbound:**
| Dependency | Purpose |
|------------|---------|
| React.useState | Internal hint level (0-3) |
| useRoom.useHint | Integration point at src/hooks/useRoom.js:45-57 |
| CSS Module | styles.hintButton |

### TextInput Dependencies (to be designed)

**Inbound:**
| Consumer | Purpose | Integration Point |
|----------|---------|-------------------|
| Room1Market, Room3Restaurant, etc. | Text answer input | onValidate callback |

**Outbound:**
| Dependency | Purpose |
|------------|---------|
| React.useState | Controlled input value |
| validate() from solutions.js | Integration at src/utils/solutions.js:16-21 |
| CSS Module | styles.textInput |

### Transition Dependencies (to be designed)

**Inbound:**
| Consumer | Purpose | Integration Point |
|----------|---------|-------------------|
| App.jsx or Room wrapper | Room transition animations | children prop |

**Outbound:**
| Dependency | Purpose |
|------------|---------|
| CSS transitions | --transition-slow (0.5s) from variables.css:33 |
| CSS Module | styles.transition |

---

## Phase 2: Coupling Analysis

### Coupled Components (A -> B)

| From | To | Type | Evidence | Risk |
|------|-----|------|----------|------|
| RunawayButton | Parent container | DOM | TECH-SPEC.md:146-147 getBoundingClientRect | H-01 |
| ClickableArea | Parent image container | CSS | percentage positioning | H-02 |
| HintButton | useRoom.useHint | Callback | src/hooks/useRoom.js:45-57 | H-03 |
| TextInput | validate() | Logic | src/utils/solutions.js:16-21 | H-04 |
| All components | CSS variables | Style | variables.css | H-05 |
| All components | CSS Modules | Style | Vite build | None |

### Decoupled Components (Safe to modify independently)

| Component A | Component B | Evidence | Implication |
|-------------|-------------|----------|-------------|
| RunawayButton | useRoom | No state coupling | Can test in isolation |
| ClickableArea | useRoom | Props-based only | Can test in isolation |
| TextInput | HintButton | No shared state | Independent components |
| Transition | All others | Wrapper only | Pure presentational |

---

## Phase 3: Hazard Registry

| H-ID | Category | Hazard | Evidence | Failure Mode | Severity |
|------|----------|--------|----------|--------------|----------|
| H-01 | DOM | RunawayButton parent may not have explicit dimensions | TECH-SPEC.md:146 relies on parentRect | Button escapes off-screen or doesn't escape | Medium |
| H-02 | CSS | ClickableArea percentage positioning requires positioned parent | TECH-SPEC.md:203 uses `left: ${x}%` | Hotspots positioned relative to wrong ancestor | High |
| H-03 | Integration | HintButton must coordinate with useRoom.useHint for persistence | useRoom.js:45-57 expects roomId | Hints not tracked in game state | Medium |
| H-04 | UX | TextInput validation timing unclear (onChange vs onSubmit) | No reference implementation | Validation fires too early/late | Low |
| H-05 | Theme | Components hardcoding colors instead of CSS variables | variables.css exists with theme vars | Components don't match room themes | Medium |
| H-06 | Accessibility | No keyboard handling in interactive components | No onKeyDown found in codebase | Keyboard users cannot interact | Low |
| H-07 | State | RunawayButton attempts counter resets on re-render | TECH-SPEC.md:140 useState | Loss of attempts count if parent re-renders with key change | Low |
| H-08 | Animation | Transition component may cause layout shift | No reference implementation | Jarring visual during room changes | Medium |
| H-09 | Props | HintButton hints prop type ambiguous (array vs object) | No reference implementation | Runtime errors if wrong type | Medium |
| H-10 | Edge | RunawayButton could escape faster than user can track | TECH-SPEC.md:161 speed formula | Impossible to catch, frustrating UX | Low |

---

## Phase 3.5: Constraint Registry

| C-ID | Type | Constraint | Source | Verified | Evidence |
|------|------|------------|--------|----------|----------|
| C-01 | REQUIREMENT | TextInput must accept validation callback | feature-request.md | INHERITED | Spec requirement |
| C-02 | REQUIREMENT | HintButton must support 3 progressive hints | feature-request.md | INHERITED | Spec requirement |
| C-03 | REQUIREMENT | ClickableArea position props as percentages | feature-request.md | INHERITED | Spec requirement |
| C-04 | REQUIREMENT | RunawayButton escapes cursor on hover | feature-request.md | VERIFIED | TECH-SPEC.md:144 onMouseEnter |
| C-05 | REQUIREMENT | All components use CSS Modules | feature-request.md | INHERITED | Spec requirement |
| C-06 | LIMITATION | No TypeScript | package.json | YES | No typescript dependency |
| C-07 | LIMITATION | React 19.2.4 functional components only | package.json:19 | YES | Class components deprecated pattern |
| C-08 | INVARIANT | CSS variables must be used for theming | variables.css | YES | Defined at :1-35 |
| C-09 | INVARIANT | Stateless/controlled where possible | feature-request.md:C-11 | INHERITED | Reusability requirement |
| C-10 | PREFERENCE | Use --transition-slow/fast for animations | variables.css:33-34 | YES | Defined timing variables |

### Constraint Conflicts

None detected. All requirements are compatible with limitations.

---

## Phase 4: Lens-Specific Analysis (component_architecture)

### Component Design Patterns

#### Pattern 1: Controlled Components
- **TextInput**: Fully controlled via value prop, onChange calls parent
- **ClickableArea**: Fully controlled via found prop
- **Transition**: Controlled via isVisible or similar prop

#### Pattern 2: Internally Stateful Components
- **RunawayButton**: Internal attempts, position state (per TECH-SPEC.md)
- **HintButton**: Internal hint level state, but calls out to useHint

#### Pattern 3: Props Interface Consistency

| Component | Required Props | Optional Props |
|-----------|---------------|----------------|
| TextInput | onValidate | value, placeholder, className |
| HintButton | hints[], onHintUsed | className, disabled |
| ClickableArea | id, x, y, width, height, onFind | found, isDecoy |
| RunawayButton | onCatch | className |
| Transition | children | isVisible, className |

### CSS Module Architecture

**Single shared file approach** (`components.module.css`):

| Pros | Cons |
|------|------|
| Single import for all | Larger file |
| Shared utility classes | No per-component treeshaking |
| Easier to maintain consistency | Name collision risk |

**Decision**: Use single `components.module.css` per feature-request.md requirement.

### State Flow Analysis

```
HintButton Internal State Flow:
[clicks: 0] -> click -> [clicks: 1] -> show hint 1
            -> click -> [clicks: 2] -> show hint 2
            -> click -> [clicks: 3] -> show hint 3 (final)

Each click: call onHintUsed(roomId) to parent -> useRoom.useHint(roomId)
```

```
RunawayButton State Flow:
[attempts: 0, position: {0,0}] -> mouseEnter -> [attempts: 1, position: random]
                               -> mouseEnter -> [attempts: 2, position: random]
                               ... (speed decreases, size shrinks)
                               -> click -> onCatch() (optional)
```

### Error Boundary Considerations

| Component | Error Risk | Mitigation |
|-----------|-----------|------------|
| RunawayButton | parentElement null | Null check before getBoundingClientRect |
| ClickableArea | None (pure props) | N/A |
| HintButton | hints array empty | Default to empty array, guard render |
| TextInput | None (controlled) | N/A |
| Transition | Children null | Render null if no children |

---

## Phase 5: Handoff to Plan

### Key Constraints for Implementation

1. **MUST** create `components.module.css` with all component styles
2. **MUST** use CSS variables (--creepy-*, --warm-*, etc.) for theming
3. **MUST** use --transition-slow/fast for animation timing
4. **MUST** handle H-01: Add parent dimension check in RunawayButton
5. **MUST** handle H-02: Document parent must be `position: relative`
6. **MUST** handle H-03: HintButton must accept roomId prop for useHint integration
7. **SHOULD** handle H-06: Add basic keyboard support (Enter key for buttons)
8. **SHOULD** handle H-08: Use opacity/transform for Transition (not layout-affecting properties)

### Implementation Order

1. **components.module.css** - Foundation for all components
2. **TextInput.jsx** - Simplest, no complex state
3. **ClickableArea.jsx** - Direct from TECH-SPEC.md reference
4. **HintButton.jsx** - Internal state + callback
5. **RunawayButton.jsx** - Direct from TECH-SPEC.md reference
6. **Transition.jsx** - Wrapper component
7. **ComponentDemo.jsx** - Test harness for all components

### Hazard Mitigation Requirements

| H-ID | Required Mitigation |
|------|---------------------|
| H-01 | Guard against null parent, fallback to viewport bounds |
| H-02 | Document requirement + add CSS comment |
| H-03 | Add roomId prop to HintButton |
| H-04 | Use onSubmit for validation (Enter key), not onChange |
| H-05 | Audit all color/font/transition values use CSS vars |
| H-06 | Add onKeyDown for Enter key on buttons |
| H-08 | Use opacity + transform, not width/height/margin |
| H-09 | PropTypes or JSDoc for hints array structure |
| H-10 | Cap minimum speed at reasonable value |

---

## Summary

| Metric | Count |
|--------|-------|
| Hazards Identified | 10 |
| Critical Hazards | 0 |
| High Severity | 1 (H-02) |
| Medium Severity | 5 |
| Low Severity | 4 |
| Constraints | 10 |
| Constraint Conflicts | 0 |

**Ready for PLAN phase.**
