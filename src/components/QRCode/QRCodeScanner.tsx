import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { Camera, AlertCircle, Check } from 'lucide-react';
import { usePhotobooth } from '../../context/PhotoboothContext';

const QRCodeScanner: React.FC = () => {
  const navigate = useNavigate();
  const { validateQRCode, setSessionId } = usePhotobooth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(true);

  const handleScan = async (result: string) => {
    if (!result || !scanning) return;
    
    setScanning(false);
    
    try {
      const isValid = await validateQRCode(result);
      
      if (isValid) {
        setSuccess(true);
        setError(null);
        setSessionId(result);
        
        // Play success sound
        const audio = new Audio('/sounds/success.mp3');
        audio.play().catch(err => console.error('Could not play audio', err));
        
        // Navigate to the photo session after a short delay
        setTimeout(() => {
          navigate('/session');
        }, 1500);
      } else {
        setError('This QR code has already been used');
        setScanning(true);
      }
    } catch (err) {
      setError('Error validating QR code');
      setScanning(true);
    }
  };

  const handleError = (err: Error) => {
    setError(`Camera error: ${err.message}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md mb-4">
        {success ? (
          <div className="w-full h-64 flex items-center justify-center bg-green-100 rounded-lg border-2 border-green-500">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <Check size={32} className="text-white" />
              </div>
              <p className="text-green-700 font-medium">QR Code Validated!</p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {scanning ? (
              <QrScanner
                onDecode={handleScan}
                onError={handleError}
                containerStyle={{ width: '100%', height: '300px', borderRadius: '0.5rem', overflow: 'hidden' }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <Camera size={64} className="text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="w-full max-w-md mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Position QR code within the frame to scan
        </p>
        
        <button
          onClick={() => setScanning(true)}
          disabled={success}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {scanning ? 'Scanning...' : 'Retry Scan'}
        </button>
      </div>
    </div>
  );
};

export default QRCodeScanner;