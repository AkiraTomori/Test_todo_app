# 🎯 Đặc tả Yêu cầu & Tính năng (Features Specification)

[cite_start]Tài liệu này định nghĩa chi tiết các tính năng cần phát triển cho ứng dụng Quản lý công việc (Todo List)[cite: 3].

## I. Yêu cầu chức năng (Functional Requirements)

### 1. Quản lý công việc cốt lõi
* **Hiển thị danh sách:** Người dùng có thể xem toàn bộ danh sách các công việc đã tạo.
* **Thêm mới:** Người dùng có thể tạo một công việc mới với tiêu đề và mô tả (tùy chọn).
* **Chỉnh sửa:** Cho phép cập nhật nội dung của một công việc đã tồn tại.
* **Xóa:** Người dùng có thể xóa một công việc khỏi danh sách.
* **Cập nhật trạng thái:** Cho phép thay đổi trạng thái công việc qua lại giữa "Hoàn thành" và "Chưa hoàn thành".

### 2. Tiện ích nâng cao
* **Tìm kiếm & Lọc:**
  * Lọc danh sách theo trạng thái (Tất cả, Đã hoàn thành, Chưa hoàn thành).
  * Tìm kiếm công việc theo từ khóa trong tiêu đề.
* **Phân trang & Sắp xếp:**
  * Sắp xếp danh sách theo thời gian tạo (mới nhất/cũ nhất).
  * Áp dụng phân trang (Pagination) nếu số lượng công việc lớn.

## II. Yêu cầu kỹ thuật (Technical Requirements)

### 1. Kiến trúc & Công nghệ
* **Frontend:** ReactJS (Phân chia Component, Custom Hooks).
* **Backend:** NodeJS + ExpressJS.
* **Mô hình Backend:** Áp dụng MVC kết hợp Service Layer (Controller -> Service -> Model) để tổ chức mã nguồn rõ ràng, dễ bảo trì.
* **Database:** PostgreSQL (Quan hệ 1-N giữa User và Todo).

### 2. Xử lý Dữ liệu & UI/UX
* **Xử lý ngoại lệ:** Bắt lỗi (Validation) chặt chẽ các trường hợp dữ liệu không hợp lệ từ Client gửi lên (ví dụ: title trống, ID không tồn tại).
* **Giao diện:** Thiết kế Responsive, đảm bảo hiển thị tốt trên cả Desktop và Mobile.