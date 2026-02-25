# 开发环境设置

## 前置要求

- Node.js 20+
- pnpm 9+
- Docker (可选，用于本地数据库)

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动本地服务（可选）

如果需要本地数据库：

```bash
# 启动 Docker 容器
docker-compose -f infra/docker/docker-compose.yml up -d

# 或使用 pnpm 脚本
pnpm deps:up
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local 中的配置
```

### 4. 启动开发服务器

```bash
# 启动所有服务
pnpm dev

# 或单独启动
cd apps/web && pnpm dev   # 前端: http://localhost:3000
cd apps/api && pnpm dev   # 后端: http://localhost:3001
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动所有开发服务器 |
| `pnpm build` | 构建所有项目 |
| `pnpm lint` | 代码检查 |
| `pnpm test` | 运行测试 |
| `pnpm deps:up` | 启动 Docker 依赖 |
| `pnpm deps:down` | 停止 Docker 依赖 |

## 项目结构

```
conference-pub-saas/
├── apps/
│   ├── web/          # Next.js 前端
│   ├── api/          # NestJS 后端
│   └── worker/       # 异步任务 worker
├── packages/
│   ├── shared/       # 共享类型和 DTO
│   └── core/        # 核心业务逻辑
├── infra/
│   └── docker/      # Docker 配置
└── docs/            # 文档
```

## 里程碑

- [x] Milestone 0: 脚手架搭建
- [ ] Milestone 1: 基础框架与认证
- [ ] Milestone 2: 项目与模板管理
- [ ] Milestone 3: 文档编辑与版本控制
- [ ] Milestone 4: 审稿流程
- [ ] Milestone 5: 资源上传
- [ ] Milestone 6: 导出与印刷
- [ ] Milestone 7: 生产化部署
