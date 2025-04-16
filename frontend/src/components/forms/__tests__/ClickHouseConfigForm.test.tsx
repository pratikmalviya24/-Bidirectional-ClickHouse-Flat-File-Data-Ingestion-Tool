import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClickHouseConfigForm from '../ClickHouseConfigForm';
import { sourceApi } from '../../../services/api';

// Mock the API service
jest.mock('../../../services/api', () => ({
  sourceApi: {
    testClickHouseConnection: jest.fn()
  }
}));

describe('ClickHouseConfigForm', () => {
  const mockOnConfigured = jest.fn();
  const mockConfig = {
    host: 'localhost',
    port: 8123,
    database: 'testdb',
    username: 'testuser',
    password: 'testpass'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form elements correctly', () => {
    render(<ClickHouseConfigForm onConfigured={mockOnConfigured} />);
    
    expect(screen.getByLabelText('Host')).toBeInTheDocument();
    expect(screen.getByLabelText('Port')).toBeInTheDocument();
    expect(screen.getByLabelText('Database')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Test Connection')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ClickHouseConfigForm onConfigured={mockOnConfigured} />);
    
    const testButton = screen.getByText('Test Connection');
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    });
    expect(mockOnConfigured).not.toHaveBeenCalled();
  });

  it('handles input changes correctly', async () => {
    render(<ClickHouseConfigForm onConfigured={mockOnConfigured} />);
    
    const hostInput = screen.getByLabelText('Host');
    const portInput = screen.getByLabelText('Port');
    const databaseInput = screen.getByLabelText('Database');
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(hostInput, { target: { value: mockConfig.host } });
    fireEvent.change(portInput, { target: { value: mockConfig.port } });
    fireEvent.change(databaseInput, { target: { value: mockConfig.database } });
    fireEvent.change(usernameInput, { target: { value: mockConfig.username } });
    fireEvent.change(passwordInput, { target: { value: mockConfig.password } });

    expect(hostInput).toHaveValue(mockConfig.host);
    expect(portInput).toHaveValue(mockConfig.port);
    expect(databaseInput).toHaveValue(mockConfig.database);
    expect(usernameInput).toHaveValue(mockConfig.username);
    expect(passwordInput).toHaveValue(mockConfig.password);
  });

  it('handles successful connection test', async () => {
    (sourceApi.testClickHouseConnection as jest.Mock).mockResolvedValueOnce(undefined);
    
    render(<ClickHouseConfigForm onConfigured={mockOnConfigured} />);
    
    // Fill in the form
    const hostInput = screen.getByLabelText('Host');
    const portInput = screen.getByLabelText('Port');
    const databaseInput = screen.getByLabelText('Database');
    const usernameInput = screen.getByLabelText('Username');

    fireEvent.change(hostInput, { target: { value: mockConfig.host } });
    fireEvent.change(portInput, { target: { value: mockConfig.port } });
    fireEvent.change(databaseInput, { target: { value: mockConfig.database } });
    fireEvent.change(usernameInput, { target: { value: mockConfig.username } });

    const testButton = screen.getByText('Test Connection');
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(sourceApi.testClickHouseConnection).toHaveBeenCalledWith(
        expect.objectContaining({
          host: mockConfig.host,
          port: mockConfig.port,
          database: mockConfig.database,
          username: mockConfig.username
        })
      );
    });

    expect(mockOnConfigured).toHaveBeenCalledWith(
      expect.objectContaining({
        host: mockConfig.host,
        port: mockConfig.port,
        database: mockConfig.database,
        username: mockConfig.username
      })
    );
  });

  it('handles connection test failure', async () => {
    const errorMessage = 'Connection failed';
    (sourceApi.testClickHouseConnection as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    render(<ClickHouseConfigForm onConfigured={mockOnConfigured} />);
    
    // Fill in the form
    const hostInput = screen.getByLabelText('Host');
    const portInput = screen.getByLabelText('Port');
    const databaseInput = screen.getByLabelText('Database');
    const usernameInput = screen.getByLabelText('Username');

    fireEvent.change(hostInput, { target: { value: mockConfig.host } });
    fireEvent.change(portInput, { target: { value: mockConfig.port } });
    fireEvent.change(databaseInput, { target: { value: mockConfig.database } });
    fireEvent.change(usernameInput, { target: { value: mockConfig.username } });

    const testButton = screen.getByText('Test Connection');
    fireEvent.click(testButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(mockOnConfigured).not.toHaveBeenCalled();
  });

  it('shows loading state during connection test', async () => {
    (sourceApi.testClickHouseConnection as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<ClickHouseConfigForm onConfigured={mockOnConfigured} />);
    
    // Fill in the form
    const hostInput = screen.getByLabelText('Host');
    const portInput = screen.getByLabelText('Port');
    const databaseInput = screen.getByLabelText('Database');
    const usernameInput = screen.getByLabelText('Username');

    fireEvent.change(hostInput, { target: { value: mockConfig.host } });
    fireEvent.change(portInput, { target: { value: mockConfig.port } });
    fireEvent.change(databaseInput, { target: { value: mockConfig.database } });
    fireEvent.change(usernameInput, { target: { value: mockConfig.username } });

    const testButton = screen.getByText('Test Connection');
    fireEvent.click(testButton);

    expect(screen.getByText('Testing Connection...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
}); 