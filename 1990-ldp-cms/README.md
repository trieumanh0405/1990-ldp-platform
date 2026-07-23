# 1990 LDP CMS

CMS nội bộ dùng chung cho hai landing page độc lập:

- `ldp01`: LDP Tư vấn miễn phí, collection lead `leads`.
- `ldp02`: LDP Quiz Signal System, collection lead `quiz_leads`.

## Chức năng

- Đăng nhập Google bằng Firebase Authentication.
- Chỉnh nội dung theo các vùng `data-copy` có sẵn trên từng LDP.
- Lưu nháp, xem thử trực tiếp, xuất bản và lưu lịch sử phiên bản.
- Xem, tìm, lọc, ghi chú, giao người phụ trách và cập nhật trạng thái lead.
- Kiểm tra UTM, `gclid`, `fbclid`, `fbc`, `fbp`, `ttclid` và xuất CSV.
- Phân quyền `owner` và `editor` bằng Firebase UID.

## Mô hình dữ liệu Firestore

- `cms_public/{pageId}`: nội dung đã xuất bản; LDP được phép đọc công khai.
- `cms_drafts/{pageId}`: bản nháp; chỉ admin CMS được đọc/ghi.
- `cms_versions/{pageId}/items/{versionId}`: lịch sử xuất bản.
- `cms_admins/{uid}`: thành viên và vai trò.
- `leads`, `quiz_leads`: lead gốc; public chỉ được tạo đúng schema, admin CMS mới được đọc và chỉ được cập nhật trường vận hành CMS.

Tài khoản bootstrap owner: `manh.trieu@1990.agency`.

## Thiết lập Firebase Authentication (thao tác một lần)

1. Firebase Console → project `ldp-tu-van-mien-phi`.
2. Chọn **Build → Authentication → Get started**.
3. Tab **Sign-in method** → **Google** → bật **Enable**.
4. Chọn email hỗ trợ → **Save**.
5. Authentication → **Settings → Authorized domains**.
6. Thêm domain CMS production `1990-ldp-cms.web.app` và domain preview CMS được Firebase CLI trả về.

## Vai trò

- `owner`: toàn bộ chức năng, quản lý thành viên.
- `editor`: chỉnh/xuất bản nội dung, xem và cập nhật vận hành lead; không quản lý thành viên.

Thành viên mới đăng nhập thử một lần để thấy UID trong thông báo, gửi UID cho Owner, sau đó Owner thêm UID + email trong mục **Đội ngũ & quyền**.

## Lưu ý nội dung

- CMS quản lý phần chữ đã đánh dấu `data-copy`; không sửa layout/CSS hoặc logic form.
- Cho phép các thẻ định dạng an toàn: `br`, `strong`, `em`, `b`, `i`, và `span.red`.
- Ảnh dùng URL hoặc asset đã deploy. Firebase Storage không nằm trong bản này vì project đang dùng Spark và Storage yêu cầu bật billing.
- “Xem thử” chỉ cập nhật iframe trong phiên làm việc; “Xuất bản” mới ghi vào `cms_public`.
- LDP đọc nội dung đã xuất bản khi tải trang, nên không cần deploy lại LDP sau mỗi lần sửa chữ.

## Triển khai

Các lệnh sử dụng Firebase CLI đã cài trong thư mục LDP-01:

```powershell
# Deploy security rules (chạy tại thư mục LDP-01)
.\node_modules\.bin\firebase.cmd deploy --only firestore:rules --project ldp-tu-van-mien-phi

# Tạo Hosting site CMS (chỉ chạy lần đầu)
.\node_modules\.bin\firebase.cmd hosting:sites:create 1990-ldp-cms --project ldp-tu-van-mien-phi

# Deploy preview CMS (chạy tại thư mục CMS)
..\1990-ldp-tu-van-mien-phi\node_modules\.bin\firebase.cmd hosting:channel:deploy cms-v1-review-20260722 --expires 30d --project ldp-tu-van-mien-phi
```

Sau đó deploy lại hai preview LDP để đưa `cms-loader.js` lên Hosting.
