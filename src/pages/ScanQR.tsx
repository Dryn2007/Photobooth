import React from 'react';
import Header from '../components/Layout/Header';
import QRCodeScanner from '../components/QRCode/QRCodeScanner';

const ScanQR: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Scan QR Code</h1>
            <p className="text-gray-600">
              Scan your QR code to start your photo session
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <QRCodeScanner />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanQR;