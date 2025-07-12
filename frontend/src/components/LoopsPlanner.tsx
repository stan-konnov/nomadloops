import { ReactElement, useEffect } from 'react';

import { MapView } from '@src/components/MapView';
import { LoopsForm } from '@src/components/LoopsForm';

import { LoopsGenerationStatus } from '@src/utils/enums';
import { createLoopsRequest, getLoopsStatusRequest } from '@src/api/loops.api';
import { useLoopsPlannerStore } from '@src/store/loops.planner.store';
import { geocodeCity } from '@src/utils/geocode';

/**
 * TODO: Geocode city input to get coordinates and center map.
 * TODO: Add error handling for API requests.
 * TODO: Add loading state while waiting for API response.
 * TODO: Render loops on the map after generation.
 */
export const LoopsPlanner = (): ReactElement => {
  const {
    city,
    monthlyBudget,
    selectedCategories,
    numberOfLoopsToGenerate,
    setCityCoordinates,
    loopsGenerationStatus,
    setLoopsGenerationStatus,
  } = useLoopsPlannerStore();

  useEffect(() => {
    if (city.trim() === '') {
      return;
    }

    (async (): Promise<void> => {
      try {
        // Geocode the city
        // to get coordinates and center the map
        const cityCoordinates = await geocodeCity(city);
        setCityCoordinates(cityCoordinates);

        // If the city is valid,
        // kick off the loops generation
        await createLoopsRequest({
          city,
          monthlyBudget,
          selectedCategories: Array.from(selectedCategories),
          numberOfLoopsToGenerate,
        });
        setLoopsGenerationStatus(LoopsGenerationStatus.GENERATING);
      } catch (error) {
        // TODO: Toast me
        console.error('Error creating loops:', error);
        setLoopsGenerationStatus(LoopsGenerationStatus.ERROR);
      }
    })();
  }, [city, monthlyBudget, selectedCategories, numberOfLoopsToGenerate]);

  useEffect(() => {
    if (loopsGenerationStatus !== LoopsGenerationStatus.GENERATING) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const loopsStatusResponse = await getLoopsStatusRequest();

        if (loopsStatusResponse.data) {
          setLoopsGenerationStatus(loopsStatusResponse.data);

          // Clear the interval if the status is ready or error
          if (
            [LoopsGenerationStatus.READY, LoopsGenerationStatus.ERROR].includes(
              loopsStatusResponse.data,
            )
          ) {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Error polling job status', error);
        setLoopsGenerationStatus(LoopsGenerationStatus.ERROR);
        clearInterval(interval);
      }
    }, 1000);

    // Clear the interval on component unmount
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
