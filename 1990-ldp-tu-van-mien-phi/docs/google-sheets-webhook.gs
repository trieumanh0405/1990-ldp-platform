const SHEET_NAME = "Leads";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_();
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (data.source !== "1990-ldp-tu-van-mien-phi" || !data.lead_id) {
      return json_({ ok: false, error: "invalid_payload" });
    }

    sheet.appendRow([
      new Date(),
      toCell_(data.lead_id),
      toCell_(data.fullname),
      toCell_(data.phone),
      toCell_(data.company),
      toCell_(data.industry),
      toCell_(data.email),
      toCell_(data.challenge),
      toCell_(data.budget),
      toCell_(data.utm_source),
      toCell_(data.utm_medium),
      toCell_(data.utm_campaign),
      toCell_(data.utm_content),
      toCell_(data.utm_term),
      toCell_(data.ref),
      toCell_(data.gclid),
      toCell_(data.gbraid),
      toCell_(data.wbraid),
      toCell_(data.fbclid),
      toCell_(data.fbc),
      toCell_(data.fbp),
      toCell_(data.ttclid),
      toCell_(data.msclkid),
      toCell_(data.landingPage),
      toCell_(data.firstReferrer),
      toCell_(data.pageUrl),
      toCell_(data.referrer),
      toCell_(data.source)
    ]);

    return json_({ ok: true, lead_id: data.lead_id });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function toCell_(value) {
  const text = String(value || "").slice(0, 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Received At",
      "Lead ID",
      "Full Name",
      "Phone",
      "Company",
      "Industry",
      "Email",
      "Challenge",
      "Budget",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Content",
      "UTM Term",
      "Ref",
      "GCLID",
      "GBRAID",
      "WBRAID",
      "FBCLID",
      "FBC",
      "FBP",
      "TTCLID",
      "MSCLKID",
      "Landing Page",
      "First Referrer",
      "Page URL",
      "Referrer",
      "Source"
    ]);
  }

  return sheet;
}
