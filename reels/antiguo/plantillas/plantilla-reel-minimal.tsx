// Reel MMAW6550 · «precios» (v4, 11 nov 2026: documento «cambios» → minimalista, pocas palabras, cajas grandes, rojo/verde; v3, 11 de noviembre de 2026: escenas completas tipo app premium con textos cortos; v2: 3D suave, borde en onda, Pexels nuevo, su vídeo en el reproductor). Primera mitad del bruto MMAW6550.
// Sin texto que repita los subtítulos: solo dibujos en movimiento. Pantallas divididas + animaciones detrás de ella.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../data/MMAW6550P-captions.json";
import {
  BackWindow, C, Camera, Check, Clip, CtaWord, Cutouts, G3, Matte, Shot, Subtitles, VideoCard,
  clamp, easeIn, easeInOut, inset, lerp, makeBlocks, makeShots, orangeFill, orangeGlowBox, popIn, pulse, sndList, softBack, softDrop, surface,
} from "./common";
import { Chip, Cursor, Glow, INK, MUTED, MiniAvatar, OR, Panel, Roller, Toggle, Txt, Typing, enter, float } from "./ui";

const DIR = "MMAW6550P";
export const DURATION_S_MMAW6550P = (captions as { duration: number }).duration;
type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (captions as { words: Word[] }).words;

const T = {
  clienta: 1.73,
  caro: 2.99,
  aqui: 3.267,
  dos: 3.9,
  pequena: 4.99,
  justificarte: 5.8,
  seguridad: 6.82,
  valorar: 7.92,
  estilista: 8.633,
  valor: 10.16,
  color: 12.33,
  pagado: 12.533,
  tres: 13.39,
  especializado: 14.41,
  producto: 15.28,
  servicio: 16.66,
  mantener: 18.12,
  noDebes: 18.8,
  convencer: 19.41,
  panadero: 21.29,
  pan: 22.91,
  traiciones: 23.0,
  bajando: 24.07,
  incomodidad: 24.98,
  si: 25.433,
  defiendes: 25.98,
  nadie: 27.04,
  dejo: 27.733,
  comunicar: 28.78,
  precios: 29.39,
  cta: 30.033,
  comenta: 30.16,
  precio: 30.42,
};

const SHOTS: Shot[] = [
  { from: 0, to: 1.5, kind: "full", z0: 1.0, z1: 1.03 },
  { from: 1.5, to: T.aqui, kind: "full", z0: 1.1, z1: 1.12 },
  { from: T.aqui, to: 6.367, kind: "split", z: 1.0 },
  { from: 6.367, to: T.estilista, kind: "split", z: 1.07 },
  { from: T.estilista, to: 11.067, kind: "full", z0: 1.0, z1: 1.04 },
  { from: 11.067, to: T.pagado, kind: "full", z0: 1.1, z1: 1.08 },
  { from: T.pagado, to: 15.0, kind: "split", z: 1.0 },
  { from: 15.0, to: T.noDebes, kind: "split", z: 1.07 },
  { from: T.noDebes, to: 21.2, kind: "full", z0: 1.0, z1: 1.04 },
  { from: 21.2, to: T.traiciones, kind: "full", z0: 1.1, z1: 1.12 },
  { from: T.traiciones, to: T.si, kind: "split", z: 1.0 },
  { from: T.si, to: T.dejo, kind: "full", z0: 1.06, z1: 1.02 },
  { from: T.dejo, to: T.cta, kind: "split", z: 1.0 },
  { from: T.cta, to: 99, kind: "full", z0: 1.0, z1: 1.05 },
];
const { shotAt, zoomAt } = makeShots(SHOTS);
const BLOCKS = makeBlocks(WORDS, T.comenta, new Set(["caro", "valorar", "color", "pan"]));

// ---------- v4 (documento «cambios»): minimalista, pocas palabras, sin frases, elementos de uno en uno ----------
const shake = (t: number, at: number, amp = 10) => (t > at && t < at + 0.45 ? Math.sin((t - at) * 55) * amp * (1 - (t - at) / 0.45) : 0);

