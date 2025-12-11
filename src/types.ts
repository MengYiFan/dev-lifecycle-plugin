// Duplicating type definitions to avoid shared path issues in TS compilation for now
// In a monorepo we would use a shared workspace package

export type BranchType = 'feature' | 'non-feature';

export interface StepData {
  status: 'pending' | 'completed' | 'skipped';
  value?: string;
  timestamp?: number;
}

export interface LifecycleState {
  branchName: string;
  branchType: BranchType;
  steps: Record<string, StepData>;
  currentStepIndex: number;
}
