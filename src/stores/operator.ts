import { atom, useAtom } from 'jotai';

export interface registerType {
  address: string;
  name: string;
  publicKey: string;
}
export const registerOperatorAtom = atom<registerType>({} as registerType);
export const newOperatorId = atom<number>(2);

export function useRegisterOperatorInfo() {
  const [registerOperatorInfo, setRegisterOperator] = useAtom(registerOperatorAtom);
  const [operatorId, setNewOperatorId] = useAtom(newOperatorId);

  return {
    registerOperatorInfo,
    setRegisterOperator,
    operatorId,
    setNewOperatorId,
  };
}
