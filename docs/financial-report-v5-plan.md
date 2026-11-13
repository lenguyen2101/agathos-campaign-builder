# /financial-report version 5: giao dịch cũ chưa có dữ liệu đối soát (13/11/2026)

Nguồn: 6 ảnh chụp đoạn chat của team (Elaine, Yen Jui Hung, Josias), anh gửi ngày 13/11/2026, sau buổi review v3.
- Anh xác nhận: các UI mới (v4) đã ổn với backend.
- Việc còn thiếu: cách hiển thị giao dịch cũ của các project/event đang chạy.
- Anh dặn: chỉ đọc và viết plan, chưa code.

Plan bắt đầu từ commit `b94982b` (v4). v5 đã push lên main trong commit `5093476` (13/11/2026). Còn chờ team: câu hỏi 1 và 3 trong hộp "Questions for the team".

## 1. Vấn đề và kết luận của team

**Vấn đề:** dữ liệu đối soát (payout, phí PSP thật) chỉ có từ khi admin bắt đầu upload file của PSP. Giao dịch trước đó không có các số này, nên bảng mới thiếu cột, và phần tóm tắt không tính được.

**Hai phương án ban đầu (Elaine):**
- *Option 1:* upload lại các file đối soát cũ cho project/event đang chạy, để mọi giao dịch đều có số thật. Nhược điểm: admin tốn công upload.
- *Option 2:* phần tóm tắt chỉ tính giao dịch có dữ liệu đối soát. Bảng chi tiết vẫn có mọi giao dịch, nhưng một số cột mới để trống.

**Kết luận đang theo (ý của Yen Jui Hung, Elaine đồng ý, Josias giao việc cho anh):**
- *"If we split the display of the transactions into 2 sections. 1st section, list of transactions without the recon data. It is in the old format. 2nd section, list of transactions with recon data and summary. It is in the new format."*
- *"So projects without recon data, will show only 1st section. Projects with full recon data, will show only 2nd section. Projects with a mix… will show both sections."*
- *"I am thinking all in one tab."* Không tách thành 2 tab.
- Mốc chia (Elaine): *"we can make the first transaction with payout data as cut off date for that project. Any trx after this date without reconciliation is consider as the pending payout instead of 'old data without payout'."*
- Lý do chọn: admin không phải upload lại file cũ (Josias hỏi, Yen Jui Hung trả lời "Yes").
- Còn mở: Elaine nhắc phần tóm tắt *"to not include the old data (or old data categories as 'previous disbursed' in the summary as suggested by Rachel)"*. Team chưa chọn.

**Việc Josias giao:** *"Could you do a quick mock up for this?… include another section that shows the old data (in the old format) for current ongoing projects. It should communicate to the PO why there are 2 different sections and 2 different view/formats of data."*

## 2. "Old format" là gì

Đây là danh sách giao dịch đang chạy trên production. Em lấy từ 2 ảnh production anh gửi ngày 29/10, ở vòng v2:
- **Manage Project › Transaction:** mỗi giao dịch 2 dòng.
  - Dòng 1: avatar tròn (chữ cái đầu trên nền xám, hoặc ảnh), username màu xanh, @handle màu xám.
  - Dòng 2: số tiền (`S$2`), ngày giờ (`2026-10-03 10:04:02`), `Ref: AkdldPG6A`, phương thức (`Paynow`, `Credit`).
  - Có đường kẻ giữa các giao dịch.
  - Nút: Export as .csv, Add Offline Transaction, Tax Deduction Report ▾.
- **Manage Event › Attendees Information › Orders:** giống trên, nhưng:
  - Dòng 1 thêm link "View Details" bên phải.
  - Dòng 2: số vé (`1 ticket`), ngày giờ (`07/10/2026 - 09:14`), Ref, phương thức (`Debit`).
  - Nút Export Orders as .csv.

Old format **không có:** phí, net, trạng thái payout, phần tóm tắt.

## 3. Ba trường hợp trên một trang

Mốc chia của mỗi project/event là **ngày của giao dịch đầu tiên có dữ liệu payout**.

| Trường hợp | Ví dụ | Tab Transactions / Orders hiện gì |
|---|---|---|
| Chưa có dữ liệu đối soát (project/event đã xong trước khi có đối soát) | Event mẫu mới, xem D1 | Chỉ danh sách cũ, đúng như production. Không có bộ lọc, tóm tắt hay bảng mới. |
| Có cả hai (project/event đang chạy) | Special Needs Centre in Erbil | Phần mới ở trên, như v4: bộ lọc, payout summary, tóm tắt, bảng. Phần cũ ở dưới, gồm các giao dịch trước mốc. |
| Đủ dữ liệu đối soát (project/event mới) | Benefit concert for the unseen | Chỉ phần mới, giống v4 hiện tại. |

Giao dịch **sau** mốc mà chưa đối soát vẫn ở phần mới, với trạng thái "Unassigned" như v4. Cách này đúng ý Elaine ("pending payout"), nên không cần sửa gì thêm.

**Phác thảo trường hợp có cả hai (desktop):**

```
Transactions                         [Add Offline Transaction] [Tax Deduction Report ▾]
ⓘ Payout details start from 2 Jun 2026. Earlier transactions are listed separately below.
┌ Filter & export ─────────────────────────────────────────────────────┐
│ Year [All years]   Payout period [-]                  [Export as .csv]│
└──────────────────────────────────────────────────────────────────────┘
Payout summary · tóm tắt · Statistics        (chỉ tính giao dịch từ 2 Jun 2026)
Transactions 64                                          [View full screen]
(bảng mới v4, 9 cột, 10 dòng mỗi trang)

Transactions before 2 Jun 2026  89                           [Export as .csv]
These were made before payout details were available, so they show fewer
details and are not in the summary above.
(danh sách kiểu production: avatar · username · @handle / S$ · ngày giờ · Ref · phương thức)
(10 dòng mỗi trang)
```

## 4. Số liệu mẫu (đã chạy script, mốc mẫu 1 Jun 2026)

Admin bắt đầu upload file PSP cho giao dịch từ 1 Jun 2026 (giả định mẫu). Mốc của từng project là giao dịch đầu tiên từ ngày đó:

