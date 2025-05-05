import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotoboothProvider } from './context/PhotoboothContext';
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';
import PhotoSession from './pages/PhotoSession';
import Completion from './pages/Completion';
import NotFound from './pages/NotFound';

function App() {
  return (
    <PhotoboothProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<ScanQR />} />
            <Route path="/session" element={<PhotoSession />} />
            <Route path="/complete" element={<Completion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </PhotoboothProvider>
  );
}

export default App;