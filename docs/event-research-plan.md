# /event-research: Event feedback research (Task 2)

Nguồn: file "Product & Tech Roadmap (Q3 2026).xlsx" (để ở thư mục gốc repo, chưa đưa vào git), sheet **Event Feedback**. Sheet có 17 issue ở dòng 2–18, kèm 4 ảnh chụp ở dòng 5, 6, 7 và 13.

Anh dặn: "không cần đặt câu hỏi, cứ làm theo mặc định đề xuất". Vì vậy em ghi các mặc định ở đây và làm luôn, không chờ duyệt.

## Mặc định em chọn

- **D1. Gom 17 issue thành 7 nhóm**, theo chỗ người dùng gặp vấn đề:

  | Nhóm | Dòng trong sheet |
  |---|---|
  | Checkout và tài khoản | 5, 7, 13 |
  | Tìm và mở vé | 3, 6, 9, 14 |
  | Soát vé ở cửa | 8, 10, 12 |
  | Ngày giờ | 11, 16 |
  | Danh sách người tham dự | 2, 15 |
  | Gửi tin cho người tham dự | 4, 17 |
  | Sau sự kiện | 18 |

- **D2. Mỗi issue là một thẻ**, gồm:
  - vấn đề, chép từ sheet;
  - ý tưởng của team (cột High-Level Solution), nếu có;
  - mức ưu tiên và số GitLab, nếu có;
  - 2–4 cách các nền tảng lớn đang làm, mỗi cách có link nguồn;
  - một đề xuất ngắn cho Agathos.
- **D3. Nền tảng tham khảo:** Eventbrite, Luma, Humanitix (nền tảng vé từ thiện), Peatix (phổ biến ở Singapore và châu Á), Ticket Tailor, Tito, Zeffy/Givebutter (cho tổ chức phi lợi nhuận). Ngoài ra có hướng dẫn UX chung khi thật sự liên quan, ví dụ Baymard, NN/g, tài liệu Keycloak, GOV.UK.
  - Chỉ ghi những gì có nguồn. Phần nào agent nghiên cứu không xác minh được thì bỏ.
- **D4. Trang viết bằng tiếng Anh**, vì team và sheet dùng tiếng Anh. Giao diện giống `/financial-report`:
  - Bộ lọc theo mức ưu tiên.
  - Mục lục theo nhóm: trên desktop là cột trái, trên mobile là hàng chip.
- **D5. Không dùng ảnh chụp màn hình của nền tảng khác**, chỉ dùng chữ và link nguồn, để tránh vấn đề bản quyền và link ảnh chết.
- **D6. Không đưa 4 ảnh chụp trong sheet lên trang.** Ảnh có email thật của tài khoản test.

## Phạm vi theo file

Tạo 3 file mới. Không sửa file nào khác.
- `event-research.html`
- `assets/event-research.js`: nội dung và phần render.
- `assets/event-research.css`

## Nhật ký

**26/10/2026: làm xong, chưa commit.**

- Cách nghiên cứu: 3 agent tìm song song theo nhóm issue, chỉ ghi những gì có trong trang nguồn.
- Em bỏ những ý chỉ có trong bản lưu của công cụ tìm kiếm, vì không mở được trang gốc:
  - Universe, DICE;
  - vài trang trợ giúp của Eventbrite (đã thay bằng blog hoặc bản .ca/.co.uk mở được);
  - forum Keycloak.
- pretix không có trong danh sách ban đầu. Em thêm nó ở 2 issue (soát vé thủ công, giờ được soát vé) vì nó có tài liệu rõ cho đúng chỗ đó.
- Dòng 6 (Keycloak): ý về nguyên nhân màn "Page has expired" chỉ dựa vào tài liệu cấu hình và các báo cáo cộng đồng, trang có ghi rõ như vậy. Cần xem login events của Keycloak mới biết nguyên nhân thật.
- Đã kiểm tra:
  - **Cấu trúc trang** (chạy script bằng node, không mở trình duyệt): 17 thẻ, 7 nhóm, 65 link nguồn, mỗi thẻ có ít nhất 3 link, đủ 17 đề xuất.
  - **Link nguồn:** 57 link (không trùng) đều trả về 200 khi kiểm bằng curl.
  - **Cú pháp:** `node --check` không báo lỗi.
- Chưa kiểm tra giao diện bằng ảnh chụp, vì không chạy Chromium headless.

## Kiểm tra nghiệm thu

- Đủ 17 issue, mỗi issue có ít nhất một link nguồn.
- Bộ lọc ưu tiên và mục lục chạy đúng.
- Không cuộn ngang ở 1440 và 390, console không có lỗi.
  - Kiểm tra nhẹ để không làm máy anh nặng: dùng `node --check` và kiểm tra cấu trúc bằng script. Không chạy Chromium headless.
