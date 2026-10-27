// French lives in the HTML; this dictionary only holds the English versions.
const EN = {
    "nav.skills": "Skills",
    "nav.path": "Journey",
    "nav.about": "About",
    "nav.contact": "Contact",
    "hero.iam": "I'm",
    "hero.genai": "Generative AI",
    "hero.pitch": "I run data projects end to end: from raw data to a model in production.",
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
    "about.p2": "I like complete projects: collecting and cleaning data, training a model, then shipping it with an API, CI and monitoring. Two years of mentoring taught me to explain complex things simply.",
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

// Ransom-note name: each letter gets one of four looks and a slight tilt, fixed per position.
document.querySelectorAll(".hero h1").forEach(el => {
    const kinds = ["rn-a", "rn-a", "rn-b", "rn-a", "rn-c", "rn-a", "rn-d"];
    let i = 0;
    const letter = ch => {
        i++;
        const k = kinds[(i * 5 + ch.charCodeAt(0)) % kinds.length];
        return `<span class="rn ${k}" style="transform:rotate(${(i * 37) % 7 - 3}deg)">${ch}</span>`;
    };
    el.innerHTML = el.textContent.trim().split(/\s+/)
        .map(w => w.split(/(?<=-)/).map(p => `<span class="rn-w">${[...p].map(letter).join("")}</span>`).join(""))
        .join('<span class="rn-sp"></span>');
});

// Reveal cards as they scroll into view (hidden only when JS runs, so content never stays invisible).
document.documentElement.classList.add("js");
const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
