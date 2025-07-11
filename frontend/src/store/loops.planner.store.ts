/* eslint-disable no-unused-vars */

import { create } from 'zustand';

type LoopsPlannerState = {
  city: string;
  setCity: (name: string) => void;
};

export const useLoopsPlannerStore = create<LoopsPlannerState>((set) => ({
  city: '',
  setCity: (city): void => set({ city }),
}));
