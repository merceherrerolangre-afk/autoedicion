// Reel BRMC4311 v3 · «3 cosas que no haría». Cambios que pidió el 9 de noviembre de 2026 sobre la v2:
// - lo que ya dicen los subtítulos no se repite en pantalla: animaciones visuales, como mucho símbolos sueltos;
// - gancho: 3 tarjetas con «?» naranja que flotan, se tachan en «no haría» y se esfuman;
// - pantallas divididas solo con dibujos en movimiento (sin frases);
// - estrategia, 8 años y fugas: animaciones detrás de ella (sin bocadillos, ni vídeo, ni pantalla dividida);
// - feed de Instagram suyo en el punto 2; miniatura más grande y con movimiento;
// - cierre sin subtítulos, solo «FUGA» grande; vídeo de Pexels nuevo detrás del hombro.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import captions from "./data/BRMC4311v2-captions.json";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });

const C = {
  white: "#FFFFFF",
  light: "#F3F3F3",
  border: "#E5E5E5",
  black: "#111111",
  anthracite: "#242424",
  grey: "#777777",
  pill: "#B3B3B3",
  accent: "#E98A55",
  gradTop: "#F6F2E8",
  gradBottom: "#B9AEA4",
};
const DIR = "BRMC4311/v2";
export const FPS_BRMC4311V3 = 30;
export const DURATION_S_BRMC4311V3 = (captions as { duration: number }).duration;

type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (captions as { words: Word[] }).words;

const easeOut = Easing.out(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
const backOut = Easing.out(Easing.back(1.6));
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fr = (s: number) => Math.round(s * FPS_BRMC4311V3);
const lerp = (t: number, a: number, b: number, v0: number, v1: number, easing = easeOut) =>
  interpolate(t, [a, b], [v0, v1], { ...clamp, easing });
/** Aparece con un pequeño rebote (escala 0.6→1) y fundido en 300 ms. */
const popIn = (t: number, at: number) => ({ s: lerp(t, at, at + 0.3, 0.6, 1, backOut), o: lerp(t, at, at + 0.2, 0, 1) });
const pulse = (t: number, at: number) =>
  interpolate(t, [at, at + 0.11, at + 0.22], [1, 1.06, 1], { ...clamp, easing: easeInOut });

// ---------- momentos (segundos del reel, de captions.json) ----------
const T = {
  no: 0.76,
  salon: 2.22,
  salones: 3.52,
  uno: 4.4,
  citasX: 6.1,
  enCambio: 6.52,
  potenciar: 7.52,
  clientes: 9.54,
  ganancias: 10.65,
  asi: 11.3,
  dos: 13.033,
  instagram: 15.24,
  noLlegaba: 17.14,
  nadie: 17.6,
  noSabia: 17.9,
  estrategia: 19.56,
  publicase: 20.91,
  nuevasCitas: 21.75,
  tres: 22.433,
  precios: 23.85,
  ojo: 24.23,
  copiando: 24.8,
  despues: 25.733,
  ocho: 26.46,
  cuenta: 28.38,
  fugas: 29.46,
  video: 30.733,
  lasQue: 32.63,
  como: 33.66,
  cta: 34.633,
  comenta: 34.7,
};

// ---------- cámara: un cambio de plano cada ~1,5–2,5 s ----------
type Shot =
  | { from: number; to: number; kind: "full"; z0: number; z1: number }
  | { from: number; to: number; kind: "split"; z: number };
const SHOTS: Shot[] = [
  { from: 0, to: 1.3, kind: "full", z0: 1.0, z1: 1.02 },
  { from: 1.3, to: 2.9, kind: "full", z0: 1.1, z1: 1.12 },
  { from: 2.9, to: T.uno, kind: "full", z0: 1.0, z1: 1.04 },
  { from: T.uno, to: 6.4, kind: "split", z: 1.0 },
  { from: 6.4, to: 9.5, kind: "split", z: 1.07 },
  { from: 9.5, to: T.asi, kind: "split", z: 1.0 },
  { from: T.asi, to: T.dos, kind: "full", z0: 1.0, z1: 1.06 },
  { from: T.dos, to: 15.567, kind: "split", z: 1.0 },
  { from: 15.567, to: T.noSabia, kind: "split", z: 1.07 },
  { from: T.noSabia, to: 19.167, kind: "full", z0: 1.0, z1: 1.03 },
  { from: 19.167, to: 21.267, kind: "full", z0: 1.06, z1: 1.04 },
  { from: 21.267, to: T.tres, kind: "full", z0: 1.0, z1: 1.03 },
  { from: T.tres, to: 23.033, kind: "split", z: 1.0 },
  { from: 23.033, to: T.despues, kind: "split", z: 1.07 },
  { from: T.despues, to: 28.1, kind: "full", z0: 1.0, z1: 1.04 },
  { from: 28.1, to: T.fugas, kind: "full", z0: 1.08, z1: 1.1 },
  { from: T.fugas, to: T.video, kind: "full", z0: 1.14, z1: 1.16 },
  { from: T.video, to: 31.633, kind: "split", z: 1.0 },
  { from: 31.633, to: T.cta, kind: "split", z: 1.07 },
  { from: T.cta, to: 99, kind: "full", z0: 1.0, z1: 1.05 },
];
const FACE_X = 0.55 * 1080;
const FACE_Y = 0.41 * 1920;
const SEAM = 883;
const SPLIT_SRC_TOP = 545;

const shotAt = (t: number) => SHOTS.find((s) => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];
const zoomAt = (t: number) => {
  const s = shotAt(t);
  return s.kind === "full" ? interpolate(t, [s.from, s.to], [s.z0, s.z1], { ...clamp, easing: easeInOut }) : s.z;
};

const Camera: React.FC<{ t: number }> = ({ t }) => {
  const s = shotAt(t);
  const video = <OffthreadVideo src={staticFile(`${DIR}/video.mp4`)} style={{ width: 1080, height: 1920 }} />;
  if (s.kind === "full") {
    return <AbsoluteFill style={{ transform: `scale(${zoomAt(t)})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>{video}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: SEAM, width: 1080, height: 1920 - SEAM, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -SPLIT_SRC_TOP, width: 1080, height: 1920, transform: `scale(${s.z})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>
          {video}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: SEAM, background: C.white }} />
    </AbsoluteFill>
  );
};

// ---------- subtítulos (sin fondo; se quitan en el cierre «Comenta FUGA…») ----------
const SOLO = new Set(["estrategia", "ganancias"]);
const clean = (w: string) => w.replace(/[.,;:]+$/g, "").replace(/^[,;:]+/, "");
const norm = (w: string) => clean(w).toLowerCase().replace(/[¿?¡!«»]/g, "");
type Block = { text: string; start: number; end: number; solo: boolean };
const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ text: cur.map((w) => clean(w.text)).join(" "), start: cur[0].start, end: cur[cur.length - 1].end, solo: cur.length === 1 && SOLO.has(norm(cur[0].text)) });
    cur = [];
  };
  WORDS.filter((w) => w.start < T.comenta - 0.05).forEach((w, i, arr) => {
    if (SOLO.has(norm(w.text))) {
      flush();
      cur = [w];
      flush();
      return;
    }
    const prev = cur[cur.length - 1];
    const chars = cur.map((x) => clean(x.text)).join(" ").length + clean(w.text).length + 1;
    if (cur.length && (cur.length >= 3 || chars > 18 || w.start - prev.end > 0.25)) flush();
    cur.push(w);
    if (/[.,?;:»]$/.test(w.text) || !arr[i + 1]) flush();
  });
  return out.map((b, i) => ({ ...b, end: Math.min(out[i + 1]?.start ?? b.end + 0.3, b.end + 0.4, T.comenta) }));
})();

