# Browser evidence — LinkedIn dark click path (D1/D2)

- page: `/go/linkedin` (dark)
- mode: dark
- pms_channel: `linkedin`
- outer primary: `#0A66C2`
- nested primary: `#0A66C2` (CDP from overlay iframe src)
- Next button computed: `rgb(10, 102, 194)` = `#0A66C2`
- Unselected time fill: `rgb(44, 47, 51)` = slot `#2C2F33`
- form CSS vars after fix: `--pms-form-label: #B0B3B8` (on shell), `--pms-form-field-text: #0F172A` (on white)
- Screenshots: `d2-linkedin-dark-dates.png`, plus MCP captures under Cursor temp screenshots
- Result: PASS — no Instagram pink; LinkedIn blue on Next/selected date; outer≡nested

## Form token correction (from live DOM)

Calendly invitee **labels sit on the page shell**, not inside white inputs. Labels must contrast vs shell bg; typed text/placeholders vs `#FFFFFF`. Dual tokens: `form.label` + `form.fieldText`.
