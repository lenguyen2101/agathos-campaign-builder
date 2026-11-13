# /financial-report version 4 và 2 trang Finance của Admin: feedback ver3 (12/11/2026)

Nguồn: 7 ảnh anh gửi ngày 12/11/2026 (comment hồng của team trên canvas), gồm:
- trang owner: Manage Project / Manage Event, Manage Pages › Payouts;
- trang admin: Transaction Report, Summary Payout Report.

Plan bắt đầu từ commit `0e2c422`. Phần desktop đã làm xong và đã push lên main trong commit `b94982b` (12/11/2026). Team đang review v4 trên Vercel. Còn lại: O1 mobile (để sau) và các câu hỏi ở mục 5.

## 1. Feedback (nguyên văn) và cách làm

### Owner: Manage Project / Manage Event, tab Transactions / Orders

| # | Feedback | Cách làm |
|---|---|---|
| O1 | *Start working on mobile design. Can include disclaimer to user that it is more optimal on desktop if we cannot scale it nicely* | Làm bản mobile (390px) cho mọi phần của trang owner, xem mục 4. Disclaimer chỉ thêm ở chỗ nào thật sự không thu nhỏ được. |
| O2 | *Change 'Total paid out' to 'Assigned to payout'* + tooltip *'Total net amount of transactions that have been sorted into a payout month. Includes both completed disbursements and scheduled upcoming payouts.'* · *Change 'Total awaiting pay out' to 'Unassigned transactions'* + tooltip *'Total net amount of transactions that have not yet been assigned to a payout month. These are typically more recent transactions.'* · *Apply to both projects and events* | Đổi 2 nhãn, thêm icon ⓘ có tooltip (hiện khi hover hoặc khi focus bằng bàn phím). **Giá trị cũng đổi theo định nghĩa mới**, xem D1. Thanh xanh/vàng giữ nguyên, chỉ đổi số. |
| O3 | *…remove the statistics module when no payout period is selected (ie. it will only fetch and display when a payout period is selected)* | Statistics chỉ hiện khi đã chọn một payout period. Chọn "-" hoặc "Processing" thì không hiện. |
| O4 | *Remove all indication of 'upcoming' or 'paid out'. Remove payout bank account info and date* | Bỏ tag Upcoming/Paid và dòng "Agathos pays DBS ••••4821 on 20 Nov 2026" dưới "Net to you". |
| O5 | *Bring this to above 'Net to you' section. Modify design to make it seem more as a 'title' for the info below* · *'View full payout summary' should come across only as a secondary action…* · *Action should still be present when no payout period is selected, but again as a secondary 'FYI' action* · *Include this copy somewhere: 'Payouts are disbursed on the 20th of each month for the previous month's transactions. Funds might take a few days to reach your bank account depending on where you are located.'* | Xem phần mô tả ngay dưới bảng. |

Cách làm O5:
- **Khi đã chọn tháng:** khối payout summary chuyển lên giữa "Filter & export" và khung "Net to you", làm thành tiêu đề.
  - Dòng tiêu đề: "Nov 2026 Payout".
  - Dòng phụ: "This is part of a larger payout with…".
  - "View full payout summary →" là link nhỏ ở góc phải dòng tiêu đề, không còn là cả một thẻ bấm được.
  - Câu về ngày 20 là một dòng chữ nhỏ có icon ⓘ, đặt dưới tiêu đề.
- **Khi không chọn tháng:** chỉ còn một dòng mảnh gồm câu về ngày 20 và link "View full payout summary". Link mở tab Payouts của tổ chức, không lọc tháng.
- **Project AXS (IPC):** không có khối này, giống hiện tại.

### Owner: Manage Pages (tổ chức / Personal)

