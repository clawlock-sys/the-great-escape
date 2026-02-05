# Feature Request: Room 3 (Restaurant)

## Overview
Implement Room 3 (Restaurant) as per SPEC-v2.md using 'public/assets/room3/illando-bg.png'.

## Core Requirements

### Puzzle Mechanics
- Anagram puzzle on the table with draggable/clickable Scrabble-style tiles
- Tiles spell 'OCTOBER FIFTH' when correctly arranged
- Interactive tile manipulation (drag-and-drop or click-to-swap)

### Visual Design
- Candlelit mood atmosphere
- Use existing background: `public/assets/room3/illando-bg.png`
- Romantic restaurant ambiance

### Misdirections
- Receipt on table (red herring)
- Menu items (red herring)
- Other interactive decoys to add puzzle depth

### Files to Create
- `src/rooms/Room3Restaurant.jsx` - Main room component
- `src/styles/Room3.module.css` - Room-specific styles

## Technical Constraints
- Follow existing room component patterns (Room0Entry, Room1Market, Room2Apartment)
- Integrate with existing game state management (useRoom hook)
- Support hint system via HintButton component
- Include ambient audio hook
- Use CSS modules for styling
