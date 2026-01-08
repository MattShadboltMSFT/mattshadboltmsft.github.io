import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CSVGenerator from './components/CSVGenerator';

function App() {
  return (
    <Router basename="/sc-builder">
      <Routes>
        <Route path="/" element={<CSVGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
