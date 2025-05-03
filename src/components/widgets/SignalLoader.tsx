import React from "react";

interface BarLoaderProps {
  size?: number; // Height of the bars
  color?: string; // Color of the bars
  bars?: number; // Number of bars (default 3)
}

const BarLoader: React.FC<BarLoaderProps> = ({
  size = 24,
  color = "teal",
  bars = 3,
}) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className={`bg-${color} animate-pulseBar w-3`}
          style={{
            height: `${size}px`, // height is set dynamically based on 'size'
            animationDelay: `${index * 0.3}s`, // Stagger the animation delay for each bar
          }}
        />
      ))}
    </div>
  );
};

export default BarLoader;
