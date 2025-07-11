/* eslint-disable no-unused-vars */

import { create } from 'zustand';

type LoopsPlannerState = {
  city: string;
  coordinates: { lat: number; lng: number } | null;

  setCity: (name: string) => void;
};

export const useLoopsPlannerStore = create<LoopsPlannerState>((set) => ({
  city: '',
  coordinates: null,

  setCity: (city): void => set({ city }),
}));
