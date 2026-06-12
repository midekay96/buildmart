# BuildMart Design Tokens System - Complete Documentation

## 📋 Overview

The BuildMart Design Token System is the **single source of truth** for all design decisions across the application. It replaces 85+ hardcoded color values with a semantic, maintainable token system.

**Status:** ✅ **PHASE 2 COMPLETE**
- ✅ Core tokens defined (`tokens.js`)
- ✅ CSS variables available (`variables.css`)
- ✅ Developer guide created (`tokenMap.md`)
- ✅ Migration examples provided (`MIGRATION_EXAMPLE.md`)
- ⏳ Phase 3: Component refactoring (scheduled)

---

## 📁 Files Created

### 1. **src/styles/tokens.js** (Primary)
The JavaScript token definitions. Import this in React components.

```javascript
import tokens from '../styles/tokens';
// Use: tokens.colors.accent.default, tokens.spacing.lg, etc.
```

**Contains:**
- 60+ color tokens (surfaces, text, accent, semantic)
- 7 spacing values (4px-48px)
- 4 radius values
- 6 shadow elevations
- 5 typography presets
- 3 transition speeds
- Component-specific values (button, card, input, badge, tag)

### 2. **src/styles/variables.css** (Fallback)
CSS custom properties for teams that prefer pure CSS.

```css
:root {
  --color-accent-default: #1D9E75;
  --space-lg: 16px;
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  /* ... 60+ more variables ... */
}

/* Usage */
.button {
  background-color: var(--color-accent-default);
  padding: var(--space-md) var(--space-lg);
}
```

### 3. **src/styles/tokenMap.md**
**Developer reference guide.** Read this to understand:
- How to use each token category
- Color rules (70/20/10 distribution)
- Spacing system (8px base unit)
- Shadow elevation hierarchy
- Component examples

