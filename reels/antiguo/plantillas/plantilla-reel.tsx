// Reel F88B6D87 · "¿Pongo mi logo?" — composición propia según 2. MI ESTILO/mi-estilo.md
// y 3. LISTOS/REELS/F88B6D87_guion-edicion.md. Subtítulos encima de la cabeza (decisión del vídeo).
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import captions from "./data/F88B6D87-captions.json";

const { fontFamily } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });

// ---------- ficha: colores ----------
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
export const FPS_V3 = 30;
export const DURATION_S_V3 = (captions as { duration: number }).duration;

type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (captions as { words: Word[] }).words;

// ---------- utilidades ----------
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Entrada: opacidad 0→1 y Y 20→0 en 280 ms; salida opcional 200 ms con Y 0→-12. */
const enterExit = (t: number, start: number, end?: number, dur = 0.28) => {
  const inP = interpolate(t, [start, start + dur], [0, 1], { ...clamp, easing: easeOut });
  let opacity = inP;
  let y = (1 - inP) * 20;
  if (end !== undefined) {
    const outP = interpolate(t, [end - 0.2, end], [0, 1], { ...clamp, easing: easeOut });
    opacity *= 1 - outP;
    y -= outP * 12;
  }
  return { opacity, transform: `translateY(${y}px)` };
};
/** Énfasis 100→104→100 % en 220 ms. */
const pulse = (t: number, at: number) =>
  interpolate(t, [at, at + 0.11, at + 0.22], [1, 1.04, 1], { ...clamp, easing: easeInOut });

// ---------- cámara (segundos del reel) ----------
type Shot =
  | { from: number; to: number; kind: "full"; z0: number; z1: number }
  | { from: number; to: number; kind: "split"; z: number };
const SHOTS: Shot[] = [
  { from: 0, to: 1.25, kind: "full", z0: 1.0, z1: 1.02 },
  { from: 1.25, to: 2.6, kind: "full", z0: 1.14, z1: 1.16 },
  { from: 2.6, to: 6.367, kind: "split", z: 1.0 },
  { from: 6.367, to: 8.267, kind: "split", z: 1.06 },
  { from: 8.267, to: 12.233, kind: "full", z0: 1.0, z1: 1.06 },
  { from: 12.233, to: 14.533, kind: "full", z0: 1.16, z1: 1.12 },
  { from: 14.533, to: 16.4, kind: "full", z0: 1.0, z1: 1.04 },
  { from: 16.4, to: 17.667, kind: "full", z0: 1.08, z1: 1.1 },
  { from: 17.667, to: 20.733, kind: "full", z0: 1.12, z1: 1.16 },
  { from: 20.733, to: 25.367, kind: "split", z: 1.0 },
  { from: 25.367, to: 29.267, kind: "full", z0: 1.0, z1: 1.06 },
  { from: 29.267, to: 32.267, kind: "full", z0: 1.16, z1: 1.12 },
  { from: 32.267, to: 36.633, kind: "split", z: 1.0 },
  { from: 36.633, to: 38.367, kind: "split", z: 1.06 },
  { from: 38.367, to: 40.9, kind: "full", z0: 1.06, z1: 1.0 },
  { from: 40.9, to: 42.467, kind: "full", z0: 1.14, z1: 1.16 },
  { from: 42.467, to: 99, kind: "full", z0: 1.0, z1: 1.05 },
];
// Centro de la cara en el vídeo 1080×1920 (medido en los fotogramas): x 48 %, y 37 %.
const FACE_X = 0.48 * 1080;
const FACE_Y = 0.37 * 1920;
// Pantalla dividida: arriba 46 % (883 px) gráfica; abajo el vídeo desplazado para que el pelo quede ~100 px bajo la costura.
const SEAM = 883;
const SPLIT_SRC_TOP = 435; // fila del vídeo 1080×1920 que queda pegada a la costura

const shotAt = (t: number) => SHOTS.find((s) => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];

