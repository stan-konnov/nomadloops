import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from '@src/App';

describe('<App />', () => {
  it('renders the LoopsPlanner component', () => {
    render(<App />);
    expect(screen.getByTestId('loops-planner')).toBeInTheDocument();
  });
});
