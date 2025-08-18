import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText: string;
  fallbackClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, fallbackText, className, fallbackClassName, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };
  
  // Use a consistent color based on the fallback text
  const getBackgroundColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 50%, 85%)`;
    const textColor = `hsl(${hash % 360}, 50%, 30%)`;
    return { backgroundColor: color, color: textColor };
  };

  const style = getBackgroundColor(fallbackText);

  if (error || !src) {
    return (
      <div 
        className={`flex items-center justify-center font-bold text-lg ${className} ${fallbackClassName}`}
        style={style}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};