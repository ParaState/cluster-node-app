import { useAccount } from 'wagmi';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from '@/routes/components';

import { useOffSetTop } from '@/hooks/use-off-set-top';

import { bgBlur } from '@/theme/css';
import { formatAddress } from '@/utils';
import { useOpenWallet, useResponsive } from '@/hooks';

import Logo from '@/components/logo';
import SvgColor from '@/components/svg-color';
import { useSettingsContext } from '@/components/settings';

import { NAV, HEADER } from '../config-layout';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const { address } = useAccount();

  const { openWallet } = useOpenWallet();

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}
      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
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
        </Stack>
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
