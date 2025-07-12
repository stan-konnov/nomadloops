/* eslint-disable no-unused-vars */

import { LoopsGenerationStatus } from '@src/utils/enums';
import { create } from 'zustand';

type LoopsPlannerState = {
  city: string;
  setCity: (name: string) => void;

  loopsGenerationStatus: LoopsGenerationStatus;
  setLoopsGenerationStatus: (status: LoopsGenerationStatus) => void;
};

export const useLoopsPlannerStore = create<LoopsPlannerState>((set) => ({
  city: '',
  setCity: (city): void => set({ city }),

  loopsGenerationStatus: LoopsGenerationStatus.NOT_STARTED,
  setLoopsGenerationStatus: (status): void => set({ loopsGenerationStatus: status }),
}));
