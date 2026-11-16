# /task220: Change username, first name and last name (GitLab #220)

Nguồn: file "Task #220" ở thư mục gốc repo (chưa đưa vào git), và 2 ảnh chụp production anh gửi:
- Account Settings › Account Information
- trang Register của Keycloak

## Task yêu cầu

- **Trang đăng ký:** thêm câu sau cạnh ô Username: "Your username is displayed publicly next to your donations. Avoid using sensitive personal details or your full name if you prefer privacy."
- **Account Settings:** cho người dùng tự đổi Username, First name, Last name. Mỗi trường được đổi tối đa 2 lần trong suốt vòng đời tài khoản. Câu đếm thay đổi theo số lần còn lại: "You have **2 of 2** [username/first name/last name] changes remaining for this account."
- **Modal xác nhận** khi đổi từng trường.
- **Thiết kế đủ mọi câu báo lỗi.** Theo task, backend yêu cầu username dài 3–255 ký tự; các luật khác chưa rõ.

## Luật và câu báo lỗi có sẵn trong Keycloak

Em kiểm tra trong mã nguồn Keycloak, nhánh main và các tag 21.1.2 đến 26.0.7.

**Luật mặc định:**

| Trường | Luật |
|---|---|
| username | dài 3–255 ký tự; không được có khoảng trắng và các ký tự `< > & " ' $ % ! # ? § , ; : * ~ / \ | ^ = [ ] { } ( ) \`` |
| firstName, lastName | tối đa 255 ký tự; không được có `< > & " $ % ! # ? § ; * ~ / \ | ^ = [ ] { } ( )` |

**Câu báo lỗi mặc định:**
- "Please specify username."
- "Length must be between 3 and 255."
- "Value contains invalid character."
- "Username already exists."
- "Please specify first name."
- "Maximal length is 255."
- "Email already exists."

Production đang hiện câu "Email already exists.". Câu này có từ bản 21 tới 26 (bản main đã đổi), nên production chạy một bản trong khoảng đó.

Đây là cấu hình mặc định. Cần kiểm tra lại cấu hình realm của Agathos.

## Mặc định em chọn

- **D1. Một trang `/task220`** có thanh review ở trên và 3 tab:
  - **Sign up:** dựng lại trang Register và thêm câu về username.
  - **Account settings:** dựng lại trang và thêm phần đổi 3 trường.
  - **Flow & messages:** sơ đồ luồng và bảng câu báo lỗi.
- **D2. Đổi từng trường ngay tại chỗ.**
  - Mỗi trường có nút "Change". Bấm vào thì ô thành ô nhập, có Cancel và Save riêng.
  - Bấm Save thì mở modal xác nhận, hiện giá trị cũ → giá trị mới và số lần đổi còn lại sau khi đổi.
  - Nếu đây là lần đổi cuối, modal có thêm cảnh báo.
  - Nút Save chung của trang vẫn chỉ dùng cho các trường còn lại (phone, gender, language, bio, nhận tin).
  - Lý do: lượt đổi có giới hạn, nên mỗi lần đổi phải là một thao tác riêng, có xác nhận.
- **D3. Câu đếm hiện dưới mỗi trường mọi lúc**, để người dùng biết giới hạn trước khi bấm Change.
  - Câu về username công khai cũng hiện dưới ô Username trong Account settings, theo mục tiêu "inform users clearly".
- **D4. Hết lượt (0 of 2):** nút Change đổi thành "No changes left", và có thêm câu "Need another change? Contact us at hello@agathos.be." Câu này là copy em đề xuất, chờ team duyệt. Email lấy từ footer của site.
- **D5. Một bộ câu báo lỗi dùng chung cho cả 2 trang.**
  - Những câu mặc định của Keycloak quá chung chung (ví dụ "Value contains invalid character.") thì thay bằng câu rõ hơn.
  - Bảng câu báo lỗi ghi kèm key của Keycloak cần ghi đè.
  - Câu báo email đã tồn tại dùng copy team đã đề xuất ở dòng 7 của sheet Event Feedback.
