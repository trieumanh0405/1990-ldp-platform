# Danh mục Landing Page — 1990 Agency

Tài liệu này dùng để phân biệt các landing page độc lập và các phiên bản bên trong từng landing page.

## Quy ước

- `LDP-01`, `LDP-02`: hai landing page/sản phẩm độc lập.
- `v1`, `v2`: các phiên bản chỉnh sửa của cùng một landing page.
- Ví dụ: `LDP-02/v1` là bản đầu tiên của Quiz; `LDP-02/v2` là lần sửa tiếp theo của chính Quiz.
- Mỗi LDP có Hosting site, preview channel và collection lead riêng.
- Không ghi đè source hoặc production của LDP khác.

## LDP-01 — Tư vấn miễn phí

- Mã trao đổi: `LDP-01`
- Phiên bản hiện tại: `LDP-01/v1`
- Source: `D:\Công việc\1990 Agency\1990 SEM - LDP\1990-ldp-tu-van-mien-phi`
- Firebase project: `ldp-tu-van-mien-phi`
- Hosting site: `ldp-tu-van-mien-phi`
- Production URL: `https://tuvan.1990.agency`
- Hosting default URL: `https://ldp-tu-van-mien-phi.web.app`
- Preview channel: `setup-review-20260717`
- Preview URL: `https://ldp-tu-van-mien-phi--setup-review-20260717-ov737szw.web.app`
- Preview hết hạn: `21/08/2026`
- Firestore collection: `leads`
- Lead source: `1990-ldp-tu-van-mien-phi`
- Trạng thái: `PRODUCTION`
- Google Sheet: Đã kết nối Web App; tab đích `LDP-Tư Vấn-01`
- Tracking: Cấu hình được GTM, GA4, Meta Pixel, TikTok Pixel và Mailchimp trong CMS
- Production: Đã deploy ngày `23/07/2026`
- QA production: Form, Google Sheet và URL có UTM/click ID đã kiểm tra thành công

## LDP-02 — Quiz Signal System

- Mã trao đổi: `LDP-02`
- Phiên bản hiện tại: `LDP-02/v1`
- Source gốc: `D:\Công việc\1990 Agency\1990 SEM - LDP\2 - LDP Quiz 2\LDP 1990 Quiz`
- Firebase project: `ldp-tu-van-mien-phi`
- Hosting site: `1990-ldp-quiz-signal`
- Production URL: `https://quizsignal.1990.agency`
- Hosting default URL: `https://1990-ldp-quiz-signal.web.app`
- Preview channel: `ldp02-v1-review-20260717`
- Preview URL: `https://1990-ldp-quiz-signal--ldp02-v1-review-20260717-0ihpdp01.web.app`
- Preview hết hạn: `21/08/2026`
- Firestore collection: `quiz_leads`
- Lead source: `1990-ldp-quiz-signal-system`
- Firestore Rules: Đã deploy
- Google Sheet: Đã kết nối Web App; tab đích `LDP-Quiz-02`
- Tracking: Cấu hình được GTM, GA4, Meta Pixel và TikTok Pixel trong CMS
- Trạng thái: `PRODUCTION`
- Production: Đã deploy ngày `23/07/2026`
- QA production: Quiz, form, Google Sheet và URL có UTM/click ID đã kiểm tra thành công

## Mẫu báo lỗi

```text
Landing page: LDP-01 hoặc LDP-02
Phiên bản: v1/v2/...
Thiết bị: Desktop/iPhone/Android
Trình duyệt: Chrome/Safari/Edge
URL: ...
Vị trí lỗi: Hero/Quiz/Form/FAQ/Footer/...
Hiện tượng: ...
Kỳ vọng: ...
Ảnh hoặc video: đính kèm
```

## CMS dùng chung — 1990 LDP CMS

- Thư mục: `1990-ldp-cms`
- Firebase Hosting site: `1990-ldp-cms`
- Quản lý độc lập hai page ID: `ldp01` và `ldp02`
- Chức năng: Google Auth, nội dung chia theo section, nháp/xem thử/xuất bản, SEO/social, Google Sheets, GTM/GA4/Meta/TikTok/Mailchimp, lịch sử phiên bản, quản lý lead, CSV, đội ngũ.
- Tài khoản bootstrap owner: `manh.trieu@1990.agency`
- CMS preview: `https://1990-ldp-cms--cms-v1-review-20260722-9mhyydq6.web.app`
- Hết hạn preview hiện tại: `2026-08-21`
- Trạng thái 2026-07-23: Hai LDP đã deploy production trên custom domain; Firestore Rules và CMS preview hoạt động; Mailchimp LDP-01 hoạt động; Google Sheets đã nối cùng Web App URL và tách tab theo từng LDP.

## Quy tắc production

- Chỉ deploy production khi người duyệt gọi rõ mã LDP và phiên bản.
- Ví dụ hợp lệ: `Đưa LDP-02/v1 lên production`.
- Không dùng câu chung như `đưa bản mới lên` nếu đang có nhiều LDP.
