# 用户端 + 管理后台系统

这是一个集成了用户端和管理后台的Next.js应用系统。

## 功能特性

### 用户端功能
- 用户注册登录
- 钱包连接
- 资产管理
- 挖矿功能
- 邀请系统

### 管理后台功能
- 管理员登录系统
- 用户管理
- 财务管理
- 数据统计
- 系统配置

## 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **认证**: 自定义Cookie-based认证
- **UI组件**: 自定义组件 + Tailwind CSS

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动项目

```bash
npm run dev
```

### 3. 访问系统

- **用户端**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin/login

## 管理后台使用

### 登录凭据

- 邮箱: `it@haixin.org`
- 密码: `aa888990`

### 功能说明

1. **仪表板**: 查看系统统计数据
2. **用户管理**: 管理用户账户，查看用户详情
3. **财务管理**: 处理充值提现记录
4. **系统设置**: 配置系统参数

## 数据库配置

系统使用Supabase作为后端数据库，配置信息：

- **项目ID**: jpqqioeidalyiwknzoab
- **URL**: https://jpqqioeidalyiwknzoab.supabase.co
- **配置文件**: `src/lib/supabase.ts`

## 项目结构

```
用户端/
├── src/
│   ├── app/
│   │   ├── admin/              # 管理后台页面
│   │   │   ├── login/          # 登录页面
│   │   │   ├── dashboard/      # 仪表板
│   │   │   └── users/          # 用户管理
│   │   ├── api/                # API路由
│   │   │   └── admin/          # 管理后台API
│   │   └── ...                 # 其他用户端页面
│   ├── lib/
│   │   ├── supabase.ts         # Supabase配置
│   │   └── auth.ts             # 认证工具
│   └── components/             # 组件
└── package.json
```

## 开发说明

### 添加新功能

1. **添加新页面**: 在`src/app/admin/`目录下创建新页面
2. **添加新API**: 在`src/app/api/admin/`目录下创建新API路由
3. **添加新组件**: 在`src/components/`目录下创建新组件

### 数据库操作

系统使用Supabase客户端进行数据库操作，所有数据库相关的类型定义都在`src/lib/supabase.ts`中。

### 认证系统

管理后台使用基于Cookie的认证系统，相关函数在`src/lib/auth.ts`中。

## 部署说明

1. 确保Supabase项目配置正确
2. 设置环境变量（如果需要）
3. 构建项目：`npm run build`
4. 启动生产服务器：`npm start`

## 注意事项

1. **权限管理**: 管理后台有完整的权限管理系统
2. **数据安全**: 所有敏感操作都需要管理员权限
3. **类型安全**: 项目使用TypeScript确保类型安全
4. **响应式设计**: 支持移动端和桌面端

## 支持

如有问题，请查看：
1. 浏览器开发者工具中的错误信息
2. 服务器日志
3. Supabase控制台中的日志

---

**版本**: 1.0.0
**更新时间**: 2025-07-03
