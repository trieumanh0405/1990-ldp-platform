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
    console.warn("GTM is not configured. Fill window.LP1990.GTM_ID before go-live.");
  }

  function trackLead(payload) {
    window.dataLayer.push({
      event: "lp1990_lead_success",
      event_id: payload.lead_id || "",
      lead_id: payload.lead_id || "",
      form_name: "tu-van-mien-phi",
      lead_source: payload.source || "",
      utm_source: payload.utm_source || "",
      utm_medium: payload.utm_medium || "",
      utm_campaign: payload.utm_campaign || "",
      utm_content: payload.utm_content || "",
      utm_term: payload.utm_term || "",
      gclid: payload.gclid || "",
      gbraid: payload.gbraid || "",
      wbraid: payload.wbraid || "",
      fbclid: payload.fbclid || "",
      ttclid: payload.ttclid || "",
    });
  }

  window.LP1990Tracking = {
    trackLead: trackLead,
  };
})();
