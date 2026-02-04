import { createTheme } from "@mui/material";
import {
  COMPONENTS,
  LIGHT,
  PRIMARY_COLOR,
  TYPOGRAPHY,
} from "../enums/themeEnums";

const lightTheme = createTheme({
  palette: {
    mode: LIGHT,
    primary: {
      main: PRIMARY_COLOR,
    },
    background: {
      default: "#FAFAF9",
      paper: "#FFFF",
    },
  },
  typography: { ...TYPOGRAPHY },
  components: {
    ...COMPONENTS,
  },
});

export default lightTheme;
