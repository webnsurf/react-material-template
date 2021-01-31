"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePalleteContrastColor = exports.resolvePalleteColor = exports.contrastColors = exports.theme = exports.colors = void 0;
var styles_1 = require("@material-ui/core/styles");
exports.colors = {
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
};
exports.theme = styles_1.createMuiTheme({
    palette: {
        primary: {
            main: exports.colors.primary,
        },
        secondary: {
            main: exports.colors.secondary,
        },
        success: {
            main: exports.colors.success,
        },
        warning: {
            main: exports.colors.warning,
        },
        error: {
            main: exports.colors.error,
        },
        text: {
            primary: exports.colors.text,
        },
        action: {
            active: exports.colors.action,
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
                backgroundColor: exports.colors.input,
                '&:hover': {
                    backgroundColor: styles_1.darken(exports.colors.input, 0.05),
                },
            },
        },
    },
});
var palette = exports.theme.palette;
exports.contrastColors = {
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
};
function resolvePalleteColor(color) {
    return (color && exports.colors[color]) || color;
}
exports.resolvePalleteColor = resolvePalleteColor;
function resolvePalleteContrastColor(color) {
    return (color && exports.contrastColors[color]) || color;
}
exports.resolvePalleteContrastColor = resolvePalleteContrastColor;
