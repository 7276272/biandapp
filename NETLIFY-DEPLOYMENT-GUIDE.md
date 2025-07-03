# Netlify 部署指南

## 问题解决

如果您在Netlify上看到的是其他网站内容，可能是以下原因之一：

### 1. 仓库连接问题
- **检查步骤**：在Netlify控制台确认连接的是正确的仓库 `https://github.com/7276272/biandapp.git`
- **解决方法**：如果连接错误，请断开连接并重新链接正确的仓库

### 2. 分支配置问题
- **检查步骤**：确认部署分支设置为 `master` 或 `main`
- **解决方法**：在Netlify的Site settings → Build & deploy → Deploy contexts 中设置正确的分支

### 3. 构建配置问题
- **检查步骤**：确认构建设置如下：
  ```
  Build command: npm run build
  Publish directory: (留空，由@netlify/plugin-nextjs自动处理)
  ```

### 4. 域名配置问题
- **检查步骤**：如果使用自定义域名，确认DNS设置正确
- **解决方法**：检查域名是否指向了正确的Netlify站点

## 正确的部署步骤

### 1. 在Netlify创建新站点
1. 登录 [Netlify](https://app.netlify.com/)
2. 点击 "New site from Git"
3. 选择 GitHub 并授权
4. 选择仓库 `7276272/biandapp`
5. 配置构建设置：
   - Branch to deploy: `master`
   - Build command: `npm run build`
   - Publish directory: (留空)

### 2. 环境变量配置
在Netlify的Site settings → Environment variables中添加：

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 启用必要插件
确保以下插件已启用（在netlify.toml中已配置）：
- `@netlify/plugin-nextjs`

### 4. 构建日志检查
如果部署失败，检查构建日志中的错误信息：
- Node.js版本问题
- 依赖安装失败
- 构建过程中的TypeScript/ESLint错误

## 常见问题解决

### 问题1：显示404页面
**原因**：路由配置问题
**解决**：确保没有使用静态导出模式（output: 'export'）

### 问题2：API路由不工作
**原因**：Netlify函数配置问题
**解决**：确保使用@netlify/plugin-nextjs插件，它会自动处理API路由

### 问题3：图片无法加载
**原因**：图片优化配置问题
**解决**：检查next.config.js中的图片配置

### 问题4：环境变量未生效
**原因**：环境变量名称或值配置错误
**解决**：确保环境变量名以NEXT_PUBLIC_开头（如果需要在客户端使用）

## 强制重新部署

如果修改后仍有问题，尝试以下步骤：
1. 在Netlify控制台点击 "Trigger deploy"
2. 清除缓存：Settings → Build & deploy → Post processing → Clear cache
3. 检查DNS缓存：使用无痕浏览模式访问站点

## 验证部署

部署成功后，您应该能看到：
- ✅ 用户端首页正常显示
- ✅ 钱包连接功能正常
- ✅ 管理后台可以访问（/admin/login）
- ✅ API路由正常响应

## 联系支持

如果问题持续存在，请检查：
1. Netlify构建日志
2. 浏览器控制台错误
3. 网络面板中的请求失败

---

**注意**：本项目已针对Netlify进行优化配置，包含正确的netlify.toml和next.config.js设置。 