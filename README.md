# Issue Tracker 项目管理系统

一个基于 Next.js 15 全栈架构的企业级问题追踪管理系统，支持问题创建、编辑、删除、分配、状态管理和数据可视化等功能。

## 项目预览

- **Dashboard 仪表盘**：实时展示问题统计数据和最新问题列表
- **问题列表**：支持状态筛选、动态排序、分页加载
- **问题详情**：查看问题详细信息、编辑、删除、分配给用户
- **用户认证**：Google OAuth 第三方登录

## 技术栈

### 前端技术
- **Next.js 15** - React 全栈框架，App Router 架构
- **React 19** - 前端 UI 库
- **TypeScript** - 类型安全的 JavaScript 超集
- **Radix UI** - 无障碍 UI 组件库
- **TailwindCSS** - 原子化 CSS 框架
- **React Hook Form** - 高性能表单管理
- **Zod** - TypeScript-first 的校验库
- **Recharts** - React 数据可视化图表库
- **SimpleMDE** - Markdown 编辑器
- **React Query** - 服务端状态管理

### 后端技术
- **Next.js API Routes** - 服务端 API 接口
- **Prisma** - 下一代 ORM 工具
- **MySQL** - 关系型数据库（Aiven Cloud）
- **NextAuth.js** - 身份认证解决方案

### 开发工具
- **ESLint** - 代码质量检查
- **Sentry** - 错误监控和性能追踪
- **Vercel** - 部署平台

## 项目结构

```
issue-tracker/
├── app/                          # Next.js App Router 目录
│   ├── api/                      # API 路由
│   │   ├── auth/                 # NextAuth 认证接口
│   │   ├── issues/               # Issue CRUD 接口
│   │   └── users/                # 用户接口
│   ├── auth/                     # 认证配置
│   ├── component/                # 全局公共组件
│   │   ├── ErrorMessage.tsx      # 错误提示组件
│   │   ├── IssueStatusBadge.tsx  # 状态徽章组件
│   │   ├── Link.tsx              # 自定义链接组件
│   │   ├── Pagination.tsx        # 分页组件
│   │   ├── Skeleton.tsx          # 骨架屏组件
│   │   └── Spinner.tsx           # 加载动画组件
│   ├── issues/                   # Issue 功能模块
│   │   ├── [id]/                 # 问题详情（动态路由）
│   │   │   ├── AssignSelect.tsx  # 分配用户选择器
│   │   │   ├── DeleteIssueButon.tsx  # 删除按钮
│   │   │   ├── EditIssueButton.tsx   # 编辑按钮
│   │   │   ├── IssueDatails.tsx      # 问题详情展示
│   │   │   ├── loading.tsx           # 加载状态
│   │   │   └── page.tsx              # 详情页面
│   │   ├── edit/[id]/            # 编辑问题
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── list/                 # 问题列表
│   │   │   ├── IssueStatusFilter.tsx  # 状态筛选器
│   │   │   ├── IssuesAction.tsx       # 操作按钮
│   │   │   ├── IssueTable.tsx         # 问题表格
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── new/                  # 创建问题
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── _compoent/            # Issue 模块私有组件
│   │       └── issueForm.tsx     # 问题表单组件
│   ├── ClientThemePanel.tsx      # 主题切换面板
│   ├── IssueChart.tsx            # 问题统计图表
│   ├── IssueSummary.tsx          # 问题摘要卡片
│   ├── Latestissues.tsx          # 最新问题列表
│   ├── navbar.tsx                # 导航栏
│   ├── QeuryClientProvider.tsx   # React Query 提供者
│   ├── global-error.tsx          # 全局错误处理
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页 Dashboard
│   └── validationSchemas.ts      # Zod 校验规则
├── prisma/                       # Prisma 配置
│   ├── client.ts                 # Prisma Client 实例
│   ├── schema.prisma             # 数据库 Schema
│   └── seed.ts                   # 数据库种子文件
├── public/                       # 静态资源
├── .env                          # 环境变量配置
├── next.config.js                # Next.js 配置
├── tailwind.config.ts            # TailwindCSS 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

## 核心功能

### 1. 用户认证
- Google OAuth 第三方登录
- JWT 会话管理
- 基于 NextAuth.js + Prisma Adapter

### 2. 问题管理
- 创建问题（标题 + Markdown 描述）
- 编辑问题
- 删除问题（需登录）
- 问题状态流转：OPEN → IN_PROGRESS → CLOSED
- 分配问题给用户

### 3. 数据展示
- Dashboard 仪表盘：问题统计卡片 + 柱状图 + 最新问题
- 问题列表：状态筛选、排序、分页
- 数据可视化：Recharts 图表展示

### 4. 性能优化
- Server Components 服务端数据获取
- React `cache()` API 优化重复请求
- 动态导入优化 Markdown 编辑器
- Suspense 边界和骨架屏加载状态

## 使用说明

### 环境要求
- Node.js 18.x 或更高版本
- npm / yarn / pnpm 包管理器
- MySQL 数据库（推荐使用 Aiven Cloud）

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd issue-tracker
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **配置环境变量**

创建 `.env` 文件并配置以下变量：

```env
# 数据库连接（MySQL）
DATABASE_URL="mysql://username:password@host:port/database?ssl-mode=REQUIRED"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"  # 使用 openssl rand -base64 32 生成

# Google OAuth 配置
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **数据库迁移**
```bash
# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma db push

# （可选）填充种子数据
npx prisma db seed
```

5. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 常用命令

```bash
# 开发环境
npm run dev           # 启动开发服务器

# 生产构建
npm run build         # 构建生产版本
npm run start         # 启动生产服务器

# 代码检查
npm run lint          # ESLint 检查

# 数据库操作
npx prisma studio     # 打开 Prisma Studio GUI
npx prisma migrate dev  # 创建新迁移
npx prisma db push    # 推送 Schema 到数据库
```

## 部署方式

### 部署到 Vercel（推荐）

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **在 Vercel 导入项目**
- 访问 [Vercel Dashboard](https://vercel.com/new)
- 选择 GitHub 仓库
- Vercel 会自动检测 Next.js 项目

3. **配置环境变量**
在 Vercel 项目设置中添加以下环境变量：
- `DATABASE_URL`
- `NEXTAUTH_URL`（改为生产域名，如 `https://your-app.vercel.app`）
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

4. **部署**
- Vercel 会自动构建和部署
- 每次推送到 `main` 分支会自动触发重新部署

### 其他部署方式

详细的部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 技术架构

详细的技术架构说明请查看 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 问题排查

### 常见问题

1. **数据库连接失败**
   - 检查 `.env` 中的 `DATABASE_URL` 是否正确
   - 确认数据库服务正在运行
   - 检查网络连接和防火墙设置

2. **Google 登录失败**
   - 确认 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET` 配置正确
   - 检查 Google Cloud Console 中的授权重定向 URI
   - 本地开发添加：`http://localhost:3000/api/auth/callback/google`

3. **Prisma Client 未生成**
   - 运行 `npx prisma generate` 重新生成客户端

4. **Markdown 编辑器报错**
   - 确认使用了 `next/dynamic` 并设置 `{ ssr: false }`

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

- GitHub: [https://github.com/gukki-hl](https://github.com/gukki-hl)
- Email: 948722262@qq.com
