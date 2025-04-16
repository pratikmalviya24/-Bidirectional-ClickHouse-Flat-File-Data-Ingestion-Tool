import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ConfigurationPage from '../ConfigurationPage';

describe('ConfigurationPage', () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { sourceType: 'clickhouse' },
    }),
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ClickHouse configuration form when source type is clickhouse', () => {
    render(
      <MemoryRouter>
        <ConfigurationPage />
      </MemoryRouter>
    );

    expect(screen.getByText('ClickHouse Configuration')).toBeInTheDocument();
    expect(screen.getByLabelText('Host')).toBeInTheDocument();
    expect(screen.getByLabelText('Port')).toBeInTheDocument();
    expect(screen.getByLabelText('Database')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('validates required fields in ClickHouse form', async () => {
    render(
      <MemoryRouter>
        <ConfigurationPage />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Connect');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Host is required')).toBeInTheDocument();
      expect(screen.getByText('Port is required')).toBeInTheDocument();
      expect(screen.getByText('Database is required')).toBeInTheDocument();
    });
  });

  it('validates port number format', async () => {
    render(
      <MemoryRouter>
        <ConfigurationPage />
      </MemoryRouter>
    );

    const portInput = screen.getByLabelText('Port');
    fireEvent.change(portInput, { target: { value: 'invalid' } });

    const submitButton = screen.getByText('Connect');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Port must be a number')).toBeInTheDocument();
    });
  });

  it('navigates to column selection on successful connection', async () => {
    render(
      <MemoryRouter>
        <ConfigurationPage />
      </MemoryRouter>
    );

    const hostInput = screen.getByLabelText('Host');
    const portInput = screen.getByLabelText('Port');
    const databaseInput = screen.getByLabelText('Database');
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(hostInput, { target: { value: 'localhost' } });
    fireEvent.change(portInput, { target: { value: '9000' } });
    fireEvent.change(databaseInput, { target: { value: 'test' } });
    fireEvent.change(usernameInput, { target: { value: 'user' } });
    fireEvent.change(passwordInput, { target: { value: 'pass' } });

    const submitButton = screen.getByText('Connect');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/columns');
    });
  });
}); 