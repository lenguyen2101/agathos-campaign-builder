# /task218: giúp người mua vé đăng nhập vào tài khoản được tạo sẵn (GitLab #218)

Anh nhờ (09/11/2026): team cần solution cho #218. Em viết solution bằng tiếng Anh và làm mockup dạng ảnh, để anh gửi comment vào GitLab.

## Nguồn

- **Sheet Event Feedback, dòng 3:**
  - Vấn đề: *Users who click 'view tickets' without activating account don't know how to login*
  - Hướng giải: *To check tech capabilities*
- **Issue #218, ảnh anh gửi.** Phần Update có các ý sau:
  - *Using tokenised links in the email to view tickets was deemed as insufficiently secure.*
  - 4 thay đổi nhỏ:
    1. sửa copy khi đăng ký bằng email đã có (= #228);
    2. gộp email vé và email tạo tài khoản;
    3. thêm ô đồng ý trong luồng mua vé;
    4. thêm CTA trong email (ghi là để sau).
- **Comment của Josias (5 ngày trước):** thêm nút *'First time here? Get a sign-in link'* vào luồng login. Kèm ảnh tham khảo màn "Check your email to log in", có hạn 15 phút.
- **Production, em tải về ngày 09/11/2026 bằng curl** (trang login của Keycloak là HTML render từ server):
  - **Trang Sign in:**
    - Tiêu đề: "Sign in to your account".
    - Đăng nhập mạng xã hội: "Using your social media accounts:" với nút Facebook và Google.
    - Form: "or sign in manually", ô "Username or email", ô "Password", "Remember me", link "Forgot Password?", nút "Sign In".
    - Cuối trang: "Don't have an account? Create an account".
  - **Trang Forgot Password:**
    - Tiêu đề: "Forgot Your Password?".
    - Ô "Username or email", link "« Back to Login", nút "Submit".
    - Dòng giải thích: "Enter your username or email address and we will send you instructions on how to create a new password."
  - CSS của theme agathos (`login.css`, `styles.css`, `login-custom.css`) và `logo.png`.
- **Ảnh chụp production anh gửi trước đây:**
  - Trang Register (Task 220).
  - Bước 1 của modal Get Tickets.
  - Email "Welcome to Agathos -- your account is ready" (ảnh nằm trong sheet).

## Ý chính của solution

Luồng "Forgot Password?" đang chạy đã làm đúng việc người mua cần: nhập email, nhận link, đặt mật khẩu, rồi vào được tài khoản. Vấn đề là người mua không biết đi đường đó, vì họ chưa từng có mật khẩu để mà "quên".

Vì vậy solution dùng lại đúng luồng đó, chỉ thêm lối vào và đổi chữ:
- Không thêm loại link mới trong email. Mối lo về link có token trong email vé (phần Update) không áp dụng.
- Dev chủ yếu sửa theme Keycloak và template email.

## Mockup (ảnh) sẽ làm

| # | Màn | Có gì | Dựa vào |
|---|---|---|---|
| 1 | Sign in | Một box "First time here?" ngay dưới tiêu đề, có nút "Get a sign-in link" | HTML và CSS production, khung Keycloak của Task 220 |
| 2 | Get a sign-in link | Trang Forgot Password đổi chữ để hợp cả 2 trường hợp: nhập email, nhận link để đặt mật khẩu và đăng nhập | HTML và CSS production |
| 3 | Check your email | Báo đã gửi link, cho biết thời hạn của link, có "send it again" và "« Back to Login" | Ảnh tham khảo của Josias, dựng theo theme Keycloak của Agathos |
| 4 | Email chứa link | Tiêu đề, một câu, nút "Set Password & Sign In", thời hạn của link | Khung email thông báo (các email change request, không có ảnh banner) |
| 5 | Email gộp: vé và tài khoản | Email vé giữ nguyên, thêm khung "Your Agathos account", nút đổi thành "Set Password & View Tickets" | File `agathos-email-event-ticket.html` anh gửi |
| 6 | Get Tickets, bước 3 Checkout | Dòng báo tạo tài khoản đã có sẵn. Chỉ thêm một ô marketing riêng, không tick sẵn | Ảnh Figma "Step checkout - Opt. 2" anh gửi (khung bên phải, đã điền) |
| 7 | Register (#228) | Câu lỗi mới, có 2 link Logging In và Resetting Your Password | Trang Register đã dựng ở Task 220 |

## Mặc định em chọn (anh đổi được)

- **D1. Giữ câu "First time here? Get a sign-in link" của Josias** (anh chốt 09/11).
  - Lý do anh đưa: không chỉ người mua vé, người donate cũng được tạo tài khoản tự động.
  - Dòng phụ trong box nhắc cả 2 trường hợp: "If you've bought a ticket or donated, your account is ready."
- **D2. Cách xuất ảnh:** mỗi khung trên trang `/task218` có nút "Download PNG". Nút này dựng ảnh ngay trong trình duyệt của anh, bằng thư viện html-to-image (bản cố định, tải từ CDN). Em không chạy Chromium headless.
  - Cách khác 1: anh tự chụp màn hình từng khung.
  - Cách khác 2: em dựng ảnh bằng WebKit của macOS. Cách này cần anh cho phép, vì nó gần với luật không chạy trình duyệt headless.
- **D3. Mockup 5 và 6 dựng từ tài liệu anh gửi ngày 09/11:**
  - Mockup 5 dựng từ file email vé anh gửi.
  - Mockup 6 đặt ở bước 3 Checkout, vì bước 2 (Registration Form) không phải event nào cũng có: Event Owner có thể bỏ qua khi tạo event. Bước 2 cũng có thể hỏi thông tin theo từng vé, hoặc chỉ hỏi người mua.
- **D4. Kích thước khung:**
  - Màn Keycloak dựng ở bản desktop, đúng số đo của production.
  - Email dựng ở chiều rộng 600px, là chiều rộng thường dùng cho email.
  - Không làm bản mobile, trừ khi anh cần.

## Phạm vi theo file

Chỉ tạo file mới, không sửa file nào có sẵn:
- `task218.html`
- `assets/task218.css`
- `assets/task218.js`
- `assets/img/task218/`: logo, ảnh banner event và 3 icon mạng xã hội, lấy từ file email vé anh gửi.
- Khung Keycloak dùng logo `assets/img/home/agathos-logo.png`, giống Task 220.

## Kiểm tra nghiệm thu

- Chữ trên các màn Keycloak giống production, trừ những chỗ solution đổi.
- Chạy `node --check`, dùng script node đếm số khung, dùng curl kiểm tra trang trả về 200.
- Không cuộn ngang ở chiều rộng 1440.
- Nút "Download PNG" tải được ảnh đúng khung. Anh bấm thử trên trình duyệt của anh.

## Ước lượng thời gian

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này và bản nháp comment tiếng Anh | 0.2 | 0.2 |
| 2. Khung Keycloak theo CSS production (logo, card, font) | 0.2 | 0.4 |
| 3. Mockup 1: Sign in có box cho người mua vé | 0.15 | 0.55 |
| 4. Mockup 2 và 3: Get a sign-in link, Check your email | 0.2 | 0.75 |
| 5. Mockup 4: email chứa link | 0.2 | 0.95 |
| 6. Mockup 7: Register (#228) | 0.1 | 1.05 |
| 7. Nút Download PNG, kiểm tra | 0.15 | 1.2 |
| 8. Mockup 5: email gộp (khi có ảnh) | 0.3 | 1.5 |
| 9. Mockup 6: Get Tickets bước 2 (khi có ảnh) | 0.3 | 1.8 |

## Bản nháp comment cho GitLab (tiếng Anh)

Gửi cho team Agathos (Josias, dev). Chỗ ghi [Image n] là nơi gắn ảnh mockup.

> **Proposal for #218: help ticket buyers sign in to the account we created for them**
>
> **Why people get stuck**
> When someone buys a ticket without an Agathos account, we create one with no password and send two emails: the tickets, and "Activate my account". If they press "View tickets" first, they land on "Sign in to your account" with no password to type. "Create an account" says the email already exists (#228). "Forgot Password?" would work, but nothing points them there: they never had a password to forget.
>
> **Proposal**
> This reuses the "Forgot Password?" flow Keycloak already runs. It adds no new kind of email link, so the concern about tokenised ticket links doesn't apply.
>
> 1. **"First time here? Get a sign-in link" on Sign in** (Josias's idea) [Image 1]
>    The page in order of importance: sign in first, then Facebook and Google, then one box at the bottom with the two ways in without a password: "First time here? Get a sign-in link" ("If you've bought a ticket or donated, your account is ready.") and "Don't have an account? Create an account".
> 2. **The same page as "Forgot Password?", reworded to fit both cases** [Image 2]
>    Enter your email, and we send a link to set a password and sign in. The next screen says the same thing whether or not the email has an account, as "Forgot Password?" does today. [Image 3]
>    The buyer opens the email [Image 4], sets a password, and is signed in and back on their tickets.
> 3. **One email after a successful purchase, with the tickets and the account set-up together** (Update, point 2) [Image 5]
>    The tickets email stays as it is, with a "Your Agathos account" box. New accounts get "Set Password & View Tickets". Existing accounts keep "View Your Tickets".
>    This email only goes out after payment succeeds, so the "your account is ready" email no longer reaches people whose payment failed (#226).
> 4. **Checkout asks about marketing emails separately** (Update, point 3) [Image 6]
>    Checkout already says "We'll create an Agathos account with these details…". We add a tick box inside that note, ticked by default: "Send me news about events and causes on Agathos." Buyers can untick it. It goes on step 3, because step 2 (Registration Form) is optional for each event. The donation checkout needs the same box.
>    Singapore's PDPA (s 14(2)–(3)) does not let us make consent beyond what's needed to sell the ticket a condition of buying, so marketing has to stay optional. To confirm with whoever handles legal.
> 5. **"Email already exists" on sign up links to Log in and Reset password** (#228, Update point 1) [Image 7]
>
> Not in this proposal: Update point 4 (more prompts in emails, for later), and changing names (#220).
>
> **For dev to check**
> - After setting a password from the link, is the buyer signed in and sent back to their tickets? Does that still happen when the link is opened on another device?
> - How long the link lasts (Realm settings › Tokens). Josias's reference uses 15 minutes.
> - Can "Check your email" be its own screen? Today Keycloak goes back to Sign in with a short message.
> - Account creation only after the payment webhook (#226). With point 3 the email no longer goes out after a failed payment, but the account itself is still created.

## Nhật ký

**09/11/2026:**
- Đã đọc issue #218 và comment của Josias.
- Đã tải HTML và CSS production của trang Sign in và trang Forgot Password.
- Đã viết plan này và bản nháp comment.
- Chưa dựng mockup. Đang chờ anh duyệt D1–D4, và chờ ảnh cho mockup 5 và 6.

**09/11/2026, sau khi anh trả lời:**
- Anh gửi:
  - file email vé;
  - ảnh Figma "Step checkout - Opt. 2";
  - ảnh bước 2 (Registration Form) và màn tạo event.
- Anh chốt giữ câu "First time here?".
- Đã dựng đủ 7 mockup ở `/task218` (3 file mới).
  - Ảnh của email lấy từ file anh gửi, để trong `assets/img/task218/`.
  - Chưa commit.
- Đã kiểm tra:
  - `node --check` không báo lỗi.
  - Script node: 29/29 mục đạt. Có đủ 7 khung và 7 nút tải ảnh, đúng các câu chữ chính, thẻ div đóng mở khớp nhau.
  - curl trả về 200 cho trang, file js, file css và 6 ảnh.
- Chưa kiểm tra:
  - Giao diện trên trình duyệt.
  - Nút Download PNG. Nút này chạy trong trình duyệt của anh, em không chạy Chromium headless.

**09/11/2026, anh review:**
- Anh nhận xét "tốt".
- Bỏ hết nút Download PNG, kể cả "Download all PNG". Gỡ luôn thư viện html-to-image, phần code tải ảnh và toast. D2 bỏ: anh tự chụp ảnh từng khung.
- Khung "Your Agathos Account" trong email vé (mockup 5) đổi sang nền vàng nhạt `#FFF8E1`, viền `#F3D98B`, để nổi hơn.
- Đã kiểm tra:
  - `node --check` không báo lỗi.
  - Script node đạt 29/29, có thêm mục kiểm tra không còn nút tải ảnh.
  - Grep không còn `htmlToImage`, `Download`, `data-dl` trong 3 file.
  - Trang trả về 200.

## Vòng 2: feedback của team (13/11/2026)

Anh chuyển lại feedback, viết sau buổi call:
- **Image 1 (login):** *"As there are now multiple actions that the user can take, it can be quite overwhelming. Please update the design so that the options are clearer for the user in order of importance."*
- **Image 6 (get ticket):** *"Checkbox should default to ticked. Checkbox feels out of place as well. Try integrating into the yellow box."*

### Image 6: đã làm (không có gì phải chọn)
- Ô "Send me news about events and causes on Agathos" chuyển vào trong box vàng, ngay dưới câu "We'll create an Agathos account…". Ô được tick sẵn, màu xanh của checkout `#354FA2`.
- Đã sửa mô tả dưới khung trên trang `/task218`, và đoạn 4 trong bản nháp comment ("ticked by default… Buyers can untick it").
- **Cần team lưu ý:**
  - Theo GDPR (châu Âu), ô tick sẵn không được tính là đồng ý nhận marketing.
  - Với PDPA Singapore em không chắc.
  - Comment đã ghi "To confirm with whoever handles legal", nên em giữ nguyên câu đó.

### Image 1: cần anh chọn
Màn hiện tại có 7 lựa chọn, xếp từ trên xuống:
1. box "First time here?" có nút;
2. Facebook;
3. Google;
4. form và nút Sign In;
5. Remember me;
6. Forgot Password?;
7. Create an account.

Trong đó, box mới nằm trên cùng và tranh chỗ với việc chính của trang là đăng nhập.

Thứ tự em đề xuất theo mức quan trọng:
1. Đăng nhập bằng email và mật khẩu. Đây là việc của đa số người dùng, nên nút Sign In là nút đặc duy nhất.
2. Facebook và Google.
3. Hai lối cho người chưa có mật khẩu: "First time here? Get a sign-in link" và "Create an account".

Email vé mới (Image 5) đã có nút "Set Password & View Tickets". Vì vậy người mua vé ít khi phải tự tìm box "First time here?" nữa.

**Phương án:**

- **A (em đề xuất).** Form lên đầu. Facebook và Google nằm dưới dòng "or". Cuối thẻ là một khung chứa 2 lối cho người chưa có mật khẩu, mỗi lối một dòng: "First time here? Get a sign-in link" kèm câu phụ của D1, và "Don't have an account? Create an account".
  - Ưu điểm: chỉ còn một nút đặc. Đặt hai lối cạnh nhau thì người dùng thấy ngay chỗ khác nhau: tài khoản đã có sẵn, hay tạo tài khoản mới.
  - Nhược điểm: box "First time here?" xuống dưới, kém nổi hơn bản trước.
  - Dev: sửa theme Keycloak (`login.ftl`), đổi thứ tự khối, không đổi luồng.
- **B.** Như A, nhưng "First time here?" vẫn nằm trên form và thu gọn còn một dòng chữ có link.
  - Ưu điểm: người mua vé thấy ngay.
  - Nhược điểm: trên form vẫn còn một lựa chọn, tức là giảm "overwhelming" ít hơn A.
- **C.** Hỏi email trước, bấm "Continue" rồi mới hiện bước tiếp theo: mật khẩu, gửi link, hoặc tạo tài khoản.
  - Ưu điểm: mỗi bước chỉ có một lựa chọn chính.
  - Nhược điểm: Keycloak phải đổi luồng đăng nhập (identity-first) và cần code riêng để quyết định bước sau. Dev tốn nhiều hơn A và B hẳn, và màn này có thể cho người lạ biết một email đã có tài khoản hay chưa.

Cả 3 phương án đều giữ nguyên câu chữ đã duyệt: "First time here? Get a sign-in link" và câu phụ của D1.

**Ước lượng thời gian:**

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Image 6: ô tick trong box vàng (đã xong) | 0.05 | 0.05 |
| 2. Image 1 theo phương án anh chọn (A hoặc B) | 0.15 | 0.2 |
| 3. Kiểm tra (node, curl), cập nhật mô tả khung và bản nháp comment | 0.05 | 0.25 |
| 4. Bản nháp trả lời team trên GitLab (tiếng Anh, ngắn) | 0.05 | 0.3 |

Phương án C cần thêm 2 khung (bước email, bước mật khẩu), khoảng +0.2 ngày.

### Nhật ký vòng 2
- 13/11/2026: Image 6 đã sửa ở `assets/task218.js` và `assets/task218.css`. Đã viết phần plan này. Chưa commit. Đang chờ anh chọn phương án cho Image 1.
- 13/11/2026: anh duyệt Image 6 ("done") và bảo "Try A cho anh xem".
  - **Đã làm Image 1 theo A:**
    - Thứ tự từ trên xuống: tiêu đề, form (Username or email, Password), Remember me và Forgot Password?, nút Sign In, dòng "or", Facebook và Google.
    - Cuối thẻ là một khung nền xám nhạt có 2 dòng, ngăn bằng một đường kẻ:
      - "First time here? Get a sign-in link", kèm câu phụ của D1;
      - "Don't have an account? Create an account".
    - Sign In là nút đặc duy nhất. Hai câu "Using your social media accounts:" và "or sign in manually" thay bằng một dòng "or", vì form đã lên trước.
    - Box xanh cũ và style `.kc-first`, `.kc-signup` đã bỏ. Khung Register vẫn giữ chữ như production.
    - Đã sửa mô tả dưới khung và đoạn 1 trong bản nháp comment.
  - **Đã kiểm tra:**
    - `node --check` không báo lỗi.
    - Script node: thứ tự 10 thành phần đúng; chỉ có 1 nút đặc; câu chữ D1 giữ nguyên; thẻ đóng mở khớp; không còn style cũ.
    - curl trả về 200.
  - Chưa xem bằng mắt. Chưa commit.
