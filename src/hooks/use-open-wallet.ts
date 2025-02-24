import { useAppKit, useAppKitTheme } from '@reown/appkit/react';

import { useTheme } from '@mui/material/styles';

export function useOpenWallet() {
  const theme = useTheme();

  const { open } = useAppKit();

  const { setThemeMode } = useAppKitTheme();

  const openWallet = () => {
    setThemeMode(theme.palette.mode);
    open();
  };

  return { openWallet };
}
