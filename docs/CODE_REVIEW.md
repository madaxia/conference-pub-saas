# ConferencePub 会刊出版平台 - 代码评审报告

**评审日期**: 2026年2月25日  
**评审范围**: 前端、后端、数据库、安全性

---

## 一、高优先级问题 (Critical)

### 1.1 JWT密钥硬编码 ⚠️

**问题**: JWT密钥直接写在代码中
- 文件: `apps/api/src/auth/jwt.strategy.ts`
- 问题: `secretOrKey: process.env.JWT_SECRET || 'dev-secret'`

**解决方案**:
```typescript
// 严格检查环境变量，不提供默认值
constructor() {
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: process.env.JWT_SECRET,
  });
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
}
```

---

### 1.2 管理员权限检查不完整 ⚠️

**问题**: 部分管理员API没有正确的角色验证
- 文件: `apps/api/src/admin/admin.controller.ts`
- 问题: `updateUserRole` 没有检查调用者权限

**当前代码**:
```typescript
@Post('users/:id/role')
async updateUserRole(@Param('id') id: string, @Body() data: { role: string }, @Request() req: any) {
  // 缺少权限检查！
  return this.prisma.user.update({...});
}
```

**解决方案**:
```typescript
@Post('users/:id/role')
async updateUserRole(@Param('id') id: string, @Body() data: { role: string }, @Request() req: any) {
  // 检查权限
  if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
    throw new ForbiddenException('只有管理员可以修改用户角色');
  }
  
  // 不能提升自己的权限（防止权限提升漏洞）
  if (id === req.user.id && data.role !== req.user.role) {
    throw new ForbiddenException('不能修改自己的角色');
  }
  
  return this.prisma.user.update({...});
}
```

---

### 1.3 缺少API速率限制 ⚠️

**问题**: 登录等敏感接口没有速率限制，容易被暴力破解

**解决方案**:
```bash
# 安装限流包
pnpm add @nestjs/throttler
```

```typescript
// main.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10, // 每分钟最多10次
    }]),
  ],
})
export class AppModule {}

// 在登录接口使用
@UseGuards(ThrottlerGuard)
@Post('auth/login')
async login() { ... }
```

---

## 二、中优先级问题 (High)

### 2.1 密码强度验证缺失

**问题**: 用户注册时没有密码强度要求

**解决方案**:
```typescript
// auth.service.ts
async register(...) {
  // 密码强度检查
  if (password.length < 8) {
    throw new BadRequestException('密码至少需要8个字符');
  }
  if (!/[A-Z]/.test(password)) {
    throw new BadRequestException('密码需要包含大写字母');
  }
  if (!/[0-9]/.test(password)) {
    throw new BadRequestException('密码需要包含数字');
  }
  // ... 继续注册逻辑
}
```

---

### 2.2 敏感数据未脱敏

**问题**: 用户列表等API返回敏感信息

**当前问题**:
```typescript
// 返回了 passwordHash
return this.prisma.user.findMany({...});
```

**解决方案**:
```typescript
// 使用 select 明确指定返回字段
return this.prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    role: true,
    points: true,
    createdAt: true,
    // 排除敏感字段
    passwordHash: false,
  }
});
```

---

### 2.3 跨租户数据访问风险

**问题**: API中部分查询没有正确验证租户ID

**解决方案**:
```typescript
// 在服务层添加租户隔离
async getProject(id: string, tenantId: string) {
  const project = await this.prisma.project.findFirst({
    where: {
      id,
      tenantId, // 必须匹配租户
    },
  });
  if (!project) {
    throw new NotFoundException('项目不存在');
  }
  return project;
}
```

---

### 2.4 缺少输入验证 (Validation)

**问题**: DTO没有使用class-validator进行验证

**解决方案**:
```bash
pnpm add class-validator class-transformer
```

```typescript
// auth.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  tenantId?: string;
}
```

```typescript
// main.ts - 启用验证管道
app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // 自动剥离未定义的属性
  transform: true,
}));
```

---

## 三、低优先级问题 (Medium)

