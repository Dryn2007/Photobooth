import { Camera } from "lucide-react";
import html2canvas from "html2canvas";
import React, { useRef, useEffect, forwardRef, useState } from "react";
import gifshot from "gifshot";
import { div } from "motion/react-client";

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

    const backgroundOptions = [
      "/images/photo.png",
      "/images/photo2.png",
      "/images/photo4.png",
    ];
    const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState<number>(0);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (["1", "2", "3"].includes(event.key)) {
          const index = parseInt(event.key) - 1;
          setSelectedBackgroundIndex(index);
        } else if (event.key === "Enter") {
          if (internalRef.current) {
            html2canvas(internalRef.current, {
              scale: 3,
              useCORS: true,
            }).then((canvas) => {
              const dataUrl = canvas.toDataURL("image/png", 1.0);
              setPreviewImage(dataUrl);
              const link = document.createElement("a");
              link.href = dataUrl;
              link.download = "photo-strip-4r.png";
              link.click();
              generateGif();
              if (onDownloadComplete) onDownloadComplete();
            });
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onDownloadComplete]);

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
              setPreviewGif(obj.image); // Tampilkan preview langsung
            }
          }
        );
      }
    }, [photos]);


    // ✅ Fitur buat GIF
    const generateGif = () => {
      const imageDataUrls = photos.map(photo => photo.dataUrl);

      gifshot.createGIF(
        {
          images: imageDataUrls,
          interval: 0.5,
          gifWidth: 480,
          gifHeight: 310  ,
        },
        (obj) => {
          if (!obj.error && obj.image) {
            setPreviewGif(obj.image);
            const link = document.createElement("a");
            link.href = obj.image;
            link.download = "photo-strip.gif";
            link.click();
          }
        }
      );
    };

    return (
      <div className="flex justify-center">

      <div className="w-full max-w-5xl mx-auto flex items-center justify-center">
        {/* Preview hasil GIF */}
        <div className="justify-items-end grid grid-cols-2">


        {/* Area untuk canvas screenshot */}
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

        <div className="relative bottom-5">

        {previewGif && (
          <img
          src={previewGif}
            alt="GIF Preview"
            className="mt-4 border rounded-2xl z-50 bottom-0"
            />
          )}
          </div>
            </div>
      </div>
        </div>
    );
  }
);

export default PhotoStrip;
