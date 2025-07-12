/* eslint-disable no-unused-vars */

import { LoopsGenerationStatus, PlaceCategory } from '@src/utils/enums';
import { create } from 'zustand';

type LoopsPlannerState = {
  city: string;
  setCity: (name: string) => void;

  cityCoordinates: { lat: number; lng: number };
  setCityCoordinates: (coordinates: { lat: number; lng: number }) => void;

  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;

  selectedCategories: Set<PlaceCategory>;
  setSelectedCategories: (categories: Set<PlaceCategory>) => void;

  numberOfLoopsToGenerate: number;
  setNumberOfLoopsToGenerate: (number: number) => void;

  loopsGenerationStatus: LoopsGenerationStatus;
  setLoopsGenerationStatus: (status: LoopsGenerationStatus) => void;
};

export const useLoopsPlannerStore = create<LoopsPlannerState>((set) => ({
  city: '',
  setCity: (city): void => set({ city }),

  cityCoordinates: { lat: 0, lng: 0 },
  setCityCoordinates: (coordinates): void => set({ cityCoordinates: coordinates }),

  monthlyBudget: 1000,
  setMonthlyBudget: (budget): void => set({ monthlyBudget: budget }),

  selectedCategories: new Set<PlaceCategory>(),
  setSelectedCategories: (categories): void => set({ selectedCategories: categories }),

  numberOfLoopsToGenerate: 1,
  setNumberOfLoopsToGenerate: (number): void => set({ numberOfLoopsToGenerate: number }),

  loopsGenerationStatus: LoopsGenerationStatus.NOT_STARTED,
  setLoopsGenerationStatus: (status): void => set({ loopsGenerationStatus: status }),
}));
