import { atom, useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';

import services from '@/services';
import { IRequestCommonPagination } from '@/types';

const isValidatorAtom = atom(false);
export function useOwnedValidator(address: string, pagination: IRequestCommonPagination) {
  // const loadValidators = () => {
  //   setLoadingValidators(true);

  //   services.validator.fetchValidators(body).then((result) => {
  //     setTotalValidators(result.count);
  //     setValidators(result.rows);
  //     setLoadingValidators(false);
  //   });
  // };

  const [isValidator, setIsValidatorAtom] = useAtom(isValidatorAtom);

  const querypag = { offset: pagination.offset * pagination.limit, limit: pagination.limit };

  const body = {
    pag: querypag,
    filter: {
      address,
    },
    sort: { id: 1 },
  };

  const validatorQuery = useQuery({
    queryKey: ['ownedValidator', body],
    queryFn: () => services.validator.fetchValidators(body),
    select: (data) => data,
  });

  if (validatorQuery.data) {
    setIsValidatorAtom(validatorQuery.data.count > 0);
  }

  const isValidatorEmpty = validatorQuery.isFetched && validatorQuery.data?.count === 0;

  return {
    validatorQuery,
    isValidator,
    isValidatorEmpty,
  };
}

const validatorCountAtom = atom(0);
export function useValidators(pagination: IRequestCommonPagination) {
  const [validatorCount, setValidatorCount] = useAtom(validatorCountAtom);

  const querypag = { offset: pagination.offset * pagination.limit, limit: pagination.limit };

  const body = {
    pag: querypag,
    filter: {},
    sort: { id: 1 },
  };

  const validatorQuery = useQuery({
    queryKey: ['useValidators', body],
    queryFn: () => services.validator.fetchValidators(body),
  });

  if (validatorQuery.data) {
    setValidatorCount(validatorQuery.data.count);
  }

  return {
    validatorQuery,
    validatorCount,
  };
}

export const useFirstPageValidators = () => useValidators({ offset: 0, limit: 1 });
