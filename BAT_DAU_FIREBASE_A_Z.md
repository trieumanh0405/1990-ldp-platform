# Triển khai Firebase A–Z — 1990 LDP Tư Vấn Miễn Phí

Ngày cập nhật: 16/07/2026

## 0. Trạng thái hiện tại

Đã hoàn thành:

- Project đã được giải nén và chuẩn hóa tại `1990-ldp-tu-van-mien-phi`.
- Trang chính là `index.html` và chạy được bằng Firebase Hosting Emulator.
- `firebase.json`, `.firebaserc` và `firestore.rules` đã có sẵn.
- Firebase CLI 15.23.0 đã được cài cục bộ trong project.
- Đã tạo `package.json`, `pnpm-lock.yaml` và `.gitignore`.
- Đã kiểm tra cú pháp 5 file JavaScript, 2 script inline và toàn bộ JSON.
- Đã kiểm tra luồng `lead_id`, attribution và event `lp1990_lead_success`.

Chưa thể hoàn thành nếu chưa có tài khoản/config thật:

- Project ID đã xác nhận: `ldp-tu-van-mien-phi`.
- Firebase Web App config thật đã được điền vào `index.html`.
- Tạo Firestore database và chọn region.
- Đăng nhập Firebase CLI.
- Deploy Firestore Rules và Hosting Preview.
- Tạo Google Sheet Web App URL.
- Điền GTM ID và cấu hình các tag quảng cáo.
- Nối custom domain.

## 1. Việc bạn cần làm ngay: tạo Firebase project

1. Mở `https://console.firebase.google.com/`.
2. Đăng nhập bằng tài khoản Google công ty sẽ sở hữu landing page.
3. Chọn **Create a project** hoặc **Add project**.
4. Project name: `1990 LDP Tu Van Mien Phi`.
5. Project ID thực tế của project này: `ldp-tu-van-mien-phi`.
6. Không tạo thêm một Firebase project khác cho cùng landing page.
7. Ghi lại Project ID chính xác. Project ID là duy nhất toàn cầu và không đổi được sau khi tạo.
8. Google Analytics:
   - Nếu 1990 đã có GA4 property chính thức, có thể bật và chọn đúng property.
   - Nếu chưa thống nhất property, có thể tắt ở bước này; GTM/GA4 được cài sau.
9. Chọn **Create project** và chờ Firebase hoàn tất.

Không tạo nhiều project thử bằng các tài khoản cá nhân khác nhau. Nên để tài khoản công ty làm Owner và bổ sung thành viên sau.

## 2. Tạo Firebase Web App — đã hoàn thành

1. Trong **Project Overview**, chọn biểu tượng Web `</>`.
2. App nickname: `1990 LDP Web`.
3. Không cần bật Firebase Hosting trong hộp thoại này vì project local đã có cấu hình Hosting.
4. Chọn **Register app**.
5. Tại phần SDK setup, chọn **Config**.
6. Copy nguyên object có dạng:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...firebaseapp.com",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Firebase config đã được điền vào project ngày 17/07/2026. Không gửi mật khẩu Google, access token, refresh token hoặc file Service Account JSON.

Firebase Web config được dùng ở frontend nên có thể xuất hiện trong HTML. Quyền truy cập dữ liệu được bảo vệ bằng Firestore Rules, không phải bằng cách giấu `apiKey` Web.

## 3. Tạo Firestore Database

1. Firebase Console → **Build** → **Firestore Database**.
2. Chọn **Create database**.
3. Database ID: giữ `(default)`.
4. Chọn **Production mode**.
5. Chọn region gần người dùng Việt Nam, ưu tiên Singapore nếu giao diện cung cấp lựa chọn phù hợp.
6. Kiểm tra kỹ trước khi xác nhận vì location Firestore không thể đổi trực tiếp sau khi tạo.
7. Chọn **Enable/Create**.
8. Không tự tạo collection `leads`; collection sẽ xuất hiện khi form gửi lead đầu tiên.

Rules mặc định sẽ được thay bằng file `firestore.rules` trong project khi deploy.

## 4. Đăng nhập Firebase CLI — thao tác bắt buộc trên máy của bạn

Codex chạy command trong môi trường không tương tác nên không thể nhập tài khoản Google thay bạn. Bạn thực hiện một lần:

1. Mở PowerShell/Terminal bình thường trên Windows.
2. Chuyển vào project:

```powershell
Set-Location -LiteralPath 'D:\Công việc\1990 Agency\1990 SEM - LDP\1990-ldp-tu-van-mien-phi'
```

3. Kiểm tra Node.js:

```powershell
node --version
```

4. Nếu Windows báo không tìm thấy `node`, cài Node.js LTS từ trang chính thức `https://nodejs.org/`, sau đó đóng và mở lại PowerShell.
5. Cài dependencies nếu thư mục `node_modules` không còn:

```powershell
npm install
```

6. Đăng nhập:

```powershell
npx firebase login
```

7. Trình duyệt mở ra → chọn đúng Google account công ty → **Allow**.
8. Quay lại PowerShell và chờ thông báo đăng nhập thành công.
9. Kiểm tra project:

```powershell
npx firebase projects:list
```

10. Xác nhận Project ID vừa tạo xuất hiện trong danh sách.

Không copy token đăng nhập và không gửi nội dung file cấu hình đăng nhập cho người khác. Sau khi xong chỉ cần báo Codex: **“Tôi đã login Firebase CLI, Project ID là ...”**.

## 5. Các việc Codex sẽ làm ngay sau khi bạn gửi config và login

1. Firebase Web config thật đã được điền vào `index.html`.
2. `.firebaserc` đã được đồng bộ thành `ldp-tu-van-mien-phi`.
3. `firebase.json` đã được đồng bộ Hosting Site ID thành `ldp-tu-van-mien-phi` và sẽ được xác minh qua CLI.
4. Chạy:

