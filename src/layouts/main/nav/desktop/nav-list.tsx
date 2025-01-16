import { useState, useEffect, useCallback } from 'react';

// import Fade from '@mui/material/Fade';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';
// import Portal from '@mui/material/Portal';
// import { useTheme } from '@mui/material/styles';
// import ListSubheader from '@mui/material/ListSubheader';

import { usePathname } from '@/routes/hooks';

// import { paper } from '@/theme/css';
// import { HEADER } from '@/layouts/config-layout';

import { NavItem } from './nav-item';
// import { NavListProps, NavSubListProps } from '../types';
import { NavListProps } from '../types';

export default function NavList({ data, sx }: NavListProps & { sx?: object }) {
  // const theme = useTheme();

  const pathname = usePathname();

  const active = pathname === data.path || pathname === `${data.path}/`;

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu(true);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  return (
    <>
      <NavItem
        open={openMenu}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={handleCloseMenu}
        title={data.title}
        path={data.path}
        auth={data.auth}
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        active={active}
        sx={sx}
      />

      {/* {!!data.children && openMenu && (
        <Portal>
          <Fade in={openMenu}>
            <Paper
              onMouseEnter={handleOpenMenu}
              onMouseLeave={handleCloseMenu}
              sx={{
                ...paper({ theme }),
                left: 0,
                right: 0,
                m: 'auto',
                display: 'flex',
                borderRadius: 2,
                position: 'fixed',
                zIndex: theme.zIndex.modal,
                p: theme.spacing(5, 1, 1, 3),
                top: HEADER.H_DESKTOP_OFFSET,
                maxWidth: theme.breakpoints.values.lg,
                boxShadow: theme.customShadows.dropdown,
              }}
            >
              {data.children.map((list) => (
                <NavSubList key={list.subheader} subheader={list.subheader} data={list.items} />
              ))}
            </Paper>
          </Fade>
        </Portal>
      )} */}
    </>
  );
}
