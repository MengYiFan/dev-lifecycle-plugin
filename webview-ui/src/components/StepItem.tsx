import React, { useState } from 'react';
import { LIFECYCLE_STEPS } from '../constants';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '../utils/cn';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface StepItemProps {
  step: typeof LIFECYCLE_STEPS[number];
  data: any;
  isActive: boolean;
  isCompleted: boolean;
  onUpdate: (value: any) => void;
  onAction: (action: string, args?: any) => void;
  onNext: () => void;
}

export const StepItem: React.FC<StepItemProps> = ({ step, data, isActive, isCompleted, onUpdate, onAction, onNext }) => {
  const [inputValue, setInputValue] = useState(data?.value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onUpdate({ value: e.target.value, status: 'pending' });
  };

  const handleBlur = () => {
     if (step.required && !inputValue) return;
     onUpdate({ value: inputValue, status: 'pending' });
  };

  return (
    <div className={cn("relative pl-8 pb-8 border-l-2",
       isCompleted ? "border-primary" : isActive ? "border-accent" : "border-muted"
    )}>
       {/* Icon Indicator */}
       <div className={cn("absolute -left-[9px] top-0 bg-background p-0.5 rounded-full")}>
          {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : isActive ? (
              <Circle className="w-4 h-4 text-accent fill-accent" />
          ) : (
              <Circle className="w-4 h-4 text-muted" />
          )}
       </div>

       <div className="flex items-center justify-between mb-2">
          <h3 className={cn("text-sm font-semibold", !isActive && !isCompleted && "text-muted")}>
            {step.label}
          </h3>
          {isCompleted && <Badge variant="secondary" className="text-[10px] h-5">Completed</Badge>}
          {isActive && <Badge variant="default" className="text-[10px] h-5 bg-accent text-accent-foreground">Current Phase</Badge>}
       </div>

       {isCompleted && data?.value && (
         <div className="text-xs text-muted break-all bg-muted/10 p-2 rounded">
            {data.value}
         </div>
       )}

       {isActive && (
         <div className="mt-3 space-y-4 animate-accordion-down">
            {step.description && <p className="text-xs text-muted italic">{step.description}</p>}

            {(step.type === 'link' || step.type === 'number') && (
              <div className="space-y-2">
                <Input
                  type={step.type === 'number' ? 'number' : 'text'}
                  placeholder={step.description}
                  value={inputValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="flex gap-2 pt-2">
                    {step.required && inputValue && (
                         <Button size="sm" onClick={onNext}>Next Step</Button>
                    )}
                    {!step.required && (
                         <Button size="sm" variant="secondary" onClick={onNext}>Skip / Next</Button>
                    )}
                </div>
              </div>
            )}

            {step.type === 'radio' && (
               <div className="space-y-4">
                 <RadioGroup
                    value={data?.value}
                    onValueChange={(val) => onUpdate({ value: val, status: 'pending' })}
                 >
                    {(step.options || []).map(opt => (
                        <div className="flex items-center space-x-2" key={opt}>
                            <RadioGroupItem value={opt} id={`${step.id}-${opt}`} />
                            <Label htmlFor={`${step.id}-${opt}`}>{opt}</Label>
                        </div>
                    ))}
                 </RadioGroup>
                 {data?.value && (
                   <Button size="sm" onClick={onNext}>Finish & Next</Button>
                 )}
               </div>
            )}

            {(step.type === 'action' || step.type === 'tag' || step.type === 'finish') && (
               <div className="flex flex-col gap-2">
                 {step.type !== 'finish' && (
                    <Button size="sm" variant="outline" onClick={() => onAction('commit', { tag: step.type === 'tag' ? (step as any).tagPrefix : undefined })}>
                      {step.actionLabel || 'Commit'}
                    </Button>
                 )}

                 <Button size="sm" onClick={onNext}>
                   {step.nextLabel || 'Finish'}
                 </Button>
               </div>
            )}
         </div>
       )}
    </div>
  );
};
