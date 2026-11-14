# Admin v6: Recon Overview và Disbursement Report (14/11/2026)

**Nguồn:** 3 ảnh feedback của team anh gửi ngày 14/11/2026:
1. Trang Transaction Report, có ghi chú.
2. Bảng bậc thang mới cho Recon Overview.
3. Trang Summary Payout Report, có ghi chú và bảng bậc thang mới.

**Anh dặn:** *"giờ làm UI Admin nha… họ comment rất kĩ, mình follow theo nhé. À, display lại cột Tally check nhé"*.

Em đã đọc hết các ô comment (phóng to từng ô), không chỗ nào mờ.

**Trạng thái:** anh đã trả lời D1–D3 (14/11/2026), đang làm.

## Việc cần làm

### Menu và tên trang
| # | Comment | Em làm |
|---|---|---|
| A1 | *We currently have a financials tab already… rename it → 'Recon'. Move it to below current 'Financials' tab. 'Transaction Report' → 'Recon Overview'. 'Summary payout report' → 'Disbursement Report'* | Nhóm menu "Finance" đổi tên thành **Recon** và đặt ngay dưới mục **Financials**. 2 mục con là **Recon Overview** và **Disbursement Report**. Tên trang, tiêu đề tab trình duyệt và tên file CSV đổi theo. Xem D1. |

### Recon Overview (trang Transaction Report cũ, `finance.html`)
| # | Comment | Em làm |
|---|---|---|
| R1 | *Follow layout below* (bảng bậc thang) | Đổi thứ tự thành 7 dòng (dòng đánh dấu ★ là dòng in đậm, có màu, cỡ lớn):<br>1. ★ **Total Transactions Amount**, có dòng phụ chữ nhỏ *(including amounts paid directly to Projects/Events by Stripe Connect model)*<br>2. − Total PSP transactions fees<br>3. − Other PSP charges<br>4. − Total paid out directly to Projects/Events by Stripe (Connect)<br>5. = ★ **Total PSP payout to Agathos**<br>6. − Total disbursed to Projects/Events<br>7. = ★ **Final amount to Agathos**<br>Bỏ cỡ chữ trung bình: chỉ còn dòng lớn (★) và dòng nhỏ. Giữ 2 mục mở rộng của "Other PSP charges" và "Final amount to Agathos" như hiện tại. Xem D2, D3, D5. |
| R2 | *Maintain fonts for numbers to be consistent… follow the one on the left* | Số tiền dùng cùng kiểu chữ với nhãn bên trái của dòng đó. Xem D5. |
| R3 | *Change the current table headers to these… bold… vertical line… colour the columns* | Các cột số theo đúng thứ tự mới:<br>**Transaction Amount** ‖ **Funding Amount**, PSP Fees applied on Funding Amount, Beneficiary Love Gift Amount (Projects), Agathos Platform Fee (Events), Net to Merchant, **Donor Love Gift Amount**, PSP Fees applied on Donor Love Gift Amount, Finalized Donor Love Gift Amount, Agathos Margin from PSP fees, Total to Agathos.<br>3 cột in đậm cả tiêu đề lẫn số. Có đường kẻ dọc sau Transaction Amount. Cột Net to Merchant và Total to Agathos có nền màu (D4).<br>Các cột khác giữ nguyên: Project/Event Name, Date & Time, Reference, Payment Method, Receiving Currency, PSP Payout Date, PSP name, PSP merchant id, PSP model. Thêm lại Tally check ở cuối. |
| R4 | *Add back Tally check column and module. Show scenario when tally is incorrect* | Thêm lại cột Tally check: Transaction Amount − 2 loại PSP fees − Net to Merchant − Total to Agathos = 0 thì ghi "OK", lệch thì ghi số lệch màu đỏ và tô đỏ nhạt cả dòng.<br>Thêm khung tóm tắt ngay trên bảng: "All 41 transactions tally", hoặc "3 of 41 transactions don't tally · S$0.93 off" kèm nút "Show only these".<br>Để xem trường hợp lệch, xem D6. |
| R5 | *Under PSP model column, remove 'direct'… 'connect' is already direct* | Cột PSP model chỉ còn Master hoặc Connect. AXS hiện "Connect". Xem D3. |
| R6 | *Change to "Transaction and average donor love gift trends"* | Đổi tiêu đề mục Statistics. |
| R7 | *Allow custom period (similar to filter above)* | Thay 3 nút Last 6 / Last 12 / All bằng ô chọn kỳ giống bộ lọc ở trên: các nút chọn nhanh (Last 6 payouts, Last 12 payouts, All of năm, All), lưới tháng, nút Done. Mặc định là Last 6. |
| R8 | (đi theo R1, R3, R4) | File CSV theo thứ tự bậc thang mới, cột mới, có cột Tally check. |

