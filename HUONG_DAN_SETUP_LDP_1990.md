# Hướng dẫn setup 1990 LDP Tư Vấn Miễn Phí

Ngày rà soát: 2026-07-15

## 1. Project này là gì?

Đây là landing page tĩnh, không dùng React, Vue, Next.js và không có bước build.

- Giao diện và phần lớn CSS/JavaScript: `index.html`
- Ảnh đang dùng trên trang: `assets/`
- Khởi tạo Firebase: `js/firebase-init.js`
- Ghi lead: `js/lead-submit.js`
- Quyền truy cập Firestore: `firestore.rules`
- Cấu hình Firebase Hosting: `firebase.json`
- Bản sao lead sang Google Sheets: `docs/google-sheets-webhook.gs`

Luồng dữ liệu khi khách gửi form:

1. Trình duyệt kiểm tra 3 bước của form.
2. Form gom họ tên, điện thoại, công ty, ngành, email, vấn đề, ngân sách và UTM.
3. Lead được ghi vào collection Firestore tên `leads`.
4. Nếu đã cấu hình Apps Script, một bản sao được gửi sang tab `Leads` của Google Sheets.
5. Chỉ khi Firestore ghi thành công, trang mới hiện thông báo cảm ơn.

Firestore là nguồn dữ liệu chính. Google Sheets chỉ là bản mirror để sales/ops xem thuận tiện.

## 2. Kết quả kiểm tra gói handoff

- 92 file, tổng dung lượng khoảng 31,36 MB; trong đó có 78 ảnh.
- Hai file JavaScript độc lập đã qua kiểm tra cú pháp.
- `firebase.json` và `.firebaserc` là JSON hợp lệ.
- Tất cả đường dẫn local mà `index.html` đang tham chiếu đều tồn tại.
- Nội dung tiếng Việt lưu đúng UTF-8.
- Firebase config, Google Sheets webhook và GTM Container ID vẫn đang là placeholder; chưa thể nhận lead thật cho tới khi điền giá trị từ tài khoản của bạn.
- Code đã có GTM loader và chỉ push một Custom Event `lp1990_lead_success` sau khi Firestore lưu thành công. GA4, Google Ads, Meta và TikTok sẽ được cấu hình trong GTM để tránh conversion bị bắn trùng.
- Code đã lưu `lead_id`, UTM source/medium/campaign/content/term, `gclid`, `gbraid`, `wbraid`, `fbclid`, `fbc`, `fbp`, `ttclid`, `msclkid`, landing page và referrer.
- Firestore và Google Sheet dùng cùng `lead_id` để đối chiếu.
- `PROJECT_HANDOFF_1990_LDP.md` chưa nằm trong danh sách ignore của Hosting, nên có thể bị publish như một file công khai. Nên thêm `"*.md"` vào `hosting.ignore` trước production.

## 3. Chuẩn bị tài khoản và quyền

Cần chuẩn bị:

- Một Google account có quyền tạo/quản lý Firebase project.
- Một Google account sở hữu Google Sheet nhận lead; nên dùng tài khoản công ty thay vì tài khoản cá nhân.
- Quyền DNS của tên miền sẽ dùng cho landing page.
- ID từ GA4, Google Ads, Meta Pixel và TikTok Pixel nếu cần tracking.
- Người chịu trách nhiệm nhận và xử lý lead sau khi form hoạt động.

Nên thống nhất trước:

- Firebase Project ID. Đề xuất: `1990-ldp-tu-van-mien-phi`.
- Tên miền/subdomain, ví dụ `tuvan.1990.agency`.
- Firestore region gần người dùng và phù hợp chính sách dữ liệu. Vị trí database khó hoặc không thể đổi về sau, vì vậy không chọn tùy ý.
- Google Sheet nào là bản vận hành chính và ai được quyền xem dữ liệu cá nhân.

## 4. Mở project làm việc

Project đã được giải nén tại:

```text
D:\Công việc\1990 Agency\1990 SEM - LDP\1990-ldp-tu-van-mien-phi
```

Mở PowerShell và chuyển vào thư mục:

```powershell
Set-Location -LiteralPath 'D:\Công việc\1990 Agency\1990 SEM - LDP\1990-ldp-tu-van-mien-phi'
```

Không chạy `firebase init` đè lên project này. Các file `firebase.json`, `.firebaserc` và `firestore.rules` đã có sẵn. Chạy init lại có thể thay cấu hình handoff.

## 5. Cài Firebase CLI trên Windows

Máy được kiểm tra hiện có Git nhưng chưa có Node.js, npm, Python hoặc Firebase CLI.

### Cách dễ nhất cho người mới

Dùng Firebase CLI standalone binary cho Windows theo tài liệu chính thức. Cách này không yêu cầu Node.js.

