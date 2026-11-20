// Piezas comunes de los dos reels sacados del bruto MMAW6550 (precios y logo). v2 (11 nov 2026): dibujos «3D suave», borde de la pantalla dividida en onda difuminada, reproductor con su vídeo.
// Partidas de las plantillas aprobadas: plantilla-reel-animado.tsx (BRMC4311 v3) y plantilla-reel-perfil.tsx (FWIF2897 v3).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });

export const C = {
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
export const FPS = 30;
export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);
export const backOut = Easing.out(Easing.back(1.6));
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const fr = (s: number) => Math.round(s * FPS);
export const lerp = (t: number, a: number, b: number, v0: number, v1: number, easing = easeOut) =>
  interpolate(t, [a, b], [v0, v1], { ...clamp, easing });
export const softBack = Easing.out(Easing.back(1.25));
/** v2: entrada más suave (escala 0.72→1 con un rebote corto, 450 ms). */
export const popIn = (t: number, at: number) => ({ s: lerp(t, at, at + 0.45, 0.72, 1, softBack), o: lerp(t, at, at + 0.25, 0, 1) });
export const pulse = (t: number, at: number) =>
  interpolate(t, [at, at + 0.11, at + 0.22], [1, 1.06, 1], { ...clamp, easing: easeInOut });
export const shadow = "drop-shadow(0 16px 22px rgba(90,60,40,0.24)) drop-shadow(0 3px 5px rgba(90,60,40,0.12))";

