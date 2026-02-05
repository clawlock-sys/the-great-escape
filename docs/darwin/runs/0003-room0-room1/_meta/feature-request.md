---
spec_version: "1.0"
run_id: "0003-room0-room1"
feature: "Room 0 (Entry) and Room 1 (Market)"
created_at: "2026-02-04"
status: "APPROVED"
blocked_by: []

constraint_count: 18
contradiction_count: 0
ambiguity_count: 0
assumption_count: 3

boundaries:
  always:
    - Use existing shared components (TextInput, HintButton, Transition)
    - Use existing hooks (useRoom, useAudio)
    - Use CSS variables from variables.css
    - Use validate() from solutions.js
  ask_first:
    - Adding new npm dependencies
    - Modifying existing shared components
  never:
    - Breaking existing game state structure
    - Hardcoding solutions in component code
---

# Feature Specification: Room 0 (Entry) and Room 1 (Market)

## 1. Intent & Vision

### 1.1 Problem Statement
> The Valentine's escape room needs the first two playable rooms. Room 0 is the entry gate (date puzzle) and Room 1 is the farmer's market (vendor name cipher). These rooms establish the creepy tone and introduce the puzzle mechanics.

### 1.2 Target Users
| User Type | Description | Primary Need |
|-----------|-------------|--------------|
| Player (Riya) | Valentine's recipient | Engaging puzzle experience |
| Developer | Building subsequent rooms | Consistent room patterns |

### 1.3 Success Criteria
| Criterion | Measurement | Target |
|-----------|-------------|--------|
| SC-01 | Room 0 accepts 10052024 | Advances to Room 1 |
| SC-02 | Room 0 accepts 10/05/2024 | Same as above |
| SC-03 | Room 1 accepts RISTORA | Advances to Room 2 |
| SC-04 | Wrong answers show feedback | Visual flicker/shake |
| SC-05 | Hints reveal progressively | 3 levels per room |
| SC-06 | No console errors | 0 errors during play |

---

## 2. Scope & Boundaries

### 2.1 In Scope (WILL DO)
- [x] Room0.jsx - Entry room with typewriter effect
- [x] Room1.jsx - Market room with 7 stalls
- [x] MarketStall.jsx - Reusable stall component
- [x] TypewriterText.jsx - Letter-by-letter text animation
- [x] rooms.module.css - Room-specific styles
- [x] Integration with App.jsx for room routing

### 2.2 Out of Scope (WON'T DO)
- Rooms 2-6 (future features)
- Audio integration (handled separately)
- Nash easter egg in Room 1 background (optional future)
- Biggie click interaction in Room 0 (just visual)

### 2.3 Boundary Definitions

#### Always Do (Safe Actions)
- Create new .jsx files in src/components/rooms/
- Use existing CSS variables
- Call useRoom hooks for state management

#### Ask First (High-Impact)
- Adding npm dependencies
- Modifying existing shared components

#### Never Do (Hard Stops)
- Breaking useRoom hook structure
- Hardcoding solution strings (use validate())
- Modifying SPEC-v2.md or TECH-SPEC.md

---

## 3. Constraints & Requirements

### 3.1 Functional Requirements - Room 0

| C-ID | Type | Constraint | Priority | Verification |
|------|------|------------|----------|--------------|
| C-01 | REQUIREMENT | Black screen with typewriter text effect | MUST | Visual test |
| C-02 | REQUIREMENT | Accept date formats: 10052024, 10/05/2024, 10.05.2024 | MUST | Input validation |
| C-03 | REQUIREMENT | Screen flicker effect on wrong answer | MUST | Visual test |
| C-04 | REQUIREMENT | 3 progressive hints via HintButton | MUST | Click through hints |
| C-05 | REQUIREMENT | Biggie silhouette in flicker (single frame) | SHOULD | Easter egg visible |
| C-06 | REQUIREMENT | Use creepy CSS theme (--creepy-* variables) | MUST | CSS inspection |

### 3.2 Functional Requirements - Room 1

| C-ID | Type | Constraint | Priority | Verification |
|------|------|------------|----------|--------------|
| C-07 | REQUIREMENT | Display 7 market stalls | MUST | Visual count |
| C-08 | REQUIREMENT | Vendor names: Rosie's Roots, Ivy's Organics, Sunrise Blooms, Terra Fruits, Oak Barrel Honey, Red Barn Eggs, Abandoned | MUST | Text check |
| C-09 | REQUIREMENT | Stall #7 partially hidden/collapsed | MUST | Visual test |
| C-10 | REQUIREMENT | Misdirection: item first letters visible | SHOULD | Visual presence |
| C-11 | REQUIREMENT | Text input accepting RISTORA | MUST | Input validation |
| C-12 | REQUIREMENT | 3 progressive hints via HintButton | MUST | Click through hints |
| C-13 | REQUIREMENT | Oversaturated morning light theme | MUST | CSS inspection |

