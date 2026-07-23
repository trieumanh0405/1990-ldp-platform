# GTM, pixels và attribution cho 1990 LDP

## Kiến trúc đã cài trong code

Website chỉ nạp một Google Tag Manager container qua `window.LP1990.GTM_ID`.

Sau khi Firestore lưu lead thành công, website push đúng một event:

```js
{
  event: "lp1990_lead_success",
  event_id: "cùng giá trị với lead_id",
  lead_id: "UUID của lead",
  form_name: "tu-van-mien-phi",
  lead_source: "1990-ldp-tu-van-mien-phi",
  utm_source: "...",
  utm_medium: "...",
  utm_campaign: "...",
  utm_content: "...",
  utm_term: "...",
  gclid: "...",
  gbraid: "...",
  wbraid: "...",
  fbclid: "...",
  ttclid: "..."
}
```

GTM dùng Custom Event này để bắn GA4, Google Ads, Meta và TikTok. Không cài lại các lời gọi conversion trực tiếp trong HTML vì sẽ dễ đếm trùng.

Không đưa họ tên, email hoặc số điện thoại vào `dataLayer`.

## 1. Tạo GTM container

1. Mở https://tagmanager.google.com/ bằng tài khoản công ty.
2. Chọn **Create Account** nếu chưa có account phù hợp.
3. Account Name: `1990 Agency`.
4. Country: `Vietnam`.
5. Container Name: tên miền hoặc `1990 LDP Tu Van Mien Phi`.
6. Target platform: **Web**.
7. Create và chấp nhận điều khoản.
8. Copy Container ID có dạng `GTM-ABC1234`.
9. Trong `index.html`, thay:

```js
GTM_ID: 'GTM-XXXXXXX'
```

bằng ID thật. Không cần paste lại toàn bộ snippet GTM vì `js/tracking.js` đã làm nhiệm vụ loader.

## 2. Tạo Data Layer Variables trong GTM

Vào **Variables > User-Defined Variables > New > Data Layer Variable**.

Tạo từng variable, Data Layer Version 2:

| Tên variable trong GTM | Data Layer Variable Name |
|---|---|
| `DLV - event_id` | `event_id` |
| `DLV - lead_id` | `lead_id` |
| `DLV - form_name` | `form_name` |
| `DLV - lead_source` | `lead_source` |
| `DLV - utm_source` | `utm_source` |
| `DLV - utm_medium` | `utm_medium` |
| `DLV - utm_campaign` | `utm_campaign` |
| `DLV - utm_content` | `utm_content` |
| `DLV - utm_term` | `utm_term` |

Click ID không bắt buộc đưa vào tag browser vì các pixel thường tự đọc URL/cookie, nhưng chúng vẫn được lưu trong Firestore và Google Sheet.

## 3. Tạo trigger thành công

1. Vào **Triggers > New**.
2. Tên: `CE - lp1990_lead_success`.
3. Trigger Type: **Custom Event**.
4. Event name: `lp1990_lead_success`.
5. Chọn **All Custom Events**.
6. Save.

Trigger này chỉ xuất hiện sau khi Firestore lưu thành công, không chạy chỉ vì khách bấm nút.

## 4. Cài GA4

1. Trong GA4 Admin, tạo/chọn đúng Property.
2. **Data Streams > Web** và tạo/chọn stream cho domain landing page.
3. Copy Measurement ID dạng `G-XXXXXXXXXX`.
4. Trong GTM tạo **Google tag**:
   - Tag ID: Measurement ID thật.
   - Trigger: **Initialization - All Pages** hoặc **All Pages** theo setup hiện tại của team.
5. Tạo **Google Analytics: GA4 Event**:
   - Event name: `generate_lead`.
   - Event parameter `lead_id` = `{{DLV - lead_id}}`.
   - Event parameter `form_name` = `{{DLV - form_name}}`.
   - Event parameter `lead_source` = `{{DLV - lead_source}}`.
   - Trigger: `CE - lp1990_lead_success`.
6. Trong GA4 Admin > Events/Key events, đánh dấu `generate_lead` là key event nếu đây là conversion chính.

## 5. Cài Google Ads conversion

1. Google Ads > Goals > Conversions > Summary.
2. Tạo/chọn conversion action cho form lead website.
3. Copy **Conversion ID** dạng `AW-...` và **Conversion Label**.
4. Trong GTM tạo **Conversion Linker**, trigger **All Pages**.
5. Tạo **Google Ads Conversion Tracking**:
   - Conversion ID: ID thật.
   - Conversion Label: label thật.
   - Trigger: `CE - lp1990_lead_success`.
