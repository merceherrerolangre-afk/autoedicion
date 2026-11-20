# Instrucciones para agentes de IA

Este repositorio es una **skill** (un manual de trabajo) para editar vídeos hablando a cámara: Reels (vertical) y vídeos de YouTube (horizontal). Está escrito en español.

**Empieza siempre por [`SKILL.md`](SKILL.md)** y sigue sus pasos:

1. Decide el formato (Reels o YouTube) como indica el «Paso 0».
2. Lee entero [`comun/COMUN.md`](comun/COMUN.md).
3. Lee entero el archivo del formato: [`reels/REELS.md`](reels/REELS.md) o [`youtube/YOUTUBE.md`](youtube/YOUTUBE.md).

Notas:
- Las rutas que empiezan por `<proyecto>` son carpetas de la persona usuaria (brutos, vídeos terminados, estilo, sonidos), no de este repositorio. `<proyecto>` se define en `SKILL.md`.
- La skill da por hecho que existen FFmpeg, Python con faster-whisper y rembg, Node.js con Remotion y la skill `it-reelsmaker` (ver [`README.md`](README.md)). Si falta algo, avisa a la persona en vez de improvisar.
- Respeta siempre «Lo que nunca se hace» de `comun/COMUN.md`: no inventar datos, no usar material con derechos de otros, nada de pago sin preguntar y no tocar los brutos originales.
- `reels/antiguo/` guarda estilos anteriores: no lo uses salvo que te lo pidan.
