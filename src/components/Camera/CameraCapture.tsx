import React, { useRef, useState, useEffect } from "react";
import { Camera, Aperture, RefreshCw, CheckCircle } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { usePhotobooth } from "../../context/PhotoboothContext";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onComplete: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { currentPhotoIndex } = usePhotobooth();
  // Tambahkan state baru di bagian atas component
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);

  const [retakeUsed, setRetakeUsed] = useState<boolean[]>([]);

  // Tambahkan useEffect untuk mendapatkan daftar kamera
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting cameras:", err);
      }
    }
    getCameras();
  }, []);


  useEffect(() => {
    setCapturedImage(null);
    setIsCountingDown(false);
    setCameraReady(false);

    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .then(() => setCameraReady(true))
        .catch((err) => {
          if (err.name !== "AbortError")
            console.error("Play error on index change:", err);
        });
    } else {
      startCamera();
    }
  }, [currentPhotoIndex]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = {
        video: {
          width: { ideal: 944 },
          height: { ideal: 708 },
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined
        },
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch((err) => {
          if (err.name !== "AbortError")
            console.error("Video play error:", err);
        });
        setCameraReady(true);
      }
    } catch (err) {
      setCameraError(
        "Could not access camera. Please ensure you have granted camera permissions."
      );
      console.error("Camera error:", err);
    }
  };
  const startCountdown = () => setIsCountingDown(true);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataUrl);
    onCapture(dataUrl);

    const audio = new Audio("/sounds/camera-shutter.mp3");
    audio.play().catch((e) => console.error("Audio play error:", e));
  };

  const handleRetake = async () => {
    const updated = [...retakeUsed];
    updated[currentPhotoIndex] = true;
    setRetakeUsed(updated);

    setCapturedImage(null);
    setCameraReady(false);
    setIsCountingDown(false);

    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      try {
        await videoRef.current.play();
        setCameraReady(true);
      } catch (err: any) {
        if (err.name !== "AbortError") console.error("Retake play error:", err);
      }
    } else startCamera();
  };

  // Tambahkan handler untuk perubahan kamera
  const handleCameraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamera(e.target.value);
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // Restart camera dengan device baru
    await startCamera();
  };
  useEffect(() => {
    if (selectedCamera) {
      startCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedCamera]);

  const handleContinue = () => onComplete();

  return (
    <div className="w-full max-w-xl mx-auto p-4 rounded-lg shadow-md">
      {cameras.length > 1 && (
        <div className="mb-4">
          <select
            value={selectedCamera}
            onChange={handleCameraChange}
            className="w-full p-2 border rounded-md bg-white"
          >
            {cameras.map(camera => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="relative overflow-hidden rounded-lg bg-black shadow-lg">
        {cameraError ? (
          <div className="flex flex-col items-center justify-center h-64 bg-red-50 p-4 text-center">
            <Camera size={48} className="text-red-500 mb-2" />
            <p className="text-red-700 mb-2">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="relative w-full h-auto max-h-[80vh]">
            <canvas ref={canvasRef} className="hidden" />
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured photo"
                className="w-auto  mx-auto object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                className="w-auto  mx-auto object-contain"
                muted
                playsInline
                autoPlay
              />
            )}
            {isCountingDown && !capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <CountdownTimer seconds={1} onComplete={capturePhoto} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-lg font-semibold">
          Photo {currentPhotoIndex + 1} of 6
        </div>

        {capturedImage ? (
          <div className="flex gap-3">
            {!retakeUsed[currentPhotoIndex] && (
              <button
                onClick={handleRetake}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center gap-2"
              >
                <RefreshCw size={18} /> Retake
              </button>
            )}
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <CheckCircle size={18} /> Continue
            </button>
          </div>
        ) : (
          <button
            onClick={startCountdown}
            disabled={isCountingDown || !cameraReady}
            className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-300 flex items-center gap-2"
          >
            <Aperture
              size={20}
              className={isCountingDown ? "animate-pulse" : ""}
            />
            {isCountingDown ? "Getting ready..." : "Take Photo"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
