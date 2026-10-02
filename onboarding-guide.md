# Onboarding — hướng dẫn nhanh

Cập nhật: 02/10/2026 · **Version v1.3** · Bản đang chạy: `/onboarding` · Ma trận quyền: `/onboarding-matrix`

Version hiện ở viên thuốc Demo (chip "v1.3"). Bấm "What's new" trong panel Demo để xem thay đổi của từng version.

Nguồn gốc: flow spec và Figma handoff (Draft 1, 16/09/2026), feedback "Onboarding Flow Comments Draft 1", và feedback 02/10/2026 (kèm ghi chú của Rachel). Plan và nhật ký: `docs/onboarding-feedback-0210-plan.md`.

---

## 1. Onboarding để làm gì?

Đưa một người từ lúc vào trang tới lúc có **Project**, **trang tổ chức** hoặc **Event** trên Agathos.

Hai ý quan trọng nhất:
- **Xác minh gắn với tổ chức (hoặc cá nhân), làm một lần.** Project, trang tổ chức và event đều dựa trên lần xác minh đó.
- **Mỗi Project đều được Agathos duyệt và gọi điện trao đổi** trước khi dựng trang, đúng quy trình Rachel đang làm.

### Pain points của team partnership: giải quyết tới đâu

Ký hiệu: ✅ giải quyết · 🟡 một phần. Đây là đánh giá trên prototype v1.3; production chưa đổi gì.

| # | Pain point (Rachel, Josias) | | Cách xử lý |
|---|---|---|---|
| R1 | Partner không biết bắt đầu Project từ đâu | ✅ | Nút "+ Create" trên nav → Step 0 → Raise funds for a cause → Proposal |
| R2 | Create Event chỉ nằm trong tab Join Event | ✅ | "+ Create" → Step 0 → Host an event |
| R3 | Partner rành tự lập org và nộp hồ sơ thẩm định | ✅ | Form org 5 bước ngắn, khung "Before you start", kiểm tra trùng sớm |
| R4 | Lập org xong không biết làm gì tiếp, phải email Rachel; chị vẫn cần thẩm định và gặp | ✅ | Duyệt xong vào thẳng Proposal → "We'll contact you to schedule a call" |
| R5a | Phần Personal / Org Page trong Manage Pages gây rối | 🟡 | Có sơ đồ "How pages fit together" ở Step 0, nhưng cấu trúc Manage Pages vẫn giống production |
| R5b | Org page ít giá trị | ✅ giao diện | Nhận donate cho chi phí vận hành. Team chưa chốt cách nhận tiền ở backend |
| R5c | Nhập thông tin tổ chức hai lần | ✅ giao diện | Org page lấy sẵn từ thông tin đã xác minh |
| R6 | Guide phải gửi tay | 🟡 | Email chào mừng tự gửi khi được duyệt, kèm guide (mới là bản xem trước; link guide chưa có) |
| R7 | Email kích hoạt; không rõ tỉ lệ kích hoạt | 🟡 | Bản xem trước email kích hoạt. Đo tỉ lệ là việc của analytics |
| J1 | Gắn tên version | ✅ | Chip version và What's new |
| J2 | Tự đi thử các flow | ✅ | `docs/walkthrough-v1.1.md` |
| J3 | Cấu trúc project / org / event chưa rõ | ✅ | Ai cũng tới được Step 0 và sơ đồ cấu trúc |
| J4 | Mời phản biện | ✅ | General fund, IPC, gộp role |

---

## 2. Bức tranh chung

```
"+ Create" trên nav (mọi trang) hoặc ở Manage Pages
        ↓
STEP 0 — "What would you like to do?"
  ├─ Raise funds for a cause      → Project (cá nhân hoặc tổ chức)
  ├─ Raise funds for your organisation → Trang tổ chức + quỹ chi phí vận hành
  └─ Host an event                → Event (cá nhân hoặc tổ chức)
        ↓
XÁC MINH (một lần, chỉ cho Cause và Organisation), Agathos duyệt 1–2 ngày
  Tổ chức: đúng câu hỏi của form Create Organization trên production, chia 5 bước ngắn
  Cá nhân: các bước theo flow spec
        ↓ duyệt xong, đi tiếp theo lối đã chọn
  Cause  → Project proposal → Agathos duyệt + gọi → dựng trang → launch
  Org    → Dựng trang tổ chức → Publish / hẹn ngày / nháp
Event  → không cần xác minh (giống production): chọn người tổ chức → form Create Event có sẵn
```

