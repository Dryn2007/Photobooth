import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotoboothProvider } from './context/PhotoboothContext';
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';
import PhotoSession from './pages/PhotoSession';
import Completion from './pages/Completion';
import NotFound from './pages/NotFound';
import UnlimitedSplash from './pages/UnlimitedSplash';
import PanitiaSplash from './pages/PanitiaSplash';
import SiswaSplash from './pages/SiswaSplash';
import StafSplash from './pages/StafSplash';

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
            <Route path="/splash/unlimited" element={<UnlimitedSplash />} />
            <Route path="/splash/siswa" element={<SiswaSplash />} />
            <Route path="/splash/panitia" element={<PanitiaSplash />} />
            <Route path="/splash/staf" element={<StafSplash />} />
          </Routes>
        </div>
      </Router>
    </PhotoboothProvider>
  );
}

export default App;