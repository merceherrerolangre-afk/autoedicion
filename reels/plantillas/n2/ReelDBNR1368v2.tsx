// Reel DBNR1368 · v2 (17 nov 2026): rehecho con el lenguaje de sus REFERENCIAS (pantalla partida recta, píldora gris, palabra grande metálica, objetos reales).
// Menos escenas y más largas: informe de ventas, tickets, estantería, móvil con vídeo real, ticket de cobro, calendario del mes.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../data/DBNR1368-captions.json";
import { C, CtaWord, Subtitles, clamp, easeInOut, lerp, makeBlocks, popIn, pulse, sndList } from "../n1/common";
import { txt } from "../n1/ui";
import { Bar, Bottle, CrossC, DarkMsg, Link, MonthApp, ORANGE, Pane, Phone, PillSub, Pos, Receipt, Shelf, SplitRef, TickC, Title, VideoFill, WinCard, Win, enter, splitP } from "./kit3";

const DIR = "DBNR1368";
export const DURATION_S_DBNR1368V2 = (captions as { duration: number }).duration;
type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (captions as { words: Word[] }).words;
const T = { comenta: 26.75, venta: 26.98 };

const SP1: Win = [0, 8.65], SP2: Win = [11.6, 26.55], SP3: Win = [20.9, 26.55];
const SPLITS = [SP1, SP2];
const HAIR_Y = 540;

const zoomAt = (t: number) => (t >= 10.55 && t < 11.6 ? interpolate(t, [10.55, 11.6], [1.2, 1.28], { ...clamp, easing: easeInOut }) : t >= T.comenta ? interpolate(t, [T.comenta, 30], [1.1, 1.06], clamp) : 1.18);
const HerFull: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ transform: `scale(${zoomAt(t)})`, transformOrigin: "590px 1700px" }}>
    <OffthreadVideo src={staticFile(`${DIR}/video.mp4`)} style={{ width: 1080, height: 1920 }} />
  </AbsoluteFill>
);
const BLOCKS = makeBlocks(WORDS, T.comenta, new Set(["dinero", "doble"]));

/** Cifra metálica de paso (1, 2, 3). */
const Num: React.FC<{ t: number; at: number; n: string; x: number; y: number }> = ({ t, at, n, x, y }) => {
  const p = popIn(t, at);
  return <div style={{ position: "absolute", left: x, top: y, opacity: p.o, transform: `scale(${p.s})`, ...txt(210, "transparent", 800), backgroundImage: "linear-gradient(180deg,#1E1E22 8%,#8E8E94 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", filter: "drop-shadow(0 12px 14px rgba(0,0,0,0.25))" }}>{n}</div>;
};

// ---------- A · informe de ventas: los productos pasan a ser lo que más dinero deja ----------
const SceneReport: React.FC<{ t: number; win: Win; from: number; double?: boolean }> = ({ t, win, from, double }) => {
  const serv = lerp(t, from + 0.35, from + 1.0, 0, 1, easeInOut) * 0.6;
  const prodBase = double ? 0.4 : 0.22;
  const up = double ? lerp(t, 13.0, 13.6, 0, 1, easeInOut) : lerp(t, 1.45, 2.1, 0, 1, easeInOut);
  const prod = lerp(t, from + 0.55, from + 1.1, 0, 1, easeInOut) * prodBase + up * (double ? 0.4 : 0.7);
  const badge = popIn(t, 13.45);
  return (
    <Pane t={t} win={win}>
      {!double ? <Title t={t} at={1.5} end={win[1] - 0.05} text="Productos" size={118} y={26} /> : null}
      <Pos x={90} y={double ? 120 : 200} style={enter(t, from + 0.1)}>
        <WinCard w={900} h={620} head="Ventas">
          <div style={{ padding: "52px 50px", display: "flex", flexDirection: "column", gap: 80 }}>
            {[{ l: "Servicios", f: serv, hot: false }, { l: "Productos", f: prod, hot: true }].map((r) => (
              <div key={r.l}>
                <div style={{ ...txt(54, r.hot ? "#B8561F" : "#55555C", 800), marginBottom: 20 }}>{r.l}</div>
                <Bar w="100%" h={78} fill={r.f} color={r.hot ? `linear-gradient(180deg,#FFB98C,${ORANGE})` : "linear-gradient(180deg,#B9B9BF,#9A9AA2)"} />
              </div>
            ))}
          </div>
          {double ? <div style={{ position: "absolute", right: 60, bottom: 40, width: 150, height: 150, borderRadius: "50%", display: "grid", placeItems: "center", background: "radial-gradient(circle at 35% 28%,#FFD9BC,#F8A46D 45%,#DC6E35)", boxShadow: "0 18px 30px rgba(233,138,85,0.6)", opacity: badge.o, transform: `scale(${badge.s})` }}><div style={{ ...txt(70, "#fff", 800), textShadow: "0 3px 0 rgba(150,65,20,0.4)" }}>×2</div></div> : null}
        </WinCard>
      </Pos>
    </Pane>
  );
};

