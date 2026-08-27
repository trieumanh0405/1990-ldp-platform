(function () {
  "use strict";

  var cfg = window.LP1990 || {};
  var firebaseConfig = cfg.FIREBASE_CONFIG || {};
  var requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
  var hasConfig = requiredKeys.every(function (key) {
    return firebaseConfig[key] && String(firebaseConfig[key]).indexOf("YOUR_") === -1;
  });

  window.LP1990_DB = null;
  window.LP1990_FIREBASE_READY = false;

  if (!window.firebase) {
    console.warn("Firebase SDK unavailable; lead form will not submit to Firestore.");
    return;
  }

  if (!hasConfig) {
    console.warn("Firebase config is not complete. Fill window.LP1990.FIREBASE_CONFIG before go-live.");
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    window.LP1990_DB = firebase.firestore ? firebase.firestore() : null;
    window.LP1990_FIREBASE_READY = !!window.LP1990_DB;
  } catch (err) {
    console.error("Firebase init failed:", err);
  }
})();
