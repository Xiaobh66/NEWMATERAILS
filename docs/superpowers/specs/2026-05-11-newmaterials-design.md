# NEWMATERIALS 设计文档

新材料行业资讯聚合站，仿照 AIHOT 模式，服务于投资人/分析师为核心受众。

## 1. 站点架构

```
/                    首页（时间线信息流 + 分类筛选）
/latest              日报快讯
/companies           企业动态
/policy              政策解读
/admin               后台管理（编辑审核）
```

首页：顶部导航（logo + 分类 tab），主体为时间线信息流，每条资讯卡片含时间、来源、标题、摘要、标签、推荐理由，按日期分组，无限滚动加载。

后台管理：待审核/已发布/草稿 tab 切换，支持通过/编辑/驳回操作，支持批量操作。

## 2. 内容数据模型

```typescript
interface Article {
  id: string
  title: string
  summary: string
  source: string          // 来源名称
  sourceUrl: string       // 原文链接
  category: 'daily' | 'company' | 'policy'
  tags: string[]
  editorNote: string      // 编辑推荐理由
  publishedAt: Date
  status: 'draft' | 'pending' | 'published'
  createdAt: Date
  updatedAt: Date
}
```

标签体系：
- 材料类型：碳纤维、锂电池材料、半导体材料、高分子、稀土
- 应用领域：新能源、航空航天、电子信息、生物医药
- 事件类型：融资、政策、技术突破、产品发布、合作签约

数据存储：SQLite（轻量零配置，后续可迁 PostgreSQL）。

## 3. UI/UX 设计

整体风格：简洁、专业、信息密度高。

配色：深蓝/科技蓝主色，浅灰白底，卡片白底带微阴影，支持 dark mode。

首页布局：
- 顶部导航：logo + 日报/企业/政策 tab + 搜索
- 副标题区
- 时间线信息流，每条卡片含：时间、来源、精选评分、标题、摘要、标签、编辑推荐理由
- 日期分隔线

交互：标签可点击筛选，搜索支持全文检索，移动端单列卡片流 + 汉堡菜单。

## 4. 编辑工作流

```
AI 抓取 → 存入数据库(draft) → 编辑审核页 → 通过/编辑后发布 → 前台展示
```

后台操作：通过（直接发布）、编辑（修改后发布）、驳回（丢弃），支持批量操作。

AI 抓取：定时脚本抓取 RSS/网页内容，MVP 阶段摘要可人工填写，后续加 AI 摘要生成。

## 5. 技术栈

- 前端：Next.js 14+（App Router）、Tailwind CSS、TypeScript
- 后端：Next.js API Routes
- 数据库：SQLite（better-sqlite3 或 Prisma）
- 认证：session-based（admin 页面保护）
- AI 抓取：cron job + RSS 解析 + cheerio/puppeteer
- 部署：Vercel + Vercel Blob 或 Turso

## 6. 开发顺序

1. 项目初始化 + 基础布局
2. 首页信息流 + 分类筛选
3. 后台管理页（审核流程）
4. AI 抓取脚本
5. 搜索功能
6. 暗色模式
7. 移动端适配
