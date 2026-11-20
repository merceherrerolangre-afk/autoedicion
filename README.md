# Autoedición de vídeos (Reels y YouTube)

Skill para **Claude Code** que edita vídeos hablando a cámara, desde el bruto hasta el vídeo terminado, con un estilo propio y las correcciones aprendidas en cada entrega.

Una sola skill sirve para los dos formatos:

- **Reels**: vertical 1080×1920, corto, ritmo rápido, sin música.
- **YouTube**: horizontal 1920×1080, largo, ritmo natural, música por tramos.

Al empezar decide el formato con lo que se le pida, con la carpeta donde está el bruto o con la forma del vídeo. Si no está claro, pregunta. Después solo sigue las reglas de ese formato.

## Qué hay dentro

```
autoedicion/
├── SKILL.md            ← puerta de entrada: decide el formato y dice qué leer
├── AGENTS.md           ← aviso para otras IA (Codex, Cursor…): empezar por SKILL.md
├── comun/
│   ├── COMUN.md        ← pasos de trabajo, calidad, lo que nunca se hace, herramientas y reglas comunes
│   ├── catalogo-animaciones.md + catalogo/   ← animaciones aprobadas (estilo nuevo); abrir los .html en el navegador para verlas
│   └── scripts/        ← recorte en alta calidad, fotogramas de prueba, ejemplo de lista de sonidos
├── reels/
│   ├── REELS.md        ← todo lo propio de los reels y sus reglas
│   ├── plantillas/     ← plantilla de partida (n2/kit3.tsx) y dos reels aprobados de ejemplo
│   └── antiguo/        ← estilos anteriores, solo de consulta
└── youtube/
    ├── YOUTUBE.md      ← todo lo propio de YouTube y sus reglas
    └── scripts/        ← plantilla de YouTube, render por partes y música por tramos
```

## Lo que necesita para funcionar

Esta skill es el «manual». Para editar de verdad, el ordenador necesita además:

- **FFmpeg / ffprobe**, **rembg** y **yt-dlp** (en `~/.local/bin`).
- **Python** con faster-whisper, rembg, opencv y Pillow (aquí se llama `python-reels`).
- **Node.js** con un proyecto de **Remotion** (aquí, `_herramientas/remotion-reels`).
- La skill **`it-reelsmaker`**, que hace la transcripción, los cortes, los recortes y el volumen final.
- Las carpetas del proyecto: brutos, listos y la carpeta de estilo ` MI ESTILO`, con las fichas de estilo, las referencias, los sonidos y los recursos de Pexels.

Todas las rutas parten de la carpeta del proyecto, que se escribe en **una sola línea** de `SKILL.md` (`<proyecto>`). Si se usa en otro ordenador, solo hay que cambiar esa línea.

## Lo que NO está aquí (a propósito)

- Vídeos, brutos y versiones terminadas.
- Las fichas de estilo, las referencias, los sonidos y los recursos de Pexels: la skill los lee cada vez de la carpeta ` MI ESTILO`, para que el estilo se pueda cambiar sin tocar la skill.
- Los subtítulos de los reels de ejemplo (`src/data/<id>-captions.json`). Por eso los dos ejemplos de `reels/plantillas/n2/` sirven para copiar escenas, pero no se pueden renderizar tal cual.

## Con otras IA

Está pensada para Claude Code, pero cualquier asistente que lea archivos puede seguirla: `AGENTS.md` le dice que empiece por `SKILL.md`, decida el formato y lea solo `comun/COMUN.md` y el archivo de ese formato.

## Cómo instalarla en Claude Code

1. Descargar esta carpeta (en GitHub: botón verde «Code» → «Download ZIP») y descomprimirla.
2. Copiar la carpeta `autoedicion` dentro de `~/.claude/skills/`. Para llegar a esa carpeta oculta en el Finder: Cmd + Mayús + G y pegar `~/.claude/skills`.
3. Revisar la línea `<proyecto>` de `SKILL.md`.
4. Pedirle a Claude, por ejemplo: «edita el nuevo bruto de reels».