| # | Feedback | Cách làm |
|---|---|---|
| P1 | *Remove all indication of 'upcoming' or 'paid'. Remove payout bank account info and date* (tab Payouts, chọn Oct 2026) | Bỏ tag "Paid" và dòng "Agathos paid DBS ••••4821 on 20 Oct 2026". |
| P2 | *Inner section (for all tabs eg. projects, events, payouts) should be fully expanded and scroll along with the whole page rather than scroll independently within the container.* | Bỏ chiều cao cố định 780px và thanh cuộn riêng của khung. Cả 3 tab dài theo nội dung và cuộn cùng trang. |
| P3 | *Change copy to: 'Payouts are disbursed on the 20th of each month for the previous month's transactions. Funds might take a few days to reach your bank account depending on where you are located.'* | Thay 2 câu trong khung "Next payout". Dòng tiêu đề "Next payout: 20 Nov 2026" giữ nguyên, vì comment chỉ trỏ vào phần chữ. |
| P4 | *Remove this line of additional info* (dòng "205 transactions, 52 orders · 6 processing (S$750.00)") | Bỏ dòng này ở chế độ không chọn tháng, xem mục 4. |
| P5 | *Remove this row entirely* (dòng "Not paid yet / Agathos pays on 20 Nov 2026") | Bỏ hẳn dòng này. |
| P6 | *Change to 'Download payout summary'. Perhaps can change column title to this, then each row will just be a download icon* | Cột "Action" đổi tên thành "Download payout summary". Mỗi dòng chỉ còn một icon tải, có aria-label "Download Nov 2026 payout summary". |

### Admin: Transaction Report

| # | Feedback | Cách làm |
|---|---|---|
| T1 | *Use search and dropdown UI similar to current admin console. Allow admin to scroll through the list. PSP will 'lock' onto the right option when a certain event or project is selected* | Ô Project/Event thành ô chọn có tìm kiếm, cùng kiểu `.ctl` của admin console. Danh sách cuộn được, nhóm theo tổ chức. Chọn một project/event thì PSP tự nhảy về PSP của nó, các lựa chọn PSP khác bị khoá. Xoá project thì PSP mở lại. |
| T2 | *Change UI to get admin to select filters first before any data is shown below. Defaults (follow this order too): Payout period: Latest payout · PSP: All · Project/Event: Indicate as optional* | Khung lọc theo kiểu "searchpanel" của admin console. Thứ tự: Payout period (mặc định Latest payout) → PSP (All) → Project/Event (ghi "Optional"). Chân khung có nút Reset và **Show report**. Chưa bấm thì bên dưới chưa có số, xem D3. |
| T3 | *…rearrange it so the amounts cascade more clearly…* Thứ tự và cỡ: **Total Transactions Amount** (lớn) · Total PSP transactions fees (nhỏ) · Other PSP charges (nhỏ) · Total PSP payout to Agathos (vừa) · Total disbursed to projects/events (vừa) · **Final amount to Agathos** (lớn) · thu gọn dưới Final: *Total finalized donor love gift (with the 'Total donor love gift' in brackets) · Total beneficiary love gift · Total Agathos platform fee* | Thay khung hero và 3 ô tile bằng một khung dạng bậc thang, đúng thứ tự và cỡ chữ trên. Xem D1, D2. |
| T4 | *Can remove this line* (dòng "Payout Period: All payout periods · All PSPs · …") | Bỏ dòng này. |
| T5 | *Change copy to 'Total paid out directly to Projects/Events by Stripe (Connect)'* | Đổi tên ô này. Ô này nằm thành dòng phụ dưới "Total disbursed to projects/events", vì nó là một phần của số đó. Đổi luôn tên trong CSV. |
| T6 | *Can remove the bar* | Bỏ thanh "Where the Total Trx Amt went". |
| T7 | *Show UI for when transaction doesn't tally* | **Chưa làm.** Tally check đã bỏ hẳn khỏi trang (anh review lần 2, mục 9). Chờ team định nghĩa Tally check (câu hỏi 3 ở mục 5) rồi mới làm UI cho comment này. |
| T8 | *Can remove* (ô "Donor love gift to claw back (AXS)") | Bỏ ô này. Phần love gift giờ nằm trong mục thu gọn dưới Final. |
| T9 | *Collapse into a separate 'Statistics' section with a separate filter. Only expand and fetch when clicked. Include other statistics: Average Donor Love Gift (in %)* | Thêm mục "Statistics", mặc định đóng. Bấm mở thì mới tính số. Mục này có bộ lọc riêng: khoảng payout period và PSP. Bên trong có biểu đồ "By payout period" và số "Average Donor Love Gift" theo %. Bỏ chức năng bấm cột để lọc trang, vì mục đã có lọc riêng. |
| T10 | *Can remove* (biểu đồ By PSP) | Bỏ. |
| T11 | *Can remove for now, but might be useful for future improvement* (Top projects and events) | Bỏ khỏi trang. Ghi lại trong plan để làm sau. |