### 3.1 前端API调用无错误处理

**问题**: 前端fetch调用缺少完整的错误处理

**当前代码**:
```typescript
// 登录表单
const res = await fetch('/api/auth/login', {...});
const data = await res.json();
if (res.ok) { ... } // 简单的错误处理
```

**建议改进**:
```typescript
try {
  const res = await fetch('/api/auth/login', {...});
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || '登录失败');
  }
  const data = await res.json();
  // 成功处理
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}
```

---

### 3.2 缺少请求日志记录

**问题**: 没有审计日志记录敏感操作

**解决方案**:
```typescript
// 创建审计日志服务
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(action: string, userId: string, tenantId: string, details: any) {
    await this.prisma.auditLog.create({
      data: {
        action,
        userId,
        tenantId,
        details: JSON.stringify(details),
        ipAddress: details.ip,
      },
    });
  }
}
```

---

### 3.3 数据库索引不完整

**问题**: 某些常见查询字段没有索引

**解决方案**:
```prisma
// schema.prisma
model PrintOrder {
  // ... 其他字段
  status        String    @default("pending")
  printerId     String?
  createdAt     DateTime  @default(now())
  
  // 添加索引
  @@index([tenantId, status])
  @@index([printerId, status])
  @@index([createdAt])
}
```

---

## 四、代码质量建议

### 4.1 统一错误响应格式

**建议**: 所有API返回统一错误格式

```typescript
// 创建异常过滤器
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const message = exception.getResponse();
    
    response.status(status).json({
      success: false,
      error: typeof message === 'string' ? message : (message as any).message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

### 4.2 前后端类型共享

**问题**: 前后端类型定义重复

**解决方案**:
```typescript
// packages/shared/src/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin' | 'superadmin';
  points: number;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  // ...
}
```

---

### 4.3 组件拆分建议

**问题**: DashboardLayout组件过于庞大

**建议**: 拆分为独立组件
```
components/
  Sidebar/
    Sidebar.tsx
    NavItem.tsx
  Header/
    Header.tsx
    SearchBar.tsx
    UserMenu.tsx
  StatsCard/
    StatsCard.tsx
```

---

## 五、安全加固清单

| 项目 | 状态 | 优先级 |
|------|------|--------|
| JWT密钥环境变量配置 | ⚠️ 需修复 | Critical |
| 管理员权限验证 | ⚠️ 需修复 | Critical |
| API速率限制 | ⚠️ 需修复 | Critical |
| 密码强度验证 | 🔲 待实现 | High |
| 敏感数据脱敏 | 🔲 待实现 | High |
| 租户数据隔离 | 🔲 待实现 | High |
| 输入验证 | 🔲 待实现 | High |
| 审计日志 | 🔲 待实现 | Medium |
| 请求日志 | 🔲 待实现 | Medium |
| 数据库索引优化 | 🔲 待实现 | Medium |

---

## 六、测试建议

### 6.1 单元测试覆盖

```bash
# 安装测试框架
pnpm add -D jest @types/jest ts-jest @nestjs/testing
```

**优先测试模块**:
1. AuthService - 登录/注册逻辑
2. ProjectService - CRUD操作
3. PrintOrderService - 价格计算

### 6.2 E2E测试

```bash
# 安装 Cypress
pnpm add -D cypress
```

**关键流程测试**:
1. 用户注册 → 登录 → 创建项目
2. 管理员创建模板 → 用户购买
3. 用户下单 → 印刷厂确认 → 价格计算

---

## 七、总结

### 当前系统状态
- ✅ 基础架构完整
- ✅ 核心功能可用
- ⚠️ 安全防护不足
- 🔲 需要完善测试

### 下一步行动计划

**立即执行** (24小时内):
1. 配置生产环境JWT密钥
2. 修复管理员权限验证
3. 添加API速率限制

**短期计划** (1周内):
1. 添加密码强度验证
2. 实现输入验证管道
3. 完善审计日志

**中期计划** (1月内):
1. 添加完整测试覆盖
2. 代码重构优化
3. 性能优化

---

*评审报告结束*