Dưới 3 lựa chọn ở Step 0 có khung **"How pages fit together"**: trang tổ chức chứa các Project, Event và quỹ chi phí vận hành; cá nhân thì có Project và Event.

Người đã đăng nhập cũng bắt đầu ở Step 0. Sau đó họ thấy danh sách org của mình, kèm "Add an organisation" (và "cá nhân" với lối Cause và Event).

### Vào Step 0 từ đâu (v1.3)

| Chỗ | Nút | Đi đâu |
|---|---|---|
| Nav, ở mọi trang, đăng nhập hay chưa | **+ Create** (trên phone: dòng đầu menu ☰) | Step 0 |
| Manage Pages | **+ Create** ở đầu cột trái | Step 0 |
| Footer → Get Started | Start a Project / Register an Organization / Host an Event | **Bỏ qua Step 0**, vào thẳng lối tương ứng, vì người dùng đã biết mình muốn tạo gì |
| Manage Pages, trong từng org | New project / New event | Vào thẳng form, như trước |

- **Log In / Sign Up:** gộp thành một nút để nav có chỗ cho "+ Create". Đăng ký ở đây vẫn là đăng ký tài khoản thường, dành cho donor.
- **Đang làm dở:** người đã bắt đầu xác minh mà chưa nộp, khi quay lại Step 0 sẽ thấy dòng "Continue where you left off". Chọn lại đúng lối cũ cũng được đưa về bước đang làm, không mất dữ liệu.
- **Không còn modal bắt đăng nhập:** người chưa đăng nhập tạo tài khoản ở bước "Your account" ngay sau Step 0 (email → link → tự đăng nhập).

**Lộ trình gợi ý cho production:**
- **Giai đoạn 1:** thêm "+ Create" trên nav và ở Manage Pages, cùng email chào mừng kèm guide.
- **Giai đoạn 2:** Create Organization (tab Organizations) và Create Event (trang Join an Event) vào thẳng lối của chúng, bỏ modal Log In / Sign Up. Tab Projects có thêm "+ Start a Project".

---

## 3. Xác minh (người mới)

Mọi thứ tự lưu, bỏ ngang thì quay lại bằng link trong email.

1. **Your account**: nhập email, nhận link đăng nhập, không cần mật khẩu. Nếu email đã có tài khoản, hệ thống báo ngay "There is already an account on Agathos with this email address" và mời **Log in**. Đăng nhập xong, user thấy danh sách org theo đúng lối đã chọn. Lối Event chỉ có bước này.
2. **Who is raising**: tổ chức hay cá nhân. Lối Organisation bỏ qua bước này.

**Tổ chức**: giữ nguyên câu hỏi và câu chữ của form "Create Organization Page" trên production. Production có 3 bước, trong đó bước đầu dài 14 câu. Prototype chia lại thành 5 bước ngắn: câu dễ trước, phần viết và nộp file để sau. Rail ghi mỗi bước có bao nhiêu câu.
- **Organization**:
  - Đầu bước có khung "Before you start" liệt kê giấy tờ cần chuẩn bị.
  - Các câu hỏi: tên; nước đăng ký; có phải charity/non-profit đã đăng ký không; số đăng ký; quy mô tổ chức.
  - Câu khấu trừ thuế chỉ hiện khi chọn Singapore. Đổi sang nước khác thì câu trả lời bị xóa.
  - Bấm Next là hệ thống kiểm tra trùng tổ chức ngay. Đã xác minh thì hiện "Request access"; đang có đơn khác thì hiện "Request to join" (5 ngày để trả lời). Nhờ vậy người dùng không phải điền hết form rồi mới biết.
- **Contact**: email; số điện thoại; địa chỉ; website.
- **Causes**:
  - Cause: tối đa 3, theo danh sách thật trên agathos.be.
  - Nước hoạt động: chọn được nhiều nước, mỗi nước hiện thành một tag.
  - Giới thiệu về cause (2000): đoạn này cũng là phần mở đầu của trang tổ chức.
  - Các nền tảng gây quỹ khác (500).
