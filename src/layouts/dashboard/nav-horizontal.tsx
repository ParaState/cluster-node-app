import { memo } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { bgBlur } from '@/theme/css';

import { HEADER } from '../config-layout';
import HeaderShadow from '../common/header-shadow';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      />

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
