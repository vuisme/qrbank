# Sử dụng image node phiên bản 18 làm base image
FROM node:18-alpine

# Tạo thư mục /app
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có) vào thư mục /app
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ source code vào thư mục /app
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]