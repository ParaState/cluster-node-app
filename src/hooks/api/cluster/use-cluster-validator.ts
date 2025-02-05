import { useQuery } from '@tanstack/react-query';

import services from '@/services';
import { IResponseValidatorStatusEnum } from '@/types';

export function useClusterValidator() {
  const clusterValidatorQuery = useQuery({
    queryKey: ['useClusterValidator'],
    queryFn: () =>
      services.clusterNode.queryValidatorStatus(
        IResponseValidatorStatusEnum.all,
        IResponseValidatorStatusEnum.all,
        '1'
      ),
  });

  return {
    clusterValidatorQuery,
  };
}
