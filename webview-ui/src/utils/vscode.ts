import { WebviewMessage } from "../types";

// Helper to acquire the VS Code API
class VSCodeAPIWrapper {
  private readonly vsCodeApi: any;

  constructor() {
    // @ts-ignore
    if (typeof acquireVsCodeApi === "function") {
      // @ts-ignore
      this.vsCodeApi = acquireVsCodeApi();
    } else {
      this.vsCodeApi = {
        postMessage: (message: any) => console.log("Mock postMessage:", message),
        getState: () => ({}),
        setState: (state: any) => console.log("Mock setState:", state),
      };
    }
  }

  public postMessage(message: WebviewMessage) {
    this.vsCodeApi.postMessage(message);
  }

  public getState(): any {
    return this.vsCodeApi.getState();
  }

  public setState(state: any): void {
    this.vsCodeApi.setState(state);
  }
}

export const vscode = new VSCodeAPIWrapper();
