// YouTube DDMB6807 · v2 — cambios de 3. LISTOS/YOUTUBE/DDMB6807_guion-cambios-v2.md
// Sin subtítulos sobre ella (solo en pantallas completas), frases clave grandes, vídeos al 85 %,
// pantallas completas con algo nuevo cada ≤2,5 s, y una lista de sonidos (SND) que se mezcla aparte con FFmpeg.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import captions from "./data/DDMB6807-captions.json";

const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin", "latin-ext"] });
const { fontFamily: SERIF } = loadPlayfair("italic", { weights: ["700"], subsets: ["latin", "latin-ext"] });

export const YT2_FPS = 60000 / 1001;
type Word = { text: string; start: number; end: number; src: number };
type Seg = { src_start: number; src_end: number; out_start: number; out_dur: number };
const CAP = captions as unknown as { duration: number; words: Word[]; segments: Seg[] };
export const YT2_DURATION = CAP.duration;
const WORDS = CAP.words;
const SEGS = CAP.segments;

const C = {
  bg: "#F2EFEC", blob: "#F4B89A", serif: "#D2603A", accent: "#E98A55", black: "#111111", anth: "#242424",
  grey: "#777777", light: "#F3F3F3", border: "#E5E5E5", white: "#FFFFFF", glow: "#573430", darkBorder: "#404040",
  lt: "#F4A57A", // naranja claro para fondos oscuros (frases clave)
};

// ---------- tiempo ----------
const at = (src: number) => {
  for (const s of SEGS) {
    if (src < s.src_start) return s.out_start;
    if (src <= s.src_end) return s.out_start + (src - s.src_start);
  }
  return CAP.duration;
};
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const w = (txt: string, near: number) => {
  const n = norm(txt);
  let best: Word | undefined;
  for (const x of WORDS) {
    if (Math.abs(x.src - near) > 4) continue;
    if (norm(x.text).startsWith(n) && (!best || Math.abs(x.src - near) < Math.abs(best.src - near))) best = x;
  }
  return best ? best.start : at(near);
};

// ---------- sonidos: se apuntan aquí y se mezclan aparte (ver mezcla_v2.py) ----------
type K = "pop" | "tick" | "count" | "rise" | "swoosh" | "stamp" | "whoosh" | "phone" | "title";
export const SND: { k: K; t: number }[] = [];
const s = (k: K, t: number) => { SND.push({ k, t: Math.round(t * 1000) / 1000 }); return t; };

// ---------- animación ----------
const eo = Easing.out(Easing.cubic);
const eio = Easing.inOut(Easing.cubic);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const p = (t: number, a: number, d = 0.28) => interpolate(t, [a, a + d], [0, 1], { ...cl, easing: eo });
const enter = (t: number, a: number): React.CSSProperties => {
  const k = p(t, a);
  return { opacity: k, transform: `translateY(${(1 - k) * 20}px)` };
};
const popIn = (t: number, a: number): React.CSSProperties => {
  const k = interpolate(t, [a, a + 0.18, a + 0.3], [0, 1.08, 1], { ...cl, easing: eo });
  return { opacity: p(t, a, 0.15), transform: `scale(${k})` };
};
const blurIn = (t: number, a: number): React.CSSProperties => {
  const k = p(t, a, 0.35);
  return { opacity: k, filter: `blur(${(1 - k) * 12}px)`, display: "inline-block" };
};
const fadeOut = (t: number, a: number, d = 0.3) => 1 - p(t, a, d);
const pulse = (t: number, a: number) => interpolate(t, [a, a + 0.11, a + 0.22], [1, 1.06, 1], { ...cl, easing: eio });
const fmt = (n: number, dec = 0) => n.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: true }).replace(/ /g, ".");
const miles = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const count = (t: number, a: number, from: number, to: number, d = 0.9) => from + (to - from) * interpolate(t, [a, a + d], [0, 1], { ...cl, easing: eio });

type Tok = { t: string; k?: "s" | "small" | "serif" };
const Rich: React.FC<{ toks: Tok[]; t: number; a: number; size?: number; color?: string; align?: "center" | "left"; serifColor?: string }> = ({ toks, t, a, size = 72, color = C.black, align = "center", serifColor = C.serif }) => (
  <div style={{ textAlign: align, lineHeight: 1.05, color }}>
    {toks.map((x, i) => {
      const st: React.CSSProperties =
        x.k === "serif" ? { fontFamily: SERIF, fontWeight: 700, fontStyle: "italic", fontSize: size * 2, color: serifColor, letterSpacing: "-0.01em" }
        : x.k === "small" ? { fontFamily: INTER, fontWeight: 700, fontSize: size * 0.45 }
        : { fontFamily: INTER, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em" };
      return <span key={i} style={{ ...st, ...blurIn(t, a + i * 0.08), marginRight: size * 0.22, verticalAlign: "baseline" }}>{x.t}</span>;
    })}
  </div>
);

// ---------- fondos ----------
const Sphere: React.FC<{ x: number; y: number; r: number; orange?: boolean }> = ({ x, y, r, orange }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
    background: orange ? "radial-gradient(circle at 35% 30%, #FFD2B8 0%, #F08A5D 45%, #C9532F 100%)" : "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #ECE7E2 55%, #C9C2BB 100%)",
    boxShadow: "0 18px 30px rgba(0,0,0,0.12)" }} />
);
const LightBg: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,184,154,0.42) 0%, rgba(244,184,154,0.18) 38%, rgba(244,184,154,0) 70%)", left: -760 + Math.sin(t * 0.2) * 30, top: 120 }} />
    <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,184,154,0.42) 0%, rgba(244,184,154,0.18) 38%, rgba(244,184,154,0) 70%)", right: -650, top: -760 + Math.cos(t * 0.18) * 30 }} />
    <Sphere x={1520 + Math.sin(t * 0.6) * 10} y={210 + Math.cos(t * 0.5) * 12} r={46} orange />
    <Sphere x={330 + Math.cos(t * 0.5) * 8} y={820 + Math.sin(t * 0.7) * 10} r={22} />
  </AbsoluteFill>
);
const DarkBg: React.FC = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(87,52,48,0.95) 0%, rgba(87,52,48,0.45) 40%, rgba(17,17,17,0) 75%)" }} />
  </AbsoluteFill>
);
const OrangeBg: React.FC = () => <AbsoluteFill style={{ background: C.accent }} />;

