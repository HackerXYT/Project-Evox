/* lightModeAnalyzer.cjs */
/* Browser-side CommonJS-style module */

const COLOR_KEYWORDS = new Set([
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blue",
  "brown",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgray",
  "darkgrey",
  "darkgreen",
  "darkmagenta",
  "darkred",
  "fuchsia",
  "gold",
  "gray",
  "green",
  "grey",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lime",
  "magenta",
  "maroon",
  "navy",
  "olive",
  "orange",
  "orchid",
  "pink",
  "purple",
  "red",
  "silver",
  "teal",
  "transparent",
  "white",
  "yellow",
]);

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ---------- utils ---------- */

function findMatchesWithPositions(text, regex) {
  regex.lastIndex = 0;
  const out = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const idx = match.index;
    const before = text.slice(0, idx);
    const line = before.split("\n").length;
    const lastLineStart = before.lastIndexOf("\n") + 1;
    const ch = idx - lastLineStart + 1;
    out.push({
      match: match[0],
      index: idx,
      line,
      ch,
      surrounding: text.slice(
        Math.max(0, idx - 80),
        Math.min(text.length, idx + match[0].length + 80),
      ),
    });
  }
  return out;
}

/* ---------- robust color parsing ---------- */

function parseCssHex(color) {
  // color is like #rgb, #rgba, #rrggbb, #rrggbbaa
  const hex = color.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!hex) return null;
  let h = hex[1].toLowerCase();
  if (h.length === 3)
    h =
      h
        .split("")
        .map((c) => c + c)
        .join("") + "ff"; // rgb -> rrggbb + ff
  else if (h.length === 4)
    h = h
      .split("")
      .map((c) => c + c)
      .join(""); // rgba -> rrggbbaa
  else if (h.length === 6) h += "ff"; // rrggbb -> rrggbbaa
  // now h is 8 chars rrggbbaa
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return {
    r: (n >> 24) & 255,
    g: (n >> 16) & 255,
    b: (n >> 8) & 255,
    a: (n & 255) / 255,
  };
}

function parseCssRgbLike(color) {
  // handles rgb(...) and rgba(...), both comma-separated and space/slash-separated, with percent support
  const m = color.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  let inner = m[1].trim();

  // Normalize comma/space/slash: make tokens; treat '/' as separator for alpha.
  inner = inner.replace(/,/g, " ");
  inner = inner.replace(/\s*\/\s*/g, " / ");
  const rawTokens = inner.split(/\s+/).filter((t) => t.length > 0);

  // remove stray commas (shouldn't be any), remove any stray commas or empty tokens
  const tokens = rawTokens.filter((t) => t !== ",");

  // if there's a '/' token, split into rgb tokens before '/' and alpha after
  let alpha = undefined;
  let rgbTokens = tokens;
  const slashIdx = tokens.indexOf("/");
  if (slashIdx !== -1) {
    rgbTokens = tokens.slice(0, slashIdx);
    alpha = tokens.slice(slashIdx + 1).join(" ");
  } else if (tokens.length === 4) {
    // maybe comma syntax with 4th being alpha, or rgb with 4 values
    alpha = tokens[3];
    rgbTokens = tokens.slice(0, 3);
  }

  if (rgbTokens.length < 3) return null;

  const parseChannel = (tok) => {
    if (tok.endsWith("%")) {
      const pct = parseFloat(tok);
      if (Number.isNaN(pct)) return NaN;
      return Math.round((pct / 100) * 255);
    }
    const n = parseFloat(tok);
    return Number.isFinite(n) ? Math.round(n) : NaN;
  };

  const r = parseChannel(rgbTokens[0]);
  const g = parseChannel(rgbTokens[1]);
  const b = parseChannel(rgbTokens[2]);

  let a = 1;
  if (typeof alpha !== "undefined") {
    const aTok = alpha.trim();
    if (aTok.endsWith("%")) {
      const pct = parseFloat(aTok);
      a = Number.isFinite(pct) ? pct / 100 : 1;
    } else {
      const n = parseFloat(aTok);
      a = Number.isFinite(n) ? n : 1;
    }
  }

  if ([r, g, b].some((v) => !Number.isFinite(v) || Number.isNaN(v)))
    return null;

  return { r, g, b, a };
}

