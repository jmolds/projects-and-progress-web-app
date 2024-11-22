import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ParallaxSVG = ({ data, color, index, totalLayers, containerHeight }) => {
  const svgRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.pageYOffset);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();  // Clear the SVG

    const width = svgRef.current.clientWidth;
    const individualHeight = containerHeight / totalLayers;

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([individualHeight, 0]);

    const area = d3.area()
      .x(d => xScale(d.x))
      .y0(individualHeight)  // Start from the top of the layer segment
      .y1(d => yScale(d.y))  // Data points define the lower boundary
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', color)
      .attr('stroke', 'none')
      .attr('d', area);

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.append('rect')
      .attr('x', 0)
      .attr('y', individualHeight - 1)
      .attr('width', width)
      .attr('height', containerHeight - individualHeight + 1)
      .attr('fill', color)
      .attr('opacity', 1.0)
      .attr('stroke', 'none');

  }, [data, color, index, totalLayers, containerHeight, scrollOffset]);

  const baseTop = (index / totalLayers) * 100;
  // Increasing the rate of movement for both upward and downward motion
  const dynamicShift = -((scrollOffset / 25) * (index + 1) / totalLayers) + (scrollOffset / 50);

  return (
    <svg ref={svgRef} className="svg-layer" style={{ 
        width: '100%',
        height: '100%',  // Each SVG uses the full container height
        position: 'absolute',
        top: `${baseTop + dynamicShift}%`,  // Dynamic top position based on scroll
        zIndex: index + 1  // Reverse layer order so bottom layers are in front
      }}
    ></svg>
  );
};

export default ParallaxSVG;
