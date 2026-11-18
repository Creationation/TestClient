# Karte unten bei „Besuch uns“, zum Erkunden: der ganze erste Bezirk im OSM-Stil (Straßen, Plätze,
# Gebäude, Parks, Wasser), ohne Geschäfts- und Symbol-Icons. Lokal ausgeliefert: beim Besuch keine
# Anfrage an OSM oder Google (DSGVO). Daten © OpenStreetMap-Mitwirkende (ODbL).
#
# Zwei Bilder im selben Stil: der Bezirk in Zoom 17 (leicht, lädt schnell) und darüber, genau
# deckungsgleich, die Umgebung des Salons in Zoom 18 doppelt scharf, damit es beim Hineinzoomen
# rund um den Salon gestochen bleibt.
#
# Daten (einmal, siehe Kopf von build-map.mjs für das Muster):
#   curl -s -A "gelati-am-dom-map/1.0" --data-urlencode 'data=[out:json][timeout:150];(way["building"](48.1995,16.3550,48.2195,16.3870);
#     relation["building"](…);way["highway"](…);way["place"="square"](…);way["area:highway"](…);way["leisure"="park"](…);
#     relation["leisure"="park"](…);way["leisure"="garden"](…);way["landuse"="grass"](…);way["natural"="water"](…);
#     relation["natural"="water"](…);way["waterway"="riverbank"](…););out geom;' https://overpass-api.de/api/interpreter -o scripts/carte-dom/district.json
#   python scripts/osm-district.py   → public/images/osm-district.webp, osm-district-detail.webp, src/data/visit-map.json
import json, math
from PIL import Image, ImageDraw

SOUTH, WEST, NORTH, EAST = 48.1995, 16.3550, 48.2195, 16.3870
SHOP = (48.2085676, 16.3746127)
DETAIL_CENTER = (48.20858, 16.37400)   # wie das bisherige Bild: Salon und Dom
DETAIL_W, DETAIL_H = 900, 720           # Pixel bei Zoom 18
DOM_ID = 212496461

BG = (242, 239, 233)
GRASS = (205, 235, 176)
WATER = (170, 211, 223)
PLAZA = (221, 221, 232)
BUILDING = (217, 208, 201)
BUILDING_LINE = (196, 182, 171)
DOM = (201, 186, 168)
DOM_LINE = (165, 145, 122)
CASING = (205, 199, 191)
ROAD = (255, 255, 255)
ROADS = {  # Breite in Pixeln bei Zoom 18
    'motorway': 18, 'trunk': 18, 'primary': 16, 'secondary': 15, 'tertiary': 13, 'residential': 11,
    'living_street': 11, 'unclassified': 11, 'pedestrian': 10, 'service': 6, 'busway': 8,
}

# Orte, die man zum Orientieren kennt (Beschriftung als HTML über der Karte)
PLACES = [
    ('Graben', 48.20870, 16.36990),
    ('Kärntner Straße', 48.20480, 16.37060),
    ('Staatsoper', 48.20300, 16.36900),
    ('Albertina', 48.20440, 16.36810),
    ('Hofburg', 48.20660, 16.36560),
    ('Burggarten', 48.20430, 16.36610),
    ('Volksgarten', 48.20890, 16.36140),
    ('Freyung', 48.21130, 16.36590),
    ('Am Hof', 48.21060, 16.36800),
    ('Schwedenplatz', 48.21160, 16.37810),
    ('Donaukanal', 48.21430, 16.37500),
    ('Stadtpark', 48.20480, 16.37980),
    ('Rathaus', 48.21080, 16.35730),
    ('Wollzeile', 48.20830, 16.37720),
]

data = json.load(open('scripts/carte-dom/district.json', encoding='utf-8'))['elements']


def mercator(lat, lon, z):
    n = 2 ** z * 256
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y


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