### Admin: Summary Payout Report

| # | Feedback | Cách làm |
|---|---|---|
| S1 | Subtitle: *'This payout report is to summarise the amount of funds to be disbursed to various PO/EOs per month. As such, only arrangements through the Master model are reflected. Amounts through the Stripe Connect model are not reflected here.'* | Đặt câu này dưới tiêu đề trang. **Báo cáo chỉ còn giao dịch model Master**, xem D4. |
| S2 | *Change UI to get admin to select filters first… Defaults (follow this order too): Payout period: Latest payout · PSP: All* | Khung lọc giống T2: Payout period → PSP, nút Reset và Show report. |
| S3 | *Remove AXS for now* | PSP còn: All / Stripe / 2c2p. |
| S4 | *Remove this line* ("PSP to Agathos / PSP to merchant payout") | Bỏ. |
| S5 | *Remove this line* ("2.3% of Total Trx Amt") | Bỏ. |
| S6 | *Make this part collapsable* (3 dòng của Other PSP charges) | 3 dòng này mặc định đóng, bấm "Other PSP charges ▸" để mở. Làm giống hệt bên Transaction Report. |
| S7 | *Change to: 'Agathos to PO/EO disbursement date'* · *Remove this line* ("Applicable for master merchant model only") | Đổi tên, bỏ dòng phụ. |
| S8 | *Change to 'Final amount to Agathos'* (đang là "Total Payout to Agathos") | Đổi tên. **Giá trị cũng đổi**, xem D4. |
| S9 | *Change to: 'Total disbursed to Projects/Events'* (đang là "Total Payout to Merchant") | Đổi tên, giữ nền xanh nổi bật như hiện tại. |
| S10 | *If export is affected by filter, we should shift it into the filter section* | Export đang lọc theo bộ lọc, nên chuyển nút vào khung lọc. Làm luôn ở Transaction Report, vì cùng điều kiện. |
| S11 | Thứ tự và cỡ: **Total Transactions Amount** (lớn) · Total PSP transactions fees (nhỏ) · Other PSP charges (nhỏ) · Final amount to Agathos (vừa) · **Total payout to Merchant** (lớn, *should remain highlighted*) | Khung bậc thang giống T3. "Payout Period" và "Agathos to PO/EO disbursement date" thành dòng đầu khung, vì không phải số tiền. |

## 2. Số thật (script node chạy trên `finance-data.js`, 12/11/2026)

**O2, project Special Needs Centre in Erbil, chọn "-":**

| | Hiện tại | Sau khi đổi |
|---|---|---|
| Total paid out → Assigned to payout | S$28,236.50 | S$30,077.51 |
| Total awaiting pay out → Unassigned transactions | S$2,067.76 | S$226.75 |
| Tổng (Total Net to you) | S$30,304.26 | S$30,304.26 |

**T3, Transaction Report, Latest payout (Nov 2026), All PSP, 41 giao dịch:**

| Dòng | Số |
|---|---|
| Total Transactions Amount | S$7,244.10 |
| Total PSP transactions fees | S$164.01 |
| Other PSP charges | S$11.88 |
| Total PSP payout to Agathos | S$2,637.64 |
| Total disbursed to projects/events | S$6,538.15 (trong đó Stripe Connect trả thẳng: S$3,850.32) |
| Final amount to Agathos | S$530.06 |

- Phép trừ khớp đến từng cent: 7,244.10 − 164.01 − 11.88 − 6,538.15 = 530.06.
- Với tất cả các tháng cũng khớp: 89,461.50 − 1,744.58 − 136.62 − 80,859.87 = 6,720.43.

**S11, Summary Payout Report, Nov 2026, All PSP, chỉ model Master, 21 giao dịch:**

