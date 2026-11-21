# Instalar la skill «autoedicion» (instrucciones para el agente)

> **Para la persona:** no tienes que leer esto. Abre Claude Code en tu ordenador y escríbele:
> «Descomprime la carpeta autoedicion que he descargado y sigue su archivo INSTALAR.md para dejármelo todo listo».

**Para el agente:** sigue estos pasos en orden, de principio a fin. Al terminar, la persona podrá decir «edita el nuevo bruto de reels» o «edita el nuevo bruto de YouTube» y la skill funcionará igual que en el equipo original.

## Normas mientras instalas
- Habla en **español y sin tecnicismos**. Al acabar cada paso largo, avisa con una frase.
- **Todo gratis.** Si algo pide pagar, una clave o crear una cuenta, para y pregunta. HyperFrames/media-use: solo opciones locales, nunca iniciar sesión en HeyGen, y sin el «usage beacon» de telemetría.
- Antes de ejecutar un programa descargado por primera vez, di qué hace y pide permiso.
- No borres nada que ya exista en su equipo. Si una carpeta ya está, pregunta antes de tocarla.
- Las instrucciones son para **Mac**. En Windows o Linux, haz lo mismo con las herramientas de ese sistema (por ejemplo, `winget`) y avisa de lo que cambia.
- Escribe siempre **entre comillas** las rutas con espacios.

## Paso 1 · Carpeta del proyecto
Pregunta dónde quiere la carpeta. Si no tiene preferencia, usa `~/Documents/EDICIÓN DE VÍDEOS`. En adelante, esa carpeta es `<proyecto>`. Crea dentro:

```
<proyecto>/
├── EDICIÓN DE REELS/1. BRUTOS            ← aquí deja sus reels sin editar
├── EDICIÓN DE REELS/3. LISTOS/REELS      ← aquí salen los reels terminados
├── EDICIÓN DE YT/BRUTOS                  ← vídeos de YouTube sin editar
├── EDICIÓN DE YT/LISTOS                  ← vídeos de YouTube terminados
├── " MI ESTILO"/                         ← (empieza por un espacio) lo copias en el paso 2
├── edit/                                 ← carpeta de trabajo de cada vídeo
└── _herramientas/                        ← programas (pasos 4 y 6)
```

## Paso 2 · Copiar la skill y el estilo
1. Copia la carpeta entera del repositorio a `~/.claude/skills/autoedicion/` (que `SKILL.md` quede justo dentro).
2. Copia **el contenido** de `estilo/` a `<proyecto>/ MI ESTILO/`. El nombre empieza por un espacio: hazlo exactamente así, porque la skill lo busca con ese nombre. Resultado: `<proyecto>/ MI ESTILO/COMUN`, `/REELS` y `/YOUTUBE`.
3. En `~/.claude/skills/autoedicion/SKILL.md`, cambia la línea `<proyecto>` = `~/Documents/EDICIÓN DE VÍDEOS` por la carpeta del paso 1, si es otra.

## Paso 3 · Recursos de Pexels (gratis, sin cuenta)
No vienen en el repositorio. Descárgalos tú:
1. Lee `<proyecto>/ MI ESTILO/COMUN/RECURSOS-PEXELS/CREDITOS.txt`.
2. Baja cada vídeo en **HD** (1080 de ancho o más) a `RECURSOS-PEXELS/videos/` con su nombre (`pexels-<número>.mp4`). Las fotos van a `RECURSOS-PEXELS/fotos/` (`p<número>.jpg`, 1000 px de ancho).
3. Usa el servidor público `videos.pexels.com/video-files/<número>/…`. Si Pexels pide «verificar que eres humano», **no lo marques**: dile a la persona que los descargue ella desde los enlaces del archivo.
4. **No descargues** la foto `p3093007` (prohibida).