// ---------- piezas ----------
const shadow = "0 12px 32px rgba(0,0,0,0.12)";
const Card: React.FC<{ children: React.ReactNode; dark?: boolean; style?: React.CSSProperties }> = ({ children, dark, style }) => (
  <div style={{ borderRadius: 28, padding: "28px 34px", boxSizing: "border-box",
    background: dark ? "rgba(36,36,36,0.8)" : C.white, border: `2px solid ${dark ? C.darkBorder : C.border}`,
    boxShadow: dark ? "0 12px 32px rgba(0,0,0,0.35)" : shadow, color: dark ? C.white : C.black, ...style }}>{children}</div>
);
const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number }> = ({ children, bg = C.accent, color = C.white, size = 34 }) => (
  <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: size, color, background: bg, borderRadius: 999, padding: "12px 30px", display: "inline-block", whiteSpace: "nowrap" }}>{children}</span>
);
const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 120, color = C.black }) => (
  <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: size, letterSpacing: "-0.03em", color, lineHeight: 1, whiteSpace: "nowrap" }}>{children}</div>
);
const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 34, color = C.grey }) => (
  <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: size, color, lineHeight: 1.2 }}>{children}</div>
);
const Check: React.FC<{ on: number; size?: number }> = ({ on, size = 40 }) => (
  <div style={{ flex: `0 0 ${size}px`, width: size, height: size, borderRadius: 10, border: `3px solid ${C.accent}`, background: on > 0.5 ? C.accent : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: INTER, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${0.9 + 0.1 * on})` }}>{on > 0.5 ? "✓" : ""}</div>
);
const Ring: React.FC<{ k: number; size?: number; children: React.ReactNode; dark?: boolean }> = ({ k, size = 360, children, dark }) => {
  const r = size / 2 - 14, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: dark ? "rgba(36,36,36,0.8)" : C.white, boxShadow: dark ? "0 12px 32px rgba(0,0,0,0.35)" : shadow }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? C.darkBorder : C.border} strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.accent} strokeWidth={10} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - k)} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
};
/** raya que tacha lo que tenga dentro */
const Strike: React.FC<{ t: number; a: number; children: React.ReactNode; color?: string }> = ({ t, a, children, color = C.serif }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    {children}
    <div style={{ position: "absolute", left: -8, top: "50%", height: 7, width: `calc(${100 * p(t, a, 0.3)}% + ${16 * p(t, a, 0.3)}px)`, background: color, borderRadius: 999, transform: "rotate(-4deg)" }} />
  </div>
);
const XMark: React.FC<{ t: number; a: number; size?: number; color?: string }> = ({ t, a, size = 46, color = C.serif }) => {
  const k1 = p(t, a, 0.15), k2 = p(t, a + 0.1, 0.15), L = size * 1.25;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: "0 0 auto" }}>
      <line x1={6} y1={6} x2={size - 6} y2={size - 6} stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k1)} />
      <line x1={size - 6} y1={6} x2={6} y2={size - 6} stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k2)} />
    </svg>
  );
};
const Arrow: React.FC<{ t: number; a: number; w?: number; color?: string; dir?: "right" | "down" | "up" }> = ({ t, a, w: W = 120, color = C.accent, dir = "right" }) => {
  const k = p(t, a, 0.45), len = W;
  const rot = dir === "down" ? 90 : dir === "up" ? -90 : 0;
  return (
    <svg width={W + 20} height={40} viewBox={`0 0 ${W + 20} 40`} style={{ transform: `rotate(${rot}deg)`, flex: "0 0 auto", overflow: "visible" }}>
      <line x1={4} y1={20} x2={4 + len * k} y2={20} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <path d={`M ${len * k - 14} 6 L ${len * k + 6} 20 L ${len * k - 14} 34`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={k > 0.15 ? 1 : 0} />
    </svg>
  );
};
const Person: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 100 100"><circle cx={50} cy={30} r={20} fill={color} /><path d="M14 96 C 14 66, 86 66, 86 96 Z" fill={color} /></svg>
);
const Shop: React.FC<{ size?: number; color?: string; door?: string }> = ({ size = 90, color = C.accent, door = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={14} y={40} width={72} height={52} rx={6} fill={color} />
    <path d="M8 40 L 18 14 L 82 14 L 92 40 Z" fill={color} opacity={0.75} />
    <rect x={42} y={62} width={16} height={30} rx={3} fill={door} />
  </svg>
);
const Phone: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const sh = t > a && t < a + 0.7 ? Math.sin((t - a) * 70) * 6 : 0;
  return (
    <svg width={44} height={64} viewBox="0 0 44 64" style={{ transform: `translateX(${sh}px) rotate(${sh}deg)` }}>
      <rect x={3} y={3} width={38} height={58} rx={8} fill="none" stroke={C.accent} strokeWidth={5} /><circle cx={22} cy={52} r={3} fill={C.accent} />
    </svg>
  );
};
const count2 = count;

// ---------- escenas ----------
type Bg = "light" | "dark" | "orange";
type Scene = { kind: "pc" | "right"; from: number; to: number; bg?: Bg; draw: (t: number) => React.ReactNode };
const S: Scene[] = [];
const pc = (from: number, to: number, bg: Bg, draw: (t: number) => React.ReactNode) => { s("whoosh", from - 0.05); S.push({ kind: "pc", from, to, bg, draw }); };
const right = (from: number, to: number, draw: (t: number) => React.ReactNode) => S.push({ kind: "right", from, to, draw });
const Center: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({ children, gap = 40, style }) => (
  <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap, padding: "90px 120px 150px", boxSizing: "border-box", ...style }}>{children}</AbsoluteFill>
);
const Layer: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.001 ? null : <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>);
const chapter = (from: number, to: number, n: string, toks: Tok[]) => {
  pc(from, to, "light", (t) => (
    <Center gap={18}>
      <div style={{ ...blurIn(t, from), fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.accent, letterSpacing: "0.2em" }}>{n}</div>
      <Rich toks={toks} t={t} a={from + 0.1} size={78} />
    </Center>
  ));
};

// ---------- zona derecha (sobre el plano de ella, a su lado) ----------
const RX = 1170, RW = 690;
const tshadow = "0 4px 18px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5)";
/** frase clave grande: cada trozo en su línea; tamaño ajustado para que quepa en 690 px */
const RightTitle: React.FC<{ t: number; a: number; toks: Tok[]; top?: number }> = ({ t, a, toks, top = 150 }) => (
  <div style={{ position: "absolute", left: RX, top, width: RW, textShadow: tshadow }}>
    {toks.map((x, i) => {
      const serif = x.k === "serif";
      const size = serif ? Math.min(190, RW / (x.t.length * 0.5)) : Math.min(84, RW / (x.t.length * 0.56));
      return (
        <div key={i} style={{ ...blurIn(t, a + i * 0.12), display: "block", lineHeight: serif ? 1.0 : 1.1,
          fontFamily: serif ? SERIF : INTER, fontStyle: serif ? "italic" : "normal", fontWeight: serif ? 700 : 800,
          fontSize: size, color: serif ? C.lt : C.white, letterSpacing: serif ? "-0.01em" : "-0.02em", whiteSpace: "nowrap" }}>{x.t}</div>
      );
    })}
  </div>
);
const rightTitle = (from: number, to: number, a: number, toks: Tok[]) => { s("title", a); right(from, to, (t) => <RightTitle t={t} a={a} toks={toks} />); };
const RightBox: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 160 }) => (
  <div style={{ position: "absolute", left: RX, top, width: RW }}>{children}</div>
);
const Win: React.FC<{ file: string; from: number; to: number; trim?: number; t: number }> = ({ file, from, to, trim = 0, t }) => {
  const k = p(t, from, 0.45);
  return (
    <div style={{ position: "absolute", left: RX, top: 110, width: 380, height: 675, borderRadius: 26, overflow: "hidden", boxShadow: "0 14px 36px rgba(0,0,0,0.35)", opacity: 0.85 * k, transform: `scale(${0.96 + 0.04 * k})` }}>
      <Sequence from={Math.round(from * YT2_FPS)} durationInFrames={Math.max(1, Math.round((to - from) * YT2_FPS))} layout="none">
        <OffthreadVideo src={staticFile(`DDMB6807/${file}`)} muted trimBefore={Math.round(trim * 25)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
    </div>
  );
};
const List: React.FC<{ t: number; items: [string, number][]; left?: number; top?: number; width?: number; size?: number }> = ({ t, items, left = 1580, top = 150, width = 300, size = 30 }) => (
  <div style={{ position: "absolute", left, top, width, display: "flex", flexDirection: "column", gap: 18 }}>
    {items.map(([txt, a], i) => (
      <div key={i} style={{ ...enter(t, a), display: "flex", alignItems: "center", gap: 14 }}>
        <Check on={p(t, a + 0.15, 0.2)} size={size + 6} />
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: size, color: C.white, textShadow: tshadow, lineHeight: 1.15 }}>{txt}</div>
      </div>
    ))}
  </div>
);
const ticks = (items: [string, number][]) => { items.forEach(([, a]) => s("tick", a + 0.15)); return items; };
const CtaCard: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <RightBox top={300}>
    <div style={{ ...enter(t, a) }}>
      <Card style={{ width: 580 }}>
        <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 50, color: C.black }}>Reserva tu <span style={{ fontFamily: SERIF, fontStyle: "italic", color: C.serif, fontSize: 68 }}>llamada</span></div>
        <Label>20–30 minutos · enlace aquí debajo</Label>
      </Card>
      <div style={{ marginLeft: 260, marginTop: 20, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `36px solid ${C.accent}`,
        transform: `translateY(${Math.sin(t * 5) * 8}px)`, opacity: p(t, a + 0.3) }} />
    </div>
  </RightBox>
);

// ===================== GANCHO =====================
{
  const a = at(3.45), b1 = w("1.500", 7.6), e = at(9.0);
  s("count", a); s("rise", a + 0.05); s("count", b1); s("rise", b1 + 0.05);
  pc(a, e, "light", (t) => (
    <Center gap={30}>
      <div style={blurIn(t, a)}><Label size={40} color={C.black}>Una peluquería que factura…</Label></div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 80, height: 600 }}>
        {[{ v: 18000, a, lab: "al mes", col: "#CFC8C1", h: 380 }, { v: 1500, a: b1, lab: "de beneficio", col: C.accent, h: 50 }].map((x, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: p(t, x.a) }}>
            <Big size={84} color={i ? C.serif : C.black}>{miles(count(t, x.a, 0, x.v))} €</Big>
            <div style={{ width: 230, height: x.h * p(t, x.a, 0.6), background: x.col, borderRadius: 24 }} />
            <Label>{x.lab}</Label>
          </div>
        ))}
      </div>
    </Center>
  ));
}
{
  const a = at(9.0), e = at(17.5), dup = w("duplicar", 11.7), n1 = w("1.500", 13.5), n2 = w("3.300", 15.2);
  s("pop", dup); s("pop", n1); s("swoosh", n1 + 0.35); s("count", n2);
  pc(a, e, "light", (t) => (
    <Center gap={50}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Rich toks={[{ t: "Duplicar el" }, { t: "beneficio", k: "serif" }]} t={t} a={a} />
        <div style={popIn(t, dup)}><div style={{ width: 150, height: 150, borderRadius: "50%", background: C.accent, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 800, fontSize: 64, boxShadow: shadow, transform: `rotate(${-8 + 8 * p(t, dup, 0.4)}deg)` }}>×2</div></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={popIn(t, n1)}><Big size={100} color={C.grey}>1.500 €</Big></div>
        <svg width={320} height={120}><path d="M10 110 C 120 100, 180 60, 310 10" fill="none" stroke={C.accent} strokeWidth={8} strokeLinecap="round" strokeDasharray={400} strokeDashoffset={400 * (1 - p(t, n1 + 0.35, 1.0))} /></svg>
        <div style={{ opacity: p(t, n2) }}><Big size={100} color={C.serif}>{miles(count(t, n2, 1500, 3300, 1.0))} €</Big></div>
      </div>
    </Center>
  ));
}
rightTitle(at(17.5), at(20.6), w("gestión", 18.2), [{ t: "Mejorando la", k: "s" }, { t: "gestión", k: "serif" }]);
{
  const a = at(20.7), e = at(30.0);
  const cards: [string, number][] = [["Agenda llena", w("agenda", 23.6)], ["Estrés del equipo", w("estrés", 25.0)], ["Pedidos", w("pedidos", 26.5)], ["Citas", w("citas", 27.4)]];
  cards.forEach(([, c]) => s("pop", c));
  const dim = w("construir", 28.6);
  pc(a, e, "dark", (t) => (
    <Center gap={60}>
      <div style={blurIn(t, a)}><Label size={46} color={C.white}>Nos olvidamos de…</Label></div>
      <div style={{ display: "flex", gap: 34, opacity: 1 - 0.7 * p(t, dim, 0.4) }}>
        {cards.map(([txt, ca]) => <div key={txt} style={enter(t, ca)}><Card dark style={{ width: 300, height: 220, display: "flex", alignItems: "flex-end" }}><div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 38 }}>{txt}</div></Card></div>)}
      </div>
    </Center>
  ));
}
{
  const a = at(30.0), e = at(35.6), d = w("doble", 33.0), l = w("libertad", 34.4);
  s("pop", d); s("pop", l);
  pc(a, e, "light", (t) => (
    <Center gap={50}>
      <Rich toks={[{ t: "Un salón más" }, { t: "sencillo", k: "serif" }]} t={t} a={a} />
      <div style={{ display: "flex", gap: 30 }}>
        <div style={enter(t, d)}><Pill size={40}>El doble de beneficio</Pill></div>
        <div style={enter(t, l)}><Pill size={40} bg={C.anth}>Más libertad</Pill></div>
      </div>
    </Center>
  ));
}
rightTitle(at(35.7), at(44.7), w("estrategias", 38.0), [{ t: "Sin", k: "s" }, { t: "secretos", k: "serif" }]);
{
  const a = at(44.8), e = at(51.7);
  const items = ["Compras", "Precios", "Ventas", "Fidelización", "Equipo", "Crecimiento"];
  items.forEach((_, i) => s("tick", a + 0.4 + i * 0.85 + 0.3));
  pc(a, e, "light", (t) => (
    <Center>
      <Card style={{ width: 760, padding: "40px 50px" }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: C.grey, marginBottom: 20 }}>EN ESTE VÍDEO</div>
        {items.map((x, i) => {
          const ia = a + 0.4 + i * 0.85;
          return (
            <div key={x} style={{ ...enter(t, ia), display: "flex", alignItems: "center", gap: 20, margin: "14px 0" }}>
              <Check on={p(t, ia + 0.3, 0.2)} />
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 34, color: C.serif, width: 56 }}>0{i + 1}</span>
              <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.black }}>{x}</span>
            </div>
          );
        })}
      </Card>
    </Center>
  ));
}
{
  const a = w("5", 56.0);
  s("count", a);
  right(at(51.8), at(57.0), (t) => <RightBox top={200}><div style={{ ...enter(t, a), textShadow: tshadow }}><Big size={170} color={C.white}>{Math.round(count(t, a, 1, 5, 0.8))}</Big><Label size={50} color={C.white}>salones gestionados</Label></div></RightBox>);
}

// ===================== 01 · PUNTO DE PARTIDA =====================
chapter(at(57.06), at(60.4), "01", [{ t: "El punto de", k: "s" }, { t: "partida", k: "serif" }]);
{
  const a = at(60.4), e = at(69.3);
  const bars: [string, number, number][] = [["18.000 €", 18, w("18", 60.6)], ["16.000 €", 16, w("16", 62.4)], ["17.000 €", 17, w("17", 64.2)], ["20.000 €", 20, w("20", 65.5)]];
  const avg = w("media", 67.1);
  bars.forEach(([, , b]) => s("rise", b)); s("swoosh", avg);
  pc(a, e, "light", (t) => (
    <Center gap={20}>
      <div style={blurIn(t, a)}><Label size={40} color={C.black}>Facturación mensual</Label></div>
      <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 60, height: 560 }}>
        {bars.map(([lab, v, ba]) => (
          <div key={lab} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: p(t, ba) }}>
            <Label color={C.black}>{lab}</Label>
            <div style={{ width: 170, height: v * 22 * p(t, ba, 0.5), background: "#CFC8C1", borderRadius: 20 }} />
          </div>
        ))}
        <div style={{ position: "absolute", left: -30, right: -30, bottom: 18 * 22, borderTop: `4px dashed ${C.accent}`, clipPath: `inset(0 ${100 - 100 * p(t, avg, 0.5)}% 0 0)` }}>
          <div style={{ position: "absolute", right: 0, top: -58, opacity: p(t, avg + 0.3) }}><Pill size={28}>media ≈ 18.000 €</Pill></div>
        </div>
      </div>
    </Center>
  ));
}
{
  const a = w("1", 73.2), g = w("poquito", 76.4);
  s("pop", a);
  right(at(69.9), at(84.9), (t) => <RightBox top={200}><div style={enter(t, a)}><Card style={{ width: 540 }}><Big size={120} color={p(t, g) > 0.5 ? C.grey : C.serif}>1.500 €</Big><Label size={38}>de beneficio al mes</Label></Card></div></RightBox>);
}
{
  const a = at(84.9), e = at(103.4);
  const cards: [string, string, number][] = [["7", "años abierta", w("siete", 87.4)], ["3", "empleadas", w("tres", 88.9)], ["300", "visitas al mes", w("300", 96.6)], ["80 %", "de agenda ocupada", w("80", 101.8)]];
  const fiel = w("fiel", 91.5), atr = w("atraer", 94.2);
  cards.forEach(([, , c]) => s("pop", c)); s("tick", fiel + 0.15); s("swoosh", atr);
  pc(a, e, "light", (t) => (
    <Center gap={46}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 340px)", gap: 30 }}>
        {cards.map(([n, l, ca]) => <div key={l} style={popIn(t, ca)}><Card style={{ height: 270, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}><Big size={100} color={C.serif}>{n}</Big><Label size={32}>{l}</Label></Card></div>)}
      </div>
      <div style={{ display: "flex", gap: 40, alignItems: "center", height: 90 }}>
        <div style={{ ...enter(t, fiel), display: "flex", alignItems: "center", gap: 16 }}><Check on={p(t, fiel + 0.15, 0.2)} size={52} /><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: C.black }}>Clientela fiel</span></div>
        <div style={{ ...enter(t, atr), display: "flex", alignItems: "center", gap: 18 }}><Arrow t={t} a={atr} w={90} /><Pill size={40} bg={C.anth}>Mucho esfuerzo en atraer nuevas</Pill></div>
      </div>
    </Center>
  ));
}
{
  const a = at(103.9), e = at(113.4), prob = w("problema", 111.6);
  const sat: [string, number, number, number][] = [["Servicios", w("servicios", 105.3), -520, -170], ["Compras", w("compras", 106.8), 520, -170], ["Agenda", w("agenda", 108.0), -520, 170], ["Equipo", w("equipo", 109.4), 520, 170]];
  sat.forEach(([, a2]) => s("pop", a2)); s("swoosh", prob); s("pop", prob + 0.9);
  pc(a, e, "dark", (t) => (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {sat.map(([l, sa, dx, dy]) => <line key={l} x1={960} y1={500} x2={960 + dx * p(t, sa, 0.4)} y2={500 + dy * p(t, sa, 0.4)} stroke={C.accent} strokeWidth={3} strokeLinecap="round" />)}
        {sat.map(([l, , dx, dy], i) => {
          const k = interpolate(t, [prob + i * 0.12, prob + 0.75 + i * 0.12], [0, 1], { ...cl, easing: eio });
          return k > 0 && k < 1 ? <circle key={`d${l}`} cx={960 + dx * (1 - k)} cy={500 + dy * (1 - k)} r={14} fill={C.lt} /> : null;
        })}
      </svg>
      <div style={{ position: "absolute", left: 960 - 160, top: 500 - 160, ...blurIn(t, a), transform: `scale(${pulse(t, prob + 0.85)})` }}><Ring k={1} size={320} dark><Label size={46} color={C.white}>La dueña</Label></Ring></div>
      {sat.map(([l, sa, dx, dy]) => <div key={l} style={{ position: "absolute", left: 960 + dx - 160, top: 500 + dy - 55, width: 320, ...enter(t, sa) }}><Card dark style={{ textAlign: "center", padding: "26px 20px" }}><div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40 }}>{l}</div></Card></div>)}
    </AbsoluteFill>
  ));
}
{
  const rows: [string, string, number, boolean?][] = [["Facturación", "18.000 €", at(113.44)], ["Ticket medio", "60 € / visita", w("60", 116.0)], ["Producto", "−2.700 €", w("2", 120.3)], ["Personal", "−9.000 €", w("9.000", 130.3)], ["Alquiler", "−1.400 €", w("1", 132.9)], ["Gastos", "−3.400 €", w("3", 142.5)], ["Beneficio", "1.500 €", w("1", 145.6), true]];
  rows.forEach(([, , r]) => s("pop", r));
  right(at(113.44), at(147.7), (t) => (
    <RightBox top={100}>
      <Card style={{ width: 660, padding: "28px 36px", ...enter(t, at(113.44)) }}>
        <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 24, letterSpacing: "0.2em", color: C.grey, marginBottom: 6 }}>LAS CUENTAS</div>
        {rows.map(([l, v, ra, hi]) => (
          <div key={l} style={{ ...enter(t, ra), display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 0", borderTop: hi ? `3px solid ${C.black}` : `1px solid ${C.border}` }}>
            <span style={{ fontFamily: INTER, fontWeight: hi ? 800 : 600, fontSize: hi ? 40 : 34, color: C.black }}>{l}</span>
            <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: hi ? 48 : 36, color: hi ? C.serif : C.black }}>{v}</span>
          </div>
        ))}
      </Card>
    </RightBox>
  ));
}
{
  const a = at(147.76), e = at(151.6), sub = w("8,3", 148.9) + 0.9;
  s("count", a); s("pop", sub);
  pc(a, e, "dark", (t) => (
    <Center gap={40}>
      <Ring k={0.083 * p(t, a, 0.9)} size={400} dark><Big size={110} color={C.white}>{fmt(count(t, a, 0, 8.3), 1)} %</Big></Ring>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={enter(t, a + 0.3)}><Label size={50} color={C.white}>de margen</Label></div>
        <div style={enter(t, sub)}><Label size={40} color="#BBBBBB">1.500 € de 18.000 €</Label></div>
      </div>
    </Center>
  ));
}
rightTitle(at(151.7), at(165.3), w("rentabilidad", 157.0), [{ t: "Primero, la", k: "s" }, { t: "rentabilidad", k: "serif" }]);
{
  const a = at(165.3), e = at(177.2), ctl = w("control", 166.9), bus = w("buscar", 170.3);
  const st: [string, number][] = [["Cuánto entra", w("entrando", 173.4)], ["Cuánto sale", w("saliendo", 174.7)], ["Cuánto mejorar", w("mejorar", 176.5)]];
  s("stamp", ctl + 0.3); s("pop", bus); st.forEach(([, a2]) => s("pop", a2));
  pc(a, e, "light", (t) => (
    <Center gap={50}>
      <Rich toks={[{ t: "¿Qué es lo que" }, { t: "pasa?", k: "serif" }]} t={t} a={a} size={64} />
      <div style={{ ...enter(t, ctl), opacity: p(t, ctl) * (1 - 0.6 * p(t, bus, 0.4)) }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 36px" }}><XMark t={t} a={ctl + 0.3} /><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 42 }}>Sin control de lo que gana cada servicio</span></Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, height: 170 }}>
        <div style={enter(t, bus)}><Label size={40} color={C.black}>Antes de buscar clientas…</Label></div>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {st.map(([l, sa], i) => (
            <React.Fragment key={l}>
              {i > 0 ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 50, color: C.accent, opacity: p(t, sa) }}>→</div> : null}
              <div style={popIn(t, sa)}><Pill bg={i === 2 ? C.accent : C.anth} size={42}>{l}</Pill></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </Center>
  ));
}
{
  const a = w("reservar", 188.6);
  s("pop", a);
  right(at(185.74), at(197.9), (t) => <CtaCard t={t} a={a} />);
}

// ===================== 02 · COMPRAS =====================
chapter(at(197.98), at(200.0), "02", [{ t: "Las", k: "s" }, { t: "compras", k: "serif" }]);
{
  const a = at(200.0), n = w("2.700", 200.6), alt = w("alto", 204.8), red = w("reduciría", 206.7), d = w("2.160", 210.4), m = w("540", 214.4), e = at(216.1);
  s("count", n); s("rise", n); s("pop", alt); s("swoosh", red); s("count", d); s("pop", m);
  pc(a, e, "light", (t) => {
    const v = t < d ? count(t, n, 0, 2700, 1.0) : count(t, d, 2700, 2160, 1.0);
    return (
      <Center>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 90 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, height: 600, justifyContent: "flex-end" }}>
            <div style={{ width: 200, height: (v / 2700) * 520, background: t < d ? "#CFC8C1" : C.accent, borderRadius: 24, position: "relative" }}>
              {t >= d ? <div style={{ position: "absolute", left: 0, right: 0, top: -(540 / 2700) * 520 * p(t, d, 1.0), height: (540 / 2700) * 520 * p(t, d, 1.0), border: `4px dashed ${C.serif}`, borderRadius: 24, boxSizing: "border-box" }} /> : null}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28, width: 900 }}>
            <div style={blurIn(t, a)}><Label size={42} color={C.black}>Gasto en producto al mes</Label></div>
            <Big size={180} color={t < d ? C.black : C.serif}>{miles(v)} €</Big>
            <div style={{ display: "flex", alignItems: "center", gap: 24, height: 80 }}>
              <div style={popIn(t, alt)}><Pill size={38} bg={C.anth}>⚠ Un poco alto para su facturación</Pill></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24, height: 90 }}>
              <div style={{ opacity: p(t, red) }}><Arrow t={t} a={red} w={70} dir="down" color={C.serif} /></div>
              <div style={enter(t, m)}><div style={{ transform: `scale(${pulse(t, m + 0.28)})` }}><Pill size={46}>−540 € al mes</Pill></div></div>
            </div>
          </div>
        </div>
      </Center>
    );
  });
}
{
  const it = ticks([["Pedidos", w("pedidos", 219.6)], ["Almacén", w("almacén", 220.6)], ["Consumo", w("consumo", 221.6)], ["Proveedores", w("proveedores", 224.5)]]);
  const fu = w("fugas", 226.6);
  s("swoosh", fu);
  right(at(216.6), at(230.2), (t) => (
    <>
      <Win file="pexels-7316385.mp4" from={at(216.6)} to={at(230.2)} trim={1} t={t} />
      <List t={t} items={it} />
      <div style={{ position: "absolute", left: 1580, top: 520, ...blurIn(t, fu) }}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 110, color: C.lt, textShadow: tshadow }}>fugas</span></div>
    </>
  ));
}

// ===================== 03 · PRECIOS =====================
chapter(at(231.0), at(233.4), "03", [{ t: "Los", k: "s" }, { t: "precios", k: "serif" }]);
{
  const a = at(233.4), e = at(248.0), mi = w("mirando", 234.5), lado = w("lado", 237.2) + 0.25, ti = w("realmente", 239.4), fin = w("realiza", 246.7);
  const parts: [string, number][] = [["Producto", w("producto", 241.6)], ["Tiempo", w("tiempo", 243.3)], ["Trabajadora", w("trabajadora", 245.8)]];
  s("pop", mi); s("stamp", lado); s("swoosh", ti); parts.forEach(([, a2]) => s("pop", a2)); s("pop", fin);
  pc(a, e, "light", (t) => (
    <>
      <Layer o={fadeOut(t, ti - 0.1, 0.35)}>
        <Center gap={30}>
          <div style={popIn(t, mi)}><Card style={{ padding: "40px 60px", textAlign: "center" }}>
            <Label size={34}>El precio</Label>
            <Strike t={t} a={lado}><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 64, color: C.black }}>copiado de la peluquería de al lado</div></Strike>
          </Card></div>
        </Center>
      </Layer>
      <Layer o={p(t, ti - 0.1, 0.35)}>
        <Center gap={60}>
          <Rich toks={[{ t: "Coste" }, { t: "real", k: "serif" }, { t: "del servicio", k: "s" }]} t={t} a={ti} size={60} />
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {parts.map(([l, pa], i) => (
              <React.Fragment key={l}>
                {i > 0 ? <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 70, color: C.accent, opacity: p(t, pa) }}>+</div> : null}
                <div style={popIn(t, pa)}><Card style={{ width: 330, textAlign: "center" }}><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46 }}>{l}</div></Card></div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ ...enter(t, fin), height: 80 }}><Pill size={44}>= coste real</Pill></div>
        </Center>
      </Layer>
    </>
  ));
}
{
  const a = at(254.3), e = at(260.0), pr = w("precios", 256.5), mal = w("mal", 258.0);
  s("count", w("90", 255.5)); s("pop", pr); s("swoosh", mal);
  const n = w("90", 255.5);
  pc(a, e, "dark", (t) => (
    <Center gap={36}>
      <div style={blurIn(t, a)}><Ring k={0.9 * p(t, n, 0.9)} size={400} dark><Big size={130} color={C.white}>{Math.round(count(t, n, 0, 90))}&nbsp;%</Big></Ring></div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 28, height: 170 }}>
        <div style={blurIn(t, pr)}><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 80, color: C.white }}>de los precios</span></div>
        <div style={blurIn(t, mal)}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 130, color: C.lt }}>mal puestos</span></div>
      </div>
    </Center>
  ));
}
{
  const a = at(260.0), e = at(284.0);
  const c95 = w("95", 260.8), tres = w("tres", 263.1), c65 = w("65", 267.6), una = w("hora", 270.2), pri = w("priorizando", 271.7), err = w("error", 274.9), eno = w("enorme", 275.9), st = w("precio", 279.2), ben = w("beneficio", 280.9);
  s("pop", c95); [0, 1, 2].forEach((i) => s("tick", tres + i * 0.25)); s("pop", c65); s("tick", una); s("pop", pri); s("stamp", err); s("pop", eno); s("swoosh", st); s("swoosh", ben);
  const cards: [string, string, number, number, number][] = [["95 €", "3 h de agenda", c95, 3, tres], ["65 €", "1 h de agenda", c65, 1, una]];
  pc(a, e, "light", (t) => (
    <Center gap={50}>
      <div style={{ display: "flex", gap: 60 }}>
        {cards.map(([pr, h, ca, nb, ha], ci) => (
          <div key={pr} style={{ ...popIn(t, ca), position: "relative" }}><Card style={{ width: 480, textAlign: "center", padding: "46px 30px" }}>
            <div style={{ position: "relative", display: "inline-block" }}><Big size={130}>{pr}</Big>
              <div style={{ position: "absolute", left: -10, top: "52%", height: 8, width: `${110 * p(t, st, 0.3)}%`, background: C.accent, borderRadius: 999 }} /></div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, margin: "22px 0 14px" }}>
              {[0, 1, 2].slice(0, nb).map((i) => <div key={i} style={{ width: 70, height: 26, borderRadius: 8, border: `3px solid ${C.accent}`, background: t >= ha + i * 0.25 ? C.accent : "transparent" }} />)}
            </div>
            <Label size={40}>{h}</Label>
          </Card>
          {ci === 0 ? <div style={{ position: "absolute", top: -34, right: -30, ...popIn(t, pri) }}><Strike t={t} a={err} color={C.black}><Pill size={34} bg={C.anth}>★ Prioridad</Pill></Strike></div> : null}
          </div>
        ))}
      </div>
      <div style={{ height: 150, display: "flex", alignItems: "center" }}>
        {t < ben - 0.1 ? <div style={popIn(t, eno)}><Pill size={50} bg={C.serif}>Error enorme: decidir solo por el precio</Pill></div>
          : <Rich toks={[{ t: "Beneficio +" }, { t: "tiempo", k: "serif" }]} t={t} a={ben} size={56} />}
      </div>
    </Center>
  ));
}
rightTitle(at(284.1), at(301.3), at(284.3), [{ t: "Más trabajo,", k: "s" }, { t: "menos", k: "serif" }, { t: "beneficio", k: "s" }]);

// ===================== 04 · VENTAS =====================
chapter(at(306.4), at(309.0), "04", [{ t: "Las", k: "s" }, { t: "ventas", k: "serif" }]);
{
  const it = ticks([["Diagnóstico", w("diagnóstico", 322.4)], ["Tratamientos", w("tratamientos", 323.6)], ["Productos", w("productos", 325.6)]]);
  right(at(309.0), at(329.0), (t) => (
    <>
      <Win file="pexels-8225484.mp4" from={at(309.0)} to={at(329.0)} trim={1} t={t} />
      <List t={t} items={it} />
    </>
  ));
}
{
  const a = at(329.2), e = at(363.0);
  const obj = w("objetivo", 330.3), peor = w("peor", 333.5), v60 = w("60", 336.1), v65 = w("65", 337.2), cinco = w("5", 339.4), x = w("300", 342.1), f = w("1.500", 344.6),
    lim = w("limpio", 349.9), pro = w("producto", 351.6), cos = w("costes", 352.2), b = w("900", 356.8), sum = w("sumamos", 360.6);
  s("pop", obj); s("pop", peor); s("pop", v60); s("count", v65); s("pop", cinco); s("pop", x); s("pop", f); s("stamp", lim); s("pop", pro); s("pop", cos); s("rise", b); s("pop", sum);
  pc(a, e, "light", (t) => (
    <Center gap={30}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, height: 70 }}>
        <div style={blurIn(t, a)}><Label size={40} color={C.black}>Gasto medio por visita</Label></div>
        <div style={popIn(t, obj)}><Pill size={32}>Objetivo mínimo</Pill></div>
        <div style={enter(t, peor)}><Label size={30}>(en el peor de los casos)</Label></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 40, height: 170 }}>
        <div style={popIn(t, v60)}><Big size={160} color={t < v65 ? C.black : C.serif}>{Math.round(count(t, v65, 60, 65, 0.8))} €</Big></div>
        <div style={popIn(t, cinco)}><Pill size={40} bg={C.anth}>+5 € por visita</Pill></div>
      </div>
      <div style={{ display: "flex", gap: 26, alignItems: "center", height: 80 }}>
        <div style={enter(t, x)}><Pill bg={C.anth} size={40}>× 300 visitas</Pill></div>
        <div style={enter(t, f)}><Pill size={40}>+1.500 € de facturación al mes</Pill></div>
        <div style={popIn(t, lim)}><Label size={36} color={C.serif}>≠ beneficio limpio</Label></div>
      </div>
      <div style={{ display: "flex", gap: 26, alignItems: "center", height: 110 }}>
        <div style={popIn(t, pro)}><Pill size={34} bg="#CFC8C1" color={C.black}>− producto</Pill></div>
        <div style={popIn(t, cos)}><Pill size={34} bg="#CFC8C1" color={C.black}>− costes</Pill></div>
        <div style={{ ...enter(t, b), marginLeft: 20 }}><Rich toks={[{ t: "≈ 900 € de", k: "s" }, { t: "beneficio", k: "serif" }]} t={t} a={b} size={50} /></div>
        <div style={popIn(t, sum)}><Pill size={42}>+ 540 €</Pill></div>
      </div>
    </Center>
  ));
}
{
  const a = at(363.0), e = at(369.5), sm = w("1.440", 365.5), n = w("sin", 367.6);
  s("pop", a); s("pop", a + 0.5); s("count", sm); s("swoosh", n);
  pc(a, e, "dark", (t) => (
    <Center gap={50}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 30 }}>
        <div style={{ ...popIn(t, a), textAlign: "center" }}><Big size={110} color={C.white}>540 €</Big><Label size={34} color="#BBBBBB">compras</Label></div>
        <div style={{ ...enter(t, a + 0.3) }}><Big size={90} color={C.lt}>+</Big></div>
        <div style={{ ...popIn(t, a + 0.5), textAlign: "center" }}><Big size={110} color={C.white}>900 €</Big><Label size={34} color="#BBBBBB">ventas</Label></div>
        <div style={{ ...enter(t, sm) }}><Big size={90} color={C.lt}>=</Big></div>
        <div style={enter(t, sm)}><div style={{ transform: `scale(${pulse(t, sm + 0.9)})` }}><Big size={130} color={C.lt}>{miles(count(t, sm, 0, 1440, 0.9))} €</Big></div></div>
      </div>
      <div style={{ opacity: t >= n ? 1 : 0, height: 200 }}><Rich toks={[{ t: "al mes, sin", k: "s" }, { t: "una sola", k: "serif" }, { t: "clienta nueva", k: "s" }]} t={t} a={n} size={54} color={C.white} serifColor={C.lt} /></div>
    </Center>
  ));
}
rightTitle(at(373.6), at(380.2), at(373.8), [{ t: "Primero, tus clientas", k: "s" }, { t: "de ya", k: "serif" }]);

// ===================== 05 · FIDELIZACIÓN =====================
chapter(at(380.3), at(382.6), "05", [{ t: "La", k: "s" }, { t: "fidelización", k: "serif" }]);
{
  const a = at(382.6), e = at(411.0), vu = w("vuelve", 384.8), mar = w("margen", 387.0), cli = w("clientes", 391.5), sw = w("aplicar", 403.3);
  const hue = w("hueco", 400.7), rec = w("recuperar", 408.2);
  const bad: [string, number][] = [["Sin próxima cita", w("próxima", 393.7)], ["4 meses sin venir", w("cuatro", 395.3)], ["Hueco vacío", hue]];
  const good: [string, number][] = [["Recomendar la siguiente cita", w("recomendar", 404.6)], ["Recordar las reservas", w("recordando", 406.4)], ["Recuperar clientas", rec]];
  s("pop", vu); s("rise", mar); s("whoosh", cli - 0.2); bad.forEach(([, a2]) => s("pop", a2)); s("stamp", hue + 0.2); s("swoosh", sw); good.forEach(([, a2]) => s("tick", a2 + 0.15)); s("pop", rec + 0.3);
  // calendario 5×3; dos celdas vacías que se llenan al recuperar
  const cells = Array.from({ length: 15 }, (_, i) => i);
  const Cal: React.FC<{ t: number }> = ({ t }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 62px)", gap: 10 }}>
      {cells.map((i) => {
        const empty = (i === 6 && t >= hue + 0.2 && t < rec + 0.3) || (i === 12 && t >= hue + 0.4 && t < rec + 0.5);
        const fresh = (i === 6 || i === 12) && t >= rec + 0.3;
        return <div key={i} style={{ height: 50, borderRadius: 10, background: empty ? "transparent" : fresh ? C.accent : "#E7DED7", border: empty ? `3px dashed ${C.serif}` : "3px solid transparent" }} />;
      })}
    </div>
  );
  pc(a, e, "light", (t) => (
    <>
      <Layer o={fadeOut(t, cli - 0.2, 0.35)}>
        <Center gap={50}>
          <div style={{ ...popIn(t, vu), display: "flex", alignItems: "center", gap: 40 }}>
            <Card style={{ padding: 30 }}><div style={{ width: 160, height: 150, borderRadius: 14, border: `5px solid ${C.black}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 110, color: C.serif }}>?</div></Card>
            <Rich toks={[{ t: "¿Cuándo" }, { t: "vuelve?", k: "serif" }]} t={t} a={vu} size={70} />
          </div>
          <div style={{ ...enter(t, mar), display: "flex", alignItems: "center", gap: 20 }}><Arrow t={t} a={mar} w={60} dir="up" /><Pill size={46}>Margen de mejora</Pill></div>
        </Center>
      </Layer>
      <Layer o={p(t, cli - 0.2, 0.35)}>
        <Center>
          <Card style={{ width: 1350, padding: "44px 56px", display: "flex", alignItems: "center", gap: 60 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: C.grey, marginBottom: 16 }}>LA AGENDA</div>
              {(t < sw ? bad : good).map(([l, la]) => (
                <div key={l} style={{ ...enter(t, la), display: "flex", alignItems: "center", gap: 22, margin: "18px 0" }}>
                  {t < sw ? <div style={{ width: 44, height: 44, borderRadius: 10, background: C.border, color: C.grey, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 800, fontSize: 28 }}>!</div> : <Check on={p(t, la + 0.15, 0.2)} size={44} />}
                  <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 44, color: t < sw ? C.grey : C.black }}>{l}</span>
                </div>
              ))}
            </div>
            <div style={enter(t, cli)}><Cal t={t} /></div>
          </Card>
        </Center>
      </Layer>
    </>
  ));
}
{
  const v = w("10", 413.4), x = w("60", 416.5), f = w("600", 424.3);
  s("pop", v); s("pop", x); s("pop", f);
  right(at(411.15), at(428.6), (t) => (
    <RightBox top={220}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap", textShadow: tshadow }}>
        <div style={enter(t, v)}><Big size={96} color={C.white}>10 visitas</Big></div>
        <div style={enter(t, x)}><Big size={96} color={C.white}>× 60 €</Big></div>
      </div>
      <div style={{ ...enter(t, f), marginTop: 30 }}><Pill size={52}>+600 € de facturación</Pill></div>
    </RightBox>
  ));
}
// en lugar del vídeo de las tijeras: 600 € de facturación ≠ 600 € de beneficio → aprovechar la clienta → agenda estable
{
  const a = at(428.7), e = at(443.4), ben = w("600", 429.6), tach = w("beneficio", 431.6), cos = w("costes", 433.4), apr = w("aprovechando", 436.9), emp = w("empezando", 441.1), est = w("agenda", 442.5);
  s("pop", a); s("pop", ben); s("stamp", tach); s("pop", cos); s("tick", apr + 0.15); [0, 1, 2, 3, 4, 5].forEach((i) => s("tick", emp + 0.1 + i * 0.22)); s("pop", est);
  right(a, e, (t) => (
    <RightBox top={120}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={popIn(t, a)}><Card style={{ display: "inline-block", padding: "20px 30px" }}><Big size={60}>600 € <span style={{ fontSize: 40, fontWeight: 700, color: C.grey }}>de facturación</span></Big></Card></div>
        <div style={{ ...enter(t, ben), textShadow: tshadow }}><Strike t={t} a={tach} color={C.lt}><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 56, color: C.white }}>= 600 € de beneficio</span></Strike></div>
        <div style={popIn(t, cos)}><Pill size={40} bg={C.anth}>− costes de atenderlas</Pill></div>
        <div style={{ ...enter(t, apr), display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}><Check on={p(t, apr + 0.15, 0.2)} size={50} /><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 44, color: C.white, textShadow: tshadow, lineHeight: 1.1 }}>Aprovechar la clienta que ya tienes</span></div>
        <div style={{ ...enter(t, emp - 0.2), display: "flex", alignItems: "center", gap: 26, marginTop: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 44px)", gap: 8, padding: 14, background: "rgba(255,255,255,0.92)", borderRadius: 16 }}>
            {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ height: 32, borderRadius: 7, background: i < 6 ? (t >= emp + 0.1 + (i % 6) * 0.22 ? C.accent : "#E7DED7") : "#E7DED7" }} />)}
          </div>
          <div style={popIn(t, est)}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 64, color: C.white, textShadow: tshadow }}>Agenda estable</span></div>
        </div>
      </div>
    </RightBox>
  ));
}
{
  const a = at(443.5), e = at(471.0);
  const parts: [string, string, number, number, string][] = [["Punto de partida", "1.500 €", 1500, w("1.500", 445.8), "#CFC8C1"], ["Compras", "+540 €", 540, w("540", 449.2), C.accent], ["Ventas", "+900 €", 900, w("900", 451.9), C.accent], ["Agenda y gastos", "+400 €", 400, w("400", 456.6), C.accent]];
  const tot = w("3.340", 464.1), dob = w("doble", 469.3);
  parts.forEach(([, , , pa]) => s("rise", pa)); s("count", tot); s("swoosh", dob); s("pop", dob + 0.4);
  const H = 520, MAX = 3340;
  pc(a, e, "light", (t) => (
    <Center gap={36}>
      <div style={{ height: 160, display: "flex", alignItems: "center" }}>
        {t < dob - 0.1 ? <Rich toks={[{ t: "Vamos a juntar" }, { t: "cifras", k: "serif" }]} t={t} a={a} size={56} /> : <Rich toks={[{ t: "Más del" }, { t: "doble", k: "serif" }]} t={t} a={dob} size={60} />}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column-reverse", gap: 14, width: 600, height: H, justifyContent: "flex-start" }}>
          {parts.map(([l, v, , pa, col]) => (
            <div key={l} style={{ ...enter(t, pa), display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: col }} />
              <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 36, color: C.black, flex: 1, whiteSpace: "nowrap" }}>{l}</span>
              <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 38, color: col === C.accent ? C.serif : C.black }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "relative", width: 280, height: H, display: "flex", flexDirection: "column-reverse" }}>
          {parts.map(([l, , v, pa, col]) => <div key={l} style={{ height: (v / MAX) * (H - 20) * p(t, pa, 0.5), background: col, borderRadius: 12, margin: "2px 0" }} />)}
          <div style={{ position: "absolute", left: -40, right: -40, bottom: (3000 / MAX) * (H - 20), borderTop: `4px dashed ${C.black}`, clipPath: `inset(0 ${100 - 100 * p(t, dob, 0.5)}% 0 0)` }} />
          <div style={{ position: "absolute", left: -120, bottom: (3000 / MAX) * (H - 20) - 26, ...popIn(t, dob + 0.4), fontFamily: INTER, fontWeight: 800, fontSize: 44, color: C.black }}>×2</div>
        </div>
        <div style={{ ...enter(t, tot), width: 520 }}><Big size={150} color={C.serif}>{miles(count(t, tot, 1500, 3340, 1.0))} €</Big><Label size={36}>de beneficio al mes</Label></div>
      </div>
    </Center>
  ));
}

