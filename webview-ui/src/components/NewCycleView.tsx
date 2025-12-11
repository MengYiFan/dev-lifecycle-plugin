import React, { useState } from 'react';
import { vscode } from '../utils/vscode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Rocket } from 'lucide-react';

export const NewCycleView: React.FC = () => {
  const [prd, setPrd] = useState('');
  const [design, setDesign] = useState('');
  const [meegleId, setMeegleId] = useState('');
  const [baseBranch, setBaseBranch] = useState('master');

  const canCreate = prd && meegleId;

  const handleCreate = () => {
    vscode.postMessage({
      command: 'createBranch',
      payload: { prdLink: prd, meegleId, baseBranch, designLink: design }
    });
  };

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
             <Rocket className="w-6 h-6 text-primary" />
             <CardTitle>Start New R&D Cycle</CardTitle>
          </div>
          <CardDescription>
             Create a new feature branch and initialize the development lifecycle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>PRD Link <span className="text-destructive">*</span></Label>
            <Input
                value={prd}
                onChange={e => setPrd(e.target.value)}
                placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Design Spec (Optional)</Label>
            <Input
                value={design}
                onChange={e => setDesign(e.target.value)}
                placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Meegle ID <span className="text-destructive">*</span></Label>
            <Input
                type="number"
                value={meegleId}
                onChange={e => setMeegleId(e.target.value)}
                placeholder="12345"
            />
          </div>

          {canCreate && (
             <div className="pt-4 space-y-4 border-t border-border mt-4 animate-accordion-down">
               <div className="space-y-2">
                  <Label>Base Branch</Label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={baseBranch}
                    onChange={e => setBaseBranch(e.target.value)}
                  >
                    <option value="master">master</option>
                    <option value="main">main</option>
                  </select>
               </div>

               <Button className="w-full" onClick={handleCreate}>
                 Create Feature Branch
               </Button>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
