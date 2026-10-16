# Onboarding — feedback 16/10/2026: v1.4

Nguồn: file "Onboarding Flow Comments.docx" (để ở thư mục gốc repo, chưa đưa vào git). File có 5 nhóm góp ý và 5 ảnh chụp prototype v1.3.

Anh dặn: "thực hiện, đánh số phiên bản đầy đủ", và "có nhiêu thì cứ làm trước", vì các boss sẽ còn gửi thêm góp ý. Vì vậy em làm luôn những gì đã rõ. Chỗ nào là câu hỏi cho team, em chọn cách không thêm field và không đổi luật của production, rồi ghi câu hỏi ở mục 3.

Version: **v1.4**, ngày 16/10/2026. Chip "v1.4" và What's new trong panel Demo đã cập nhật.

## 1. Góp ý và cách xử lý

| # | Góp ý | Xử lý trong v1.4 | Trạng thái |
|---|---|---|---|
| F1 | Nút "+ Create" đặt đó đã tốt nhất chưa? ("For further consideration") | Không đổi. Chờ team cân nhắc tiếp. | Chờ team |
| F2 | Banner photo và logo của trang tổ chức phải bắt buộc. Sau này có thêm màn xem trước | Banner và logo thành bắt buộc. Phần xem trước để sau. | Xong (xem trước: sau) |
| F3 | Có nên đặt nút cập nhật thông tin ở ô thông tin trên cùng của trang tổ chức? | Có. Thêm link "Update details" ngay dưới ô thông tin. Bấm Back, hoặc cập nhật xong, thì quay về trang tổ chức. | Xong |
| F4 | Lỗi: màn cá nhân ghi "You can build and launch meanwhile" nhưng không bấm tiếp được | Khi đang chờ duyệt phần cập nhật danh tính, ẩn ô "These details are still accurate" và mở nút "Start a new project". | Xong |
| F5 | Tổ chức không có số đăng ký (cấu trúc khác, phong trào không có pháp nhân): kiểm tra trùng bằng cách nào? | Bước Contact kiểm tra thêm tên miền email, website và số điện thoại. Không thêm field. Pop-up ghi rõ trùng ở điểm nào. Số đăng ký vẫn bắt buộc như production (câu hỏi Q1). | Xong phần kiểm tra trùng, Q1 chờ team |
| F6 | (Irish) Bỏ Organisation khỏi Step 0, chỉ còn "raise money for a cause" và "host an event". Tạo tổ chức nằm bên trong 2 lựa chọn đó. Bỏ luồng trang tổ chức → gây quỹ chi phí vận hành; chi phí vận hành là một project riêng như trên LIVE | Step 0 còn 2 thẻ. Trang tổ chức bỏ phần "Donations for running costs". Ô "How pages fit together" ghi: muốn gây quỹ chi phí vận hành thì tạo một project. | Xong |
| F7 | (Irish) Hướng dẫn rõ trang tổ chức cần điền gì, để chủ project/tổ chức không thấy lặp với trang project. Mục tiêu của trang tổ chức là tạo niềm tin cho người cho; nói cho người dùng biết | Câu mở đầu nói mục tiêu ("Donors look at this page to decide whether to trust…"). Thêm ô 2 cột: trang này nói về tổ chức, trang project nói về một nhu cầu. | Xong |
| F8 | (Irish) Có thông tin mẫu cho phần chi tiết project (introduction, background, scope & activities…) | Mỗi ô Introduction, Background & Context, Scope & Activities có "See an example", mở ra một đoạn mẫu. | Xong (text mẫu chờ team duyệt) |
| F9 | (Irish) Còn dùng Project type không? Gộp vào cause category được không? | Chưa đổi, vì Project type đang có trên form production. Hỏi team (Q2). | Chờ team |

## 2. Quyết định em chọn mặc định (anh đổi được)

- **D1. Link "Register an Organization" ở footer vẫn giữ**, vào thẳng lối tổ chức, không qua Step 0.
  - Lý do: production có "Create Org" trong mục Organization; góp ý của Irish chỉ nói về Step 0.
  - Lối này giờ tên là "Register an organisation". Không còn gây quỹ: xác minh xong thì dựng trang tổ chức (banner, logo, giới thiệu, ngày đăng).
  - Muốn bỏ hẳn: xóa 1 link ở footer. Route `#/new/org` khi đó không còn ai dùng.
- **D2. Đoạn mẫu cho project** dùng project có sẵn trong demo ("Special Needs Centre" ở Kurdistan). Text do em viết, ghi trong guide là bản nháp để team duyệt.
- **D3. Kiểm tra trùng ở bước Contact** dùng các field đã có: email tổ chức (chỉ lấy tên miền, bỏ qua gmail, yahoo, hotmail, outlook, live, icloud), website, số điện thoại (so 8 số cuối).
- **D4. F4 xử lý bằng cách ẩn ô xác nhận** khi đang chờ duyệt, vì phần vừa cập nhật đang được xem xét. Hỏi "vẫn chính xác chứ?" lúc này là thừa.
- **D5. Trang tổ chức đang live** trong demo (Antioch21) có sẵn banner và logo, để nút "Save changes" không bị chặn bởi luật bắt buộc mới.

## 3. Câu hỏi cho team

- **Q1 (Compliance / Partnerships):** tổ chức không có số đăng ký (phong trào, nhóm không có pháp nhân) có được đăng ký như một tổ chức không?
  - Hiện tại họ đi lối "An individual or informal group": một người xác minh danh tính rồi gây quỹ.
  - Nếu có: số đăng ký thành không bắt buộc khi trả lời "No" ở câu "Is your organization a registered charity/non-profit in this country?". Khi đó việc kiểm tra trùng dựa vào tên, email, website và điện thoại (đã có trong v1.4).