### 3.3 Integration Requirements

| C-ID | Type | Constraint | Priority | Verification |
|------|------|------------|----------|--------------|
| C-14 | REQUIREMENT | Use TextInput component for answers | MUST | Import check |
| C-15 | REQUIREMENT | Use HintButton component | MUST | Import check |
| C-16 | REQUIREMENT | Use Transition for room entry | MUST | Animation visible |
| C-17 | REQUIREMENT | Use useRoom for state management | MUST | Hook usage |
| C-18 | REQUIREMENT | Use validate() for answer checking | MUST | Function call |

### 3.4 Invariants (Must Always Be True)

| C-ID | Invariant | Rationale | Guard |
|------|-----------|-----------|-------|
| INV-01 | Room completion persists across refresh | User shouldn't lose progress | usePersistedState |
| INV-02 | Hints used count tracks correctly | Stat tracking for finale | useHint() callback |

---

## 4. Specification Analysis

### 4.1 Impossibility Check

Patterns evaluated against `reference/impossibility-patterns.md`:

| Pattern | Matched? | Evidence |
|---------|----------|----------|
| PHYS-001 (Persistence vs Volatility) | NO | usePersistedState provides persistence |
| CS-001 (CAP Violation) | NO | Single-user browser app |
| SEM-001 (Stateless Memory) | NO | State in localStorage via hook |
| RES-003 (Browser vs Server) | NO | Browser-only is satisfied |

### 4.2 Contradictions Detected

None. All constraints are compatible.

### 4.3 Ambiguities Detected

| Issue ID | Statement | Problem | Resolution |
|----------|-----------|---------|------------|
| AMB-01 | "Typewriter sound" | Audio not in scope | USER RESOLVED: Audio handled separately |

---

## 5. Assumptions & Decisions

### 5.1 Explicit Assumptions

| A-ID | Assumption | Basis | Risk if Wrong | Classification |
|------|------------|-------|---------------|----------------|
| A-01 | Rooms will be in src/components/rooms/ directory | Logical organization | Minor restructure | DESIGN DECISION |
| A-02 | Typewriter effect is CSS animation only (no sound yet) | Audio scope separate | Need audio integration | VERIFIED |
| A-03 | Biggie silhouette is static image overlay during flicker | Simplest implementation | May need animation | IMPLICIT |

### 5.2 Decisions Required

None - all decisions made in SPEC-v2.md.

---

## 6. Technical Context

### 6.1 Technology Stack
| Component | Technology | Version | Notes |
|-----------|------------|---------|-------|
| Framework | React | 19.2.4 | Hooks-based components |
| Styling | CSS Modules | N/A | Scoped styles |
| Build | Vite | 7.3.1 | Fast HMR |

### 6.2 Integration Points
| System | Interface | Direction | Data |
|--------|-----------|-----------|------|
| useRoom hook | nextRoom(), completeRoom() | OUT | Room transitions |
| validate() | validate(room, answer) | IN | Answer checking |
| HintButton | hints[], onHintUsed | OUT | Hint tracking |
| TextInput | value, onChange, onValidate | BOTH | User input |

### 6.3 Existing Patterns to Follow
| Pattern | Location | Relevance |
|---------|----------|-----------|
| Shared components | src/components/*.jsx | Component structure |
| CSS Module styles | src/styles/components.module.css | Styling pattern |
| CSS variables | src/styles/variables.css | Theme colors |
| Game state | src/hooks/useRoom.js | State management |

---

## 7. Handoff Summary

### Status
| Metric | Value |
|--------|-------|
| Constraints | 18 (REQUIREMENT: 16, INVARIANT: 2) |
| Contradictions | 0 |
| Ambiguities | 0 (1 resolved) |
| Assumptions | 3 (all acceptable) |
| Decisions Required | 0 |

### Readiness
- [x] All contradictions resolved
- [x] All ambiguities clarified
- [x] All MUST decisions made
- [x] Success criteria defined
- [x] Boundaries established

**Status**: READY_FOR_DEP
