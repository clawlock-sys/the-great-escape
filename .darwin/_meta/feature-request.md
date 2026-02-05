---
spec_version: "1.0"
run_id: "phase0-foundation"
feature: "Phase 0 - Escape Room Foundation"
created_at: "2026-02-04"
status: "APPROVED"
blocked_by: []

constraint_count: 7
contradiction_count: 0
ambiguity_count: 0
assumption_count: 1

boundaries:
  always: ["Create src directory structure", "Install no new dependencies", "Follow TECH-SPEC.md patterns"]
  ask_first: []
  never: ["Modify package.json dependencies", "Add routing libraries", "Create room components (Phase 1+)"]
---

# Feature Specification: Phase 0 - Escape Room Foundation

## 1. Intent & Vision

### 1.1 Problem Statement
> Need the foundational React architecture for a multi-room Valentine's escape room game. This includes state persistence, audio management, mobile blocking, and room routing infrastructure before building individual rooms.

### 1.2 Target Users
| User Type | Description | Primary Need |
|-----------|-------------|--------------|
| Player (Riya) | Valentine's gift recipient | Seamless escape room experience on desktop |
| Developer | Future phases | Solid foundation to build rooms on |

### 1.3 Success Criteria
| Criterion | Measurement | Target |
|-----------|-------------|--------|
| SC-01 | `npm run dev` runs | No errors, page loads |
| SC-02 | Mobile UA detection | MobileBlocker shows on mobile user agents |
| SC-03 | Desktop ready state | App shell renders, room routing works |
| SC-04 | State persistence | localStorage saves/restores on refresh |

---

## 2. Scope & Boundaries

### 2.1 In Scope (WILL DO)
- [x] src/styles/variables.css - CSS custom properties for all room themes
- [x] src/styles/global.css - Base styles, font imports
- [x] src/hooks/usePersistedState.js - localStorage hook
- [x] src/hooks/useAudio.js - Howler.js wrapper hook
- [x] src/hooks/useRoom.js - Room state management hook
- [x] src/utils/solutions.js - Hashed answer validator
- [x] src/components/MobileBlocker.jsx - Mobile device blocker
- [x] src/App.jsx - Main app with room routing
- [x] src/main.jsx - Entry point

### 2.2 Out of Scope (WON'T DO)
- Individual room components (Room0-Room6) - Phase 2+
- Shared components (TextInput, HintButton, etc.) - Phase 1
- Audio files - Phase 6
- Image assets - Later phases
- Deployment configuration - Phase 8

### 2.3 Boundary Definitions

#### Always Do (Safe Actions)
- Create new files in src/styles, src/hooks, src/utils, src/components
- Follow patterns from TECH-SPEC.md exactly
- Use CSS Modules for component styles

#### Ask First (High-Impact)
- None for this phase

#### Never Do (Hard Stops)
- Add new npm dependencies (Howler.js already installed)
- Create room-specific components
- Modify vite.config.js or index.html (already correct)

---

## 3. Constraints & Requirements

### 3.1 Functional Requirements

| C-ID | Type | Constraint | Priority | Verification |
|------|------|------------|----------|--------------|
| C-001 | REQUIREMENT | Use React 18+ with Vite | MUST | `npm run dev` succeeds |
| C-002 | REQUIREMENT | CSS Modules + CSS Variables | MUST | variables.css loads, modules scope |
| C-003 | REQUIREMENT | Howler.js for audio | MUST | useAudio hook functional |
| C-004 | REQUIREMENT | Persist state to localStorage | MUST | State survives refresh |
| C-005 | REQUIREMENT | Block mobile user agents | MUST | MobileBlocker shows on mobile UA |
| C-006 | REQUIREMENT | Obfuscate solutions (base64) | MUST | Solutions not readable in source |
| C-007 | REQUIREMENT | Support 7 rooms (0-6) | MUST | Room routing in App.jsx |

### 3.2 Non-Functional Requirements

| C-ID | Category | Constraint | Target | Verification |
|------|----------|------------|--------|--------------|
| C-008 | Performance | Dev server starts | < 5s | Manual timing |
| C-009 | DX | No console errors | 0 errors | Browser console |