const Camera: React.FC<{ t: number }> = ({ t }) => {
  const s = shotAt(t);
  const video = (
    <OffthreadVideo src={staticFile("F88B6D87/video.mp4")} style={{ width: 1080, height: 1920 }} />
  );
  if (s.kind === "full") {
    const z = interpolate(t, [s.from, s.to], [s.z0, s.z1], { ...clamp, easing: easeInOut });
    return (
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>{video}</AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: SEAM, width: 1080, height: 1920 - SEAM, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -SPLIT_SRC_TOP,
            width: 1080,
            height: 1920,
            transform: `scale(${s.z})`,
            transformOrigin: `${FACE_X}px ${FACE_Y}px`,
          }}
        >
          {video}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: SEAM, background: C.white }} />
    </AbsoluteFill>
  );
};

// ---------- subtítulos ----------
const SOLO = new Set(["vender", "natural", "conectar", "«redes»"]);
const clean = (w: string) => w.replace(/[.,;:]+$/g, "").replace(/^[,;:]+/, "");
const norm = (w: string) => clean(w).toLowerCase().replace(/[¿?¡!]/g, "");
type Block = { text: string; start: number; end: number; solo: boolean };
const BLOCKS: Block[] = (() => {
  const out: Block[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({
      text: cur.map((w) => clean(w.text)).join(" "),
      start: cur[0].start,
      end: cur[cur.length - 1].end,
      solo: cur.length === 1 && SOLO.has(norm(cur[0].text)),
    });
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const solo = SOLO.has(norm(w.text));
    if (solo) {
      flush();
      cur = [w];
      flush();
      return;
    }
    const prev = cur[cur.length - 1];
    const chars = cur.map((x) => clean(x.text)).join(" ").length + clean(w.text).length + 1;
    if (cur.length && (cur.length >= 3 || chars > 18 || w.start - prev.end > 0.25)) flush();
    cur.push(w);
    const next = WORDS[i + 1];
    if (/[.,?;:]$/.test(w.text) || !next) flush();
  });
  // cada bloque se ve hasta que empieza el siguiente (máx. +0,4 s tras su última palabra)
  return out.map((b, i) => ({ ...b, end: Math.min(out[i + 1]?.start ?? b.end + 0.3, b.end + 0.4) }));
})();

const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const b = BLOCKS.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const split = shotAt(t).kind === "split";
  const pop = interpolate(t, [b.start, b.start + 0.08], [0.6, 1], { ...clamp, easing: easeOut });
  const scale = b.solo ? pulse(t, b.start) : 1;
  // v2: sin fondo. Pantalla completa: blanco con contorno negro suave 2 px + sombra tenue.
  // Pantalla dividida: negro #111111 sobre el blanco, justo encima de la costura.
  const outline =
    "0 0 2px rgba(0,0,0,0.85), 1px 1px 0 rgba(0,0,0,0.55), -1px 1px 0 rgba(0,0,0,0.55), 1px -1px 0 rgba(0,0,0,0.55), -1px -1px 0 rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.45)";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: split ? 835 : 455,
        display: "flex",
        justifyContent: "center",
        transform: "translateY(-50%)",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: split ? C.black : C.white,
          textShadow: split ? "none" : outline,
          whiteSpace: "nowrap",
          opacity: pop,
          transform: `scale(${scale})`,
        }}
      >
        {b.text}
      </div>
    </div>
  );
};

