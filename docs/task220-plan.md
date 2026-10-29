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
