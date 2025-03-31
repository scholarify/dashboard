"use client";
import React from "react";

interface AvatarProps {
  src: string;
  alt?: string;
}

const AvatarImage: React.FC<AvatarProps> = ({ src, alt = "User Avatar" }) => {
  return (
    <div className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}>
      <img src={src} alt={alt} className="w-full h-full rounded-full object-fit" />
    </div>
  );
};

export default AvatarImage;
