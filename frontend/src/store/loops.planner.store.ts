/* eslint-disable no-unused-vars */

import { LoopsGenerationStatus } from '@src/utils/enums';
import { create } from 'zustand';

type LoopsPlannerState = {
  city: string;
  setCity: (name: string) => void;

  cityCoordinates: { lat: number; lng: number };
  setCityCoordinates: (coordinates: { lat: number; lng: number }) => void;

  loopsGenerationStatus: LoopsGenerationStatus;
  setLoopsGenerationStatus: (status: LoopsGenerationStatus) => void;
};

export const useLoopsPlannerStore = create<LoopsPlannerState>((set) => ({
  city: '',
  setCity: (city): void => set({ city }),

  cityCoordinates: { lat: 0, lng: 0 },
  setCityCoordinates: (coordinates): void => set({ cityCoordinates: coordinates }),

  loopsGenerationStatus: LoopsGenerationStatus.NOT_STARTED,
  setLoopsGenerationStatus: (status): void => set({ loopsGenerationStatus: status }),
}));