def render(z, x0, y0, w, h, scale, ss=2):
    """Ausschnitt ab Pixel x0/y0 (Zoom z), w × h groß, `scale`-fach ausgegeben."""
    k = scale * ss
    road = 2 ** (z - 18)  # Straßenbreiten gelten für Zoom 18
    img = Image.new('RGB', (round(w * k), round(h * k)), BG)
    d = ImageDraw.Draw(img)

    def P(g):
        x, y = mercator(g['lat'], g['lon'], z)
        return ((x - x0) * k, (y - y0) * k)

    def poly(geom, fill, outline=None, width=0):
        pts = [P(g) for g in geom]
        if len(pts) > 2:
            d.polygon(pts, fill=fill, outline=outline, width=width)

    for e, g, _ in areas(lambda t, e: closed(e) and (t.get('landuse') == 'grass' or t.get('leisure') in ('park', 'garden'))):
        poly(g, GRASS)
    for e, g, inner in areas(lambda t, e: closed(e) and (t.get('natural') == 'water' or t.get('waterway') == 'riverbank')):
        poly(g, WATER)
    for e, g, _ in areas(lambda t, e: closed(e) and (t.get('place') == 'square' or 'area:highway' in t or (t.get('highway') == 'pedestrian' and t.get('area') == 'yes'))):
        poly(g, PLAZA)
    lines = [e for e in data if e['type'] == 'way' and e.get('tags', {}).get('highway') in ROADS and e['tags'].get('area') != 'yes' and e.get('geometry')]
    for casing in (True, False):
        for e in lines:
            hw = e['tags']['highway']
            wd = max(1, (ROADS[hw] * road + (2 * max(road, 0.5) if casing else 0)) * k)
            col = CASING if casing else (PLAZA if hw == 'pedestrian' else ROAD)
            pts = [P(g) for g in e['geometry']]
            d.line(pts, fill=col, width=round(wd), joint='curve')
            r = wd / 2
            for x, y in (pts[0], pts[-1]):
                d.ellipse([x - r, y - r, x + r, y + r], fill=col)
    for e, g, inner in areas(lambda t, e: 'building' in t and closed(e)):
        is_dom = e['id'] == DOM_ID
        poly(g, DOM if is_dom else BUILDING, DOM_LINE if is_dom else BUILDING_LINE, width=max(1, round((2 if is_dom else 1) * k * road)))
        for hole in inner:
            poly(hole, BG)
    return img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)


# Bezirk in Zoom 17
Z = 17
bx0, by0 = mercator(NORTH, WEST, Z)
bx1, by1 = mercator(SOUTH, EAST, Z)
BW, BH = bx1 - bx0, by1 - by0
render(Z, bx0, by0, BW, BH, 1).save('public/images/osm-district.webp', quality=82, method=6)

# Umgebung des Salons in Zoom 18, doppelt scharf
cx, cy = mercator(*DETAIL_CENTER, 18)
dx0, dy0 = cx - DETAIL_W / 2, cy - DETAIL_H / 2
render(18, dx0, dy0, DETAIL_W, DETAIL_H, 2).save('public/images/osm-district-detail.webp', quality=82, method=6)

# Lagen in Bruchteilen des Bezirksbilds (0..1)
def frac(lat, lon):
    x, y = mercator(lat, lon, Z)
    return [round((x - bx0) / BW, 5), round((y - by0) / BH, 5)]

dom = next(e for e in data if e['id'] == DOM_ID)
dlat = sum(g['lat'] for g in dom['geometry']) / len(dom['geometry'])
dlon = sum(g['lon'] for g in dom['geometry']) / len(dom['geometry'])
out = {
    'width': round(BW),
    'height': round(BH),
    # Detailbild: Zoom 18 = doppelte Pixel von Zoom 17
    'detail': [round((dx0 / 2 - bx0) / BW, 5), round((dy0 / 2 - by0) / BH, 5), round(DETAIL_W / 2 / BW, 5), round(DETAIL_H / 2 / BH, 5)],
    'shop': frac(*SHOP),
    'dom': frac(dlat, dlon),
    'places': [[name, *frac(lat, lon)] for name, lat, lon in PLACES],
}
json.dump(out, open('src/data/visit-map.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(out['width'], out['height'], out['detail'], out['shop'], out['dom'])
