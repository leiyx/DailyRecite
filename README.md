# 每日背诵

轻量级个人网站，通过卡片网格展示每日背诵的文章和注释，支持增删改查。

## 技术栈

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **SQLite** — 本地开发用 `@libsql/client` 直连本地文件，Vercel 部署用 [Turso](https://turso.tech/) 远程数据库

## 本地运行

### 前提条件

- [Node.js](https://nodejs.org/) 18+（推荐最新 LTS 版本）

### 步骤

```bash
# 1. 克隆仓库
git clone <your-repo-url>
cd dailypost

# 2. 安装依赖
npm install

# 3. 设置环境变量（或跳过，使用默认值）
cp .env.example .env.local
# 编辑 .env.local，至少填入一个 AUTH_SECRET

# 4. 启动开发服务器
npm run dev
```

打开浏览器访问 **http://localhost:3000** 即可看到网站。

首次启动时，SQLite 数据库文件 `data/posts.db` 会自动创建，无需手动配置。

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（Turbopack，热更新） |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint 代码检查 |

## Vercel 部署

本项目使用 Turso 作为远程 SQLite 数据库，兼容 Vercel Serverless 环境。

### 1. 创建 Turso 数据库

```bash
# 安装 Turso CLI
npm install -g turso

# 注册/登录
turso auth signup

# 创建数据库
turso db create dailypost

# 获取数据库 URL
turso db show dailypost

# 创建 auth token
turso db tokens create dailypost
```

### 2. 在 Vercel 配置环境变量

进入 Vercel 项目 → Settings → Environment Variables，添加：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `TURSO_DATABASE_URL` | Turso 数据库地址 | `libsql://dailypost-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso 认证 token | （从 `turso db tokens create` 获取） |
| `AUTH_SECRET` | 应用认证签名密钥 | 随机 64 位十六进制字符串 |

### 3. 部署

推送代码到 GitHub，在 Vercel 导入项目即可自动部署。

### 4. 首次注册

部署后访问网站 → 点击「登录」→ 切换到「注册」→ 创建管理员账户。注册功能仅在无用户时可用，之后自动关闭。
