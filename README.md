# website.website

A polished parody SaaS that builds emotional-support websites for websites.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app works without an API key using deterministic local reports. Add an OpenAI key to enable custom AI copy.

## Test in the Cloudflare runtime

```bash
npm run preview
```

This builds through the Cloudflare OpenNext adapter and runs under the local Workers runtime rather than Node.js.

## Deploy to Cloudflare Workers

### GitHub dashboard method

1. Push this repository to GitHub.
2. In Cloudflare, open **Workers & Pages** and choose **Create application**.
3. Choose **Import a repository** and select this repository.
4. Set the deploy command to:

```bash
npm run deploy
```

5. Add `OPENAI_API_KEY` as a secret and optionally add `OPENAI_MODEL` as a variable under the Worker's settings.
6. Deploy. Cloudflare will provide a `workers.dev` URL, and you can attach a custom domain later.

### Command-line method

```bash
npm install
npx wrangler login
npm run deploy
```

## Environment variables

- `OPENAI_API_KEY` — optional. The site works without it.
- `OPENAI_MODEL` — optional. Defaults to `gpt-5.6-luna`.

For production, add the API key as a Cloudflare **secret**, not as a public `NEXT_PUBLIC_...` variable.

## Cost controls

- Requests use a tiny structured response with a 260-token output ceiling.
- Repeat domains are cached while a Worker isolate remains warm.
- Famous domains and all API failures have polished local fallbacks.
- The complete experience still works at $0 API spend.
- Set a separate OpenAI project budget of $5 and usage alerts in the OpenAI dashboard.

## Cloudflare files

- `wrangler.jsonc` configures the Worker, static assets, compatibility date, and Node.js compatibility.
- `open-next.config.ts` configures the Cloudflare OpenNext adapter.
- `npm run preview` tests locally in the Workers runtime.
- `npm run deploy` builds and deploys to Cloudflare Workers.