| Dòng | Hiện tại (mọi model) | Sau khi đổi (chỉ Master) |
|---|---|---|
| Total Transactions Amount | S$7,244.10 | S$2,296.00 |
| Total PSP transactions fees | S$164.01 | S$63.82 |
| Other PSP charges | S$11.88 | S$0.00 |
| Final amount to Agathos | S$2,637.64 (đang là "Total Payout to Agathos") | S$113.50 |
| Total disbursed to Projects/Events | S$6,538.15 | S$2,118.68 |

- Phép trừ khớp: 2,296.00 − 63.82 − 0.00 − 113.50 = 2,118.68.
- Còn 2 project/event: Benefit concert for the unseen (2c2p Master, 15 giao dịch) và Care packages for migrant workers (Stripe Master, 6 giao dịch).

## 3. Quyết định cần anh duyệt

- **D1. Số đi theo định nghĩa mới, không chỉ đổi chữ.**
  - **O2 (owner):**
    - "Assigned to payout" = giao dịch đã vào một payout tháng (đã trả cộng với sắp trả).
    - "Unassigned transactions" = giao dịch chưa vào payout nào, tức là "Processing" hiện nay.
    - Tooltip team viết đúng như vậy.
  - **T3, khung bậc thang (admin):**
    - Phép trừ chỉ khớp theo chuỗi: Total Transactions Amount − PSP fees − Other charges − Total disbursed = Final.
    - "Total PSP payout to Agathos" đứng giữa chuỗi nhưng không nằm trong phép trừ đó. Nếu đặt dấu − cho nó, người đọc sẽ hiểu sai: 2,637.64 − 6,538.15 ≠ 530.06.
  - **Mặc định em chọn:** giữ đúng thứ tự và cỡ chữ của team.
    - Đặt dấu "−" trước 3 dòng nằm trong phép trừ (PSP fees, Other charges, Total disbursed) và dấu "=" trước Final.
    - "Total PSP payout to Agathos" là dòng thông tin màu xám, không có dấu, có dòng phụ "What the PSPs paid Agathos".
  - **Cách khác:** đúng thứ tự, không đặt dấu nào. Gọn hơn, nhưng người đọc không thấy được các số liên quan với nhau thế nào, mà đó là điều team đang muốn.
- **D2. Phần thu gọn dưới Final (T3) phải cộng ra đúng Final.**
  - 3 dòng team liệt kê, kỳ Nov 2026:
    - Finalized donor love gift S$229.68 (donor love gift S$234.10);
    - Beneficiary love gift S$240.50;
    - Agathos platform fee S$48.60.
  - Tổng 3 dòng là S$518.78, còn Final là S$530.06.
  - Phần còn thiếu gồm:
    - "Agathos Margin from PSP fees" S$23.16 (tên cột này đã có trong bảng giao dịch);
    - trừ đi Other PSP charges S$11.88.
  - **Mặc định em chọn:** hiện 3 dòng của team, thêm 2 dòng trên để tổng khớp. Mỗi dòng thêm có ghi chú nhỏ.
  - **Cách khác:** chỉ hiện 3 dòng, tổng sẽ không bằng Final.
- **D3. "Chọn bộ lọc trước rồi mới có số" (T2, S2):**
  - Khung lọc có nút **Show report**. Mở trang ra thì bộ lọc đã điền sẵn giá trị mặc định, phần dưới chỉ có một dòng "Pick the filters, then Show report".
  - Đã hiện báo cáo mà đổi bộ lọc thì số cũ vẫn giữ nhưng mờ đi, có dòng "Filters changed. Show report to update". Bấm lại thì mới tính. Cách này giống việc gọi API thật.
  - Nút Export .csv nằm trong khung lọc ở cả 2 trang (S10), và chỉ bấm được khi số đang hiện khớp với bộ lọc.
