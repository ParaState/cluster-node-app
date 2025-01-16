import { useState, useEffect, useCallback } from 'react';

import { Box } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import { usePathname } from '@/routes/hooks';

import { navConfig } from '@/config';

import Logo from '@/components/logo';
import SvgColor from '@/components/svg-color';
import Scrollbar from '@/components/scrollbar';
import { ConnectWalletButton } from '@/components/wallet';

import NavList from './nav-list';

export default function NavMobile() {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  return (
    <>
      <IconButton onClick={handleOpenMenu} sx={{ ml: 1 }}>
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
      </IconButton>

      <Drawer
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          {navConfig.map((list) => (
            <NavList key={list.title} data={list} />
          ))}

          <Box sx={{ mt: 2, px: 2 }}>
            <ConnectWalletButton />
          </Box>
        </Scrollbar>
      </Drawer>
    </>
  );
}
