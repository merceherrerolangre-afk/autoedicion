// Piezas «tipo app premium» (v3, 11 nov 2026): paneles, chips, interruptores, gráficas, contadores, notificaciones, cursor.
// Escenas completas con varias piezas a la vez (no stickers sueltos). Marca: naranja y blanco; tarjetas oscuras con brillo naranja.
import React from "react";
import { interpolate } from "remotion";
import { G3, clamp, darkSurface, easeInOut, fontFamily, inset, lerp, orangeFill, orangeGlowBox, popIn, softBack, surface } from "./common";

export const INK = "#1C1917";
export const MUTED = "#8C817A";
export const OR = "#EE8A4F";

/** Entrada estándar: sube 36 px, escala 0.92→1 y funde (450 ms). */
export const enter = (t: number, at: number, dy = 36): React.CSSProperties => {
  const p = popIn(t, at);
  const k = lerp(t, at, at + 0.45, 0, 1, softBack);
  return { opacity: p.o, transform: `translateY(${(1 - k) * dy}px) scale(${0.92 + 0.08 * k})` };
};
export const float = (t: number, seed = 0, amp = 6) => Math.sin(t * 2 + seed) * amp;

export const Panel: React.FC<{ w: number; h?: number; dark?: boolean; r?: number; pad?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, dark, r = 40, pad = 28, style, children }) => (
  <div style={{ width: w, height: h, boxSizing: "border-box", padding: pad, position: "relative", ...(dark ? darkSurface(r) : surface(r)), ...style }}>{children}</div>
);

export const Txt: React.FC<{ s?: number; w?: number; c?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ s = 30, w = 700, c = INK, style, children }) => (
  <div style={{ fontFamily, fontWeight: w, fontSize: s, color: c, letterSpacing: "-0.015em", lineHeight: 1.12, whiteSpace: "nowrap", ...style }}>{children}</div>
);

export const Chip: React.FC<{ text: string; tone?: "orange" | "white" | "dark" | "soft"; s?: number; icon?: React.ReactNode; style?: React.CSSProperties }> = ({ text, tone = "white", s = 26, icon, style }) => {
  const bg =
    tone === "orange" ? { background: orangeFill, boxShadow: orangeGlowBox, color: "#FFFFFF" }
    : tone === "dark" ? { background: "linear-gradient(180deg,#3A3532,#1D1A18)", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.18), 0 8px 18px rgba(30,15,5,0.35)", color: "#FFFFFF" }
    : tone === "soft" ? { ...inset(999), color: MUTED }
    : { ...surface(999), color: INK };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: s * 0.4, padding: `${s * 0.42}px ${s * 0.8}px`, borderRadius: 999, fontFamily, fontWeight: 700, fontSize: s, letterSpacing: "-0.01em", whiteSpace: "nowrap", ...bg, ...style }}>
      {icon}{text}
    </div>
  );
};

/** Interruptor tipo iOS que se enciende en naranja. */
const TOGGLE_TONES = {
  orange: { a: "245,154,95", b: "222,114,56", glow: orangeGlowBox },
  red: { a: "240,96,86", b: "205,48,42", glow: "0 0 26px rgba(230,60,50,0.65), 0 8px 18px rgba(150,30,20,0.35)" },
  green: { a: "104,206,132", b: "46,158,88", glow: "0 0 26px rgba(60,190,110,0.6), 0 8px 18px rgba(20,110,50,0.3)" },
};
export const Toggle: React.FC<{ on: number; w?: number; tone?: keyof typeof TOGGLE_TONES }> = ({ on, w = 96, tone = "orange" }) => {
  const h = w * 0.58;
  const k = TOGGLE_TONES[tone];
  return (
    <div style={{ width: w, height: h, borderRadius: 999, position: "relative", ...inset(999), background: `linear-gradient(180deg, rgba(${k.a},${on}), rgba(${k.b},${on})), linear-gradient(180deg,#E6DED8,#F3EEEA)`, boxShadow: on > 0.5 ? k.glow : "inset 0 3px 7px rgba(120,85,60,0.18)" }}>
      <div style={{ position: "absolute", top: 4, left: 4 + on * (w - h), width: h - 8, height: h - 8, borderRadius: "50%", background: "linear-gradient(180deg,#FFFFFF,#F1ECE8)", boxShadow: "0 3px 8px rgba(60,30,10,0.3)" }} />
    </div>
  );
};

