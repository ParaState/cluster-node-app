import { alpha } from '@mui/material/styles';

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const primary = {
  lighter: '#DAD7FC',
  light: '#8D86EE',
  main: '#3F37C9',
  dark: '#201B90',
  darker: '#0D0A60',
  contrastText: '#FFFFFF',
};

export const primaryDark = {
  lighter: '#DAF1FE',
  light: '#91CBFA',
  main: '#4995EF',
  dark: '#2456AC',
  darker: '#0E2972',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#DAD7FC',
  light: '#8D86EE',
  main: '#3F37C9',
  dark: '#201B90',
  darker: '#0D0A60',
  contrastText: '#FFFFFF',
};

export const info = {
  lighter: '#DFF8FF',
  light: '#A1E0FF',
  main: '#63BBFF',
  dark: '#316EB7',
  darker: '#13367A',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#E9FBD3',
  light: '#A9E87B',
  main: '#4FB527',
  dark: '#238213',
  darker: '#085607',
  contrastText: '#ffffff',
};

// ui design
// export const success = {
//   lighter: '#D1FECE',
//   light: '#6EFA81',
//   main: '#11EF5B',
//   dark: '#08AC5F',
//   darker: '#037254',
//   contrastText: '#ffffff',
// };

export const warning = {
  lighter: '#FFFBD2',
  light: '#FFF279',
  main: '#FFE521',
  dark: '#B79F10',
  darker: '#7A6706',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFE9D8',
  light: '#FFAA8A',
  main: '#FF533D',
  dark: '#B71E25',
  darker: '#7A0B22',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#171717',
  white: '#FFFFFF',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

const baseDark = {
  ...primary,
  primary: primaryDark,
};

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };

  const dark = {
    ...baseDark,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: grey[500],
      disabled: grey[600],
    },
    background: {
      paper: grey[800],
      default: grey[900],
      neutral: alpha(grey[500], 0.12),
    },
    action: {
      ...base.action,
      active: grey[500],
    },
  };

  const result = mode === 'light' ? light : dark;
  return result;
}