// ---------- B · tickets de cobro: casi nadie lleva producto ----------
const SceneTickets: React.FC<{ t: number }> = ({ t }) => {
  const mk = (i: number, hot: boolean) => {
    const a = 2.55 + i * 0.22;
    const f = lerp(t, a + 0.25, a + 0.8, 0, 1, easeInOut);
    const dashed = !hot;
    const hotFill = hot ? lerp(t, 4.0, 4.5, 0, 1, easeInOut) : 0;
    return (
      <Pos key={i} x={40 + i * 345} y={170} style={enter(t, a)}>
        <Receipt w={310} rows={[{ label: "Corte", fill: f * 0.8 }, { label: "Color", fill: f * 0.6 }, hot ? { label: "Productos", fill: hotFill, hot: true, dashed: hotFill < 0.02 } : { label: "Productos", fill: 0, dashed: true }]} ok={hot ? lerp(t, 4.4, 4.7, 0, 1) : 0} bad={!hot ? lerp(t, 3.5 + i * 0.12, 3.8 + i * 0.12, 0, 1) : 0} />
      </Pos>
    );
  };
  return <Pane t={t} win={[2.4, 5.1]}>{[mk(0, false), mk(1, true), mk(2, false)]}</Pane>;
};

// ---------- C · estantería: los productos están ahí, pero nadie los ofrece ----------
const SceneShelf: React.FC<{ t: number }> = ({ t }) => (
  <Pane t={t} win={[5.1, 8.65]}>
    <Title t={t} at={7.7} end={8.6} text="Venderlos" size={118} y={26} />
    <Pos x={90} y={170} style={enter(t, 5.3)}><Shelf w={900} t={t} at={5.5} dim={lerp(t, 7.0, 7.9, 0, 0.85)} /></Pos>
  </Pane>
);

// ---------- D · paso 1: asesora durante el servicio (móvil con vídeo real + pregunta de la clienta) ----------
const SceneAdvise: React.FC<{ t: number }> = ({ t }) => {
  const l1 = lerp(t, 15.3, 15.9, 0, 1);
  const l2 = lerp(t, 16.55, 17.0, 0, 1);
  const ok = lerp(t, 17.2, 17.5, 0, 1);
  const chars = Math.round(lerp(t, 15.65, 16.45, 0, 24, (x) => x));
  const b = enter(t, 16.35);
  return (
    <Pane t={t} win={[14.1, 17.7]}>
      <Num t={t} at={14.3} n="1" x={640} y={10} />
      <Pos x={70} y={90} style={enter(t, 14.4)}><Phone w={400}><VideoFill src={`${DIR}/asesora.mp4`} from={1} /></Phone></Pos>
      <Link d="M470 330 C540 330 560 400 620 400" p={l1} />
      <Pos x={545} y={350} style={enter(t, 15.6)}><DarkMsg w={520} fs={30} text="¿Qué producto necesito?" chars={chars} tone={2} /></Pos>
      <Link d="M800 455 C800 500 800 520 800 560" p={l2} />
      <Pos x={690} y={570} style={{ ...b, width: 230, height: 300, borderRadius: 40, background: "linear-gradient(180deg,#FFFFFF,#F1F1F3)", boxShadow: "0 30px 50px -12px rgba(0,0,0,0.30)", display: "grid", placeItems: "center" }}>
        <Bottle h={240} c1="#F8C9A5" c2="#E49A67" cap="#3A2A22" shape="tall" />
        <div style={{ position: "absolute", right: -22, top: -22 }}><TickC s={80} p={ok} /></div>
      </Pos>
    </Pane>
  );
};

