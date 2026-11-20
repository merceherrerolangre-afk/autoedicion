// Reel FWIF2897 · «Perfil de Instagram de un salón» (v3: fondo de la pantalla dividida semitransparente; v2, 10 de noviembre de 2026: recorte encima al sentarse,
// perfil más grande, «Beauty Hair», fotos de ella en la cuadrícula).
// Parte de plantilla-reel-animado.tsx (BRMC4311 v3). Perfil de salón INVENTADO dibujado en código
// («Salón Ejemplo»): la cámara del dibujo se acerca a cada parte cuando ella la nombra.
// Colocación combinada: pantalla dividida (perfil arriba) y animaciones detrás de ella (recorte rembg delante).
// Fotos y vídeos de pelo: Pexels (revisados, sin marcas). Sin música; sonido bajito en cada animación.
import React from "react";
import { AbsoluteFill, Easing, Img, Loop, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import captions from "./data/FWIF2897-captions.json";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });

const C = {
  white: "#FFFFFF", light: "#F3F3F3", border: "#E5E5E5", black: "#111111", anthracite: "#242424",
  grey: "#777777", pill: "#B3B3B3", accent: "#E98A55", gradTop: "#F6F2E8", gradBottom: "#B9AEA4",
};
const DIR = "FWIF2897";
export const FPS_FWIF2897 = 30;
export const DURATION_S_FWIF2897 = (captions as { duration: number }).duration;

type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (captions as { words: Word[] }).words;

const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
const backOut = Easing.out(Easing.back(1.4));
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * FPS_FWIF2897);
const lerp = (t: number, a: number, b: number, v0: number, v1: number, easing = easeOut) => interpolate(t, [a, b], [v0, v1], { ...clamp, easing });
const popIn = (t: number, at: number) => ({ s: lerp(t, at, at + 0.3, 0.7, 1, backOut), o: lerp(t, at, at + 0.2, 0, 1) });
const pulse = (t: number, at: number) => interpolate(t, [at, at + 0.11, at + 0.22], [1, 1.05, 1], { ...clamp, easing: easeInOut });

// ---------- momentos (segundos del reel, de captions.json) ----------
const T = {
  seguirte: 2.85, analizar: 3.71, primero: 5.51, solamente: 7.14, incluye: 8.42, servicio: 8.86, ubicacion: 9.84,
  asi: 10.49, clientas: 10.75, rapido: 11.73, donde: 13.34,
  segundo: 14.16, creando: 16.77, por: 17.87, especialidad: 18.22, clienta: 19.11,
  tercero: 20.24, preciosos: 22.87, organizar: 24.2, decisiones: 26.39,
  ejemplo: 28.15, cortes: 28.72, colores: 29.22, tratamientos: 29.75, peinados: 30.25,
  actualmente: 30.68, pero: 33.86, claro: 34.31,
  crea: 35.84, destacada: 36.86, que: 37.73, relaciones: 38.56, necesidades: 39.53, objetivos: 40.31, servicios: 41.63,
  cuarto: 42.85, fijadas: 43.79,
  lasPub: 44.27, recepcion: 45.8, estrateg: 47.82,
  fija: 48.44, tres: 48.66, empieza: 50.64, dos: 53.58, susServicios: 55.14, tresB: 55.82, resultados: 57.88, transf: 58.77,
  ultimo: 59.98, enlace: 60.88, reservas: 61.36,
  enviar: 61.9, generica: 64.29, utiliza: 65.07, directo: 65.85, servList: 66.55, horarios: 67.2, disponibles: 67.47,
  haz: 68.09, sencillo: 70.36, soloPaso: 71.97,
  gente: 72.35, comenta: 75.36,
};

// ---------- cámara ----------
type Shot = { from: number; to: number; kind: "full"; z0: number; z1: number } | { from: number; to: number; kind: "split"; z: number };
const S = (from: number, to: number, z: number): Shot => ({ from, to, kind: "split", z });
const F = (from: number, to: number, z0: number, z1: number): Shot => ({ from, to, kind: "full", z0, z1 });
const SHOTS: Shot[] = [
  S(0, 3.45, 1.0), S(3.45, T.primero, 1.07), S(T.primero, T.incluye, 1.0), S(T.incluye, T.asi, 1.07),
  F(T.asi, 12.36, 1.0, 1.04), F(12.36, T.segundo, 1.1, 1.12),
  S(T.segundo, T.creando, 1.0), S(T.creando, T.especialidad, 1.07), S(T.especialidad, T.tercero, 1.0),
  S(T.tercero, T.preciosos, 1.07), S(T.preciosos, T.organizar, 1.0), S(T.organizar, T.ejemplo, 1.07),
  F(T.ejemplo, T.actualmente, 1.0, 1.04),
  S(T.actualmente, T.pero, 1.0),
  F(T.pero, T.crea, 1.08, 1.1),
  S(T.crea, T.relaciones, 1.0), S(T.relaciones, T.cuarto, 1.07),
  S(T.cuarto, T.lasPub, 1.0),
  F(T.lasPub, 46.32, 1.0, 1.04), F(46.32, T.fija, 1.1, 1.12),
  S(T.fija, 51.37, 1.07), S(51.37, T.dos, 1.0), S(T.dos, 55.7, 1.07), S(55.7, T.ultimo, 1.0),
  S(T.ultimo, T.enviar, 1.07), S(T.enviar, T.utiliza, 1.0), S(T.utiliza, T.haz, 1.07),
  F(T.haz, T.sencillo, 1.0, 1.04), F(T.sencillo, T.gente, 1.08, 1.1),
  F(T.gente, T.comenta, 1.14, 1.16), F(T.comenta, 999, 1.0, 1.05),
];
const FACE_X = 0.537 * 1080;
const FACE_Y = 0.40 * 1920;
const SEAM = 883;
const SPLIT_SRC_TOP = 545;
const PANEL_OPACITY = 0.55; // fondo de la pantalla dividida (v3: semitransparente, pidió 50–60 %)
const shotAt = (t: number) => SHOTS.find((s) => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];
const zoomAt = (t: number) => {
  const s = shotAt(t);
  return s.kind === "full" ? interpolate(t, [s.from, s.to], [s.z0, s.z1], { ...clamp, easing: easeInOut }) : s.z;
};
const isSplit = (t: number) => shotAt(t).kind === "split";

