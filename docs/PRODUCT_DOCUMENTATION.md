# 会刊出版SaaS平台 - 产品功能说明书

**文档版本**: 1.0  
**更新日期**: 2026年2月23日  
**产品名称**: ConferencePub 会刊出版平台

---

## 一、平台概述

ConferencePub 是一款面向会议组织方的全流程会刊出版SaaS平台，支持在线编辑、模板管理、团队审稿、印刷下单、电子书生成等一体化服务。

### 核心价值
- **一站式服务**: 从文档编辑到印刷/电子书出版全流程覆盖
- **灵活模板**: 多种印刷品类模板，支持自定义
- **团队协作**: 多人在线审稿，版本控制
- **智能定价**: 印刷/电子书积分体系

---

## 二、技术架构

### 2.1 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (Next.js 14)                     │
│  localhost:3000                                              │
├─────────────────────────────────────────────────────────────┤
│                        后端 (NestJS)                         │
│  localhost:3001                                              │
├─────────────────────────────────────────────────────────────┤
│                      数据库 (PostgreSQL)                     │
│  localhost:5433                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 项目结构

```
conference-pub-saas/
├── apps/
│   ├── api/              # NestJS 后端 API
│   ├── web/               # Next.js 用户前端
│   └── portal/           # 印刷厂管理前端
├── packages/
│   └── shared/           # 共享类型定义
├── prisma/
│   └── schema.prisma     # 数据库模型
└── docs/
```

---

## 三、用户体系

### 3.1 用户角色

| 角色 | 英文名 | 默认积分 | 说明 |
|------|--------|----------|------|
| 普通用户 | member | 200 | 初始用户 |
| 高级用户 | senior_member | 500 | 付费用户 |
| 超级用户 | super_member | 1000 | VIP用户 |
| 印刷厂 | printer_staff | - | 印刷厂工作人员 |
| 管理员 | admin | - | 系统管理员 |

### 3.2 用户权限矩阵

| 功能 | 普通用户 | 高级用户 | 超级用户 | 管理员 |
|------|----------|----------|----------|--------|
| 创建项目 | ✅ | ✅ | ✅ | ✅ |
| 文档编辑 | ✅ | ✅ | ✅ | ✅ |
| 模板使用 | 免费模板 | 免费+高级 | 全部 | 全部 |
| 印刷下单 | ✅ | ✅ | ✅ | ✅ |
| 电子书生成 | ✅ | ✅ | ✅ | ✅ |
| 用户管理 | ❌ | ❌ | ❌ | ✅ |
| 印刷厂管理 | ❌ | ❌ | ❌ | ✅ |
| 系统设置 | ❌ | ❌ | ❌ | ✅ |

---

## 四、核心功能模块

### 4.1 认证系统

**功能清单**:
- 邮箱密码登录/注册
- 微信扫码登录
- 微信账号绑定
- JWT token 认证

**API端点**:
```
POST /auth/login          # 邮箱密码登录
POST /auth/register       # 用户注册
GET  /auth/me            # 获取当前用户
GET  /auth/wechat/qr     # 获取微信二维码
GET  /auth/wechat/callback # 微信回调
POST /auth/wechat/bind   # 绑定微信账号
```

### 4.2 租户管理

**功能清单**:
- 创建租户(企业/组织)
- 租户信息管理

**API端点**:
```
POST /tenants            # 创建租户
GET  /tenants            # 租户列表
GET  /tenants/:id       # 租户详情
```

### 4.3 项目管理

**功能清单**:
- 创建/编辑/删除项目
- 项目状态管理: draft → editing → reviewing → finalizing → printing → completed
- 项目成员管理

**API端点**:
```
POST /projects           # 创建项目
GET  /projects           # 项目列表
GET  /projects/:id       # 项目详情
PUT  /projects/:id       # 更新项目
DELETE /projects/:id     # 删除项目
```

### 4.4 文档管理

**功能清单**:
- 文档创建/编辑/删除
- 版本控制 (Revision)
- 内容结构化存储
- 文档状态: draft → review → frozen → printing

