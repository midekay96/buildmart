# BuildMart Design Tokens - Developer Guide

## Quick Start

```javascript
import tokens from './tokens';

// Use any token
const buttonColor = tokens.colors.accent.default;      // '#1D9E75'
const spacing = tokens.spacing.lg;                      // '16px'
const radius = tokens.radius.md;                        // '8px'
const shadow = tokens.shadows.md;                       // '0 4px 6px rgba(...)'
const transition = tokens.transition.normal;            // '200ms ease-in-out'
```

---

## Color Tokens

### Surfaces (70% of palette) - Use for backgrounds
```javascript
// Page background (darkest)
tokens.colors.surface.bg          // '#04100A'

// Section background
tokens.colors.surface.section     // '#0f1419'

// Card background
tokens.colors.surface.card        // '#1a1f25'

// Elevated surface (hover cards)
tokens.colors.surface.elevated    // '#202530'

// Interactive elements
tokens.colors.surface.interactive // '#242d35'

// Hover state
tokens.colors.surface.hover       // '#2a3340'

// Active/selected
tokens.colors.surface.active      // '#313a44'
```

### Text (20% of palette) - Use for text color
```javascript
// Main text - use this most
tokens.colors.text.primary        // '#f1f5f9'

// Secondary/supporting text
tokens.colors.text.secondary      // '#cbd5e1'

// Labels, descriptions (lighter)
tokens.colors.text.muted          // '#94a3b8'

// Disabled text
tokens.colors.text.disabled       // '#64748b'

// Timestamps, metadata
tokens.colors.text.subtle         // '#475569'
```

### Accent (10% of palette) - USE ONLY FOR INTERACTIVE STATES
```javascript
// Active button, selected item, active tab
tokens.colors.accent.default      // '#1D9E75'

// Hover state on accent elements
tokens.colors.accent.hover        // '#16a34a'

// Pressed state
tokens.colors.accent.active       // '#15803d'

// Disabled accent
tokens.colors.accent.disabled     // 'rgba(29,158,117,0.5)'

// Accent as subtle background
tokens.colors.accent.bg           // 'rgba(29,158,117,0.1)'

// Accent as border
tokens.colors.accent.border       // 'rgba(29,158,117,0.3)'

// Accent glow for focus
tokens.colors.accent.glow         // 'rgba(29,158,117,0.2)'
```

### Semantic Colors
```javascript
// Success - green (use for success states)
tokens.colors.success.default     // '#10b981'
tokens.colors.success.bg          // 'rgba(16,185,129,0.1)'
tokens.colors.success.border      // 'rgba(16,185,129,0.3)'

// Warning - amber (use for warnings)
tokens.colors.warning.default     // '#f59e0b'
tokens.colors.warning.bg          // 'rgba(245,158,11,0.1)'
tokens.colors.warning.border      // 'rgba(245,158,11,0.3)'

// Danger - red (use for errors, delete)
tokens.colors.danger.default      // '#ef4444'
tokens.colors.danger.bg           // 'rgba(239,68,68,0.1)'
tokens.colors.danger.border       // 'rgba(239,68,68,0.3)'

// Info - blue (use for informational)
tokens.colors.info.default        // '#3b82f6'
tokens.colors.info.bg             // 'rgba(59,130,246,0.1)'
tokens.colors.info.border         // 'rgba(59,130,246,0.3)'
```

### Borders
```javascript
// Default border color
tokens.colors.border.default      // '#30363D'

// Active/focused border
tokens.colors.border.active       // '#1D9E75'

// Subtle border
tokens.colors.border.subtle       // 'rgba(255,255,255,0.05)'

// Emphasized border
tokens.colors.border.emphasis     // 'rgba(255,255,255,0.1)'
```

---

## Spacing Tokens (8px base unit)

```javascript
tokens.spacing.xs    // '4px'    - icon padding, tight gaps
tokens.spacing.sm    // '8px'    - form labels
tokens.spacing.md    // '12px'   - default padding
tokens.spacing.lg    // '16px'   - comfortable spacing (MOST COMMON)
tokens.spacing.xl    // '24px'   - section padding
tokens.spacing['2xl'] // '32px'  - section gaps
tokens.spacing['3xl'] // '48px'  - page-level spacing
```

**Usage Examples:**
```javascript
// Card padding
padding: tokens.spacing.lg;

// Gap between sections
marginTop: tokens.spacing.xl;

// Form input gap
gap: tokens.spacing.md;

// Large spacing between major sections
margin: tokens.spacing['2xl'] 0;
```

---

## Radius Tokens

```javascript
tokens.radius.sm     // '6px'    - form inputs, small elements
tokens.radius.md     // '8px'    - cards (MOST COMMON)
tokens.radius.lg     // '12px'   - large cards, modals
tokens.radius.full   // '9999px' - pills, badges
```

---

## Shadow Tokens (Elevation)

