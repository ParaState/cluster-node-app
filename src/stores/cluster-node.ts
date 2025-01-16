import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const clusterPubkeyAtom = atomWithStorage('clusterPubkey', '');

export const useClusterPubkey = () => {
  const [clusterPubkey, setClusterPubkey] = useAtom(clusterPubkeyAtom);
  return { clusterPubkey, setClusterPubkey };
};
