# ConferencePub 会刊出版平台 - 功能需求说明书

**文档版本**: 2.0  
**更新日期**: 2026年2月25日  
**产品名称**: ConferencePub 会刊出版平台  
**产品定位**: 面向会议组织方的全流程会刊出版SaaS平台

---

## 一、平台概述

### 1.1 核心价值

ConferencePub 是一款专业的会刊出版SaaS平台，支持：

- **一站式服务**: 从文档编辑到印刷/电子书出版全流程覆盖
- **灵活模板**: 多种印刷品类模板，支持自定义配置
- **团队协作**: 多人在线审稿，版本控制
- **智能定价**: 印刷/电子书积分体系，自动化价格计算
- **多端管理**: 用户端、管理后台、印刷厂端三端分离

### 1.2 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户端 (Next.js)                        │
│                   http://localhost:3000                     │
│  - 公开页面: 首页、登录、注册、功能介绍、价格方案            │
│  - 用户端: 仪表盘、项目管理、电子书、通知、企业              │
│  - 管理端: 用户管理、订单管理、系统设置                     │
├─────────────────────────────────────────────────────────────┤
│                      后端 API (NestJS)                       │
│                   http://localhost:3001                      │
├─────────────────────────────────────────────────────────────┤
│                    印刷厂端 (Next.js)                        │
│                  http://localhost:3005                       │
│  - 登录、仪表盘、订单管理、打印机管理                       │
├─────────────────────────────────────────────────────────────┤
│                      数据库 (PostgreSQL)                    │
│                    localhost:5433                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、用户体系与权限

### 2.1 用户角色

| 角色 | 英文标识 | 默认积分 | 说明 |
|------|----------|----------|------|
| 普通用户 | member | 200 | 初始用户，注册即得 |
| 高级用户 | senior_member | 500 | 付费用户 |
| 超级用户 | super_member | 1000 | VIP用户 |
| 印刷厂 | printer_staff | - | 印刷厂工作人员 |
| 管理员 | admin | - | 系统管理员 |

### 2.2 权限矩阵

| 功能 | 普通用户 | 高级用户 | 超级用户 | 管理员 |
|------|:--------:|:--------:|:--------:|:--------:|
| 创建项目 | ✅ | ✅ | ✅ | ✅ |
| 文档编辑 | ✅ | ✅ | ✅ | ✅ |
| 使用免费模板 | ✅ | ✅ | ✅ | ✅ |
| 使用高级模板 | ❌ | ✅ | ✅ | ✅ |
| 印刷下单 | ✅ | ✅ | ✅ | ✅ |
| 生成电子书 | ✅ | ✅ | ✅ | ✅ |
| 用户管理 | ❌ | ❌ | ❌ | ✅ |
| 印刷厂管理 | ❌ | ❌ | ❌ | ✅ |
| 系统设置 | ❌ | ❌ | ❌ | ✅ |
| 分组管理 | ❌ | ❌ | ❌ | ✅ |
| 字体审核 | ❌ | ❌ | ❌ | ✅ |
| 通知群发 | ❌ | ❌ | ❌ | ✅ |

---

## 三、核心功能模块

### 3.1 认证系统

**需求要点**:
- 邮箱密码登录/注册
- JWT Token 认证机制
- 登录状态保持

**API端点**:
```
POST /auth/login        # 邮箱密码登录
POST /auth/register     # 用户注册
GET  /auth/me          # 获取当前用户信息
```

---

### 3.2 项目管理

**需求要点**:
- 创建、编辑、删除项目
- 项目状态流转: draft → editing → reviewing → finalizing → printing → completed
- 项目成员管理

**状态说明**:
| 状态 | 说明 |
|------|------|
| draft | 草稿 |
| editing | 编辑中 |
| reviewing | 审稿中 |
| finalizing | 定稿中 |
| printing | 印刷中 |
| completed | 已完成 |

**API端点**:
```
POST   /projects           # 创建项目
GET    /projects           # 项目列表
GET    /projects/:id      # 项目详情
PUT    /projects/:id       # 更新项目
DELETE /projects/:id      # 删除项目
```

---

### 3.3 文档管理

**需求要点**:
- 文档创建、编辑、删除
- 版本控制 (Revision)，支持回溯
- 内容结构化存储
- 文档状态: draft → review → frozen → printing

