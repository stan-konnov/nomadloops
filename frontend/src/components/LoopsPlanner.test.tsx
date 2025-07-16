vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: vi.fn(),
  },
}));
import toast from 'react-hot-toast';

import { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('geocodes the city and starts loops generation when city is valid', async () => {
    render(<LoopsPlanner />);

    await waitFor(() => {
      expect(geocode.geocodeCity).toHaveBeenCalledWith(mockStore.city);
    });

    expect(mockStore.setCityCoordinates).toHaveBeenCalledWith({ lat: 1, lng: 2 });

    expect(api.createLoopsRequest).toHaveBeenCalledWith({
      city: mockStore.city,
      monthlyBudget: mockStore.monthlyBudget,
      selectedCategories: Array.from(mockStore.selectedCategories),
      numberOfLoopsToGenerate: mockStore.numberOfLoopsToGenerate,
    });

    expect(mockStore.setLoopsGenerationStatus).toHaveBeenCalledWith(
      LoopsGenerationStatus.GENERATING,
    );
  });

  it('sets loops generation status to ERROR and renders toast if city cannot be geocoded', async () => {
    const propagatedErrorMessage = 'City not found';

    vi.spyOn(geocode, 'geocodeCity').mockRejectedValueOnce(new Error(propagatedErrorMessage));

    render(<LoopsPlanner />);

    await waitFor(() => {
      expect(mockStore.setLoopsGenerationStatus).toHaveBeenCalledWith(LoopsGenerationStatus.ERROR);
    });

    expect(toast.error).toHaveBeenCalledWith(propagatedErrorMessage);
  });
});
