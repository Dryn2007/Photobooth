import html2canvas from "html2canvas";
import React, { useRef, useEffect, forwardRef, useState } from "react";
import gifshot from "gifshot";
import { usePhotobooth } from "../../context/PhotoboothContext";
import FFmpeg from '@ffmpeg/ffmpeg';
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
    const [liveVideoPreview, setLiveVideoPreview] = useState<string | null>(null);
    const gifBackground = "/images/gif-frame.png";
    const { livePhotoVideoUrls } = usePhotobooth();
    const { createFFmpeg, fetchFile } = FFmpeg;
    const [loadingVideo, setLoadingVideo] = useState(false); // State untuk loading video
    


    const backgroundOptions = [
      "/images/photo.png",
      "/images/photo2.png",
      "/images/photo3.png",
      "/images/photo4.png",
    ];
    const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false); // State untuk loading GIF

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

    const generateGif = async (safeId = "photo-strip"): Promise<string | null> => {
      try {
        setLoading(true);  // Mulai loading

        const frame = new Image();
        frame.src = gifBackground;
        frame.crossOrigin = "anonymous";
        await frame.decode();

        const compositeImages = await Promise.all(
          photos.map((photo) => {
            return new Promise<string>((resolve) => {
              const canvas = document.createElement("canvas");
              canvas.width = 1920;
              canvas.height = 1240;
              const ctx = canvas.getContext("2d");

              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = photo.dataUrl;

              img.onload = () => {
                ctx?.drawImage(img, 0, 0, 1920, 1240);
                ctx?.drawImage(frame, 0, 0, 1920, 1240);
                resolve(canvas.toDataURL("image/png"));
              };
            });
          })
        );

        return new Promise((resolve) => {
          gifshot.createGIF(
            {
              images: compositeImages,
              interval: 0.5,
              gifWidth: 1920,
              gifHeight: 1240,
              numFrames: compositeImages.length,
              sampleInterval: 10,
            },
            (obj) => {
              setLoading(false);
              if (!obj.error && obj.image) {
                setPreviewGif(obj.image);
                resolve(obj.image);
              } else {
                console.error("GIF generation error:", obj.error);
                resolve(null);
              }
            }
          );
        });
      } catch (error) {
        setLoading(false);
        console.error("Failed to generate GIF:", error);
        return null;
      }
    };


    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
      setIsDownloading(true);
      setLoadingVideo(true); // Mulai loading video
      const safeId = sessionId?.replace(/[^\w\-]/g, "_") || "photo-strip";

      let gifData = previewGif;

      if (!gifData) {
        gifData = await generateGif(safeId);
      }

      if (gifData) {
        const gifLink = document.createElement("a");
        gifLink.href = gifData;
        gifLink.download = `${safeId}.gif`;
        gifLink.click();
      }


      // 3. Download photo strip (png)
      if (internalRef.current) {
        try {
          const canvas = await html2canvas(internalRef.current, {
            backgroundColor: null,
            scale: 2,
          });

          const dataUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${safeId}-photo-strip.png`;
          link.click();
        } catch (error) {
          console.error("Error generating photo strip image:", error);
        }
      }

      // 4. Generate dan download live video
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 840;
        canvas.height = 1240;
        const ctx = canvas.getContext("2d")!;

        const frame = new Image();
        frame.crossOrigin = "anonymous";
        frame.src = backgroundOptions[selectedBackgroundIndex];
        await frame.decode();

        const videoElements = await Promise.all(
          livePhotoVideoUrls.map((url) => {
            return new Promise<HTMLVideoElement>((resolve) => {
              const video = document.createElement("video");
              video.src = url;
              video.crossOrigin = "anonymous";
              video.muted = true;
              video.playsInline = true;
              video.preload = "auto";
              video.onloadeddata = () => resolve(video);
            });
          })
        );

        const minDuration = Math.min(...videoElements.map((v) => v.duration));
        const duration = Math.min(3, minDuration);
        const fps = 30;
        const totalFrames = duration * fps;
        const frames: Uint8Array[] = [];

        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();

        const slots = [
          { x: 35, y: 380, width: 360, height: 260 },
          { x: 35, y: 650, width: 360, height: 260 },
          { x: 35, y: 920, width: 360, height: 260 },
          { x: 448, y: 380, width: 360, height: 260 },
          { x: 448, y: 650, width: 360, height: 260 },
          { x: 448, y: 920, width: 360, height: 260 },
        ];

        for (let i = 0; i < totalFrames; i++) {
          const currentTime = Math.min(i / fps, duration - 0.05);

          for (let v of videoElements) {
            await new Promise<void>((resolve) => {
              const seekHandler = () => {
                // Tambahkan delay pendek setelah seek
                setTimeout(resolve, 100);
              };

              v.addEventListener("seeked", seekHandler, { once: true });

              const safeTime = Math.min(currentTime, v.duration - 0.1);
              try {
                v.currentTime = safeTime;
              } catch (err) {
                console.warn("Failed to seek video:", err);
                resolve(); // biar lanjut
              }
            });
          }


          ctx.clearRect(0, 0, canvas.width, canvas.height);

          videoElements.forEach((video, index) => {
            const { x, y, width, height } = slots[index];
            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, x, y, width, height);
          });

          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

          const blob = await new Promise<Blob>((res) =>
            canvas.toBlob((b) => b && res(b), "image/png")
          );
          frames.push(new Uint8Array(await blob!.arrayBuffer()));
        }

        for (let i = 0; i < frames.length; i++) {
          ffmpeg.FS("writeFile", `frame_${String(i).padStart(3, "0")}.png`, frames[i]);
        }

        await ffmpeg.run(
          "-framerate", "30",
          "-i", "frame_%03d.png",
          "-r", "30",
          "-g", "60",
          "-c:v", "libx264",
          "-pix_fmt", "yuv420p",
          "output.mp4"
        );

        const data = ffmpeg.FS("readFile", "output.mp4");
        const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        setLiveVideoPreview(url);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${safeId}-live-video.mp4`;
        link.click();
      } catch (err) {
        console.error("Gagal membuat video live photo:", err);
      }

      setLoadingVideo(false); // selesai render video
      setIsDownloading(false);

      if (onDownloadComplete) onDownloadComplete();
    };


    useEffect(() => {
      if (photos.length === 6) {
        generateGif();
      }
    }, [photos]);

