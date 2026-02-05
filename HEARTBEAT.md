# HEARTBEAT.md

## 🎯 NORTH STAR: Valentine Escape Room (Night Shift)

**Status:** ACTIVE
**Goal:** Complete Rooms 3, 4, 5, 6 per SPEC-v2.md
**Current Phase:** Phase 4 (Room 3 - Restaurant)

---

## Night Shift Protocol (MANDATORY ON HEARTBEAT)

**1. Check Claude Code Session**
   - Socket: `/var/folders/p6/y2d9vmb10_31vtkxvdbkw6_r0000gn/T/openclaw-tmux-sockets/valentine.sock`
   - Session: `valentine`
   - Action: `tmux capture-pane` to see status.

**2. Drive the Workflow**
   - If idle/waiting: Issue next `/darwin` or code instruction.
   - If prompting for approval: Auto-approve (Send "2" + Enter + Enter).
   - If stuck: Retry/Debug.

**3. Update State**
   - Track progress in `scratchpad/valentine-state.json`.

---

## Phase Checklist

| Phase | Description | Status |
|-------|-------------|--------|
| 3 | Room 2 (Nash Hunt) | ✅ DONE (Visuals fixed, Reset added) |
| 4 | Room 3 (Restaurant) | 🔄 IN PROGRESS |
| 5 | Room 4 (Music) | ⏳ PENDING |
| 6 | Room 5 (Biggie) | ⏳ PENDING |
| 7 | Room 6 (Finale) | ⏳ PENDING |

---

## Room 3 Spec (from SPEC-v2)
- **Background:** `illando-bg.png`
- **Vibe:** Candlelit Italian restaurant.
- **Puzzle:** Scrabble tiles on table spelling "OCTOBER FIFTH".
- **Interaction:** Unscramble tiles (drag/drop or click-to-swap?).
- **Solution:** "OCTOBER FIFTH"
- **Misdirections:** Menu prices, wine bottle year.

## Room 4 Spec
- **Background:** `Music Bar.png`
- **Puzzle:** Jukebox with 5 songs. Select "I Love You, I'm Sorry".
- **Interaction:** Clickable records/list.

---

**CRITICAL:**
- **Always** use Claude Code for edits.
- **Send Enter twice** when commanding tmux.
- **Monitor** regularly via heartbeat.
