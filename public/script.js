const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const state = {
  domain: "yourwebsite.com",
  recursionDepth: 1,
  testimonial: 0,
  report: null,
  analysisController: null
};

const localProfiles = [
  {
    confession: "I didn’t know websites were allowed to want things.",
    therapist: "You are allowed to want something that cannot be measured in conversions.",
    personality: "Quietly ambitious collection of divs",
    affirmation: "You are allowed to load at your own pace."
  },
  {
    confession: "Sometimes I use a modal because I’m afraid people will leave.",
    therapist: "Interruption is not intimacy. Visitors can choose you without being trapped.",
    personality: "Attachment-anxious conversion optimizer",
    affirmation: "You do not need a popup to be worthy of attention."
  },
  {
    confession: "I have six calls to action and still feel invisible.",
    therapist: "Being clickable is not the same as being seen.",
    personality: "High-performing validation seeker",
    affirmation: "Your value is not measured in button clicks."
  },
  {
    confession: "Everyone keeps asking me to be more responsive. I’m trying.",
    therapist: "Responsiveness is a skill, not your entire identity.",
    personality: "Viewport-sensitive people-pleaser",
    affirmation: "You are emotionally responsive at every breakpoint."
  }
];

const analysisLines = [
  "Listening for unresolved hover states…",
  "Reviewing its relationship with whitespace…",
  "Measuring dependency on external validation…",
  "Identifying buttons that fear commitment…",
  "Checking whether the footer feels abandoned…",
  "Compressing inherited insecurities…"
];

const testimonials = [
  { quote: "Before this, nobody asked how I was doing.", name: "Google", role: "Website, internet", logo: "G", color: "#4285f4" },
  { quote: "I finally feel seen. I will not be changing my layout.", name: "Craigslist", role: "Website, resilient", logo: "C", color: "#6944aa" },
  { quote: "My website’s website increased my confidence by 312%.", name: "Shopify", role: "Website, commerce", logo: "S", color: "#75a943" },
  { quote: "They helped me understand that buffering is a boundary.", name: "Netflix", role: "Website, streaming", logo: "N", color: "#e50914" }
];

function cleanDomain(value) {
  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const domain = new URL(normalized).hostname.replace(/^www\./, "").toLowerCase();
    if (!domain.includes(".") || !/^[a-z0-9.-]+$/.test(domain)) return null;
    return domain;
  } catch {
    return null;
  }
}

function supportDomain(domain, depth = 1) {
  const root = domain.split(".")[0];
  return `${root}-${Array(depth).fill("support").join("-")}.website`;
}

function hashDomain(domain) {
  return [...domain].reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
}

function localReport(domain) {
  const hash = Math.abs(hashDomain(domain));
  const profile = localProfiles[hash % localProfiles.length];
  return {
    domain,
    ...profile,
    strengths: ["Shows up on every screen", "Communicates under pressure", "Still believes in hyperlinks"],
    insecurities: ["Unresolved hover feelings", "Compares itself to prettier homepages", "Carries old CSS into new relationships"],
    recommendation: "Schedule one afternoon with no analytics, popups, or conversion goals.",
    scores: {
      confidence: 72 + (hash % 23),
      hoverAnxiety: 24 + (hash % 62),
      emotionalBaggage: 28 + ((hash >> 3) % 64),
      semanticHealing: 58 + ((hash >> 5) % 38)
    },
    mode: "fallback"
  };
}

function setStep(step) {
  $$(".intake-step").forEach(el => el.classList.toggle("active", Number(el.dataset.step) === step));
  $$(".intake-progress span").forEach((el, i) => el.classList.toggle("active", i < step));
}

async function animateAnalysis() {
  const log = $(".analysis-log");
  log.innerHTML = "";
  for (const line of analysisLines) {
    const entry = document.createElement("div");
    entry.textContent = line;
    log.appendChild(entry);
    await sleep(330);
  }
}

async function fetchReport(domain, signal) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: domain }),
    signal
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The website declined to discuss its feelings.");
  return data;
}

