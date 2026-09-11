(function () {
  var D = window.PAUSA;
  if (!D) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var waBase = "https://wa.me/" + D.whatsapp + "?text=";

  function wa(text) {
    return waBase + encodeURIComponent(text || "Hola Pausa, quiero una mesa o la carta.");
  }

  /* En Vercel las JPG van por jsDelivr del commit publicado (deploy MCP no aguanta el tree con fotos). Local = relativo. */
  var BASE = location.hostname.indexOf("vercel.app") !== -1
    ? "https://cdn.jsdelivr.net/gh/joset9536/pausa-resto-bar@333c561/"
    : "";

  function asset(path) {
    return BASE + path;
  }

  document.querySelectorAll("img[src^='img/']").forEach(function (im) {
    im.src = asset(im.getAttribute("src"));
  });

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = wa();
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-maps]").forEach(function (el) {
    el.href = D.maps;
  });
  document.querySelectorAll("[data-ig]").forEach(function (el) {
    el.href = D.instagram;
  });
  document.querySelectorAll("[data-fb]").forEach(function (el) {
    el.href = D.facebook;
  });
  document.querySelectorAll("[data-tel]").forEach(function (el) {
    el.href = "tel:" + D.phoneTel;
  });

  var slides = document.getElementById("heroSlides");
  var dots = document.getElementById("heroDots");
  var idx = 0;
  var hour = new Date().getHours();
  var night = hour < 7 || hour >= 19;
  if (slides && dots && D.hero && D.hero.length) {
    if (night && D.hero.length > 1) idx = 0;
    else if (!night && D.hero.length > 1) idx = 1;
    D.hero.forEach(function (h, i) {
      var img = document.createElement("img");
      img.src = asset(h.src);
      img.alt = h.alt;
      if (i === idx) img.className = "on";
      slides.appendChild(img);
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", h.label);
      if (i === idx) b.className = "on";
      b.addEventListener("click", function () { show(i); });
      dots.appendChild(b);
    });
  }

  function show(n) {
    if (!slides) return;
    var imgs = slides.querySelectorAll("img");
    var ds = dots ? dots.querySelectorAll("button") : [];
    if (!imgs.length) return;
    idx = (n + imgs.length) % imgs.length;
    imgs.forEach(function (im, i) { im.classList.toggle("on", i === idx); });
    ds.forEach(function (d, i) { d.classList.toggle("on", i === idx); });
  }

  if (!reduce && slides && D.hero && D.hero.length > 1) {
    setInterval(function () { show(idx + 1); }, 5200);
  }

  var track = document.getElementById("favTrack");
  if (track && D.favoritos) {
    D.favoritos.forEach(function (f) {
      var art = document.createElement("article");
      art.className = "card-food";
      art.innerHTML = "<img src=\"" + asset(f.src) + "\" alt=\"" + f.title + "\" loading=\"lazy\"><p>" + f.title + "</p>";
      track.appendChild(art);
    });
  }
  var prev = document.querySelector("[data-track-prev]");
  var next = document.querySelector("[data-track-next]");
  function step() {
    return Math.min(320, (track && track.clientWidth * 0.78) || 280);
  }
  if (prev && track) {
    prev.onclick = function () { track.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }); };
  }
  if (next && track) {
    next.onclick = function () { track.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }); };
  }
  if (!reduce && track) {
    setInterval(function () {
      var max = track.scrollWidth - track.clientWidth;
      if (max < 24) return;
      if (track.scrollLeft >= max - 16) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: step(), behavior: "smooth" });
    }, 4200);
  }

  var patio = document.getElementById("patio");
  if (patio && D.patio) {
    D.patio.forEach(function (p) {
      var fig = document.createElement("figure");
      fig.innerHTML = "<img src=\"" + asset(p.src) + "\" alt=\"" + p.title + "\" loading=\"lazy\"><figcaption>" + p.title + "</figcaption>";
      patio.appendChild(fig);
    });
  }

  var form = document.getElementById("reservaForm");
  var ok = document.getElementById("formOk");
  var fecha = form && form.querySelector('[name="fecha"]');
  if (fecha) {
    var t = new Date();
    var m = String(t.getMonth() + 1).padStart(2, "0");
    var d = String(t.getDate()).padStart(2, "0");
    fecha.min = t.getFullYear() + "-" + m + "-" + d;
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var lines = [
        "Reserva PAUSA",
        "Nombre: " + (fd.get("nombre") || ""),
        "Tel: " + (fd.get("tel") || ""),
        "Personas: " + (fd.get("personas") || ""),
        "Motivo: " + (fd.get("motivo") || ""),
        "Fecha: " + (fd.get("fecha") || ""),
        "Hora: " + (fd.get("hora") || "")
      ];
      if (fd.get("comentario")) lines.push("Comentario: " + fd.get("comentario"));
      if (ok) ok.hidden = false;
      window.open(wa(lines.join("\n")), "_blank");
    });
  }
})();