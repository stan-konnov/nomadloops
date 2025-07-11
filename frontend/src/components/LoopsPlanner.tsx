import { ReactElement } from 'react';
import { LoopsForm } from '@src/components/LoopsForm';
import { MapView } from '@src/components/MapView';

export const LoopsPlanner = (): ReactElement => {
  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-50 p-4 overflow-y-auto flex justify-center items-center">
        <LoopsForm />
      </div>

      <div className="w-2/3">
        <MapView />
      </div>
    </div>
  );
};
