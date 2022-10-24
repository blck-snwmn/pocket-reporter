# pocket-reporter

Reports Pocket articles added during the week

# Deploy
```bash
wrangler publish
```

# Test for local
Start dev server
```bash
wrangler dev --test-scheduled
```

Invoke scheduled functions
```bash
curl "http://localhost:8787/cdn-cgi/mf/scheduled"
```
