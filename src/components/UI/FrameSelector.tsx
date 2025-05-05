import React from 'react';
import { usePhotobooth } from '../../context/PhotoboothContext';
import { Check } from 'lucide-react';

const FrameSelector: React.FC = () => {
  const { frames, selectedFrame, setSelectedFrame } = usePhotobooth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {frames.map((frame) => (
        <div
          key={frame.id}
          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
            selectedFrame?.id === frame.id
              ? 'ring-4 ring-blue-500 scale-105'
              : 'hover:scale-105'
          }`}
          onClick={() => setSelectedFrame(frame)}
        >
          <img
            src={frame.thumbnailUrl}
            alt={frame.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-semibold">{frame.name}</h3>
          </div>
          {selectedFrame?.id === frame.id && (
            <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
              <Check size={16} className="text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FrameSelector;