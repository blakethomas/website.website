# website.website

A polished parody SaaS that builds emotional support websites for websites.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app works without an API key using deterministic local reports. Add an OpenAI key to enable custom AI copy.

## Budget controls

- Uses `gpt-5.6-luna` by default (override with `OPENAI_MODEL`).
- Maximum 260 output tokens per uncached analysis.
- One request per domain per warm server instance via server-side cache.
- Famous domains and all API failures have high-quality local fallbacks.
- Set a $5 monthly project budget and notification threshold in the OpenAI dashboard; application code cannot guarantee an account-level hard billing cap.

For durable caching in production, replace the in-memory Map with Vercel KV, Upstash Redis, or Supabase.

## Deploy

Push to GitHub, import the repository into Vercel, and add `OPENAI_API_KEY` and `OPENAI_MODEL` under Project Settings → Environment Variables.