**API端点**:
```
POST   /documents                  # 创建文档
GET    /documents/project/:id       # 项目文档列表
GET    /documents/:id              # 文档详情
PUT    /documents/:id              # 更新文档
DELETE /documents/:id             # 删除文档
POST   /documents/:id/revisions    # 创建版本
```

---

### 3.4 模板系统

**需求要点**:
- 模板分类管理 (会议日程、论文摘要集、赞助商手册等12种)
- 免费/付费模板区分
- 积分兑换机制
- 模板预览

**模板分类**:
| 分类ID | 说明 |
|--------|------|
| conference_program | 会议日程 |
| abstract_book | 论文摘要集 |
| sponsor_guide | 赞助商手册 |
| exhibition_manual | 展位手册 |
| poster | 海报 |
| flyer | 宣传单 |
| brochure | 宣传册 |
| banner | 横幅 |
| business_card | 名片 |
| magazine | 杂志 |
| book | 书籍 |
| custom | 自定义 |

**API端点**:
```
GET    /templates                    # 模板列表
POST   /templates                   # 创建模板
GET    /templates/:id              # 模板详情
POST   /templates/:id/redeem       # 兑换模板
GET    /templates/user/purchases   # 已购模板
```

---

### 3.5 审稿系统

**需求要点**:
- 发起审稿流程
- 添加评论
- 评论标记/解决
- 审稿状态跟踪

**API端点**:
```
POST   /reviews                     # 发起审稿
GET    /reviews/document/:id       # 文档审稿
POST   /reviews/:id/comments       # 添加评论
PUT    /reviews/:id/status         # 更新审稿状态
```

---

### 3.6 导出系统

**需求要点**:
- HTML导出
- PDF导出

**API端点**:
```
GET /export/html/:documentId    # 导出HTML
GET /export/pdf/:documentId     # 导出PDF
```

---

### 3.7 印刷系统

**需求要点**:
- 支持12种印刷品类，每种多参数配置
- 印刷厂自主定价
- 平台加价机制 (默认15%)
- 数量折扣: 100本9折 / 500本8折 / 1000本7折
- 价格确认流程: estimated → pending_confirm → confirmed → paid → printing → shipped → completed

**印刷品类参数**:

| 品类 | 纸张类型 | 纸张克重 | 尺寸 | 印刷颜色 | 装订 | 后工艺 |
|------|----------|----------|------|----------|------|--------|
| 会议日程 | 铜版纸/哑粉纸/双胶纸 | 80-200g | A4/A5/16K | 黑白/全彩 | 胶装/骑马订 | 覆膜/烫金 |
| 海报 | 铜版纸/相纸/PP纸 | 120-300g | A0/A1/A2 | 全彩 | 无/卷轴 | 冷裱 |
| 宣传册 | 铜版纸/特种纸 | 105-250g | A4/A5 | 全彩 | 胶装 | UV/烫金 |
| 名片 | PVC/金属纸 | 250-400g | 90x54mm | 全彩 | 圆角 | 击凸 |
| 书籍 | 双胶纸/轻型纸 | 50-100g | A4/A5 | 黑白/全彩 | 精装 | 烫金 |

**价格流程**:
```
用户提交订单
    ↓
计算预估价格 = 印刷厂单价 × 平台加价(1.15)
    ↓
订单状态: estimated (已预估)
    ↓
印刷厂确认/修改 → pending_confirm
    ↓
后台确认价格 → confirmed (用户可支付)
```

**API端点**:
```
GET  /print-orders/categories           # 获取印刷分类
GET  /print-orders/categories/:cat      # 获取分类选项
POST /print-orders/calculate             # 计算价格
GET  /print-orders/pricing/:printerId    # 获取印刷厂定价
POST /print-orders/pricing/:printerId    # 设置印刷厂定价
POST /print-orders                       # 创建订单
GET  /print-orders                       # 订单列表
PUT  /print-orders/:id/confirm-price     # 印刷厂确认价格
PUT  /print-orders/:id/admin-confirm-price # 后台确认价格
```

---

### 3.8 印刷厂管理

**需求要点**:
- 印刷厂入驻申请
- 资质审核 (批准/拒绝)
- 印刷厂登录
- 订单管理

**API端点**:
```
POST   /printer-applications              # 提交申请
GET    /printer-applications             # 申请列表
PUT    /printer-applications/:id/approve  # 批准申请
PUT    /printer-applications/:id/reject   # 拒绝申请
POST   /printers/login                   # 印刷厂登录
GET    /printers/orders                  # 印刷厂订单
```

