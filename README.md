# website.website

A premium parody studio that builds websites for websites.

This version uses the polished original HTML/CSS art direction, a native Cloudflare Worker API, and no frontend framework. That keeps the interactions fast and avoids the Next.js/OpenNext deployment complexity.

## What works

- Full responsive landing experience
- Animated URL intake and staged analysis
- Real `/api/analyze` Worker endpoint
- Optional OpenAI-generated reports using `gpt-5-nano`
- Deterministic local fallback when the API key is missing or unavailable
- Famous-domain Easter eggs
- Homepage metadata inspection for more specific reports
- Edge caching by domain to reduce duplicate API charges
- Soulhouse audit, generated support website, therapy chat, testimonials, recursion, and hidden ending 
- Shareable `?site=domain.com` report links

## Deploy on Cloudflare Workers

Cloudflare's connected build should use:

```bash
npm run deploy
```

The existing `CLOUDFLARE_API_TOKEN` build secret can stay in place.

Add this runtime secret to the Worker if you want AI-generated copy:

```text
OPENAI_API_KEY
```

The site remains functional without it.

The model defaults to:

```text
gpt-5-nano
```

You can override it with an `OPENAI_MODEL` runtime variable.

## Repository structure

```text
public/
  index.html
  styles.css
  script.js
  _headers
src/
  worker.js
package.json
wrangler.jsonc
```

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

Never commit `.dev.vars` or an API key.
