// Piezas del estilo nuevo con VOLUMEN (blanco con puntitos, tarjetas redondeadas con degradado y brillo, sombra naranja claro, emojis tipo iPhone).
// Salen de la plantilla aprobada plantilla-reel-estilo-nuevo.tsx (PPTK7289 v3). Se comparten entre los reels BZNH7576 y GHNM8800 (16 nov 2026).
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Archivo";
import { Block, clamp, easeOut, fontFamily as interFont, lerp, popIn, pulse, softBack } from "./common";

const { fontFamily: ARCH } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] });
export const INK = "#111111", GREY = "#8A8A92", ORANGE = "#F4A57A";
export const EM = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
export const BG: React.CSSProperties = { background: "#F7F7F7", backgroundImage: "radial-gradient(#D2D2D9 2.8px, transparent 3.4px)", backgroundSize: "44px 44px" };
export type Win = readonly [number, number];
export const inAny = (t: number, ws: Win[]) => ws.some(([a, b]) => t >= a && t < b);

export const card = (r = 52): React.CSSProperties => ({
  borderRadius: r, background: "linear-gradient(180deg,#FFFFFF 0%,#FBF9F7 60%,#F3F0ED 100%)",
  boxShadow: "inset 0 2px 0 #fff, inset 0 -6px 14px rgba(160,120,90,0.08), 0 34px 60px -14px rgba(70,45,20,0.22), 0 6px 14px rgba(70,45,20,0.08)",
});
export const darkCard = (r = 52): React.CSSProperties => ({
  borderRadius: r, background: "radial-gradient(120% 90% at 50% 120%, rgba(244,165,122,0.40) 0%, rgba(244,165,122,0) 60%), linear-gradient(170deg,#3A3633 0%,#161413 100%)",
  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.16), 0 34px 60px -14px rgba(40,20,5,0.5), 0 0 40px rgba(244,165,122,0.28)",
});
export const peachPill = (r = 999): React.CSSProperties => ({ borderRadius: r, background: "linear-gradient(180deg,#FFD7B5,#FFB784)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.7), 0 16px 34px rgba(244,165,122,0.65)" });
export const redPill = (r = 999): React.CSSProperties => ({ borderRadius: r, background: "linear-gradient(180deg,#FF9A90,#E5322D)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), 0 16px 34px rgba(229,50,45,0.45)" });
export const txt = (s: number, c = INK, w = 800): React.CSSProperties => ({ fontFamily: ARCH, fontWeight: w, fontSize: s, color: c, letterSpacing: "-0.02em", lineHeight: 1.05, whiteSpace: "nowrap" });
export const Em: React.FC<{ s: number; c: string; style?: React.CSSProperties }> = ({ s, c, style }) => <span style={{ fontFamily: EM, fontSize: s, lineHeight: 1, filter: "drop-shadow(0 8px 10px rgba(60,30,10,0.28))", ...style }}>{c}</span>;
export const enterUp = (t: number, at: number, dy = 50): React.CSSProperties => {
  const p = popIn(t, at);
  const k = lerp(t, at, at + 0.45, 0, 1, softBack);
  return { opacity: p.o, transform: `translateY(${(1 - k) * dy}px) scale(${0.94 + 0.06 * k})` };
};
export const Tile: React.FC<{ s: number; e: string; dark?: boolean }> = ({ s, e, dark }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.3, display: "grid", placeItems: "center", flex: "none", background: dark ? "linear-gradient(180deg,#4A4541,#262321)" : "linear-gradient(180deg,#FFF3E8,#FFE0C9)", boxShadow: dark ? "inset 0 2px 0 rgba(255,255,255,0.15)" : "inset 0 2px 0 #fff, 0 10px 20px rgba(244,165,122,0.35)" }}>
    <Em s={s * 0.6} c={e} />
  </div>
);
export const Tick: React.FC<{ s: number; p: number }> = ({ s, p }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: "linear-gradient(180deg,#7BE39B,#2FB75F)", display: "grid", placeItems: "center", opacity: Math.min(1, p * 3), transform: `scale(${0.6 + 0.4 * Math.min(1, p * 2)})`, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), 0 10px 20px rgba(30,150,70,0.4)" }}>
    <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 100 100"><path d="M22 54 l20 20 l38 -44" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} /></svg>
  </div>
);
export const XRed: React.FC<{ s: number; p: number }> = ({ s, p }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 10px 16px rgba(180,30,20,0.4))" }}>
    <defs><linearGradient id="xrN1" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FF8A80" /><stop offset="1" stopColor="#D2302A" /></linearGradient></defs>
    <path d="M18 18 L82 82" stroke="url(#xrN1)" strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, p * 2)} />
    <path d="M82 18 L18 82" stroke="url(#xrN1)" strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
  </svg>
);
export const Arrow: React.FC<{ w: number; p: number; c?: string }> = ({ w, p, c = ORANGE }) => (
  <svg width={w} height="70" viewBox={`0 0 ${w} 70`} style={{ overflow: "visible", filter: "drop-shadow(0 8px 12px rgba(244,165,122,0.6))" }}>
    <path d={`M6 35 H${w - 10} M${w - 38} 8 L${w - 6} 35 L${w - 38} 62`} fill="none" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
  </svg>
);
/** Signo «≠» con volumen (naranja). */
export const NotEq: React.FC<{ s: number; p: number }> = ({ s, p }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 8px 12px rgba(244,165,122,0.6))", opacity: Math.min(1, p * 3), transform: `scale(${0.7 + 0.3 * Math.min(1, p * 1.6)})` }}>
    <path d="M20 36 H80 M20 64 H80" stroke={ORANGE} strokeWidth="13" strokeLinecap="round" />
    <path d="M62 14 L38 86" stroke="#E5322D" strokeWidth="13" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
  </svg>
);

