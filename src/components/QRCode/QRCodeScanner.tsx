  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { QrScanner } from "@yudiel/react-qr-scanner";
  import { Camera, AlertCircle, Check } from "lucide-react";
  import { usePhotobooth } from "../../context/PhotoboothContext";
  import { motion } from "framer-motion";

  const QRCodeScanner: React.FC = () => {
    const navigate = useNavigate();
    const { validateQRCode, setSessionId } = usePhotobooth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [scanning, setScanning] = useState<boolean>(true);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

    useEffect(() => {
      // Ambil semua perangkat video
      navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        const videoDevices = deviceInfos.filter(
          (device) => device.kind === "videoinput"
        );
        console.log("Detected Video Devices:", videoDevices);

        setDevices(videoDevices);

        const obsCamera = videoDevices.find((device) =>
          device.label.includes("OBS")
        );

        if (obsCamera) {
          setSelectedDeviceId(obsCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      });
    }, []);


    const handleScan = async (result: string) => {
      if (!result || !scanning) return;

      setScanning(false);

      try {
        const isValid = await validateQRCode(result);

        if (isValid) {
          setSuccess(true);
          setError(null);
          setSessionId(result);

          const audio = new Audio("/sounds/success.mp3");
          audio.play().catch((err) => console.error("Could not play audio", err));

          setTimeout(() => {
            navigate("/session");
          }, 1500);
        } else {
          setError("This QR code has already been used");
          setScanning(true);
        }
      } catch (err) {
        setError("Error validating QR code");
        setScanning(true);
      }
    };

    const handleError = (err: Error) => {
      setError(`Camera error: ${err.message}`);
    };

    return (
      <div className="flex flex-col items-center">
    

        <div className="relative w-full max-w-md mb-4">
          {success ? (
            <div className="w-full h-64 flex items-center justify-center bg-green-100 rounded-lg border-2 border-green-500">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <Check size={32} className="text-white" />
                </div>
                <p className="text-green-700 font-medium">QR Code Validated!</p>
              </div>
            </div>
          ) : (
            <div className="w-full relative">
              {scanning ? (
                  <QrScanner
                    onDecode={handleScan}
                    onError={(err) => {
                      console.error("Camera error details:", err.name, err.message);
                      handleError(err);
                    }}
                    constraints={{
                      deviceId: selectedDeviceId,  // Hapus `{ exact: ... }`
                    }}
                    containerStyle={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                    }}
                    videoStyle={{
                      objectFit: "cover",
                    }}
                  />

              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Camera size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="w-full max-w-md mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  export default QRCodeScanner;
