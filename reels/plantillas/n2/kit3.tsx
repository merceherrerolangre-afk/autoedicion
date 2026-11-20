// kit3 (17 nov 2026): estilo de sus REFERENCIAS de reels (igexport-*): pantalla partida RECTA (arriba la animación sobre gris claro, ella abajo),
// subtítulo en píldora gris sobre la unión, una palabra grande metálica arriba y OBJETOS REALES que se construyen despacio
// (móvil con vídeo, ventanas de informe, tickets, fichas que se rellenan, tarjetas de mensaje, conexiones que se dibujan). Sin iconos sueltos ni emojis.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile } from "remotion";
import { Block, clamp, easeInOut, easeOut, fontFamily as INTER, lerp, popIn, pulse } from "../n1/common";
import { txt } from "../n1/ui";

export const SEAM = 930;
export const ORANGE = "#E98A55";
export const GREENC = "#3BB873";
export type Win = readonly [number, number];

// ---------- pantalla partida recta ----------
export const splitP = (t: number, win: Win, inS = 0.55, outS = 0.4) => Math.min(lerp(t, win[0], win[0] + inS, 0, 1, easeInOut), 1 - lerp(t, win[1] - outS, win[1], 0, 1, easeInOut));
export const SplitRef: React.FC<{ t: number; win: Win; dir: string; hairY: number; hairTarget?: number }> = ({ t, win, dir, hairY, hairTarget = 1020 }) => {
  const p = splitP(t, win);
  const top = SEAM * p;
  const vidTop = (hairTarget - hairY) * p;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 35%, #F4F4F4 0%, #E6E6E8 100%)" }} />
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: 1920 - top, overflow: "hidden", boxShadow: p > 0.02 ? "0 -12px 36px rgba(0,0,0,0.20)" : "none" }}>
        <OffthreadVideo src={staticFile(`${dir}/video.mp4`)} style={{ position: "absolute", left: 0, top: vidTop - top, width: 1080, height: 1920 }} />
      </div>
    </AbsoluteFill>
  );
};
/** Contenido de la mitad de arriba: entra y sale con desenfoque suave. */
export const Pane: React.FC<{ t: number; win: Win; children: React.ReactNode; inS?: number }> = ({ t, win, children, inS = 0.4 }) => {
  if (t < win[0] || t >= win[1]) return null;
  const a = lerp(t, win[0], win[0] + inS, 0, 1);
  const b = lerp(t, win[1] - 0.25, win[1], 0, 1);
  const k = a * (1 - b);
  return <AbsoluteFill style={{ opacity: k, filter: `blur(${(1 - k) * 12}px)`, transform: `translateY(${(1 - a) * 18}px)` }}>{children}</AbsoluteFill>;
};

// ---------- subtítulo en píldora gris sobre la unión ----------
export const PillSub: React.FC<{ t: number; blocks: Block[]; y?: number }> = ({ t, blocks, y = SEAM }) => {
  const b = blocks.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const pop = interpolate(t, [b.start, b.start + 0.08], [0.7, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 60, letterSpacing: "-0.01em", color: "#fff", whiteSpace: "nowrap", padding: "6px 26px 10px", borderRadius: 26, background: "rgba(96,96,102,0.82)", boxShadow: "0 8px 22px rgba(0,0,0,0.22)", opacity: pop, transform: `scale(${b.solo ? pulse(t, b.start) : 1})` }}>{b.text}</div>
    </div>
  );
};

// ---------- palabra grande metálica (como «Apify» en la referencia) ----------
export const Title: React.FC<{ t: number; at: number; end?: number; text: string; size?: number; y?: number; light?: boolean }> = ({ t, at, end = 999, text, size = 150, y = 70, light }) => {
  if (t < at || t >= end) return null;
  const a = lerp(t, at, at + 0.4, 0, 1);
  const b = lerp(t, end - 0.25, end, 0, 1);
  const k = a * (1 - b);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", opacity: k, filter: `blur(${(1 - k) * 10}px)`, transform: `translateY(${(1 - a) * 24}px)` }}>
      <span style={{ ...txt(size, "transparent", 800), backgroundImage: light ? "linear-gradient(180deg,#FFFFFF 5%,#B9B1AA 100%)" : "linear-gradient(180deg,#1E1E22 8%,#8E8E94 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", display: "inline-block", filter: light ? "drop-shadow(0 6px 14px rgba(0,0,0,0.45))" : "drop-shadow(0 10px 12px rgba(0,0,0,0.22))" }}>{text}</span>
    </div>
  );
};

