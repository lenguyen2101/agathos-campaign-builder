# Onboarding — hướng dẫn nhanh

Cập nhật: 25/09/2026 · Bản đang chạy: `/onboarding` · Ma trận quyền: `/onboarding-matrix`

Nguồn gốc: flow spec và Figma handoff (Draft 1, 16/09/2026), cộng với feedback "Onboarding Flow Comments Draft 1".

---

## 1. Onboarding để làm gì?

Muốn gây quỹ trên Agathos, người dùng phải **được xác minh trước**, sau đó mới tạo và launch Project. Onboarding là con đường từ lúc một người lạ vào trang đến lúc Project của họ lên live.

Ý quan trọng nhất: **xác minh gắn với tổ chức (hoặc cá nhân), không gắn với Project.** Đã xác minh một lần thì các Project sau đi thẳng vào bước tạo Project, không phải nộp lại giấy tờ.

---

## 2. Mô hình: 2 phiên và 1 luồng cho người quay lại

```
NGƯỜI MỚI                              NGƯỜI QUAY LẠI (đã login)
Phiên 1 – Xác minh (7 bước)            Có bao nhiêu org?
   ↓ submit                              0 → chọn: thêm org / làm cá nhân
Agathos duyệt tay (1–2 ngày)             1 → vào thẳng màn của org đó
   ↓ duyệt xong                          2+ → chọn org trong danh sách
Phiên 2 – Tạo Project & launch (4 bước)      ↓ tuỳ role
   ↓                                     Owner/Admin → xác nhận thông tin → Phiên 2
Live / hẹn giờ / nháp                    Collaborator → Phiên 2
                                         Member → xin quyền
```

---

## 3. Phiên 1: Xác minh (người mới)

Làm một lèo, khoảng 10 phút. Mọi thứ tự lưu, bỏ ngang thì quay lại bằng link trong email.

1. **About your cause**: tên, loại hoạt động, quốc gia, gây quỹ cho việc gì. Bước này chưa cần tài khoản.
2. **Your account**: nhập email, nhận link đăng nhập, không cần mật khẩu. Tài khoản được tạo sớm để người dùng bỏ ngang vẫn quay lại được. Nếu email đã có tài khoản thì hệ thống đăng nhập luôn và chuyển sang luồng người quay lại.
3. **Who is raising**: tổ chức từ thiện đã đăng ký, hay cá nhân / nhóm tự phát. Lựa chọn này quyết định bước 4 hỏi giấy tờ gì.
4. **Documents**: bước giấy tờ duy nhất.
   - Tổ chức: tên pháp lý, số đăng ký, giấy chứng nhận, giấy miễn thuế, báo cáo tài chính (có thể nộp sau), website.
   - Cá nhân ("Verify your identity"): họ tên, giấy tờ tùy thân, giấy tờ chứng minh địa chỉ, thư hỗ trợ (tùy chọn).
   - Ở bước này hệ thống kiểm tra trùng tổ chức:
     - Tổ chức **đã xác minh** trên Agathos → mời "Request access". Người liên hệ chính được báo; khi họ duyệt, người dùng thành Collaborator và không phải xác minh lại.
     - Tổ chức **đang có đơn khác** → "Request to join". Bên kia có 5 ngày để trả lời, quá hạn thì team Agathos xử lý. Có lối thoát "It's a different organisation".
5. **Contact & authority**: người liên hệ, và ai được quyền yêu cầu rút tiền.
6. **Payout details**: tài khoản ngân hàng. Tên chủ tài khoản phải khớp tên pháp lý; không khớp thì hiện cảnh báo nhưng vẫn cho gửi. Số tài khoản bị che sau khi nhập.
7. **Review & submit**: xem lại toàn bộ, sửa được từng phần, rồi gửi. Agathos duyệt trong 1–2 ngày làm việc.

User đã login và đã chọn "Add an organisation" hoặc "Start an individual project" thì không phải qua lại bước 2 và bước 3.

---

## 4. Phiên 2: Tạo Project và launch

Phiên này tách riêng có chủ đích: sau khi được duyệt, người dùng có thời gian chuẩn bị nội dung cho kỹ.

1. **Project basics**: tên, câu chuyện, ảnh, loại Project (một lần / định kỳ / theo sự kiện). Chọn "theo sự kiện" thì hỏi thêm ngày.
2. **Goal & needs**: tất cả đều tùy chọn.
   - Mục tiêu: chọn khoảng, số chính xác, hoặc "Not sure yet" (không đặt mục tiêu).
   - Cột mốc ("S$5,000 giữ trại mở 3 tháng") thay cho con số cứng.
   - Xin tình nguyện viên, xin vật phẩm.
   - Cho phép quyên góp hằng tháng.
3. **Team**: mời người qua email với 3 role Editor / Viewer / Withdrawal-authorised. Lỡ gõ email mà chưa bấm Invite thì hệ thống nhắc trước khi Continue.
4. **Launch**: 3 lựa chọn ngang nhau.
   - **Go live now**: lên live ngay, có link để chia sẻ.
   - **Schedule**: hẹn ngày giờ, nhắc trước 24 giờ.
   - **Draft**: lưu nháp, nhắc vào ngày 3, 7 và 14 để Project không bị bỏ quên.

---

## 5. Người quay lại: chia luồng theo số org và role

