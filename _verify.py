import urllib.request
import re
import sys

base = "http://127.0.0.1:8765"
paths = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/app.js",
    "/js/data.js",
    "/favicon.svg",
    "/img/hero-dia.jpg",
    "/img/hero-noche.jpg",
    "/img/food-medialunas.jpg",
    "/img/food-brindis.jpg",
    "/img/food-ensalada.jpg",
    "/img/food-submarino.jpg",
    "/img/food-sandwich.jpg",
    "/img/patio-joda.jpg",
]
ok = True
for p in paths:
    try:
        r = urllib.request.urlopen(base + p, timeout=8)
        print("OK", r.status, r.getheader("Content-Type"), r.getheader("Content-Length"), p)
    except Exception as e:
        ok = False
        print("FAIL", p, e)

html = urllib.request.urlopen(base + "/", timeout=8).read().decode("utf-8", "replace")
css = urllib.request.urlopen(base + "/css/styles.css", timeout=8).read().decode("utf-8", "replace")
js = urllib.request.urlopen(base + "/js/app.js", timeout=8).read().decode("utf-8", "replace")
data = urllib.request.urlopen(base + "/js/data.js", timeout=8).read().decode("utf-8", "replace")

checks = [
    ("lang es-AR", 'lang="es-AR"' in html),
    ("jsonld", "application/ld+json" in html),
    ("og:image", "og:image" in html),
    ("favicon", "favicon.svg" in html),
    ("no jsdelivr", "jsdelivr" not in html + js + data),
    ("no horario inventado", "Domingo cerrado" not in html and "8 a 00" not in html),
    ("hero-dia in html", "img/hero-dia.jpg" in html),
    ("hero-noche in html", "img/hero-noche.jpg" in html),
    ("form nombre", 'name="nombre"' in html),
    ("form personas", 'name="personas"' in html),
    ("form fecha", 'name="fecha"' in html),
    ("form hora", 'name="hora"' in html),
    ("form comentario", 'name="comentario"' in html),
    ("nav carta", 'href="#carta"' in html),
    ("nav local", 'href="#local"' in html),
    ("nav reservar", 'href="#reservar"' in html),
    ("wa 549", "5493878534824" in data),
    ("sheetExec vacio", 'sheetExec: ""' in data),
    ("full bleed", "100vw" in css and "100svh" in css),
    ("44px", "min-height:44px" in css),
    ("reduced-motion", "prefers-reduced-motion" in css and "prefers-reduced-motion" in js),
    ("no Texas", "Texas" not in html),
    ("no DEMO", "DEMO" not in html),
    ("no Nubicom", "Nubicom" not in html),
]
for name, val in checks:
    print(("OK" if val else "FAIL"), name)
    if not val:
        ok = False

srcs = re.findall(r'(?:src|href)="([^"]+)"', html)
local = [
    s
    for s in srcs
    if s.startswith("img/")
    or s.startswith("css/")
    or s.startswith("js/")
    or s.endswith(".svg")
]
print("LOCAL ASSETS", local)
for s in local:
    try:
        r = urllib.request.urlopen(base + "/" + s, timeout=8)
        print("OK asset", s, r.status, r.getheader("Content-Length"))
    except Exception as e:
        print("FAIL asset", s, e)
        ok = False

print("PASS" if ok else "FAIL OVERALL")
sys.exit(0 if ok else 1)
