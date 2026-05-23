# PM Structure — Brand Visual System (repo copy)

Source of truth for design tokens in code: `frontend/lib/brand-visual.ts` and `frontend/app/globals.css`.

## Logo gradients (website implementation)

| Name | CSS | Use |
|------|-----|-----|
| Orange-Red | `90deg, #ff4a38 → #ff884a` | CTAs, primary buttons, logo tile |
| Blue-Purple | `90deg, #2851b9 → #bc6ae2` | PMI pathways, advisory accents |
| Blue-Cyan | `180deg, #0859b3 → #57d5e2` | PRINCE2 / governance flows |
| Cover | `90deg, #696FF7 → #EF67CA` | Hero bands, campaign headers |
| Charcoal | `180deg, #262A33 → #434855` | Six Sigma / governance panels |

## Neutrals

- Navy text/background: `#0B0B2A`
- Charcoal text: `#262A33`
- Surface: `#F7F7FA`
- Divider: `#E6E7EF`
- White: `#FFFFFF`

## Typography

**Montserrat** — headings and body (per locked visual system).

## Utilities (Tailwind)

- `bg-pms-gradient-orange` / `blue-purple` / `blue-cyan` / `cover`
- `text-pms-gradient-orange` (gradient text)
- `bg-brand-orange` maps to orange gradient for buttons

Full specification: see original `PM_STRUCTURE_BRAND_VISUAL_SYSTEM.md` in brand assets folder.