| Project/Event | Bắt đầu | Mốc | Giao dịch cũ | Giao dịch mới | Payout của phần mới |
|---|---|---|---|---|---|
| Special Needs Centre in Erbil | Nov 2025 | 2 Jun 2026 | 89 · S$19,140.00 | 64 · S$13,700.00 | Jul–Nov 2026 |
| Outreach @ displaced families | Mar 2026 | 3 Jun 2026 | 22 · S$7,260.00 | 32 · S$7,710.00 | Jul–Nov 2026 |
| Care packages for migrant workers | May 2026 | 7 Jun 2026 | 6 · S$1,550.00 | 32 · S$5,830.00 | Jul–Nov 2026 |
| Sunny Days for Seniors (IPC, AXS) | Jan 2026 | 1 Jun 2026 | 59 · S$14,940.00 | 44 · S$11,530.00 | Jun–Oct 2026 (tháng bán) |
| Benefit concert for the unseen | Aug 2026 | không có | 0 | 56 · S$5,515.00 | Sep–Nov 2026 |

Số tiền là Funding Amount / Ticket Sales Amount. Số mới đã gồm các giao dịch Unassigned.

Trên trang owner, kỳ Nov 2026 (giao dịch tháng 10) không đổi, vì cả kỳ đó nằm sau mốc. Các số "All" của Erbil sẽ giảm, vì chỉ còn tính 64 giao dịch thay vì 153.

## 5. Quyết định cần anh duyệt

- **D1. Dữ liệu mẫu cho 3 trường hợp.**
  - Đặt mốc mẫu 1 Jun 2026 như mục 4. Erbil, Outreach, Care và Sunny Days thành trường hợp có cả hai. Concert là trường hợp đủ dữ liệu.
  - Thêm 1 event mẫu đã xong của Antioch 21, chỉ có giao dịch cũ: "Charity gala dinner 2026", bán vé từ Feb đến Apr 2026, 2c2p. Event này cho thấy trường hợp chưa có đối soát, và cũng cho thấy old format của Orders.
  - Thanh review thêm tab "Completed event".
  - Event mới có số tiền riêng. Số của các project khác không đổi, vì mỗi project có bộ số ngẫu nhiên riêng.
  - Tên người cho ở danh sách cũ là username mẫu chung chung. Em không dùng tên của người trong team như trên ảnh production. Tên lấy theo mã giao dịch, nên số tiền không đổi.
- **D2. Thứ tự: phần mới ở trên, phần cũ ở dưới.**
  - Lý do: danh sách xếp mới nhất trước. Bộ lọc và tóm tắt ở đầu trang thuộc về phần mới. Phần cũ là lịch sử.
  - Phương án khác: đúng thứ tự Yen Jui Hung đánh số (phần cũ trước). Nhược điểm: người xem phải cuộn qua cả danh sách cũ mới thấy số payout.
- **D3. Phần tóm tắt không tính giao dịch cũ**, theo câu chính của Elaine. Em không thêm dòng "previous disbursed".
  - Lý do: chưa biết mọi giao dịch cũ đã được chuyển tiền hết chưa. Ghi "disbursed" cho khoản chưa chắc đã chuyển là sai về tài chính.
  - Nếu team chọn ý của Rachel: thêm 1 dòng trong tóm tắt, "Before 2 Jun 2026", gồm số giao dịch và tổng tiền. Khoảng 0.1 ngày.
- **D4. Chỉ sửa trang owner. Hai trang admin giữ nguyên, và lên Version 5.**
  - Team chỉ bàn về màn của PO, không nhắc tới trang admin.
  - Hệ quả: trong dữ liệu mẫu, trang admin vẫn có các payout trước Jun 2026, còn trang owner thì không. Em đưa vào câu hỏi cho team (mục 7).
  - Event mới ở D1 không vào trang admin, vì nó không có dữ liệu đối soát.
  - Pill "Version 5". Bản v4 vẫn còn trong git, commit `b94982b`.
  - Team đang review v4 trên Vercel. Code xong em không push; anh ra lệnh push lúc nào thì em push lúc đó.

## 6. Mặc định cho các chỗ nhỏ (anh đổi được)

| Chỗ | Mặc định em chọn | Lý do |
|---|---|---|
| Dòng giải thích ở đầu tab (chỉ khi có cả hai) | *"Payout details start from 2 Jun 2026. Earlier transactions are listed separately below."* Event dùng "orders". | Josias cần PO hiểu vì sao có 2 phần. Câu nói mốc ngày, là cái thật sự chia 2 phần. |
| Tiêu đề phần cũ | "Transactions before 2 Jun 2026", kèm số đếm. Event: "Orders before …". | Giống kiểu tiêu đề "Transactions 64" của bảng mới. |
| Dòng dưới tiêu đề phần cũ | *"These were made before payout details were available, so they show fewer details and are not in the summary above."* | Trả lời 2 câu PO sẽ hỏi: sao ít cột hơn, sao tóm tắt không có. |
| Bộ lọc với phần cũ | Phần cũ chỉ hiện khi Payout period là "-". Chọn một payout hoặc "Unassigned" thì phần cũ ẩn. Year lọc phần cũ theo ngày giao dịch. | Giao dịch cũ không thuộc payout nào. |
| Export của phần cũ | Nút "Export as .csv" riêng ở đầu phần cũ. Bấm thì hiện thông báo "Exports in the current .csv format". Không tạo file. | File CSV cũ do backend tạo theo template có sẵn. Em chưa có file mẫu để biết đủ các cột, nên không tự đặt cột (câu hỏi 4). |
| Phân trang phần cũ | 10 dòng mỗi trang, dùng chung kiểu phân trang với bảng mới. Không có nút "View full screen", vì danh sách không cần cuộn ngang. | |
| "View Details" của Orders cũ | Hiện thông báo "Opens the order details, as today". | Màn chi tiết đơn đã có trên production, em không dựng lại. |
| Event chưa có đối soát (D1) | Tab Orders chỉ có danh sách cũ và nút Export Orders as .csv. Menu và khung trang giữ như v4. | Giữ một khung trang cho mọi trường hợp, không ẩn menu. |
| Manage Pages › Payouts | Chỉ còn các payout từ mốc trở đi. Không thêm dòng giải thích. | Team chưa nói gì về tab này (câu hỏi 3). |
| IPC (AXS) | Áp dụng cùng cách chia. Phần cũ dùng old format của project. | Trang IPC dùng cùng khung với Manage Project. |
| Mobile | Chưa làm, giống v4. | Anh dặn ưu tiên desktop. |
| Modal "Changes from the feedback" | Thêm các mục của vòng này. | Team đọc thay đổi ở modal này. |

