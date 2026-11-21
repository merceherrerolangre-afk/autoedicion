# YouTube

Se lee después de `comun/COMUN.md` cuando el formato es **YouTube** (horizontal 1920×1080, largo). Las rutas empiezan en `<proyecto>` (definido en `SKILL.md`).

Se aplica a mano el método de reels-montage (la skill `it-reelsmaker` solo renderiza en vertical) con FFmpeg y Remotion.

## Carpetas de YouTube
| Para qué | Ruta |
|---|---|
| Brutos (entrada) | `<proyecto>/EDICIÓN DE YT/BRUTOS` |
| Listos (salida) | `<proyecto>/EDICIÓN DE YT/LISTOS` |
| Estilo de YouTube | `<proyecto>/ MI ESTILO/YOUTUBE` (con `REFERENCIAS/`) |

- YouTube nunca coge ni deja nada en `EDICIÓN DE REELS`.

## Formato y exportación
- Horizontal **1920×1080**, 30 fps. Composición de Remotion de 1920×1080 partiendo de `scripts/plantilla-youtube.tsx` (copiarla a `src/` como `Yt<ID>.tsx`, cambiar el JSON de subtítulos y la carpeta `public/<ID>`, y registrarla en `Root.tsx`). Las palabras se enganchan a sus tiempos con `w("palabra", segundo)`.
- Limpieza con `transcribe.py` + `speech_mask.py` del método reels-montage y el corte con FFmpeg (o `cut.py` si acepta horizontal: comprobarlo antes). El resultado del corte es `final.mp4` (voz + imagen limpias).
- **Render por partes** (los vídeos largos se caen por memoria si se hacen de una vez): `scripts/render-youtube-por-partes.sh <Composición> <fotogramas-totales> <carpeta-de-trabajo> [partes]`. Hace 6 partes (por defecto) con `--muted --concurrency=4 --timeout=120000` y las une con `ffmpeg concat -c copy` sin recomprimir.
- **Sonido aparte:** voz de `final.mp4` + efectos + música con `master_audio.py <imagen.mp4> -o <master.mp4> --sfx sfx.json --music fondo.wav --gap 20` → −14 LUFS.
- Guardar en `EDICIÓN DE YT/LISTOS/<id>_vN.mp4`, con `_creditos-video.txt` si lleva Pexels.
- La duración es la del vídeo limpio (el primero fue de 14 min en bruto y ~13 min limpio). Avisar si un render va a tardar horas y dejarlo en segundo plano; si ella apaga el ordenador, lo hecho queda guardado y el programa se salta las partes ya hechas.

## Ritmo y estructura
- **Ritmo natural** (`speech_mask.py --density natural`), sin acelerar la voz.
- **Primer minuto (gancho) muy animado**; después, animaciones a pantalla completa en las ideas clave y un **título de capítulo** al empezar cada parte (lo detallan sus archivos de estilo).
- Dentro de cada pantalla completa, **algo nuevo cada ≤ 2,5 s**, ligado a sus palabras.
- Las animaciones salen del catálogo de estilo nuevo (`comun/catalogo-animaciones.md`; estilo Superwall: blanco, tarjetas redondeadas, poco texto, ritmo rápido). Leerlo antes de montar y ponerlas **siempre con `<Animacion formato="youtube">`** (`comun/plantillas/catalogo/`), idénticas a la página. Plantilla aprobada: `EjemploYouTube` de `comun/plantillas/catalogo/Ejemplos.tsx`.

## Subtítulos y recursos
- **Subtítulos solo en las pantallas completas**, nunca encima de ella. Colocarlos donde no estén sus manos ni lo que enseñe (en el primer vídeo, abajo a la derecha porque la tableta estaba abajo en el centro).
- **Frases clave en grande**, en naranja claro `#F4A57A`.
- **Vídeos de recurso detrás de ella** (recortada con rembg) en ventana de ~380×675 px al **85 %** de opacidad.

## Sonido
- **Un sonido en cada animación, acorde al movimiento:** pop al aparecer, tic en los ✓, tictac en contadores, notas que suben en las barras, trazo en líneas y flechas, golpe al tachar, whoosh al entrar una pantalla completa, swish suave en las frases clave. Referencia de niveles: `comun/scripts/ejemplo-sfx.json` y `COMUN/SONIDOS/CREDITOS.txt` (efectos con pico ~13 dB por debajo del pico normal de su voz).
- **Música CC0 que cambia por tramos o capítulos** (`scripts/musica-por-tramos.py`: cambiar pistas y segundos al principio del archivo), a **20 dB por debajo de la voz** con compresión lateral (`--gap 20`), entrando suave y apagándose al final.
- La voz siempre clara.

