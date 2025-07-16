import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LoopsPlanner } from '@src/components/LoopsPlanner';
import { LoopsGenerationStatus, PlaceCategory } from '@src/utils/enums';

import * as store from '@src/store/loops.planner.store';
import * as api from '@src/api/loops.api';
import * as geocode from '@src/utils/geocode';

vi.mock('./MapView', () => ({
  MapView: (): ReactElement => <div data-testid="map-view">Mock MapView</div>,
}));

vi.mock('./LoopsForm', () => ({
  LoopsForm: (): ReactElement => <div data-testid="loops-form">Mock LoopsForm</div>,
}));

const mockStore = {
  city: 'Test City',
  setCity: vi.fn(),

  cityCoordinates: { lat: 0, lng: 0 },
  setCityCoordinates: vi.fn(),

  monthlyBudget: 1000,
  setMonthlyBudget: vi.fn(),

  selectedCategories: new Set<PlaceCategory>(),
  setSelectedCategories: vi.fn(),

  numberOfLoopsToGenerate: 1,
  setNumberOfLoopsToGenerate: vi.fn(),

  loopsGenerationStatus: LoopsGenerationStatus.NOT_STARTED,
  setLoopsGenerationStatus: vi.fn(),

  generatedLoops: [],
  setGeneratedLoops: vi.fn(),
};

describe('<LoopsPlanner />', () => {
  beforeEach(() => {
    vi.spyOn(store, 'useLoopsPlannerStore').mockReturnValue(mockStore);
  });

  it('renders MapView and LoopsForm', () => {
    render(<LoopsPlanner />);

    expect(screen.getByTestId('map-view')).toBeInTheDocument();
    expect(screen.getByTestId('loops-form')).toBeInTheDocument();
  });
});

describe('<LoopsPlanner /> side-effects', () => {
  // const mockSetCityCoordinates = vi.fn();
  // const mockSetLoopsGenerationStatus = vi.fn();
  // const mockSetGeneratedLoops = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(store, 'useLoopsPlannerStore').mockReturnValue(mockStore);

    vi.spyOn(geocode, 'geocodeCity').mockResolvedValue({ lat: 1, lng: 2 });

    vi.spyOn(api, 'createLoopsRequest').mockResolvedValue({
      success: true,
      message: 'Loops generation started successfully.',
    });

    vi.spyOn(api, 'getLoopsStatusRequest').mockResolvedValue({
      success: true,
      message: 'Loops generation status retrieved successfully.',
      data: LoopsGenerationStatus.GENERATING,
    });

    vi.spyOn(api, 'getLoopsRequest').mockResolvedValue({
      success: true,
      message: 'Generated loops retrieved successfully.',
      data: [
        {
          city: 'Kuala Lumpur',
          places: [
            {
              name: 'Nomad Nest Hostel',
              category: PlaceCategory.LIVING,
              address: '123 Sukhumvit Soi 11, Bangkok',
              url: 'https://maps.google.com/?q=Nomad+Nest+Hostel',
              coordinates: {
                lat: 13.743,
                lng: 100.535,
              },
              price: 350,
            },
          ],
        },
      ],
    });
  });
});
