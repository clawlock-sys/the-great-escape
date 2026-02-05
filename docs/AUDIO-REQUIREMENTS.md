# Audio Requirements

This document specifies the audio files needed for the Valentine Escape Room.

## Required Audio Files

All audio files should be placed in `public/audio/`.

### Room 0 (Entry)

| File | Purpose | Specs | Recommended Source |
|------|---------|-------|-------------------|
| `ambient-drone.mp3` | Background atmosphere | Loop, 30s+, dark/eerie tone | Freesound.org - search "dark ambient drone" |
| `typewriter-click.mp3` | Typewriter letter sound | Short click, <0.5s | Freesound.org - search "typewriter click" |

### Room 1 (Market)

| File | Purpose | Specs | Recommended Source |
|------|---------|-------|-------------------|
| `ambient-market.mp3` | Outdoor market sounds | Loop, 30s+, cheerful/bustling | Freesound.org - search "farmer market ambient" |

## Audio Specifications

- **Format**: MP3 (for broad browser compatibility)
- **Bit rate**: 128-192 kbps
- **Sample rate**: 44.1 kHz
- **Volume**: Normalized to prevent clipping

## Fallback Behavior

The `useAudio` hook gracefully handles missing audio files:
- No errors thrown if file not found
- Game continues without audio
- Console warning logged (development only)

## License Considerations

When sourcing audio:
- Use Creative Commons (CC0, CC-BY) licensed files
- Attribution requirements should be documented in `CREDITS.md`
- Avoid copyrighted material

## Implementation Notes

Audio is loaded via Howler.js through the `useAudio` hook:
```javascript
const ambient = useAudio('/audio/ambient-drone.mp3', { loop: true, volume: 0.3 });
```

Volume levels are intentionally low (0.2-0.3) to not overwhelm the experience.
