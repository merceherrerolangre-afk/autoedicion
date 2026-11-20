// Reel JHWI0526 · v2 (17 nov 2026): rehecho con el lenguaje de sus REFERENCIAS (pantalla partida recta, píldora gris, palabra grande metálica, objetos reales).
// Menos escenas y más largas: agenda vacía + mensajes, diagrama de información al equipo, lista de clientas, móvil con vídeo real, ficha que se rellena campo a campo.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../data/JHWI0526-captions.json";
import { C, CtaWord, Subtitles, clamp, easeInOut, lerp, makeBlocks, popIn, pulse, sndList } from "../n1/common";
import { txt } from "../n1/ui";
import { Avatar, Bar, CrossC, DarkMsg, Ficha, Link, ORANGE, Pane, Phone, PillSub, Pos, SplitRef, TickC, Title, VideoFill, WinCard, Win, enter, splitP } from "./kit3";

const DIR = "JHWI0526";
export const DURATION_S_JHWI0526V2 = (captions as { duration: number }).duration;
type Word = { text: string; start: number; end: number };
const WORDS: Word[] = (captions as { words: Word[] }).words;
const T = { comenta: 23.51, ficha: 23.81 };

const SPLITS: { w: Win; hair: number }[] = [{ w: [0, 3.55], hair: 640 }, { w: [5.3, 23.5], hair: 455 }];

const zoomAt = (t: number) => (t >= T.comenta ? interpolate(t, [T.comenta, 30], [1.04, 1.0], clamp) : 1.1);
const HerFull: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ transform: `scale(${zoomAt(t)})`, transformOrigin: "540px 1700px" }}>
    <OffthreadVideo src={staticFile(`${DIR}/video.mp4`)} style={{ width: 1080, height: 1920 }} />
  </AbsoluteFill>
);
const BLOCKS = makeBlocks(WORDS, T.comenta, new Set(["dependencia", "ficha", "tú"]));

