import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileConfigForm from '../FileConfigForm';
import { FileConfig } from '../../../services/api';

describe('FileConfigForm', () => {
  const mockOnConfigured = jest.fn();
  const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form elements correctly', () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    expect(screen.getByText('Select File')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /file type/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /delimiter/i })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /file has header row/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /skip rows/i })).toBeInTheDocument();
    expect(screen.getByText('Configure Import')).toBeInTheDocument();
  });

  it('handles file selection correctly', async () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    const fileInput = screen.getByTestId('file-input');
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile]
    });

    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });
  });

  it('validates form submission without file', async () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    const submitButton = screen.getByText('Configure Import');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please select a file');
    });
    expect(mockOnConfigured).not.toHaveBeenCalled();
  });

  it('validates CSV delimiter requirement', async () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    const fileInput = screen.getByTestId('file-input');
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile]
    });
    fireEvent.change(fileInput);

    const delimiterInput = screen.getByRole('textbox', { name: /delimiter/i });
    fireEvent.change(delimiterInput, { target: { value: '' } });

    const submitButton = screen.getByText('Configure Import');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please specify a delimiter for CSV files');
    });
    expect(mockOnConfigured).not.toHaveBeenCalled();
  });

  it('submits form with valid configuration', async () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    const fileInput = screen.getByTestId('file-input');
    Object.defineProperty(fileInput, 'files', {
      value: [mockFile]
    });
    fireEvent.change(fileInput);

    const submitButton = screen.getByText('Configure Import');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnConfigured).toHaveBeenCalledWith(
        expect.objectContaining({
          delimiter: ',',
          hasHeader: true,
          skipRows: 0,
          fileType: 'CSV'
        }),
        mockFile
      );
    });
  });

  it('handles file type change correctly', async () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    const fileTypeSelect = screen.getByRole('combobox', { name: /file type/i });
    fireEvent.change(fileTypeSelect, { target: { value: 'JSON' } });

    expect(screen.queryByRole('textbox', { name: /delimiter/i })).not.toBeInTheDocument();
  });

  it('handles skip rows input correctly', async () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    const skipRowsInput = screen.getByRole('spinbutton', { name: /skip rows/i });
    fireEvent.change(skipRowsInput, { target: { value: '5' } });

    expect(skipRowsInput).toHaveValue(5);
  });

  it('handles header row toggle correctly', async () => {
    render(<FileConfigForm onConfigured={mockOnConfigured} />);
    
    const headerSwitch = screen.getByRole('switch', { name: /file has header row/i });
    fireEvent.click(headerSwitch);

    expect(headerSwitch).not.toBeChecked();
  });
}); 