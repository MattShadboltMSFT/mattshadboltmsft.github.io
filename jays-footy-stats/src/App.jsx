import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import MatchEntryPage from './pages/MatchEntryPage';
import MatchHistoryPage from './pages/MatchHistoryPage';
import MatchDetailPage from './pages/MatchDetailPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}

export default App;
