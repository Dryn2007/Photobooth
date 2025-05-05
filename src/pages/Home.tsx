import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, QrCode, Image } from 'lucide-react';
import Header from '../components/Layout/Header';
import QRCodeGenerator from '../components/QRCode/QRCodeGenerator';
import FrameSelector from '../components/UI/FrameSelector';
import { usePhotobooth } from '../context/PhotoboothContext';
import QRCodeScanner from '../components/QRCode/QRCodeScanner';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedFrame } = usePhotobooth();

  const handleStart = () => {
    // if (!selectedFrame) {
    //   alert('Please select a frame before continuing');
    //   return;
    // }
    navigate('/scan');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              Welcome to PhotoBooth
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Choose your frame style, capture moments, and create memories!
            </p>
          </div>

          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Select Your Frame</h2>
            <FrameSelector />
          </div> */}

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* <div className="text-center mb-4">
                <h2 className="text-2xl font-semibold mb-2">Get Started</h2>
                <p className="text-gray-600">
                  Generate a QR code and scan it to begin your photo session
                </p>
              </div>
              
              <QRCodeGenerator /> */}

              <div className="mt-6 text-center">
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
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-pink-500 text-white rounded-lg shadow-md p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>

              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Choose Your Frame</h3>
                    <p className="text-blue-100">
                      Select from our collection of beautiful frames
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Scan & Start</h3>
                    <p className="text-blue-100">
                      Scan the QR code to begin your photo session
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Take 4 Photos</h3>
                    <p className="text-blue-100">
                      Capture 4 distinct photos with retake options
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Get Your Photos</h3>
                    <p className="text-blue-100">
                      Your framed photo strip downloads automatically
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} PhotoBooth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;