## 7. Câu hỏi cho team (không đưa vào trang)

1. **Giao dịch offline** (Add Offline Transaction) không đi qua PSP, nên không bao giờ có dữ liệu đối soát. Sau mốc, chúng sẽ nằm mãi ở "Unassigned". Nên để ở phần nào?
2. **Phần tóm tắt:** bỏ hẳn giao dịch cũ, hay thêm dòng "previous disbursed" theo ý Rachel? Nếu thêm, mọi giao dịch cũ đã được chuyển tiền hết chưa?
3. **Payouts:** các payout trước mốc không có trong dữ liệu mới. Có cần một dòng ghi "Payouts before 2 Jun 2026 are not listed" ở Manage Pages › Payouts không?
4. **File CSV cũ:** gửi giúp một file mẫu, để nút Export của phần cũ xuất đúng các cột hiện tại.
5. **Trang admin:** giao dịch cũ có hiện trong Transaction Report và Summary Payout Report không? Nếu có, hiện thế nào?

## 8. Phạm vi theo file

| File | Việc |
|---|---|
| `assets/finance-data.js` | Mốc mẫu và hàm tìm mốc của từng project. Username mẫu, lấy theo mã giao dịch. Event mẫu đã xong (D1). Event này không vào danh sách của trang admin. |
| `assets/financial-report.js` | Chia giao dịch theo mốc. Phần mới (bộ lọc, payout, tóm tắt, Statistics, bảng, CSV) chỉ dùng giao dịch từ mốc. Thêm phần cũ, dòng giải thích, tab review "Completed event", modal và pill Version 5. Manage Pages › Payouts bỏ các payout trước mốc. |
| `assets/financial-report.css` | Danh sách kiểu production (project và event), dòng giải thích, tiêu đề phần cũ. |
| `financial-report.html` | Title "version 5". |
| `docs/financial-report-v5-plan.md` | Plan này và nhật ký. |

Không sửa `finance.html`, `finance-payouts.html` hay `assets/finance-admin.css` (D4).

## 9. Thứ tự làm và nghiệm thu

1. **Dữ liệu:** mốc, username mẫu, event mẫu.
   - Kiểm tra: số đếm ở mục 4 khớp từng giao dịch.
   - Trang admin ra đúng các số đang có. Ví dụ kỳ Nov 2026 vẫn là 7,244.10 − 164.01 − 11.88 − 6,538.15 = 530.06.
2. **Danh sách cũ** cho project và event, dựng pixel perfect theo 2 ảnh production.
3. **Trang có cả hai:**
   - Dòng giải thích, phần cũ, bộ lọc ẩn/hiện phần cũ, nút Export của phần cũ.
   - Kiểm tra: Erbil có 64 dòng ở bảng mới, 89 dòng ở phần cũ. Dropdown Payout period chỉ còn Jul–Nov 2026 và Unassigned. Tổng ở tóm tắt bằng tổng 64 dòng.
4. **Trang chỉ có giao dịch cũ** (event mẫu) **và trang chỉ có giao dịch mới** (Concert, không có phần cũ, không có dòng giải thích).
5. **Manage Pages › Payouts:** chỉ còn payout từ Jul 2026. Số của từng payout giữ nguyên như v4.
6. **Tab review, modal, Version 5.**
7. **Kiểm tra:**
   - Viết script node mới cho trang owner, giữ các kiểm tra v4 vẫn còn đúng.
   - Chạy lại 2 script admin: phải ra đúng 35/35 và 24/24 như trước.
   - `node --check`, curl mọi trang trả về 200.
   - Không chạy Chromium headless. Giao diện nhờ anh xem trên trình duyệt.

## 10. Ước lượng thời gian

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này (đọc chat, lấy ảnh production cũ, chạy số) | 0.2 | 0.2 |
| 2. Dữ liệu: mốc, username mẫu, event mẫu | 0.3 | 0.5 |
| 3. Danh sách cũ (project, event), pixel perfect | 0.4 | 0.9 |
| 4. Trang có cả hai: dòng giải thích, phần cũ, bộ lọc, export | 0.4 | 1.3 |
| 5. Trang chỉ cũ / chỉ mới, Manage Pages › Payouts | 0.2 | 1.5 |
| 6. Tab review, modal, Version 5 | 0.1 | 1.6 |
| 7. Script kiểm tra, chạy, ghi nhật ký | 0.3 | 1.9 |

Nếu team chọn dòng "previous disbursed" (D3): thêm 0.1 ngày.

## 11. Nhật ký

**13/11/2026:**
- Đã đọc 6 ảnh chat.
- Đã lấy lại 2 ảnh production (Manage Project › Transaction, Manage Event › Orders) từ vòng v2 để xác định old format.
- Đã chạy script lấy số ở mục 4.
- Chưa code. Đang chờ anh duyệt D1–D4 và các mặc định ở mục 6.

**13/11/2026, anh duyệt:** "đúng rồi, kiểu cũ em làm pixel perfect cho anh… Em start v5 giúp anh rồi gửi link anh review nha".
- Anh gửi 2 ảnh production mới: Transaction (project) và Orders (event), có cả thanh phân trang.
- Làm hết plan theo D1–D4 và các mặc định ở mục 6.
- Không có lệnh commit hay push.

**13/11/2026: đã làm xong.**

Sửa 5 file:
- `assets/finance-data.js`
- `assets/financial-report.js`
- `assets/financial-report.css`
- `financial-report.html`
- plan này

Không sửa 2 trang admin.

**Dữ liệu (`assets/finance-data.js`):**
- Mốc mẫu `RECON_FROM` = 1 Jun 2026.
- Hàm mới:
  - `isOld`: giao dịch có nằm trước mốc không;
  - `newRowsOf` / `oldRowsOf`: lấy riêng giao dịch mới / cũ;
  - `cutoffOf`: ngày của giao dịch đầu tiên có dữ liệu payout.
- `periodsOf` và `payout` chỉ dùng giao dịch mới. Hai hàm này chỉ trang owner gọi.
- `rowsOf` vẫn trả mọi giao dịch, vì trang admin và thẻ project (tổng tiền đã gây quỹ) dùng nó.
- Event mẫu "Charity gala dinner 2026":
  - Antioch 21, 2c2p, bán vé từ Feb đến Apr 2026, diễn ra ngày 2 May 2026.
  - 39 đơn, S$6,840.00, toàn bộ là đơn cũ.
  - Nằm trong `PAST`, không nằm trong `PROJECTS`, nên trang admin không thấy event này.