**API端点**:
```
POST /documents                  # 创建文档
GET  /documents/project/:id      # 项目文档列表
GET  /documents/:id              # 文档详情
PUT  /documents/:id              # 更新文档
DELETE /documents/:id            # 删除文档
POST /documents/:id/revisions    # 创建版本
```

### 4.5 模板系统

**功能清单**:
- 模板分类管理
- 免费/付费模板
- 积分兑换
- 模板预览

**模板分类**:
| 分类 | 说明 |
|------|------|
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
GET  /templates                    # 模板列表
POST /templates                   # 创建模板
GET  /templates/:id               # 模板详情
POST /templates/:id/redeem        # 兑换模板
GET  /templates/user/purchases    # 已购模板
```

### 4.6 审稿系统

**功能清单**:
- 发起审稿
- 添加评论
- 评论标记/解决
- 审稿状态跟踪

**API端点**:
```
POST /reviews                     # 发起审稿
GET  /reviews/document/:id       # 文档审稿
POST /reviews/:id/comments       # 添加评论
PUT  /reviews/:id/status         # 更新审稿状态
```

### 4.7 资源管理

**功能清单**:
- 文件上传 (图片/字体等)
- 预签名URL生成
- 资源列表/删除

**API端点**:
```
GET  /assets                     # 资源列表
POST /assets/presign            # 获取上传预签名URL
DELETE /assets/:id              # 删除资源
```

### 4.8 导出系统

**功能清单**:
- HTML导出
- PDF导出

**API端点**:
```
GET /export/html/:documentId    # 导出HTML
GET /export/pdf/:documentId     # 导出PDF
```

### 4.9 印刷系统

**4.9.1 印刷品类参数**

每个品类支持独立配置:

| 品类 | 纸张类型 | 纸张克重 | 尺寸 | 印刷颜色 | 装订 | 后工艺 |
|------|----------|----------|------|----------|------|--------|
| 会议日程 | 铜版纸/哑粉纸/双胶纸 | 80-200g | A4/A5/16K | 黑白/全彩 | 胶装/骑马订 | 覆膜/烫金 |
| 海报 | 铜版纸/相纸/PP纸 | 120-300g | A0/A1/A2 | 全彩 | 无/卷轴 | 冷裱 |
| 宣传册 | 铜版纸/特种纸 | 105-250g | A4/A5 | 全彩 | 胶装 | UV/烫金 |
| 名片 | PVC/金属纸 | 250-400g | 90x54mm | 全彩 | 圆角 | 击凸 |
| 书籍 | 双胶纸/轻型纸 | 50-100g | A4/A5 | 黑白/全彩 | 精装 | 烫金 |

**4.9.2 价格计算**

- 默认定价 (无印刷厂定价时使用)
- 印刷厂自定义定价
- 平台加价 (默认15%, 可配置)
- 数量折扣: 100本9折 / 500本8折 / 1000本7折

**4.9.3 价格流程**

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

### 4.10 印刷厂管理

**功能清单**:
- 印刷厂入驻申请
- 资质审核 (批准/拒绝)
- 印刷厂登录
- 订单管理

**API端点**:
```
POST /printer-applications          # 提交申请
GET  /printer-applications         # 申请列表
PUT  /printer-applications/:id/approve  # 批准
PUT  /printer-applications/:id/reject   # 拒绝
POST /printers/login                # 印刷厂登录
GET  /printers/orders              # 印刷厂订单
```

### 4.11 通知系统

**功能清单**:
- 用户通知列表
- 标记已读/全部已读
- 批量发送通知 (按角色/分组)
- 通知模板管理

**API端点**:
```
GET  /notifications                 # 通知列表
GET  /notifications/unread-count    # 未读数
PUT  /notifications/:id/read       # 标记已读
PUT  /notifications/read-all       # 全部已读
POST /notifications/bulk           # 批量发送
```

### 4.12 用户分组管理

**功能清单**:
- 创建/编辑/删除用户分组
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

### 4.13 字体管理

**功能清单**:
- 用户字体上传
- 管理员审核 (批准/拒绝/删除)
- 字体侵权警告通知

**API端点**:
```
GET  /admin/fonts           # 字体列表
POST /admin/fonts           # 上传字体
PUT  /admin/fonts/:id/approve  # 批准
PUT  /admin/fonts/:id/reject   # 拒绝
DELETE /admin/fonts/:id     # 删除
```

### 4.14 电子书系统

**功能清单**:
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
GET  /ebooks/transactions       # 积分记录
GET  /ebooks                    # 我的电子书
POST /ebooks                    # 生成电子书
POST /ebooks/:id/renew          # 续期
```

