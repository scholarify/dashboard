"use client";

import React from "react";
import Lottie from "lottie-react";
import noDataAnimation from "@/../public/assets/lottie/no-data-red.json"; // Adjust path if needed

interface NoDataProps {
  message?: string;
  height?: number;
  width?: number;
}

const NoData: React.FC<NoDataProps> = ({
  message = "No data found.",
  height = 200,
  width = 200,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Lottie
        animationData={noDataAnimation}
        loop={true}
        style={{ height, width }}
      />
      <p className="mt-4 text-lg font-medium text-foreground">
        {message}
      </p>
    </div>
  );
};

export default NoData;
