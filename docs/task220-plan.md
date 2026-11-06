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

## Vòng 2 (06/11/2026): feedback mới. Anh đã duyệt (D1–D4 theo mặc định), đã làm, chưa commit.

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

### Nhật ký vòng 2 (06/11/2026). Chưa commit.

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

**Chỉnh UI theo góp ý của anh (06/11/2026). Chưa commit.**
- **Username:** chiếm hết chiều ngang của box (class `full`). Đã gỡ `.as-f.solo`.
- **Language:** đưa lên cùng hàng với Gender.
  - Ô chọn rộng hết cột, cao 48px như 2 nút Gender. Chữ 15.5px.
  - Nhãn dùng cùng cỡ chữ với nhãn Gender, nên gỡ `.as-lbl.big`. Production đang dùng 17px cho nhãn này.
- **Đã kiểm tra:** script node 35/35 qua. Thêm kiểm tra: Username full width, Language đứng ngay sau Gender, Bio vẫn full width.

**Chỉnh theo góp ý thứ 2 của anh (06/11/2026). Chưa commit.**
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
