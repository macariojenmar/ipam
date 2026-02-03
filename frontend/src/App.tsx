import { Button, Card } from '@mui/material';
import { MuiThemeProvider } from './theme/MuiThemeProvider';

const App = () => {
  return (
    <MuiThemeProvider>
      <Card variant='outlined'>
        <Button variant='contained'>Sample Button</Button>
      </Card>
    </MuiThemeProvider>
  );
}

export default App;
