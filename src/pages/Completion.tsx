import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Share, Home, Camera } from "lucide-react";
import { usePhotobooth } from "../context/PhotoboothContext";
import PhotoStrip from "../components/UI/PhotoStrip";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import Header from "../components/Layout/Header";



const Completion: React.FC = () => {
  const { photos, sessionId, resetSession, selectedFrame } = usePhotobooth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!sessionId || photos.length === 0) {
  //     navigate("/");
  //   }
  // }, [sessionId, photos, navigate]);

  const photoStripRef = useRef<HTMLDivElement>(null);



  const handleNewSession = () => {
    resetSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 flex justify-center items-center">
        <div className="container mx-auto px-4">
          <div className="mx-auto">
            <PhotoStrip ref={photoStripRef} photos={photos} />
          </div>
        </div>
      </main>


      <footer className="bg-[#fbb635] text-black py-4">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} P5 PhotoBooth. By DBI PRODUCTION.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Completion;
