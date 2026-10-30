# /financial-report-v2: sửa theo feedback của team

Nguồn: 3 ảnh feedback anh gửi ngày 29/10/2026. Team comment thẳng trên ảnh chụp v1 (commit `62edf78`, plan cũ ở `docs/financial-report-plan.md`):
1. Tab Transactions
2. Bảng giao dịch
3. Tab Payouts

Tài liệu tham khảo: file "Agathos Financial Report Reconcilation.xlsx".

## 1. Lưu version

Anh chốt (29/10): chỉ cần ghi chú "Version 2" bằng một pill.
- v2 sửa thẳng vào 3 file của `/financial-report`, link giữ nguyên.
- Pill "Version 2" nằm trên thanh review ở đầu trang.
- v1 vẫn còn trong git, ở commit `62edf78`.

## 2. Feedback và cách xử lý

### Ảnh 1: tab Transactions

| # | Chỗ | Team nói | v2 làm |
|---|---|---|---|
| F1 | Tab Transactions / Payouts | Transactions ở tầng project. Payouts ở tầng dashboard, dưới hoặc ngang "Manage Pages". Cần phân biệt project/event của org với của cá nhân. | Tách thành 2 màn. Transactions nằm trong Manage project, Payouts nằm trong Manage Pages (D2). Bỏ thanh tab Transactions / Payouts. |
| F2 | Ô chọn "Project or event" | Không cần, vì giao dịch đã nằm trong từng project. | Bỏ. Muốn xem project khác thì đổi trong panel Demo. |
| F3 | Cạnh bộ lọc | Giữ các nút đang có ở tab giao dịch của Manage project (ví dụ offline trx). | Cần ảnh chụp tab đó (mục 6). Chưa có ảnh thì để ô viền đứt "Current buttons of this tab, waiting for a screenshot". |
| F4 | Ô chọn "Payout period" | <ul><li>Mặc định không chọn kỳ và hiện mọi giao dịch.</li><li>Có lựa chọn cho giao dịch chưa vào kỳ nào.</li><li>Kỳ mới xuất hiện khi data được upload; phần tóm tắt ghi rõ chưa trả và ngày Agathos trả.</li><li>Nhiều kỳ thì chọn năm trước?</li><li>Xếp kỳ theo ngày, cũ nhất trước.</li></ul> | <ul><li>Hai ô chọn: **Year** (All years, 2025, 2026) và **Payout** (All payouts, các kỳ cũ nhất trước, "Not in a payout yet").</li><li>Một kỳ chỉ xuất hiện khi đã có data upload.</li><li>Kỳ chưa trả ghi "Not paid yet · Agathos pays on 20 Nov 2026".</li></ul> |
| F5 | Dòng "Payout period" trong tóm tắt | Bỏ vì bộ lọc đã có, nhưng vẫn giữ trong CSV. | Bỏ khỏi tóm tắt. CSV vẫn có. |
| F6 | "Received" | Total Funding Amount (project) / Total Ticket Sales Amount (event) | Đổi như team nói. |
| F7 | "Agathos platform fee" | Beneficiary Love Gift to Agathos (project) / Agathos Platform fee (event) | Đổi như team nói. |
| F8 | "Payment fees" | Processing fees (to Payment Service Provider) | Đổi thành "Processing fees", không kèm phần trong ngoặc (M2, Q1). |
| F9 | Tóm tắt mặc định | <ul><li>Khi chưa chọn kỳ, hiện số khác: Total Received, Total Love Gift / Platform fee, Total payment fees, Total Net to you.</li><li>Bên trái dùng thanh: Total paid out, Total awaiting pay out.</li></ul> | Làm như team nói. Bên trái có "Paid out", "Awaiting payout", thanh 2 phần và ngày payout kế tiếp. |
| F10 | Thanh phí | Có cần không? Nó làm phí nổi bật quá mức. | Bỏ thanh phí ở mọi chỗ. Chỉ còn thanh Paid out / Awaiting của F9. |
| F11 | Biểu đồ | Thêm phần thống kê trong kỳ bằng biểu đồ đường: số tiền mỗi ngày, số lượt donate mỗi ngày. | Hai biểu đồ đường nhỏ, đặt ngay dưới tóm tắt (M7). |
| F12 | "How this payout reaches you" | Không cần timeline, chỉ cần ngày dự kiến trả. Đã trả rồi thì không cần phần này. | Bỏ khối timeline. Ngày dự kiến nằm ở dòng trạng thái trong tóm tắt. |
| F13 | Thẻ "Payout summary" | Thêm câu cho biết đây là một phần của payout lớn hơn (khi payout có hơn 1 project/event). Bỏ tên PSP. | <ul><li>"Part of a S$2,596.37 payout with 1 other project."</li><li>Tên thẻ: "Payout · Oct 2026".</li></ul> |
| F14 | Download CSV | Đưa số tóm tắt vào CSV. | Đầu file là khối tóm tắt: project, kỳ, 4 số tổng, trạng thái và ngày trả. Sau một dòng trống là bảng giao dịch. |
| F15 | Ghi chú bên trái | Thiết kế hiện tại dựa trên Stripe connect hoặc master merchant (Stripe, 2c2p). Thỏa thuận mới với AXS cho các charity IPC: charity nhận tiền, Agathos gửi hóa đơn thu love gift. Thêm màn cho trường hợp này. | Thêm kịch bản "IPC charity (AXS)" (mục 5). |
| F16 | "For admin console" | Emergency disbursement xử lý thế nào? Ngày payout cố định, tính theo công thức, hay finance nhập tay? | Trả lời bằng đề xuất ở Q2. Chưa dựng màn admin (D4). |

