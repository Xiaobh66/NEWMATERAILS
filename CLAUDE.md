# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NEWMATERIALS — 新材料行业资讯聚合网站。面向投资者/分析师，内容模块包括日报快讯、企业动态、政策解读。

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript + Tailwind CSS (dark mode via class strategy)
- Turso (libSQL) 云数据库
- Basic Auth 保护 admin 面板和写操作 API

## Development

```bash
npm run dev              # 本地开发服务器
npm run build            # 构建生产版本（含类型检查）
npx tsx --env-file=.env.local scripts/seed.ts  # 向 Turso 写入示例数据
```

## Architecture

```
src/
├── app/
│   ├── page.tsx              # 首页（最新文章列表）
│   ├── latest/page.tsx       # 日报快讯
│   ├── companies/page.tsx    # 企业动态
│   ├── policy/page.tsx       # 政策解读
│   ├── admin/page.tsx        # 后台管理面板（需 Basic Auth）
│   ├── layout.tsx            # 根布局（深色主题、字体）
│   └── api/articles/         # REST API（GET 公开，POST/PUT/DELETE 需认证）
├── components/               # Header, SearchBar, CategoryFilter, ArticleCard 等
├── lib/
│   ├── db.ts                 # Turso 数据库操作层（async，lazy init）
│   └── types.ts              # Article, ArticleInput, ArticleFilters 类型
├── middleware.ts              # Basic Auth 中间件
└── styles/globals.css        # Tailwind 基础样式
```

## Key Patterns

- **数据库**: `db.ts` 导出 async 函数，内部用 `ensureInitialized()` 懒初始化表结构
- **认证**: `middleware.ts` 保护 `/admin/*` 和 `/api/articles` 写操作，`/api/articles` GET 公开
- **文章状态流**: draft → pending → published（admin 面板操作）
- **环境变量**: `.env.local` 包含 Turso 连接信息和 admin 凭据，部署时配置到 Vercel
