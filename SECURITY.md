# Security Policy

## Repository

Repository phải ở chế độ **Private** và chỉ cấp quyền cho thành viên cần thiết.

## Không được commit

- Firebase Admin SDK/service-account JSON.
- Google service-account key.
- Meta Conversion API access token.
- TikTok Events API access token.
- Mailchimp API key.
- GitHub token.
- Password, OTP hoặc cookie đăng nhập.
- File CSV/export chứa lead thật.

Firebase Web `apiKey`, Measurement ID, Pixel ID và GTM ID là mã định danh phía client, không phải secret server-side. Dù vậy, cần giới hạn API theo domain/API trong Google Cloud khi phù hợp.

## Khi lộ secret

1. Thu hồi/rotate secret tại hệ thống nguồn.
2. Không chỉ xóa ở commit mới; phải làm sạch lịch sử Git nếu secret đã được push.
3. Kiểm tra log sử dụng bất thường.
4. Cập nhật secret trong backend/Secret Manager.
5. Deploy lại và xác nhận hoạt động.

## Dữ liệu lead

Firestore và Google Sheet chứa dữ liệu cá nhân. Chỉ tài khoản được phân quyền mới được đọc. Không đưa dữ liệu lead vào issue, commit, screenshot công khai hoặc repository.