### Ảnh 2: bảng giao dịch

| # | Cột | Team nói | v2 làm |
|---|---|---|---|
| F17 | Bảng | Thêm ký hiệu tiền tệ. | Thêm cột "Currency" ghi SGD, giống cột Currency trong sheet POEO (ô C15). |
| F18 | Amount | Funding Amount (project) / Ticket Sales Amount (event) | Đổi như team nói. |
| F19 | Agathos platform fee | Beneficiary Love Gift to Agathos (project) / Agathos Platform fee (event) | Đổi như team nói. |
| F20 | Payment fees | Processing fees | Đổi như team nói. |
| F21 | Net to you | Net payout | Đổi như team nói. |
| F22 | Cột mới | Trạng thái payout của giao dịch, 3 loại: <ul><li>Mới: Processing</li><li>Đã nằm trong data file upload: Awaiting next payout</li><li>Qua ngày 20 (hoặc ngày payout đã đặt): Paid out</li></ul> | Thêm cột "Payout status" với đúng 3 trạng thái đó. |

### Ảnh 3: tab Payouts

| # | Chỗ | Team nói | v2 làm |
|---|---|---|---|
| F23 | Ô chọn "Payment provider" | Bỏ. | Bỏ. |
| F24 | Ô chọn "Payout period" | Như F4. Mặc định hiện mọi payout, phần tóm tắt là tổng payout từ trước tới nay. | Làm như F4. |
| F25 | Dòng "Payout period" | Bỏ. | Bỏ. |
| F26 | Bảng tóm tắt | Cột giống bảng bên dưới, cộng dồn mọi project/event của payout đó. | Làm như team nói. |
| F27 | Thanh phí | Như F10. | Bỏ. |
| F28 | "By project and event" | Mặc định liệt kê theo payout. Mỗi payout mở ra để xem theo project/event. | Mỗi dòng là một payout. Bấm vào thì mở ra các dòng project/event. |
| F29 | Cột Received | Total Funding Amount / Total Ticket Sales Amount | Tên cột: "Funding / Ticket sales amount". |
| F30 | Cột Fees | Beneficiary love gift to Agathos / Agathos platform fee. Team ghi "THINK MORE". | Đề xuất ở M1. |
| F31 | Cột mới | Thêm "Processing fees". | Thêm. |
| F32 | Net to you | Net payout | Đổi như team nói. |
| F33 | Dưới dòng Total | "Or just show payout and balance" | Cách em hiểu ở M5. |