/** Candado 3D que se cierra (sustituye al escudo). */
const Lock: React.FC<{ s: number; closed: number }> = ({ s, closed }) => (
  <svg width={s} height={s * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible", filter: softDrop }}>
    <G3 />
    <path d="M27 58 V38 a23 23 0 0 1 46 0 V58" fill="none" stroke="#D9D0C9" strokeWidth="12" strokeLinecap="round" transform={`translate(0 ${-(1 - closed) * 18})`} />
    <path d="M27 58 V38 a23 23 0 0 1 46 0 V58" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.8" transform={`translate(-2 ${-(1 - closed) * 18 - 2})`} />
    <rect x="12" y="52" width="76" height="62" rx="18" fill="#A9521F" transform="translate(0 4)" />
    <rect x="12" y="52" width="76" height="62" rx="18" fill="url(#g3-or)" />
    <rect x="16" y="55" width="68" height="20" rx="10" fill="url(#g3-shine)" opacity="0.55" />
    <circle cx="50" cy="80" r="8" fill="#5A2A10" />
    <rect x="46.5" y="82" width="7" height="16" rx="3.5" fill="#5A2A10" />
  </svg>
);

// ---------- 0 · gancho (detrás de ella): mensaje de la clienta arriba y el ticket justo debajo, más grande ----------
const BackHook: React.FC<{ t: number }> = ({ t }) => {
  if (t >= T.aqui) return null;
  const typed = t > 2.35;
  const badge = popIn(t, T.caro);
  return (
    <AbsoluteFill>
      <Glow x={540} y={360} r={520} o={0.35} />
      <div style={{ position: "absolute", left: 80, top: 190, ...enter(t, 0.15), transform: `${enter(t, 0.15).transform} translateX(${shake(t, T.caro)}px)` }}>
        <Panel w={920} pad={26} r={44}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <MiniAvatar s={96} hue={0} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <Txt s={32}>Clienta</Txt>
                <Txt s={24} w={600} c={MUTED}>ahora</Txt>
              </div>
              {typed ? <Txt s={44} style={{ opacity: lerp(t, 2.35, 2.55, 0, 1) }}>¿Tan caro?</Txt> : <div style={{ height: 50, display: "flex", alignItems: "center" }}><Typing t={t} /></div>}
            </div>
            <div style={{ opacity: badge.o, transform: `scale(${badge.s * pulse(t, T.caro + 0.25)})` }}><Chip text="!" tone="orange" s={40} style={{ padding: "8px 26px" }} /></div>
          </div>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 80, top: 380, ...enter(t, 0.55) }}>
        <Panel w={350} pad={32} r={40} style={{ transform: `rotate(${-2 + shake(t, T.caro, 3)}deg)` }}>
          <Txt s={34} c={MUTED} w={600} style={{ marginBottom: 24 }}>Ticket</Txt>
          {[0.75, 0.55, 0.65].map((w, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 22, opacity: lerp(t, 0.8 + i * 0.15, 1.0 + i * 0.15, 0, 1) }}>
              <div style={{ width: `${w * 70}%`, height: 18, ...inset(9) }} /><div style={{ width: 50, height: 18, ...inset(9) }} />
            </div>
          ))}
          <div style={{ borderTop: "3px dashed #E2D8D0", paddingTop: 22, marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Txt s={38}>Total</Txt>
            <div style={{ opacity: lerp(t, 1.3, 1.5, 0, 1) }}><Chip text="€€€" tone="orange" s={32} /></div>
          </div>
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1 · dos cajas: «Justificarte» (interruptor en rojo) y «Valorarte» (interruptor en verde) ----------
const SceneDos: React.FC<{ t: number }> = ({ t }) => {
  const S = T.aqui, END = T.estilista;
  if (t < S || t >= END) return null;
  const red = lerp(t, T.justificarte - 0.1, T.justificarte + 0.15, 0, 1, easeInOut);
  const green = lerp(t, T.valorar - 0.1, T.valorar + 0.15, 0, 1, easeInOut);
  const CW = 450, CH = 540, TOP = 200;
  const box = (x: number, at: number, label: string, on: number, tone: "red" | "green", rgb: string) => (
    <div style={{ position: "absolute", left: x, top: TOP, ...enter(t, at) }}>
      <Panel w={CW} h={CH} r={34} pad={40} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 70, boxShadow: `${surface(34).boxShadow}, 0 0 0 ${on * 5}px rgba(${rgb},0.9), 0 0 ${on * 60}px rgba(${rgb},${0.45 * on})` }}>
        <Txt s={58}>{label}</Txt>
        <div style={{ transform: `scale(${pulse(t, at === T.dos ? T.justificarte : T.valorar)})` }}><Toggle on={on} w={200} tone={tone} /></div>
      </Panel>
    </div>
  );
  return (
    <AbsoluteFill>
      {box(60, T.dos, "Justificarte", red, "red", "225,60,50")}
      {box(1080 - 60 - CW, T.dos + 0.12, "Valorarte", green, "green", "60,180,100")}
    </AbsoluteFill>
  );
};

