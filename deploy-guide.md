# 智能合约部署指南

## 🌐 方法一：使用 Remix IDE 部署

### 1. 打开 Remix IDE
访问：https://remix.ethereum.org/

### 2. 创建合约文件
- 新建文件：`StakingContract.sol`
- 复制粘贴合约代码

### 3. 安装依赖
在 Remix 中，依赖会自动安装。如果有问题，可以在文件开头添加：
```solidity
// 自动导入 OpenZeppelin 库
```

### 4. 编译合约
- 点击 "Solidity Compiler" 选项卡
- 选择编译器版本：`0.8.19` 或更高
- 点击 "Compile StakingContract.sol"

### 5. 部署合约
- 点击 "Deploy & Run Transactions" 选项卡
- 选择环境：
  - **测试网**: Injected Web3 (连接MetaMask)
  - **本地**: Remix VM
- 在 "Deploy" 部分输入构造函数参数：
  - `_stakingToken`: USDT合约地址
- 点击 "Deploy"

### 6. 常用网络配置

#### BSC 主网
- RPC URL: `https://bsc-dataseed.binance.org/`
- Chain ID: `56`
- USDT 合约: `0x55d398326f99059fF775485246999027B3197955`

#### BSC 测试网
- RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- Chain ID: `97`
- 测试 USDT: `0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684`

#### Ethereum 主网
- RPC URL: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`
- Chain ID: `1`
- USDT 合约: `0xdAC17F958D2ee523a2206206994597C13D831ec7`

---

## 🛠️ 方法二：使用 Hardhat 部署

### 1. 初始化项目
```bash
mkdir my-staking-contract
cd my-staking-contract
npm init -y
npm install --save-dev hardhat
npx hardhat
```

### 2. 安装依赖
```bash
npm install @openzeppelin/contracts
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

### 3. 配置 hardhat.config.js
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: [process.env.PRIVATE_KEY]
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### 4. 创建部署脚本
```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const StakingContract = await ethers.getContractFactory("StakingContract");
  
  // USDT合约地址 (BSC主网)
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
  
  const stakingContract = await StakingContract.deploy(usdtAddress);
  await stakingContract.deployed();
  
  console.log("StakingContract deployed to:", stakingContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### 5. 部署命令
```bash
# 部署到BSC测试网
npx hardhat run scripts/deploy.js --network bscTestnet

# 部署到BSC主网
npx hardhat run scripts/deploy.js --network bsc
```

---

## 🔧 验证合约

### 使用 Hardhat 验证
```bash
npx hardhat verify --network bsc CONTRACT_ADDRESS "0x55d398326f99059fF775485246999027B3197955"
```

### 手动验证
1. 访问 BscScan: https://bscscan.com/
2. 搜索你的合约地址
3. 点击 "Contract" -> "Verify and Publish"
4. 选择编译器版本和优化设置
5. 粘贴合约代码

---

## 📋 部署前检查清单

- [ ] 确认目标网络（主网/测试网）
- [ ] 准备足够的 Gas 费用
- [ ] 确认 USDT 合约地址正确
- [ ] 测试网先测试，再部署主网
- [ ] 保存部署后的合约地址
- [ ] 验证合约代码

---

## 🔐 安全提醒

1. **私钥安全**: 使用环境变量存储私钥
2. **测试先行**: 在测试网充分测试
3. **代码审计**: 主网部署前进行代码审计
4. **权限管理**: 合理设置 Owner 权限
5. **紧急机制**: 确保有紧急暂停功能

---

## 📞 获取帮助

如果部署过程中遇到问题，请提供：
- 错误信息截图
- 使用的网络
- 合约地址（如果已部署）
- 具体操作步骤 