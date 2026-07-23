# Deploy và rollback

## 1. Nguyên tắc

- Hai LDP là hai sản phẩm độc lập.
- Mỗi lệnh deploy phải chạy trong đúng thư mục chứa `firebase.json`.
- Trước khi deploy, kiểm tra `hosting.site`.
- Duyệt preview trước, sau đó mới deploy production.
- Custom domain chỉ nhận production release.

## 2. Chuẩn bị

```powershell
Set-Location -LiteralPath '.\1990-ldp-tu-van-mien-phi'
npm.cmd install
.\node_modules\.bin\firebase.cmd login --reauth
```

Kiểm tra tài khoản/project:

```powershell
.\node_modules\.bin\firebase.cmd projects:list
```

## 3. Preview LDP-01

```powershell
Set-Location -LiteralPath '.\1990-ldp-tu-van-mien-phi'
.\node_modules\.bin\firebase.cmd hosting:channel:deploy ldp01-review --expires 30d --project ldp-tu-van-mien-phi
```

## 4. Preview LDP-02

```powershell
Set-Location -LiteralPath '.\2 - LDP Quiz 2\LDP 1990 Quiz'
& '..\..\1990-ldp-tu-van-mien-phi\node_modules\.bin\firebase.cmd' hosting:channel:deploy ldp02-review --expires 30d --project ldp-tu-van-mien-phi
```

## 5. Production LDP-01

```powershell
Set-Location -LiteralPath '.\1990-ldp-tu-van-mien-phi'
.\node_modules\.bin\firebase.cmd deploy --only hosting --project ldp-tu-van-mien-phi
```

Kết quả mong đợi:

```text
hosting[ldp-tu-van-mien-phi]: release complete
Deploy complete!
```

## 6. Production LDP-02

```powershell
Set-Location -LiteralPath '.\2 - LDP Quiz 2\LDP 1990 Quiz'
& '..\..\1990-ldp-tu-van-mien-phi\node_modules\.bin\firebase.cmd' deploy --only hosting --project ldp-tu-van-mien-phi
```

Kết quả mong đợi:

```text
hosting[1990-ldp-quiz-signal]: release complete
Deploy complete!
```

## 7. Firestore Rules

Chỉ chạy khi đã review thay đổi rules:

```powershell
Set-Location -LiteralPath '.\1990-ldp-tu-van-mien-phi'
.\node_modules\.bin\firebase.cmd deploy --only firestore:rules --project ldp-tu-van-mien-phi
```

## 8. CMS

CMS hiện có thể tiếp tục dùng preview trong giai đoạn hoàn thiện. Khi chốt production:

```powershell
Set-Location -LiteralPath '.\1990-ldp-cms'
& '..\1990-ldp-tu-van-mien-phi\node_modules\.bin\firebase.cmd' deploy --only hosting --project ldp-tu-van-mien-phi
```

Sau này có thể gắn `cms.1990.agency` mà không ảnh hưởng hai LDP.

## 9. Checklist sau deploy

Kiểm tra riêng từng domain:

1. Trang trả về HTTPS và đúng nội dung.
2. Logo, ảnh case study và font tải được.
3. Form/quiz chạy hết luồng.
4. Gửi lead QA có tên dễ nhận biết.
5. Firestore đúng collection.
6. Google Sheet đúng tab.
7. UTM, URL, referrer và click ID được ghi.
8. GTM/GA4/Meta/TikTok chạy đúng ID đã cấu hình.
9. Chính sách bảo mật và điều khoản mở được.
10. Xóa lead QA sau khi xác nhận.

## 10. Rollback

Trong Firebase Console:

1. Hosting → chọn đúng site.
2. Xem lịch sử release.
3. Chọn release ổn định trước đó.
4. Roll back/release lại phiên bản đó.

Không rollback site còn lại nếu lỗi chỉ xuất hiện ở một LDP.
