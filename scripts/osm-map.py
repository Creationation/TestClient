# Karte unten bei „Besuch uns“: OpenStreetMap-Karte im OSM-Stil, aber nur mit dem Wesentlichen
# (Straßen, Plätze, Gebäude, Stephansdom), ohne Geschäfts- und Symbol-Icons. Aus den OSM-Daten in
# scripts/carte-dom/area.json gezeichnet (siehe build-map.mjs, Schritt 1), lokal ausgeliefert:
# beim Besuch keine Anfrage an OSM oder Google (DSGVO). Daten © OpenStreetMap-Mitwirkende (ODbL).
#   python scripts/osm-map.py   → public/images/osm-visit.jpg + Lage von Salon und Dom in %
import json, math
from PIL import Image, ImageDraw

SHOP = (48.2085676, 16.3746127)   # Eingang Salon
CENTER = (48.20858, 16.37400)      # zwischen Salon und Dom, damit beide im Bild sind
Z = 18                              # Maßstab wie Kachelzoom 18
W, H = 640, 512                     # Ausschnitt in Pixeln bei Zoom 18
OUT = 2                             # Ausgabe 2x (scharf auf Handys)
SS = 3                              # intern größer gezeichnet, dann verkleinert (weiche Kanten)
DOM_ID = 212496461

# OSM-Farben (Standardstil), leicht beruhigt
BG = (242, 239, 233)
GRASS = (205, 235, 176)
PLAZA = (221, 221, 232)
BUILDING = (217, 208, 201)
BUILDING_LINE = (196, 182, 171)
DOM = (201, 186, 168)
DOM_LINE = (165, 145, 122)
CASING = (205, 199, 191)
ROAD = (255, 255, 255)
ROADS = {  # Breite in Pixeln bei Zoom 18
    'primary': 16, 'secondary': 15, 'tertiary': 13, 'residential': 11, 'living_street': 11,
    'unclassified': 11, 'pedestrian': 10, 'service': 6, 'busway': 8,
}


def px(lat, lon):
    n = 2 ** Z * 256
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y


cx, cy = px(*CENTER)
x0, y0 = cx - W / 2, cy - H / 2
K = OUT * SS


def P(g):
    x, y = px(g['lat'], g['lon'])
    return ((x - x0) * K, (y - y0) * K)


def rings(members):
    """Teilstücke einer Relation zu geschlossenen Ringen zusammensetzen."""
    segs = [[(g['lat'], g['lon']) for g in m['geometry']] for m in members if m.get('geometry')]
    out = []
    while segs:
        ring = segs.pop(0)
        changed = True
        while ring[0] != ring[-1] and changed:
            changed = False
            for i, s in enumerate(segs):
                if s[0] == ring[-1]:
                    ring = ring + s[1:]
                elif s[-1] == ring[-1]:
                    ring = ring + s[::-1][1:]
                elif s[-1] == ring[0]:
                    ring = s[:-1] + ring
                elif s[0] == ring[0]:
                    ring = s[::-1][:-1] + ring
                else:
                    continue
                segs.pop(i)
                changed = True
                break
        out.append([{'lat': a, 'lon': b} for a, b in ring])
    return out


data = json.load(open('scripts/carte-dom/area.json', encoding='utf-8'))['elements']
img = Image.new('RGB', (W * K, H * K), BG)
d = ImageDraw.Draw(img)


def poly(geom, fill, outline=None, width=0):
    pts = [P(g) for g in geom]
    if len(pts) > 2:
        d.polygon(pts, fill=fill, outline=outline, width=width)


def areas(pred):
    for e in data:
        t = e.get('tags', {})
        if not pred(t, e):
            continue
        if e['type'] == 'way' and e.get('geometry'):
            yield e, e['geometry'], []
        elif e['type'] == 'relation':
            inner = rings([m for m in e.get('members', []) if m.get('role') == 'inner'])
            for r in rings([m for m in e.get('members', []) if m.get('role') != 'inner']):
                yield e, r, inner


def closed(e):
    return e['type'] == 'relation' or bool(e.get('geometry') and e['geometry'][0] == e['geometry'][-1])


# 1. Grün
for e, g, _ in areas(lambda t, e: closed(e) and (t.get('landuse') == 'grass' or t.get('leisure') == 'park')):
    poly(g, GRASS)
# 2. Plätze und Fußgängerflächen
for e, g, _ in areas(lambda t, e: closed(e) and (t.get('place') == 'square' or 'area:highway' in t or (t.get('highway') == 'pedestrian' and t.get('area') == 'yes'))):
    poly(g, PLAZA)
# 3. Straßen: erst die Ränder, dann die Füllung
lines = [e for e in data if e['type'] == 'way' and e.get('tags', {}).get('highway') in ROADS and e['tags'].get('area') != 'yes' and e.get('geometry')]
for casing in (True, False):
    for e in lines:
        hw = e['tags']['highway']
        w = (ROADS[hw] + (2 if casing else 0)) * K
        col = CASING if casing else (PLAZA if hw == 'pedestrian' else ROAD)
        pts = [P(g) for g in e['geometry']]
        d.line(pts, fill=col, width=round(w), joint='curve')
        r = w / 2
        for x, y in (pts[0], pts[-1]):
            d.ellipse([x - r, y - r, x + r, y + r], fill=col)
# 4. Gebäude (Innenhöfe wieder ausgespart), der Dom hervorgehoben
dom_pts = []
for e, g, inner in areas(lambda t, e: 'building' in t and closed(e)):
    is_dom = e['id'] == DOM_ID
    poly(g, DOM if is_dom else BUILDING, DOM_LINE if is_dom else BUILDING_LINE, width=(2 if is_dom else 1) * K)
    for h in inner:
        poly(h, BG)
    if is_dom:
        dom_pts += [P(x) for x in g]

img = img.resize((W * OUT, H * OUT), Image.LANCZOS)
img.save('public/images/osm-visit.jpg', quality=88, optimize=True, progressive=True)

sx, sy = px(*SHOP)
print(f'Salon: left {100 * (sx - x0) / W:.2f} %, top {100 * (sy - y0) / H:.2f} %')
if dom_pts:
    dx = sum(p[0] for p in dom_pts) / len(dom_pts) / K
    dy = sum(p[1] for p in dom_pts) / len(dom_pts) / K
    print(f'Dom:   left {100 * dx / W:.2f} %, top {100 * dy / H:.2f} %')
