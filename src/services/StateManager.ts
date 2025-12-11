import * as vscode from 'vscode';
import { LifecycleState, BranchType, StepData } from '../types';

export class StateManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  private getKey(branchName: string): string {
    return `kl-lifecycle-state-${branchName}`;
  }

  async getState(branchName: string): Promise<LifecycleState | undefined> {
    return this.context.workspaceState.get<LifecycleState>(this.getKey(branchName));
  }

  async saveState(branchName: string, state: LifecycleState): Promise<void> {
    await this.context.workspaceState.update(this.getKey(branchName), state);
  }

  getInitialState(branchName: string, isFeature: boolean): LifecycleState {
    return {
      branchName,
      branchType: isFeature ? 'feature' : 'non-feature',
      currentStepIndex: 0,
      steps: {}
    };
  }
}
