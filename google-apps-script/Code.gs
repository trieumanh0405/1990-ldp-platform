var SPREADSHEET_ID = "1d5ISO-FQgSk2qCCYPbsTw7BfDPhos0BV5ezQdxgcfrE";
var ALLOWED_SOURCES = ["1990-ldp-tu-van-mien-phi", "1990-ldp-quiz-signal-system"];
var TAB_BY_SOURCE = {
  "1990-ldp-tu-van-mien-phi": "LDP-Tư Vấn-01",
  "1990-ldp-quiz-signal-system": "LDP-Quiz-02"
};
var HEADERS = [
  "received_at", "lead_id", "source", "form_name", "fullname", "phone", "email", "company", "industry",
  "challenge", "budget", "report_focus", "signal_score", "weakest_dimension", "dimension_scores_json", "answers_json",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "gclid", "gbraid", "wbraid",
  "fbclid", "fbc", "fbp", "ttclid", "msclkid", "landingPage", "firstReferrer", "pageUrl", "referrer", "userAgent"
];

function doGet() {
  return jsonResponse_({ ok: true, service: "1990 Lead Sheet Bridge", version: 1 });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    validatePayload_(payload);
    lock.waitLock(10000);
    var sheet = getDestinationSheet_(payload);
    ensureHeaders_(sheet);
    if (hasLead_(sheet, payload.lead_id)) return jsonResponse_({ ok: true, duplicate: true, lead_id: payload.lead_id });
    sheet.appendRow(HEADERS.map(function (key) { return safeCell_(payload[key]); }));
    return jsonResponse_({ ok: true, lead_id: payload.lead_id, tab: sheet.getName() });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error && error.message || error) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function validatePayload_(payload) {
  if (!payload || ALLOWED_SOURCES.indexOf(String(payload.source || "")) === -1) throw new Error("Invalid source");
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(String(payload.lead_id || ""))) throw new Error("Invalid lead_id");
  if (String(payload.fullname || "").trim().length < 2) throw new Error("Invalid fullname");
  if (String(payload.phone || "").trim().length < 8) throw new Error("Invalid phone");
}

function getDestinationSheet_(payload) {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var expected = TAB_BY_SOURCE[String(payload.source)];
  var requested = String(payload.sheet_tab || "").trim();
  var tabName = requested === expected ? requested : expected;
  return spreadsheet.getSheetByName(tabName) || spreadsheet.insertSheet(tabName);
}

function ensureHeaders_(sheet) {
  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  var isBlank = current.every(function (value) { return !value; });
  if (isBlank) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#17191c").setFontColor("#ffffff");
    return;
  }
  if (current.slice(0, HEADERS.length).join("|") !== HEADERS.join("|")) throw new Error("Header của tab không khớp mẫu 1990; dừng ghi để tránh lệch cột");
}

function hasLead_(sheet, leadId) {
  if (sheet.getLastRow() < 2) return false;
  var leadColumn = HEADERS.indexOf("lead_id") + 1;
  return sheet.getRange(2, leadColumn, sheet.getLastRow() - 1, 1).createTextFinder(String(leadId)).matchEntireCell(true).findNext() !== null;
}

function safeCell_(value) {
  var text = value == null ? "" : String(value);
  if (text.length > 5000) text = text.slice(0, 5000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
