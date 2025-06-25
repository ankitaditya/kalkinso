import { useState, useCallback } from 'react';

export default function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [currentStep, setCurrentStep] = useState(0);

  const setState = useCallback(
    (newState) => {
      const updatedHistory = history.slice(0, currentStep + 1);
      setHistory([...updatedHistory, newState]);
      setCurrentStep(updatedHistory.length);
    },
    [history, currentStep]
  );

  const undo = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const redo = useCallback(() => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, history.length]);

  return [history[currentStep], setState, undo, redo];
}
