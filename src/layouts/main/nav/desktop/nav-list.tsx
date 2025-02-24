import { useRef, useState, useEffect, useCallback } from 'react';

import { Stack, Portal, Popover, useTheme, MenuItem, Typography } from '@mui/material';

import { useRouter, usePathname } from '@/routes/hooks';

import { NavItem } from './nav-item';
// import { NavListProps, NavSubListProps } from '../types';
import { NavListProps } from '../types';

export default function NavList({ data, sx }: NavListProps & { sx?: object }) {
  const theme = useTheme();

  const pathname = usePathname();

  const router = useRouter();

  const active = pathname === data.path || pathname === `${data.path}/`;

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (openMenu) {
      handleCloseMenu();
    }
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu(true);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const navRef = useRef<HTMLDivElement | null>(null);
  // if (data.children) {
  //   return (
  //     <Tooltip
  //       slotProps={{
  //         tooltip: {
  //           sx: {
  //             color: '#514E6A',
  //             backgroundColor: '#ffff',
  //             boxShadow: theme.customShadows.dropdown,
  //             p: theme.spacing(1),
  //           },
  //         },
  //       }}
  //       title={
  //         <Stack>
  //           {data.children.map((child) => (
  //             <MenuItem
  //               key={child.path}
  //               onClick={() => {
  //                 router.push(child.path);
  //               }}
  //             >
  //               <Typography key={child.path} variant="body2" fontWeight={500} color="black">
  //                 {child.title}
  //               </Typography>
  //             </MenuItem>
  //           ))}
  //         </Stack>
  //       }
  //     >
  //       <Box>
  //         <NavItem
  //           open={openMenu}
  //           onMouseEnter={handleOpenMenu}
  //           onMouseLeave={handleCloseMenu}
  //           onClick={() => {
  //             router.push(data.path);
  //             handleCloseMenu();
  //           }}
  //           title={data.title}
  //           path={data.path}
  //           auth={data.auth}
  //           hasChild={!!data.children}
  //           externalLink={data.path.includes('http')}
  //           active={active}
  //           sx={sx}
  //         />
  //       </Box>
  //     </Tooltip>
  //   );
  // }

  return (
    <>
      <NavItem
        ref={navRef}
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

      {!!data.children && openMenu && (
        <Portal>
          {/* <Fade in={openMenu}>
            <Paper
              onMouseEnter={handleOpenMenu}
              onMouseLeave={handleCloseMenu}
              sx={{
                ...paper({ theme }),
                left: 0,
                right: 0,
                m: 'auto',
                width: 'fit-content',
                display: 'flex',
                borderRadius: 2,
                position: 'absolute',
                zIndex: theme.zIndex.modal,
                p: theme.spacing(5, 1, 1, 3),
                top: HEADER.H_DESKTOP_OFFSET,
                boxShadow: theme.customShadows.dropdown,
              }}
            >
              <Stack>
                {data.children.map((child) => (
                  <MenuItem
                    key={child.path}
                    onClick={() => {
                      router.push(child.path);
                    }}
                  >
                    <Typography key={child.path} variant="body2" fontWeight={500} color="black">
                      {child.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Stack>
            </Paper>
          </Fade> */}
          <Popover
            disableScrollLock
            open={openMenu}
            anchorEl={navRef.current}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{
              paper: {
                onMouseEnter: handleOpenMenu,
                onMouseLeave: handleCloseMenu,
                sx: {
                  minWidth: 160,
                  ...(openMenu && {
                    pointerEvents: 'auto',
                  }),
                },
              },
            }}
            sx={{
              pointerEvents: 'none',
            }}
          >
            <Stack>
              {data.children.map((child) => (
                <MenuItem
                  key={child.path}
                  onClick={() => {
                    router.push(child.path);
                  }}
                >
                  <Typography key={child.path} variant="body2" fontWeight={500} color="black">
                    {child.title}
                  </Typography>
                </MenuItem>
              ))}
            </Stack>
          </Popover>
        </Portal>
      )}
    </>
  );
}
