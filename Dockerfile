FROM node:20-slim

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm ci

# 拷贝源码并构建
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/boot.js"]