- **D6. Kiểu báo lỗi của trang Register** giữ đúng như production: viền dưới đỏ, icon đỏ trong ô, câu báo lỗi xám bên dưới. Lấy theo ảnh lỗi email trong file roadmap.
- **D7. Ảnh:** avatar trên nav cắt từ ảnh chụp, logo dùng file có sẵn. Font của trang Keycloak là Open Sans, tải từ Google Fonts.
- **D8. Demo:**
  - Các username đã có người dùng: admin, agathos, wallytham.
  - Email đã có tài khoản: lenguyen2101@gmail.com.
  - Thanh review có nút đặt số lần còn lại (2, 1, 0) và nút hiện lỗi mẫu trên trang Sign up.

## Phạm vi theo file

Tạo các file mới sau, không sửa file nào khác:
- `task220.html`
- `assets/task220.css`
- `assets/task220.js`
- `assets/img/task220/avatar-user.png`

## Kiểm tra

- `node --check`.
- Dùng script node render cả 3 tab.
- Mở trên trình duyệt của anh. Không chạy Chromium headless.

---

## Vòng 2 (06/11/2026): feedback mới. Anh đã duyệt (D1–D4 theo mặc định), đã làm, đã commit 33fde66.

### Feedback (nguyên văn) và cách làm

FEEDBACK 2 là bản mới nhất. Chỗ nào trùng với FEEDBACK 1 thì làm theo FEEDBACK 2.

| # | Feedback | Làm thế nào |
|---|---|---|
| A1 | *Change counter to remain hidden until user clicks 'change'* | Câu đếm "x of 2" bị B1 thay thế. Câu mới là luật 24 giờ: "You can change your username once every 24 hours." Câu này chỉ hiện sau khi bấm Change, đúng ý A1. |
| A2 | *Save interface for the name fields within larger save interface is confusing. We need to overhaul the structure of the page.* | Đưa 3 trường Username, First Name, Last Name ra khỏi card có nút Save chung. |
| A3 | *Perhaps we could section off the other fields into its own box with its own save button.* | Trang có 2 box, xem phần "Trên màn hình" bên dưới. |
| A4 | *Change contact to support@agathos.be* | Xem D2. |
| B1 | *…limit by timeframe (ie. user can change once every 24 hours)… Please revise the designs accordingly for all the fields.* | Bỏ giới hạn 2 lần trong đời tài khoản. Username, First Name và Last Name mỗi trường được đổi 1 lần trong 24 giờ. Bỏ trạng thái "No changes left" và cảnh báo "This is your last … change". |

### Trên màn hình (tab Account settings)

**Box 1: "Username and name"** (mới, nằm trên):
- Bố cục: Username một hàng riêng, First Name và Last Name chung một hàng (2 cột). Box này không có nút Save chung.
- Mỗi trường: nhãn, nút **Change** bên phải nhãn, ô xám hiện giá trị hiện tại (giống production).
- Dưới Username vẫn có câu "Your username is displayed publicly…". Câu này do task yêu cầu, feedback không nhắc tới.
- Bấm Change:
  - Ô thành ô nhập. Bên dưới hiện câu *"You can change your username once every 24 hours."* (A1).
  - Có 2 nút Cancel và Save.
- Bấm Save mở modal:
  - Tiêu đề *"Change your username?"*, kèm giá trị Current → New.
  - Với username: *"Your new username will be displayed publicly next to your donations."*
  - *"You won't be able to change your username again until 7 Nov 2026, 14:32."*
  - Hai nút Cancel và Change username.
- Sau khi đổi:
  - Toast *"Username changed"*.
  - Nút Change thay bằng 🔒 *"Change again after 7 Nov 2026, 14:32"*. Dòng này hiện sẵn, vì lúc này không còn nút để bấm.
