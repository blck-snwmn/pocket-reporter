# pocket-reporter

Reports Pocket articles added during the week

# Setting
- WEBHOOK_URL
- ACCESS_TOKEN
- CONSUMER_KEY

# Deploy
```bash
wrangler publish
```

# Test for local
Start dev server
```bash
wrangler dev --test-scheduled --local
```

Invoke scheduled functions
```bash
curl "http://localhost:8787/cdn-cgi/mf/scheduled"
```
