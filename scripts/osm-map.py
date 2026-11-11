# Karte unten bei „Besuch uns“: echte OpenStreetMap-Karte als Bild, einmalig erzeugt und lokal ausgeliefert
# (beim Besuch keine Anfrage an OSM oder Google, DSGVO). Kacheln © OpenStreetMap-Mitwirkende (ODbL).
#   python scripts/osm-map.py   → public/images/osm-visit.jpg + Lage des Salons in %
import io, math, time, urllib.request
from PIL import Image

SHOP = (48.2085676, 16.3746127)   # Eingang Salon
CENTER = (48.20858, 16.37400)      # zwischen Salon und Dom, damit beide im Bild sind
Z = 18                              # Kachelzoom (256 px je Kachel)
W, H = 640, 512                     # Ausschnitt in Kachelpixeln (= CSS-Pixel, Schrift in Originalgröße)
UA = 'gelati-am-dom-site-build/1.0 (statische Karte, einmalig)'


def px(lat, lon):
    n = 2 ** Z * 256
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y


cx, cy = px(*CENTER)
x0, y0 = cx - W / 2, cy - H / 2
canvas = Image.new('RGB', (W, H))
for tx in range(int(x0 // 256), int((x0 + W) // 256) + 1):
    for ty in range(int(y0 // 256), int((y0 + H) // 256) + 1):
        req = urllib.request.Request(f'https://tile.openstreetmap.org/{Z}/{tx}/{ty}.png', headers={'User-Agent': UA})
        tile = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert('RGB')
        canvas.paste(tile, (round(tx * 256 - x0), round(ty * 256 - y0)))
        time.sleep(0.2)

# 2x hochgerechnet: auf Handy-Bildschirmen weich statt pixelig
canvas.resize((W * 2, H * 2), Image.LANCZOS).save('public/images/osm-visit.jpg', quality=84, optimize=True, progressive=True)
sx, sy = px(*SHOP)
print(f'Salon bei left {100 * (sx - x0) / W:.2f} %, top {100 * (sy - y0) / H:.2f} %')