Sau khi cài, đóng và mở lại PowerShell rồi kiểm tra:

```powershell
firebase --version
```

### Cách dành cho máy đã dùng Node.js

Firebase CLI hiện yêu cầu Node.js 18 trở lên. Sau khi cài Node.js LTS:

```powershell
node --version
npm --version
npm install -g firebase-tools
firebase --version
```

Tài liệu CLI chính thức: https://firebase.google.com/docs/cli

## 6. Tạo Firebase project và Web App

1. Mở https://console.firebase.google.com/.
2. Chọn **Create a project**.
3. Đặt tên hiển thị, ví dụ `1990 LDP Tu Van Mien Phi`.
4. Kiểm tra Project ID là `1990-ldp-tu-van-mien-phi`. Project ID là duy nhất toàn cầu và không đổi được sau khi tạo.
5. Có thể bật Google Analytics ngay hoặc kết nối sau. Nếu team có GA4 property chuẩn, không tạo property mới tùy ý.
6. Khi project tạo xong, ở Project Overview chọn biểu tượng Web `</>`.
7. Đặt nickname, ví dụ `1990 LDP Web`.
8. Register app và chọn phần **Config** để lấy toàn bộ object `firebaseConfig`.

Không tự đoán `apiKey`, `appId`, `storageBucket` hoặc `messagingSenderId`. Hãy copy nguyên object Firebase cung cấp.

Firebase Web API key xuất hiện ở frontend là bình thường; nó không thay thế Security Rules và không phải chìa khóa admin. Bảo vệ dữ liệu nằm ở Firestore Rules, App Check, hạn mức và thiết kế backend.

Tài liệu Web App chính thức: https://firebase.google.com/docs/web/setup

## 7. Điền Firebase config vào landing page

Mở `index.html`, tìm `window.LP1990` ở gần đầu file và thay `FIREBASE_CONFIG` bằng object thật. Giữ nguyên tên biến và cấu trúc ngoài object.

Ví dụ hình dạng sau khi thay:

```js
window.LP1990 = {
  // các cấu hình khác...
  FIREBASE_CONFIG: {
    apiKey: "giá-trị-từ-Firebase",
    authDomain: "project-id.firebaseapp.com",
    projectId: "project-id",
    storageBucket: "giá-trị-từ-Firebase",
    messagingSenderId: "giá-trị-từ-Firebase",
    appId: "giá-trị-từ-Firebase"
  }
};
```

Nếu Project ID thực tế khác đề xuất, phải đồng bộ ít nhất:

- `index.html`: copy lại toàn bộ `FIREBASE_CONFIG` thật.
- `.firebaserc`: thay project mặc định.
- `firebase.json`: kiểm tra `hosting.site`; giá trị này phải là Hosting Site ID thực sự tồn tại.
- Các lệnh CLI: thay giá trị sau `--project`.

Chỉ sửa `.firebaserc` là chưa đủ.

## 8. Tạo Firestore

1. Trong Firebase Console, mở **Build > Firestore Database**.
2. Chọn **Create database**.
3. Chọn database mặc định `(default)` và production mode.
4. Chọn region đã thống nhất.
5. Tạo database.

Đăng nhập CLI:

```powershell
firebase login
firebase projects:list
```

Kiểm tra tài khoản đang thấy đúng project, rồi deploy rules:

```powershell
firebase deploy --only firestore:rules --project 1990-ldp-tu-van-mien-phi
```

Rules hiện tại cho phép khách ẩn danh chỉ `create` document trong `leads`; khách không thể đọc lead. Tuy nhiên rules mới chỉ kiểm tra kiểu dữ liệu và một số field bắt buộc, chưa giới hạn độ dài, format phone/email hoặc chống spam ở cấp server.

Trước khi chạy quảng cáo lớn, nên bổ sung một trong các lớp bảo vệ:

- Firebase App Check phù hợp cho web.
- Cloud Function/n8n/backend làm cổng nhận lead, rate limit và validation phía server.
- Cảnh báo ngân sách/quota trong Google Cloud.
- Không cấp quyền Firebase Authentication tùy tiện, vì rules hiện tại cho phép bất kỳ user đã sign-in đọc/sửa/xóa lead. Nếu làm dashboard admin, phải đổi sang custom claims/role admin trước.

Tài liệu rules chính thức: https://firebase.google.com/docs/rules/manage-deploy

## 9. Tạo Google Sheets mirror

Một template có tab `Leads`, đủ 28 cột và tab hướng dẫn đã được tạo tại `outputs/1990_Landing_Leads.xlsx`. Do Google Drive đích chưa được xác minh là tài khoản công ty của bạn, hệ thống chưa tự upload file này ra ngoài workspace.

