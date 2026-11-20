// Reel PPTK7289 · v3 (16 nov 2026): estilo nuevo (blanco con puntitos, tarjetas redondeadas, poco texto, naranja claro) pero con VOLUMEN y emojis tipo iPhone en vez de pegatinas planas.
// Cambios sobre la v2: círculo más grande y con más plano; los 3 tipos de contenido y lo que da cada uno a la vez; animaciones también en pantalla dividida;
// agenda llena frente a monedero; lista de piezas del negocio donde «Contenido» baja al último puesto; semana de horas que crece; menos horas/más dinero con flechas;
// planos suyos más cerrados (menos pared arriba); palabra final más centrada.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Archivo";
import captions from "../data/PPTK7289-captions.json";
import { Camera, C, CtaWord, Shot, Subtitles, clamp, easeInOut, easeOut, fontFamily as interFont, lerp, makeBlocks, popIn, pulse, sndList, softBack } from "./common";

const { fontFamily: ARCH } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] });
const DIR = "PPTK7289";
export const DURATION_S_PPTK7289N3 = (captions as { duration: number }).duration;
type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (captions as { words: Word[] }).words;

const T = {
  ini: 15.4, visitas: 17.92, mostrar: 18.4, seguidores: 20.26, tratar: 20.96, citas: 24.02,
  sirve: 26.9, seg2: 27.42, conviertes: 28.5, peor: 29.52, trabajo: 31.46, poco: 32.08, dinero: 32.28,
  contenido: 34.02, ultimo: 34.7, dominado: 36.3, negocio: 37.72, metiendo: 40.0, mala: 41.96, menos: 43.8, ganar: 44.72, comenta: 47.96,
};
type Win = readonly [number, number];
// [desde, hasta]. «full» = pantalla completa blanca; «split» = animación arriba y ella abajo.
const WIN = {
  triad: [15.5, 24.9] as Win, conv: [26.7, 29.25] as Win, work: [31.2, 33.05] as Win,
  list: [34.0, 38.18] as Win, hours: [39.8, 42.74] as Win, menos: [42.74, 45.26] as Win,
};
const SPLITS: Win[] = [WIN.conv, WIN.work, WIN.menos];
const FULLS: Win[] = [WIN.triad, WIN.list, WIN.hours];
const inAny = (t: number, ws: Win[]) => ws.some(([a, b]) => t >= a && t < b);

// planos de ella: más cerrados desde 15,4 s (menos pared arriba), siempre con la cabeza entera
const ZOOMS: { from: number; to: number; z0: number; z1: number }[] = [
  { from: 24.9, to: 26.7, z0: 1.2, z1: 1.27 },
  { from: 29.25, to: 31.2, z0: 1.28, z1: 1.22 },
  { from: 33.05, to: 34.0, z0: 1.2, z1: 1.24 },
  { from: 38.18, to: 39.8, z0: 1.24, z1: 1.29 },
  { from: 45.26, to: 99, z0: 1.22, z1: 1.27 },
];
const zoomAt = (t: number) => {
  const s = ZOOMS.find((z) => t >= z.from && t < z.to);
  return s ? interpolate(t, [s.from, Math.min(s.to, s.from + 3)], [s.z0, s.z1], { ...clamp, easing: easeInOut }) : 1;
};
const HerFull: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ transform: `scale(${zoomAt(t)})`, transformOrigin: "590px 1700px" }}>
    <OffthreadVideo src={staticFile(`${DIR}/video.mp4`)} style={{ width: 1080, height: 1920 }} />
  </AbsoluteFill>
);
const SPLIT_SHOT: Shot = { from: 0, to: 99, kind: "split", z: 1.0 };
const BLOCKS = makeBlocks(WORDS, T.comenta, new Set(["visitas", "seguidores", "citas", "dinero"]));

