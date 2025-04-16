import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ImportProgressPage from '../ImportProgressPage';

describe('ImportProgressPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the import progress page correctly', () => {
    render(
      <MemoryRouter>
        <ImportProgressPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Import Progress')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays initial progress as 0%', () => {
    render(
      <MemoryRouter>
        <ImportProgressPage />
      </MemoryRouter>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('updates progress when import status changes', async () => {
    render(
      <MemoryRouter>
        <ImportProgressPage />
      </MemoryRouter>
    );

    // Mock progress update
    const progressBar = screen.getByRole('progressbar');
    
    await waitFor(() => {
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });
  });

  it('displays error message when import fails', async () => {
    render(
      <MemoryRouter>
        <ImportProgressPage />
      </MemoryRouter>
    );

    // Mock error state
    await waitFor(() => {
      expect(screen.getByText('Import failed')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('displays success message when import completes', async () => {
    render(
      <MemoryRouter>
        <ImportProgressPage />
      </MemoryRouter>
    );

    // Mock success state
    await waitFor(() => {
      expect(screen.getByText('Import completed successfully')).toBeInTheDocument();
      expect(screen.getByText('View Results')).toBeInTheDocument();
    });
  });
}); 