# @pms/ui

Shared design tokens and utilities for `@pms/frontend` and `@pms/dashboard-frontend`.

## Class → token mapping (legacy dashboard)

| Legacy class | Replacement |
|--------------|-------------|
| `r-card`, `r-card-sm` | `rounded-* border border-border bg-card` |
| `r-input` | `Input` component / `border-input bg-background` |
| `text-body`, `text-body-sm` | `text-sm` / `text-xs text-muted-foreground` |
| `brand-muted`, `brand-surface` | `text-muted-foreground` / `bg-muted` |
| `bg-brand-*-bg` | Toast semantic utilities in globals |
| `z-modal-toast` | z-index 100 |
| `gw-*` | Maps to shadcn `--background`, `--primary`, etc. |

Import styles: `@import "@pms/ui/globals.css";` in app `globals.css`.

## Package exports

| Export | Description |
|--------|-------------|
| `@pms/ui/globals.css` | Shared design tokens and utilities |
| `@pms/ui/fonts` | Montserrat `next/font` setup |
| `@pms/ui/utils` | `cn()` helper |
| `@pms/ui/button` | shadcn Button + `brand` / `brandOutline` |
| `@pms/ui/stat-chip` | Marketing-style stat chip |
| `@pms/ui/alert-dialog` | Accessible confirm dialogs |
| `@pms/ui/glass-card` | Glass surface card |
| `@pms/ui/cta-button` | Rounded CTA button |