// ---------- encuadre (mismo plano que FWIF2897: sentada en el salón) ----------
export const FACE_X = 0.537 * 1080;
export const FACE_Y = 0.4 * 1920;
export const SEAM = 883;
/** v2: en la pantalla dividida ella baja 115 px para que el difuminado ondulado nunca le toque el pelo (pelo en y≈535 del original → ≈970 en pantalla). */
export const SPLIT_SRC_TOP = 430;
/** El salón del panel de arriba, ampliado ×1,95 para que su pelo (y≈535 del original) quede fuera del panel (y>1000) y en el difuminado solo se vea pared. */
const PANEL_SCALE = 1.95;
export const PANEL_OPACITY = 0.55;
/** Borde del panel: onda suave que respira, difuminada (centro y≈868, nunca por debajo de ≈930). */
const EDGE_Y = 868;
const waveMask = (t: number) => {
  const pts: string[] = [];
  for (let x = -40; x <= 1120; x += 30) {
    const y = EDGE_Y + 16 * Math.sin((x / 1080) * Math.PI * 2.6 + t * 0.7) + 8 * Math.sin((x / 1080) * Math.PI * 6.2 - t * 1.1 + 1.3);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1000' viewBox='0 0 1080 1000'><filter id='b' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='17'/></filter><path d='M-40,-60 L${pts.join(" L")} L1120,-60 Z' fill='white' filter='url(#b)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

export type Shot =
  | { from: number; to: number; kind: "full"; z0: number; z1: number }
  | { from: number; to: number; kind: "split"; z: number };
export const makeShots = (shots: Shot[]) => {
  const shotAt = (t: number) => shots.find((s) => t >= s.from && t < s.to) ?? shots[shots.length - 1];
  const zoomAt = (t: number) => {
    const s = shotAt(t);
    return s.kind === "full" ? interpolate(t, [s.from, s.to], [s.z0, s.z1], { ...clamp, easing: easeInOut }) : s.z;
  };
  return { shotAt, zoomAt };
};

/** Cámara: pantalla completa con zoom lento, o pantalla dividida (arriba el salón tras un blanco al 55 % que se funde en onda; abajo ella). */
export const Camera: React.FC<{ t: number; dir: string; shot: Shot; zoom: number }> = ({ t, dir, shot, zoom }) => {
  const video = <OffthreadVideo src={staticFile(`${dir}/video.mp4`)} style={{ width: 1080, height: 1920 }} />;
  if (shot.kind === "full") {
    return <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>{video}</AbsoluteFill>;
  }
  const mask = waveMask(t);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: SEAM - SPLIT_SRC_TOP, width: 1080, height: 1920, transform: `scale(${shot.z})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>{video}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1000, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: "1080px 1000px", maskSize: "1080px 1000px", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${PANEL_SCALE})`, transformOrigin: `${FACE_X}px 0px` }}>{video}</div>
        <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${PANEL_OPACITY})` }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- subtítulos (sin fondo) ----------
type Word = { text: string; start: number; end: number };
const clean = (w: string) => w.replace(/[.,;:]+$/g, "").replace(/^[,;:]+/, "");
const norm = (w: string) => clean(w).toLowerCase().replace(/[¿?¡!«»]/g, "");
export type Block = { text: string; start: number; end: number; solo: boolean };
export const makeBlocks = (words: Word[], until: number, solo: Set<string>): Block[] => {
  const out: Block[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ text: cur.map((w) => clean(w.text)).join(" "), start: cur[0].start, end: cur[cur.length - 1].end, solo: cur.length === 1 && solo.has(norm(cur[0].text)) });
    cur = [];
  };
  words.filter((w) => w.start < until - 0.05).forEach((w, i, arr) => {
    if (solo.has(norm(w.text))) {
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
  return out.map((b, i) => ({ ...b, end: Math.min(out[i + 1]?.start ?? b.end + 0.3, b.end + 0.4, until) }));
};
const outline =
  "0 0 2px rgba(0,0,0,0.85), 1px 1px 0 rgba(0,0,0,0.55), -1px 1px 0 rgba(0,0,0,0.55), 1px -1px 0 rgba(0,0,0,0.55), -1px -1px 0 rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.45)";
/** Pantalla completa: a la altura del collar (y≈1000): por debajo de la barbilla y por encima de sus manos al gesticular. Dividida: negros sobre la línea. */
export const Subtitles: React.FC<{ t: number; blocks: Block[]; split: boolean }> = ({ t, blocks, split }) => {
  const b = blocks.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const pop = interpolate(t, [b.start, b.start + 0.08], [0.6, 1], { ...clamp, easing: easeOut });
  const scale = b.solo ? pulse(t, b.start) : 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: split ? 835 : 1000, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div style={{ fontFamily, fontWeight: 700, fontSize: 64, lineHeight: 1.1, letterSpacing: "-0.01em", color: split ? C.black : C.white, textShadow: split ? "none" : outline, whiteSpace: "nowrap", opacity: pop, transform: `scale(${scale})` }}>
        {b.text}
      </div>
    </div>
  );
};

// ---------- vídeo de Pexels detrás del hombro ----------
const BACK = { w: 600, h: 1067, top: 300, opacity: 0.6, x: { left: 20, right: 460 } };
export const BackWindow: React.FC<{ t: number; start: number; end: number; side: "left" | "right"; children: React.ReactNode }> = ({ t, start, end, side, children }) => {
  if (t < start || t >= end) return null;
  const p = lerp(t, start, start + 0.45, 0, 1, easeInOut);
  const op = lerp(t, start, start + 0.28, 0, 1);
  const out = lerp(t, end - 0.2, end, 0, 1);
  return (
    <div style={{ position: "absolute", left: BACK.x[side], top: BACK.top, width: BACK.w, height: BACK.h, borderRadius: 44, overflow: "hidden", opacity: BACK.opacity * op * (1 - out), transform: `scale(${0.94 + 0.06 * p}) translateY(${(1 - p) * 30}px)`, transformOrigin: "50% 30%", boxShadow: "0 30px 60px -16px rgba(60,30,10,0.45)" }}>
      {children}
    </div>
  );
};
export const Clip: React.FC<{ dir: string; file: string; start: number; end: number; trim?: number; rate?: number }> = ({ dir, file, start, end, trim = 0, rate = 1 }) => (
  <Sequence from={fr(start)} durationInFrames={Math.max(1, fr(end - start))} layout="none">
    <OffthreadVideo src={staticFile(`${dir}/${file}`)} muted trimBefore={fr(trim)} playbackRate={rate} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
  </Sequence>
);

// ---------- recorte de ella delante (WebM con alfa), con la misma cámara ----------
export type Matte = { name: string; from: number; to: number; show: [number, number] };
export const Cutouts: React.FC<{ t: number; dir: string; mattes: Matte[]; zoom: number }> = ({ t, dir, mattes, zoom }) => (
  <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>
    {mattes.map((m) =>
      t >= m.show[0] && t < m.show[1] ? (
        <Sequence key={m.name} from={fr(m.from)} durationInFrames={fr(m.to - m.from)} layout="none">
          <OffthreadVideo src={staticFile(`${dir}/matte-${m.name}.webm`)} transparent muted style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />
        </Sequence>
      ) : null,
    )}
  </AbsoluteFill>
);

// ---------- cierre: solo la palabra grande ----------
export const gradText: React.CSSProperties = {
  fontFamily, fontWeight: 700, letterSpacing: "-0.02em",
  backgroundImage: `linear-gradient(180deg, ${C.gradTop} 0%, ${C.gradBottom} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
};
export const CtaWord: React.FC<{ t: number; at: number; word: string; pulseAt: number }> = ({ t, at, word, pulseAt }) => {
  if (t < at) return null;
  const inP = lerp(t, at, at + 0.3, 0, 1);
  return (
    <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center", opacity: inP, transform: `translateY(${(1 - inP) * 20}px) scale(${pulse(t, pulseAt)})`, filter: `blur(${(1 - inP) * 8}px) drop-shadow(0 4px 18px rgba(0,0,0,0.45))` }}>
      <div style={{ ...gradText, fontSize: 150, lineHeight: 1.05 }}>«{word}»</div>
    </div>
  );
};

// ---------- dibujos compartidos · v2: estilo «3D suave» ----------
// Inspirado en sus ejemplos (EJEMPLOS DE OTROS ELEMENTOS): superficies blancas con degradado y sombras largas y difusas,
// piezas naranjas brillantes con reflejo y halo, tarjetas oscuras con resplandor naranja. Siempre con su marca (naranja y blanco).
/** Tarjeta blanca con volumen (borde de luz arriba, sombra suave y larga). */
export const surface = (r = 40): React.CSSProperties => ({
  borderRadius: r,
  background: "linear-gradient(180deg, #FFFFFF 0%, #FAF7F4 55%, #F0EAE5 100%)",
  boxShadow:
    "inset 0 2px 0 rgba(255,255,255,1), inset 0 -5px 12px rgba(150,105,75,0.10), 0 2px 4px rgba(90,60,40,0.07), 0 18px 34px -10px rgba(90,60,40,0.26), 0 44px 80px -24px rgba(90,60,40,0.30)",
});
/** Hueco hundido dentro de una tarjeta. */
export const inset = (r = 24): React.CSSProperties => ({
  borderRadius: r,
  background: "linear-gradient(180deg, #EDE7E2 0%, #F7F3F0 100%)",
  boxShadow: "inset 0 3px 7px rgba(120,85,60,0.16), inset 0 -1px 0 rgba(255,255,255,0.9)",
});
/** Tarjeta oscura brillante con resplandor naranja abajo. */
export const darkSurface = (r = 40): React.CSSProperties => ({
  borderRadius: r,
  background: "radial-gradient(120% 80% at 50% 115%, rgba(240,138,80,0.45) 0%, rgba(240,138,80,0) 60%), linear-gradient(170deg, #3B3633 0%, #1D1A18 100%)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.05), 0 26px 52px -12px rgba(30,15,5,0.55)",
});
/** Pastilla naranja brillante (para barras de progreso, rellenos…). */
export const orangeFill = "linear-gradient(180deg, #FFC49C 0%, #F59A5F 45%, #DE7238 100%)";
export const orangeGlowBox = "inset 0 2px 0 rgba(255,255,255,0.55), 0 0 22px rgba(255,150,90,0.55), 0 6px 14px rgba(170,75,25,0.30)";
export const softDrop = "drop-shadow(0 16px 22px rgba(90,60,40,0.24)) drop-shadow(0 3px 5px rgba(90,60,40,0.12))";
export const orangeGlow = "drop-shadow(0 0 16px rgba(255,150,90,0.55)) drop-shadow(0 10px 14px rgba(150,65,20,0.30))";

/** Degradados comunes (cada SVG lleva los suyos: mismos nombres y mismas definiciones). */
export const G3: React.FC = () => (
  <defs>
    <linearGradient id="g3-or" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFC8A2" /><stop offset="0.45" stopColor="#F5995E" /><stop offset="1" stopColor="#D2652D" />
    </linearGradient>
    <radialGradient id="g3-orb" cx="0.36" cy="0.3" r="0.75">
      <stop offset="0" stopColor="#FFE1CB" /><stop offset="0.35" stopColor="#F8A46D" /><stop offset="0.8" stopColor="#DC6E35" /><stop offset="1" stopColor="#C35A24" />
    </radialGradient>
    <linearGradient id="g3-wh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.6" stopColor="#F8F4F1" /><stop offset="1" stopColor="#E6DED8" />
    </linearGradient>
    <radialGradient id="g3-whb" cx="0.38" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.6" stopColor="#F4EFEB" /><stop offset="1" stopColor="#DAD0C9" />
    </radialGradient>
    <linearGradient id="g3-dk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4A4440" /><stop offset="1" stopColor="#1C1917" />
    </linearGradient>
    <linearGradient id="g3-metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor="#D9D6D3" /><stop offset="0.55" stopColor="#F7F6F5" /><stop offset="1" stopColor="#A9A4A0" />
    </linearGradient>
    <linearGradient id="g3-shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" /><stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="g3-peach" cx="0.38" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#FFF1E6" /><stop offset="0.55" stopColor="#F9CFB3" /><stop offset="1" stopColor="#E9A27C" />
    </radialGradient>
  </defs>
);

/** Moneda con grosor, brillo y € en relieve. */
export const Coin: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: orangeGlow }}>
    <G3 />
    <circle cx="50" cy="55" r="44" fill="#B9551F" />
    <circle cx="50" cy="50" r="44" fill="url(#g3-orb)" />
    <circle cx="50" cy="50" r="35" fill="none" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="2.5" />
    <text x="50" y="66.5" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="46" fill="#B9551F" opacity="0.55">€</text>
    <text x="50" y="65" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="46" fill="#FFFFFF">€</text>
    <ellipse cx="38" cy="26" rx="20" ry="9" fill="url(#g3-shine)" transform="rotate(-25 38 26)" />
  </svg>
);
/** Persona «de plastilina»: cabeza y cuerpo con volumen dentro de un círculo blanco. */
export const Avatar: React.FC<{ size: number; tone?: string }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: softDrop }}>
    <G3 />
    <defs><clipPath id="g3-avclip"><circle cx="50" cy="50" r="46" /></clipPath></defs>
    <circle cx="50" cy="50" r="48" fill="url(#g3-wh)" />
    <g clipPath="url(#g3-avclip)">
      <rect x="0" y="0" width="100" height="100" fill="#F6F0EB" />
      <ellipse cx="50" cy="104" rx="36" ry="34" fill="url(#g3-orb)" />
      <ellipse cx="42" cy="78" rx="14" ry="5" fill="url(#g3-shine)" opacity="0.6" />
      <circle cx="50" cy="40" r="19" fill="url(#g3-peach)" />
      <ellipse cx="44" cy="31" rx="7" ry="4" fill="#FFFFFF" opacity="0.7" />
    </g>
    <circle cx="50" cy="50" r="46.5" fill="none" stroke="#FFFFFF" strokeWidth="3" />
  </svg>
);
export const Tile: React.FC<{ size: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ size, children, style }) => (
  <div style={{ width: size, height: size, ...surface(34), display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);
/** Tacha en X naranja brillante que se dibuja (dos trazos de 200 ms), con sombra. */
export const Cross: React.FC<{ t: number; at: number; size: number; color?: string; width?: number }> = ({ t, at, size, width = 14 }) => {
  const a = lerp(t, at, at + 0.18, 1, 0);
  const b = lerp(t, at + 0.12, at + 0.3, 1, 0);
  const id = "g3-xs";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -size / 2, marginTop: -size / 2, overflow: "visible", filter: orangeGlow }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFC49C" /><stop offset="1" stopColor="#D8662D" /></linearGradient>
      </defs>
      {[["M14 14 L86 86", a], ["M86 14 L14 86", b]].map(([d, off], i) => (
        <g key={i}>
          <path d={d as string} stroke="#B9551F" strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={off as number} transform="translate(0 3)" />
          <path d={d as string} stroke={`url(#${id})`} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={off as number} />
          <path d={d as string} stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth={width * 0.22} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={off as number} transform="translate(-1.5 -2.5)" />
        </g>
      ))}
    </svg>
  );
};
/** Visto bueno: esfera naranja brillante y ✓ blanco que se dibuja. */
export const Check: React.FC<{ s: number; p: number; color?: string }> = ({ s, p }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible", filter: orangeGlow, opacity: Math.min(1, p * 3), transform: `scale(${0.7 + 0.3 * Math.min(1, p * 2)})` }}>
    <G3 />
    <circle cx="50" cy="53" r="44" fill="#B9551F" />
    <circle cx="50" cy="50" r="44" fill="url(#g3-orb)" />
    <ellipse cx="38" cy="24" rx="20" ry="8" fill="url(#g3-shine)" transform="rotate(-25 38 24)" />
    <path d="M29 53 l14 14 l29 -31" fill="none" stroke="#9E4618" strokeOpacity="0.35" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} transform="translate(0 3)" />
    <path d="M29 53 l14 14 l29 -31" fill="none" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
  </svg>
);
/** Etiqueta de precio con volumen: naranja brillante o oscura con reflejo; con su cordón. */
export const PriceTag: React.FC<{ w: number; fill?: string; label?: string }> = ({ w, fill = C.anthracite, label = "€" }) => {
  const orange = fill === C.accent;
  return (
    <svg width={w} height={w * 1.2} viewBox="0 0 300 360" style={{ overflow: "visible", filter: orange ? orangeGlow : softDrop }}>
      <G3 />
      <path d="M150 125 C150 70 120 40 150 0" fill="none" stroke="#D9CFC8" strokeWidth="6" strokeLinecap="round" />
      <path d="M80 140 L150 88 L220 140 V336 a22 22 0 0 1 -22 22 H102 a22 22 0 0 1 -22 -22 Z" fill={orange ? "#B9551F" : "#0E0C0B"} transform="translate(0 8)" />
      <path d="M80 140 L150 88 L220 140 V336 a22 22 0 0 1 -22 22 H102 a22 22 0 0 1 -22 -22 Z" fill={orange ? "url(#g3-or)" : "url(#g3-dk)"} />
      <path d="M92 146 L150 104 L208 146 V200 C170 186 130 186 92 200 Z" fill="url(#g3-shine)" opacity={orange ? 0.45 : 0.16} />
      <circle cx="150" cy="135" r="15" fill={orange ? "#B9551F" : "#0E0C0B"} />
      <circle cx="150" cy="133" r="12" fill="#F3EEEA" />
      <text x="150" y="292" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="112" fill={orange ? "#B9551F" : "#000000"} opacity="0.5">{label}</text>
      <text x="150" y="287" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="112" fill={orange ? "#FFFFFF" : "url(#g3-or)"}>{label}</text>
    </svg>
  );
};
/** Bocadillo blanco con volumen y tres puntos naranjas brillantes. */
export const Bubble: React.FC<{ w: number; dots?: number; fill?: string }> = ({ w, dots = 3, fill = C.white }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 200 144" style={{ overflow: "visible", filter: softDrop }}>
    <G3 />
    <path d="M24 8 H176 a16 16 0 0 1 16 16 V96 a16 16 0 0 1 -16 16 H70 L40 138 L44 112 H24 a16 16 0 0 1 -16 -16 V24 a16 16 0 0 1 16 -16 Z" fill="url(#g3-wh)" opacity={fill === C.white ? 1 : 0.92} />
    <path d="M26 12 H174 a12 12 0 0 1 12 12 V30 H14 V24 a12 12 0 0 1 12 -12 Z" fill="#FFFFFF" opacity="0.9" />
    {Array.from({ length: dots }).map((_, i) => {
      const cx = 100 + (i - (dots - 1) / 2) * 34;
      return (
        <g key={i}>
          <circle cx={cx} cy="62" r="12" fill="#C9662F" opacity="0.35" />
          <circle cx={cx} cy="60" r="12" fill="url(#g3-orb)" />
        </g>
      );
    })}
  </svg>
);
/** Signo de duda en una esfera blanca con la interrogación naranja en relieve. */
export const Question: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible", filter: softDrop }}>
    <G3 />
    <circle cx="50" cy="50" r="46" fill="url(#g3-whb)" />
    <ellipse cx="38" cy="22" rx="20" ry="8" fill="#FFFFFF" opacity="0.9" transform="rotate(-20 38 22)" />
    <text x="50" y="74" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="64" fill="#B9551F" opacity="0.45">?</text>
    <text x="50" y="71" textAnchor="middle" fontFamily={fontFamily} fontWeight={700} fontSize="64" fill="url(#g3-or)">?</text>
  </svg>
);
/** Estrella naranja con volumen (caras claras y oscuras). */
export const Star: React.FC<{ s: number }> = ({ s }) => {
  const P = [[50, 6], [62, 36], [94, 38], [69, 59], [78, 91], [50, 73], [22, 91], [31, 59], [6, 38], [38, 36]];
  const c = [50, 52];
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible", filter: orangeGlow }}>
      <G3 />
      <path d={`M${P.map((p) => p.join(" ")).join(" L")} Z`} fill="#B9551F" transform="translate(0 4)" />
      {P.map((p, i) => {
        const q = P[(i + 1) % P.length];
        const light = [0, 1, 8, 9].includes(i);
        return <path key={i} d={`M${c[0]} ${c[1]} L${p[0]} ${p[1]} L${q[0]} ${q[1]} Z`} fill={light ? "#FFC49C" : i % 2 ? "#E9844A" : "#F39B62"} />;
      })}
      <path d={`M${P.map((p) => p.join(" ")).join(" L")} Z`} fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};
