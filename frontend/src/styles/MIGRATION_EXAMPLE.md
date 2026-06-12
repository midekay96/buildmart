# Component Migration Guide - Before & After Examples

## Example 1: Button Component Migration

### ❌ BEFORE (Hardcoded Colors)
```javascript
// src/components/Button.module.css

.btnPrimary {
  background-color: #1D9E75;
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(29, 158, 117, 0.3);
  transition: background-color 200ms ease-in-out, box-shadow 200ms ease-in-out;
}

.btnPrimary:hover {
  background-color: #16a34a;
  box-shadow: 0 6px 20px rgba(29, 158, 117, 0.4);
}

.btnPrimary:active {
  background-color: #15803d;
}

.btnPrimary:disabled {
  background-color: rgba(29, 158, 117, 0.5);
  cursor: not-allowed;
  opacity: 0.6;
}

.btnSecondary {
  background-color: transparent;
  border: 2px solid #30363D;
  color: #f1f5f9;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.btnSecondary:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.btnGhost {
  background-color: transparent;
  border: none;
  color: #cbd5e1;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease-in-out;
}

.btnGhost:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.btnDanger {
  background-color: #ef4444;
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.btnDanger:hover {
  background-color: #dc2626;
}
```

### ✅ AFTER (Token-Based)
```javascript
import tokens from '../styles/tokens';

// Create object mapping for cleaner CSS
const buttonTokens = tokens.components.button;

const styles = {
  // Primary button - uses accent color
  btnPrimary: {
    backgroundColor: tokens.colors.accent.default,
    color: '#fff',
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
    border: 'none',
    borderRadius: tokens.radius.lg,
    fontSize: tokens.typography.body.fontSize,
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: tokens.shadows.md,
    transition: `all ${tokens.transition.normal}`,

    '&:hover': {
      backgroundColor: tokens.colors.accent.hover,
      boxShadow: tokens.shadows.lg,
    },

    '&:active': {
      backgroundColor: tokens.colors.accent.active,
    },

    '&:disabled': {
      backgroundColor: tokens.colors.accent.disabled,
      cursor: 'not-allowed',
      opacity: '0.6',
    },
  },

  // Secondary button - uses border
  btnSecondary: {
    backgroundColor: 'transparent',
    border: `2px solid ${tokens.colors.border.default}`,
    color: tokens.colors.text.primary,
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    borderRadius: tokens.radius.lg,
    fontSize: tokens.typography.body.fontSize,
    fontWeight: '600',
    cursor: 'pointer',
    transition: `all ${tokens.transition.normal}`,

    '&:hover': {
      backgroundColor: tokens.colors.surface.hover,
      borderColor: tokens.colors.border.emphasis,
    },
  },

  // Ghost button - text only
  btnGhost: {
    backgroundColor: 'transparent',
    border: 'none',
    color: tokens.colors.text.secondary,
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    borderRadius: tokens.radius.md,
    cursor: 'pointer',
    transition: `all ${tokens.transition.fast}`,

    '&:hover': {
      backgroundColor: tokens.colors.surface.hover,
      color: tokens.colors.text.primary,
    },
  },

  // Danger button - uses danger color
  btnDanger: {
    backgroundColor: tokens.colors.danger.default,
    color: '#fff',
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
    border: 'none',
    borderRadius: tokens.radius.lg,
    cursor: 'pointer',
    transition: `all ${tokens.transition.normal}`,

    '&:hover': {
      backgroundColor: '#dc2626', // Slightly darker
      boxShadow: tokens.shadows.md,
    },
  },
};

export default styles;
```

---

## Example 2: Card Component Migration

### ❌ BEFORE
```javascript
// src/components/ProductCard.module.css

.productCard {
  background-color: #1a1f25;
  border: 1px solid #30363D;
  border-radius: 12px;
  padding: 16px;
  transition: all 200ms ease-in-out;
  cursor: pointer;
}

.productCard:hover {
  border-color: #1D9E75;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.productCard.selected {
  border: 2px solid #1D9E75;
  box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.2);
}

.productImage {
  width: 100%;
  height: 160px;
  background-color: #242d35;
  border-radius: 8px;
  margin-bottom: 12px;
}

.productTitle {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.productPrice {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1D9E75;
  margin-bottom: 12px;
}

.productDescription {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 16px;
}

.addButton {
  width: 100%;
  padding: 12px;
  background-color: #1D9E75;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.addButton:hover {
  background-color: #16a34a;
}
```

