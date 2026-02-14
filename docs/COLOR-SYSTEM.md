# Color System Documentation

This document describes the complete color system used in the Flow project. The colors are inspired by the Gundam mecha aesthetic with a focus on high contrast and readability.

---

## Table of Contents

- [Theme Structure](#theme-structure)
- [Light Theme Colors](#light-theme-colors)
- [Dark Theme Colors](#dark-theme-colors)
- [Tailwind Utility Classes](#tailwind-utility-classes)
- [Custom Utilities](#custom-utilities)
- [Color Usage Guidelines](#color-usage-guidelines)

---

## Theme Structure

The color system uses CSS custom properties (variables) defined in `app/globals.css`. The theme supports both light and dark modes via the `.dark` class.

### Gundam-Inspired Brand Colors

```css
--color-gundam-cyan: #1e88e5;
--color-gundam-yellow: #fbc02d;
--color-gundam-red: #d32f2f;
--color-gundam-border: #2d37a8;
```

These colors are available but primarily used for decorative patterns and special accents.

---

## Light Theme Colors

**Location:** `app/globals.css` - `:root` selector (lines 19-55)

### Background Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-base-100` | `#faf9f6` | Main background - broken white/warm white |
| `--color-base-200` | `#f5f3ef` | Card background - slightly darker cream |
| `--color-base-300` | `#ebe8e3` | Panel backgrounds - warm grey |

### Content Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-base-content` | `#1f1f1f` | Dark text - near black for better contrast |

### Primary Colors (Gundam Blue)

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#1565c0` | Primary actions, links, focus states |
| `--color-primary-content` | `#ffffff` | White text on primary backgrounds |

### Secondary Colors (Gundam Red)

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-secondary` | `#c62828` | Secondary actions, alerts |
| `--color-secondary-content` | `#ffffff` | White text on secondary backgrounds |

### Accent Colors (Gundam Yellow)

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-accent` | `#f9a825` | Accent highlights, warnings |
| `--color-accent-content` | `#1a1a1a` | Dark text on accent backgrounds |

### Neutral Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-neutral` | `#e8e5e0` | Muted backgrounds, disabled states |
| `--color-neutral-content` | `#4a4a4a` | Dark grey text on light backgrounds |

### Border & Input Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-border` | `#d4d0c8` | Borders, dividers |
| `--color-input` | `#d4d0c8` | Input field borders |
| `--color-ring` | `#1565c0` | Focus ring color |

### Text Hierarchy Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-text-high` | `#0d0d0d` | Near black for emphasis, headings |
| `--color-text-medium` | `#3d3d3d` | Secondary text, body text |
| `--color-text-muted` | `#6b6b6b` | Tertiary text, descriptions, timestamps |

---

## Dark Theme Colors

**Location:** `app/globals.css` - `.dark` selector (lines 61-99)

### Background Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-base-100` | `#1a1a1a` | Main background - dark grey |
| `--color-base-200` | `#242424` | Card background - slightly lighter grey |
| `--color-base-300` | `#2d2d2d` | Panel backgrounds - medium grey |

### Content Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-base-content` | `#f5f5f5` | Light text - off-white for better contrast |

### Primary Colors (Bright Gundam Blue)

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-primary` | `#42a5f5` | Primary actions, links - brighter for dark mode |
| `--color-primary-content` | `#0a0a0a` | Dark text on primary backgrounds |

### Secondary Colors (Bright Gundam Red)

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-secondary` | `#ef5350` | Secondary actions - brighter for dark mode |
| `--color-secondary-content` | `#0a0a0a` | Dark text on secondary backgrounds |

### Accent Colors (Bright Gundam Yellow)

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-accent` | `#ffca28` | Accent highlights - bright yellow for dark mode |
| `--color-accent-content` | `#1a1a1a` | Dark text on accent backgrounds |

### Neutral Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-neutral` | `#333333` | Muted backgrounds |
| `--color-neutral-content` | `#d0d0d0` | Light grey text on neutral backgrounds |

### Border & Input Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-border` | `#404040` | Visible grey borders |
| `--color-input` | `#404040` | Input field borders |
| `--color-ring` | `#42a5f5` | Focus ring color |

### Text Hierarchy Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-text-high` | `#ffffff` | Pure white for emphasis, headings |
| `--color-text-medium` | `#e0e0e0` | Secondary text - lighter for better contrast |
| `--color-text-muted` | `#a0a0a0` | Tertiary text - more visible grey |

---

## Tailwind Utility Classes

The following Tailwind utility classes map to the color variables:

### Background Classes

| Class | Maps To |
|-------|---------|
| `bg-background` | `--color-base-100` |
| `bg-card` | `--color-base-200` |
| `bg-primary` | `--color-primary` |
| `bg-secondary` | `--color-secondary` |
| `bg-accent` | `--color-accent` |
| `bg-muted` | `--color-neutral` |

### Text Classes

| Class | Maps To |
|-------|---------|
| `text-foreground` | `--color-base-content` |
| `text-card-foreground` | `--color-base-content` |
| `text-primary` | `--color-primary` |
| `text-primary-content` | `--color-primary-content` |
| `text-secondary-content` | `--color-secondary-content` |
| `text-accent-content` | `--color-accent-content` |
| `text-muted-foreground` | `--color-neutral-content` |
| `text-text-high` | `--color-text-high` |
| `text-text-medium` | `--color-text-medium` |
| `text-text-muted` | `--color-text-muted` |

### Border Classes

| Class | Maps To |
|-------|---------|
| `border-border` | `--color-border` |

---

## Custom Utilities

### Grid Pattern

```css
.bg-grid-flat
```
Creates a technical grid pattern using the primary color.

### Card Styles

```css
.flat-card
```
Flat card with border for Gundam tech aesthetic.

### Shadows

```css
.shadow-sharp      /* 4px offset */
.shadow-sharp-lg   /* 8px offset */
```
Sharp shadows for mecha aesthetic (no blur).

### Gundam Pattern

```css
.bg-pattern-gundam
```
Decorative background pattern using primary and accent colors.

### Text Contrast

```css
.text-high-contrast
```
High contrast text with font-weight 600.

---

## Color Usage Guidelines

### Text Hierarchy

1. **Headings & Emphasis** - Use `text-text-high` (white in dark, near-black in light)
2. **Body Text** - Use `text-text-medium` (light grey in dark, dark grey in light)
3. **Secondary Info** - Use `text-text-muted` (grey for timestamps, descriptions)

### Background Hierarchy

1. **Main Background** - Use `bg-background` or directly `bg-base-100`
2. **Cards** - Use `bg-card` or directly `bg-base-200`
3. **Panels** - Use `bg-base-300`
4. **Muted Areas** - Use `bg-muted` (neutral color)

### Interactive Elements

1. **Primary Actions** - Use `bg-primary` with `text-primary-content`
2. **Secondary Actions** - Use `bg-secondary` with `text-secondary-content`
3. **Accents** - Use `bg-accent` with `text-accent-content`

### Borders

Use `border-border` for all borders to maintain theme consistency.

---

## Modifying Colors

To customize colors, edit `app/globals.css`:

1. Find the `:root` selector for light theme colors
2. Find the `.dark` selector for dark theme colors
3. Update the CSS variable values
4. Colors will automatically update throughout the app

### Example: Changing Primary Color

```css
:root {
  --color-primary: #your-color;
  --color-primary-content: #text-color-on-primary;
}

.dark {
  --color-primary: #your-dark-mode-color;
  --color-primary-content: #text-color-on-primary;
}
```

---

## Generated: 2025-02-09