// ---------- estilo: tarjetas con volumen, sombra amarilla, emojis de iPhone ----------
const INK = "#111111", GREY = "#8A8A92", ORANGE = "#F4A57A";
const EM = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const BG: React.CSSProperties = { background: "#F7F7F7", backgroundImage: "radial-gradient(#D9D9DF 2.6px, transparent 3.2px)", backgroundSize: "44px 44px" };
const card = (r = 52): React.CSSProperties => ({
  borderRadius: r, background: "linear-gradient(180deg,#FFFFFF 0%,#FBF9F7 60%,#F3F0ED 100%)",
  boxShadow: "inset 0 2px 0 #fff, inset 0 -6px 14px rgba(160,120,90,0.08), 0 34px 60px -14px rgba(70,45,20,0.22), 0 6px 14px rgba(70,45,20,0.08)",
});
const darkCard = (r = 52): React.CSSProperties => ({
  borderRadius: r, background: "radial-gradient(120% 90% at 50% 120%, rgba(244,165,122,0.40) 0%, rgba(244,165,122,0) 60%), linear-gradient(170deg,#3A3633 0%,#161413 100%)",
  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.16), 0 34px 60px -14px rgba(40,20,5,0.5), 0 0 40px rgba(244,165,122,0.28)",
});
const peachPill = (r = 999): React.CSSProperties => ({ borderRadius: r, background: "linear-gradient(180deg,#FFD7B5,#FFB784)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.7), 0 16px 34px rgba(244,165,122,0.65)" });
const txt = (s: number, c = INK, w = 800): React.CSSProperties => ({ fontFamily: ARCH, fontWeight: w, fontSize: s, color: c, letterSpacing: "-0.02em", lineHeight: 1.05, whiteSpace: "nowrap" });
const Em: React.FC<{ s: number; c: string; style?: React.CSSProperties }> = ({ s, c, style }) => <span style={{ fontFamily: EM, fontSize: s, lineHeight: 1, filter: "drop-shadow(0 8px 10px rgba(60,30,10,0.28))", ...style }}>{c}</span>;
const enterUp = (t: number, at: number, dy = 50): React.CSSProperties => {
  const p = popIn(t, at);
  const k = lerp(t, at, at + 0.45, 0, 1, softBack);
  return { opacity: p.o, transform: `translateY(${(1 - k) * dy}px) scale(${0.94 + 0.06 * k})` };
};
const Tile: React.FC<{ s: number; e: string; dark?: boolean }> = ({ s, e, dark }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.3, display: "grid", placeItems: "center", flex: "none", background: dark ? "linear-gradient(180deg,#4A4541,#262321)" : "linear-gradient(180deg,#FFF3E8,#FFE0C9)", boxShadow: dark ? "inset 0 2px 0 rgba(255,255,255,0.15)" : "inset 0 2px 0 #fff, 0 10px 20px rgba(244,165,122,0.35)" }}>
    <Em s={s * 0.6} c={e} />
  </div>
);
const Tick: React.FC<{ s: number; p: number }> = ({ s, p }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: "linear-gradient(180deg,#7BE39B,#2FB75F)", display: "grid", placeItems: "center", opacity: Math.min(1, p * 3), transform: `scale(${0.6 + 0.4 * Math.min(1, p * 2)})`, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), 0 10px 20px rgba(30,150,70,0.4)" }}>
    <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 100 100"><path d="M22 54 l20 20 l38 -44" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} /></svg>
  </div>
);
const XRed: React.FC<{ s: number; p: number }> = ({ s, p }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 10px 16px rgba(180,30,20,0.4))" }}>
    <defs><linearGradient id="xr3" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FF8A80" /><stop offset="1" stopColor="#D2302A" /></linearGradient></defs>
    <path d="M18 18 L82 82" stroke="url(#xr3)" strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, p * 2)} />
    <path d="M82 18 L18 82" stroke="url(#xr3)" strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, p * 2 - 1)} />
  </svg>
);
const Arrow: React.FC<{ w: number; p: number; c?: string }> = ({ w, p, c = ORANGE }) => (
  <svg width={w} height="70" viewBox={`0 0 ${w} 70`} style={{ overflow: "visible", filter: "drop-shadow(0 8px 12px rgba(244,165,122,0.6))" }}>
    <path d={`M6 35 H${w - 10} M${w - 38} 8 L${w - 6} 35 L${w - 38} 62`} fill="none" stroke={c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
  </svg>
);

/** Pantalla completa blanca con puntitos; entra y sale con desenfoque. */
const Screen: React.FC<{ t: number; win: Win; children: React.ReactNode }> = ({ t, win, children }) => {
  if (t < win[0] || t >= win[1]) return null;
  const a = lerp(t, win[0], win[0] + 0.3, 0, 1);
  const b = lerp(t, win[1] - 0.22, win[1], 0, 1);
  const k = a * (1 - b);
  return <AbsoluteFill style={{ ...BG, opacity: k, filter: `blur(${(1 - k) * 16}px)` }}>{children}</AbsoluteFill>;
};
/** Animación en la mitad de arriba (ella abajo): solo entra/sale con desenfoque. */
const Top: React.FC<{ t: number; win: Win; children: React.ReactNode }> = ({ t, win, children }) => {
  if (t < win[0] || t >= win[1]) return null;
  const a = lerp(t, win[0], win[0] + 0.3, 0, 1);
  const b = lerp(t, win[1] - 0.22, win[1], 0, 1);
  const k = a * (1 - b);
  return <AbsoluteFill style={{ opacity: k, filter: `blur(${(1 - k) * 14}px)` }}>{children}</AbsoluteFill>;
};

/** Su círculo en la esquina: más grande y con más plano (cabeza, hombros y parte del salón). */
const FaceCircle: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = popIn(t, at);
  const D = 410, CX = 790, CY = 1345, S = 0.6;
  const ring = ((t - at) % 1.4) / 1.4;
  return (
    <>
      <div style={{ position: "absolute", left: CX - D / 2 - 14 - ring * 44, top: CY - D / 2 - 14 - ring * 44, width: D + 28 + ring * 88, height: D + 28 + ring * 88, borderRadius: "50%", border: `5px solid rgba(244,165,122,${0.7 * (1 - ring)})`, opacity: p.o }} />
      <div style={{ position: "absolute", left: CX - D / 2, top: CY - D / 2, width: D, height: D, borderRadius: "50%", overflow: "hidden", opacity: p.o, transform: `scale(${p.s})`, boxShadow: "0 0 0 9px #fff, 0 28px 60px rgba(60,35,15,0.32)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${D / 2 - 590 * S}px, ${D / 2 - 990 * S}px) scale(${S})`, transformOrigin: "0 0" }}>
          <OffthreadVideo src={staticFile(`${DIR}/video.mp4`)} muted style={{ width: 1080, height: 1920 }} />
        </div>
      </div>
    </>
  );
};
const DarkSub: React.FC<{ t: number }> = ({ t }) => {
  const b = BLOCKS.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const pop = interpolate(t, [b.start, b.start + 0.08], [0.6, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1610, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div style={{ fontFamily: interFont, fontWeight: 700, fontSize: 64, letterSpacing: "-0.01em", color: INK, whiteSpace: "nowrap", opacity: pop, transform: `scale(${b.solo ? pulse(t, b.start) : 1})` }}>{b.text}</div>
    </div>
  );
};

// ---------- 1 · los 3 tipos de contenido y lo que da cada uno ----------
const TRIAD = [
  { at: 15.55, arrow: 17.2, res: T.visitas, left: "Tu día en el salón", le: "💇‍♀️", right: "Visitas", re: "👀" },
  { at: T.mostrar, arrow: 19.9, res: T.seguidores, left: "Tu conocimiento", le: "🎓", right: "Seguidores", re: "❤️" },
  { at: T.tratar, arrow: 23.2, res: T.citas, left: "Resolver problemas", le: "💡", right: "Citas", re: "📅" },
];
const SceneTriad: React.FC<{ t: number }> = ({ t }) => (
  <Screen t={t} win={WIN.triad}>
    {TRIAD.map((r, i) => {
      const y = 250 + i * 300;
      const res = popIn(t, r.res - 0.05);
      return (
        <div key={i}>
          <div style={{ position: "absolute", left: 50, top: y, width: 520, height: 250, ...card(60), display: "flex", alignItems: "center", gap: 26, padding: "0 34px", boxSizing: "border-box", ...enterUp(t, r.at) }}>
            <Tile s={130} e={r.le} />
            <div style={{ ...txt(46), whiteSpace: "normal", lineHeight: 1.1 }}>{r.left}</div>
          </div>
          <div style={{ position: "absolute", left: 590, top: y + 90 }}><Arrow w={150} p={lerp(t, r.arrow, r.arrow + 0.55, 0, 1)} /></div>
          <div style={{ position: "absolute", left: 760, top: y, width: 280, height: 250, ...darkCard(60), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: res.o, transform: `scale(${res.s * pulse(t, r.res)})` }}>
            <Em s={96} c={r.re} />
            <div style={txt(40, "#fff")}>{r.right}</div>
          </div>
        </div>
      );
    })}
    <FaceCircle t={t} at={WIN.triad[0] + 0.7} />
    <DarkSub t={t} />
  </Screen>
);

// ---------- 2 · (dividida) seguidores que no se convierten en citas ----------
const SceneConv: React.FC<{ t: number }> = ({ t }) => {
  const arrow = lerp(t, T.seg2 - 0.1, T.seg2 + 0.55, 0, 1);
  const x = lerp(t, T.conviertes - 0.05, T.conviertes + 0.35, 0, 1);
  const faces = ["👩", "🧔", "👱‍♀️", "🙋‍♀️"];
  return (
    <Top t={t} win={WIN.conv}>
      <div style={{ position: "absolute", left: 40, top: 300, width: 560, height: 300, ...card(60), ...enterUp(t, WIN.conv[0] + 0.1) }}>
        {faces.map((f, i) => {
          const p = popIn(t, WIN.conv[0] + 0.3 + i * 0.12);
          return (
            <div key={i} style={{ position: "absolute", left: 36 + i * 128, top: 70, width: 150, height: 150, borderRadius: "50%", background: "linear-gradient(180deg,#fff,#F1ECE8)", boxShadow: "inset 0 2px 0 #fff, 0 18px 30px rgba(70,45,20,0.25)", display: "grid", placeItems: "center", opacity: p.o, transform: `scale(${p.s})` }}>
              <Em s={96} c={f} />
              <div style={{ position: "absolute", right: -6, bottom: -6 }}><Em s={52} c="❤️" /></div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 610, top: 400 }}><Arrow w={110} p={arrow} c="#B8ABA2" /></div>
      <div style={{ position: "absolute", left: 740, top: 270, width: 300, height: 360, ...card(52), overflow: "hidden", ...enterUp(t, WIN.conv[0] + 0.35) }}>
        <div style={{ height: 80, background: "linear-gradient(180deg,#FFB784,#F4A57A)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5)" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, padding: 22 }}>
          {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ height: 40, borderRadius: 12, background: "linear-gradient(180deg,#F1EEEB,#E8E4E0)" }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 635, top: 340, opacity: x, transform: `scale(${0.7 + 0.3 * x})` }}><XRed s={130} p={x} /></div>
    </Top>
  );
};

// ---------- 3 · (dividida) más trabajo y poco dinero: agenda llena frente a una sola moneda ----------
const SceneWork: React.FC<{ t: number }> = ({ t }) => {
  const rows = [T.trabajo - 0.1, T.trabajo + 0.15, T.trabajo + 0.4, T.trabajo + 0.65, T.trabajo + 0.9];
  const coin = popIn(t, T.dinero - 0.1);
  return (
    <Top t={t} win={WIN.work}>
      <div style={{ position: "absolute", left: 40, top: 240, width: 610, height: 520, ...card(60), padding: 26, boxSizing: "border-box", ...enterUp(t, WIN.work[0] + 0.05) }}>
        <div style={{ ...txt(40), marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}><Em s={44} c="📅" />Agenda</div>
        {rows.map((at, i) => {
          const p = popIn(t, at);
          return (
            <div key={i} style={{ height: 76, borderRadius: 24, marginBottom: 12, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", opacity: p.o, transform: `translateX(${(1 - p.s) * -60}px)`, ...peachPill(24) }}>
              <Em s={44} c="💇‍♀️" /><div style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.75)" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 690, top: 330, width: 350, height: 340, ...card(60), display: "grid", placeItems: "center", opacity: coin.o, transform: `scale(${coin.s})` }}>
        <div style={{ textAlign: "center" }}><Em s={120} c="💶" /><div style={{ marginTop: 16 }}><Em s={64} c="😕" /></div></div>
      </div>
    </Top>
  );
};

// ---------- 4 · piezas del negocio: «Contenido» arriba y baja al último puesto ----------
const PIECES = [
  { w: "Contenido", e: "📱" }, { w: "Rentabilidad", e: "💰" }, { w: "Compras", e: "🛒" }, { w: "Ventas", e: "🤝" }, { w: "Fidelización", e: "💛" },
];
const SceneList: React.FC<{ t: number }> = ({ t }) => {
  const drop = lerp(t, T.ultimo - 0.1, T.ultimo + 0.75, 0, 1, easeInOut);
  const ticks = [T.dominado, T.dominado + 0.42, T.dominado + 0.84, T.dominado + 1.26];
  const final = lerp(t, T.negocio, T.negocio + 0.4, 0, 1);
  const H = 190, G = 24, TOP = 270;
  return (
    <Screen t={t} win={WIN.list}>
      {PIECES.map((p, i) => {
        const slot0 = i, slot1 = i === 0 ? 4 : i - 1;
        const slot = slot0 + (slot1 - slot0) * drop;
        const y = TOP + slot * (H + G);
        const isC = i === 0;
        const enter = popIn(t, WIN.list[0] + 0.1 + i * 0.1);
        const tk = !isC ? lerp(t, ticks[i - 1], ticks[i - 1] + 0.35, 0, 1) : 0;
        const lift = isC ? Math.sin(Math.min(1, drop) * Math.PI) * 26 : 0;
        return (
          <div key={p.w} style={{ position: "absolute", left: 140, top: y, width: 800, height: H, ...(isC ? { ...peachPill(60), boxShadow: `inset 0 2px 0 rgba(255,255,255,0.7), 0 ${18 + lift}px ${40 + lift}px rgba(244,165,122,0.65)` } : card(60)), display: "flex", alignItems: "center", gap: 30, padding: "0 40px", boxSizing: "border-box", opacity: enter.o, transform: `scale(${enter.s * (isC ? 1 + 0.03 * Math.sin(Math.min(1, drop) * Math.PI) + 0.05 * pulse(t, T.negocio) : 1)})`, zIndex: isC ? 2 : 1 }}>
            <Tile s={118} e={p.e} dark={isC} />
            <div style={txt(64, isC ? "#2A1405" : INK)}>{p.w}</div>
            <div style={{ marginLeft: "auto" }}>{!isC && tk > 0 ? <Tick s={96} p={tk} /> : isC && final > 0 ? <Tick s={96} p={final} /> : null}</div>
          </div>
        );
      })}
      <DarkSub t={t} />
    </Screen>
  );
};

// ---------- 5 · metiendo más horas: la semana se alarga hasta agotarte ----------
const SceneHours: React.FC<{ t: number }> = ({ t }) => {
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const hs = [0.28, 0.36, 0.46, 0.58, 0.72, 0.86, 1];
  const red = lerp(t, T.mala - 0.05, T.mala + 0.3, 0, 1);
  const H = 520;
  return (
    <Screen t={t} win={WIN.hours}>
      <div style={{ position: "absolute", left: 90, top: 330, width: 900, height: 760, ...card(70), boxShadow: `${card(70).boxShadow}, 0 0 0 ${red * 10}px rgba(229,50,45,${0.9 * red})`, ...enterUp(t, WIN.hours[0] + 0.1) }}>
        <div style={{ position: "absolute", left: 50, top: 40, ...txt(48, GREY) }}>Horas</div>
        <div style={{ position: "absolute", right: 50, top: 28 }}><Em s={70} c="🕐" /></div>
        {days.map((d, i) => {
          const at = T.metiendo - 0.1 + i * 0.27;
          const g = lerp(t, at, at + 0.5, 0, 1, easeInOut);
          return (
            <div key={i}>
              <div style={{ position: "absolute", left: 60 + i * 117, bottom: 90, width: 84, height: hs[i] * H * g, borderRadius: 30, background: i === 6 && red > 0.5 ? "linear-gradient(180deg,#FF9A90,#E5322D)" : "linear-gradient(180deg,#FFD7B5,#F4A57A)", boxShadow: `inset 0 3px 0 rgba(255,255,255,0.6), 0 16px 30px ${i === 6 && red > 0.5 ? "rgba(229,50,45,0.5)" : "rgba(244,165,122,0.6)"}` }} />
              <div style={{ position: "absolute", left: 60 + i * 117, bottom: 30, width: 84, textAlign: "center", ...txt(44, GREY) }}>{d}</div>
            </div>
          );
        })}
        {red > 0 ? <div style={{ position: "absolute", right: 20, top: 90, opacity: red, transform: `scale(${0.6 + 0.4 * red})` }}><Em s={140} c="😩" /></div> : null}
        {red > 0 ? <div style={{ position: "absolute", left: 330, top: 120, opacity: red, transform: `scale(${0.6 + 0.4 * red})` }}><XRed s={150} p={red} /></div> : null}
      </div>
      <DarkSub t={t} />
    </Screen>
  );
};

// ---------- 6 · (dividida) trabajar menos y ganar más: reloj ↓ y dinero ↑ ----------
const SceneMenos: React.FC<{ t: number }> = ({ t }) => {
  const down = lerp(t, T.menos, T.menos + 0.7, 0, 1, easeInOut);
  const up = lerp(t, T.ganar, T.ganar + 0.8, 0, 1, easeInOut);
  const ok = popIn(t, T.ganar + 0.7);
  const bar = (x: number, h: number, c: string, glow: string) => <div style={{ position: "absolute", left: x, bottom: 40, width: 62, height: h, borderRadius: 22, background: c, boxShadow: `inset 0 3px 0 rgba(255,255,255,0.55), 0 14px 26px ${glow}` }} />;
  return (
    <Top t={t} win={WIN.menos}>
      <div style={{ position: "absolute", left: 50, top: 240, width: 460, height: 520, ...card(64), ...enterUp(t, WIN.menos[0] + 0.05) }}>
        <div style={{ position: "absolute", left: 36, top: 30 }}><Em s={96} c="🕐" /></div>
        <div style={{ position: "absolute", right: 30, top: 34 }}><Em s={96} c="⬇️" /></div>
        {[0.95, 0.75, 0.55].map((h0, i) => bar(50 + i * 120, 300 * h0 * (1 - 0.6 * down), "linear-gradient(180deg,#5A5550,#262321)", "rgba(0,0,0,0.3)"))}
      </div>
      <div style={{ position: "absolute", left: 570, top: 240, width: 460, height: 520, ...card(64), ...enterUp(t, WIN.menos[0] + 0.25) }}>
        <div style={{ position: "absolute", left: 36, top: 30 }}><Em s={96} c="💶" /></div>
        <div style={{ position: "absolute", right: 30, top: 34 }}><Em s={96} c="⬆️" /></div>
        {[0.3, 0.5, 0.7].map((h0, i) => bar(50 + i * 120, 300 * (h0 + (0.3 + i * 0.05) * up), "linear-gradient(180deg,#FFD7B5,#F4A57A)", "rgba(244,165,122,0.6)"))}
        <div style={{ position: "absolute", right: 24, bottom: 24, opacity: ok.o, transform: `scale(${ok.s})` }}><Em s={92} c="✅" /></div>
      </div>
    </Top>
  );
};

const CUES: [string, number, string][] = [
  ["pop.mp3", 0.2, "entran sus vídeos"], ["pop2.mp3", 0.85, "vídeo"], ["tick.mp3", 1.3, "vídeo"], ["pop.mp3", 2.4, "cambian sus vídeos"],
  ["pop2.mp3", 5.4, "cambian sus vídeos"], ["pop.mp3", 8.4, "cambian sus vídeos"], ["pop2.mp3", 10.4, "cambian sus vídeos"], ["tick.mp3", 13.0, "cambian sus vídeos"],
  ["whoosh.mp3", WIN.triad[0], "pantalla completa: 3 tipos"], ["pop.mp3", 15.55, "tipo 1"], ["pop2.mp3", T.visitas - 0.05, "visitas"], ["trazo.mp3", 17.2, "flecha 1"],
  ["swishB.mp3", T.mostrar - 0.05, "tipo 2"], ["trazo.mp3", 19.9, "flecha 2"], ["pop.mp3", T.seguidores - 0.05, "seguidores"],
  ["swishC.mp3", T.tratar - 0.05, "tipo 3"], ["trazo.mp3", 23.2, "flecha 3"], ["notaC4.mp3", T.citas - 0.05, "citas"],
  ["whoosh.mp3", WIN.conv[0], "dividida: conversión"], ["pop2.mp3", WIN.conv[0] + 0.3, "caras"], ["trazo.mp3", T.seg2, "flecha"], ["stamp.mp3", T.conviertes, "cruz"],
  ["swishA.mp3", WIN.work[0], "dividida: agenda"], ["pop.mp3", T.trabajo, "citas llenas"], ["pop2.mp3", T.trabajo + 0.65, "citas llenas"], ["notaE2.mp3", T.dinero - 0.05, "una moneda"],
  ["swishB.mp3", WIN.list[0], "pantalla completa: piezas"], ["pop.mp3", T.contenido + 0.05, "contenido"], ["swishC.mp3", T.ultimo, "contenido baja"],
  ["tick.mp3", T.dominado, "✓ 1"], ["click.mp3", T.dominado + 0.42, "✓ 2"], ["tick.mp3", T.dominado + 0.84, "✓ 3"], ["click.mp3", T.dominado + 1.26, "✓ 4"], ["stamp.mp3", T.negocio, "contenido ✓"],
  ["swishC.mp3", WIN.hours[0], "pantalla completa: horas"], ["count.wav", T.metiendo, "crecen las horas"], ["stamp.mp3", T.mala, "agotada"],
  ["whoosh.mp3", WIN.menos[0], "dividida: menos horas, más dinero"], ["trazo.mp3", T.menos, "baja"], ["notaC4.mp3", T.ganar, "sube"], ["pop2.mp3", T.ganar + 0.7, "✅"],
  ["click.mp3", T.comenta, "«DIAGNÓSTICO»"],
];
console.log("SND_JSON_PPTK7289N3 " + JSON.stringify(sndList(CUES)));

export const ReelPPTK7289N3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const split = inAny(t, SPLITS);
  const full = inAny(t, FULLS);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {split ? <Camera t={t} dir={DIR} shot={SPLIT_SHOT} zoom={1} /> : <HerFull t={t} />}
      <SceneTriad t={t} />
      <SceneConv t={t} />
      <SceneWork t={t} />
      <SceneList t={t} />
      <SceneHours t={t} />
      <SceneMenos t={t} />
      <CtaWord t={t} at={T.comenta} word="DIAGNÓSTICO" pulseAt={48.54} size={104} top={330} />
      {t < T.comenta && !full ? <Subtitles t={t} blocks={BLOCKS} split={split} /> : null}
    </AbsoluteFill>
  );
};
