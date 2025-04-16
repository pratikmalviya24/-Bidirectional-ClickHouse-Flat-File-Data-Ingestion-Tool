import React from 'react';
import { render, screen } from '@testing-library/react';
import ColumnPreview from '../ColumnPreview';
import { Column } from '../../../types/columns';

describe('ColumnPreview', () => {
  const mockColumns: Column[] = [
    { name: 'id', type: 'Int32', selected: true },
    { name: 'name', type: 'String', selected: true },
    { name: 'age', type: 'Int32', selected: false }
  ];

  const mockPreviewData = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 }
  ];

  it('renders preview table with selected columns', () => {
    render(
      <ColumnPreview
        columns={mockColumns}
        previewData={mockPreviewData}
        selectedOnly={true}
      />
    );

    expect(screen.getByText('Data Preview')).toBeInTheDocument();
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.queryByText('age')).not.toBeInTheDocument();

    // Check if data is rendered correctly
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('renders all columns when selectedOnly is false', () => {
    render(
      <ColumnPreview
        columns={mockColumns}
        previewData={mockPreviewData}
        selectedOnly={false}
      />
    );

    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('age')).toBeInTheDocument();
  });

  it('shows empty state when no columns are selected', () => {
    const unselectedColumns = mockColumns.map(col => ({ ...col, selected: false }));
    render(
      <ColumnPreview
        columns={unselectedColumns}
        previewData={mockPreviewData}
        selectedOnly={true}
      />
    );

    expect(
      screen.getByText('Please select columns to preview data')
    ).toBeInTheDocument();
  });

  it('shows empty state when no columns are available', () => {
    render(
      <ColumnPreview
        columns={[]}
        previewData={mockPreviewData}
        selectedOnly={false}
      />
    );

    expect(
      screen.getByText('No columns available for preview')
    ).toBeInTheDocument();
  });

  it('shows empty state when no preview data is available', () => {
    render(
      <ColumnPreview
        columns={mockColumns}
        previewData={[]}
        selectedOnly={true}
      />
    );

    expect(
      screen.getByText('No preview data available')
    ).toBeInTheDocument();
  });

  it('displays column types', () => {
    render(
      <ColumnPreview
        columns={mockColumns}
        previewData={mockPreviewData}
        selectedOnly={true}
      />
    );

    expect(screen.getByText('Int32')).toBeInTheDocument();
    expect(screen.getByText('String')).toBeInTheDocument();
  });

  it('displays target column names when provided', () => {
    const columnsWithTargetNames = mockColumns.map(col => ({
      ...col,
      targetName: `target_${col.name}`
    }));

    render(
      <ColumnPreview
        columns={columnsWithTargetNames}
        previewData={mockPreviewData}
        selectedOnly={true}
      />
    );

    expect(screen.getByText('target_id')).toBeInTheDocument();
    expect(screen.getByText('target_name')).toBeInTheDocument();
  });

  it('handles null or undefined values in preview data', () => {
    const dataWithNulls = [
      { id: 1, name: null, age: 30 },
      { id: 2, name: undefined, age: 25 }
    ];

    render(
      <ColumnPreview
        columns={mockColumns}
        previewData={dataWithNulls}
        selectedOnly={true}
      />
    );

    // Check that empty cells are rendered for null/undefined values
    const nameCells = screen.getAllByRole('cell', { name: '' });
    expect(nameCells.length).toBe(2);
  });
}); 