// ---------- titulares (degradado cálido) ----------
const gradText: React.CSSProperties = {
  fontFamily,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  backgroundImage: `linear-gradient(180deg, ${C.gradTop} 0%, ${C.gradBottom} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
const Headline: React.FC<{ t: number; start: number; end: number; main: string; sub?: string; size?: number }> = ({
  t, start, end, main, sub, size = 96,
}) => {
  if (t < start || t >= end) return null;
  const inP = interpolate(t, [start, start + 0.3], [0, 1], { ...clamp, easing: easeOut });
  const outP = interpolate(t, [end - 0.2, end], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div
      style={{
        position: "absolute",
        top: 228,
        left: 72,
        right: 72,
        textAlign: "center",
        opacity: inP * (1 - outP),
        transform: `translateY(${-outP * 12}px)`,
        filter: `blur(${(1 - inP) * 8}px) drop-shadow(0 4px 18px rgba(0,0,0,0.45))`,
      }}
    >
      <div style={{ ...gradText, fontSize: size, lineHeight: 1.05 }}>{main}</div>
      {sub ? <div style={{ ...gradText, fontWeight: 600, fontSize: 48, lineHeight: 1.15, marginTop: 4 }}>{sub}</div> : null}
    </div>
  );
};

// ---------- piezas gráficas ----------
const shadow = "0 12px 32px rgba(0,0,0,0.12)";
const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children, bg = C.accent, color = C.white, size = 34, style,
}) => (
  <div
    style={{
      fontFamily, fontWeight: 600, fontSize: size, color, background: bg, borderRadius: 999,
      padding: "10px 26px", display: "inline-block", whiteSpace: "nowrap", ...style,
    }}
  >
    {children}
  </div>
);
const Avatar: React.FC<{ size: number; ring?: number }> = ({ size, ring = 0 }) => (
  <div
    style={{
      width: size, height: size, borderRadius: "50%", background: `linear-gradient(160deg, #EDEDED, #D6D6D6)`,
      boxShadow: ring > 0 ? `0 0 0 ${ring}px ${C.accent}` : `0 0 0 2px ${C.border}`, position: "relative", overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: "32%", top: "20%", width: "36%", height: "36%", borderRadius: "50%", background: "#BDBDBD" }} />
    <div style={{ position: "absolute", left: "18%", top: "62%", width: "64%", height: "60%", borderRadius: "50%", background: "#BDBDBD" }} />
  </div>
);
const Bar: React.FC<{ w: number; h?: number; c?: string }> = ({ w, h = 16, c = C.border }) => (
  <div style={{ width: w, height: h, borderRadius: 999, background: c }} />
);
const captureIn = (t: number, start: number) => {
  const p = interpolate(t, [start, start + 0.45], [0, 1], { ...clamp, easing: easeInOut });
  return { opacity: interpolate(t, [start, start + 0.28], [0, 1], { ...clamp, easing: easeOut }), transform: `scale(${0.96 + 0.04 * p})` };
};

// ---------- v2: ventanas flotantes con vídeo de recurso (Pexels) y tarjetas laterales ----------
const fr = (s: number) => Math.round(s * FPS_V3);

/** Clip de Pexels sin sonido que empieza a sonar en `start` (segundos del reel) desde `trim` (segundos del clip). */
const Clip: React.FC<{ file: string; start: number; end: number; trim?: number; opacity?: number }> = ({ file, start, end, trim = 0, opacity = 1 }) => (
  <Sequence from={fr(start)} durationInFrames={Math.max(1, fr(end - start))} layout="none">
    <OffthreadVideo
      src={staticFile(`F88B6D87/${file}`)}
      muted
      trimBefore={fr(trim)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity }}
    />
  </Sequence>
);

/** Insignia "LOGO" que se tacha en `strikeAt`. */
const LogoBadge: React.FC<{ t: number; strikeAt: number }> = ({ t, strikeAt }) => {
  const strike = interpolate(t, [strikeAt, strikeAt + 0.3], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", right: 14, top: 14, fontFamily, fontWeight: 700, fontSize: 28, color: C.white, background: C.anthracite, borderRadius: 999, padding: "8px 18px" }}>
      LOGO
      <div style={{ position: "absolute", left: 8, top: "50%", width: `calc((100% - 16px) * ${strike})`, height: 5, borderRadius: 999, background: C.accent, transform: "rotate(-18deg)", transformOrigin: "0 50%" }} />
    </div>
  );
};

