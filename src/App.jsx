import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './pages/HomePage';
import MatchEntryPage from './pages/MatchEntryPage';
import MatchHistoryPage from './pages/MatchHistoryPage';
import MatchDetailPage from './pages/MatchDetailPage';
import DashboardPage from './pages/DashboardPage';
import PasswordProtection from './pages/PasswordProtection';

function AppRoutes() {
  const { isAuthenticated, authenticate } = useApp();
  const [error, setError] = useState('');

  const handleAuthentication = (password) => {
    const success = authenticate(password);
    if (!success) {
      setError('Incorrect password. Please try again.');
    }
    return success;
  };

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthentication} error={error} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/new" element={<MatchEntryPage />} />
        <Route path="/match/:id" element={<MatchEntryPage />} />
        <Route path="/match/:id/view" element={<MatchDetailPage />} />
        <Route path="/history" element={<MatchHistoryPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
