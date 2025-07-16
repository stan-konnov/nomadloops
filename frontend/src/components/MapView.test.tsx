import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { it, describe, expect, vi, beforeEach } from 'vitest';

import { MapView } from '@src/components/MapView';
import { LoopsGenerationStatus, PlaceCategory } from '@src/utils/enums';

import * as store from '@src/store/loops.planner.store';

const mapMock = {
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
  useMap: (): { [key: string]: unknown } => mapMock,
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

describe('<MapView />', () => {
  beforeEach(() => {
    // clear previous mocks
    vi.resetAllMocks();

    vi.spyOn(store, 'useLoopsPlannerStore').mockReturnValue(mockStore);
  });

  it('renders the map container and tile layer by default', () => {
    render(<MapView />);

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
  });

  it('renders markers, popups, polylines and re-centers when loops exist', () => {
    // prepare a single loop with two places
    const loop = {
      city: 'Test City',
      places: [
        {
          name: 'Nomad Nest',
          category: PlaceCategory.LIVING,
          address: '123 Loop St',
          url: 'https://example.com',
          coordinates: { lat: 10, lng: 20 },
          price: 50,
        },
        {
          name: 'Eatery',
          category: PlaceCategory.WORKING,
          address: '456 Loop Ave',
          url: null,
          coordinates: { lat: 15, lng: 25 },
          price: null,
        },
      ],
    };

    // mock store with coordinates + generatedLoops
    vi.spyOn(store, 'useLoopsPlannerStore').mockReturnValue({
      ...mockStore,
      cityCoordinates: { lat: 10, lng: 20 },
      generatedLoops: [loop],
    });

    render(<MapView />);

    // MapCenterUpdater should attach handlers and flyTo
    expect(mapMock.on).toHaveBeenCalledWith('zoomend', expect.any(Function));

    // First flyTo: on initial mount, zoom unchanged
    expect(mapMock.flyTo).toHaveBeenCalledWith([10, 20], mapMock.getZoom(), { animate: true });

    // Two markers for two places
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);

    // popup content for the first place
    expect(screen.getByText('Nomad Nest')).toBeInTheDocument();
    expect(screen.getByText('Price: 50')).toBeInTheDocument();

    // a polyline is rendered since path length > 1
    expect(screen.getByTestId('polyline')).toBeInTheDocument();
  });
});
