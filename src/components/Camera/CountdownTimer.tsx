import React, { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, onComplete }) => {
  const [count, setCount] = useState<number>(seconds);
  const [color, setColor] = useState<string>('text-white');

  // Preload audio beep saat komponen mount
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/beep.mp3');
    audioRef.current.load();
  }, []);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    // Mainkan audio beep dengan mengatur kembali currentTime ke 0
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error('Could not play audio', err));
    }

    // Ubah warna berdasarkan sisa hitung mundur
    if (count === 5) setColor("text-red-500");
    if (count === 4) setColor("text-yellow-500");
    if (count === 3) setColor("text-blue-500");
    if (count === 2) setColor("text-yellow-500");
    if (count === 1) setColor("text-red-500");

    const timer = setTimeout(() => {
      setCount(prevCount => prevCount - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="flex items-center justify-center">
      <div
        className={`text-9xl font-bold ${color} transition-all duration-300 transform scale-100 animate-pulse`}
        style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
      >
        {count}
      </div>
    </div>
  );
};

export default CountdownTimer;