### Disbursement Report (trang Summary Payout Report cũ, `finance-payouts.html`)
| # | Comment | Em làm |
|---|---|---|
| B1 | *Change to 'Disbursement Report'* | Đổi tên trang (A1). |
| B2 | Bảng bậc thang mới, *same sub-menus for 'Other PSP charges'*, đổi chữ dòng đầu, *bolded and coloured rows larger* | Thứ tự 6 dòng:<br>1. ★ **Total Transactions Amount**, có dòng phụ chữ nhỏ *(excluding amounts paid directly to Projects/Events by Stripe Connect model)*<br>2. − Total PSP transactions fees<br>3. − Other PSP charges (giữ mục mở rộng)<br>4. = ★ **Total PSP payout to Agathos** (dòng mới)<br>5. − Final amount to Agathos<br>6. = ★ **Total disbursed to Projects/Events**<br>Chỉ 2 cỡ chữ như R1. |
| B3 | *Add date range (date of first transaction and last transaction included in this payout)* | Trên đầu khung có thêm ô "Transactions" ghi khoảng ngày, ví dụ "1 Oct – 25 Oct 2026". Ô này đứng cạnh "Payout Period" và "Agathos to PO/EO disbursement date". |
| B4 | *Design a simple csv document that includes all the info in the page* | File CSV có 3 phần (D7). |

## Anh trả lời (14/11/2026)
- **D1.** Anh gửi menu admin production. Thứ tự: Dashboard, Application, Financials, Projects, Events, Campaigns, Users, Organizations, Tribes, Survey, Health, Configuration, Logs.
  - Em làm: thêm nhóm "Financials" (icon tiền) ngay sau Application, và nhóm "Recon" ngay dưới Financials.
  - Phần còn lại của menu prototype (Project Management, User Management…) đang khác production, nhưng em chưa đụng, vì các trang admin khác đang dùng menu này.
- **D2.** *"làm đúng y chang bảng excel của Admin cho tôi, ko phân tích logic ngược lại nữa"*. Em làm đúng thứ tự và dấu của bảng:
  - Total PSP payout to Agathos = Total Transactions Amount − PSP fees − Other PSP charges − Total paid out directly.
  - Final Amount to Agathos = Total PSP payout to Agathos − Total disbursed to Projects/Events.
- **D3.** *"y như D2"*. Làm đúng comment: cột PSP model bỏ "Direct". AXS là Connect.

## Mặc định em chọn (anh đổi được)
- **D1. Vị trí "Recon".**
  - Menu admin trong prototype chưa có mục "Financials" của production.
  - Em sẽ thêm "Financials" (chỉ để hiện, không bấm vào trang nào) vào chỗ "Finance" đang đứng, tức là sau Org Management. Nhóm "Recon" đặt ngay dưới nó.
  - **Anh chụp giúp em menu bên trái của admin production**, để đặt đúng chỗ và đúng icon của "Financials".
- **D2. "Total disbursed to Projects/Events" ở Recon Overview chỉ còn là tiền Agathos tự chi (Master).**
  - Tiền Connect giờ đã có dòng trừ riêng ở trên (dòng 4). Nếu dòng 6 vẫn cộng Connect như trước thì bị trừ 2 lần, và bậc thang không ra đúng Final.
  - Em đã tính thử kỳ Nov 2026: với Master và Connect, cả 7 dòng cộng trừ khớp tới từng xu khi dòng 6 không gồm Connect.
  - Khi đó số này bằng đúng "Total disbursed" của Disbursement Report.
