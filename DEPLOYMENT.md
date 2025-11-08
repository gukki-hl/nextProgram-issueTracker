# 部署指南

本文档详细介绍 Issue Tracker 项目的各种部署方式和配置方法。

## 目录

- [部署前准备](#部署前准备)
- [Vercel 部署（推荐）](#vercel-部署推荐)
- [Docker 部署](#docker-部署)
- [传统服务器部署](#传统服务器部署)
- [数据库配置](#数据库配置)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

## 部署前准备

### 1. 环境检查

确保你已经完成以下准备工作：

- ✅ 代码已推送到 Git 仓库（GitHub / GitLab / Bitbucket）
- ✅ 数据库已创建并可访问（MySQL）
- ✅ Google OAuth 凭证已配置
- ✅ 所有环境变量已准备好

### 2. 构建测试

在部署前先在本地测试生产构建：

```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
```

访问 `http://localhost:3000` 确认没有错误。

## Vercel 部署（推荐）

Vercel 是 Next.js 官方推荐的部署平台，提供零配置部署体验。

### 方式一：通过 Vercel Dashboard

1. **访问 Vercel**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub / GitLab / Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 Git 仓库
   - Vercel 会自动检测 Next.js 框架

3. **配置环境变量**
   在 "Environment Variables" 部分添加：

   ```
   DATABASE_URL=mysql://user:pass@host:port/db?ssl-mode=REQUIRED
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 1-3 分钟）
   - 访问分配的域名查看应用

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

### Vercel 配置优化

创建 `vercel.json` 配置文件：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://your-domain.vercel.app"
  }
}
```

### 自动部署

Vercel 默认会自动部署：
- `main` 分支推送 → 生产环境
- 其他分支推送 → 预览环境
- Pull Request → 预览环境

## Docker 部署

使用 Docker 容器化部署应用。

### 1. 创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1

# 生成 Prisma Client
RUN npx prisma generate

# 构建应用
RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. 修改 next.config.js

启用 standalone 输出：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

### 3. 创建 .dockerignore

```
node_modules
.next
.git
*.md
.env.local
```

### 4. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=issue-tracker
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

### 5. 构建和运行

```bash
# 构建镜像
docker build -t issue-tracker .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e GOOGLE_CLIENT_ID="your-id" \
  -e GOOGLE_CLIENT_SECRET="your-secret" \
  issue-tracker

# 或使用 docker-compose
docker-compose up -d
```

## 传统服务器部署

在 VPS 或云服务器上部署（Ubuntu 示例）。

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 Nginx
sudo apt install -y nginx
```

### 2. 克隆项目

```bash
# 克隆代码
git clone https://github.com/your-username/issue-tracker.git
cd issue-tracker

# 安装依赖
npm install

# 创建 .env 文件
nano .env
# 粘贴环境变量并保存

# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma db push

# 构建项目
npm run build
```

### 3. 使用 PM2 管理进程

```bash
# 启动应用
pm2 start npm --name "issue-tracker" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs issue-tracker

# 设置开机自启
pm2 startup
pm2 save
```

### 4. 配置 Nginx 反向代理

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/issue-tracker
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/issue-tracker /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 5. 配置 SSL（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

## 数据库配置

### Aiven MySQL（推荐）

1. 访问 [Aiven Console](https://console.aiven.io/)
2. 创建 MySQL 服务
3. 选择区域（建议选择离用户近的区域）
4. 复制连接字符串
5. 添加到 `DATABASE_URL` 环境变量

### PlanetScale

1. 访问 [PlanetScale](https://planetscale.com/)
2. 创建数据库
3. 获取连接字符串
4. 注意：PlanetScale 不支持外键，需要修改 Prisma Schema

### 本地 MySQL

```bash
# 安装 MySQL
sudo apt install mysql-server

# 创建数据库
mysql -u root -p
CREATE DATABASE issue_tracker;
CREATE USER 'issue_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON issue_tracker.* TO 'issue_user'@'localhost';
FLUSH PRIVILEGES;
```

连接字符串：
```
DATABASE_URL="mysql://issue_user:password@localhost:3306/issue_tracker"
```

## 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | MySQL 数据库连接字符串 | `mysql://user:pass@host:port/db` |
| `NEXTAUTH_URL` | 应用的完整 URL | `https://your-app.com` |
| `NEXTAUTH_SECRET` | NextAuth 密钥（32 字符） | 使用 `openssl rand -base64 32` 生成 |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID | 从 Google Cloud Console 获取 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 客户端密钥 | 从 Google Cloud Console 获取 |

### 可选的环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 应用端口 | `3000` |
| `SENTRY_DSN` | Sentry 错误监控 DSN | - |

### Google OAuth 配置步骤

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "Google+ API"
4. 创建 OAuth 2.0 凭据
5. 添加授权重定向 URI：
   - 开发环境：`http://localhost:3000/api/auth/callback/google`
   - 生产环境：`https://your-domain.com/api/auth/callback/google`
6. 复制客户端 ID 和密钥

## 常见问题

### 1. 构建失败

**问题**：`Error: Prisma Client not generated`

**解决**：
```bash
npx prisma generate
npm run build
```

### 2. 数据库连接失败

**问题**：`Error: Can't reach database server`

**解决**：
- 检查 `DATABASE_URL` 格式是否正确
- 确认数据库服务正在运行
- 检查防火墙和网络配置
- 验证 SSL 连接设置

### 3. Google 登录重定向错误

**问题**：`redirect_uri_mismatch`

**解决**：
- 在 Google Cloud Console 添加正确的重定向 URI
- 确保 `NEXTAUTH_URL` 与实际域名一致
- 清除浏览器缓存重试

### 4. 环境变量未生效

**问题**：环境变量在 Vercel 上不生效

**解决**：
- 确认在 Vercel Dashboard 正确添加了环境变量
- 重新部署项目
- 检查是否需要 `NEXT_PUBLIC_` 前缀（客户端变量）

### 5. Prisma 迁移问题

**问题**：`Database migration failed`

**解决**：
```bash
# 重置数据库（仅开发环境）
npx prisma db push --force-reset

# 生产环境使用迁移
npx prisma migrate deploy
```

## 性能优化建议

### 1. CDN 配置
- 使用 Vercel 自带的 CDN
- 或配置 Cloudflare CDN

### 2. 数据库优化
- 添加适当的索引
- 使用连接池
- 启用查询缓存

### 3. 缓存策略
```typescript
// 在 API 路由中添加缓存头
export async function GET(request: Request) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}
```

### 4. 图片优化
使用 Next.js Image 组件自动优化图片。

## 监控和日志

### Sentry 集成

项目已集成 Sentry，无需额外配置。错误会自动上报到 Sentry Dashboard。

### Vercel Analytics

在 Vercel Dashboard 启用 Analytics 查看：
- 页面访问量
- 性能指标
- Web Vitals

### PM2 监控

```bash
# 查看实时监控
pm2 monit

# 查看日志
pm2 logs issue-tracker

# 导出日志
pm2 logs issue-tracker --lines 1000 > logs.txt
```

## 备份策略

### 数据库备份

```bash
# 导出数据库
mysqldump -u username -p database_name > backup.sql

# 导入数据库
mysql -u username -p database_name < backup.sql
```

### 自动备份脚本

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > backup_$DATE.sql
# 上传到云存储（如 AWS S3）
```

## 回滚策略

### Vercel 回滚

在 Vercel Dashboard：
1. 进入 "Deployments"
2. 选择历史版本
3. 点击 "Promote to Production"

### PM2 回滚

```bash
# 拉取旧版本代码
git checkout <commit-hash>

# 重新构建
npm run build

# 重启应用
pm2 restart issue-tracker
```

## 总结

- ✅ **推荐方案**：Vercel（零配置、自动部署、全球 CDN）
- ✅ **备选方案**：Docker（容器化、可移植）
- ✅ **传统方案**：VPS + PM2 + Nginx（完全控制）

根据你的需求选择合适的部署方式。如有问题，请参考 [常见问题](#常见问题) 或提交 Issue。
