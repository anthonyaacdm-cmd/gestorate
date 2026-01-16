
import React from 'react';

const HeroImage = () => {
  return (
    <div className="relative w-8 h-8 shrink-0" data-name="gestorate-icon">
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="32" height="32" rx="6" fill="white"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="22" fill="#6366F1" fontWeight="700">G</text>
      </svg>
    </div>
  );
};

export default HeroImage;
