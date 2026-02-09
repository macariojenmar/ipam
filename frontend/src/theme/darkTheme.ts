import { createTheme } from "@mui/material";
import {
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
  },
  typography: { ...TYPOGRAPHY },
  components: {
    ...COMPONENTS,
  },
});

export default darkTheme;
