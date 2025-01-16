import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { hideScroll } from '@/theme/css';

import Logo from '@/components/logo';

import { NAV } from '../config-layout';
import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini() {
  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2 }} />
      </Stack>
    </Box>
  );
}