- Mỗi giao dịch có thêm username mẫu, loại avatar, mã Ref kiểu Agathos (`A` + 8 ký tự) và số giây.
  - Các giá trị này lấy từ bộ số ngẫu nhiên riêng, theo mã giao dịch PSP.
  - Số tiền không đổi: kỳ Nov 2026 vẫn khớp từng cent.

**Số đã đo lại sau khi code:** khớp mục 4.
- Erbil: 89 cũ / 64 mới, mốc 2 Jun 2026.
- Outreach: 22 / 32, mốc 3 Jun 2026.
- Care: 6 / 32, mốc 7 Jun 2026.
- Sunny Days: 59 / 44, mốc 1 Jun 2026.
- Concert: 0 / 56.
- Tóm tắt "All" của Erbil:
  - Assigned to payout: S$30,077.51 → S$12,457.92.
  - Unassigned: S$226.75, giữ nguyên.
  - Net: S$30,304.26 → S$12,684.67.

**Trang owner:**
- **Trường hợp có cả hai:**
  - Dòng giải thích nằm trên khung lọc.
  - Phần mới giống v4, nhưng chỉ tính giao dịch từ mốc trở đi.
  - Dropdown Payout period chỉ còn Jul–Nov 2026 và Unassigned.
  - Year có thêm 2025, vì giao dịch cũ có năm 2025.
  - Phần cũ nằm dưới bảng mới. Tiêu đề kiểu "Transactions before 2 Jun 2026", có số đếm, câu giải thích và nút Export as .csv. Bấm nút chỉ hiện thông báo.
  - Phân trang 10 dòng mỗi trang.
- **Bộ lọc:**
  - Chọn một payout hoặc Unassigned thì phần cũ ẩn.
  - Year lọc phần cũ theo ngày giao dịch. Ví dụ Year 2025: bảng mới trống, phần cũ còn giao dịch tháng 11–12/2025.
- **Chỉ có giao dịch cũ (event mẫu):** chỉ có "Orders 39", nút Export Orders as .csv và danh sách. Không có khung lọc, tóm tắt hay dòng giải thích.
- **Chỉ có giao dịch mới (Concert):** giống hệt v4.
- **IPC (Sunny Days):** chia 2 phần như trên, phần cũ dùng kiểu project.
- **Manage Pages:**
  - Events có thêm thẻ event mẫu.
  - Payouts chỉ còn Jul–Nov 2026. Số của từng payout giữ nguyên, vì mọi giao dịch từ tháng 6 đều có dữ liệu payout.
- **Thanh review:** thêm tab "Completed event", pill "Version 5".
- **Modal ghi chú:** thêm mục "The new section comes first, the old one under it" (D2).

**Danh sách cũ, dựng pixel perfect.** Em đo trên 2 ảnh anh gửi. Ảnh chụp ở 2x, đổi về CSS px:
- **Dòng:**
  - Mỗi dòng cao 119px, kể cả đường kẻ 1px #F0F0F0. Dòng event cao 131px.
  - Dòng cuối không có đường kẻ.
  - Avatar cách đầu dòng 16px.
- **Avatar:** 48px, viền 2px #D3D3D3.
  - Ảnh mặc định: nền #F4D7E5, hình người #E07EB0.
  - Hoặc chữ cái đầu: nền #D2D5DA, chữ trắng 18px đậm 700.
- **Chữ:**
  - Username 16px, màu #2254AC.
  - @handle 14px, màu #8D8D8D, cách username 4px.
  - Dòng dưới 14px, màu #1F1F1F, cách khối trên 17px.
  - Tất cả đậm 500. Em chọn bằng cách so độ dày nét chữ trên ảnh với file font Be Vietnam Pro.
  - Event: dòng username cao 36px. Vì vậy username thấp hơn 6px, các dòng dưới thấp hơn 12px, giống ảnh.
- **Dòng dưới:** 4 cột bắt đầu ở 0, 187, 374 và 561px.
  - "Ref:" màu xám, cách giá trị 9px.
  - Ngày và giờ cách nhau 8px.
  - Cách ghi giống production: `2026-10-03 10:04:02` cho project, `04/11/2026 - 09:26` cho event; `S$20`; `Paynow` / `Credit` / `Debit`.
- **View Details:** 14px, gạch dưới, cách mép phải 16px.
- **Phân trang:**
  - Ô 28×28, cách nhau 4px, bo góc 4px, viền #DFE2E6.
  - Trang đang xem viền đen. Số 16px.
  - Nút trước khi bị khoá: nền #D3D3D3, mũi tên trắng.
  - Nút sau: viền và mũi tên #2A64CD.
  - Dấu "…" là 3 chấm #D3D3D3 trong một ô.
  - Cách dòng cuối 40px, cách mép phải 5px.
  - Thứ tự: 1 2 3 4 5 … 9.

**Chỗ làm khác plan, và lý do:**
- **Câu thứ hai của dòng giải thích** ("Earlier transactions are listed separately below.") chỉ hiện khi phần cũ đang hiện. Khi chọn một payout thì phần cũ ẩn, nên câu đó sẽ sai.
- **Màn hình hẹp hơn 900px:** thêm 2 dòng CSS cho 4 cột tự xuống hàng, để trang không tràn ngang. Đây chưa phải thiết kế mobile; mobile vẫn để sau.
- **Ngày diễn ra event mẫu** là 2 May 2026, sau ngày bán vé cuối. Plan không ghi ngày này.

**Đã kiểm tra:**
- Script node mới cho trang owner: 59/59 qua.
  - Gồm 3 trường hợp, bộ lọc, phân trang, CSV, IPC, Manage Pages, số đo trong CSS, cùng các kiểm tra v4 vẫn phải đúng.
  - Trong lúc chạy có 1 lỗi ở script (DOM giả không có nút đóng của modal). Đã sửa script.
- Script v4 của trang owner: 29/32. 3 kiểm tra không qua đúng như dự tính: số "All" của Erbil, CSV của Erbil, và nhãn "Version 4".
- 2 script admin: Transaction Report 35/35, Summary Payout 24/24. Số không đổi.
- `node --check` cho 2 file JS và 2 đoạn script trong trang admin: không lỗi.
- curl: 3 trang, 3 file asset và ảnh event mẫu đều trả về 200.
- Chưa xem giao diện bằng mắt, vì không chạy Chromium headless. Nhờ anh xem trên trình duyệt.

