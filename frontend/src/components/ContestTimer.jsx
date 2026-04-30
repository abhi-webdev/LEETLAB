import React, { useState, useEffect } from "react";

const ContestTimer = ({ targetDate, label = "", onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      if (!tl && onEnd) {
        onEnd();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <span className="text-success font-bold">{label || "Time's up!"}</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {label && <span className="text-xs text-gray-400 mr-1">{label}</span>}
      <div className="flex gap-1">
        {timeLeft.days > 0 && (
          <div className="bg-base-300 rounded-lg px-2 py-1 text-center min-w-[40px]">
            <span className="text-lg font-bold font-mono">{timeLeft.days}</span>
            <span className="text-[10px] block text-gray-400">DAY</span>
          </div>
        )}
        <div className="bg-base-300 rounded-lg px-2 py-1 text-center min-w-[40px]">
          <span className="text-lg font-bold font-mono">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] block text-gray-400">HR</span>
        </div>
        <span className="text-lg font-bold self-start mt-1">:</span>
        <div className="bg-base-300 rounded-lg px-2 py-1 text-center min-w-[40px]">
          <span className="text-lg font-bold font-mono">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] block text-gray-400">MIN</span>
        </div>
        <span className="text-lg font-bold self-start mt-1">:</span>
        <div className="bg-base-300 rounded-lg px-2 py-1 text-center min-w-[40px]">
          <span className="text-lg font-bold font-mono">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] block text-gray-400">SEC</span>
        </div>
      </div>
    </div>
  );
};

export default ContestTimer;
