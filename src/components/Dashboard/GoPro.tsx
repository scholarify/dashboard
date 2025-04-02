import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface GoProProps {
  visible?: boolean; // Prop to control visibility
}

const GoPro: React.FC<GoProProps> = ({ visible = true }) => {
  const [isVisible, setIsVisible] = useState(visible);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="flex w-full flex-col p-4 border rounded-lg bg-yellow-100 text-[12px]">
      {/* Top section with warning and close icons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-yellow-600 w-[20px]" />
          <span className="font-semibold text-yellow-600">Warning</span>
        </div>
        <X className="cursor-pointer w-[20px] text-gray-600" onClick={handleDismiss} />
      </div>

      {/* Description text */}
      <p className="text-gray-800">
        Enjoy unlimited access to our app with only a small price monthly.
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        <button className="text-sm font-bold text-gray-600 hover:text-gray-800" onClick={handleDismiss}>
          Dismiss
        </button>
        <button className="text-sm font-bold text-teal hover:text-teal">Go Pro</button>
      </div>
    </div>
  );
};

export default GoPro;