- **Documents**: giấy chứng nhận đăng ký (tiếng Anh); báo cáo tài chính hoặc báo cáo năm gần nhất; sao kê ngân hàng. Tổ chức ở Singapore chọn "có cho khấu trừ thuế" (tức là IPC) thì **không phải nộp sao kê ngân hàng**, vì payout thiết lập trực tiếp với AXS.
- **Risk declaration**: có lệnh trừng phạt hoặc tin tức tiêu cực không (Yes thì ghi chi tiết); có người có ảnh hưởng chính trị (PEP) không; "How did you come to know about Agathos?"; ô xác nhận; Submit.
- **Update details**: mục "Organization details" mở lại 3 bước Organization, Contact và Causes. Mục Documents và mục Risk declaration mỗi mục mở 1 bước.

**Cá nhân**: production chưa có flow riêng, nên vẫn theo flow spec: About your cause → Verify your identity → Contact & authority → Payout details → Review & submit.

Màn "Thank you" ghi 3 bước tiếp theo, đúng theo lối đã chọn.

---

## 4. Project: Proposal trước, dựng trang sau

1. **Proposal**: project title, cause, country, tóm tắt (là gì, giúp ai), mục tiêu dự kiến (S$, tùy chọn). Bấm "Submit for review".
   - Dashboard hiện card **"In review"**, kèm dòng "We'll contact you to schedule a call".
   - Agathos duyệt xong, card thành **"Approved"**, có nút "Continue building".
2. **Project page**: các trường một project trên production có:
   - Title, type (Community / Emergency), cause, country, city.
   - **Introduction**, **Background & Context**, **Scope & Activities**: đúng 3 mục trên project page của agathos.be.
   - Ảnh, kèm gợi ý: mặt người, ánh sáng tự nhiên ấm, không ảnh stock, không chữ trên ảnh.
3. **Goal & dates**: mục tiêu S$ (để trống là gây quỹ không đặt mục tiêu, production đang cho phép), ngày bắt đầu, ngày kết thúc. Mục tiêu dự kiến ở Proposal được điền sẵn.
4. **Team**: mời qua email với role **Manager** hoặc **Viewer**. Manager có thể được bật thêm quyền **"Can request payouts"**.
5. **Launch**: Go live now / Schedule / Save as draft. Bản nháp và bản hẹn ngày có nhắc vào ngày 3, 7, 14.

---

## 5. Trang tổ chức (Organisation page)

- Tách khỏi xác minh. Nội dung lấy từ Organization Details: cause, website, email, điện thoại, và "Who we are" (từ phần giới thiệu về cause). Không phải nhập lại.
- Thêm Banner Photo và Logo, như org page trên production đang hiển thị.
- **Donations for running costs**: bật lên thì trang có nút Donate cho chi phí vận hành, ghi rõ tiền dùng vào việc gì. Hiện partner phải tạo hẳn một project cho việc này, ví dụ "2026/2027 Operating Expenses" của The Treasure Box.
- Chọn Publish now / Schedule a date / Save as draft. Trang đã live thì chỉ còn nút "Save changes".
- Dashboard hiện thẻ **"Organization page"** (Not set up / Draft / Scheduled / Live), kèm số tiền chi phí vận hành đã nhận.

---

## 6. Người quay lại và role

- **Role chỉ còn Owner / Manager** cho tổ chức (Manager = Admin cũ + Collaborator cũ), và **Manager / Viewer** cho project. Không còn Member.
- **Lối Cause**: chọn org → **modal xác nhận thông tin** ("Are these details still accurate?").
  - Yes, continue → Proposal.
  - Something changed → chỉ mở lại phần đã tick để duyệt nhanh, thường trong ngày.
- **Lối Organisation**: chọn org → trang tổ chức.
- **Lối Event**: chọn org hoặc "Host as an individual" → màn chuyển sang form Create Event có sẵn (Build your event page → Add Tickets → Registration Form). Không cần xác minh. Event có bán vé thì cần đăng ký với cổng thanh toán, và chỉ tài khoản ngân hàng doanh nghiệp mới làm được. Prototype không dựng lại form này.
- **Cá nhân đã xác minh**: "Continue as [tên]" cho Project, hoặc "Host as [tên]" cho Event.
- **Xác minh sắp hết hạn** (dưới 30 ngày): banner nhắc làm mới, hiện cả ở Step 0.

