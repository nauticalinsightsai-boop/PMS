# Calendly user feedback pack (4 links only)

After agent automation passed (matrix + theme audit + browser evidence). Open each link on **http://localhost:3050** (or your deployed host). Answer yes/no.

## 1. LinkedIn portal (dark, then light once)

- URL: [/go/linkedin](http://localhost:3050/go/linkedin)
- Expected primary: `#0A66C2`
- Steps: Dark mode → **Reserve Your Session** → pick a date → pick a time → **Next** → check Name/Email. Then toggle **Light mode** and open again once.

| # | Question | Y/N |
|---|----------|-----|
| 1 | Popup matches LinkedIn page (blue, not Instagram pink / Snapchat yellow)? | |
| 2 | Unselected dates readable (dark fills in dark mode)? | |
| 3 | Times + Next use LinkedIn blue? | |
| 4 | Name/Email labels readable; typed text readable on white fields? | |
| 5 | Anything else wrong? (note below) | |

Notes:

---

## 2. Instagram portal (dark)

- URL: [/go/instagram](http://localhost:3050/go/instagram)
- Expected primary: `#E4405F`
- Steps: Dark → open free tier Calendly → date → time → Next → form.

| # | Question | Y/N |
|---|----------|-----|
| 1 | Popup matches Instagram page (pink/magenta primary)? | |
| 2 | Dates look correct for dark Instagram? | |
| 3 | Times + Next use Instagram primary? | |
| 4 | Name/Email readable? | |
| 5 | Anything else wrong? | |

Notes:

---

## 3. Snapchat portal (dark)

- URL: [/go/snapchat](http://localhost:3050/go/snapchat)
- Expected primary: `#FFFC00`
- Steps: Dark → open free tier → date → time → Next → form.

| # | Question | Y/N |
|---|----------|-----|
| 1 | Popup matches Snapchat (yellow primary, not LinkedIn blue)? | |
| 2 | Dates readable on dark Snapchat? | |
| 3 | Times + Next use Snapchat yellow? | |
| 4 | Name/Email readable? | |
| 5 | Anything else wrong? | |

Notes:

---

## 4. Home marketing Calendly (website chrome)

- URL: [/](http://localhost:3050/)
- Expected: **website** primary (not a `/go` social brand)
- Steps: Open a hero / mentor Calendly CTA → date → time → Next → form.

| # | Question | Y/N |
|---|----------|-----|
| 1 | Popup uses website theme (not LinkedIn/Instagram/Snapchat)? | |
| 2 | Dates look correct? | |
| 3 | Times + Next match website primary? | |
| 4 | Name/Email readable? | |
| 5 | Anything else wrong? | |

Notes:

---

That is the full user exercise. Automation already covered all 41 published slugs × light/dark encoding.
