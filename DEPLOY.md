# 部署到 Netlify 指南

## 准备工作

### 1. 必要环境变量

在 Netlify 控制台中需要设置以下环境变量：

```
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://jpqqioeidalyiwknzoab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=你的-supabase-service-role-key

# WalletConnect 配置
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=你的-walletconnect-project-id

# 管理员认证
ADMIN_PASSWORD=你的-管理员密码

# 环境
NODE_ENV=production

# 区块链配置
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-dataseed.binance.org/
NEXT_PUBLIC_USDT_CONTRACT_ADDRESS=0x55d398326f99059ff775485246999027b3197955
NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS=你的-主合约地址

# 应用配置
NEXT_PUBLIC_APP_URL=https://你的应用.netlify.app
```

### 2. 项目设置

- **构建命令**: `npm run build`
- **发布目录**: `.next`
- **Node.js 版本**: 18
- **框架**: Next.js

## 部署步骤

### 方式一：通过 Git 连接部署

1. 将项目代码推送到 GitHub/GitLab
2. 在 Netlify 中选择 "New site from Git"
3. 连接你的 Git 仓库
4. 选择分支（通常是 main 或 master）
5. 设置构建配置：
   - Build command: `npm run build`
   - Publish directory: `.next`
6. 在 Environment variables 中添加所有必要的环境变量
7. 点击 "Deploy site"

### 方式二：手动部署

1. 在本地运行构建：
   ```bash
   npm run build
   ```

2. 将 `.next` 文件夹拖拽到 Netlify 部署界面

3. 在 Netlify 控制台中设置环境变量

### 方式三：使用 Netlify CLI

1. 安装 Netlify CLI：
   ```bash
   npm install -g netlify-cli
   ```

2. 在项目根目录登录：
   ```bash
   netlify login
   ```

3. 初始化项目：
   ```bash
   netlify init
   ```

4. 部署：
   ```bash
   netlify deploy --prod
   ```

## 配置文件说明

### netlify.toml

项目已包含 `netlify.toml` 配置文件，包含以下设置：

- **构建设置**: 使用 npm run build 命令
- **Next.js 插件**: 自动处理 API 路由和 SSR
- **图片优化**: 配置了远程图片域名
- **环境变量**: 生产环境配置

### next.config.js

配置了以下选项：

- **TypeScript**: 忽略构建时的类型错误
- **ESLint**: 忽略构建时的 lint 错误
- **图片**: 配置了远程图片域名和优化选项

## 重要提醒

1. **环境变量**: 确保在 Netlify 控制台中设置了所有必要的环境变量
2. **域名**: 部署后需要更新 `NEXT_PUBLIC_APP_URL` 环境变量为实际的 Netlify 域名
3. **SSL**: Netlify 会自动提供 SSL 证书
4. **API 路由**: Next.js API 路由会自动转换为 Netlify Functions

## 验证部署

部署成功后，访问你的 Netlify 域名，确保以下功能正常：

- [ ] 主页加载正常
- [ ] 钱包连接功能
- [ ] 质押功能
- [ ] 管理后台访问 (`/admin`)
- [ ] API 接口响应正常

## 常见问题

### 1. 构建失败
- 确保所有依赖都已安装
- 检查环境变量是否正确设置
- 查看构建日志中的错误信息

### 2. API 路由不工作
- 确保 `netlify.toml` 配置正确
- 检查 Next.js 插件是否安装

### 3. 钱包连接失败
- 确保 WalletConnect Project ID 正确
- 检查网络配置

### 4. 数据库连接失败
- 确保 Supabase 配置正确
- 检查数据库权限设置

## 联系支持

如有问题，请检查：
1. Netlify 部署日志
2. 浏览器控制台错误
3. 网络请求状态 