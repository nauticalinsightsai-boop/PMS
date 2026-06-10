# Private URL Leakage Monitor

| Pattern | Index expected | Sitemap | Monitoring |
|---------|----------------|---------|------------|
| /checkout | noindex | exclude | GSC coverage weekly |
| /payment | noindex | exclude | manual |
| /checkout/success | noindex | exclude | manual |
| /checkout/cancel | noindex | exclude | manual |
| /admin/* | noindex | exclude | manual |
| session_id= | noindex | exclude | grep AI files |
