# Google Sheets bridge cho 2 LDP 1990

Script này nhận lead từ hai landing page, kiểm tra dữ liệu, chống ghi trùng theo `lead_id`, chống formula injection và chuyển lead vào đúng tab:

- `1990-ldp-tu-van-mien-phi` → `LDP-Tư Vấn-01`
- `1990-ldp-quiz-signal-system` → `LDP-Quiz-02`

## Thiết lập một lần

1. Mở Google Sheet `INT 1990 - Tracking PFM - SEM Project 2026`.
2. Chọn **Extensions → Apps Script**.
3. Xóa nội dung mẫu trong `Code.gs`, sao chép toàn bộ nội dung file `Code.gs` trong thư mục này và bấm **Save**.
4. Chọn **Deploy → New deployment**.
5. Ở **Select type**, chọn **Web app**.
6. Đặt Description là `1990 Lead Sheet Bridge v1`.
7. **Execute as:** chọn `Me`.
8. **Who has access:** chọn `Anyone` (website không yêu cầu người gửi đăng nhập Google).
9. Bấm **Deploy**, cấp quyền truy cập Sheet và sao chép URL kết thúc bằng `/exec`.
10. Mở CMS → **SEO & Tích hợp** → chọn từng LDP → bật **Google Sheets** → dán cùng Web App URL → kiểm tra tên tab → **Xuất bản cấu hình**.

Không dán Google API key, service-account key hoặc token bí mật vào CMS. Khi sửa `Code.gs`, dùng **Deploy → Manage deployments → Edit → New version → Deploy** để URL `/exec` không thay đổi.
