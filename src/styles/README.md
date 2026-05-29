# Styles Guide — M3allem Project

## Files in this folder

| File | Purpose |
|------|---------|
| `variables.css` | **Single source of truth** — all CSS custom properties (design tokens) |
| `styles.css` | Global base styles — imports `variables.css`, sets resets + utilities |

## How to use

### In `angular.json`
```json
"styles": [
  "src/styles/styles.css"
]
```
That's it. **Do NOT add `variables.css` separately** — it's already imported inside `styles.css`.

### In component stylesheets
```css
/* ✅ CORRECT — use the variables */
.my-button {
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  font-weight: var(--font-semibold);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-color);
}

/* ❌ WRONG — hardcoded values */
.my-button {
  background-color: #1b2b6e;
  border-radius: 6px;
  padding: 8px 16px;
}
```

## Color Quick Reference

### Brand
| Token | Value | Use for |
|-------|-------|---------|
| `--color-primary` | `#1B2B6E` Navy | Buttons, links, nav, headings |
| `--color-accent` | `#FFB400` Gold | CTAs, highlights, active states |

### Text
| Token | Use for |
|-------|---------|
| `--text-primary` | Headings, labels |
| `--text-body` | Paragraphs |
| `--text-secondary` | Captions, hints |
| `--text-inverse` | Text on dark/primary backgrounds |

### Tier Badges
| Token | Tier |
|-------|------|
| `--color-tier-bronze` | Bronze workers |
| `--color-tier-silver` | Silver workers |
| `--color-tier-gold` | Gold workers |
| `--color-tier-master` | Master workers |

## Rules for All Engineers

1. **Never hardcode a color, spacing value, or font size** — always use a token
2. **Never import `variables.css` inside a component** — it's globally available
3. **Never use `!important`** except in the utility classes already defined in `styles.css`
4. **Use semantic tokens** (`--color-primary`) not scale tokens (`--color-primary-700`) in components
5. **Spacing must follow the 4px grid** — use `--space-*` variables
