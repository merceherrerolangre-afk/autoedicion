# Cama musical por tramos: varias pistas CC0 (p. ej. calma → ritmo → cálida), en bucle con fundidos.
# Uso: python-reels musica-por-tramos.py <carpeta-con-las-pistas>
#   Deja en esa carpeta "fondo.wav", listo para master_audio.py --music fondo.wav --gap 20.
# CAMBIAR para cada vídeo: TOTAL (segundos del vídeo limpio) y TRAMOS (pista, segundo de inicio, segundo de fin).
import subprocess, json, os, sys
F = os.path.expanduser("~/.local/bin/ffmpeg")
D = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__)) + "/sonido"
TOTAL = 773.34
TRAMOS = [("musica1.mp3", 0.0, 274.9), ("musica2.mp3", 274.9, 603.6), ("musica3.mp3", 603.6, TOTAL)]
XF = 3.0
def run(a): subprocess.run([F, "-hide_banner", "-loglevel", "error", "-y"] + a, check=True)
def dur(f):
    o = subprocess.run([F.replace("ffmpeg", "ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout
    return float(o)
parts = []
for i, (m, a, b) in enumerate(TRAMOS):
    need = (b - a) + (XF if i < len(TRAMOS) - 1 else 0) + (XF if i else 0)
    norm = f"{D}/_n{i}.wav"
    run(["-i", f"{D}/{m}", "-af", "loudnorm=I=-20:TP=-2:LRA=11", "-ar", "48000", "-ac", "2", norm])
    d = dur(norm); copies = int(need // (d - 2)) + 1
    # bucle: copias unidas con fundido de 2 s
    cur = norm
    for c in range(1, copies):
        nxt = f"{D}/_l{i}_{c}.wav"
        run(["-i", cur, "-i", norm, "-filter_complex", "acrossfade=d=2:c1=tri:c2=tri", nxt]); cur = nxt
    seg = f"{D}/_s{i}.wav"
    run(["-i", cur, "-t", f"{need:.3f}", "-af", f"afade=t=in:d={0.5 if i == 0 else 0.01}", seg])
    parts.append(seg)
cur = parts[0]
for i in range(1, len(parts)):
    nxt = f"{D}/_c{i}.wav"
    run(["-i", cur, "-i", parts[i], "-filter_complex", f"acrossfade=d={XF}:c1=qsin:c2=qsin", nxt]); cur = nxt
run(["-i", cur, "-t", f"{TOTAL:.3f}", "-af", f"afade=t=out:st={TOTAL-4:.3f}:d=4", f"{D}/fondo.wav"])
for f in os.listdir(D):
    if f.startswith("_"): os.remove(f"{D}/{f}")
print("ok", dur(f"{D}/fondo.wav"))
