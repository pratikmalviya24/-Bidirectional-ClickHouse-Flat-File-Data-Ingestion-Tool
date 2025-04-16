import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SourceSelectionPage from '../SourceSelectionPage';

describe('SourceSelectionPage', () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the source selection page correctly', () => {
    render(
      <MemoryRouter>
        <SourceSelectionPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Select Data Source')).toBeInTheDocument();
    expect(screen.getByText('ClickHouse')).toBeInTheDocument();
    expect(screen.getByText('Flat File')).toBeInTheDocument();
  });

  it('navigates to ClickHouse configuration when ClickHouse is selected', () => {
    render(
      <MemoryRouter>
        <SourceSelectionPage />
      </MemoryRouter>
    );

    const clickHouseButton = screen.getByText('ClickHouse');
    fireEvent.click(clickHouseButton);

    expect(mockNavigate).toHaveBeenCalledWith('/configuration', {
      state: { sourceType: 'clickhouse' },
    });
  });

  it('navigates to File configuration when Flat File is selected', () => {
    render(
      <MemoryRouter>
        <SourceSelectionPage />
      </MemoryRouter>
    );

    const fileButton = screen.getByText('Flat File');
    fireEvent.click(fileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/configuration', {
      state: { sourceType: 'file' },
    });
  });
}); 