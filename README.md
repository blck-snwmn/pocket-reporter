# pocket-reporter

Reports Pocket articles added during the week

# Setting
Set the following as environment variables.
|Key|Description|
|--|--|
|WEBHOOK_URL|Slack webhook url|
|ACCESS_TOKEN|Pocket access token|
|CONSUMER_KEY|Pocket consumer key|

```bash
wrangler secret put WEBHOOK_URL your_value1
wrangler secret put ACCESS_TOKEN your_value2
wrangler secret put CONSUMER_KEY your_value3
```

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
