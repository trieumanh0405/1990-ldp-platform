# Vận hành CMS, lead và tracking

## 1. CMS dùng chung

CMS quản lý nhiều landing page bằng bộ chọn Landing page. Trước khi sửa hoặc xuất bản, luôn kiểm tra đang chọn:

- `LDP Tư vấn miễn phí`, hoặc
- `LDP Quiz Signal System`.

Nội dung và cấu hình được lưu theo `pageId`, không dùng chung một document.

## 2. Quy trình chỉnh nội dung

1. Chọn đúng LDP.
2. Chỉnh section cần thiết.
3. Lưu nháp.
4. Xem thử.
5. Kiểm tra desktop/mobile.
6. Xuất bản.
7. Mở domain production bằng cửa sổ ẩn danh và kiểm tra lại.

## 3. Google Sheets

Hai LDP dùng chung Apps Script Web App nhưng tách tab:

- LDP-01 → `LDP-Tư Vấn-01`.
- LDP-02 → `LDP-Quiz-02`.

Khi cập nhật `Code.gs`:

1. Apps Script → Deploy → Manage deployments.
2. Edit deployment.
3. Chọn New version.
4. Deploy.
5. Giữ nguyên URL `/exec`.

Link Google Sheet `/edit` chỉ dành cho đội vận hành; nó không thay thế Web App URL.

## 4. Test lead chuẩn

Dùng dữ liệu QA, không dùng thông tin cá nhân thật:

```text
Họ tên: TEST QA <ngày/giờ> LDP01 hoặc LDP02
Điện thoại: số test được đội vận hành thống nhất
Email: địa chỉ test của 1990
utm_source: qa
utm_medium: internal
utm_campaign: production_check
```

Kiểm tra:

- Màn hình cảm ơn xuất hiện.
- Firestore có document mới.
- Sheet có đúng dòng mới.
- `source`, `landingPage`, `pageURL`, UTM và click ID đúng.

Sau kiểm tra, xóa/đánh dấu lead QA để không ảnh hưởng báo cáo.

## 5. Attribution

Các trường quan trọng:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `gbraid`
- `wbraid`
- `fbclid`
- `fbc`
- `fbp`
- `ttclid`
- `msclkid`
- `referrer`
- `firstReferrer`
- `landingPage`
- `pageURL`

Không phải lượt truy cập nào cũng có tất cả trường. Ví dụ `fbc` chỉ có khi có click Facebook hợp lệ hoặc cookie liên quan; `fbp` phụ thuộc cookie trình duyệt.

## 6. Tracking

Ưu tiên quản lý GA4 và conversion tags bằng GTM. Nếu đã chạy GA4 trong GTM, không nạp thêm GA4 trực tiếp để tránh đếm đôi.

CMS chỉ nhận ID công khai:

- `GTM-...`
- `G-...`
- Meta Pixel ID
- TikTok Pixel ID
- Mailchimp connected-site script URL

Không nhập access token hoặc API key bí mật.

## 7. Xử lý sự cố

### Domain Connected nhưng Site Not Found

Hosting site chưa có production release. Deploy production đúng site.

### Form cảm ơn nhưng Sheet chưa có dòng

1. Kiểm tra Firestore trước.
2. Kiểm tra `sheetsEnabled`.
3. Kiểm tra Web App URL kết thúc bằng `/exec`.
4. Kiểm tra Apps Script deployment là version mới.
5. Kiểm tra đúng tên tab và quyền `Anyone`.

### Firestore và Sheet đều không có lead

1. Mở console trình duyệt.
2. Kiểm tra Firestore Rules.
3. Kiểm tra Firebase config/project.
4. Kiểm tra file JavaScript có bị cache cũ không.

### Tracking không chạy

1. Kiểm tra toggle Tracking trong CMS.
2. Kiểm tra format ID.
3. Xuất bản cấu hình.
4. Tải lại bằng cửa sổ ẩn danh.
5. Dùng Tag Assistant/Pixel Helper để xác nhận.
