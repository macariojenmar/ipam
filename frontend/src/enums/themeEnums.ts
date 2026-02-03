export const DARK = 'dark' as const;
export const LIGHT = 'light' as const;

export const PRIMARY_COLOR = '#FAFAF9';

export const TYPOGRAPHY = {
    fontFamily: [
        'Poppins',
        'sans-serif',
    ].join(','),
};

export const COMPONENTS = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                boxShadow: 'none',
                textTransform: 'capitalize',
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                padding: 14,
                borderRadius: 8,
                boxShadow: 'none',
            },
        },
    },
};
