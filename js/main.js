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
    "projects.destiny.title": "Random Forest classifier · F1 0.92",
    "projects.destiny.text": "Final-year project: ETL pipeline on the Bungie API, Random Forest trained on 392 samples, data-leak checks, served by an API with CI.",
    "projects.yolo.title": "Object detection · mAP50-95 +37%",
    "projects.draw.title": "Multiplayer game · TensorFlow AI",
    "projects.over.title": "Streamlit dashboard · 8 pages",
    "projects.hub.title": "Destiny 2 platform · Bungie API",
    "projects.mee7.title": "Discord bot · 10 commands",
    "projects.yolo.text": "Fine-tuned YOLOv8 on an annotated dataset: +37% mAP50-95 over the base model.",
    "projects.draw.text": "Real-time multiplayer web game: two players draw, a TensorFlow AI guesses. Django Channels websockets, 345 words, leaderboard.",
    "projects.over.stat": "pages",
    "projects.over.text": "Streamlit dashboard of Overwatch League stats: scrapers, image detection to enrich the datasets, player, team and match profiles.",
    "projects.hub.text": "Destiny 2 community platform: Bungie OAuth, manifest sync (weapons, triumphs), build system, guides and profiles.",
    "projects.mee7.stat": "commands",
    "kpi.words": "words",
    "kpi.cmds": "commands",
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
{   // palette from ?palette= or the last choice
    const p = new URLSearchParams(location.search).get("palette") || (() => { try { return localStorage.getItem("palette"); } catch { return null; } })();
    if (p && p !== "acid") document.documentElement.dataset.palette = p;
}

// Wide screens: zoom the page so the layout is always that of a 1536px-wide laptop, whatever the screen or browser zoom.
const fit = () => {
    const z = innerWidth > 1536 ? innerWidth / 1536 : 1;
    document.documentElement.style.zoom = z === 1 ? "" : z.toFixed(4);
    document.documentElement.style.setProperty("--z", z.toFixed(4));
};
fit(); addEventListener("resize", fit);
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
        const p = Math.min(1, (now - t0) / 600);
        el.textContent = (target * p).toFixed(decimals);
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
    const label = e.target.dataset.side || "[00] // HOME";
    if (where.textContent !== label) scramble(where, label);
}), { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section, footer[id]").forEach(s => sectionObserver.observe(s));

// Hero: the 3D card fades as the hero scrolls away, and turns a little toward the mouse.
const card3d = document.getElementById("card3d");
if (card3d) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) card3d.removeAttribute("auto-rotate");
    addEventListener("scroll", () => { card3d.style.opacity = Math.max(0, 1 - scrollY / innerHeight); }, { passive: true });
    // The model spins on its own (auto-rotate); the mouse tilts the whole viewer on top of that
    if (matchMedia("(hover: hover)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const hero = document.querySelector(".hero");
        hero.addEventListener("mousemove", e => {
            const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
            card3d.style.transform = `perspective(1200px) rotateY(${(x * 14).toFixed(1)}deg) rotateX(${(-y * 10).toFixed(1)}deg)`;
        });
        hero.addEventListener("mouseleave", () => { card3d.style.transform = ""; });
    }
}

