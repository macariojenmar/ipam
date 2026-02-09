import { createTheme } from "@mui/material";
import {
  COLOR_PALETTE,
  COMPONENTS,
  DARK,
  PRIMARY_COLOR,
  TYPOGRAPHY,
} from "../enums/themeEnums";

const darkTheme = createTheme({
  palette: {
    mode: DARK,
    primary: {
      main: PRIMARY_COLOR,
    },
    background: {
      default: "#242424",
      paper: "#292929ff",
    },
    ...COLOR_PALETTE,
  },
  typography: { ...TYPOGRAPHY },
  components: {
    ...COMPONENTS,
  },
});

export default darkTheme;
