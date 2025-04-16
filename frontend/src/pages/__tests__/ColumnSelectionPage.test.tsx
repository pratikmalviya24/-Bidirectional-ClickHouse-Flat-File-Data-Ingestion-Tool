import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ColumnSelectionPage from '../ColumnSelectionPage';

describe('ColumnSelectionPage', () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the column selection page correctly', () => {
    render(
      <MemoryRouter>
        <ColumnSelectionPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Column Selection')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('displays column preview when preview button is clicked', async () => {
    render(
      <MemoryRouter>
        <ColumnSelectionPage />
      </MemoryRouter>
    );

    const previewButton = screen.getByText('Preview');
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(screen.getByText('Preview Data')).toBeInTheDocument();
    });
  });

  it('validates that at least one column is selected', async () => {
    render(
      <MemoryRouter>
        <ColumnSelectionPage />
      </MemoryRouter>
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Please select at least one column')).toBeInTheDocument();
    });
  });

  it('navigates to import progress page when columns are selected and next is clicked', async () => {
    render(
      <MemoryRouter>
        <ColumnSelectionPage />
      </MemoryRouter>
    );

    // Mock column selection
    const columnCheckbox = screen.getByLabelText('Select All');
    fireEvent.click(columnCheckbox);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/import-progress');
    });
  });

  it('handles column selection changes correctly', async () => {
    render(
      <MemoryRouter>
        <ColumnSelectionPage />
      </MemoryRouter>
    );

    const columnCheckbox = screen.getByLabelText('Select All');
    fireEvent.click(columnCheckbox);

    await waitFor(() => {
      expect(columnCheckbox).toBeChecked();
    });

    fireEvent.click(columnCheckbox);

    await waitFor(() => {
      expect(columnCheckbox).not.toBeChecked();
    });
  });
}); 