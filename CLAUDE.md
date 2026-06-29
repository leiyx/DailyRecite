# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

每日背诵展示网站 — 轻量级个人网站，通过卡片网格展示每日背诵的文章和注释，支持 CRUD 操作。Next.js 16 全栈应用，本地用 `@libsql/client` 直连 SQLite 文件，Vercel 部署用 Turso 远程数据库。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (Turbopack)
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # ESLint 检查
```

## 技术栈

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (通过 `@tailwindcss/postcss`，CSS-first 配置，无 `tailwind.config.ts`)
- **@libsql/client** — 数据库客户端，本地模式用 `file:data/posts.db`，远程模式用 `libsql://`。首次连接自动建表
- 路径别名 `@/*` 映射到 `./src/*`
- 零依赖认证 — Node.js 内置 `crypto` 模块（scrypt + HMAC-SHA256）

## 设计系统

### 蓝色主题 (Blue Theme)

所有 CSS 自定义属性在 `src/app/globals.css` 的 `@theme inline` 块中定义：

| 变量 | 值 | 用途 |
|------|-----|------|
| `--color-bg-primary` | `#f0f4f8` | 页面背景，蓝调冷白 |
| `--color-accent` | `#4A90D9` | 主色调（按钮、链接、强调） |
| `--color-accent-hover` | `#3A7BC8` | 主色调悬停 |
| `--color-accent-light` | `#EBF3FC` | 主色调浅色背景 |
| `--color-secondary` | `#6C8EBF` | 次色调钢蓝 |
| `--color-secondary-hover` | `#5A7DB0` | 次色调悬停 |
| `--color-secondary-light` | `#F0F4FA` | 次色调浅色背景 |
| `--color-text-primary` | `#1a2332` | 主要文字色（深蓝灰） |
| `--color-text-secondary` | `#4a5b6e` | 次要文字色 |
| `--color-text-muted` | `#8fa1b5` | 辅助文字色 |
| `--color-border` | `#d0dae6` | 边框色 |
| `--color-surface` | `#ffffff` | 卡片/弹窗背景 |
| `--color-overlay` | `rgba(26, 35, 50, 0.4)` | Modal 遮罩层 |

### 卡片色彩系统

卡片使用 7 色蓝调配色循环分配（`card.tsx` 的 `CARD_THEMES` 数组和 `post-detail.tsx` 的 `CARD_COLORS` 数组保持一致）：`#4A90D9`, `#5B8DEF`, `#6C8EBF`, `#3D7AB5`, `#7EB8DA`, `#A0C4E8`, `#89B4D9`

- 每张卡片顶部有彩色条（`h-1.5`，hover 展开到 `h-2`）
- 底部三个装饰圆点
- 显示日期 + 标题 + 文章摘要（前 60 字节，超出显示省略号）
- 悬停效果：`scale(1.03)` + `translateY(-6px)` + 蓝色发光阴影

### 关键视觉约定

