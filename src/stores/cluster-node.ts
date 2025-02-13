import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { IResponseClusterNodeValidatorItem } from '@/types';

export const clusterPubkeyAtom = atomWithStorage('clusterPubkey', '');

export const useClusterPubkey = () => {
  const [clusterPubkey, setClusterPubkey] = useAtom(clusterPubkeyAtom);
  return { clusterPubkey, setClusterPubkey };
};

export const selectedValidatorAtom = atomWithStorage<IResponseClusterNodeValidatorItem[]>(
  'selectedValidator',
  []
);

export const useSelectedValidator = () => {
  const [selectedValidator, setSelectedValidator] = useAtom(selectedValidatorAtom);

  const resetSelectedValidator = () => {
    setSelectedValidator([]);
  };

  return { selectedValidator, setSelectedValidator, resetSelectedValidator };
};
