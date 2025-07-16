import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LoopsPlanner } from '@src/components/LoopsPlanner';
import * as store from '@src/store/loops.planner.store';
import { LoopsGenerationStatus, PlaceCategory } from '@src/utils/enums';

vi.mock('./MapView', () => ({
  MapView: (): ReactElement => <div data-testid="map-view">Mock MapView</div>,
}));

vi.mock('./LoopsForm', () => ({
  LoopsForm: (): ReactElement => <div data-testid="loops-form">Mock LoopsForm</div>,
}));

describe('<LoopsPlanner />', () => {
  beforeEach(() => {
    vi.spyOn(store, 'useLoopsPlannerStore').mockReturnValue({
      city: 'Test City',
      setCity: vi.fn(),

      monthlyBudget: 1000,
      setMonthlyBudget: vi.fn(),

      selectedCategories: new Set<PlaceCategory>(),
      setSelectedCategories: vi.fn(),

      numberOfLoopsToGenerate: 1,
      setCityCoordinates: vi.fn(),

      loopsGenerationStatus: LoopsGenerationStatus.NOT_STARTED,
      setLoopsGenerationStatus: vi.fn(),

      generatedLoops: [],
      setGeneratedLoops: vi.fn(),
    });
  });

  it('renders MapView and LoopsForm', () => {
    render(<LoopsPlanner />);

    expect(screen.getByTestId('map-view')).toBeInTheDocument();
    expect(screen.getByTestId('loops-form')).toBeInTheDocument();
  });
});
