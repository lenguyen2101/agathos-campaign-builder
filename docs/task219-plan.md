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

---

## Vòng 2 (06/11/2026): comment sau khi team bàn với boss

Anh dặn sửa luôn, nên em làm ngay theo các mặc định dưới đây. Anh đổi chỗ nào thì em sửa lại.

### Comment (nguyên văn) và cách làm

| # | Comment | Làm thế nào |
|---|---|---|
| C1 | *Use Option 2* | Trang chỉ còn Version 2. Bỏ tab Version 1, banner Version 1, badge Version 1 và trang Giving Guarantee. Bản cũ vẫn còn trong git, commit `1e85d03`. |
| C2 | *No requirement for homepage banner. Repurpose the homepage banner as a info window when user clicks the giving guarantee badge on project page.* | Bỏ banner trang chủ. Nội dung và bố cục của banner Version 2 chuyển thành một **cửa sổ thông tin**, mở khi bấm mini banner Giving Guarantee trên trang project. Cửa sổ gồm: khiên, "Our Giving Guarantee", đoạn intro, "100% …", 2 ý "Protected for 12 months" và "Wherever You Give", link "Read the FAQ". |
| C3 | *Add copy to contact support@agathos.be* | Cuối cửa sổ có thêm một dòng: *"Have a question or need a refund? Contact us at support@agathos.be."* Địa chỉ là link mailto. |
| C4 | *Design mobile version* | Thêm phần Mobile: 2 khung điện thoại rộng 390px. Khung 1 là trang project, cuộn sẵn tới badge. Khung 2 là cửa sổ đang mở, dạng sheet trượt lên từ cạnh dưới. |

### Quyết định, mặc định em chọn (anh đổi được)

- **D1. Bỏ hẳn Version 1 khỏi trang**, không giữ tab "Not chosen". Lý do: comment đã chốt Option 2. Bản cũ vẫn còn trong git.
- **D2. Cửa sổ thông tin:**
  - Trên desktop: hộp giữa màn hình, rộng tối đa 980px, giữ bố cục 2 cột của banner (cột trái nền navy, cột phải 2 ý).
  - Trên mobile: sheet trượt lên từ dưới, 1 cột, cuộn được.
  - Đóng bằng nút X, phím Esc, hoặc bấm ra ngoài.
  - Trên trang review, cửa sổ cũng được vẽ sẵn ngay trong trang, để người xem không cần bấm.
- **D3. Câu liên hệ** là copy em viết, chờ team duyệt. Câu này nằm ở dòng cuối của cửa sổ.
- **D4. Mobile dựng theo bản 1 cột đang có**, vì em chưa có ảnh chụp trang project production trên điện thoại. Anh gửi ảnh thì em dựng lại pixel perfect.

### Giữ nguyên

- Trang project (bản dựng từ production).
- Mini banner Version 2 dưới khung Give. Giờ bấm vào thì mở cửa sổ, không cuộn tới banner nữa.
- Link "Read the FAQ" vẫn hiện thông báo như cũ.

### Phạm vi theo file

- `assets/task219.js`: bỏ Version 1 và banner trang chủ; thêm cửa sổ, phần Mobile và 2 đường dẫn `#/m/page`, `#/m/sheet` dùng trong khung điện thoại. Link cũ `#/v1`, `#/v2`, `#/v1/page` vẫn mở trang review.
- `assets/task219.css`: gỡ style của Version 1 và trang Giving Guarantee; thêm style cho cửa sổ, sheet trên mobile và khung điện thoại.
- `docs/task219-plan.md`: plan và log.
- Không sửa `task219.html`, `home.html` hay file nào khác.

### Kiểm tra nghiệm thu

- Không còn chữ "Version 1", banner trang chủ, trang Giving Guarantee, hay link `#/v1/page`.
- Bấm mini banner thì mở cửa sổ (`role="dialog"`), có đủ nội dung của banner cũ cộng dòng liên hệ. X, Esc và bấm ra ngoài đều đóng được.
- Khung điện thoại dùng đúng 2 đường dẫn mobile. Ở `#/m/sheet`, cửa sổ mở sẵn.
- Kiểm bằng `node --check`, script node và curl. Không chạy Chromium headless.

### Ước lượng thời gian

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này | 0.05 | 0.05 |
| 2. Gỡ Version 1, banner trang chủ và trang Giving Guarantee | 0.1 | 0.15 |
| 3. Cửa sổ thông tin (desktop) và dòng liên hệ | 0.25 | 0.4 |
| 4. Mobile: sheet, khung điện thoại, 2 đường dẫn | 0.3 | 0.7 |
| 5. Kiểm tra (node, curl) và ghi log | 0.15 | 0.85 |

### Nhật ký vòng 2 (06/11/2026). Chưa commit.

**Đã làm đúng theo plan, không có chỗ nào làm khác.**

**`assets/task219.js`** (viết lại):
- **Đã gỡ:**
  - Tab Version 1/2, banner trang chủ (cả 2 bản), badge Version 1, trang Giving Guarantee và thẻ xem trước của trang đó.
  - Các icon và hàm chỉ dùng cho những phần trên.
- **Trang review** có 3 mục:
  1. Badge trên trang project (bản desktop, kích thước thật).
  2. Cửa sổ thông tin, vẽ sẵn trong trang.
  3. Mobile: 2 khung điện thoại.
