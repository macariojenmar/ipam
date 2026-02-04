import { MuiThemeProvider } from "./theme/MuiThemeProvider";
import { Navbar } from "./components/Navbar";

const App = () => {
  return (
    <MuiThemeProvider>
      <Navbar />
    </MuiThemeProvider>
  );
};

export default App;
