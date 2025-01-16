import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';

import { useTheme } from '@mui/material/styles';

export function useOpenWallet() {
  const theme = useTheme();

  const { open } = useWeb3Modal();

  const { setThemeMode } = useWeb3ModalTheme();

  const openWallet = () => {
    setThemeMode(theme.palette.mode);
    open();
  };

  return { openWallet };
}
