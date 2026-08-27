(function () {
  "use strict";

  var pageId = window.LP1990 && window.LP1990.CMS_PAGE_ID;
  var activeContent = {};
  var observerTimer = null;

  function isAllowedCmsOrigin(origin) {
    return origin === "http://127.0.0.1:5500" ||
      origin === "http://localhost:5500" ||
      origin === "https://1990-ldp-cms.web.app" ||
      /^https:\/\/1990-ldp-cms--[a-z0-9-]+\.web\.app$/i.test(origin);
  }

  function sanitizeHtml(value) {
    var template = document.createElement("template");
    template.innerHTML = String(value == null ? "" : value);
    var allowedTags = { BR: true, STRONG: true, EM: true, B: true, I: true, SPAN: true };

    function clean(parent) {
      Array.prototype.slice.call(parent.childNodes).forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (!allowedTags[node.tagName]) {
          node.replaceWith(document.createTextNode(node.textContent || ""));
          return;
        }
        Array.prototype.slice.call(node.attributes).forEach(function (attr) {
          if (!(node.tagName === "SPAN" && attr.name === "class" && attr.value === "red")) {
            node.removeAttribute(attr.name);
          }
        });
        clean(node);
      });
    }

    clean(template.content);
    return template.innerHTML;
  }

  function applyContent(content) {
    activeContent = content || {};
    Object.keys(activeContent).forEach(function (key) {
      var value = activeContent[key];
      document.querySelectorAll('[data-copy="' + CSS.escape(key) + '"]').forEach(function (element) {
        var cleanValue = sanitizeHtml(value);
        if (element.innerHTML !== cleanValue) element.innerHTML = cleanValue;
      });
    });
  }

  function upsertMeta(selector, attribute, value) {
    if (!value) return;
    var element = document.querySelector(selector);
    if (!element) { element = document.createElement("meta"); Object.keys(attribute).forEach(function (key) { element.setAttribute(key, attribute[key]); }); document.head.appendChild(element); }
    element.setAttribute("content", value);
  }

  function applySeo(seo) {
    seo = seo || {};
    if (seo.title) { document.title = seo.title; upsertMeta('meta[property="og:title"]', { property:"og:title" }, seo.title); }
    if (seo.description) { upsertMeta('meta[name="description"]', { name:"description" }, seo.description); upsertMeta('meta[property="og:description"]', { property:"og:description" }, seo.description); }
    if (seo.image) upsertMeta('meta[property="og:image"]', { property:"og:image" }, seo.image);
    if (seo.canonical) { var canonical=document.querySelector('link[rel="canonical"]')||document.createElement("link");canonical.rel="canonical";canonical.href=seo.canonical;if(!canonical.parentNode)document.head.appendChild(canonical); }
  }

  function addScript(id, src) { if (!src || document.getElementById(id)) return; var script=document.createElement("script");script.id=id;script.async=true;script.src=src;document.head.appendChild(script); }
  function applyIntegrations(integrations) {
    integrations = integrations || {};
    var cfg = window.LP1990 = window.LP1990 || {};
    cfg.SHEETS_ENABLED = integrations.sheetsEnabled === true;
    cfg.SHEETS_WEBHOOK_URL = integrations.sheetsWebhookUrl || cfg.SHEETS_WEBHOOK_URL || "";
    cfg.SHEET_TAB_NAME = integrations.sheetTabName || cfg.SHEET_TAB_NAME || "";
    if (integrations.mailchimpScriptUrl && /^https:\/\/([a-z0-9-]+\.)?chimpstatic\.com\/mcjs-connected\//i.test(integrations.mailchimpScriptUrl)) addScript("mcjs", integrations.mailchimpScriptUrl);
    if (integrations.trackingEnabled !== true) return;
    var gtm=String(integrations.gtmId||"").toUpperCase(),ga4=String(integrations.ga4Id||"").toUpperCase(),meta=String(integrations.metaPixelId||""),tiktok=String(integrations.tiktokPixelId||"");
    window.dataLayer=window.dataLayer||[];
    if (/^GTM-[A-Z0-9]+$/.test(gtm)) { window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});addScript("lp1990-gtm","https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(gtm)); }
    if (/^G-[A-Z0-9]+$/.test(ga4) && !gtm) { addScript("lp1990-ga4","https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ga4));window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.gtag("js",new Date());window.gtag("config",ga4); }
    if (/^\d{5,30}$/.test(meta) && !window.fbq) { var fbq=window.fbq=function(){fbq.callMethod?fbq.callMethod.apply(fbq,arguments):fbq.queue.push(arguments);};fbq.queue=[];fbq.loaded=true;fbq.version="2.0";window._fbq=fbq;addScript("lp1990-meta-pixel","https://connect.facebook.net/en_US/fbevents.js");fbq("init",meta);fbq("track","PageView"); }
    if (tiktok && !window.ttq) { var ttq=window.ttq=[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(target,method){target[method]=function(){target.push([method].concat([].slice.call(arguments)));};};ttq.methods.forEach(function(method){ttq.setAndDefer(ttq,method);});ttq.load=function(id){addScript("lp1990-tiktok-pixel","https://analytics.tiktok.com/i18n/pixel/events.js?sdkid="+encodeURIComponent(id)+"&lib=ttq");};ttq.load(tiktok);ttq.page(); }
  }

  function collectSnapshot() {
    var snapshot = {};
    document.querySelectorAll("[data-copy]").forEach(function (element) {
      var key = element.getAttribute("data-copy");
      if (key && snapshot[key] == null) snapshot[key] = element.innerHTML.trim();
    });
    return snapshot;
  }

  function collectSeo() { var description=document.querySelector('meta[name="description"]'),image=document.querySelector('meta[property="og:image"]'),canonical=document.querySelector('link[rel="canonical"]');return {title:document.title||"",description:description?description.content:"",image:image?image.content:"",canonical:canonical?canonical.href:""}; }

  function observeDynamicContent() {
    if (!window.MutationObserver || !document.body) return;
    new MutationObserver(function () {
      clearTimeout(observerTimer);
      observerTimer = setTimeout(function () { applyContent(activeContent); }, 40);
    }).observe(document.body, { childList: true, subtree: true });
  }

  async function loadPublishedContent() {
    if (!pageId || !window.LP1990_DB) return;
    try {
      var snapshot = await window.LP1990_DB.collection("cms_public").doc(pageId).get();
      if (snapshot.exists) { var data=snapshot.data(),runtime=Object.assign({ sheetsEnabled:window.LP1990.SHEETS_ENABLED===true, sheetsWebhookUrl:window.LP1990.SHEETS_WEBHOOK_URL||"", sheetTabName:window.LP1990.SHEET_TAB_NAME||"", trackingEnabled:false, mailchimpScriptUrl:window.LP1990.MAILCHIMP_SCRIPT_URL||"" },data.integrations || {});if(!runtime.sheetsWebhookUrl||runtime.sheetsWebhookUrl.indexOf("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL")>=0){runtime.sheetsEnabled=window.LP1990.SHEETS_ENABLED===true;runtime.sheetsWebhookUrl=window.LP1990.SHEETS_WEBHOOK_URL||"";runtime.sheetTabName=window.LP1990.SHEET_TAB_NAME||runtime.sheetTabName||"";}applyContent(data.content || {});applySeo(data.seo || {});applyIntegrations(runtime); }
      else applyIntegrations({ sheetsEnabled:window.LP1990.SHEETS_ENABLED===true, sheetsWebhookUrl:window.LP1990.SHEETS_WEBHOOK_URL||"", sheetTabName:window.LP1990.SHEET_TAB_NAME||"", trackingEnabled:false, mailchimpScriptUrl:window.LP1990.MAILCHIMP_SCRIPT_URL||"" });
    } catch (err) {
      console.warn("CMS published content unavailable:", err);
    }
  }

  window.addEventListener("message", function (event) {
    if (!isAllowedCmsOrigin(event.origin) || !event.data) return;
    if (event.data.type === "LP1990_CMS_REQUEST_SNAPSHOT") {
      event.source.postMessage({
        type: "LP1990_CMS_SNAPSHOT",
        pageId: pageId,
        content: collectSnapshot(),
        seo: collectSeo()
      }, event.origin);
    }
    if (event.data.type === "LP1990_CMS_PREVIEW" && event.data.pageId === pageId) {
      applyContent(event.data.content || {});
      applySeo(event.data.seo || {});
    }
  });

  observeDynamicContent();
  loadPublishedContent();
})();
