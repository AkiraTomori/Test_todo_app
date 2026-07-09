# Stage 1: Build Image
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file config dependency
COPY package*.json ./

# Cài đặt toàn bộ dependencies (bao gồm devDependencies để build Vite)
RUN npm ci

# Copy toàn bộ mã nguồn
COPY . .

# Tiến hành Build ra các file static HTML/JS/CSS
RUN npm run build

# Stage 2: Production Image (Chỉ chứa Nginx và Static files)
FROM nginx:alpine

# Copy cấu hình Nginx để hỗ trợ React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy thư mục dist từ Stage 1 sang thư mục phục vụ của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 cho Nginx
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
