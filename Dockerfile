# Sử dụng Node.js phiên bản Alpine để giảm dung lượng
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Cấu hình Next.js chạy ở chế độ development
CMD ["npm", "run", "dev"]