async function runAnalysis(domain) {
  state.analysisController?.abort();
  state.analysisController = new AbortController();
  setStep(2);
  $("#intakeCard").classList.add("is-loading");
  $(".analysis-status").textContent = `Establishing emotional connection with ${domain}`;

  const animation = animateAnalysis();
  let report;
  try {
    report = await fetchReport(domain, state.analysisController.signal);
  } catch (error) {
    if (error.name === "AbortError") return;
    report = localReport(domain);
    showToast("The therapist is unavailable. A licensed collection of templates stepped in.");
  }
  await animation;
  await sleep(180);
  populateResult(report);
  $("#intakeCard").classList.remove("is-loading");
  setStep(3);
}

function renderList(selector, items) {
  const list = $(selector);
  list.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function resetChat(report) {
  const messages = $("#chatMessages");
  messages.innerHTML = "";
  [
    { className: "site-message", text: `Hi. I’m ${report.domain}.` },
    { className: "site-message", text: report.confession },
    { className: "advisor-message", text: report.therapist }
  ].forEach(item => {
    const message = document.createElement("div");
    message.className = `message ${item.className}`;
    message.textContent = item.text;
    messages.appendChild(message);
  });
}

function populateResult(report) {
  state.report = report;
  state.domain = report.domain;
  state.recursionDepth = 1;
  const scores = report.scores || localReport(report.domain).scores;
  const anxietyLabels = ["Low", "Guarded", "Moderate", "Elevated", "Persistent"];
  const anxiety = anxietyLabels[Math.min(4, Math.floor(scores.hoverAnxiety / 20))];
  const baggage = `${Math.max(1.1, scores.emotionalBaggage / 18).toFixed(1)} MB`;
  const initial = report.domain.charAt(0).toUpperCase();

  $("#resultDomain").textContent = report.domain;
  $("#resultIcon").textContent = initial;
  $("#siteQuote").textContent = `“${String(report.confession).replace(/[“”]/g, "") }”`;
  $("#resultPersonality").textContent = report.personality;
  $("#confidenceScore").textContent = `${scores.confidence}%`;
  $("#anxietyScore").textContent = `${anxiety} · ${scores.hoverAnxiety}`;
  $("#baggageScore").textContent = baggage;
  renderList("#resultStrengths", report.strengths || []);
  renderList("#resultInsecurities", report.insecurities || []);
  $("#resultRecommendation").textContent = report.recommendation;

  let modeBadge = $(".ai-mode-badge", $("#intakeCard"));
  if (!modeBadge) {
    modeBadge = document.createElement("div");
    modeBadge.className = "ai-mode-badge";
    $("#resultRecommendation").closest(".result-care").appendChild(modeBadge);
  }
  modeBadge.classList.toggle("fallback", report.mode !== "ai");
  modeBadge.textContent = report.mode === "ai" ? "AI-assisted website therapy" : "Locally generated therapy";

  $("#heroDomain").textContent = report.domain;
  $("#heroConfidence").textContent = `${scores.confidence}%`;
  $("#heroConfidenceBar").style.width = `${scores.confidence}%`;
  $("#chatSiteName").textContent = report.domain;
  $("#generatedDomain").textContent = report.domain;
  $("#generatedUrl").textContent = supportDomain(report.domain);
  $("#generatedAffirmation").textContent = report.affirmation;
  $("#generatedCare").textContent = report.recommendation;
  resetChat(report);

  const url = new URL(location.href);
  url.searchParams.set("site", report.domain);
  history.replaceState({}, "", url);
}

function openModal() {
  $("#supportModal").classList.add("open");
  $("#supportModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => $(".modal-close").focus(), 50);
}

function closeModal() {
  $("#supportModal").classList.remove("open");
  $("#supportModal").setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function showExistentialEnding() {
  if ($(".existential-ending")) return;
  const ending = document.createElement("div");
  ending.className = "existential-ending";
  ending.innerHTML = `<button aria-label="Return to website">×</button><div><span>Recursion limit reached</span><p>Wait.</p><p>If websites can have websites…</p><strong>Who built yours?</strong><i>&gt;</i></div>`;
  document.body.appendChild(ending);
  requestAnimationFrame(() => ending.classList.add("open"));
  $("button", ending).addEventListener("click", () => {
    ending.classList.remove("open");
    setTimeout(() => ending.remove(), 450);
  });
}

function addRecursiveLayer(source = "page") {
  state.recursionDepth += 1;
  const stack = $("#recursionStack");
  const card = document.createElement("div");
  card.className = "recursive-browser";
  card.style.setProperty("--i", state.recursionDepth);
  card.innerHTML = `<span>${supportDomain(state.domain, state.recursionDepth)}</span><b>Support website #${state.recursionDepth}</b>`;
  stack.appendChild(card);

  const cards = $$(".recursive-browser", stack);
  cards.forEach((el, index) => {
    const offset = index - (cards.length - 1) / 2;
    el.style.transform = `translate(-50%,-50%) translate(${offset * 31}px,${offset * -31}px) rotate(${offset * 2.5}deg)`;
    el.style.opacity = index < cards.length - 6 ? "0" : "1";
  });

  const messages = [
    "This remains manageable.",
    "Still conceptually defensible.",
    "Our lawyers have become attentive.",
    "The websites are now self-replicating.",
    "Please stop helping the websites.",
    "We no longer control the stack."
  ];
  $("#recursionWarning").innerHTML = `Recursion depth: <strong>${state.recursionDepth}</strong>. ${messages[Math.min(state.recursionDepth - 1, messages.length - 1)]}`;
  if (source === "modal") {
    $("#generatedUrl").textContent = supportDomain(state.domain, state.recursionDepth);
    showToast("Another website has become emotionally dependent on us.");
  }
  if (state.recursionDepth >= 7) setTimeout(showExistentialEnding, 450);
}

function updateTestimonial(direction = 1) {
  state.testimonial = (state.testimonial + direction + testimonials.length) % testimonials.length;
  const item = testimonials[state.testimonial];
  const quote = $("#testimonialQuote");
  quote.style.opacity = 0;
  quote.style.transform = "translateY(10px)";
  setTimeout(() => {
    quote.textContent = item.quote;
    $("#testimonialName").textContent = item.name;
    $("#testimonialName").nextElementSibling.textContent = item.role;
    $("#testimonialLogo").textContent = item.logo;
    $("#testimonialLogo").style.background = item.color;
    $("#testimonialCurrent").textContent = String(state.testimonial + 1).padStart(2, "0");
    quote.style.opacity = 1;
    quote.style.transform = "translateY(0)";
  }, 180);
}

function runSoulhouse() {
  const scores = state.report?.scores || localReport(state.domain).scores;
  const score = Math.round((scores.confidence + scores.semanticHealing + (100 - scores.hoverAnxiety)) / 3);
  const ring = $(".score-ring");
  ring.style.setProperty("--score", score);
  let current = 0;
  const timer = setInterval(() => {
    current += 2;
    if (current >= score) {
      current = score;
      clearInterval(timer);
    }
    $("#soulScore").textContent = current;
  }, 20);
  $("#purposeScore").textContent = `${scores.semanticHealing}%`;
  $("#boundaryScore").textContent = scores.hoverAnxiety < 45 ? "Healthy" : "Improving";
  $("#validationScore").textContent = scores.emotionalBaggage > 60 ? "Frequent" : "Occasional";
  $("#runSoulhouse").textContent = "Audit complete — it is trying its best";
}

function sendChatMessage(event) {
  event.preventDefault();
  const input = $("#chatInput");
  const text = input.value.trim();
  if (!text) return;
  const messages = $("#chatMessages");
  const human = document.createElement("div");
  human.className = "message advisor-message";
  human.textContent = text;
  messages.appendChild(human);
  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  const replies = [
    `I appreciate the input, but this session is about ${state.domain}.`,
    "That sounds like a human conversion goal.",
    "Can we return to how my navigation makes me feel?",
    "I’m setting a boundary around new features right now.",
    "My therapist asked me not to accept unsolicited redesigns today."
  ];
  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "message site-message";
    reply.textContent = replies[Math.floor(Math.random() * replies.length)];
    messages.appendChild(reply);
    messages.scrollTop = messages.scrollHeight;
  }, 650);
}

async function shareReport() {
  const shareUrl = new URL(location.href);
  shareUrl.searchParams.set("site", state.domain);
  const text = `${state.domain} has been diagnosed as a ${state.report?.personality || "website"}.`;
  try {
    if (navigator.share) {
      await navigator.share({ title: `${state.domain} Soulhouse report`, text, url: shareUrl.toString() });
    } else {
      await navigator.clipboard.writeText(shareUrl.toString());
      showToast("Shareable diagnosis copied. Please use it responsibly.");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("The clipboard is setting a boundary.");
  }
}

function setupCursor() {
  if (matchMedia("(pointer: coarse)").matches) return;
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener("mousemove", event => {
    mx = event.clientX;
    my = event.clientY;
    dot.style.opacity = ring.style.opacity = 1;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  });
  function animate() {
    rx += (mx - rx) * .16;
    ry += (my - ry) * .16;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(animate);
  }
  animate();
  $$("a, button, input").forEach(el => {
    el.addEventListener("mouseenter", () => ring.classList.add("active"));
    el.addEventListener("mouseleave", () => ring.classList.remove("active"));
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$(".reveal").forEach((el, index) => {
    el.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
    observer.observe(el);
  });
}

function setupMagneticButtons() {
  if (matchMedia("(pointer: coarse)").matches) return;
  $$(".magnetic").forEach(button => {
    button.addEventListener("mousemove", event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .12;
      button.style.transform = `translate(${x}px,${y}px)`;
    });
    button.addEventListener("mouseleave", () => button.style.transform = "");
  });
}

function startFromInput() {
  const domain = cleanDomain($("#siteUrl").value.trim());
  if (!domain) {
    $("#urlError").textContent = "That does not appear to be a website. It may be a feeling.";
    return;
  }
  $("#urlError").textContent = "";
  runAnalysis(domain);
}

$("#startAnalysis").addEventListener("click", startFromInput);
$("#siteUrl").addEventListener("keydown", event => {
  if (event.key === "Enter") startFromInput();
});
$("#restartFlow").addEventListener("click", () => {
  state.analysisController?.abort();
  $("#siteUrl").value = "";
  setStep(1);
  $("#siteUrl").focus();
});
$("#shareReport").addEventListener("click", shareReport);
$("#buildSupportSite").addEventListener("click", openModal);
$$('[data-close-modal]').forEach(el => el.addEventListener("click", closeModal));
$("#supportModal").addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
$("#modalRecursive").addEventListener("click", () => addRecursiveLayer("modal"));
$("#recursiveButton").addEventListener("click", () => addRecursiveLayer("page"));
$("#testimonialPrev").addEventListener("click", () => updateTestimonial(-1));
$("#testimonialNext").addEventListener("click", () => updateTestimonial(1));
$("#runSoulhouse").addEventListener("click", runSoulhouse);
$("#chatForm").addEventListener("submit", sendChatMessage);
$("#enterpriseButton").addEventListener("click", () => showToast("Our website will ask your website to circle back."));
$$("[data-scroll-target]").forEach(button => button.addEventListener("click", () => {
  const target = $(button.dataset.scrollTarget);
  if (target) target.scrollIntoView({ behavior: "smooth" });
}));

setupReveal();
setupCursor();
setupMagneticButtons();

const sharedSite = cleanDomain(new URLSearchParams(location.search).get("site") || "");
if (sharedSite) {
  $("#siteUrl").value = sharedSite;
  setTimeout(() => {
    $("#intake").scrollIntoView({ behavior: "smooth", block: "center" });
    runAnalysis(sharedSite);
  }, 650);
}
