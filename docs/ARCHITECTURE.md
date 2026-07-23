# Kiến trúc hệ thống

## 1. Phạm vi

Hệ thống gồm hai landing page độc lập và một CMS dùng chung:

- `LDP-01`: thu lead tư vấn trực tiếp.
- `LDP-02`: chấm Signal Score, sau đó thu lead nhận báo cáo/tư vấn.
- `CMS`: quản lý cấu hình và nội dung của cả hai page bằng `pageId`.

Tất cả dùng chung Firebase project `ldp-tu-van-mien-phi`, nhưng được tách bằng Hosting site, collection và cấu hình.

## 2. Bảng ánh xạ bắt buộc

| Thuộc tính | LDP-01 | LDP-02 |
|---|---|---|
| `pageId` CMS | `ldp01` | `ldp02` |
| Hosting site | `ldp-tu-van-mien-phi` | `1990-ldp-quiz-signal` |
| Domain | `tuvan.1990.agency` | `quizsignal.1990.agency` |
| Collection lead | `leads` | `quiz_leads` |
| Lead source | `1990-ldp-tu-van-mien-phi` | `1990-ldp-quiz-signal-system` |
| Sheet tab | `LDP-Tư Vấn-01` | `LDP-Quiz-02` |
| Submit module | `js/lead-submit.js` | `js/quiz-lead-submit.js` |

Sai một giá trị trong bảng này có thể khiến lead đi nhầm collection, nhầm sheet hoặc deploy nhầm site.

## 3. Firestore

Các collection chính:

- `cms_public/{pageId}`: cấu hình/nội dung đã xuất bản, LDP được đọc công khai.
- `cms_drafts/{pageId}`: bản nháp, chỉ admin CMS.
- `cms_versions/{pageId}/items/{versionId}`: lịch sử xuất bản.
- `cms_admins/{uid}`: thành viên và vai trò.
- `leads`: dữ liệu gốc của LDP-01.
- `quiz_leads`: dữ liệu gốc của LDP-02.

Firestore Rules nằm tại `1990-ldp-tu-van-mien-phi/firestore.rules`.

## 4. Cấu trúc JavaScript của LDP

Mỗi LDP có các module cùng vai trò:

- `firebase-init.js`: khởi tạo Firebase/Firestore.
- `attribution.js`: đọc UTM, referrer và click ID.
- `cms-loader.js`: tải cấu hình đã xuất bản từ `cms_public`.
- `tracking.js`: nạp GTM/GA4/Meta/TikTok/Mailchimp theo cấu hình.
- `lead-submit.js` hoặc `quiz-lead-submit.js`: chuẩn hóa và gửi lead.

LDP-02 có thêm logic quiz và dữ liệu kết quả trước khi hiển thị form lead.

## 5. Google Sheets bridge

`google-apps-script/Code.gs` nhận payload, kiểm tra `source`, chống ghi trùng theo `lead_id`, chống formula injection và ghi vào tab tương ứng.

Website không ghi trực tiếp vào Google Sheet bằng link `/edit`. Website POST tới Apps Script Web App URL `/exec`.

## 6. CMS

CMS dùng Firebase Authentication với Google. Quyền được lưu bằng UID:

- `owner`: toàn quyền và quản lý thành viên.
- `editor`: chỉnh nội dung/cấu hình và vận hành lead.

CMS chỉ quản lý nội dung đã được đánh dấu trong LDP và các cấu hình công khai. Secret cho server-side tracking không được lưu trong CMS.

## 7. Domain và Hosting

Custom domain kết nối với production channel:

- `tuvan.1990.agency` → site `ldp-tu-van-mien-phi`.
- `quizsignal.1990.agency` → site `1990-ldp-quiz-signal`.

Preview channel có URL riêng và thời hạn. Custom domain không tự hiển thị preview.
