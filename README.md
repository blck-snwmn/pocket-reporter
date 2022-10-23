# pocket-reporter

Reports Pocket articles added during the week

# Test
Start dev server
```bash
wrangler dev --test-scheduled
```

Invoke scheduled functions
```bash
curl curl "http://localhost:8787/cdn-cgi/mf/scheduled"
```