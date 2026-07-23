# Phạm vi repository

## Được đưa lên GitHub

- Source production LDP-01.
- Source production LDP-02.
- Source CMS.
- Firebase Hosting config.
- Firestore Rules.
- Google Apps Script bridge.
- Tài liệu setup, kiến trúc, deploy và vận hành.
- Asset thực sự được production sử dụng.

## Chỉ giữ local, không commit

- `node_modules/`.
- `.firebase/` và log Firebase.
- File `.env` và credential.
- ZIP bàn giao/source archive.
- `BQ/`: PDF credential và file trích xuất dùng làm tài liệu tham chiếu.
- `outputs/`, `_checks/`, `_sheet_build/`: file kiểm tra hoặc build tạm.
- Bản handoff/source trùng nằm trong `LDP ...` hoặc `LDP 1990 Quiz (1)`.
- Thư mục raw/duplicate asset không được Hosting production sử dụng.

## Lý do

- Giảm kích thước clone và lịch sử Git.
- Tránh commit tài liệu nội bộ nặng hoặc không cần cho runtime.
- Tránh nhầm bản source handoff với source production.
- Giảm rủi ro lộ credential, token hoặc dữ liệu lead.

## Nguồn production duy nhất

- LDP-01: `1990-ldp-tu-van-mien-phi/`.
- LDP-02: `2 - LDP Quiz 2/LDP 1990 Quiz/`.
- CMS: `1990-ldp-cms/`.

Nếu cần đưa tài liệu tham chiếu nặng lên cloud, dùng Google Drive/SharePoint hoặc Git LFS riêng; không thêm trực tiếp vào repository runtime này.