1. Upload template lên đúng Google Drive công ty và chọn **Open with Google Sheets**, hoặc tạo Google Sheet mới tên `1990 Landing Leads`.
2. Trong Sheet chọn **Extensions > Apps Script**.
3. Xóa code mẫu và paste toàn bộ nội dung `docs/google-sheets-webhook.gs`.
4. Save project, ví dụ tên `1990 LDP Lead Webhook`.
5. Chọn **Deploy > New deployment**.
6. Select type: **Web app**.
7. Execute as: **Me**.
8. Who has access: lựa chọn cho phép khách landing page gọi không cần đăng nhập; trong nhiều tài khoản giao diện là **Anyone**.
9. Deploy, cấp quyền, rồi copy URL production kết thúc bằng `/exec`.
10. Dán URL đó vào `window.LP1990.SHEETS_WEBHOOK_URL` trong `index.html`.

Không dùng URL test kết thúc bằng `/dev` cho production. URL `/dev` chỉ dành cho người có quyền sửa Apps Script.

Khi sửa Apps Script về sau, vào **Deploy > Manage deployments > Edit**, tạo version mới và deploy lại. Chỉ Save code không chắc làm deployment `/exec` chạy phiên bản mới.

Webhook URL nằm trong frontend nên người khác có thể nhìn thấy và gọi trực tiếp. Apps Script hiện không xác thực request và có thể bị spam. Firestore vẫn phải là nguồn chính; với traffic quảng cáo lớn, nên chuyển việc mirror sang backend/Cloud Function/n8n.

Tài liệu Web App chính thức: https://developers.google.com/apps-script/guides/web

## 10. Cài tracking đúng cách

Tracking đã được chuẩn hóa theo mô hình một GTM container:

1. Tạo GTM Web container và lấy ID dạng `GTM-ABC1234`.
2. Điền duy nhất ID này vào `window.LP1990.GTM_ID` trong `index.html`.
3. Trong GTM, tạo Custom Event Trigger `lp1990_lead_success`.
4. Dùng trigger đó cho GA4 event `generate_lead`, Google Ads conversion, Meta event `Lead` và TikTok event `SubmitForm`.
5. Dùng `lead_id` làm `event_id` khi Meta/TikTok template hỗ trợ để chuẩn bị dedup giữa Pixel và server API.
6. Không đưa fullname, email hoặc phone thô vào dataLayer.
7. Preview bằng Tag Assistant trước khi Publish.

Hướng dẫn click-by-click, danh sách Data Layer Variables và cách cài từng pixel nằm trong `docs/gtm-and-attribution-setup.md`.

## 11. Chạy local

Sau khi cài Firebase CLI, đứng trong thư mục project và chạy:

```powershell
firebase serve --only hosting --project 1990-ldp-tu-van-mien-phi
```

Mở URL CLI in ra, thường là:

```text
http://localhost:5000
```

Không mở `index.html` bằng cách double-click nếu đang test tích hợp; HTTP local mô phỏng Hosting chính xác hơn và tránh một số khác biệt của `file://`.

Lưu ý: local page hiện vẫn ghi vào Firestore thật nếu dùng config production. Mọi test lead nên dùng dữ liệu dễ nhận diện, ví dụ họ tên `TEST - Nguyen Van A`, và xóa sau khi kiểm tra.

## 12. Checklist test form

Mở local URL có UTM mẫu:

```text
http://localhost:5000/?utm_source=codex_test&utm_medium=manual&utm_campaign=setup_test&ref=internal
```

Kiểm tra trên desktop và mobile:

- Trang không báo lỗi ở browser console.
- Logo, ảnh case study, font và carousel logo hiển thị.
- Menu, anchor link, FAQ, animation và nút CTA hoạt động.
- Bước 1 từ chối tên quá ngắn và số điện thoại sai.
- Bước 2 bắt buộc công ty và ngành.
- Bước 3 từ chối email sai.
- Nút submit bị disable trong lúc gửi để tránh double-submit.
- Submit thành công mới hiện màn hình cảm ơn.
- Firestore Console có document mới trong `leads`.
- Document có `submittedAt` kiểu timestamp và `source = 1990-ldp-tu-van-mien-phi`.
- UTM/ref/pageUrl/referrer được lưu đúng.
- Google Sheet có row mới nếu webhook đã cấu hình.
- Refresh không tự gửi lại form.
- Conversion chỉ xuất hiện một lần trong công cụ debug.

Test thêm tình huống lỗi bằng cách tạm dùng config sai trên một bản local riêng: form phải báo lỗi và không hiện cảm ơn giả.

## 13. Deploy preview

Trước hết kiểm tra Hosting site:

```powershell
firebase hosting:sites:list --project 1990-ldp-tu-van-mien-phi
```

