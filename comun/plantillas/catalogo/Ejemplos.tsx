/**
 * Ejemplos (20 nov 2026): un vídeo de YouTube y un reel montados SOLO con animaciones de sus páginas,
 * puestas con <Animacion> (código idéntico al de la página). Sirven de plantilla para futuros vídeos:
 * copiar este archivo, cambiar el vídeo y la lista TRAMOS (qué animación, cuándo, qué textos).
 */
import React from "react";
import { AbsoluteFill, Audio, Composition, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Animacion, AnimacionProps } from "./Animacion";
import { Subtitles, makeBlocks } from "../n1/common";
import { PillSub } from "../n2/kit3";
import capReel from "../data/DBNR1368-captions.json";

const FPS = 30;
/** Un tramo = una animación de la página, de `desde` a `hasta` (segundos del vídeo limpio). */
export type Tramo = Omit<AnimacionProps, "formato" | "video" | "videoDesde"> & {
  desde: number; hasta: number;
  /** solo para usar en un reel una animación de «detrás de ti»: formato "detras" + `recorte` (21 nov 2026) */
  formato?: "detras";
  /** sonidos: [archivo de public/sonidos, segundo DENTRO de la animación, volumen 0–1] */
  sonidos?: [string, number, number?][];
  /** reels: dónde va el subtítulo en este tramo ("abajo" ella entera, "union" pantalla partida, "no") */
  sub?: "abajo" | "union" | "no";
};

export const Tramos: React.FC<{ formato: "youtube" | "reels"; video: string; tramos: Tramo[] }> = ({ formato, video, tramos }) => (
  <>
    {tramos.map((tr, i) => {
      const { desde, hasta, sonidos = [], sub, formato: f, ...anim } = tr;
      return (
        <Sequence key={i} from={Math.round(desde * FPS)} durationInFrames={Math.round((hasta - desde) * FPS)}>
          <Animacion formato={f ?? formato} video={video} videoDesde={desde} {...anim} />
          {sonidos.map(([f, s, v = 0.3], j) => (
            <Sequence key={j} from={Math.round(s * FPS)}><Audio src={staticFile(`sonidos/${f}`)} volume={v} /></Sequence>
          ))}
        </Sequence>
      );
    })}
  </>
);

/* ===================== YOUTUBE: BBBA8ECF (keratina 120 / 200) ===================== */
// Solo hay brutos verticales: en YouTube se recorta en horizontal (en un bruto horizontal real no hace falta).
const YT_VIDEO = "BBBA8ECF/video.mp4";
const YT_CARA = "50% 42%"; // encuadre para que la cabeza salga entera
const YT: Tramo[] = [
  { desde: 0, hasta: 3.3, id: "antes-despues-numeros", velocidad: 0.85,
    cambios: [["BEFORE", "TÚ"], ["2.1%", "120 €"], ["AFTER", "OTRAS"],
      ['data-count="5.8" data-dec="1"', 'data-count="200"'], ["</span>%</div>", "</span>&nbsp;€</div>"]],
    sonidos: [["pop.mp3", 0.15], ["trazo.mp3", 0.95, 0.5], ["pop2.mp3", 1.65], ["count.wav", 1.8, 0.35]] },
  { desde: 6.4, hasta: 15.9, id: "mitad-tu-mitad-tarjeta", encuadre: YT_CARA,
    cambios: [
      ["kW50 .7s 1s", "kW50 .7s .4s"], ["kFd .4s 1.6s", "kFd .4s .8s"],
      ["<span>NOW</span>", "<span>SALÓN 1</span>"], ['<span style="margin-left:56px">NEXT</span>', '<span style="margin-left:36px">SALÓN 2</span>'],
      ["kUp .4s 1.7s both\">Onboarding", "kUp .4s .8s both\">Entras"],
      ["kUp .4s 1.9s both\">Marketing", "kUp .4s 3.5s both\">Te conocen"],
      ["kUp .4s 2.3s both\">One feature", "kUp .4s 1.9s both\">Servicio"],
      ["kUp .4s 2.7s both\">Retention</div>",
        "kUp .4s 2.6s both\">Pagas y te vas</div>" +
        '<div class="abs" style="left:236px;top:100px;width:62px;height:20px;border-radius:8px;background:#111;color:#fff;display:grid;place-items:center;font:700 7px Inter;box-shadow:0 5px 12px rgba(0,0,0,.25);animation:kUp .4s 6.0s both">Te explican</div>' +
        '<div class="abs" style="left:236px;top:126px;width:62px;height:20px;border-radius:8px;background:#111;color:#fff;display:grid;place-items:center;font:700 7px Inter;box-shadow:0 5px 12px rgba(0,0,0,.25);animation:kUp .4s 8.4s both">Sabes cuidarlo</div>'],
    ],
    sonidos: [["whoosh.mp3", 0.35, 0.25], ["pop.mp3", 0.8], ["pop.mp3", 1.9], ["pop.mp3", 2.6], ["pop2.mp3", 3.5], ["pop2.mp3", 6.0], ["pop2.mp3", 8.4]] },
  { desde: 15.9, hasta: 20.2, id: "tachado-y-cambia",
    cambios: [["it’s ", ""], ["kStrike .35s .8s", "kStrike .35s .5s"], ["kHide .01s 1.4s", "kHide .01s 1.0s"],
      ["kPop .35s 1.5s", "kPop .35s 1.05s"], [">hard<", ">servicio<"], [">easy<", ">percepción<"], ['class="hlp" style="position:absolute;left:0;top:0;', 'class="hlp" style="position:absolute;left:0;top:0;white-space:nowrap;']],
    sonidos: [["stamp.mp3", 0.5, 0.35], ["pop2.mp3", 1.05]] },
  { desde: 24.7, hasta: 26.6, id: "palabra-gigante", cambios: [["FASTER", "PRECIO"]],
    sonidos: [["swishA.mp3", 0.2, 0.35], ["trazo.mp3", 0.9, 0.5]] },
  { desde: 28.6, hasta: 31.0, id: "cita-tarjeta",
    cambios: [["It changed how we work.", "Lo que no se ve, no se paga."], ["— Laura, founder", ""]],
    sonidos: [["pop.mp3", 0.1], ["swishB.mp3", 0.7, 0.3]] },
  { desde: 33.0, hasta: 38.067, id: "tu-pequeno-circulo-esquina", encuadre: "50% 46%",
    cambios: [["+312%", "PRECIO"], ["signups in a week", "comenta la palabra"]],
    sonidos: [["whoosh.mp3", 0.9, 0.25], ["swishA.mp3", 1.4, 0.35]] },
];