- **Q2 (Business):** Project type (Community / Emergency) đang dùng vào việc gì trên production?
  - Không dùng vào đâu: bỏ field; nếu cần, "Emergency" thành một cause.
  - Có dùng (ví dụ lọc hoặc ưu tiên dự án khẩn cấp): giữ.
- **Q3 (Product):** vị trí nút "+ Create" (F1).
- **Q4:** kích thước ảnh banner và logo (đã có trong danh sách chờ từ trước), để ghi vào ô upload.
- **Q5:** duyệt text mẫu của 3 ô project.

## 4. Phạm vi theo file

- `assets/onboarding.js`:
  - Step 0 còn 2 thẻ.
  - Lối org đổi tên thành "Register an organisation".
  - Bỏ quỹ chi phí vận hành ở: trang tổ chức, thẻ trang tổ chức trên dashboard, dữ liệu demo, email chào mừng, màn "Submitted".
  - Banner và logo bắt buộc. Thêm ô 2 cột và link "Update details" quay về trang tổ chức.
  - Ví dụ cho 3 ô project.
  - Sửa lỗi F4.
  - Kiểm tra trùng ở bước Contact.
  - VERSION v1.4 và What's new.
- `assets/onboarding.css`: style cho ô 2 cột, "See an example" và dòng "trùng ở đâu" trong pop-up. Xóa style `.op-fund` không còn dùng.
- `assets/onboarding-flows.js`: Step 0 "Cause · Event". Flow New visitor có bước kiểm tra trùng thứ hai ở Contact. Flow Owner of one organisation bỏ nhánh Org khỏi Step 0.
- `onboarding-matrix.html`: dòng quyền "Set up and publish the organisation page" bỏ chú thích "Including donations for running costs".
- `onboarding-guide.md`: version, Step 0, trang tổ chức, kiểm tra trùng, mẹo demo, lịch sử v1.4, việc còn chờ.

## 5. Kiểm tra nghiệm thu

- Step 0 có 2 thẻ. Ô "How pages fit together" không còn "Running costs".
- Footer "Register an Organization" vẫn vào lối tổ chức.
- Trang tổ chức:
  - Không có phần chi phí vận hành.
  - Thiếu banner hoặc logo thì không lưu được.
  - "Update details" đi và về đúng trang.
- Cá nhân đang chờ duyệt phần cập nhật danh tính: bấm được "Start a new project".
- Bước Contact: email `@antioch21.org`, website `antioch21.org` hoặc số `+65 6123 4567` đều hiện pop-up, kèm lý do. Email gmail không bị tính.
- 3 ô project có "See an example".
- Flow diagram đúng. Kiểm tra ở 1440 và 390, không cuộn ngang, console không có lỗi.

## 6. Nhật ký

**16/10/2026: làm xong v1.4 trên local, chưa commit.**
- Làm đủ F2–F8 như mục 1. F1 và F9 không đổi, chờ team.
- **Lỗi em tự gây ra rồi sửa trong lúc làm:** bản đầu của kiểm tra trùng chỉ nhớ một tổ chức đã bỏ qua. Ví dụ: bỏ qua Antioch21 ở bước 1, rồi email `@livingwaters.sg` ở bước Contact, thì pop-up Living Waters không hiện. Lý do: số đăng ký vẫn khớp Antioch21 trước. Giờ hệ thống nhớ danh sách mọi tổ chức đã bỏ qua. Dữ liệu cũ đã lưu trong trình duyệt (chỉ có một tổ chức) vẫn đọc được.
- **Không đổi:**
  - Trang Home.
  - Câu hỏi và field của form tổ chức. Số đăng ký vẫn bắt buộc.
  - Project type.
  - Vị trí nút "+ Create".
- **Đã kiểm tra trên local (trình duyệt headless):**
  - Step 0 có 2 thẻ, không còn "Running costs", ở 1440 và 390. Không cuộn ngang.
  - Footer `#/new/org` khi chưa đăng nhập: kicker "Register an organisation", các bước Your account → Organization → Contact → Causes → Documents → Risk declaration.
  - Bước Contact: email `hello@antioch21.org` hiện "Same email domain". Website `https://www.antioch21.org/about` hiện "Same website". Số `+65 6123 4567` hiện "Same phone number". Email `admin@gmail.com` không hiện gì.
  - Bỏ qua ở bước Contact thì đi tiếp sang Causes.
  - Request to join, rồi "Start a separate application", thì cũng sang Causes.
  - Số đăng ký `T08SS0123A` ở bước 1 vẫn hiện "Same registration number".
  - Trang tổ chức The Treasure Box (chưa có trang):
    - Không có phần chi phí vận hành.
    - Bấm lưu khi chưa có ảnh thì báo lỗi ở banner và logo.
    - "Update details" mở `#/org/treasurebox/changes/page`; Back quay về trang tổ chức.
    - Cập nhật Organization details xong cũng quay về trang tổ chức. Nút Back ở bước cập nhật đầu tiên trỏ về trang tổ chức.
  - Trang Antioch21 đang live: có sẵn banner và logo, "Save changes" lưu được. Thẻ trên dashboard không còn số tiền chi phí vận hành.
  - Cá nhân (scenario Individual): trước khi cập nhật thì ô xác nhận hiện và nút bị khóa, như cũ. Sau khi nộp cập nhật Government ID: ô xác nhận ẩn, nút mở, bấm vào tới Proposal.
  - Trang project: 3 "See an example", mở ra đúng đoạn mẫu.
  - What's new có v1.4 ("This version"). Flow diagram New visitor và Owner of one organisation vẽ đúng; mọi đường nối đều trỏ tới node có thật (kiểm bằng script cho cả 7 flow).
  - Console không có lỗi ở mọi màn đã thử.