// ---------- objetos ----------
const SH = "0 30px 50px -12px rgba(0,0,0,0.30), 0 8px 18px rgba(0,0,0,0.12)";
export const Person: React.FC<{ s: number; fg?: string }> = ({ s, fg = "#F2F2F4" }) => (
  <svg width={s} height={s} viewBox="0 0 100 100"><circle cx="50" cy="38" r="19" fill={fg} /><path d="M12 100 a38 38 0 0 1 76 0 Z" fill={fg} /></svg>
);
export const Avatar: React.FC<{ s: number; tone?: number }> = ({ s, tone = 0 }) => {
  const g = ["linear-gradient(180deg,#D7B6A0,#B98E76)", "linear-gradient(180deg,#C7C9D4,#9EA2B4)", "linear-gradient(180deg,#E9C9A6,#D0A57C)", "linear-gradient(180deg,#B8C9BF,#8FA89B)"][tone % 4];
  return <div style={{ width: s, height: s, borderRadius: "50%", background: g, display: "grid", placeItems: "center", overflow: "hidden", flex: "none", boxShadow: "inset 0 -4px 8px rgba(0,0,0,0.15)" }}><div style={{ marginTop: s * 0.14 }}><Person s={s * 0.9} fg="rgba(255,255,255,0.92)" /></div></div>;
};
/** Tarjeta oscura de mensaje (avatar + texto o dos líneas), como las de la referencia. */
export const DarkMsg: React.FC<{ w?: number; h?: number; tone?: number; text?: string; chars?: number; style?: React.CSSProperties; glow?: boolean; fs?: number }> = ({ w = 420, h = 104, tone = 0, text, chars, style, glow, fs = 34 }) => (
  <div style={{ width: w, height: h, borderRadius: 26, display: "flex", alignItems: "center", gap: 20, padding: "0 24px", boxSizing: "border-box", background: "linear-gradient(180deg,#3B3B40,#222226)", boxShadow: glow ? `${SH}, 0 0 0 4px ${ORANGE}` : SH, ...style }}>
    <Avatar s={h * 0.62} tone={tone} />
    {text !== undefined ? (
      <div style={{ ...txt(fs, "#fff", 700), whiteSpace: "nowrap", overflow: "hidden" }}>{chars === undefined ? text : text.slice(0, chars)}</div>
    ) : (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}><div style={{ height: 11, borderRadius: 6, background: "#8D8D94", width: "92%" }} /><div style={{ height: 11, borderRadius: 6, background: "#6E6E75", width: "62%" }} /></div>
    )}
  </div>
);
/** Móvil con pantalla: el contenido llena la pantalla (vídeo, interfaz…). */
export const Phone: React.FC<{ w?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w = 380, children, style }) => (
  <div style={{ width: w, height: w * 2.02, borderRadius: w * 0.17, padding: w * 0.032, boxSizing: "border-box", background: "linear-gradient(160deg,#4A4A50,#141416)", boxShadow: `${SH}, inset 0 0 0 2px #6a6a70`, position: "relative", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.14, overflow: "hidden", background: "#fff", position: "relative" }}>{children}</div>
    <div style={{ position: "absolute", top: w * 0.07, left: "50%", width: w * 0.3, height: w * 0.08, borderRadius: 999, background: "#0A0A0B", transform: "translateX(-50%)" }} />
  </div>
);
export const VideoFill: React.FC<{ src: string; from?: number }> = ({ src, from = 0 }) => (
  <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(from * 30)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
);
/** Ventana de aplicación (barra con tres puntos). */
export const WinCard: React.FC<{ w: number; h: number; dark?: boolean; children?: React.ReactNode; style?: React.CSSProperties; head?: string }> = ({ w, h, dark, children, style, head }) => (
  <div style={{ width: w, height: h, borderRadius: 30, overflow: "hidden", background: dark ? "linear-gradient(180deg,#2C2C30,#1B1B1E)" : "linear-gradient(180deg,#FFFFFF,#F6F6F7)", boxShadow: SH, position: "relative", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderBottom: `2px solid ${dark ? "#3A3A40" : "#ECECEE"}` }}>
      {["#FF6058", "#FFBE2F", "#28CA41"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
      {head ? <div style={{ ...txt(26, dark ? "#C9C9CF" : "#8A8A92", 700), marginLeft: 18 }}>{head}</div> : null}
    </div>
    {children}
  </div>
);
/** Línea que se dibuja entre dos puntos (como las conexiones de la referencia). */
export const Link: React.FC<{ d: string; p: number; color?: string; w?: number }> = ({ d, p, color = "#4A4A50", w = 4 }) => (
  <svg width={1080} height={930} viewBox="0 0 1080 930" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, Math.max(0, p))} />
  </svg>
);
export const Pos: React.FC<{ x: number; y: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, ...style }}>{children}</div>
);
export const enter = (t: number, at: number, dy = 40): React.CSSProperties => {
  const p = popIn(t, at);
  const k = lerp(t, at, at + 0.5, 0, 1);
  return { opacity: p.o, transform: `translateY(${(1 - k) * dy}px) scale(${0.95 + 0.05 * k})` };
};
export const TickC: React.FC<{ s: number; p: number }> = ({ s, p }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(180deg,#5ED68F,${GREENC})`, display: "grid", placeItems: "center", opacity: Math.min(1, p * 3), transform: `scale(${0.6 + 0.4 * Math.min(1, p * 2)})`, boxShadow: "0 8px 16px rgba(30,150,70,0.4)" }}>
    <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 100 100"><path d="M22 54 l20 20 l38 -44" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} /></svg>
  </div>
);
export const CrossC: React.FC<{ s: number; p: number }> = ({ s, p }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: "linear-gradient(180deg,#FF8A80,#D8352F)", display: "grid", placeItems: "center", opacity: Math.min(1, p * 3), transform: `scale(${0.6 + 0.4 * Math.min(1, p * 2)})`, boxShadow: "0 8px 16px rgba(190,40,30,0.4)" }}>
    <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 100 100"><path d="M20 20 L80 80 M80 20 L20 80" stroke="#fff" strokeWidth="15" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} /></svg>
  </div>
);
export const Bar: React.FC<{ w: number | string; h?: number; fill: number; color?: string; track?: string }> = ({ w, h = 30, fill, color = `linear-gradient(180deg,#FFB98C,${ORANGE})`, track = "#E7E7EA" }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: track, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.10)", overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%`, height: h, borderRadius: h / 2, background: color, boxShadow: "0 4px 10px rgba(233,138,85,0.45)" }} />
  </div>
);

