# Onboarding — feedback 02/10/2026: plan cho v1.2

Trạng thái: **bản nháp, chờ anh duyệt** · Viết ngày 02/10/2026
Bản đang live: **v1.1** = commit `a6286a8` (25/09/2026) trên https://agathos-campaign-builder.vercel.app/onboarding

Nguồn:
- File `Onboarding Flow Comments_02102026.docx`: Draft 1 cũ, cộng thêm mục mới và câu trả lời Q1–Q8.
- Ghi chú của Rachel về pain-points của PO/EO (7 điểm).
- Tin nhắn của team lead: đặt tên version cho bản Vercel; tự đi thử các flow; "structure" giữa project page / org page / event page vẫn chưa rõ với user; mời phản biện các đề xuất.

---

## 1. Feedback trên bản cũ: phần đã xử lý trong v1.1

File chia làm hai phần (anh xác nhận ngày 02/10):
- **Từ "Where should donations go?" trở xuống** là feedback trên **v1.1 (25/09)**: IPC, Tell us about your cause, Check your inbox (email đã có tài khoản), Flows (user chưa xác minh), Project basics, Step 0, Q1–Q8.
- **Các mục phía trên** là feedback trên bản cũ, trước v1.1.

Trong phần bản cũ, những comment sau đã có câu trả lời trên v1.1:

| Comment | Trên v1.1 |
|---|---|
| Start a Project (1 org): màn này để làm gì, box trắng, step indicator, muốn tạo org mới thì sao | User 1 org thấy cùng màn chọn org như 2+ org, có "Add an organisation" (`f2734de`). Khi bắt đầu Project, thông tin org được xác nhận trong modal có step indicator Confirm details → Build → Launch (`a6286a8`) |
| Dashboard: cần thêm gì, có nên chỉnh thiết kế | Dashboard đã dựng lại theo tab Manage Pages trên production (`407ab59`) |
| Who else is on this: lỡ bấm Continue trước khi Invite | Đã có nhắc "This invite hasn't been sent" (`b3367e4`) |
| Who is raising: trùng với lựa chọn ở màn trước | User đã đăng nhập và đã chọn thì không bị hỏi lại (`b3367e4`) |
| Verify your identity: câu hỏi cách dùng tiền | Đã bỏ khỏi bước này (`b3367e4`) |

Phần bản cũ còn mở, đã đưa vào plan:
- **Check your inbox (magic link)**: các câu hỏi cách hoạt động. Trả lời ở A4 và A8.
- **Selecting Org screen**: org nào được hiện. **Selecting Org as Member**: khi nào có Member. Trả lời qua D2.
- **Dashboard: "Verify (org or indiv) → new project or new event"**. Gộp vào D1.

---

## 2. Team đã trả lời Q1–Q8 (ma trận quyền)

| Câu hỏi | Trả lời | Hệ quả |
|---|---|---|
| Q1 Hai bộ role hay gộp | Gộp thành một danh sách cho cả org và project, khớp với role đang có trên Agathos | Cần danh sách role hiện tại trên production (mục 5) |
| Q2 Đổi tên role "Admin" | Đề xuất tên khác | Em đề xuất **Manager**. Production đang dùng "Your Role: Admin", nên đổi tên sẽ ảnh hưởng cả production |
| Q3 Owner khác Admin chỗ nào | Theo đúng production | Cần quyền thực tế trên production (mục 5) |
| Q4 Ai được cấp quyền rút tiền | Owner và Admin. Đang cân nhắc có cần role/quyền riêng cho payout | Gợi ý: quyền payout là một nút bật/tắt trên người Owner/Manager, không phải một role riêng |
| Q5 Ai duyệt yêu cầu của Member | Chưa thấy cần role Member. Có thể gộp Collaborator vào Admin | Bỏ Member. Gộp Collaborator vào Manager (Quyết định D2) |
| Q6 Viewer thấy những gì | Tất cả: tổng tiền lẫn tên/email donor | Cập nhật ma trận |
| Q7 Ai được xin đổi goal/end date | Owner, Admin, Collaborator | Sau khi gộp: Owner và Manager |
| Q8 Collaborator đi thẳng vào tạo Project? | Không hiểu câu hỏi | Gộp Collaborator vào Manager thì câu này không còn cần nữa |

---

## 3. Bốn quyết định cần anh (và team) chốt

Mỗi quyết định có phương án em đề xuất làm mặc định.

### D1 — Step 0 và cấu trúc trang (vấn đề lớn nhất)

Team lead đề xuất "Step 0" với 3 lối vào: **Raise funds for a Cause** / **Raise funds for an Organisation** (org page nhận cả tiền opex) / **Host an event**.