- Lỗi mới: đã đổi ở thiết bị khác trong 24 giờ qua, và server từ chối. Câu báo: *"You changed your username less than 24 hours ago. Try again after 7 Nov 2026, 14:32."*

**Box 2: "Account Information"** (card production, giữ nút Save riêng ở góc phải):
- Gồm Email (không sửa được), Phone Number, Gender, Language, Bio và nút nhận tin.
- Chỉ bỏ 3 trường đã chuyển lên box 1. Còn lại giữ như production.
- Bố cục: Email và Phone chung một hàng, rồi Gender, rồi Language, rồi Bio.

**Tab Flow & messages:** sửa theo luật 24 giờ.
- Các bước: Change → nhập → Save → modal → đã đổi, khóa 24 giờ.
- Các nhánh: Cancel, Đang khóa, Save lỗi.
- Bảng câu báo:
  - Bỏ dòng "No changes left".
  - Thêm 2 dòng: trạng thái đang khóa, và lỗi "changed less than 24 hours ago".
- Ghi chú cho team: bỏ câu hỏi "đổi về giá trị cũ có tính không", thêm câu hỏi ở mục "Câu hỏi cho team" bên dưới.

**Tab Sign up:** không đổi.

**Thanh review (chỉ để demo):**
- Thay bộ nút "Changes left 2 / 1 / 0" bằng 2 nút "Can change" và "Changed 3 hours ago". Nút sau khóa cả 3 trường.
- Giữ nút "Next save fails".
- Thêm nút "Changed on another device" để xem lỗi 24 giờ.

### Quyết định, mặc định em chọn (anh đổi được)

- **D1. Mỗi trường tính 24 giờ riêng.** Vừa đổi username xong vẫn đổi được first name ngay. Phương án khác là 3 trường dùng chung một mốc 24 giờ. Feedback ghi *"user can change once every 24 hours … for all the fields"*; em hiểu là luật áp dụng cho cả 3 trường, mỗi trường một mốc.
- **D2. Bỏ dòng liên hệ.**
  - Dòng này chỉ có để phục vụ trạng thái hết lượt, mà B1 đã bỏ trạng thái đó. B1 cũng nói rõ muốn tránh việc người dùng phải liên hệ admin.
  - Phương án khác: giữ dòng liên hệ khi trường đang khóa, dùng **support@agathos.be** (A4).
  - Email hello@agathos.be ở footer là của production, em không đổi.
- **D3. Tên box:** box 1 là "Username and name". Box 2 giữ tên "Account Information" như production.
- **D4. Thời điểm hết khóa ghi ngày giờ cụ thể**, ví dụ "7 Nov 2026, 14:32", theo giờ máy người dùng. Không ghi đếm ngược kiểu "in 21 hours".

### Câu hỏi cho team (ghi vào tab Flow & messages, nhãn "To confirm")

- Mốc 24 giờ có tính từ lúc đăng ký không? Mặc định: không, lần đổi đầu tiên làm được ngay.
- Có gửi email cho người dùng sau mỗi lần đổi không? Câu hỏi này đã có từ vòng 1.

### Phạm vi theo file

- `assets/task220.js`: tab Account settings, modal, thanh review, tab Flow & messages.
- `assets/task220.css`: 2 box, trạng thái khóa.
- `docs/task220-plan.md`: log.
- Không sửa `task220.html`, tab Sign up, hay file nào khác.

### Kiểm tra nghiệm thu

- Phần tính năng không còn các chữ "of 2", "No changes left", "last … change" và "hello@agathos.be". Footer giữ nguyên.
- Câu luật 24 giờ chỉ hiện khi đang sửa một trường, và trong modal.
- Trang có 2 box. Box 1 không có Save chung. Nút Save của box 2 chỉ bật khi box 2 có thay đổi.
- Sau khi xác nhận đổi:
  - Trường vừa đổi bị khóa, ghi "Change again after …" bằng thời điểm đổi cộng 24 giờ.
  - 2 trường còn lại vẫn đổi được (theo D1).
