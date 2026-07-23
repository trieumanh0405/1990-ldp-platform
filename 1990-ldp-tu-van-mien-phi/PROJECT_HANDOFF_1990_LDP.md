# Project Handoff - 1990 LDP Tu Van Mien Phi

Ngay tao: 2026-07-15

## Muc tieu project

Landing page `1990 LDP Tu Van Mien Phi` la website mat tien dang static HTML:

- File chinh: `index.html`
- Assets chinh: `assets/`
- Deploy theo cong thuc tu website Dank: static website + Firebase Hosting + Firebase Firestore
- Firestore la noi luu lead chinh
- Google Sheets la ban mirror de team non-tech xem lead de hon

## Cach website hien tai hoat dong

Website hien tai la landing page tinh:

- HTML nam chu yeu trong `index.html`
- CSS dang inline trong `index.html`
- JavaScript tuong tac dang inline cuoi `index.html`
- Anh/logo/case study nam trong `assets/`
- Form lead co 3 buoc:
  - Buoc 1: ho ten, so dien thoai
  - Buoc 2: cong ty, nganh
  - Buoc 3: email, challenge, budget

Khi user submit form:

1. Validate tung buoc tren browser.
2. Neu honeypot `website` co gia tri thi khong gui.
3. Tao payload lead co UTM, pageUrl, referrer, userAgent.
4. Goi `window.LP1990Lead.submit(payload)`.
5. `js/lead-submit.js` ghi Firestore collection `leads` truoc.
6. Neu co `SHEETS_WEBHOOK_URL` that, gui them mot ban copy sang Google Sheets.
7. Neu Firestore thanh cong thi hien man hinh cam on.
8. Neu Firestore loi thi bao loi, khong hien cam on gia.

## Files da them/sua

### Firebase / Hosting

- `.firebaserc`
  - Project mac dinh: `1990-ldp-tu-van-mien-phi`
  - Neu project ID bi trung, dung `1990-ldp-tu-van-mien-phi-01` va sua lai file nay.

- `firebase.json`
  - Public folder la `.`
  - Clean URLs bat
  - Cache headers cho HTML/CSS/JS va anh
  - Ignore config, docs, hidden files, node_modules, asset folders bo sung khong dung truc tiep

- `firestore.rules`
  - Public visitor chi duoc `create` lead trong collection `leads`
  - Public khong duoc read lead
  - Client khong duoc read/update/delete; Firebase Console van xem duoc qua IAM

### JavaScript

- `js/firebase-init.js`
  - Khoi tao Firebase tu `window.LP1990.FIREBASE_CONFIG`
  - Neu config con placeholder thi canh bao va khong ghi Firestore

- `js/lead-submit.js`
  - `saveToFirestore(payload)`: ghi lead vao Firestore voi `lead_id` dung chung
  - `mirrorToSheets(payload)`: gui ban copy sang Google Sheets neu co webhook URL that
  - `submitLead(payload)`: Firestore truoc, Sheets sau

- `js/attribution.js`
  - Luu attribution 90 ngay va thu UTM/click IDs/cookie `_fbc`, `_fbp`

- `js/tracking.js`
  - Load GTM khi co Container ID that
  - Push `lp1990_lead_success` sau khi Firestore thanh cong

### Google Sheets

- `docs/google-sheets-webhook.gs`
  - Apps Script mau de paste vao Google Sheet
  - Nhan JSON tu landing page va append row vao sheet `Leads`

- `docs/firebase-and-sheets-setup.md`
  - Huong dan tao Firebase project, Firestore, Google Apps Script, preview deploy, production deploy

- `docs/gtm-and-attribution-setup.md`
  - Huong dan tao GTM trigger va cai GA4/Ads/Meta/TikTok

## Cau hinh can dien truoc khi go-live

Trong `index.html`, tim block:

```js
window.LP1990 = {
  GTM_ID: 'GTM-XXXXXXX',
  SHEETS_WEBHOOK_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL',
  FIREBASE_CONFIG: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: '1990-ldp-tu-van-mien-phi.firebaseapp.com',
    projectId: '1990-ldp-tu-van-mien-phi',
    storageBucket: '1990-ldp-tu-van-mien-phi.firebasestorage.app',
    messagingSenderId: 'YOUR_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'YOUR_FIREBASE_APP_ID'
  }
};
```

Can thay:

- `YOUR_FIREBASE_API_KEY`
- `YOUR_FIREBASE_MESSAGING_SENDER_ID`
- `YOUR_FIREBASE_APP_ID`
- Neu dung Google Sheets mirror: `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL`
- GTM Container ID that; cac ID GA4/Google Ads/Meta/TikTok duoc dat trong GTM

## Luong setup Firebase

1. Vao Firebase Console.
2. Tao project moi:
   - De xuat: `1990-ldp-tu-van-mien-phi`
   - Neu bi trung: `1990-ldp-tu-van-mien-phi-01`
3. Tao Web App.
4. Copy Firebase config vao `index.html`.
5. Enable Firestore.
6. Deploy rules:

```bash
firebase deploy --only firestore:rules --project 1990-ldp-tu-van-mien-phi
```

7. Preview deploy:

```bash
firebase hosting:channel:deploy preview-YYYYMMDD --project 1990-ldp-tu-van-mien-phi --expires 7d
```

8. Neu test form OK, production deploy:

```bash
firebase deploy --only hosting,firestore:rules --project 1990-ldp-tu-van-mien-phi
```

## Luong setup Google Sheets mirror

1. Tao Google Sheet ten `1990 Landing Leads`.
2. Vao Extensions > Apps Script.
3. Paste noi dung `docs/google-sheets-webhook.gs`.
4. Deploy > New deployment > Web app.
5. Chon:
   - Execute as: Me
   - Who has access: Anyone with the link
6. Copy Web App URL.
7. Dan vao `SHEETS_WEBHOOK_URL` trong `index.html`.

Luu y: Google Sheets mirror de team van hanh de xem lead. Firestore van la nguon chinh.

## Kiem tra da lam

- Da validate JSON cho `firebase.json` va `.firebaserc` bang PowerShell.
- Da ra soat placeholder webhook cu:
  - `YOUR-BACKEND` khong con.
  - `timestamp:new Date` cu khong con.
- `node` va `git` khong co trong shell hien tai, nen chua chay duoc `node --check` hoac `git diff`.

## Viec con can lam tren may tiep theo

1. Cai/kiem tra Firebase CLI.
2. Dang nhap Firebase CLI:

```bash
firebase login
```

3. Tao Firebase project va Web App.
4. Dien Firebase config that vao `index.html`.
5. Tao Google Sheet mirror neu can.
6. Chay local server de test:

```bash
python -m http.server 4174
```

Mo:

```text
http://127.0.0.1:4174/
```

7. Test form:
   - Sai phone/email thi bao loi
   - Honeypot co gia tri thi khong gui
   - Submit dung thi co document trong Firestore `leads`
   - Neu Sheets webhook da cau hinh thi co row moi trong Sheet

8. Deploy preview truoc production.

## Ghi chu quan trong

- Website nay khong can build React/Vue/Next.
- Day la static website, Firebase Hosting se dua nguyen files len web.
- Firestore rules hien tai uu tien bao mat: khach chi create lead, khong doc duoc lead.
- Google Sheets webhook URL nam o frontend nen khong phai bi mat tuyet doi. Neu sau nay can bao mat hon, chuyen mirror sang Cloud Function hoac n8n backend.
