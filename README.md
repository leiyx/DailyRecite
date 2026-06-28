# 每日背诵

轻量级个人网站，通过卡片网格展示每日背诵的文章和注释，支持增删改查。

## 技术栈

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **SQLite** (better-sqlite3)，本地文件存储，无需额外数据库

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

# 3. 启动开发服务器
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
