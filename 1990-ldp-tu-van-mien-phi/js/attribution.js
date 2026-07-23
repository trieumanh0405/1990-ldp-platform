(function () {
  "use strict";

  var STORAGE_KEY = "lp1990_attribution_v1";
  var MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
  var PARAM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "ref",
    "gclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "ttclid",
    "msclkid",
  ];

  function readCookie(name) {
    var prefix = name + "=";
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var i = 0; i < parts.length; i += 1) {
      var item = parts[i].trim();
      if (item.indexOf(prefix) === 0) {
        return decodeURIComponent(item.slice(prefix.length));
      }
    }
    return "";
  }

  function safeParse(value) {
    try {
      return JSON.parse(value || "null") || {};
    } catch (err) {
      return {};
    }
  }

  function loadSaved() {
    try {
      var saved = safeParse(localStorage.getItem(STORAGE_KEY));
      if (!saved.capturedAt || Date.now() - saved.capturedAt > MAX_AGE_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }
      return saved;
    } catch (err) {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      // Storage can be blocked by browser privacy settings; submission still works.
    }
  }

  function collect() {
    var params = new URLSearchParams(window.location.search);
    var saved = loadSaved();
    var data = {};
    var hasNewAttribution = false;

    PARAM_KEYS.forEach(function (key) {
      var current = params.get(key) || "";
      if (current) hasNewAttribution = true;
      data[key] = current || saved[key] || "";
    });

    data.landingPage = saved.landingPage || window.location.href;
    data.firstReferrer = saved.firstReferrer || document.referrer || "";
    data.capturedAt = hasNewAttribution ? Date.now() : saved.capturedAt || Date.now();

    if (hasNewAttribution || !saved.capturedAt) save(data);

    data.fbp = readCookie("_fbp");
    data.fbc = readCookie("_fbc");
    if (!data.fbc && data.fbclid) {
      data.fbc = "fb.1." + data.capturedAt + "." + data.fbclid;
    }

    return data;
  }

  var attribution = collect();

  window.LP1990Attribution = {
    get: function () {
      var copy = {};
      Object.keys(attribution).forEach(function (key) {
        if (key !== "capturedAt") copy[key] = attribution[key];
      });
      // Meta cookies may be created after this script loads, so read them again.
      copy.fbp = readCookie("_fbp") || copy.fbp || "";
      copy.fbc = readCookie("_fbc") || copy.fbc || "";
      return copy;
    },
  };
})();
