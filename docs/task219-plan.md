# /task219: Giving Guarantee banners (GitLab #219)

Nguồn: file "Task #219" ở thư mục gốc repo (chưa đưa vào git).

Task yêu cầu 2 version:

| Version | Có gì |
|---|---|
| **Version 1** (có trang Giving Guarantee) | (1) Banner lớn ở trang chủ, ít chữ, chủ yếu để nhận diện; bấm vào mở (3). (2) Badge ở trang project, gần nút Give; bấm vào mở (3). (3) Trang Giving Guarantee giải thích chi tiết. |
| **Version 2** (không có trang riêng) | (1) Banner lớn ở trang chủ, đủ thông tin để hiểu; bấm vào mở FAQ. (2) Mini banner ở trang project, gần nút Give; bấm vào mở (1). |

Copy dùng đúng 3 đoạn "Proposed Copy" trong task. Câu "100% refunded" lấy từ phần Background.

## Tham khảo

Give.asia chặn cả WebFetch lẫn curl (403), nên em không xem được giao diện của họ. Điều khoản thì đọc được qua trang trợ giúp và kết quả tìm kiếm:
- Mọi khoản quyên góp được bảo vệ và hoàn lại trong 12 tháng, áp dụng cho cả chiến dịch cá nhân và chiến dịch từ thiện.
- Khi nghi ngờ gian lận, người cho liên hệ team trong vòng 12 tháng.
- Không hoàn một phần. Tiền hoàn về thẻ đã dùng trong 5–10 ngày làm việc.
- Tin đồn, hay tranh chấp gia đình, không bị tính là gian lận.

Em xem thêm GoFundMe Giving Guarantee: có form yêu cầu hoàn tiền, có danh sách những trường hợp không được hoàn, và hạn 1 năm.

## Cải tiến so với Give.asia

- Badge nói luôn quyền lợi bằng chữ ("Protected for 12 months"), không chỉ là logo.
- Banner Version 1 có 3 chip tóm tắt: hoàn 100%, 12 tháng, ở đâu cũng được bảo vệ.
- Trang Giving Guarantee có các bước "How it works" rõ ràng. Những chi tiết chưa có quyết định thì để trống, ghi rõ là chờ team.

## Mặc định em chọn

- **D1. Một trang `/task219`** có 2 tab Version 1 / Version 2.
  - Mỗi tab trình bày từng thành phần như trên site thật, kèm ghi chú đánh số (1), (2), (3) và chỗ nó dẫn tới.
  - Trang Giving Guarantee mở tại `/task219#/v1/page`.
- **D2. Trang project mẫu** dùng "Nepal Flash Flood Relief Program": ảnh, tên tổ chức và số tiền lấy từ thẻ project trên trang chủ.
  - Phần câu chuyện vẽ bằng các thanh xám, để người xem tập trung vào badge.
  - Không thêm số liệu nào không có trên trang chủ.
- **D3. Badge khác nhau giữa 2 version:**
  - Version 1: badge gọn ("Giving Guarantee · Protected for 12 months"), vì đã có trang giải thích.
  - Version 2: mini banner có thêm một câu giải thích, vì không có trang riêng.
- **D4. Chỗ đặt banner trên trang chủ:** giữa "Causes that need you today" và "Three ways". Em chỉ ghi chú vị trí, không sửa `home.html`.
- **D5. Link FAQ của Version 2** chưa có trang đích. Bấm vào thì hiện thông báo "Opens the FAQ (Giving Guarantee) on the live site".
- **D6. Chi tiết chưa có trong task** để thành ô "To confirm" viền đứt, ghi rõ là ghi chú review, không phải nội dung trang:
  - cách yêu cầu hoàn tiền;
  - thế nào là gian lận đã được chứng minh, và ai quyết định;
  - những gì không được bảo vệ;
  - bao lâu thì nhận lại tiền, và tiền về đâu.

## Cập nhật 29/10: trang project dựng lại theo production

Anh gửi 2 ảnh chụp trang project đang chạy ("Sayang Kalimantan 2026") và dặn dựng pixel perfect. Thay đổi so với D2 và D3:
- **Trang project mẫu** giờ là bản dựng lại trang production, chạy hết chiều ngang trang review, đúng kích thước thật.
  - Số đo lấy từ ảnh chụp: màn hình rộng 1728px, nội dung 1216px, cột trái 810px, khoảng cách 20px, cột phải 386px.
  - Có đủ các phần: breadcrumb, ảnh slide, tên, Bookmark/Share, chip, tab, phần Introduction và Background & Context, khung Give, Recent Donations, Who We Are.
  - Nội dung chép từ ảnh chụp.
- **Ảnh slide, avatar Wally và icon của 2 chip** cắt từ ảnh chụp, để trong `assets/img/task219/`.
  - Mũi tên, số "1/5" và nhãn địa điểm nằm sẵn trong ảnh slide, nên chưa bấm được.
- **2 chip (Humanitarian, agathos Trustmark) dựng bằng HTML/CSS.**
  - Vệt trắng trên chip Trustmark trong ảnh chụp là hiệu ứng ánh sáng quét qua, không phải giao diện tĩnh (anh chỉ ra, 29/10). Chip đó có vệt sáng quét qua mỗi 3,2 giây.
  - Vệt sáng tắt khi máy bật chế độ giảm chuyển động.
- **Guarantee trên trang project** đổi theo giao diện thật. Icon là khiên vàng phẳng, hợp với các icon sẵn có và chip Trustmark vàng.
  - Version 1: một dòng "Giving Guarantee · Protected for 12 months" nằm trong khung Give, ngay dưới nút Give, phía trên "Breakdown of total raised".
  - Version 2: mini banner nền vàng nhạt nằm ngay dưới khung Give, phía trên Recent Donations.
- **Trên mobile:** một cột, khung Give hiện ngay sau tên project.

## Phạm vi theo file

Tạo 3 file mới, không sửa file nào khác:
- `task219.html`
- `assets/task219.css`
- `assets/task219.js`

## Kiểm tra

- `node --check`.
- Dùng script node đếm các phần đã render.
- Mở trên trình duyệt của anh. Không chạy Chromium headless.
