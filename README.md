# 会刊出版 SaaS 项目

基于研究报告开发的在线会刊出版平台。

## 项目目标
构建"结构化内容 + 在线排版编辑 + 审稿版本控制 + 印刷下单履约"的一体化SaaS方案。

## 技术栈
- Web: Next.js
- API: NestJS
- DB: PostgreSQL
- Cache/Queue: Redis
- Object Storage: MinIO（本地）/ OSS（生产）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动本地依赖（Docker）
pnpm -w deps:up

# 启动开发服务器
pnpm -w dev
```