const EjemploYouTube: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile(YT_VIDEO)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: YT_CARA }} />
    <Tramos formato="youtube" video={YT_VIDEO} tramos={YT} />
  </AbsoluteFill>
);

/* ===================== REEL: DBNR1368 (productos del salón) ===================== */
const RE_VIDEO = "DBNR1368/video.mp4";
const FLUJO_SVG_PAGINA = '<svg width="200" height="80" viewBox="0 0 200 80"><path pathLength="1" d="M54 40H82M76 34L82 40L76 46" stroke="#17171c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" style="animation:kDraw .5s 0.9s both"/><path pathLength="1" d="M118 40H146M140 34L146 40L140 46" stroke="#17171c" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" style="animation:kDraw .5s 1.6s both"/><rect x="8" y="16" width="48" height="48" rx="14" fill="#2f5bff" style="animation:kPop .4s 0.2s both;transform-origin:32px 40px"/><rect x="76" y="16" width="48" height="48" rx="14" fill="#ffb300" style="animation:kPop .4s 1.1s both;transform-origin:100px 40px"/><rect x="144" y="16" width="48" height="48" rx="14" fill="#18a957" style="animation:kPop .4s 1.8s both;transform-origin:168px 40px"/></svg>';
// Pasos en vertical: cada pieza lleva DENTRO la palabra del paso (corrección 20 nov 2026: un cuadro de color
// sin nada dentro «no tiene hilo» con lo que dice). Flechas finas (trazo 2) y con aire (corrección 20 nov 2026).
const PASO = (y: number, c: string, txt: string, tc: string, s: number) =>
  `<g style="animation:kPop .4s ${s}s both;transform-origin:100px ${y + 15}px">` +
  `<rect x="38" y="${y}" width="124" height="30" rx="10" fill="${c}"/>` +
  `<text x="100" y="${y + 20}" text-anchor="middle" style="font:800 13px Inter;fill:${tc}">${txt}</text></g>`;
const FLECHA_V = (y1: number, y2: number, s: number) => `<path pathLength="1" d="M100 ${y1}V${y2}M95.5 ${y2 - 5}L100 ${y2}L104.5 ${y2 - 5}" stroke="#17171c" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" style="animation:kDraw .5s ${s}s both"/>`;
const FLUJO_SVG = '<svg width="200" height="132" viewBox="0 0 200 132" style="margin-top:-14px">' +
  PASO(1, "#2f5bff", "Asesora", "#fff", 1.5) + PASO(51, "#ffb300", "Úsalo", "#17171c", 4.4) + PASO(101, "#18a957", "Ofrécelo", "#fff", 7.3) +
  FLECHA_V(37, 46, 4.0) + FLECHA_V(87, 96, 7.0) + "</svg>";