## Paso 4 · Programas (todos gratis)
Comprueba primero qué tiene ya instalado (`node -v`, `ffmpeg -version`, `python3 --version`) y no reinstales lo que funcione.

| Programa | Para qué | Cómo |
|---|---|---|
| **Node.js 22 o más** | Remotion (las animaciones) | Instalador gratis: https://nodejs.org (pide a la persona que lo instale ella si hace falta contraseña del Mac) |
| **uv** | Instalar Python sin Homebrew | `curl -LsSf https://astral.sh/uv/install.sh \| sh` (https://docs.astral.sh/uv/) |
| **Python 3.12 + librerías** | Transcribir, recortar y descargar | `~/.local/bin/uv venv --python 3.12 "<proyecto>/_herramientas/entorno-python"` y luego `~/.local/bin/uv pip install --python "<proyecto>/_herramientas/entorno-python/bin/python" faster-whisper "rembg[cpu,cli]" yt-dlp opencv-python-headless pillow pymupdf "av>=11,<16"` (el `av<16` es obligatorio: con versiones nuevas, faster-whisper no lee los vídeos) |
| **Modelo de recorte** | Recortar a la persona del fondo | `"<proyecto>/_herramientas/entorno-python/bin/rembg" d u2net_human_seg` (unos 176 MB) |
| **FFmpeg / ffprobe** | Cortar y unir vídeo | Si hay Homebrew: `brew install ffmpeg`. Si no: `mkdir -p "<proyecto>/_herramientas/node-tools" && cd "<proyecto>/_herramientas/node-tools" && npm install ffmpeg-static @ffprobe-installer/ffprobe && node node_modules/ffmpeg-static/install.js` |

**Accesos directos en `~/.local/bin`**, porque la skill los usa con estos nombres. Crea la carpeta si no existe y comprueba que está en el PATH:
- `ffmpeg` y `ffprobe`: enlaces a los de Homebrew o a los de `node-tools` (`node_modules/ffmpeg-static/ffmpeg` y `node_modules/@ffprobe-installer/<sistema>/ffprobe`).
- `rembg` y `yt-dlp`: enlaces a `"<proyecto>/_herramientas/entorno-python/bin/…"`.
- `python-reels`: un pequeño archivo ejecutable que lanza `"<proyecto>/_herramientas/entorno-python/bin/python" "$@"`.

Si la ruta del proyecto tiene espacios y los programas de `entorno-python/bin` fallan al arrancar, recrea el entorno o lánzalos con `python-reels -m <módulo>`.

## Paso 5 · Skills de apoyo (gratis, desde GitHub)
Descárgalas en `<proyecto>/_herramientas/` y copia las skills a `<proyecto>/.claude/skills/`:

| Skill | Repositorio | Qué copiar |
|---|---|---|
| **it-reelsmaker** (obligatoria: transcribe, corta, recorta y deja el volumen a −14 LUFS) | https://github.com/itpartypattaya/reels-montage | `plugins/it-reelsmaker/skills/it-reelsmaker` |
| **remotion-*** (guías de Remotion) | https://github.com/remotion-dev/skills | cada carpeta de `skills/` |
| **hyperframes**, **media-use** (opcionales) | https://github.com/heygen-com/hyperframes | `skills/hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use` |

Descarga sin cuenta: `curl -fsSL "https://codeload.github.com/<usuario>/<repo>/tar.gz/HEAD" | tar -xz -C <carpeta> --strip-components=1`.

## Paso 6 · Proyecto de Remotion
1. Crea el proyecto con it-reelsmaker: `python-reels "<proyecto>/.claude/skills/it-reelsmaker/scripts/kit.py" new "<proyecto>/_herramientas/remotion-reels"` y después `npm install` dentro de esa carpeta.
2. Fija Remotion en la versión con la que se hicieron las plantillas, con **todas las piezas `remotion` y `@remotion/*` iguales**: `npm install remotion@4.0.526 @remotion/cli@4.0.526 @remotion/google-fonts@4.0.526 @remotion/layout-utils@4.0.526`.
3. Copia `reels/plantillas/n1/` y `reels/plantillas/n2/` de la skill a `_herramientas/remotion-reels/src/`, manteniendo los nombres `n1` y `n2`. Copia también `comun/plantillas/catalogo/` a `_herramientas/remotion-reels/src/catalogo/` (la pieza que pone las animaciones idénticas a las páginas) y los efectos de `<proyecto>/ MI ESTILO/COMUN/SONIDOS` a `_herramientas/remotion-reels/public/sonidos/`.
   - **No** registres en `Root.tsx` los dos reels de ejemplo de `n2/`. Necesitan subtítulos que no vienen (`src/data/<id>-captions.json`), así que son solo para copiar escenas.
4. En `remotion.config.ts`, añade `Config.setOffthreadVideoCacheSizeInBytes(384 * 1024 * 1024);`. Así no fallan los renders con «No frame found» en ordenadores con poca memoria.
5. Comprueba que compila: `npx tsc --noEmit` dentro de `remotion-reels`. Si `kit3.tsx` o `n1/` dan error, arréglalo sin cambiar cómo se ve.

## Paso 7 · Ajustes del proyecto
1. Crea `<proyecto>/it-reelsmaker.json` con este contenido (cambiando las rutas por las reales):
   ```json
   {
     "project_root": "<proyecto>",
     "remotion_dir": "<proyecto>/_herramientas/remotion-reels",
     "assets_dir": "",
     "face_model": "",
     "matte": { "rembg": "<proyecto>/_herramientas/entorno-python/bin/rembg", "models": "~/.rembg/models/u2net_human_seg" }
   }
   ```
2. Crea `<proyecto>/CLAUDE.md` con estas instrucciones:
   - Hablar en español y sin tecnicismos. Todo gratis.
   - Para editar o corregir cualquier vídeo, cargar **siempre** la skill `autoedicion` y seguirla entera.
   - Las correcciones nuevas van a «Reglas aprendidas» de la skill: a `comun/COMUN.md` si valen para los dos formatos, o a `reels/REELS.md` / `youtube/YOUTUBE.md` si son de uno solo.
   - Recordatorio de que en cada comando hay que añadir `export PATH=$HOME/.local/bin:$PATH`.

## Paso 8 · Comprobar
Ejecuta y enseña el resultado en una frase:

```bash
export PATH=$HOME/.local/bin:$PATH; ffmpeg -version | head -1; ffprobe -version | head -1; node -v; python-reels -c "import faster_whisper, rembg; print('python ok')"; yt-dlp --version
```

Después:
- Lanza `doctor.py` de it-reelsmaker desde `<proyecto>` y arregla lo que marque como obligatorio.
- Comprueba que existen todas las rutas que nombra `SKILL.md`.
- Si la persona tiene ya un bruto, propón hacer una prueba corta.

## Paso 9 · Explicárselo a la persona (en tres líneas)
1. Dónde deja sus vídeos sin editar (las carpetas de BRUTOS) y dónde salen los terminados (las de LISTOS).
2. Qué tiene que escribir: «edita el nuevo bruto de reels» o «… de YouTube». Para correcciones: «en la v1 cambia…».
3. Que el estilo (colores, letra, ritmo) está en ` MI ESTILO`. Si quiere uno propio, puede cambiar esos archivos. La skill los lee cada vez que edita.

## A tener en cuenta
- En la skill, «ella» es la persona que sale en los vídeos y para la que se edita.
- El estilo de ` MI ESTILO` (naranja claro y blanco, letra gruesa, poco texto) es el de quien compartió la skill. Si la persona usa otra marca, cambia esos archivos, no la skill.
- **Remotion** es gratis para particulares y empresas de hasta 3 personas. Las empresas más grandes necesitan licencia: https://www.remotion.dev/license
