import { Skeleton } from '@mui/material';

import Label from '../label';

type Props = {
  status?: string;
};

export const CommonStatusLabel = ({ status }: Props) => {
  if (!status) return <Skeleton width={40} />;

  const label = status === 'invalid' ? 'inactive' : status;
  const color = label === 'inactive' ? 'error' : 'success';

  return (
    <Label variant="soft" color={color}>
      {label}
    </Label>
  );
};
