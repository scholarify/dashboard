import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react'; // Importing icons from lucide-react (you can use other icon libraries if needed)

function GoPro() {
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  // Function to handle dismissal
  const handleDismiss = () => {
    setIsVisible(false);
  };

  // If the component is not visible, don't render it
  if (!isVisible) return null;

  return (
    <div className="flex w-full flex-col p-4 border rounded-lg bg-yellow-100 text-[12px]">
      {/* Top section with warning and close icons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-yellow-600 w-[20px]" /> {/* Warning icon */}
          <span className="font-semibold text-yellow-600">Warning</span>
        </div>
        <X 
          className="cursor-pointer w-[20px] text-gray-600" 
          onClick={handleDismiss} 
        /> {/* Close icon */}
      </div>

      {/* Description text */}
      <p className="text-gray-800 ">
        Enjoy unlimited access to our app with only a small price monthly.
      </p>

      {/* Action buttons: Dismiss and Go Pro */}
      <div className="flex gap-3 mt-2">
        <button
          className="text-sm font-bold text-gray-600 hover:text-gray-800"
          onClick={handleDismiss}
        >
          Dismiss
        </button>
        <button className="text-sm font-bold text-teal hover:text-teal">
          Go Pro
        </button>
      </div>
    </div>
  );
}

export default GoPro;
