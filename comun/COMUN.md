# Común a Reels y YouTube

Se lee siempre, sea cual sea el formato. Las rutas empiezan en `<proyecto>` (definido en `SKILL.md`).

## Cómo trabajar con ella
- Hablar siempre en español y **sin tecnicismos**. Avisar con una frase al terminar cada paso largo.
- **Todo gratis.** Si algo pide pagar, una clave o crear una cuenta: parar y preguntar. En media-use / HyperFrames, solo opciones locales (nada de iniciar sesión en HeyGen) y sin el "usage beacon" de telemetría.
- La primera vez que se ejecute un script de una skill en una sesión: avisar y pedir permiso.
- Trabajar siempre desde `<proyecto>` (ahí están las skills de apoyo: `it-reelsmaker`, `hyperframes`, `media-use`, `remotion-*`).

## Carpetas compartidas (solo lectura y recursos)
- `<proyecto>/ MI ESTILO/COMUN` (ojo: el nombre de ` MI ESTILO` empieza por un espacio): manual de identidad (`manual_identidad_audiovisual_con_referencias.pdf`), `SONIDOS/` (efectos y músicas CC0 ya medidos, con `CREDITOS.txt`) y `RECURSOS-PEXELS/` (vídeos y fotos ya revisados, sin marcas, con `CREDITOS.txt`).
- `<proyecto>/ MI ESTILO/COMUN/mi-estilo-comun.md`: colores y prohibidos comunes a los dos formatos (ficha aprobada el 8 nov 2026). Lo propio de cada formato está en `REELS/mi-estilo-reels.md` y `YOUTUBE/mi-estilo-youtube.md` (la ficha antigua de una pieza quedó como copia en `_herramientas/mi-estilo-anterior-15nov2026.md`: no usarla).
- Herramientas (no tocar): `<proyecto>/_herramientas` (Remotion en `remotion-reels`, plantillas originales en `plantillas`).
- Cada formato **solo coge brutos de su carpeta de brutos y solo guarda en su carpeta de listos** (están al principio de `REELS.md` y `YOUTUBE.md`). Nunca mezclar las de un formato con las del otro.

## Paso 1 · Leer su estilo (siempre, antes de tocar nada)
1. Leer **todos** los archivos de texto (`.md`, `.txt`, `.pdf`, `.docx`, `.pages`) de la carpeta de estilo del formato y sus subcarpetas, y mirar los vídeos de su `REFERENCIAS` (cómo se ven, nunca lo que dicen ni sus marcas).
2. Leer también lo común: los archivos de texto de `COMUN/` (sobre todo `mi-estilo-comun.md`).
3. **No copiar el estilo dentro de esta skill:** se lee cada vez, para que ella pueda cambiarlo editando esos archivos.
4. Si la carpeta de estilo del formato está vacía, no tiene ningún archivo escrito o falta algo para decidir (colores, letra, subtítulos, sonido…): **avisarla** antes de editar. Si no hay ningún archivo de estilo en absoluto, parar.

## Orden si algo choca
1. «Lo que nunca se hace» y «Calidad» (siempre).
2. Lo que ella diga en el chat para ese vídeo.
3. Su guion propio de ese vídeo.
4. Las «Reglas aprendidas» del formato (en `REELS.md` o `YOUTUBE.md`), y después las comunes de este archivo. Dentro de las reglas, manda la más reciente.
5. Sus archivos de estilo (carpeta del formato y `COMUN/mi-estilo-comun.md`) → manual de `COMUN` → referencias.

Excepción: si ella cambia un archivo de estilo **después** de la fecha de una regla aprendida y chocan, manda su archivo; avisarla del choque al entregar.

## Paso 2 · El bruto
1. Coger de la carpeta de brutos del formato el vídeo que diga o, si no dice cuál, **el último añadido**.
2. **Nunca modificar el original:** copiarlo a la carpeta de trabajo `<proyecto>/edit/<id>/` y trabajar con la copia.
3. **Comprobar la resolución nada más recibirlo** (`ffprobe`). Si llega a 720 y ella graba en 1080 o 4K, es una exportación reducida de Fotos: pedirle el original antes de editar («Archivo → Exportar → Exportar original sin modificar», o en AirDrop «Opciones → Todos los datos de Fotos», o por cable). Si el bruto es de verdad 720p, avisar de que no se gana nitidez y de que los zooms deben ser suaves. No escalar por encima del original sin decirlo.
4. Si junto al bruto hay un archivo **con el mismo nombre** (`.txt`, `.md`, `.docx`, `.pages`), es su guion. También puede pegarlo en el chat.
5. Un bruto puede traer **dos vídeos seguidos** (cada uno con su cierre): sacarlos por separado como `<id>_<tema>_v1`.

