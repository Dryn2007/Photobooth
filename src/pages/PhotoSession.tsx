import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotobooth } from '../context/PhotoboothContext';
import CameraCapture from '../components/Camera/CameraCapture';
import logo from "/images/logo.png";

const PhotoSession: React.FC = () => {
  const {
    currentPhotoIndex,
    setCurrentPhotoIndex,
    addPhoto,
    replacePhoto,
    photos,
    sessionId
  } = usePhotobooth();

  const navigate = useNavigate();

  // If no session ID, redirect to home
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

  const handlePhotoCapture = (dataUrl: string) => {
    if (photos.length > currentPhotoIndex) {
      // Replace existing photo (retake)
      replacePhoto(currentPhotoIndex, dataUrl);
    } else {
      // Add new photo
      addPhoto(dataUrl);
    }
  };

  const handleComplete = () => {
    if (currentPhotoIndex < 5) {
      // Move to next photo
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      // All photos taken, go to completion page
      navigate('/complete');
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentPhotoIndex + (photos[currentPhotoIndex] ? 0.5 : 0)) / 6) * 100;

  return (
    <div className="min-h-screen bg-blue-300 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <img src={logo} alt="Logo" className='w-12 mr-3 ' />
              <span className='items-center gap-2 text-2xl font-bold text-[#aa7247] py-5'>PhotoBooth Session</span>
            </div>

            <div className="text-sm text-gray-500">
              Photo {currentPhotoIndex + 1} of 6
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-gray-200 rounded-full mt-3">
            <div
              className="h-full bg-[#e69e3d] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex justify-center items-center flex-grow ">
        <div className="mx-auto">
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6 text-center">
              {photos[currentPhotoIndex]
                ? 'Review Your Photo'
                : `Take Photo ${currentPhotoIndex + 1}`
              }
            </h1>

            <CameraCapture
              onCapture={handlePhotoCapture}
              onComplete={handleComplete}
            />
          </div>
        </div>
      </main>
    </div>
  );

};

export default PhotoSession;