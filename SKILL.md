---
name: autoedicion
description: Autoedición de sus vídeos hablando a cámara, desde el bruto hasta el vídeo listo, con su estilo y sus reglas. Decide primero si es un Reel (vertical 1080×1920, corto) o un vídeo de YouTube (horizontal 1920×1080, largo) y sigue la parte de ese formato. Úsala cuando pida editar o montar un vídeo, un reel, un vídeo corto o vertical, un vídeo de YouTube, largo u horizontal, «el nuevo bruto», o hacer una corrección (v2, v3…) de un vídeo ya entregado.
---

# Autoedición (Reels y YouTube)

Una sola skill para los dos formatos. Primero se decide el formato; después se leen **solo** dos archivos: lo común y la parte de ese formato. Las reglas de un formato nunca se aplican al otro.

## Carpeta del proyecto

Todas las rutas de esta skill empiezan en la carpeta del proyecto, que aquí se escribe `<proyecto>`:

- `<proyecto>` = `~/Documents/EDICIÓN DE VÍDEOS`

Si la carpeta se mueve o se renombra, solo hay que cambiar esta línea. Al empezar, comprobar que existe; si no, buscar la parecida, avisarla y no inventar rutas.

## Paso 0 · Decidir el formato (siempre, antes de nada)

Ir en este orden y parar en cuanto quede claro:

1. **Lo que ella diga.**
   - «reel», «vídeo corto», «vertical», «para Instagram» → **Reels**.
   - «YouTube», «YT», «vídeo largo», «horizontal» → **YouTube**.
2. **Dónde está el bruto.**
   - En `<proyecto>/EDICIÓN DE REELS/1. BRUTOS/REELS` → **Reels**.
   - En `<proyecto>/EDICIÓN DE YT/BRUTOS` → **YouTube**.
3. **La forma del vídeo** (con `ffprobe`, teniendo en cuenta la rotación): más alto que ancho → **Reels**; más ancho que alto → **YouTube**.
4. Si sigue sin estar claro: **preguntarle** (una sola pregunta, con las dos opciones).

Decirle en una frase qué formato se va a usar y por qué (por ejemplo: «Es un reel: está en la carpeta de brutos de reels»).

## Paso 1 · Leer lo que toca

| Formato | Leer, en este orden |
|---|---|
| Reels | `comun/COMUN.md` → `reels/REELS.md` |
| YouTube | `comun/COMUN.md` → `youtube/YOUTUBE.md` |

`COMUN.md` tiene los pasos de trabajo, la calidad, lo que nunca se hace, las herramientas y las reglas aprendidas comunes. Cada archivo de formato tiene sus carpetas, su formato, su ritmo, su sonido, sus plantillas y sus reglas aprendidas propias.

## Qué hay en esta skill

| Carpeta | Qué hay |
|---|---|
| `comun/` | `COMUN.md`, el catálogo de animaciones de estilo nuevo (`catalogo-animaciones.md` + páginas en `catalogo/`) y programas de ayuda (`scripts/`) |
| `reels/` | `REELS.md`, la plantilla de partida (`plantillas/`) y lo antiguo solo de consulta (`antiguo/`) |
| `youtube/` | `YOUTUBE.md` y sus plantillas y programas (`scripts/`) |

## Cómo leer esta skill (para el modelo)

- Todas las rutas a archivos de la skill son **relativas a la carpeta de este `SKILL.md`** (por ejemplo, `comun/COMUN.md`). Las que empiezan por `<proyecto>` son carpetas de ella, fuera de la skill.
- Leer `comun/COMUN.md` y el archivo del formato **enteros** antes de editar; no basta con buscar trozos.
- Si dos reglas chocan, seguir «Orden si algo choca» de `comun/COMUN.md`. Dentro de las reglas aprendidas, manda la más reciente; las marcadas *(historia)* no se aplican.
- No leer `reels/antiguo/` salvo que ella pida algo de un estilo anterior.
- **Nombres antiguos:** hasta el 20 nov 2026 esto eran dos skills, `edicion-reels` y `edicion-youtube`. Si una nota, una memoria o un mensaje las nombra, se refiere a `reels/REELS.md` o a `youtube/YOUTUBE.md` de esta skill. Lo que antes era «común, idéntico en las dos skills» ahora está una sola vez en `comun/COMUN.md`.

## Correcciones nuevas

Cuando ella corrija algo, escribirlo como regla con su fecha:
- Si vale para los dos formatos → «Reglas aprendidas comunes» de `comun/COMUN.md`.
- Si es solo de un formato → «Reglas aprendidas» de `reels/REELS.md` o de `youtube/YOUTUBE.md`.
