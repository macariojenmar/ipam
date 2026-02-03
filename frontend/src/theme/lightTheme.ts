import { createTheme } from "@mui/material";
import { COMPONENTS, LIGHT, TYPOGRAPHY } from "../enums/themeEnums";

const lightTheme = createTheme({
    palette: {
        mode: LIGHT,
        primary: {
            main: '#615FFF',
        },
        background: {
            default: '#FAFAF9',
            paper: '#FFFF'
        },
    },
    typography: { ...TYPOGRAPHY },
    components: {
        ...COMPONENTS,
    },
});

export default lightTheme;
