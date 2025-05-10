import { Camera } from "lucide-react";
import html2canvas from "html2canvas";
import React, { useRef, useEffect, forwardRef, useState } from "react";
import gifshot from "gifshot";
import { usePhotobooth } from "../../context/PhotoboothContext";

interface Photo {
  id: number;
  dataUrl: string;
}

interface PhotoStripProps {
  photos: Photo[];
  onDownloadComplete?: () => void;
}

const PhotoStrip = forwardRef<HTMLDivElement, PhotoStripProps>(
  ({ photos, onDownloadComplete }, ref) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const [previewGif, setPreviewGif] = useState<string | null>(null);
    const { sessionId } = usePhotobooth();

    const backgroundOptions = [
      "/images/photo.png",
      "/images/photo2.png",
      "/images/photo4.png",
    ];
    const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState<number>(0);

    const handlePrevBackground = () => {
      setSelectedBackgroundIndex((prev) =>
        prev === 0 ? backgroundOptions.length - 1 : prev - 1
      );
    };

    const handleNextBackground = () => {
      setSelectedBackgroundIndex((prev) =>
        prev === backgroundOptions.length - 1 ? 0 : prev + 1
      );
    };

    const handleDownload = () => {
      if (internalRef.current) {
        html2canvas(internalRef.current, {
          scale: 3,
          useCORS: true,
        }).then((canvas) => {
          const dataUrl = canvas.toDataURL("image/png", 1.0);
          const safeId = sessionId?.replace(/[^\w\-]/g, "_") || "photo-strip";
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${safeId}-photo-4r.png`;
          link.click();

          generateGif(safeId);
          if (onDownloadComplete) onDownloadComplete();
        });
      }
    };

    const combinedRef = (node: HTMLDivElement) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    useEffect(() => {
      if (photos.length === 6) {
        const imageDataUrls = photos.map((photo) => photo.dataUrl);
        gifshot.createGIF(
          {
            images: imageDataUrls,
            interval: 0.5,
            gifWidth: 1920,
            gifHeight: 1080,
          },
          (obj) => {
            if (!obj.error && obj.image) {
              setPreviewGif(obj.image);
            }
          }
        );
      }
    }, [photos]);

    const generateGif = (safeId = "photo-strip") => {
      const imageDataUrls = photos.map(photo => photo.dataUrl);
      gifshot.createGIF(
        {
          images: imageDataUrls,
          interval: 0.5,
          gifWidth: 1920,
          gifHeight: 1080,
        },
        (obj) => {
          if (!obj.error && obj.image) {
            setPreviewGif(obj.image);
            const link = document.createElement("a");
            link.href = obj.image;
            link.download = `${safeId}.gif`;
            link.click();
          }
        }
      );
    };

    return (
      <div className="flex justify-center">
        <div className="w-full mx-auto flex justify-center items-center gap-10">
          {/* Kiri: Photo + Kontrol */}
          <div className="flex flex-col items-center">
            <div
              id="photo-strip"
              ref={combinedRef}
              className="relative overflow-hidden"
              style={{
                width: "540px",
                height: "810px",
              }}
            >
              <img
                src={backgroundOptions[selectedBackgroundIndex]}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-50"
              />
              {photos.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-0 p-4">
                  <div className="grid grid-cols-2 gap-y-[27px] gap-x-[36px] mr-[1px] ml-[3px] -mt-[5px] -mb-[1.7px]">
                    {photos.map((photo) => (
                      <div key={photo.id}>
                        <img
                          src={photo.dataUrl}
                          alt={`Photo ${photo.id + 1}`}
                          crossOrigin="anonymous"
                          className="object-contain relative -bottom-[90px] max-w-full max-h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tombol panah */}
            <div className="flex items-center justify-center mt-6  space-x-4">
              <button
                onClick={handlePrevBackground}
                className="w-10 h-10 text-black rounded-full bg-orange-600 text-2xl font-bold hover:scale-125"
              >
                ←
              </button>
        

            {/* Indikator posisi template */}
            <div className="flex justify-center mt-2 space-x-2">
              {backgroundOptions.map((_, index) => (
                <span
                  key={index}
                  className={`h-1 w-8 rounded-full ${index === selectedBackgroundIndex
                      ? "bg-orange-600"
                      : "bg-gray-400"
                    }`}
                />
              ))}
            </div>
              <button
                onClick={handleNextBackground}
                className="w-10 h-10 text-black rounded-full bg-orange-600 text-2xl font-bold  hover:scale-125"
              >
                →
              </button>
            </div>
          </div>

          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-blue-600">
                Your Photos Are Ready!
              </h1>
              <p className="text-gray-600">
                Thanks for using our PhotoBooth. Here are your photos!
              </p>
            </div>
            {/* Kanan: GIF */}
            {previewGif && (

              <div className="flex bg-pink-500 p-2 h-[450px] rounded-2xl">
                <div className="flex flex-col items-center justify-between">
                  <img
                    src={previewGif}
                    alt="GIF Preview"
                    className="border-4 border-pink-300 rounded-2xl shadow-xl h-96"
                    style={{ width: "480px", height: "310px" }}
                  />
                  <div className="w-full flex justify-between mb-2  ">
                    <button
                      onClick={handleDownload}
                      className="px-6 py-2 mx-2 bg-white text-black font-semibold rounded-xl shadow-md hover:bg-pink-600 hover:text-white transition duration-300"
                    >
                      Download Foto & GIF
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2 mx-2 bg-orange-400 text-gray-800 font-semibold rounded-xl shadow-md hover:bg-white transition duration-300"
                    >
                      HOME
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        
        </div>
      </div>
    );
  }
);

export default PhotoStrip;