Giá trị `hosting.site` trong `firebase.json` phải trùng một Site ID trong danh sách. Sau đó deploy preview 7 ngày:

```powershell
firebase hosting:channel:deploy preview-20260715 --project 1990-ldp-tu-van-mien-phi --expires 7d
```

Gửi preview URL cho nội bộ review nội dung, legal, tracking và form. Preview channel dùng chung Firestore production nếu config trong HTML là production, nên vẫn phải đánh dấu lead test.

Tài liệu preview channel: https://firebase.google.com/docs/hosting/test-preview-deploy

## 14. Chuẩn bị trước production

Không go-live cho tới khi các mục sau hoàn tất:

- Không còn `YOUR_`, `XXXXXXXXXX` hoặc ID placeholder.
- Base tracking scripts/GTM đã được cài và test.
- Firebase config đúng project production.
- Firestore rules đã deploy và thử cả trường hợp allow/deny.
- Thêm `"*.md"` vào `hosting.ignore` để không publish handoff/documentation.
- Xác nhận privacy policy/consent phù hợp vì form thu thập tên, điện thoại, email, công ty và user agent.
- Xác nhận email/số điện thoại/địa chỉ ở footer.
- Sales/ops đã có quyền Google Sheet và có quy trình phản hồi lead.
- Đặt budget alert và người nhận cảnh báo.
- Chụp lại version/commit sẽ deploy để có thể đối chiếu khi rollback.

Tìm placeholder nhanh bằng PowerShell:

```powershell
rg -n 'YOUR_|XXXXXXXX|G-XXXXXXXX|AW-XXXXXXXX' index.html js docs
```

Lệnh không nên trả về placeholder dùng trong code production. Hai chuỗi trong logic kiểm tra placeholder của JS có thể vẫn xuất hiện và là chủ ý; cần đọc context trước khi xóa.

## 15. Deploy production

Deploy Hosting và Firestore Rules:

```powershell
firebase deploy --only hosting,firestore:rules --project 1990-ldp-tu-van-mien-phi -m "1990 LDP initial production"
```

Sau deploy:

1. Mở URL `web.app` mà CLI trả về.
2. Hard refresh và test lại một lead production có nhãn `TEST`.
3. Kiểm tra Firestore, Google Sheet và tracking debug.
4. Xóa lead test sau khi hoàn tất.
5. Lưu URL release và thời điểm deploy vào log nội bộ.

## 16. Kết nối custom domain

1. Firebase Console > Hosting > Add custom domain.
2. Nhập domain/subdomain đã chọn.
3. Thêm TXT record xác minh theo đúng giá trị Firebase cung cấp.
4. Thêm A/AAAA/CNAME record theo hướng dẫn trên màn hình. Không tự dùng IP trong tài liệu cũ.
5. Chờ DNS xác minh và chứng chỉ SSL được cấp.
6. Test cả HTTP chuyển sang HTTPS, www/non-www hoặc subdomain chuẩn.
7. Cập nhật quảng cáo, canonical URL, GA4 data stream và các whitelist/domain settings liên quan.

Firebase Hosting tự cấp SSL cho custom domain sau khi DNS hợp lệ.

## 17. Rollback và vận hành

Nếu bản mới có lỗi giao diện/Hosting:

- Firebase Console > Hosting > Release history > chọn release ổn định > Roll back.
- Rollback Hosting không tự rollback Firestore Rules. Rules cần được quản lý bằng file và deploy version cũ riêng.

Vận hành định kỳ:

- Mỗi ngày đối chiếu số lead Firestore với Google Sheets.
- Theo dõi lỗi form và tỷ lệ submit.
- Kiểm tra quota/cost Firestore và Apps Script.
- Không sửa trực tiếp rules trên Console mà quên đồng bộ `firestore.rules` local.
- Mỗi lần sửa Apps Script phải update deployment production.
- Mỗi lần sửa landing page: local test > preview > duyệt > production.

## 18. Thứ tự thực hiện đề xuất

1. Cài Firebase CLI.
2. Tạo Firebase project và Web App.
3. Tạo Firestore đúng region.
4. Copy Firebase config thật vào `index.html`.
5. Đồng bộ Project ID/Site ID trong `.firebaserc` và `firebase.json`.
6. Deploy Firestore Rules.
7. Tạo Google Sheet và Apps Script `/exec`.
8. Điền webhook URL.
9. Cài base tracking/GTM và ID thật.
10. Sửa Hosting ignore để không publish file Markdown.
11. Chạy local và test form/UTM.
12. Deploy preview và review nội bộ.
13. Bổ sung lớp chống spam/bảo mật trước khi đổ traffic lớn.
14. Deploy production.
15. Kết nối custom domain và test lại toàn bộ.