// ---------- E · paso 2: lo usa en el servicio y demuestra su importancia ----------
const SceneDemo: React.FC<{ t: number }> = ({ t }) => {
  const g = lerp(t, 19.95, 20.85, 0, 1, easeInOut);
  const ok = lerp(t, 20.6, 20.9, 0, 1);
  const lk = lerp(t, 18.9, 19.5, 0, 1);
  return (
    <Pane t={t} win={[17.75, 20.9]}>
      <Num t={t} at={17.95} n="2" x={110} y={10} />
      <Pos x={600} y={90} style={enter(t, 18.0)}><Phone w={400}><VideoFill src={`${DIR}/demuestra.mp4`} from={2} /></Phone></Pos>
      <Link d="M560 300 C500 300 440 360 400 400" p={lk} />
      <Pos x={110} y={300} style={{ ...enter(t, 18.75), width: 250, height: 330, borderRadius: 44, background: "linear-gradient(180deg,#FFFFFF,#F1F1F3)", boxShadow: "0 30px 50px -12px rgba(0,0,0,0.30)", display: "grid", placeItems: "center" }}><Bottle h={260} c1="#F8C9A5" c2="#E49A67" cap="#3A2A22" shape="tall" /></Pos>
      <Pos x={80} y={690} style={{ ...enter(t, 19.8), width: 460, height: 130, borderRadius: 34, background: "linear-gradient(180deg,#FFFFFF,#F4F4F6)", boxShadow: "0 24px 40px -10px rgba(0,0,0,0.28)", padding: "30px 36px", boxSizing: "border-box" }}>
        <Bar w="100%" h={44} fill={g} />
        <div style={{ position: "absolute", right: -20, top: -24 }}><TickC s={80} p={ok} /></div>
      </Pos>
    </Pane>
  );
};

// ---------- F · paso 3: se ofrece en el momento del pago (el ticket del principio, ahora con producto) ----------
const SceneCheckout: React.FC<{ t: number }> = ({ t }) => {
  const hotF = lerp(t, 22.45, 23.0, 0, 1, easeInOut);
  const mv = lerp(t, 21.95, 22.45, 0, 1, easeInOut);
  const bo = 1 - lerp(t, 22.4, 22.6, 0, 1);
  const base = lerp(t, 21.3, 21.9, 0, 1, easeInOut);
  return (
    <Pane t={t} win={[21.0, 23.5]}>
      <Num t={t} at={21.15} n="3" x={650} y={10} />
      <Pos x={70} y={130} style={enter(t, 21.1)}>
        <Receipt w={500} rows={[{ label: "Corte", fill: base * 0.8 }, { label: "Color", fill: base * 0.6 }, { label: "Productos", fill: hotF, hot: true, dashed: hotF < 0.02 }]} ok={lerp(t, 23.05, 23.35, 0, 1)} />
      </Pos>
      <Pos x={700 - mv * 380} y={330} style={{ ...enter(t, 21.45), opacity: bo * popIn(t, 21.45).o }}><Bottle h={320} c1="#F8C9A5" c2="#E49A67" cap="#3A2A22" shape="tall" /></Pos>
    </Pane>
  );
};

