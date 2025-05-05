import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, RefreshCw } from 'lucide-react';
import { usePhotobooth } from '../../context/PhotoboothContext';

interface QRCodeGeneratorProps {
  onGenerate?: (code: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onGenerate }) => {
  const { setQrCode } = usePhotobooth();
  const [qrValue, setQrValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateRandomCode = () => {
    setIsGenerating(true);
    // Generate a random string with timestamp to ensure uniqueness
    const randomCode = `PB-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
    setQrValue(randomCode);
    
    // Create QR code object
    const newQrCode = {
      id: randomCode,
      used: false,
      timestamp: new Date(),
    };
    
    setQrCode(newQrCode);
    if (onGenerate) onGenerate(randomCode);
    
    setTimeout(() => setIsGenerating(false), 500);
  };

  useEffect(() => {
    generateRandomCode();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
        {qrValue ? (
          <QRCodeSVG value={qrValue} size={200} level="H" />
        ) : (
          <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100">
            <Camera size={64} className="text-gray-400" />
          </div>
        )}
      </div>
      
      <button
        onClick={generateRandomCode}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
      >
        <RefreshCw size={18} className={`${isGenerating ? 'animate-spin' : ''}`} />
        Generate New QR Code
      </button>
      
      {qrValue && (
        <p className="mt-4 text-sm text-gray-500">
          Scan this QR code to start your photo session
        </p>
      )}
    </div>
  );
};

export default QRCodeGenerator;