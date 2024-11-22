import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import MediaModal from './mediaModal';


const ProgressCard = ({
  title,
  subtitle,
  isVisible,
  projectId,
  progressStatus,
  progressType,
  updated_ts,
  created_ts,
  color,
  onClick,
  selected,
}) => {

  const statusStyles = {
    'To-Do': 'text-gray-400',
    'In-Progress': 'text-white-500',
    'Completed': 'text-green-600',
  };

  const animationProps = {
    initial: { opacity: 0, x: 400 },
    animate: isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 400 },
    transition: { duration: 1.0, ease: "easeOut" },
  };

  // Simplify the class handling with conditional Tailwind CSS classes
  const cardClass = `relative w-full flex flex-col justify-between px-2 py-0 rounded-lg border-2 cursor-pointer ${selected ? 'border-white' : 'border-transparent'} bg-black min-h-[15vh] md:min-h-[12vh] max-h-[15vh] md:max-h-[12vh]`;

  const descriptionStyle = {
    border: '1px solid white',
    padding: '4px',
    borderRadius: '4px',
    minHeight: '40px',
    overflow: 'hidden',
    width: 'calc(100% - 0px)',
    fontSize: 'clamp(12px, 1vw, 14px)',
    boxSizing: 'border-box', 
  };

  const subtitleStyle = {
    fontSize: 'clamp(10px, 0.9vw, 12px)', // Smaller text for subtitle
    opacity: 0.75, // Slightly fainter to distinguish from the title
    paddingTop: '2px', // Small padding top for visual separation
  };

  return (
    <motion.div 
      {...animationProps}
      className={cardClass}
      onClick={onClick}
    >
      <div className="flex justify-between items-center py-1">
        <span className="bg-white text-black rounded-md px-2 py-0" style={{ backgroundColor: color || '#000000', fontSize: '14px' }}>
          {projectId}
        </span>
        <span className={`px-2 py-0 rounded-md text-sm ${statusStyles[progressStatus]}`}>
          {progressStatus}
        </span>
      </div>
      <div className="text-center" style={{ border: '1px solid white', padding: '4px', borderRadius: '4px', minHeight: '40px', overflow: 'hidden', width: 'calc(100% - 0px)', fontSize: 'clamp(12px, 1vw, 14px)', boxSizing: 'border-box' }}>
        <p className="text-white my-0">{title}</p>
        <p className="text-white my-0" style={{ fontSize: 'clamp(10px, 0.9vw, 12px)', opacity: 0.75, paddingTop: '2px' }}>{subtitle}</p>
      </div>
      <div className="flex justify-between items-center mt-1 py-0">
        <span className="text-sm text-gray-300">{progressType}</span>
        <span className="text-sm text-gray-300">{created_ts}</span>
      </div>
    </motion.div>
  );
};

const ProgressDetails = ({ details }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({ src: '', alt: '', type: '' });

  useEffect(() => {
    details.media.forEach(url => {
      console.log('Media URL on client:', url);
    });
  }, [details.media]);

  if (typeof window === "undefined") {
    return <p>Loading...</p>;
  }

  const renderMedia = () => {
    if (!details.media || details.media.length === 0) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-full">
        {details.media.map((url, index) => {
          const isImage = /\.(jpg|jpeg|png|gif)(%3F|\\?)/i.test(url);
          const isVideo = /\.(mp4|webm|ogg)(%3F|\\?)/i.test(url);

          return (
            <div key={url} className="max-w-full">
              {isImage && (
                <Image
                  src={url}
                  alt={`Media ${index}`}
                  width={900}
                  height={600}
                  className="w-full h-auto cursor-pointer"
                  onClick={() => {
                    setSelectedMedia({ src: url, alt: `Media ${index}`, type: 'image' });
                    setIsVisible(true);
                  }}
                  onError={(e) => {
                    console.error('Error loading image:', url, e);
                  }}
                />
              )}
              {isVideo && (
                <video 
                  controls 
                  className="w-full h-auto rounded-md cursor-pointer"
                  onClick={() => {
                    setSelectedMedia({ src: url, alt: `Media ${index}`, type: 'video' });
                    setIsVisible(true);
                  }}
                >
                  <source src={url} type={`video/${url.split('.').pop()}`} />
                </video>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="progress-details bg-black bg-opacity-70 text-white rounded-lg shadow-lg mx-auto p-4" style={{ width: '95%' }}>
      <h2 className="text-md md:text-3xl font-bold text-center">{details.title}</h2>
      <p className=" text-sm md:text-lg text-center mb-3">{details.subtitle}</p>
      {renderMedia()}
      <div className="space-y-2">
        <h3 className="text-md md:text-2xl font-semibold ">Objectives</h3>
        <ul className="list-disc list-inside text-sm md:text-lg md:p-4">
          {details.objectives.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
        <h3 className="text-md md:text-2xl font-semibold">Requirements</h3>
        <ul className="list-disc list-inside text-sm md:text-lg md:p-4">
          {details.requirements.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
        <p className="text-sm md:text-lg ">{details.details}</p>
      </div>
      {isVisible && <MediaModal src={selectedMedia.src} alt={selectedMedia.alt} type={selectedMedia.type} onClose={() => setIsVisible(false)} />}
    </div>
  );
};
  
  export { ProgressCard, ProgressDetails };

  