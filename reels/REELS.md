# Reels

Se lee después de `comun/COMUN.md` cuando el formato es **Reels** (vertical 1080×1920, corto). Las rutas empiezan en `<proyecto>` (definido en `SKILL.md`).

El montaje se hace con la skill `it-reelsmaker` (método reels-montage) y Remotion.

## Carpetas de Reels
| Para qué | Ruta |
|---|---|
| Brutos (entrada) | `<proyecto>/EDICIÓN DE REELS/1. BRUTOS` |
| Listos (salida) | `<proyecto>/EDICIÓN DE REELS/3. LISTOS/REELS` |
| Estilo de Reels | `<proyecto>/ MI ESTILO/REELS` (con `REFERENCIAS/`) |

- Lo de YouTube nunca va en `EDICIÓN DE REELS`: va en `EDICIÓN DE YT` y lo lleva `youtube/YOUTUBE.md`.
- Dentro de la carpeta de brutos puede dejar también su **miniatura** (`miniatura.jpg`), fotos suyas o carpetas de ejemplos: son para este reel, no son brutos.

## Lo que manda hoy (20 nov 2026)

Si algo de más abajo choca con esto, manda esto (reglas 34, 35, 36, 38 y 39, y la común 15):

- **Animaciones de SUS PÁGINAS de reels**, puestas con `<Animacion formato="reels">` (`comun/plantillas/catalogo/`), idénticas a la página: solo las **aprobadas** de `antiguo/catalogo-animaciones-antiguo.md` y **sin las de emojis**. Plantilla aprobada: `EjemploReel` de `comun/plantillas/catalogo/Ejemplos.tsx` (regla 39).
- **Desde el segundo 0 pasa algo**, y **cada pieza lleva dentro la palabra o representa lo que dice** (regla común 16).
- **Cosas que salen DETRÁS de ella** (regla 41): 38 animaciones aprobadas en `catalogo-detras/banco-detras.html`, puestas con `<Animacion formato="detras">` + su recorte delante. Nunca encima de ella.
- **Equilibrio** (regla 38): como mucho **una pantalla partida** por reel; el resto, ratos solo con ella, algún toque sobre ella y pantallas completas limpias pero no vacías. Flechas finas, enteras y con aire.

- **Lenguaje visual de SUS referencias** (` MI ESTILO/REELS/REFERENCIAS`, `igexport-*.mp4`), no iconos ni emojis.
- **Pantalla partida recta:** arriba la animación sobre gris claro, ella abajo, sin esquinas redondeadas.
- **Subtítulo en píldora gris sobre la unión** (blanco en pantalla completa).
- **Una palabra grande metálica** con el concepto, a y ≈ 100–150 en la mitad de arriba (≈ 280–330 en pantalla completa).
- **Objetos reales que se construyen despacio:** ventanas de informe, tickets, fichas que se rellenan, móvil con vídeo real de Pexels, tarjetas oscuras de mensaje, conexiones que se dibujan, estanterías, calendario.
- **Pocas escenas y largas** (3–5 s), contenido continuo, texto grande y legible en móvil (≥ 40 px).
- **Plantilla de partida:** `plantillas/n2/kit3.tsx` con los ejemplos aprobados `ReelDBNR1368v2.tsx` y `ReelJHWI0526v2.tsx`.
- El catálogo de reels (`antiguo/catalogo-animaciones-antiguo.md`) **vuelve a valer desde el 20 nov 2026** a través de `<Animacion>` (ver arriba); el de YouTube (`comun/catalogo-animaciones.md`), solo ideas sueltas. Nunca una secuencia de iconos.

## Formato y exportación
- Vertical **1080×1920**, 30 fps. Se monta con la skill `it-reelsmaker` (leer su SKILL.md y su archivo de proyecto `it-reelsmaker.json` en la raíz).
- Duración: la del reel ya limpio (suelen salir 30–50 s). Empieza hablando desde el primer fotograma y corta seco unos 0,2 s después de la última palabra, sin pantalla final.
- Exportar con `master_audio.py` a −14 LUFS y guardar en `EDICIÓN DE REELS/3. LISTOS/REELS/<id>_vN.mp4` (o `<id>_<tema>_vN.mp4` si el bruto traía dos reels), con `_creditos-video.txt` si lleva Pexels.

## Ritmo
- Pausas apretadas (`speech_mask.py --density tight`) y voz al **108 %** (`speed: 1.08` en `cut.json`).
- En los planos de cara, **cortes con encuadre alterno** (normal / más cerca, `corte-escala-alterna`) y golpes de zoom en las ideas clave. **Nada de zoom lentísimo continuo** (`respiracion`: lo rechazó el 15 nov 2026).
- Las animaciones van en **escenas largas de 3–5 s** con varios pasos dentro (regla 34); dentro de cada escena, algo nuevo cada 1,5–2,5 s.