// ===================== 06 · EQUIPO =====================
chapter(at(475.8), at(478.4), "06", [{ t: "El", k: "s" }, { t: "equipo", k: "serif" }]);
{
  const a = at(478.47), e = at(495.0), tres = w("tres", 479.8), imp = w("imprescindible", 481.5), l1 = w("llaman", 485.3);
  const calls: [string, number][] = [["Una queja", l1], ["Falta producto", w("llaman", 487.8)], ["Cambiar una cita", w("llaman", 490.4)], ["Una duda", w("duda", 492.8)]];
  [0, 1, 2].forEach((i) => s("pop", tres + i * 0.15)); s("stamp", imp); s("swoosh", l1 - 0.25); calls.forEach(([, c]) => s("phone", c));
  pc(a, e, "dark", (t) => (
    <>
      <Layer o={fadeOut(t, l1 - 0.3, 0.35)}>
        <Center gap={40}>
          <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
            <div style={{ display: "flex", gap: 20 }}>{[0, 1, 2].map((i) => <div key={i} style={popIn(t, tres + i * 0.15)}><Person size={110} color="#9A9A9A" /></div>)}</div>
            <div style={{ ...blurIn(t, a), transform: `scale(${pulse(t, imp)})` }}><Ring k={1} size={300} dark><Label size={44} color={C.white}>La dueña</Label></Ring></div>
          </div>
          <div style={{ height: 160 }}><div style={popIn(t, imp)}><Rich toks={[{ t: "Imprescindible", k: "serif" }, { t: "para todo", k: "s" }]} t={t} a={imp} size={52} color={C.white} serifColor={C.lt} /></div></div>
        </Center>
      </Layer>
      <Layer o={p(t, l1 - 0.3, 0.35)}>
        <Center gap={50}>
          <Rich toks={[{ t: "Y siempre", k: "s" }, { t: "la llaman", k: "serif" }]} t={t} a={l1 - 0.25} size={56} color={C.white} serifColor={C.lt} />
          <div style={{ display: "flex", gap: 30 }}>
            {calls.map(([l, ca], i) => <div key={i} style={popIn(t, ca)}><Card dark style={{ width: 330, height: 210, display: "flex", flexDirection: "column", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><Label size={26} color={C.lt}>LA LLAMAN</Label><Phone t={t} a={ca} /></div><div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40 }}>{l}</div></Card></div>)}
          </div>
        </Center>
      </Layer>
    </>
  ));
}
{
  const it = ticks([["Responsabilidades claras", w("responsabilidades", 507.6)], ["Protocolos", w("protocolos", 510.6)]]);
  right(at(502.8), at(517.0), (t) => <List t={t} left={1230} top={240} width={630} size={46} items={it} />);
}
{
  const a = at(520.0), h = w("45", 521.4), m = w("5", 526.8), tar = w("tareas", 529.0), otr = w("otra", 530.9), form = w("formación", 533.2), e = at(534.4);
  s("count", h); s("rise", h + 0.1); s("swoosh", m); s("pop", m + 0.3); s("pop", tar); s("swoosh", otr - 0.3); s("pop", otr); s("pop", form);
  const BW = 1200;
  pc(a, e, "light", (t) => (
    <Center gap={36}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 30 }}>
        <div style={blurIn(t, a)}><Label size={44} color={C.black}>La dueña trabaja</Label></div>
        <div style={popIn(t, h)}><Big size={170}>{Math.round(count(t, h, 0, 45, 0.9))} h</Big></div>
        <div style={enter(t, h + 0.3)}><Label size={40}>a la semana</Label></div>
      </div>
      <div style={{ position: "relative", width: BW, height: 70 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 70, width: BW * (40 / 45) * p(t, h, 0.9), background: "#CFC8C1", borderRadius: "18px 0 0 18px" }} />
        <div style={{ position: "absolute", left: BW * (40 / 45) + 14 * p(t, m, 0.4), top: -18 * p(t, m, 0.4), height: 70, width: (BW * 5) / 45 * p(t, h + 0.6, 0.3), background: t >= m ? C.accent : "#CFC8C1", borderRadius: "0 18px 18px 0" }} />
        <div style={{ position: "absolute", right: -40, top: 92, ...popIn(t, m + 0.3) }}><Pill size={40}>−5 h · primer objetivo</Pill></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, height: 100, marginTop: 110 }}>
        <div style={popIn(t, tar)}><Pill size={40} bg={C.anth}>Tareas que se repiten</Pill></div>
        <div style={{ opacity: p(t, otr - 0.3) }}><Arrow t={t} a={otr - 0.3} w={90} /></div>
        <div style={{ ...popIn(t, otr), display: "flex", alignItems: "center", gap: 12 }}><Person size={64} color={C.accent} /><Pill size={40}>Otra persona</Pill></div>
        <div style={popIn(t, form)}><Label size={38} color={C.black}>con formación</Label></div>
      </div>
    </Center>
  ));
}
{
  const it = ticks([["Salir una mañana", w("mañana", 551.2)], ["Equipo que sabe qué hacer", w("trabajadoras", 554.8)], ["Pedidos correctos", w("pedidos", 557.4)], ["Dirigir y crecer", w("dirigir", 561.8)]]);
  right(at(545.0), at(568.0), (t) => (
    <>
      <Win file="pexels-3997179.mp4" from={at(545.0)} to={at(568.0)} trim={1} t={t} />
      <List t={t} items={it} />
    </>
  ));
}