// ---------- A · hook: agenda vacía y clientas que esperan a que vuelvas ----------
const SceneWait: React.FC<{ t: number }> = ({ t }) => {
  const c1 = Math.round(lerp(t, 1.45, 2.2, 0, 19, (x) => x));
  const c2 = Math.round(lerp(t, 2.1, 2.9, 0, 20, (x) => x));
  const k = lerp(t, 2.8, 3.3, 0, 1);
  return (
    <Pane t={t} win={[0.3, 3.55]}>
      <Pos x={60} y={60} style={enter(t, 1.3)}><DarkMsg w={560} h={120} fs={38} text="Espero a que vuelva" chars={c1} tone={0} /></Pos>
      <Pos x={460} y={210} style={enter(t, 1.95)}><DarkMsg w={580} h={120} fs={38} text="Agendo cuando vuelva" chars={c2} tone={3} /></Pos>
      <Pos x={90} y={370} style={enter(t, 0.45)}>
        <WinCard w={900} h={510} head="Agenda">
          <div style={{ padding: "26px 40px", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
            {["L", "M", "X", "J", "V"].map((d) => <div key={d} style={{ ...txt(32, "#9A9AA2", 800), textAlign: "center" }}>{d}</div>)}
            {Array.from({ length: 15 }, (_, i) => {
              const hot = i === 7;
              return <div key={i} style={{ height: 96, borderRadius: 20, background: hot && k > 0 ? "transparent" : "#F0F0F2", border: hot && k > 0 ? `5px dashed ${ORANGE}` : "none", boxShadow: hot ? "none" : "inset 0 2px 3px rgba(0,0,0,0.06)", transform: `scale(${hot ? 1 + 0.06 * pulse(t, 3.0) : 1})` }} />;
            })}
          </div>
        </WinCard>
      </Pos>
    </Pane>
  );
};

// ---------- B · diagrama: la información de la ficha pasa de ti al equipo (se repite al final con ✗ en «tú») ----------
const Cards = [{ x: 20, tone: 1 }, { x: 380, tone: 2 }, { x: 740, tone: 3 }];
const SceneInfo: React.FC<{ t: number; win: Win; a: number; team: number; end?: number; title: string; titleAt: number }> = ({ t, win, a, team, end = 0, title, titleAt }) => {
  const l0 = lerp(t, a + 0.35, a + 0.8, 0, 1);
  const lt = lerp(t, team + 0.35, team + 0.9, 0, 1);
  const xp = end ? lerp(t, end, end + 0.3, 0, 1) : 0;
  const you = 1 - 0.65 * xp;
  const glow = lerp(t, team + 0.7, team + 1.0, 0, 1);
  return (
    <Pane t={t} win={win}>
      <Title t={t} at={titleAt} end={win[1] - 0.05} text={title} size={124} y={10} />
      <Pos x={270} y={150} style={enter(t, a)}>
        <Ficha t={t} w={540} fields={[{ label: "Datos", at: a + 0.3, fill: 0.8 }, { label: "Fórmula", at: a + 0.5, fill: 0.6 }]} />
      </Pos>
      <Link d="M540 430 L540 600" p={l0} />
      <Link d="M440 430 C300 480 200 540 180 600" p={lt} color={ORANGE} />
      <Link d="M640 430 C780 480 880 540 900 600" p={lt} color={ORANGE} />
      <Pos x={Cards[1].x} y={600} style={{ ...enter(t, a + 0.2), opacity: popIn(t, a + 0.2).o * you }}><DarkMsg w={320} h={120} tone={2} glow={glow > 0.5 && !end} /></Pos>
      {[0, 2].map((i) => <Pos key={i} x={Cards[i].x} y={600} style={enter(t, team + i * 0.12)}><DarkMsg w={320} h={120} tone={Cards[i].tone} glow={glow > 0.5} /></Pos>)}
      {end ? <Pos x={Cards[1].x + 270} y={575} style={{ opacity: xp }}><CrossC s={84} p={xp} /></Pos> : null}
      {end ? <>{[0, 2].map((i) => <Pos key={i} x={Cards[i].x + 270} y={575}><TickC s={72} p={lerp(t, team + 0.9, team + 1.2, 0, 1)} /></Pos>)}</> : null}
    </Pane>
  );
};

// ---------- C · clientas recurrentes: lista de clientas con las primeras resaltadas ----------
const SceneList: React.FC<{ t: number }> = ({ t }) => {
  const hl = lerp(t, 9.55, 10.0, 0, 1);
  return (
    <Pane t={t} win={[8.7, 10.55]}>
      <Title t={t} at={9.45} end={10.5} text="Recurrentes" size={104} y={16} />
      <Pos x={130} y={160} style={enter(t, 8.85)}>
        <WinCard w={820} h={640} head="Clientas">
          <div style={{ padding: "26px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const e = popIn(t, 9.0 + i * 0.1);
              const on = i < 3 ? hl : 0;
              return (
                <div key={i} style={{ height: 92, borderRadius: 24, display: "flex", alignItems: "center", gap: 24, padding: "0 26px", opacity: e.o, background: on > 0.3 ? "linear-gradient(180deg,#FFF1E6,#FFE3CF)" : "#F6F6F8", boxShadow: on > 0.3 ? `0 0 0 4px ${ORANGE}, 0 14px 24px rgba(233,138,85,0.35)` : "inset 0 2px 3px rgba(0,0,0,0.05)" }}>
                  <Avatar s={62} tone={i} />
                  <div style={{ flex: 1 }}><div style={{ height: 14, width: `${[70, 55, 64, 48, 60][i]}%`, borderRadius: 7, background: on > 0.3 ? "#C7855A" : "#C9C9CF" }} /><div style={{ height: 10, width: "36%", borderRadius: 5, background: on > 0.3 ? "#E3B596" : "#DDDDE1", marginTop: 12 }} /></div>
                  {on > 0.3 ? <TickC s={46} p={on} /> : null}
                </div>
              );
            })}
          </div>
        </WinCard>
      </Pos>
    </Pane>
  );
};

// ---------- D · después de cada cita registra: móvil con vídeo real (mano escribiendo) → ficha vacía ----------
const SceneRegister: React.FC<{ t: number }> = ({ t }) => {
  const lk = lerp(t, 11.5, 12.0, 0, 1);
  return (
    <Pane t={t} win={[10.6, 12.95]}>
      <Pos x={30} y={90} style={enter(t, 10.7)}><Phone w={390}><VideoFill src={`${DIR}/agenda.mp4`} from={1} /></Phone></Pos>
      <Link d="M420 480 L500 480" p={lk} />
      <Pos x={520} y={170} style={enter(t, 11.6)}><Ficha t={t} w={540} fields={[{ label: "Servicio", at: 99 }, { label: "Producto", at: 99 }, { label: "Preferencias", at: 99 }, { label: "Siguiente cita", at: 99 }]} /></Pos>
    </Pane>
  );
};

// ---------- E · la ficha se rellena campo a campo, como los va diciendo ----------
const SceneFicha: React.FC<{ t: number }> = ({ t }) => (
  <Pane t={t} win={[12.95, 18.3]}>
    <Title t={t} at={13.05} end={18.25} text="Ficha" size={118} y={16} />
    <Pos x={110} y={170} style={enter(t, 13.0)}>
      <Ficha t={t} w={860} check={lerp(t, 18.0, 18.28, 0, 1)} fields={[{ label: "Servicio", at: 13.1, fill: 0.7 }, { label: "Producto", at: 14.15, fill: 0.55 }, { label: "Preferencias", at: 15.75, fill: 0.8 }, { label: "Siguiente cita", at: 16.9, fill: 0.45 }]} />
    </Pos>
  </Pane>
);

// ---------- F · antes de que otra peluquera atienda a la clienta, revisa la ficha ----------
const SceneReview: React.FC<{ t: number }> = ({ t }) => {
  const l1 = lerp(t, 19.5, 19.95, 0, 1);
  const l2 = lerp(t, 20.35, 20.75, 0, 1);
  const ok = lerp(t, 20.8, 21.1, 0, 1);
  return (
    <Pane t={t} win={[18.3, 21.7]}>
      <Pos x={30} y={130} style={{ opacity: 1 }}>
        <Ficha t={t} w={520} check={ok} fields={[{ label: "Servicio", at: 0, fill: 0.7 }, { label: "Producto", at: 0, fill: 0.55 }, { label: "Preferencias", at: 0, fill: 0.8 }, { label: "Siguiente cita", at: 0, fill: 0.45 }]} />
      </Pos>
      <Pos x={600} y={150} style={enter(t, 18.95)}><DarkMsg w={440} h={120} tone={1} /></Pos>
      <Link d="M820 270 L820 470" p={l1} />
      <Pos x={600} y={480} style={enter(t, 19.7)}><DarkMsg w={440} h={120} tone={2} /></Pos>
      <Link d="M550 260 C580 260 570 210 600 210" p={l2} color={ORANGE} />
    </Pane>
  );
};

const CUES: [string, number, string][] = [
  ["whoosh.mp3", 0.2, "ella baja, entra la agenda"], ["pop.mp3", 0.5, "agenda"], ["pop2.mp3", 1.35, "mensaje"], ["click.mp3", 1.6, "escribe"], ["pop.mp3", 2.0, "mensaje"], ["click.mp3", 2.2, "escribe"], ["notaE2.mp3", 2.9, "hueco"],
  ["notaC4.mp3", 4.3, "«Dependencia»"],
  ["whoosh.mp3", 5.35, "dividida"], ["pop.mp3", 5.6, "ficha"], ["trazo.mp3", 6.0, "línea"], ["pop2.mp3", 6.2, "tú"], ["pop.mp3", 7.0, "equipo"], ["pop.mp3", 7.12, "equipo"], ["trazo.mp3", 7.4, "líneas"], ["tick.mp3", 7.9, "listo"],
  ["pop2.mp3", 8.85, "lista"], ["pop.mp3", 9.1, "clientas"], ["tick.mp3", 9.7, "recurrentes"], ["tick.mp3", 9.85, "recurrentes"],
  ["pop.mp3", 10.7, "móvil"], ["trazo.mp3", 11.5, "línea"], ["pop2.mp3", 11.6, "ficha"],
  ["pop.mp3", 13.0, "ficha"], ["count.wav", 13.1, "servicio"], ["count.wav", 14.15, "producto"], ["count.wav", 15.75, "preferencias"], ["count.wav", 16.9, "siguiente cita"], ["notaC4.mp3", 18.05, "✓"],
  ["pop.mp3", 18.95, "peluquera"], ["trazo.mp3", 19.5, "línea"], ["pop2.mp3", 19.7, "clienta"], ["pop.mp3", 20.2, "ficha"], ["trazo.mp3", 20.35, "línea"], ["tick.mp3", 20.85, "✓"],
  ["whoosh.mp3", 21.7, "el salón"], ["pop.mp3", 21.9, "ficha"], ["tick.mp3", 22.5, "equipo"], ["stamp.mp3", 22.75, "tú ✗"],
  ["click.mp3", T.ficha, "«FICHA»"],
];
console.log("SND_JSON_JHWI0526V2 " + JSON.stringify(sndList(CUES)));

export const ReelJHWI0526v2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sp = SPLITS.find((s) => t >= s.w[0] && t < s.w[1]);
  const split = !!sp && splitP(t, sp.w) > 0.9;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {sp ? <SplitRef t={t} win={sp.w} dir={DIR} hairY={sp.hair} /> : <HerFull t={t} />}
      <SceneWait t={t} />
      <Title t={t} at={4.2} end={5.25} text="Dependencia" size={140} y={70} />
      <SceneInfo t={t} win={[5.35, 8.7]} a={5.45} team={6.9} title="Información" titleAt={5.5} />
      <SceneList t={t} />
      <SceneRegister t={t} />
      <SceneFicha t={t} />
      <SceneReview t={t} />
      <SceneInfo t={t} win={[21.7, 23.5]} a={21.75} team={21.85} end={22.7} title="Salón" titleAt={21.8} />
      <CtaWord t={t} at={T.comenta} word="FICHA" pulseAt={T.ficha} size={130} top={70} />
      {t < T.comenta ? (split ? <PillSub t={t} blocks={BLOCKS} /> : !sp ? <Subtitles t={t} blocks={BLOCKS} split={false} y={1500} /> : null) : null}
    </AbsoluteFill>
  );
};
