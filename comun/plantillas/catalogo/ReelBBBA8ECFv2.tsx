/**
 * Reel BBBA8ECF v2 (20 nov 2026): keratina 120 / 200, «no cobras por lo que haces, cobras por cómo se percibe».
 * Hecho con las animaciones de SUS PÁGINAS de reels (<Animacion>, código idéntico), siguiendo la plantilla aprobada
 * EjemploReel: algo desde el segundo 0, cada pieza con su palabra dentro, sin pantallas partidas de más.
 */
import React from "react";
import { AbsoluteFill, Composition, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { Tramo, Tramos } from "./Ejemplos";
import { Subtitles, makeBlocks } from "../n1/common";
import cap from "../data/BBBA8ECF-captions.json";

const FPS = 30;
const DUR = 38.067;
const VIDEO = "BBBA8ECF/video.mp4";

// Etiqueta de texto en lugar de la raya gris de la página (tabla-si-no).
const fila = (txt: string, s: number) => `<span style="font:700 14px Inter;color:#17171c;white-space:nowrap;animation:kFd .3s ${s}s both">${txt}</span>`;
const raya = (s: string) => `<i style="height:9px;border-radius:5px;background:#e7e7ee;transform-origin:left;animation:kGrow .4s ${s}s both"></i>`;
const cabecera = (bg: string) => `<i style="width:24px;height:24px;border-radius:50%;background:${bg};justify-self:center"></i>`;
const cabeceraN = (bg: string, n: string) => `<i style="width:24px;height:24px;border-radius:50%;background:${bg};justify-self:center;display:grid;place-items:center;font:800 12px Inter;font-style:normal;color:#fff">${n}</i>`;
// Cuadro de la cuadrícula con su precio dentro (nada de cuadros vacíos).
const precio = (bg: string, txt: string) => [`background:${bg};`, `background:${bg};display:grid;place-items:center;font:800 17px Inter;color:#17171c;`, txt] as const;

const TRAMOS: Tramo[] = [
  // 0–3,3 «Si cobras una keratina a 120 y otras lo están cobrando a 200»: dos cifras desde el segundo 0.
  { desde: 0, hasta: 3.3, id: "numeros-flechas", sub: "no",
    cambios: [
      ['data-count="120" data-delay="0.5"', 'data-count="120" data-from="60" data-suf="\u00a0€" data-delay="0.3"'],
      ["--s:0.5s\"><div class=\"hv\" style=\"font-size:26px;color:#17171c\"><span data-count=\"480\" data-delay=\"1\"",
        "--s:1.6s\"><div class=\"hv\" style=\"font-size:26px;color:#17171c\"><span data-count=\"200\" data-from=\"120\" data-suf=\"\u00a0€\" data-delay=\"1.8\""],
      ["--s:1.4s\">↓", "--s:1.5s\">↓"], ["--s:1.9s\">↑", "--s:2.7s\">↑"],
      ['font-size:26px', 'font-size:23px'], [">antes<", ">tú<"], [">ahora<", ">otras<"], ["kWin 3s 0.6s both", "kWin 2.7s 0.6s both"],
    ],
    sonidos: [["pop.mp3", 0.05], ["count.wav", 0.6, 0.3], ["pop2.mp3", 1.6], ["count.wav", 1.8, 0.3], ["tick.mp3", 2.7, 0.3]] },
  // 9,8–15,9 Salón 2 frente a Salón 1: tabla con lo que cambia.
  { desde: 9.8, hasta: 15.9, id: "tabla-si-no", sub: "no",
    cambios: [
      [cabecera("#ff8fae"), cabeceraN("#ff8fae", "1")], [cabecera("#58d68d"), cabeceraN("#58d68d", "2")],
      [raya("0.5"), fila("Te conocen", 0.9)], [raya("1.2"), fila("Te sientas", 1.9)], [raya("1.9"), fila("Te explican", 2.6)],
      ["--s:0.7s\">✕", "--s:1.1s\">✕"], ["--s:0.9s\">✓", "--s:1.3s\">✓"],
      ["--s:1.4s\">✓", "--s:2.1s\">✓"], ["--s:1.6s\">✓", "--s:2.3s\">✓"],
      ["--s:2.0999999999999996s\">✕", "--s:2.8s\">✕"], ["--s:2.3s\">✓", "--s:3.0s\">✓"],
    ],
    sonidos: [["whoosh.mp3", 0, 0.2], ["stamp.mp3", 1.1, 0.3], ["tick.mp3", 1.3, 0.35], ["tick.mp3", 2.1, 0.3], ["tick.mp3", 2.3, 0.35], ["stamp.mp3", 2.8, 0.3], ["tick.mp3", 3.0, 0.35]] },
  // 17,7–20,2 «No cobras por lo que haces, cobras por cómo se percibe».
  { desde: 17.7, hasta: 20.2, id: "error-correccion", sub: "no",
    cambios: [
      [">dijiste<", ">no cobras por<"],
      ["pero <span style=\"background:#e0245e;border-radius:4px;padding:0 3px;animation:kAp .3s 1s both\">se interrumpe</span> la voz",
        "<span style=\"background:#e0245e;border-radius:4px;padding:0 3px;animation:kAp .3s .8s both\">lo que haces</span>"],
      ["--s:1.2s;color:#ff6a8a", "--s:1.0s;color:#ff6a8a"],
      [">se oye<", ">cobras por<"], ["--s:1.9s", "--s:1.6s"], [">se sigue entendiendo<", ">cómo se percibe<"], ["--s:2.2s;color:#6cf09a", "--s:2.0s;color:#6cf09a"],
    ],
    sonidos: [["pop.mp3", 0.05], ["stamp.mp3", 1.0, 0.3], ["pop2.mp3", 1.6], ["tick.mp3", 2.0, 0.35]] },
  // 22,4–25,6 «cuando todo parece lo mismo, la única forma de decidir es el precio».
  { desde: 22.4, hasta: 25.6, id: "cuadricula-elige", sub: "no",
    cambios: [
      [`${precio("#ffd0dc", "")[0]}--s:0.2s;animation-name:kPop,kDimO;animation-duration:.5s,.4s;animation-delay:0.2s,2s;"></div>`,
        `${precio("#ffd0dc", "")[1]}--s:0.2s;animation-name:kPop,kDimO;animation-duration:.5s,.4s;animation-delay:0.2s,2.75s;">200 €</div>`],
      [`${precio("#d6ecff", "")[0]}--s:0.4s;animation-name:kPop,kDimO;animation-duration:.5s,.4s;animation-delay:0.4s,2s;"></div>`,
        `${precio("#d6ecff", "")[1]}--s:0.4s;animation-name:kPop,kDimO;animation-duration:.5s,.4s;animation-delay:0.4s,2.75s;">200 €</div>`],
      [`${precio("#fff3b0", "")[0]}--s:0.6000000000000001s;animation-name:kPop,kDimO;animation-duration:.5s,.4s;animation-delay:0.6000000000000001s,2s;"></div>`,
        `${precio("#fff3b0", "")[1]}--s:0.6s;animation-name:kPop,kDimO;animation-duration:.5s,.4s;animation-delay:0.6s,2.75s;">200 €</div>`],
      [`${precio("#d9f7e3", "")[0]}--s:0.8s;animation-name:kPop,kPick;animation-duration:.5s,.4s;animation-delay:0.8s,2s;`,
        `${precio("#d9f7e3", "")[1]}--s:0.8s;animation-name:kPop,kPick;animation-duration:.5s,.4s;animation-delay:0.8s,2.75s;`],
      ["--s:2.2s\"><div style=\"width:26px", "--s:2.95s\"><div style=\"width:26px"],
      ["✓</div></div></div>", "✓</div></div>120 €</div>"],
    ],
    sonidos: [["pop.mp3", 0.2], ["pop2.mp3", 0.4], ["pop.mp3", 0.6], ["pop2.mp3", 0.8], ["tick.mp3", 2.95, 0.35]] },
  // 29,9–33,3 «No se trata de hacer más, se trata de dejar de parecer una opción más».
  { desde: 29.9, hasta: 33.3, id: "palabra-tachada", sub: "no",
    cambios: [[">caro<", ">hacer más<"], ['style="left:0;right:0;bottom:19%;text-align:center"', 'style="left:0;right:0;bottom:5%;text-align:center"'],
      ['class="hv a up" style="font-size:24px;', 'class="hv a up" style="font-size:21px;white-space:nowrap;'], ["kGrow .3s 1s", "kGrow .3s .85s"], ["--s:1.5s\">GRATIS", "--s:2.4s\">NO SER UNA MÁS"]],
    sonidos: [["stamp.mp3", 0.85, 0.3], ["pop2.mp3", 2.4]] },
  // 33,3–fin «Comenta la palabra precio»: la palabra se escribe (sin subtítulos, regla 15).
  { desde: 33.3, hasta: DUR, id: "maquina", sub: "no",
    cambios: [["Quiero ahorrar más", "PRECIO"], ["font:600 13px Inter", "font:800 22px Inter"],
      ["kType 2.2s .8s steps(20)", "kType .6s .65s steps(6)"], ["ESCRÍBELO ASÍ", "COMENTA"], ["kWinP 3.4s 0.6s", "kWinP 4.6s 0.15s"]],
    sonidos: [["whoosh.mp3", 0, 0.2], ["click.mp3", 0.65, 0.4], ["click.mp3", 0.95, 0.4]] },
];

type W = { text: string; start: number; end: number };
const BLOCKS = makeBlocks((cap as { words: W[] }).words, 33.3, new Set(["percepción", "precio"]));

// Planos de ella: corte con encuadre alterno (normal / un poco más cerca) en cada frase, cabeza siempre entera.
const CORTES = [0, 3.3, 5.3, 6.4, 9.8, 15.9, 17.7, 20.2, 22.4, 25.6, 28.6, 29.9];
const Ella: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const i = CORTES.filter((c) => c <= t).length;
  const s = i % 2 === 0 ? 1.08 : 1;
  return <OffthreadVideo src={staticFile(VIDEO)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 90%" }} />;
};

const Sub: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const tr = TRAMOS.find((x) => t >= x.desde && t < x.hasta);
  if (tr) return null;
  return <Subtitles t={t} blocks={BLOCKS} split={false} y={1500} />;
};

const ReelBBBA8ECFv2: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Ella />
    <Tramos formato="reels" video={VIDEO} tramos={TRAMOS} />
    <Sub />
  </AbsoluteFill>
);

export const ComposicionBBBA8ECFv2: React.FC = () => (
  <Composition id="ReelBBBA8ECFv2" component={ReelBBBA8ECFv2} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={1080} height={1920} />
);
