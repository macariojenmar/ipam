import { createTheme } from "@mui/material";
import { COMPONENTS, DARK, TYPOGRAPHY } from "../enums/themeEnums";

const darkTheme = createTheme({
    palette: {
        mode: DARK,
        primary: {
            main: '#615FFF'
        },
        background: {
            default: '#242424',
            paper: '#2B2B2B'
        },
    },
    typography: { ...TYPOGRAPHY },
    components: {
        ...COMPONENTS
    }
});

export default darkTheme;