- **弹窗（Modal）**：`rounded-3xl`、`shadow-2xl`、`modal-panel` spring 弹性动画（`cubic-bezier(0.34, 1.56, 0.64, 1)`）
- **按钮**：`rounded-full` 圆角胶囊，`btn-primary` 带蓝色阴影（`rgba(74, 144, 217, ...)`）
- **页面背景**：`#f0f4f8` 冷白底色 + 蓝色点阵（`radial-gradient`，24px 间距，10% 透明度）
- **用户头像**：`from-[#4A90D9] to-[#5B8DEF]` 蓝色渐变圆形
- **标题波浪下划线**：蓝色 SVG 波浪线（`#4A90D9`）
- **删除/错误色**：独立于蓝色主题，使用红色系（`#e0556a`、`#fef2f4`、`#f0c0c6`）
- **手写字体**：`font-hand` class 使用楷体（`KaiTi`, `STKaiti`）fallback

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `AUTH_SECRET` | ✅ | token 签名密钥，64 位 hex |
| `TURSO_DATABASE_URL` | 部署时必填 | 本地默认 `file:data/posts.db`，Vercel 用 `libsql://xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | 部署时必填 | Turso 认证 token，本地无需 |

## 关键架构

### 数据层 (`src/lib/`)

- `types.ts` — `Post`、`User` 接口和 `ApiResponse<T>` 通用响应类型
- `db.ts` — libsql 单例连接，**所有函数都是 async**。导出 `getPosts()`, `getPostById()`, `createPost()`, `updatePost()`, `deletePost()` 以及用户相关函数
- `auth.ts` — 密码哈希（scrypt）、token 签发/验证（HMAC-SHA256）、httpOnly cookie 管理。不依赖任何第三方库

### API 路由 (Next.js Route Handlers)

| 方法   | 路由                  | 认证 | 说明                          |
| ------ | --------------------- | ---- | ----------------------------- |
| GET    | `/api/posts`          | 否   | 列表，按日期降序              |
| POST   | `/api/posts`          | 是   | 新增，必填 `date` + `article` |
| GET    | `/api/posts/[id]`     | 否   | 详情                          |
| PUT    | `/api/posts/[id]`     | 是   | 更新                          |
| DELETE | `/api/posts/[id]`     | 是   | 删除                          |
| POST   | `/api/auth/register`  | 否   | 注册（仅当无用户时）          |
| POST   | `/api/auth/login`     | 否   | 登录                          |
| POST   | `/api/auth/logout`    | 否   | 退出                          |
| PUT    | `/api/auth/password`  | 是   | 修改密码                      |
| GET    | `/api/auth/me`        | 否   | 当前登录状态                  |

所有 API 返回 `{ success, data?, error? }` 格式。

### 认证系统

- **单用户模型**：第一个注册的用户成为管理员，之后注册关闭（403）
- **密码存储**：`scryptSync` → `"salt:hash"` 格式，`timingSafeEqual` 防时序攻击
- **会话管理**：30 天 httpOnly cookie，`secure` 在生产环境启用
- **认证检查**：`requireAuth()` 在 POST/PUT/DELETE 路由中调用，未登录返回 401

### 前端组件 (`src/components/`)

- `header.tsx` — 顶栏（标题 + 登录/用户菜单 + 新增按钮）
- `card.tsx` — 单张卡片（日期 + 标题 + 文章摘要（前60字），7色蓝调主题色，装饰圆点）
- `card-grid.tsx` — 响应式卡片网格，空态展示引导文案
- `post-detail.tsx` — 文章详情 Modal（查看 + 条件渲染编辑/删除入口）
- `post-form.tsx` — 新增/编辑表单 Modal
- `login-form.tsx` — 登录 Modal
- `register-form.tsx` — 注册 Modal
- `change-password-form.tsx` — 改密 Modal

### 页面逻辑 (`src/app/page.tsx`)

客户端组件，通过 `useState` 管理 6 种 Modal 状态（detail/add/edit/login/register/changePassword）。通过 `/api/auth/me` 获取登录状态，401 响应触发 `handleAuthExpired`。

### Modal 状态机

```
null → add → 关闭
null → detail → edit → detail → 关闭
null → detail → 删除确认 → 关闭
null → login → register → 关闭（或自动登录）
null → changePassword → 关闭
```

## 注意事项

- `@libsql/client` 是原生模块，`next.config.ts` 中必须有 `serverExternalPackages: ["@libsql/client"]`
- `@libsql/client` 的 `execute()` **不支持多条 SQL 语句**，建表需要分开调用
- API 路由中的 `params` 是 `Promise<{ id: string }>`，需要 `await params`
- 日期格式统一为 `YYYY-MM-DD`，数据库 `UNIQUE` 约束防止同一天重复
- `page.tsx` 和所有组件都是 `"use client"`，因为它们需要交互状态
- TypeScript 中 `Row` 类型转自定义类型需要通过 `as unknown as` 二次断言
- 每次对话在最开头先说："你好喵"
- Vercel 部署时 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN` 必须设置，否则使用默认 `file:` 路径会因只读文件系统而失败
- `post-detail.tsx` 中注释区域的背景色使用 8 位 hex alpha（如 `barColor + "0D"`），这是 CSS Color Level 4 特性，现代浏览器均支持