// ===================== 07 · CRECIMIENTO =====================
chapter(at(568.2), at(572.6), "07", [{ t: "El", k: "s" }, { t: "crecimiento", k: "serif" }]);
{
  const a = at(586.8), e = at(602.0), com = w("comunicación", 588.3), dif = w("diferentes", 589.5), och = w("ocho", 590.7), ser = w("servicios", 598.7);
  const ch: [string, number][] = [["Ficha de Google", w("google", 594.3)], ["Reseñas", w("reseñas", 595.1)], ["Instagram", w("instagram", 595.9)], ["Contenido", w("contenido", 597.3)]];
  s("pop", a + 0.1); s("pop", com); s("swoosh", dif); Array.from({ length: 8 }, (_, i) => s("tick", och + i * 0.09)); s("pop", och + 0.9); ch.forEach(([, c]) => s("pop", c)); s("pop", ser);
  pc(a, e, "orange", (t) => (
    <Center gap={44}>
      <div style={{ height: 230, display: "flex", alignItems: "center" }}>
        {t < och ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ ...popIn(t, a + 0.1), whiteSpace: "nowrap" }}><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 70, color: C.white }}>Definir la </span><span style={{ ...blurIn(t, com), fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 110, color: C.white }}>comunicación</span></div>
            <div style={{ ...enter(t, dif), whiteSpace: "nowrap" }}><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 56, color: C.anth }}>¿Qué nos hace diferentes?</span></div>
          </div>
        ) : <div style={blurIn(t, och)}><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 70, color: C.white }}>Diferente a las <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 130 }}>8</span> del barrio</span></div>}
      </div>
      <div style={{ display: "flex", gap: 26, alignItems: "flex-end", height: 110 }}>
        {Array.from({ length: 9 }, (_, i) => {
          const me = i === 4;
          return <div key={i} style={popIn(t, me ? och + 0.9 : och + (i > 4 ? i - 1 : i) * 0.09)}><Shop size={me ? 110 : 76} color={me ? C.white : "rgba(255,255,255,0.45)"} door={me ? C.accent : C.accent} /></div>;
        })}
      </div>
      <div style={{ display: "flex", gap: 26, height: 110 }}>
        {ch.map(([l, ca]) => <div key={l} style={popIn(t, ca)}><Card style={{ width: 330, textAlign: "center" }}><div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40 }}>{l}</div></Card></div>)}
      </div>
      <div style={{ ...enter(t, ser), height: 80 }}><Pill size={42} bg={C.anth}>Servicios que nos interesa vender</Pill></div>
    </Center>
  ));
}
{
  const a = at(606.6), e = at(622.0), ren = w("rentabilidad", 609.2), liar = w("liar", 612.1), base = w("base", 617.7), igu = w("igual", 621.5);
  const bars: [string, number, number, string][] = [["Trabajo", 1, w("trabajo", 614.6), C.accent], ["Costes", 1, w("costes", 616.6), C.accent], ["Beneficio", 0, w("igual", 620.8), "#666666"]];
  s("pop", a); s("stamp", ren + 0.2); s("pop", liar); bars.forEach(([, up, b]) => s(up ? "rise" : "pop", b)); s("swoosh", base); s("pop", igu);
  pc(a, e, "dark", (t) => (
    <Center gap={40}>
      <div style={{ height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {t < base - 0.1 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={popIn(t, a)}><Pill size={42}>Atraer clientas</Pill></div>
              <div style={{ ...enter(t, ren), display: "flex", alignItems: "center", gap: 14 }}><XMark t={t} a={ren + 0.2} color={C.lt} /><span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 46, color: C.white }}>sin conocer la rentabilidad</span></div>
            </div>
            <div style={blurIn(t, liar)}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 110, color: C.lt }}>la vas a liar</span></div>
          </>
        ) : <Rich toks={[{ t: "Si la", k: "s" }, { t: "base", k: "serif" }, { t: "está mal…", k: "s" }]} t={t} a={base} size={60} color={C.white} serifColor={C.lt} />}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 80, height: 400 }}>
        {bars.map(([l, up, ba, col]) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: p(t, ba) }}>
            <Big size={64} color={col === C.accent ? C.lt : "#999999"}>{up ? "↑" : "="}</Big>
            <div style={{ width: 200, height: (up ? 120 + 180 * p(t, ba, 0.7) : 120), background: col, borderRadius: 20 }} />
            <Label size={36} color={C.white}>{l}</Label>
          </div>
        ))}
        <div style={{ ...blurIn(t, igu), alignSelf: "center" }}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 80, color: C.lt }}>igual de mal</span></div>
      </div>
    </Center>
  ));
}
rightTitle(at(643.9), at(651.0), w("aburrido", 644.9), [{ t: "Aburrido… pero da", k: "s" }, { t: "dinero", k: "serif" }]);