### 3.3 Technical Constraints (Limitations)

| C-ID | Limitation | Source | Impact |
|------|------------|--------|--------|
| C-010 | React 19 installed (not 18) | package.json | Use React 19 API (compatible) |
| C-011 | No routing library | TECH-SPEC | Conditional rendering only |

### 3.4 Invariants (Must Always Be True)

| C-ID | Invariant | Rationale | Guard |
|------|-----------|-----------|-------|
| C-012 | Mobile users cannot play | Desktop-only experience | MobileBlocker check in App.jsx |
| C-013 | Room state persists | Prevent progress loss | usePersistedState wraps all state |

---

## 4. Specification Analysis

### 4.1 Impossibility Check

Patterns evaluated against `reference/impossibility-patterns.md`:

| Pattern | Matched? | Evidence |
|---------|----------|----------|
| PHYS-001 (Persistence vs Volatility) | NO | localStorage provides persistence |
| PHYS-003 (Offline vs Real-time) | NO | No real-time sync required |
| CS-001 (CAP Violation) | NO | Single-user, client-only |
| SEM-001 (Stateless Memory) | NO | Explicitly stateful |
| RES-003 (Browser vs Server) | NO | Fully browser-only |

### 4.2 Contradictions Detected

None. All constraints are compatible.

### 4.3 Ambiguities Detected

None. TECH-SPEC.md provides exact code patterns to follow.

---

## 5. Assumptions & Decisions

### 5.1 Explicit Assumptions

| A-ID | Assumption | Basis | Risk if Wrong | Classification |
|------|------------|-------|---------------|----------------|
| A-001 | React 19 backward-compatible with 18 patterns | React release notes | Low - would need minor syntax changes | VERIFIED |

### 5.2 Decisions Required

None - TECH-SPEC.md specifies all implementation details.

---

## 6. Technical Context

### 6.1 Technology Stack
| Component | Technology | Version | Notes |
|-----------|------------|---------|-------|
| Framework | React | 19.2.4 | Backward compatible with 18 |
| Build | Vite | 7.3.1 | Fast dev server |
| Audio | Howler.js | 2.2.4 | Already installed |
| Styling | CSS Modules | - | Vite built-in |

### 6.2 Integration Points
| System | Interface | Direction | Data |
|--------|-----------|-----------|------|
| localStorage | Web API | BOTH | JSON game state |
| Howler.js | npm package | OUT | Audio playback |

### 6.3 Existing Patterns to Follow
| Pattern | Location | Relevance |
|---------|----------|-----------|
| usePersistedState | TECH-SPEC.md:82-96 | Exact implementation provided |
| useAudio | TECH-SPEC.md:99-122 | Exact implementation provided |
| CSS Variables | TECH-SPEC.md:269-304 | Exact theme values provided |
| MobileBlocker | TECH-SPEC.md:337-349 | Exact implementation provided |
| Solutions validator | TECH-SPEC.md:242-263 | Exact implementation provided |

---

## 7. Handoff Summary

### Status
| Metric | Value |
|--------|-------|
| Constraints | 13 (REQUIREMENT: 9, LIMITATION: 2, INVARIANT: 2) |
| Contradictions | 0 |
| Ambiguities | 0 |
| Assumptions | 1 (verified) |
| Decisions Required | 0 |

### Readiness
- [x] All contradictions resolved (none found)
- [x] All ambiguities clarified (none found)
- [x] All MUST decisions made
- [x] Success criteria defined
- [x] Boundaries established

**Status**: READY_FOR_SKEPTIC

---

## 8. Implementation Guidance

### File Creation Order
1. `src/styles/variables.css` - Theme variables
2. `src/styles/global.css` - Base styles
3. `src/hooks/usePersistedState.js` - State persistence
4. `src/hooks/useAudio.js` - Audio management
5. `src/hooks/useRoom.js` - Room state
6. `src/utils/solutions.js` - Answer validation
7. `src/components/MobileBlocker.jsx` - Mobile blocker
8. `src/App.jsx` - Main app shell
9. `src/main.jsx` - Entry point

### Code Sources
All implementations are provided verbatim in TECH-SPEC.md. Follow exactly.
