import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

import services from '@/services';
import { IRequestCommonPagination } from '@/types';

export function useUserList(pagination: IRequestCommonPagination) {
  const querypag = { offset: pagination.offset * pagination.limit, limit: pagination.limit };

  const body = {
    pag: querypag,
    filter: {},
    sort: { id: 1 },
  };

  const userListQuery = useQuery({
    queryKey: ['useUserList', body],
    queryFn: () => services.user.fetchUsers(body),
  });

  return {
    userListQuery,
  };
}
export function useInfiniteUserList(filter) {
  return useInfiniteQuery({
    queryKey: ['userList', filter],
    queryFn: ({ pageParam }) => {
      const body = {
        pag: pageParam,
        filter,
        sort: {
          id: 1,
        },
      };

      return services.user.fetchUsers(body);
    },
    initialPageParam: {
      offset: 0,
      limit: 30,
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.rows.length < lastPageParam.limit) {
        return undefined;
      }
      return { ...lastPageParam, offset: lastPageParam.offset + lastPageParam.limit };
    },
    refetchOnWindowFocus: false,
  });
}
