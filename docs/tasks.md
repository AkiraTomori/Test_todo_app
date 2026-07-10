# ☑️ Kế hoạch Phát triển & Checklist Công việc

Dự án có thời gian thực hiện là 02 ngày. Cần ưu tiên hoàn thành các tính năng cốt lõi trước khi thực hiện các yêu cầu khuyến khích.

## Giai đoạn 1: Khởi tạo dự án & Database (Ngày 1 - Sáng)
- [X] Thiết lập cấu trúc thư mục Monorepo (frontend & backend).
- [X] Khởi tạo dự án NodeJS/Express, cài đặt các thư viện cần thiết (express, pg, cors, dotenv, bcrypt, jsonwebtoken).
- [X] Khởi tạo dự án ReactJS (Vite hoặc CRA).
- [X] Thiết kế Database PostgreSQL:
  - [X] Tạo bảng `users` (id, username, password_hash, created_at, updated_at).
  - [X] Tạo bảng `todos` (id, user_id, title, description, is_completed, created_at, updated_at).
- [X] Viết script kết nối Database ở Backend.

## Giai đoạn 2: Phát triển Backend API - MVC & Service (Ngày 1 - Chiều)
- [X] **Setup Architecture:** Tạo các folder `controllers`, `services`, `models`, `routes`.
- [X] **Models:** Viết các câu truy vấn SQL tương tác với PostgreSQL cho `Todo` và `User`.
- [X] **Services (Business Logic):**
  - [X] Hàm lấy danh sách Todos (hỗ trợ phân trang, lọc, sắp xếp).
  - [X] Hàm thêm Todo (kèm xử lý validation dữ liệu).
  - [X] Hàm cập nhật thông tin & trạng thái Todo.
  - [X] Hàm xóa Todo.
- [X] **Controllers:** Nhận request, gọi Service và trả về JSON Response chuẩn.
- [X] **Routes:** Cấu hình các endpoint (GET, POST, PUT, DELETE) cho `/api/todos`.
- [X] Cấu hình Error Handling Middleware để quản lý lỗi đồng nhất.

## Giai đoạn 3: Phát triển Frontend (Ngày 2 - Sáng)
- [X] Thiết lập cấu trúc Component (TodoList, TodoItem, TodoForm, FilterBar).
- [X] Viết API Services ở Frontend (sử dụng Axios hoặc Fetch) để gọi Backend.
- [X] Cài đặt UI & Responsive Layout (có thể dùng TailwindCSS hoặc CSS modules).
- [X] Tích hợp tính năng:
  - [X] Hiển thị danh sách Todo và gọi API GET.
  - [X] Xử lý form thêm mới Todo và gọi API POST.
  - [X] Xử lý nút Check/Uncheck và gọi API PUT.
  - [X] Xử lý nút Xóa và gọi API DELETE.
- [X] Cài đặt tính năng Lọc hoặc Tìm kiếm trên giao diện.

## Giai đoạn 4: Hoàn thiện & Khuyến khích (Ngày 2 - Chiều)
- [ ] Viết Unit Test (Jest/Mocha) cho ít nhất 1-2 hàm trong Service layer của Backend.
- [X] Đóng gói Docker:
  - [X] Viết `Dockerfile` cho Frontend.
  - [X] Viết `Dockerfile` cho Backend.
  - [X] Viết `docker-compose.yml` để chạy cụm (Postgres + Node + React).
- [ ] Triển khai (Deployment): Setup môi trường trên Google Cloud Platform (GCP) để đưa ứng dụng lên online.
- [X] Kiểm tra lại toàn bộ source code, dọn dẹp console.log.
- [X] Cập nhật file `README.md` với đầy đủ hướng dẫn chạy dự án.