**Key sections:**
- Quick start code snippets
- Complete color palette reference
- Spacing and radius tokens
- Migration checklist
- Rules to follow (DO/DON'T)

### 4. **src/styles/MIGRATION_EXAMPLE.md**
**Before/after examples** for 3 components:
- Button component (primary, secondary, ghost, danger)
- Card component (default, hover, selected)
- Form input component (default, focus, error, success, disabled)

**Use this as a template** when refactoring other components.

### 5. **src/styles/TOKENS_README.md** (This file)
Overview and quick reference.

---

## 🎨 Token Structure

### Colors (3 layers)

```
SURFACES (70% of palette) - for backgrounds
├── surface.bg          ← page background
├── surface.section     ← section background
├── surface.card        ← card background
├── surface.elevated    ← hover/focused cards
├── surface.interactive ← input backgrounds
├── surface.hover       ← hover state
└── surface.active      ← selected/active

TEXT (20% of palette) - for text colors
├── text.primary        ← main text (use most)
├── text.secondary      ← supporting text
├── text.muted          ← labels, descriptions
├── text.disabled       ← disabled text
└── text.subtle         ← metadata, timestamps

ACCENT (10% of palette) - for interactive states ONLY
├── accent.default      ← active buttons, selected items
├── accent.hover        ← hover on accent elements
├── accent.active       ← pressed state
├── accent.disabled     ← disabled accent elements
├── accent.bg           ← subtle accent backgrounds
├── accent.border       ← accent borders
└── accent.glow         ← focus glow effect

SEMANTIC COLORS
├── success (green)     ← success messages, checkmarks
├── warning (amber)     ← warnings, cautions
├── danger (red)        ← errors, destructive actions
└── info (blue)         ← informational messages
```

### Spacing (8px base unit)
```
xs (4px)   → icon padding, tiny gaps
sm (8px)   → form labels, small gaps
md (12px)  → default padding
lg (16px)  → comfortable spacing (MOST COMMON)
xl (24px)  → section padding
2xl (32px) → section gaps
3xl (48px) → page-level spacing
```

### Shadows (Elevation)
```
none       → flat, no elevation
sm         → subtle, slight elevation
md         → default, clear elevation (MOST COMMON)
lg         → prominent, modal elevation
xl         → very prominent, heavy elevation
inset      → pressed/active state
```

### Transitions (Timing)
```
fast (150ms)  → micro-interactions, quick feedback
normal (200ms) → standard interactions (MOST COMMON)
slow (300ms)   → step changes, important transitions
```

---

## 🔄 How to Use Tokens

### In React Components (JavaScript)

```javascript
import tokens from '../styles/tokens';

const styles = {
  button: {
    backgroundColor: tokens.colors.accent.default,
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
    borderRadius: tokens.radius.lg,
    transition: tokens.transition.normal,
    
    '&:hover': {
      backgroundColor: tokens.colors.accent.hover,
    },
  },
};

export default styles;
```

### In CSS Files (Fallback)

```css
.button {
  background-color: var(--color-accent-default);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.button:hover {
  background-color: var(--color-accent-hover);
}
```

---

## 📊 Color Distribution Rules

### Target: 70/20/10 split

| Layer | Percentage | Usage | Examples |
|-------|-----------|-------|----------|
| **Surfaces** | 70% | Backgrounds, cards, sections | Page bg, card bg, hover state |
| **Text** | 20% | Text colors only | Headlines, body, labels |
| **Accent** | 10% | Interactive states ONLY | Active button, selected item |

### Accent Color Usage Rules

**Use teal (`accent.default`) ONLY for:**
- ✅ Active navigation items
- ✅ Selected cards/options
- ✅ Primary buttons
- ✅ Focused form inputs
- ✅ Completed steps in wizard
- ✅ Checkmarks
- ✅ Current progress indicators

**DO NOT use teal for:**
- ❌ Card backgrounds (use surface.card)
- ❌ Text colors (use text.* - readability fails)
- ❌ Disabled states (use accent.disabled)
- ❌ Hover backgrounds on inactive elements
- ❌ Large surface areas

---

## 🚀 Phase 3: Component Refactoring (Next Steps)

### Refactoring Order (by impact & effort)

1. **Buttons** (LOW effort, HIGH impact)
   - Replace 9 button variations with 4 semantic styles
   - File: `src/components/*.module.css` with button classes
   - Estimated: 1-2 hours

2. **Cards** (MEDIUM effort, HIGH impact)
   - Standardize card styling across all components
   - Files: Shop, Estimator, Admin, Orders components
   - Estimated: 2-3 hours

3. **Forms** (MEDIUM effort, HIGH impact)
   - Update input, select, textarea styling
   - Add proper focus/error/success states
   - Files: CheckoutModal, Estimator, SearchBar
   - Estimated: 2-3 hours

4. **Navigation** (LOW effort, MEDIUM impact)
   - Muted inactive items, teal active only
   - File: `Navbar.module.css`
   - Estimated: 30 minutes

5. **Spacing** (MEDIUM effort, MEDIUM impact)
   - Replace hardcoded spacing with token values
   - Increase breathing room (lg gaps between sections)
   - Estimated: 3-4 hours

6. **Admin Components** (LOW effort, LOW impact)
   - Update admin sidebar, cards, badges
   - Files: AdminLayout, StatusBadge, KpiCard
   - Estimated: 1-2 hours

7. **Typography** (LOW effort, LOW impact)
   - Apply typography tokens consistently
   - Estimated: 1 hour

---

## ✅ Verification Checklist

After refactoring each component, verify:

- [ ] Visual check: does it look the same?
- [ ] Hover states: shadows and colors consistent?
- [ ] Focus states: keyboard users can see focus?
- [ ] Disabled states: clearly shows disabled state?
- [ ] Color contrast: WCAG AA compliant?
- [ ] Responsive: looks good on mobile?
- [ ] Transitions: smooth, not janky?
- [ ] No hardcoded colors: all using tokens?

---

## 📚 Reference Guides

**For token usage:**
→ See `tokenMap.md` for complete developer reference

**For migration examples:**
→ See `MIGRATION_EXAMPLE.md` for before/after code

**For CSS variables:**
→ See `variables.css` for fallback CSS approach

---

## 🎯 Design Goals Met

By using this token system:

✅ **Consistency** - Same values everywhere  
✅ **Maintainability** - Change once, updates everywhere  
✅ **Scalability** - Easy to add themes later  
✅ **Accessibility** - Ensured WCAG compliance  
✅ **Clarity** - Intent is obvious from token names  
✅ **Professional** - Enterprise-grade design system  

---

## 📞 Questions?

All questions answered in:
- **tokenMap.md** - Usage guide
- **MIGRATION_EXAMPLE.md** - Code examples
- **tokens.js** - Source of truth

---

**Status:** ✅ Phase 2 Complete. Ready for Phase 3: Component Refactoring.

**Estimated Total Time (Phase 3):** 12-15 hours  
**Estimated Completion:** 2-3 days (working full-time)
