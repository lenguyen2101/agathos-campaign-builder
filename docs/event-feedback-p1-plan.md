# Event Feedback: 6 task priority 1 có số GitLab

Nguồn: file "Product & Tech Roadmap (Q3 2026).xlsx" ở thư mục gốc repo (không đưa vào git), sheet **Event Feedback**. Em đọc cả định dạng ngày 09/11/2026.

- Sheet có nội dung ở dòng 2–19. Không có chữ gạch ngang, không có comment, không có dòng hay cột bị ẩn.
- Có 6 dòng priority 1 (dòng 2–7), và cả 6 đều có số GitLab.
- Dòng 10 (#229, Manual check-in) có số GitLab nhưng là priority 2, nên không nằm trong plan này.
- Ô Problem Statement của #227 (ô D6) được tô nền cam. Em đoán ô này tô vì câu "How to replicate this?" chưa có câu trả lời, nhưng không chắc.
- Các link GitLab trỏ vào repo private (gọi API trả về 404), nên em không đọc được mô tả issue. Plan chỉ dựa vào sheet và UI anh sẽ gửi.
- Sheet có 3 ảnh chụp cho task priority 1: dòng 5 (#226, email), dòng 6 (#227, điện thoại), dòng 7 (#228, form Register). Ảnh có email của tài khoản test, nên em không đưa ảnh lên trang.

## 6 task

Phần in nghiêng chép nguyên văn từ sheet.

### #224 Clicking on username in attendee list directs to user info page (dòng 2, Open)

- **Vấn đề:** *Click on name in attendee list directs to user info page, which does not really follow typical expected behaviour during registration*
- **Hướng giải:** *Change to open 'more details'. User profile could open when clicked again once in the 'more details' screen*
- **Màn dự kiến:**
  - Manage Event › Attendees Information: danh sách người tham dự.
  - Bấm tên thì mở "more details".
  - Trong "more details", bấm tên lần nữa thì mở profile.
- **Cần từ anh:**
  - UI của màn "more details".
  - Ảnh chụp trang Attendees Information đang chạy, nếu UI chỉ vẽ phần nội dung. Em cần ảnh này để lấy đúng các cột của production.
- **Tham khảo:** /event-research#row-2

### #218 User unable to login when going through auto account creation flow (dòng 3, Open)

- **Vấn đề:** *Users who click 'view tickets' without activating account don't know how to login*
- **Hướng giải:** link GitLab #218, kèm câu *To check tech capabilities*. Sheet chưa ghi cách giải trên giao diện.
- **Màn dự kiến:** trang login của Keycloak, nơi người mua tới khi bấm "View tickets". Trang này cần có lối vào cho người chưa đặt mật khẩu. Số màn tùy theo cách dev chọn.
- **Cần từ anh:** UI theo cách đã chốt sau khi dev kiểm tra Keycloak làm được gì.
- **Tham khảo:** /event-research#row-3

### #209 Design UI for EO to toggle automated event notifications (dòng 4, Scheduled)

- **Vấn đề:** *EO does not know what notifications will be sent out by Agathos platform*
- **Hướng giải:** *System messages UI*
- **Màn dự kiến:** trong Manage Event, một danh sách các email Agathos tự gửi cho một event, mỗi email có công tắc bật/tắt.
- **Cần từ anh:**
  - UI.
  - Danh sách email Agathos đang gửi thật: tên email, lúc gửi, gửi cho ai, email nào được tắt. Em không tự đặt ra danh sách này.
- **Tham khảo:** /event-research#row-4

### #226 Account creation email is sent even when ticket purchase failed (dòng 5, Open)

- **Vấn đề:** *In auto-account creation flow, acc is created regardless of whether the transaction was successful. User is also sent activation email. Copy of activation email assumes transaction was successful and this might confuse users*
- **Hướng giải:** *- Update copy* và *- Investigate: Can account only be created after webhook for successful transaction?*
- **Ảnh trong sheet:** email "Welcome to Agathos -- your account is ready", có nút "Activate my account".
- **Màn dự kiến:** email đó với copy mới.
- **Cần từ anh:** UI có copy mới. Phần "Investigate" là việc của dev, xem D3.
- **Tham khảo:** /event-research#row-5

### #227 'Page has expired' screen on Keycloak (dòng 6, Open)

- **Vấn đề:** *Encountered during update password flow. Confusing copy as it says page has expired and user would choose first option. How to replicate this?* (ô này tô nền cam)
- **Hướng giải:** *To investigate more on why this screen was served and change copy accordingly*
- **Ảnh trong sheet:** màn "Page has expired" trên điện thoại (kc.agathos.be), có 2 link "Click here".
- **Màn dự kiến:** màn đó với copy mới.
- **Cần từ anh:** UI có copy mới. Phần "investigate" là việc của dev, xem D3.
- **Tham khảo:** /event-research#row-6

### #228 User signing up with an existing email is stuck (dòng 7, Open)

- **Vấn đề:** *During sign up, if User keys in an email address that already exists on the platform, they are stuck*
- **Hướng giải:** *Change error copy to "An account with this email already exists. Try [Logging In] or [Resetting Your Password]."*
- **Ảnh trong sheet:** form Register của Keycloak. Dưới ô Email đang có lỗi "Email already exists.".
- **Màn dự kiến:**
  - Form Register với câu lỗi mới đặt dưới ô Email.
  - [Logging In] dẫn tới trang Login, [Resetting Your Password] dẫn tới trang quên mật khẩu.
- **Cần từ anh:** UI để biết chỗ đặt và kiểu chữ của câu lỗi. Copy thì sheet đã chốt.
- **Tham khảo:** /event-research#row-7

## Cách làm khi nhận UI

- Anh để UI trong file hoặc thư mục "Task #NNN" ở gốc repo. Em đọc hết rồi mới dựng. Các file đó để ngoài git, như Task #219 và #220.
- Em dựng đúng số đo, màu, font và chữ trong UI. Chữ trong UI là copy đã chốt, em không sửa câu.
- Nếu UI có ảnh (logo, ảnh hero của email), em cắt ra và để trong `assets/img/task<NNN>/`.

## Mặc định em chọn (anh đổi được)

- **D1. Mỗi task một trang**, giống /task219 và /task220:
  - Các trang: /task224, /task218, /task209, /task226, /task227, /task228.
  - Một link GitLab trỏ thẳng tới đúng một trang.
  - Cách khác: một trang chung có 6 tab. Cách này ít file hơn, nhưng link GitLab không mở thẳng được màn của task đó.
- **D2. 3 màn Keycloak (#218, #227, #228) dùng chung `assets/keycloak.css`**, để 3 màn giống nhau từng pixel và sửa một chỗ là đủ. Mỗi trang vẫn có file js riêng.
- **D3. Phần "investigate" và "check tech" (#218, #226, #227) là việc của dev**, không phải giao diện.
  - Em ghi các câu hỏi đó vào mục "Câu hỏi cho dev" bên dưới.
  - Em không đưa câu hỏi lên trang review.
- **D4. Chỉ dựng những màn có trong UI.**
  - Nếu UI không có bản mobile, trang vẫn co giãn và không vỡ ở 390px, nhưng em không tự vẽ màn mobile.
  - Nếu UI thiếu một trạng thái (lỗi, trống, đang tải), em hỏi anh chứ không tự thêm.

**Thứ tự làm:** theo thứ tự anh gửi UI. Nếu gửi cùng lúc thì em làm #228 → #227 → #218 trước, vì 3 task này chung khung Keycloak. Sau đó là #226 → #224 → #209.

Mỗi task làm xong em báo anh review. Em không commit hay push khi anh chưa ra lệnh.

## Câu hỏi cho dev (lấy từ sheet, không đưa lên trang)

- **#218:** Keycloak có cho đăng nhập bằng link gửi qua email không? Có gửi lại được link kích hoạt từ trang login không? (sheet: *To check tech capabilities*)
- **#226:** Có thể chỉ tạo tài khoản sau khi nhận webhook báo thanh toán thành công không? (sheet: *Investigate: Can account only be created after webhook for successful transaction?*)
- **#227:** Màn "Page has expired" hiện ra trong trường hợp nào, và làm sao để tái hiện nó? (sheet: *How to replicate this?*)

## Phạm vi theo file

Chỉ tạo file mới, không sửa file nào có sẵn.

| Task | File mới |
|---|---|
| Khung Keycloak | `assets/keycloak.css` |
| #228 | `task228.html`, `assets/task228.js` |
| #227 | `task227.html`, `assets/task227.js` |
| #218 | `task218.html`, `assets/task218.js` |
| #226 | `task226.html`, `assets/task226.css`, `assets/task226.js` |
| #224 | `task224.html`, `assets/task224.css`, `assets/task224.js` |
| #209 | `task209.html`, `assets/task209.css`, `assets/task209.js` |

Ngoài ra:
- Ảnh cắt từ UI (nếu có) để trong `assets/img/task<NNN>/`.
- Plan này: ghi nhật ký sau mỗi task.

## Kiểm tra nghiệm thu

- Mỗi màn khớp với UI: số đo, màu, font, chữ. Em mở trang trên trình duyệt của anh (`open http://localhost:8765/task228`) và so cạnh UI. Em không chạy Chromium headless.
- Chạy `node --check` cho mọi file js. Dùng script node đếm các phần tử đã render. Dùng curl kiểm tra mỗi trang trả về 200.
- Không cuộn ngang ở chiều rộng 1440 và 390.
- Mọi link và nút trong prototype đều dẫn tới đúng màn kế tiếp.

## Ước lượng thời gian

Bảng này giả định UI của mỗi task có 1–3 màn. Nếu nhiều màn hơn, em cập nhật bảng khi nhận file.

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này | 0.1 | 0.1 |
| 2. Khung Keycloak dùng chung (nền, card, logo, chọn ngôn ngữ) | 0.2 | 0.3 |
| 3. #228 Register: câu lỗi khi email đã có tài khoản, 2 link Log in / Reset password | 0.2 | 0.5 |
| 4. #227 Page has expired: copy mới | 0.15 | 0.65 |
| 5. #218 Đăng nhập khi chưa kích hoạt tài khoản | 0.4 | 1.05 |
| 6. #226 Email tạo tài khoản: copy mới | 0.3 | 1.35 |
| 7. #224 Attendees: danh sách, More details, mở profile | 0.6 | 1.95 |
| 8. #209 System messages: danh sách email, công tắc bật/tắt | 0.8 | 2.75 |
| 9. Kiểm tra, ghi nhật ký, sửa theo review | 0.5 | 3.25 |

## Nhật ký

**09/11/2026:** đã đọc sheet và viết plan. Chưa code. Đang chờ anh duyệt D1–D4 và gửi UI.

**09/11/2026, anh trả lời:**
- **#224:** dev chỉ đổi hành vi ở FE. Anh tự vẽ nhanh trên Figma, em không làm.
- **#209:** đã có, bỏ qua.
- **#226, #227, #228:** chỉ đổi copy, không cần redesign.
- **#218:** team đang cần solution. Em viết solution bằng tiếng Anh và làm mockup dạng ảnh để anh gửi vào GitLab. Plan riêng ở `docs/task218-plan.md`.

**09/11/2026, anh chốt:** #218 giải quyết luôn #228. Câu lỗi mới của #228 nằm ở mockup 7 của `/task218`, nên không cần làm riêng cho #228.