//     const handleDownloadLiveVideo = async () => {
//       try {
//         // Setup canvas dengan lebar genap (840) dan tinggi tetap (1240)
//         const canvas = document.createElement("canvas");
//         canvas.width = 840;
//         canvas.height = 1240;
//         const ctx = canvas.getContext("2d")!;

//         const frame = new Image();
//         frame.crossOrigin = "anonymous";
//         frame.src = backgroundOptions[selectedBackgroundIndex];
//         await frame.decode();

//         const videoElements = await Promise.all(
//           livePhotoVideoUrls.map((url, index) => {
//             return new Promise<HTMLVideoElement>((resolve) => {
//               const video = document.createElement("video");
//               video.src = url;
//               video.crossOrigin = "anonymous";
//               video.muted = true;
//               video.playsInline = true;
//               video.preload = "auto";
//               video.onloadeddata = () => {
//                 console.log(`Video ${index}: ${video.videoWidth}x${video.videoHeight}`);
//                 resolve(video);
//               };
//             });
//           })
//         );

//         const minDuration = Math.min(...videoElements.map(v => v.duration));
//         const duration = Math.min(4, minDuration); // pilih durasi terpendek
//         const fps = 30;
//         const totalFrames = duration * fps;
//         const frames: Uint8Array[] = [];

//         const ffmpeg = createFFmpeg({ log: true });
//         await ffmpeg.load();

//         const slots = [
//           { x: 35, y: 380, width: 360, height: 260 },
//           { x: 35, y: 650, width: 360, height: 260 },
//           { x: 35, y: 920, width: 360, height: 260 },
//           { x: 448, y: 380, width: 360, height: 260 },
//           { x: 448, y: 650, width: 360, height: 260 },
//           { x: 448, y: 920, width: 360, height: 260 },
//         ];

//         for (let i = 0; i < totalFrames; i++) {
//           const currentTime = (i / fps);

//           await Promise.all(videoElements.map((video) => {
//             return new Promise<void>((resolve) => {
//               const onSeeked = () => {
//                 if (video.readyState >= 2) {
//                   setTimeout(resolve, 30); // beri delay agar frame benar-benar tampil
//                 } else {
//                   // Tunggu lagi jika belum siap
//                   video.addEventListener("canplay", () => setTimeout(resolve, 30), { once: true });
//                 }
//               };

//               video.addEventListener("seeked", onSeeked, { once: true });

//               const currentTime = Math.min(i / fps, video.duration - 0.05); // hindari akhir
//               video.currentTime = currentTime;
//             });
//           }));


//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           videoElements.forEach((video, index) => {
//             const { x, y, width, height } = slots[index];
//             ctx.drawImage(
//               video,
//               0, 0, video.videoWidth, video.videoHeight, // ambil seluruh frame dari video
//               x, y, width, height                        // gambar ke posisi slot canvas
//             );
//           });

//           ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

//           const blob = await new Promise<Blob>((res) =>
//             canvas.toBlob((b) => b && res(b), "image/png")
//           );
//           frames.push(new Uint8Array(await blob!.arrayBuffer()));
//         }

//         for (let i = 0; i < frames.length; i++) {
//           ffmpeg.FS("writeFile", `frame_${String(i).padStart(3, "0")}.png`, frames[i]);
//         }