// ---------- G · el extra completa el mes: el calendario se llena ----------
const SceneMonth: React.FC<{ t: number }> = ({ t }) => {
  const cells = [2, 3, 4, 8, 9, 10, 11, 15, 16, 17, 18, 22, 23, 24, 25, 29, 30];
  const fills: [number, number][] = cells.map((c, i) => [c, 24.45 + i * 0.12]);
  const chip = popIn(t, 23.75);
  return (
    <Pane t={t} win={[23.5, 26.55]}>
      <Pos x={150} y={110} style={enter(t, 23.6)}><MonthApp t={t} w={780} fills={fills} /></Pos>
      <Pos x={690} y={72} style={{ opacity: chip.o, transform: `scale(${chip.s})` }}><div style={{ ...txt(44, "#fff", 800), padding: "10px 34px 14px", borderRadius: 40, background: `linear-gradient(180deg,#FFB98C,${ORANGE})`, boxShadow: "0 14px 26px rgba(233,138,85,0.55)" }}>Extra</div></Pos>
    </Pane>
  );
};

const CUES: [string, number, string][] = [
  ["whoosh.mp3", 0.2, "ella baja, entra el informe"], ["pop.mp3", 0.55, "ventana"], ["count.wav", 0.8, "servicios"], ["swishA.mp3", 1.5, "productos crece"], ["notaC4.mp3", 1.55, "palabra"],
  ["pop2.mp3", 2.55, "tickets"], ["count.wav", 2.85, "líneas"], ["stamp.mp3", 3.55, "✗"], ["stamp.mp3", 3.8, "✗"], ["tick.mp3", 4.45, "✓"],
  ["pop.mp3", 5.3, "estantería"], ["pop2.mp3", 5.7, "frascos"], ["notaE2.mp3", 7.7, "venderlos"],
  ["whoosh.mp3", SP2[0] + 0.05, "dividida: el doble"], ["count.wav", 13.0, "barra sube"], ["stamp.mp3", 13.45, "×2"],
  ["pop.mp3", 14.3, "1"], ["pop2.mp3", 14.45, "móvil"], ["trazo.mp3", 15.3, "línea"], ["click.mp3", 15.7, "escribe"], ["trazo.mp3", 16.55, "línea"], ["pop.mp3", 16.4, "producto"], ["tick.mp3", 17.25, "✓"],
  ["pop.mp3", 17.95, "2"], ["pop2.mp3", 18.05, "móvil"], ["trazo.mp3", 18.9, "línea"], ["pop.mp3", 18.8, "producto"], ["count.wav", 19.95, "importancia"], ["tick.mp3", 20.65, "✓"],
  ["whoosh.mp3", SP3[0] + 0.05, "dividida: cobro"], ["pop.mp3", 21.15, "3"], ["pop2.mp3", 21.2, "ticket"], ["pop.mp3", 21.5, "producto"], ["count.wav", 22.45, "se añade"], ["tick.mp3", 23.1, "✓"],
  ["pop2.mp3", 23.65, "calendario"], ["pop.mp3", 23.8, "extra"], ["tick.mp3", 24.5, "días"], ["tick.mp3", 25.3, "días"],
  ["click.mp3", T.venta, "«VENTA»"],
];
console.log("SND_JSON_DBNR1368V2 " + JSON.stringify(sndList(CUES)));

export const ReelDBNR1368v2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sw = SPLITS.find((w) => t >= w[0] && t < w[1]);
  const split = !!sw && splitP(t, sw) > 0.9;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {sw ? <SplitRef t={t} win={sw} dir={DIR} hairY={HAIR_Y} /> : <HerFull t={t} />}
      <SceneReport t={t} win={[0.3, 2.45]} from={0.3} />
      <SceneTickets t={t} />
      <SceneShelf t={t} />
      <Title t={t} at={9.3} end={10.6} text="Productos" size={150} y={70} light />
      <SceneReport t={t} win={[11.75, 14.05]} from={11.75} double />
      <SceneAdvise t={t} />
      <SceneDemo t={t} />
      <SceneCheckout t={t} />
      <SceneMonth t={t} />
      <CtaWord t={t} at={T.comenta} word="VENTA" pulseAt={T.venta} size={150} top={215} />
      {t < T.comenta ? (split ? <PillSub t={t} blocks={BLOCKS} /> : !sw ? <Subtitles t={t} blocks={BLOCKS} split={false} y={1500} /> : null) : null}
    </AbsoluteFill>
  );
};
