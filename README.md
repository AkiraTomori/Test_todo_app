# 📝 Todo App Monorepo - Kiến trúc Toàn diện

Đây là dự án ứng dụng Quản lý công việc (Todo List) với đầy đủ quy trình từ thiết kế Database, xây dựng Backend API, phát triển giao diện Frontend và đóng gói triển khai (Containerization) với cấu trúc Monorepo.

---

## 🏗 Kiến trúc Hệ thống (Architecture)

Hệ thống được thiết kế theo mô hình **Client - Server**, triển khai dưới dạng các Docker Container độc lập giao tiếp thông qua Docker Network (`test_default`).

1. **Database Layer:** Sử dụng PostgreSQL chạy trên container `todo_postgres`.
2. **Backend API Layer:** Ứng dụng Node.js/Express chạy trên container `todo_backend`. Chịu trách nhiệm xử lý logic, phân quyền, giao tiếp DB thông qua Prisma ORM và thực hiện Validation với Zod.
3. **Frontend Layer:** Ứng dụng ReactJS (Vite) được build tĩnh (Static files) và phục vụ thông qua máy chủ Nginx cực nhẹ trên container `test-frontend-1`. Hỗ trợ Client-side Routing.

---

## 🚀 Công nghệ & Phụ thuộc (Dependencies)

### 1. Backend (`/backend`)
- **Core:** Node.js, Express.
- **Cơ sở dữ liệu & ORM:** PostgreSQL, `@prisma/client`, `@prisma/adapter-pg`.
- **Bảo mật (Security):** `bcrypt` (Mã hóa mật khẩu), `jsonwebtoken` (Xác thực Stateless JWT).
- **Validation:** `zod` (Xây dựng Middleware kiểm tra dữ liệu đầu vào chặt chẽ từ Request Body).
- **Tooling:** `dotenv` (Quản lý biến môi trường), `cors`.

### 2. Frontend (`/frontend`)
- **Core & UI:** React (Vite), TailwindCSS, Lucide React (Icons), `clsx` & `tailwind-merge` (Xử lý CSS classes).
- **Network & State:** `axios` (Đã đính kèm Interceptors để tự động gắn Token và bắt lỗi 401).
- **Routing:** `react-router-dom` v6 (Phân chia Public/Protected Routes).
- **Form & Validation:** `react-hook-form` kết hợp với `yup` (Xác thực dữ liệu form thời gian thực như độ dài, mật khẩu chứa chữ số).

---

## 🗄 Cơ sở dữ liệu (Database Schema)

Database được quản lý hoàn toàn tự động bằng Prisma (Migration/Push). Sơ đồ quan hệ bao gồm:

### Bảng `users` (Người dùng)
| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Int | PK, Auto Increment | Khóa chính |
| `username` | String (50) | Unique | Tên đăng nhập |
| `password_hash`| String (255)| | Mật khẩu mã hóa bcrypt |
| `created_at` | DateTime | Default(now) | Ngày tạo tài khoản |
| `updated_at` | DateTime | @updatedAt | Tự động lưu lúc cập nhật |

### Bảng `todos` (Công việc)
| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | Int | PK, Auto Increment | Khóa chính |
| `user_id` | Int | FK -> users(id) | Thuộc về User nào (Cascade Delete) |
| `title` | String (255)| | Tên công việc |
| `description`| String | Nullable | Mô tả chi tiết |
| `is_completed`| Boolean | Default(false)| Trạng thái (Đã xong/Chưa xong) |
| `created_at` | DateTime | Default(now) | Ngày tạo |
| `updated_at` | DateTime | @updatedAt | Tự động lưu lúc cập nhật |

---

## 🛠 Hướng dẫn chạy & Triển khai (Docker Compose)

Toàn bộ dự án đã được tự động hóa. Đảm bảo máy tính của bạn đã cài đặt **Docker** và **Docker Compose**.

1. Cấu hình biến môi trường (Có thể sử dụng mặc định có sẵn trong `.env` của các thư mục).
2. Tại thư mục gốc của dự án, chạy lệnh:
   ```bash
   docker-compose up -d --build
   ```
3. Docker sẽ tiến hành:
   - Build Image `backend`: Cài đặt thư viện, tạo schema DB, chạy lệnh Seed dữ liệu (tạo user `admin`, `guest`).
   - Build Image `frontend` theo phương thức **Multi-stage**: Dùng node build ra tĩnh (dist), rồi đưa sang Nginx.
   - Chạy toàn bộ hệ thống lên cổng giao tiếp máy chủ.

**Địa chỉ truy cập:**
- **Frontend App:** [http://localhost:5173](http://localhost:5173) (Đã map vào cổng 80 của Nginx)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api)

---

## ✨ Các tính năng nổi bật (Features)

1. **Zero-Trust Security & Validation:** 
   - Backend không tin tưởng bất kì payload nào từ người dùng, mọi request đều đi qua lớp chắn `Zod Middleware`. 
   - Tất cả API của Todo đều yêu cầu `Auth Middleware` (Xác thực qua JWT).
2. **Instant Local Filtering:**
   - Việc lọc (Tất cả / Đang làm / Đã xong) ở Frontend được thiết kế tối ưu bằng Javascript Array Filter cục bộ, giúp giao diện thay đổi tức thời mà không cần reload dữ liệu tốn kém từ server.
3. **Optimistic UI Data Tying:**
   - Ngay khi bạn Cập nhật (Edit / Toggle) Todo, Frontend sẽ chờ nhận chính xác bản lưu mới nhất từ Backend (bao gồm cả mốc thời gian `@updated_at`) để hiển thị thông báo "Sửa lúc:..." một cách chính xác tuyệt đối ngay trên giao diện.
4. **Seamless Error Handling:**
   - Khi JWT token hết hạn, `axios interceptor` bắt mã `401 Unauthorized` và lập tức đẩy người dùng về trang `/login` đồng thời xóa bộ nhớ.

---
*Dự án được xây dựng từ quy trình bài bản: Phân tích, Kế hoạch, Thiết kế Database, Backend Zero-trust và Frontend UI/UX hiện đại.*
