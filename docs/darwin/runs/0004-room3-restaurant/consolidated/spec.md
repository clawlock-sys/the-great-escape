# Room 3: Ristorante Ilando - Implementation Spec

## Overview
Candlelit Italian restaurant with an anagram puzzle. Player must unscramble Scrabble-style letter tiles to spell "OCTOBER FIFTH" (their first date written as words).

## Files to Create
1. `src/rooms/Room3Restaurant.jsx` - Main component
2. `src/styles/Room3.module.css` - Styles

## Visual Design

### Atmosphere
- Candlelit Italian restaurant
- Empty tables, one table set for two
- San Diego evening visible through window
- Warm amber/orange tones
- Soft ambient Italian music

### Background
- Use existing: `public/assets/room3/illando-bg.png`

## Puzzle Mechanics

### Letter Tiles (Scrabble-style)
- Tiles on table with letters: `O C T O B E R F I F T H`
- Plus decoy letters: `V L N` (for VALENTINE misdirection)
- Total 15 tiles scattered on table

### Tile Interaction
Option A: Click-to-select, click-again-to-place (simpler)
Option B: Drag-and-drop (more polished)

**Recommendation**: Click-to-swap for mobile compatibility
- Click tile → selected (highlighted)
- Click another tile → swap positions
- Click same tile → deselect

### Answer Slots
- 12 answer slots at bottom for "OCTOBER FIFTH" (no space required)
- Player drags/clicks tiles into slots
- Submit button to check answer

### Solution
- Correct: `OCTOBERFIFTH` or `OCTOBER FIFTH`
- Validation via existing `validate(3, answer)` function

### Wrong Answer Behavior
- Tiles shake animation
- Error message: "That's not right..."
- Tiles stay in place (don't reset - let player adjust)

## Misdirections (Clickable Hotspots)

### 1. Menu (on table)
```
MENU

ANTIPASTI
• Bruschetta al Pomodoro

PRIMI
• Risotto ai Funghi

SECONDI
• Ossobuco alla Milanese

DOLCI
• Tiramisu Classico
```
Click → Shows menu modal with close button
Red herring: First letters spell "APSD"

### 2. Wine Bottle
```
CASA DEL CUORE
Reserve 2024
San Diego Valley
```
Click → Shows label detail
Red herring: Year seems meaningful but isn't

### 3. Receipt (face-down)
```
RISTORANTE ILANDO
-----------------
Table: 7
Server: Valentina
Date: ██/██/████

"Thank you for a perfect evening"
```
Click → Flips over, shows receipt
Contains the hint: "The perfect evening is spelled out on the table"

### 4. Candle
Click → Flickers briefly
Does nothing (decorative)

### 5. Breadstick Basket
Click → "Just breadsticks. Delicious, but not helpful."

## Hints (3 levels)
1. "The tiles remember a day. Not a place."
2. "When did you first sit across from each other?"
3. "Unscramble: The month and the day you met."

## State Management

```javascript
const [selectedTile, setSelectedTile] = useState(null);
const [tilePositions, setTilePositions] = useState(shuffledInitialPositions);
const [answerSlots, setAnswerSlots] = useState(Array(12).fill(null));
const [showModal, setShowModal] = useState(null); // 'menu' | 'wine' | 'receipt'
const [showWrongAnswer, setShowWrongAnswer] = useState(false);
const [isShaking, setIsShaking] = useState(false);
```

## Component Structure

```jsx
<Room3Restaurant>
  <Transition>
    <div className={styles.room3}>
      {/* Background handled by CSS */}

      {/* Misdirection hotspots */}
      <Hotspot type="menu" />
      <Hotspot type="wine" />
      <Hotspot type="receipt" />
      <Hotspot type="candle" />
      <Hotspot type="breadsticks" />

      {/* Letter tiles on table */}
      <div className={styles.tileArea}>
        {tiles.map(tile => <Tile key={tile.id} ... />)}
      </div>

      {/* Answer slots */}
      <div className={styles.answerArea}>
        {answerSlots.map((slot, i) => <AnswerSlot key={i} ... />)}
        <button onClick={handleSubmit}>Check Answer</button>
      </div>

      {/* Bottom panel with hints */}
      <div className={styles.bottomPanel}>
        <p className={styles.prompt}>"Unscramble the tiles. Remember the day."</p>
        <HintButton hints={HINTS} ... />
        {showWrongAnswer && <p>That's not right...</p>}
      </div>

      {/* Modals for misdirections */}
      {showModal && <Modal type={showModal} onClose={...} />}
    </div>
  </Transition>
</Room3Restaurant>
```

## CSS Requirements

### Room Background
```css
.room3 {
  background: url('/assets/room3/illando-bg.png') center center no-repeat;
  background-size: cover;
}
```

### Candlelit Atmosphere
- Warm vignette overlay (amber/orange tones)
- Subtle flicker animation on edges
- Dark corners

### Tile Styling
```css
.tile {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #f5e6d3, #e8d4bc);
  border: 2px solid #8b4513;
  border-radius: 4px;
  font-family: var(--font-creepy);
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.tileSelected {
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.tileShake {
  animation: shake 0.5s ease-in-out;
}
```

### Answer Slots
```css
.answerSlot {
  width: 45px;
  height: 50px;
  border: 2px dashed rgba(255,255,255,0.3);
  border-radius: 4px;
  margin: 0 2px;
}

.answerSlotFilled {
  border-style: solid;
  border-color: #4a7c59;
}
```

## Audio
- Ambient: `/audio/ambient-restaurant.mp3` or similar soft Italian music
- Optional: tile click sound

## Integration

### App.jsx
Room 3 should already be wired up in the room sequence. Verify:
```jsx
case 3:
  return <Room3Restaurant onComplete={handleComplete} onHintUsed={handleHintUsed} />;
```

### solutions.js
Already has: `3: hash('octoberfifth')`

## Testing Checklist
- [ ] Background renders correctly
- [ ] All 15 tiles display and are clickable
- [ ] Tile selection/swap works
- [ ] Answer slots accept tiles
- [ ] Submit with correct answer calls onComplete
- [ ] Submit with wrong answer shows error + shake
- [ ] Menu modal opens/closes
- [ ] Wine bottle modal opens/closes
- [ ] Receipt modal opens/closes
- [ ] Candle flickers on click
- [ ] Breadsticks show message
- [ ] Hints work (3 levels)
- [ ] Ambient audio plays