- **D4. Summary Payout Report chỉ còn model Master (S1).**
  - Câu subtitle team viết nói rõ điều này, nên số đổi nhiều (xem mục 2): Total disbursed giảm từ S$6,538.15 xuống S$2,118.68.
  - "Final amount to Agathos" (S8) lấy phần Agathos giữ lại của các giao dịch Master, là S$113.50. Không lấy số "PSP trả Agathos" cũ (S$2,637.64), vì số đó còn gồm tiền phải trả lại cho PO/EO.
  - Other PSP charges thành S$0.00: trong dữ liệu mẫu, khoản này chỉ có ở Stripe Connect. Em vẫn giữ dòng này theo layout của team và đưa vào câu hỏi cho team.

## 4. Mặc định cho các chỗ nhỏ (anh đổi được)

| Chỗ | Mặc định em chọn | Lý do |
|---|---|---|
| Chữ "Processing" ở các chỗ khác (lựa chọn trong dropdown Payout period, cột Payout status, CSV) | Đổi thành "Unassigned" | Đây đúng là nhóm "Unassigned transactions" của O2. Giữ "Processing" thì một nhóm giao dịch sẽ có 2 tên. |
| Dòng "Paid out / Balance" dưới bảng Payout History | Bỏ | Cả dòng là chia đã trả / chưa trả, mà P1 và P5 bảo bỏ mọi dấu hiệu "paid". Tổng Net payout đã có trong khung trên. |
| Payout chưa tới ngày trả (Nov 2026) trong cột Download (P6) | Giữ dấu "—" | Tháng 10 chưa hết, bản tóm tắt chưa đủ số. |
| Dòng đếm giao dịch (P4) | Chỉ bỏ ở chế độ không chọn tháng, đúng chỗ comment trỏ. Khi chọn tháng vẫn giữ "20 transactions, 20 orders" | Comment ở ảnh chọn Oct 2026 không nhắc dòng này. Nếu anh muốn bỏ ở cả 2 chế độ thì em bỏ. |
| Mobile (O1) | Chỉ làm trang owner ở 390px:<br>• bảng thành thẻ (đã có một phần);<br>• bộ lọc xếp dọc;<br>• khối payout summary và khung Net to you xếp một cột;<br>• tooltip mở bằng chạm. | Trang admin là console nội bộ, dùng trên máy tính. |
| Disclaimer mobile | Chỉ hiện khi đang ở chế độ "View full screen" trên điện thoại: "This table is easier to read on a computer." | Ngoài chế độ đó, bảng đã thành thẻ nên đọc được. |
| Demo cho trạng thái "doesn't tally" (T7) | Đã bỏ cùng Tally check (anh review lần 2). | Trước đó: mở `finance.html?demo=tally-off` để làm lệch 3 giao dịch mẫu. |
| Average Donor Love Gift (T9) | Tổng donor love gift ÷ tổng Receiving Amount của các khoản donate, không tính vé event, trong khoảng thời gian đang lọc của Statistics. Ghi kèm "on S$… donated". | Event không có donor love gift. |
| Bộ lọc riêng của Statistics (T9) | Khoảng thời gian: Last 6 payouts (mặc định), Last 12 payouts, All. PSP: All / Stripe / 2c2p / AXS. | Biểu đồ cần nhiều tháng, trong khi bộ lọc chính chỉ có Latest payout. |
| Các ô khác của Summary Payout | "41 transactions" dưới Total Transactions Amount và dòng "How much to disburse to each PO/EO: see the table below" giữ nguyên. Tên cột bảng By project giữ nguyên. | Team không comment. |
| Phiên bản | Pill "Version 4", title "version 4". Bản 3 nằm trong git, commit `9200c4c`. | Giống lần trước. |

## 5. Câu hỏi cho team (không đưa vào trang)

1. Model Master (Stripe Master, 2c2p) có "Other PSP charges" không? Trong dữ liệu mẫu chỉ Stripe Connect có khoản này, nên Summary Payout Report luôn hiện S$0.00.
2. Câu ở D1: "Total PSP payout to Agathos" có cần đứng giữa chuỗi không, hay chuyển xuống dưới Final để chuỗi trừ liền mạch?
3. Còn 5 câu hỏi cũ ở mục 12 của plan v3:
   - E13: cột "Computed PSP Payout to Agathos" có còn cần không;
   - C90: Total to Agathos có tính Platform Fee không (hiện đang tính);
   - Tally check được định nghĩa thế nào (T7 và cột Tally check chờ câu này);
   - AXS trả tiền vào ngày nào;
   - Tax Deduction Report có lọc theo bộ lọc không.

