/**
 * PAUSA cafe.resto.bar — reservas → Sheet
 * Planilla: https://docs.google.com/spreadsheets/d/1MPXabAxvsc0Wo5ad6FE1FVVd0HF4RUgd4SKB2ZYzaE0/edit
 *
 * 1. Extensiones → Apps Script → pegar este archivo.
 * 2. Implementar → Nueva implementación → Aplicación web
 *    Ejecutar como: yo. Quién tiene acceso: Cualquiera.
 * 3. Copiar la URL /exec y pegarla en js/data.js → sheetExec.
 * 4. Probar GET ?action=ping → debe devolver {"ok":true}.
 */

var SHEET_ID = "1MPXabAxvsc0Wo5ad6FE1FVVd0HF4RUgd4SKB2ZYzaE0";
var TAB = "Reservas";
var HEADERS = [
  "Cargada",
  "Nombre",
  "Teléfono",
  "Personas",
  "Fecha",
  "Hora",
  "Comentario",
  "Origen"
];

function sheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(TAB);
  if (!sh) sh = ss.insertSheet(TAB);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;
  if (action === "ping") return json_({ ok: true, ping: true, local: "PAUSA" });
  return json_({ ok: true });
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json_({ ok: false, error: "json" });
  }
  if (body.action === "ping") return json_({ ok: true, ping: true });

  sheet_().appendRow([
    new Date(),
    body.nombre || "",
    body.telefono || "",
    body.personas || "",
    body.fecha || "",
    body.hora || "",
    body.comentario || "",
    body.origen || "pausa-web"
  ]);
  return json_({ ok: true });
}