- **D3. AXS tính như Connect.**
  - Comment nói "connect is already direct": AXS trả thẳng cho tổ chức, giống Stripe Connect.
  - Phần tiền AXS trả cho tổ chức sẽ nằm trong dòng 4. "Total PSP payout to Agathos" của AXS là phần còn lại. Bậc thang khớp (kỳ Nov 2026: 588.37 − 569.15 = 19.22 = Final của AXS).
  - Tên dòng 4 vẫn ghi "by Stripe (Connect)", dù có cả AXS. Nếu team muốn tên chung hơn, em đổi chữ.
  - Điểm này nên hỏi lại Elaine.
- **D4. Màu.**
  - 3 dòng ★ dùng nền xanh nhạt đang có của admin.
  - Cột Net to Merchant tô xanh nhạt, cột Total to Agathos tô cam nhạt: cùng màu với 2 phần này trong biểu đồ (xanh cho Net to Merchant, cam cho Total to Agathos). Team nói màu vàng trong ảnh chỉ để tham khảo.
- **D5. Cỡ chữ.**
  - Mỗi dòng: số tiền cùng kiểu chữ và cùng cỡ với nhãn bên trái.
  - Dòng ★: nhãn và số 16px, đậm. Các dòng khác: 13px. Bỏ kiểu số 32px và 20px hiện có.
- **D6. Xem trường hợp lệch Tally.**
  - Thêm một thanh review màu kem ở đầu trang Recon Overview, kiểu thanh review ở trang người dùng, ghi rõ không thuộc thiết kế. Trên thanh có công tắc "Tally: All tally / Some off".
  - Chọn "Some off" thì 3 giao dịch mẫu bị lệch (tổng S$0.93, như bản v3).
- **D7. CSV của Disbursement Report.**
  - Phần 1, báo cáo: tên báo cáo, Payout Period, khoảng ngày giao dịch, ngày Agathos chi, PSP, Model, ngày xuất file.
  - Phần 2, bậc thang: 6 dòng có dấu (−, =) và số tiền, cộng 3 dòng của Other PSP charges.
  - Phần 3, theo project: Project/Event, Organisation, PSP, Model, số giao dịch, Total Trx Amt, Total PSP trx Fees, Total Net to Agathos, Total Net to Merchant, và dòng Total.
- **D8. Chữ.** Chỉ đổi những dòng team ghi rõ chữ mới. Các dòng khác giữ chữ đã duyệt, ví dụ "Total paid out directly to Projects/Events by Stripe (Connect)". Bảng của team viết hơi khác chữ này.
- **D9. Statistics.** Dòng phụ "By payout period, and the average donor love gift" vẫn giữ dưới tiêu đề mới.

## File sẽ sửa
- `assets/shell.js`: menu (A1).
- `finance.html`: R1–R8.
- `finance-payouts.html`: B1–B4.
- `assets/finance-admin.css`: cỡ chữ, màu, đường kẻ dọc, khung Tally, thanh review.
- `assets/finance-data.js`:
  - Trong `adminRow`: AXS tính như Connect (D3), thêm lại trường `tally`, tách "disbursed" thành phần Agathos tự chi (D2).
  - `MODEL_NAME` không còn "Direct".
  - Trang người dùng không dùng các trường này. Em sẽ chạy lại test của trang người dùng để chắc.

## Kiểm tra nghiệm thu
- Recon Overview:
  - 7 dòng cộng trừ khớp tới từng xu với mọi PSP (All, Stripe, 2c2p, AXS) và mọi kỳ.
  - Final = tổng 4 dòng con (cộng dòng Other PSP charges, như mục mở rộng hiện có).
- Disbursement Report: 6 dòng khớp. Khoảng ngày đúng với giao dịch đầu và cuối của kỳ.
- Bảng: đúng 11 cột số theo thứ tự mới, 3 cột in đậm, có đường kẻ dọc, 2 cột có nền màu.
- Tally: dữ liệu thật thì "All tally". Chọn "Some off" thì đúng 3 dòng lệch, S$0.93.
- CSV: cột và dòng khớp với trang.
- Trang người dùng: test cũ vẫn qua. Chạy `node --check`, kiểm tra bằng script node và curl.