## 6. Phạm vi theo file

| File | Việc |
|---|---|
| `assets/financial-report.js` | O2–O5, P1, P3–P6, đổi Processing → Unassigned, CSV, pill version |
| `assets/financial-report.css` | Tooltip ⓘ, khối payout summary dạng tiêu đề, P2 (bỏ cuộn riêng). Mobile O1 để sau. |
| `financial-report.html` | Title "version 4" |
| `finance.html` | T1–T6, T8–T11, S10 (export vào khung lọc). Bỏ cột Tally check. |
| `finance-payouts.html` | S1–S11 |
| `assets/finance-admin.css` | Khung lọc kiểu searchpanel, ô chọn có tìm kiếm, khung bậc thang, mục Statistics đóng/mở |
| `docs/financial-report-v4-plan.md` | Plan này và nhật ký |

`assets/finance-data.js`: chỉ bỏ trường `tally` (anh review lần 2). Dữ liệu đã có sẵn các nhóm paid, await, proc và model.

## 7. Thứ tự làm và nghiệm thu

1. **Owner, Manage Project / Event:** làm O2–O5 và đổi Processing → Unassigned.
2. **Owner, Manage Pages:** làm P1–P6.
3. **Admin, Summary Payout Report:** làm S1–S11 trước, vì trang nhỏ hơn. Khung lọc và khung bậc thang làm ở đây rồi dùng lại cho Transaction Report.
4. **Admin, Transaction Report:** làm T1–T11.
5. **Mobile owner (O1).**
6. **Kiểm tra và ghi nhật ký.** Các script kiểm tra cũ trong scratchpad đã bị xoá, nên em viết lại 3 script node:
   - owner: mỗi mục O và P có ít nhất một kiểm tra;
   - Transaction Report: mỗi mục T;
   - Summary Payout: mỗi mục S, cộng 2 phép trừ ở mục 2 phải khớp từng cent.
   - Chạy thêm `node --check` và curl kiểm tra mọi trang trả về 200.
   - Không chạy Chromium headless. Giao diện và mobile nhờ anh xem trên trình duyệt và điện thoại.

## 8. Ước lượng thời gian

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này (đọc 7 ảnh, code, chạy số) | 0.3 | 0.3 |
| 2. Owner Manage Project / Event: O2–O5, đổi Processing, CSV | 0.6 | 0.9 |
| 3. Owner Manage Pages: P1–P6 | 0.4 | 1.3 |
| 4. Summary Payout Report: S1–S11, khung lọc, khung bậc thang | 0.6 | 1.9 |
| 5. Transaction Report: T1–T11, ô chọn có tìm kiếm, khung bậc thang, tally, Statistics | 1.2 | 3.1 |
| 6. Mobile owner (O1) | 1.0 | 4.1 |
| 7. Viết lại 3 script kiểm tra, chạy, ghi nhật ký | 0.5 | 4.6 |

Đã làm bước 1–5 và 7. Bước 6 (O1 mobile) để sau.

## 9. Nhật ký

**12/11/2026:**
- Đã đọc 7 ảnh, plan v3, và code của 4 trang.
- Đã chạy script để lấy số ở mục 2.
- Chưa code. Đang chờ anh duyệt D1–D4 và các mặc định ở mục 4.

**12/11/2026, anh duyệt:** "START PLAN nhé em, ko cần làm responsive mobile vội, desktop ưu tiên trước".
- Làm hết plan, trừ O1 (mobile) và dòng disclaimer mobile ở mục 4. Hai việc này để sau.
- Không có lệnh commit.

**12/11/2026: đã làm xong mọi mục desktop.**

Sửa 7 file:
- `assets/financial-report.js`, `assets/financial-report.css`, `financial-report.html`;
- `finance.html`, `finance-payouts.html` (viết lại phần script);
- `assets/finance-admin.css` (viết lại);
- plan này.

`assets/finance-data.js` không đổi.

