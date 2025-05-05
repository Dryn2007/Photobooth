import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Share, Home, Camera } from "lucide-react";
import { usePhotobooth } from "../context/PhotoboothContext";
import PhotoStrip from "../components/UI/PhotoStrip";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";


const Completion: React.FC = () => {
  const { photos, sessionId, resetSession, selectedFrame } = usePhotobooth();
  const navigate = useNavigate();

  // If no session ID or no photos, redirect to home
  // useEffect(() => {
  //   if (!sessionId || photos.length === 0) {
  //     navigate("/");
  //   }
  // }, [sessionId, photos, navigate]);

  const photoStripRef = useRef<HTMLDivElement>(null);

const handleDownload = async () => {
  const node = photoStripRef.current;
  if (!node) return;
};

  const handleShare = () => {
    alert("Sharing functionality would be implemented here");
  };

  const handleNewSession = () => {
    resetSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <Camera size={24} />
              <span>PhotoBooth</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-blue-600">
              Your Photos Are Ready!
            </h1>
            <p className="text-gray-600">
              Thanks for using our PhotoBooth. Here are your photos!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div
                className="mx-auto"
              >
                <PhotoStrip ref={photoStripRef} photos={photos} />
              </div>
            </div>

            <div className="bg-white max-h-10 rounded-lg shadow-md p-6 flex flex-col">
              <h2 className="text-2xl font-semibold mb-6">
                What would you like to do next?
              </h2>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <Download size={20} />
                  Download Photos
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  <Share size={20} />
                  Share Photos
                </button>

                <button
                  onClick={handleNewSession}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Home size={20} />
                  Start New Session
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600">
                  Your photos are stored temporarily and will be deleted after
                  24 hours. Make sure to download them before they're gone!
                </p>
              </div>
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

export default Completion;