## 3. Quyết định cần anh chọn

**Anh đã chốt ngày 29/10:**
- **D1:** chỉ thêm pill "Version 2" (xem mục 1).
- **D2:** không đặt Payouts ở Manage Pages.
  - Manage Project: gộp Payouts vào tab Transaction.
  - Manage Event: thêm tab mới, trong đó có Orders và Payouts.
  - Dựng pixel perfect theo ảnh production anh gửi.
- **D3:** OK.
- **D4:** OK.

Anh gửi thêm 2 ý tưởng trên Figma (Orders & Payouts của Manage Event, Transactions & Payouts của Manage Project) để em tham khảo. Các phương án gốc giữ lại bên dưới để đối chiếu.

**D1. Lưu version**
- **A. Em đề xuất:**
  - v1 giữ `/financial-report`, v2 ở `/financial-report-v2`.
  - Không sửa file nào của v1. Thêm 3 file mới.
- **B:**
  - v1 chuyển sang `/financial-report-v1`, v2 lấy `/financial-report`.
  - Phải copy 3 file v1 sang tên mới.
  - Link team đang dùng sẽ mở ra v2, chứ không còn là bản họ đã comment.

**D2. Payouts nằm ở đâu (F1)**
- **A. Em đề xuất:** thêm tab "Payouts" cạnh Projects / Events bên trong Manage Pages.
  - Chọn Personal hay một Organization ở cột trái là biết payout của ai và về tài khoản ngân hàng nào. Đây chính là chỗ phân biệt org với cá nhân mà team hỏi.
  - Dùng lại layout Manage Pages đã dựng ở `/onboarding`, gồm cột trái và các tab, và không sửa `onboarding.css`.
- **B:** thêm tab thứ 6 "Payouts" cạnh "Manage Pages" ở hàng tab trên cùng, kèm ô chọn Personal / Organization ở đầu trang.
  - Hàng tab đó đã có 5 mục, trên phone đã phải cuộn ngang.
  - Phải làm thêm ô chọn mới, trong khi cột trái của Manage Pages đã làm việc đó rồi.
- Công sức hai cách gần bằng nhau.

**D3. Lịch payout trong dữ liệu mẫu**
- **A. Em đề xuất:** mỗi tháng một kỳ, Agathos trả vào ngày 20 tháng sau, chung cho mọi PSP.
  - Căn cứ: comment "After 20th" ở F22, và comment của Josias ở ô A12 sheet Intro ("standardized date across the PSPs").
  - Dữ liệu mẫu có 12 kỳ, từ tháng 11/2025 đến tháng 10/2026, trải trên 2 năm để thử ô chọn Year.
  - Lấy hôm nay là 29/10, thì có đủ 3 trạng thái:
    - Kỳ 11/2025 đến 9/2026: Paid out.
    - Giao dịch tháng 10 đã upload tới ngày 25/10: Awaiting next payout (trả ngày 20/11).
    - Giao dịch 26–29/10: Processing.
- **B:** giữ kỳ nửa tháng như v1 (1–15, 16–cuối tháng) và trả vào ngày 20.
  - Hai kỳ dùng chung một ngày trả, nên một payout chứa 2 kỳ. Khó đọc.

**D4. Chế độ Agathos admin trong v2**
- **A. Em đề xuất:** v2 chỉ làm màn chủ project/event, cộng thêm màn IPC.
  - Chế độ admin vẫn xem ở v1.
  - Hai câu hỏi về admin console (F16), em trả lời bằng đề xuất ở Q2.
  - Lý do: mọi feedback đều cho màn chủ project. Admin console mà team hỏi là một màn khác (upload file, đặt ngày trả).
- **B:** mang chế độ admin sang v2 theo cấu trúc mới (mặc định không chọn kỳ, liệt kê theo payout).
  - Thêm khoảng 40% việc ở file JS.
  - Kết quả vẫn chưa phải admin console.

