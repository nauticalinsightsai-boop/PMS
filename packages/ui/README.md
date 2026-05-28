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
