import { useCallback } from 'react';

import { Stack, Tooltip, useTheme, Typography } from '@mui/material';

// import { useBlockHeight } from '@/components/block-height/block-height-context';

type Props = {
  paid: number;
};

export const SubscriptionEstimateFeePaid = ({ paid }: Props) => {
  // const { isBlockHeightloading, blockHeight } = useBlockHeight();
  const blockHeight = 111;
  const theme = useTheme();

  const estimateTime = useCallback(() => {
    if (blockHeight > 0 && paid > 0) {
      return ((paid - blockHeight) * 12) / 60 / 60 / 24;
    }

    return 0;
  }, [blockHeight, paid]);

  const time = estimateTime();

  return (
    <Tooltip
      title={
        <Stack>
          <Typography variant="caption">Current block height: {blockHeight}</Typography>
          <Typography variant="caption">Subscription fee paid: {paid}</Typography>
        </Stack>
      }
      sx={{ maxWidth: 'none' }}
    >
      <Stack direction="row">
        <span>{paid}&nbsp;</span>
        <span
          style={{
            color: time > 10 ? theme.palette.success.main : theme.palette.warning.main,
          }}
        >
          {time > 0 ? `≈ ${time.toFixed(2)} days` : ''}
        </span>
      </Stack>
    </Tooltip>
  );
};
