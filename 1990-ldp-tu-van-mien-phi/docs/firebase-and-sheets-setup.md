# 1990 Landing Page Deploy Setup

## 1. Firebase project

Create a new Firebase project:

```text
1990-ldp-tu-van-mien-phi
```

If that ID is taken, use:

```text
1990-ldp-tu-van-mien-phi-01
```

Then create a Web App in Firebase Console and copy its config into `window.LP1990.FIREBASE_CONFIG` inside `index.html`.

## 2. Firestore

Enable Firestore in production mode, then deploy rules:

```bash
firebase deploy --only firestore:rules --project 1990-ldp-tu-van-mien-phi
```

Lead documents are written to:

```text
leads
```

Public visitors can only create leads. They cannot read leads back.

## 3. Google Sheets mirror

Create a Google Sheet named:

```text
1990 Landing Leads
```

Open Extensions > Apps Script, paste `docs/google-sheets-webhook.gs`, then deploy it as a Web App:

```text
Execute as: Me
Who has access: Anyone with the link
```

Copy the Web App URL into:

```js
window.LP1990.SHEETS_WEBHOOK_URL
```

Firestore remains the source of truth. Google Sheets is a convenience mirror for sales/ops.

## 4. Preview deploy

```bash
firebase hosting:channel:deploy preview-YYYYMMDD --project 1990-ldp-tu-van-mien-phi --expires 7d
```

Test the form on the preview URL before production.

## 5. Production deploy

```bash
firebase deploy --only hosting,firestore:rules --project 1990-ldp-tu-van-mien-phi
```
