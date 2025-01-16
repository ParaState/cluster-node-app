import { useScrollToTop } from '@/hooks/use-scroll-to-top';

import '@/global.css';
import Router from '@/routes';
import ThemeProvider from '@/theme';
import { ContextProvider } from '@/wagmi';

import ProgressBar from '@/components/progress-bar';
import { SnackbarProvider } from '@/components/snackbar';
import { MotionLazy } from '@/components/animate/motion-lazy';
import { GlobalConfigInit } from '@/components/global-config-init';
import { SettingsDrawer, SettingsProvider } from '@/components/settings';

export default function App() {
  useScrollToTop();

  return (
    <SettingsProvider
      defaultSettings={{
        themeMode: 'light', // 'light' | 'dark'
        themeDirection: 'ltr', //  'rtl' | 'ltr'
        themeContrast: 'default', // 'default' | 'bold'
        themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
        themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
        themeStretch: false,
      }}
    >
      <ContextProvider>
        <ThemeProvider>
          <MotionLazy>
            <SnackbarProvider>
              <SettingsDrawer />
              <ProgressBar />
              <Router />
              <GlobalConfigInit />
            </SnackbarProvider>
          </MotionLazy>
        </ThemeProvider>
      </ContextProvider>
    </SettingsProvider>
  );
}
