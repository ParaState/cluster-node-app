import { Box, Card, Stack, Skeleton, Typography } from '@mui/material';

import { useTokenBalanceForAddress } from '@/hooks/contract';

import { formatEtherWithIntl } from '@/utils/format';

import { useGlobalConfig } from '@/components/global-config-init';

type Props = {
  hideAction?: boolean;
  address: any;
};

export function TokenBalanceCard({ hideAction, address }: Props) {
  const { tokenInfo } = useGlobalConfig();

  const tokenBalance = useTokenBalanceForAddress(address);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2">{tokenInfo?.symbol} Balance</Typography>

        {tokenBalance.isTokenBalanceLoading ? (
          <Skeleton height={48} />
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h3" sx={{ fontSize: 40 }}>
              {formatEtherWithIntl(tokenBalance.balance!, 4)}
              <Typography variant="body2" component="span" sx={{ fontSize: 20 }}>
                &nbsp;{tokenInfo.symbol}
              </Typography>
            </Typography>
          </Stack>
        )}
      </Box>
    </Card>
  );
}
