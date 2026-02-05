# 🔐 Riya's Valentine Escape Room — SPEC v2

**Codename:** Project Pretty Girl  
**Total Playtime:** ~30 minutes  
**Difficulty:** Hard (she's a puzzle lover)  
**Vibe:** Creepy opening → playful middle → eerie Biggie lair → warm payoff  

---

## 📖 NARRATIVE FRAME

**Setup:** Riya clicks the link. Screen flickers. A message appears:

> *"You've been pulled into the spaces between moments. Trapped in memories that aren't quite yours... or are they?"*
>
> *"Someone is watching. Something red. Something soft. Something that knows your name."*
>
> *"Find your way out. Remember what matters. Escape."*

**The Twist:** Throughout the experience, there are hints of a mysterious presence — glimpses of red, cryptic messages, watching eyes. In Room 5, it's revealed: **Biggie the Jellycat** has been the mastermind all along. He's the guardian of the final door.

**Tone Progression:**
- Room 0-1: Creepy, unsettling
- Room 2-3: Playful but challenging
- Room 4: Emotional/moody
- Room 5: Eerie, Biggie reveal
- Room 6: Warm, celebratory

---

## ⏱️ TIME BUDGET

| Room | Target | Cumulative |
|------|--------|------------|
| 0. Entry | 2 min | 2 min |
| 1. Market | 5 min | 7 min |
| 2. Apartment | 7 min | 14 min |
| 3. Restaurant | 8 min | 22 min |
| 4. Music | 4 min | 26 min |
| 5. Biggie's Lair | 3 min | 29 min |
| 6. Finale | 1 min | 30 min |

---

## 🚪 ROOM 0: THE ENTRY

**Atmosphere:** Black screen. Text appears letter by letter with typewriter sound. Occasional screen flicker. Low ambient drone.

**Narrative Text:**
> *"The door will only open for the one who remembers."*
> *"When did it begin? The first moment. The first day."*
> *"Enter the date. MM.DD.YYYY"*

**Puzzle:** Enter the first date  
**Solution:** `10.05.2024` or `10052024` (accept both formats)  

**Wrong Answer Behavior:**  
- Screen flickers red
- Text: *"That's not when it started. Try again."*
- No lockout (it's the entry gate)

**Hints:**
1. *"A market. A Saturday. Fall had just arrived."*
2. *"The tenth month. The fifth day."*
3. *"October 2024."*

**Easter Egg:** In the flickering, for a single frame, a red shape appears (Biggie silhouette foreshadowing)

---

## 🥕 ROOM 1: THE FARMER'S MARKET

**Atmosphere:** Morning light, but something's *off*. Colors slightly oversaturated. Market stalls, but no people. Ambient sound: distant crowd murmur that occasionally cuts to silence.

**Visual:** Illustrated/stylized market scene with 6 vendor stalls visible.

**The Puzzle: Stall Cipher**

Each stall has a sign with the vendor name and items. Hidden in the scene:

| Stall | Vendor Name | Items Listed |
|-------|-------------|--------------|
| 1 | **R**osie's Roots | Radishes, Carrots |
| 2 | **I**vy's Organics | Kale, Spinach |
| 3 | **S**unrise Blooms | Lilies, Roses |
| 4 | **T**erra Fruits | Apples, Pears |
| 5 | **O**ak Barrel Honey | Wildflower, Clover |
| 6 | **R**ed Barn Eggs | Free Range, Organic |

**First letters spell:** R-I-S-T-O-R (first 6 letters of "RISTORANTE")

**But wait** — there's a 7th stall, partially hidden/collapsed in the corner:
| 7 | **A**bandoned | ??? |

**Full answer:** RISTORA

**Input:** Text field asking *"What word do the stalls whisper?"*

**Solution:** `RISTORA` (partial word, ominous)

**Misdirections:**
- Item first letters spell gibberish (R-K-L-A-W-F)
- Prices on stalls form a number that looks like a code but isn't
- One stall has a "SOLD OUT" sign — clicking it does nothing

**Hidden Nash #1:** He's a shopper in the background, partially obscured by a stall. Subtle. (This is just an easter egg, not required)

**Hints:**
1. *"The vendors have names. Look closer at who's selling."*
2. *"First impressions matter. First letters too."*
3. *"Six stalls in light. One in shadow. Seven letters."*

**Transition:** Screen glitches. Text appears: *"Ristora... the place. But first, somewhere closer to home."*

---

## 🏠 ROOM 2: THE APARTMENT (Nash Hunt)

**Atmosphere:** Illustrated apartment interior. Cozy but slightly uncanny — furniture is normal, but proportions are subtly wrong. Warm lighting. Jazzy lo-fi ambient.

**Visual:** Isometric or flat view of apartment with clickable zones:
- Living room (couch, TV, bookshelf, plant)
- Kitchen (fridge, counter, cabinets, table)
- Bedroom (bed, nightstand, closet, mirror)
- Bathroom (optional: mirror cabinet, shower curtain)

**The Puzzle: Find the Hidden Nashes**

**8 Nash photos** hidden throughout. Each Nash photo has a **single letter** written on it (like a label/caption).

| Location | Difficulty | Letter |
|----------|------------|--------|
| Behind couch cushion | Easy | I |
| Inside fridge | Easy | L |
| Reflected in TV (when clicked) | Medium | A |
| Inside a book on shelf | Medium | N |
| Taped under table | Medium | D |
| In closet, behind clothes | Hard | O |
| Behind shower curtain | Hard | (Red herring - no letter, just Nash) |
| In mirror reflection (only visible when standing in certain spot) | Hard | Requires solving below |

**Wait — that's only 6 letters: I-L-A-N-D-O**

**The Twist:** The shower curtain Nash is a **decoy** (no letter). The REAL 7th Nash is in the mirror, but only appears after finding the other 6. When she clicks the mirror last, Nash appears holding a sign: **"?"**

**Assembled letters:** I-L-A-N-D-O + ? = ILANDO?

**Input prompt:** *"The faces show letters. What do they spell?"*

**Solution:** `ILANDO` (the restaurant name without "Ristorante")

**Combined with Room 1:** RISTORA + ILANDO = RISTORANTE ILANDO (the full reveal happens in her mind)

**Misdirections:**
- 3 fake Nashes (similar looking dudes, slightly off) — clicking them shows *"That's not him..."*
- A cat that looks like it might be hiding something (it's not)
- A suspicious locked drawer (contains nothing relevant)
- Numbers on a calendar that seem meaningful (they're not)

**Hints:**
1. *"He's everywhere. Eight times, to be exact. But one is lying."*
2. *"Each face holds a letter. The letters hold a place."*
3. *"I-L-A-N-D-O. The place where the night was perfect."*

**Biggie Foreshadowing:** A red jellycat sits on the bed. Clicking it: *"Not yet."*

---

## 🍝 ROOM 3: RISTORANTE ILANDO

**Atmosphere:** Candlelit Italian restaurant. Empty tables. One table is set for two. San Diego evening visible through window. Ambient: soft Italian music, occasional clink of glasses from nowhere.

**Visual:** The table has:
- A menu (clickable)
- A wine bottle (clickable)
- A receipt face-down (clickable)
- A candle (clickable — does nothing, misdirection)
- A breadstick basket (misdirection)

**The Puzzle: The Bill Cipher**

Click the receipt. It flips over to reveal:

```
RISTORANTE ILANDO
-----------------
Bruschetta      $12
Risotto         $24
Tiramisu        $14

Subtotal:       $50
Tax:            $4
-----------------
TOTAL:          $54

"Thank you for a perfect night"
Table: 7
Server: Valentina
Date: ██/██/████
```

**The Cipher:**

The **item prices** are the key. Use phone keypad cipher:
- 12 = AB (1=nothing on phone, 2=ABC) → Actually let's simplify
  
**Revised approach — Word Puzzle:**

The menu has dishes with descriptions:

```
MENU

ANTIPASTI
• Bruschetta al Pomodoro - Toasted bread with "fresh" tomatoes, basil, garlic

PRIMI  
• Risotto ai Funghi - Creamy arborio with "wild" mushrooms, truffle oil

SECONDI
• Ossobuco alla Milanese - Braised veal shank, "gremolata", saffron

DOLCI
• Tiramisu Classico - Espresso-soaked ladyfingers, "mascarpone", cocoa
```

**The quoted words:** fresh, wild, gremolata, mascarpone — **red herring**

**Real puzzle:** First letter of each dish category:
- **A**NTIPASTI
- **P**RIMI  
- **S**ECONDI
- **D**OLCI

**APSD?** No, that's garbage.

**ACTUAL PUZZLE (final design):**

The wine bottle label reads:

```
CASA DEL CUORE
Reserve 2024
"Ten roses. Five lilies. Twenty-four months aged."
San Diego Valley
```

**Ten = 10, Five = 5, Twenty-four = 24**

But the input wants a word, not numbers...

**Final Design — Anagram Puzzle:**

The receipt has a handwritten note at the bottom:
> *"The perfect evening is spelled out on the table. Unscramble what matters."*

On the table, letter tiles are scattered (like Scrabble pieces):
`O - C - T - O - B - E - R - F - I - F - T - H`

**Solution:** `OCTOBER FIFTH` or `OCTOBERFIFTH`

(This is their first date written as words)

**Misdirections:**
- Menu prices that seem like codes
- Wine bottle year (2024) seems important 
- Table number "7" prominently displayed
- Server name "Valentina" (too obvious)
- Extra letter tiles mixed in: V, L, N (decoys)

**Hints:**
1. *"The tiles remember a day. Not a place."*
2. *"When did you first sit across from each other?"*
3. *"Unscramble: The month and the day you met."*

**Wrong guess behavior:** Tiles shake, resettle

---

## 🎵 ROOM 4: THE MUSIC ROOM

**Atmosphere:** Moody vinyl lounge. Purple/blue lighting. A jukebox glows in the center. Records scattered. Ambient: soft static, occasional piano note.

**Visual:** A jukebox interface with 5 song slots. Records on the wall with artist names.

**The Puzzle: The Playlist**

A note on the jukebox:
> *"Play them in order. The order of us."*
> *"First feeling. First words. First always."*

**Five records on the wall (clickable, draggable to jukebox slots):**
1. "Golden Hour" — random (misdirection)
2. "I Love You, I'm Sorry" — Gracie Abrams ← **THE SONG**
3. "First Date" — Blink-182 (misdirection)
4. "San Diego" — random (misdirection)
5. "Valentine" — random (misdirection)

**The trick:** Only ONE song matters. The puzzle isn't about order — it's about **finding the right song**.

When she clicks "I Love You, I'm Sorry" a waveform appears. She must **click/tap at the right moment** in the waveform — the moment where the song emotionally peaks (or where "I love you" is said).

**Simplified version:** Just select the correct song from 5 options and hit play.

**Input:** Select song → If correct, plays a clip and door unlocks.

**Solution:** Select "I Love You, I'm Sorry" by Gracie Abrams

**Misdirections:**
- Other songs seem thematically relevant
- "Valentine" seems too obvious (trap)
- "First Date" matches the memory but not *your* song

**Hints:**
1. *"Not just any love song. YOUR love song."*
2. *"Gracie knows."*
3. *"I Love You, I'm Sorry."*

**Transition:** The song plays softly. Screen fades. Text: *"One more door. The gatekeeper awaits."*

---

## 🔴 ROOM 5: BIGGIE'S LAIR

**Atmosphere:** EERIE. Dark room. Single spotlight on a red jellycat sitting on a pedestal. Shadows move at the edges. Low rumbling ambient. Eyes seem to follow cursor.

**Visual:** Biggie in the center, glowing slightly. Text appears as if Biggie is "speaking."

**The Reveal:**

> *"You found me."*
>
> *"I've been watching since the beginning. Every room. Every memory."*
>
> *"I am the keeper of the final door. But you cannot pass without answering."*
>
> *"WHEN DID YOU FIRST SPEAK THE TRUTH? The real truth. The three words."*

**Input:** Date field (MM-DD-YYYY)

**Solution:** `02-14-2025` (first "I love you")

**Biggie's Responses:**

Wrong answer:
> *"No. That's not when the words were real. Think. Feel. Remember."*

Right answer:
> *"Yes. February 14th, 2025. The day you said it and meant it forever."*
> *"The door is open. Go. She's waiting."*
> *"...pretty girl."*

**Hints:**
1. *"Three words. Eight letters. One day."*
2. *"It was already Valentine's Day when you said it."*
3. *"02-14-2025."*

**Easter egg:** Clicking Biggie's eyes triggers a jumpscare-lite (slight zoom, bass drop) — but friendly, not actually scary.

**Transition:** Biggie "smiles." Light floods in. Warm transition to finale.

---

## 💕 ROOM 6: THE FINALE

**Atmosphere:** Warm. Starry night / San Diego skyline. Soft glow. "I Love You, I'm Sorry" plays softly.

**Visual:** Beautiful scene. Text fades in:

> *"You escaped."*
>
> *"Through the market where we met. Through the home we've built. Through the dinner that started everything. Through our song. Past the guardian of my heart."*
>
> *"You remembered. You always do."*
>
> *"Riya..."*

**THE QUESTION:**

Large text:
# **Will you be my Valentine?**

Two buttons:
- **[YES]** — Normal button, centered
- **[no]** — Small, lowercase, off to the side

**THE NO BUTTON BEHAVIOR:**

On hover: Button slides away from cursor (random direction)
Speed: Starts slow, gets faster each attempt
After 3 attempts: Text changes to *"please?"*
After 5 attempts: *"come on..."*
After 7 attempts: *"I'll buy you Thai food"*
After 10 attempts: *"Biggie says you have to"*
After 15 attempts: Button shrinks to 1 pixel, effectively uncatchable

**NO is impossible to click.** (Unless she's insanely fast or uses keyboard — if keyboard Tab+Enter works, that's a fun easter egg: show "fine, but Biggie is disappointed" then redirect to YES path anyway)

**YES BUTTON BEHAVIOR:**

Click → Screen explodes with:
1. Confetti animation
2. "I Love You, I'm Sorry" plays full volume
3. Text: **"I knew you'd say yes. 💕"**
4. Optional: Photo of you two fades in
5. Optional: Your voice message plays
6. Final text: *"Happy Valentine's Day, pretty girl. - Your little gremlin's keeper"*

---

## 🎨 FINAL ASSET LIST

| Asset | Count | Notes |
|-------|-------|-------|
| Nash photos | 8 real + 3 decoys = 11 | Various hiding poses |
| Biggie | 3 | Cute, ominous, smiling |
| Market scene elements | 1 bg + stall details | Illustrated style |
| Apartment scene | 1 bg + clickable objects | Isometric/flat |
| Restaurant scene | 1 bg + table items | Candlelit mood |
| Music room | 1 bg + jukebox + records | Purple/moody |
| Biggie's lair | 1 dark bg | Eerie spotlight |
| Finale scene | 1 San Diego skyline | Warm/starry |
| Esqueleto poster | 1 | Hidden easter egg (maybe in apartment?) |
| Shez + Riya photo | 1 | Optional for finale |
| Audio: Ambient tracks | 6 | One per room vibe |
| Audio: Gracie Abrams clip | 1 | For rooms 4 & 6 |
| Audio: UI sounds | ~10 | Clicks, success, fail, transitions |

---

## 🔐 CODE/SOLUTION CHEAT SHEET

| Room | Solution | Type |
|------|----------|------|
| 0 | 10052024 | Date |
| 1 | RISTORA | Word (first letters) |
| 2 | ILANDO | Word (Nash letters) |
| 3 | OCTOBER FIFTH | Anagram |
| 4 | Select "I Love You, I'm Sorry" | Selection |
| 5 | 02-14-2025 | Date |
| 6 | Click YES | Button |

---

## ✅ HARDENED CHECKLIST

- [x] Concrete puzzles with exact solutions
- [x] Hint progression (3 levels each)
- [x] Misdirections per room
- [x] Narrative thread (trapped in memories, Biggie reveal)
- [x] Atmosphere notes per room
- [x] Time budget (~30 min)
- [x] Difficulty: Hard but fair
- [x] No fail state, just stuck
- [x] Asset list complete
- [x] The runaway NO button spec'd
- [x] Easter eggs (Esqueleto poster, Biggie foreshadowing)

---

## ❓ REMAINING DECISIONS

1. **Art style:** Illustrated? Photo collage? Pixel art? 3D?
2. **Your voice message at end:** Yes/no? What would you say?
3. **Photo of you two:** Include in finale?
4. **Esqueleto poster location:** Apartment? Restaurant? 
5. **Mobile fallback:** Disable or build responsive? (You said laptop, so maybe just show "open on laptop" message on mobile)

---

Ready for tech stack when you are. 🔐