- Lỗi "changed less than 24 hours ago" hiện đúng chỗ. Không có lần đổi nào được ghi nhận.
- Tab Sign up giữ nguyên từng byte HTML so với bản hiện tại.
- Kiểm bằng `node --check`, script node render cả 3 tab, và curl. Không chạy Chromium headless.

### Ước lượng thời gian

| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này | 0.1 | 0.1 |
| 2. Account settings: tách 2 box, CSS | 0.3 | 0.4 |
| 3. Luật 24 giờ: trạng thái khóa, modal, lỗi mới, thanh review | 0.3 | 0.7 |
| 4. Tab Flow & messages: bước, nhánh, bảng câu báo, ghi chú | 0.15 | 0.85 |
| 5. Kiểm tra (node, curl) và ghi log | 0.15 | 1.0 |

### Nhật ký vòng 2 (06/11/2026). Đã commit 33fde66.

**Đã làm đúng theo plan, không có chỗ nào làm khác.**

**`assets/task220.js`:**
- **Luật mới:** mỗi trường lưu thời điểm đổi gần nhất. Trong vòng 24 giờ sau lần đổi đó, trường bị khóa.
- **Box "Username and name":** Username một hàng riêng, First Name và Last Name chung một hàng.
  - Bấm Change thì mới hiện câu "You can change your … once every 24 hours."
  - Khi trường bị khóa, chỗ nút Change hiện "Change again after 7 Nov 2026, 14:32".
- **Box "Account Information":** giữ nguyên các trường còn lại và nút Save riêng.
- **Modal:** thay câu đếm số lần và cảnh báo lần đổi cuối bằng "You won’t be able to change your … again until …".
- **Câu báo lỗi mới:** "You changed your … less than 24 hours ago. Try again after …". Khi đang hiện lỗi này, nút Save bị tắt.
- **Thanh review:**
  - Hai nút "Can change" và "Changed 3 hours ago".
  - "Next save fails" và "Changed on another device": mỗi nút có tác dụng cho một lần Save.
  - Nút Reset.
- **Tab Flow & messages:** sửa các bước, các nhánh, bảng câu báo và ghi chú. Bỏ dòng liên hệ (D2).
- Gỡ các icon không còn dùng: count, mail, warn.

**`assets/task220.css`:**
- Thêm `.as-main` để xếp 2 box, `.as-names` và `.as-f.solo`.
- Gỡ `.md .warn`, `.as-note b` và `.as-note a`, vì không còn dùng.

**Đã kiểm tra:**
- `node --check` qua.
- Script node: 33/33 kiểm tra qua, theo đúng danh sách nghiệm thu ở trên. Trong đó HTML của tab Sign up giống từng byte với bản trước, cả khi có lỗi.
- Curl: trang, JS, CSS và ảnh đều trả về 200.
- Chưa xem giao diện bằng mắt.

**Chỉnh UI theo góp ý của anh (06/11/2026). Đã commit 33fde66.**
- **Username:** chiếm hết chiều ngang của box (class `full`). Đã gỡ `.as-f.solo`.
- **Language:** đưa lên cùng hàng với Gender.
  - Ô chọn rộng hết cột, cao 48px như 2 nút Gender. Chữ 15.5px.
  - Nhãn dùng cùng cỡ chữ với nhãn Gender, nên gỡ `.as-lbl.big`. Production đang dùng 17px cho nhãn này.
- **Đã kiểm tra:** script node 35/35 qua. Thêm kiểm tra: Username full width, Language đứng ngay sau Gender, Bio vẫn full width.

