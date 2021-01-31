import { createMuiTheme, darken } from '@material-ui/core/styles';

export const colors = {
  primary: '#053e64',
  secondary: '#388e3c',
  tertiary: '#84CF3A',
  warning: '#EF8E00',
  success: '#84CF3A',
  error: '#ad0000',
  text: '#1C1139',
  action: '#81779D',
  disabled: '#999999',
  dark: '#222',
  inherit: 'inherit',
  blue: '#3762EA',
  input: '#F5F7F9',
  white: '#fff',
} as const;

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.error,
    },
    text: {
      primary: colors.text,
    },
    action: {
      active: colors.action,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 10,
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: colors.input,
        '&:hover': {
          backgroundColor: darken(colors.input, 0.05),
        },
      },
    },
  },
});

const { palette } = theme;
export const contrastColors = {
  primary: palette.primary.contrastText,
  secondary: palette.secondary.contrastText,
  tertiary: '#fff',
  warning: '#fff',
  success: palette.success.contrastText,
  error: palette.error.contrastText,
  text: '#fff',
  action: '#000',
  disabled: '#000',
  dark: '#fff',
  inherit: 'inherit',
  blue: '#fff',
  input: '#000',
  white: '#000',
} as const;

export type PalleteColor = keyof typeof colors;

export function resolvePalleteColor(color?: PalleteColor): string;
export function resolvePalleteColor(color?: string): string;
export function resolvePalleteColor(color?: PalleteColor | string) {
  return (color && colors[color as PalleteColor]) || color;
}

export function resolvePalleteContrastColor(color?: PalleteColor): string;
export function resolvePalleteContrastColor(color?: string): string;
export function resolvePalleteContrastColor(color?: PalleteColor | string) {
  return (color && contrastColors[color as PalleteColor]) || color;
}
