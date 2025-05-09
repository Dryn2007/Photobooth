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

  useEffect(() => {
    if (!sessionId || photos.length === 0) {
      navigate("/");
    }
  }, [sessionId, photos, navigate]);

  const photoStripRef = useRef<HTMLDivElement>(null);



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

      <main className="flex-1 container mx-auto px-4 py-8 ">
        <div className="mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-blue-600">
              Your Photos Are Ready!
            </h1>
            <p className="text-gray-600">
              Thanks for using our PhotoBooth. Here are your photos!
            </p>
          </div>

          <div>
            <div>
              <div
                className="mx-auto"
              >
                <PhotoStrip ref={photoStripRef} photos={photos} />
              </div>
            </div>

           
            <div className="text-center mt-8">
              <button
                onClick={handleNewSession}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              >
                Back
              </button>
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