**13/11/2026, anh review lần 1:**
- Anh hỏi: *"có cách nào làm UI gọn hơn, đừng kéo dài quá và 2 table nó xêm xêm ko (ý là UI mới nó có thể học từ UI cũ đang có ko?). Enhance nhé"*.
- Anh nói thêm: *"Event cũng the same mà đâu nhất thiết phải Completed event… Project/Event nên có 3 state: Chỉ có mới, Chỉ có cũ (đã kết thúc), Vừa có cũ vừa có mới. Em setup thanh top để cho dễ chọn case phù hợp"*.
- Em hỏi 2 câu, anh chọn:
  - "Cùng khung bảng": bảng cũ dùng khung của bảng mới, và bảng mới thêm cột Account học từ UI cũ.
  - "Thêm 1 công tắc Data" trên thanh review.

**13/11/2026: đã làm xong vòng chỉnh này.**

**Bảng cũ cùng khung với bảng mới:**
- Bỏ danh sách production pixel perfect (dòng 119px). Bảng cũ giờ cùng khung với bảng mới: hàng tiêu đề, dòng cao như bảng mới, cùng kiểu phân trang "1–10 of 89". Phần cũ ngắn còn khoảng một nửa.
- **Cột lấy từ UI cũ:**
  - Project: Account, Date & time, Reference, Payment method, Funding Amount.
  - Event: Account, Date & time, Reference, Payment method, Tickets, Details.
- Ngày và Reference ghi giống bảng mới. Số tiền giữ chữ "S$" như UI cũ, vì bảng cũ không có cột Currency.
- **Độ rộng:** em tính theo file font Be Vietnam Pro.
  - Project cần khoảng 728px, event khoảng 725px, đều vừa khung 730px nên không phải cuộn ngang.
  - Để vừa, lề trong ô của bảng cũ giảm từ 16 xuống 14px.
  - Link của event ghi "Details" thay vì "View Details". Ghi đủ thì bảng event rộng khoảng 760px, phải cuộn ngang.
- **Bảng mới thêm cột Account ở đầu** (avatar 24px và username), học từ UI cũ. Cột này và cột Date & time đứng yên khi cuộn ngang. CSV cũng có thêm cột Account ở đầu.
- Mã Ref kiểu Agathos và số giây của bản trước đã bỏ. Cả 2 bảng dùng cùng một cột Reference.

**Thanh review: công tắc Data.**
- Có 3 lựa chọn: Old and new / New only / Old only (ended). Lựa chọn áp cho mọi màn, kể cả Manage Pages › Payouts.
- Lựa chọn nằm trong đường dẫn, ví dụ `#/manage/erbil/transactions?data=old`, nên link gửi đi vẫn giữ đúng trường hợp. Link không có `?data=` thì giữ lựa chọn đang dùng.
- **Old and new:**
  - Project: payout data từ 1 Jun 2026.
  - Concert: payout data từ 1 Sep 2026 (trường `recon` của event này). Concert có 17 đơn cũ và 39 đơn mới, mốc là ngày của đơn mới đầu tiên.
- **New only:** mọi giao dịch đều có payout data. Giống hệt v4: chạy script v4 ở chế độ này qua 31/32, chỉ không qua kiểm tra nhãn "Version 4".
- **Old only (ended):** mọi project/event chỉ còn bảng cũ (Erbil 153, Concert 56). Manage Pages › Payouts hiện "No payouts yet."
- Bỏ tab "Completed event" và event mẫu "Charity gala dinner 2026" (`PAST`).

**Đã kiểm tra:**
- Script mới `fr5b-check.js`: 36/36 qua. Gồm 3 trường hợp cho project và event, cột của 2 bảng, phân trang riêng, CSV, công tắc Data, và giữ lựa chọn khi đổi màn.
- Script v4 ở chế độ New only: 31/32. Kiểm tra không qua là nhãn "Version 4", đúng như dự tính.
- 2 script admin: 35/35 và 24/24.
- `node --check` không lỗi. curl các trang và asset đều trả về 200.
- Chưa xem bằng mắt. Thanh review có thêm công tắc nên có thể xuống 2 dòng ở màn 1728px.

**13/11/2026, anh review lần 2:** *"là vẫn 2 bảng 2 nơi hả em, combine về 1 nơi và switch qua lại được ko (segment tab chẳng hạn), em nghĩ sao"*.
- Em đề xuất đặt segment ở đầu tab và nêu rủi ro: giống phương án "2 tabs" mà Josias đã hỏi.
- Anh trả lời: "Ok try đi".

**13/11/2026: đã làm xong segment.**
- **Segment ở đầu tab:** khi project/event có cả giao dịch cũ lẫn mới, ngay dưới tiêu đề Transactions/Orders có một segment chia đôi chiều ngang, mỗi nửa kèm số đếm. Ví dụ Erbil: "From 2 Jun 2026 · 64" và "Before 2 Jun 2026 · 89".
  - Trang mở ở "From …". Phần này có dòng giải thích *"Payout details start from 2 Jun 2026. Earlier transactions are under "Before 2 Jun 2026"."*, rồi tới khung lọc, payout summary, tóm tắt, Statistics và bảng mới, như cũ.
  - "Before …" có dòng giải thích *"These were made before payout details were available, so they show fewer details and are not in the summary."*, rồi bảng cũ "Transactions 89" kèm nút Export as .csv. Không có khung lọc hay tóm tắt.
  - Đổi qua lại thì bảng cũ quay về trang 1. Bấm link một payout ở Manage Pages thì trang mở ở "From …", đúng payout đó.
- **Không có segment** khi chỉ có một loại: "New only" giống v4; "Old only" chỉ có bảng cũ.
- **Không còn chồng 2 phần lên nhau:**
  - Bỏ đường kẻ phân cách và câu "Earlier … listed separately below".
  - Year chỉ còn năm của payout (2026), vì bảng cũ không còn nằm chung với khung lọc.
- **Modal "Changes from the feedback":** thay mục thứ tự 2 phần bằng mục "Old and new transactions in one place, one list at a time". Mục này ghi rõ: mỗi lúc chỉ hiện một bảng, gần với phương án "2 separate tabs" Josias đã hỏi, team quyết.