---

## 7. Dashboard (Manage Pages)

Dựng theo tab Manage Pages của trang tài khoản trên Agathos. Mở bằng cách bấm avatar trên thanh menu.

- **Cột trái**: Personal và từng Organization.
  - Đơn xác minh đang chờ có pill **Submission Received**.
  - Yêu cầu join org đang chờ có pill **Request Sent**, kèm hạn trả lời.
- **Cột phải** (của org đang chọn):
  - Tên org, pill role, nút Actions ⋮ (Organization page, Organization details, Update details, Refresh verification).
  - Thẻ **Organization page**.
  - Tab **Projects / Events**, kèm "+ New project" / "+ New event".
- **Card project** theo trạng thái: In review · Approved · Draft · Scheduled · Ongoing · Completed.

---

## 8. Tự bấm thử

Mở `/onboarding`, bấm nút **Demo** (góc dưới trái):

**Đường vào:** bấm "+ Create" trên nav (hoặc ở Manage Pages) để mở Step 0. Ba link ở footer đi thẳng vào từng lối.

**Email xem trước:** trong panel Demo, dòng "Email previews" có 2 nút. "Sign-in link" mở email có link đăng nhập. "Welcome" mở email chào mừng gửi khi được duyệt; đổi được bước tiếp theo giữa 3 lối (project, trang tổ chức, event).

**Not logged in**
1. **New visitor**: chọn một lối ở Step 0 rồi đi hết phần xác minh. Khối "Try in the forms" có các mã thử:
   - `josias@antioch21.org`: email đã có tài khoản.
   - `T08SS0123A`: tổ chức đã xác minh. Nhập ở ô số đăng ký, bước Organization.
   - `T21SS0456B`: tổ chức đang có đơn khác.
   - Lối Organisation: chọn Singapore thì câu "Can you offer tax deductions to donors?" mới hiện. Chọn Yes thì ô sao kê ngân hàng biến mất ở bước Documents.
   - Submit xong, bấm "Demo: approve now". Hệ thống đi tiếp theo lối đã chọn: Proposal, trang tổ chức, hoặc form Event.

**Logged in · starting something** (đăng nhập là Adam Le)
2. **Not verified yet**: có tài khoản nhưng chưa xác minh gì.
3. **Owner of one organisation**: thử cả 3 lối với Antioch21.
4. **In two organisations**: Owner của Antioch21, Manager của The Treasure Box.
5. **Individual, already verified**: Project hoặc Event với tư cách cá nhân, không nộp lại giấy tờ.

**Logged in · other states**
6. **Verification expiring**: banner nhắc làm mới.
7. **Project awaiting publish**: Dashboard có đủ trạng thái:
   - Một project "In review": bấm "Demo: approve" rồi dựng trang.
   - Một project đã hẹn ngày.
   - Một project đang chạy.
   - Trang tổ chức đang live, kèm quỹ chi phí vận hành.

Trong panel Demo còn có: **What's new** (lịch sử version), **Flow diagram** (sơ đồ từng scenario), **View matrix** (ai làm được gì), **Reset scenario** (làm lại từ đầu). Prototype lưu mọi thứ trong trình duyệt, nên đóng tab rồi mở lại vẫn ở đúng chỗ cũ.

---

## 9. Lịch sử version

Bản tiếng Anh cho team nằm ở "What's new" trong panel Demo.

**v1.3 — 02/10/2026** (đường vào Step 0)
- Nút "+ Create" trên nav ở mọi trang, đăng nhập hay chưa, mở Step 0. Có thêm nút cùng tên ở Manage Pages.
- Link ở footer (Start a Project, Register an Organization, Host an Event) bỏ qua Step 0, vào thẳng lối tương ứng.
- Step 0 có dòng "Continue where you left off" khi đang xác minh dở.
- Bản xem trước 2 email trong panel Demo: email có link đăng nhập, và email chào mừng khi được duyệt (kèm bước tiếp theo và guide). Nội dung là bản nháp chờ team duyệt.
- Gộp Log In và Sign Up thành một nút "Log In / Sign Up".