Em đồng ý có Step 0. Step 0 giải quyết thẳng 3 vấn đề Rachel nêu:
- (#1) Partner không biết bắt đầu Project từ đâu.
- (#2) Nút "Create Event" bị giấu trong tab Join Event.
- Người dùng không hiểu cấu trúc các loại trang.

Điểm em phản biện là **cách org page nhận tiền opex**:

| Phương án | Mô tả | Được | Mất |
|---|---|---|---|
| A (team lead) | Org page tự nhận donation cho opex | Đúng ý "donate cho tổ chức" | Thêm một loại nơi nhận tiền thứ hai, ngoài project. Checkout, payout, báo cáo, change request và admin portal đều phải hiểu loại mới này |
| **B (em đề xuất)** | Org page hiện nút "Donate to [Org]". Phía sau là một **General fund**, thực chất là một project đặc biệt gắn cố định trên org page | Dùng lại toàn bộ đường đi của project (goal, update, báo cáo, payout, change request), không có loại donation mới. Partner nhập thông tin tổ chức **một lần**, nên hết trùng lặp (Rachel #5) | Phải giấu chữ "project" với General fund trên giao diện |
| C | Giữ cấu trúc hiện tại, chỉ thêm Step 0 | Ít việc nhất | Không giải quyết được chuyện trùng thông tin giữa org page và project page |

Cả 3 phương án dùng chung các thay đổi sau:
- Tách **xác minh org** (riêng tư, cho compliance) khỏi **xuất bản org page** (công khai). Org page được dựng sẵn từ dữ liệu đã xác minh (tên, logo, quốc gia, mô tả), và **có ngày xuất bản**. Cả hai câu này đều có trong file feedback.
- Event tách thành lối vào riêng, nên bỏ loại project "Tied to an event" để khỏi trùng.
- Xác minh (org hoặc cá nhân) là bước chung cho cả Project lẫn Event, đúng ý comment Dashboard "Verify (org or indiv) → new project or new event". Kicker "Start a project" trên các màn xác minh đổi theo lối vào đã chọn ở Step 0.

Lưu ý: em không xem được code production, nên phần "được/mất" ở trên là suy luận từ cách sản phẩm vận hành, chưa đo trên code.

### D2 — Role: một danh sách chung

Mặc định: **Owner / Manager / Viewer**, áp dụng cho cả org và project.
- Manager là "Admin" đổi tên, gộp luôn Collaborator.
- Quyền rút tiền là nút bật/tắt trên Owner/Manager.
- Bỏ Member.
- "Request access" chỉ còn cho trường hợp tổ chức đã có trên Agathos (người mới đăng ký trùng org). Khi được duyệt, người đó thành Manager.

Cần danh sách role production để khớp tên (mục 5).

### D3 — Project có cần Agathos duyệt không (Rachel #4)

Rachel nói với project, chị **luôn cần due diligence và gặp partner**. Partner email cho chị sau bước xác minh là chuyện tốt. Prototype hiện tại cho tự tạo và launch ngay sau khi org được xác minh, nên đang đi ngược quy trình thật.

- **Mặc định (em đề xuất):** org đã xác minh → bấm Start a project → điền phần cơ bản (tên, mô tả ngắn, mục tiêu) → **"Submit for review — we'll contact you to schedule a call"** → Agathos duyệt → mới dựng trang và launch. Event giữ nguyên tự phục vụ.
- **Phương án khác:** giữ tự phục vụ, chỉ chặn ở bước Launch bằng "Submit for review".

### D4 — Tổ chức IPC (nhận payout trực tiếp qua AXS)

- **Mặc định:** ở bước Documents (tổ chức đăng ký tại Singapore), thêm câu hỏi "Is your charity an IPC?". Chọn Yes thì bỏ bước Payout details, thay bằng ghi chú "Payouts are set up directly with AXS".
- **Phương án khác:** hỏi ở bước Payout.

---

## 4. Việc làm được ngay, không cần quyết định

| # | Việc | Phạm vi | Kiểm tra |
|---|---|---|---|
| A1 | **Gắn version**: nhãn "v1.2" nhỏ trong panel Demo và trang matrix, cộng mục "Changelog" (v1.1 → v1.2) trong `onboarding-guide.md`. Gắn git tag `v1.1` cho `a6286a8` khi anh ra lệnh | `onboarding.js`, `onboarding-matrix.html`, `onboarding-guide.md` | Nhãn hiện ở 1440/390 |
| A2 | **Email đã có tài khoản**: ở bước Your account, email đã tồn tại thì hiện ngay "There is already an account on Agathos with this email address" + nút Log in, không gửi link. Đăng nhập xong vào màn chọn org/project | `onboarding.js` (viewAccount, sendLink) | Thử với `josias@antioch21.org` |
| A3 | **Scenario mới "Logged in, not verified yet"**: đã có tài khoản nhưng chưa xác minh gì. Thêm flow diagram cho scenario này | `onboarding.js`, `onboarding-flows.js` | Chọn từ panel Demo |
| A4 | **Nút "Open the link"**: đổi thành "Demo: open the link" để rõ đây là giả lập email. Reviewer đã hỏi nút này làm gì | `onboarding.js` | — |
| A5 | **Sửa chữ Step 1 khi đã đăng nhập**: bỏ "No account needed yet"; label tên đổi theo org hoặc cá nhân | `onboarding.js` | Owner → Start individual project |
| A6 | **Ô "Relationship to your past projects"**: thay bằng nút "Start from a past project" (điền sẵn câu chuyện và ảnh), vì ô chọn hiện tại không làm gì thấy được | `onboarding.js` | — |
| A7 | **Gợi ý ảnh** ở Project basics: mặt người, ánh sáng ấm, ảnh thật; kèm kích thước khuyến nghị (cần số từ production, mục 5) | `onboarding.js` | — |
| A8 | **Walkthrough cho team lead**: em tự đi hết các flow trên v1.1 (desktop + phone), ghi chỗ kẹt và chỗ khó hiểu, tập trung vào "structure", vào `docs/walkthrough-v1.1.md` | file mới, không sửa code | — |

Trả lời câu hỏi về magic link: em ghi vào file walkthrough (không phải code):
- Mở link chính là bước xác minh email.
- Link hết hạn thì xin link mới ở màn Log in.
- Có thể nghiên cứu thêm: mã OTP 6 số, đăng nhập Google, passkey.

---

## 5. Cần thông tin từ production (đang chặn)

1. Form **Create Organisation** hiện tại có những câu hỏi gì. Team muốn giữ nguyên câu hỏi.
2. Các trường của **project page** hiện tại (Intro, Background, Scope & activities…).
3. **Role và quyền** đang có trên Agathos (cho Q1, Q3).
4. **Kích thước ảnh** cover/gallery production đang dùng.
5. Nội dung email **kích hoạt** và **welcome** hiện tại (Rachel #7).

Anh gửi screenshot hoặc link các màn đó là đủ.

---

## 6. Ngoài phạm vi prototype — gợi ý cho team

- **Welcome email kèm link hướng dẫn**, tự gửi khi partner được duyệt (Rachel #6). Prototype có thể hiện bản xem trước email trong panel Demo. Gửi thật là việc của backend.
- **Đo tỉ lệ kích hoạt tài khoản** (Rachel #7): cần analytics trên production.
- **Nút "Create Event"** nên có ở menu chính hoặc trong Step 0, không chỉ nằm trong tab Join Event (Rachel #2).

---

## 7. Thứ tự làm

1. **A8 walkthrough** và **A1–A5**. Không cần chờ quyết định.
2. **D1–D4**, sau khi anh và team chốt. Có thể làm từng cái.
3. **A6, A7** và phần form/project page, sau khi có thông tin production (mục 5).

Mỗi bước kiểm tra như sau:
- Mọi scenario trong panel Demo mở đúng màn.
- Flow diagram khớp với luồng mới.
- Kiểm tra ở 1440px và 390px, console không có lỗi.
- `onboarding-guide.md` và `/onboarding-matrix` cập nhật theo.

Em không commit, push hay tag khi anh chưa ra lệnh riêng cho từng việc.

---

## 8. Nhật ký

**02/10/2026 — anh duyệt plan.** Thêm yêu cầu của Josias: có chỗ ghi version trên giao diện.

**02/10/2026 — Phase 1 xong, trên local, chưa commit.**
- **A8 walkthrough:** đi hết các flow trên bản live v1.1 (desktop + phone, cả 7 scenario và các mã thử). Kết quả ở `docs/walkthrough-v1.1.md`, viết tiếng Anh để gửi team.
- **A1 version:**
  - Chip "v1.2" luôn hiện trên viên thuốc Demo.
  - Dòng "Prototype v1.2 · 2 Oct 2026 · What's new" trong panel. "What's new" mở danh sách thay đổi v1.2 / v1.1 / v1.0.
  - Trang matrix có nhãn "Onboarding · v1.2".
  - `onboarding-guide.md` có mục "Lịch sử version".
- **A2:** email đã có tài khoản thì báo ngay "There is already an account on Agathos with this email address" và hiện nút Log in, không gửi link. Đăng nhập đúng tên theo email: `josias@antioch21.org` → Josias Ding.
- **A3:** scenario "Not verified yet", kèm flow diagram riêng.
- **A4:** nút "Demo: open the link →".
- **A5:** Step 1 khi đã đăng nhập không còn "No account needed yet". Label tên là "Organisation name" hoặc "Your name or group name".
- **A9 (thêm, phát hiện qua walkthrough, nhỏ, không cần quyết định):** gửi yêu cầu join org xong, Dashboard có mục org kèm pill "Request Sent", hạn trả lời, và nút Demo: approve.
- **Matrix:** ghi câu trả lời Q1–Q8 của team (02/10) dưới từng câu hỏi. Giải thích lại Q8, vì team không hiểu câu hỏi.
- **Đã kiểm tra:**
  - 8 scenario ở 1440 và 390, không cuộn ngang.
  - Flow diagram mở được cho cả 8.
  - Luồng email đã có tài khoản; luồng join org rồi Dashboard rồi approve.
  - Console không có lỗi.

**Còn lại:**
- **D1–D4:** chờ chốt.
- **A6, A7** và phần form/project page: chờ screenshot production (mục 5).

---

## 9. Thiết kế chi tiết D1–D4 (anh duyệt 02/10: "làm trọn vẹn")

Làm theo phương án mặc định ở mục 3.

**D1 — Step 0 và cấu trúc trang**
- **Step 0 "What would you like to do?"**: 3 thẻ.
  - **Raise funds for a cause**: Project, cho cá nhân hoặc tổ chức.
  - **Raise funds for your organisation**: org page kèm General fund cho chi phí vận hành.
  - **Host an event**: cho cá nhân hoặc tổ chức.
  - Dưới các thẻ có một câu giải thích cấu trúc: org page chứa mọi project và event của tổ chức, và nhận được tiền cho chi phí vận hành.
- **Ai thấy Step 0:** người mới (Sign Up, `/onboarding`) và người đã đăng nhập khi bắt đầu. Riêng "+ New project" ở Dashboard đi thẳng, không qua Step 0.
- **Xác minh là bước chung cho cả 3 lối vào.** Lối vào chọn ở Step 0 quyết định 4 thứ:
  - Kicker trên các màn.
  - Có hỏi "Who is raising" không. Lối Organisation thì không hỏi.
  - Màn chọn org hiện những dòng nào.
  - Duyệt xong thì đi đâu: Project proposal, org page, hay form event.
- **Org page:** tách khỏi xác minh. Dữ liệu dựng sẵn từ hồ sơ đã xác minh. Thêm giới thiệu ngắn, logo, bật General fund (nội dung tiền dùng vào việc gì, goal tùy chọn), rồi chọn Publish now / Schedule / Save as draft. Dashboard hiện thẻ "Organization page" ngay trên tab Projects.
- **Event:** prototype không dựng lại form Create Event của production. Có một màn chuyển tiếp nêu rõ "người tổ chức" và nút mở form Create Event hiện có.
- **Loại project:** bỏ "Tied to an event". Còn "One-time need" (có ngày kết thúc tùy chọn) và "Ongoing or recurring".

**D3 — Agathos duyệt từng Project**
- **Session 2 thành 5 bước:** Proposal → (Agathos duyệt + gọi điện) → Project page → Goal & needs → Team → Launch.
- **Proposal** gồm: tên project, tóm tắt (là gì, giúp ai), khoảng mục tiêu. Nút "Submit for review".
- **Dashboard:** card "In review", kèm "We'll contact you to schedule a call". Duyệt xong thành "Approved", kèm nút "Continue building".
- Không đưa ra cam kết thời gian duyệt project, vì Agathos chưa có SLA cho việc này.

**D4 — IPC**
- Bước Documents, khi nước đăng ký là Singapore: hỏi "Is your charity an IPC?".
- Chọn Yes thì bỏ bước Payout details. Review và hồ sơ org ghi "Payouts set up directly with AXS".

**D2 — Role**
- Org: **Owner / Manager**. Manager là Admin đổi tên, gộp luôn Collaborator. Bỏ Member, bỏ luồng xin quyền của Member, bỏ scenario "Collaborator or member".
- Project (bước Team): **Manager / Viewer**, cộng ô "Can request payouts" chỉ dành cho Manager.
- Trang matrix viết lại theo bộ role mới. Còn mở 2 câu: Owner khác Manager chỗ nào (team trả lời "theo production"), và tên "Manager" chờ team xác nhận.

**A6/A7 trong phạm vi có thông tin**
- Project page dùng các trường team đã nêu trong file feedback: Introduction, Background, Scope & activities. Danh sách đầy đủ chờ production.
- Gợi ý ảnh, chưa có kích thước.
- "Copy from a past project": chép phần giới thiệu và ảnh từ project cũ.

**02/10/2026 — D1–D4 và A6/A7 (trong phạm vi có thông tin) xong, trên local, chưa commit.**
- **D1:**
  - Step 0, kèm khung "How pages fit together".
  - Mọi thứ thay đổi theo lối vào đã chọn: kicker, có hỏi "Who is raising" không, danh sách org, và màn đi tới sau khi duyệt.
  - Trang tổ chức (`#/orgpage/<id>`): giới thiệu, logo, Donations for running costs, Publish / Schedule / Draft. Dashboard có thẻ "Organization page".
  - Màn chuyển sang form Create Event (`#/event/<host>`).
  - Bỏ "Tied to an event"; thêm ngày kết thúc tùy chọn cho One-time need.
- **D3:** bước Proposal và card "In review" / "Approved" trên Dashboard. Không vào được các bước dựng trang khi Proposal chưa duyệt. Launch cập nhật đúng project đã duyệt, không tạo project thứ hai.
- **D4:** câu hỏi IPC khi nước đăng ký là Singapore (bắt buộc). Chọn Yes thì bỏ bước Payout. Review và hồ sơ org ghi "Via AXS (IPC)". Danh sách "What's changed" ẩn mục ngân hàng với IPC.
- **D2:**
  - Owner / Manager cho org, Manager / Viewer cho project, kèm "Can request payouts".
  - Bỏ Member, màn xin quyền và scenario "Collaborator or member".
  - Trang matrix viết lại theo bộ role mới.
- **A6/A7:**
  - Project page có Introduction / Background / Scope & activities.
  - Gợi ý ảnh, chưa có kích thước.
  - "Start from a past project" chép giới thiệu và ảnh.
- **Flow diagrams:** viết lại cho 7 scenario.
- **Hướng dẫn và What's new:** cập nhật theo v1.2.
- **Lỗi phát hiện khi tự test, đã sửa:**
  - Lối Organisation: mở link email xong vẫn nhảy sang "Who is raising". Hàm mở link đang chuyển cố định sang bước `type`; đã sửa thành đi tới bước kế tiếp.
  - Khoảng mục tiêu ở Proposal không sang bước Goal khi duyệt trong cùng phiên.
  - Step indicator 4 bước trong modal bị rớt dòng trên phone.
- **Giả định cần team xác nhận:**
  - Event bắt buộc xác minh trước, theo comment Dashboard "Verify → new project or new event".
  - Tên "Manager".
  - Không ghi thời gian duyệt Proposal.
  - Câu hỏi IPC cũng hiện khi một tổ chức Singapore làm mới xác minh.
- **Đã kiểm tra:**
  - 7 scenario × 3 lối vào, ở 1440 và 390.
  - Đi trọn 3 lối của người mới (Cause đến launch; Organisation có IPC đến trang tổ chức đã hẹn ngày; Event cho cá nhân chưa xác minh).
  - Owner, Manager, cá nhân; Dashboard có sẵn dữ liệu (duyệt Proposal, copy từ project cũ, Manage Project của project đã hẹn ngày).
  - Luồng cập nhật payout, làm mới xác minh, cập nhật giấy tờ tùy thân.
  - 7 flow diagram; console không có lỗi.

**02/10/2026 — căn lại theo production (anh nhắc: "em đang tự chế fields hơi nhiều").**
- **Nguồn đối chiếu:**
  - Figma "Create Org page" (3 bước) và "PO | Create Event" (3 bước) anh gửi.
  - Các trang công khai trên agathos.be: danh sách cause ở Support a Cause, org page của The Treasure Box, project page "2026/2027 Operating Expenses" và "Championing Hope Together".
  - README của repo (các trường Project: title, type COMMUNITY/EMERGENCY, country, city, fundGoal, start, fundraisingEnd).
  - Không đọc được form production vì cần đăng nhập.
- **Xác minh tổ chức:** thay toàn bộ phần em tự đặt (About your cause, Documents, Contact & authority, Payout, Review cho tổ chức) bằng đúng 3 bước của form production, gồm cả câu chữ và các ô: Organization Details / Documents / Risk declaration. Submit ở Risk declaration, có ô xác nhận như production.
- **IPC:** dùng câu hỏi production có sẵn "Can you offer tax deductions to donors? (only for organizations incorporated in Singapore)", thay cho câu "Is your charity an IPC?" em tự thêm. Chọn Yes ở Singapore thì bỏ ô sao kê ngân hàng (thứ duy nhất liên quan payout mà production thu). Giả định cần xác nhận: khấu trừ thuế ở Singapore tương đương IPC.
- **Cause:** dùng danh sách thật (17 mục) trên agathos.be. **Quốc gia:** danh sách đầy đủ, bỏ mục "Other" em tự thêm.
- **Project page:** title, type (Community / Emergency), cause, country, city, Introduction / Background & Context / Scope & Activities. Đây là đúng các mục trên project page production.
- **Goal:** số tiền S$, để trống thì không đặt mục tiêu; production cho phép, như project Championing Hope Together hiện không có goal. Thêm ngày bắt đầu và ngày kết thúc.
- **Bỏ các trường production không có:** tình nguyện viên, vật phẩm, cột mốc, ô cho donate hằng tháng (production để donor tự chọn "Monthly Donation" lúc donate), "Start from a past project", "Tied to an event" / One-time / Ongoing.
- **Event:** bỏ yêu cầu xác minh (giả định cũ của em). Production cho tạo event trực tiếp, chỉ event có bán vé mới cần đăng ký cổng thanh toán với tài khoản ngân hàng doanh nghiệp.
- **Trang tổ chức:** nội dung lấy từ Organization Details. Chỉ thêm Banner Photo và Logo (org page production có hiển thị), quỹ chi phí vận hành (ý của Josias), và ngày xuất bản (Josias hỏi). Bỏ "Short introduction" và "Yearly goal" em tự thêm.
- **Bằng chứng cho D1:** The Treasure Box hiện gây quỹ chi phí vận hành bằng một project riêng, "2026/2027 Operating Expenses".
- **Cá nhân:** production chưa có flow riêng, nên vẫn theo flow spec. Vì vậy câu hỏi rút tiền (A1) và câu hỏi khớp tên chủ tài khoản (A2) giờ chỉ còn áp dụng cho cá nhân.
- **Còn thiếu từ production:**
  - Danh sách lựa chọn của "What is the size of your organization?" và "How did you come to know about Agathos?". Prototype để trống, kèm ghi chú.
  - Ô nào bắt buộc.
  - Đủ danh sách Project type.
  - Kích thước ảnh.

## 10. Nhóm lại form tổ chức + dựng Create Event (anh duyệt 02/10; phần Create Event không làm)

> **Anh chốt 02/10:** duyệt plan. Phần Create Event (10.3) **không dựng**, mục đích chỉ là để hiểu form. Prototype giữ nguyên như hiện tại: chọn người tổ chức → màn chuyển sang form Create Event có sẵn. Vì vậy D-B và D-C bỏ. D-A theo mặc định a (5 bước).

### 10.1 Hiện trạng (đo trên prototype)
- **Form tổ chức:**
  - Bước 1 (Organization Details) có 14 câu, 10 câu bắt buộc. Bước 2 có 4 ô, bước 3 có 3 câu.
  - Card bước 1 cao khoảng 1.450px trên desktop. Cả trang dài khoảng 3.800px trên phone (390).
- **Vấn đề:**
  1. Màn đầu tiên lại dài nhất, trong khi màn đầu là chỗ người dùng dễ bỏ nhất.
  2. Không báo trước cần giấy tờ gì. Tới bước 2 người dùng mới biết phải có giấy chứng nhận đăng ký bản tiếng Anh, báo cáo tài chính và sao kê, nên bỏ dở để đi tìm.
  3. Kiểm tra "tổ chức đã có trên Agathos" (theo số đăng ký) chạy ở bước 2, tức là sau khi người dùng đã điền xong 14 câu.
  4. Câu khấu trừ thuế hiện với mọi nước, dù câu hỏi ghi rõ chỉ cho tổ chức ở Singapore.
  5. "What countries does your organization operate in?" chỉ chọn được 1 nước, dù câu hỏi ở số nhiều.
  6. Câu khó nhất (giới thiệu 2000 từ) nằm lẫn với các câu dễ. Câu ít giá trị nhất ("How did you come to know about Agathos?") lại chặn ở cuối bước 1.
- **Event:** nút chỉ hiện toast, form chưa được dựng.

### 10.2 Form tổ chức: đề xuất
Giữ nguyên câu chữ của production, chỉ đổi nhóm và thứ tự.

| Bước | Câu hỏi | Số câu |
|---|---|---|
| 1. Organization | Organization Name; country incorporated; registered charity/non-profit; **registration number** (chuyển lên từ Documents); tax deductions (**chỉ hiện khi chọn Singapore**); size | 6 (5 nếu không phải Singapore) |
| 2. Contact | email; phone; address; website | 4 |
| 3. Causes | causes (tối đa 3); countries operate in (**chọn nhiều**); tell us more (2000); other giving platforms | 4 |
| 4. Documents | registration certificate; financial statements; bank statement (IPC không cần) | 3 (IPC: 2) |
| 5. Risk declaration | sanctions (chọn Yes thì ghi chi tiết); PEPs; How did you come to know about Agathos?; ô xác nhận; Submit | 4 |

Những thay đổi sau không thêm field nào:
- **Ô "Before you start" ở đầu bước 1:**
  - Liệt kê những gì cần có: số đăng ký, giấy chứng nhận đăng ký bản tiếng Anh, báo cáo tài chính hoặc báo cáo năm gần nhất, và sao kê ngân hàng có tên tài khoản (tổ chức ở Singapore cho khấu trừ thuế thì không cần sao kê).
  - Ghi rõ tiến độ được lưu tự động và có thể quay lại bằng link trong email.
- **Rail:** ghi số câu thật của từng bước ("6 questions", "3 files") thay cho phụ đề hiện tại.
- **Kiểm tra trùng tổ chức:** chạy khi bấm Next ở bước 1, nên người dùng không phải điền hết rồi mới biết.
- **Đổi nước:** chuyển từ Singapore sang nước khác thì xóa câu trả lời về khấu trừ thuế.
- **Ô giới thiệu 2000 từ:** thêm dòng "Also starts your organization page." Dòng này đúng với hành vi hiện tại: trang tổ chức lấy phần "Who we are" từ ô này.
- **Countries operate in:** cho chọn nhiều nước, dạng dropdown kèm tag giống ô cause trong Figma.
- **Update details:** checklist giữ 3 mục như hiện nay. Mục Organization details mở bước 1–3, hai mục còn lại là Documents và Risk declaration.

### 10.3 Create Event: dựng theo Figma "PO | Create Event"

**Bước 1: Build your event page**
- Event Title.
- Banner Photo, kèm ghi chú "You can edit your banner photo later".
- Type of Event: Public Event / Private - Unlisted With Password / Private - Unlisted Without Password.
- About Event: soạn thảo có định dạng, tối đa 5000 ký tự, kèm ghi chú "Include more information like Programme Details, Theme of the Event etc."
- Timezone; Start Time; End Time.
- Location: Street Address; Country; City; State/Province/Region (Optional); Postal Code (Optional).

**Bước 2: Add Tickets**
- Ticketing Type (Free Event / Paid Event) và Currency (For Tickets & Love Gift). Hai ô này chuyển xuống từ bước 1, xem D-B. Chọn Paid thì hiện nguyên văn cảnh báo về cổng thanh toán (PSP).
- Mỗi vé là một khối gập/mở (Ticket 1, 2…), có nút Remove, gồm:
  - Ticket Name.
  - Sale Start Time / Sale End Time.
  - Công tắc "Start sale of tickets as soon as Event page goes live". Bật thì khóa ô Sale Start.
  - Available Quantity; Price (S$).
  - Công tắc "Show remaining ticket quantity".
  - Description (tối đa 120 ký tự).
- Nút "+ Add Ticket".
- Dòng "Event Time: Start … End …" như trong Figma, để người dùng đặt giờ bán khớp với giờ sự kiện.

**Bước 3: Registration Form (optional)**
- Khi chưa có gì: nút "Create a Registration form". Có thể bỏ qua bước này.
- Chọn Ticket Buyer (Recommended) hoặc Each Attendee, câu mô tả giữ nguyên văn. Đổi qua lại không làm mất câu hỏi đã nhập.
- Mỗi câu hỏi gồm:
  - Question Prompt và "+ Add description".
  - Loại câu: Short Answer (max 200) / Long Answer (max 5000) / Single Choice / Checkboxes / Select From Dropdown.
  - Danh sách lựa chọn với "+ Add option" cho 3 loại có lựa chọn.
  - Công tắc Required; menu ⋮ với Duplicate / Delete Question.
- Nút "+ Add Question".

**Sau khi tạo:**
- Event hiện ở tab Events trên dashboard, dưới đúng người tổ chức, thay cho dòng "No events yet".
- Bỏ màn chuyển tiếp và toast hiện tại. Chọn người tổ chức xong là vào thẳng bước 1, tiêu đề ghi "Hosted by …".

**Cải thiện UX, không thêm field:**
- Bước 1 chia thành 3 nhóm có tiêu đề: About / When / Where.
- Vé mới mặc định bật "Start sale as soon as live", như trong Figma.
- Vé đang gập hiện tên · giá · số lượng.
- Event Free thì ẩn ô Price.

### 10.4 Quyết định cần anh chốt

**D-A: Nhóm form tổ chức**
- **a) 5 bước như 10.2 (em đề xuất).** Bấm Next thêm 2 lần so với hiện tại. Màn dài nhất còn 6 câu (hiện tại 14).
- **b) 4 bước, gộp Organization với Contact.** Bấm Next thêm 1 lần. Màn dài nhất còn 10 câu.
- **c) Giữ 3 bước như production.** Chỉ thêm tiêu đề nhóm, ô "Before you start" và câu thuế theo điều kiện. Không thêm lần bấm nào, nhưng màn đầu vẫn 14 câu (13 nếu không phải Singapore).

**D-B: Ticketing Type và Currency**
- **a) Chuyển sang bước Tickets (em đề xuất).** Bước 1 còn 12 ô. Bước vé gom đủ "free hay paid, giá bao nhiêu" ở một chỗ.
- **b) Giữ ở bước 1 như production.**

**D-C: Thông tin production còn thiếu.** Em làm theo mặc định dưới đây và ghi rõ đó là giả định.
1. Frame Step 2→3 có 4 chấm tiến độ. Bước 4 là gì? Mặc định: dựng 3 bước, nút cuối là "Create event".
2. Tạo xong thì event lên trang ngay hay phải chờ duyệt? Mặc định: lên ngay (Live). Nút Save giữ bản nháp.
3. Figma phần vé có 2 bản: bản cũ có Validity Start/End, bản mới (Step 2→3) không có. Mặc định: theo bản mới.
4. Với "Private - Unlisted With Password", mật khẩu được nhập ở đâu? Mặc định: để trống, kèm ghi chú "Answer to copy from the live form", giống ô size.
5. Có currency nào ngoài S$ SGD không? Mặc định: chỉ SGD.

### 10.5 Phạm vi theo file
- **`assets/onboarding.js`:**
  - Form tổ chức: `s1Steps` và 5 view; `matchOrg` chạy ở bước 1; cập nhật `UPDATE_LABELS`, `viewChanges`, `startUpdate`, `refresh`.
  - Event: state `S.ev`, 3 view và các ACT cho vé và câu hỏi.
  - Dashboard: tab Events và card event.
  - Điều hướng: `dashNewEvent`, `demoApprove` và màn entry chuyển thẳng vào form. Bỏ `viewEvent` và `openEventForm`.
  - CHANGELOG v1.2.
- **`assets/onboarding.css`:** ô "Before you start", tiêu đề nhóm, tag nước, khối gập/mở của vé, công tắc, khung câu hỏi, card event.
- **`assets/onboarding-flows.js`:** cập nhật node tổ chức (5 bước) và node event (3 bước) trong các flow new, fresh, ret1 và ret2.
- **`onboarding-guide.md`:** mục form tổ chức và mục Event.
- **Plan này:** ghi nhật ký.
- **Không đụng:** `onboarding-matrix.html`, luồng cá nhân, luồng project.
- **Version:** gộp vào v1.2 vì chưa push, không tăng lên v1.3.

### 10.6 Kiểm tra nghiệm thu
Kiểm tra ở cả 1440 và 390.
- **Tổ chức mới:**
  - Đi hết 5 bước, cả trường hợp có và không có IPC.
  - Chọn nước khác Singapore thì không thấy câu khấu trừ thuế.
  - Nhập T08SS0123A ở bước 1 rồi bấm Next thì hiện ngay modal "already on Agathos".
- **Update details:** tick từng mục thì đúng bước tương ứng hiện ra. Refresh verification mở Documents.
- **Event:**
  - Visitor: account → chọn người tổ chức → 3 bước → event có trong tab Events.
  - Đã đăng nhập: Dashboard → New event.
  - Thêm và xóa đến 3 vé. Chọn Free thì ẩn Price, chọn Paid thì hiện cảnh báo.
  - Registration form: đủ 5 loại câu, Duplicate và Delete hoạt động, đổi Buyer/Attendee vẫn giữ câu hỏi.
  - Bỏ qua bước 3 vẫn tạo được event.
  - Reload giữa chừng vẫn giữ nguyên dữ liệu.
- **Chung:** 7 flow diagram hiển thị đúng; console không có lỗi.

### 10.7 Nhật ký

**02/10/2026: làm xong 10.2 (form tổ chức 5 bước).**
- **Các bước:** Organization (5 câu, 6 nếu là Singapore) → Contact (4) → Causes (4) → Documents (3 file, IPC 2) → Risk declaration (3 câu rồi Submit). Câu chữ giữ nguyên như production.
- **Chuyển chỗ:**
  - Số đăng ký lên bước Organization.
  - Website sang bước Contact.
  - "How did you come to know about Agathos?" sang bước Risk declaration. Khi cập nhật thông tin thì câu này không hiện.
- **Thêm, không thêm field:**
  - Khung "Before you start".
  - Rail ghi số câu của từng bước.
  - Câu khấu trừ thuế chỉ hiện khi chọn Singapore, đổi nước thì câu trả lời bị xóa.
  - Nước hoạt động chọn được nhiều nước (tag).
  - Dòng "Also starts your organization page." dưới ô giới thiệu.
- **Kiểm tra trùng tổ chức:** chạy ở Next của bước Organization.
- **Lỗi cũ sửa luôn vì cùng chỗ:**
  - "It's a different organisation" trong modal trùng đang gọi bước `docs` của luồng cá nhân, nên đẩy người dùng về bước đầu.
  - "Start a separate application" ở màn Request to join đang dẫn sang bước Contact của luồng cá nhân.
  - Giờ cả hai đi tiếp sang bước Contact của tổ chức.
- **Update details:** checklist vẫn 3 mục. "Organization details" mở 3 bước, câu mô tả sửa lại vì số đăng ký đã chuyển chỗ. Mục "Registration or documents" đổi thành "Documents".
- **Dữ liệu mẫu:** Antioch21 và Treasure Box có thêm số đăng ký. Nước hoạt động chuyển sang dạng danh sách (Antioch21: Singapore, Iraq).
- **Đã kiểm tra:**
  - Người mới đi trọn lối Organisation qua 5 bước tới trang tổ chức. Câu thuế ẩn/hiện đúng, rail đổi 5↔6 câu và 3↔2 file.
  - Mã T08SS0123A hiện modal ngay ở bước 1. T21SS0456B → Request to join → Start a separate application → bước Contact.
  - Validate từng bước. Thêm và xóa tag nước.
  - Update details (Organization details; Documents + Risk), Refresh verification, cập nhật ID của cá nhân, người đã đăng nhập "Add an organisation".
  - Flow diagram New visitor.
  - Phone 390 không bị cuộn ngang. Trang bước 1 trên phone dài 2.299px (trước đây 3.794px).
  - Console không có lỗi.
- **Không đụng:** Create Event, `onboarding-matrix.html`, luồng cá nhân, luồng project.
