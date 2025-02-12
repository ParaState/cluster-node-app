import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { atomWithStorage } from 'jotai/utils';

export interface GenerateValidatorType {
  operatorIds: number[];
  validatorCount: number;
  withdrawalAddress: string;
}

export const generateValidatorAtom = atomWithStorage<GenerateValidatorType>(
  'generateValidator',
  {} as GenerateValidatorType
);

export function useGenerateValidatorInfo() {
  const [generateValidatorInfo, setGenerateValidator] = useAtom(generateValidatorAtom);

  const isGenerateValidatorEmpty = useMemo(() => {
    return Object.keys(generateValidatorInfo).length === 0;
  }, [generateValidatorInfo]);

  const resetGenerateValidator = () => {
    setGenerateValidator({} as GenerateValidatorType);
  };

  return {
    generateValidatorInfo,
    setGenerateValidator,
    isGenerateValidatorEmpty,
    resetGenerateValidator,
  };
}
