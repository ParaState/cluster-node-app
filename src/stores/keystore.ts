import { atom, useAtom } from 'jotai';

import { config } from '@/config';
import { IResponseOperator } from '@/types';

export const keyStoreFileListAtom = atom<File[]>([]);

export const isExceedMaxFilesAtom = atom(
  (get) => get(keyStoreFileListAtom).length > config.maxKeyStoreFiles
);

export const isJsonFileAtom = atom((get) =>
  get(keyStoreFileListAtom).every((file) => file?.type === 'application/json')
);

export const keyStorePrivateKeysAtom = atom<string[]>([]);

export const keyStorePublicKeysAtom = atom<string[]>([]);

export const selectedOperatorsAtom = atom<IResponseOperator[]>([]);

export const currentCommitteeSizeAtom = atom(config.operatorThresholdList[0]);

export const useSelectedOperators = () => {
  const [selectedOperators, setSelectedOperators] = useAtom(selectedOperatorsAtom);

  const [isJsonFile] = useAtom(isJsonFileAtom);
  const [isExceedMaxFiles] = useAtom(isExceedMaxFilesAtom);
  const [keyStorePrivateKeys, setKeyStorePrivateKeys] = useAtom(keyStorePrivateKeysAtom);
  const [keyStorePublicKeys, setKeyStorePublicKeys] = useAtom(keyStorePublicKeysAtom);

  const [currentCommitteeSize, setCurrentCommitteeSize] = useAtom(currentCommitteeSizeAtom);

  const [, setKeyStoreFileListAtom] = useAtom(keyStoreFileListAtom);

  const handleSelectOperator = (operator: IResponseOperator) => {
    setSelectedOperators((prev) => {
      if (prev.includes(operator)) {
        return prev.filter((item) => item !== operator);
      }
      if (prev.length >= currentCommitteeSize.sharesNumber) {
        return prev;
      }
      return [...prev, operator];
    });
  };

  const isSelectedOperators = (operator: IResponseOperator) =>
    selectedOperators.map((item) => item.id).includes(operator.id);

  const allSelectedOperatorsVerified = selectedOperators.every(
    (operator) => operator.verified || operator.fromDao
  );

  const must2verifiedOperators =
    selectedOperators.filter((operator) => operator.verified || operator.fromDao).length >= 2;

  const isSelectedEnoughOperators = selectedOperators.length === currentCommitteeSize.sharesNumber;

  const isExceedMaxOperators = selectedOperators.some(
    (operator) => operator.validator_count >= config.maxValidatorCount
  );

  const resetAll = () => {
    setSelectedOperators([]);
    setKeyStorePrivateKeys([]);
    setKeyStorePublicKeys([]);
    setCurrentCommitteeSize(config.operatorThresholdList[0]);
    setKeyStoreFileListAtom([]);
  };

  return {
    keyStorePrivateKeys,
    setKeyStorePrivateKeys,
    keyStorePublicKeys,
    setKeyStorePublicKeys,
    isJsonFile,
    isExceedMaxFiles,

    //
    selectedOperators,
    setSelectedOperators,
    //
    handleSelectOperator,
    isSelectedOperators,
    allSelectedOperatorsVerified,
    must2verifiedOperators,
    isSelectedEnoughOperators,
    isExceedMaxOperators,

    //
    currentCommitteeSize,
    setCurrentCommitteeSize,

    //
    resetAll,
  };
};
