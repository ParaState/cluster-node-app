import { useAccount } from 'wagmi';

import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';

import { isVerifiedSignature } from '@/utils';
import { useBoolean, useAuthMessage } from '@/hooks';

import { CenterContainer } from '@/components/common';
import { ConnectWalletButton } from '@/components/wallet';

type Props = {
  children?: React.ReactNode;
};

const WalletAuthGuard = ({ children }: Props) => {
  const { address } = useAccount();

  const { signAuthMessage } = useAuthMessage();

  const loading = useBoolean();

  const handleSignMessage = async () => {
    try {
      loading.onTrue();
      await signAuthMessage();
      loading.onFalse();
    } catch (error) {
      loading.onFalse();
    }
  };

  if (!address) {
    return (
      <CenterContainer>
        <ConnectWalletButton />
      </CenterContainer>
    );
  }

  if (!isVerifiedSignature()) {
    return (
      <CenterContainer>
        <Stack spacing={2} alignItems="center">
          <Typography>Please sign the message to continue</Typography>

          <LoadingButton
            loading={loading.value}
            variant="contained"
            color="primary"
            onClick={handleSignMessage}
          >
            Sign Message
          </LoadingButton>
        </Stack>
      </CenterContainer>
    );
  }

  return <>{children}</>;
};

export default WalletAuthGuard;
