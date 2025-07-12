import { ReactElement, useEffect } from 'react';

import { MapView } from '@src/components/MapView';
import { LoopsForm } from '@src/components/LoopsForm';

import { LoopsGenerationStatus } from '@src/utils/enums';
import { getLoopsStatusRequest } from '@src/api/loops.api';
import { useLoopsPlannerStore } from '@src/store/loops.planner.store';

export const LoopsPlanner = (): ReactElement => {
  const { loopsGenerationStatus, setLoopsGenerationStatus } = useLoopsPlannerStore();

  useEffect(() => {
    const interval = setInterval(async () => {
      const loopsStatusResponse = await getLoopsStatusRequest();

      if (loopsStatusResponse.data?.status) {
        setLoopsGenerationStatus(loopsStatusResponse.data.status as LoopsGenerationStatus);
      }
    }, 1000);

    return (): void => clearInterval(interval);
  }, [loopsGenerationStatus]);

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