**Đã kiểm tra:**
- Script mới `fr5c-check.js`: 31/31 qua. Gồm segment ở project, event và IPC; đổi qua lại; phân trang; link payout; CSV; New only / Old only; modal.
- Script v4 ở chế độ New only: 31/32, chỉ không qua nhãn "Version 4".
- 2 script admin: 35/35 và 24/24.
- `node --check` không lỗi, curl trả về 200.
- Chưa xem bằng mắt.

**13/11/2026, anh review lần 3:** *"Enhance câu này đi, Owner sẽ cần đọc đó"* (dòng giải thích ở "Before …").
- Câu cũ: *"These were made before payout details were available, so they show fewer details and are not in the summary."*
- Câu mới: *"Transactions before 2 Jun 2026 have no payout details, such as fees and net payout, so they are not counted in the totals under "From 2 Jun 2026"."*
  - Câu mới có ngày cụ thể, nói rõ thiếu chi tiết gì, và các số tổng nằm ở đâu.
  - Event dùng "Orders" và ngày của event. IPC dùng "the amount paid to you" thay cho "net payout", đúng tên cột của IPC.
- Chỉ sửa câu này. Câu ở "From …" giữ nguyên.
- Đã kiểm tra: `fr5c-check.js` 33/33, gồm câu mới ở project, event và IPC.

**13/11/2026, audit lần 1 (vai owner), em gửi anh.** 3 mục nặng và vừa em đề xuất làm ngay:
- (1) Bảng cũ không có tổng tiền.
- (3) Nhãn segment trông như bộ lọc ngày.
- (4) Đầu trang nặng, có câu giải thích lặp lại ý của segment.

Đưa vào câu hỏi cho team: lịch sử payout trước mốc; cột Net payout / Payout status bị khuất bên phải; 2 tên cho cùng một số tiền net.

**Anh duyệt:** *"Mình thiếu cái badge "Tax Deduction" … ở PROJECT. Mình thiếu badge "PROMOTION CODE" … ở EVENT. Làm chung với mục 1,3,4. Sau đó audit lại 1 lần nữa và gửi anh báo cáo"*. Anh gửi kèm 2 ảnh production của 2 badge.

**13/11/2026: đã làm xong.**
- **Badge, lấy từ production:**
  - **Tax Deduction** (project và IPC): nền #FDF6E9, chữ đen, bo góc 4px.
  - **Mã khuyến mãi** (event): viên thuốc viền #E7F3FE, chữ #2254AC, icon con dấu xanh #60B6F9 có dấu %. Ví dụ "DISC".
  - Em đo trên ảnh: Tax Deduction cao 26px, mã khuyến mãi cao khoảng 22px. Trong bảng em dùng bản nhỏ hơn: cao 22px, chữ 12px.
  - Badge nằm trên một dòng riêng, dưới avatar và username, trong cột Account. Cột này đứng yên khi cuộn ngang. Có ở cả bảng mới lẫn bảng cũ. Dòng có badge cao hơn.
  - Badge dài nhất rộng khoảng 104px, cột rộng 108px. Em tính theo file font.
- **Dữ liệu mẫu:**
  - Khoảng 30% giao dịch của project có Tax Deduction; khoảng 25% đơn của event có mã (DISC, EARLYBIRD, FRIENDS).
  - Các giá trị này lấy từ bộ số ngẫu nhiên riêng, nên số tiền không đổi.
  - Mẫu chưa trừ phần giảm giá của mã vào số tiền đơn.
- **(1) Tổng tiền ở bảng cũ:** dưới tiêu đề có dòng "Total Funding Amount S$19,140.00" (event: "Total Ticket Sales Amount"). Erbil: 13,700 + 19,140 = 32,840, đúng bằng số trên thẻ project. Ở "Old only" là S$32,840.00.
- **(3) Nhãn segment** đổi thành "With payout details · 64" / "Earlier · 89". Câu giải thích ở "Earlier" giờ ghi *…not counted in the totals under "With payout details".*
- **(4) Bỏ câu "Payout details start from…"** ở tab mới. Câu giải thích chỉ còn ở tab "Earlier".
- **Modal:** cập nhật nhãn segment trong mục ghi chú.

**Đã kiểm tra:**
- `fr5d-check.js`: 43/43 qua. Gồm badge đúng dòng ở project, event và IPC; tổng tiền; nhãn mới; không còn câu ở tab mới.
- Script v4 ở chế độ New only: 31/32, chỉ không qua nhãn "Version 4".
- 2 script admin: 35/35 và 24/24.
- `node --check` không lỗi, curl trả về 200.
- Chưa xem bằng mắt. Icon con dấu em tự vẽ theo ảnh, có thể lệch chút so với production.

**13/11/2026, anh dặn thêm trong lúc em làm:** *"Row height làm cho anh như nhau với cái thằng lớn nhất (tức là độ cao như nhau, content align center)"*.
- **Đã làm:** mọi dòng của bảng mới và bảng cũ cao 81px, bằng dòng có badge, nội dung căn giữa theo chiều dọc. 81 = avatar 24 + cách 8 + badge 22, lề trong 13 + 13, đường kẻ 1.
- Để chiều cao đúng ở mọi trình duyệt, avatar không còn margin âm, và dòng account cố định 24px.
- Dòng không có badge cũng cao 81px, nên số dòng mỗi trang không đổi chiều cao bảng.
- **Đã kiểm tra:** `fr5d-check.js` 44/44, kiểm tra CSS. Script v4 ở chế độ New only: 31/32, như trước.

**13/11/2026, anh trả lời audit lần 2:**
- (1) *"Soạn thành câu hỏi, nét vào 1 nút kế bên changes from the feedback"*
- (2) *"CSV đừng làm, cứ nói là ko có trong prototype"*
- (3) *"Tại sao bảng mới ko có, nên có chứ em, làm cho giống thông tin UI cũ"*
- Dặn thêm trong lúc em làm: *"remove cái text này, vô nghĩa"* (dòng "Sample data · today is 29 Oct 2026" trên thanh review).

**13/11/2026: đã làm xong.**
- **Nút "Questions for the team"** nằm ngay sau "Changes from the feedback", có số đếm 6 trên nền navy. Bấm vào mở một hộp cùng kiểu với hộp ghi chú. Mỗi câu có 3 dòng: Question / Why we ask / For now. 6 câu:
  1. Payouts before the cut-off.
  2. Offline transactions.
  3. Earlier transactions in the summary ("previous disbursed").
  4. Order of the columns (Net payout và Payout status).
  5. Earlier transactions on the admin pages.
  6. One name for the net amount.
