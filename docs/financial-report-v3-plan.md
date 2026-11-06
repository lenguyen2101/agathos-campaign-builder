# /financial-report: version 3, và trang Finance trong Admin (06/11/2026). Anh đã duyệt; đã làm, chưa commit.

**Nguồn:**
- Feedback từ buổi họp (2 ý, ký hiệu M1–M2).
- Tab "v2 feedback" của file drawio. Anh gửi 2 ảnh chụp: ý E1–E7 cho Manage Project/Event, ý P1–P4 cho Manage Pages › Payouts. Theo anh dặn, khi trùng nhau thì tab drawio thắng.
- File `Agathos Financial Report Reconcilation copy.xlsx`, sheet "Agathos Financial Reports", dùng cho trang Finance của Admin.
- **Lưu ý của anh (06/11):**
  - Trang Finance là của **Admin Agathos**, nằm trong admin console đang có (cùng chỗ với trang Campaign) và có menu mới. Trang này không thuộc phần dành cho người dùng (chủ project/event, chủ tổ chức).
  - Anh gửi thêm ảnh hộp "Get Tickets" của một event production làm mẫu cho loại vé.
  - Anh đồng ý D1, D2, D3, D4.

Nguyên tắc vẫn như vòng trước: làm đúng chữ từng comment, không thêm gì ngoài comment và sheet. Chỗ nào comment mâu thuẫn hoặc còn bỏ ngỏ thì em ghi thành quyết định, kèm mặc định để anh chọn.

---

## 1. Feedback và cách làm

### Buổi họp

| # | Feedback (nguyên văn) | Làm thế nào |
|---|---|---|
| M1 | *Remove the payouts tab on the project/event level* | Bỏ tab Payouts trong Manage Project và Manage Event. Bỏ luôn thanh segmented, vì chỉ còn 1 tab. Tiêu đề và mục menu trái đổi: "Transactions & Payouts" → "Transactions", "Orders & Payouts" → "Orders". Link cũ `#/manage/<id>/payouts` mở tab Transactions/Orders. Trang charity IPC giữ nguyên 2 tab Transactions / Invoices, vì Invoices không phải payouts. |
| M2 | *Trial combining the 2 graphs on the transaction tab to reduce vertical real estate or try other methods* | Gộp 2 biểu đồ thành 1 biểu đồ, có nút chuyển "Amount (S$)" / "No. of donations" (event: "No. of orders"). Chiều cao giảm khoảng một nửa. Xem D3. |

### Tab "v2 feedback": Manage Project / Manage Event