- **Màn "Ready when you are"** (Owner/Admin):
  - Trên cùng là thanh "Raising for [Org]", kèm link chuyển sang làm Project cá nhân.
  - Step indicator: Confirm details → Build → Launch.
  - Huy hiệu "Verified since…" và các thông tin đã xác minh (số đăng ký, người liên hệ, tài khoản nhận tiền, ngày hết hạn).
  - Ô **"These details are still accurate"**: phải tick mới bắt đầu Project được. Spec cố tình giữ chút "ma sát" này để donor tin nền tảng.
- **Có gì thay đổi** (ngân hàng, đăng ký, người liên hệ): người dùng tick vào danh sách "What's changed". Chỉ phần đã tick mở lại để duyệt nhanh, thường trong ngày, và họ vẫn tạo Project song song.
- **Xác minh sắp hết hạn** (còn dưới 30 ngày): hiện banner nhắc làm mới trước khi hết hạn.
- **Collaborator**: thấy một màn ngắn có nút "Start a new project", không cần tick xác nhận. Xác minh và payout là việc của owner.
- **Member**: chưa có quyền, bấm "Request access" và chờ owner duyệt. Duyệt xong thì thành Collaborator.
- **Cá nhân đã xác minh**: màn tương tự màn của org, có huy hiệu cảnh báo khi giấy tờ tùy thân sắp hết hạn.

---

## 6. Dashboard (Manage Pages)

Dựng theo tab **Manage Pages** của trang tài khoản trên Agathos hiện tại. Mở bằng cách bấm avatar trên thanh menu.

- **Thanh tab con**: My Dashboard / Contributions / Tickets / Transactions Log / Manage Pages. Trong prototype chỉ Manage Pages hoạt động.
- **Cột trái**: Personal và từng Organization của tài khoản. Đơn đang chờ duyệt hiện kèm pill **Submission Received**.
- **Cột phải** (của mục đang chọn):
  - Tên org, pill role (Owner, Admin, Collaborator, Member), nút **Actions ⋮** (Organization details, Update details, Refresh verification khi sắp hết hạn).
  - Tab **Projects / Events** và nút **+ New project**. Member không có nút này, thay vào đó là link Request access.
  - Card Project: badge trạng thái (Ongoing, Completed, Scheduled, Draft), link Manage Project, ô số liệu (ngày bắt đầu, Public/Private, số tiền, số lượt đóng góp, thanh tiến độ, % so với mục tiêu).
  - Project đã hẹn giờ hoặc đang nháp có nút **Publish now** và các mốc nhắc ngày 3, 7, 14.
- **New project** từ dashboard đi thẳng vào Phiên 2 (đúng spec: Project mới luôn bắt đầu từ bước tạo Project). Với Personal chưa xác minh, New project sẽ bắt đầu xác minh cá nhân trước.

---

## 7. Tự bấm thử khoảng 15 phút

Mở `/onboarding` và bấm nút **Demo** (viên thuốc ở góc dưới trái). Các scenario chia làm 3 nhóm:

**Not logged in**
1. **New visitor**: đi hết Phiên 1. Ngay dưới dòng này có khối "Try in the forms":
   - `josias@antioch21.org` ở bước tạo tài khoản: email đã có tài khoản.
   - `T08SS0123A` ở bước Documents: tổ chức đã xác minh.
   - `T21SS0456B` ở bước Documents: tổ chức đang có đơn khác.
   - Submit xong, bấm "Demo: approve now" để giả lập đã được duyệt.

**Logged in · starting a project** (đăng nhập là Adam Le)
2. **Owner of one organisation**: vào thẳng màn "Ready when you are" của Antioch21. Tick ô xác nhận, bấm Start a new project, đi hết Phiên 2.
3. **In two organisations**: xem màn chọn org.
4. **Individual, already verified**: không có org, làm Project cá nhân mà không phải nộp lại giấy tờ.
5. **Collaborator or member**: so sánh Collaborator (tạo Project được) với Member (phải xin quyền).

**Logged in · other states**
6. **Verification expiring**: xem banner nhắc làm mới.
7. **Project awaiting publish**: xem dashboard có Project đã hẹn giờ và các mốc nhắc.

Trong panel Demo còn có:
- **Flow diagram**: sơ đồ luồng của từng scenario.
- **View matrix**: ai có quyền gì (`/onboarding-matrix`).
- **Reset scenario**: làm lại scenario hiện tại từ đầu.

Prototype lưu mọi thứ trong trình duyệt, nên đóng tab rồi mở lại vẫn ở đúng chỗ cũ.

---

## 8. Đã sửa theo feedback Draft 1

- User đã đăng nhập không còn bị hỏi lại "Your account" và "Who is raising".
- User có 1 org vào thẳng màn của org, có thanh "Raising for…" và step indicator (bám handoff Diagram 1c).
- Bước Team nhắc khi có email đã gõ mà chưa mời; người đã mời hiện "Invite sent".
- Bước "Verify your identity" bỏ câu hỏi cách dùng tiền, vì Step 1 đã hỏi.

---

## 9. Còn chờ team quyết

| Việc | Ai quyết |
|---|---|
| Có cần field "ai được rút tiền" ở Contact & authority không | Partnerships |
| Tên chủ tài khoản có bắt buộc khớp tên tổ chức không, có ngoại lệ nào | Regulation |
| Có cho gây quỹ không đặt mục tiêu ("Not sure yet") không | Business |
| Roles & permissions: 8 câu hỏi ở `/onboarding-matrix` | Product / Partnerships / Compliance |
| Luồng mời thành viên (email mời → đăng ký → vào Project theo role) | Chờ chốt roles |
