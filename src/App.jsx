import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MatchEntryPage from './pages/MatchEntryPage';
import MatchHistoryPage from './pages/MatchHistoryPage';
import MatchDetailPage from './pages/MatchDetailPage';
import PasswordProtection from './pages/PasswordProtection';

function AppRoutes() {
  const { isAuthenticated, authenticate } = useApp();

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={authenticate} />;
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
