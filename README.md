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
├── INSTALAR.md         ← pasos para que una IA lo deje todo instalado en otro ordenador
├── estilo-plantilla/   ← base para crear TU estilo en " MI ESTILO": sonidos libres (CC0) y fichas en blanco que tu Claude rellena con tu marca
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
- El estilo de quien creó la skill (su manual, su música, sus colores) no se comparte: cada persona crea el suyo desde `estilo-plantilla/` con su manual de marca.
- La skill lee el estilo de la carpeta ` MI ESTILO` del proyecto (así el estilo se cambia sin tocar la skill). `INSTALAR.md` explica cómo crearlo.
- Tu color de acento se pone una vez en `acento.json` y todas las animaciones lo usan.
- Los subtítulos de los reels de ejemplo (`src/data/<id>-captions.json`). Por eso los dos ejemplos de `reels/plantillas/n2/` sirven para copiar escenas, pero no se pueden renderizar tal cual.

## Con otras IA

Está pensada para Claude Code, pero cualquier asistente que lea archivos puede seguirla: `AGENTS.md` le dice que empiece por `SKILL.md`, decida el formato y lea solo `comun/COMUN.md` y el archivo de ese formato.

## Cómo instalarla en Claude Code

1. Abrir Claude Code y escribirle: «Instálame la skill de este enlace siguiendo su INSTALAR.md: https://github.com/merceherrerolangre-afk/autoedicion».
2. (O descargar esta carpeta con el botón verde «Code» → «Download ZIP» y decirle a Claude que siga su `INSTALAR.md`.)

Claude instala los programas (todos gratis), copia la skill y el estilo y lo comprueba todo.
