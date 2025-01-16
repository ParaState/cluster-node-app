import { Skeleton } from '@mui/material';

import { renderOperatorStatus, renderOperatorStatusLabelColor } from '@/utils/format';

import { IResponseOperator } from '@/types';

import Label from '../label';

type Props = {
  operator?: IResponseOperator;
};

export const SpecialOperatorStatusLabel = ({ operator }: Props) => {
  if (!operator) return <Skeleton width={40} />;

  const label = renderOperatorStatus(operator);

  const color = renderOperatorStatusLabelColor(operator);

  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
};