// ---------- 2 · (detrás) vídeo de Pexels: se pone rojo en «no ha pagado solamente por un color» ----------
const RED_AT = 11.2;
const RedTint: React.FC<{ t: number }> = ({ t }) => {
  const r = lerp(t, RED_AT, RED_AT + 0.3, 0, 1, easeInOut);
  if (r <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#E3352C", mixBlendMode: "color", opacity: r }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(227,53,44,0.3)", opacity: r }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 44, boxShadow: `inset 0 0 0 ${8 * r}px rgba(227,53,44,0.9)` }} />
    </>
  );
};

// ---------- 3 · primero solo el cuadrado negro con «3 h»; luego, uno a uno: especializado, producto… ----------
const SceneTicket: React.FC<{ t: number }> = ({ t }) => {
  const S = T.pagado, END = T.noDebes;
  if (t < S || t >= END) return null;
  const sq = popIn(t, S + 0.05);
  const sqOut = lerp(t, T.especializado - 0.4, T.especializado - 0.1, 0, 1, easeIn);
  const rows = [
    { at: T.especializado, label: "Especializado" },
    { at: T.producto, label: "Producto" },
    { at: T.servicio, label: "Servicio" },
    { at: T.mantener, label: "Duradero" },
  ];
  const W = 640, H = 128;
  return (
    <AbsoluteFill>
      {sqOut < 1 ? (
        <div style={{ position: "absolute", left: 540 - 260, top: 200, opacity: sq.o * (1 - sqOut), transform: `scale(${sq.s * (1 - 0.25 * sqOut)}) translateY(${-sqOut * 40}px)` }}>
          <Panel w={520} h={520} dark r={64} pad={0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <Roller value={3} p={lerp(t, T.tres - 0.1, T.tres + 0.9, 0, 1, easeInOut)} s={210} />
            <Txt s={110} c="#FFFFFF" style={{ marginTop: 70 }}>h</Txt>
          </Panel>
        </div>
      ) : null}
      {rows.map((r, i) => {
        if (t < r.at - 0.05) return null;
        const ck = lerp(t, r.at + 0.2, r.at + 0.45, 0, 1);
        return (
          <div key={r.label} style={{ position: "absolute", left: 540 - W / 2, top: 180 + i * (H + 22), ...enter(t, r.at - 0.05, 30) }}>
            <Panel w={W} h={H} r={36} pad={0} style={{ display: "flex", alignItems: "center", gap: 30, padding: "0 36px" }}>
              <div style={{ width: 72, height: 72 }}>{ck > 0 ? <Check s={72} p={ck} /> : <div style={{ width: 72, height: 72, ...inset(999) }} />}</div>
              <Txt s={50}>{r.label}</Txt>
            </Panel>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 4 · (detrás) no convencer: chat de mensajes sin texto que se deshace → panadería y «Pagar» ----------
const BackBread: React.FC<{ t: number }> = ({ t }) => {
  const S = T.noDebes, END = T.traiciones;
  if (t < S || t >= END) return null;
  const chatOut = lerp(t, T.panadero - 0.35, T.panadero, 0, 1);
  const paid = lerp(t, T.pan + 0.05, T.pan + 0.3, 0, 1);
  const GONE = T.convencer + 1.0;
  const widths = [330, 420, 280, 380];
  return (
    <AbsoluteFill>
      <Glow x={540} y={420} r={560} o={0.3} />
      {t < T.panadero ? (
        <div style={{ position: "absolute", left: 220, top: 190, opacity: 1 - chatOut, transform: `scale(${1 - chatOut * 0.05})` }}>
          <div style={enter(t, S + 0.05)}>
            <Panel w={640} pad={28} r={44} style={{ transform: `translateX(${shake(t, GONE, 8)}px)` }}>
              <div style={{ marginBottom: 14 }}><MiniAvatar s={64} hue={0} /></div>
              {widths.map((w, i) => {
                const p = popIn(t, T.convencer - 0.35 + i * 0.2);
                const g = lerp(t, GONE + i * 0.06, GONE + 0.3 + i * 0.06, 0, 1, easeIn);
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, opacity: p.o * (1 - g), transform: `scale(${p.s * (1 - 0.3 * g)}) translateY(${g * 30}px)`, transformOrigin: "100% 50%" }}>
                    <div style={{ width: w, height: 58, borderRadius: 29, background: orangeFill, boxShadow: orangeGlowBox, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", boxSizing: "border-box" }}>
                      <div style={{ flex: 3, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.75)" }} />
                      <div style={{ flex: 2, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.5)" }} />
                    </div>
                  </div>
                );
              })}
            </Panel>
          </div>
        </div>
      ) : null}
      {t >= T.panadero - 0.1 ? (
        <>
          <div style={{ position: "absolute", left: 40, top: 470, ...enter(t, T.panadero - 0.1) }}>
            <div style={{ width: 340, padding: 10, boxSizing: "border-box", ...surface(40), transform: `rotate(-3deg) translateY(${float(t, 2)}px)` }}>
              <div style={{ width: 320, height: 420, borderRadius: 32, overflow: "hidden", position: "relative" }}>
                <Img src={staticFile(`${DIR}/p34786533.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${lerp(t, T.panadero, END, 1.12, 1.0)})` }} />
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 740, top: 520, ...enter(t, T.panadero + 0.25) }}>
            <Panel w={300} dark pad={22} r={40} style={{ transform: `rotate(3deg) translateY(${float(t, 4)}px)` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, padding: "0 6px" }}>
                <Txt s={42} c="#FFFFFF">Pan</Txt>
                <Chip text="€" tone="orange" s={30} />
              </div>
              <div style={{ height: 76, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: paid > 0 ? "linear-gradient(180deg,#FFFFFF,#EDE6E1)" : orangeFill, boxShadow: orangeGlowBox, transform: `scale(${pulse(t, T.pan)})` }}>
                {paid > 0 ? <><Check s={40} p={paid} /><Txt s={30} c={INK}>Pagado</Txt></> : <Txt s={30} c="#FFFFFF">Pagar</Txt>}
              </div>
            </Panel>
          </div>
          <Cursor t={t} path={[[T.panadero + 0.6, 1000, 900], [T.pan - 0.15, 880, 650], [END, 885, 662]]} clickAt={[T.pan - 0.05]} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- 5 · no bajar precios: solo la barra de precio (€ · €€ · €€€) que baja y vuelve ----------
const SceneTag: React.FC<{ t: number }> = ({ t }) => {
  const S = T.traiciones, END = T.si;
  if (t < S || t >= END) return null;
  const down = lerp(t, T.bajando, T.bajando + 0.5, 0, 1, easeInOut);
  const back = lerp(t, T.incomodidad + 0.05, T.incomodidad + 0.4, 0, 1, softBack);
  const lvl = 0.86 - 0.55 * down * (1 - back);
  const low = down * (1 - back) > 0.4;
  const TR = 760;
  const eur = (txt: string, active: boolean) => <Txt s={52} c={active ? OR : MUTED} style={{ textShadow: active ? "0 0 18px rgba(255,150,90,0.6)" : "none" }}>{txt}</Txt>;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: 320, ...enter(t, S + 0.05) }}>
        <Panel w={920} h={300} pad={0} r={48}>
          <div style={{ position: "absolute", left: 46, top: 60, width: TR + 70 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 34 }}>
              {eur("€", lvl < 0.45)}{eur("€€", lvl >= 0.45 && lvl < 0.75)}{eur("€€€", lvl >= 0.75)}
            </div>
            <div style={{ height: 34, ...inset(999), position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: lvl * TR + 34, borderRadius: 999, background: low ? "linear-gradient(180deg,#D6CCC4,#B9ADA4)" : orangeFill, boxShadow: low ? "none" : orangeGlowBox }} />
              <div style={{ position: "absolute", top: -17, left: lvl * TR, width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(180deg,#FFFFFF,#EDE6E1)", boxShadow: "0 8px 18px rgba(60,30,10,0.3), inset 0 2px 0 #fff" }} />
            </div>
          </div>
        </Panel>
      </div>
      <Cursor t={t} path={[[T.bajando - 0.3, 900, 640], [T.bajando, 814, 510], [T.bajando + 0.5, 396, 510], [T.incomodidad + 0.05, 396, 510], [T.incomodidad + 0.35, 814, 510], [END, 830, 540]]} clickAt={[T.bajando]} />
    </AbsoluteFill>
  );
};

// ---------- 6 · (detrás) defender tus precios: un candado que se cierra sobre «€€€» ----------
const BackLock: React.FC<{ t: number }> = ({ t }) => {
  const S = T.si, END = T.dejo;
  if (t < S || t >= END) return null;
  const closed = lerp(t, T.defiendes - 0.05, T.defiendes + 0.2, 0, 1, softBack);
  const glow = lerp(t, T.defiendes + 0.1, T.defiendes + 0.5, 0, 1);
  const out = lerp(t, END - 0.2, END, 0, 1);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Glow x={540} y={290} r={420} o={0.4 * glow} />
      <div style={{ position: "absolute", left: 540 - 260, top: 160, ...enter(t, S + 0.1) }}>
        <Panel w={520} h={240} r={48} pad={0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, transform: `translateY(${float(t)}px) scale(${pulse(t, T.defiendes + 0.15)})`, boxShadow: `${surface(48).boxShadow}, 0 0 ${glow * 60}px rgba(255,150,90,${0.55 * glow})` }}>
          <Lock s={130} closed={closed} />
          <Txt s={96} c={OR}>€€€</Txt>
        </Panel>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7 · el vídeo que le deja: reproductor con su miniatura, el cursor le da al play ----------
const ScenePlayer: React.FC<{ t: number }> = ({ t }) => {
  const S = T.dejo, END = T.cta;
  if (t < S || t >= END) return null;
  const W = 900, H = 470;
  const prog = interpolate(t, [T.comunicar - 0.2, END], [0, 0.6], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - W / 2, top: 236, width: W, ...enter(t, S) }}>
        <VideoCard t={t} dir={DIR} start={S} end={END} trim={PLAYER_TRIM} w={W} h={H} progress={prog} playScale={pulse(t, T.comunicar - 0.25)} image="miniatura.jpg" />
        <div style={{ position: "absolute", left: 30, top: -30, ...enter(t, S + 0.25, 16) }}><Chip text="Nuevo vídeo" tone="orange" s={26} /></div>
      </div>
      <Cursor t={t} path={[[S + 0.3, 1000, 760], [T.comunicar - 0.3, 900, 640], [END, 915, 660]]} clickAt={[T.comunicar - 0.25]} />
    </AbsoluteFill>
  );
};
/** Momento de su vídeo que se ve dentro del reproductor (ella hablando a cámara, plano completo). */
const PLAYER_TRIM = 9.2;

const MATTES: Matte[] = [
  { name: "gancho", from: 0, to: 3.35, show: [0, T.aqui] },
  { name: "color", from: 8.55, to: 12.6, show: [T.estilista, T.pagado] },
  { name: "panadero", from: 18.75, to: 23.05, show: [T.noDebes, T.traiciones] },
  { name: "defiende", from: 25.4, to: 27.8, show: [T.si, T.dejo] },
];

const CUES: [string, number, string][] = [
  ["swishA.mp3", 0.0, "llega el mensaje"],
  ["tick.mp3", 0.6, "sale el ticket"],
  ["pop.mp3", 1.32, "€€€"],
  ["pop2.mp3", T.clienta, "clienta"],
  ["stamp.mp3", T.caro, "el mensaje tiembla"],
  ["whoosh.mp3", T.aqui, "pantalla dividida: dos cajas"],
  ["click.mp3", T.justificarte - 0.1, "interruptor en rojo"],
  ["notaC4.mp3", T.valorar - 0.1, "interruptor en verde"],
  ["swishB.mp3", T.estilista, "vídeo de ondas detrás"],
  ["stamp.mp3", RED_AT, "el vídeo se pone rojo"],
  ["swishC.mp3", T.pagado, "pantalla dividida: 3 h"],
  ["count.wav", T.tres, "contador"],
  ["pop.mp3", T.especializado - 0.05, "especializado"],
  ["tick.mp3", T.producto + 0.2, "✓ producto"],
  ["pop2.mp3", T.servicio - 0.05, "servicio"],
  ["tick.mp3", T.mantener + 0.2, "✓ duradero"],
  ["pop2.mp3", T.convencer - 0.35, "mensajes"],
  ["swishA.mp3", T.convencer + 1.0, "los mensajes se deshacen"],
  ["notaC3.mp3", T.panadero, "panadería"],
  ["click.mp3", T.pan - 0.05, "clic en Pagar"],
  ["whoosh.mp3", T.traiciones, "pantalla dividida: barra de precio"],
  ["trazo.mp3", T.bajando, "la barra baja"],
  ["notaG2.mp3", T.incomodidad, "la barra vuelve"],
  ["click.mp3", T.defiendes - 0.05, "candado"],
  ["swishC.mp3", T.dejo, "pantalla dividida: vídeo"],
  ["click.mp3", T.comunicar - 0.25, "clic en play"],
  ["click.mp3", T.comenta, "«PRECIO»"],
];
console.log("SND_JSON_MMAW6550P " + JSON.stringify(sndList(CUES)));

export const ReelMMAW6550P: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shot = shotAt(t);
  const zoom = zoomAt(t);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Camera t={t} dir={DIR} shot={shot} zoom={zoom} />
      <BackWindow t={t} side="right" start={T.estilista + 0.05} end={T.pagado}>
        <Clip dir={DIR} file="pexels-27523010.mp4" start={T.estilista + 0.05} end={T.pagado} trim={0.3} />
        <RedTint t={t} />
      </BackWindow>
      <BackHook t={t} />
      <BackBread t={t} />
      <BackLock t={t} />
      <Cutouts t={t} dir={DIR} mattes={MATTES} zoom={zoom} />
      <SceneDos t={t} />
      <SceneTicket t={t} />
      <SceneTag t={t} />
      <ScenePlayer t={t} />
      <CtaWord t={t} at={T.comenta} word="PRECIO" pulseAt={T.precio} />
      {t < T.comenta ? <Subtitles t={t} blocks={BLOCKS} split={shot.kind === "split"} /> : null}
    </AbsoluteFill>
  );
};