## 4. Mặc định em chọn (anh đổi được)

- **M1. Cột "Fees" ở tab Payouts (F30, team ghi THINK MORE):** đặt tên là **"To Agathos"**.
  - Một payout có thể có cả project lẫn event. Phần của project là love gift, phần của event là platform fee, nên "To Agathos" đúng cho cả hai mà vẫn ngắn.
  - Khi mở payout ra, mỗi dòng ghi Project hay Event, nên người đọc biết số đó là love gift hay platform fee.
  - Hai cách khác:
    - "Love gift / Platform fee": dài, mà vẫn gộp 2 thứ vào một cột.
    - Tách 2 cột "Beneficiary love gift to Agathos" và "Agathos platform fee", dòng không áp dụng ghi "—". Cách này rõ nhất, nhưng thêm một cột phí, trong khi team không muốn phí nổi bật (F10).
- **M2. "Processing fees" không kèm "(to Payment Service Provider)".**
  - Số này là phí cố định Agathos thu, ví dụ thẻ là 3.9% + 0.5.
  - Trong đó có phần margin Agathos giữ lại (ô A11 sheet Intro, Josias: margin về Agathos). Ghi là trả cho PSP thì không đúng. Em đưa vào Q1.
- **M3. "Net to you" đổi thành "Net payout" ở mọi chỗ**: bảng, tóm tắt và tab Payouts. Một con số chỉ có một tên.
  - Ở tóm tắt mặc định team ghi "Total Net to you", nhưng ở cột lại đổi thành "Net payout".
- **M4. "Awaiting payout" ở tóm tắt mặc định** = tiền Awaiting next payout + tiền còn Processing.
  - Dòng phụ: "S$X in the 20 Nov payout · S$Y still processing".
- **M5. "Or just show payout and balance" (F33):**
  - Khi xem All, dưới bảng payout thay dòng Total bằng 2 dòng: "Paid out" và "Balance" (phần chưa trả).
  - Khi chọn một payout, giữ dòng Total.
- **M6. Danh sách payout ở tab Payouts cũng xếp cũ nhất trước**, cho khớp với ô chọn.
- **M7. Biểu đồ (F11):**
  - Vẽ bằng SVG, không thêm thư viện.
  - Hai biểu đồ nhỏ, chung trục thời gian: "Amount collected" và "Donations". Với event, cái thứ hai là "Ticket sales".
  - Chọn một kỳ thì xem theo ngày. Chọn All hoặc một năm thì xem theo tháng.
  - Không dùng một biểu đồ hai trục, vì hai số có đơn vị khác nhau.
- **M8. Currency (F17):**
  - Cột "Currency" ghi SGD.
  - Trên phone, thẻ giao dịch ghi SGD cạnh số tiền.
- **M9. Transactions trong Manage project (F1, F2):**
  - Đầu trang: "Manage project › {tên project} › Transactions", kèm dòng "Hosted by Antioch21" hoặc "Personal".
  - Em không dựng menu trái của Manage project, vì chưa có ảnh chụp production.
- **M10. Dữ liệu mẫu:**
  - Antioch21: 2 project Stripe và 1 event 2c2p, đều theo mô hình master merchant, Agathos trả.
  - Thêm "Personal" với 1 project nhỏ, trả về tài khoản cá nhân, để thấy cách phân biệt ở cột trái Manage Pages.
  - Thêm 1 charity IPC (mục 5).
  - Công thức phí giữ nguyên như v1.
  - Panel Demo có các lựa chọn: đổi project, chọn kịch bản Antioch21 / Personal / IPC, và link v1.

## 5. Màn IPC charity (AXS), theo F15

Đọc từ comment của team: charity IPC nhận tiền thẳng từ AXS, còn Agathos gửi hóa đơn thu love gift. Sheet Intro (ô D4) ghi cách cũ là AXS trả phí cho Agathos riêng. Thỏa thuận mới thay phần đó bằng hóa đơn.

