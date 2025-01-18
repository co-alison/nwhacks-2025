import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home/Home';
import Learn from './learn/Learn';
import Practice from './pages/Practice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </Router>
  );
}

export default App;