const outline =
  "0 0 2px rgba(0,0,0,0.85), 1px 1px 0 rgba(0,0,0,0.55), -1px 1px 0 rgba(0,0,0,0.55), 1px -1px 0 rgba(0,0,0,0.55), -1px -1px 0 rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.45)";
const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const b = BLOCKS.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const split = shotAt(t).kind === "split";
  const pop = interpolate(t, [b.start, b.start + 0.08], [0.6, 1], { ...clamp, easing: easeOut });
  const scale = b.solo ? pulse(t, b.start) : 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: split ? 835 : 510, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 64, lineHeight: 1.1, letterSpacing: "-0.01em", color: split ? C.black : C.white, textShadow: split ? "none" : outline, whiteSpace: "nowrap", opacity: pop, transform: `scale(${scale})` }}>
        {b.text}
      </div>
    </div>
  );
};

// ---------- dibujos (SVG propios) ----------
const shadow = "drop-shadow(0 12px 22px rgba(0,0,0,0.18))";
const Store: React.FC<{ size: number; on?: number }> = ({ size, on = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: shadow }}>
    <rect x="12" y="38" width="76" height="54" rx="6" fill={C.white} stroke={C.anthracite} strokeWidth="4" />
    <path d="M8 22 H92 L88 40 H12 Z" fill={C.white} stroke={C.anthracite} strokeWidth="4" strokeLinejoin="round" />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${12 + i * 20} 22 h10 l-1 18 h-9 z`} fill={C.accent} opacity={on} />
    ))}
    <path d="M12 40 q9 10 19 0 q10 10 19 0 q10 10 19 0 q10 10 19 0" fill="none" stroke={C.anthracite} strokeWidth="4" />
    <rect x="40" y="60" width="20" height="32" rx="3" fill={C.anthracite} />
    <rect x="66" y="58" width="14" height="14" rx="3" fill={C.light} stroke={C.anthracite} strokeWidth="3" />
  </svg>
);
const Coin: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #F6B489, ${C.accent} 60%, #C96A38)`, boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.35), 0 6px 14px rgba(0,0,0,0.2)", color: C.white, fontFamily, fontWeight: 700, fontSize: size * 0.55, display: "flex", alignItems: "center", justifyContent: "center" }}>€</div>
);
const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(160deg, #EDEDED, #D6D6D6)", boxShadow: `0 0 0 3px ${C.white}, 0 6px 16px rgba(0,0,0,0.15)`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "32%", top: "20%", width: "36%", height: "36%", borderRadius: "50%", background: "#BDBDBD" }} />
    <div style={{ position: "absolute", left: "18%", top: "62%", width: "64%", height: "60%", borderRadius: "50%", background: "#BDBDBD" }} />
  </div>
);
const Tile: React.FC<{ size: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ size, children, style }) => (
  <div style={{ width: size, height: size, borderRadius: 32, background: C.light, border: `2px solid ${C.border}`, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
const Scissors: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={C.anthracite} strokeWidth="6" strokeLinecap="round">
    <circle cx="28" cy="72" r="13" /><circle cx="72" cy="72" r="13" />
    <path d="M37 62 L72 14" /><path d="M63 62 L28 14" />
  </svg>
);
const Dryer: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={C.anthracite} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 30 h44 a18 18 0 0 1 0 36 h-44 z" /><path d="M18 36 h-8 M18 60 h-8" /><path d="M48 66 l6 24 h12 l-4 -24" />
    <circle cx="62" cy="48" r="7" fill={C.accent} stroke="none" />
  </svg>
);
const ColorBowl: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={C.anthracite} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 52 h56 a28 22 0 0 1 -56 0 z" fill={C.accent} fillOpacity="0.35" /><path d="M60 46 L88 14" /><path d="M80 10 l12 12" />
  </svg>
);
const Eye: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={C.anthracite} strokeWidth="6" strokeLinejoin="round">
    <path d="M6 50 Q50 6 94 50 Q50 94 6 50 Z" fill={C.white} /><circle cx="50" cy="50" r="15" fill={C.anthracite} />
  </svg>
);
const Bulb: React.FC<{ s: number; glow: number }> = ({ s, glow }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={C.anthracite} strokeWidth="5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${24 * glow}px rgba(246,180,137,${0.9 * glow}))` }}>
    <path d="M50 10 a28 28 0 0 1 16 51 v9 h-32 v-9 a28 28 0 0 1 16 -51 z" fill={C.white} />
    <path d="M38 78 h24 M41 87 h18" />
    <path d="M42 50 l8 10 l8 -10" stroke={C.accent} />
  </svg>
);
const CalendarIcon: React.FC<{ s: number; checks: number[] }> = ({ s, checks }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ filter: shadow }}>
    <rect x="8" y="14" width="84" height="78" rx="10" fill={C.white} stroke={C.anthracite} strokeWidth="4" />
    <path d="M8 24 a10 10 0 0 1 10 -10 h64 a10 10 0 0 1 10 10 v8 h-84 z" fill={C.accent} />
    <path d="M30 6 v16 M70 6 v16" stroke={C.anthracite} strokeWidth="5" strokeLinecap="round" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${16 + i * 26} 48)`}>
        <rect width="20" height="20" rx="4" fill={C.light} stroke={C.border} strokeWidth="2" />
        <path d="M4 10 l5 5 l8 -10" fill="none" stroke={C.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - (checks[i] ?? 0)} />
      </g>
    ))}
    {[0, 1, 2].map((i) => (
      <rect key={i} x={16 + i * 26} y="72" width="20" height="12" rx="3" fill={C.light} />
    ))}
  </svg>
);
const PostTile: React.FC<{ s: number; hue: number }> = ({ s, hue }) => (
  <div style={{ width: s, height: s, borderRadius: 18, background: `linear-gradient(150deg, hsl(${hue} 45% 82%), hsl(${hue} 35% 62%))`, boxShadow: "0 0 0 4px #fff, 0 10px 22px rgba(0,0,0,0.22)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "30%", top: "22%", width: "40%", height: "40%", borderRadius: "50%", background: "rgba(255,255,255,0.55)" }} />
    <div style={{ position: "absolute", left: "12%", bottom: "-20%", width: "76%", height: "50%", borderRadius: "50%", background: "rgba(255,255,255,0.45)" }} />
  </div>
);
/** Tacha en X que se dibuja (dos trazos de 200 ms). */
const Cross: React.FC<{ t: number; at: number; size: number; color?: string; width?: number }> = ({ t, at, size, color = C.accent, width = 14 }) => {
  const a = lerp(t, at, at + 0.18, 1, 0);
  const b = lerp(t, at + 0.12, at + 0.3, 1, 0);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -size / 2, marginTop: -size / 2, overflow: "visible" }}>
      <path d="M14 14 L86 86" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={a} />
      <path d="M86 14 L14 86" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={b} />
    </svg>
  );
};
const Num: React.FC<{ t: number; at: number; n: number }> = ({ t, at, n }) => {
  const p = popIn(t, at);
  return (
    <div style={{ position: "absolute", left: 60, top: 236, width: 84, height: 84, borderRadius: "50%", background: C.accent, color: C.white, fontFamily, fontWeight: 700, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", opacity: p.o, transform: `scale(${p.s})`, boxShadow: "0 8px 20px rgba(233,138,85,0.35)" }}>{n}</div>
  );
};

// ---------- 0 · gancho: 3 tarjetas «?» que flotan, se tachan en «no haría» y se esfuman; luego 5 salones ----------
const HookCards: React.FC<{ t: number }> = ({ t }) => {
  if (t > 2.4) return null;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const cx = 250 + i * 290;
        const p = popIn(t, 0.02 + i * 0.1);
        const bob = Math.sin(t * 2.6 + i * 1.7) * 12;
        const rot = Math.sin(t * 1.9 + i) * 5 + (i - 1) * 4;
        const crossAt = T.no + 0.05 + i * 0.1;
        const shake = t > crossAt && t < crossAt + 0.3 ? Math.sin((t - crossAt) * 60) * 6 * (1 - (t - crossAt) / 0.3) : 0;
        const goneAt = 1.55 + i * 0.12;
        const gone = lerp(t, goneAt, goneAt + 0.45, 0, 1, easeIn);
        return (
          <div key={i} style={{ position: "absolute", left: cx - 95, top: 226 + bob - gone * 60, width: 190, height: 236, opacity: p.o * (1 - gone), transform: `scale(${p.s * (1 + gone * 0.25)}) rotate(${rot + shake}deg)`, filter: `blur(${gone * 14}px)` }}>
            <div style={{ width: 190, height: 236, borderRadius: 28, background: C.white, boxShadow: "0 14px 34px rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 150, color: C.accent, lineHeight: 1 }}>?</div>
            <Cross t={t} at={crossAt} size={170} color={C.anthracite} width={12} />
          </div>
        );
      })}
    </>
  );
};
const HookStores: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.salon || t >= T.uno) return null;
  const out = lerp(t, T.uno - 0.25, T.uno, 0, 1);
  const size = 150, gap = 24;
  // el del centro aparece en «salón»; los otros cuatro en «cinco salones», uno tras otro
  const order: Record<number, number> = { 2: T.salon, 1: T.salones, 3: T.salones + 0.08, 0: T.salones + 0.16, 4: T.salones + 0.24 };
  return (
    <div style={{ position: "absolute", top: 280, left: 540 - (5 * size + 4 * gap) / 2, width: 5 * size + 4 * gap, height: size, opacity: 1 - out }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const p = popIn(t, order[i]);
        return (
          <div key={i} style={{ position: "absolute", left: i * (size + gap), top: Math.sin(t * 3 + i) * 5, opacity: p.o, transform: `scale(${p.s})` }}><Store size={size} /></div>
        );
      })}
    </div>
  );
};

// ---------- 1 · agenda llena ✕ → servicios que más dejan (€ que suben) → clientas con montones de € ----------
const SceneUno: React.FC<{ t: number }> = ({ t }) => {
  const S = T.uno, END = T.asi;
  if (t < S || t >= END) return null;
  const calIn = popIn(t, S + 0.05);
  const calOut = lerp(t, T.enCambio - 0.2, T.enCambio, 0, 1);
  const slotsOn = (i: number) => lerp(t, 4.6 + i * 0.07, 4.72 + i * 0.07, 0, 1);
  const shake = t > T.citasX && t < T.citasX + 0.35 ? Math.sin((t - T.citasX) * 55) * 8 * (1 - (t - T.citasX) / 0.35) : 0;
  const tilesOut = lerp(t, T.clientes - 0.2, T.clientes, 0, 1);
  const focus = lerp(t, T.potenciar, T.potenciar + 0.35, 0, 1, easeInOut);
  return (
    <AbsoluteFill>
      <Num t={t} at={S} n={1} />
      {t < T.enCambio ? (
        <div style={{ position: "absolute", left: 170, top: 280, width: 740, height: 460, opacity: calIn.o * (1 - calOut), transform: `scale(${calIn.s * (1 - calOut * 0.1)}) translateX(${shake}px)` }}>
          <div style={{ width: 740, height: 460, borderRadius: 32, background: C.light, border: `2px solid ${C.border}`, boxShadow: "0 12px 32px rgba(0,0,0,0.12)", padding: 30, boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "34px repeat(4, 1fr)", gap: 12 }}>
            {[0, 1, 2, 3, 4].map((d) => <div key={d} style={{ borderRadius: 999, background: d % 2 ? "#DADADA" : "#CFCFCF", margin: "8px 22px" }} />)}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 12, background: C.white, border: `2px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: i % 3 === 0 ? "#BDBDBD" : "#D2D2D2", opacity: slotsOn(i), transform: `scaleX(${slotsOn(i)})`, transformOrigin: "0 50%" }} />
              </div>
            ))}
          </div>
          <Cross t={t} at={T.citasX} size={380} />
        </div>
      ) : null}
      {t >= T.enCambio && t < T.clientes ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", gap: 48, opacity: 1 - tilesOut }}>
          {[Scissors, ColorBowl, Dryer].map((Icon, i) => {
            const p = popIn(t, T.enCambio + i * 0.1);
            const hero = i === 1;
            const sc = hero ? 1 + focus * 0.3 : 1 - focus * 0.15;
            return (
              <div key={i} style={{ position: "relative", opacity: p.o * (hero ? 1 : 1 - focus * 0.6), transform: `scale(${p.s * sc}) translateY(${Math.sin(t * 2.4 + i) * 6}px)` }}>
                <Tile size={230} style={hero ? { boxShadow: `0 0 0 ${focus * 8}px ${C.accent}, 0 12px 32px rgba(0,0,0,0.12)` } : undefined}><Icon s={140} /></Tile>
                {hero
                  ? [0, 1, 2, 3, 4, 5].map((k) => {
                      const st = T.potenciar + 0.2 + k * 0.28;
                      const q = interpolate(t, [st, st + 1.1], [0, 1], clamp);
                      if (q <= 0 || q >= 1) return null;
                      return (
                        <div key={k} style={{ position: "absolute", left: 115 - 28 + Math.sin(k * 2.1) * 70, top: -20 - q * 170, opacity: Math.sin(q * Math.PI), transform: `scale(${0.7 + q * 0.4})` }}><Coin size={56} /></div>
                      );
                    })
                  : null}
              </div>
            );
          })}
        </div>
      ) : null}
      {t >= T.clientes ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 120 }}>
          {[0, 1, 2].map((i) => {
            const p = popIn(t, T.clientes + 0.1 + i * 0.1);
            const coins = Math.floor(interpolate(t, [T.ganancias + i * 0.08, T.ganancias + 0.9 + i * 0.08], [0, 4 + i], clamp));
            return (
              <div key={i} style={{ position: "relative", opacity: p.o, transform: `scale(${p.s})` }}>
                <Avatar size={170} />
                {Array.from({ length: coins }).map((_, k) => (
                  <div key={k} style={{ position: "absolute", left: 85 - 42, top: -96 - k * 36 }}>
                    <div style={{ transform: `scale(${lerp(t, T.ganancias + i * 0.08 + k * 0.17, T.ganancias + i * 0.08 + k * 0.17 + 0.2, 0.5, 1, backOut)})` }}><Coin size={84} /></div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 2 · su feed de Instagram en un móvil que se desliza → las personas se van ----------
const SceneDos: React.FC<{ t: number }> = ({ t }) => {
  const S = T.dos, END = T.noSabia;
  if (t < S || t >= END) return null;
  const ph = popIn(t, S + 0.05);
  const scroll = interpolate(t, [S + 0.6, T.noLlegaba], [0, 1], { ...clamp, easing: easeInOut });
  const PW = 300, PH = 560;
  return (
    <AbsoluteFill>
      <Num t={t} at={S} n={2} />
      <div style={{ position: "absolute", left: 260, top: 232, width: PW, height: PH, opacity: ph.o, transform: `scale(${ph.s}) rotate(${-4 + Math.sin(t * 1.6) * 1.5}deg)` }}>
        <div style={{ width: PW, height: PH, borderRadius: 46, background: C.anthracite, padding: 12, boxSizing: "border-box", boxShadow: "0 20px 44px rgba(0,0,0,0.28)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", background: C.white, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", transform: `translateY(${-scroll * 420}px)` }}>
              <Img src={staticFile(`${DIR}/feed.png`)} style={{ display: "block", width: "100%" }} />
              <Img src={staticFile(`${DIR}/feed.png`)} style={{ display: "block", width: "100%", marginTop: 3 }} />
            </div>
          </div>
        </div>
      </div>
      {/* personas a la derecha que se apagan y caen en «no llegaba a nadie» */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const p = popIn(t, S + 0.5 + i * 0.07);
        const fallAt = T.noLlegaba + i * 0.07;
        const f = lerp(t, fallAt, fallAt + 0.5, 0, 1, easeIn);
        return (
          <div key={i} style={{ position: "absolute", left: 640 + col * 140, top: 290 + row * 150 + f * 140, opacity: p.o * (1 - f), transform: `scale(${p.s}) rotate(${f * (col ? 25 : -25)}deg)`, filter: `grayscale(${f})` }}>
            <Avatar size={110} />
          </div>
        );
      })}
      {(() => {
        const p = popIn(t, T.nadie);
        return (
          <div style={{ position: "absolute", left: 680, top: 470, opacity: p.o, transform: `scale(${p.s})` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, borderRadius: 999, padding: "14px 28px", boxShadow: "0 12px 30px rgba(0,0,0,0.18)", fontFamily, fontWeight: 700, fontSize: 56, color: C.anthracite }}>
              <svg width="56" height="56" viewBox="0 0 100 100"><path d="M50 86 C10 58 8 30 28 20 C40 14 50 24 50 32 C50 24 60 14 72 20 C92 30 90 58 50 86 Z" fill={C.accent} /></svg>0
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ---------- 3 · etiqueta «€ ?» que se balancea; ojo ✕; copiar la etiqueta del salón de al lado ✕ ----------
const SceneTres: React.FC<{ t: number }> = ({ t }) => {
  const S = T.tres, END = T.despues;
  if (t < S || t >= END) return null;
  const tagIn = popIn(t, S + 0.1);
  const swing = Math.sin((t - S) * 3.2) * 9 * Math.exp(-(t - S) * 0.25) + (t > T.precios ? Math.sin((t - T.precios) * 9) * 6 * Math.exp(-(t - T.precios) * 2.5) : 0);
  const eye = popIn(t, T.ojo);
  const copy = popIn(t, T.copiando);
  const arrow = lerp(t, T.copiando + 0.05, T.copiando + 0.35, 1, 0);
  return (
    <AbsoluteFill>
      <Num t={t} at={S} n={3} />
      {/* etiqueta colgando en el centro */}
      <div style={{ position: "absolute", left: 540 - 150, top: 210, width: 300, height: 360, opacity: tagIn.o, transform: `scale(${tagIn.s * pulse(t, T.precios)}) rotate(${swing}deg)`, transformOrigin: "150px 0px" }}>
        <svg width="300" height="360" viewBox="0 0 300 360" style={{ filter: shadow }}>
          <path d="M150 0 V90" stroke={C.grey} strokeWidth="4" />
          <path d="M80 130 L150 80 L220 130 V330 a20 20 0 0 1 -20 20 H100 a20 20 0 0 1 -20 -20 Z" fill={C.anthracite} />
          <circle cx="150" cy="125" r="14" fill={C.white} />
          <text x="150" y="265" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="96" fill={C.white}>€?</text>
        </svg>
      </div>
      {/* ojo a la izquierda, tachado */}
      <div style={{ position: "absolute", left: 90, top: 420, width: 220, height: 220, opacity: eye.o, transform: `scale(${eye.s})` }}>
        <Tile size={220}><Eye s={150} /></Tile>
        <Cross t={t} at={T.ojo + 0.15} size={200} />
      </div>
      {/* salón de al lado → su etiqueta copiada, tachado */}
      <div style={{ position: "absolute", left: 770, top: 400, width: 240, height: 260, opacity: copy.o, transform: `scale(${copy.s})` }}>
        <Store size={170} />
        <div style={{ position: "absolute", left: 120, top: 120, transform: "rotate(10deg)" }}>
          <svg width="90" height="110" viewBox="0 0 300 360"><path d="M80 130 L150 80 L220 130 V330 a20 20 0 0 1 -20 20 H100 a20 20 0 0 1 -20 -20 Z" fill={C.pill} /><circle cx="150" cy="125" r="14" fill={C.white} /><text x="150" y="265" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="96" fill={C.white}>€</text></svg>
        </div>
        <svg width="240" height="80" viewBox="0 0 240 80" style={{ position: "absolute", left: -250, top: -10, overflow: "visible", opacity: 1 - arrow }}>
          <path d="M230 40 C170 0 90 0 20 40" fill="none" stroke={C.grey} strokeWidth="6" strokeDasharray="14 12" strokeLinecap="round" />
          <path d="M20 40 l22 -4 l-8 20 z" fill={C.grey} />
        </svg>
        <Cross t={t} at={T.copiando + 0.4} size={210} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- detrás de ella: estrategia (camino que se dibuja, publicaciones que viajan, agenda que se llena) ----------
const P0 = { x: 120, y: 1000 }, P1 = { x: 540, y: -260 }, P2 = { x: 960, y: 1000 };
const bez = (u: number) => ({
  x: (1 - u) * (1 - u) * P0.x + 2 * (1 - u) * u * P1.x + u * u * P2.x,
  y: (1 - u) * (1 - u) * P0.y + 2 * (1 - u) * u * P1.y + u * u * P2.y,
});
const BackStrategy: React.FC<{ t: number }> = ({ t }) => {
  const S = T.noSabia, END = T.tres;
  if (t < S || t >= END) return null;
  const out = lerp(t, END - 0.25, END, 0, 1);
  const draw = lerp(t, T.estrategia, T.estrategia + 0.7, 0, 1, easeInOut);
  const cal = popIn(t, T.estrategia + 0.5);
  const checks = [0, 1, 2].map((i) => lerp(t, T.nuevasCitas + i * 0.15, T.nuevasCitas + i * 0.15 + 0.25, 0, 1));
  const startTile = popIn(t, S + 0.15);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`} fill="none" stroke={C.white} strokeOpacity="0.95" strokeWidth="16" strokeLinecap="round" strokeDasharray="1 30" pathLength={1000} style={{ strokeDashoffset: 0 }} mask="url(#revealS)" />
        <defs>
          <mask id="revealS">
            <path d={`M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`} fill="none" stroke="#fff" strokeWidth="30" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
          </mask>
        </defs>
      </svg>
      {/* montón de publicaciones al principio del camino */}
      <div style={{ position: "absolute", left: P0.x - 80, top: P0.y - 80, opacity: startTile.o, transform: `scale(${startTile.s})` }}>
        <PostTile s={160} hue={20} />
      </div>
      {/* publicaciones viajando por el camino */}
      {[0, 1, 2].map((i) => {
        const st = T.publicase + i * 0.25;
        const u = interpolate(t, [st, st + 0.85], [0, 1], { ...clamp, easing: easeInOut });
        if (t < st || u >= 1) return null;
        const p = bez(u);
        return (
          <div key={i} style={{ position: "absolute", left: p.x - 60, top: p.y - 60, transform: `rotate(${(u - 0.5) * 30}deg)` }}><PostTile s={120} hue={[20, 340, 200][i]} /></div>
        );
      })}
      {/* agenda al final del camino */}
      <div style={{ position: "absolute", left: P2.x - 100, top: P2.y - 120, opacity: cal.o, transform: `scale(${cal.s * pulse(t, T.nuevasCitas)})` }}>
        <CalendarIcon s={200} checks={checks} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- detrás de ella: 8 años (8 salones en arco que se encienden) → bombilla ----------
const BackYears: React.FC<{ t: number }> = ({ t }) => {
  const S = T.despues, END = T.fugas;
  if (t < S || t >= END) return null;
  const storesOut = lerp(t, T.cuenta - 0.25, T.cuenta, 0, 1);
  const bulb = popIn(t, T.cuenta);
  const glow = lerp(t, T.cuenta + 0.2, T.cuenta + 0.6, 0, 1);
  const out = lerp(t, END - 0.2, END, 0, 1);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {t < T.cuenta
        ? Array.from({ length: 8 }).map((_, i) => {
            const a = ((196 + (i * 148) / 7) * Math.PI) / 180;
            const x = 540 + 440 * Math.cos(a), y = 700 + 400 * Math.sin(a);
            const p = popIn(t, T.ocho + i * 0.1);
            return (
              <div key={i} style={{ position: "absolute", left: x - 55, top: y - 55 + Math.sin(t * 3 + i) * 4, opacity: p.o * (1 - storesOut), transform: `scale(${p.s})` }}><Store size={110} /></div>
            );
          })
        : null}
      <div style={{ position: "absolute", left: 540 - 115, top: 215, opacity: bulb.o, transform: `scale(${bulb.s}) rotate(${Math.sin(t * 4) * 4}deg)` }}>
        <Bulb s={230} glow={glow} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- detrás de ella: fugas de dinero (saco con grieta que gotea monedas) ----------
const BackLeak: React.FC<{ t: number }> = ({ t }) => {
  const S = T.fugas, END = T.video;
  if (t < S || t >= END) return null;
  const bag = popIn(t, S);
  const wob = Math.sin((t - S) * 14) * 4 * Math.exp(-(t - S) * 2);
  return (
    <AbsoluteFill>
      {Array.from({ length: 22 }).map((_, i) => {
        const st = S + 0.15 + i * 0.05;
        const q = (t - st) / 1.0;
        if (q <= 0 || q >= 1) return null;
        const side = i % 2 ? 1 : -1;
        const x = 540 + side * (60 + q * (140 + (i % 5) * 60));
        const y = 400 + q * q * 1100;
        return (
          <div key={i} style={{ position: "absolute", left: x - 44, top: y - 44, transform: `rotate(${q * 300 * side}deg)`, opacity: 1 - Math.max(0, q - 0.8) * 5 }}><Coin size={88} /></div>
        );
      })}
      <div style={{ position: "absolute", left: 540 - 160, top: 150, width: 320, height: 306, opacity: bag.o, transform: `scale(${bag.s}) rotate(${wob}deg)` }}>
        <svg width="320" height="306" viewBox="0 0 240 230" style={{ filter: shadow }}>
          <path d="M92 40 Q120 10 148 40 L160 62 Q232 110 214 176 Q204 220 120 220 Q36 220 26 176 Q8 110 80 62 Z" fill={C.anthracite} />
          <path d="M82 60 H158" stroke={C.accent} strokeWidth="10" strokeLinecap="round" />
          <text x="120" y="168" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="84" fill={C.white}>€</text>
          <path d="M150 200 l10 -18 l-14 -10 l12 -16" fill="none" stroke={C.white} strokeWidth="5" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4 · su miniatura, más grande y con movimiento ----------
const SceneVideo: React.FC<{ t: number }> = ({ t }) => {
  const S = T.video, END = T.cta;
  if (t < S || t >= END) return null;
  const inP = lerp(t, S, S + 0.5, 0, 1, backOut);
  const op = lerp(t, S, S + 0.25, 0, 1);
  const W = 900, H = 506;
  const kb = interpolate(t, [S, END], [1.0, 1.08], clamp);
  const float = Math.sin((t - S) * 2.2) * 8;
  const tilt = (1 - inP) * -6 + Math.sin((t - S) * 1.7) * 1.2;
  const prog = interpolate(t, [S + 0.4, END], [0, 1], clamp);
  const playPulse = 1 + 0.08 * Math.max(0, Math.sin((t - S) * 5));
  const marks = [T.lasQue, T.como];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - W / 2, top: 222 + float, width: W, height: H + 26, opacity: op, transform: `scale(${0.82 + 0.18 * inP}) rotate(${tilt}deg)` }}>
        <div style={{ width: W, height: H, borderRadius: 28, overflow: "hidden", boxShadow: "0 22px 50px rgba(0,0,0,0.28)", position: "relative" }}>
          <Img src={staticFile(`${DIR}/miniatura.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 120, height: 120, marginLeft: -60, marginTop: -60, borderRadius: "50%", background: "rgba(255,255,255,0.94)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", transform: `scale(${playPulse})` }}>
            <div style={{ width: 0, height: 0, borderTop: "26px solid transparent", borderBottom: "26px solid transparent", borderLeft: `42px solid ${C.accent}`, marginLeft: 10 }} />
          </div>
        </div>
        {/* barra de progreso con dos marcas */}
        <div style={{ position: "relative", marginTop: 18, height: 10, borderRadius: 999, background: C.border }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${prog * 100}%`, borderRadius: 999, background: C.accent }} />
          {marks.map((m, i) => {
            const p = popIn(t, m);
            return <div key={i} style={{ position: "absolute", left: `${30 + i * 35}%`, top: -9, width: 28, height: 28, borderRadius: "50%", background: C.white, border: `6px solid ${C.accent}`, boxSizing: "border-box", opacity: p.o, transform: `scale(${p.s})` }} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- cierre: solo «FUGA» grande ----------
const gradText: React.CSSProperties = {
  fontFamily, fontWeight: 700, letterSpacing: "-0.02em",
  backgroundImage: `linear-gradient(180deg, ${C.gradTop} 0%, ${C.gradBottom} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
};
const CtaWord: React.FC<{ t: number }> = ({ t }) => {
  if (t < T.comenta) return null;
  const inP = lerp(t, T.comenta, T.comenta + 0.3, 0, 1);
  return (
    <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center", opacity: inP, transform: `translateY(${(1 - inP) * 20}px) scale(${pulse(t, 35.21)})`, filter: `blur(${(1 - inP) * 8}px) drop-shadow(0 4px 18px rgba(0,0,0,0.45))` }}>
      <div style={{ ...gradText, fontSize: 150, lineHeight: 1.05 }}>«FUGA»</div>
    </div>
  );
};

// ---------- vídeo de Pexels detrás del hombro (solo en «trabajaría menos y ganaría más») ----------
const BACK = { w: 600, h: 1067, top: 300, opacity: 0.6, x: { left: 20, right: 460 } };
const BackWindow: React.FC<{ t: number; start: number; end: number; side: "left" | "right"; children: React.ReactNode }> = ({ t, start, end, side, children }) => {
  if (t < start || t >= end) return null;
  const p = lerp(t, start, start + 0.45, 0, 1, easeInOut);
  const op = lerp(t, start, start + 0.28, 0, 1);
  const out = lerp(t, end - 0.2, end, 0, 1);
  return (
    <div style={{ position: "absolute", left: BACK.x[side], top: BACK.top, width: BACK.w, height: BACK.h, borderRadius: 36, overflow: "hidden", opacity: BACK.opacity * op * (1 - out), transform: `scale(${0.96 + 0.04 * p})`, transformOrigin: "50% 30%", boxShadow: "0 12px 32px rgba(0,0,0,0.20)" }}>
      {children}
    </div>
  );
};
const Clip: React.FC<{ file: string; start: number; end: number; trim?: number }> = ({ file, start, end, trim = 0 }) => (
  <Sequence from={fr(start)} durationInFrames={Math.max(1, fr(end - start))} layout="none">
    <OffthreadVideo src={staticFile(`${DIR}/${file}`)} muted trimBefore={fr(trim)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  </Sequence>
);

// Recorte de ella (WebM con alfa) con la MISMA cámara; solo mientras hay algo detrás.
const MATTES = [
  { name: "gancho", from: 0, to: 1.5, show: [0, 1.5] },
  { name: "menos", from: 11.3, to: 13.05, show: [T.asi, T.dos] },
  { name: "estrategia", from: 17.9, to: 22.45, show: [T.noSabia, T.tres] },
  { name: "ochoanos", from: 25.733, to: 29.5, show: [T.despues, T.fugas] },
  { name: "fugas", from: 29.4, to: 30.75, show: [T.fugas, T.video] },
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

// ---------- sonido: uno en cada animación, variados y bajitos (lista para master_audio.py) ----------
const LIB: Record<string, { peak: number; target: number; start: number }> = {
  "pop.mp3": { peak: -4.6, target: -35.5, start: 0.089 },
  "pop2.mp3": { peak: -2.5, target: -35.5, start: 0.089 },
  "tick.mp3": { peak: -12.1, target: -36.5, start: 0.041 },
  "stamp.mp3": { peak: -2.3, target: -34.5, start: 0.021 },
  "count.wav": { peak: -11.8, target: -38.5, start: 0.041 },
  "whoosh.mp3": { peak: -5.3, target: -38.5, start: 0.025 },
  "swishA.mp3": { peak: -21.6, target: -38, start: 0.51 },
  "swishB.mp3": { peak: -18.1, target: -38, start: 0.46 },
  "swishC.mp3": { peak: -0.3, target: -38, start: 0 },
  "trazo.mp3": { peak: -24.6, target: -39, start: 0.26 },
  "notaE2.mp3": { peak: -5.3, target: -39, start: 0 },
  "notaG2.mp3": { peak: -9, target: -39, start: 0 },
  "notaC3.mp3": { peak: -4.4, target: -39, start: 0 },
  "notaC4.mp3": { peak: -6.5, target: -39, start: 0 },
  "click.mp3": { peak: -12, target: -38, start: 0 },
};
const CUES: [string, number, string][] = [
  ["pop.mp3", 0.05, "tarjetas «?»"],
  ["stamp.mp3", T.no + 0.05, "se tachan"],
  ["swishA.mp3", 1.55, "se esfuman"],
  ["pop2.mp3", T.salon, "un salón"],
  ["notaE2.mp3", T.salones, "salón 2"],
  ["notaG2.mp3", T.salones + 0.08, "salón 3"],
  ["notaC3.mp3", T.salones + 0.16, "salón 4"],
  ["notaC4.mp3", T.salones + 0.24, "salón 5"],
  ["whoosh.mp3", T.uno, "pantalla dividida 1"],
  ["count.wav", 4.75, "la agenda se llena"],
  ["stamp.mp3", T.citasX, "agenda tachada"],
  ["pop.mp3", T.enCambio, "servicios"],
  ["notaC4.mp3", T.potenciar, "servicio que más deja"],
  ["pop2.mp3", T.clientes + 0.1, "clientas"],
  ["tick.mp3", T.ganancias, "montones de €"],
  ["swishB.mp3", T.asi, "vídeo detrás (café)"],
  ["swishC.mp3", T.dos, "pantalla dividida 2 (móvil)"],
  ["notaE2.mp3", T.noLlegaba, "las personas se van"],
  ["pop2.mp3", T.nadie, "corazón 0"],
  ["pop.mp3", T.noSabia + 0.15, "publicaciones"],
  ["trazo.mp3", T.estrategia, "camino de la estrategia"],
  ["swishA.mp3", T.publicase, "publicaciones viajando"],
  ["tick.mp3", T.nuevasCitas, "agenda con ✓"],
  ["whoosh.mp3", T.tres, "pantalla dividida 3"],
  ["pop2.mp3", T.precios, "etiqueta €?"],
  ["stamp.mp3", T.ojo + 0.15, "ojo tachado"],
  ["trazo.mp3", T.copiando, "copiar etiqueta"],
  ["stamp.mp3", T.copiando + 0.4, "copia tachada"],
  ["count.wav", T.ocho, "8 salones"],
  ["pop.mp3", T.cuenta, "bombilla"],
  ["notaC4.mp3", T.fugas, "saco"],
  ["notaC3.mp3", T.fugas + 0.2, "monedas"],
  ["notaE2.mp3", T.fugas + 0.4, "monedas"],
  ["swishC.mp3", T.video, "miniatura"],
  ["tick.mp3", T.lasQue, "marca 1"],
  ["pop2.mp3", T.como, "marca 2"],
  ["click.mp3", T.comenta, "«FUGA»"],
];
const SND = CUES.map(([file, at, what]) => {
  const l = LIB[file];
  return { file, at, start: l.start, gain_db: Math.round((l.target - l.peak - 1.5) * 10) / 10, what };
});
console.log("SND_JSON_V3 " + JSON.stringify(SND));

export const ReelBRMC4311v3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const hookBehind = t < 1.5;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Camera t={t} />
      <BackWindow t={t} side="right" start={T.asi + 0.05} end={T.dos}>
        <Clip file="pexels-6638433.mp4" start={T.asi + 0.05} end={T.dos} trim={4} />
      </BackWindow>
      <HookCards t={t} />
      <BackStrategy t={t} />
      <BackYears t={t} />
      <BackLeak t={t} />
      {hookBehind ? <Subtitles t={t} /> : null}
      <Cutouts t={t} />
      <HookStores t={t} />
      <SceneUno t={t} />
      <SceneDos t={t} />
      <SceneTres t={t} />
      <SceneVideo t={t} />
      <CtaWord t={t} />
      {!hookBehind ? <Subtitles t={t} /> : null}
    </AbsoluteFill>
  );
};
