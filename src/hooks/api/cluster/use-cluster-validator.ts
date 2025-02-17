import { useQuery } from '@tanstack/react-query';

import services from '@/services';

export function useClusterValidator() {
  const clusterValidatorQuery = useQuery({
    queryKey: ['useClusterValidator'],
    queryFn: () =>
      services.clusterNode.queryValidatorStatus({
        pubkey: '',
        status: '',
        generate_txid: '',
        register_txid: '',
        deposit_txid: '',
        exit_txid: '',
      }),
  });

  return {
    clusterValidatorQuery,
  };
}