// ---------- v3: vídeos GRANDES y semitransparentes DETRÁS de ella (recorte rembg delante) ----------
// Ventana de fondo 900×1600 centrada (x 90–990), desde y 380; opacidad 0,55; sin borde.
// Variante B: ventana 600×1067 detrás de un hombro (izquierda x 20–620 o derecha x 460–1060), desde y 300.
const BACK = { w: 600, h: 1067, top: 300, opacity: 0.6, x: { left: 20, right: 460 } };
const BackWindow: React.FC<{ t: number; start: number; end: number; side: "left" | "right"; children: React.ReactNode }> = ({ t, start, end, side, children }) => {
  if (t < start || t >= end) return null;
  const p = interpolate(t, [start, start + 0.45], [0, 1], { ...clamp, easing: easeInOut });
  const op = interpolate(t, [start, start + 0.28], [0, 1], { ...clamp, easing: easeOut });
  const out = interpolate(t, [end - 0.2, end], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", left: BACK.x[side], top: BACK.top, width: BACK.w, height: BACK.h, borderRadius: 36, overflow: "hidden",
      opacity: BACK.opacity * op * (1 - out), transform: `scale(${0.96 + 0.04 * p})`, transformOrigin: "50% 30%", boxShadow: "0 12px 32px rgba(0,0,0,0.20)" }}>
      {children}
    </div>
  );
};
/** Insignia LOGO para la ventana de fondo: arriba a la derecha, fuera de la silueta. */
const BackLogo: React.FC<{ t: number; strikeAt: number }> = ({ t, strikeAt }) => (
  <div style={{ position: "absolute", right: 40, top: 40, transform: "scale(1.3)", transformOrigin: "100% 0" }}><LogoBadge t={t} strikeAt={strikeAt} /></div>
);

const BackScenes: React.FC<{ t: number }> = ({ t }) => {
  const sw = 17.34;
  const fade = interpolate(t, [sw, sw + 0.25], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <>
      {/* gancho: tijeras + LOGO tachado en "logo" */}
      <BackWindow t={t} side="right" start={0.3} end={2.6}>
        <Clip file="pexels-3996967.mp4" start={0.3} end={2.6} trim={0.5} />
        <BackLogo t={t} strikeAt={1.187} />
      </BackWindow>
      {/* seguidores: estilista con clienta */}
      <BackWindow t={t} side="left" start={8.267} end={12.233}>
        <Clip file="pexels-8225484.mp4" start={8.267} end={12.233} trim={1} />
      </BackWindow>
      {/* contenido: coloración con LOGO tachado → peinado natural */}
      <BackWindow t={t} side="left" start={14.533} end={17.667}>
        <Clip file="pexels-3996891.mp4" start={14.533} end={sw + 0.3} trim={2} opacity={1 - fade} />
        <Clip file="pexels-6501452.mp4" start={sw} end={17.667} trim={1} opacity={fade} />
        <div style={{ opacity: 1 - fade }}><BackLogo t={t} strikeAt={15.387} /></div>
      </BackWindow>
      {/* conectar: estilista sonriendo a cámara */}
      <BackWindow t={t} side="right" start={29.267} end={32.267}>
        <Clip file="pexels-3996967.mp4" start={29.267} end={32.267} trim={13} />
      </BackWindow>
    </>
  );
};