- **CSV không làm thêm.** Cuối hộp câu hỏi có dòng: *"Not in this prototype: the CSV files do not carry the Tax Deduction tag or the promotion code."*
- **Bảng Orders mới có thêm cột Tickets** (số vé, căn phải, sau Payment method) **và link Details** ở cột cuối, giống UI cũ. Bảng giờ có 12 cột. Bảng của project không đổi. CSV không đổi.
- **Bỏ dòng "Sample data · today is 29 Oct 2026".** Việc đẩy 2 nút sang phải chuyển sang nút "Changes from the feedback".
- Câu hỏi 4 (CSV mẫu) ở mục 7 của plan không còn cần, vì CSV không nằm trong prototype.

**Đã kiểm tra:**
- `fr5d-check.js`: 56/56 qua. Gồm cột của bảng Orders mới, CSV không đổi, nút và hộp câu hỏi, thanh review không còn dòng sample data.
- Script v4 ở chế độ New only: 31/32, chỉ không qua nhãn "Version 4".
- 2 script admin: 35/35 và 24/24.
- `node --check` không lỗi, curl trả về 200.

**13/11/2026, anh dặn:** *"remove cái này luôn"* (nút "Changes from the feedback"), *"đưa questions lên chung 1 hàng trên cho gọn"*.
- **Đã làm:**
  - Bỏ nút "Changes from the feedback", hộp ghi chú của nó (danh sách `NOTES`, hàm `notesHtml`) và style của các câu trích.
  - Nút "Questions for the team" giờ nằm cùng hàng với 4 tab và công tắc Data, ở cuối hàng bên phải.
  - Hộp câu hỏi dùng lại khung cũ; đóng hộp thì con trỏ quay về nút này.
- Theo font, cả hàng rộng khoảng 1,430px, nên vừa một hàng ở màn 1728px. Màn hẹp hơn thì nút có thể xuống dòng.
- **Mất theo:** 2 ghi chú trong hộp cũ.
  - "A payout is named after the month it is paid in": anh đã chốt từ 6/11.
  - Ghi chú về segment: mỗi lúc chỉ một bảng, gần phương án "2 separate tabs", team quyết. Ghi chú này chưa có trong 6 câu hỏi.
- **Đã kiểm tra:** `fr5d-check.js` 56/56. Script v4 ở chế độ New only: 31/32, như trước. `node --check` không lỗi, curl trả về 200.

**13/11/2026, 2 việc anh giao cùng lúc:**
- **Side menu gọn hơn** (đề xuất FE của anh, ảnh mockup 2 khung Manage Event): *"chủ yếu giảm font size, icon size, padding… Em xem được hình để làm pixel perfect ko?"*.
- **Anh trả lời 6 câu hỏi:**
  1. Để đó.
  2. Offline nằm ở cả 2 danh sách nhưng không tính vào payout; làm badge (nền xám, chữ đen), xong thì bỏ câu hỏi.
  3. Để team nghĩ.
  4. Sắp cột tối ưu cho owner, xong thì bỏ câu hỏi.
  5. Làm sau, vì Kế toán trưởng đang review admin; bỏ câu hỏi.
  6. Giữ theo feedback; bỏ câu hỏi.

**13/11/2026: đã làm xong.**

**Side menu, đo trên ảnh:**
- Ảnh vẽ ở màn 1440px. 2 khung xanh có ghi số cho cùng một tỉ lệ: 0.986 px ảnh = 1 CSS px. Vì vậy số đo chính xác khoảng ±1px.
- **Đổi:**
  - Cột menu 365 → **265px**; khoảng cách menu–thẻ giữ **39px**.
  - Thẻ rộng 912px, lề trong 40 → **32px**. Phần nội dung trong thẻ: 732 → **848px**. 265 + 39 + 912 = 1216.
  - Mục menu: cao 64 → **48px**, cách nhau **2px**; lề trái 22 → **9px**; icon cách chữ 18 → **12px**.
  - Chữ menu 17 → **14px**. Em xác định bằng cách so độ rộng chữ "Information" (77px) với file font.
  - Mũi tên 18 → **13px**. Viền mục đang chọn 4 → **3px**. Nút Back cách menu 28 → **16px**.
  - Màn 900–1180px: cột menu cũng 265px.
- **Giữ nguyên, vì 2 khung giống nhau:** icon 20px (anh có nhắc giảm icon, nhưng trên ảnh icon ở 2 khung đều khoảng 19–20px), tiêu đề "Manage Event", nút Back cao 42px, phần đầu thẻ.
  - Chữ nút Back em giữ 16px như production. Trên mockup cả 2 khung đều là 14px, tức là mockup khác production chứ không phải điểm muốn đổi.

