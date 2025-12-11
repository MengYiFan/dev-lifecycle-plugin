# KL 研发生命周期管理插件 (KL Lifecycle Manager)

VS Code 企业级研发生命周期管理系统，旨在标准化和自动化从 PRD 到上线的全流程。

[English README](./README.md)

## 🚀 核心功能

- **分支感知生命周期**：自动识别 `feature/{id}-{brief}` 分支，并将研发流程数据与分支绑定。
- **可视化工作流**：内置 15 步交互式向导，引导研发人员完成设计、开发、联调、测试、验收、预发布、上线等全过程。
- **一键自动化**：
  - **分支创建**：根据 PRD 链接自动解析并生成符合规范的分支名称。
  - **Git 操作**：自动提交代码、打 Tag (`test-*`, `stage-*`) 并推送。
- **现代化 UI**：基于 React、Tailwind CSS 和 Radix UI 构建，提供原生 VS Code 风格的流畅体验。
- **状态持久化**：生命周期状态按分支隔离，并持久化存储在工作区中。

## 🛠 项目结构

项目采用模块化结构：

```
.
├── src/                  # 插件主进程 (Node.js)
│   ├── panels/           # Webview 面板控制器
│   ├── services/         # Git 服务与状态管理
│   └── extension.ts      # 入口文件
│
├── webview-ui/           # 前端界面 (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # UI 组件 (shadcn/ui 风格)
│   │   │   ├── ui/       # 基础组件 (Button, Input 等)
│   │   │   └── ...       # 业务组件
│   │   └── ...
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── package.json          # 根配置
```

## 📦 开发与调试

### 前置要求
- Node.js 16+
- NPM
- VS Code

### 1. 安装依赖
需要同时安装插件端和 Webview 端的依赖：

```bash
npm install
cd webview-ui
npm install
cd ..
```

### 2. 构建
运行插件前必须先构建 Webview，因为插件会加载 `webview-ui/build` 下的静态资源。

```bash
# 构建 Webview (React)
npm run build:webview

# 编译插件 (TypeScript)
npm run compile
```

### 3. VS Code 调试
1. 在 VS Code 中打开项目根目录。
2. 按 **F5** (或运行 "Run Extension" 启动配置)。
3. 会打开一个新的 "Extension Development Host" 窗口。
4. 在新窗口中打开一个 Git 仓库文件夹。
5. 打开命令面板 (`Cmd+Shift+P`) 并运行 **"KL Lifecycle: Open Panel"**。

### 4. 打包发布
生成 `.vsix` 安装包：

```bash
npm run package
```

## 🧪 测试场景
1. **新周期**：在 `master` 分支打开插件，应显示 "Start New R&D Cycle" 表单。
2. **创建分支**：填写 PRD 和 Meegle ID，点击创建。应自动切出 `feature/...` 新分支。
3. **工作流**：按顺序完成步骤。尝试 "Commit & Push" 按钮，验证 Git Tag 是否正确生成。
4. **持久化**：切换到其他分支再切回来，状态应自动还原。

## 🎨 UI 定制
UI 使用 **Tailwind CSS** 构建。
- **主题适配**：通过 `webview-ui/src/index.css` 中的 CSS 变量，自动适配 VS Code 的当前主题（颜色、字体）。
- **组件库**：可复用的基础组件位于 `webview-ui/src/components/ui`。

## 📈 未来规划
- **远程同步**：将生命周期状态同步到远程服务器或仓库中的 `.lifecycle.json` 文件。
- **CI/CD 集成**：在 "测试" 或 "预发布" 阶段展示 CI/CD 流水线状态。
- **Jira/Meegle 集成**：完成步骤时自动流转工单状态。