- **Cửa sổ thông tin** dùng lại nguyên nội dung banner Version 2, cộng dòng liên hệ support@agathos.be.
  - Mở khi bấm mini banner.
  - Đóng bằng ×, Esc, hoặc bấm ra ngoài. Đóng xong thì con trỏ quay về mini banner.
  - Khi mở, trang phía sau không cuộn được.
- **Hai đường dẫn cho khung điện thoại:**
  - `#/m/page`: trang project, cuộn tới badge. Chỉ cuộn bên trong khung, không làm trang review nhảy theo.
  - `#/m/sheet`: cửa sổ mở sẵn.
- Link cũ `#/v1`, `#/v2`, `#/v1/page` vẫn mở trang review.

**`assets/task219.css`:**
- Gỡ style của Version 1 và trang Giving Guarantee.
- Đổi tên `.gg-b2` thành `.gg-win`, thêm dòng cuối (`.gg-win-foot`), nút đóng và lớp phủ.
- Trên mobile: 1 cột, sheet trượt lên từ dưới, có thanh kéo, cao tối đa 88vh.
- Khung điện thoại: màn hình bên trong 390×844. Lần đầu em đặt bề rộng 390px, nhưng home.css dùng `box-sizing:border-box` nên phần viền 10px bị trừ vào, chỉ còn 370px. Đã sửa thành 410×864.

**Đã kiểm tra:**
- `node --check` qua.
- Script node: 25/25 kiểm tra qua, gồm C1–C4, đóng/mở cửa sổ, 2 đường dẫn mobile, link cũ và CSS của sheet. Một lần chạy fail là do kiểm tra báo nhầm (bắt trúng câu "no Giving Guarantee page" trong phần giới thiệu); đã sửa kiểm tra.
- Curl: trang, JS, CSS và ảnh đều trả về 200.
- Chưa xem giao diện bằng mắt.

**Chỉnh cửa sổ theo góp ý của anh (06/11/2026). Chưa commit.**
- **Bỏ viền trắng quanh cửa sổ.**
  - Gỡ đường viền 1px `var(--hp-line-2)`.
  - Nền trắng chuyển từ cả hộp sang riêng cột phải. Như vậy không còn nền sáng nằm sau cột navy, các góc bo tròn không bị lộ vệt sáng.
- **Bỏ link "Read the FAQ"**, kèm style `.faq`, icon mũi tên và hành động `faq` trong JS.
  - Phần "Giữ nguyên" ở trên có ghi link FAQ được giữ; dòng đó không còn đúng.
- **Cân lại khoảng cách:**
  - Cột trái có padding 48px đều 4 cạnh.
  - Nội dung cột trái căn giữa theo chiều dọc, giống cột phải, nên khối "100%" không còn dính sát đáy.
- **Đã kiểm tra:** script node 28/28 qua. Thêm kiểm tra: không còn FAQ, không còn viền, cột trái căn giữa.

**Chỉnh phần Mobile theo góp ý của anh (06/11/2026). Chưa commit.**
- **Bỏ khung điện thoại "Project page".** Chỉ còn 1 khung, là cửa sổ đang mở. Bỏ luôn đường dẫn `#/m/page`; link cũ tới đó giờ mở trang review.
- **Khung `#/m/sheet` luôn mở.** Bấm ×, Esc hay bấm ra ngoài đều không đóng. Nút × vẫn hiện, vì nó là một phần của thiết kế.
- **Lỗi của em ở vòng trước, đã sửa:** trên mobile, khung Give và các thẻ không chạy hết bề ngang. Nguyên nhân là `.pp-cols` giữ `align-items:start` của bản desktop. Đã thêm `align-items:stretch` trong media query mobile.
- **Đã kiểm tra:** script node 30/30 qua.

**Sửa câu mô tả mục 2 (06/11/2026). Chưa commit.** Câu cũ *"The home page banner, reused as a window."* làm người đọc tưởng đây là banner trang chủ có nút đóng. Thực ra trang không còn banner trang chủ nào, mục 2 là popup mở từ badge.
- Câu mới: *"A popup that opens when someone clicks the badge (1). It closes with ×, Esc or a click outside. Drawn open here so it can be reviewed without clicking."*
- Nhãn mới: "Info window (popup) · desktop".

**Thu gọn sheet trên mobile để không phải cuộn (06/11/2026). Chưa commit.**
- Ở khung 390×844, sheet cũ cao khoảng 820px, vượt giới hạn 88vh (742px), nên dòng liên hệ bị đẩy xuống dưới.
- Đã thu nhỏ, chỉ trong media query mobile:
  - Khiên 72 → 48px; tiêu đề 22px.
  - Đoạn intro 14.5px; số "100%" 30px.
  - Icon 2 ý 56 → 40px; tiêu đề 2 ý 16px, nội dung 13.5px.
  - Dòng liên hệ 13.5px.
  - Lề hai bên 24 → 20px; khoảng cách dọc giữa các khối giảm theo.
- Nội dung giữ nguyên. Desktop không đổi.
- Ước lượng chiều cao mới khoảng 600px, vừa khung 390×844. Với màn hình 375×667 (iPhone SE), sheet có thể vẫn dư vài px và phải cuộn nhẹ.
- Chưa đo bằng trình duyệt, vì không chạy Chromium headless.
