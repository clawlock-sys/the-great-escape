# 🛠️ Tech Spec — Riya's Valentine Escape Room

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + Vite | Fast build, easy GH Pages deploy, component model fits rooms |
| Styling | CSS Modules + CSS Variables | Scoped styles, easy theming per room |
| State | useState + localStorage hook | Simple, sufficient for 6 rooms |
| Audio | Howler.js | Clean API, handles loops, good browser compat |
| Animations | CSS transitions + Framer Motion (optional) | CSS for simple, FM if we need complex |
| Deployment | GitHub Pages (via `gh-pages` package) | Free, simple, static |

---

## Project Structure

```
valentine-escape/
├── public/
│   ├── audio/
│   │   ├── ambient-creepy.mp3
│   │   ├── ambient-warm.mp3
│   │   ├── success.mp3
│   │   ├── fail.mp3
│   │   └── gracie-abrams-clip.mp3
│   └── images/
│       ├── nash/
│       │   ├── nash-1.png ... nash-8.png (real)
│       │   └── nash-decoy-1.png ... (decoys)
│       ├── biggie/
│       │   ├── biggie-cute.png
│       │   ├── biggie-ominous.png
│       │   └── biggie-happy.png
│       ├── backgrounds/
│       │   ├── market-bg.png (optional)
│       │   └── apartment-bg.png
│       ├── esqueleto-poster.png
│       └── shez-riya.png (finale)
├── src/
│   ├── index.jsx
│   ├── App.jsx
│   ├── hooks/
│   │   ├── usePersistedState.js
│   │   ├── useAudio.js
│   │   └── useRoom.js
│   ├── components/
│   │   ├── Room.jsx (wrapper)
│   │   ├── CodeInput.jsx
│   │   ├── TextInput.jsx
│   │   ├── HintButton.jsx
│   │   ├── RunawayButton.jsx
│   │   ├── ClickableArea.jsx
│   │   └── Transition.jsx
│   ├── rooms/
│   │   ├── Room0Entry.jsx
│   │   ├── Room1Market.jsx
│   │   ├── Room2Apartment.jsx
│   │   ├── Room3Restaurant.jsx
│   │   ├── Room4Music.jsx
│   │   ├── Room5Biggie.jsx
│   │   └── Room6Finale.jsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   ├── Room0.module.css
│   │   ├── ... (per room)
│   │   └── components.module.css
│   └── utils/
│       ├── solutions.js (hashed answers)
│       └── confetti.js
├── package.json
├── vite.config.js
└── README.md
```

---

## Core Components

### `usePersistedState.js`
```javascript
import { useState, useEffect } from 'react';

export function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
```

### `useAudio.js`
```javascript
import { Howl } from 'howler';
import { useRef, useEffect } from 'react';

export function useAudio(src, options = {}) {
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      loop: options.loop || false,
      volume: options.volume || 0.5,
    });
    return () => soundRef.current?.unload();
  }, [src]);

  return {
    play: () => soundRef.current?.play(),
    stop: () => soundRef.current?.stop(),
    fade: (from, to, duration) => soundRef.current?.fade(from, to, duration),
  };
}
```

### `RunawayButton.jsx`
```javascript
import { useState, useRef } from 'react';
import styles from './RunawayButton.module.css';

const TAUNTS = [
  "no",
  "please?",
  "come on...",
  "I'll buy you Thai food",
  "Biggie says you have to",
  "...",
  "fine, be that way",
];

export function RunawayButton({ onCatch }) {
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    const btn = buttonRef.current;
    const parent = btn.parentElement;
    const parentRect = parent.getBoundingClientRect();
    
    // Calculate escape direction (away from cursor)
    const maxX = parentRect.width - btn.offsetWidth;
    const maxY = parentRect.height - btn.offsetHeight;
    
    // Random position weighted away from current
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    setPosition({ x: newX, y: newY });
    setAttempts(a => a + 1);
  };

  const speed = Math.max(0.1, 0.3 - attempts * 0.02); // Gets faster

  return (
    <button
      ref={buttonRef}
      className={styles.runaway}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: `transform ${speed}s ease-out`,
        fontSize: Math.max(8, 14 - attempts * 0.5) + 'px', // Shrinks
      }}
    >
      {TAUNTS[Math.min(attempts, TAUNTS.length - 1)]}
    </button>
  );
}
```

