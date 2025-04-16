import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SourceSelectionPage from './pages/SourceSelectionPage';
import ConfigurationPage from './pages/ConfigurationPage';
import ColumnSelectionPage from './pages/ColumnSelectionPage';
import ImportProgressPage from './pages/ImportProgressPage';
import NotFoundPage from './pages/NotFoundPage';

// Create theme outside of component to prevent recreation on each render
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="source-selection" element={<SourceSelectionPage />} />
              <Route path="configure" element={<ConfigurationPage />} />
              <Route path="columns" element={<ColumnSelectionPage />} />
              <Route path="progress" element={<ImportProgressPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