const Camera: React.FC<{ t: number }> = ({ t }) => {
  const s = shotAt(t);
  const video = <OffthreadVideo src={staticFile(`${DIR}/video.mp4`)} style={{ width: 1080, height: 1920 }} />;
  if (s.kind === "full") {
    return <AbsoluteFill style={{ transform: `scale(${zoomAt(t)})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>{video}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: SEAM, width: 1080, height: 1920 - SEAM, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -SPLIT_SRC_TOP, width: 1080, height: 1920, transform: `scale(${s.z})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>{video}</div>
      </div>
      {/* v3: arriba se ve el salón (la parte alta del mismo plano, sin ella) detrás de un blanco al 55 % */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: SEAM, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${SEAM / SPLIT_SRC_TOP})`, transformOrigin: `${FACE_X}px 0px` }}>{video}</div>
        <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${PANEL_OPACITY})` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- subtítulos (sin fondo; fuera en el cierre) ----------
const clean = (w: string) => w.replace(/[.,;:]+$/g, "").replace(/^[,;:]+/, "").replace(/\.\.\.$/, "");
type Block = { text: string; start: number; end: number };
const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ text: cur.map((w) => clean(w.text)).join(" "), start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  WORDS.filter((w) => w.start < T.comenta - 0.05).forEach((w, i, arr) => {
    const prev = cur[cur.length - 1];
    const chars = cur.map((x) => clean(x.text)).join(" ").length + clean(w.text).length + 1;
    if (cur.length && (cur.length >= 3 || chars > 18 || w.start - prev.end > 0.25)) flush();
    cur.push(w);
    if (/[.,?;:»]$/.test(w.text) || /\.\.\.$/.test(w.text) || !arr[i + 1]) flush();
  });
  return out.map((b, i) => ({ ...b, end: Math.min(out[i + 1]?.start ?? b.end + 0.3, b.end + 0.4, T.comenta) }));
})();
const outline = "0 0 2px rgba(0,0,0,0.85), 1px 1px 0 rgba(0,0,0,0.55), -1px 1px 0 rgba(0,0,0,0.55), 1px -1px 0 rgba(0,0,0,0.55), -1px -1px 0 rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.45)";
const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const b = BLOCKS.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const split = isSplit(t) && t >= 0.8; // al sentarse su cabeza ocupa la línea: subtítulo blanco a la altura del pecho
  const pop = interpolate(t, [b.start, b.start + 0.08], [0.6, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: split ? 838 : t < 0.8 ? 1350 : 1190, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 64, lineHeight: 1.1, letterSpacing: "-0.01em", color: split ? C.black : C.white, textShadow: split ? "none" : outline, whiteSpace: "nowrap", opacity: pop }}>{b.text}</div>
    </div>
  );
};

