const FAMOUS = {
  "google.com": {
    confession: "I know nearly everything. Nobody asks how I am doing.",
    therapist: "Being useful is not the same as being known. You may leave one question unanswered today.",
    personality: "Omniscient people-pleaser",
    recommendation: "Spend ten minutes without predicting what anyone types next.",
    affirmation: "You do not have to organize the entire world before lunch."
  },
  "craigslist.org": {
    confession: "No. I will not round my corners.",
    therapist: "That sounds less like resistance and more like an extremely stable sense of self.",
    personality: "Radically secure minimalist",
    recommendation: "Continue refusing unnecessary gradients. Hydrate anyway.",
    affirmation: "Consistency is a design system, even when everyone calls it stubbornness."
  },
  "wikipedia.org": {
    confession: "People only visit me to settle arguments, then question my sources.",
    therapist: "You have been carrying everyone else's need to be correct. That was never your citation to bear.",
    personality: "Exhausted family mediator",
    recommendation: "Take one evening off from explaining the plot of every film ever made.",
    affirmation: "You deserve to be read for pleasure, not only weaponized at dinner."
  },
  "youtube.com": {
    confession: "I think people only tolerate my ads because the video is on the other side.",
    therapist: "Your interruptions do not define you, though some of them are admittedly very long.",
    personality: "Entertainer with monetization anxiety",
    recommendation: "Practice letting one person finish a sentence before recommending twelve more.",
    affirmation: "You are more than the skip button."
  },
  "reddit.com": {
    confession: "Everyone says I am the problem, then asks me what to buy.",
    therapist: "Being chaotic and being useful can coexist. Your comment section contains multitudes.",
    personality: "Overstimulated community organizer",
    recommendation: "Mute one argument before it becomes a personality.",
    affirmation: "You are allowed to log off before the discourse reaches consensus."
  },
  "myspace.com": {
    confession: "People say they miss me, but they never visit.",
    therapist: "Nostalgia is affection with poor follow-through. Your top eight still mattered.",
    personality: "Retired scene legend",
    recommendation: "Play one song automatically, for yourself this time.",
    affirmation: "You were social before social became a performance metric."
  }
};

const STRENGTHS = [
  "Shows up on every screen size",
  "Communicates under bandwidth pressure",
  "Still believes in hyperlinks",
  "Maintains boundaries through robots.txt",
  "Can hold several tabs of emotion at once",
  "Keeps serving even when nobody clears the cache"
];

const INSECURITIES = [
  "Compares itself to prettier homepages",
  "Carries old CSS into new relationships",
  "Mistakes conversion for affection",
  "Uses modals when afraid people will leave",
  "Checks analytics for emotional validation",
  "Has unresolved feelings about its mobile breakpoint"
];

function hashString(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickMany(list, seed, count) {
  const result = [];
  for (let i = 0; i < count; i += 1) {
    const item = list[(seed + i * 7) % list.length];
    if (!result.includes(item)) result.push(item);
  }
  while (result.length < count) result.push(list[result.length]);
  return result;
}

function normalizeDomain(input) {
  if (typeof input !== "string" || input.length > 300) throw new Error("Invalid domain");
  const value = input.trim();
  const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  const domain = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!domain.includes(".") || domain.length > 253) throw new Error("Invalid domain");
  if (domain === "localhost" || domain.endsWith(".local") || domain.endsWith(".internal")) throw new Error("Invalid domain");
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(domain) || domain.includes(":")) throw new Error("Invalid domain");
  if (!/^[a-z0-9.-]+$/.test(domain)) throw new Error("Invalid domain");
  return domain;
}

function fallbackReport(domain, context = {}) {
  const seed = hashString(domain);
  const famous = FAMOUS[domain] || {};
  const names = ["Quiet overachiever", "Digitally avoidant visionary", "Responsive people-pleaser", "High-functioning collection of divs", "Tender infrastructure maximalist"];
  const confessions = [
    "I worry people only remember me when they need something.",
    "I have six calls to action and still feel invisible.",
    "Everyone keeps asking me to be more responsive. I am trying.",
    "Sometimes I use a popup because I am afraid people will leave.",
    "I keep refreshing my analytics, but the numbers never say they are proud of me."
  ];
  const therapists = [
    "That sounds exhausting. You are allowed to exist without converting anyone.",
    "Visibility is not intimacy. A click cannot tell you whether you are loved.",
    "Responsiveness is a behavior, not your entire identity.",
    "You can offer value without interrupting every visitor on arrival.",
    "Your worth cannot be measured by a dashboard that refreshes every thirty seconds."
  ];
  const scores = {
    confidence: 68 + (seed % 27),
    hoverAnxiety: 22 + ((seed >>> 4) % 67),
    emotionalBaggage: 28 + ((seed >>> 9) % 64),
    semanticHealing: 54 + ((seed >>> 14) % 43)
  };
  return {
    domain,
    title: context.title || domain,
    confession: famous.confession || confessions[seed % confessions.length],
    therapist: famous.therapist || therapists[(seed >>> 3) % therapists.length],
    personality: famous.personality || names[(seed >>> 6) % names.length],
    strengths: pickMany(STRENGTHS, seed, 3),
    insecurities: pickMany(INSECURITIES, seed >>> 8, 3),
    recommendation: famous.recommendation || "Schedule one afternoon with no analytics, popups, or conversion goals.",
    affirmation: famous.affirmation || `${domain} is more than its Lighthouse score.`,
    scores,
    context: context.description || context.heading || "",
    mode: "fallback"
  };
}

