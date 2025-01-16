import { useAccount } from 'wagmi';

import { CenterContainer } from '@/components/common';
import { ConnectWalletButton } from '@/components/wallet';

type Props = {
  children?: React.ReactNode;
};

const WalletAuthGuard = ({ children }: Props) => {
  const { address } = useAccount();

  if (!address) {
    return (
      <CenterContainer>
        <ConnectWalletButton />
      </CenterContainer>
    );
  }

  return <>{children}</>;
};

export default WalletAuthGuard;
