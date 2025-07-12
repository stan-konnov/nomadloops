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
  const { city, setCityCoordinates, loopsGenerationStatus, setLoopsGenerationStatus } =
    useLoopsPlannerStore();

  useEffect(() => {
    if (city.trim() === '') {
      return;
    }

    // First, geocode the city
    // to get coordinates and center the map
    const fetchAndSetCoordinates = async (): Promise<void> => {
      try {
        const cityCoordinates = await geocodeCity(city);
        if (cityCoordinates) {
          setCityCoordinates(cityCoordinates);
        }
      } catch (error) {
        // TODO: Toast me
        console.error('Error geocoding city:', error);
        setLoopsGenerationStatus(LoopsGenerationStatus.ERROR);

        return;
      }
    };
    fetchAndSetCoordinates();

    // Second, if all good,
    // kick of loops generation process
    const startLoopsGeneration = async (): Promise<void> => {
      try {
        const createLoopsResponse = await createLoopsRequest({
          city,
          monthlyBudget: 1000,
          selectedCategories: [],
          numberOfLoopsToGenerate: 1,
        });

        if (createLoopsResponse.success) {
          setLoopsGenerationStatus(LoopsGenerationStatus.GENERATING);
        }
      } catch (error) {
        // TODO: Toast me
        console.error('Error creating loops:', error);
        setLoopsGenerationStatus(LoopsGenerationStatus.ERROR);

        return;
      }
    };
    startLoopsGeneration();
  }, [city]);

  useEffect(() => {
    if (loopsGenerationStatus === LoopsGenerationStatus.GENERATING) {
      const interval = setInterval(async () => {
        const loopsStatusResponse = await getLoopsStatusRequest();

        if (loopsStatusResponse.data) {
          setLoopsGenerationStatus(loopsStatusResponse.data);
        }
      }, 1000);

      if (
        [LoopsGenerationStatus.READY, LoopsGenerationStatus.ERROR].includes(loopsGenerationStatus)
      ) {
        return (): void => clearInterval(interval);
      }
    }
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
