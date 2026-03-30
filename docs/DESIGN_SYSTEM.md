# Le Clef Mot — Design System

## Brand Identity

**Name:** Le Clef Mot (The Key Word)  
**Concept:** Unlocking the soul of words through etymology  
**Visual Theme:** Neon illumination on dark backgrounds — knowledge as light

---

## Logo System

### Primary Logo
**File:** `logo_neon.png`  
**Symbol:** Fleur-de-lis (French heritage) with lightbulb center (enlightenment/knowledge)  
**Style:** Neon tube outline with golden-yellow glow  
**Background:** Dark navy brick wall texture

**Usage:**
- Hero sections
- Social media profile images
- App icons
- Merchandise

**Minimum size:** 48×48px  
**Clear space:** 20% of logo height on all sides

---

### Wordmark
**File:** `wordmark_neon.png`  
**Typography:** Custom neon script with glow effect  
**Style:** Continuous neon tube forming "Le Clef Mot"  
**Glow:** Multi-layer gradient (core → inner glow → outer halo)

**Usage:**
- Website header
- Marketing materials
- Email signatures
- Documentation headers

**Minimum size:** 200px width

---

## Color Palette

### Primary Colors

#### Neon Yellow (Primary Brand)
```css
--neon-yellow: #FFEB3B;
--neon-yellow-rgb: 255, 235, 59;
--neon-yellow-hsl: 56°, 100%, 62%;
```
**Usage:** Logo, CTAs, highlights, active states  
**Accessibility:** WCAG AAA on dark backgrounds

#### Neon Yellow Glow (Outer)
```css
--neon-glow-outer: rgba(255, 235, 59, 0.6);
```
**Usage:** Text shadows, box shadows, glow effects

#### Neon Yellow Glow (Inner)
```css
--neon-glow-inner: rgba(255, 255, 200, 0.9);
```
**Usage:** Inner core of neon elements

---

### Background Colors

#### Deep Navy (Primary Background)
```css
--bg-navy: #0A1628;
--bg-navy-rgb: 10, 22, 40;
```
**Usage:** Main background, cards, containers

#### Midnight Blue (Secondary Background)
```css
--bg-midnight: #162238;
```
**Usage:** Elevated surfaces, hover states

#### Charcoal (Tertiary)
```css
--bg-charcoal: #1E2D3D;
```
**Usage:** Borders, dividers, disabled states

---

### Accent Colors

#### Electric Cyan
```css
--accent-cyan: #00E5FF;
--accent-cyan-glow: rgba(0, 229, 255, 0.5);
```
**Usage:** Links, secondary CTAs, info states

#### Magenta Neon
```css
--accent-magenta: #FF006E;
--accent-magenta-glow: rgba(255, 0, 110, 0.5);
```
**Usage:** Alerts, error states, important highlights

#### Lime Neon
```css
--accent-lime: #CCFF00;
--accent-lime-glow: rgba(204, 255, 0, 0.5);
```
**Usage:** Success states, positive feedback

---

### Text Colors

#### Primary Text (Off-White)
```css
--text-primary: #F0F4F8;
```
**Usage:** Headings, body text, high-emphasis content

#### Secondary Text (Gray)
```css
--text-secondary: #94A3B8;
```
**Usage:** Descriptions, metadata, low-emphasis content

#### Tertiary Text (Muted)
```css
--text-tertiary: #64748B;
```
**Usage:** Captions, timestamps, disabled text

---

## Typography

### Neon Display Font
**Usage:** Logo, hero headlines, section titles  
**Style:** Outlined strokes with glow effect  
**Weight:** Medium (500)  
**Letter-spacing:** 0.05em (looser for neon readability)

### Body Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Sizes
```css
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

---

## Neon Effects

### Text Glow
```css
.neon-text {
  color: var(--neon-yellow);
  text-shadow:
    0 0 5px var(--neon-glow-inner),
    0 0 10px var(--neon-glow-outer),
    0 0 20px var(--neon-glow-outer),
    0 0 40px var(--neon-glow-outer);
}
```

### Box Glow
```css
.neon-box {
  border: 2px solid var(--neon-yellow);
  box-shadow:
    inset 0 0 10px var(--neon-glow-inner),
    0 0 10px var(--neon-glow-outer),
    0 0 20px var(--neon-glow-outer);
}
```

### Flicker Animation (Subtle)
```css
@keyframes neon-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
  75% { opacity: 0.98; }
}

.neon-flicker {
  animation: neon-flicker 4s infinite;
}
```

---

## Textures & Materials

### Brick Wall (Background Texture)
**Style:** Dark navy-blue brick with subtle mortar lines  
**Usage:** Hero sections, feature backgrounds  
**Opacity:** 20-30% overlay on solid navy background

### Concrete (Alternative)
**Style:** Smooth dark concrete with subtle grain  
**Usage:** Cards, modal backgrounds  
**Opacity:** 15-25%

### Brushed Metal (Accent)
**Style:** Dark gunmetal with directional grain  
**Usage:** Borders, dividers, premium elements  
**Opacity:** 10-20%

---

## Spacing System (8pt Grid)

```css
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-10: 5rem;    /* 80px */
```

---

## Border Radius

```css
--radius-sm: 4px;    /* Buttons, inputs */
--radius-md: 8px;    /* Cards, containers */
--radius-lg: 12px;   /* Modals, large cards */
--radius-xl: 16px;   /* Hero sections */
--radius-full: 9999px; /* Pills, avatars */
```

---

## Component States

### Hover
- Increase glow intensity by 50%
- Slightly brighten color (add 10% white overlay)
- Subtle scale transform (1.02x)

### Active/Pressed
- Reduce glow intensity by 30%
- Slightly darken color
- Scale transform (0.98x)

### Disabled
- Remove glow effects
- Reduce opacity to 40%
- Gray out color (desaturate)

---

## Accessibility

### Color Contrast
- **Neon Yellow on Navy:** 14.5:1 (AAA)
- **Off-White on Navy:** 12.3:1 (AAA)
- **Cyan on Navy:** 9.2:1 (AA)

### Motion Preferences
Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .neon-flicker {
    animation: none;
  }
}
```

### Focus Indicators
```css
:focus-visible {
  outline: 2px solid var(--neon-yellow);
  outline-offset: 4px;
  box-shadow: 0 0 10px var(--neon-glow-outer);
}
```

---

## Usage Examples

### Hero Section
```html
<section class="hero bg-navy texture-brick">
  <img src="/logo_neon.png" alt="Le Clef Mot logo" class="neon-flicker" />
  <img src="/wordmark_neon.png" alt="Le Clef Mot" />
  <p class="text-secondary">Unlock the soul of words</p>
</section>
```

### Neon Button
```html
<button class="neon-box neon-text">
  Explore Etymology
</button>
```

---

## File Locations

```
web/public/
├── logo_neon.png           # Primary logo
├── wordmark_neon.png       # Wordmark
├── logo_neon.svg           # Scalable logo (future)
├── favicon.ico             # Browser icon
└── textures/
    ├── brick_wall.png      # Dark brick texture
    ├── concrete.png        # Smooth concrete
    └── metal.png           # Brushed metal
```

---

## Brand Voice

- **Tone:** Intellectual yet approachable
- **Language:** English with French etymology appreciation
- **Personality:** Curious, illuminating, scholarly but not stuffy
- **Metaphor:** Words as keys unlocking knowledge, etymology as light in darkness

---

**Last Updated:** 2026-02-06  
**Version:** 1.0  
**Status:** ✅ Core design system established
