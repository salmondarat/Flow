# Pricing Page Redesign Design Document

**Date:** 2026-02-24
**Component:** `components/landing/pricing.tsx`
**Approach:** Glassmorphism Bento Grid (Approach 1)

---

## Overview

Redesign the pricing page to match the main landing page's sophisticated visual style, featuring glassmorphism effects, rich backgrounds, and premium aesthetics.

## Design Goals

1. **Visual Consistency** - Match the hero and services sections' design language
2. **Premium Feel** - Implement glassmorphism, gradients, and depth effects
3. **Maintain Comparability** - Keep plans easy to compare at a glance
4. **Responsive** - Work seamlessly across mobile, tablet, and desktop

---

## Section 1: Overall Structure & Layout

### Desktop Layout (7 columns)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Header Section (span full)                   │
├─────────────────────┬─────────────────────┬─────────────────────┤
│   Starter (3 cols)  │  Professional (3)   │   Enterprise (3)    │
│   - Plan header     │  - Popular badge    │   - Plan header     │
│   - Pricing         │  - Discount         │   - Pricing         │
│   - CTA button      │  - Pricing          │   - CTA button      │
│   - Features list   │  - CTA button       │   - Features list   │
│                     │  - Features list    │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

### Mobile Layout
- Stacked vertically with full-width cards
- Same glassmorphism treatment preserved

### Container Styles
- `max-w-7xl` - Matches other sections
- `px-4 sm:px-6 lg:px-8` - Consistent padding
- `py-16 sm:py-20 lg:py-24` - Vertical spacing
- `relative` - For background effects

---

## Section 2: Background Atmosphere

### Background Layers (z-indexed)

1. **Base layer** (`z-0`)
   - Dark: `bg-zinc-950`
   - Light: `bg-white`
   - Theme-aware via `useTheme()` hook

2. **Background image** (`z-0`, `absolute inset-0`)
   - Dark: `url(/gund_bg.webp)`
   - Light: `url(/gund_bg-white.png)`
   - `opacity-40` - Subtle texture
   - `bg-cover bg-center` - Full coverage
   - Gradient mask: `mask-image: linear-gradient(to bottom, black 60%, transparent 100%)`

3. **Gradient blobs** (`z-0`, `pointer-events-none`)
   - Top-left: `bg-indigo-500/10 blur-3xl` (400x400px)
   - Bottom-right: `bg-purple-500/10 blur-3xl` (400x400px)
   - Animated with subtle pulse effect

4. **Dot pattern** (`z-0`, optional)
   - `radial-gradient(var(--foreground) 1px, transparent 1px)`
   - `opacity-30`
   - `backgroundSize: "32px 32px"`

---

## Section 3: Header Section

### Header Container
- `mb-16` - Margin separation
- `text-center` - Alignment
- Animation: `initial={{ y: 20, opacity: 0 }}` → `whileInView={{ y: 0, opacity: 1 }}`
- `delay: 0.1` - Staggered entrance

### Badge Pill
- `inline-flex items-center gap-2 rounded-full border px-4 py-1.5`
- Glassmorphism: `backdrop-blur-sm bg-white/5` (dark) / `bg-zinc-900/5` (light)
- Border: `border-white/10` (dark) / `border-zinc-900/10` (light)
- Content: Sparkles icon + "Flexible Pricing"
- Text: `text-xs font-medium text-zinc-400` (dark) / `text-zinc-700` (light)

### Main Heading
- Gradient text: `bg-clip-text text-transparent`
- Dark: `bg-linear-to-br from-white via-white to-[#ffcd75]`
- Light: `bg-linear-to-br from-zinc-900 via-zinc-800 to-[#ffcd75]`
- Typography: `text-4xl sm:text-5xl md:text-6xl font-medium tracking-tighter`

### Subheading
- `mt-4 max-w-2xl mx-auto`
- Text: `text-base sm:text-lg`
- Color: `text-zinc-400` (dark) / `text-zinc-600` (light)
- Content: "Choose from tailored packages that fit your business goals. No hidden fees, cancel anytime."

---

## Section 4: Pricing Cards (The Core Bento Grid)

### Card Container
- `relative overflow-hidden rounded-3xl`
- Glassmorphism: `border-white/10 bg-white/5 backdrop-blur-xl` (dark)
- Light mode: `border-zinc-900/10 bg-zinc-900/5 backdrop-blur-xl`
- Hover: `hover:border-white/20 hover:bg-white/10 transition-all duration-300`
- Grid: `lg:col-span-3` for all cards