const BARRAS_CIFRA = '<span data-count="1.2" data-dec="1" data-pre="$ " data-suf=" M" data-delay=".6" data-dur="1200">0</span>';

const RE: Tramo[] = [
  // Nada vacío al empezar (corrección 20 nov 2026): el texto grande entra a los 0,15 s, con el zoom.
  { desde: 0, hasta: 2.2, id: "zoom-entrada", sub: "no",
    cambios: [['<div class="sc" style="animation:kWinP 3.4s 0.5s both;">ESTO TE INTERESA</div>',
      '<div class="sc" style="animation:kWinP 1.25s 0.15s both;">¿DÓNDE GANA MÁS?</div>' +
      '<div class="sc" style="animation:kWinP 1.0s 1.4s both;">EN LOS PRODUCTOS</div>']],
    sonidos: [["whoosh.mp3", 0, 0.2], ["pop.mp3", 0.15], ["pop.mp3", 1.4]] },
  { desde: 6.0, hasta: 8.6, id: "palabra-tachada", sub: "no",
    cambios: [[">caro<", ">no compran<"], ["kGrow .3s 1s", "kGrow .3s 1.2s"], ["--s:1.5s\">GRATIS", "--s:2.3s\">NO SE VENDEN"]],
    sonidos: [["stamp.mp3", 1.2, 0.35], ["pop2.mp3", 2.3]] },
  { desde: 12.0, hasta: 14.0, id: "sello-multiplicador", sub: "abajo",
    cambios: [['data-count="3"', 'data-count="2"']],
    sonidos: [["stamp.mp3", 0.8, 0.35], ["count.wav", 1.0, 0.3]] },
  // Pasos: mismas piezas de la página (cuadros que saltan + flechas que se dibujan), con los cuadros un poco
  // más pequeños y las flechas DELANTE para que nunca queden tapadas (corrección 20 nov 2026).
  { desde: 14.0, hasta: 23.4, id: "flujo-arriba", sub: "union",
    cambios: [[FLUJO_SVG_PAGINA, FLUJO_SVG]],
    sonidos: [["whoosh.mp3", 0, 0.2], ["pop.mp3", 1.5], ["trazo.mp3", 4.0, 0.5], ["pop.mp3", 4.4], ["trazo.mp3", 7.0, 0.5], ["pop.mp3", 7.3]] },
  // Pantalla completa (no otra pantalla partida): tarjeta oscura con barras que suben.
  { desde: 23.4, hasta: 26.6, id: "barras-crecen", sub: "no",
    cambios: [[BARRAS_CIFRA, "Extra al mes"], [">que funciona<", ">sin nuevos clientes<"], ["kWin 3s 1.4s", "kWin 3s 1.2s"]],
    sonidos: [["whoosh.mp3", 0, 0.2], ["rise.mp3", 0.7, 0.25]] },
  { desde: 26.6, hasta: 29.967, id: "maquina", sub: "no",
    cambios: [["Quiero ahorrar más", "VENTA"], ["font:600 13px Inter", "font:800 22px Inter"],
      ["kType 2.2s .8s steps(20)", "kType .6s .5s steps(5)"], ["ESCRÍBELO ASÍ", "COMENTA"], ["kWinP 3.4s 0.6s", "kWinP 3.2s 0.2s"]],
    sonidos: [["pop.mp3", 0.2], ["click.mp3", 0.5, 0.4], ["click.mp3", 0.8, 0.4]] },
];
type W = { text: string; start: number; end: number };
const BLOCKS = makeBlocks((capReel as { words: W[] }).words, 26.6, new Set(["doble"]));

const SubReel: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const tr = RE.find((x) => t >= x.desde && t < x.hasta);
  const modo = tr?.sub ?? "abajo";
  if (modo === "no") return null;
  if (tr?.id === "zoom-entrada" && t >= 1.4) return null; // ya sale «EN LOS PRODUCTOS» grande
  return modo === "union" ? <PillSub t={t} blocks={BLOCKS} y={845} /> : <Subtitles t={t} blocks={BLOCKS} split={false} y={1500} />;
};

const EjemploReel: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile(RE_VIDEO)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <Tramos formato="reels" video={RE_VIDEO} tramos={RE} />
    <SubReel />
  </AbsoluteFill>
);

export const ComposicionesEjemplo: React.FC = () => (
  <>
    <Composition id="EjemploYouTube" component={EjemploYouTube} durationInFrames={Math.round(38.067 * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="EjemploReel" component={EjemploReel} durationInFrames={Math.round(29.967 * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