## De un vídeo largo, reels
Se pueden sacar reels de un vídeo de YouTube (función «long recording → series of clips» de `it-reelsmaker`, `longform.py`). **Proponerlo, no hacerlo sin preguntar.** Si dice que sí, los reels se montan siguiendo `reels/REELS.md` y se guardan en la carpeta de listos de reels.

## Reglas aprendidas solo de YouTube
Correcciones que ella ha ido haciendo en YouTube, con su fecha. **Al recibir una corrección nueva solo de YouTube, añadirla al final.**

1. **Sobre todo animaciones** (8 nov 2026): "quiero que le metas animaciones, sobre todo animaciones", añadiendo pantallas completas según lo que vaya diciendo.
2. **Ritmo natural** (8 nov 2026): lo eligió para YouTube; quitar silencios, pero sin apretar como en los reels.
3. **Subtítulos solo en pantallas completas, nunca encima de ella** (9 nov 2026, cambios de la v2).
4. **Frases clave grandes en naranja claro `#F4A57A`** (9 nov 2026, v2).
5. **Algo nuevo cada ≤ 2,5 s en las pantallas completas**, ligado a sus palabras (9 nov 2026, v2).
6. **Vídeos de recurso al 85 %**, en ventana de ~380×675 (9 nov 2026, v2).
7. **Un sonido en cada animación, acorde al movimiento** (9 nov 2026).
8. **El mismo barrido repetido agobia** (9 nov 2026, v3): el de la entrada de pantalla completa sonaba casi siempre. Se alternaron swishA/B/C en los títulos, trazo en las líneas, notas en escala en las barras, se quitaron los que caían a menos de 1 s de otro, ese bajó un 20 % y los demás ~1,5 dB.
9. **La última música (`musica3`) sonaba alta** (9 nov 2026, v4): ponerla ~4 dB por debajo de las otras.
10. **Render por partes y sonido aparte** (8–9 nov 2026): el render de 46.000 fotogramas de una vez se cayó en el 21.357.
11. **Estilo de animaciones de YouTube = Superwall** (15 nov 2026): quiere replicar «casi tal cual» ese estilo (fondo blanco roto, tarjetas blancas redondeadas con sombra suave, letra gruesa, poco texto en negro y gris, ritmo rápido alternando planos suyos y pantallas completas). Elegidas 136 de 154 animaciones; están en `comun/catalogo-animaciones.md` con sus páginas en `comun/catalogo/banco-1/2/3.html`. **Leer el catálogo antes de montar un vídeo y elegir de ahí.**
12. **Acento naranja claro, no menta** (15 nov 2026): donde las referencias usan menta/turquesa/violeta (etiquetas, resaltados, degradado de capítulo, óvalos), usar naranja claro `#F4A57A`/`#FFC08A` o tonos cálidos. Negro y blanco se mantienen.
13. **Poco texto** (15 nov 2026): en frases resaltadas, listas y titulares, pocas palabras (lo escribió en varias notas).
14. **Nunca cortar ni tapar la cabeza/cara** (15 nov 2026): en los planos que se acercan (`escalada-tres-planos`, `corte-escala-alterna`) y en el recuadro de esquina (`pip-rectangulo-esquina`) la cabeza va siempre entera. Si va delante de una tarjeta, ella va superpuesta y la tarjeta detrás, en segundo plano.
15. **Lo que no quiere** (15 nov 2026): franja de frase bajo el vídeo, barra de visitas que crece, cuenta atrás en el móvil, titular con flechas sobre móviles, móvil con titular y botón, pantalla dividida PAIN/PASSION, elementos que van y vienen, collages de objetos, fondos negros con luces o bandas de color, subtítulos de dos líneas con rebote o de una sola palabra, frase en dos tonos, toque con onda, móviles en abanico o inclinados, logo con anillo. Subtítulos como los de la regla 3–4 (blancos gruesos con sombra, 2–3 palabras).
16. **Aprobado el vídeo hecho con sus páginas** (20 nov 2026): `EjemploYouTube` (BBBA8ECF) de `comun/plantillas/catalogo/Ejemplos.tsx` le gustó. Es la plantilla de partida para montar YouTube (ver regla común 15).
