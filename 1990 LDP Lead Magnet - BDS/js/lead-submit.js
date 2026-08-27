(function () {
  "use strict";

  function hasSheetsWebhook() {
    var url = window.LP1990 && window.LP1990.SHEETS_WEBHOOK_URL;
    return window.LP1990 && window.LP1990.SHEETS_ENABLED === true && !!url && String(url).indexOf("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") === -1;
  }

  async function mirrorToSheets(payload) {
    if (!hasSheetsWebhook()) return { skipped: true };

    try {
      await fetch(window.LP1990.SHEETS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(Object.assign({}, payload, { sheet_tab: window.LP1990.SHEET_TAB_NAME || "LDP-Tư Vấn-01", received_at: new Date().toISOString() })),
      });
      return { ok: true };
    } catch (err) {
      console.warn("Google Sheets mirror failed:", err);
      return { ok: false, error: err };
    }
  }

  async function saveToFirestore(payload) {
    if (!window.LP1990_DB) {
      throw new Error("Firebase Firestore is not configured.");
    }

    var leadId = payload.lead_id || createLeadId();
    payload.lead_id = leadId;

    var doc = {
      lead_id: leadId,
      fullname: payload.fullname || "",
      phone: payload.phone || "",
      company: payload.company || "",
      industry: payload.industry || "",
      email: payload.email || "",
      challenge: payload.challenge || "",
      budget: payload.budget || "",
      utm_source: payload.utm_source || "",
      utm_medium: payload.utm_medium || "",
      utm_campaign: payload.utm_campaign || "",
      utm_content: payload.utm_content || "",
      utm_term: payload.utm_term || "",
      ref: payload.ref || "",
      gclid: payload.gclid || "",
      gbraid: payload.gbraid || "",
      wbraid: payload.wbraid || "",
      fbclid: payload.fbclid || "",
      fbc: payload.fbc || "",
      fbp: payload.fbp || "",
      ttclid: payload.ttclid || "",
      msclkid: payload.msclkid || "",
      landingPage: payload.landingPage || "",
      firstReferrer: payload.firstReferrer || "",
      pageUrl: payload.pageUrl || "",
      referrer: payload.referrer || "",
      userAgent: payload.userAgent || "",
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      source: "1990-ldp-lead-magnet-bds",
    };

    await window.LP1990_DB.collection("bds_leads").doc(leadId).set(doc);
    return { ok: true, lead_id: leadId };
  }

  function createLeadId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 12);
  }

  async function submitLead(payload) {
    var firestoreResult = await saveToFirestore(payload);
    var sheetsResult = await mirrorToSheets(payload);
    return {
      firestore: firestoreResult,
      sheets: sheetsResult,
    };
  }

  window.LP1990Lead = {
    submit: submitLead,
    mirrorToSheets: mirrorToSheets,
  };
})();
