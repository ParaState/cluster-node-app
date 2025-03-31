import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { config } from '@/config';
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

  const isLidoCSMWithdrawalAddress = () => {
    const depositData = selectedValidator.map((item) => JSON.parse(item.deposit_data));
    const lidoCSMWithdrawalAddress = depositData.every((item) =>
      (item.withdrawal_credentials as string).includes(
        config.contractAddress.lidoWithdrawalAddress.slice(2).toLowerCase()
      )
    );
    return lidoCSMWithdrawalAddress;
  };

  return {
    selectedValidator,
    setSelectedValidator,
    resetSelectedValidator,
    isLidoCSMWithdrawalAddress,
  };
};

export const nodeOperatorIdAtom = atomWithStorage<number | undefined>(
  'nodeOperatorId',
  localStorage.getItem('nodeOperatorId') ? +localStorage.getItem('nodeOperatorId')! : undefined
);

export const useNodeOperatorId = () => {
  const [nodeOperatorId, setNodeOperatorId] = useAtom(nodeOperatorIdAtom);

  return { nodeOperatorId, setNodeOperatorId };
};

const hasVisitedAtom = atomWithStorage<string>(
  'hasVisited',
  localStorage.getItem('hasVisited') || ''
);

export const useFirstVisit = () => {
  const [hasVisited, setHasVisited] = useAtom(hasVisitedAtom);

  const markAsVisited = () => {
    setHasVisited(new Date().toISOString());
  };

  return {
    isFirstVisit: !hasVisited,
    markAsVisited,
  };
};
