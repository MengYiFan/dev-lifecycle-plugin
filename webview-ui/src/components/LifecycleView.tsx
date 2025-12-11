import React, { useEffect } from 'react';
import { LIFECYCLE_STEPS } from '../constants';
import { LifecycleState } from '../types';
import { StepItem } from './StepItem';
import { vscode } from '../utils/vscode';
import { Badge } from './ui/badge';
import { GitBranch } from 'lucide-react';

interface LifecycleViewProps {
  state: LifecycleState;
}

export const LifecycleView: React.FC<LifecycleViewProps> = ({ state }) => {
  const handleUpdateStep = (stepId: string, data: any) => {
    const newState = {
      ...state,
      steps: {
        ...state.steps,
        [stepId]: { ...state.steps[stepId], ...data, status: 'pending' }
      }
    };
    vscode.postMessage({ command: 'saveState', payload: newState });
  };

  const handleNext = (currentIndex: number) => {
    const stepId = LIFECYCLE_STEPS[currentIndex].id;
    const stepData = state.steps[stepId];

    const newState = {
      ...state,
      currentStepIndex: currentIndex + 1,
      steps: {
        ...state.steps,
        [stepId]: { ...stepData, status: 'completed' as const }
      }
    };
    vscode.postMessage({ command: 'saveState', payload: newState });
  };

  const handleAction = (stepId: string, action: string, args?: any) => {
    vscode.postMessage({
      command: 'executeGitAction',
      payload: { action, stepId, ...args }
    });
  };

  const currentStep = LIFECYCLE_STEPS[state.currentStepIndex] || LIFECYCLE_STEPS[LIFECYCLE_STEPS.length - 1];
  const isFinished = state.currentStepIndex >= LIFECYCLE_STEPS.length;

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">{state.branchName}</h1>
        </div>

        {isFinished ? (
           <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400">
              <h3 className="font-semibold">Lifecycle Completed</h3>
              <p className="text-sm">This branch has completed the R&D lifecycle.</p>
           </div>
        ) : (
           <div className="flex items-center gap-2 text-sm text-muted">
              <span>Current Phase:</span>
              <Badge variant="default" className="bg-accent text-accent-foreground">{currentStep.label}</Badge>
           </div>
        )}
      </div>

      <div className="space-y-0">
        {LIFECYCLE_STEPS.map((step, index) => {
           if (index > state.currentStepIndex) return null;

           const stepData = state.steps[step.id] || { status: 'pending' };
           return (
             <StepItem
               key={step.id}
               step={step}
               data={stepData}
               isActive={index === state.currentStepIndex && !isFinished}
               isCompleted={index < state.currentStepIndex || isFinished}
               onUpdate={(val) => handleUpdateStep(step.id, val)}
               onAction={(action, args) => handleAction(step.id, action, args)}
               onNext={() => handleNext(index)}
             />
           );
        })}
      </div>
    </div>
  );
};