// About poster: a real 3D card; the camera orbits a little toward the mouse (±16° yaw, ±10° pitch)
// Same for the lanyard badges, driven by their section.
if (matchMedia("(hover: hover)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches)
    document.querySelectorAll("#data3d, .badge").forEach(mv => {
        const box = mv.classList.contains("badge") ? mv.closest("section, footer") : mv.parentElement;
        box.addEventListener("mousemove", e => {
            const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
            mv.cameraOrbit = `${(x * 32).toFixed(1)}deg ${(90 - y * 20).toFixed(1)}deg 105%`;
        });
        box.addEventListener("mouseleave", () => { mv.cameraOrbit = "0deg 90deg 105%"; });
    });

// Preloader: a boot log and a counter, about 900ms, then it slides away.
const loader = document.querySelector(".loader"), count = loader?.querySelector(".count"), boot = loader?.querySelector(".boot");
if (loader) {
    const lines = ["> boot kheir.016", "> fonts ......... <b>ok</b>", "> kheir016.glb .. <b>278 kb</b>", "> cuda .......... <b>ok</b>", "> classes ....... <b>16</b>", "> weights ....... <b>val_acc 0.941</b>", "> <b>ready</b>"];
    let n = 0, i = 0;
    const done = () => { if (n >= 100 && i >= lines.length) { loader.classList.add("done"); document.documentElement.classList.add("ready"); } };
    const tick = setInterval(() => {
        n = Math.min(100, n + 6 + Math.random() * 8); count.textContent = Math.floor(n);
        if (n >= 100) { clearInterval(tick); done(); }
    }, 50);
    const log = setInterval(() => {
        boot.insertAdjacentHTML("beforeend", lines[i++] + "\n");
        if (i >= lines.length) { clearInterval(log); done(); }
    }, 110);
}

// Command line: "/" opens it. go <section> · lang fr|en · cv · mail · github · help
const cmd = document.getElementById("cmd"), cmdIn = document.getElementById("cmd-in"), cmdOut = cmd?.querySelector("output");
if (cmd) {
    const sections = ["home", "stats", "projects", "skills", "parcours", "about", "contact"];
    const palettes = ["acid", "ember", "cyan", "safety", "mint"];
    const setPalette = p => { document.documentElement.dataset.palette = p === "acid" ? "" : p; try { localStorage.setItem("palette", p); } catch {} };
    const run = line => {
        const [verb, arg] = line.trim().toLowerCase().split(/\s+/);
        const go = id => { const el = document.getElementById(id === "home" ? "top" : id) || document.querySelector(id === "home" ? ".hero" : "#" + id); if (el) { el.scrollIntoView(); return "> " + id; } return "> ?" + id; };
        if (!verb) return "";
        if (verb === "help") return "> " + ["go <section>", "lang fr|en", "palette <name>", "cv", "mail", "github"].join(" · ") + " · " + sections.join(" ");
        if (verb === "go" && arg) return go(arg);
        if (sections.includes(verb)) return go(verb);
        if (verb === "lang" && (arg === "fr" || arg === "en")) { setLang(arg); return "> lang " + arg; }
        if (verb === "palette") { if (palettes.includes(arg)) { setPalette(arg); return "> palette " + arg; } return "> palette " + palettes.join(" | "); }
        if (verb === "cv") { location.href = document.querySelector(".btn-main").href; return "> cv"; }
        if (verb === "mail") { location.href = document.querySelector('a[href^="mailto:"]').href; return "> mail"; }
        if (verb === "github") { open("https://github.com/Mkheir13", "_blank", "noopener"); return "> github"; }
        return "> ? " + verb + " — help";
    };
    const show = on => { cmd.hidden = !on; if (on) { cmdIn.value = ""; cmdOut.textContent = ""; cmdIn.focus(); } };
    addEventListener("keydown", e => {
        const typing = /INPUT|TEXTAREA/.test(e.target.tagName);
        if (e.key === "/" && !typing) { e.preventDefault(); show(true); }
        else if (e.key === "Escape" && !cmd.hidden) show(false);
    });
    cmd.addEventListener("submit", e => { e.preventDefault(); cmdOut.textContent = run(cmdIn.value); cmdIn.select(); });
    document.querySelector(".cmd-hint")?.addEventListener("click", () => show(cmd.hidden));
}

// Project key numbers count up from 0 on hover, 400ms in 8 steps.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) document.querySelectorAll(".project .kpi b").forEach(b => {
    const v = parseFloat(b.dataset.val), d = +b.dataset.dec, sign = b.dataset.sign;
    b.closest(".project").addEventListener("mouseenter", () => {
        let k = 0;
        const t = setInterval(() => { k++; b.textContent = sign + (v * k / 8).toFixed(d); if (k >= 8) clearInterval(t); }, 50);
    });
});

// GitHub live tile: repo count, stars, last push, top languages, from the public API (60 req/h unauthenticated).
const gh = document.querySelector(".wall .gh");
if (gh) fetch("https://api.github.com/users/Mkheir13/repos?per_page=100&sort=pushed").then(r => r.ok ? r.json() : Promise.reject()).then(repos => {
    const set = (k, v) => gh.querySelector(`[data-g="${k}"]`).textContent = v;
    set("repos", repos.length);
    set("stars", repos.reduce((n, r) => n + r.stargazers_count, 0));
    const h = Math.round((Date.now() - new Date(repos[0].pushed_at)) / 36e5);
    set("push", h < 1 ? "< 1 h" : h < 48 ? `il y a ${h} h` : `il y a ${Math.round(h / 24)} j`);
    const langs = {}; repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    set("langs", Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l).join(" · "));
}).catch(() => {});

// Parcours: the timeline marker follows the viewport's middle down the list.
const jobs = document.querySelector(".jobs");
if (jobs) {
    const track = () => { const r = jobs.getBoundingClientRect(); jobs.style.setProperty("--jp", Math.min(1, Math.max(0, (innerHeight / 2 - r.top) / r.height)).toFixed(3)); };
    track(); addEventListener("scroll", track, { passive: true });
}

// Scroll progress, read by the gutter rails' marker.
const setProgress = () => document.documentElement.style.setProperty("--progress",
    (scrollY / (document.documentElement.scrollHeight - innerHeight) || 0).toFixed(4));
setProgress(); addEventListener("scroll", setProgress, { passive: true });

// Training log: one line every 900ms in a black tile of the stats wall, loss going down, last six lines kept.
const log = document.querySelector(".wall .log");
if (log && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let epoch = 1, lines = [];
    setInterval(() => {
        const loss = (0.9 * Math.exp(-epoch / 7) + 0.02 + Math.random() * .01).toFixed(4);
        const acc = (0.99 - 0.6 * Math.exp(-epoch / 6) + Math.random() * .005).toFixed(3);
        lines.push(`ep ${String(epoch).padStart(2, "0")}  loss ${loss}  acc ${acc}`);
        if (lines.length > 24) lines.shift();
        log.textContent = lines.join("\n");
        epoch = epoch % 20 + 1;
    }, 900);
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
    const xy = document.querySelector(".cursor-xy");
    addEventListener("mousemove", e => {
        // CSS zoom on wide screens: clientX/Y are unzoomed viewport px, style lengths are zoomed
        const z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
        cursor.style.left = xy.style.left = e.clientX / z + "px"; cursor.style.top = xy.style.top = e.clientY / z + "px";
        xy.textContent = `X ${String(e.clientX).padStart(4, "0")} Y ${String(e.clientY).padStart(4, "0")}`;
    });
    document.querySelectorAll("a, button, .chips li, .project, .wall li").forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("big"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
    });
}