**Chỉnh theo góp ý thứ 2 của anh (06/11/2026). Đã commit 33fde66.**
- **Dòng "Change again after …":**
  - Chuyển từ hàng nhãn (bên phải, bị xuống dòng ở cột First/Last Name) xuống ngay dưới ô nhập, thành một dòng ghi chú có icon khóa.
  - Làm giống nhau cho cả 3 trường. Khi đang khóa, hàng nhãn chỉ còn tên trường.
  - Gỡ `.as-locked`.
- **Hai nút demo trên thanh review trước đây không hiện gì khi bấm.** Chúng chỉ "gài" cho lần Save kế tiếp, nên phải đi hết Change → Save → modal mới thấy kết quả. Giờ bấm là thấy luôn:
  - "Save fails" (trước là "Next save fails"): mở Username với một giá trị mới và hiện lỗi lưu thất bại.
  - "Changed on another device": mở First Name, hiện lỗi 24 giờ. Nút Save bị tắt.
  - Gỡ `S.next` và nhánh xử lý trong modal.
- **Đã kiểm tra:** script node 38/38 qua.
  - Thêm kiểm tra vị trí dòng khóa của cả 3 trường, và 2 nút demo hiện kết quả ngay.
  - Một lần chạy fail đã chỉ ra lỗi của nút "Save fails": giá trị điền sẵn có thể trùng username hiện tại, làm nút Save bị tắt. Đã sửa.

---

## Vòng 3 (16/11/2026): đổi username xong thì bị đăng xuất. Anh đã duyệt D1–D4, đã làm, đã commit và push (16/11/2026).

### Feedback (nguyên văn)
*"For the username change by the user, can the screens and flow be modified to inform the user that he will be logged out upon successful change? On the successful change, the user will be logged out."*

**Lý do, theo comment của dev gửi Josias (nguyên văn, anh chuyển ngày 16/11/2026):**
*"I found that when the user initiates a username change, and after a successful change, and he is not logged out, there's a problem arising. That's due to how the user session token is tracked. What can happen is the user can initiate multiple changes, and we can trap it or handle it cleanly. It doesn't mess up the user account, but on the UX aspect, it cannot be presented cleanly to the user. So that can cause quite a confuse. In short, the clean approach is to log the user out and ask the user to log in again."*

Em hiểu như sau:
- Phiên đăng nhập vẫn gắn với username cũ, nên nếu không đăng xuất thì người dùng có thể đổi thêm lần nữa và màn hình hiện không rõ ràng.
- Vì vậy đăng xuất ngay khi đổi thành công là việc bắt buộc, không phải tuỳ chọn. Điều này khớp với D3: không có bước nào ở giữa để người dùng làm thêm thao tác.
- Câu này sẽ ghi vào ghi chú của tab Flow & messages, để FE biết vì sao phải đăng xuất.

### Thay đổi trên màn hình (chỉ khi đổi Username; First Name và Last Name giữ nguyên)

| Chỗ | Hiện tại | Sau khi sửa |
|---|---|---|
| Ô Username đang sửa | Câu "You can change your username once every 24 hours." | Thêm một dòng ngay dưới: *"You'll be signed out after changing your username."* |
| Modal xác nhận | Current → New, câu hiển thị công khai, câu 24 giờ; nút "Change username" | Thêm khung báo: *"You'll be signed out. Sign in again to continue."*; nút đổi thành **"Change and sign out"** |
| Sau khi xác nhận | Toast "Username changed", ở lại trang | Không có toast. Chuyển sang trang **Sign in** của Keycloak, có khung báo: *"Your username is now <b>nguyenle</b>. Sign in again to continue."*; ô "Username or email" điền sẵn username mới |
| Đăng nhập lại | — | Quay về Account settings. Username đang khoá: "Change again after …" |

