# UI Project

## Overview

This is a professional blockchain interaction UI project built with Quasar Framework. The project provides a modern, responsive interface for interacting with blockchain smart contracts, specifically focusing on staking functionality.

## Prerequisites

- Node.js (v14.0.0 or higher)
- Yarn package manager (recommended) or npm
- Basic understanding of blockchain concepts

## Installation

1. Install Quasar CLI globally:

```bash
yarn global add @quasar/cli
# or
npm install -g @quasar/cli
```

2. Clone the repository:

```bash
git clone [repository-url]
cd ui
```

3. Install dependencies:

```bash
yarn
# or
npm install
```

## Development

### Starting Development Server

```bash
quasar dev
```

This will start the development server with hot-reload enabled at `http://localhost:9000`

### Code Quality Tools

#### Linting

```bash
yarn lint
# or
npm run lint
```

The project uses ESLint for code linting with a custom configuration optimized for Vue.js and Quasar Framework.

#### Code Formatting

```bash
yarn format
# or
npm run format
```

Prettier is configured for consistent code formatting across the project.

## Production

### Building for Production

```bash
quasar build
```

This command will:

- Compile and minify your code
- Generate production-ready assets
- Create a `dist` directory with the build output

## Configuration

### Smart Contract Configuration

The project interacts with blockchain smart contracts. To modify the contract address:

1. Navigate to `src/dist/staking-abi.js`
2. Update the `stakingContractAddress` parameter with your contract address
3. Ensure the ABI matches your deployed contract

### Quasar Framework Configuration

The project uses Quasar Framework v2. For detailed configuration options:

- See [Quasar Configuration Guide](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js)
- Modify `quasar.config.js` for custom build settings
- Configure environment variables in `.env` files

### AppKit Configuration

The project uses AppKit for blockchain wallet connection and interaction. The configuration file is located at `src/boot/appkit.js`. Main configuration items include:

1. Metadata Configuration:

   - Application name
   - Application description
   - Application URL
   - Application icons

2. Network Configuration:

   - Supported networks list
   - Project ID
   - Allow unsupported chains

3. Feature Configuration:

   - Analytics
   - Email
   - Social features
   - History

4. Theme Configuration:
   - Theme mode (light/dark)
   - Theme variables
   - Custom styles

To modify AppKit configuration:

1. Navigate to `src/boot/appkit.js`
2. Adjust configuration parameters as needed
3. Ensure related constants in `src/dist/const-data.js` are properly set

---

# UI 项目

## 概述

这是一个基于 Quasar Framework 构建的专业区块链交互 UI 项目。该项目提供了一个现代化、响应式的界面，用于与区块链智能合约进行交互，特别关注质押功能。

## 环境要求

- Node.js (v14.0.0 或更高版本)
- Yarn 包管理器（推荐）或 npm
- 基本的区块链概念理解

## 安装

1. 全局安装 Quasar CLI：

```bash
yarn global add @quasar/cli
# 或
npm install -g @quasar/cli
```

2. 克隆仓库：

```bash
git clone [仓库地址]
cd ui
```

3. 安装依赖：

```bash
yarn
# 或
npm install
```

## 开发

### 启动开发服务器

```bash
quasar dev
```

这将启动带有热重载功能的开发服务器，访问地址为 `http://localhost:9000`

### 代码质量工具

#### 代码检查

```bash
yarn lint
# 或
npm run lint
```

项目使用 ESLint 进行代码检查，配置针对 Vue.js 和 Quasar Framework 进行了优化。

#### 代码格式化

```bash
yarn format
# 或
npm run format
```

项目配置了 Prettier 以确保代码格式的一致性。

## 生产环境

### 构建生产版本

```bash
quasar build
```

此命令将：

- 编译并压缩代码
- 生成生产环境资源
- 在 `dist` 目录中创建构建输出

## 配置

### 智能合约配置

项目与区块链智能合约进行交互。要修改合约地址：

1. 导航至 `src/dist/staking-abi.js`
2. 使用您的合约地址更新 `stakingContractAddress` 参数
3. 确保 ABI 与您部署的合约匹配

### Quasar 框架配置

项目使用 Quasar Framework v2。详细配置选项：

- 查看 [Quasar 配置指南](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js)
- 修改 `quasar.config.js` 以自定义构建设置
- 在 `.env` 文件中配置环境变量

### AppKit Configuration

项目使用 AppKit 进行区块链钱包连接和交互。配置文件位于 `src/boot/appkit.js`。主要配置项包括：

1. 元数据配置：

   - 应用名称
   - 应用描述
   - 应用 URL
   - 应用图标

2. 网络配置：

   - 支持的网络列表
   - 项目 ID
   - 是否允许不支持的链

3. 功能配置：

   - 分析功能
   - 邮件功能
   - 社交功能
   - 历史记录

4. 主题配置：
   - 主题模式（light/dark）
   - 主题变量
   - 自定义样式

要修改 AppKit 配置：

1. 导航至 `src/boot/appkit.js`
2. 根据需要调整配置参数
3. 确保 `src/dist/const-data.js` 中的相关常量已正确设置
