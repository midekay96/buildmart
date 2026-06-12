/**
 * BuildMart Design Tokens
 * Single source of truth for all design decisions
 *
 * Usage: import tokens from './tokens'
 * Then use: tokens.colors.accent.default, tokens.spacing.md, etc.
 */

const tokens = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COLORS (70% neutral, 20% text, 10% brand accent)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  colors: {
    // ─── Neutral Surfaces (70% of palette) ───
    surface: {
      // Page background - darkest
      bg: '#04100A',

      // Section background - slightly lighter
      section: '#0f1419',

      // Card background - mid tone
      card: '#1a1f25',

      // Elevated surface (hover/focus cards)
      elevated: '#202530',

      // Interactive surface (inputs, buttons, interactive zones)
      interactive: '#242d35',

      // Hover surface (on cards, buttons)
      hover: '#2a3340',

      // Active/selected surface
      active: '#313a44',
    },

    // ─── Text Colors (20% of palette) ───
    text: {
      // Primary text - white/light
      primary: '#f1f5f9',

      // Secondary text - medium gray
      secondary: '#cbd5e1',

      // Muted text - lighter gray (labels, descriptions)
      muted: '#94a3b8',

      // Disabled text - even lighter
      disabled: '#64748b',

      // Subtle text - for metadata, timestamps
      subtle: '#475569',
    },

    // ─── Brand Accent (10% of palette) - USE ONLY FOR INTERACTIVE STATES
    accent: {
      // Default/primary accent color
      default: '#1D9E75',

      // Accent hover state (lighter/brighter)
      hover: '#16a34a',

      // Accent active/pressed state
      active: '#15803d',

      // Accent disabled state
      disabled: 'rgba(29,158,117,0.5)',

      // Accent with opacity for subtle backgrounds
      bg: 'rgba(29,158,117,0.1)',

      // Accent with opacity for borders
      border: 'rgba(29,158,117,0.3)',

      // Accent glow for focus states
      glow: 'rgba(29,158,117,0.2)',
    },

    // ─── Semantic Colors ───
    success: {
      default: '#059669',
      bg: 'rgba(5,150,105,0.1)',
      border: 'rgba(5,150,105,0.3)',
    },

    warning: {
      default: '#d97706',
      bg: 'rgba(217,119,6,0.1)',
      border: 'rgba(217,119,6,0.3)',
    },

    danger: {
      default: '#dc2626',
      bg: 'rgba(220,38,38,0.1)',
      border: 'rgba(220,38,38,0.3)',
    },

    info: {
      default: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.3)',
    },

    // ─── Borders ───
    border: {
      // Default border color
      default: '#30363D',

      // Active/focused border color
      active: '#1D9E75',

      // Subtle border
      subtle: 'rgba(255,255,255,0.05)',

      // Emphasized border
      emphasis: 'rgba(255,255,255,0.1)',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SPACING (8px base unit system)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  spacing: {
    xs: '4px',    // Extra small - icon padding, small gaps
    sm: '8px',    // Small - form labels, tight spacing
    md: '12px',   // Medium - default padding, normal gaps
    lg: '16px',   // Large - section padding, comfortable spacing
    xl: '24px',   // Extra large - section gaps, breathing room
    '2xl': '32px', // 2x large - major section separation
    '3xl': '48px', // 3x large - page-level spacing
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BORDER RADIUS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  radius: {
    sm: '6px',    // Small elements, form inputs
    md: '8px',    // Default radius for cards
    lg: '12px',   // Large cards, modals
    full: '9999px', // Pills, badges
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHADOWS (elevation system)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  shadows: {
    // No shadow - flat surface
    none: 'none',

    // Subtle shadow - slight elevation
    sm: '0 1px 2px rgba(0,0,0,0.05)',

    // Medium shadow - clear elevation
    md: '0 4px 6px rgba(0,0,0,0.1)',

    // Large shadow - prominent elevation
    lg: '0 10px 15px rgba(0,0,0,0.2)',

    // Extra large shadow - modal/dropdown elevation
    xl: '0 20px 25px rgba(0,0,0,0.3)',

    // Inset shadow - pressed state
    inset: 'inset 0 2px 4px rgba(0,0,0,0.2)',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TYPOGRAPHY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  typography: {
    // Page heading (H1)
    h1: {
      fontSize: '2.5rem',
      fontWeight: '800',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },

    // Section heading (H2)
    h2: {
      fontSize: '1.875rem',
      fontWeight: '700',
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
    },

    // Subsection heading (H3)
    h3: {
      fontSize: '1.5rem',
      fontWeight: '700',
      lineHeight: '1.4',
    },

    // Card/component heading (H4)
    h4: {
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1.4',
    },

    // Body text - primary
    body: {
      fontSize: '0.9375rem',
      fontWeight: '400',
      lineHeight: '1.6',
    },

    // Small text - secondary
    small: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },

    // Tiny text - metadata, timestamps
    tiny: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0.01em',
    },

    // Label text
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      lineHeight: '1.4',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TRANSITIONS & ANIMATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  transition: {
    // Quick interactions (micro-interactions)
    fast: '150ms ease-in-out',

    // Standard transitions (hover, focus, selection)
    normal: '200ms ease-in-out',

    // Slower animations (step changes, progress)
    slow: '300ms ease-in-out',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COMPONENT-SPECIFIC VALUES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  components: {
    button: {
      // Primary button
      primary: {
        bg: '#1D9E75',
        bgHover: '#16a34a',
        bgActive: '#15803d',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '0.9375rem',
        fontWeight: '600',
        transition: '200ms ease-in-out',
        shadow: '0 4px 12px rgba(29,158,117,0.3)',
        shadowHover: '0 6px 20px rgba(29,158,117,0.4)',
      },

      // Secondary button
      secondary: {
        bg: 'transparent',
        border: '2px solid #30363D',
        borderHover: 'rgba(255,255,255,0.2)',
        color: '#f1f5f9',
        colorHover: '#cbd5e1',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '0.9375rem',
        fontWeight: '600',
        transition: '200ms ease-in-out',
      },

      // Ghost button
      ghost: {
        bg: 'transparent',
        bgHover: 'rgba(255,255,255,0.05)',
        color: '#cbd5e1',
        colorHover: '#f1f5f9',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '0.9375rem',
        fontWeight: '600',
        transition: '150ms ease-in-out',
      },

      // Danger button
      danger: {
        bg: '#ef4444',
        bgHover: '#dc2626',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '0.9375rem',
        fontWeight: '600',
        transition: '200ms ease-in-out',
      },
    },

    card: {
      // Unselected card
      default: {
        bg: '#1a1f25',
        border: '1px solid #30363D',
        borderRadius: '12px',
        padding: '20px',
        shadow: 'none',
        transition: '200ms ease-in-out',
      },

      // Hover card
      hover: {
        bg: '#1a1f25',
        border: '1px solid rgba(255,255,255,0.15)',
        shadow: '0 4px 6px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
      },

      // Selected card
      selected: {
        bg: '#1a1f25',
        border: '2px solid #1D9E75',
        shadow: '0 0 0 3px rgba(29,158,117,0.2)',
        borderRadius: '12px',
        padding: '20px',
      },
    },

    input: {
      // Default input
      default: {
        bg: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#f1f5f9',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '0.9375rem',
        transition: '200ms ease-in-out',
      },

      // Focused input
      focus: {
        bg: 'rgba(255,255,255,0.08)',
        border: '2px solid #1D9E75',
        shadow: '0 0 0 3px rgba(29,158,117,0.2)',
        outline: 'none',
      },

      // Error input
      error: {
        border: '2px solid #ef4444',
        shadow: '0 0 0 3px rgba(239,68,68,0.15)',
      },

      // Success input
      success: {
        border: '2px solid #10b981',
        shadow: '0 0 0 3px rgba(16,185,129,0.15)',
      },

      // Disabled input
      disabled: {
        bg: 'rgba(255,255,255,0.02)',
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },

    badge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
    },

    tag: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.8125rem',
      fontWeight: '500',
    },
  },
};

export default tokens;
