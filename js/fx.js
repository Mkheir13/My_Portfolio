// 3D scatter of three classified clusters, rotating slowly and steered by the mouse,
// with a wireframe bounding cube and axes. Drawn on a 2D canvas, no 3D library.
// One instance per canvas.fx (hero panel, faded behind the footer).
// Skipped under prefers-reduced-motion and on phones (a 60 fps canvas behind the hero costs battery for little).
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && !matchMedia("(max-width: 760px)").matches) document.querySelectorAll("canvas.fx").forEach(canvas => {
    const ctx = canvas.getContext("2d");
    const COLORS = ["#C6FF00", "#2F3DFF", "#B8BDB5"];
    let w, h, t = 0, mx = 0, my = 0;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize(); addEventListener("resize", resize);
    canvas.parentElement.addEventListener("mousemove", e => {
        const r = canvas.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
    });
    canvas.parentElement.addEventListener("mouseleave", () => { mx = my = 0; });

    // Three gaussian clusters inside a [-1,1] cube (seeded so the picture is the same on every load)
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const gauss = () => (rnd() + rnd() + rnd() - 1.5) * .9;
    const CENTERS = [[-.5, -.4, .3], [.5, .3, -.4], [0, .55, .5]];
    const PTS = CENTERS.flatMap((c, k) => Array.from({ length: 70 }, () => ({ p: c.map(v => v + gauss() * .28), k })));
    const CUBE = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

    const rot = ([x, y, z], a, b) => {
        const x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a);
        const y1 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
        return [x1, y1, z2];
    };
    const frame = () => {
        t += .016;
        const a = t * .25 + mx * 1.2, b = .35 + my * .8;
        const S = Math.min(w * .45, h) * .35, cx = w / 2, cy = h / 2; // grows with width so it fills a wide hero
        const proj = v => { const [x, y, z] = rot(v, a, b); const f = 3 / (3 + z); return [cx + x * f * S, cy + y * f * S, z, f]; };
        ctx.clearRect(0, 0, w, h);

        // Bounding cube and axes
        const C = CUBE.map(proj);
        ctx.strokeStyle = "#C6FF00"; ctx.globalAlpha = .25; ctx.lineWidth = 1;
        EDGES.forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(C[i][0], C[i][1]); ctx.lineTo(C[j][0], C[j][1]); ctx.stroke(); });
        ctx.globalAlpha = .6; ctx.strokeStyle = "#2F3DFF";
        [[1,0,0],[0,1,0],[0,0,1]].forEach(ax => { const o = proj([-1,-1,-1]), e = proj(ax.map(v => v * 2 - 1).map((v,i)=> ax[i]? 1 : -1)); ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); });

        // Points, far ones first, size and alpha by depth
        PTS.map(d => ({ ...d, q: proj(d.p) })).sort((u, v) => v.q[2] - u.q[2]).forEach(({ k, q }) => {
            const r = 1.5 + q[3] * 2.2;
            ctx.globalAlpha = .35 + q[3] * .5; ctx.fillStyle = COLORS[k];
            ctx.fillRect(q[0] - r / 2, q[1] - r / 2, r, r);
        });

        // Cluster labels follow their centroid
        ctx.globalAlpha = .9; ctx.font = "700 10px 'Space Mono', monospace";
        ["CLS_0", "CLS_1", "CLS_2"].forEach((l, k) => { const q = proj(CENTERS[k]); ctx.fillStyle = COLORS[k]; ctx.fillText(l, q[0] + 10, q[1] - 8); });
        ctx.globalAlpha = 1;
        requestAnimationFrame(frame);
    };
    frame();
});

// HUD readouts: typewriter lines that rewrite themselves every few seconds.
const LINES = ["MODEL: RANDOM_FOREST", "F1: 0.92", "SAMPLES: 392", "LEAK_CHECK: PASSED", "mAP50-95: +37%", "PIPELINE: ETL → API → CI"];
document.querySelectorAll(".readout").forEach((el, n) => {
    let i = n * 3, timer;
    const type = () => {
        const text = LINES[i % LINES.length]; let c = 0; el.textContent = "";
        clearInterval(timer);
        timer = setInterval(() => { el.textContent = text.slice(0, ++c) + (c < text.length ? "_" : ""); if (c >= text.length) clearInterval(timer); }, 40);
        i++;
    };
    type(); setInterval(type, 4000 + n * 700);
});
