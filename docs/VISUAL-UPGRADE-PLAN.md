# 🎨 Valentine Escape Room - Visual Upgrade Plan

**Created:** 2026-02-04
**Tool:** NanoBanana Pro (Gemini 3 Pro Image)
**Goal:** Transform plain rooms into immersive, explorable escape room experiences

---

## 🎯 Art Style (TRACK THIS)

**Style Name:** "Whimsical Italian Sunset"
**Description:** Warm cartoon style with soft gradients, golden hour lighting, slightly dreamy/magical atmosphere. Think Studio Ghibli meets Italian postcard. Oversaturated warm colors (oranges, pinks, golds) with deep shadows for mystery.

**Consistent Elements:**
- Soft cel-shaded look
- Warm golden/sunset palette  
- Slightly surreal proportions
- Glowing highlights on important interactive elements
- Subtle sparkles/particles for magic feel

---

## 🐛 Bug Fixes (Priority 1)

### Room 0 Bugs
| Bug | Fix |
|-----|-----|
| No wrong answer feedback | Add red flash + "That's not when it started. Try again." text |
| No flicker effect | Implement CSS flicker animation with random timing |
| No Biggie silhouette | Add red jellycat shape that appears in flicker frames |

### Room 1 Bugs  
| Bug | Fix |
|-----|-----|
| No wrong answer feedback | Add "That's not what they whisper..." message |
| Abandoned stall too visible | Style as collapsed/shadowy, in corner |
| No transition text | Add "Ristora... the place. But first, somewhere closer to home." |
| Plain styling | Complete visual overhaul with generated assets |

---

## 🖼️ Image Generation Queue

### Phase A: Room 1 Transformation (Market)

#### A1. Market Sign (Entry Scene)
**Base:** docs/base_images/market-sign
**Prompt:** Transform into whimsical cartoon style - "Little Italy Market" sign with Italian flag colors (green/white/red), golden sunset glow, warm inviting atmosphere, slightly magical sparkles, Studio Ghibli inspired, soft cel-shaded
**Output:** public/assets/room1/market-sign-cartoon.png
**Resolution:** 2K

#### A2. Market Overview (Explorable Scene)
**Base:** docs/base_images/market-normal.jpeg  
**Prompt:** Transform into whimsical cartoon farmer's market scene, 7 distinct vendor stalls visible, warm sunset lighting, palm trees, San Diego Little Italy vibe, magical golden hour atmosphere, empty of people (eerie), cel-shaded cartoon style, interactive game background
**Output:** public/assets/room1/market-overview.png
**Resolution:** 2K

#### A3. Individual Stall Images (7 stalls)
Generate each stall as clickable hotspot:

1. **Rosie's Roots** - Cartoon vegetable stall, radishes & carrots prominent, warm wooden stand, "R" subtly glowing
2. **Ivy's Organics** - Leafy greens stall, kale & spinach, organic/earthy feel, "I" visible
3. **Sunrise Blooms** - Flower stall, lilies & roses, romantic vibes, "S" in petals
4. **Terra Fruits** - Fruit stand, apples & pears, rustic crates, "T" on sign
5. **Oak Barrel Honey** - Honey stall, wooden barrels, golden glow, "O" on barrel
6. **Red Barn Eggs** - Egg stand, red barn aesthetic, baskets, "R" on sign
7. **Abandoned** - Collapsed/shadowy stall in corner, mysterious, "A" barely visible, cobwebs

**Resolution:** 1K each

### Phase B: Room 0 Enhancement (Entry)

#### B1. Dark Entry Background
**Prompt:** Dark mysterious room, single door with light glowing around edges, typewriter on old desk, dust particles in light beam, eerie but not scary, cartoon style, deep shadows, slightly magical
**Output:** public/assets/room0/entry-background.png
**Resolution:** 2K

#### B2. Biggie Silhouette
**Prompt:** Red jellycat silhouette, soft glow, mysterious, cute but slightly ominous, transparent background
**Output:** public/assets/room0/biggie-silhouette.png  
**Resolution:** 1K

---

## 🎮 Interaction Flow Redesign

### Room 0 → Room 1 Transition
1. Correct date entered
2. Screen fades to black
3. Transition text: *"The door creaks open..."*
4. **NEW:** Market sign image fades in (A1)
5. **NEW:** Text overlay: *"Little Italy Market... where it all began"*
6. Click/tap to continue
7. **NEW:** Market overview loads (A2) - explorable scene

### Room 1 Exploration Mode
1. Market overview image as background
2. 7 clickable hotspots (stalls) that glow on hover
3. Clicking a stall shows close-up + vendor info
4. After visiting enough stalls, puzzle input appears
5. Puzzle integrated into scene (floating text input near center)
6. Hidden Nash somewhere in scene (easter egg)

---

## 📁 Asset Directory Structure

```
public/assets/
├── room0/
│   ├── entry-background.png
│   ├── biggie-silhouette.png
│   └── flicker-overlay.png
├── room1/
│   ├── market-sign-cartoon.png
│   ├── market-overview.png
│   └── stalls/
│       ├── rosies-roots.png
│       ├── ivys-organics.png
│       ├── sunrise-blooms.png
│       ├── terra-fruits.png
│       ├── oak-barrel-honey.png
│       ├── red-barn-eggs.png
│       └── abandoned.png
└── shared/
    └── sparkle-particle.png
```

---

## ⏱️ Execution Order

1. [ ] Create asset directories
2. [ ] Generate market sign cartoon (A1)
3. [ ] Generate market overview (A2)
4. [ ] Generate 7 stall images (A3)
5. [ ] Update Room1Market.jsx with image backgrounds
6. [ ] Add clickable hotspots and exploration mode
7. [ ] Fix wrong-answer feedback
8. [ ] Add transition animations
9. [ ] Generate Room 0 assets (B1, B2)
10. [ ] Update Room0Entry.jsx with visuals
11. [ ] Add flicker effect with Biggie
12. [ ] Test full flow
13. [ ] Polish and iterate

---

## 🍌 NanoBanana Pro Commands

```bash
# Generate
uv run /Users/clawdbot/openclaw-dev/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "description" \
  --filename "output.png" \
  --resolution 2K

# Edit/Transform existing
uv run /Users/clawdbot/openclaw-dev/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "transform instructions" \
  --filename "output.png" \
  -i "/path/to/input.png" \
  --resolution 2K
```

---

*Let's make this unforgettable for Riya* 💕
