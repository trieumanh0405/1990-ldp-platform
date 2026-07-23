(function () {
  "use strict";
  var cfg = window.LP1990 || {};
  var gtmId = String(cfg.GTM_ID || "").trim();
  var hasGtm = /^GTM-[A-Z0-9]+$/i.test(gtmId) && gtmId.indexOf("XXXX") === -1;
  window.dataLayer = window.dataLayer || [];
  if (hasGtm) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var firstScript = document.getElementsByTagName("script")[0];
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(gtmId);
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    console.warn("GTM is not configured for LDP-02.");
  }
  window.LP1990Tracking = {
    trackLead: function (payload) {
      window.dataLayer.push({
        event: "lp1990_lead_success",
        event_id: payload.lead_id || "",
        lead_id: payload.lead_id || "",
        form_name: "quiz-signal-system",
        lead_source: payload.source || "",
        signal_score: payload.signal_score || 0,
        weakest_dimension: payload.weakest_dimension || "",
        utm_source: payload.utm_source || "",
        utm_medium: payload.utm_medium || "",
        utm_campaign: payload.utm_campaign || "",
        utm_content: payload.utm_content || "",
        utm_term: payload.utm_term || "",
        gclid: payload.gclid || "",
        gbraid: payload.gbraid || "",
        wbraid: payload.wbraid || "",
        fbclid: payload.fbclid || "",
        ttclid: payload.ttclid || ""
      });
    }
  };
})();
