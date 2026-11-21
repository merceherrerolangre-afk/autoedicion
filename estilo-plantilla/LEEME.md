# Estilo base para una persona nueva

La skill lee el estilo de la carpeta `<proyecto>/ MI ESTILO` (empieza por un espacio). Quien compartió la skill **no** comparte su estilo (es su marca), así que aquí va una base para crear el tuyo:

| Aquí | Copiar a | Qué hacer |
|---|---|---|
| `COMUN/SONIDOS/` | ` MI ESTILO/COMUN/SONIDOS/` | Efectos de sonido libres (CC0), listos. La música no viene: buscar música CC0 sin letra. |
| `COMUN/mi-estilo-comun.md` | igual | Rellenar con **sus colores** (de su manual o brand book). |
| `REELS/mi-estilo-reels.md` | igual | Rellenar con ella (letra, subtítulos, ritmo, cómo empieza y cierra). |
| `YOUTUBE/mi-estilo-youtube.md` | igual | Igual, para YouTube. |
| (crear) `REELS/REFERENCIAS/`, `YOUTUBE/REFERENCIAS/` | — | Vídeos o enlaces de creadores cuyo estilo le gusta (solo para copiar cómo se ve). |
| (crear) `COMUN/RECURSOS-PEXELS/videos` y `/fotos`, con `CREDITOS.txt` | — | Vídeos y fotos gratis de Pexels de su sector (HD, sin cuenta). |

Su manual o brand book (PDF, imagen o enlace) se guarda en ` MI ESTILO/COMUN/`. Si no tiene, el agente le hace una entrevista corta (colores, letra, qué le gusta y qué no) y propone un estilo limpio: fondo blanco, tarjetas redondeadas, un solo color de acento.

**Importante:** las reglas y animaciones de la skill usan un acento naranja (`#E98A55` / `#F4A57A`). Si su color de acento es otro, el agente lo apunta en `mi-estilo-comun.md` y en `src/catalogo/acento.json` del proyecto de Remotion (`{ "color": "#…" }`): las animaciones cambian solas el naranja por el suyo. También en `ORANGE` de `kit3.tsx` y `n1/ui.tsx`.
