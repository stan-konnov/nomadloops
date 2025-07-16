import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { it, describe, expect, vi, beforeEach } from 'vitest';

import { Loop } from '@src/types/interfaces/loop';
import { MapView } from '@src/components/MapView';
import { LoopsGenerationStatus, PlaceCategory } from '@src/utils/enums';

import * as store from '@src/store/loops.planner.store';

const mockMap = {
  on: vi.fn(),
  off: vi.fn(),
  flyTo: vi.fn(),
  getZoom: (): number => 8,
};

vi.mock('react-leaflet', () => ({
  __esModule: true,
  MapContainer: ({ children }: { children: ReactElement }): ReactElement => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: (): ReactElement => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: ReactElement }): ReactElement => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children: ReactElement }): ReactElement => (
    <div data-testid="popup">{children}</div>
  ),
  Polyline: (): ReactElement => <div data-testid="polyline" />,
  useMap: (): { [key: string]: unknown } => mockMap,
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

const mockLoop: Loop = {
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
    {
      name: 'Nomad Coworking Space',
      category: PlaceCategory.WORKING,
      address: '456 Sukhumvit Soi 12, Bangkok',
      url: 'https://maps.google.com/?q=Cafe+Nomad',
      coordinates: {
        lat: 13.744,
        lng: 100.536,
      },
      price: 10,
    },
  ],
};

describe('<MapView />', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(store, 'useLoopsPlannerStore').mockReturnValue(mockStore);
  });

  it('renders the map container and tile layer by default', () => {
    render(<MapView />);

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('renders markers, popups, polylines and re-centers when loops exist', () => {
    vi.spyOn(store, 'useLoopsPlannerStore').mockReturnValue({
      ...mockStore,
      cityCoordinates: { lat: 10, lng: 20 },
      generatedLoops: [mockLoop],
    });

    render(<MapView />);

    // First flyTo: on initial mount, zoom unchanged
    expect(mockMap.flyTo).toHaveBeenCalledWith([10, 20], mockMap.getZoom(), { animate: true });

    // Two markers are rendered
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);

    // Popup contents are rendered
    expect(screen.getByText(mockLoop.places[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockLoop.places[1].name)).toBeInTheDocument();

    // A polyline is rendered since path length > 1
    expect(screen.getByTestId('polyline')).toBeInTheDocument();
  });
});
