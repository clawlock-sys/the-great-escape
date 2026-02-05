# 🔐 Riya's Valentine Escape Room

**Project:** Interactive web-based escape room experience  
**Hosting:** GitHub Pages (static site)  
**Deadline:** Before February 14th, 2026  
**Vibe:** Spooky-fun escape room. Challenging puzzles. Misdirections. The Valentine's ask is the *final boss*, not the theme.

---

## 🎯 Core Concept

Riya receives a mysterious link. She's drawn into a multi-room escape experience that weaves through your shared memories — but disguised as puzzles, not a sappy slideshow. Each room has a theme, a puzzle to solve, and a key/code to unlock the next.

**Tone:** Spooky ambiance, escape room tension, genuine challenge, satisfying "aha" moments. Romance is the destination, not the journey.

---

## 🏰 Room Structure (Draft)

### Room 0: The Entry
**Theme:** Mysterious invitation  
**Setup:** Dark screen, flickering text. "You've been chosen..." type energy.  
**Puzzle:** Simple entry gate — maybe a date she'd know (first date: `10052024` or `1005`)  
**Unlock:** Proves she's the right person, sets the tone.

---

### Room 1: The Farmer's Market
**Theme:** Where it all began — San Diego farmers market  
**Aesthetic:** Morning light, market stalls, produce imagery  
**Puzzle idea:** 
- Arrange items in the right order? 
- Find the hidden message in vendor signs?
- A cipher using fruits/vegetables?
**Hidden element:** First subtle Nash pic hidden somewhere (a vendor? a shopper in background?)  
**Unlock code:** Something from your first meeting/date

---

### Room 2: The Apartment (Nash Hunt)
**Theme:** Explore a stylized apartment layout  
**Mechanic:** Click around the room to explore. Hidden Nash photos EVERYWHERE — behind the couch, in the fridge, framed on walls, reflected in mirrors.  
**Puzzle:** Find X number of Nash pics to unlock the next room. Maybe one of them contains a clue/code.  
**Vibe:** Playful, a little chaotic. The "inside joke" room.  
**Misdirections:** Red herrings, clickable objects that aren't Nash

---

### Room 3: The Restaurant (Ristorante Illando)
**Theme:** Romantic Italian dinner — but make it escape room  
**Aesthetic:** Candlelit, moody, San Diego evening  
**Puzzle ideas:**
- A menu with hidden cipher
- Wine bottle labels with clues
- Arrange courses in order to reveal code
- A receipt with suspicious numbers
**Difficulty:** This should be a harder room

---

### Room 4: The Jukebox / Music Room
**Theme:** Built around "I Love You, I'm Sorry" by Gracie Abrams  
**Aesthetic:** Vinyl records, soft glow, maybe a jukebox interface  
**Puzzle idea:**
- Lyrics puzzle — fill in blanks or unscramble
- Match songs to memories?
- Play the right song on the jukebox to unlock
**Hidden element:** Maybe the song plays when solved

---

### Room 5: Biggie's Lair
**Theme:** The red jellycat guards the final door  
**Aesthetic:** Cozy but mysterious. Biggie is the gatekeeper.  
**Puzzle:** 
- Something with the date you said "I love you" (02142025)
- Or a riddle Biggie "asks"
- Could incorporate Thai food, roses, lilies somehow
**Transition:** This unlocks the finale

---

### Room 6: The Final Door
**Theme:** The Valentine ask  
**Setup:** Beautiful reveal. Not overly saccharine. Maybe a starry night / San Diego skyline.  
**The Question:** "Will you be my Valentine?"  
**Buttons:** 
- **YES** — Celebration, confetti, maybe the Gracie Abrams song plays
- **NO** — Button runs away from cursor. Impossible to click. Gets increasingly desperate ("please?" "come on..." "I'll buy you Thai food...")

---

## 🎨 Assets Needed (Stub List)

| Asset | Description | Filename stub |
|-------|-------------|---------------|
| Nash photos | Multiple funny pics to hide | `<nash-1.png>`, `<nash-2.png>`, etc. |
| Biggie | The red jellycat | `<biggie.png>` |
| You two | Optional — for finale? | `<shez-riya.png>` |
| Ristorante Illando | Reference photo? | `<illando.png>` |
| Nacho Libre sidekick | If we use it subtly | `<esqueleto.png>` |
| Farmers market | San Diego market vibes | `<farmers-market.png>` |

---

## 🔢 Key Dates/Codes to Use

| Date | Meaning | Possible code |
|------|---------|---------------|
| 10-05-2024 | First date | `1005`, `100524` |
| 02-14-2025 | First "I love you" | `0214`, `21425`, `214` |
| 1 year | Anniversary milestone | `365`, `1` |

---

## 🧩 Puzzle Principles

1. **Solvable but not obvious** — She should feel smart when she gets it
2. **Themed to the memory** — Each puzzle ties to the room's meaning
3. **Escalating difficulty** — Entry is easy, middle rooms are medium, Room 3-5 are challenging
4. **Misdirections** — Red herrings, decoys, wrong paths
5. **No external research required** — Everything she needs is in the room or in her memory of you two

---

## 🛠 Tech Stack (Proposed)

- **Framework:** Vanilla JS or lightweight (Svelte? React?) — needs to be GitHub Pages compatible
- **Styling:** CSS with animations, maybe some canvas for effects
- **State:** localStorage to save progress (so she can take breaks)
- **Audio:** Optional ambient sounds, Gracie Abrams track for finale
- **No backend** — Pure static site

---

## ❓ Open Questions for Shez

1. **Difficulty level:** How puzzle-savvy is Riya? Should she be able to solve in 20 min or 2 hours?
2. **Hints system:** Should there be a hint button? Or pure challenge?
3. **Nacho Libre usage:** Just Esqueleto easter eggs? Or a whole puzzle themed around it?
4. **Linear or branching:** Strict room order, or can she explore some rooms in any order?
5. **Spooky level:** Light creepy (old mansion vibes) or actually unsettling?
6. **Mobile support:** Will she open this on phone or computer?
7. **Any rooms you want to add/remove/change?**

---

## 📅 Timeline

| Phase | Task | Target |
|-------|------|--------|
| 1 | Finalize spec & room designs | Today |
| 2 | Build Room 0-2 (entry, market, apartment) | Feb 5-6 |
| 3 | Build Room 3-4 (restaurant, music) | Feb 7-8 |
| 4 | Build Room 5-6 (Biggie, finale) | Feb 9-10 |
| 5 | Polish, test, deploy | Feb 11-12 |
| 6 | Buffer | Feb 13 |
| 7 | **Send to Riya** | Feb 14 💕 |

---

*Let's make her work for that Valentine's. 🔐*