### ✅ AFTER
```javascript
import tokens from '../styles/tokens';

const styles = {
  // Default card
  productCard: {
    backgroundColor: tokens.colors.surface.card,
    border: `1px solid ${tokens.colors.border.default}`,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    transition: `all ${tokens.transition.normal}`,
    cursor: 'pointer',

    '&:hover': {
      borderColor: tokens.colors.border.emphasis,
      boxShadow: tokens.shadows.md,
      transform: 'translateY(-2px)',
    },
  },

  // Selected card state
  productCardSelected: {
    border: `2px solid ${tokens.colors.accent.default}`,
    boxShadow: `0 0 0 3px ${tokens.colors.accent.glow}`,
  },

  // Product image placeholder
  productImage: {
    width: '100%',
    height: '160px',
    backgroundColor: tokens.colors.surface.interactive,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },

  // Product title
  productTitle: {
    fontSize: tokens.typography.h4.fontSize,
    fontWeight: '700',
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },

  // Product price - uses accent color (premium info)
  productPrice: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: tokens.colors.accent.default,
    marginBottom: tokens.spacing.md,
  },

  // Product description
  productDescription: {
    fontSize: tokens.typography.small.fontSize,
    color: tokens.colors.text.muted,
    lineHeight: tokens.typography.small.lineHeight,
    marginBottom: tokens.spacing.lg,
  },

  // Add to cart button
  addButton: {
    width: '100%',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.accent.default,
    color: '#fff',
    border: 'none',
    borderRadius: tokens.radius.md,
    fontWeight: '600',
    cursor: 'pointer',
    transition: `all ${tokens.transition.normal}`,

    '&:hover': {
      backgroundColor: tokens.colors.accent.hover,
      boxShadow: tokens.shadows.md,
    },

    '&:active': {
      backgroundColor: tokens.colors.accent.active,
    },
  },
};

export default styles;
```

---

## Example 3: Form Input Migration

### ❌ BEFORE
```javascript
.input {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.9375rem;
  color: #f1f5f9;
  font-family: inherit;
  transition: all 200ms ease-in-out;
}

.input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.08);
  border-color: #1D9E75;
  box-shadow: 0 0 0 3px rgba(29, 158, 117, 0.2);
}

.inputError {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.inputSuccess {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.inputDisabled {
  background-color: rgba(255, 255, 255, 0.02);
  opacity: 0.5;
  cursor: not-allowed;
}

.label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.helperText {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 6px;
}
```

### ✅ AFTER
```javascript
import tokens from '../styles/tokens';

const styles = {
  // Default input
  input: {
    backgroundColor: tokens.colors.surface.interactive,
    border: `1px solid ${tokens.colors.border.default}`,
    borderRadius: tokens.radius.sm,
    padding: `${tokens.spacing.md} ${tokens.spacing.md}`,
    fontSize: tokens.typography.body.fontSize,
    color: tokens.colors.text.primary,
    fontFamily: 'inherit',
    transition: `all ${tokens.transition.normal}`,

    '&:focus': {
      outline: 'none',
      backgroundColor: tokens.colors.surface.elevated,
      borderColor: tokens.colors.accent.default,
      boxShadow: `0 0 0 3px ${tokens.colors.accent.glow}`,
    },
  },

  // Error state
  inputError: {
    borderColor: tokens.colors.danger.default,
    boxShadow: `0 0 0 3px ${tokens.colors.danger.bg}`,
  },

  // Success state
  inputSuccess: {
    borderColor: tokens.colors.success.default,
    boxShadow: `0 0 0 3px ${tokens.colors.success.bg}`,
  },

  // Disabled state
  inputDisabled: {
    backgroundColor: tokens.colors.surface.bg,
    opacity: '0.5',
    cursor: 'not-allowed',
  },

  // Label
  label: {
    display: 'block',
    fontSize: tokens.typography.small.fontSize,
    fontWeight: '600',
    color: tokens.colors.text.secondary,
    marginBottom: tokens.spacing.sm,
  },

  // Helper text
  helperText: {
    fontSize: tokens.typography.tiny.fontSize,
    color: tokens.colors.text.muted,
    marginTop: tokens.spacing.xs,
  },
};

export default styles;
```

---

## Key Takeaways

### Changes in Pattern
1. **Import tokens** at the top of your CSS module
2. **Replace hardcoded colors** with `tokens.colors.*`
3. **Replace hardcoded spacing** with `tokens.spacing.*`
4. **Replace hardcoded shadows** with `tokens.shadows.*`
5. **Replace hardcoded transitions** with `tokens.transition.*`
6. **Use semantic colors** (success, danger, warning, info) instead of hardcoded hex values

### Benefits of Token-Based Approach
- ✅ **Consistency** - same values everywhere
- ✅ **Maintainability** - change once, updates everywhere
- ✅ **Scalability** - easy to add themes
- ✅ **Readability** - intent is clear from token names
- ✅ **Type safety** - if using TS, can validate token usage
- ✅ **Accessibility** - ensures WCAG-compliant colors

### Common Mistakes to Avoid
- ❌ Don't hardcode colors after tokens exist
- ❌ Don't create new tokens without discussion
- ❌ Don't use accent color for text (readability fails)
- ❌ Don't forget to apply transitions (feels janky)
- ❌ Don't use different spacing values inconsistently

---

## Testing Your Migration

After migrating a component:

1. **Visual check** - does it look the same?
2. **Hover states** - are shadows/colors consistent?
3. **Focus states** - can keyboard users see focus?
4. **Disabled states** - clear that button is disabled?
5. **Color contrast** - sufficient for WCAG AA?
6. **Responsive** - looks good on mobile?

---

## Questions During Migration?

Refer to `tokenMap.md` for all available token values and usage patterns.
