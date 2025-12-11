export type BranchType = 'feature' | 'non-feature';

export type StepStatus = 'pending' | 'completed' | 'skipped';

export interface StepData {
  status: StepStatus;
  value?: string;
  timestamp?: number;
}

export interface LifecycleState {
  branchName: string;
  branchType: BranchType;
  steps: Record<string, StepData>;
  currentStepIndex: number;
  isDirty?: boolean; // Local UI state to track unsaved changes if needed
}

export interface ExtensionMessage {
  command: string;
  payload?: any;
}

export interface WebviewMessage {
  command: string;
  payload?: any;
}
