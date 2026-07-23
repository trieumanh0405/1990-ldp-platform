(function () {
  "use strict";

  function makeLeadId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
      var random = Math.random() * 16 | 0;
      var value = char === "x" ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  function text(value) { return value == null ? "" : String(value); }

  function hasSheetsWebhook() { var cfg=window.LP1990||{},url=cfg.SHEETS_WEBHOOK_URL;return cfg.SHEETS_ENABLED===true&&!!url&&String(url).indexOf("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL")===-1; }
  async function mirrorToSheets(payload) { if(!hasSheetsWebhook())return{skipped:true};try{await fetch(window.LP1990.SHEETS_WEBHOOK_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(Object.assign({},payload,{sheet_tab:window.LP1990.SHEET_TAB_NAME||"LDP-Quiz-02",received_at:new Date().toISOString()}))});return{ok:true};}catch(err){console.warn("Google Sheets mirror failed:",err);return{ok:false,error:err};} }

  async function submit(payload) {
    if (!window.LP1990_FIREBASE_READY || !window.LP1990_DB) throw new Error("Firestore is not ready");
    var leadId = makeLeadId();
    payload.lead_id = leadId;
    var doc = {
      lead_id: leadId,
      form_name: "quiz-signal-system",
      angle: "quiz-signal-system",
      fullname: text(payload.fullname),
      phone: text(payload.phone),
      email: text(payload.email),
      company: text(payload.company),
      report_focus: text(payload.report_focus),
      signal_score: Number(payload.signal_score) || 0,
      weakest_dimension: text(payload.weakest_dimension),
      dimension_scores_json: text(payload.dimension_scores_json),
      answers_json: text(payload.answers_json),
      utm_source: text(payload.utm_source),
      utm_medium: text(payload.utm_medium),
      utm_campaign: text(payload.utm_campaign),
      utm_content: text(payload.utm_content),
      utm_term: text(payload.utm_term),
      ref: text(payload.ref),
      gclid: text(payload.gclid),
      gbraid: text(payload.gbraid),
      wbraid: text(payload.wbraid),
      fbclid: text(payload.fbclid),
      fbc: text(payload.fbc),
      fbp: text(payload.fbp),
      ttclid: text(payload.ttclid),
      msclkid: text(payload.msclkid),
      landingPage: text(payload.landingPage),
      firstReferrer: text(payload.firstReferrer),
      pageUrl: text(payload.pageUrl),
      referrer: text(payload.referrer),
      userAgent: text(payload.userAgent),
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      source: "1990-ldp-quiz-signal-system"
    };
    await window.LP1990_DB.collection("quiz_leads").doc(leadId).set(doc);
    await mirrorToSheets(payload);
    return { lead_id: leadId };
  }

  window.LP1990QuizLead = { submit: submit, mirrorToSheets: mirrorToSheets };
})();