// ===================== ANTES Y DESPUÉS + PLAN =====================
{
  const a = at(665.2), e = at(694.4), ant = w("antes", 668.2), cam = w("cambios", 676.8), tres = w("tres", 677.9);
  const antRows: [string, number][] = [["18.000 € de facturación", w("18.000", 670.3)], ["1.500 € de beneficio", w("1.500", 672.6)], ["Todo depende de la dueña", w("dependía", 674.2)]];
  const des = w("3.340", 680.5), tie = w("tiempo", 687.3);
  const stamps: [string, number][] = [["Mismas clientas", w("duplicado", 688.5)], ["Sin gastar más", w("gastado", 690.2)], ["Mejor gestión", w("gestión", 692.3)]];
  s("pop", ant); antRows.forEach(([, r]) => s("pop", r)); s("swoosh", cam); s("pop", tres); s("count", des); s("pop", tie); stamps.forEach(([, r]) => s("stamp", r));
  pc(a, e, "light", (t) => (
    <Center gap={34}>
      <Rich toks={[{ t: "Antes y", k: "s" }, { t: "después", k: "serif" }]} t={t} a={a} size={56} />
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <div style={popIn(t, ant)}><Card style={{ width: 620, minHeight: 300 }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: C.grey, marginBottom: 12 }}>ANTES</div>
          {antRows.map(([l, ra]) => <div key={l} style={{ ...enter(t, ra), fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.black, margin: "16px 0" }}>{l}</div>)}
        </Card></div>
        <div style={{ opacity: p(t, cam) }}><Arrow t={t} a={cam} w={90} /></div>
        <div style={popIn(t, tres)}><Card style={{ width: 620, minHeight: 300, border: `3px solid ${C.accent}` }}>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 26, letterSpacing: "0.2em", color: C.accent, marginBottom: 12 }}>EN 3 MESES</div>
          <div style={{ ...enter(t, des), display: "flex", alignItems: "baseline", gap: 14, margin: "10px 0" }}><Big size={80} color={C.serif}>{miles(count(t, des, 1500, 3340, 1.0))} €</Big><Label size={32}>de beneficio</Label></div>
          <div style={{ ...enter(t, tie), fontFamily: INTER, fontWeight: 700, fontSize: 40, color: C.black, margin: "16px 0" }}>Más tiempo para la dueña</div>
        </Card></div>
      </div>
      <div style={{ display: "flex", gap: 30, height: 90, alignItems: "center" }}>
        {stamps.map(([l, ra], i) => <div key={l} style={{ ...popIn(t, ra), transform: `${popIn(t, ra).transform} rotate(${[-3, 2, -2][i]}deg)` }}><div style={{ border: `4px solid ${C.serif}`, borderRadius: 14, padding: "10px 26px", fontFamily: INTER, fontWeight: 800, fontSize: 40, color: C.serif, letterSpacing: "0.02em" }}>✓ {l}</div></div>)}
      </div>
    </Center>
  ));
}
{
  const a = at(696.0), e = at(717.8);
  const steps: [string, number][] = [["Estabilizar ingresos", w("estabilizar", 699.7)], ["Organizar el negocio", w("organizar", 707.6)], ["Crecer con control", w("crecimiento", 713.5)]];
  const chips: [number, string, number][] = [[0, "Compras", w("compras", 702.6)], [0, "Ventas", w("ventas", 704.0)], [0, "Fidelizar", w("fidelizar", 704.9)], [0, "×2 beneficio", w("duplicar", 705.7)], [1, "Más libertad", w("libertad", 709.5)], [2, "Controlado", w("controlado", 714.2)]];
  const prim = w("primero", 715.1);
  steps.forEach(([, a2], i) => { s("pop", a2); if (i) s("swoosh", a2 - 0.5); }); chips.forEach(([, , c]) => s("tick", c)); s("stamp", prim + 0.2);
  pc(a, e, "light", (t) => (
    <Center gap={56}>
      <Rich toks={[{ t: "El plan:", k: "s" }, { t: "3 meses", k: "serif" }]} t={t} a={a} size={56} />
      <div style={{ position: "relative", display: "flex", gap: 80 }}>
        <svg width={1300} height={20} style={{ position: "absolute", left: 60, top: 50 }}>
          <line x1={0} y1={10} x2={1180} y2={10} stroke={C.border} strokeWidth={6} strokeLinecap="round" />
          <line x1={0} y1={10} x2={(1180 / 2) * p(t, steps[1][1] - 0.5, 0.6) + (1180 / 2) * p(t, steps[2][1] - 0.5, 0.6)} y2={10} stroke={C.accent} strokeWidth={6} strokeLinecap="round" />
        </svg>
        {steps.map(([l, sa], i) => (
          <div key={l} style={{ ...enter(t, sa), width: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: i === 2 ? C.accent : C.white, boxShadow: shadow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 60, color: i === 2 ? C.white : C.serif }}>{i + 1}</div>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 40, textAlign: "center", color: C.black }}>{l}</div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, minHeight: 120 }}>
              {chips.filter(([si]) => si === i).map(([, cl2, ca]) => <div key={cl2} style={popIn(t, ca)}><Pill size={28} bg={cl2.startsWith("×2") ? C.accent : C.anth}>{cl2}</Pill></div>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...popIn(t, prim + 0.2), height: 70 }}><div style={{ border: `4px solid ${C.serif}`, borderRadius: 14, padding: "8px 26px", fontFamily: INTER, fontWeight: 800, fontSize: 40, color: C.serif }}>Primero: que sea rentable</div></div>
    </Center>
  ));
}
{
  const it = ticks([["Formar al equipo", w("formar", 724.1)], ["Mejorar las instalaciones", w("instalaciones", 726.5)], ["Captar nuevas clientas", w("captación", 728.6)]]);
  right(at(719.6), at(731.5), (t) => <List t={t} left={1230} top={240} width={630} size={46} items={it} />);
}
rightTitle(at(731.6), at(752.0), w("colchón", 731.9), [{ t: "Un", k: "s" }, { t: "colchón", k: "serif" }, { t: "económico", k: "s" }]);