//         await ffmpeg.run(
//           "-framerate", "30",
//           "-i", "frame_%03d.png",
//           "-r", "30",
//           "-g", "60",              // ← tambahan
//           "-c:v", "libx264",
//           "-pix_fmt", "yuv420p",
//           "output.mp4"
//         );



//         const data = ffmpeg.FS("readFile", "output.mp4");
//         const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));

//         // Tampilkan preview tanpa download
//         setLiveVideoPreview(url);
//         const link = document.createElement("a");
// link.href = url;
// link.download = `${sessionId || "photo-strip"}-live-video.mp4`;
// link.click();


//       } catch (err) {
//         console.error("Gagal membuat video live photo:", err);
//       }
//     };





    const LivePhotoWithFallback: React.FC<{ videoUrl: string; fallbackImg: string }> = ({
      videoUrl,
      fallbackImg,
    }) => {
      const [showVideo, setShowVideo] = useState(true);
      const videoRef = useRef<HTMLVideoElement | null>(null);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);

      useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => {
          setShowVideo(false);

          timeoutRef.current = setTimeout(() => {
            if (video) {
              video.currentTime = 0; // RESET ke awal
              setShowVideo(true);
              video.play();
            }
          }, 4000); //detik tampilin foto
        };

        video.addEventListener("ended", handleEnded);
        video.play();

        return () => {
          video.removeEventListener("ended", handleEnded);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      }, []);

      return showVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          playsInline
          poster={fallbackImg}
          onCanPlay={() => videoRef.current?.play()}
          className="max-w-full max-h-full rounded relative top-[100px]"
        />
      ) : (
        <img
          src={fallbackImg}
          alt="Fallback"
          className="max-w-full max-h-full rounded relative top-[100px]"
        />
      );
    };

   


    return (
      <div className="flex justify-center">
        <div className="w-full mx-auto flex justify-center items-center gap-10">
          {/* Kiri: Photo + Kontrol */}
          <div className="flex flex-col items-center">
            <div
              id="photo-strip"
              ref={internalRef}
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
                  <div className="grid grid-cols-2 gap-y-[23px] gap-x-[30px] mr-[0px] ml-[0px] -mt-[5px] -mb-[1.7px]">
                    {photos.map((photo, index) => (
                      <div key={photo.id} className="relative w-full h-full flex items-center justify-center">
                        {isDownloading || !livePhotoVideoUrls[index] ? (
                          <img
                            src={photo.dataUrl}
                            alt={`Photo ${photo.id + 1}`}
                            crossOrigin="anonymous"
                            className="object-contain relative -bottom-[100px] max-w-full max-h-full"
                          />
                        ) : (
                          <LivePhotoWithFallback
                            videoUrl={livePhotoVideoUrls[index]}
                            fallbackImg={photo.dataUrl}
                          />
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            

            {/* Tombol panah */}
            <div className="flex items-center justify-center mt-6 space-x-4">
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
                className="w-10 h-10 text-black rounded-full bg-orange-600 text-2xl font-bold hover:scale-125"
              >
                →
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-center mb-5">
              <h1 className="text-3xl font-bold mb-2 text-orange-600">
                Yeay Selesai Juga Fotonya!
              </h1>
              <p className="text-gray-600">
                Terima kasih telah menggunakan PhotoBooth kami. Tunggu Kami di Acara Berikutnya
              </p>
            </div>
            {/* Kanan: GIF */}
            {loading ? (
              <div className="flex flex-col justify-center items-center bg-gray-200 rounded-lg w-[925px] h-[620px]">
                <p>Sabar GIF kamu lagi loading</p>

                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-gray-800 rounded-full" />
              </div>
            ) : (
              previewGif && (
                <div className="flex justify-center w-full p-2 rounded-2xl">
                  <div className="flex flex-col w-full h-auto items-center justify-between">
                    <div
                      className="relative"
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    >
                      {/* GIF background layer */}
                      <img
                        src={previewGif}
                        alt="GIF Preview"
                        className="w-full h-full shadow-2xl"
                      />

                      {/* Overlay frame di atas GIF */}
                      <img
                        src="/images/gif-frame.png"
                        alt="GIF Overlay Frame"
                        className="absolute inset-0 w-full h-full  object-cover pointer-events-none z-10"
                      />
                    </div>
                      {(isDownloading || loadingVideo) && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-lg font-semibold mb-2">Sedang Mengunduh Foto, GIF & Video Live...</div>
                            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mx-auto" />
                          </div>
                        </div>
                      )}

                    <div className="w-full flex items-center   mb-2 mt-4">
                      <button
                        onClick={handleDownload}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-700 transition duration-300">
                          Download
                        </button>
                      <p className="text-white">Setelah Download Halaman Akan Kembali Ke Awal </p>
                    </div>

                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </div>
    );
  }
);

export default PhotoStrip;
