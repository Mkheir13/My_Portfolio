// Two blue hoses run down the gutters and cross the page on the bias, drawn over the section
// backgrounds and under the content (#pipes, z-index 1; content sits at z-index 2).
// Each hose is a stack of strokes on one path, bottom to top: hard shadow, glass rim, three blues for
// volume, slow fluid slugs, fast bubbles, two highlights, checker tags. Collars sit at the bends and
// couplings on the long runs, both rotated to the hose direction.
// The route is rebuilt from the real section positions on load and on resize. Skipped on phones.
const layer = document.getElementById("pipes-layer");
if (layer && !matchMedia("(max-width: 760px)").matches) {
    const main = document.querySelector("main");
    const svg = document.getElementById("pipes");
    const W = 28; // hose diameter in px
    const deg = a => a * 180 / Math.PI;

    // A smooth path through the given points, rounding every corner.
    const route = pts => {
        let d = `M${pts[0][0]} ${pts[0][1]}`;
        for (let i = 1; i < pts.length - 1; i++) {
            const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            const r = Math.min(220, Math.hypot(x1 - x0, y1 - y0) / 2, Math.hypot(x2 - x1, y2 - y1) / 2);
            const a = Math.atan2(y1 - y0, x1 - x0), b = Math.atan2(y2 - y1, x2 - x1);
            d += ` L${x1 - r * Math.cos(a)} ${y1 - r * Math.sin(a)} Q${x1} ${y1} ${x1 + r * Math.cos(b)} ${y1 + r * Math.sin(b)}`;
        }
        d += ` L${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
        return d;
    };

    const hose = (d, seed, dir) => `
        <path d="${d}" stroke="rgba(0,0,0,.5)" stroke-width="${W + 12}" transform="translate(8 10)"/>
        <path d="${d}" stroke="rgba(255,255,255,.22)" stroke-width="${W + 3}"/>
        <path d="${d}" stroke="#0A124A" stroke-width="${W}"/>
        <path d="${d}" stroke="#2436C8" stroke-width="${W - 6}" transform="translate(0 1)"/>
        <path d="${d}" stroke="#2F3DFF" stroke-width="${W - 11}"/>
        <path d="${d}" class="fluid ${dir}" stroke="#5B6BFF" stroke-width="${W - 13}" stroke-dasharray="60 90 30 120" stroke-dashoffset="${seed}"/>
        <path d="${d}" class="bubbles ${dir}" stroke="#C3CAFF" stroke-width="${W - 20}" stroke-dasharray="0 34 0 58 0 22" stroke-dashoffset="${seed * 2}"/>
        <path d="${d}" stroke="rgba(255,255,255,.2)" stroke-width="8" transform="translate(-3 -7)"/>
        <path d="${d}" stroke="rgba(255,255,255,.8)" stroke-width="2" transform="translate(-4 -9)"/>
        <path d="${d}" stroke="#0E0E0E" stroke-width="${W - 4}" stroke-dasharray="7 7 7 7 7 300" stroke-dashoffset="${seed * 3}"/>
        <path d="${d}" stroke="#F2F2EC" stroke-width="${W - 4}" stroke-dasharray="7 7 7 7 7 300" stroke-dashoffset="${seed * 3 - 7}" opacity=".85"/>`;

    // A sleeve across the hose at (x, y), turned to angle a (radians): acid collar or black coupling
    const sleeve = (x, y, a, kind) => kind === "collar"
        ? `<g transform="translate(${x} ${y}) rotate(${deg(a)})"><rect x="-11" y="${-W / 2 - 5}" width="22" height="${W + 10}" fill="#C6FF00" stroke="#0E0E0E" stroke-width="2"/><rect x="-3" y="${-W / 2 - 5}" width="6" height="${W + 10}" fill="#0E0E0E"/></g>`
        : `<g transform="translate(${x} ${y}) rotate(${deg(a)})"><rect x="-9" y="${-W / 2 - 3}" width="18" height="${W + 6}" fill="#0E0E0E" stroke="#C6FF00" stroke-width="1.5"/><rect x="-2" y="${-W / 2 - 3}" width="4" height="${W + 6}" fill="#C6FF00"/></g>`;

    // Collars at every bend (turned to the bisector), couplings at the middle of every run longer than 500px
    const fittings = pts => {
        let out = "";
        for (let i = 1; i < pts.length - 1; i++) {
            const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            const a = Math.atan2(y1 - y0, x1 - x0), b = Math.atan2(y2 - y1, x2 - x1);
            out += sleeve(x1, y1, (a + b) / 2, "collar");
        }
        for (let i = 0; i < pts.length - 1; i++) {
            const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
            if (Math.hypot(x1 - x0, y1 - y0) > 500) out += sleeve((x0 + x1) / 2, (y0 + y1) / 2, Math.atan2(y1 - y0, x1 - x0), "coupling");
        }
        return out;
    };

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
        layer.innerHTML = hose(route(B), 40, "back") + fittings(B) + hose(route(A), 0, "forth") + fittings(A);
    };
    build();
    let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(build, 150); });
    // Section heights settle after fonts and the loader
    document.fonts.ready.then(build); setTimeout(build, 1500);
}