## Paso 3 · Transcribir y mirar
1. Transcribir con el método de reels-montage (skill `it-reelsmaker`, `transcribe.py`, `--lang es`), con el tiempo de cada palabra.
2. Mirar fotogramas para saber dónde están **su cara y sus manos** (y tabletas u objetos que enseñe). Si el detector de piel falla (camisa crema con luz cálida), comprobarlo a ojo.
3. Si ella pasó guion: cuadrar cada indicación con el momento en que la dice. Si lo grabado no coincide (frases cambiadas o que faltan), seguir lo grabado y avisar al entregar. Si una indicación no se puede hacer gratis o no está clara, preguntar en vez de inventar.
4. Si falta algo para decidir: **como mucho 3 preguntas**, con opciones y la recomendada marcada. Si no falta nada, no preguntar.

## Paso 4 · Editar (directo a la v1, sin guion de edición previo)
1. **Limpieza** (método reels-montage, `speech_mask.py` + `cut.py`): quitar silencios y huecos (todos los de más de 0,3 s). Con la transcripción, buscar las frases que empieza y vuelve a decir y quedarse con la **última toma completa**. Quitar muletillas ("eh", "vale"…) y frases a medias.
2. **Imagen:** si hace falta, corregir luz y color sin que se note.
3. **Subtítulos:** palabra a palabra, **sin una sola falta**, respetando cómo escribe ella nombres y marcas (si hay duda, preguntar), **sin fondo**, y **sin taparle nunca la cara ni las manos**. Si dice una frase con un error gramatical, dejarla como la dice y avisarla.
4. **Animaciones** (Remotion o HyperFrames) y **recortes de fondo** (rembg `u2net_human_seg` con `matte.py`): solo cuando refuercen lo que dice. Entran con movimiento suave, nunca de golpe. Sin glitch, rebotes, giros 3D, destellos ni transiciones de plantilla.
5. **Nada por encima de ella**: ni tarjetas ni ventanas flotantes a sus lados. Lo que acompañe va **detrás de ella**, con su recorte delante (misma cámara). Si un recurso no aporta, se quita.
6. **Sonido** (solo opciones locales y gratis): efectos y músicas de `COMUN/SONIDOS` (niveles y puntos de arranque en su `CREDITOS.txt`); si faltan, buscar CC0 sin cuenta en la API de Openverse (`api.openverse.org/v1/audio/?q=<palabra>&license=cc0`) y bajar la vista previa de Freesound (FreePD cerró). **Variar los sonidos**. Volumen final **−14 LUFS** (pico −1 dBTP) con `master_audio.py`.
7. **Recursos de vídeo/foto:** primero los de `COMUN/RECURSOS-PEXELS`; si hacen falta más, Pexels (ver «Lo que nunca se hace»).

## Paso 5 · Antes de entregar
1. Revisar el vídeo entero ya exportado: duración, resolución, subtítulos a tiempo y sin faltas, volumen (−14 LUFS), que nada le tape la cara ni las manos, y que **en los 2 primeros segundos se entienda de qué va, incluso sin sonido**.
2. Comparar un fotograma con una imagen sin pérdidas (`npx remotion still … --image-format=png`): sin desvío de color y al menos tan fiel como la versión anterior.
3. Guardar en la carpeta de listos del formato como `nombre_v1.mp4`, `nombre_v2.mp4`… **Cada corrección es una versión nueva; nunca borrar la anterior.** Si lleva vídeos de Pexels, guardar al lado `nombre_vN_creditos-video.txt`.
4. Contarle en **tres líneas** qué se ha hecho y qué ajustaría yo. Después, aparte y breve: diferencias entre lo grabado y su guion, y lo que no se pudo hacer gratis o por derechos.

## Calidad: mantenerla o subirla, nunca bajarla
- **Render de Remotion siempre con** `--image-format=jpeg --jpeg-quality=100 --crf=12 --x264-preset=slow`. Nunca `--image-format=png` ni `--color-space=bt709` (sale ~1 % más oscuro).
- **Recortes de rembg:** `matte.py` los guarda a 3 Mbps. Usar solo su máscara y rehacer el WebM con los píxeles del corte en bruto: `comun/scripts/recorte-hq.sh <final.mp4> <recorte.webm> <segundo-inicio> <salida.webm>` (hace `alphaextract` + `alphamerge` con `libvpx-vp9 -crf 8 -b:v 0`; para leer un WebM con transparencia, decodificar con `-c:v libvpx-vp9`).
- Recortar con rembg **solo los tramos que hacen falta** (tarda 0,5–1,5 s por fotograma). Si se corta un `matte.py` a medias, borrar `edit/.matte.lock` antes de relanzarlo.
- **Vídeos de recurso** siempre en **HD** (1080 de ancho o más), nunca en SD.
- Con un bruto nativo de 1080 no hace falta el `unsharp` en `cut.json`.
- No usar `filter: blur()` grande en fondos que salen en cada fotograma: usar degradados radiales.

