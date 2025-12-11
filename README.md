# KL Lifecycle Manager VS Code Extension

An enterprise-grade R&D lifecycle management system for VS Code, designed to standardize and automate the workflow from PRD to Production.

## 🚀 Features

- **Branch-Aware Lifecycle**: Automatically detects `feature/{id}-{brief}` branches and binds lifecycle data to them.
- **Visualized Workflow**: A 15-step interactive wizard guiding developers through every stage (Design, Dev, Test, QA, Stage, Release).
- **One-Click Automation**:
  - **Branch Creation**: Auto-generates standard branch names from PRD links.
  - **Git Operations**: Automated commits, tagging (`test-*`, `stage-*`), and pushing.
- **Modern UI**: Built with React, Tailwind CSS, and Radix UI primitives for a sleek, native VS Code look and feel.
- **State Persistence**: Lifecycle state is persisted per branch in the workspace.

## 🛠 Project Structure

The project follows a modular monorepo-like structure:

```
.
├── src/                  # Extension Host (Node.js)
│   ├── panels/           # Webview Panel Controller
│   ├── services/         # Git Service & State Management
│   └── extension.ts      # Main Entry Point
│
├── webview-ui/           # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # UI Components (shadcn/ui style)
│   │   │   ├── ui/       # Primitive components (Button, Input, etc.)
│   │   │   └── ...       # Feature components
│   │   └── ...
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── package.json          # Root Configuration
```

## 📦 Development & Debugging

### Prerequisites
- Node.js 16+
- NPM
- VS Code

### 1. Installation
Install dependencies for both the extension and the webview:

```bash
npm install
cd webview-ui
npm install
cd ..
```

### 2. Building
The Webview must be built before running the extension, as the extension loads the compiled assets from `webview-ui/build`.

```bash
# Build Webview (React)
npm run build:webview

# Compile Extension (TypeScript)
npm run compile
```

### 3. Debugging in VS Code
1. Open the project root in VS Code.
2. Press **F5** (or run "Run Extension" launch configuration).
3. A new "Extension Development Host" window will open.
4. Open a folder that is a Git repository.
5. Open the Command Palette (`Cmd+Shift+P`) and run **"KL Lifecycle: Open Panel"**.

### 4. Packaging
To generate a `.vsix` file for distribution:

```bash
npm run package
```

## 🧪 Testing Scenarios
1. **New Cycle**: Open on `master` branch. You should see the "Start New R&D Cycle" form.
2. **Branch Creation**: Fill in PRD and Meegle ID. Click Create. It should checkout a new branch `feature/...`.
3. **Workflow**: Complete steps. Try "Commit & Push" buttons. Verify git tags are created.
4. **Persistance**: Switch to another branch and back. The state should be restored.

## 🎨 UI Customization
The UI uses **Tailwind CSS**.
- **Theming**: It automatically inherits VS Code's theme variables (colors, fonts) via CSS variables defined in `webview-ui/src/index.css`.
- **Components**: Reusable components are located in `webview-ui/src/components/ui`.

## 📈 Future Roadmap
- **Remote Sync**: Sync lifecycle state to a remote server or a `.lifecycle.json` file in the repo.
- **CI/CD Status**: Poll CI/CD pipeline status and display it in the "Test" or "Stage" steps.
- **Jira Integration**: Auto-transition Jira tickets when steps are completed.