---

### 3.9 通知系统

**需求要点**:
- 用户通知列表
- 标记已读/全部已读
- 批量发送通知 (按角色/分组)
- 未读数量统计

**API端点**:
```
GET    /notifications                 # 通知列表
GET    /notifications/unread-count   # 未读数
PUT    /notifications/:id/read        # 标记已读
PUT    /notifications/read-all         # 全部已读
POST   /notifications/bulk            # 批量发送
```

---

### 3.10 用户分组管理

**需求要点**:
- 创建、编辑、删除用户分组
- 成员管理
- 按分组群发通知

**API端点**:
```
GET    /admin/groups                    # 分组列表
POST   /admin/groups                    # 创建分组
PUT    /admin/groups/:id                # 更新分组
DELETE /admin/groups/:id                # 删除分组
GET    /admin/groups/:id/members       # 成员列表
POST   /admin/groups/:id/members       # 添加成员
DELETE /admin/groups/:id/members/:userId # 移除成员
```

---

### 3.11 字体管理

**需求要点**:
- 用户字体上传
- 管理员审核 (批准/拒绝/删除)
- 字体侵权警告通知

**API端点**:
```
GET    /admin/fonts           # 字体列表
POST   /admin/fonts           # 上传字体
PUT    /admin/fonts/:id/approve  # 批准字体
PUT    /admin/fonts/:id/reject   # 拒绝字体
DELETE /admin/fonts/:id       # 删除字体
```

---

### 3.12 电子书系统

**需求要点**:
- 从项目文档生成电子书
- 响应式电子书 (支持CDN)
- 嵌入代码生成
- 积分消耗机制
- 过期续费引导

**电子书价格**:
| 时长 | 积分 | 折扣 |
|------|------|------|
| 月付 | 100 | - |
| 年付 | 1000 | 8折 |

**查看模式**:
- 📖 翻书模式 - 左右页面翻动效果
- 📄 PDF模式 - 平面滚动模式

**API端点**:
```
GET  /ebooks/prices/ebook        # 电子书价格
GET  /ebooks/points              # 我的积分
GET  /ebooks/transactions        # 积分记录
GET  /ebooks                     # 我的电子书
POST /ebooks                     # 生成电子书
POST /ebooks/:id/renew           # 续期
```

---

### 3.13 积分与订阅

**需求要点**:
- 用户积分管理
- 积分交易记录
- 续费价格配置
- 管理员积分配置

**默认积分配置**:
| 用户级别 | 默认积分 |
|----------|----------|
| 普通用户 | 200 |
| 高级用户 | 500 |
| 超级用户 | 1000 |

**续费价格**:
| 级别 | 年付价格 |
|------|----------|
| 高级用户 | ¥1499 |
| 超级用户 | ¥2999 |

**管理员API**:
```
GET    /admin/ebooks/config/points     # 积分配置
POST   /admin/ebooks/config/points    # 设置积分
GET    /admin/ebooks/config/renewal  # 续费价格
POST   /admin/ebooks/config/renewal   # 设置续费价格
POST   /admin/ebooks/grant-points    # 赠送积分
```

---

### 3.14 AI 设置

**需求要点**:
- AI 模型选择
- API Key 配置
- AI 参数调优

**API端点**:
```
GET  /ai/settings      # 获取AI配置
POST /ai/settings      # 保存AI配置
```

---

### 3.15 企业管理

**需求要点**:
- 企业信息绑定
- 企业认证申请
- 企业用户管理

**API端点**:
```
POST   /enterprise/apply       # 申请企业认证
GET    /enterprise/bind       # 绑定企业
GET    /enterprise            # 企业信息
```

---

### 3.16 系统设置

**需求要点**:
- 平台加价比例设置
- 通用系统参数

**API端点**:
```
GET  /settings                     # 所有设置
GET  /settings/:key              # 获取单个设置
POST /settings                    # 设置参数
GET  /settings/platform/markup    # 获取平台加价
POST /settings/platform/markup     # 设置平台加价
```

---

## 四、前端页面结构

### 4.1 用户前端 (web) - http://localhost:3000

**公开页面**:
| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | / | Landing页面 |
| 功能介绍 | /features | 产品功能展示 |
| 价格方案 | /pricing | 定价方案 |
| 关于我们 | /about | 公司介绍 |
| 登录 | /login | 用户登录 |
| 注册 | /register | 用户注册 |
| 用户协议 | /terms | 服务条款 |
| 隐私政策 | /privacy | 隐私政策 |

