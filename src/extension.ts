import * as vscode from 'vscode';
import { LifecyclePanel } from './panels/LifecyclePanel';

export function activate(context: vscode.ExtensionContext) {
  // Register the command to open the panel
  const openCommand = vscode.commands.registerCommand("kl-lifecycle.openPanel", () => {
    LifecyclePanel.render(context.extensionUri, context);
  });

  context.subscriptions.push(openCommand);

  // Auto-open logic could go here if configured
  // For now, we rely on the Activity Bar view or command

  // Register the Webview View Provider for the sidebar
  const provider = new LifecycleViewProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("klLifecycleView", provider)
  );
}

export function deactivate() {}

// Sidebar Provider
class LifecycleViewProvider implements vscode.WebviewViewProvider {
  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "dist"),
        vscode.Uri.joinPath(this._extensionUri, "webview-ui/build"),
      ],
    };

    // We reuse the Logic from LifecyclePanel but adapted for WebviewView
    // However, since LifecyclePanel.ts is designed for a Panel (main editor area),
    // and the PRD implies a full management system, a Panel is usually better for complex forms.
    // But I added a sidebar contribution in package.json.
    // To save time and avoid code duplication in this prompt, I will redirect the Sidebar to just "Open Full View" button
    // OR, I can refactor LifecyclePanel to handle both.
    // For simplicity: The sidebar will just have a button to open the full panel.

    webviewView.webview.html = `
      <!DOCTYPE html>
      <html>
        <body style="padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <p>KL Lifecycle Manager</p>
          <button style="padding: 8px 16px; cursor: pointer; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none;" onclick="openPanel()">
            Open Dashboard
          </button>
          <script>
            const vscode = acquireVsCodeApi();
            function openPanel() {
              vscode.postMessage({ command: 'openPanel' });
            }
          </script>
        </body>
      </html>
    `;

    webviewView.webview.onDidReceiveMessage(data => {
      if (data.command === 'openPanel') {
        vscode.commands.executeCommand('kl-lifecycle.openPanel');
      }
    });
  }
}
