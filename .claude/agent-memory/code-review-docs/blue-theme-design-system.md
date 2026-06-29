---
name: blue-theme-design-system
description: Blue theme color palette, CSS custom properties, card color system, and key visual conventions
metadata:
  type: project
---

## Blue Theme Design System (2026-06-29)

The project underwent a major visual redesign from coral/warm to blue theme. All UI colors now use a cold-blue spectrum.

### CSS Custom Properties (`@theme inline` in globals.css)

- `--color-accent`: `#4A90D9` (primary blue)
- `--color-accent-hover`: `#3A7BC8`
- `--color-accent-light`: `#EBF3FC`
- `--color-secondary`: `#6C8EBF` (steel blue)
- `--color-text-primary`: `#1a2332` (dark blue-gray)
- `--color-bg-primary`: `#f0f4f8` (cool off-white)
- Full table in CLAUDE.md Design System section.

### Card Color System

7-color blue palette cycled by `post.id % 7`:
`#4A90D9`, `#5B8DEF`, `#6C8EBF`, `#3D7AB5`, `#7EB8DA`, `#A0C4E8`, `#89B4D9`

Cards now show **date + title only** (article preview removed). Each card has:
- Color bar at top (h-1.5, expands to h-2 on hover)
- Emoji tag (absolute top-right)
- Three decorative dots at bottom
- Hover: `scale(1.03)` + `translateY(-6px)` + blue glow shadow
- `rounded-3xl` (was rounded-2xl)

### Key Conventions

- All modals: `rounded-3xl`, `shadow-2xl`, spring animation
- Buttons: `rounded-full` pills, `btn-primary` with blue shadow
- Background: `#f0f4f8` with blue dot grid (radial-gradient, 24px)
- User avatar: `from-[#4A90D9] to-[#5B8DEF]` gradient
- Error/delete colors remain independent red system (`#e0556a`)

### Warm-toned carryovers (minor inconsistency)

Modal footers still use warm-toned grays that slightly clash:
- `bg-[#fafaf9]` for footer areas
- `hover:bg-[#f5f5f5]` for close buttons  
- `border-[#f0f0f0]` for borders
These should ideally be updated to cool-toned equivalents but are low priority.
