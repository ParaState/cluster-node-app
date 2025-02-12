import { useWatchAsset } from 'wagmi';

import { Link } from '@mui/material';

import { config } from '@/config';

import { useGlobalConfig } from '@/components/global-config-init';

export const ImportWalletToken = () => {
  const { tokenInfo } = useGlobalConfig();
  const { watchAsset } = useWatchAsset();

  const importTokenToWallet = () => {
    const options = {
      address: config.contractAddress.token,
      decimals: tokenInfo.decimals,
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
    };
    watchAsset({
      type: 'ERC20',
      options,
    });
  };

  return (
    <Link
      underline="always"
      display="inline"
      onClick={importTokenToWallet}
      sx={{ cursor: 'pointer' }}
    >
      (Import {tokenInfo.symbol} Token)
    </Link>
  );
};
