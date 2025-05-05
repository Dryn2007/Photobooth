import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, onComplete }) => {
  const [count, setCount] = useState<number>(seconds);
  const [color, setColor] = useState<string>('text-white');

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
      
      // Play countdown sound
      const audio = new Audio('/sounds/beep.mp3');
      audio.play().catch(err => console.error('Could not play audio', err));
      
      // Change color based on count
      if (count === 5) setColor("text-red-500");
      if (count === 4) setColor("text-yellow-500");
      if (count === 3) setColor('text-blue-500');
      if (count === 2) setColor('text-yellow-500');
      if (count === 1) setColor('text-red-500');
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