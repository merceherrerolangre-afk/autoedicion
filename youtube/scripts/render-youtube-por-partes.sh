#!/bin/zsh
# Render de un vídeo largo de YouTube por partes (solo imagen) y unión sin recomprimir.
# El sonido se mezcla aparte con master_audio.py.
#
# Uso:
#   render-youtube-por-partes.sh <Composición> <fotogramas-totales> <carpeta-de-trabajo> [partes]
# Ejemplo:
#   render-youtube-por-partes.sh YtABCD1234v1 46354 "$HOME/Documents/EDICIÓN DE VÍDEOS/edit/ABCD1234" 6
#
# Se ejecuta desde cualquier sitio; la carpeta de Remotion se puede cambiar con la variable REMOTION.
# Si se corta (por ejemplo, al apagar el ordenador), al relanzarlo se salta las partes ya hechas.

COMP=$1; N=$2; E=$3; P=${4:-6}
REMOTION=${REMOTION:-"$HOME/Documents/EDICIÓN DE VÍDEOS/_herramientas/remotion-reels"}
if [[ -z "$COMP" || -z "$N" || -z "$E" ]]; then
  echo "Uso: $0 <Composición> <fotogramas-totales> <carpeta-de-trabajo> [partes]"; exit 1
fi
cd "$REMOTION" || exit 1
OUTDIR="$E/partes-$COMP"
mkdir -p "$OUTDIR"
STEP=$(( (N + P - 1) / P ))
Q=(--codec=h264 --image-format=jpeg --jpeg-quality=100 --crf=12 --x264-preset=slow --concurrency=4 --timeout=120000 --muted --log=error)
for i in $(seq 0 $((P-1))); do
  a=$(( i * STEP )); b=$(( (i+1) * STEP - 1 )); (( b > N-1 )) && b=$((N-1))
  out="$OUTDIR/parte$i.mp4"
  [ -s "$out" ] && { echo "parte $i ya hecha"; continue; }
  for intento in 1 2; do
    echo "parte $i ($a-$b) intento $intento: $(date +%H:%M)"
    npx remotion render src/index.ts "$COMP" "$out" --frames=$a-$b "${Q[@]}" > "$OUTDIR/parte$i.log" 2>&1 && break
    rm -f "$out"
  done
  [ -s "$out" ] || { echo "FALLO parte $i"; exit 1; }
done
: > "$OUTDIR/lista.txt"
for i in $(seq 0 $((P-1))); do printf "file '%s'\n" "$OUTDIR/parte$i.mp4" >> "$OUTDIR/lista.txt"; done
"$HOME/.local/bin/ffmpeg" -hide_banner -loglevel error -y -f concat -safe 0 -i "$OUTDIR/lista.txt" -c copy "$OUTDIR/imagen.mp4" || { echo "FALLO union"; exit 1; }
echo "LISTO $(date +%H:%M) -> $OUTDIR/imagen.mp4"