**v1.2 — 02/10/2026** (theo feedback 02/10)
- Step 0 với 3 lối vào, kèm khung "How pages fit together".
- Xác minh tổ chức dùng đúng câu hỏi của form Create Organization trên production, chia thành 5 bước ngắn: Organization, Contact, Causes, Documents, Risk declaration. Danh sách cause lấy từ agathos.be.
- Khung "Before you start" liệt kê giấy tờ cần chuẩn bị. Số đăng ký được hỏi ngay ở bước đầu, nên tổ chức đã có trên Agathos bị phát hiện trước khi người dùng điền tiếp.
- Câu khấu trừ thuế chỉ hiện với tổ chức ở Singapore. Tổ chức cho khấu trừ thuế (IPC) không phải nộp sao kê ngân hàng.
- Mỗi Project bắt đầu bằng Proposal; Agathos duyệt và gọi điện rồi mới dựng trang.
- Project page dùng các trường production: title, type, cause, country, city, Introduction / Background & Context / Scope & Activities, mục tiêu và ngày. Có gợi ý ảnh.
- Bỏ các trường production không có: tình nguyện viên, vật phẩm, cột mốc, ô cho donate hằng tháng.
- Trang tổ chức tách khỏi xác minh, nội dung lấy từ Organization Details; thêm banner, logo, quỹ chi phí vận hành, ngày xuất bản.
- Event: chọn người tổ chức rồi mở form Create Event có sẵn; không cần xác minh, giống production.
- Role gộp thành Owner / Manager / Viewer, kèm quyền payout theo từng người; bỏ Member.
- Email đã có tài khoản được báo ngay, kèm Log in (vẫn giữ lối đã chọn).
- Scenario "Not verified yet"; nút "Demo: open the link"; chữ Step 1 đúng với người đã đăng nhập; Dashboard hiện yêu cầu join đang chờ.
- Nhãn version và "What's new"; trang matrix viết lại theo câu trả lời của team.

**v1.1 — 25/09/2026** (theo feedback Draft 1)
- User đã đăng nhập không bị hỏi lại "Your account" và "Who is raising".
- User 1 org thấy cùng màn chọn org như user 2+ org.
- Xác nhận thông tin org bằng modal khi bắt đầu Project.
- Bước Team nhắc khi email đã gõ mà chưa mời.
- Bỏ câu hỏi trùng về cách dùng tiền ở "Verify your identity".
- Dashboard dựng lại theo Manage Pages; scenario Demo chia nhóm; flow diagram; trang matrix.

**v1.0 — 18/09/2026**
- Bản prototype onboarding đầu tiên.

---

## 10. Còn chờ team hoặc production

| Việc | Ai quyết / cần gì |
|---|---|
| Có cần field "ai được rút tiền" ở Contact & authority không | Partnerships |
| Tên chủ tài khoản có bắt buộc khớp tên tổ chức không, có ngoại lệ nào | Regulation |
| Có cho gây quỹ không đặt mục tiêu ("Not sure yet") không | Business |
| Tên "Manager"; Owner khác Manager chỗ nào; có cần role payout riêng | Product (xem `/onboarding-matrix`) |
| "Can you offer tax deductions to donors?" = Yes (Singapore) có đúng là IPC, và IPC có bỏ sao kê ngân hàng không | Partnerships / Regulation |
| Danh sách lựa chọn cho "What is the size of your organization?" và "How did you come to know about Agathos?" | Copy từ form production |
| Các trường bắt buộc trên form production; danh sách đầy đủ của Project type (mới thấy Community, Emergency); kích thước ảnh | Cần xác nhận từ production |
| Nội dung 2 email (kích hoạt, chào mừng) là bản nháp của prototype; link guide chưa có (Rachel #6, #7) | Team duyệt nội dung; Rachel gửi link guide; gửi thật là việc của backend |
| Thêm "+ Create" vào nav production (giai đoạn 1); Create Org / Create Event bỏ modal đăng nhập (giai đoạn 2) | Product / Engineering |
| Luồng mời thành viên (email mời → đăng ký → vào project theo role) | Làm sau khi chốt role |