### Professional Plan (Most Popular)
- Gradient overlay: `after:inset-0 after:bg-gradient-to-b after:from-indigo-500/15 after:to-transparent after:rounded-[inherit] after:blur-[2px]`
- Popular badge: `absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30`

### Icon Circle
- Size: `h-12 w-12`
- Rounded: `rounded-xl`
- Gradient backgrounds:
  - Starter: `from-zinc-700 to-zinc-900` (dark) / `from-zinc-300 to-zinc-500` (light)
  - Professional: `from-indigo-500 to-purple-600`
  - Enterprise: `from-emerald-500 to-teal-600`

### Price Typography
- `text-4xl font-bold`
- Gradient: `bg-clip-text text-transparent from-white to-zinc-400` (dark) / `from-zinc-900 to-zinc-600` (light)
- Professional: Original price `text-sm text-zinc-500 line-through` → `font-semibold text-indigo-400`

### CTA Button
- `rounded-full px-6 py-3`
- Starter/Enterprise: `border border-white/20 bg-white/10 text-white hover:bg-white/20`
- Professional: `bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02]`

---

## Section 5: Features List

### Features Container
- `mt-6 space-y-3`
- Scrollable: `max-h-[400px] overflow-y-auto`

### Feature Item
```tsx
<div className="flex items-start gap-3">
  <div className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-white/10">
    <CheckIcon className="h-4 w-4 text-green-500" />
  </div>
  <span className="text-sm text-zinc-300">{label}</span>
</div>
```

### Text Styling
- Label: `text-sm font-medium text-zinc-300` (dark) / `text-zinc-700` (light)
- Value (string): `text-xs text-indigo-400` (dark) / `text-indigo-600` (light)
- Leading: `leading-relaxed`

### Feature Counts
- Starter: 8 features shown, "and more..." indicator
- Professional: 12 features shown, "and more..." indicator
- Enterprise: All 18 features

---

## Section 6: CTA Section

### CTA Container
- `relative mt-16 max-w-3xl mx-auto`
- Glassmorphism: `border-white/10 bg-white/5 backdrop-blur-xl` (dark) / `border-zinc-900/10 bg-zinc-900/5` (light)
- Rounded: `rounded-3xl`
- Padding: `p-8 sm:p-12`
- Animation: `delay: 0.6`

### CTA Button
- `inline-flex items-center gap-2 rounded-full px-8 py-4`
- Background: `bg-gradient-to-r from-indigo-500 to-purple-600`
- Text: `text-sm font-semibold text-white`
- Effects: `shadow-lg shadow-indigo-500/30 hover:scale-[1.02] hover:shadow-indigo-500/50 transition-all`
- Icon: ArrowRight with `hover:translate-x-1`

---

## Animations

### Entrance Animation (framer-motion)
```tsx
initial={{ y: 20, opacity: 0 }}
whileInView={{ y: 0, opacity: 1 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}
```

### Staggered Delays
- Header: `delay: 0.1`
- Cards: `delay: 0.2`, `delay: 0.3`, `delay: 0.4`
- CTA: `delay: 0.6`

### Hover Effects
- Cards: `hover:scale-[1.01]`
- Buttons: `hover:scale-[1.02] active:scale-[0.98]`
- Icons: `hover:-translate-y-1`

---

## Technical Implementation Notes

### Dependencies
- `framer-motion` - Animations
- `lucide-react` - Icons (Shield, Users, Rocket, CheckIcon, ArrowRight, Sparkles)
- `next-themes` - Theme detection (already in use)

### Theme Support
- All styling must support both dark and light modes
- Use `useTheme()` hook for conditional styles
- Ensure proper contrast ratios in both modes

### Responsive Breakpoints
- Mobile: Default styles
- Tablet: `sm:` prefixes
- Desktop: `md:` and `lg:` prefixes

---

## Success Criteria

- ✅ Visual consistency with hero.tsx and services.tsx
- ✅ All three pricing tiers are easily comparable
- ✅ Responsive design works on all screen sizes
- ✅ Dark/light mode support
- ✅ Smooth animations without performance issues
- ✅ Accessibility (WCAG AA contrast ratios)