- **Transactions (Manage project của một project IPC):**
  - Tóm tắt gồm: Total Funding Amount, Processing fees, "Paid to you by AXS", "Love gifts to Agathos (invoiced)".
  - Cột: Date & time, Reference, Payment method, Currency, Funding Amount, Processing fees, Paid to you, Love gift to Agathos, Status.
  - Status có 2 loại: Processing, rồi Paid by AXS.
- **Tab Payouts của charity IPC** đổi tên thành "Payouts & invoices", gồm 2 phần:
  - Các lần AXS trả: ngày, số tiền, những project nằm trong lần trả đó.
  - Hóa đơn Agathos gửi: số hóa đơn, tháng, số tiền love gift, hạn trả, trạng thái (Due / Paid), nút tải PDF. Nút tải chỉ hiện thông báo, vì chưa có file mẫu.
- **Chưa biết, nên ghi rõ trên trang là chờ team:**
  - Hóa đơn gửi bao lâu một lần (mặc định: mỗi tháng, gửi ngày 5 tháng sau).
  - Hạn trả (mặc định: 14 ngày).
  - Hóa đơn có tính cả donor love gift không (mặc định: có).
  - Charity trả hóa đơn bằng cách nào.
  - AXS thu phí IPC bao nhiêu (mẫu: dùng mức ở ô D6 sheet Intro).
  - AXS trả tiền sau bao lâu (mẫu: 2 ngày, như v1).

## 6. Cần anh gửi thêm

- **Ảnh chụp tab Transactions trong Manage project trên production**, có các nút như offline transaction (F3). Chưa có ảnh thì em để ô trống, ghi rõ là chờ ảnh.
- Nếu muốn Transactions nằm đúng vị trí trong Manage project: thêm ảnh menu của Manage project.

## 7. Câu hỏi cho team (cũng đưa vào phần ghi chú trên trang)

- **Q1.** "Processing fees" có phần margin Agathos giữ lại. Vậy có nên ghi "(to Payment Service Provider)" không? (M2)
- **Q2. Admin console (F16).** Em đề xuất:
  - **Ngày payout:**
    - Mặc định tính theo công thức: ngày 20 tháng sau. Nếu rơi vào cuối tuần hoặc ngày lễ thì lùi về ngày làm việc liền trước.
    - Finance sửa được ngày của từng kỳ trước khi chốt.
    - Chủ project thấy ngày này ngay khi kỳ xuất hiện.
  - **Emergency disbursement:**
    - Finance tạo một payout ngoài lịch cho các giao dịch đang "Awaiting next payout": chọn project và ghi lý do.
    - Chủ project thấy đó là một payout riêng, có nhãn "Off-cycle".
    - Payout kỳ sau không tính lại các giao dịch đã trả trong payout này.
  - Team có muốn em dựng màn admin console cho 2 việc này không?
- **Q3.** Với IPC: các mục còn chờ ở mục 5.
- **Q4.** "Or just show payout and balance": em hiểu như M5 có đúng không?
- **Q5.** "Awaiting payout" có tính cả giao dịch còn Processing không? (M4)
- **Q6.** Giao dịch offline và giao dịch hoàn tiền thì có trạng thái payout gì? Tiền offline không đi qua Agathos, nên em đề xuất ghi "Offline", và không cộng vào Net payout.

## 8. Phạm vi theo file (sau khi anh chốt D1, D2)

- `financial-report.html`: sửa tại chỗ.
  - Thêm thanh review (có pill "Version 2").
  - Nav đăng nhập như production: chuông, avatar, username; bỏ nút Create.
  - Bỏ `onboarding.css` và panel Demo.
- `assets/financial-report.js`: viết lại.
  - 3 kịch bản, mỗi kịch bản 2 pill: Manage Project, Manage Event, IPC charity (AXS).
  - Dữ liệu mẫu theo D3.
- `assets/financial-report.css`: viết lại.
  - Khung Manage Project / Manage Event theo số đo từ ảnh production.
  - Các phần mới nằm bên trong card.
- `docs/financial-report-v2-plan.md`: file này.
- Không sửa file nào khác.