/** Esfera de vídeo: botón de reproducir de cristal. */
export const PlayButton: React.FC<{ s: number; scale?: number }> = ({ s, scale = 1 }) => (
  <div style={{ width: s, height: s, borderRadius: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.35))", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.9), 0 10px 26px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${scale})` }}>
    <svg width={s * 0.42} height={s * 0.42} viewBox="0 0 100 100" style={{ marginLeft: s * 0.06, filter: orangeGlow, overflow: "visible" }}>
      <G3 />
      <path d="M22 10 Q22 2 30 6 L88 44 Q94 50 88 56 L30 94 Q22 98 22 90 Z" fill="url(#g3-or)" />
    </svg>
  </div>
);
/** Reproductor con su propio vídeo dentro (miniatura en movimiento), tarjeta oscura con brillo y barra naranja. */
export const VideoCard: React.FC<{ t: number; dir: string; start: number; end: number; trim: number; w: number; h: number; progress: number; children?: React.ReactNode; playScale?: number; image?: string }> = ({ t, dir, start, end, trim, w, h, progress, children, playScale = 1, image }) => {
  const kb = interpolate(t, [start, end], [1.08, 1.0], clamp);
  return (
    <div style={{ width: w, padding: 14, boxSizing: "border-box", ...darkSurface(44) }}>
      <div style={{ width: w - 28, height: h, borderRadius: 32, overflow: "hidden", position: "relative", background: "#000" }}>
        {image ? (
          <>
            {/* su miniatura «en modo animación»: zoom lento hacia su cara y un brillo que la recorre */}
            <Img src={staticFile(`${dir}/${image}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(t, [start, end], [1.0, 1.12], clamp)}) translateX(${interpolate(t, [start, end], [0, 14], clamp)}px)`, transformOrigin: "22% 30%" }} />
            <div style={{ position: "absolute", top: -40, bottom: -40, width: 160, left: interpolate(t, [start + 0.35, start + 1.1], [-260, w + 60], clamp), background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)", transform: "skewX(-18deg)" }} />
          </>
        ) : (
          <Sequence from={fr(start)} durationInFrames={Math.max(1, fr(end - start))} layout="none">
            <OffthreadVideo src={staticFile(`${dir}/video.mp4`)} muted trimBefore={fr(trim)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%", transform: `scale(${kb})` }} />
          </Sequence>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.28) 100%)" }} />
        <div style={{ position: "absolute", ...(image ? { right: 26 } : { left: 26 }), bottom: 26 }}><PlayButton s={96} scale={playScale} /></div>
        {children}
      </div>
      <div style={{ position: "relative", margin: "18px 10px 6px", height: 12, ...inset(999), background: "rgba(255,255,255,0.14)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: `${progress * 100}%`, borderRadius: 999, background: orangeFill, boxShadow: orangeGlowBox }} />
      </div>
    </div>
  );
};

// ---------- sonido: uno en cada animación, variados y bajitos (lista para master_audio.py) ----------
export const LIB: Record<string, { peak: number; target: number; start: number }> = {
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
export const sndList = (cues: [string, number, string][]) =>
  cues.map(([file, at, what]) => {
    const l = LIB[file];
    return { file, at, start: l.start, gain_db: Math.round((l.target - l.peak - 1.5) * 10) / 10, what };
  });