## Dónde va cada cosa
- **Pantalla partida recta** (lo principal): arriba la animación sobre gris claro, abajo ella; una pantalla partida larga con varias animaciones dentro, sin entrar y salir a pantalla completa entre medias. Nunca le corta la cabeza ni el pelo.
- **Ella a pantalla completa con plano más cerrado** cuando solo habla (zoom ~1,2–1,3 con origen abajo), con la cabeza entera.
- **Ella a pantalla completa + animación detrás de ella** (su recorte rembg delante): para ideas personales o conceptos.
- **Vídeo de recurso detrás del hombro**: ventana de ~600×1067 px al 60 % de opacidad, alternando el lado, con su recorte delante. Con moderación.

## Plantillas
Copiar a `<proyecto>/_herramientas/remotion-reels/src/` **manteniendo las carpetas `n1/` y `n2/`** (los ejemplos importan `../n1/common` y `../n1/ui`), renombrar y adaptar a sus palabras y tiempos. Los subtítulos de cada reel van en `src/data/<id>-captions.json` (no están en esta skill: son de cada vídeo).

| Archivo | Cuándo |
|---|---|
| `plantillas/n2/kit3.tsx` | **Partir de esta.** Piezas del estilo actual: SplitRef, Pane, PillSub, Title, DarkMsg, Phone, WinCard, Link, Receipt, Ficha, Shelf, MonthApp. |
| `plantillas/n2/ReelDBNR1368v2.tsx`, `plantillas/n2/ReelJHWI0526v2.tsx` | Los dos reels aprobados el 17 nov 2026 («Me gustan»): ejemplos de escenas completas para adaptar. |
| `plantillas/n1/common.tsx`, `plantillas/n1/ui.tsx` | Piezas básicas que usan kit3 y los ejemplos (subtítulos, tiempos, letra, palabra final). |
| `antiguo/plantillas/…` | **No usar.** Plantillas de estilos anteriores (3D suave, estilo nuevo del 15 nov, perfil de Instagram, ventana detrás del hombro). Solo de consulta: por ejemplo, el perfil de Instagram dibujado (`plantilla-reel-perfil.tsx`) puede servir de idea si vuelve a analizar un perfil. |

## Sonido
- **Sin música**: la pone ella en Instagram.
- **Un sonido variado y bajito en cada animación** (pop al aparecer, tic en los ✓, contador, trazo en líneas, golpe al tachar, whoosh suave al entrar una escena). Niveles de `COMUN/SONIDOS/CREDITOS.txt`; nunca por encima de la voz.

## Reglas aprendidas solo de Reels
Correcciones que ella ha ido haciendo en reels, con su fecha. **Al recibir una corrección nueva solo de reels, añadirla al final.**

> Las reglas se fueron sustituyendo unas a otras. Hoy mandan **34, 35 y 36** (resumidas en «Lo que manda hoy»). Las marcadas como *(historia)* describen estilos anteriores y no se aplican; las demás siguen vigentes salvo que choquen con 34–36.

