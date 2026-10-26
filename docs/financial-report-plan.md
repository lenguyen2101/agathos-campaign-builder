# /financial-report: Agathos Financial Report (Task 1)

Nguồn: file "Agathos Financial Report Reconcilation.xlsx" (để ở thư mục gốc repo, chưa đưa vào git), sheet **Agathos Financial Reports**. Trong sheet có 2 báo cáo:

1. **Transaction Report (All trx)**
   - Bộ lọc: project/event, payout period.
   - Phần tóm tắt: 6 số.
   - Bảng chi tiết: 18 cột, có phân trang.
2. **Summary Payout Report Per PSP Settlement period**
   - Bộ lọc: PSP, payout period.
   - Phần tóm tắt: 7 số.
   - Bảng chi tiết: gom theo project, 5 cột.

Người xem, theo lời anh: chủ project và chủ event.

## 1. Điểm chưa khớp, cần anh chọn trước khi làm

Sheet Intro ghi rõ hai loại báo cáo:
- "Agathos Financial Reports" là báo cáo cho **Agathos Finance/Admin** (Intro, ô A8).
- Báo cáo cho chủ project/event là sheet **POEO Financial Reports** (Intro, ô A7).

Sheet Agathos có những dữ liệu nội bộ mà sheet POEO không có:

| Dữ liệu | Ý nghĩa |
|---|---|
| Agathos Margin | Phần phí thẻ Agathos thu dư so với phí thật của PSP. Josias comment: "keep this assumption that the margin will go to Agathos". |
| Net to Agathos, Total Payout to Agathos | Thu nhập của Agathos |
| Other PSP charges | Phí tháng của Stripe: Account Volume Billing, Active Account Billing, Payout Fee |
| PSP merchant id, PSP model | Thông tin kỹ thuật (split / master) |

Nếu chủ project nhìn thấy "Agathos Margin", họ sẽ hiểu là Agathos giữ lại phần phí thu dư của họ. Hiện đây vẫn là câu hỏi team chưa chốt (Intro, ô A11).

**D1. Hiển thị gì cho chủ project/event?**
- **A. Hai chế độ xem trên cùng một trang (em đề xuất).**
  - Mặc định là chế độ của chủ project/event:
    - Ẩn 6 dữ liệu nội bộ ở bảng trên.
    - Phí PSP và phí nền tảng gộp thành "Fees", như cách sheet POEO đặt tên.
    - Vẫn giữ dữ liệu sau đối soát: phí PSP thật, ngày PSP chi trả, ngày Agathos chi trả.
  - Nút "Agathos admin view" trong panel Demo bật đủ 18 cột và 7 số tóm tắt như sheet Agathos.
  - Đúng ý sheet POEO, ô A3: "available to both PO/EO and Agathos admin… different UIs or a unified one".
  - Công sức: khoảng 1,2 lần so với B.
- **B. Chỉ làm cho chủ project/event.** Bỏ hẳn 6 dữ liệu nội bộ. Ít việc nhất.
- **C. Hiện đủ mọi thứ trong sheet Agathos cho chủ project/event.** Đúng chữ của đề bài, nhưng lộ margin và thu nhập của Agathos.

## 2. Quyết định em chọn mặc định (anh đổi được)

- **D2. Làm theo comment của Josias ở sheet POEO**, vì đó là góp ý cho màn của chủ project:
  - Thiết kế mobile trước.
  - Phần tóm tắt là trọng tâm. Bảng chi tiết là phần phụ: trên desktop là bảng, trên mobile là danh sách thẻ.
  - Có thẻ "Payout summary" dẫn nhanh sang báo cáo 2.
  - Báo cáo 2 nằm ở tab riêng, vì nó ở trên tầng project/event.
  - Tên gọi giống nhau cho project và event.
  - Em không đụng vào menu trái của "Manage project". Trang này đứng riêng ở `/financial-report`.
- **D3. Dữ liệu mẫu.** Khoảng 40 giao dịch cho 2 project và 1 event, chia theo 3 PSP như sheet Intro:
  - Project dùng Stripe.
  - Event dùng 2c2p.
  - Hidden Cause dùng AXS.

  Số tiền tính theo đúng công thức ở sheet Intro và DB Table, nên các con số khớp nhau:
  - Phí Agathos thu của chủ project: thẻ 3.9% + 0.5.
  - Phí thật PSP thu của Agathos: thẻ nội địa 3.4% + 0.5, nên margin là 0.5%.
  - Net to Agathos = Trx amount − Net to merchant − PSP fee.

  Trang có nhãn "Sample data".
