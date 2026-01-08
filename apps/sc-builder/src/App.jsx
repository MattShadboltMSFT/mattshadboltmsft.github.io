import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>SC Builder</h1>
      <p>Welcome to SC Builder!</p>
      <p>
        <a href="/">← Back to apps</a>
      </p>
    </div>
  );
}

function App() {
  return (
    <Router basename="/sc-builder"> {/* UPDATE THIS to match your app name */}
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