// ===================== MI HISTORIA Y CIERRE =====================
{
  const a = at(752.6), e = at(767.0), pri = w("primer", 754.1), c = w("cinco", 757.1), cre = w("crees", 758.8);
  const tasks: [string, number][] = [["Atendiendo clientas", w("atendiendo", 761.5)], ["Haciendo pedidos", w("pedidos", 763.3)], ["Organizando agendas", w("agendas", 764.9)], ["Solucionando problemas", w("problemas", 765.9)]];
  s("pop", a); s("pop", pri); [1, 2, 3, 4].forEach((i) => s("tick", c + i * 0.12)); s("swoosh", cre); tasks.forEach(([, a2]) => s("pop", a2));
  pc(a, e, "light", (t) => (
    <Center gap={34}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26, height: 140 }}>
        <Rich toks={[{ t: "No soy", k: "s" }, { t: "estilista", k: "serif" }]} t={t} a={a} size={60} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 50, height: 170 }}>
        <div style={{ display: "flex", gap: 18 }}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={popIn(t, i === 0 ? pri : c + i * 0.12)}><Shop size={120} color={i === 0 ? C.serif : C.accent} /></div>)}
        </div>
        <div style={{ ...enter(t, c), display: "flex", alignItems: "baseline", gap: 16 }}><Big size={150} color={C.serif}>{Math.round(count(t, c, 1, 5, 0.6))}</Big><Label size={48} color={C.black}>locales</Label></div>
      </div>
      <div style={{ ...enter(t, cre), height: 60 }}><Label size={40} color={C.black}>¿Estar personalmente en cada uno…?</Label></div>
      <div style={{ display: "flex", gap: 20, height: 80 }}>
        {tasks.map(([l, la]) => <div key={l} style={popIn(t, la)}><Pill size={34} bg={C.anth}>{l}</Pill></div>)}
      </div>
    </Center>
  ));
}
{
  const it = ticks([["Conocer sus números", w("números", 786.6)], ["Precios bien calculados", w("precios", 787.4)], ["Comprar bien", w("comprar", 789.1)], ["Un equipo formado", w("equipo", 792.0)]]);
  right(at(784.5), at(795.5), (t) => <List t={t} left={1230} top={200} width={630} size={46} items={it} />);
}
{
  const a = at(798.4), e = at(805.2), din = w("dinero", 799.1), tie = w("tiempo", 800.8), emp = w("empresario", 802.7);
  s("pop", din); s("pop", tie); s("swoosh", emp);
  pc(a, e, "light", (t) => (
    <Center gap={50}>
      <div style={{ display: "flex", gap: 28, height: 90, alignItems: "center" }}>
        <div style={popIn(t, din)}><Pill size={46}>Más dinero</Pill></div>
        <div style={popIn(t, tie)}><Pill size={46} bg={C.anth}>sin más tiempo de tu vida</Pill></div>
      </div>
      <div style={{ height: 200 }}><Rich toks={[{ t: "Empresaria," }, { t: "no solo", k: "small" }, { t: "estilista", k: "serif" }]} t={t} a={emp} size={80} /></div>
    </Center>
  ));
}
{
  const pills: [string, number][] = [["Compras", w("compras", 820.3)], ["Precios", w("precios", 822.4)], ["Fidelización", w("fidelización", 823.4)], ["Diferenciación", w("diferenciación", 824.9)]];
  pills.forEach(([, a]) => s("pop", a));
  right(at(819.3), at(829.0), (t) => (
    <RightBox top={220}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, width: 660 }}>
        {pills.map(([l, la]) => <div key={l} style={popIn(t, la)}><Pill size={44} bg={C.anth}>{l}</Pill></div>)}
      </div>
    </RightBox>
  ));
}
{
  const a = w("reservar", 837.3);
  s("pop", a);
  right(at(836.0), at(846.2), (t) => <CtaCard t={t} a={a} />);
}