// ---------- frasco de champú / producto ----------
export const Bottle: React.FC<{ h: number; c1?: string; c2?: string; cap?: string; shape?: "tall" | "round" | "tube"; label?: boolean }> = ({ h, c1 = "#FFFFFF", c2 = "#E6E1DC", cap = "#2A2A2E", shape = "tall", label = true }) => {
  const id = `b${shape}${c1.replace("#", "")}`;
  const body = shape === "tube" ? "M24 30 H76 L70 150 H30 Z" : shape === "round" ? "M18 60 a32 32 0 0 1 64 0 V140 a12 12 0 0 1 -12 12 H30 a12 12 0 0 1 -12 -12 Z" : "M26 44 a8 8 0 0 1 8 -8 H66 a8 8 0 0 1 8 8 V142 a12 12 0 0 1 -12 12 H38 a12 12 0 0 1 -12 -12 Z";
  return (
    <svg width={h * 0.5} height={h} viewBox="0 0 100 200" style={{ overflow: "visible", filter: "drop-shadow(0 14px 14px rgba(0,0,0,0.28))" }}>
      <defs><linearGradient id={id} x1="0" x2="1"><stop offset="0" stopColor={c2} /><stop offset="0.35" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient></defs>
      <rect x="38" y="6" width="24" height="12" rx="3" fill={cap} />
      <rect x="32" y="16" width="36" height="22" rx="5" fill={cap} />
      <path d={body} fill={`url(#${id})`} transform="translate(0 20)" />
      {label ? <><rect x="34" y="92" width="32" height="46" rx="5" fill="rgba(255,255,255,0.88)" /><rect x="39" y="102" width="22" height="5" rx="2.5" fill={ORANGE} /><rect x="39" y="113" width="22" height="4" rx="2" fill="#B9B9BF" /><rect x="39" y="122" width="15" height="4" rx="2" fill="#B9B9BF" /></> : null}
    </svg>
  );
};
/** Estantería con productos. `lit` = cuántos frascos se muestran, `dim` = apagado. */
export const Shelf: React.FC<{ w: number; t: number; at: number; dim?: number }> = ({ w, t, at, dim = 0 }) => {
  const cols = [["#FFFFFF", "#E7E2DD", "#2A2A2E", "tall"], ["#F8C9A5", "#E49A67", "#3A2A22", "round"], ["#F1F1F1", "#CFCFD4", "#E98A55", "tall"], ["#FFE6D2", "#EFB78E", "#2A2A2E", "tube"], ["#D9DEE8", "#A9B2C6", "#2A2A2E", "tall"]] as const;
  return (
    <div style={{ width: w, position: "relative", filter: `grayscale(${dim}) brightness(${1 - 0.1 * dim})` }}>
      {[0, 1].map((r) => (
        <div key={r} style={{ position: "relative", height: 300 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, borderRadius: 8, background: "linear-gradient(180deg,#D8B48A,#B98E5E)", boxShadow: "0 16px 18px rgba(0,0,0,0.22)" }} />
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 24, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
            {cols.map((c, i) => {
              const e = popIn(t, at + r * 0.5 + i * 0.12);
              return <div key={i} style={{ opacity: e.o, transform: `translateY(${(1 - e.s) * 60}px)` }}><Bottle h={[210, 170, 230, 190, 200][(i + r * 2) % 5]} c1={c[0]} c2={c[1]} cap={c[2]} shape={c[3]} /></div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------- ticket (papel con borde en dientes; cada línea = nombre + barra) ----------
export const Receipt: React.FC<{ w: number; rows: { label: string; fill: number; dashed?: boolean; hot?: boolean }[]; ok?: number; bad?: number; style?: React.CSSProperties }> = ({ w, rows, ok = 0, bad = 0, style }) => {
  const teeth = Math.round(w / 22);
  const pts = Array.from({ length: teeth * 2 + 1 }, (_, i) => `${(i / (teeth * 2)) * 100}% ${i % 2 ? "0" : "100%"}`).join(",");
  const fs = Math.round(w * 0.118), bh = Math.round(w * 0.095);
  return (
    <div style={{ width: w, position: "relative", filter: "drop-shadow(0 22px 24px rgba(0,0,0,0.25))", ...style }}>
      <div style={{ background: "linear-gradient(180deg,#FFFFFF,#F5F4F2)", padding: `${w * 0.1}px ${w * 0.09}px ${w * 0.08}px`, borderRadius: "22px 22px 0 0" }}>
        <div style={{ height: w * 0.04, width: "46%", borderRadius: 8, background: "#D5D5D9", margin: `0 auto ${w * 0.08}px` }} />
        {rows.map((r, i) => (
          <div key={i} style={{ marginBottom: w * 0.085, opacity: r.fill > 0 || r.dashed ? 1 : 0.3 }}>
            <div style={{ ...txt(fs, r.dashed ? "#A9A9B0" : r.hot ? "#B8561F" : "#3A3A40", 800), marginBottom: w * 0.03 }}>{r.label}</div>
            {r.dashed ? <div style={{ height: bh, borderRadius: bh / 2, border: "4px dashed #D0D0D5" }} /> : <Bar w="100%" h={bh} fill={r.fill} color={r.hot ? `linear-gradient(180deg,#FFB98C,${ORANGE})` : "linear-gradient(180deg,#B9B9BF,#9A9AA2)"} />}
          </div>
        ))}
        <div style={{ height: 3, background: "repeating-linear-gradient(90deg,#CFCFD4 0 10px,transparent 10px 18px)" }} />
      </div>
      <div style={{ height: 20, background: "linear-gradient(180deg,#F5F4F2,#EEEDEA)", clipPath: `polygon(${pts})` }} />
      {ok > 0 ? <div style={{ position: "absolute", right: -24, top: -24 }}><TickC s={w * 0.26} p={ok} /></div> : null}
      {bad > 0 ? <div style={{ position: "absolute", right: -24, top: -24 }}><CrossC s={w * 0.26} p={bad} /></div> : null}
    </div>
  );
};

// ---------- ficha de clienta (documento que se rellena campo a campo; se dibuja a 820 y se escala) ----------
export const fichaH = (n: number, w: number) => ((140 + 30 + n * 96 + (n - 1) * 30 + 34) * w) / 820;
export const Ficha: React.FC<{ t: number; w: number; fields: { label: string; at: number; fill?: number }[]; style?: React.CSSProperties; check?: number }> = ({ t, w, fields, style, check = 0 }) => {
  const k = w / 820;
  return (
    <div style={{ width: w, height: fichaH(fields.length, w), position: "relative", ...style }}>
      <div style={{ width: 820, transformOrigin: "0 0", transform: `scale(${k})`, borderRadius: 34, background: "linear-gradient(180deg,#FFFFFF,#F7F6F4)", boxShadow: SH, overflow: "hidden", position: "relative" }}>
        <div style={{ height: 140, display: "flex", alignItems: "center", gap: 26, padding: "0 40px", background: "linear-gradient(180deg,#FFE9D8,#FFD9BD)" }}>
          <Avatar s={86} tone={2} />
          <div style={{ flex: 1 }}><div style={{ height: 20, width: "58%", borderRadius: 10, background: "#C7855A" }} /><div style={{ height: 13, width: "36%", borderRadius: 7, background: "#E3B596", marginTop: 14 }} /></div>
          <div style={{ ...txt(38, "#B8561F", 800) }}>FICHA</div>
        </div>
        <div style={{ padding: "30px 40px 34px", display: "flex", flexDirection: "column", gap: 30 }}>
          {fields.map((f, i) => {
            const g = lerp(t, f.at, f.at + 0.9, 0, 1, easeInOut) * (f.fill ?? 1);
            const e = popIn(t, f.at - 0.25);
            return (
              <div key={i} style={{ opacity: Math.max(0.4, e.o) }}>
                <div style={{ ...txt(44, "#55555C", 800), marginBottom: 12 }}>{f.label}</div>
                <div style={{ height: 38, borderRadius: 19, background: "#EDEDF0", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                  <div style={{ width: `${g * 100}%`, height: 38, borderRadius: 19, background: "linear-gradient(180deg,#9A9AA2,#7C7C85)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {check > 0 ? <div style={{ position: "absolute", right: 22 * k, top: 150 * k }}><TickC s={100 * k + 24} p={check} /></div> : null}
    </div>
  );
};

// ---------- calendario del mes (ventana de aplicación) ----------
export const MonthApp: React.FC<{ t: number; w: number; fills: [number, number][]; style?: React.CSSProperties }> = ({ t, w, fills, style }) => {
  const cols = 7, rows = 5, cell = (w - 60) / cols;
  return (
    <WinCard w={w} h={150 + rows * (cell + 8) + 30} style={style} head="Mes">
      <div style={{ padding: "24px 30px" }}>
        <div style={{ display: "flex", marginBottom: 8 }}>{["L", "M", "X", "J", "V", "S", "D"].map((d) => <div key={d} style={{ width: cell, textAlign: "center", ...txt(26, "#9A9AA2", 700) }}>{d}</div>)}</div>
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} style={{ display: "flex", marginBottom: 8 }}>
            {Array.from({ length: cols }, (_, c) => {
              const idx = r * cols + c;
              const f = fills.find((x) => x[0] === idx);
              const k = f ? lerp(t, f[1], f[1] + 0.4, 0, 1) : 0;
              return <div key={c} style={{ width: cell, height: cell, padding: 5, boxSizing: "border-box" }}><div style={{ width: "100%", height: "100%", borderRadius: 16, background: k > 0 ? `linear-gradient(180deg,#FFC9A4,${ORANGE})` : "#F0F0F2", boxShadow: k > 0 ? "0 8px 14px rgba(233,138,85,0.45)" : "inset 0 2px 3px rgba(0,0,0,0.06)", transform: `scale(${1 + 0.1 * pulse(t, f ? f[1] : 99)})` }} /></div>;
            })}
          </div>
        ))}
      </div>
    </WinCard>
  );
};