function parseColorToRGBA(color) {
  if (!color) return null;
  color = String(color).trim();

  if (/^transparent$/i.test(color)) return { r: 0, g: 0, b: 0, a: 0 };

  // 1) hex forms
  const fromHex = parseCssHex(color);
  if (fromHex) return fromHex;

  // 2) rgb/rgba forms (commas or spaces, with optional slash alpha, with percent support)
  const fromRgbLike = parseCssRgbLike(color);
  if (fromRgbLike) return fromRgbLike;

  // 3) attempt to resolve named colors or any other format via the DOM (computed style)
  try {
    const el = document.createElement("div");
    el.style.color = color;
    // ensure it's in the document for some browsers to compute it
    document.body.appendChild(el);
    const cs = getComputedStyle(el).color;
    el.remove();
    const m = cs.match(
      /rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
    );
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 };
  } catch (err) {
    // if something goes wrong with DOM resolution, return null
    return null;
  }
}

function rgbaToHex(input) {
  // Defensive: coerce missing properties to numbers and clamp to byte range.
  const r = Number(input?.r ?? 0);
  const g = Number(input?.g ?? 0);
  const b = Number(input?.b ?? 0);
  let a = typeof input?.a !== "undefined" ? Number(input.a) : 1;

  // Clamp/normalize
  const clampByte = (n) => {
    if (!Number.isFinite(n) || Number.isNaN(n)) return 0;
    const round = Math.round(n);
    if (round < 0) return 0;
    if (round > 255) return 255;
    return round;
  };

  const toByte = (v) => clampByte(v);
  const rb = toByte(r);
  const gb = toByte(g);
  const bb = toByte(b);

  if (!Number.isFinite(a) || Number.isNaN(a)) a = 1;
  // allow alpha in 0..1 or 0..255 (if someone passed 128), normalize to 0..1
  if (a > 1) {
    // maybe given as 0..255
    if (a > 255) a = 1;
    else a = a / 255;
  }
  a = Math.max(0, Math.min(1, a));

  const h = (v) => {
    const hex = v.toString(16).padStart(2, "0");
    return hex;
  };

  if (a >= 1) return `#${h(rb)}${h(gb)}${h(bb)}`;
  // include alpha
  return `#${h(rb)}${h(gb)}${h(bb)}${h(Math.round(a * 255))}`;
}

/* ---------- SCANNER ---------- */

async function scanPageForColors() {
  const results = {};
  const tokenRegex =
    /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\([^)]+\)|\b[a-zA-Z]+\b/g;

  const add = (key, matches) => {
    results[key] ??= [];
    for (const m of matches) {
      if (
        /^[a-z]+$/i.test(m.match) &&
        !COLOR_KEYWORDS.has(m.match.toLowerCase())
      )
        continue;

      const parsed = parseColorToRGBA(m.match);
      if (!parsed) continue;

      results[key].push({
        colorText: m.match,
        file: key,
        line: m.line,
        ch: m.ch,
        index: m.index,
        surrounding: m.surrounding,
      });
    }
  };

  document.querySelectorAll("style").forEach((s, i) => {
    add(`css:inline:${i}`, findMatchesWithPositions(s.textContent, tokenRegex));
  });

  document.querySelectorAll("[style]").forEach((el, i) => {
    add(
      `html:inline-style:${el.tagName.toLowerCase()}#${i}`,
      findMatchesWithPositions(el.getAttribute("style"), tokenRegex),
    );
  });

  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    const u = new URL(l.href, location.href);
    if (u.origin !== location.origin) continue;
    const txt = await fetch(u).then((r) => r.text());
    add(`css:${u.pathname}`, findMatchesWithPositions(txt, tokenRegex));
  }

  for (const s of document.querySelectorAll("script[src]")) {
    const u = new URL(s.src, location.href);
    if (u.origin !== location.origin) continue;
    const txt = await fetch(u).then((r) => r.text());
    add(`js:${u.pathname}`, findMatchesWithPositions(txt, tokenRegex));
  }

  return results;
}

/* ---------- SUGGESTIONS ---------- */

function suggestLightModePalette(scan) {
  const map = {};
  for (const arr of Object.values(scan)) {
    for (const o of arr) {
      const rgba = parseColorToRGBA(o.colorText);
      if (!rgba) continue;
      const hex = rgbaToHex(rgba);
      map[hex] ??= { hex, locations: [], rgba };
      map[hex].locations.push(o);
    }
  }

  Object.values(map).forEach((e) => {
    const l = (0.2126 * e.rgba.r + 0.7152 * e.rgba.g + 0.0722 * e.rgba.b) / 255;
    e.suggestedHexLightMode = l < 0.5 ? "#ffffff" : "#111111";
  });

  return map;
}

/* ---------- APPLY (LIVE) ---------- */

async function applyLightModeOverrides(suggestions) {
  const style = document.createElement("style");
  style.dataset.lightModeInjected = "true";

  let css = "";
  for (const s of Object.values(suggestions)) {
    css += `* { color-scheme: light; }\n`;
    css += `/* ${s.hex} → ${s.suggestedHexLightMode} */\n`;
  }

  style.textContent = css;
  document.head.appendChild(style);
}
