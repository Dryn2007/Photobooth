import React, { createContext, useContext, useState, useEffect } from "react";

type PhotoType = {
  id: number;
  dataUrl: string;
  timestamp: Date;
};

type QRCodeType = {
  id: string;
  used: boolean;
  timestamp: Date;
};

type FrameType = {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
};

interface PhotoboothContextType {
  currentPhotoIndex: number;
  setCurrentPhotoIndex: React.Dispatch<React.SetStateAction<number>>;
  photos: PhotoType[];
  addPhoto: (dataUrl: string) => void;
  replacePhoto: (index: number, dataUrl: string) => void;
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  qrCode: QRCodeType | null;
  setQrCode: React.Dispatch<React.SetStateAction<QRCodeType | null>>;
  validateQRCode: (id: string) => Promise<boolean>;
  resetSession: () => void;
  selectedFrame: FrameType | null;
  setSelectedFrame: React.Dispatch<React.SetStateAction<FrameType | null>>;
  frames: FrameType[];
}

const AVAILABLE_FRAMES: FrameType[] = [
  {
    id: "classic",
    name: "Classic Border",
    imageUrl:
      "https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg",
    thumbnailUrl:
      "https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "vintage",
    name: "Vintage Style",
    imageUrl:
      "https://images.pexels.com/photos/2747893/pexels-photo-2747893.jpeg",
    thumbnailUrl:
      "https://images.pexels.com/photos/2747893/pexels-photo-2747893.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "modern",
    name: "Modern Lines",
    imageUrl:
      "https://images.pexels.com/photos/2832432/pexels-photo-2832432.jpeg",
    thumbnailUrl:
      "https://images.pexels.com/photos/2832432/pexels-photo-2832432.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
];

const PhotoboothContext = createContext<PhotoboothContextType | undefined>(
  undefined
);

export const PhotoboothProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<QRCodeType | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameType | null>(null);

  const validateQRCode = async (id: string): Promise<boolean> => {
    const usageKey = `qr-usage-${id}`;
    const currentUsage = parseInt(localStorage.getItem(usageKey) || "0");

    // Cek apakah ID mengandung kata 'VIP'
    const isVIP = id.includes("007");
    const isUnlimited = id.includes("UNLIMITED")

 

    // Jika ID mengandung 'VIP', maka set maxUsage ke 2, jika tidak default ke 1
    const maxUsage = isUnlimited ? Infinity : isVIP ? 2 : 1;

    if (currentUsage >= maxUsage) {
      return false;
    }

    // Simpan peningkatan penggunaan hanya jika valid
    localStorage.setItem(usageKey, (currentUsage + 1).toString());

    return true;
  };




  const addPhoto = (dataUrl: string) => {
    const newPhoto = {
      id: photos.length,
      dataUrl,
      timestamp: new Date(),
    };
    setPhotos([...photos, newPhoto]);
  };

  const replacePhoto = (index: number, dataUrl: string) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index] = {
      ...updatedPhotos[index],
      dataUrl,
      timestamp: new Date(),
    };
    setPhotos(updatedPhotos);
  };

  const resetSession = () => {
    setCurrentPhotoIndex(0);
    setPhotos([]);
    setSessionId(null);
    setQrCode(null);
    setSelectedFrame(null);
  };

  return (
    <PhotoboothContext.Provider
      value={{
        currentPhotoIndex,
        setCurrentPhotoIndex,
        photos,
        addPhoto,
        replacePhoto,
        sessionId,
        setSessionId,
        qrCode,
        setQrCode,
        validateQRCode,
        resetSession,
        selectedFrame,
        setSelectedFrame,
        frames: AVAILABLE_FRAMES,
      }}
    >
      {children}
    </PhotoboothContext.Provider>
  );
};

export const usePhotobooth = (): PhotoboothContextType => {
  const context = useContext(PhotoboothContext);
  if (context === undefined) {
    throw new Error("usePhotobooth must be used within a PhotoboothProvider");
  }
  return context;
};