## 9. Thứ tự làm

1. Dữ liệu mẫu và trạng thái payout (D3). Kiểm số bằng node.
2. Màn Transactions ở tầng project.
3. Màn Payouts trong Manage Pages.
4. Màn IPC.
5. CSV và giao diện phone.
6. Kiểm tra nghiệm thu.

## 10. Kiểm tra nghiệm thu

- **Màn chủ project không còn:**
  - các chữ "Payment fees", "Net to you", "Received";
  - tên Stripe hay 2c2p (màn IPC thì được nhắc AXS);
  - thanh phí, khối "How this payout reaches you";
  - ô chọn PSP và ô chọn Project.
- **Xem All:** tổng ở tóm tắt bằng tổng mọi dòng. Paid out + Awaiting payout = Net payout.
- **Chọn một kỳ:**
  - Tóm tắt bằng tổng các dòng của kỳ đó.
  - Ở tab Payouts, tổng các project bằng dòng payout của chúng.
- **Trạng thái đúng theo ngày:**
  - Đã qua ngày trả: Paid out. Đã có trong file upload: Awaiting next payout. Còn lại: Processing.
  - Lựa chọn "Not in a payout yet" chỉ ra giao dịch Processing.
- **Ô chọn kỳ:** các kỳ xếp cũ nhất trước. Chọn một năm thì chỉ còn kỳ của năm đó.
- **CSV** có khối tóm tắt, kèm payout period.
- **Biểu đồ:** cộng số tiền các ngày bằng Total Funding Amount của kỳ. Cộng số lượt bằng số giao dịch.
- **v1 không đổi:** `git diff` trống với 3 file của v1.
- **Giao diện:** ở 1440 và 390 không cuộn ngang.
- **Cách kiểm tra:** dùng node và curl, rồi mở trên trình duyệt của anh. Không chạy Chromium headless.

## 11. Nhật ký

**29/10/2026: làm xong bản v2 tại `/financial-report`. Chưa commit.**

### Thanh review và 3 kịch bản

- Thanh review: "Financial report", pill "Version 2", 3 tab kịch bản, và dòng "Sample data · today is 29 Oct 2026".
- **Manage Project** (`#/project/transactions`, `#/project/payouts`):
  - Mục menu "Transaction" đổi thành "Transactions & Payouts", theo ý tưởng Figma.
  - Giữ đủ 3 nút đang có trên production (F3): Export as .csv, Add Offline Transaction, Tax Deduction Report.
  - Có 2 pill: Transactions | Payouts.
- **Manage Event** (`#/event/orders`, `#/event/payouts`):
  - Thêm mục menu mới "Orders & Payouts" sau Scan Ticket, có 2 pill: Orders | Payouts.
  - Nút "Export Orders as .csv" lấy từ trang Attendees Information.
  - Không dựng lại trang Attendees Information.
- **IPC charity (AXS)** (`#/ipc/...`): dùng cùng khung Manage Project. Project mẫu: "Sunny Days for Seniors".

### Số đo từ ảnh production (CSS px, màn hình 1728)

- **Khung trang:** nội dung rộng 1216. Cột trái 365, khoảng cách 39, card 812. Breadcrumb cách mép trái 22, chữ 15px.
- **Cột trái:**
  - H1 32px.
  - Mỗi mục menu cao 64. Chữ 17px, màu #8D8D8D.
  - Mục đang chọn: nền #F2F8FE, viền phải 4px #2A64CD.
  - Nút Back cao 42.
- **Card:**
  - Padding 38/40. Tiêu đề 22px.
  - Card của Manage Event nằm thấp hơn card của Manage Project 27px, giống trên production.
- **Nút:**
  - Nút của Manage Project cao 42, cách nhau 16.
  - Nút Export Orders cao 46.
  - Pill cao 47, padding 25, cách nhau 12. Màu: #2254AC khi đang chọn, #8D8D8D khi chưa chọn.

### Chỗ làm khác plan, và lý do

