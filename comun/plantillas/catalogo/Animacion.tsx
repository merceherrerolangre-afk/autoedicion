/**
 * <Animacion>: pone en el vídeo una animación del catálogo EXACTAMENTE como se ve en sus páginas
 * (comun/catalogo/banco-*.html para YouTube y reels/antiguo/catalogo/banco-*.html para reels).
 *
 * No se rehace a mano: usa el mismo HTML y CSS de la página (sacados a youtube.json / reels.json
 * con extraer-catalogo.mjs) y lo agranda (YouTube 320×180 → 1920×1080 = ×6; reels 216×384 → 1080×1920 = ×5).
 * El tiempo de cada animación CSS se fija fotograma a fotograma, así que el render sale igual que la página.
 *
 * Lo único que cambia respecto a la página:
 *  - la persona dibujada se sustituye por SU vídeo (prop `video`), sincronizado con su voz;
 *  - los textos de ejemplo (en inglés) se cambian por sus palabras con `cambios`;
 *  - en YouTube el menta se pasa a naranja claro (regla 12 de YouTube).
 *
 * formato "detras" (página reels/catalogo-detras/banco-detras.html, 21 nov 2026): cosas que salen DETRÁS de ella.
 *  - el fondo dibujado (.fondo) se cambia por SU vídeo entero (prop `video`);
 *  - la persona dibujada (.persona) se cambia por SU RECORTE con transparencia (prop `recorte`, WebM hecho con
 *    comun/scripts/recorte-detras.sh del MISMO tramo), así todo queda entre su fondo y ella: nunca encima.
 */
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AbsoluteFill, OffthreadVideo, continueRender, delayRender, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as archivo } from "@remotion/google-fonts/Archivo";
import { loadFont as archivoBlack } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as playfair } from "@remotion/google-fonts/PlayfairDisplay";
import youtube from "./youtube.json";
import reels from "./reels.json";
import detras from "./detras.json";

