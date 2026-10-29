// French lives in the HTML; this dictionary only holds the English versions.
const EN = {
    "nav.menu": "Menu",
    "nav.skip": "Skip to content",
    "nav.projects": "Projects",
    "stats.projects": "projects",
    "stats.mentor": "years of mentoring",
    "stats.f1": "best model",
    "stats.companies": "companies",
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
    "path.phoceenne.role": "Web developer (work-study)",
    "path.phoceenne.text": "Built the dealership website end to end: filtered catalog, online booking, SEO.",
    "path.pdf.role": "Data Scientist / AI developer (work-study)",
    "path.pdf.text": "AI voice-agent SaaS with OpenAI, Deepgram, ElevenLabs and Twilio. Back and front end in Symfony.",
    "path.mentor.role": "Mentor",
    "path.mentor.text": "Lectures, labs and workshops for first and second year students.",
    "path.bone.role": "Project lead",
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
    "contact.avail": "⌖ Available · Marseille or remote",
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

// Cascade order for chips, timeline steps, project cards and stat tiles.
document.querySelectorAll(".chips, .jobs, .projects, .wall").forEach(list =>
    [...list.children].forEach((li, i) => li.style.setProperty("--i", i)));

// Full-screen menu: MENU button toggles it, Escape and any link close it.
// While open, the page behind is inert and Tab cycles between the button and the links.
const menuBtn = document.getElementById("menu-btn"), menu = document.getElementById("menu");
const menuLinks = [...menu.querySelectorAll("a")];
const setMenu = open => {
    document.documentElement.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    document.querySelectorAll("main, footer, .skip").forEach(el => el.inert = open);
    (open ? menuLinks[0] : menuBtn).focus();
};
menuBtn.addEventListener("click", () => setMenu(!document.documentElement.classList.contains("menu-open")));
addEventListener("keydown", e => {
    if (!document.documentElement.classList.contains("menu-open")) return;
    if (e.key === "Escape") setMenu(false);
    if (e.key !== "Tab") return;
    const last = menuLinks[menuLinks.length - 1];
    if (e.shiftKey && document.activeElement === menuBtn) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); menuBtn.focus(); }
});
// A menu link closes the menu and replays the flash sweep, like a page transition.
const flash = document.querySelector(".flash");
menuLinks.forEach(a => a.addEventListener("click", () => {
    setMenu(false);
    flash.classList.remove("go"); void flash.offsetWidth; flash.classList.add("go");
}));

// Text scramble: random A-Z0-9 glyphs settle into the real text over ~400ms.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_";
const scramble = (el, text) => {
    if (el.scrambling) return;
    el.scrambling = true;
    const t0 = performance.now(), n = text.length;
    const step = now => {
        const p = Math.min(1, (now - t0) / 400), fixed = Math.floor(p * n);
        el.textContent = text.slice(0, fixed) + [...text.slice(fixed)].map(c => c === " " ? " " : GLYPHS[Math.random() * GLYPHS.length | 0]).join("");
        if (p < 1) requestAnimationFrame(step); else el.scrambling = false;
    };
    requestAnimationFrame(step);
};
menuLinks.forEach(a => a.addEventListener("mouseenter", () => scramble(a, a.textContent)));

// Stat tiles count up to their value the first time they scroll into view.
const counters = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    counters.unobserve(e.target);
    const el = e.target, target = parseFloat(el.dataset.count), decimals = (el.dataset.count.split(".")[1] || "").length, t0 = performance.now();
    const step = now => {
        const p = Math.min(1, (now - t0) / 1200);
        el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}), { threshold: .5 });
document.querySelectorAll("[data-count]").forEach(el => counters.observe(el));

// Manifesto: each word lights up as it crosses the middle of the screen. Re-run after a language switch.
const wordObserver = new IntersectionObserver(entries => entries.forEach(e =>
    e.target.classList.toggle("on", e.isIntersecting)), { rootMargin: "-40% 0px -40% 0px" });
const splitStatement = () => document.querySelectorAll(".statement").forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
    el.querySelectorAll(".w").forEach(w => wordObserver.observe(w));
});
splitStatement();
document.getElementById("lang").addEventListener("click", splitStatement);

// Highlight the menu link of the section on screen and name it in the header.
const links = [...document.querySelectorAll(".menu a")], where = document.getElementById("where");
const sectionObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    const label = e.target.dataset.side || "SEC_00 // HOME";
    if (where.textContent !== label) scramble(where, label);
}), { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section, footer[id]").forEach(s => sectionObserver.observe(s));

// Hero: the scatter fades and the name drifts up at a quarter of the scroll speed.
// Gutter fragments drift at their own data-p fraction of their section's scroll.
const fx = document.getElementById("fx"), heroName = document.querySelector(".hero-name");
const orns = [...document.querySelectorAll(".orn[data-p]")].map(el => ({ el, p: parseFloat(el.dataset.p), box: el.parentElement }));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let ticking = false;
addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        ticking = false;
        fx.style.opacity = Math.max(0, .7 - scrollY / innerHeight);
        if (scrollY < innerHeight) heroName.style.translate = `0 ${-scrollY * .25}px`;
        if (reduced) return;
        orns.forEach(({ el, p, box }) => {
            const top = box.getBoundingClientRect().top;
            if (top < innerHeight && top > -box.offsetHeight) el.style.translate = `0 ${(innerHeight - top) * -p}px`;
        });
    });
}, { passive: true });

// Preloader: counts to 100 in under a second, then slides away.
const loader = document.querySelector(".loader"), count = loader?.querySelector(".count");
if (loader) {
    let n = 0;
    const tick = setInterval(() => {
        n = Math.min(100, n + 8 + Math.random() * 10); count.textContent = Math.floor(n);
        if (n >= 100) { clearInterval(tick); loader.classList.add("done"); document.documentElement.classList.add("ready"); }
    }, 40);
}

// Scroll progress, read by the gutter rails' marker.
const setProgress = () => document.documentElement.style.setProperty("--progress",
    (scrollY / (document.documentElement.scrollHeight - innerHeight) || 0).toFixed(4));
setProgress(); addEventListener("scroll", setProgress, { passive: true });

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
    const ring = document.querySelector(".ring");
    let mx = 0, my = 0, rx = 0, ry = 0;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + "px"; cursor.style.top = my + "px"; });
    // The ring eases toward the dot (12% of the gap per frame)
    const follow = () => { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(follow); };
    follow();
    document.querySelectorAll("a, button, .chips li, .project, .wall li").forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("big"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
    });
}
