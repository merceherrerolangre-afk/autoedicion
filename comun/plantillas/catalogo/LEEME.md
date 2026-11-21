# Animaciones del catálogo, idénticas a sus páginas (desde el 20 nov 2026)

Las animaciones **no se rehacen a mano**: se usa el mismo HTML y CSS de sus páginas (`comun/catalogo/banco-*.html` para YouTube, `reels/antiguo/catalogo/banco-*.html` para reels). Así salen igual que las que eligió.

| Archivo | Qué es |
|---|---|
| `Animacion.tsx` | La pieza `<Animacion formato id cambios video videoDesde encuadre velocidad />`. Agranda la animación de la página (YouTube ×6, reels ×5), fija cada fotograma y pone **su vídeo** donde la página tiene el muñequito. En YouTube pasa el menta a naranja claro. |
| `youtube.json`, `reels.json` | El código de las 154 + 152 animaciones de las páginas (sale de `extraer-catalogo.mjs`). |
| `extraer-catalogo.mjs` | Vuelve a sacar los `.json` si cambian las páginas. |
| `Ejemplos.tsx` | **Plantilla aprobada** (20 nov 2026): `EjemploYouTube` (BBBA8ECF) y `EjemploReel` (DBNR1368, v4, aprobado «me gusta»). Para un vídeo nuevo, copiarlo y cambiar el vídeo y la lista de tramos. |
| `ReelBBBA8ECFv2.tsx` | **Reel real aprobado** (21 nov 2026, «me gusta»). El mejor punto de partida para un reel nuevo: copiarlo, cambiar vídeo, subtítulos y tramos. Usa `Tramos` de `Ejemplos.tsx`. |
| `detras.json` | Las **38 animaciones aprobadas de «detrás de ti»** (21 nov 2026), de `reels/catalogo-detras/banco-detras.html`. Se usan con `formato="detras"` + `recorte` (ver abajo). |
| `PruebaDetras.tsx` | Composición de prueba de las de «detrás de ti» (cambiar el vídeo y el recorte por los tuyos). |
| `react-dom.d.ts` | Una línea para que compile. |

## Cómo se instala en Remotion
Copiar esta carpeta a `<proyecto>/_herramientas/remotion-reels/src/catalogo/` y registrar las composiciones en `Root.tsx` (`<ComposicionesEjemplo />` de `Ejemplos.tsx`, o la del vídeo nuevo). `Ejemplos.tsx` usa `../n1/common` y `../n2/kit3` (subtítulos) y `public/sonidos/` (copiar ahí los efectos de `COMUN/SONIDOS`).

## Cómo se usa en un vídeo
- Cada **tramo** = una animación de la página: `{ desde, hasta, id, cambios, velocidad, encuadre, sonidos, sub }`.
- `id`: el nombre de la animación en la página / en el catálogo (solo **aprobadas**).
- `cambios`: textos de ejemplo → sus palabras, y retoques de tiempos para que cada cosa salga **cuando ella lo dice** (por ejemplo `["kUp .4s 1.9s", "kUp .4s 3.5s"]`). Se puede añadir una pieza igual a las de la página (misma clase y animación), pero **no inventar otro diseño**.
- `video` + `videoDesde`: va solo; su vídeo sale dentro del hueco sincronizado con su voz. `encuadre` para que la cabeza salga entera.
- Antes de renderizar todo, sacar fotogramas sueltos (`npx remotion still`) y mirarlos: nada cortado, nada tapado, textos en una línea.

## Volumen final sin `master_audio.py`
El render de `<Animacion>` ya lleva voz + efectos. Para dejarlo a −14 LUFS: medir con `ffmpeg -i render.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -` y aplicar en una segunda pasada con los valores medidos (`measured_I`, `measured_TP`, `measured_LRA`, `measured_thresh`, `offset`, `linear=true`) + `aresample=48000,aformat=channel_layouts=stereo,alimiter=limit=0.84:level=false`, copiando el vídeo (`-c:v copy`, audio `aac 256k`). Comprobar con `ebur128=peak=true`: I ≈ −14, pico ≤ −1.

Si un texto de `cambios` no se encuentra en la página, el render avisa con `CAMBIO NO APLICADO` en el log: buscarlo con `grep` y corregirlo antes de entregar.

## Animaciones «detrás de ti» (21 nov 2026)
Las piezas salen **entre su fondo y ella**, nunca encima:
1. Recorte del tramo (local, gratis): `comun/scripts/recorte-detras.sh public/<id>/video.mp4 <desde> <hasta> public/<id>/recorte-<desde>.webm`.
2. En la lista de tramos: `{ desde, hasta, formato: "detras", id: "cifra-gigante", recorte: "<id>/recorte-<desde>.webm", cambios: [[">×2<", ">120 €<"]] }`.
3. En las de vídeos: `clips: ["pexels/clip1.mp4", "pexels/clip2.mp4"]` (en `public/`) llena los recuadros con clips reales.
4. `<Animacion>` pone su vídeo en `.fondo` y el recorte en `.persona`. Si falta el recorte, avisa `FALTA EL RECORTE`.
Para volver a sacar `detras.json`: `node comun/plantillas/catalogo/extraer-catalogo.mjs comun/plantillas/catalogo detras reels/catalogo-detras/banco-detras.html`.