## Ước lượng thời gian
| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này | 0.1 | 0.1 |
| 2. Dữ liệu: AXS như Connect, tally, disbursed (D2, D3) và kiểm tra cộng trừ | 0.25 | 0.35 |
| 3. Menu và tên trang (A1) | 0.1 | 0.45 |
| 4. Recon Overview: bậc thang, cỡ chữ, màu (R1, R2) | 0.25 | 0.7 |
| 5. Recon Overview: cột mới, in đậm, đường kẻ, màu cột, PSP model (R3, R5) | 0.25 | 0.95 |
| 6. Tally: cột, khung tóm tắt, công tắc review (R4, D6) | 0.25 | 1.2 |
| 7. Statistics: tiêu đề, chọn kỳ tuỳ ý (R6, R7) | 0.2 | 1.4 |
| 8. Disbursement Report: bậc thang, khoảng ngày (B2, B3) | 0.2 | 1.6 |
| 9. CSV của 2 trang (R8, B4) | 0.2 | 1.8 |
| 10. Kiểm tra, log | 0.2 | 2.0 |

## Nhật ký
- 14/11/2026: viết plan. Đã tính thử bậc thang mới với dữ liệu mẫu, kỳ Nov 2026:
  - Master: khớp cả 7 dòng.
  - Connect: khớp nếu dòng 6 không gồm Connect (D2).
  - AXS: khớp nếu tính như Connect (D3).
  - Chưa code.
- 14/11/2026: **đã làm xong A1, R1–R8, B1–B4.** File đã sửa: `assets/shell.js`, `finance.html`, `finance-payouts.html`, `assets/finance-admin.css`, `assets/finance-data.js`.
  - **Menu:** Application, Financials (mới, icon tiền, không có trang con), Recon (Recon Overview, Disbursement Report), rồi phần còn lại như cũ.
  - **Dữ liệu:**
    - AXS là Connect. `MODEL_NAME` không còn Direct.
    - `adminRow` tính theo bảng của team: tiền trả thẳng = Net của Connect; tiền Agathos chi = Net của Master; PSP payout = Transaction Amount − PSP fees − tiền trả thẳng; Final = PSP payout − tiền Agathos chi.
    - Thêm lại trường `tally`.
    - Other PSP charges chỉ tính tài khoản Stripe Connect. AXS không có tài khoản ở Stripe, nên số này giữ nguyên S$11.88.
  - **Recon Overview, kỳ Nov 2026, mọi PSP:** 7,244.10 − 164.01 − 11.88 − 4,419.47 = 2,648.74; − 2,118.68 = **530.06**. Final giữ đúng số cũ trên ảnh của team.
    - "Total disbursed to projects/events" giờ là 2,118.68, trước đây là 6,538.15. Lý do: tiền Connect và AXS đã nằm ở dòng "paid out directly".
  - **Disbursement Report, kỳ Nov 2026:** 2,296.00 − 63.82 − 0.00 = 2,232.18; − 113.50 = **2,118.68**. Bằng đúng dòng disbursed của Recon Overview.
  - **Bảng:**
    - 11 cột số theo thứ tự mới. 3 cột in đậm. Có đường kẻ dọc sau Transaction Amount.
    - Net to Merchant tô xanh nhạt, Total to Agathos tô cam nhạt.
    - Tiêu đề cột số dài xuống dòng trong khung rộng 124px.
    - Thêm lại cột Tally check: "OK" màu xanh lá, hoặc số lệch màu đỏ.
  - **Tally:**
    - Khung tóm tắt ngay trên bảng.
    - Thanh review màu kem ghi "Not part of the design", có công tắc "All tally / Some don't tally". Chọn "Some don't tally" thì 3 giao dịch của kỳ mới nhất lệch, tổng S$0.93: tô đỏ cả dòng, có nút "Show only these".
  - **Statistics:** đổi tên thành "Transaction and average donor love gift trends". Chọn kỳ bằng ô giống bộ lọc ở trên (Last 6, Last 12, All of năm, All, lưới tháng, Done), mặc định Last 6.
  - **CSV:**
    - Recon Overview: tóm tắt theo thứ tự mới, cột mới, có Tally check.
    - Disbursement Report: 3 phần (báo cáo, bậc thang có dấu, theo project có dòng Total), tên file `agathos-disbursement-report-<kỳ>.csv`.
  - **Đã kiểm tra:**
    - `node --check` cả 5 file không báo lỗi.
    - `admin6-check.js` 44/44: bậc thang khớp ở mọi PSP và mọi kỳ, Final = các phần con, cột và class đúng, Tally và chế độ lệch, Statistics, CSV 2 trang, menu.
    - Test trang người dùng vẫn qua: `fr5g` 67/67, `fr5f` 32/32.
    - curl trả về 200 cho 5 file.
  - **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (14/11/2026).
