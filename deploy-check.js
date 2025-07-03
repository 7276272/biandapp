#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证所有必要的配置和文件
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始部署前检查...\n');

// 检查必要文件
const requiredFiles = [
  'next.config.js',
  'netlify.toml',
  'package.json',
  '.next'
];

console.log('📁 检查必要文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// 检查构建产物
if (!fs.existsSync('.next')) {
  console.log('\n⚠️  构建产物不存在，正在运行构建...');
  const { execSync } = require('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ 构建完成');
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }
}

// 检查环境变量
console.log('\n🔑 检查环境变量配置...');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  'ADMIN_PASSWORD'
];

const missingEnvVars = [];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missingEnvVars.push(envVar);
  }
});

if (missingEnvVars.length > 0) {
  console.log('⚠️  以下环境变量需要在 Netlify 控制台中设置:');
  missingEnvVars.forEach(envVar => {
    console.log(`   - ${envVar}`);
  });
} else {
  console.log('✅ 所有环境变量都已配置');
}

// 检查 package.json 中的脚本
console.log('\n📜 检查 package.json 脚本...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasDeployScript = packageJson.scripts && packageJson.scripts.build;
console.log(`${hasDeployScript ? '✅' : '❌'} build 脚本`);

// 检查 netlify.toml 配置
console.log('\n⚙️  检查 netlify.toml 配置...');
try {
  const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
  const hasNextPlugin = netlifyConfig.includes('@netlify/plugin-nextjs');
  const hasBuildCommand = netlifyConfig.includes('npm run build');
  
  console.log(`${hasNextPlugin ? '✅' : '❌'} Next.js 插件配置`);
  console.log(`${hasBuildCommand ? '✅' : '❌'} 构建命令配置`);
} catch (error) {
  console.log('❌ netlify.toml 配置检查失败');
}

// 显示部署信息
console.log('\n🚀 部署信息:');
console.log('   构建命令: npm run build');
console.log('   发布目录: .next');
console.log('   Node.js 版本: 18');
console.log('   框架: Next.js');

console.log('\n📋 部署步骤:');
console.log('   1. 将代码推送到 Git 仓库');
console.log('   2. 在 Netlify 中连接仓库');
console.log('   3. 设置构建配置');
console.log('   4. 添加环境变量');
console.log('   5. 部署网站');

console.log('\n🔗 有用的链接:');
console.log('   - Netlify: https://app.netlify.com/');
console.log('   - 部署文档: ./DEPLOY.md');

if (allFilesExist) {
  console.log('\n✅ 所有检查通过！项目已准备好部署到 Netlify。');
} else {
  console.log('\n❌ 部分检查未通过，请修复后重试。');
  process.exit(1);
} 