**Owner, Manage Project / Event:**
- O2: nhãn đổi theo định nghĩa mới, giá trị cũng đổi. Assigned to payout = đã trả + sắp trả; Unassigned = giao dịch chưa vào file PSP. Có icon ⓘ, hover hoặc focus thì hiện tooltip đúng chữ team viết.
- O3: chỉ khi chọn một tháng thì mới có Statistics.
- O4: bỏ tag Paid/Upcoming và dòng tài khoản ngân hàng.
- O5: khi chọn tháng, payout summary thành tiêu đề phía trên "Net to you", "View full payout summary" là link nhỏ bên phải. Khi không chọn tháng, chỉ còn một dòng FYI kèm link. Câu về ngày 20 có ở cả 2 trường hợp.
- Chữ "Processing" đổi thành "Unassigned" ở dropdown, cột Payout status và CSV.

**Owner, Manage Pages:**
- P1: bỏ tag Paid và dòng ngân hàng.
- P2: bỏ chiều cao cố định và thanh cuộn riêng. Khung giữ tối thiểu 780px.
- P3: đổi copy, giữ tiêu đề có ngày.
- P4: bỏ dòng đếm khi không chọn tháng.
- P5: bỏ dòng "Not paid yet". Bỏ luôn dòng "Paid out / Balance".
- P6: cột "Download payout summary", mỗi dòng là một icon tải. Payout chưa tới ngày trả vẫn hiện "—".

**Summary Payout Report:**
- S1–S11 làm đủ. Chỉ còn giao dịch model Master, PSP gồm All / Stripe / 2c2p.
- Mở trang chỉ thấy khung lọc, phải bấm Show report mới có số. Đổi bộ lọc thì số mờ đi và nút Export bị khoá.
- Kỳ Nov 2026: 2,296.00 − 63.82 − 0.00 − 113.50 = 2,118.68.

**Transaction Report:**
- T1: ô chọn Project/Event có tìm kiếm, danh sách nhóm theo tổ chức và cuộn được. Chọn một project thì PSP khoá theo project đó, xoá project thì mở lại. Gõ chữ không vẽ lại ô nhập, nên con trỏ và dấu tiếng Việt vẫn giữ nguyên.
- T2: Show report giống trang trên.
- T3: các khoản xếp bậc thang theo D1. Kỳ Nov 2026: 7,244.10 − 164.01 − 11.88 − 6,538.15 = 530.06.
- D2: 5 dòng thu gọn dưới Final cộng lại đúng 530.06.
- T4–T6, T8, T10, T11: đã bỏ.
- T7: trạng thái lỗi xem ở `finance.html?demo=tally-off`. Có 3 giao dịch lệch, tổng chênh S$0.93. Nút "Show only these" lọc bảng còn 3 dòng, tô đỏ nhạt. Sau đó đã bỏ, xem 2 lần review bên dưới.
- T9: mục Statistics mặc định đóng, mở ra mới tính số. Có bộ lọc riêng (6 / 12 / All payouts, PSP), số Average Donor Love Gift theo %, và biểu đồ "By payout period" kèm bảng. Bấm vào cột không còn lọc trang.

**Đã kiểm tra:**
- Viết lại 3 script node chạy trang trên DOM giả:
  - owner: 32/32;
  - Summary Payout: 24/24;
  - Transaction Report: 34/34.
- Các lỗi gặp khi chạy đều nằm ở script kiểm tra, không phải ở trang: so sánh chuỗi bị mã hoá sai, regex bắt nhầm `min-height`, đọc nhầm phần tử, chuỗi `>PSP` khớp nhầm dòng "PSP files uploaded".
- `node --check` cho các file js và 2 đoạn script nhúng trong HTML: không lỗi.
- curl: 3 trang, trang demo và 4 file asset đều trả về 200.
- Grep: không còn chỗ nào dùng các class CSS đã bỏ.
- Chưa xem giao diện thật, vì không chạy Chromium headless. Nhờ anh xem trên trình duyệt.
- Chưa làm: O1 mobile, theo lời anh dặn.

