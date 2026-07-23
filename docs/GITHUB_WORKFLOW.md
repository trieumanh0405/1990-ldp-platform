# Quy trình GitHub

## Repository

- Owner: `trieumanh0405`
- Tên: `1990-ldp-platform`
- Visibility: `Private`
- Nhánh mặc định: `main`

## Commit đầu tiên

Chạy tại thư mục root:

```powershell
Set-Location -LiteralPath 'D:\Công việc\1990 Agency\1990 SEM - LDP'
git status --short
git add -A
git diff --cached --stat
git commit -m "Initialize 1990 LDP platform"
gh repo create trieumanh0405/1990-ldp-platform --private --source . --remote origin --push
```

Trước khi chạy `git add -A`, phải xác nhận `.gitignore` đang loại:

- ZIP và source handoff trùng.
- `BQ/`.
- `node_modules/`.
- `.firebase/`.
- thư mục build/check tạm.
- `__MACOSX`, `.DS_Store` và AppleDouble `._*`.
- credential, `.env`, service-account key.

## Làm việc hằng ngày

Không làm trực tiếp trên `main` cho thay đổi lớn:

```powershell
git switch main
git pull
git switch -c feature/mo-ta-ngan
```

Sau khi sửa và kiểm tra:

```powershell
git status
git add <danh-sach-file>
git commit -m "Mô tả ngắn thay đổi"
git push -u origin feature/mo-ta-ngan
```

Tạo Pull Request trên GitHub, review preview/deploy checklist rồi mới merge.

## Quy ước commit

- `Update LDP-01 hero copy`
- `Fix LDP-02 quiz lead submission`
- `Update CMS tracking configuration`
- `Add Firestore lead validation`
- `Document production deployment`

Không dùng commit chung chung như `update`, `fix` hoặc `new version`.

## Release và deploy

Git push không tự động deploy Firebase trong cấu hình hiện tại. Sau khi merge:

1. Xác định `LDP-01`, `LDP-02` hoặc CMS.
2. Deploy preview.
3. Kiểm tra và duyệt.
4. Deploy production đúng Hosting site.
5. Ghi lại release trong `LDP_VERSION_REGISTRY.md`.
