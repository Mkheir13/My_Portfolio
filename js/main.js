// French lives in the HTML; this dictionary only holds the English versions.
const EN = {
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "projects.title": "Projects",
    "projects.code": "View code →",
    "projects.destiny.title": "Classifier on the Destiny API",
    "projects.destiny.text": "Final-year project: ETL pipeline on the Bungie API, Random Forest trained on 392 samples, data-leak checks, served by an API with CI.",
    "projects.yolo.title": "YOLOv8 object detection",
    "projects.yolo.text": "Fine-tuned YOLOv8 on an annotated dataset: +37% mAP50-95 over the base model.",
    "projects.draw.text": "Real-time multiplayer web game: two players draw, a TensorFlow AI guesses. Django Channels websockets, 345 words, leaderboard.",
    "projects.over.stat": "pages",
    "projects.over.text": "Streamlit dashboard of Overwatch League stats: scrapers, image detection to enrich the datasets, player, team and match profiles.",
    "projects.hub.text": "Destiny 2 community platform: Bungie OAuth, manifest sync (weapons, triumphs), build system, guides and profiles.",
    "projects.mee7.stat": "commands",
    "projects.mee7.text": "Team-built Discord bot: stream notifications, shared availability from iCal, content recommendations, moderation.",
    "nav.path": "Journey",
    "nav.about": "About",
    "nav.contact": "Contact",
    "hero.iam": "I'm",
    "hero.genai": "Generative AI",
    "hero.pitch": "I turn raw data into models that run in production. The rest of the time: Destiny, League of Legends, and coffee.",
    "hero.cv": "Download my resume",
    "hero.contact": "Get in touch ↗",
    "hero.bubble": "Let's make your data talk!",
    "skills.title": "Skills",
    "skills.genai": "Generative AI & APIs",
    "skills.dev": "Development",
    "path.title": "Journey",
    "path.phoceenne.title": "Web developer (work-study) · Phocéenne Auto",
    "path.phoceenne.text": "Built the dealership website end to end: filtered catalog, online booking, SEO.",
    "path.pdf.title": "Data Scientist / AI developer (work-study) · Place des Finances",
    "path.pdf.text": "AI voice-agent SaaS with OpenAI, Deepgram, ElevenLabs and Twilio. Back and front end in Symfony.",
    "path.mentor.title": "Mentor · Ynov Campus Aix",
    "path.mentor.text": "Lectures, labs and workshops for first and second year students.",
    "path.bone.title": "Project lead · B-One",
    "path.bone.text": "Led a team, built the site in Go and designed the database.",
    "path.ynov.title": "Master's in AI & Data Science · Ynov Aix",
    "path.ynov.text": "Graduated in 2026, RNCP level 7 (master's level).",
    "about.title": "About me",
    "about.w2": "Teaching",
    "about.w3": "Critical thinking",
    "about.p1": "I'm Kheir-eddine, a Data Scientist based in Marseille, with a Master's in AI & Data Science from Ynov.",
    "about.p2": "I like complete projects: collecting and cleaning data, training a model, then shipping it with an API, CI and monitoring. My final-year project runs on the Destiny API, and I built a League of Legends stats tracker because I wanted to know why I kept losing.",
    "about.p3": "Two years of mentoring at Ynov taught me to explain complex things simply. Fan of the Bungie aesthetic, hence this site.",
    "about.looking": "I'm looking for a Data Scientist position.",
    "contact.title1": "Let's build something",
    "contact.title2": "smart!",
};

const nodes = document.querySelectorAll("[data-i18n]");
nodes.forEach(n => n.dataset.fr = n.textContent);

function setLang(lang) {
    nodes.forEach(n => n.textContent = lang === "en" ? EN[n.dataset.i18n] ?? n.dataset.fr : n.dataset.fr);
    document.documentElement.lang = lang;
    const btn = document.getElementById("lang");
    btn.textContent = lang === "en" ? "FR" : "EN";
    btn.setAttribute("aria-label", lang === "en" ? "Passer en français" : "Switch to English");
    try { localStorage.setItem("lang", lang); } catch {}
}

let saved = null;
try { saved = localStorage.getItem("lang"); } catch {}
setLang(saved || (navigator.language.startsWith("fr") ? "fr" : "en"));
document.getElementById("lang").addEventListener("click", () =>
    setLang(document.documentElement.lang === "en" ? "fr" : "en"));

// Reveal cards as they scroll into view (hidden only when JS runs, so content never stays invisible).
document.documentElement.classList.add("js");
const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Cascade order for tiles and timeline steps.
document.querySelectorAll(".chips, .timeline, .projects").forEach(list =>
    [...list.children].forEach((li, i) => li.style.setProperty("--i", i)));

// Underline the nav link of the section on screen.
const links = [...document.querySelectorAll(".nav nav a")];
const sectionObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id], footer[id]").forEach(s => sectionObserver.observe(s));

// Preloader: counts to 100 in under a second, then slides away.
const loader = document.querySelector(".loader"), count = loader?.querySelector(".count");
if (loader) {
    let n = 0;
    const tick = setInterval(() => {
        n = Math.min(100, n + 8 + Math.random() * 10); count.textContent = Math.floor(n);
        if (n >= 100) { clearInterval(tick); loader.classList.add("done"); document.documentElement.classList.add("ready"); }
    }, 40);
}

// Local time in Marseille, in the header.
const clock = document.getElementById("clock");
const showTime = () => clock.textContent = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" });
if (clock) { showTime(); setInterval(showTime, 30000); }

// Split hero text into words so each can rise in with its own delay. Re-run after a language switch.
const splitWords = () => document.querySelectorAll(".split").forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--d:${i * 45}ms">${w}</span>`).join(" ");
});
splitWords();
document.getElementById("lang").addEventListener("click", splitWords);

// Custom cursor: a lime dot that grows over links and buttons (desktop only).
const cursor = document.querySelector(".cursor");
if (cursor && matchMedia("(hover: hover)").matches) {
    document.documentElement.classList.add("has-cursor");
    addEventListener("mousemove", e => { cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; });
    document.querySelectorAll("a, button, .chips li, .project").forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("big"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
    });
}
