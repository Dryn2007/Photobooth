import { Camera } from "lucide-react";
import html2canvas from "html2canvas";
import React, { useRef, useEffect, forwardRef, useState } from "react";
import gifshot from "gifshot";
import { usePhotobooth } from "../../context/PhotoboothContext"; // Ganti path sesuai struktur project-mu


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
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewGif, setPreviewGif] = useState<string | null>(null);
    const { sessionId } = usePhotobooth();

    

    const backgroundOptions = [
      "/images/photo.png",
      "/images/photo2.png",
      "/images/photo4.png",
    ];
    const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState<number>(0);

    const handleDownload = () => {
      if (internalRef.current) {
        html2canvas(internalRef.current, {
          scale: 3,
          useCORS: true,
        }).then((canvas) => {
          const dataUrl = canvas.toDataURL("image/png", 1.0);
          setPreviewImage(dataUrl);

          const safeId = sessionId?.replace(/[^\w\-]/g, "_") || "photo-strip";
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${safeId}-photo-4r.png`;
          link.click();

          generateGif(safeId); // Kirim sessionId ke generateGif
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
            gifWidth: 480,
            gifHeight: 310,
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
          gifWidth: 480,
          gifHeight: 310,
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
        <div className="w-full max-w-6xl mx-auto flex items-start justify-center gap-10">
          {/* Foto Strip */}
          <div
            id="photo-strip"
            ref={combinedRef}
            className="relative overflow-hidden"
            style={{
              width: "540px",
              height: "810px",
            }}
          >
            {/* Background */}
            <img
              src={backgroundOptions[selectedBackgroundIndex]}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover z-50"
            />

            {/* Foto di atas background */}
            {photos.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center z-0 p-4">
                <div className="grid grid-cols-2 gap-y-[28px] gap-x-[39px] mr-[1px] ml-[3px] -mt-[5px] -mb-[1.7px]">
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

          {/* Preview GIF */}
          {previewGif && (
            <div className="flex flex-col items-center">
              <img
                src={previewGif}
                alt="GIF Preview"
                className="border-4 border-pink-300 rounded-2xl shadow-xl"
                style={{ width: "480px", height: "310px" }}
              />
              <button
                onClick={handleDownload}
                className="mt-4 px-6 py-2 bg-pink-500 text-white font-semibold rounded-xl shadow-md hover:bg-pink-600 transition duration-300"
              >
                Download Foto & GIF
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default PhotoStrip;