// lista de sonidos para la mezcla (la lee mezcla_v2.py desde el log del navegador)
SND.sort((x, y) => x.t - y.t);
if (typeof window !== "undefined" && !(window as unknown as { __snd?: boolean }).__snd) {
  (window as unknown as { __snd?: boolean }).__snd = true;
  console.log("SND_JSON " + JSON.stringify(SND));
}

// ---------- cámara ----------
const FX = 0.37 * 1920, FY = 0.22 * 1080;
const camZoom = (t: number) => {
  let i = SEGS.findIndex((x) => t >= x.out_start && t < x.out_start + x.out_dur);
  if (i < 0) i = SEGS.length - 1;
  const sg = SEGS[i];
  const k = (t - sg.out_start) / Math.max(0.001, sg.out_dur);
  const closed = i % 3 === 1;
  const [z0, z1] = closed ? [1.16, 1.12] : i % 2 ? [1.04, 1.0] : [1.0, 1.04];
  return interpolate(k, [0, 1], [z0, z1], { ...cl, easing: eio });
};

// ---------- subtítulos: SOLO en pantallas completas ----------
const clean = (x: string) => x.replace(/[.,;:]+$/g, "");
type Block = { text: string; start: number; end: number };
const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  let cur: Word[] = [];
  const flush = () => { if (cur.length) { out.push({ text: cur.map((x) => clean(x.text)).join(" "), start: cur[0].start, end: cur[cur.length - 1].end }); cur = []; } };
  WORDS.forEach((x, i) => {
    if (!x.text) return;
    const prev = cur[cur.length - 1];
    const chars = cur.map((y) => clean(y.text)).join(" ").length + clean(x.text).length + 1;
    if (cur.length && (cur.length >= 3 || chars > 20 || x.start - prev.end > 0.3)) flush();
    cur.push(x);
    if (/[.,?;:!]$/.test(x.text) || !WORDS[i + 1]) flush();
  });
  return out.map((b, i) => ({ ...b, end: Math.min(out[i + 1]?.start ?? b.end + 0.3, b.end + 0.4) }));
})();
const outline = "0 0 2px rgba(0,0,0,0.85), 1px 1px 0 rgba(0,0,0,0.55), -1px 1px 0 rgba(0,0,0,0.55), 1px -1px 0 rgba(0,0,0,0.55), -1px -1px 0 rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.45)";
const Subs: React.FC<{ t: number; pcBg: Bg; o: number }> = ({ t, pcBg, o }) => {
  const b = BLOCKS.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const onLight = pcBg === "light";
  const k = interpolate(t, [b.start, b.start + 0.08], [0.6, 1], cl);
  return (
    <div style={{ position: "absolute", left: 0, width: 1920, top: 990, transform: "translateY(-50%)", display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: onLight ? C.black : C.white, textShadow: onLight ? "none" : outline, whiteSpace: "nowrap", opacity: k }}>{b.text}</div>
    </div>
  );
};