/** Pantalla completa blanca con puntitos; entra y sale con desenfoque. */
export const Screen: React.FC<{ t: number; win: Win; children: React.ReactNode }> = ({ t, win, children }) => {
  if (t < win[0] || t >= win[1]) return null;
  const a = lerp(t, win[0], win[0] + 0.3, 0, 1);
  const b = lerp(t, win[1] - 0.22, win[1], 0, 1);
  const k = a * (1 - b);
  return <AbsoluteFill style={{ ...BG, opacity: k, filter: `blur(${(1 - k) * 16}px)` }}>{children}</AbsoluteFill>;
};
/** Animación en la mitad de arriba (ella abajo). */
export const Top: React.FC<{ t: number; win: Win; children: React.ReactNode }> = ({ t, win, children }) => {
  if (t < win[0] || t >= win[1]) return null;
  const a = lerp(t, win[0], win[0] + 0.3, 0, 1);
  const b = lerp(t, win[1] - 0.22, win[1], 0, 1);
  const k = a * (1 - b);
  return <AbsoluteFill style={{ opacity: k, filter: `blur(${(1 - k) * 14}px)` }}>{children}</AbsoluteFill>;
};

/** Su círculo en la esquina: grande, con cabeza, hombros y parte del salón. `fx/fy` = punto del vídeo que queda en el centro. */
export const FaceCircle: React.FC<{ t: number; at: number; dir: string; fx?: number; fy?: number; cx?: number; cy?: number; S?: number }> = ({ t, at, dir, fx = 590, fy = 990, cx = 790, cy = 1345, S = 0.6 }) => {
  const p = popIn(t, at);
  const D = 410;
  const ring = ((t - at) % 1.4) / 1.4;
  return (
    <>
      <div style={{ position: "absolute", left: cx - D / 2 - 14 - ring * 44, top: cy - D / 2 - 14 - ring * 44, width: D + 28 + ring * 88, height: D + 28 + ring * 88, borderRadius: "50%", border: `5px solid rgba(244,165,122,${0.7 * (1 - ring)})`, opacity: p.o }} />
      <div style={{ position: "absolute", left: cx - D / 2, top: cy - D / 2, width: D, height: D, borderRadius: "50%", overflow: "hidden", opacity: p.o, transform: `scale(${p.s})`, boxShadow: "0 0 0 9px #fff, 0 28px 60px rgba(60,35,15,0.32)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${D / 2 - fx * S}px, ${D / 2 - fy * S}px) scale(${S})`, transformOrigin: "0 0" }}>
          <OffthreadVideo src={staticFile(`${dir}/video.mp4`)} muted style={{ width: 1080, height: 1920 }} />
        </div>
      </div>
    </>
  );
};
/** Subtítulos negros para las pantallas completas blancas. */
export const DarkSub: React.FC<{ t: number; blocks: Block[]; y?: number }> = ({ t, blocks, y = 1610 }) => {
  const b = blocks.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const pop = interpolate(t, [b.start, b.start + 0.08], [0.6, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div style={{ fontFamily: interFont, fontWeight: 700, fontSize: 64, letterSpacing: "-0.01em", color: INK, whiteSpace: "nowrap", opacity: pop, transform: `scale(${b.solo ? pulse(t, b.start) : 1})` }}>{b.text}</div>
    </div>
  );
};

/** Burbuja de chat con volumen (blanca con degradado o naranja claro), con su emoji. */
export const Bubble3: React.FC<{ w?: number; e: string; peach?: boolean; avatar?: string; style?: React.CSSProperties }> = ({ w = 520, e, peach, avatar, style }) => (
  <div style={{ width: w, height: 150, display: "flex", alignItems: "center", gap: 22, padding: "0 28px", boxSizing: "border-box", ...(peach ? peachPill(56) : card(56)), ...style }}>
    {avatar ? <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(180deg,#fff,#F1ECE8)", boxShadow: "inset 0 2px 0 #fff, 0 12px 20px rgba(70,45,20,0.22)", display: "grid", placeItems: "center", flex: "none" }}><Em s={58} c={avatar} /></div> : null}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ height: 18, width: "88%", borderRadius: 9, background: peach ? "rgba(255,255,255,0.8)" : "linear-gradient(180deg,#EFE9E4,#E4DDD7)" }} />
      <div style={{ height: 18, width: "56%", borderRadius: 9, background: peach ? "rgba(255,255,255,0.8)" : "linear-gradient(180deg,#EFE9E4,#E4DDD7)" }} />
    </div>
    <Em s={64} c={e} />
  </div>
);
/** Anillo de historia con degradado naranja y su dibujo dentro. */
export const StoryRing: React.FC<{ s: number; e: string; seed?: number }> = ({ s, e }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", padding: s * 0.05, boxSizing: "border-box", background: "conic-gradient(from 200deg,#FFC08A,#F4A57A,#FF8A5C,#FFC08A)", boxShadow: "0 18px 30px rgba(244,165,122,0.55)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(180deg,#fff,#F3EEEA)", boxShadow: "inset 0 0 0 5px #fff", display: "grid", placeItems: "center" }}><Em s={s * 0.5} c={e} /></div>
  </div>
);