- **14/11/2026, bỏ việc bấm lại Show report (anh yêu cầu):**
  - Trước đây (D3 của v4, do em chọn, team không yêu cầu): báo cáo đã hiện mà đổi bộ lọc thì số mờ đi, có dòng "Filters changed. Show report to update." và phải bấm lại.
  - Giờ ở cả 2 trang:
    - Lần đầu vẫn bấm Show report. Đây là yêu cầu T2/S2 của team: chọn bộ lọc trước rồi mới có số.
    - Sau đó mỗi lần đổi bộ lọc (kỳ, PSP, project/event, Reset) thì trang tự tải lại.
    - Trong lúc tải: số cũ mờ đi và không bấm được; ô "Loading data…" có vòng xoay hiện ở giữa phía trên, cuộn trang thì vẫn bám dưới thanh trên cùng; nút Export .csv bị khoá.
    - Trang chờ 1 giây sau lần đổi cuối mới tải. Ví dụ chọn liền 3 tháng thì chỉ tải 1 lần.
    - Bấm Show report cũng hiện "Loading data…" 1 giây.
  - Bỏ dòng "Filters changed. Show report to update." và CSS `.fin-stale`, `.is-stale`.
  - **Đã kiểm tra:**
    - `admin6-load-check.js` 28/28: trước lần đầu không tự tải; đổi PSP, kỳ, project, Reset hay gõ tìm đều tự tải và ra đúng số; chọn liền 2 tháng chỉ tải 1 lần; Reset khi không có gì đổi thì không tải; Export bị khoá lúc đang tải.
    - `admin6-check.js` 44/44. Harness có thêm đồng hồ giả để test chạy hết khoảng chờ 1 giây.
    - `fr5g` 67/67, `fr5f` 32/32.
  - **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (14/11/2026).
- **14/11/2026, Tally không đỏ, loading thành lớp phủ (anh yêu cầu):**
  - **Bảng toàn đỏ, "S$NaN off", AXS ghi "Direct" trên ảnh của anh:**
    - Trình duyệt lấy `finance-data.js` cũ trong bộ nhớ đệm. Bản đó chưa có trường `tally` và vẫn có Direct, nên Tally ra NaN và cả 41 dòng bị tính là lệch.
    - Server local cũ không gửi header chặn cache. Em chạy lại server với `Cache-Control: no-store`, script nằm trong scratchpad, repo không đổi.
  - **Chữ đỏ cả dòng:** class `.off` của ô Tally trùng với class `.off` của dòng. Đổi thành `t-off` cho ô và `is-off` cho dòng.
  - **Tally lệch, cách hiện mới:**
    - Dòng không tô màu.
    - Ô Tally có huy hiệu cam nhạt: biểu tượng cảnh báo và số lệch, chữ #AD4E00 trên nền #FFF7E6.
    - Cột tên project có vạch cam 3px ở mép trái.
    - Khung tóm tắt đổi từ đỏ sang vàng nhạt (#FFFBE6).
    - Không còn màu đỏ nào cho Tally.
  - **Loading là lớp phủ trên toàn bộ phần báo cáo:**
    - Số cũ bị làm mờ (blur 6px) và không bấm được.
    - Thẻ trắng ghi "Loading data…" (chữ 16px đậm, vòng xoay 20px), cuộn trang thì vẫn thấy.
    - Áp dụng ở cả 2 trang.
  - **Đã kiểm tra:** `admin6-load-check.js` 30/30, `admin6-check.js` 44/44, `fr5g` 67/67, `fr5f` 32/32. Server trả `Cache-Control: no-store`.
  - **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (14/11/2026).