// ---------- composición ----------
export const YtDDMB6807v2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pcNow = S.find((x) => x.kind === "pc" && t >= x.from && t < x.to);
  const rights = S.filter((x) => x.kind === "right" && t >= x.from - 0.01 && t < x.to);
  const z = camZoom(t);
  let pcOp = 0;
  if (pcNow) pcOp = Math.min(p(t, pcNow.from, 0.3), 1 - p(t, pcNow.to - 0.3, 0.3));
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${FX}px ${FY}px` }}>
        <OffthreadVideo src={staticFile("DDMB6807/video.mp4")} muted style={{ width: 1920, height: 1080 }} />
      </AbsoluteFill>
      {rights.map((x, i) => {
        const o = 1 - p(t, x.to - 0.2, 0.2);
        return <AbsoluteFill key={i} style={{ opacity: o }}>{x.draw(t)}</AbsoluteFill>;
      })}
      {pcNow ? (
        <AbsoluteFill style={{ opacity: pcOp, filter: pcOp < 1 ? `blur(${(1 - pcOp) * 10}px)` : undefined }}>
          {pcNow.bg === "dark" ? <DarkBg /> : pcNow.bg === "orange" ? <OrangeBg /> : <LightBg t={t} />}
          {pcNow.draw(t)}
        </AbsoluteFill>
      ) : null}
      {pcNow && pcOp > 0.01 ? <Subs t={t} pcBg={pcNow.bg ?? "light"} o={pcOp} /> : null}
    </AbsoluteFill>
  );
};
void count2;