// ---------- dibujos ----------
const shadow = "drop-shadow(0 12px 22px rgba(0,0,0,0.18))";
const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(160deg, #EDEDED, #D6D6D6)", boxShadow: `0 0 0 3px ${C.white}, 0 6px 16px rgba(0,0,0,0.15)`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "32%", top: "20%", width: "36%", height: "36%", borderRadius: "50%", background: "#BDBDBD" }} />
    <div style={{ position: "absolute", left: "18%", top: "62%", width: "64%", height: "60%", borderRadius: "50%", background: "#BDBDBD" }} />
  </div>
);
const Tile: React.FC<{ size: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ size, children, style }) => (
  <div style={{ width: size, height: size, borderRadius: 32, background: C.light, border: `2px solid ${C.border}`, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
const ico = { fill: "none", stroke: C.anthracite, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const Scissors: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" {...ico}><circle cx="28" cy="72" r="13" /><circle cx="72" cy="72" r="13" /><path d="M37 62 L72 14" /><path d="M63 62 L28 14" /></svg>
);
const Dryer: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" {...ico}><path d="M18 30 h44 a18 18 0 0 1 0 36 h-44 z" /><path d="M18 36 h-8 M18 60 h-8" /><path d="M48 66 l6 24 h12 l-4 -24" /><circle cx="62" cy="48" r="7" fill={C.accent} stroke="none" /></svg>
);
const ColorBowl: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" {...ico}><path d="M14 52 h56 a28 22 0 0 1 -56 0 z" fill={C.accent} fillOpacity="0.35" /><path d="M60 46 L88 14" /><path d="M80 10 l12 12" /></svg>
);
const Frizz: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" {...ico}><path d="M20 80 q-8 -20 4 -34 q-6 -18 12 -24 q8 -14 24 -6 q18 -6 22 12 q14 8 6 26 q8 14 -2 26" /><path d="M14 30 l-6 -6 M50 10 v-6 M86 30 l6 -6" stroke={C.accent} /></svg>
);
const Drop: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" {...ico}><path d="M50 10 C34 34 24 48 24 62 a26 26 0 0 0 52 0 C76 48 66 34 50 10 Z" fill={C.accent} fillOpacity="0.3" /><path d="M38 64 a12 12 0 0 0 10 12" /></svg>
);
const Sparkle: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" {...ico}><path d="M50 8 Q54 44 92 50 Q54 56 50 92 Q46 56 8 50 Q46 44 50 8 Z" fill={C.accent} fillOpacity="0.3" /><path d="M82 14 v12 M76 20 h12" /></svg>
);
const Pin: React.FC<{ s: number; color?: string }> = ({ s, color = C.accent }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><path d="M50 94 C24 62 16 50 16 36 a34 34 0 0 1 68 0 C84 50 76 62 50 94 Z" fill={color} /><circle cx="50" cy="36" r="13" fill={C.white} /></svg>
);
const Thumbtack: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}>
    <path d="M30 8 h40 l-6 30 l16 16 h-60 l16 -16 z" fill={C.accent} /><path d="M50 54 v40" stroke={C.anthracite} strokeWidth="6" strokeLinecap="round" />
  </svg>
);
const Cursor: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}>
    <path d="M38 50 V18 a7 7 0 0 1 14 0 V44 l26 6 a8 8 0 0 1 6 9 l-5 25 a10 10 0 0 1 -10 8 H44 a10 10 0 0 1 -8 -4 L18 62 a7 7 0 0 1 10 -10 z" fill={C.white} stroke={C.anthracite} strokeWidth="5" strokeLinejoin="round" />
  </svg>
);
const Num: React.FC<{ t: number; at: number; n: number }> = ({ t, at, n }) => {
  const p = popIn(t, at);
  return (
    <div style={{ position: "absolute", right: 40, top: 214, width: 84, height: 84, borderRadius: "50%", background: C.accent, color: C.white, fontFamily, fontWeight: 700, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", opacity: p.o, transform: `scale(${p.s})`, boxShadow: "0 8px 20px rgba(233,138,85,0.35)", zIndex: 5 }}>{n}</div>
  );
};
const Typed: React.FC<{ t: number; at: number; text: string; dur?: number }> = ({ t, at, text, dur = 0.45 }) => {
  if (t < at) return null;
  const n = Math.round(interpolate(t, [at, at + dur], [0, text.length], clamp));
  return <span style={{ whiteSpace: "pre" }}>{text.slice(0, n)}</span>;
};

// ---------- el perfil inventado (lienzo de 1000 px de ancho) ----------
type R = { x: number; y: number; w: number; h: number };
const OVER: R = { x: -10, y: -20, w: 1020, h: 900 };
const NAME: R = { x: -10, y: 232, w: 1020, h: 110 };
const BIO: R = { x: -10, y: 300, w: 1020, h: 200 };
const GRID: R = { x: -260, y: 850, w: 1520, h: 1020 };
const GRIDTOP: R = { x: 0, y: 846, w: 1000, h: 360 };
const HIGH: R = { x: 0, y: 600, w: 1000, h: 250 };
const LINK: R = { x: -10, y: 400, w: 1020, h: 200 };
const FOCUS: [number, R][] = [
  [0, OVER], [T.primero, NAME], [T.segundo, BIO], [T.tercero, GRID], [T.actualmente, GRID], [T.crea, HIGH],
  [T.cuarto, GRIDTOP], [T.ultimo, LINK],
];
const VIEW = { x: 24, y: 150, w: 1032, h: 640 };
const focusAt = (t: number): R => {
  let i = 0;
  while (i + 1 < FOCUS.length && t >= FOCUS[i + 1][0]) i++;
  const [at, r] = FOCUS[i];
  const prev = i > 0 ? FOCUS[i - 1][1] : r;
  const p = interpolate(t, [at, at + 0.55], [0, 1], { ...clamp, easing: easeInOut });
  return { x: prev.x + (r.x - prev.x) * p, y: prev.y + (r.y - prev.y) * p, w: prev.w + (r.w - prev.w) * p, h: prev.h + (r.h - prev.h) * p };
};
// fotos (foto1-3: color · foto4-6: corte/secado · foto7-9: resultados). Orden inicial mezclado → ordenado por filas.
const START_ORDER = [7, 1, 4, 9, 5, 2, 6, 3, 8];
const TILE = 328, GAP = 8, GRID_Y = 860;
const cellXY = (k: number) => ({ x: (k % 3) * (TILE + GAP), y: GRID_Y + Math.floor(k / 3) * (TILE + GAP) });
const HL_LABELS = ["Equipo", "Salón", "Precios", "Opiniones", "Ofertas"];

const Profile: React.FC<{ t: number }> = ({ t }) => {
  const f = focusAt(t);
  const s = Math.min(VIEW.w / f.w, VIEW.h / f.h);
  const ox = VIEW.x + (VIEW.w - f.w * s) / 2 - f.x * s;
  const oy = VIEW.y + (VIEW.h - f.h * s) / 2 - f.y * s;
  const enter = popIn(t, 0.02);
  // seguir → dejar de seguir
  const unfollowed = t >= T.seguirte + 0.1;
  const tapS = interpolate(t, [T.seguirte - 0.05, T.seguirte + 0.05, T.seguirte + 0.2], [1, 0.86, 1], clamp);
  const curO = lerp(t, 1.9, 2.2, 0, 1) * (1 - lerp(t, 3.3, 3.6, 0, 1));
  const curX = lerp(t, 1.9, T.seguirte - 0.1, 900, 240, easeInOut), curY = lerp(t, 1.9, T.seguirte - 0.1, 760, 520, easeInOut);
  // lupa que recorre el perfil
  const lupaO = lerp(t, T.analizar, T.analizar + 0.25, 0, 1) * (1 - lerp(t, 5.25, 5.5, 0, 1));
  const lu = interpolate(t, [T.analizar, 5.4], [0, 1], { ...clamp, easing: easeInOut });
  const lupaX = 150 + Math.sin(lu * Math.PI * 2) * 300 + lu * 300, lupaY = 120 + lu * 900;
  // nombre
  const nameLine = lerp(t, T.solamente, T.solamente + 0.3, 0, 1, easeInOut);
  const pinP = popIn(t, T.ubicacion);
  // bio
  const strike = lerp(t, T.por, T.por + 0.3, 0, 1, easeInOut);
  const oldBioO = 1 - lerp(t, T.especialidad - 0.1, T.especialidad + 0.1, 0, 1);
  // enlace
  const linkLine = lerp(t, T.enlace, T.enlace + 0.3, 0, 1, easeInOut);
  const linkTap = interpolate(t, [T.reservas, T.reservas + 0.1, T.reservas + 0.25], [1, 0.9, 1], clamp);
  // destacada nueva
  const hlNew = popIn(t, T.destacada);
  const shift = lerp(t, T.destacada - 0.05, T.destacada + 0.3, 0, 1, easeInOut);
  const hlLabel = lerp(t, T.que, T.que + 0.3, 0, 1);
  // cursor perdido por la cuadrícula
  const wanderO = lerp(t, T.actualmente + 0.3, T.actualmente + 0.6, 0, 1) * (1 - lerp(t, T.pero - 0.3, T.pero, 0, 1));
  const w = (t - T.actualmente) * 1.6;
  const wanderX = 500 + Math.sin(w * 1.3) * 380, wanderY = GRID_Y + 500 + Math.sin(w * 2.1 + 1) * 380;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 806, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 94%, transparent 100%)", opacity: enter.o }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 1880, transformOrigin: "0 0", transform: `translate(${ox}px, ${oy + (1 - enter.s) * 60}px) scale(${s})` }}>
        <div style={{ position: "absolute", left: -30, top: -30, width: 1060, height: 1930, borderRadius: 48, background: C.white, border: `2px solid ${C.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.14)" }} />
        {/* cabecera */}
        <div style={{ position: "absolute", left: 30, top: 30 }}>
          <div style={{ width: 190, height: 190, borderRadius: "50%", background: C.light, border: `6px solid ${C.white}`, boxShadow: `0 0 0 4px ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Scissors s={110} /></div>
        </div>
        {["publicaciones", "seguidores", "seguidos"].map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 290 + i * 235, top: 70, width: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ width: 96, height: 38, borderRadius: 10, background: "#D9D9D9" }} />
            <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: C.grey }}>{l}</div>
          </div>
        ))}
        {/* nombre */}
        <div style={{ position: "absolute", left: 30, top: 258, fontFamily, fontWeight: 700, fontSize: 44, color: C.black, whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
          <span style={{ position: "relative" }}>Beauty Hair
            <span style={{ position: "absolute", left: 0, bottom: -8, height: 6, borderRadius: 3, background: C.accent, width: `${nameLine * 100}%` }} />
          </span>
          <Typed t={t} at={T.servicio} text=" · Peluquería" />
          <Typed t={t} at={T.ubicacion} text=" · Tu ciudad" />
          {t >= T.ubicacion ? <span style={{ display: "inline-block", marginLeft: 10, opacity: pinP.o, transform: `scale(${pinP.s})` }}><Pin s={46} /></span> : null}
        </div>
        {/* biografía */}
        <div style={{ position: "absolute", left: 30, top: 328, fontFamily, fontWeight: 600, fontSize: 36, color: C.anthracite, lineHeight: 1.35 }}>
          {oldBioO > 0 ? (
            <div style={{ position: "relative", opacity: oldBioO, display: "inline-block" }}>Creando cabellos bonitos
              <span style={{ position: "absolute", left: -4, top: "52%", height: 6, borderRadius: 3, background: C.accent, width: `calc(${strike * 100}% + 8px)` }} />
            </div>
          ) : (
            <>
              <div><Typed t={t} at={T.especialidad} text="Especialistas en color y rubios" dur={0.6} /></div>
              <div><Typed t={t} at={T.clienta} text="Para pelo fino que busca volumen" dur={0.6} /></div>
            </>
          )}
        </div>
        {/* enlace */}
        <div style={{ position: "absolute", left: 30, top: 440, fontFamily, fontWeight: 600, fontSize: 34, color: "#3B5B8C", display: "flex", alignItems: "center", gap: 12, transform: `scale(${linkTap})`, transformOrigin: "0 50%" }}>
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none" stroke="#3B5B8C" strokeWidth="10" strokeLinecap="round"><path d="M42 58 L58 42" /><path d="M36 44 l-10 10 a14 14 0 0 0 20 20 l10 -10" /><path d="M64 56 l10 -10 a14 14 0 0 0 -20 -20 l-10 10" /></svg>
          <span style={{ position: "relative" }}>beautyhair.com/inicio
            <span style={{ position: "absolute", left: 0, bottom: -6, height: 5, borderRadius: 3, background: C.accent, width: `${linkLine * 100}%` }} />
          </span>
        </div>
        {/* botones */}
        <div style={{ position: "absolute", left: 30, top: 510, display: "flex", gap: 20 }}>
          <div style={{ width: 460, height: 72, borderRadius: 18, background: unfollowed ? C.black : C.light, color: unfollowed ? C.white : C.black, fontFamily, fontWeight: 700, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tapS})` }}>{unfollowed ? "Seguir" : "Siguiendo"}</div>
          <div style={{ width: 460, height: 72, borderRadius: 18, background: C.light, fontFamily, fontWeight: 700, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", color: C.black }}>Mensaje</div>
        </div>
        {/* historias destacadas */}
        {HL_LABELS.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 30 + (i + shift) * 192, top: 630, width: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 136, height: 136, borderRadius: "50%", border: `4px solid ${C.white}`, boxShadow: `0 0 0 3px ${C.border}`, overflow: "hidden", boxSizing: "border-box" }}>
              <Img src={staticFile(`${DIR}/hl${i}.jpg`)} style={{ width: 136, height: 136, objectFit: "cover" }} />
            </div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 24, color: C.grey }}>{l}</div>
          </div>
        ))}
        {t >= T.destacada ? (
          <div style={{ position: "absolute", left: 30, top: 630, width: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: hlNew.o, transform: `scale(${hlNew.s * pulse(t, T.que)})` }}>
            <div style={{ width: 136, height: 136, borderRadius: "50%", background: C.white, border: `6px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 84, color: C.accent }}>?</div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 22, color: C.black, textAlign: "center", lineHeight: 1.15, opacity: hlLabel }}>¿Qué servicio<br />elegir?</div>
          </div>
        ) : null}
        {/* cuadrícula */}
        {START_ORDER.map((ph, k) => {
          const from = cellXY(k), to = cellXY(ph - 1);
          const st = T.organizar + k * 0.08;
          const m = interpolate(t, [st, st + 0.7], [0, 1], { ...clamp, easing: easeInOut });
          const x = from.x + (to.x - from.x) * m, y = from.y + (to.y - from.y) * m;
          const p = { s: pulse(t, T.preciosos + k * 0.07), o: 1 };
          const row = Math.floor((ph - 1) / 3);
          const rowGlow = lerp(t, T.decisiones + row * 0.2, T.decisiones + row * 0.2 + 0.3, 0, 1);
          const pinned = ph - 1 < 3 && t >= T.fijadas + (ph - 1) * 0.15;
          const pinP = lerp(t, T.fijadas + (ph - 1) * 0.15, T.fijadas + (ph - 1) * 0.15 + 0.3, 0, 1, backOut);
          return (
            <div key={ph} style={{ position: "absolute", left: x, top: y, width: TILE, height: TILE, opacity: p.o, transform: `scale(${p.s * (m > 0 && m < 1 ? 0.94 : 1)})`, zIndex: m > 0 && m < 1 ? 2 : 1 }}>
              {ph === 1 ? (
                <div style={{ width: TILE, height: TILE, borderRadius: 6, overflow: "hidden" }}>
                  <Loop durationInFrames={fr(14)} layout="none"><OffthreadVideo src={staticFile(`${DIR}/suyo-color.mp4`)} muted style={{ width: TILE, height: TILE, objectFit: "cover" }} /></Loop>
                </div>
              ) : (
                <Img src={staticFile(`${DIR}/foto${ph}.jpg`)} style={{ width: TILE, height: TILE, objectFit: "cover", borderRadius: 6, boxShadow: rowGlow > 0 && row === 1 ? `0 0 0 ${rowGlow * 8}px ${C.accent}` : "none" }} />
              )}
              {pinned ? <div style={{ position: "absolute", right: 14, top: 10 - (1 - pinP) * 80, opacity: Math.min(1, pinP * 2) }}><Thumbtack s={70} /></div> : null}
            </div>
          );
        })}
        {/* barras de fila (cada fila, una decisión) */}
        {[0, 1, 2].map((r) => {
          const g = lerp(t, T.decisiones + r * 0.2, T.decisiones + r * 0.2 + 0.3, 0, 1);
          return <div key={r} style={{ position: "absolute", left: -22, top: GRID_Y + r * (TILE + GAP) + 20, width: 12, height: (TILE - 40) * g, borderRadius: 6, background: [C.accent, C.anthracite, C.pill][r] }} />;
        })}
        {/* cursor que pulsa «Siguiendo» */}
        {curO > 0 ? <div style={{ position: "absolute", left: curX, top: curY, opacity: curO, transform: `scale(${tapS})` }}><Cursor s={110} /></div> : null}
        {/* lupa */}
        {lupaO > 0 ? (
          <svg width="260" height="260" viewBox="0 0 100 100" style={{ position: "absolute", left: lupaX, top: lupaY, opacity: lupaO, filter: shadow }}>
            <circle cx="42" cy="42" r="28" fill="rgba(255,255,255,0.35)" stroke={C.anthracite} strokeWidth="7" /><path d="M63 63 L88 88" stroke={C.accent} strokeWidth="11" strokeLinecap="round" />
          </svg>
        ) : null}
        {/* cursor perdido */}
        {wanderO > 0 ? <div style={{ position: "absolute", left: wanderX, top: wanderY, opacity: wanderO }}><Cursor s={150} /></div> : null}
      </div>
    </div>
  );
};

