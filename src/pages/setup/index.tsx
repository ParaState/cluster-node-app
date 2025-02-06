import { useAccount } from 'wagmi';

import { Button, Container } from '@mui/material';

import RouterLink from '@/routes/components/router-link';

import { formatAddress } from '@/utils';
import { useOpenWallet } from '@/hooks';

import { OverviewAppView } from '@/sections/overview';

export default function SetupPage() {
  const { address } = useAccount();
  const { openWallet } = useOpenWallet();

  if (!address) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Button
          component={RouterLink}
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => {
            openWallet();
          }}
        >
          {address ? `${formatAddress(address)}` : 'Connect Wallet'}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <OverviewAppView />
    </Container>
  );
}
