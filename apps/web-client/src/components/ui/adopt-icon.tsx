import React from 'react';

interface AdoptIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const AdoptIcon: React.FC<AdoptIconProps> = ({ 
  width = 24, 
  height = 24, 
  className = '' 
}) => {
  return (
    <img 
      src="/adopt.svg" 
      alt="Adopt Icon"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default AdoptIcon;
