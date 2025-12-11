import * as vscode from "vscode";
import { getUri } from "../utils/getUri";
import { GitService } from "../services/GitService";
import { StateManager } from "../services/StateManager";
import { LifecycleState } from "../types";

export class LifecyclePanel {
  public static currentPanel: LifecyclePanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _gitService: GitService;
  private _stateManager: StateManager;
  private _currentBranch: string = '';

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
    this._panel = panel;

    // Initialize services
    const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    this._gitService = new GitService(rootPath);
    this._stateManager = new StateManager(context);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
    this._setWebviewMessageListener(this._panel.webview);

    this._initLifecycle();
  }

  public static render(extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
    if (LifecyclePanel.currentPanel) {
      LifecyclePanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(
        "klLifecycleView",
        "KL Lifecycle Manager",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, "dist"),
            vscode.Uri.joinPath(extensionUri, "webview-ui/build"),
          ],
        }
      );

      LifecyclePanel.currentPanel = new LifecyclePanel(panel, extensionUri, context);
    }
  }

  public dispose() {
    LifecyclePanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private async _initLifecycle() {
    try {
      const branch = await this._gitService.getCurrentBranch();
      this._currentBranch = branch;
      await this._updateWebviewState(branch);
    } catch (e) {
      vscode.window.showErrorMessage(`Git Error: ${e}`);
    }
  }

  private isFeatureBranch(branch: string): boolean {
    // feature/{id}-{brief}
    return /^feature\/\d+-.+$/.test(branch);
  }

  private async _updateWebviewState(branchName: string) {
    let state = await this._stateManager.getState(branchName);

    if (!state) {
        const isFeature = this.isFeatureBranch(branchName);
        state = this._stateManager.getInitialState(branchName, isFeature);
        await this._stateManager.saveState(branchName, state);
    }

    this._panel.webview.postMessage({
      command: "updateState",
      payload: state,
    });
  }

  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>KL Lifecycle Manager</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      async (message: any) => {
        const command = message.command;
        const payload = message.payload;

        switch (command) {
          case "ready":
            this._initLifecycle();
            break;

          case "createBranch":
            await this._handleCreateBranch(payload);
            break;

          case "saveState":
            await this._stateManager.saveState(this._currentBranch, payload);
            // Echo back to ensure sync
            await this._updateWebviewState(this._currentBranch);
            break;

          case "executeGitAction":
            await this._handleGitAction(payload);
            break;
        }
      },
      undefined,
      this._disposables
    );
  }

  private async _handleCreateBranch(payload: any) {
     const { prdLink, meegleId, baseBranch, designLink } = payload;

     // Validation
     if (!(await this._gitService.isClean())) {
        vscode.window.showErrorMessage("E001: Please commit local changes before starting a new cycle.");
        return;
     }

     // Parse PRD link to brief (simple mock: last part of URL or 'new-feature' if fail)
     let brief = 'new-feature';
     try {
       // Mock parsing: assume last path segment or query param
       const urlParts = prdLink.split('/');
       const last = urlParts[urlParts.length - 1] || 'feature';
       brief = last.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
       if (!brief) brief = 'feature';
     } catch (e) {
       // E002
       vscode.window.showWarningMessage("E002: Could not parse PRD link, using default brief.");
     }

     const newBranchName = `feature/${meegleId}-${brief}`;

     try {
        await this._gitService.createBranch(newBranchName, baseBranch);
        vscode.window.showInformationMessage(`Created branch ${newBranchName}`);

        // Initialize state for new branch
        const newState: LifecycleState = {
            branchName: newBranchName,
            branchType: 'feature',
            currentStepIndex: 0,
            steps: {
                prd: { status: 'completed', value: prdLink },
                meegleId: { status: 'completed', value: meegleId },
                design: { status: designLink ? 'completed' : 'skipped', value: designLink }
            }
        };
        await this._stateManager.saveState(newBranchName, newState);

        // Update context
        this._currentBranch = newBranchName;
        await this._updateWebviewState(newBranchName);
     } catch (e: any) {
        vscode.window.showErrorMessage(`Failed to create branch: ${e.message}`);
     }
  }

  private async _handleGitAction(payload: any) {
      const { action, tagPrefix, stepId } = payload;

      try {
        if (action === 'commit') {
            const meegleId = (await this._stateManager.getState(this._currentBranch))?.steps['meegleId']?.value || '0000';
            const msg = `feat(${meegleId}): update for ${stepId}`;
            await this._gitService.commit(msg);

            if (tagPrefix) {
                const now = new Date();
                const mmdd = `${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
                const hh = now.getHours().toString().padStart(2, '0');
                const mm = now.getMinutes().toString().padStart(2, '0');
                const tagName = `${tagPrefix}-${meegleId}-${mmdd}-${hh}-${mm}`; // Corrected format: tag-feature/{id}... wait.
                // The PRD says: test-feature/{id}-... or stage-feature/{id}-...
                // But typically tags are flat. Let's follow PRD exactly: `test-feature/{meegle_id}-{MMDD}-{hh}-{mm}`
                // Note: git tags cannot contain spaces.

                // PRD format: test-feature/{meegle_id}-{MMDD}-{hh}-{mm}
                const realTagName = `${tagPrefix}-feature/${meegleId}-${mmdd}-${hh}-${mm}`;

                await this._gitService.tag(realTagName);
                vscode.window.showInformationMessage(`Committed and tagged: ${realTagName}`);
            } else {
                vscode.window.showInformationMessage(`Committed changes.`);
            }
        }
      } catch (e: any) {
         vscode.window.showErrorMessage(`Git Action Failed: ${e.message}`);
      }
  }
}
