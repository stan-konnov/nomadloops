import { ReactElement } from 'react';
import '@src/styles/index.css';

import { Toaster } from 'react-hot-toast';

import { LoopsPlanner } from '@src/components/LoopsPlanner';

const App = (): ReactElement => {
  return (
    <>
      <Toaster position="bottom-center" />
      <LoopsPlanner />
    </>
  );
};

export default App;
