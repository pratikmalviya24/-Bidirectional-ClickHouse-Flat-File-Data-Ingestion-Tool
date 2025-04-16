import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ColumnSelectionTable, { Column } from '../ColumnSelectionTable';

describe('ColumnSelectionTable', () => {
  const mockColumns: Column[] = [
    { name: 'id', type: 'Int32', selected: false },
    { name: 'name', type: 'String', selected: false },
    { name: 'age', type: 'Int32', selected: false }
  ];

  const mockOnColumnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with columns correctly', () => {
    render(
      <ColumnSelectionTable
        columns={mockColumns}
        onColumnChange={mockOnColumnChange}
      />
    );

    expect(screen.getByText('Source Column')).toBeInTheDocument();
    expect(screen.getByText('Data Type')).toBeInTheDocument();
    expect(screen.getByText('Target Column Name')).toBeInTheDocument();

    mockColumns.forEach(column => {
      expect(screen.getByText(column.name)).toBeInTheDocument();
      expect(screen.getAllByText(column.type).length).toBeGreaterThan(0);
    });
  });

  it('handles individual column selection', () => {
    render(
      <ColumnSelectionTable
        columns={mockColumns}
        onColumnChange={mockOnColumnChange}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[1]; // First column checkbox
    fireEvent.click(checkbox);

    expect(mockOnColumnChange).toHaveBeenCalledWith([
      { ...mockColumns[0], selected: true },
      ...mockColumns.slice(1)
    ]);
  });

  it('handles select all columns', () => {
    render(
      <ColumnSelectionTable
        columns={mockColumns}
        onColumnChange={mockOnColumnChange}
      />
    );

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);

    expect(mockOnColumnChange).toHaveBeenCalledWith(
      mockColumns.map(column => ({ ...column, selected: true }))
    );
  });

  it('handles target name changes', () => {
    render(
      <ColumnSelectionTable
        columns={mockColumns}
        onColumnChange={mockOnColumnChange}
      />
    );

    const targetNameInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(targetNameInput, { target: { value: 'new_name' } });

    expect(mockOnColumnChange).toHaveBeenCalledWith([
      { ...mockColumns[0], targetName: 'new_name' },
      ...mockColumns.slice(1)
    ]);
  });

  it('disables target name input when column is not selected', () => {
    render(
      <ColumnSelectionTable
        columns={mockColumns}
        onColumnChange={mockOnColumnChange}
      />
    );

    const targetNameInputs = screen.getAllByRole('textbox');
    targetNameInputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('enables target name input when column is selected', () => {
    const selectedColumns = mockColumns.map(col => ({ ...col, selected: true }));
    render(
      <ColumnSelectionTable
        columns={selectedColumns}
        onColumnChange={mockOnColumnChange}
      />
    );

    const targetNameInputs = screen.getAllByRole('textbox');
    targetNameInputs.forEach(input => {
      expect(input).not.toBeDisabled();
    });
  });

  it('shows empty state message when no columns are available', () => {
    render(
      <ColumnSelectionTable
        columns={[]}
        onColumnChange={mockOnColumnChange}
      />
    );

    expect(
      screen.getByText('No columns available. Please configure the data source first.')
    ).toBeInTheDocument();
  });

  it('shows indeterminate state when some columns are selected', () => {
    const mixedColumns = [
      { ...mockColumns[0], selected: true },
      ...mockColumns.slice(1)
    ];

    render(
      <ColumnSelectionTable
        columns={mixedColumns}
        onColumnChange={mockOnColumnChange}
      />
    );

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    expect(selectAllCheckbox).toHaveAttribute('data-indeterminate', 'true');
  });
}); 