- **F28 (mở payout ra theo project/event):** không còn cần, vì Payouts giờ nằm trong từng project/event. Thay vào đó, dòng mô tả của mỗi payout có câu "Part of a S$X payout with N other …" (F13).
- **M1 (tên cột "To Agathos"):** không cần nữa, vì mỗi danh sách payout chỉ thuộc một project hoặc một event, không lẫn hai loại. Cột ghi đúng tên team đặt: "Beneficiary Love Gift to Agathos" với project, "Agathos Platform fee" với event.
- **Thẻ tóm tắt dựng theo bố cục "Overview" trong Figma, sửa theo feedback của team:**
  - Thanh màu chỉ còn Paid out và Awaiting payout, không có phần phí màu đỏ (F9, F10).
  - Các số dùng màu chữ thường. Màu chỉ nằm ở ô vuông nhỏ cạnh nhãn.
  - "Fee Deducted" đổi thành "Deducted", vì team không muốn gọi love gift là phí.
  - "PSP Fee" đổi thành "Processing fees".
  - "Received / Pending" đổi thành "Paid out / Awaiting payout".
- **Thẻ tóm tắt có ở cả 2 pill:**
  - Ở Transactions, thẻ đổi theo bộ lọc.
  - Ở Payouts, thẻ luôn là tổng từ trước tới nay, giống Figma.
- **Hộp "Next payout":** chép nguyên câu trong Figma. Ngày 20 rơi vào thứ 7 hoặc chủ nhật thì dời sang thứ 2 (ví dụ 20/12/2025 thành 22/12/2025). Dữ liệu mẫu chưa tính ngày lễ.
- **M10:** bỏ phần "Personal", vì không còn dùng Manage Pages.
- **Hóa đơn IPC:** mẫu cho hạn trả 30 ngày, thay vì 14 ngày như plan, để demo có cả hóa đơn đã trả và đang chờ trả mà không có hóa đơn quá hạn. Mục này vẫn chờ team xác nhận.

### Câu hỏi mới

- **Q7.** Danh sách giao dịch trên production có tên và avatar người cho. Bảng mới theo cột của sheet POEO, nên không có cột này. Có cần thêm không?

### Đã kiểm tra

- `node --check` qua.
- Script node với DOM giả: 63/63 kiểm tra qua.
  - Cả 6 màn đều render được.
  - Màn chủ project/event không còn "Payment fees", "Net to you", "Received", tên Stripe hay 2c2p.
  - Số tiền = love gift/phí + processing fees + net payout.
  - Paid out + awaiting + processing = net payout, khớp tới từng cent.
  - Trạng thái đúng theo ngày. "Not in a payout yet" chỉ ra giao dịch Processing.
  - Tổng trên biểu đồ bằng tổng của bảng, ở mọi bộ lọc.
  - Payout History cộng với phần Processing bằng tổng net.
  - CSV có khối tóm tắt, rồi một dòng trống, rồi mỗi giao dịch một dòng.
- Curl: trang và các file đi kèm đều trả về 200.
- Chưa xem giao diện bằng mắt. Không chạy Chromium headless.

**30/10/2026: thêm nút "Changes from the feedback" ở góc phải thanh review.**
- Bấm vào mở modal tiếng Anh, viết cho team, giải thích 7 chỗ v2 làm khác comment.
- Mỗi chỗ có 5 phần: Feedback (trích nguyên câu comment), This version, Why, Pros, Cons. Vài chỗ có thêm phương án khác hoặc câu cần team quyết.
- 7 chỗ:
  1. "Processing fees" không kèm "(to Payment Service Provider)".
  2. "Net payout" thay cho "Total Net to you".
  3. Thanh Paid out / Awaiting chạy ngang card.
  4. Awaiting payout có tính cả tiền còn Processing.
  5. Biểu đồ theo tháng khi xem All payouts.
  6. Reference nằm dưới cột Date & time.
  7. Bỏ thẻ Payout summary.
- Modal đóng bằng nút ×, phím Esc hoặc bấm ra ngoài.
- Kiểm tra bằng node: 67/67 qua.