## Lo que nunca se hace
- Inventar datos o cifras (gráficas sin números si ella no dice el número).
- Meter logos, marcas o material de otros. **Excepción aprobada:** vídeos y fotos de **Pexels** (licencia libre, también comercial), revisados fotograma a fotograma para que no salga ningún logo ni marca, en HD, con los créditos guardados junto al vídeo. Se bajan del servidor público `videos.pexels.com/video-files/<id>/…mp4` eligiendo el archivo HD. Si Pexels pide "verificar que eres humano", **no se marca nunca**.
- Reels, TikToks, fotos de Pinterest o vídeos de otras personas, **aunque ella lo pida** o diga que asume las consecuencias: explicarle que tienen derechos y ofrecer Pexels, dibujarlo en código, sus propios vídeos (con yt-dlp si son suyos) o que deje ella sus archivos en la carpeta de brutos.
- Música con MusicGen (su licencia no es comercial).
- Usar algo de pago sin preguntar.
- Borrar versiones anteriores o tocar el bruto original.

## Herramientas y comandos
- En cada comando: `export PATH=$HOME/.local/bin:$PATH` (ahí están `ffmpeg`, `ffprobe`, `rembg`, `yt-dlp`).
- Python: `~/.local/bin/python-reels` (faster-whisper, rembg, opencv, Pillow, PyMuPDF, yt-dlp). No hay `python3` real, ni Xcode ni Homebrew. faster-whisper necesita `av<16`.
- Scripts de reels-montage: `<proyecto>/.claude/skills/it-reelsmaker/scripts/` → `transcribe.py` (también `snip` para re-transcribir un trozo dudoso), `speech_mask.py` (`--spans`, `--density`, `--fps 30`), `cut.py` (`cut.json`: tramos, `speed`, `fix`, `retime` para palabras que se comen los cortes), `matte.py cut edit/<id> --from <s> --to <s> --name <n> --wait 60`, `master_audio.py <render> -o <master> --sfx sfx.json [--music fondo.wav --gap 20] [--cover portada.jpg]`, `patch_render.py <render> --comp <Comp> --from <s> --to <s>` (rehacer solo un trozo). Leer su SKILL.md para los detalles.
- Remotion: `<proyecto>/_herramientas/remotion-reels` (composiciones en `src/`, registrarlas en `src/Root.tsx`, archivos del vídeo en `public/<id>/`, subtítulos en `src/data/<id>-captions.json`). Lanzar los renders en segundo plano, con `--concurrency=4 --timeout=120000 --log=verbose > edit/<id>/render-vN.log`.
- Lista de sonidos: las composiciones imprimen `SND_JSON …` en el log; sacarla con `npx remotion compositions src/index.ts --log=verbose | grep -o 'SND_JSON.*'` y convertirla en `sfx.json` (formato de `comun/scripts/ejemplo-sfx.json`: `file`, `at`, `start`, `gain_db`, `what`) con rutas absolutas a `COMUN/SONIDOS`. El sonido se mezcla con `master_audio.py`, no con el audio de Remotion (mucho más rápido).
- Fotogramas de prueba antes del render completo: copiar `comun/scripts/revisar-fotogramas.mjs` a `remotion-reels` y ejecutar desde ahí `node revisar-fotogramas.mjs <Composición> <carpeta> <lista.json>`.
- Medir volumen: `ffmpeg -i video.mp4 -af ebur128=peak=true -f null -`.
- yt-dlp (solo para vídeos suyos o referencias que ella pase): `--js-runtimes node` y `-f "bv*[vcodec^=avc1]+ba"` (el AV1 no se puede leer aquí).
- Trucos de este Mac: en zsh, separar valores con `read a b <<< "…"`; para abrir `.zip`/`.pages` con nombres con tildes, usar `zipfile` de Python (en `.pages`, el texto está en `Index/Document.iwa` y las imágenes en `Data/`). Las rutas con espacios (`EDICIÓN DE VÍDEOS`) van siempre **entre comillas**. Si se renombra la carpeta del proyecto, cambiar `<proyecto>` en `SKILL.md` y rehacer los accesos de `~/.local/bin`, `python-reels`, `it-reelsmaker.json` y las rutas de los scripts (ver `COMO-FUNCIONA.md`).

## Al terminar un vídeo (solo si ella pide limpiar)
Mover a la **Papelera** (nunca borrar del todo) su bruto, sus versiones, `edit/<id>`, sus composiciones de `src/` y `public/<id>`, y quitarlo de `Root.tsx`. Antes, guardar en las plantillas de esta skill (`reels/plantillas/` o `youtube/scripts/`) o en `COMUN/SONIDOS` / `COMUN/RECURSOS-PEXELS` lo que sirva para los siguientes. Confirmar con ella antes de mover nada.

