import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import services from '@/services';
import { defaultPagination } from '@/types';

export function useOperatorList(filter: any, sort: any, searchInput: string) {
  // const querypag = { offset: pagination.offset * pagination.limit, limit: pagination.limit };

  const operatorQuery = useInfiniteQuery({
    queryKey: ['operatorList', filter, sort, searchInput],
    queryFn: ({ pageParam }) => {
      const newFilter = { ...filter };
      if (searchInput) {
        newFilter.name = searchInput;
      }
      // debugger;
      const body = {
        pag: pageParam,
        filter: newFilter,
        sort,
      };

      return services.clusterNode.fetchOperators(body);
    },
    initialPageParam: defaultPagination,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      // console.log(lastPage.rows.length < pagination.limit);
      if (lastPage.rows.length < lastPageParam.limit) {
        return undefined;
      }
      return { ...lastPageParam, offset: lastPageParam.offset + lastPageParam.limit };
    },
    refetchOnWindowFocus: false,
  });

  return {
    operatorQuery,
  };
}

export function useOperatorLidoCSMList(managerAddress: string) {
  return useQuery({
    queryKey: ['operatorLidoCSMList', managerAddress],
    queryFn: () =>
      services.clusterNode.fetchOperatorLidoCSM({
        pag: {
          offset: 0,
          limit: 30,
        },
        filter: {
          manager_address: managerAddress,
        },
        sort: {
          operator_id: -1,
        },
      }),
  });
}