// Recorte de ella (WebM con alfa de matte.py) encima de la ventana, con la MISMA cámara que el vídeo.
const MATTES = [
  { name: "gancho", from: 0.3, to: 2.6 },
  { name: "seguidores", from: 8.267, to: 12.233 },
  { name: "natural", from: 14.533, to: 17.667 },
  { name: "conectar", from: 29.267, to: 32.267 },
];
const Cutouts: React.FC<{ t: number }> = ({ t }) => {
  const s = shotAt(t);
  const z = s.kind === "full" ? interpolate(t, [s.from, s.to], [s.z0, s.z1], { ...clamp, easing: easeInOut }) : 1;
  return (
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${FACE_X}px ${FACE_Y}px` }}>
      {MATTES.map((m) => (
        <Sequence key={m.name} from={fr(m.from)} durationInFrames={fr(m.to - m.from)} layout="none">
          <OffthreadVideo src={staticFile(`F88B6D87/matte-${m.name}.webm`)} transparent muted style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Escena 1 (2,6–8,27): publicación con logo → "Publicidad" → no llega a gente nueva
const SceneAd: React.FC<{ t: number }> = ({ t }) => {
  const S = 2.6, END = 8.267;
  if (t < S || t >= END) return null;
  const card = captureIn(t, S);
  const pillA = enterExit(t, 5.88);
  const pillS = pulse(t, 5.88 + 0.28);
  const dim = interpolate(t, [7.93, 8.23], [1, 0.3], { ...clamp, easing: easeOut });
  const txt = enterExit(t, 7.93);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 250, top: 236, width: 580, height: 400, ...card }}>
        <div style={{ width: 580, height: 400, borderRadius: 28, background: C.light, border: `2px solid ${C.border}`, boxShadow: shadow, padding: 28, boxSizing: "border-box", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar size={56} />
            <Bar w={200} h={18} c="#D9D9D9" />
          </div>
          <div style={{ position: "relative", marginTop: 22, height: 220, borderRadius: 18, overflow: "hidden", background: "#DCDCDC" }}>
            <Clip file="pexels-3997179.mp4" start={S} end={END} trim={0.5} />
          </div>
          <div style={{ position: "absolute", right: 46, top: 112, fontFamily, fontWeight: 700, fontSize: 26, color: C.white, background: C.anthracite, borderRadius: 999, padding: "8px 18px" }}>LOGO</div>
          <div style={{ marginTop: 22, display: "flex", gap: 14 }}><Bar w={300} /><Bar w={120} /></div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 168, display: "flex", justifyContent: "center", ...pillA }}>
          <div style={{ transform: `scale(${pillS})` }}><Pill size={40}>Publicidad</Pill></div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 668, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20, opacity: interpolate(t, [S + 0.3, S + 0.58], [0, 1], clamp) }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ opacity: dim }}><Avatar size={64} /></div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 752, left: 0, right: 0, textAlign: "center", fontFamily, fontWeight: 600, fontSize: 36, color: C.grey, ...txt }}>
        No llega a gente nueva
      </div>
    </AbsoluteFill>
  );
};

// Escena 2 (20,73–25,37): el nombre y la foto ya están en cada publicación
const SceneProfile: React.FC<{ t: number }> = ({ t }) => {
  const S = 20.733, END = 25.367;
  if (t < S || t >= END) return null;
  const nameP = interpolate(t, [22.493, 22.793], [0, 1], { ...clamp, easing: easeOut });
  const photoP = interpolate(t, [23.513, 23.813], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => {
        const a = enterExit(t, S + i * 0.08);
        return (
          <div key={i} style={{ position: "absolute", left: 180, top: 250 + i * 160, width: 720, height: 128, ...a }}>
            <div style={{ width: 720, height: 128, borderRadius: 24, background: C.white, border: `2px solid ${C.border}`, boxShadow: shadow, display: "flex", alignItems: "center", gap: 24, padding: "0 32px", boxSizing: "border-box" }}>
              <Avatar size={76} ring={photoP * 5} />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ position: "relative", fontFamily, fontWeight: 600, fontSize: 36, color: C.black, padding: "2px 10px", marginLeft: -10 }}>
                  Tu salón
                  <div style={{ position: "absolute", inset: 0, borderRadius: 12, boxShadow: `inset 0 0 0 ${3 * nameP}px ${C.accent}`, opacity: nameP }} />
                </div>
                <Bar w={260} h={14} />
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Escena 3 (32,27–38,37): te compran por… / no por…
const SceneCompare: React.FC<{ t: number }> = ({ t }) => {
  const S = 32.267, END = 38.367;
  if (t < S || t >= END) return null;
  const box = captureIn(t, S);
  const item = (start: number, text: string, good: boolean) => {
    const a = enterExit(t, start);
    const strike = good ? 0 : interpolate(t, [start + 0.2, start + 0.5], [0, 1], { ...clamp, easing: easeOut });
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginTop: 26, ...a }}>
        <div style={{ flex: "0 0 40px", height: 40, borderRadius: "50%", background: good ? C.accent : C.border, color: good ? C.white : C.grey, display: "flex", alignItems: "center", justifyContent: "center", fontFamily, fontWeight: 700, fontSize: 26, marginTop: 2 }}>
          {good ? "✓" : "✕"}
        </div>
        <div style={{ position: "relative", fontFamily, fontWeight: 600, fontSize: 34, lineHeight: 1.2, color: good ? C.black : C.grey }}>
          {text}
          {!good ? <div style={{ position: "absolute", left: 0, top: "52%", height: 3, width: `${strike * 100}%`, background: C.grey, borderRadius: 999 }} /> : null}
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 80, top: 250, width: 920, height: 500, ...box }}>
      <div style={{ width: 920, height: 500, borderRadius: 32, background: C.light, border: `2px solid ${C.border}`, boxShadow: shadow, display: "flex", padding: 40, boxSizing: "border-box", gap: 32 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: C.black }}>Te compran por</div>
          {item(33.547, "La solución a sus problemas", true)}
          {item(35.287, "Tus valores", true)}
        </div>
        <div style={{ width: 2, background: C.border, borderRadius: 999 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: C.grey }}>No por</div>
          {item(37.133, "Tu logo", false)}
          {item(37.733, "El nombre del salón", false)}
        </div>
      </div>
    </div>
  );
};

// "La clave" (29,27–32,27)
const KeyPill: React.FC<{ t: number }> = ({ t }) => {
  if (t < 29.48 || t >= 32.267) return null;
  const a = enterExit(t, 29.48, 32.267);
  return (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", ...a }}>
      <Pill size={38}>La clave</Pill>
    </div>
  );
};

// Cierre: «REDES» grande arriba desde la palabra hasta el final
const CtaWord: React.FC<{ t: number }> = ({ t }) => {
  const S = 43.207;
  if (t < S) return null;
  const inP = interpolate(t, [S, S + 0.3], [0, 1], { ...clamp, easing: easeOut });
  return (
    <div style={{ position: "absolute", top: 236, left: 0, right: 0, textAlign: "center", opacity: inP, transform: `translateY(${(1 - inP) * 20}px)`, filter: `blur(${(1 - inP) * 8}px) drop-shadow(0 4px 18px rgba(0,0,0,0.45))` }}>
      <div style={{ ...gradText, fontSize: 120, lineHeight: 1.05 }}>«REDES»</div>
    </div>
  );
};

// ---------- composición ----------
export const ReelF88B6D87v3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = (s: number) => Math.round(s * fps);
  // efectos: ~−24 dB bajo la voz (whoosh medido −17 LUFS vs voz −28,7 LUFS en el corte en bruto)
  const WHOOSH = 0.016;
  const CLICK = 0.13;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Camera t={t} />
      {/* v3: vídeo de recurso detrás → ella recortada delante (sin tarjetas laterales) */}
      <BackScenes t={t} />
      <Cutouts t={t} />
      <SceneAd t={t} />
      <SceneProfile t={t} />
      <SceneCompare t={t} />
      <Headline t={t} start={0} end={2.6} main="¿Pongo mi logo?" sub="en mis publicaciones" />
      <Headline t={t} start={17.667} end={20.733} main="¿Y el nombre?" sub="de mi salón" />
      <KeyPill t={t} />
      <CtaWord t={t} />
      <Subtitles t={t} />
      <Sequence from={f(0.3)} durationInFrames={f(1)}><Audio src={staticFile("F88B6D87/whoosh.mp3")} volume={WHOOSH} /></Sequence>
      <Sequence from={f(2.6) - 4} durationInFrames={f(1)}><Audio src={staticFile("F88B6D87/whoosh.mp3")} volume={WHOOSH} /></Sequence>
      <Sequence from={f(20.733) - 4} durationInFrames={f(1)}><Audio src={staticFile("F88B6D87/whoosh.mp3")} volume={WHOOSH} /></Sequence>
      <Sequence from={f(32.267) - 4} durationInFrames={f(1)}><Audio src={staticFile("F88B6D87/whoosh.mp3")} volume={WHOOSH} /></Sequence>
      <Sequence from={f(43.207)} durationInFrames={f(0.5)}><Audio src={staticFile("F88B6D87/click.mp3")} volume={CLICK} /></Sequence>
    </AbsoluteFill>
  );
};