| # | Comment (nguyên văn) | Làm thế nào |
|---|---|---|
| E1 | *For events, how can we best represent numbers on sales by ticket type? Is that a meaningful number to track? Where should this info be located? In this box or its own separate section? it should not be too heavy on the UI complexity* | Đây là câu hỏi. Em đề xuất ở mục 3 (Q-E1). |
| E2 | *Tax deduction should be separated out as another button. Follow current design. It contains more sub actions as well. If the export (and tax deduction report) works according to the filter, we should place it below the filters to signal that to the user* | "Tax Deduction Report ▾" thành nút riêng, như production, bấm vào mở menu con của nó. File CSV xuất đúng theo bộ lọc, nên nút "Export as .csv" (event: "Export Orders as .csv") chuyển xuống ngay dưới bộ lọc. Hàng trên cùng còn "Add Offline Transaction" và "Tax Deduction Report ▾". Chưa biết Tax Deduction Report có theo bộ lọc không (Q2). |
| E3 | *Change 'All payouts' to '-'. Change 'Not in a payout yet' to 'Processing'* | Đúng chữ. Trang IPC: "All months" cũng đổi thành "-". |
| E4 | *Change to 'Statistics'* | "Giving statistics" → "Statistics". |
| E5 | *Remove payout date. Amount paid out can be removed as well since info is presented on top. Label payout as just 'Oct 2026'. Remove date range from title. How should this box look like when filter is applied to 'All payouts' or 'Not in a payout yet'? Also, how will this look like if the payout is only not part of a larger payout? Do we still want to provide user the shortcut to the payouts tab? Should this be below the summary box? (Net to you) Since the info is more related compared to the graph* | Bỏ ngày trả, bỏ số tiền. Tiêu đề chỉ ghi tên tháng của đợt, không có khoảng ngày (tên tháng theo D1). Thẻ chuyển lên **ngay dưới khung tóm tắt**. Các câu hỏi khác em trả lời ở mục 3 (Q-E5). |
| E6 | *Change to 'View full payout summary'* | Đúng chữ. |
| E7 | *Change to just 2 statuses: Processing (when transaction hasn't been assigned to a payout); '[Month] [Year]' eg. Nov 2026 (after PSP date has been synced, transaction can be assigned to payout month)* | Cột Payout status chỉ còn "Processing" hoặc tên tháng của đợt, ví dụ "Nov 2026" (theo D1). Bỏ "Awaiting next payout" và "Paid out". |

### Tab "v2 feedback": Manage Pages › Payouts

| # | Comment (nguyên văn) | Làm thế nào |
|---|---|---|
| P1 | *Filter to allow selection of multiple months. All payout periods to change to month instead of date range* | Ô Payout period chọn được nhiều tháng (danh sách có ô tick). Không chọn gì thì hiện "-", nghĩa là tất cả. Mọi chỗ đang ghi khoảng ngày ("1–31 Oct 2026") đổi thành tên tháng (theo D1), ở cả Manage Project/Event. |
| P2 | *Remove date field. Remove 'Not paid yet status' as we won't be tracking when it is paid out on the platform* | Bỏ cột Date và tag "Not paid yet" trong bảng (cả bản thẻ trên phone). Những chỗ khác vẫn đang hiện đã trả / chưa trả: xem D2. |
| P3 | *Change 'Monthly payout' to '[Month] [Year] Payout' (ie. 'Nov 2026 Payout'). Remove date range* | Dòng chính là "Nov 2026 Payout". Dòng phụ bỏ khoảng ngày, chỉ còn "2 projects, 1 event". |
| P4 | *when expanded, clicking on the project or event should lead user to the transaction page for that project/event with the matching filters set* | Bấm tên project/event ở dòng con thì mở tab Transactions (event: Orders) của project/event đó, với Payout period đặt sẵn đúng đợt đó. |

---

## 2. Trang mới: Finance, trong admin console

Làm theo **mục 3.0** của sheet ("We can use this for Transaction report (all trx) v2"). Rach ghi chú ở ô B63 là gộp 2 báo cáo cũ (mục 1 và 2) thành 1, nên chỉ có 1 trang. Ô E2 ghi người dùng là team Finance.

**Chỗ đặt:** trong admin console, không nằm trong `/financial-report`.
- File mới `finance.html`, mở tại `/finance`.
- Dùng chung khung với các trang admin khác: `assets/app.css`, `assets/shell.js` (menu trái, thanh trên, "admin"), font Inter.
- Bố cục theo trang Campaign:
  - tiêu đề trang;
  - hàng bộ lọc;
  - bảng kiểu Ant: header xám, link xanh, phân trang "Showing 1–10 of N", ô "20 / page".
- **Menu mới:** nhóm **"Finance"** có icon riêng, nằm sau "Org Management". Bên trong có 1 mục **"Financial Report"**. Menu này hiện ở mọi trang admin, vì `shell.js` dùng chung.
- Thanh review của `/financial-report` không có tab sang trang này, để tách hẳn trang admin khỏi trang của người dùng.

**Dữ liệu dùng chung:** trang Finance phải ra đúng số của trang chủ project (Net to Merchant = Net payout). Vì vậy phần dữ liệu mẫu của `financial-report.js` (project, tổ chức, quy tắc phí, giao dịch mẫu, cách cộng tổng, đợt payout) tách ra file mới `assets/finance-data.js`, dùng cho cả 2 trang. `financial-report.js` chỉ còn phần giao diện.

**Bộ lọc (C66–C68, E7):**
- Project/Event: tất cả, hoặc một project/event, nhóm theo Personal / tổ chức.
- PSP: tất cả, Stripe, 2c2p, AXS.
- Payout period: chọn nhiều tháng (D67), cùng kiểu ô với P1.

**Khung tóm tắt (C69–C76):**
- Payout Period
- Total Trx Amt
- Total PSP Fees
- Other PSP charges, liệt kê từng khoản theo D72: Account Volume Billing, Active Account Billing, Payout Fee (Stripe, theo D48)
- Total PSP Payout to Agathos
- Total Disbursed to Projects/Events
- Total Paid Out to Projects/Events (Connect)
- Final Amount to Agathos (tên tạm, theo C76)

**Bảng chi tiết (C77–C95):** có phân trang, cuộn ngang, 2 cột đầu đứng yên, giống bảng của chủ project.
- Cột: Project / Event Name · Transaction Date & Time · Transaction Reference · Payment Method · Receiving Currency · Receiving Amount · Fees (PSP charges) · Agathos Margin from PSP fees · Beneficiary Love Gift Amount · Agathos Platform Fee · Net to Merchant · Donor Love Gift Amount · Finalized Donor Love Gift Amount · Total to Agathos · PSP Payout Date · PSP name · PSP merchant id · PSP model · Tally check.
- Không có cột Agathos Payout Date (D96: *"Seems like don't need for now"*).

**Cách tính mỗi dòng.** Theo sheet Intro (dòng 5–6), sheet DB Table và bảng định nghĩa của Elaine (B100–D104):

| Ô | Cách tính |
|---|---|
| Fees (PSP charges) | Phí thật của PSP trên Receiving Amount (Intro dòng 6). Không gồm margin (D83). |
| Agathos Margin from PSP fees | Phí tính cho chủ project (Intro dòng 5, chính là "Processing fees" chủ project đang thấy) trừ đi phí thật. Ví dụ Stripe thẻ trong nước: 3.9% − 3.4% = 0.5% số tiền. |
| Net to Merchant | Receiving − Fees − Margin − Bene Love Gift − Platform Fee (C87). Bằng đúng "Net payout" mà chủ project thấy. |
| Finalized Donor Love Gift | Stripe: love gift trừ phí PSP trên phần love gift (DB Table dòng 29–30). AXS: số tiền clawback (E89). |
| Total to Agathos | Bene Love Gift + Finalized Donor Love Gift + Margin (D90). Với event, Platform Fee nằm ở chỗ Bene Love Gift. |
| Total PSP Payout to Agathos | Connect: tiền PSP trả Agathos cho giao dịch đó (charge + platform_earning + transfer, C102). Master: tổng giao dịch trừ phí PSP. AXS: margin (E102). |
| Total Disbursed to Projects/Events | Connect: Net to Merchant. Master: Net to Merchant (2c2p trừ thêm platform fee, D103). AXS: số từ file PSP (E103). |
| Final Amount to Agathos | Connect: bằng PSP Payout to Agathos. Master: PSP Payout − Disbursed. AXS: PSP Payout + clawback (C104, D104, E104). |
| Tally check | Sheet chưa định nghĩa. Em đề xuất kiểm tra Tổng giao dịch = Phí PSP + Net to Merchant + Total to Agathos, khớp thì ghi "OK", lệch thì ghi số lệch. Có nhãn "To confirm". |

**Dữ liệu mẫu:** dùng lại 5 project/event đang có. Trang admin chỉ hiện giao dịch đã có trong file PSP, tức không hiện Processing, theo ô A2 *"after reconciliation data from PSP file"*. Mô hình PSP của từng project em chọn ở D4.

---

## 3. Đề xuất trả lời câu hỏi của team

- **Q-E5, thẻ payout trong Manage Project/Event:**
  - Payout period là "-" hoặc "Processing": không hiện thẻ. Thẻ nói về một đợt, mà lúc này chưa chọn đợt nào.
  - Đợt có nhiều project/event: tiêu đề "Nov 2026 Payout", câu "This is part of a larger payout with 2 other projects and events.", và link "View full payout summary".
  - Đợt chỉ có project/event này: vẫn hiện thẻ, nhưng chỉ có tiêu đề và link "View full payout summary". Lý do giữ lối tắt: Manage Pages › Payouts có thêm phần chia theo từng project/event, và cho chọn nhiều tháng.
  - Vị trí: ngay dưới khung tóm tắt, theo gợi ý của team.
- **Q-E1, doanh thu theo loại vé:** gọn nhất là để trong khung tóm tắt. Ngay dưới dòng "Total Ticket Sales Amount" có một dòng "By ticket type ▾", mặc định đóng. Mở ra là danh sách ngắn: tên loại vé · số vé bán · số tiền. Không thêm mục riêng, không thêm biểu đồ.
  - Có ích không: có, vì giúp chủ event biết loại vé nào bán chạy. Cũng chỉ tốn một dòng khi đóng.
  - **Loại vé theo production:** ảnh hộp "Get Tickets" anh gửi cho thấy mỗi loại vé có tên dạng "<Tên event> - <Loại>", một giá và một dòng mô tả. Ví dụ: "1361 Missions Training - Student / NSF" (S$20) và "1361 Missions Training - Working Adults" (S$40).
  - Event mẫu dùng 2 loại vé theo đúng kiểu đó:
    - "Benefit concert for the unseen - Student / NSF", S$35;
    - "Benefit concert for the unseen - Working Adults", S$60.
    - Bỏ mức S$120 đang có trong dữ liệu mẫu, nên số liệu mẫu của event sẽ đổi.
  - Dòng "By ticket type" chỉ hiện tên, số vé bán và số tiền. Không hiện mô tả.

---

## 4. Quyết định (anh đã duyệt D1–D4 ngày 06/11)

- **D1. Tên của một đợt payout là tháng trả tiền.** Đợt trả ngày 20/11 cho doanh thu tháng 10 tên là "Nov 2026".
  - Theo đúng 2 ví dụ: P3 (*"'Nov 2026 Payout'"*, ở đúng dòng trả ngày 20 Nov 2026) và E7 (*"eg. Nov 2026 … assigned to payout month"*).
  - Áp dụng cho trạng thái giao dịch, tên đợt trong bảng Payouts, các ô chọn Payout period, tiêu đề thẻ payout và file CSV.
  - **Mâu thuẫn:** E5 ghi *"Label payout as just 'Oct 2026'"*. Với D1, thẻ của đợt đó sẽ ghi "Nov 2026". Nếu anh chọn ngược lại (đặt tên theo tháng doanh thu), thẻ ghi "Oct 2026", nhưng dòng trong bảng Payouts sẽ là "Oct 2026 Payout", khác ví dụ của P3. Đổi qua lại chỉ cần sửa 1 hàm.
- **D2. Những chỗ khác đang hiện đã trả / chưa trả.** P2 nói *"we won't be tracking when it is paid out on the platform"*. Hiện còn 4 chỗ dựa vào chuyện này:
  - (a) Bên trái khung tóm tắt: Total paid out / Total awaiting pay out và thanh 2 phần (F9).
  - (b) Dòng "Not paid yet · Agathos pays on …" trong tóm tắt Payouts (F24).
  - (c) Tag Paid / Upcoming và câu "Agathos paid DBS … on …" khi chọn 1 đợt.
  - (d) Dải "Paid out / Balance" dưới bảng Payouts (F33).
  - **Mặc định:** chỉ bỏ đúng những gì P2 nêu (cột Date và tag "Not paid yet"). Giữ (a)–(d), vì F9, F24 và F33 là comment team đã yêu cầu và chưa rút lại. Em đưa chuyện này vào câu hỏi cho team.
  - Phương án khác: bỏ hoặc thay cả (a)–(d) để khớp lý do của P2.
- **D3. Gộp biểu đồ (M2):** 1 biểu đồ đường, có nút chuyển giữa 2 số. Em không dùng biểu đồ 2 trục (một trục tiền, một trục số lượt), vì 2 thang khác nhau trên cùng một hình rất dễ đọc sai. Phương án khác: giữ 2 biểu đồ nhưng thấp hơn, đặt cạnh nhau.
- **D4. Trang Finance:**
  - Mô hình PSP: Special Needs Centre in Erbil và Outreach (Antioch 21) dùng **Stripe Connect**. Care packages (Personal) dùng **Stripe Master**. Benefit concert dùng **2c2p Master**. Sunny Days dùng **AXS Direct**. Như vậy có đủ cả 4 trường hợp trong bảng của Elaine.
  - Other PSP charges của Stripe là số mẫu, tính theo cách Stripe Connect tính phí: theo số tài khoản hoạt động, theo khối lượng, và theo mỗi lần chuyển tiền.
  - Giao diện: theo admin console đang có (mục 2), không dựng khung riêng.

---

## 5. Lỗi em phát hiện trong v2 (cần anh cho sửa)

- **Phí AXS trên trang charity IPC đang sai so với sheet.** v2 tính "Processing fees" cho charity theo mức PSP thu Agathos (Intro dòng 6: 1.2% / 2.8% / 0.4%). Đúng ra phải theo mức Agathos thu charity (Intro dòng 5: 1.6% + 0.2).
  - Không sửa thì trang Finance (có cột margin) và trang AXS sẽ lệch số nhau.
  - **Mặc định:** sửa theo sheet. Mục này anh chưa trả lời; em cần anh xác nhận trước khi làm.

---

## 6. Câu hỏi cho team (không đưa vào trang)

1. Tên đợt payout: theo tháng trả tiền hay tháng doanh thu? (D1)
2. P2 nói không theo dõi việc đã trả. Vậy có giữ Total paid out / awaiting (F9), "Not paid yet" (F24) và Paid out / Balance (F33) không? (D2)
3. Tax Deduction Report có xuất theo bộ lọc không? Nếu có thì nút này cũng chuyển xuống dưới bộ lọc (E2).
4. Trang Finance: định nghĩa "Tally check". "Total Trx Amt" có gồm Donor Love Gift không (em đang tính là có)? Với AXS, số tiền charity nhận có tính vào "Total Disbursed" không (theo bảng của Elaine em đang tính là có)?
5. Có muốn hiện mô tả của loại vé trong dòng "By ticket type" không? Mặc định là không, để gọn (Q-E1).
6. Câu hỏi còn lại từ F16: emergency disbursement (chi tiền gấp) xử lý thế nào? Ô E15 trong sheet có nhắc trường hợp chi sớm cho vài project, nhưng chưa có kết luận.

---

## 7. Phạm vi theo file

- `assets/finance-data.js` (mới): dữ liệu mẫu, quy tắc phí và cách cộng tổng, tách từ `financial-report.js`.
  - Thêm 2 loại vé của event.
  - Thêm mô hình PSP (Connect / Master / Direct).
  - Thêm phí thật của PSP, margin, Finalized Donor Love Gift và Other PSP charges cho trang Finance.
  - Phí AXS sửa theo mục 5.
- `assets/financial-report.js`:
  - Manage Project/Event: M1, M2, E1–E7.
  - Manage Pages › Payouts: P1–P4.
  - Pill "Version 3".
  - Modal notes: bỏ mục F16, vì trang Finance của Admin giờ đã có. Câu hỏi về emergency disbursement chuyển sang mục 6, câu 6 bên dưới. Nếu theo D1 mà thẻ ghi "Nov 2026" thay vì "Oct 2026" như E5, mục này vào modal notes. Như vậy notes vẫn tối đa 1 mục, không tăng.
  - CSV: trạng thái theo E7. Bỏ cột "Payout date" và dòng "Agathos pays on", vì không còn theo dõi ngày trả (P2, E5). Đây là câu anh còn để ngỏ hôm 30/10.
- `assets/financial-report.css`: ô chọn nhiều tháng, nút chuyển của biểu đồ, hàng nút dưới bộ lọc, dòng "By ticket type".
- `financial-report.html`: đổi title thành "version 3", nạp thêm `finance-data.js`.
- `finance.html` (mới): trang Financial Report của Admin. Viết theo kiểu `index.html` (Campaign): script trong trang, dùng component của `app.css`. Style riêng của trang đặt trong thẻ `<style>` của chính trang này.
- `assets/shell.js`: thêm nhóm menu "Finance" › "Financial Report" (`activeKey` là `finance`) và một icon.
- `docs/financial-report-v3-plan.md`: plan và log.

---

## 8. Thứ tự làm và nghiệm thu

1. Manage Project/Event: M1, E2–E7, D1.
2. Biểu đồ (M2), thẻ payout (E5, E6), loại vé (E1).
3. Manage Pages › Payouts: P1–P4.
4. Tách `finance-data.js`. Chạy lại script kiểm tra v2 để chắc số liệu không đổi, trừ 2 chỗ cố ý đổi: loại vé và phí AXS.
5. Trang Finance trong admin console và menu mới.
6. Phí AXS, CSV, notes, version.
7. Kiểm tra.

**Nghiệm thu:**
- Mỗi comment M1–M2, E1–E7, P1–P4 có ít nhất 1 kiểm tra trong script node.
- Trang Finance (`/finance`):
  - Menu "Finance › Financial Report" sáng đúng mục, và hiện ở các trang admin khác.
  - Đủ 19 cột và 8 dòng tóm tắt theo mục 3.0.
  - Với mọi dòng: Receiving − Fees − Margin − Bene LG − Platform Fee = Net to Merchant.
  - Net to Merchant khớp "Net payout" chủ project thấy.
  - Final Amount khớp công thức theo từng mô hình PSP.
- P4: bấm dòng con thì mở đúng project/event, với đúng đợt đã chọn sẵn.
- Không còn chữ "Monthly payout", "Giving statistics", "Not in a payout yet", "Awaiting next payout", "See payout summary". Không còn khoảng ngày dạng "1–31 Oct 2026".
- Kiểm bằng `node --check`, script node và curl. Không chạy Chromium headless.

---

## 9. Ước lượng thời gian

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này | 0.2 | 0.2 |
| 2. Manage Project/Event: bỏ tab Payouts, hàng nút, chữ, trạng thái, tên tháng | 0.5 | 0.7 |
| 3. Gộp biểu đồ, thẻ payout, loại vé | 0.5 | 1.2 |
| 4. Manage Pages › Payouts: chọn nhiều tháng, bỏ Date / Not paid yet, tên đợt, link có bộ lọc | 0.5 | 1.7 |
| 5. Tách `finance-data.js`, kiểm tra lại số liệu v2 | 0.3 | 2.0 |
| 6. Trang Finance trong admin console: menu, tính phí thật, margin, Connect/Master/AXS, bộ lọc, tóm tắt, bảng | 1.5 | 3.5 |
| 7. Phí AXS, CSV, notes, version; kiểm tra và ghi log | 0.4 | 3.9 |

---

## 10. Nhật ký (06/11/2026). Chưa commit.

Anh duyệt plan, kèm câu trả lời về AXS: *"AXS trong excel có thông tin gì thì cứ xài"*. Em đã làm theo đúng thứ tự ở mục 8, không có chỗ nào làm khác plan.

**Tách dữ liệu (`assets/finance-data.js`, mới):**
- Dữ liệu mẫu, quy tắc phí, cách cộng tổng và đợt payout chuyển từ `financial-report.js` sang file này, dưới tên chung `FIN`.
- Đã so từng giao dịch của Erbil, Outreach và Care (153, 54 và 38 giao dịch) với bản v2 trước khi sửa: giống hệt nhau.
- 2 chỗ cố ý đổi:
  - **Event có 2 loại vé:** Student / NSF (S$35) và Working Adults (S$60). Số liệu mẫu của event giờ là: 56 orders, 119 vé, Total Ticket Sales Amount S$5,515.00, Net S$5,168.35. Chia theo loại vé: Student / NSF 65 vé S$2,275.00; Working Adults 54 vé S$3,240.00.
  - **Phí AXS cho charity** theo Intro dòng 5 (1.6% + 0.2). Sunny Days: Processing fees S$458.33, Paid to you by AXS S$26,901.47.
- Thêm cho trang Finance: mô hình PSP (D4), phí thật của PSP (Intro dòng 6), margin, phí PSP trên donor love gift (DB Table dòng 29–30), và các cột theo bảng của Elaine.

**Manage Project / Manage Event (`assets/financial-report.js`, `.css`):**
- M1–M2, E1–E7, P1–P4: làm theo bảng ở mục 1.
- Thêm một thay đổi nhỏ theo E3: dòng đếm bên Payouts trước ghi "2 not in a payout yet", giờ ghi "2 processing", để cùng chữ với ô lọc.
- Modal notes còn 1 mục: tên đợt payout theo tháng trả tiền (E5 so với D1). Bỏ mục F16.
- Pill "Version 3", title "version 3".
- CSV:
  - Có thêm dòng Year.
  - Payout period ghi "-", "Processing" hoặc tên đợt.
  - Cột trạng thái theo E7.
  - Bỏ dòng "Agathos pays on" và cột "Payout date".

**Trang Finance của Admin (`finance.html` mới, `assets/shell.js`):**
- Menu mới "Finance › Financial Report" hiện ở mọi trang admin, sáng đúng mục khi đang ở trang này.
- 3 bộ lọc: Project / Event (nhóm theo Personal / tổ chức), PSP, Payout period (chọn nhiều tháng).
- Khung tóm tắt 8 dòng, trong đó Other PSP charges liệt kê từng khoản. Bảng 19 cột: cột đầu đứng yên, cuộn ngang, mỗi trang 20 dòng.
- **Số mẫu khi không lọc gì:** 395 giao dịch đã có trong file PSP.
  - Total Trx Amt S$89,461.50; Total PSP Fees S$1,740.68.
  - Other PSP charges S$173.12, gồm Account Volume Billing S$109.62, Active Account Billing S$24.00 và Payout Fee S$39.50.
  - Total PSP Payout to Agathos S$17,091.87; Total Disbursed S$35,702.01; Total Paid Out (Connect) S$43,849.36.
  - Final Amount to Agathos S$6,687.83.
- Phí tháng của Stripe (Other PSP charges) bị trừ vào Total PSP Payout to Agathos và Final Amount, vì Stripe trừ các khoản này vào tiền trả cho Agathos. Đây là cách em hiểu; đã ghi vào câu hỏi số 4 ở mục 6.

**Đã kiểm tra:**
- `node --check` qua cho cả 3 file JS.
- Script phía chủ project: 38/38 qua. Mỗi comment M1–M2, E1–E7, P1–P4 có kiểm tra riêng. Thêm kiểm tra cho notes, version, CSV và phí AXS.
- Script trang Finance: 18/18 qua, gồm:
  - menu;
  - đủ 19 cột và 8 dòng tóm tắt;
  - với mọi dòng: Receiving − Fees − Margin − Bene LG − Platform Fee = Net to Merchant, và Net to Merchant bằng Net payout chủ project thấy;
  - Final Amount đúng công thức của từng mô hình PSP;
  - margin Stripe 0.5% với thẻ trong nước;
  - các bộ lọc.
- **Lỗi đã sửa khi kiểm tra:**
  - Tên cột "Transaction Date & Time" chưa escape ký tự "&".
  - Bấm nút mở danh sách tháng thì trang vẽ lại, nút cũ bị gỡ khỏi trang, nên danh sách bị đóng ngay. Đã sửa để bỏ qua những phần tử không còn nằm trên trang.
- Curl: `financial-report.html`, `finance.html`, `finance-data.js` và `app.css` đều trả về 200. Server local không có cleanUrls, nên `/finance` chỉ chạy trên Vercel.
- Chưa xem giao diện bằng mắt, vì không chạy Chromium headless.

**Chỉnh theo góp ý của anh (06/11/2026). Chưa commit.**
- **Nút Export as .csv:** anh chọn cách 2, nút vẫn nằm dưới bộ lọc (đúng chữ E2) nhưng căn phải.
- **Phần "By ticket type"** làm lại:
  - Bỏ đường kẻ giữa dòng "Total Ticket Sales Amount" và "By ticket type". Hai dòng giờ đọc liền như một khối; đường kẻ chuyển xuống dưới phần đã mở ra.
  - Danh sách nằm trong khung nền xám nhạt. Tên vé đầy đủ nằm ở hàng trên; số vé (bên trái) và số tiền (bên phải) ở hàng dưới. Các dòng ngăn nhau bằng đường kẻ mảnh. Như vậy tên vé dài bao nhiêu cũng không làm lệch cột.
  - **Sửa sai (06/11):** bản trước em tự cắt tên vé thành "Student / NSF", dựa trên giả định mọi tên vé đều có dạng "<tên event> - <loại>". Không ai yêu cầu việc này, và giả định đó sai với những event đặt tên khác. Đã trả lại tên đầy đủ, đúng như chủ event đặt.
- **Đã kiểm tra:** script phía chủ project 39/39 qua. Thêm 1 kiểm tra: không có đường kẻ giữa dòng tổng và phần loại vé. Kiểm tra E1 giờ đòi tên vé phải đầy đủ.
- **Chưa đổi** (đang chờ anh): 2 nút Add Offline Transaction / Tax Deduction Report đang bị dồn sang trái, sau khi bỏ thanh tab (M1).

**Khung "Filter & export" theo ý anh (06/11/2026). Chưa commit.**
- Ô Year, ô Payout period (trang AXS là Month) và nút Export as .csv (event: Export Orders as .csv) nằm chung một khung nền xám nhạt, tiêu đề nhỏ "Filter & export" (13.5px, đậm vừa).
- Hai ô lọc bên trái, nút export bên phải, cùng một hàng. Nút cao 42px, bằng hai ô lọc.
- Khung này thay cho cách 2 ở trên (nút nằm riêng một hàng dưới bộ lọc). E2 vẫn được đáp ứng: nút export đứng ngay trong nhóm bộ lọc.
- Áp dụng cho tab Transactions/Orders của Manage Project, Manage Event và trang AXS.
- **Đã kiểm tra:** script phía chủ project 39/39 qua. Kiểm tra E2 giờ đòi bộ lọc và nút export nằm cùng hàng, trong khung "Filter & export".

**Dropdown và ô tick tự vẽ (06/11/2026). Chưa commit.**
- **Năm ô chọn của trình duyệt (`<select>`) thay bằng dropdown tự vẽ:** Year, Payout period, Month (trang AXS), và Year bên Manage Pages › Payouts.
  - Bấm nút thì mở danh sách nền trắng, bo góc. Mục đang chọn có màu xanh và dấu ✓.
  - Dùng được bằng phím: mũi tên lên/xuống để đi giữa các mục, Enter để chọn, Esc để đóng và quay về nút.
- **Danh sách chọn nhiều tháng (Manage Pages › Payouts) làm lại:**
  - Ô tick tự vẽ, ô được tick có nền xanh và dấu ✓ trắng.
  - Tháng được tick có chữ xanh đậm.
  - Cùng khoảng cách và cỡ chữ với dropdown.
  - Trước đó danh sách này xấu do rule cũ `.fr-sel label` (chữ đậm, xám, `display:block`) đè lên các dòng tick; đã gỡ rule đó.
- **Đã kiểm tra:** script phía chủ project 42/42 qua. Thêm 3 kiểm tra: không còn `<select>`, Year mở một listbox, chọn "Oct 2026" thì lọc đúng đợt đó.
- **Trang Finance của Admin vẫn dùng ô chọn kiểu admin console** (`.ctl`, giống trang Campaign), chưa đổi.

**Xem Payout History toàn màn hình (06/11/2026). Chưa commit.**
- Nút "View full screen" (icon mở rộng) nằm cùng hàng với tiêu đề Payout History, bên phải.
- Bấm vào thì phần Payout History phủ toàn màn hình, nền trắng:
  - Bảng rộng hết màn hình, đủ chỗ cho mọi cột.
  - Tiêu đề và nút đứng yên ở trên khi cuộn.
  - Trang phía sau không cuộn được.
- Nút đổi thành "Exit full screen"; Esc cũng thoát. Nếu đang mở một dropdown thì Esc chỉ đóng dropdown đó.
- Trong chế độ này vẫn mở/đóng từng đợt payout được, và dải Paid out / Balance vẫn ở cuối.
- **Đã kiểm tra:** script phía chủ project 46/46 qua. Thêm 4 kiểm tra cho chế độ toàn màn hình.
- **Chưa làm:** bảng Transactions / Orders trong Manage Project / Event. Đang chờ anh quyết có áp dụng giống vậy không.

**"View full screen" cho bảng Transactions / Orders (06/11/2026, theo yêu cầu của anh). Chưa commit.**
- Áp dụng cho bảng Transactions của Manage Project (kể cả trang AXS) và bảng Orders của Manage Event. Cùng nút, cùng cách làm với Payout History; nút dùng chung một hàm `fullBtn()`.
- Đang ở chế độ toàn màn hình mà chuyển trang của bảng thì vẫn ở chế độ đó, và bảng cuộn về đầu.
- Bảng trống thì không có nút.
- **Đã kiểm tra:** script phía chủ project 52/52 qua. Thêm 6 kiểm tra: có nút ở cả 3 trang, mở toàn màn hình, chuyển sang trang 2 vẫn giữ toàn màn hình, Esc để thoát.

---

## 11. Trang Financial Report của Admin, làm lại thành dashboard (06/11/2026). Chưa commit.

**Lý do:** anh nhận xét bản trước *"quá tệ … có helpful đủ chưa? … trực quan chưa? … hàng trăm projects/events mà nhét vô 1 cái selection kiếm chừng nào mới ra?"*, và cho phép thêm biểu đồ kiểu BI dashboard.

**Bố cục mới (`finance.html`), từ trên xuống:**
- **Thanh lọc, một hàng.** Không còn dùng ô chọn của trình duyệt.
  - **Project / Event:** có ô tìm kiếm theo tên project, event hoặc tổ chức. Danh sách nhóm theo chủ sở hữu (Personal / tổ chức), mỗi dòng ghi Project hay Event và PSP. Bấm tên nhóm thì chọn cả tổ chức. Dùng được bằng phím mũi tên và Enter. Cách này vẫn dùng được khi có hàng trăm project.
  - **PSP:** nút chuyển All / Stripe / 2c2p / AXS.
  - **Payout period:** các mốc nhanh (All, Latest payout, Last 3 payouts, All of 2025, All of 2026), rồi lưới tháng theo năm, chọn được nhiều tháng. Tên đợt theo tháng trả tiền (D1).
  - Có nút "Reset filters" khi đang lọc.
- **Khung chính:**
  - Final Amount to Agathos là con số lớn nhất trang, kèm dòng "Payout Period: …" ghi bộ lọc đang dùng.
  - Bên phải là Total PSP Payout to Agathos, Total Disbursed to Projects/Events và Total Paid Out to Projects/Events (Connect). Số tiền của 3 ô thẳng hàng ở đáy, dù nhãn dài 1 hay 2 dòng.
  - Bên dưới là thanh chia "Where the Total Trx Amt went": Net to Merchant / Total to Agathos / PSP fees, có % và chú thích.
- **Bốn ô chỉ số:**
  - Total Trx Amt (kèm số giao dịch).
  - Total PSP Fees (kèm % trên Total Trx Amt).
  - Other PSP charges (liệt kê 3 khoản).
  - Tally check (icon và chữ: "All tally, 395 of 395").
- **Biểu đồ.** Mỗi phần tiền có một màu cố định ở mọi biểu đồ. Bảng màu đã qua script kiểm định của skill dataviz (xanh `#2a78d6`, cam `#eb6834`, xanh ngọc `#1baf7a` trên nền trắng: ALL CHECKS PASS). Riêng xanh ngọc có tương phản 2.82:1, nên mọi biểu đồ có chú thích, tooltip và nút xem dạng bảng.
  - **By payout period:** cột chồng cho từng đợt, cột cao nhất ghi tổng. Bấm cột thì lọc theo đợt đó.
  - **By PSP:** thanh ngang, 3 phần nối nhau. Bấm thì lọc theo PSP.
  - **Top projects and events:** 8 cái lớn nhất theo Total Trx Amt. Bấm thì chỉ xem giao dịch của nó; nếu có nhiều hơn 8 thì có dòng hướng dẫn tìm phần còn lại.
- **Bảng giao dịch:** 19 cột như cũ, thêm:
  - ô tìm theo reference, project, event hoặc tổ chức;
  - nút "View full screen";
  - cột đầu ghi thêm tên tổ chức;
  - phân trang kiểu Ant.
- **Nút Export .csv** ở đầu trang: xuất phần tóm tắt và các giao dịch đang lọc.

**Đã kiểm tra:**
- Script trang Finance (viết lại): 34/34 qua, gồm:
  - menu;
  - đủ 8 dòng tóm tắt của 3.0;
  - 3 phần cộng lại bằng Total Trx Amt (S$89,461.50);
  - tally 395/395;
  - 12 cột theo đợt, 4 dòng PSP;
  - tìm kiếm trong ô chọn project/event (theo tên project và theo tên tổ chức);
  - chọn cả tổ chức, PSP, các mốc nhanh, chọn nhiều tháng;
  - bấm vào biểu đồ để lọc;
  - bảng 19 cột, tìm kiếm, toàn màn hình, CSV;
  - với mọi dòng: Net to Merchant bằng Net payout chủ project thấy.
- Một lần chạy fail do em ghi sai số mong đợi trong script (đợt năm 2026 là 11, từ Jan đến Nov, không phải 10). Đã sửa script; trang không sai.
- Script phía chủ project vẫn 52/52 qua.
- Chưa xem giao diện bằng mắt.

**Ô Project / Event thành thanh tìm kiếm (06/11/2026, theo ý anh). Chưa commit.**
- Bỏ danh sách để chọn. Gõ vào thanh tìm kiếm thì cả trang lọc ngay (số tiền chính, các ô chỉ số, biểu đồ, bảng, CSV), theo tên project, event hoặc tổ chức, không phân biệt hoa thường.
- Có nút × để xoá chữ. Esc trong thanh tìm kiếm cũng xoá.
- Bấm một dòng ở "Top projects and events" thì tên project/event đó được điền vào thanh tìm kiếm.
- Khi gõ, chỉ phần dưới thanh lọc được vẽ lại, nên thanh tìm kiếm giữ con trỏ. Trong lúc đang ghép dấu tiếng Việt (Telex/VNI) trang không vẽ lại; gõ xong dấu mới lọc.
- **Đã kiểm tra:** script trang Finance 35/35 qua. Thêm các kiểm tra:
  - không còn danh sách chọn;
  - gõ tên project, gõ tên tổ chức, gõ chữ không khớp;
  - nút ×;
  - đang ghép dấu thì không lọc;
  - bấm dòng project thì tên điền vào thanh tìm kiếm.

---

## 12. Đối chiếu lại với file copy (có định dạng) và làm báo cáo mục 2 (06/11/2026). Anh đã duyệt ("LÀM THEO ĐỀ XUẤT ĐI"). Chưa commit.

**Em đọc sai.** Lúc trước em đọc Excel bằng script chỉ lấy chữ, nên mất định dạng (gạch ngang, màu). Đọc lại có định dạng:
- Mục 1 "Transaction Report (All trx)" **bị gạch**, thay bằng **3.0** "Transaction report (all trx) v2". Đây là trang `/finance` hiện tại.
- Câu của Rach *"Same thought to have the two sections combined to one"* **bị gạch**, nghĩa là **không gộp**.
- Mục 2 *"Summary Payout Report Per PSP Settlement period — we will use this"* vẫn phải làm, thành **báo cáo thứ hai**.
- Intro trong file copy khác file cũ: D5 (không có benTip cho Hidden Cause), D6 (phí AXS cộng $0.20 / $0.10), A13 (ngày Stripe và 2c2p trả tiền), D8 (Rach cần biết donor love gift để clawback).

**Đã sửa theo file copy:**
- `assets/finance-data.js`:
  - Sunny Days (AXS) không còn Beneficiary Love Gift.
  - Phí AXS thật = 1.2% + $0.20 (thẻ trong nước), 2.8% + $0.10 (thẻ quốc tế), 0.4% (PayNow).
  - Ngày PSP trả: Stripe vào ngày làm việc đầu tiên của tháng sau; 2c2p T+3 ngày làm việc. AXS chưa có báo cáo (D8), nên vẫn là số mẫu T+2 ngày làm việc.
  - Total Disbursed = net to merchant cho cả 3 mô hình (Elaine B103). Trước đây Connect bị để bằng 0.
- `assets/financial-report.js`: bảng Invoices của charity AXS bỏ cột Beneficiary love gift, vì cột này giờ luôn bằng 0.
- `finance.html`: thêm ô "Donor love gift to claw back (AXS)" (Intro D8, E89), và thêm dòng này vào CSV.

**Làm mục 2, file mới `finance-payouts.html`:**
- **Menu Finance có 2 mục:** "Transaction Report" (trang 3.0, đổi tên từ "Financial Report") và "Summary Payout Report" (mới).
- **Bộ lọc** (C43–C44): PSP; Payout period chọn 1 kỳ, mặc định là kỳ mới nhất. Cả 2 đều là ô tự vẽ. Có "Reset filters".
- **Tóm tắt** (C45–C51), 7 dòng:
  - Payout Period
  - Total Trx Amt
  - Total PSP trx Fees
  - Other PSP charges (liệt kê từng khoản)
  - Total Payout to Agathos
  - Total Payout to Merchant
  - Agathos to Merchant payout date: chỉ hiện khi có mô hình Master (D51), theo luật ngày 20 của tháng sau.
- **Bảng gom theo project** (A41, C52–C59): Project/Event, Total Trx Amt, Total PSP trx Fees, Total Net to Agathos, Total Net to Merchant ("How much to disburse to each PO/EO"), và dòng tổng.
  - 3 cột ngân hàng (C53–C55) chưa đưa vào, vì sheet ghi "To be included in the future as part of onboarding".
- Có nút Export .csv.
- **CSS dùng chung** của 2 trang chuyển ra file `assets/finance-admin.css`.

**Kiểm tra nghiệm thu:**
- Đủ 7 dòng tóm tắt và 5 cột.
- Tổng mỗi project khớp với tổng các giao dịch của nó bên Transaction Report.
- Total Payout to Merchant = tổng cột Total Net to Merchant.
- Ngày Agathos trả chỉ hiện khi có mô hình Master.
- Bộ lọc PSP và kỳ đúng; CSV đúng; menu sáng đúng mục ở cả 2 trang.

**Nhật ký mục 12 (06/11/2026). Chưa commit.**
- **File mới:**
  - `finance-payouts.html`: Summary Payout Report.
  - `assets/finance-admin.css`: CSS dùng chung của 2 trang Finance, chuyển nguyên từ `finance.html`.
- **`assets/shell.js`:** menu Finance có 2 mục, Transaction Report và Summary Payout Report. Nhóm Finance mở sẵn ở cả 2 trang.
- **`finance.html`:** đổi tên thành "Transaction Report" (title, tiêu đề, tên file CSV).
- **Số mẫu của Summary Payout Report**, kỳ mặc định Nov 2026 (doanh thu tháng 10, file PSP đến 25/10): 41 giao dịch, Total Payout to Merchant S$6,538.15, Agathos to Merchant payout date 20 Nov 2026.
- **Đã kiểm tra:**
  - Script trang mới: 17/17 qua. Gồm menu, kỳ mặc định, 7 dòng tóm tắt đúng thứ tự, 5 cột; mỗi dòng project bằng tổng các giao dịch của nó và khớp Net payout chủ project thấy; Total Payout to Merchant bằng tổng cột; ngày Agathos trả chỉ hiện khi có Master; lọc theo PSP và kỳ; CSV.
  - Transaction Report: 42/42 qua. Thêm các kiểm tra theo file copy: D5, D6, A13, D8 và B103/B104.
  - Trang chủ project: 52/52 qua.
- **Còn chờ team trả lời:**
  - E13: còn cần cột "Computed PSP Payout to Agathos" không?
  - C90: Total to Agathos có cộng Platform Fee không? Hiện đang cộng.
  - Định nghĩa Tally check.
  - Ngày AXS trả tiền: AXS chưa có báo cáo.
