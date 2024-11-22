// components/MediaModal.js
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MediaModal = ({ src, alt, type, onClose }) => {
//   console.log('MediaModal rendered with:', { src, alt, type });

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75" 
      onClick={onClose} 
     >
      
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.75 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full p-4 flex items-center justify-center"
        
      >
        {type === 'image' ? (
          <div className="relative w-full h-full flex items-center justify-center" >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 80vw"
              style={{ objectFit: 'contain' }}
              onClick={onClose}
              className="cursor-pointer"
            />
          </div>
        ) : (
          <video 
            controls 
            className="max-w-full max-h-full cursor-pointer object-contain" 
            onClick={onClose} 
            >
            <source src={src} type={`video/${src.split('.').pop()}`} />
          </video>
        )}
      </motion.div>
    </div>
  );
};

export default MediaModal;
