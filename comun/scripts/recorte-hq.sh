#!/bin/zsh
# Rehace en alta calidad un recorte de rembg hecho con matte.py (que lo guarda a 3 Mbps).
# Usa solo la máscara del recorte y los píxeles del corte en bruto (final.mp4).
# Uso: recorte-hq.sh <final.mp4> <recorte-de-matte.webm> <segundo-inicio> <salida.webm>
set -e
export PATH=$HOME/.local/bin:$PATH
SRC=$1; MATTE=$2; FROM=$3; OUT=$4
N=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$MATTE")
ffmpeg -hide_banner -loglevel error -y -ss "$FROM" -i "$SRC" -c:v libvpx-vp9 -i "$MATTE" \
  -filter_complex "[1:v]alphaextract[m];[0:v]setpts=PTS-STARTPTS[v];[m]setpts=PTS-STARTPTS[mm];[v][mm]alphamerge,format=yuva420p" \
  -frames:v "$N" -an -c:v libvpx-vp9 -crf 8 -b:v 0 -pix_fmt yuva420p -auto-alt-ref 0 "$OUT"
echo "ok $N fotogramas -> $OUT"
