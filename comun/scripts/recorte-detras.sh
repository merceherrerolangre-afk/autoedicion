#!/bin/zsh
# Recorte de la persona (con transparencia) para las animaciones de «detrás de ti» (21 nov 2026).
# Todo en este ordenador y gratis: rembg con el modelo u2net_human_seg (en ~/.rembg/models o ~/.u2net).
# Saca el tramo [desde, hasta] del vídeo, recorta cada fotograma, suaviza el borde y guarda un WebM con
# transparencia usando los píxeles ORIGINALES (máxima calidad; de rembg solo se usa la máscara).
# Uso: recorte-detras.sh <video.mp4> <desde-segundos> <hasta-segundos> <salida.webm>
# Tiempo: ~1 s por fotograma (un tramo de 3 s ≈ 90 fotogramas ≈ 1,5–2 min) + ~45 s la primera vez.
# En Remotion: <Animacion formato="detras" ... recorte="<id>/recorte-<desde>.webm" /> (en un Tramo, poner formato:"detras").
set -e
export PATH=$HOME/.local/bin:$PATH
SRC=$1; DESDE=$2; HASTA=$3; OUT=$4
[[ -z "$OUT" ]] && { echo "Uso: recorte-detras.sh <video.mp4> <desde> <hasta> <salida.webm>"; exit 1; }
TMP=$(mktemp -d)
trap 'rm -rf "${TMP:?}"' EXIT
mkdir -p "$TMP/in" "$TMP/out"
DUR=$(echo "$HASTA - $DESDE" | bc -l)
ffmpeg -hide_banner -loglevel error -y -ss "$DESDE" -i "$SRC" -t "$DUR" -an -vsync 0 "$TMP/in/%05d.png"
N=$(ls "$TMP/in" | wc -l | tr -d ' ')
echo "Recortando $N fotogramas (≈ $N s)…"
rembg p -m u2net_human_seg "$TMP/in" "$TMP/out" >/dev/null 2>&1
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$SRC")
# máscara: canal de transparencia de rembg, borde 1 px hacia dentro y suavizado; media de 3 fotogramas contra parpadeo
ffmpeg -hide_banner -loglevel error -y -ss "$DESDE" -i "$SRC" -framerate "$FPS" -i "$TMP/out/%05d.png" \
  -filter_complex "[1:v]alphaextract,erosion,gblur=sigma=1.2,tmix=frames=3:weights='1 2 1'[m];[0:v]setpts=PTS-STARTPTS[v];[m]setpts=PTS-STARTPTS[mm];[v][mm]alphamerge,format=yuva420p" \
  -frames:v "$N" -an -c:v libvpx-vp9 -crf 8 -b:v 0 -pix_fmt yuva420p -auto-alt-ref 0 "$OUT"
echo "ok $N fotogramas -> $OUT"