/** Indicador semicircular que se llena (sin cifras). */
export const Gauge: React.FC<{ p: number; s: number; label?: string }> = ({ p, s, label }) => {
  const R = 80, L = Math.PI * R;
  return (
    <div style={{ width: s, height: s * 0.62, position: "relative" }}>
      <svg width={s} height={s * 0.62} viewBox="0 0 200 124" style={{ overflow: "visible" }}>
        <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="#E7DFD9" strokeWidth="20" strokeLinecap="round" />
        <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" transform="translate(0 -6)" opacity="0.7" />
        <g style={{ filter: "drop-shadow(0 0 8px rgba(255,140,70,0.7))" }}>
          <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="url(#gg-or)" strokeWidth="20" strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} />
        </g>
        <defs><linearGradient id="gg-or" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFC49C" /><stop offset="1" stopColor="#DE6A2E" /></linearGradient></defs>
        <g transform={`rotate(${-90 + 180 * p} 100 110)`}>
          <path d="M100 110 L100 50" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="110" r="11" fill={INK} />
      </svg>
      {label ? <Txt s={s * 0.12} w={700} c={MUTED} style={{ position: "absolute", left: 0, right: 0, bottom: -s * 0.16, textAlign: "center" }}>{label}</Txt> : null}
    </div>
  );
};

/** Línea de gráfica que se dibuja, con área degradada y punto brillante al final. */
export const LineChart: React.FC<{ w: number; h: number; pts: number[]; p: number; dark?: boolean; grid?: boolean }> = ({ w, h, pts, p, dark, grid = true }) => {
  const n = pts.length - 1;
  const xy = pts.map((v, i) => [(i / n) * w, h - v * h] as const);
  let d = `M${xy[0][0]} ${xy[0][1]}`;
  for (let i = 1; i < xy.length; i++) {
    const [x0, y0] = xy[i - 1], [x1, y1] = xy[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  const idx = Math.min(n, p * n);
  const i0 = Math.floor(idx), f = idx - i0;
  const a = xy[i0], b = xy[Math.min(n, i0 + 1)];
  const dot = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const id = `lc${w}${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F59A5F" stopOpacity={dark ? 0.45 : 0.32} /><stop offset="1" stopColor="#F59A5F" stopOpacity="0" /></linearGradient>
        <clipPath id={`${id}c`}><rect x="-20" y="-40" width={dot[0] + 20} height={h + 80} /></clipPath>
      </defs>
      {grid ? [0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(140,110,90,0.12)"} strokeWidth="2" />) : null}
      <g clipPath={`url(#${id}c)`}>
        <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={`url(#${id}a)`} />
        <path d={d} fill="none" stroke="#F08A50" strokeWidth="6" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,140,70,0.7))" }} />
      </g>
      <circle cx={dot[0]} cy={dot[1]} r="16" fill="rgba(255,150,90,0.3)" opacity={p > 0.02 ? 1 : 0} />
      <circle cx={dot[0]} cy={dot[1]} r="9" fill="#FFFFFF" stroke="#F08A50" strokeWidth="5" opacity={p > 0.02 ? 1 : 0} />
    </svg>
  );
};

/** Contador tipo rodillo (como el de «100 Daily posts»): cada cifra gira hasta su valor. */
export const Roller: React.FC<{ value: number; p: number; digits?: number; s?: number; suffix?: string }> = ({ value, p, digits = 1, s = 120, suffix }) => {
  const str = String(value).padStart(digits, "0");
  const H = s * 1.15;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {str.split("").map((ch, i) => {
        const target = Number(ch) + 10 * (2 + i);
        const pos = interpolate(p, [0, 1], [0, target], { ...clamp, easing: easeInOut });
        return (
          <div key={i} style={{ width: s * 0.72, height: H, borderRadius: s * 0.18, overflow: "hidden", position: "relative", background: "linear-gradient(180deg,#141210 0%,#2E2A27 50%,#141210 100%)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.12), 0 14px 26px rgba(30,15,5,0.4)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 - pos * H - H / 2 }}>
              {Array.from({ length: target + 2 }).map((_, k) => (
                <div key={k} style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: s * 0.9, color: "#FFFFFF" }}>{k % 10}</div>
              ))}
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,18,16,0.85) 0%, rgba(20,18,16,0) 30%, rgba(20,18,16,0) 70%, rgba(20,18,16,0.85) 100%)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 - 1, height: 2, background: "rgba(0,0,0,0.35)" }} />
          </div>
        );
      })}
      {suffix ? <Txt s={s * 0.55} c={INK} style={{ marginLeft: 8 }}>{suffix}</Txt> : null}
    </div>
  );
};

