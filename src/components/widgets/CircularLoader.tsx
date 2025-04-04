import React from "react";

interface CircularLoaderProps {
  size?: number; // Taille du loader en pixels (par défaut 32px)
  color?: string; // Couleur de la bordure (par défaut teal-500)
}

const CircularLoader: React.FC<CircularLoaderProps> = ({
  size = 32,
  color = "teal",
}) => {
  return (
    <div
      className={`flex justify-center items-center h-full w-full `}
    >
      <div
        className={`animate-spin rounded-full border-t-2 border-r-2 border-${color}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: "transparent",
          borderTopColor: `var(--${color})`,
          borderRightColor: `var(--${color})`,
        }}
      />
    </div>
  );
};

export default CircularLoader;