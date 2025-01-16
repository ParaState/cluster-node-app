import { useAccount } from 'wagmi';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { RouterLink } from '@/routes/components';

// import { useOffSetTop } from '@/hooks/use-off-set-top';
import { useResponsive } from '@/hooks/use-responsive';

import { formatAddress } from '@/utils/format';

import { bgBlur } from '@/theme/css';
import { useOpenWallet } from '@/hooks';

import Logo from '@/components/logo';
import SvgColor from '@/components/svg-color';
import { useSettingsContext } from '@/components/settings';

import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  // const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
  const settings = useSettingsContext();

  const { address } = useAccount();

  const { openWallet } = useOpenWallet();

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...bgBlur({
            color: theme.palette.background.default,
          }),

          // ...(offsetTop && {
          //   ...bgBlur({
          //     color: theme.palette.background.default,
          //   }),
          //   height: {
          //     md: HEADER.H_DESKTOP_OFFSET,
          //   },
          // }),
        }}
      >
        <Container maxWidth="xl" sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          {/* <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                // top: 8,
                right: -16,
              },
            }}
            badgeContent={
              <Link href="/" rel="noopener" underline="none" sx={{ ml: 1 }}>
                <Label color="info" sx={{ textTransform: 'unset', height: 22, px: 0.5 }}>
                  Holesky
                </Label>
              </Link>
            }
          > */}
          <Logo />
          {/* </Badge> */}

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop />}

          <Stack alignItems="center" gap={1} direction={{ xs: 'row' }}>
            <IconButton
              onClick={() => {
                settings.onUpdate('themeMode', theme.palette.mode === 'light' ? 'dark' : 'light');
              }}
            >
              <SvgColor
                src={`/assets/icons/setting/ic_${
                  theme.palette.mode === 'light' ? 'sun' : 'moon'
                }.svg`}
              />
            </IconButton>

            {/* <Box
              height={24}
              width={24}
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
                pointer: 'cursor',
              }}
            >
              <SvgColor src="/assets/icons/setting/ic_sun.svg" />
            </Box> */}
            {/* <SettingsButton
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
              }}
            /> */}

            {mdUp && (
              <Button
                component={RouterLink}
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
                onClick={() => {
                  openWallet();
                }}
              >
                {address ? `${formatAddress(address)}` : 'Connect Wallet'}
              </Button>
            )}

            {!mdUp && <NavMobile />}
          </Stack>
        </Container>
      </Toolbar>

      {/* {offsetTop && <HeaderShadow />} */}
      {/* <HeaderShadow /> */}
    </AppBar>
  );
}