**12/11/2026, anh review lần 1:**
- **Bỏ ô "Tally check" ở Transaction Report.**
  - Anh hỏi Tally check có trong requirement không, nếu không thì bỏ.
  - Em đọc file copy (có định dạng): "Tally check" chỉ là cột cuối của bảng giao dịch, ô C95 trong "Detail Columns" mục 3.0. Chữ không bị gạch ngang, và cột Remarks bên cạnh để trống, tức là workbook không định nghĩa cột này.
  - Summary Section (C69–C76) không có Tally check. Ô tóm tắt ở đầu trang là em tự thêm từ v3 (lúc làm dashboard), không có trong requirement.
  - Đã làm: bỏ ô đó, nút "Show only these" và chip lọc. Giữ cột C95 trong bảng: dòng lệch vẫn hiện số tiền màu đỏ và tô đỏ nhạt cả dòng. Link `?demo=tally-off` vẫn dùng được để xem cột đánh dấu dòng lệch.
  - Comment T7 của team ("Show UI for when transaction doesn't tally") gắn vào ô này, nên giờ trạng thái lệch chỉ còn hiện trong cột.
- **Lỗi của em: một đường kẻ cắt ngang giữa "Total disbursed to projects/events" và dòng phụ "…by Stripe (Connect)".**
  - Nguyên nhân: dòng chính có đường kẻ dưới, còn dòng phụ bị kéo lên bằng margin âm.
  - Hai mục thu gọn (Other PSP charges, Final) khi mở ra cũng bị y như vậy.
  - Sửa ở cả 2 trang admin:
    - dòng nào có dòng phụ hoặc danh sách con ngay dưới thì không kẻ đường giữa, chỉ kẻ một đường dưới cả cụm;
    - bỏ margin âm;
    - dòng Final của Transaction Report không còn đường kẻ sát đáy thẻ.
- Đã kiểm tra:
  - Transaction Report 35/35. Script đã sửa theo thay đổi: bỏ phần kiểm tra ô Tally, thêm kiểm tra cột vẫn còn và CSS không còn margin âm.
  - Summary Payout 24/24.
  - Owner 32/32.

**12/11/2026, anh review lần 2: bỏ hẳn Tally check.**
- Anh dặn: "thôi thì remove hẳn ra giúp anh đi, nếu họ cần và họ giải thích được thì mình thêm UI đó vào nhé".
- Đã bỏ:
  - cột C95 trong bảng giao dịch (bảng còn 18 cột) và trong CSV;
  - link `?demo=tally-off`;
  - trường `tally` trong `adminRow` (`assets/finance-data.js`);
  - CSS của các dòng OK/lệch, và 2 token màu `--good`, `--critical` không còn chỗ nào dùng.
- Cách code cũ tính: với mỗi giao dịch, tiền người cho trả (Receiving Amount + Donor Love Gift) − phí PSP − phí PSP trên love gift − Net to Merchant − Total to Agathos phải bằng 0.
  - Trong dữ liệu mẫu, các số này đều tính ra từ cùng một bộ công thức, nên kết quả luôn bằng 0 và không bao giờ báo lệch.
  - Muốn kiểm tra có ý nghĩa thì phải so với số thật trong file PSP. Đó là phần team cần định nghĩa.
- **Thêm lại khi:** team giải thích Tally check so cái gì với cái gì (câu hỏi 3 ở mục 5). Comment T7 cũng chờ cùng lúc đó.
- Đã kiểm tra:
  - Transaction Report 35/35: không còn cột, CSV không còn chữ Tally, link demo không còn tác dụng.
  - Summary Payout 24/24, owner 32/32.
  - `node --check` không lỗi, trang trả về 200.

**12/11/2026: commit và push.**
- Anh ra lệnh "Commit và push". Commit `b94982b` "Financial report v4: team feedback on v3" gồm 8 file, đã push lên main, Vercel tự deploy.
- Team đang review v4 trên Vercel.
- Còn lại:
  - O1 mobile và disclaimer mobile: để sau, theo lời anh dặn.
  - T7 và cột Tally check: chờ team định nghĩa Tally check (câu hỏi 3 ở mục 5).
  - Câu hỏi 1, 2 và 5 câu cũ ở mục 5: chờ team trả lời.