```javascript
tokens.shadows.none  // 'none'                              - flat
tokens.shadows.sm    // '0 1px 2px rgba(0,0,0,0.05)'       - subtle
tokens.shadows.md    // '0 4px 6px rgba(0,0,0,0.1)'        - default (MOST COMMON)
tokens.shadows.lg    // '0 10px 15px rgba(0,0,0,0.2)'      - prominent
tokens.shadows.xl    // '0 20px 25px rgba(0,0,0,0.3)'      - modal/dropdown
tokens.shadows.inset // 'inset 0 2px 4px rgba(0,0,0,0.2)' - pressed state
```

**Elevation Rules:**
- Default: `none`
- Hover: `sm` → `md`
- Selected: `md` (with border + tint)
- Pressed: `inset`
- Modal/Dropdown: `lg` or `xl`

---

## Transition Tokens

```javascript
tokens.transition.fast   // '150ms ease-in-out' - micro interactions
tokens.transition.normal // '200ms ease-in-out' - most common
tokens.transition.slow   // '300ms ease-in-out' - step changes
```

**Usage:**
```css
.button {
  transition: background-color tokens.transition.normal,
              box-shadow tokens.transition.normal;
}
```

---

## Component Token Examples

### Button
```javascript
const buttonStyles = tokens.components.button.primary;
// {
//   bg: '#1D9E75',
//   bgHover: '#16a34a',
//   bgActive: '#15803d',
//   color: '#fff',
//   padding: '12px 24px',
//   borderRadius: '10px',
//   ...
// }
```

### Card
```javascript
const cardDefault = tokens.components.card.default;
// {
//   bg: '#1a1f25',
//   border: '1px solid #30363D',
//   borderRadius: '12px',
//   padding: '20px',
//   shadow: 'none',
//   ...
// }

const cardSelected = tokens.components.card.selected;
// {
//   bg: '#1a1f25',
//   border: '2px solid #1D9E75',
//   shadow: '0 0 0 3px rgba(29,158,117,0.2)',
//   ...
// }
```

### Input
```javascript
const inputDefault = tokens.components.input.default;
const inputFocus = tokens.components.input.focus;
const inputError = tokens.components.input.error;
const inputSuccess = tokens.components.input.success;
```

---

## Using Tokens in CSS Modules

### Before (❌ Hardcoded)
```css
.button {
  background-color: #1D9E75;
  padding: 12px 24px;
  border-radius: 10px;
  transition: 200ms ease-in-out;
  box-shadow: 0 4px 12px rgba(29,158,117,0.3);
}

.button:hover {
  background-color: #16a34a;
  box-shadow: 0 6px 20px rgba(29,158,117,0.4);
}
```

### After (✅ Token-based)
```javascript
import tokens from '../styles/tokens';

const styles = {
  button: {
    backgroundColor: tokens.colors.accent.default,
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
    borderRadius: tokens.radius.lg,
    transition: tokens.transition.normal,
    boxShadow: tokens.shadows.md,

    '&:hover': {
      backgroundColor: tokens.colors.accent.hover,
      boxShadow: tokens.shadows.lg,
    },
  },
};
```

---

## Migration Checklist

When refactoring a component, replace:

- [ ] All color values with `tokens.colors.*`
- [ ] All padding/margin with `tokens.spacing.*`
- [ ] All border-radius with `tokens.radius.*`
- [ ] All box-shadows with `tokens.shadows.*`
- [ ] All transitions with `tokens.transition.*`
- [ ] Hardcoded RGB values with semantic tokens

---

## Key Rules

### DO ✅
- Use `tokens.colors.accent.*` **ONLY** for:
  - Active navigation items
  - Selected cards
  - Primary buttons
  - Focused inputs
  - Completed steps
  - Checkmarks
  - Current progress indicators

- Use `tokens.colors.surface.*` for:
  - Card backgrounds
  - Section backgrounds
  - Hover states
  - Input backgrounds

- Use `tokens.colors.text.*` for:
  - All text colors
  - Never use accent color for text

- Use semantic colors:
  - `success` for success states
  - `danger` for errors and destructive actions
  - `warning` for warnings
  - `info` for informational messages

### DON'T ❌
- Hardcode any color values
- Use accent color for large areas
- Use accent color for text (readability)
- Create new color values
- Use inconsistent spacing
- Forget transitions (feels janky)
- Apply shadows without elevation hierarchy

---

## Tools for Development

### Check Token Usage
```bash
# Find hardcoded colors
grep -r "#[0-9A-Fa-f]\{6\}" src/components --include="*.css" --include="*.js"

# Find hardcoded spacing
grep -r "px\|rem" src/components --include="*.css" | grep -v tokens
```

### Validate Color Contrast
Use the token values with WebAIM Contrast Checker:
- Primary text on surface.card: **PASS** ✓
- Primary text on accent.default: **PASS** ✓
- Muted text on surface.card: **PASS** ✓

---

## Questions?

If a token value is missing, add it to `tokens.js` following the existing structure.
If a component pattern recurs, add it to `components` section in `tokens.js`.
