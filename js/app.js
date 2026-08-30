(function () {
  var D = window.PAUSA;
  var waBase = "https://wa.me/" + D.whatsapp + "?text=";
  function wa(text) {
    return waBase + encodeURIComponent(text || "Hola Pausa, quiero una mesa o la carta.");
  }
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = wa();
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-maps]").forEach(function (el) { el.href = D.maps; });
  document.querySelectorAll("[data-ig]").forEach(function (el) { el.href = D.instagram; });
  document.querySelectorAll("[data-fb]").forEach(function (el) { el.href = D.facebook; });
  document.querySelectorAll("[data-tel]").forEach(function (el) { el.href = "tel:" + D.phoneTel; });
  var slides = document.getElementById("heroSlides");
  var dots = document.getElementById("heroDots");
  D.hero.forEach(function (h, i) {
    var img = document.createElement("img");
    img.src = h.src;
    img.alt = h.alt;
    if (i === 0) img.className = "on";
    slides.appendChild(img);
    var b = document.createElement("button");
    b.type = "button";
    if (i === 0) b.className = "on";
    b.addEventListener("click", function () { show(i); });
    dots.appendChild(b);
  });
  var idx = 0;
  function show(n) {
    var imgs = slides.querySelectorAll("img");
    var ds = dots.querySelectorAll("button");
    idx = (n + imgs.length) % imgs.length;
    imgs.forEach(function (im, i) { im.classList.toggle("on", i === idx); });
    ds.forEach(function (d, i) { d.classList.toggle("on", i === idx); });
  }
  setInterval(function () { show(idx + 1); }, 5200);
  var track = document.getElementById("favTrack");
  D.favoritos.forEach(function (f) {
    var art = document.createElement("article");
    art.className = "card-food";
    art.innerHTML = "<img src=\"" + f.src + "\" alt=\"" + f.title + "\"><p>" + f.title + "</p>";
    track.appendChild(art);
  });
  document.querySelector("[data-track-prev]").onclick = function () {
    track.scrollBy({ left: -280, behavior: "smooth" });
  };
  document.querySelector("[data-track-next]").onclick = function () {
    track.scrollBy({ left: 280, behavior: "smooth" });
  };
  var patio = document.getElementById("patio");
  D.patio.forEach(function (p) {
    var fig = document.createElement("figure");
    fig.innerHTML = "<img src=\"" + p.src + "\" alt=\"" + p.title + "\">";
    patio.appendChild(fig);
  });
  var form = document.getElementById("reservaForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var lines = [
      "Reserva PAUSA",
      "Nombre: " + fd.get("nombre"),
      "Tel: " + fd.get("tel"),
      "Personas: " + fd.get("personas"),
      "Motivo: " + fd.get("motivo"),
      "Fecha: " + fd.get("fecha"),
      "Hora: " + fd.get("hora")
    ];
    if (fd.get("comentario")) lines.push("Comentario: " + fd.get("comentario"));
    document.getElementById("formOk").hidden = false;
    window.open(wa(lines.join("\n")), "_blank");
  });
})();
