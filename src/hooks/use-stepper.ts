import { useState, useCallback } from 'react';

type ReturnType = {
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export function useStepper(initialStep: number = 0): ReturnType {
  const [activeStep, setActiveStep] = useState<number>(initialStep);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, []);

  return {
    activeStep,
    handleNext,
    handleBack,
    handleReset,
    setActiveStep,
  };
}
