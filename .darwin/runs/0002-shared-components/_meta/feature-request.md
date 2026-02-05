---
spec_version: "1.0"
run_id: "0002-shared-components"
feature: "Shared Escape Room Components"
created_at: "2026-02-04"
status: "APPROVED"
blocked_by: []

constraint_count: 11
contradiction_count: 0
ambiguity_count: 0
assumption_count: 3

boundaries:
  always:
    - Create React components with CSS Module styling
    - Use existing CSS variables from variables.css
    - Follow TECH-SPEC.md component patterns
  ask_first:
    - Adding new dependencies beyond React/Vite
    - Changing existing component implementations
  never:
    - Breaking existing hooks or utilities
    - Modifying TECH-SPEC.md specifications
---

# Feature Specification: Shared Escape Room Components

## 1. Intent & Vision

### 1.1 Problem Statement
> The Valentine's escape room needs reusable UI components for puzzle interactions across 6 rooms. Each room has different puzzles (text input, image hunting, button chasing) that share common interaction patterns.

### 1.2 Target Users
| User Type | Description | Primary Need |
|-----------|-------------|--------------|
| Player (Riya) | Valentine's recipient | Smooth puzzle interactions |
| Developer | Building the rooms | Reusable, themeable components |

### 1.3 Success Criteria
| Criterion | Measurement | Target |
|-----------|-------------|--------|
| SC-01 | All 5 components render | 100% |
| SC-02 | Components work with CSS variable theming | Per-room theming works |
| SC-03 | Demo page shows all components | All states visible |
| SC-04 | No console errors | 0 errors in demo |

---

## 2. Scope & Boundaries

### 2.1 In Scope (WILL DO)
- [x] TextInput.jsx - styled text input with validation callback
- [x] HintButton.jsx - progressive hint reveal (3 levels)
- [x] ClickableArea.jsx - positioned hotspot for image puzzles
- [x] Transition.jsx - room transition animation wrapper
- [x] RunawayButton.jsx - the famous NO button that escapes cursor
- [x] components.module.css - shared component styles
- [x] ComponentDemo.jsx - simple test page showing each component

### 2.2 Out of Scope (WON'T DO)
- Room implementations (separate feature)
- Audio integration (handled by useAudio hook)
- Game state management (handled by usePersistedState hook)
- Full Storybook setup (user confirmed simple demo page)

### 2.3 Boundary Definitions

#### Always Do (Safe Actions)
- Create new .jsx files in src/components/
- Create CSS modules in src/styles/
- Use existing CSS variables

#### Ask First (High-Impact)
- Adding npm dependencies
- Modifying existing files

#### Never Do (Hard Stops)
- Break existing hooks
- Change TECH-SPEC.md reference implementations

---

## 3. Constraints & Requirements

### 3.1 Functional Requirements

| C-ID | Type | Constraint | Priority | Verification |
|------|------|------------|----------|--------------|
| C-01 | REQUIREMENT | TextInput.jsx must accept validation callback prop | MUST | Props interface check |
| C-02 | REQUIREMENT | HintButton.jsx must support 3 progressive hint levels | MUST | Click through 3 levels |
| C-03 | REQUIREMENT | ClickableArea.jsx must accept position props (x, y, width, height as %) | MUST | Visual positioning |
| C-04 | REQUIREMENT | Transition.jsx must wrap children with animation | MUST | Visual transition |
| C-05 | REQUIREMENT | RunawayButton.jsx must move away from cursor on hover | MUST | Mouse interaction test |
| C-06 | REQUIREMENT | All components use CSS Modules | MUST | Import pattern |
| C-07 | REQUIREMENT | Demo page shows all components in isolation | MUST | Page renders |

### 3.2 Non-Functional Requirements

| C-ID | Category | Constraint | Target | Verification |
|------|----------|------------|--------|--------------|
| C-08 | Compatibility | React 18 + Vite | Stack match | package.json |
| C-09 | Styling | CSS Modules | Scoped styles | No global leaks |

### 3.3 Technical Constraints (Limitations)

| C-ID | Limitation | Source | Impact |
|------|------------|--------|--------|
| C-10 | Must use existing CSS variable naming | variables.css | Theme compatibility |

### 3.4 Invariants (Must Always Be True)

| C-ID | Invariant | Rationale | Guard |
|------|-----------|-----------|-------|
| C-11 | Components must be stateless/controlled where possible | Reusability | Props-based API |

---

## 4. Specification Analysis

### 4.1 Impossibility Check

Patterns evaluated against `reference/impossibility-patterns.md`:

| Pattern | Matched? | Evidence |
|---------|----------|----------|
| PHYS-001 (Persistence vs Volatility) | NO | All client-side React state |
| CS-001 (CAP Violation) | NO | Single-user browser app |
| SEM-001 (Stateless Memory) | NO | State in parent components |
| RES-003 (Browser vs Server) | NO | Browser-only is satisfied |

### 4.2 Contradictions Detected

None. All constraints are compatible.

### 4.3 Ambiguities Detected

| Issue ID | Statement | Problem | Resolution |
|----------|-----------|---------|------------|
| AMB-01 | "Storybook-like test page" | Full Storybook vs simple page | USER RESOLVED: Simple demo page |

---

## 5. Assumptions & Decisions

### 5.1 Explicit Assumptions

| A-ID | Assumption | Basis | Risk if Wrong | Classification |
|------|------------|-------|---------------|----------------|
| A-01 | RunawayButton implementation from TECH-SPEC.md is reference | TECH-SPEC.md | Need to redesign | VERIFIED |
| A-02 | ClickableArea implementation from TECH-SPEC.md is reference | TECH-SPEC.md | Need to redesign | VERIFIED |
| A-03 | Simple demo page not full Storybook | User confirmed | None | VERIFIED |

### 5.2 Decisions Required

None - all decisions made.

### 5.3 Design Decisions

| D-ID | Decision | User Choice | Rationale |
|------|----------|-------------|-----------|
| D-01 | Test page approach | Simple demo page | Faster, no extra deps |

---

## 6. Technical Context

### 6.1 Technology Stack
| Component | Technology | Version | Notes |
|-----------|------------|---------|-------|
| Framework | React | 18 | Vite bundler |
| Styling | CSS Modules | N/A | Scoped styles |
| Animations | CSS transitions | N/A | Framer Motion optional |

### 6.2 Integration Points
| System | Interface | Direction | Data |
|--------|-----------|-----------|------|
| Room components | Component props | IN | Callbacks, state |
| CSS Variables | :root variables | IN | Theme values |

### 6.3 Existing Patterns to Follow
| Pattern | Location | Relevance |
|---------|----------|-----------|
| RunawayButton reference | TECH-SPEC.md:124-177 | Implementation pattern |
| ClickableArea reference | TECH-SPEC.md:180-212 | Implementation pattern |
| CSS Variables | src/styles/variables.css | Theme variables |
| usePersistedState | src/hooks/usePersistedState.js | State pattern |

---

## 7. Handoff Summary

### Status
| Metric | Value |
|--------|-------|
| Constraints | 11 (REQUIREMENT: 7, LIMITATION: 1, INVARIANT: 1, PREFERENCE: 2) |
| Contradictions | 0 |
| Ambiguities | 0 (1 resolved) |
| Assumptions | 3 (all verified) |
| Decisions Required | 0 |

### Readiness
- [x] All contradictions resolved
- [x] All ambiguities clarified
- [x] All MUST decisions made
- [x] Success criteria defined
- [x] Boundaries established

**Status**: READY_FOR_DEP
