# Valentine Escape Room - Architecture Memory

## Project Overview
- **Type**: React 19 + Vite client-side escape room game
- **Target**: Desktop-only Valentine's gift for Riya
- **Deployment**: GitHub Pages (static)

## Technology Stack (VERIFIED from package.json)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI Framework |
| ReactDOM | 19.2.4 | DOM rendering |
| Howler.js | 2.2.4 | Audio playback |
| Vite | 7.3.1 | Build tool |
| gh-pages | 6.3.0 | Deployment |

## Directory Structure (from TECH-SPEC.md)
```
src/
  hooks/         # Custom React hooks
  components/    # Shared UI components
  rooms/         # Room-specific components (Room0-Room6)
  styles/        # CSS Modules + variables
  utils/         # Helper functions (solutions, confetti)
```

## Key Patterns

### State Persistence
- Hook: usePersistedState.js
- Storage: localStorage
- Key: 'valentine-escape-state'
- Format: JSON serialized

### Audio System
- Hook: useAudio.js
- Library: Howler.js (Howl constructor)
- Pattern: useRef for sound instance, cleanup on unmount

### Room Themes (CSS Variables)
- Creepy (0-1): --creepy-bg, --creepy-text, --creepy-glow
- Warm (2-3): --warm-bg, --warm-text, --warm-accent
- Moody (4): --moody-bg, --moody-text, --moody-accent
- Eerie (5): --eerie-bg, --eerie-text, --eerie-glow
- Finale (6): --finale-bg, --finale-text, --finale-accent

### Game State Structure
```javascript
{
  currentRoom: 0,
  rooms: { 0: {...}, 1: {...}, ... 6: {...} },
  totalHintsUsed: 0,
  startTime: null,
  endTime: null
}
```

### Solution Validation
- Obfuscation: base64 encoding (btoa)
- Normalization: lowercase, strip whitespace/punctuation
- Multiple formats accepted (e.g., dates: 10052024, 10/05/2024)

## Constraints
- Mobile users blocked (regex UA detection)
- No routing library (conditional rendering only)
- CSS Modules for component styles
- Google Fonts: Creepster, Inter, Playfair Display

## File Entry Points
- index.html -> /src/main.jsx
- Vite base: /valentine-escape-room/
