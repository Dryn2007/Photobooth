import React, { useRef, useState, useEffect } from "react";
import { Camera, Check, RotateCcw } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { usePhotobooth } from "../../context/PhotoboothContext";
import { motion  } from "framer-motion";


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
  const capturedImageRef = useRef<string | null>(null);

  const { currentPhotoIndex } = usePhotobooth();

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [showRedFlash, setShowRedFlash] = useState(false);
  const [redFlashText, setRedFlashText] = useState("UDAHHH RETAKE!!!");
  const [retakeUsed, setRetakeUsed] = useState<boolean[]>([]);
  const [isRetaking, setIsRetaking] = useState(false);
  const [previewCountdown, setPreviewCountdown] = useState<number | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shutterAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewBeepAudioRef = useRef<HTMLAudioElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { setLivePhotoVideoUrls } = usePhotobooth();




  const startRecording = () => {
    recordedChunksRef.current = [];
    if (streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setLivePhotoVideoUrls((prev) => [...prev, url]);

      };

      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  

  useEffect(() => {
    shutterAudioRef.current = new Audio("/sounds/camera-shutter.mp3");
    shutterAudioRef.current.volume = 1;
    shutterAudioRef.current.load();

    previewBeepAudioRef.current = new Audio("/sounds/beep2.mp3");
    previewBeepAudioRef.current.load();
  }, []);


  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);

        const obsCamera = videoDevices.find((device) =>
          device.label.includes("OBS")
        );

        if (obsCamera) {
          setSelectedCamera(obsCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting cameras:", err);
      }
    }
    getCameras();
  }, []);

  const startCamera = async (retryCount = 0) => {
    setCameraError(null);
    setCameraReady(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const constraints = {
        video: {
          width: { ideal: 944 },
          height: { ideal: 708 },
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (retryCount < 2) {
        console.warn(`Retrying camera... attempt ${retryCount + 1}`);
        setTimeout(() => startCamera(retryCount + 1), 1500);
      } else {
        setCameraError("Could not access camera. Please ensure you have granted camera permissions and OBS is running.");
      }
    }
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

  useEffect(() => {
    if (!selectedCamera) return;
    setCapturedImage(null);
    capturedImageRef.current = null;
    setIsCountingDown(false);
    setCameraReady(false);
    startCamera();
  }, [currentPhotoIndex, selectedCamera]);

  const startCountdown = () => {
    setIsCountingDown(true);
    setTimeout(() => {
      console.log("Buffering camera for 500ms...");
      setTimeout(() => startRecording(), 100); // Tambahkan delay 500ms sebelum startRecording
    }, 2000);
  };

  const stopPreviewCountdown = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }

    if (previewIntervalRef.current) {
      clearInterval(previewIntervalRef.current);
      previewIntervalRef.current = null;
    }

    setPreviewCountdown(null);
  };



  const capturePhoto = () => {
    stopRecording();
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataUrl);
    capturedImageRef.current = dataUrl;
    onCapture(dataUrl);

    if (shutterAudioRef.current) {
      shutterAudioRef.current.currentTime = 0;
      shutterAudioRef.current.play().catch((e) => console.error("Audio play error:", e));
    }


    let secondsLeft = 10;
    setPreviewCountdown(secondsLeft);

    const interval = setInterval(() => {
      secondsLeft -= 1;
      setPreviewCountdown(secondsLeft);

      if (previewBeepAudioRef.current) {
        previewBeepAudioRef.current.currentTime = 0;
        previewBeepAudioRef.current.play().catch(err => console.error("Preview beep error:", err));
      }
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPreviewCountdown(null);
      handleContinue(); // Lanjut otomatis jika tidak ditekan tombol apa pun
    }, 10000);

    previewTimeoutRef.current = timeout;
    previewIntervalRef.current = interval;
  };




  const handleRetake = async () => {
    stopPreviewCountdown(); // Hentikan preview countdown jika sedang berjalan

    if (!capturedImageRef.current) {
      setRedFlashText("IHH FOTO DULU");
      setShowRedFlash(true);
      setTimeout(() => setShowRedFlash(false), 2000);
      return;
    }

    if (retakeUsed[currentPhotoIndex]) {
      setRedFlashText("UDAHHH YAA SEKALI AJAA");
      setShowRedFlash(true);
      setTimeout(() => {
        setShowRedFlash(false);
        handleContinue();
      }, 3000);
      return;
    }

    setRedFlashText(`RETAKE FOTO ${currentPhotoIndex + 1}`);
    setShowRedFlash(true);

    setTimeout(async () => {
      setShowRedFlash(false);
      const updated = [...retakeUsed];
      updated[currentPhotoIndex] = true;
      setRetakeUsed(updated);
      setCapturedImage(null);
      capturedImageRef.current = null;
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
      } else {
        startCamera();
      }

      setTimeout(() => setIsRetaking(false), 1000);
    }, 1500);
  };

  const handleContinue = () => {
    stopPreviewCountdown();

    if (!capturedImageRef.current) {
      setRedFlashText("JANGAN BURU BURU, FOTO DULU");
      setShowRedFlash(true);
      setTimeout(() => setShowRedFlash(false), 2000);
      return;
    }

    onComplete();
    capturedImageRef.current = null;
    setCapturedImage(null);
  };







  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h" && !capturedImageRef.current && cameraReady && !isCountingDown) {
        startCountdown();
      }
      if (e.key.toLowerCase() === "j") {
        handleRetake();
      }
      if (e.key.toLowerCase() === "k") {
        handleContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cameraReady, isCountingDown, currentPhotoIndex, retakeUsed]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />

      {cameraError ? (
        <div className="flex flex-col items-center justify-center h-full bg-red-50 text-center p-8">
          <Camera size={64} className="text-red-500 mb-4" />
          <p className="text-red-700 text-lg">{cameraError}</p>
          <p className="text-sm text-gray-500 mt-2">Trying again automatically...</p>
        </div>
      ) : (
        <div className="relative w-full h-full">
  


          {previewCountdown !== null && (
            <div className="absolute bottom-6 left-6 bg-black bg-opacity-60 text-white text-3xl font-bold px-4 py-2 rounded z-30">
              {previewCountdown}
            </div>
          )}

            {showRedFlash && (
              <div className={`absolute inset-0 flex items-center justify-center z-30 transition-all duration-700 ${redFlashText.includes("RETAKE") ? "bg-yellow-500 bg-opacity-80" :
                  redFlashText.includes("SEKALI") ? "bg-red-700 bg-opacity-80" :
                    "bg-black bg-opacity-70"
                }`}>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-white text-7xl font-extrabold text-center drop-shadow-lg"
                >
                  {redFlashText}
                </motion.p>
              </div>
            )}


            <motion.div
              key={capturedImage ? "photo" : "camera"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  autoPlay
                />
              )}
            </motion.div>


          {isCountingDown && !capturedImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
              <CountdownTimer seconds={5} onComplete={capturePhoto} />
            </div>
          )}

          <div className="absolute top-0 left-0 w-full z-30 px-6 py-2">
            <div className="relative h-2 bg-gray-300 rounded">
              <div
                  className="absolute top-0 left-0 h-full bg-orange-400 rounded transition-all duration-500"
                style={{ width: `${((currentPhotoIndex + 1) / 6) * 100}%` }}
              />
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-0.5 bg-white"
                  style={{ left: `${(i / 6) * 100}%` }}
                />
              ))}
            </div>
          </div>

            {/* Kontrol UI tombol ikon di tengah bawah */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-8 z-30">

              {!isCountingDown && !capturedImage && cameraReady && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.15 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={startCountdown}
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl transition-all duration-300"
                >
                  <Camera className="w-8 h-8" />
                </motion.button>
              )}

              {capturedImage && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    onClick={handleRetake}
                    className="flex items-center gap-2 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-full shadow-xl text-lg font-semibold hover:shadow-2xl transition duration-300"
                  >
                    <RotateCcw className="w-6 h-6" />
                  
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.15 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    onClick={handleContinue}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-300"
                  >
                    <Check className="w-8 h-8" />
                  </motion.button>
                </>
              )}
            </div>





        </div>
      )}
    </div>
  );
};

export default CameraCapture;