1. **Más animaciones, sobre todo en el gancho** y cuando habla de contenido (8 nov 2026): que no haya tramos largos sin nada.
2. **Las animaciones nunca repiten las palabras de los subtítulos** (9 nov 2026): "si ya están las palabras en los subtítulos… hay mucho texto". Nada de títulos, píldoras ni bocadillos con frases.
3. **Gancho visual, no un titular** (9 nov 2026): p. ej. 3 tarjetas con «?» naranja que flotan y se tachan o se esfuman cuando dice «no haría».
4. **Pantallas divididas visuales** (9 nov 2026): representaciones en movimiento, como mucho una palabra suelta; nunca frases largas.
5. *(historia)* **Nada de bocadillos, letras sueltas o «sticker y ya»** (9 y 11 nov 2026): una sola pieza le parece "vacía, básica, infantil". Hacer escenas tipo app premium (paneles con piezas que se mueven).
6. *(historia)* **…pero minimalista** (11 nov 2026, v4 aprobada): una o dos piezas grandes por momento, casi sin palabras, elementos que aparecen de uno en uno, cajas grandes y rectangulares. No le gustó el escudo.
7. **Rojo para lo malo, verde para lo bueno** (11 nov 2026): interruptores que se ponen rojos o verdes justo cuando lo dice. Para «error» se puede **teñir de rojo** el vídeo de fondo.
8. *(historia)* **Elementos en «3D suave», nunca planos** (11 nov 2026): tarjetas blancas con degradado y sombras largas, piezas naranjas brillantes con reflejo y halo (ver `antiguo/plantillas/componentes-premium/`).
9. *(historia, sustituida por la 33 y la 34)* **Borde de la pantalla dividida en onda difuminada** (11 nov 2026), sin cortarle nunca el pelo ni la cabeza.
10. *(historia, sustituida por la 33 y la 34)* **Fondo de la pantalla dividida semitransparente (~55 %)** (10 nov 2026), con lo dibujado en blanco puro.
11. **Combinar pantalla dividida y animaciones detrás de ella** (10 nov 2026).
12. **Cuando nombra las partes de algo, enseñar esa parte** (10 nov 2026): p. ej. al analizar un perfil, la cámara del dibujo se acerca a cada parte cuando la nombra.
13. **Le gusta el antes/después con barra deslizante** (10 nov 2026): no quitarlo cuando encaje.
14. **Usar sus fotos cuando las deja** (9 y 10 nov 2026): p. ej. su feed de Instagram en el momento en que habla de sus fotos.
15. **Cierre «comenta PALABRA…» sin subtítulos** (9 nov 2026): solo la palabra, grande.
16. **Sonido en cada animación, sin música** (9 nov 2026): pidió "meter algún sonido con las animaciones" y quitar la música porque pone ella una más animada.
17. **Más ritmo** (9 nov 2026): pausas apretadas, voz al 108 % y un cambio cada 1,5–2,5 s.
18. **Subtítulos que no tapen las manos** (11 nov 2026): cuando gesticula, bajar o subir el bloque (en MMAW6550 se pusieron a la altura del cuello, y ≈ 1000, en vez de y ≈ 1075).
19. *(historia)* **Catálogo de animaciones aprobadas** (15 nov 2026): eligió 110 de 152 animaciones; están en `antiguo/catalogo-animaciones-antiguo.md` con sus páginas en `antiguo/catalogo/`.
20. **Lo que le gusta, en una frase** (15 nov 2026): lo limpio, funcional y que informa (datos, comparativas, diagramas, pantallas con cursor, variaciones de pantalla dividida y cambios de formato en la misma toma). Lo decorativo no (emojis que botan, bokeh, reacciones, medallas, móviles o notificaciones de adorno).
21. **Poco texto siempre** (15 nov 2026): tablas y etiquetas con 1–2 palabras o solo marcas; el texto de `error-correccion` nunca con muchas palabras.
22. **Las palabras grandes no tapan la cara** (15 nov 2026): en el golpe de zoom y en cualquier palabra destacada, colocarla abajo o a un lado, nunca sobre el rostro.
23. **Subtítulos sencillos, sin trucos** (15 nov 2026): rechazó marcador amarillo, pastilla de color, karaoke, placa de nombre, título mixto y letras que se revuelven. Solo blanco con sombra y, como mucho, la palabra clave en color (`palabra-color`). *(Desde la regla 34, en pantalla partida van en píldora gris sobre la unión.)*
24. **Transiciones permitidas** (15 nov 2026): flashazo **blanco**, barrido lateral, zoom y paneos. No: flash de color, barra de color cruzando, foto congelada, zoom atravesando una tarjeta, feed que se desliza.
25. **Tarjetas: sin movimientos de adorno** (15 nov 2026): rechazó voltear, baraja, lupa, capas con profundidad y barra de carga dentro de tarjeta. Sí: abanico, giro 3D con destello, carrusel, foco que salta entre tarjetas.
26. **Datos en pantalla: elegir los aprobados** (15 nov 2026): sí barras, línea, anillo de porcentaje, velocímetro, carrera de barras, ranking que se reordena, calendario, reloj, mapa de calor; no embudo, gráfico circular, cuatro indicadores a la vez ni pasos 1-2-3.
27. **Pantalla dividida: no el sándwich ni la diagonal** (15 nov 2026): no pantalla arriba y abajo con ella en medio, no corte inclinado, no cortina hacia abajo.
28. **Círculo de ella más grande y con más plano** (16 nov 2026): cuando aparece su círculo en una esquina, que sea grande (~400 px) y enseñe cabeza, hombros y parte del salón, no solo la cara muy ampliada.
29. **Animaciones también en pantalla dividida** (16 nov 2026): no todas a pantalla completa; mezclar según la idea.
30. **No siempre animación; planos más cerrados cuando solo habla** (16 nov 2026): si no hay animación, acercar el plano (zoom ~1,2–1,3 con origen abajo, por ejemplo `transform-origin 590px 1700px`) para que no sobre pared por arriba, siempre con la cabeza entera. Subtítulos bajos (≈ y 1560) para no tapar manos ni cara.
31. **Palabra final centrada** (16 nov 2026): «comenta PALABRA» más abajo (≈ y 330), no pegada arriba, sin tapar el pelo.
32. **Fondos de pantalla completa: puntitos algo más visibles y contenido centrado** (16 nov 2026), sin dejar la mitad de abajo vacía.
33. *(historia, sustituida por la 34 en lo visual)* **Reels = catálogo de reels, no el de YouTube; menos emojis** (16 nov 2026, v2 de BZNH7576 y GHNM8800): las animaciones de reels salían del catálogo antiguo de reels, no del de YouTube/Superwall. Pantalla dividida con ella en un panel de esquinas redondeadas que baja desde pantalla completa. Las animaciones no pueden ser solo emojis.
34. **Las animaciones salen de SUS REFERENCIAS de reels, no de iconos ni emojis** (17 nov 2026, v1 de DBNR1368 y JHWI0526 rechazada: «súper básicas, todo iconos o emoticonos que no dicen nada, muy rápido, no se sobreentiende, no bien desarrolladas; cada frase intentas meter emoticonos y queda muy cutre»). **Sustituye a la regla común 13 y a la 33 en lo visual.** Copiar el lenguaje de ` MI ESTILO/REELS/REFERENCIAS` (`igexport-*.mp4`): **pantalla partida recta** (arriba la animación sobre gris claro, ella abajo, sin esquinas redondeadas), **subtítulo en píldora gris sobre la unión** (blanco en pantalla completa), **palabra grande metálica** arriba (el concepto), y **objetos reales** que se construyen despacio: ventanas de informe, tickets, fichas/documentos que se rellenan campo a campo, móvil con **vídeo real de Pexels** dentro, tarjetas oscuras de mensaje con avatar (el texto se escribe), conexiones que se dibujan, estanterías, calendario. **Prohibido** una secuencia de iconos/emojis por frase. **Pocas escenas y largas** (3–5 s, varios pasos dentro; contenido continuo entre escenas, nunca la pantalla vacía), una pantalla partida larga con varias animaciones dentro (no entrar/salir a pantalla completa entre medias), y **texto grande y legible en móvil** (≥ 40 px las etiquetas). Se repiten objetos (el ticket del principio vuelve al final con producto, el diagrama vuelve con ✗ en «tú»). Piezas en `plantillas/n2/kit3.tsx`.
35. **Aprobada la regla 34** (17 nov 2026): le gustaron DBNR1368 v2 y JHWI0526 v2 («Me gustan»). Son la plantilla de partida para los siguientes reels: copiar `plantillas/n2/kit3.tsx` y adaptar las escenas de `ReelDBNR1368v2.tsx` / `ReelJHWI0526v2.tsx`.
36. **Textos de una sola palabra, más abajo** (17 nov 2026): la palabra grande metálica («Productos», «Dependencia», «Ficha», «Venderlos») y la palabra final «comenta PALABRA» no van pegadas arriba. En pantalla completa de ella: hacia y ≈ 280–330 (sin tapar pelo ni frente; si ella queda muy alta, bajar el plano en vez de subir la palabra). En la mitad de arriba de la pantalla partida: a la altura de y ≈ 100–150, con los objetos debajo (no a y ≈ 10–30). En `kit3.tsx` el parámetro `y` de `Title` y el `top` de `CtaWord` lo controlan.
37. **Cuando enumera recursos (lista de PDF, web o vídeos), solo portadas y subtítulos** (20 nov 2026, reel 3F1D929C): si lo pide así, nada más (sin cortes, animaciones ni sonidos). La portada de cada recurso sale grande arriba a la derecha (≈ 290 px de ancho, sin tapar cara ni mano) cuando lo nombra y, al nombrar el siguiente, **encoge y sube a una fila arriba (y ≈ 200) donde se van acumulando**, alineadas, hasta verse todas juntas al final. Portadas: las de su web `Descargas/biblioteca-recursos/img`, o la primera página del PDF si existe (más nítida). Ejemplo: `_herramientas/remotion-reels/src/n2/Reel3F1D929C.tsx`.
38. **Equilibrio: poca pantalla partida, pocos elementos, y que nada tape las flechas** (20 nov 2026, ejemplo de reel con las animaciones de sus páginas): «no abuses de pantalla dividida ni de muchos elementos». Como mucho **una pantalla partida larga por reel**. Mezclarla con animaciones a **pantalla completa**, que sean limpias pero no vacías («minimalista, no muy minimalista»), y con tramos en los que solo sale ella. En los diagramas de pasos (cuadros unidos con flechas), **las flechas van delante y enteras**: nunca tapadas por los cuadros.
39. **Aprobado el reel hecho con sus páginas** (20 nov 2026, «guay»): `EjemploReel` (DBNR1368; **v4 aprobada el 20 nov 2026**, «me gusta», con las correcciones de la regla común 16) de `comun/plantillas/catalogo/Ejemplos.tsx`. Pedido al aprobarlo: **flechas más finas** (trazo 2 de 200, no 3) y **más espacio entre elementos** (cuadros de 36 con ~34 de hueco, flechas con aire a los dos lados, etiquetas separadas debajo). Es la plantilla de partida de los reels junto con `kit3.tsx` (que sigue sirviendo para subtítulos y piezas propias).
40. **Primer reel real con sus páginas, aprobado** (21 nov 2026, «me gusta»): BBBA8ECF v2 (`comun/plantillas/catalogo/ReelBBBA8ECFv2.tsx`). Desde el segundo 0, dos tarjetas con las cifras que dice; tabla ✕/✓ con las palabras dentro de cada fila; tarjeta «lo que haces ✕ / cómo se percibe ✓»; cuadrícula con precios en la que se elige uno; tachado sobre ella, abajo para no tapar las manos; «PRECIO» que se escribe al cerrar. Sin pantalla partida, cada pieza con su palabra dentro, entre medias ella con encuadre alterno (1 / 1,08, origen abajo) y subtítulos a y ≈ 1500. Partir de este archivo para los siguientes reels.
41. **Animaciones que salen DETRÁS de ella** (21 nov 2026): pidió «añadir elementos o vídeos y que salgan por detrás del sujeto, que no se superpongan». De 56 propuestas aprobó **38** (página `reels/catalogo-detras/banco-detras.html`, solo trae las aprobadas). Cómo se hacen:
    - **Capas:** su vídeo entero de fondo → la pieza de la página → **su recorte delante** (nada la tapa nunca).
    - **Recorte:** `comun/scripts/recorte-detras.sh <video.mp4> <desde> <hasta> public/<id>/recorte-<desde>.webm` (rembg `u2net_human_seg`, local y gratis; ~1 s por fotograma). El recorte es del **mismo tramo** que la animación.
    - **En el montaje:** en la lista de tramos, `{ desde, hasta, formato: "detras", id, recorte: "<id>/recorte-<desde>.webm", cambios, sonidos }`. Si falta `recorte`, el render avisa `FALTA EL RECORTE`. En las de vídeos, `clips: ["pexels/…mp4", …]` pone clips reales (Pexels de ` MI ESTILO/COMUN/RECURSOS-PEXELS` o suyos) en los recuadros, en orden. Las posiciones de la página están pensadas para una cabeza a ~30 % de alto: si en su vídeo está más alta o más baja, mover las piezas con `cambios` (`top:`) para que asomen bien, y revisar con `npx remotion still`. Sin encuadre alterno ni zoom de ella en esos tramos (el recorte tiene que coincidir con el fondo); el subtítulo puede ir abajo (y ≈ 1500).
    - **Le gustan:** dos tarjetas por los hombros, círculo/halo tras la cabeza, tarjeta que cae y se posa, ventana web que se abre, de borrosa a nítida, llega desde el fondo; vídeos (detrás del hombro, uno a cada lado, el fondo pasa a vídeo, vídeo que crece hasta el fondo, tira de vídeos, móvil o pantalla con vídeo, ventana que cambia de vídeo, antes/después en vídeo, cuatro vídeos); cifra gigante, barras desde los hombros, línea que sube, anillo alrededor de la cabeza, lista con ticks, calendario, ticket, mensaje que se escribe, pasos en abanico, carrusel, arco de etiquetas, productos que suben, estantería, fotos; fondo a blanco, capas con profundidad, cortina de color, marco retrato, zoom con profundidad, cuadrícula, pared en dos colores, ventana que se acerca.
    - **No le gustan (no usar):** una sola tarjeta junto a la cara o que asoma por un lado (también alternando), píldora que cruza, barrido de luz, vídeo desenfocado + tarjeta, palabra gigante letra a letra, etiqueta de precio colgando, burbujas de chat, tarjetas antes/después, pila de tarjetas, conexiones, ranking, etiqueta justo encima de la cabeza, foco de luz, pared que se oscurece, círculo con palabra al lado, vídeo de fondo con palabra encima.
    - Como el resto: cada pieza con **su palabra** o algo que represente lo que dice, sonido suave al entrar, y sin abusar (una o dos por reel, mezcladas con las otras).