## Reglas aprendidas comunes
Correcciones que ella ha ido haciendo y que valen para los dos formatos. **Al recibir una corrección nueva que valga para los dos, añadirla aquí** con su fecha.

1. **Subtítulos sin fondo** (8 nov 2026): blancos con contorno o sombra suave sobre el vídeo; negros `#111111` sobre fondos blancos.
2. **Nada por encima de ella** (8 nov 2026): las tarjetas y vídeos a sus lados "aparecen por encima y no se ve bien". Van detrás, más grandes, con menos opacidad; si no aportan, se quitan.
3. **Pedir el original si el bruto llega reducido** (8 nov 2026): pasó con un reel y con un vídeo de YouTube exportados a 720 desde Fotos.
4. **Sin guion de edición ni visto bueno previo** (10 nov 2026): hacer directamente la v1; lo que antes iba al guion se le cuenta al entregar.
5. **Variar los sonidos** (9 nov 2026): el mismo barrido repetido "abruma". Alternar varios, quitar los que caen a menos de ~1 s de otro y dejarlos un poco bajos. `swoosh.mp3` y `rise.mp3` casi nunca.
6. **Nunca repetir la misma imagen ni el mismo vídeo de recurso** dentro de un vídeo (10 nov 2026), y no volver a usar los que ya ha visto mucho (le cansó `pexels-3996891`, la coloración).
7. **Foto de pelo azul de Pexels `p3093007`: prohibida** (11 nov 2026).
8. **Estética de los recursos** (11 nov 2026): salón luminoso en tonos crema y melenas castañas brillantes con ondas.
9. **Material de otros, aunque lo pida** (10 nov 2026): pidió Pinterest y TikTok tapando logos; no se bajan. Se le ofrece que deje ella los archivos o se dibuja en código (p. ej. un perfil de Instagram inventado). Si trae imágenes suyas con marcas, desenfocar las marcas y preguntar si son suyas. Sus carpetas de "base" o "ejemplos" con enlaces `.m3u8` o pines de Pinterest no sirven como material: solo como inspiración.
10. **Los ejemplos que deja son inspiración, no plantilla** (11 nov 2026): crear el elemento que pegue con lo que dice (si habla de un panadero, un pan en ese mismo estilo), siempre con su marca (naranja y blanco) y sus pautas.
11. **Cuando habla de «un vídeo suyo»** (9 y 11 nov 2026): enseñar su miniatura (la deja en la carpeta de brutos) grande y con movimiento suave (zoom lento + brillo), o su propio vídeo en movimiento; nunca un icono ni bocadillos encima.
12. **Calidad** (8 nov 2026): nunca bajarla; un render de una sola vez muy largo se cayó por memoria; seguir siempre las órdenes de render y de recorte de «Calidad».
13. **Estilo de animaciones nuevo** (15 nov 2026): lo eligió ella en tres tandas (136 de 154 animaciones) a partir de los vídeos de Superwall. **Fondo blanco roto** con puntitos casi invisibles; **tarjetas blancas de esquinas muy redondeadas con sombra suave**; letra gruesa (Archivo/Inter); **poco texto** (una palabra o frase corta por pieza); acento **naranja claro `#FFC08A`/`#F4A57A`** (nunca menta) con negro y blanco, verde para ✓ y rojo para ✗; **ritmo rápido** alternando sus planos y animaciones a pantalla completa (entran y salen con desenfoque), su círculo en la esquina con aro que late, ruleta de tarjetas, barras, cifras que corren, móvil con vídeo real. Se elige de `comun/catalogo-animaciones.md`. Nunca cortar la cabeza; cifras solo si ella las dice.
    > **En reels esta regla ya no manda en lo visual:** la sustituyen las reglas 33 y 34 de `reels/REELS.md` (17 nov 2026). En YouTube sigue vigente.
14. **Limpio pero con volumen, nada de «pegatinas» planas** (16 nov 2026, v2 del reel PPTK7289): las piezas **no pueden ser planas ni infantiles** («stickers»). Tarjetas con degradado suave, brillo y sombra; **sombra amarilla/naranja claro** bajo lo naranja; nada de personas, relojes o barras dibujados en plano. Que se vea **qué es cada cosa** (p. ej. los 3 tipos de contenido y lo que da cada uno, a la vez, flecha entre medias) y que **represente la idea** (si algo es «lo último», que baje al último puesto de una lista). En aquel momento se usaron **emojis tipo iPhone** como iconos; **en reels ya no** (regla 34 de `reels/REELS.md`: nada de secuencias de iconos o emojis).