### Tab Flow & messages
- **Các bước:** sau "Confirm" của username, thêm 2 bước: "Signed out" (trang Sign in có khung báo, username mới điền sẵn) và "Sign in again" (Username khoá 24 giờ).
- **Bảng câu báo:** thêm 3 dòng: câu ở ô đang sửa, câu trong modal, câu trên trang Sign in.
- **Ghi chú cho team:**
  - First Name và Last Name không đăng xuất.
  - Lưu lỗi thì không đăng xuất.
  - Vì sao phải đăng xuất: phiên đăng nhập vẫn gắn với username cũ (theo comment của dev).
  - *To confirm:* đăng xuất cả các thiết bị khác, hay chỉ thiết bị đang dùng? Theo lý do ở trên, phiên ở thiết bị khác cũng còn gắn với username cũ.
  - *To check:* hiện khung báo trên trang Sign in của Keycloak bằng cách nào (thông báo của theme, hoặc tham số khi chuyển trang).

### Quyết định, mặc định em chọn (anh đổi được)
- **D1. Báo ở cả 2 chỗ:** khi bắt đầu sửa username và trong modal, để người dùng biết trước khi gõ chứ không chỉ ở bước cuối. Cách khác: chỉ báo trong modal.
- **D2. Nút modal ghi "Change and sign out".** Cách khác: giữ "Change username", chỉ thêm câu báo.
- **D3. Chuyển thẳng sang trang Sign in**, không có màn hình "Signing you out…" ở giữa. ~~Trang Sign in có khung báo và điền sẵn username mới.~~ Anh đổi ngày 16/11/2026: không khung báo, không điền sẵn; trang Sign in giữ nguyên như production.
- **D4. Trang Sign in trong prototype** dùng kiểu thẻ Keycloak giống tab Sign up, với các trường của production: Username or email, Password, Remember me, Forgot Password?, Sign In, Facebook/Google. Trang này chỉ minh hoạ khung báo; khi ra production thì dùng trang Sign in đang chạy (hoặc bản của Task #218 nếu đã lên).

### Phạm vi theo file
- `assets/task220.js`: dòng báo ở ô Username, modal, trang Sign in sau khi đổi, tab Flow & messages.
- `assets/task220.css`: khung báo trong modal, trang Sign in.
- `docs/task220-plan.md`: log.
- Không sửa tab Sign up hay file nào khác.

### Kiểm tra nghiệm thu
- Đổi First Name hoặc Last Name: không có chữ "signed out", vẫn có toast, không chuyển trang.
- Đổi Username:
  - ô đang sửa có dòng báo đăng xuất;
  - modal có khung báo và nút "Change and sign out";
  - xác nhận xong thì hiện trang Sign in có khung báo và username mới điền sẵn;
  - bấm Sign In thì về Account settings, Username khoá 24 giờ.
- "Save fails" và "Changed on another device": không đăng xuất.
- Tab Sign up giống từng byte HTML so với bản hiện tại.
- Kiểm bằng `node --check`, script node, curl. Không chạy Chromium headless.

### Ước lượng thời gian
| Bước | Ngày | Cộng dồn |
|---|---|---|
| 1. Plan này | 0.05 | 0.05 |
| 2. Dòng báo ở ô Username và modal (D1, D2) | 0.1 | 0.15 |
| 3. Trang Sign in sau khi đổi, đăng nhập lại về trang khoá (D3, D4) | 0.15 | 0.3 |
| 4. Tab Flow & messages | 0.1 | 0.4 |
| 5. Kiểm tra, log, sửa FE note | 0.1 | 0.5 |

### Nhật ký vòng 3 (16/11/2026). Đã commit và push (16/11/2026).

**Anh duyệt D1–D4 và dặn tham khảo cách các nền tảng lớn làm.**

Em tìm thấy như sau:
- Đổi username mà buộc đăng xuất thì ít gặp:
  - GitHub giữ phiên đăng nhập, chỉ khuyên đăng xuất rồi đăng nhập lại trên app điện thoại.
  - Microsoft (đổi primary alias) cần đăng xuất rồi đăng nhập lại trên từng thiết bị.
  - Turnitin báo đổi email, username hay mật khẩu xong thì phải đăng nhập lại bằng thông tin mới.
- Đăng xuất sau khi đổi thông tin đăng nhập là cách quen thuộc khi đổi mật khẩu: Google đăng xuất mọi nơi trừ vài thiết bị; Keycloak có lựa chọn "Sign out all devices".
- Cách làm chung: báo hậu quả trước khi xác nhận, nút ghi rõ việc sẽ xảy ra, rồi đưa về trang đăng nhập có câu nói rõ lý do. D1–D4 đã theo đúng cách này, nên em làm theo plan, không đổi gì.

**Đã làm:**
- `assets/task220.js`:
  - Dòng báo *"You'll be signed out after changing your username."* khi đang sửa Username (chỉ Username).
  - Modal Username: khung báo *"You'll be signed out. Sign in again to continue."*, nút *"Change and sign out"*.
  - Xác nhận xong: không toast, chuyển sang trang Sign in. Trang này có khung báo *"Your username is now … Sign in again to continue."* và điền sẵn username mới.
  - Trang Sign in theo production (bản tải về cho Task #218): tiêu đề, khung báo, đăng nhập mạng xã hội, "or sign in manually", Username or email, Password, Remember me, Forgot Password?, Sign In, Create an account. Bấm Sign In (mật khẩu nào cũng được) thì về Account settings, Username khoá 24 giờ.
  - Các nút trên thanh review đưa trang về lại Account settings.
  - Tab Flow & messages:
    - 8 bước, thêm "Signed out" và "Sign in again";
    - nhóm câu báo mới "Username change signs out" gồm 3 dòng;
    - ghi chú lý do phải đăng xuất, mục *To check* về khung báo trên Keycloak;
    - câu hỏi về thiết bị khác gộp vào dòng Questions sẵn có.
- `assets/task220.css`: `.as-note.out`, `.md-note`, `.kc-alert.info`, `.kc-opts`, `.kc-signup`; lưới bước 4 cột (3 cột trên màn vừa, 1 cột trên điện thoại).

**Đã kiểm tra:**
- `node --check` qua.
- Script node `t220-check.js` 29/29 qua:
  - đổi Username: dòng báo, modal, trang Sign in (đúng thứ tự trường của production, điền sẵn), đăng nhập lại thì Username khoá;
  - đổi First Name: không đăng xuất, vẫn có toast;
  - "Save fails": không đăng xuất;
  - Flow: 8 bước, 3 câu báo, ghi chú;
  - tab Sign up giống từng byte HTML so với bản trước, cả khi có lỗi.
- Curl trả về 200.
- **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (16/11/2026).

**Anh đổi D3 (16/11/2026): bỏ khung báo và không điền sẵn username, *"vì đa số dùng gmail, facebook để login"*. Đã commit và push (16/11/2026).**
- Trước đó anh hỏi khung báo có làm được không. Em trả lời: làm được nhưng phải sửa theme Keycloak (khoảng nửa ngày, cộng một lần deploy), và không nên lấy username từ URL để hiện lên trang. Em đề xuất bỏ khung, giữ điền sẵn. Anh chọn bỏ cả hai.
- `assets/task220.js`:
  - Trang Sign in sau khi đổi username giữ nguyên như production: không khung báo, ô "Username or email" để trống. `S.out` giờ chỉ là cờ true/false.
  - Tab Flow & messages: bước "Signed out" chỉ còn "lands on the Sign in page"; bỏ câu báo trên trang Sign in (còn 2 câu báo đăng xuất); bỏ mục *To check* về khung báo trên Keycloak.
- `assets/task220.css`: gỡ `.kc-alert.info` và `.kc-alert svg`.
- **Đã kiểm tra:** `node --check` qua. `t220-check.js` 30/30: trang Sign in không có khung báo, không điền gì; Flow không còn câu báo trên trang Sign in; các kiểm tra cũ vẫn qua, tab Sign up không đổi.
- **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (16/11/2026).

**Thông báo thành công trước khi đăng xuất (16/11/2026). Đã commit và push (16/11/2026).**
- Josias: *"I think you missed out the success screen"*. Anh trả lời team là không thêm màn hình riêng, vì như vậy dài quá. Em đề xuất 2 cách, anh chọn cách 1.
- `assets/task220.js`:
  - Bấm "Change and sign out" xong, modal đổi thành dấu tích xanh, tiêu đề **"Username changed"** và dòng **"Signing you out…"**, không có nút nào.
  - Sau 1.5 giây (`OUT_MS`) thì tự đăng xuất, sang trang Sign in. Người dùng không phải bấm gì.
  - Esc và bấm ra ngoài không đóng modal này. Các nút trên thanh review huỷ việc đăng xuất (chỉ để demo).
  - Tab Flow & messages:
    - bước Confirm ghi câu thành công;
    - bước Signed out ghi "signed out by itself, with no click";
    - bảng câu báo thêm dòng "Username changed. Signing you out…".
- `assets/task220.css`: `.md-done`.
- **Đã kiểm tra:** `node --check` qua. `t220-check.js` 35/35 (có đồng hồ giả):
  - modal thành công không có nút, Esc không đóng, đúng 1.5 giây rồi sang trang Sign in;
  - bấm Reset hoặc nút trên thanh review trong 1.5 giây thì không đăng xuất;
  - đổi First Name không có modal thành công;
  - tab Sign up không đổi.
- **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (16/11/2026).

**Đếm 3, 2, 1 thay cho 1.5 giây (16/11/2026, anh: *"nó nhanh quá, đếm 3,2,1 đi"*). Đã commit và push (16/11/2026).**
- Em có góp ý không nên đếm, nhưng anh chọn đếm. Đã làm theo.
- `assets/task220.js`:
  - Modal thành công: tiêu đề "Username changed", bên dưới đếm "Signing you out in 3 seconds…" → "2 seconds…" → "1 second…", rồi sang trang Sign in. Tổng cộng 3 giây (`OUT_S`), vẫn không có nút.
  - Mỗi giây chỉ đổi dòng đếm. Tiêu đề nằm trong vùng thông báo cho trình đọc màn hình nên chỉ được đọc một lần, còn các con số thì không được đọc.
  - Tab Flow & messages: bước Confirm và dòng trong bảng câu báo đổi theo câu đếm.
- **Đã kiểm tra:** `node --check` qua. `t220-check.js` 38/38: đúng câu ở 3, 2 và 1 giây; giây thứ 3 thì sang trang Sign in; trong lúc đếm chỉ đổi dòng đếm; Esc không đóng; Reset hoặc nút trên thanh review trong lúc đếm thì không đăng xuất; tab Sign up không đổi.
- **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (16/11/2026).

**Đổi câu trong modal theo Josias (16/11/2026, kèm ảnh khung báo trong modal). Đã commit và push (16/11/2026).**
- Josias: *"Change copy to "You'll be signed out. Please sign in again with your new username after it has been changed.""*
- `assets/task220.js`:
  - Khung báo trong modal Username: "You’ll be signed out. Sign in again to continue." → **"You’ll be signed out. Please sign in again with your new username after it has been changed."**
  - Dòng tương ứng trong bảng câu báo (tab Flow & messages) đổi theo.
  - Dòng báo khi đang sửa ô ("You’ll be signed out after changing your username.") giữ nguyên, vì feedback chỉ chỉ vào khung trong modal.
- **Đã kiểm tra:** `node --check` qua; không còn câu cũ trong code; `t220-check.js` 38/38.
- **Chưa kiểm tra:** chưa xem bằng mắt. Đã commit và push (16/11/2026).
