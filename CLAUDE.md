# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

每日背诵展示网站 — 轻量级个人网站，通过卡片网格展示每日背诵的文章和注释，支持 CRUD 操作。Next.js 16 全栈应用，SQLite 本地存储。

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
- **better-sqlite3** — 数据库文件 `data/posts.db`，首次连接自动建表
- 路径别名 `@/*` 映射到 `./src/*`

## 关键架构

### 数据层 (`src/lib/`)

- `types.ts` — `Post` 接口和 `ApiResponse<T>` 通用响应类型
- `db.ts` — SQLite 单例连接，导出 `getPosts()`, `getPostById()`, `createPost()`, `updatePost()`, `deletePost()`。WAL 模式，`data/posts.db` 文件

### API 路由 (Next.js Route Handlers)

| 方法   | 路由              | 说明                          |
| ------ | ----------------- | ----------------------------- |
| GET    | `/api/posts`      | 列表，按日期降序              |
| POST   | `/api/posts`      | 新增，必填 `date` + `article` |
| GET    | `/api/posts/[id]` | 详情                          |
| PUT    | `/api/posts/[id]` | 更新                          |
| DELETE | `/api/posts/[id]` | 删除                          |

所有 API 返回 `{ success, data?, error? }` 格式。

### 前端组件 (`src/components/`)

- `header.tsx` — 顶栏（标题 + 新增按钮）
- `card.tsx` — 单张卡片（日期 + 标题预览）
- `card-grid.tsx` — 响应式卡片网格，空态展示引导文案
- `post-detail.tsx` — 文章详情 Modal（查看 + 编辑/删除入口）
- `post-form.tsx` — 新增/编辑表单 Modal

### 页面逻辑 (`src/app/page.tsx`)

客户端组件，通过 `useState` 管理 Modal 状态（detail/add/edit 三种类型）。数据获取通过 `fetch("/api/posts")` 客户端请求。

### Modal 状态机

```
null → add → 关闭
null → detail → edit → detail → 关闭
null → detail → 删除确认 → 关闭
```

## 注意事项

- `better-sqlite3` 是原生模块，`next.config.ts` 中必须有 `serverExternalPackages: ["better-sqlite3"]`
- API 路由中的 `params` 是 `Promise<{ id: string }>`，需要 `await params`
- 日期格式统一为 `YYYY-MM-DD`，数据库 `UNIQUE` 约束防止同一天重复
- `page.tsx` 和所有组件都是 `"use client"`，因为它们需要交互状态
- 每次对话在最开头先说：“你好喵”
