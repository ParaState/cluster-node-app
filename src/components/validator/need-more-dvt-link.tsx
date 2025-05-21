import { Box, Link, Alert, Typography } from '@mui/material';

import { config } from '@/config';

import { useGlobalConfig } from '@/components/global-config-init';

export function NeedMoreDvtLink() {
  const { tokenInfo } = useGlobalConfig();

  if (tokenInfo.symbol !== 'DVT') {
    return null;
  }

  return (
    <Box py={2}>
      <Alert severity="info" variant="outlined">
        <Typography fontSize={18}>
          Need more DVT? Go to{' '}
          <Typography
            color="primary.main"
            component={Link}
            underline="always"
            href={config.links.uniswapLink}
            target="_blank"
            fontWeight={600}
          >
            Uniswap
          </Typography>{' '}
          to gain more DVT.
        </Typography>
      </Alert>
    </Box>
  );
}