### `ClickableArea.jsx` (for Nash hunt)
```javascript
import styles from './ClickableArea.module.css';

export function ClickableArea({ 
  id, 
  x, 
  y, 
  width, 
  height, 
  found, 
  onFind,
  isDecoy 
}) {
  const handleClick = () => {
    if (found) return;
    onFind(id, isDecoy);
  };

  return (
    <div
      className={`${styles.area} ${found ? styles.found : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      onClick={handleClick}
    />
  );
}
```

---

## Room State Structure

```javascript
const initialGameState = {
  currentRoom: 0,
  rooms: {
    0: { completed: false, attempts: 0 },
    1: { completed: false, attempts: 0, hintsUsed: 0 },
    2: { completed: false, foundNashes: [], attempts: 0, hintsUsed: 0 },
    3: { completed: false, attempts: 0, hintsUsed: 0 },
    4: { completed: false, attempts: 0, hintsUsed: 0 },
    5: { completed: false, attempts: 0, hintsUsed: 0 },
    6: { completed: false },
  },
  totalHintsUsed: 0,
  startTime: null,
  endTime: null,
};
```

---

## Solution Validation

Store hashed solutions (don't expose in source):

```javascript
// utils/solutions.js
const hash = (str) => {
  // Simple hash for obfuscation (not security)
  return btoa(str.toLowerCase().replace(/\s/g, ''));
};

export const SOLUTIONS = {
  0: hash('10052024'), // Also accept 10/05/2024, etc
  1: hash('ristora'),
  2: hash('ilando'),
  3: hash('octoberfifth'), // Also accept "october fifth"
  4: 'i-love-you-im-sorry', // Selection, not typed
  5: hash('02142025'), // Also accept 02/14/2025, etc
};

export const validate = (room, answer) => {
  const normalized = answer.toLowerCase().replace(/[\s\-\/\.]/g, '');
  return hash(normalized) === SOLUTIONS[room] || 
         SOLUTIONS[room] === normalized;
};
```

---

## CSS Variables (Theming)

```css
/* variables.css */
:root {
  /* Room 0-1: Creepy */
  --creepy-bg: #0a0a0f;
  --creepy-text: #8b0000;
  --creepy-glow: rgba(139, 0, 0, 0.3);
  
  /* Room 2-3: Warmer */
  --warm-bg: #1a1a2e;
  --warm-text: #eee;
  --warm-accent: #e94560;
  
  /* Room 4: Moody */
  --moody-bg: #16213e;
  --moody-text: #a5b4fc;
  --moody-accent: #7c3aed;
  
  /* Room 5: Eerie */
  --eerie-bg: #0f0f0f;
  --eerie-text: #ff4444;
  --eerie-glow: rgba(255, 0, 0, 0.2);
  
  /* Room 6: Celebration */
  --finale-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --finale-text: #fff;
  --finale-accent: #f472b6;
  
  /* Common */
  --font-creepy: 'Creepster', cursive;
  --font-elegant: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  
  --transition-slow: 0.5s ease;
  --transition-fast: 0.2s ease;
}
```

---

## Deployment (GitHub Pages)

```json
// package.json additions
{
  "homepage": "https://YOUR_USERNAME.github.io/valentine-escape",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/valentine-escape/', // Must match repo name
});
```

---

## Mobile Blocker

```jsx
// App.jsx
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  return (
    <div className="mobile-blocker">
      <h1>🔐</h1>
      <p>This experience requires a laptop.</p>
      <p>Please open on a computer for the full escape room.</p>
    </div>
  );
}
```

---

## Fonts (Google Fonts)

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Creepster&family=Inter:wght@400;600&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
```

---

## Audio Files Needed

| File | Duration | Loop | Room |
|------|----------|------|------|
| `ambient-drone.mp3` | 30s+ | Yes | 0, 1 |
| `ambient-cozy.mp3` | 30s+ | Yes | 2, 3 |
| `ambient-moody.mp3` | 30s+ | Yes | 4 |
| `ambient-eerie.mp3` | 30s+ | Yes | 5 |
| `success-chime.mp3` | 2s | No | All |
| `fail-buzz.mp3` | 1s | No | All |
| `gracie-clip.mp3` | 30-60s | No | 4, 6 |
| `confetti-pop.mp3` | 1s | No | 6 |

Free sources: freesound.org, pixabay.com/music

---

## Dev Timeline

| Day | Task |
|-----|------|
| 1 | Scaffold project, core components, Room 0-1 |
| 2 | Room 2 (Nash hunt - most complex) |
| 3 | Room 3-4 |
| 4 | Room 5-6 (Biggie + finale) |
| 5 | Polish, audio, transitions |
| 6 | Testing, deploy, buffer |

---

Ready to build. 🔧
