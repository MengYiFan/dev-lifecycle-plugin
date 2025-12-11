import React, { useState, useEffect } from "react";
import { vscode } from "./utils/vscode";
import { LifecycleState } from "./types";
import { NewCycleView } from "./components/NewCycleView";
import { LifecycleView } from "./components/LifecycleView";
import { Loader2 } from "lucide-react";

function App() {
  const [state, setState] = useState<LifecycleState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      switch (message.command) {
        case "updateState":
          setState(message.payload);
          setLoading(false);
          break;
      }
    };

    window.addEventListener("message", handleMessage);
    vscode.postMessage({ command: "ready" });

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted">Loading lifecycle data...</span>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-destructive">
        No state available.
      </div>
    );
  }

  if (state.branchType === 'non-feature') {
    return <NewCycleView />;
  }

  return <LifecycleView state={state} />;
}

export default App;
