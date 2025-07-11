import { ReactElement } from 'react';
import '@src/styles/index.css';

import { LoopsPlanner } from '@src/components/LoopsPlanner';
import { AppContextProvider } from '@src/context/AppContext';

const App = (): ReactElement => {
  return (
    <AppContextProvider>
      <LoopsPlanner />
    </AppContextProvider>
  );
};

export default App;
