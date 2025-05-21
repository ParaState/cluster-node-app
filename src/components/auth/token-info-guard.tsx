import { LoadingScreen } from '@/components/loading-screen';
import { useGlobalConfig } from '@/components/global-config-init';

type Props = {
  children?: React.ReactNode;
};

export const TokenInfoGuard = ({ children }: Props) => {
  const { tokenInfo, clusterNodeFeeTokenInfo } = useGlobalConfig();

  if (!tokenInfo.address || !clusterNodeFeeTokenInfo.address) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
