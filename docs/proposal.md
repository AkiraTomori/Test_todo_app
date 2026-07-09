# 📝 Ứng dụng Quản lý công việc (Todo List)

## 📖 Giới thiệu
Đây là dự án xây dựng một ứng dụng Quản lý công việc (Todo List) , được thực hiện cho bài test Intern Developer. Ứng dụng cho phép người dùng quản lý các tác vụ hàng ngày của mình một cách hiệu quả, thân thiện và tối ưu.

Dự án được xây dựng với **ReactJS** ở Frontend và **NodeJS (ExpressJS)** ở Backend, sử dụng cơ sở dữ liệu **PostgreSQL**. Mã nguồn được thiết kế theo các tiêu chuẩn thực tế để đảm bảo khả năng mở rộng và bảo trì.

## ✨ Tính năng nổi bật

### Yêu cầu cốt lõi
* Hiển thị danh sách công việc.
* Thêm công việc mới.
* Chỉnh sửa công việc.
* Xóa công việc.
* Đánh dấu hoàn thành/chưa hoàn thành.
* Cho phép tìm kiếm hoặc lọc theo trạng thái.

### Xử lý kỹ thuật
* Bắt lỗi và xử lý các trường hợp dữ liệu không hợp lệ từ phía client đến server.
* Giao diện thân thiện, Responsive tương thích nhiều thiết bị.

## 🛠 Tech Stack & Kiến trúc

### Frontend (ReactJS)
* Tổ chức theo chuẩn cấu trúc ReactJS hiện đại (chia nhỏ Components, Custom Hooks, Context/Redux nếu cần).
* Giao diện UI/UX trực quan, dễ sử dụng.

### Backend (NodeJS + ExpressJS)
* **Kiến trúc MVC + Service Layer**:
    * **Controllers**: Tiếp nhận request, định tuyến và trả về response.
    * **Services**: Tầng trung gian chứa toàn bộ logic nghiệp vụ (Business Logic), giúp Controller mỏng và dễ test.
    * **Models**: Quản lý giao tiếp trực tiếp với cơ sở dữ liệu.

### Database (PostgreSQL)
Thiết kế dựa trên 2 thực thể chính:
* **User**: Đại diện cho người dùng hệ thống.
* **Todo**: Đại diện cho các công việc.
* **Mối quan hệ**: `1 User -> 0..N Todo`. Một công việc (Todo) chỉ thuộc về duy nhất một User.

## 📂 Cấu trúc thư mục (Folder Structure)

```text
📦 todo-app
 ┣ 📂 client (ReactJS)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📂 services (Gọi API)
 ┃ ┃ ┗ ...
 ┣ 📂 server (NodeJS/Express)
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 controllers
 ┃ ┃ ┣ 📂 services
 ┃ ┃ ┣ 📂 models
 ┃ ┃ ┣ 📂 routes
 ┃ ┃ ┗ 📂 config
 ┃ ┗ 📜 .env.example
 ┗ 📜 README.md
```

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu môi trường
* Node.js (v16 trở lên)
* PostgreSQL (đang chạy service)
* Docker (Tùy chọn) 

### Bước 1: Khởi tạo Database
1. Tạo một database mới trong PostgreSQL (ví dụ: `todo_db`).
2. Import file schema/seed (nếu có) từ thư mục `server/database` hoặc chạy lệnh migrate tương ứng.

### Bước 2: Thiết lập Backend
1. Di chuyển vào thư mục server: `cd server`
2. Cài đặt các gói phụ thuộc: `npm install`
3. Copy file `.env.example` thành `.env` và cấu hình các biến môi trường (Database credentials, PORT,...).
4. Khởi chạy server: `npm run dev` (Backend thường chạy ở `http://localhost:5000`)

### Bước 3: Thiết lập Frontend
1. Di chuyển vào thư mục client: `cd client`
2. Cài đặt các gói phụ thuộc: `npm install`
3. Cấu hình file `.env` chứa URL của API backend (ví dụ: `REACT_APP_API_URL=http://localhost:5000/api`).
4. Khởi chạy ứng dụng: `npm start` (Frontend thường chạy ở `http://localhost:3000`)

## 🐳 Khởi chạy bằng Docker
* docker-compose up -d
## 📝 Đánh giá
Dự án được hoàn thiện trong vòng 02 ngày. Mọi thông tin đóng góp hoặc phản hồi về kiến trúc mã nguồn đều được hoan nghênh!