```powershell
npx firebase projects:list
npx firebase hosting:sites:list --project PROJECT_ID
```

5. Nếu Hosting site chưa tồn tại, tạo site đúng ID hoặc cập nhật `firebase.json` theo site mặc định.
6. Deploy Firestore Rules:

```powershell
npx firebase deploy --only firestore:rules --project PROJECT_ID
```

7. Deploy Preview Channel, chưa đụng production:

```powershell
npx firebase hosting:channel:deploy setup-review --project PROJECT_ID --expires 7d
```

8. Kiểm tra URL preview, asset, form validation và console errors.

## 6. Test Firestore trước khi kết nối Google Sheet

Mở Preview URL với UTM test:

```text
https://PREVIEW_URL/?utm_source=codex_test&utm_medium=manual&utm_campaign=firebase_setup&fbclid=TEST_FBCLID&ttclid=TEST_TTCLID&gclid=TEST_GCLID
```

Gửi lead mẫu:

- Họ tên: `TEST - Nguyen Van A`
- Điện thoại: một số test hợp lệ do team thống nhất.
- Công ty: `1990 TEST`
- Email: email test do team sở hữu.
- Challenge: `Firebase setup test`.

Kiểm tra Firebase Console → Firestore → Data → collection `leads`:

- Document ID trùng field `lead_id`.
- `submittedAt` là timestamp.
- `source = 1990-ldp-tu-van-mien-phi`.
- Có UTM và các click ID test.
- Trình duyệt không thể đọc ngược collection `leads`.
- Một lần submit chỉ tạo một document.

Sau khi kiểm tra, xóa document test trực tiếp từ Firebase Console.

## 7. Kết nối Google Sheet

1. Upload `outputs/1990_Landing_Leads.xlsx` lên Google Drive công ty.
2. Mở bằng Google Sheets.
3. Giữ tab đầu tiên tên `Leads` và không thay thứ tự 28 cột.
4. Chọn **Extensions** → **Apps Script**.
5. Paste nội dung `1990-ldp-tu-van-mien-phi/docs/google-sheets-webhook.gs`.
6. **Deploy** → **New deployment** → **Web app**.
7. Execute as: **Me**.
8. Who has access: **Anyone**.
9. Cấp quyền và copy URL kết thúc bằng `/exec`.
10. Gửi URL `/exec` cho Codex để điền vào `SHEETS_WEBHOOK_URL`.
11. Gửi một lead `TEST` mới và đối chiếu `lead_id` giữa Firestore và Sheet.

Firestore là dữ liệu gốc; Sheet là bản mirror cho sales/ops sử dụng.

## 8. Kết nối GTM và Pixel

1. Tạo/chọn GTM Web Container của 1990.
2. Gửi GTM ID dạng `GTM-XXXXXXX` cho Codex.
3. Codex chỉ đặt GTM ID trong HTML.
4. Trong GTM tạo Custom Event trigger: `lp1990_lead_success`.
5. Dùng trigger này cho:
   - GA4 `generate_lead`.
   - Google Ads Conversion.
   - Meta Pixel `Lead`.
   - TikTok Pixel `SubmitForm`.
6. Test bằng GTM Preview trước khi Publish.
7. Không đẩy họ tên, email hoặc số điện thoại vào `dataLayer`.

Hướng dẫn chi tiết nằm tại `1990-ldp-tu-van-mien-phi/docs/gtm-and-attribution-setup.md`.

## 9. Checklist trước production

- Firebase Web config đã là config thật.
- Firestore Rules đã deploy.
- Form tạo lead đúng một lần.
- Google Sheet nhận đúng cùng `lead_id`.
- GTM Preview thấy `lp1990_lead_success` đúng một lần.
- GA4/Ads/Meta/TikTok không bắn conversion khi validation lỗi.
- Không còn placeholder GTM, Firebase hoặc Apps Script.
- Có link Chính sách bảo mật và Điều khoản thật.
- Sales có quyền xem Sheet và quy trình xử lý lead.
- Google Cloud có budget alert.
- Đã duyệt nội dung desktop và mobile.

## 10. Deploy production

Chỉ chạy sau khi checklist được duyệt:

```powershell
npx firebase deploy --only firestore:rules,hosting --project PROJECT_ID -m "1990 LDP initial production"
```

Sau deploy:

1. Mở URL `web.app`.
2. Hard refresh.
3. Gửi một lead có nhãn `TEST`.
4. Kiểm tra Firestore, Sheet và tracking.
5. Xóa lead test.
6. Ghi lại ngày giờ và release đã deploy.

## 11. Nối custom domain

1. Firebase Console → Hosting → **Add custom domain**.
2. Nhập domain/subdomain đã thống nhất.
3. Thêm TXT record xác minh đúng như Firebase hiển thị.
4. Thêm A/AAAA/CNAME record đúng như Firebase hiển thị; không dùng lại IP từ hướng dẫn cũ.
5. Chờ DNS verified và SSL certificate được cấp.
6. Test HTTP chuyển HTTPS và domain chuẩn.
7. Cập nhật GA4 Web Stream, GTM, Pixel/domain allowlist và URL quảng cáo.

## 12. Điểm tiếp tục hiện tại

Bạn đang ở **Bước 3–4**. Hãy hoàn thành:

1. Tạo Firestore Production database nếu chưa tạo.
2. Chạy `npx firebase login` trong PowerShell.
3. Chạy `npx firebase projects:list` và xác nhận có `ldp-tu-van-mien-phi`.

Sau đó báo đã login CLI. Codex sẽ tiếp tục từ Bước 5, deploy Rules và kiểm tra preview trước rồi mới deploy production.