### 4.15 积分与订阅

**默认积分配置** (可后台修改):
| 用户级别 | 默认积分 |
|----------|----------|
| 普通用户 | 200 |
| 高级用户 | 500 |
| 超级用户 | 1000 |

**续费价格** (可后台修改):
| 级别 | 年付价格 |
|------|----------|
| 高级用户 | ¥1499 |
| 超级用户 | ¥2999 |

**管理员API**:
```
GET  /admin/ebooks/config/points    # 积分配置
POST /admin/ebooks/config/points    # 设置积分
GET  /admin/ebooks/config/renewal   # 续费价格
POST /admin/ebooks/config/renewal  # 设置续费价格
POST /admin/ebooks/grant-points     # 赠送积分
```

### 4.16 系统设置

**功能清单**:
- 平台加价比例设置
- 通用系统参数

**API端点**:
```
GET  /settings                     # 所有设置
GET  /settings/:key                # 获取单个设置
POST /settings                     # 设置参数
GET  /settings/platform/markup     # 获取平台加价
POST /settings/platform/markup      # 设置平台加价
```

---

## 五、数据库模型

### 5.1 核心实体

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
| NotificationTemplate | 通知模板 |
| UserGroup | 用户分组 |
| UserGroupMember | 分组成员 |
| UserFontUpload | 用户字体 |
| UserSubscription | 用户订阅 |
| PointTransaction | 积分交易 |
| Ebook | 电子书 |
| SystemSetting | 系统设置 |
| AuditLog | 审计日志 |

---

## 六、前端页面

### 6.1 用户前端 (web)

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | / | Landing页面 |
| 功能介绍 | /features | 产品功能 |
| 价格方案 | /pricing | 定价 |
| 关于我们 | /about | 公司介绍 |
| 登录 | /login | 用户登录 |
| 注册 | /register | 用户注册 |
| 用户协议 | /terms | 服务条款 |
| 隐私政策 | /privacy | 隐私政策 |
| 项目列表 | /projects | 我的项目 |
| 项目详情 | /projects/:id | 项目管理 |
| 文档编辑 | /projects/:id/documents/:docId | 文档编辑 |
| 通知中心 | /notifications | 消息通知 |
| 用户分组 | /admin/groups | 分组管理 |
| 字体管理 | /admin/fonts | 字体审核 |
| 发送通知 | /admin/notifications | 群发通知 |
| 我的电子书 | /ebooks | 电子书 |

### 6.2 印刷厂前端 (portal)

| 页面 | 说明 |
|------|------|
| 登录 | 印刷厂登录 |
| 订单管理 | 印刷订单列表 |
| 定价设置 | 各类印刷品定价 |

---

## 七、服务状态

```
✅ 前端: http://localhost:3000
✅ 后端: http://localhost:3001
✅ 印刷厂: http://localhost:3005
✅ 数据库: localhost:5433
```

---

## 八、测试账号

- **租户ID**: cmlyijqqp0000r848bnoihqi6
- **用户**: admin@demo.com
- **密码**: password123
- **初始积分**: 200

---

## 九、后续功能 (待开发)

1. 实际电子书文件生成与CDN集成
2. 微信支付集成
3. 邮件通知增强
4. 数据统计分析
5. 移动端适配优化

---

**文档结束**

*本文档最终解释权归 ConferencePub 所有*