/** Cursor (mano) que se desplaza y hace clic con onda. */
export const Cursor: React.FC<{ t: number; path: [number, number, number][]; clickAt?: number[] }> = ({ t, path, clickAt = [] }) => {
  const times = path.map((q) => q[0]);
  const x = interpolate(t, times, path.map((q) => q[1]), { ...clamp, easing: easeInOut });
  const y = interpolate(t, times, path.map((q) => q[2]), { ...clamp, easing: easeInOut });
  const op = lerp(t, times[0], times[0] + 0.2, 0, 1);
  const c = clickAt.find((a) => t >= a && t < a + 0.5);
  const press = c !== undefined ? interpolate(t, [c, c + 0.08, c + 0.2], [1, 0.85, 1], clamp) : 1;
  const ring = c !== undefined ? (t - c) / 0.5 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, pointerEvents: "none" }}>
      {c !== undefined ? <div style={{ position: "absolute", left: -40 * ring - 6, top: -40 * ring - 6, width: 12 + 80 * ring, height: 12 + 80 * ring, borderRadius: "50%", border: `4px solid rgba(240,138,80,${1 - ring})` }} /> : null}
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ transform: `scale(${press})`, transformOrigin: "20% 10%", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))", marginLeft: -12, marginTop: -4 }}>
        <path d="M9 2.5a1.5 1.5 0 0 1 3 0V10l.6-.1a1.5 1.5 0 0 1 1.9 1.1l.1-.1a1.5 1.5 0 0 1 2.1.8l.2-.1a1.5 1.5 0 0 1 2.1 1.3V17a5 5 0 0 1-5 5h-1.4a5 5 0 0 1-3.9-1.9l-3.3-4.2a1.5 1.5 0 0 1 2.2-2L9 15.2Z" fill="#FFFFFF" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Persona (círculo con cabeza y cuerpo) en pequeño, para filas de seguidores. */
export const MiniAvatar: React.FC<{ s: number; hue?: number; grey?: number }> = ({ s, hue = 0, grey = 0 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ filter: `grayscale(${grey})`, overflow: "visible" }}>
    <G3 />
    <defs><clipPath id="ma-c"><circle cx="50" cy="50" r="46" /></clipPath></defs>
    <circle cx="50" cy="50" r="50" fill="#FFFFFF" />
    <g clipPath="url(#ma-c)">
      <rect width="100" height="100" fill={["#FBE7DA", "#F3E9E2", "#FDE0CC", "#EFE6DF"][hue % 4]} />
      <ellipse cx="50" cy="104" rx="36" ry="34" fill={hue % 2 ? "url(#g3-dk)" : "url(#g3-orb)"} />
      <circle cx="50" cy="41" r="19" fill="url(#g3-peach)" />
    </g>
  </svg>
);

/** Fila de perfil: avatar + nombre (barra) + chip a la derecha. */
export const UserRow: React.FC<{ hue: number; w: number; right?: React.ReactNode; grey?: number; name?: number }> = ({ hue, w, right, grey = 0, name = 0.55 }) => (
  <div style={{ width: w, display: "flex", alignItems: "center", gap: 18, opacity: 1 - grey * 0.45 }}>
    <MiniAvatar s={70} hue={hue} grey={grey} />
    <div style={{ flex: 1 }}>
      <div style={{ width: `${name * 100}%`, height: 16, borderRadius: 8, background: "#D9CFC8", marginBottom: 10 }} />
      <div style={{ width: `${name * 60}%`, height: 12, borderRadius: 6, background: "#EAE3DE" }} />
    </div>
    {right}
  </div>
);

/** Fondo de halo naranja suave (degradados radiales, sin desenfoque caro) para escenas detrás de ella. */
export const Glow: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 0.5 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,160,100,${o}) 0%, rgba(255,160,100,${o * 0.4}) 35%, rgba(255,160,100,0) 70%)` }} />
);

/** Puntos de «escribiendo…». */
export const Typing: React.FC<{ t: number; c?: string }> = ({ t, c = "#BFB3AA" }) => (
  <div style={{ display: "flex", gap: 8 }}>
    {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, transform: `translateY(${Math.sin(t * 9 - i * 0.9) * 4}px)` }} />)}
  </div>
);
