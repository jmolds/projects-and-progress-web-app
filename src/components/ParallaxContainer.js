import React, { useState, useEffect, useRef } from 'react';
import ParallaxSVG from './ParallaxSVG';

const sampleData = [
    { projectId: '001', color: '#6495ed', data: Array.from({length: 10}, (_, i) => ({ x: i, y: Math.random() * 100 })) },
    { projectId: '002', color: '#c97e42', data: Array.from({length: 10}, (_, i) => ({ x: i, y: Math.random() * 100 })) },
    { projectId: '003', color: '#aa8faa', data: Array.from({length: 10}, (_, i) => ({ x: i, y: Math.random() * 100 })) },
    { projectId: '004', color: '#f0c75e', data: Array.from({length: 10}, (_, i) => ({ x: i, y: Math.random() * 100 })) },
    { projectId: '005', color: '#408b8c', data: Array.from({length: 10}, (_, i) => ({ x: i, y: Math.random() * 100 })) }
];

const ParallaxContainer = () => {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef(null); // Ref for the container div
  const [containerHeight, setContainerHeight] = useState(0); // Height state

  useEffect(() => {
    // Function to update height
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setContainerHeight(height);
        // console.log('Updated Container Height:', height);
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener('resize', updateHeight); // Update on resize
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalLayers = sampleData.length;

  return (
    <div className="parallax-container" ref={containerRef}>
      {sampleData.map((item, index) => (
        <ParallaxSVG
          key={item.projectId}
          data={item.data}
          color={item.color}
          scrollFactor={-offset * 0.1 * (index + 1)}
          index={index}
          totalLayers={totalLayers}
          containerHeight={containerHeight}
        />
      ))}
    </div>
  );
};

export default ParallaxContainer;