6. Không tạo thêm conversion tag cùng mục tiêu qua cả GA4 import và Google Ads tag nếu team không chủ động muốn hai nguồn. Chọn một conversion chính để bidding tránh đếm đôi.

Google Ads nên bật auto-tagging để URL quảng cáo nhận `gclid`, `gbraid` hoặc `wbraid`. Code đã lưu các giá trị này.

## 6. Cài Meta Pixel

1. Meta Events Manager > **Connect data > Web**.
2. Tạo/chọn Dataset/Pixel và copy Pixel ID.
3. Chọn phương thức cài bằng Google Tag Manager nếu giao diện Meta cung cấp, hoặc lấy đúng base code Meta cung cấp và đặt trong GTM.
4. Base Pixel/PageView dùng trigger **All Pages** sau khi consent cho phép.
5. Tạo tag event `Lead`, trigger `CE - lp1990_lead_success`.
6. Dùng `{{DLV - event_id}}` làm Event ID nếu tag/template hỗ trợ. Giá trị này giúp deduplicate khi sau này bắn cùng event qua Conversions API.
7. Không đưa email, phone, fullname thô vào GTM/dataLayer.

Sau khi Meta Pixel chạy và browser cho phép cookie, code sẽ đọc `_fbp`. Khi traffic đến từ quảng cáo có `fbclid`, code đọc `_fbc` hoặc tạo giá trị `fbc` phù hợp để lưu cùng lead. Vì vậy:

- `fbp` trống là bình thường khi Pixel chưa chạy, cookie bị từ chối hoặc browser chặn tracking.
- `fbc` trống là bình thường khi không có click Meta và không có cookie `_fbc`.
- `fbclid` là click ID trong URL; `fbc/fbp` là các browser identifier dùng cho matching/CAPI.

Meta khuyến nghị dùng Pixel cùng Conversions API. Nếu triển khai CAPI sau này, gửi `event_id = lead_id` ở cả browser và server để deduplicate.

## 7. Cài TikTok Pixel

1. TikTok Ads Manager > Tools/Assets > Events Manager.
2. Chọn Website và tạo/chọn Pixel.
3. Copy Pixel ID.
4. Chọn setup qua Google Tag Manager nếu được cung cấp, hoặc dùng code/template do TikTok cung cấp.
5. Base Pixel/PageView dùng trigger **All Pages** sau khi consent cho phép.
6. Tạo event phù hợp mục tiêu lead, đề xuất `SubmitForm`, trigger `CE - lp1990_lead_success`.
7. Nếu template hỗ trợ Event ID, dùng `{{DLV - event_id}}`.

Code lưu `ttclid` từ URL vào Firestore và Google Sheet. `ttclid` trống là bình thường với traffic không đến từ TikTok Ads.

## 8. Consent và privacy

Trước production cần quyết định chính sách cookie/consent cùng legal. Nếu phải xin consent, cấu hình Google Consent Mode và đặt điều kiện consent cho GA4/Ads/Meta/TikTok trong GTM. Không publish pixels trước consent chỉ vì đã có ID.

Footer website hiện vẫn có placeholder chính sách bảo mật và điều khoản. Cần thay bằng URL thật trước go-live.

## 9. Test GTM

1. GTM > **Preview**.
2. Nhập preview URL của Firebase Hosting.
3. Mở URL có tham số test:

```text
https://PREVIEW-URL/?utm_source=meta&utm_medium=paid_social&utm_campaign=setup_test&utm_content=creative_a&utm_term=audience_a&fbclid=TEST_FBCLID&ttclid=TEST_TTCLID&gclid=TEST_GCLID
```

4. Submit một lead có tên bắt đầu bằng `TEST -`.
5. Trong Tag Assistant, chọn event `lp1990_lead_success`.
6. Xác nhận chỉ các tag conversion dự kiến fired đúng một lần.
7. Kiểm tra GA4 DebugView, Google Ads Tag Diagnostics, Meta Test Events và TikTok Events Manager.
8. Đối chiếu `lead_id` trong Firestore và Google Sheet.
9. Xóa lead test sau khi nghiệm thu.

## 10. Publish GTM

Chỉ publish khi Preview đã đúng:

1. GTM > Submit.
2. Version Name, ví dụ `1990 LDP - initial tracking`.
3. Ghi rõ các tag/trigger đã thêm.
4. Publish.
5. Test lại trên domain production.
