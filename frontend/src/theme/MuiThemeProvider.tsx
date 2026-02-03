import { type ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './darkTheme';

interface MuiThemeProviderProps {
    children: ReactNode;
}

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};