// ---------- historia destacada abierta: necesidades → servicios ----------
const StoryScene: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.relaciones || t >= T.cuarto) return null;
  const out = lerp(t, T.cuarto - 0.2, T.cuarto, 0, 1);
  const needs = [Frizz, Drop, Sparkle], servs = [ColorBowl, Scissors, Dryer];
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {[0, 1, 2].map((i) => {
        const y = 230 + i * 190;
        const a = popIn(t, T.necesidades + i * 0.12);
        const b = popIn(t, T.servicios + i * 0.12);
        const glow = lerp(t, T.objetivos + i * 0.1, T.objetivos + i * 0.1 + 0.3, 0, 1);
        const draw = lerp(t, T.servicios + 0.25 + i * 0.15, T.servicios + 0.6 + i * 0.15, 0, 1, easeInOut);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 130, top: y, opacity: a.o, transform: `scale(${a.s})` }}>
              <Tile size={160} style={{ boxShadow: `0 0 0 ${glow * 6}px ${C.accent}, 0 12px 32px rgba(0,0,0,0.12)` }}>{React.createElement(needs[i], { s: 104 })}</Tile>
            </div>
            <svg width="420" height="60" viewBox="0 0 420 60" style={{ position: "absolute", left: 330, top: y + 50, overflow: "visible" }}>
              <path d="M10 30 H390" stroke={C.grey} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
              <path d="M370 12 L398 30 L370 48" fill="none" stroke={C.grey} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={draw > 0.9 ? 1 : 0} />
            </svg>
            <div style={{ position: "absolute", left: 790, top: y, opacity: b.o, transform: `scale(${b.s})` }}>
              <Tile size={160} style={{ background: C.white }}>{React.createElement(servs[i], { s: 104 })}</Tile>
            </div>
          </React.Fragment>
        );
      })}
      {(() => {
        const p = popIn(t, T.relaciones + 0.05);
        return (
          <div style={{ position: "absolute", left: 540 - 60, top: 214, width: 120, height: 120, opacity: p.o * (1 - lerp(t, T.necesidades - 0.2, T.necesidades, 0, 1)), transform: `scale(${p.s})`, borderRadius: "50%", background: C.white, border: `6px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 76, color: C.accent, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}>?</div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ---------- las 3 publicaciones fijadas ----------
const Pinned3: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.fija || t >= T.ultimo) return null;
  const out = lerp(t, T.ultimo - 0.2, T.ultimo, 0, 1);
  const active = t >= T.tresB ? 2 : t >= T.dos ? 1 : t >= T.empieza - 0.1 ? 0 : -1;
  const slider = interpolate(t, [T.resultados, T.transf + 0.4], [0.85, 0.2], { ...clamp, easing: easeInOut });
  const CW = 300, CH = 420;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {[0, 1, 2].map((i) => {
        const p = popIn(t, T.tres + i * 0.12);
        const on = active === i;
        const dim = active >= 0 && !on ? 0.55 : 1;
        const sc = on ? 1.06 : 1;
        const swap = lerp(t, [T.empieza, T.dos, T.tresB][i], [T.empieza, T.dos, T.tresB][i] + 0.3, 0, 1);
        return (
          <div key={i} style={{ position: "absolute", left: 45 + i * (CW + 45), top: 270, width: CW, height: CH, opacity: p.o * dim, transform: `scale(${p.s * sc})`, borderRadius: 32, overflow: "hidden", background: C.light, boxShadow: on ? `0 0 0 7px ${C.accent}, 0 16px 36px rgba(0,0,0,0.2)` : "0 12px 32px rgba(0,0,0,0.12)" }}>
            <div style={{ position: "absolute", inset: 0, opacity: swap, display: "flex", alignItems: "center", justifyContent: "center", background: i === 2 ? C.black : C.light }}>
              {i === 0 ? (
                <div style={{ position: "relative" }}>
                  <Avatar size={170} />
                  <svg width="90" height="90" viewBox="0 0 100 100" style={{ position: "absolute", right: -40, top: -36, transform: `rotate(${Math.sin(t * 9) * 14}deg)`, transformOrigin: "50% 90%" }}>
                    <path d="M30 90 V40 a8 8 0 0 1 16 0 V20 a8 8 0 0 1 16 0 V28 a8 8 0 0 1 16 0 v40 a24 24 0 0 1 -24 24 h-4 a22 22 0 0 1 -20 -12 L14 58 a8 8 0 0 1 14 -8 z" fill={C.accent} />
                  </svg>
                </div>
              ) : i === 1 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {[Scissors, ColorBowl, Dryer].map((Ic, k) => {
                    const q = lerp(t, T.dos + 0.3 + k * 0.25, T.dos + 0.55 + k * 0.25, 0, 1);
                    return (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, opacity: q, transform: `translateX(${(1 - q) * 20}px)` }}>
                        <div style={{ width: 70, height: 70, borderRadius: 18, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic s={50} /></div>
                        <div style={{ width: 130, height: 16, borderRadius: 8, background: "#CFCFCF" }} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <Img src={staticFile(`${DIR}/foto11.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${slider * 100}%`, overflow: "hidden" }}>
                    <Img src={staticFile(`${DIR}/foto10.jpg`)} style={{ position: "absolute", left: 0, top: 0, width: CW, height: CH, objectFit: "cover", filter: "saturate(0.6) brightness(0.92)" }} />
                  </div>
                  <div style={{ position: "absolute", top: 0, bottom: 0, left: `${slider * 100}%`, width: 6, marginLeft: -3, background: C.white }} />
                  <div style={{ position: "absolute", top: CH / 2 - 26, left: `${slider * 100}%`, width: 52, height: 52, marginLeft: -26, borderRadius: "50%", background: C.white, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontFamily, fontWeight: 700, fontSize: 26 }}>‹›</div>
                </>
              )}
            </div>
            <div style={{ position: "absolute", right: 12, top: 8 }}><Thumbtack s={60} /></div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- móvil: web genérica → reserva directa ----------
const PhoneScene: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.enviar || t >= T.haz) return null;
  const p = popIn(t, T.enviar);
  const out = lerp(t, T.haz - 0.2, T.haz, 0, 1);
  const shake = t > T.generica && t < T.generica + 0.4 ? Math.sin((t - T.generica) * 50) * 8 * (1 - (t - T.generica) / 0.4) : 0;
  const swap = lerp(t, T.utiliza, T.utiliza + 0.45, 0, 1, easeInOut);
  const scroll = interpolate(t, [T.enviar + 0.4, T.utiliza], [0, 1], { ...clamp, easing: easeInOut });
  const w = (t - T.enviar) * 1.8;
  const PW = 300, PH = 560;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 540 - PW / 2, top: 222, width: PW, height: PH, opacity: p.o, transform: `scale(${p.s}) translateX(${shake}px)` }}>
        <div style={{ width: PW, height: PH, borderRadius: 46, background: C.anthracite, padding: 12, boxSizing: "border-box", boxShadow: "0 20px 44px rgba(0,0,0,0.28)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", background: C.white, position: "relative" }}>
            {/* web genérica */}
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${-swap * 100}%)` }}>
              <div style={{ height: 54, background: C.light, display: "flex", alignItems: "center", padding: "0 18px", gap: 6, justifyContent: "space-between" }}>
                <div style={{ width: 70, height: 14, borderRadius: 7, background: "#CFCFCF" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{[0, 1, 2].map((k) => <div key={k} style={{ width: 28, height: 4, borderRadius: 2, background: C.anthracite }} />)}</div>
              </div>
              <div style={{ transform: `translateY(${-scroll * 300}px)` }}>
                {Array.from({ length: 6 }).map((_, k) => (
                  <div key={k} style={{ margin: 14 }}>
                    <div style={{ height: 110, borderRadius: 14, background: k % 2 ? "#E2E2E2" : "#D5D5D5" }} />
                    <div style={{ marginTop: 10, width: "80%", height: 10, borderRadius: 5, background: "#E0E0E0" }} />
                    <div style={{ marginTop: 6, width: "60%", height: 10, borderRadius: 5, background: "#E0E0E0" }} />
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", left: 120 + Math.sin(w * 1.4) * 90, top: 260 + Math.sin(w * 2.3) * 160 }}><Cursor s={70} /></div>
            </div>
            {/* reserva directa */}
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - swap) * 100}%)`, padding: 18, boxSizing: "border-box" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[Scissors, ColorBowl, Dryer].map((Ic, k) => {
                  const q = popIn(t, T.utiliza + 0.35 + k * 0.15);
                  const sel = k === 1 && t > T.horarios - 0.2;
                  return (
                    <div key={k} style={{ height: 66, borderRadius: 16, background: sel ? "#FBE8DD" : C.light, border: `3px solid ${sel ? C.accent : C.border}`, display: "flex", alignItems: "center", gap: 12, padding: "0 12px", opacity: q.o, transform: `scale(${q.s})` }}>
                      <Ic s={42} /><div style={{ width: 110, height: 12, borderRadius: 6, background: "#CFCFCF" }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {Array.from({ length: 9 }).map((_, k) => {
                  const q = popIn(t, T.horarios + k * 0.04);
                  const free = [0, 2, 4, 5, 7].includes(k);
                  const on = free && t > T.disponibles + 0.1;
                  return <div key={k} style={{ height: 46, borderRadius: 12, background: on ? C.accent : free ? C.white : C.light, border: `2px solid ${on ? C.accent : C.border}`, opacity: q.o * (free ? 1 : 0.5), transform: `scale(${q.s})` }} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- detrás de ella ----------
const BackZona: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.asi || t >= T.segundo) return null;
  const out = lerp(t, T.segundo - 0.25, T.segundo, 0, 1);
  const roads = lerp(t, T.asi, T.asi + 0.6, 0, 1, easeInOut);
  const pin = popIn(t, T.asi + 0.1);
  const starts = [[60, 300], [1020, 260], [80, 720], [1000, 760], [300, 120], [800, 130]];
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {["M0 380 H1080", "M0 600 C300 560 700 650 1080 590", "M260 0 V1100", "M820 0 C800 400 860 700 840 1100", "M0 180 L1080 520"].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={C.white} strokeOpacity="0.55" strokeWidth={i < 2 ? 18 : 12} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - roads} />
        ))}
      </svg>
      {starts.map(([sx, sy], i) => {
        const st = T.clientas + i * 0.12;
        const u = interpolate(t, [st, T.rapido + 0.5 + i * 0.05], [0, 1], { ...clamp, easing: easeInOut });
        const a = (i / starts.length) * Math.PI * 2;
        const tx = 540 + Math.cos(a) * 190, ty = 350 + Math.sin(a) * 110;
        const p = popIn(t, st);
        return <div key={i} style={{ position: "absolute", left: sx + (tx - sx) * u - 40, top: sy + (ty - sy) * u - 40, opacity: p.o, transform: `scale(${p.s})` }}><Avatar size={80} /></div>;
      })}
      <div style={{ position: "absolute", left: 540 - 75, top: 250, opacity: pin.o, transform: `scale(${pin.s * pulse(t, T.donde)}) translateY(${Math.sin(t * 3) * 6}px)`, filter: shadow }}><Pin s={150} /></div>
    </AbsoluteFill>
  );
};
const BackDuda: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.pero || t >= T.crea) return null;
  const out = lerp(t, T.crea - 0.2, T.crea, 0, 1);
  const draw = lerp(t, T.pero + 0.05, T.claro + 0.2, 0, 1, easeInOut);
  const dot = popIn(t, T.claro + 0.2);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {[0, 1].map((i) => {
        const p = popIn(t, T.pero + 0.1 + i * 0.1);
        const x = [130, 780][i], y = [300, 420][i];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin(t * 2.4 + i) * 10, opacity: p.o * 0.95, transform: `scale(${p.s}) rotate(${(i % 2 ? 6 : -6) + Math.sin(t * 1.8 + i) * 4}deg)` }}>
            <Img src={staticFile(`${DIR}/duda${i + 1}.jpg`)} style={{ width: 190, height: 190, borderRadius: 22, objectFit: "cover", boxShadow: "0 0 0 5px #fff, 0 12px 26px rgba(0,0,0,0.25)" }} />
          </div>
        );
      })}
      <svg width="300" height="400" viewBox="0 0 100 133" style={{ position: "absolute", left: 540 - 150, top: 150, overflow: "visible", filter: shadow }}>
        <path d="M22 38 a28 28 0 1 1 42 24 c-10 6 -14 12 -14 24" fill="none" stroke={C.accent} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        <circle cx="50" cy="112" r="9" fill={C.accent} opacity={dot.o} />
      </svg>
    </AbsoluteFill>
  );
};
const BackRecepcion: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.lasPub || t >= T.fija) return null;
  const out = lerp(t, T.fija - 0.2, T.fija, 0, 1);
  const desk = popIn(t, T.lasPub + 0.1);
  const bell = popIn(t, T.recepcion - 0.15);
  const ring = t > T.recepcion ? Math.sin((t - T.recepcion) * 40) * 12 * Math.exp(-(t - T.recepcion) * 4) : 0;
  const waves = lerp(t, T.recepcion, T.recepcion + 0.5, 0, 1);
  const cards = [0, 1, 2].map((i) => popIn(t, T.estrateg + i * 0.12));
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 540 - 380, top: 330, opacity: desk.o, transform: `scale(${desk.s})`, filter: shadow }}>
        <svg width="760" height="300" viewBox="0 0 760 300">
          <rect x="20" y="90" width="720" height="34" rx="14" fill={C.white} />
          <rect x="60" y="124" width="640" height="176" rx="12" fill={C.anthracite} />
          <path d="M60 170 H700" stroke={C.accent} strokeWidth="10" />
          <rect x="300" y="200" width="160" height="70" rx="10" fill="none" stroke="#404040" strokeWidth="5" />
          <path d="M560 90 v-40 m-14 0 h28" stroke={C.anthracite} strokeWidth="6" strokeLinecap="round" />
          <path d="M520 50 q40 -50 80 0 z" fill="#8DB38A" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 230, top: 262, opacity: bell.o, transform: `scale(${bell.s}) rotate(${ring}deg)`, transformOrigin: "50% 100%" }}>
        <svg width="150" height="170" viewBox="0 0 100 113">
          <circle cx="50" cy="16" r="7" fill={C.anthracite} /><path d="M12 92 a38 38 0 0 1 76 0 z" fill={C.accent} /><rect x="4" y="92" width="92" height="12" rx="6" fill={C.anthracite} />
        </svg>
      </div>
      {waves > 0 && waves < 1 ? (
        <svg width="300" height="200" viewBox="0 0 300 200" style={{ position: "absolute", left: 155, top: 200, opacity: 1 - waves }}>
          <path d={`M${60 - waves * 30} 120 q-20 -40 0 -80`} fill="none" stroke={C.white} strokeWidth="8" strokeLinecap="round" />
          <path d={`M${240 + waves * 30} 120 q20 -40 0 -80`} fill="none" stroke={C.white} strokeWidth="8" strokeLinecap="round" />
        </svg>
      ) : null}
      {cards.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: 600 + i * 80, top: 200 - i * 10, opacity: p.o, transform: `scale(${p.s}) rotate(${(i - 1) * 8}deg)` }}>
          <div style={{ width: 130, height: 160, borderRadius: 16, background: C.white, boxShadow: "0 10px 22px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>{React.createElement([Avatar, Scissors, Sparkle][i] as React.FC<{ s: number; size: number }>, { s: 80, size: 80 })}</div>
          <div style={{ position: "absolute", right: -10, top: -22 }}><Thumbtack s={50} /></div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
const BackPaso: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.haz || t >= T.gente) return null;
  const out = lerp(t, T.gente - 0.25, T.gente, 0, 1);
  const draw = lerp(t, T.haz + 0.05, T.haz + 0.9, 0, 1, easeInOut);
  const straight = lerp(t, T.sencillo, T.sencillo + 0.6, 0, 1, easeInOut);
  const check = popIn(t, T.soloPaso - 0.45);
  const tick = lerp(t, T.soloPaso - 0.35, T.soloPaso - 0.05, 0, 1, easeInOut);
  // camino enredado → recto
  const pts = Array.from({ length: 9 }).map((_, i) => {
    const x = 110 + i * 100;
    const y = 400 + (i % 2 ? -1 : 1) * [0, 120, 160, 110, 170, 100, 150, 90, 0][i] * (1 - straight);
    return `${x} ${y}`;
  });
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width="1080" height="900" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M${pts.join(" L")}`} fill="none" stroke={C.white} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        <circle cx="110" cy="400" r="22" fill={C.anthracite} opacity={draw > 0 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", left: 910 - 85, top: 400 - 85, width: 170, height: 170, borderRadius: "50%", background: C.accent, opacity: check.o, transform: `scale(${check.s})`, boxShadow: "0 12px 30px rgba(233,138,85,0.45)" }}>
        <svg width="170" height="170" viewBox="0 0 100 100"><path d="M28 52 L44 67 L73 36" fill="none" stroke={C.white} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - tick} /></svg>
      </div>
    </AbsoluteFill>
  );
};

// ---------- vídeos de Pexels detrás del hombro, uno por palabra ----------
const BACK = { w: 600, h: 1067, top: 300, opacity: 0.6, x: { left: 20, right: 460 } };
const BackWindow: React.FC<{ t: number; start: number; end: number; side: "left" | "right"; children: React.ReactNode }> = ({ t, start, end, side, children }) => {
  if (t < start || t >= end) return null;
  const p = lerp(t, start, start + 0.35, 0, 1, easeInOut);
  const op = lerp(t, start, start + 0.25, 0, 1);
  const out = lerp(t, end - 0.15, end, 0, 1);
  return (
    <div style={{ position: "absolute", left: BACK.x[side], top: BACK.top, width: BACK.w, height: BACK.h, borderRadius: 36, overflow: "hidden", opacity: BACK.opacity * op * (1 - out), transform: `scale(${0.96 + 0.04 * p})`, transformOrigin: "50% 30%", boxShadow: "0 12px 32px rgba(0,0,0,0.20)" }}>{children}</div>
  );
};
const Clip: React.FC<{ file: string; start: number; end: number; trim?: number }> = ({ file, start, end, trim = 0 }) => (
  <Sequence from={fr(start)} durationInFrames={Math.max(1, fr(end - start))} layout="none">
    <OffthreadVideo src={staticFile(`${DIR}/${file}`)} muted trimBefore={fr(trim)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  </Sequence>
);
const EXAMPLES: { file: string; at: number; end: number; side: "left" | "right"; trim: number }[] = [
  { file: "pexels-8225731.mp4", at: T.cortes - 0.1, end: T.colores - 0.05, side: "left", trim: 1 },
  { file: "pexels-3996891.mp4", at: T.colores - 0.05, end: T.tratamientos - 0.05, side: "right", trim: 2 },
  { file: "pexels-6501452.mp4", at: T.tratamientos - 0.05, end: T.peinados - 0.05, side: "left", trim: 3 },
  { file: "pexels-7440184.mp4", at: T.peinados - 0.05, end: T.actualmente, side: "right", trim: 2 },
];

// Recorte de ella (WebM con alfa, mismo tiempo que el corte) con la MISMA cámara.
const MATTES = [
  { name: "zona", from: 10.4, to: 14.2, show: [T.asi, T.segundo] },
  { name: "ejemplos", from: 28.1, to: 30.7, show: [T.ejemplo, T.actualmente] },
  { name: "duda", from: 33.8, to: 35.9, show: [T.pero, T.crea] },
  { name: "recepcion", from: 44.2, to: 48.5, show: [T.lasPub, T.fija] },
  { name: "paso", from: 68.0, to: 72.4, show: [T.haz, T.gente] },
];
const Cutouts: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ transform: `scale(${zoomAt(t)})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>
    {MATTES.map((m) =>
      t >= m.show[0] && t < m.show[1] ? (
        <Sequence key={m.name} from={fr(m.from)} durationInFrames={fr(m.to - m.from)} layout="none">
          <OffthreadVideo src={staticFile(`${DIR}/matte-${m.name}.webm`)} transparent muted style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />
        </Sequence>
      ) : null,
    )}
  </AbsoluteFill>
);

// Al sentarse (0–1,2 s) ella va recortada ENCIMA de la pantalla dividida, con la misma cámara del plano dividido.
const SitCutout: React.FC<{ t: number }> = ({ t }) => {
  if (t >= 1.2) return null;
  const s = shotAt(t);
  const z = s.kind === "split" ? s.z : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: SEAM - SPLIT_SRC_TOP, width: 1080, height: 1920, transform: `scale(${z})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>
      <OffthreadVideo src={staticFile(`${DIR}/matte-sentarse.webm`)} transparent muted style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />
    </div>
  );
};

// ---------- cierre: solo «RESERVA» ----------
const gradText: React.CSSProperties = {
  fontFamily, fontWeight: 700, letterSpacing: "-0.02em",
  backgroundImage: `linear-gradient(180deg, ${C.gradTop} 0%, ${C.gradBottom} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
};
const CtaWord: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.comenta) return null;
  const inP = lerp(t, T.comenta, T.comenta + 0.3, 0, 1);
  return (
    <div style={{ position: "absolute", top: 240, left: 0, right: 0, textAlign: "center", opacity: inP, transform: `translateY(${(1 - inP) * 20}px) scale(${pulse(t, 76.11)})`, filter: `blur(${(1 - inP) * 8}px) drop-shadow(0 4px 18px rgba(0,0,0,0.45))` }}>
      <div style={{ ...gradText, fontSize: 140, lineHeight: 1.05 }}>«RESERVA»</div>
    </div>
  );
};

// ---------- sonido: variado y bajito en cada animación ----------
const LIB: Record<string, { peak: number; target: number; start: number }> = {
  "pop.mp3": { peak: -4.6, target: -35.5, start: 0.089 }, "pop2.mp3": { peak: -2.5, target: -35.5, start: 0.089 },
  "tick.mp3": { peak: -12.1, target: -36.5, start: 0.041 }, "stamp.mp3": { peak: -2.3, target: -34.5, start: 0.021 },
  "count.wav": { peak: -11.8, target: -38.5, start: 0.041 }, "whoosh.mp3": { peak: -5.3, target: -38.5, start: 0.025 },
  "swishA.mp3": { peak: -21.6, target: -38, start: 0.51 }, "swishB.mp3": { peak: -18.1, target: -38, start: 0.46 },
  "swishC.mp3": { peak: -0.3, target: -38, start: 0 }, "trazo.mp3": { peak: -24.6, target: -39, start: 0.26 },
  "notaE2.mp3": { peak: -5.3, target: -39, start: 0 }, "notaG2.mp3": { peak: -9, target: -39, start: 0 },
  "notaC3.mp3": { peak: -4.4, target: -39, start: 0 }, "notaC4.mp3": { peak: -6.5, target: -39, start: 0 },
  "click.mp3": { peak: -12, target: -38, start: 0 },
};
const CUES: [string, number, string][] = [
  ["pop.mp3", 0.05, "entra el perfil"], ["click.mp3", T.seguirte, "deja de seguir"], ["swishA.mp3", T.analizar, "lupa"],
  ["whoosh.mp3", T.primero, "zoom al nombre"], ["tick.mp3", T.servicio, "· Peluquería"], ["pop2.mp3", T.ubicacion, "ubicación"],
  ["trazo.mp3", T.asi, "mapa detrás"], ["notaE2.mp3", T.clientas, "clientas"], ["notaC4.mp3", T.donde, "pin"],
  ["whoosh.mp3", T.segundo, "zoom a la bio"], ["stamp.mp3", T.por, "se tacha la bio"], ["tick.mp3", T.especialidad, "bio nueva"],
  ["swishB.mp3", T.tercero, "zoom a las fotos"], ["count.wav", T.preciosos, "fotos brillan"], ["swishC.mp3", T.organizar, "se ordenan"], ["notaG2.mp3", T.decisiones, "filas"],
  ["pop.mp3", T.cortes - 0.1, "cortes"], ["pop2.mp3", T.colores - 0.05, "colores"], ["notaC3.mp3", T.tratamientos - 0.05, "tratamientos"], ["notaC4.mp3", T.peinados - 0.05, "peinados"],
  ["swishA.mp3", T.actualmente, "cursor perdido"], ["trazo.mp3", T.pero + 0.05, "? que se dibuja"],
  ["whoosh.mp3", T.crea, "zoom a destacadas"], ["pop2.mp3", T.destacada, "destacada nueva"], ["pop.mp3", T.relaciones, "historia"],
  ["tick.mp3", T.necesidades, "necesidades"], ["trazo.mp3", T.servicios + 0.25, "flechas"],
  ["swishB.mp3", T.cuarto, "zoom a fijadas"], ["notaE2.mp3", T.fijadas, "chinchetas"],
  ["pop.mp3", T.lasPub + 0.1, "recepción"], ["notaC4.mp3", T.recepcion, "campanita"], ["tick.mp3", T.estrateg, "3 fijadas"],
  ["pop2.mp3", T.tres, "3 tarjetas"], ["notaG2.mp3", T.empieza, "Empieza aquí"], ["notaC3.mp3", T.dos, "servicios"], ["swishC.mp3", T.tresB, "antes/después"],
  ["whoosh.mp3", T.ultimo, "zoom al enlace"], ["click.mp3", T.reservas, "toque enlace"], ["pop.mp3", T.enviar, "móvil"], ["stamp.mp3", T.generica, "web genérica"],
  ["swishA.mp3", T.utiliza, "reserva directa"], ["count.wav", T.horarios, "horas libres"],
  ["trazo.mp3", T.haz + 0.05, "camino"], ["swishB.mp3", T.sencillo, "se endereza"], ["tick.mp3", T.soloPaso - 0.45, "✓"],
  ["pop2.mp3", T.comenta, "«RESERVA»"],
];
const SND = CUES.map(([file, at, what]) => {
  const l = LIB[file];
  return { file, at, start: l.start, gain_db: Math.round((l.target - l.peak - 1.5) * 10) / 10, what };
});
console.log("SND_JSON_FWIF2897 " + JSON.stringify(SND));

const SPLIT_OVERLAY = (t: number) => (t >= T.relaciones && t < T.cuarto) || (t >= T.fija && t < T.ultimo) || (t >= T.enviar && t < T.haz);
const NUMS: [number, number, number][] = [[T.primero, T.asi, 1], [T.segundo, T.tercero, 2], [T.tercero, T.ejemplo, 3], [T.cuarto, T.lasPub, 4], [T.ultimo, T.enviar, 5]];

export const ReelFWIF2897: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const split = isSplit(t);
  const num = NUMS.find(([a, b]) => t >= a && t < b);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Camera t={t} />
      {EXAMPLES.map((e) => (
        <BackWindow key={e.file} t={t} side={e.side} start={e.at} end={e.end}>
          <Clip file={e.file} start={e.at} end={e.end} trim={e.trim} />
        </BackWindow>
      ))}
      <BackZona t={t} />
      <BackDuda t={t} />
      <BackRecepcion t={t} />
      <BackPaso t={t} />
      <Cutouts t={t} />
      {split && !SPLIT_OVERLAY(t) ? <Profile t={t} /> : null}
      {split ? <StoryScene t={t} /> : null}
      {split ? <Pinned3 t={t} /> : null}
      {split ? <PhoneScene t={t} /> : null}
      {split && num ? <Num t={t} at={num[0]} n={num[2]} /> : null}
      <SitCutout t={t} />
      <CtaWord t={t} />
      <Subtitles t={t} />
    </AbsoluteFill>
  );
};
