// Two blue hoses run down the gutters and cross the page on the bias, drawn over the section
// backgrounds and under the content (#pipes, z-index 1; content sits at z-index 2).
// Each hose is a stack of strokes on one path: shadow, body, fluid (moving dashes), highlight, black tags.
// The route is rebuilt from the real section positions on load and on resize. Skipped on phones.
const layer = document.getElementById("pipes-layer");
if (layer && !matchMedia("(max-width: 760px)").matches) {
    const main = document.querySelector("main");
    const svg = document.getElementById("pipes");
    const W = 26; // hose diameter in px

    // A smooth path through the given points, rounding every corner.
    const route = pts => {
        let d = `M${pts[0][0]} ${pts[0][1]}`;
        for (let i = 1; i < pts.length - 1; i++) {
            const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            const r = Math.min(120, Math.hypot(x1 - x0, y1 - y0) / 2, Math.hypot(x2 - x1, y2 - y1) / 2);
            const a = Math.atan2(y1 - y0, x1 - x0), b = Math.atan2(y2 - y1, x2 - x1);
            d += ` L${x1 - r * Math.cos(a)} ${y1 - r * Math.sin(a)} Q${x1} ${y1} ${x1 + r * Math.cos(b)} ${y1 + r * Math.sin(b)}`;
        }
        d += ` L${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
        return d;
    };

    const hose = (d, seed) => `
        <path d="${d}" stroke="rgba(0,0,0,.45)" stroke-width="${W + 10}" transform="translate(6 8)"/>
        <path d="${d}" stroke="#0A124A" stroke-width="${W}"/>
        <path d="${d}" stroke="#2F3DFF" stroke-width="${W - 6}"/>
        <path d="${d}" class="fluid" stroke="#7F8CFF" stroke-width="${W - 12}" stroke-dasharray="26 54" stroke-dashoffset="${seed}"/>
        <path d="${d}" stroke="rgba(255,255,255,.55)" stroke-width="3" transform="translate(-3 -6)"/>
        <path d="${d}" stroke="#0E0E0E" stroke-width="${W - 2}" stroke-dasharray="5 260" stroke-dashoffset="${seed * 3}"/>`;

    // Acid collars at the bends
    const collars = pts => pts.slice(1, -1).map(([x, y]) =>
        `<rect x="${x - W / 2 - 5}" y="${y - 10}" width="${W + 10}" height="20" fill="#C6FF00" stroke="#0E0E0E" stroke-width="2"/>`).join("");

    const build = () => {
        const w = main.offsetWidth, h = main.offsetHeight;
        const g = parseFloat(getComputedStyle(document.querySelector(".hero")).paddingLeft) / 2; // gutter centre
        const top = el => el.offsetTop, bottom = el => el.offsetTop + el.offsetHeight;
        const hero = document.querySelector(".hero"), stats = document.querySelector("#stats"), projects = document.querySelector("#projects"),
              skills = document.querySelector("#skills"), parcours = document.querySelector("#parcours"), about = document.querySelector("#about");
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

        // Hose A: left gutter, crosses the stats wall to the right, back across the skills paper, down to the end
        const A = [[g, -40], [g, bottom(hero) - 140], [w - g, top(stats) + 80], [w - g, bottom(projects) - 60],
                   [g, bottom(skills) - 40], [g, bottom(about) + 40], [w * .5, h + 40]];
        // Hose B: right gutter, crosses the journey section to the left, then the manifesto back to the right
        const B = [[w - g, -40], [w - g, top(hero) + 120], [w - g, top(projects) - 20], [w * .5, top(projects) - 20], [w * .5, top(parcours) + 60],
                   [g, top(about) - 40], [w - g, bottom(about) - 120], [w - g, h + 40]];
        const dA = route(A), dB = route(B);
        layer.innerHTML = hose(dB, 40) + collars(B) + hose(dA, 0) + collars(A);
    };
    build();
    let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 150); });
    // Section heights settle after fonts and the loader
    document.fonts.ready.then(build); setTimeout(build, 1500);
}
