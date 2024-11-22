// /components/GlowingPoints.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GlowingPoints = () => {
  const glowingPointsRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(glowingPointsRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 100 100')
      .attr('preserveAspectRatio', 'xMidYMid slice'); // Ensure the SVG scales correctly without distortion

    const width = glowingPointsRef.current.clientWidth;
    const height = glowingPointsRef.current.clientHeight;

    // Dynamic values based on viewport width
    const baseNumPoints = 10; // Base number of points for a small width
    const numPoints = Math.min(Math.floor(width / 150), baseNumPoints); // Limit the number of points to avoid too many on larger screens
    const baseDuration = 15000; // Base duration for travel
    const duration = baseDuration * (width / 500); // Adjust duration based on width
    const fadeDuration = 1000;

    function createPoints(stage) {
      for (let i = 0; i < numPoints; i++) {
        const randomX = Math.random() * 100; // Generate new random x position for each point
        const initialY = Math.random() * 100; // Start at a random height for each point
        const initialOpacity = stage !== undefined ? Math.random() : 0;
        const remainingTravelDistance = initialY;
        const remainingTravelDuration = (remainingTravelDistance / 100) * duration;

        // Calculate point size to create a horizon effect
        const initialPointSize = Math.max(0.1, 0.1 + 0.3 * (initialY / 100)); // Adjust size based on initial Y position
        const finalPointSize = initialPointSize * 0.1; // Points diminish to 10% of initial size

        svg.append('circle')
          .attr('cx', randomX) // Use continuously generated random x position
          .attr('cy', initialY) // Start at different heights for initial points
          .attr('r', initialPointSize) // Dynamic circle size for horizon effect
          .attr('fill', 'white')
          .attr('opacity', initialOpacity)
          .transition()
          .duration(fadeDuration) // Faster fade-in
          .attr('opacity', 1)
          .transition()
          .duration(remainingTravelDuration) // Adjust travel duration to simulate previous travel
          .ease(d3.easeLinear) // Ensure linear movement
          .attr('cy', 0) // Move to the top
          .attr('r', finalPointSize) // Diminish to smaller size as they rise
          .attr('opacity', 0) // Fade out as they reach the top
          .remove();
      }
    }

    // Create initial points at different stages of their lifecycle
    for (let stage = 0; stage < 10; stage++) {
      createPoints(stage);
    }

    // Continue creating points at regular intervals
    const interval = setInterval(() => createPoints(), 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div ref={glowingPointsRef} className="relative w-full h-full overflow-hidden"></div>
  );
};

export default GlowingPoints;