- **D4. Kỳ chi trả (payout period) mẫu:** nửa tháng (1–15, 16–cuối tháng), từ tháng 8 đến tháng 10/2026.
  - Sheet chưa ghi kỳ thật của từng PSP.
  - "Agathos to Merchant payout date" chỉ hiện với mô hình master merchant (Stripe master, 2c2p), đúng ghi chú trong sheet.
- **D5. Giao diện theo design language hiện tại**, như `/onboarding`:
  - Nav và footer của site.
  - Font Be Vietnam Pro, màu navy, vàng và xanh.
  - Thẻ trắng bo góc trên nền xám nhạt.
  - Không thêm thư viện.

## 3. Câu hỏi cho team (từ file, chưa có câu trả lời)

- **Q1.** Margin có trả lại cho chủ project không? Josias tạm chốt là Agathos giữ. Rachel sẽ xem lại.
- **Q2.** Agathos chi trả cho chủ project vào ngày cố định, hay sau ngày PSP chi trả n ngày? Intro A12: "look again when Rachel comes back".
- **Q3.** Kỳ chi trả thật của từng PSP là gì?

## 4. Phạm vi theo file

- `financial-report.html` (mới): khung trang, nav, footer. Vercel đang bật `cleanUrls`, nên `/financial-report` tự mở được file này, không cần sửa config.
- `assets/financial-report.js` (mới):
  - Dữ liệu mẫu và công thức tính.
  - 2 tab: Transactions và Payouts.
  - Bộ lọc, phần tóm tắt, bảng có phân trang, xuất CSV.
  - Chế độ xem theo D1.
- `assets/financial-report.css` (mới): style riêng của trang, dùng token có sẵn trong `home.css`.
- Không sửa file nào khác.

## 5. Nhật ký

**26/10/2026: làm xong. Anh chọn D1 = A (hai chế độ xem).**

Chỗ làm khác plan:
- **Phí PSP thật chỉ hiện ở chế độ admin.** Chủ project/event thấy "Payment fees", tức là phí họ bị thu (Received − Agathos platform fee − Net to you). Nếu hiện phí PSP thật, họ lấy số nhận trừ các phí là ra margin.
- **Bỏ nút Reset và Search** trong ảnh mẫu. Đổi bộ lọc là kết quả cập nhật ngay.
- **Trang dùng lại `onboarding.css`** cho nút, ô chọn, panel Demo và toast. Không sửa file đó.

Giả định khi tính số:
- "Total Payout to Agathos" ở báo cáo 2 = Σ Net to Agathos − Other PSP charges, để Total Trx Amt = phí PSP + phí khác + phần trả Agathos + phần trả merchant.
- Margin 2c2p = phí thu merchant − phí PSP thật, tức 0.6% × số tiền × 1.09. Công thức 0.006 × số tiền trong DB Table bỏ qua GST, nên các tổng sẽ lệch.

Cột ở chế độ chủ project/event:
- Bảng giao dịch: Date & time, Reference, Payment method, Amount, Agathos platform fee, Payment fees, Net to you.
- Ngày PSP chi trả và ngày Agathos chi trả: hiện ở khối tóm tắt và các mốc ngày, vì mọi dòng trong cùng một kỳ có chung ngày.

Đã kiểm tra trên local ở 1440 và 390, không cuộn ngang, console không có lỗi:
- Tổng trong bảng bằng số tóm tắt. Erbil: 1,607.38. Concert: 1,124.04 + 335.42 = 1,459.46.
- Admin Payouts (Stripe, 1–15 Oct): 174.40 + 8.68 + 555.85 + 5,239.97 = 5,978.90.
- Chế độ chủ project/event không có chữ Margin, Net to Agathos, Payout to Agathos, Other PSP, merchant id, PSP model hay Love Gift. Đã kiểm ở cả 4 project/event và 3 PSP.
- Thẻ tắt sang Payouts, link từng dòng sang Transactions, phân trang (12 giao dịch: 1–10 rồi 11–12) và CSV đều chạy.

## 6. Kiểm tra nghiệm thu

- Đổi bộ lọc thì phần tóm tắt và bảng cùng đổi. Tổng tóm tắt bằng tổng các dòng.
- Báo cáo 2: tổng các project bằng phần tóm tắt.
- Chế độ chủ project/event không có chữ "Margin", "Net to Agathos" hay "Payout to Agathos".
- Kiểm tra ở 1440 và 390: không cuộn ngang, console không có lỗi.