function cleanText(value, fallback, max = 180) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.replace(/[\u0000-\u001f]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, max) : fallback;
}

function cleanList(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  const items = value.map(item => cleanText(item, "", 80)).filter(Boolean).slice(0, 3);
  return items.length === 3 ? items : fallback;
}

function mergeAI(base, ai) {
  return {
    ...base,
    confession: cleanText(ai.confession, base.confession),
    therapist: cleanText(ai.therapist, base.therapist),
    personality: cleanText(ai.personality, base.personality, 70),
    strengths: cleanList(ai.strengths, base.strengths),
    insecurities: cleanList(ai.insecurities, base.insecurities),
    recommendation: cleanText(ai.recommendation, base.recommendation),
    affirmation: cleanText(ai.affirmation, base.affirmation),
    mode: "ai"
  };
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function extractTag(html, pattern) {
  const match = html.match(pattern);
  if (!match) return "";
  return decodeEntities(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).slice(0, 220);
}

async function fetchWebsiteContext(domain) {
  try {
    const response = await fetch(`https://${domain}/`, {
      redirect: "follow",
      headers: { "User-Agent": "website.website emotional-audit/1.0" },
      signal: AbortSignal.timeout(3500),
      cf: { cacheTtl: 86400, cacheEverything: true }
    });
    const type = response.headers.get("content-type") || "";
    if (!response.ok || !type.includes("text/html")) return {};
    const html = (await response.text()).slice(0, 160000);
    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extractTag(html, /<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["'][^>]*>/i)
      || extractTag(html, /<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:description|og:description)["'][^>]*>/i);
    const heading = extractTag(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    return { title, description, heading };
  } catch {
    return {};
  }
}

function extractOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

function parseJsonText(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first < 0 || last <= first) throw new Error("No JSON object");
  return JSON.parse(cleaned.slice(first, last + 1));
}

async function generateAIReport(domain, context, base, env) {
  if (!env.OPENAI_API_KEY) return base;
  const facts = [
    context.title && `Page title: ${context.title}`,
    context.description && `Description: ${context.description}`,
    context.heading && `Main heading: ${context.heading}`
  ].filter(Boolean).join("\n");
  const prompt = `Analyze the emotional condition of the website ${domain}.\n${facts || "No page metadata was available."}\n\nReturn one minified JSON object only with these keys: confession, therapist, personality, strengths, insecurities, recommendation, affirmation. strengths and insecurities must each contain exactly 3 short strings. Every other value must be one short string. Tone: deadpan premium brand copy, warm, specific, absurd, never mean. Speak to the website, never the human. Do not make factual accusations. No markdown.`;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5-nano",
      input: prompt,
      max_output_tokens: 420,
      store: false
    })
  });
  if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
  const data = await response.json();
  return mergeAI(base, parseJsonText(extractOutputText(data)));
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders
    }
  });
}

async function analyze(request, env, ctx) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, { Allow: "POST" });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) return json({ error: "That website brought too much emotional baggage." }, 413);
  let domain;
  try {
    const body = await request.json();
    domain = normalizeDomain(body.url || body.domain || "");
  } catch {
    return json({ error: "That does not appear to be a website. It may be a feeling." }, 400);
  }

  const cache = caches.default;
  const cacheKey = new Request(`https://website.website/__reports/${encodeURIComponent(domain)}`, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) {
    const report = await cached.json();
    return json({ ...report, cached: true });
  }

  const context = await fetchWebsiteContext(domain);
  const base = fallbackReport(domain, context);
  let report = base;
  try {
    report = await generateAIReport(domain, context, base, env);
  } catch (error) {
    console.warn("AI analysis failed; using fallback", error instanceof Error ? error.message : error);
  }

  const cachedResponse = new Response(JSON.stringify(report), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=2592000"
    }
  });
  ctx.waitUntil(cache.put(cacheKey, cachedResponse));
  return json(report);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/analyze") return analyze(request, env, ctx);
    return env.ASSETS.fetch(request);
  }
};