archivo("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
archivoBlack("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
inter("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
playfair("italic", { weights: ["800"], subsets: ["latin", "latin-ext"] });

type Escena = { id: string; name: string; bg?: string; html: string; t: number; pagina: string };
type Catalogo = { css: Record<string, string>; escenas: Escena[] };
type Formato = "youtube" | "reels" | "detras";
const CAT: Record<Formato, Catalogo> = { youtube: youtube as Catalogo, reels: reels as Catalogo, detras: detras as Catalogo };
const ESCENARIO = { youtube: { w: 320, h: 180 }, reels: { w: 216, h: 384 }, detras: { w: 216, h: 384 } };

// YouTube: menta/turquesa de las referencias → naranja claro (regla 12 de YouTube).
const MENTA_A_NARANJA: [string, string][] = [
  ["#66e6d2", "#F4A57A"], ["#9cf1e3", "#FFC08A"], ["#12c2a5", "#E8893F"], ["#12a58a", "#D9762C"],
  ["#b3f3ea", "#FFD9B8"], ["#a9efe3", "#FFD3AE"], ["#d4fbf6", "#FFEBDD"], ["#0b3d36", "#5A2A10"],
  ["#3ed8c3", "#F4A57A"], ["#1db8a4", "#E8893F"], ["#d9f7f2", "#FDEBDD"], ["#e0f8f3", "#FDEFE4"],
  ["#e6faf6", "#FDF0E6"], ["#f7fcfb", "#FFFAF6"], ["#4fe3cc", "#F4A57A"], ["#0b1f1c", "#2A1405"],
  ["rgba(102,230,210", "rgba(244,165,122"],
];

const cambiarTodo = (s: string, pares: [string, string][]) =>
  pares.reduce((acc, [a, b]) => acc.split(a).join(b), s);

// La persona dibujada de la página → hueco donde va su vídeo.
const ponerHuecos = (html: string, formato: Formato) =>
  formato === "detras"
    ? html.replace(/<div class="fondo"><\/div>/g, '<div class="fondo tu"></div>')
        .replace(/<div class="persona">(<i class="p[lbnh]"><\/i>)+<\/div>/g, '<div class="persona recorte"></div>')
        .replace(/<div class="vd" /g, '<div class="vd clip" ')
    : formato === "youtube"
    ? html.replace(/<div class="ly forest" style="[^"]*"><div class="pp"[^>]*><i class="h"><\/i><i class="b"><\/i><\/div><\/div>/g,
        '<div class="ly tu"></div>')
    : html.replace(/<div class="sub([^"]*)" style="([^"]*)"><i class="hd"><\/i><i class="bd"><\/i><\/div>/g,
        '<div class="sub$1 tu" style="$2"></div>');

export type AnimacionProps = {
  formato: Formato;
  /** id de la animación en la página (el que sale en el catálogo, p. ej. "antes-despues-numeros") */
  id: string;
  /** textos de la página → sus palabras: [["BEFORE","ANTES"], ["2.1%","120 €"]] */
  cambios?: [string, string][];
  /** su vídeo (ruta dentro de public/) para poner donde la página tiene a la persona dibujada */
  video?: string;
  /** segundo de su vídeo en el que empieza esta animación (para que vaya con su voz) */
  videoDesde?: number;
  /** solo formato "detras": su recorte con transparencia (WebM en public/) del MISMO tramo que `video` */
  recorte?: string;
  /** solo formato "detras": clips (Pexels o suyos, en public/) para los recuadros de vídeo, en orden; se repiten si faltan */
  clips?: string[];
  /** encuadre de su vídeo dentro del hueco (CSS object-position), p. ej. "50% 25%" */
  encuadre?: string;
  /** 1 = como en la página; 0.8 = un poco más lenta */
  velocidad?: number;
  /** fondo distinto al de la página (normalmente no hace falta) */
  fondo?: string;
};

export const Animacion: React.FC<AnimacionProps> = ({
  formato, id, cambios = [], video, recorte, clips = [], videoDesde = 0, encuadre = "50% 30%", velocidad = 1, fondo,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const host = useRef<HTMLDivElement>(null);
  const raiz = useRef<ShadowRoot | null>(null);
  const [huecos, setHuecos] = useState<HTMLElement[]>([]);
  const [recortes, setRecortes] = useState<HTMLElement[]>([]);
  const [huecosClip, setHuecosClip] = useState<HTMLElement[]>([]);
  const [espera] = useState(() => delayRender(`animación ${id}`));

  const escena = useMemo(() => {
    const e = CAT[formato].escenas.find((x) => x.id === id);
    if (!e) throw new Error(`No existe la animación "${id}" en las páginas de ${formato}`);
    return e;
  }, [formato, id]);

  const { w, h } = ESCENARIO[formato];
  const zoom = width / w;

  // Montar una vez: CSS de su página + HTML de la animación, dentro de una caja aislada (shadow DOM).
  useLayoutEffect(() => {
    if (!host.current) return;
    const r = raiz.current ?? host.current.attachShadow({ mode: "open" });
    raiz.current = r;
    let css = CAT[formato].css[escena.pagina] ?? "";
    let html = ponerHuecos(escena.html, formato);
    let bg = fondo ?? escena.bg ?? "#000";
    if (formato === "youtube") {
      css = cambiarTodo(css, MENTA_A_NARANJA);
      html = cambiarTodo(html, MENTA_A_NARANJA);
      bg = cambiarTodo(bg, MENTA_A_NARANJA);
    }
    // Avisar si algún cambio no encuentra su texto en la página (así no se queda sin aplicar sin darnos cuenta).
    cambios.forEach(([de]) => { if (!html.includes(de)) console.warn(`CAMBIO NO APLICADO en ${id}: ${de.slice(0, 80)}`); });
    html = cambiarTodo(html, cambios);
    r.innerHTML =
      `<style>${css}
       .stage{position:absolute!important;left:0;top:0;margin:0!important;border-radius:0!important;box-shadow:none!important;max-width:none!important;cursor:default!important}
       .tu{background:#000}
       .tu > *,.recorte > *{position:absolute!important;inset:0;width:100%!important;height:100%!important;object-fit:cover}
       .tu::before,.tu::after{display:none!important}
       .clip.lleno::before,.clip.lleno::after{display:none!important}
       .clip > video,.clip > img{position:absolute!important;inset:0;width:100%!important;height:100%!important;object-fit:cover;border-radius:inherit}
       </style>` +
      `<div class="stage" style="width:${w}px;height:${h}px;zoom:${zoom};background:${bg}">${html}</div>`;
    setHuecos(Array.from(r.querySelectorAll<HTMLElement>(".tu")));
    setRecortes(Array.from(r.querySelectorAll<HTMLElement>(".recorte")));
    setHuecosClip(Array.from(r.querySelectorAll<HTMLElement>(".clip")));
    if (formato === "detras" && !recorte) console.warn(`FALTA EL RECORTE en ${id}: sin él las piezas taparían a la persona`);
    document.fonts.ready.then(() => continueRender(espera));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escena]);

  // En cada fotograma: poner todas las animaciones CSS en su instante exacto.
  useLayoutEffect(() => {
    const r = raiz.current;
    if (!r) return;
    const t = (frame / fps) * velocidad;
    r.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * 1000; });
    // Cifras que cuentan (data-count), igual que hace la página.
    r.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const d = el.dataset;
      const to = parseFloat(d.count ?? "0"), from = parseFloat(d.from ?? "0"), dec = +(d.dec ?? 0);
      const dl = +(d.delay ?? 0), du = (+(d.dur ?? 1200)) / 1000;
      const p = Math.max(0, Math.min(1, (t - dl) / du)), e = 1 - Math.pow(1 - p, 3);
      const v = from + (to - from) * e;
      // En español: coma para decimales y punto para miles.
      const n = d.c === "1"
        ? Number(v.toFixed(dec)).toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: true })
        : (dec ? v.toFixed(dec) : String(Math.round(v))).replace(".", ",");
      el.textContent = (d.pre ?? "") + n + (d.suf ?? "");
    });
    // Letras que se ordenan (data-scr), sin azar para que cada render salga igual.
    r.querySelectorAll<HTMLElement>("[data-scr]").forEach((el) => {
      const fin = el.dataset.scr ?? "", dl = +(el.dataset.delay ?? 0), du = (+(el.dataset.dur ?? 1000)) / 1000;
      const p = Math.max(0, Math.min(1, (t - dl) / du)), ch = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ#%&@";
      el.textContent = p <= 0 ? " " : fin.split("").map((c, i) =>
        c === " " ? " " : i / fin.length < p - 0.1 ? c : ch[(i * 7 + frame * 3) % ch.length]).join("");
    });
  }, [frame, fps, velocidad, huecos, recortes, formato]);

  return (
    <AbsoluteFill>
      <div ref={host} style={{ position: "absolute", inset: 0, overflow: "hidden" }} />
      {video && huecos.map((el, i) => createPortal(
        <OffthreadVideo key={i} src={staticFile(video)} muted trimBefore={Math.round(videoDesde * fps)}
          style={{ objectFit: "cover", objectPosition: encuadre }} />, el))}
      {clips.length > 0 && huecosClip.map((el, i) => { el.classList.add("lleno"); return createPortal(
        <OffthreadVideo key={`c${i}`} src={staticFile(clips[i % clips.length])} muted
          style={{ objectFit: "cover" }} />, el); })}
      {recorte && recortes.map((el, i) => createPortal(
        <OffthreadVideo key={`r${i}`} src={staticFile(recorte)} muted transparent
          style={{ objectFit: "cover", objectPosition: encuadre }} />, el))}
    </AbsoluteFill>
  );
};

/** Duración de la animación en la página, en segundos (para saber cuánto dura entera). */
export const duracionEnPagina = (formato: Formato, id: string) =>
  (CAT[formato].escenas.find((x) => x.id === id)?.t ?? 4000) / 1000;
