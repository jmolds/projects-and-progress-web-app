// hooks/useSwiperHoverEffect.js
import { useState } from 'react';

export const useSwiperHoverEffect = (isSelected) => {
    const [isHovered, setIsHovered] = useState(false);
  
    const onEnter = () => {
      if (!isSelected) {
        setIsHovered(true);
      }
    };
  
    const onLeave = () => {
      setIsHovered(false);
    };
  
    return { isHovered, onEnter, onLeave, enableHover: !isSelected };
  };
  