**Offline (câu 2):**
- Dữ liệu mẫu có giao dịch offline cho project thường (không có ở IPC hay event), khoảng 35% số tháng có một giao dịch, S$300–2,000. Erbil có 5 giao dịch: 2 trước mốc, 3 sau mốc, tổng S$2,200.
- Giao dịch offline:
  - không có phí, mã PSP hay phương thức thanh toán;
  - nằm trong danh sách theo ngày, có badge **Offline** (nền #ECEDEF, chữ đen), các cột payout và PSP ghi "—";
  - không tính vào tóm tắt, Statistics, kỳ payout hay Unassigned; chọn một kỳ payout thì chúng ẩn;
  - tính vào số tiền đã gây quỹ (thẻ project: S$35,040);
  - không lên trang admin (`reconciled` trả về false).
- CSV giữ như cũ: chỉ có giao dịch online.

**Thứ tự cột (câu 4):**
- Project: Account, Date & time, Funding Amount, **Net payout, Payout status**, love gift, Processing fees, Payment method, Currency, Reference.
- Event: thêm Tickets sau Date & time, link Details ở cuối.
- IPC: Account, Date & time, Funding Amount, Paid to you, Processing fees, Love gift, Payment method, Currency, Reference.
- Bảng cũ theo cùng thứ tự: Account, Date & time, số tiền (event: Tickets), Payment method, Reference.

**Câu hỏi:** còn câu 1 và 3; đã bỏ 2, 4, 5, 6.

**Còn lệch:**
- Tóm tắt của tab mới chỉ tính online (S$13,700); tab "Earlier" có tổng S$19,740 (gồm S$600 offline). Hai số này cộng lại thiếu S$1,600 offline sau mốc so với thẻ project (S$35,040). Chờ anh chọn cách hiện.

**Đã kiểm tra:**
- `fr5e-check.js`: 33/33. Trong lúc chạy có 1 lỗi ở script: em đếm sai số dấu "—", đúng là 6 vì cột Currency vẫn ghi SGD. Đã sửa.
- `fr5d-check.js`: 41/56. 15 kiểm tra không qua đều do thay đổi đã dự tính: số đếm có thêm offline, tổng tiền gồm offline, thứ tự cột, còn 2 câu hỏi.
- Script v4 ở chế độ New only: 31/32, chỉ không qua nhãn "Version 4".
- 2 script admin: 35/35 và 24/24.
- `node --check` không lỗi, curl trả về 200.
- Chưa xem bằng mắt.

**13/11/2026, anh dặn thêm trong lúc em làm:** *"mấy cái column vì title dài mà width dài như vậy thì kì lắm. Cho width gọn lại. text dài thì rớt 2 dòng đi em"*.
- **Đã làm:**
  - Tiêu đề dài xuống 2 dòng ở chỗ đã định sẵn: Funding / Amount, Ticket Sales / Amount, Beneficiary Love / Gift to Agathos, Agathos / Platform fee, Processing / fees, Payment / method, Love gift / to Agathos.
  - Áp cho bảng mới và bảng cũ. Tiêu đề ngắn (Date & time, Net payout, Payout status, Currency, Reference, Tickets, Account) vẫn một dòng.
  - Em chọn chỗ xuống dòng bằng cách đo theo font, sao cho mỗi tiêu đề không quá 2 dòng và không rộng hơn số liệu bên dưới bao nhiêu.
  - Ví dụ cột "Beneficiary Love Gift to Agathos": khoảng 222px → khoảng 138px. "Payment method": 139 → 109px. "Funding Amount": 134 → 91px.
- Thẻ trên điện thoại vẫn ghi nhãn một dòng. Bảng Payouts không đổi.
- **Đã kiểm tra:** `fr5e-check.js` 38/38. Script v4 ở chế độ New only 31/32. 2 script admin 35/35 và 24/24.

**13/11/2026, anh chọn (a).**
- **Đã làm:** ngay dưới phần tóm tắt của tab "With payout details" có dòng *"Offline, not in payout: S$1,600.00"*. Số này là tổng các giao dịch offline đang có trong danh sách.
  - Dòng chỉ hiện khi danh sách có giao dịch offline. Chọn một kỳ payout hoặc Unassigned thì dòng ẩn, vì lúc đó danh sách không có offline. Event và project không có offline thì cũng không có dòng.
  - Erbil: 13,700 (tóm tắt) + 1,600 (offline) + 19,740 (Earlier) = 35,040, khớp thẻ project.
- **Đã kiểm tra:** `fr5e-check.js` 44/44, gồm phép cộng ở trên. Script v4 ở chế độ New only 31/32. 2 script admin 35/35 và 24/24. curl trả về 200.

**13/11/2026: commit và push.**
- Anh ra lệnh "Commit và push".
- Commit `5093476` "Financial report v5: older transactions without payout data, compact side menu" gồm 6 file, đã push lên main, Vercel tự deploy.
- Còn lại:
  - câu hỏi 1 (payout trước mốc) và câu hỏi 3 (giao dịch cũ trong tóm tắt): chờ team;
  - câu hỏi 5 (trang admin): làm sau khi Kế toán trưởng review xong v4;
  - mobile: để sau.

**13/11/2026, thanh filter ghim khi cuộn (anh chọn cách 1).**
- Anh hỏi: khi đang filter (ví dụ Sep 2026) mà cuộn xuống thì có nên ghim filter không. Em đưa 3 cách, anh chọn cách 1: thanh mỏng chỉ có chữ và nút Change.
- **Đã làm:**
  - Khi có filter (Year hoặc Payout period khác mặc định) và khung "Filter & export" đã cuộn khuất dưới menu trang (80px), một thanh cao 44px hiện ngay dưới menu, rộng bằng thẻ trắng.
  - Nội dung: *"Payout period: Sep 2026"* và nút *Change*. Đã chọn kỳ thì chỉ ghi kỳ, vì kỳ đã có năm. Chỉ chọn năm thì ghi *"Year: 2026"*. IPC ghi *"Month: …"*. Unassigned ghi *"Payout period: Unassigned"*.
  - Bấm Change: trang cuộn lên khung filter (cách menu 16px) và đặt focus vào ô Payout period, hoặc ô Year nếu chỉ chọn năm. Máy bật giảm chuyển động thì cuộn ngay, không trượt.
  - Không filter: không có thanh. Tab "Earlier", dữ liệu "Old only (ended)" và trang Manage Pages: không có thanh.
  - Thanh không chiếm chỗ, nên trang không bị giật khi thanh hiện. Thanh dừng ở cuối thẻ trắng.
- **Đã kiểm tra:** `fr5f-check.js` 29/29, gồm nội dung thanh, lúc hiện và ẩn, nút Change, và CSS ở 3 khổ màn hình. `fr5e-check.js` 44/44. Script v4 ở chế độ New only 31/32 (chỉ fail "version 4", như trước). 2 script admin 35/35 và 24/24. curl trả về 200.
- Chưa xem bằng mắt. Chưa commit.
- **Em thấy thêm:** nút trang của bảng (1, 2, 3…) cuộn bảng lên sát mép trên màn hình. Mép đó nằm dưới menu trang 80px, nên tiêu đề bảng bị che. Lỗi này có từ trước. Khi thanh mới hiện, phần bị che thành 124px, nên dòng tiêu đề cột cũng bị che.

**13/11/2026, anh bảo "sửa luôn đi".**
- **Đã làm:** khi bấm số trang, bảng dừng cách menu 16px, tức 96px tính từ mép trên. Khi thanh filter đang hiện, bảng dừng cách thanh 16px, tức 140px (80 + 44 + 16). Áp cho bảng "With payout details" và bảng "Earlier". Bảng "Earlier" không có thanh, nên luôn là 96px. Chế độ toàn màn hình không đổi.
- **Đã kiểm tra:** `fr5f-check.js` 32/32. `fr5e-check.js` 44/44. Script v4 ở chế độ New only 31/32 (chỉ fail "version 4", như trước). 2 script admin 35/35 và 24/24. curl trả về 200.
- Chưa xem bằng mắt. Chưa commit.
