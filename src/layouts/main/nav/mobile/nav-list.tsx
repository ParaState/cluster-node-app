import { useState, useCallback } from 'react';

import Collapse from '@mui/material/Collapse';
import { stackClasses } from '@mui/material/Stack';
import { listItemButtonClasses } from '@mui/material/ListItemButton';

import { usePathname } from '@/routes/hooks';

import { NavSectionVertical } from '@/components/nav-section';

import { NavItem } from './nav-item';
import { NavListProps } from '../types';

export default function NavList({ data }: NavListProps) {
  const pathname = usePathname();

  const active = pathname === data.path || pathname === `${data.path}/`;

  const [openMenu, setOpenMenu] = useState(false);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu((prev) => !prev);
    }
  }, [data.children]);

  return (
    <>
      <NavItem
        open={openMenu}
        onClick={handleToggleMenu}
        //
        title={data.title}
        path={data.path}
        icon={data.icon}
        auth={data.auth}
        //
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        //
        active={active}
      />

      {!!data.children && (
        <Collapse in={openMenu} unmountOnExit>
          <NavSectionVertical
            data={data.children}
            slotProps={{
              rootItem: {
                minHeight: 36,
              },
            }}
            sx={{
              [`& .${stackClasses.root}`]: {
                '&:last-of-type': {
                  [`& .${listItemButtonClasses.root}`]: {
                    height: 160,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    bgcolor: 'background.neutral',
                    backgroundRepeat: 'no-repeat',

                    '& .label': {
                      display: 'none',
                    },
                  },
                },
              },
            }}
          />
        </Collapse>
      )}
    </>
  );
}
