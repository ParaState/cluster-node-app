import { useAccount } from 'wagmi';

import Button from '@mui/material/Button';

import { RouterLink } from '@/routes/components';

import { formatAddress } from '@/utils/format';

import { useOpenWallet } from '@/hooks';

export const ConnectWalletButton = () => {
  const { address } = useAccount();

  const { openWallet } = useOpenWallet();

  return (
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
  );
};