**用户端**:
| 页面 | 路由 | 说明 |
|------|------|------|
| 仪表盘 | /dashboard | 数据概览 |
| 项目列表 | /projects | 我的项目 |
| 项目详情 | /projects/:id | 项目管理 |
| 文档编辑 | /projects/:id/documents/:docId | 文档编辑 |
| 电子书 | /ebooks | 我的电子书 |
| 积分 | /points | 积分记录 |
| 通知 | /notifications | 消息通知 |
| 企业 | /enterprise | 企业管理 |

**管理端**:
| 页面 | 路由 | 说明 |
|------|------|------|
| 管理首页 | /admin | 管理仪表盘 |
| 用户管理 | /admin/users | 用户列表 |
| 项目管理 | /admin/projects | 项目管理 |
| 订单管理 | /admin/orders | 印刷订单 |
| 电子书管理 | /admin/ebooks | 电子书管理 |
| 字体管理 | /admin/fonts | 字体审核 |
| 分组管理 | /admin/groups | 用户分组 |
| 通知管理 | /admin/notifications | 群发通知 |
| 印刷厂管理 | /admin/printers | 印刷厂管理 |
| AI设置 | /admin/ai-settings | AI配置 |
| 系统设置 | /admin/settings | 系统参数 |
| 企业管理 | /admin/enterprise | 企业管理 |

### 4.2 印刷厂前端 (portal) - http://localhost:3005

| 页面 | 说明 |
|------|------|
| 登录 | 印刷厂登录 |
| 仪表盘 | 订单概览 |
| 订单管理 | 印刷订单列表 |
| 打印机管理 | 打印机管理 |
| 申请审批 | 入驻申请审批 |
| 设置 | 基础设置 |

---

## 五、UI设计规范

### 5.1 设计风格

**MatDash - Soft Corporate / Pastel Dashboard**:
- 页面底色: #F5F7FB (极浅冷灰蓝)
- 卡片背景: 纯白 #FFFFFF
- 主色调: #5B6BE6 (蓝紫色)
- 辅助色: 浅蓝、浅粉、浅绿、浅橙、浅紫

### 5.2 布局规范

- 左侧固定侧边栏 260px，白色背景
- 右侧内容区使用 CSS Grid，卡片间距 24px
- 顶部一行统计小卡片
- 统计卡片: 彩色浅底 + 圆形图标 + 粗体数字 + 标签

### 5.3 组件规范

- 圆角: 卡片 12-16px，按钮 8px
- 阴影: 极淡，依靠背景色差创造层次
- 图标: 使用 Lucide React 图标库

---

## 六、技术栈

| 层面 | 技术方案 |
|------|----------|
| 框架 | Next.js 14 + React |
| 后端 | NestJS |
| 数据库 | PostgreSQL (Prisma ORM) |
| 样式 | CSS Modules / Inline Styles |
| 图标 | Lucide React |
| 认证 | JWT |

---

## 七、数据库核心模型

| 模型 | 说明 |
|------|------|
| Tenant | 租户 |
| User | 用户 |
| Project | 项目 |
| Document | 文档 |
| Revision | 文档版本 |
| Template | 模板 |
| TemplatePurchase | 模板购买 |
| Review | 审稿 |
| ReviewComment | 审稿评论 |
| Asset | 资源文件 |
| PrintOrder | 印刷订单 |
| PrinterPricing | 印刷厂定价 |
| PrinterApplication | 印刷厂申请 |
| Notification | 通知 |
| UserGroup | 用户分组 |
| UserGroupMember | 分组成员 |
| UserFontUpload | 用户字体 |
| UserSubscription | 用户订阅 |
| PointTransaction | 积分交易 |
| Ebook | 电子书 |
| SystemSetting | 系统设置 |

---

## 八、测试账号

- **租户ID**: default-tenant
- **用户邮箱**: user1@demo.com
- **密码**: password123
- **初始积分**: 200

---

## 九、当前服务状态

```
✅ 用户前端: http://localhost:3000
✅ 后端 API: http://localhost:3001
✅ 印刷厂端: http://localhost:3005
✅ 数据库: localhost:5433
```

---

## 十、待开发功能

1. 实际电子书文件生成与CDN集成
2. 微信支付集成
3. 邮件通知增强
4. 数据统计分析
5. 移动端适配优化

---

**文档结束**
