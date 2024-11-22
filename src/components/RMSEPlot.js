import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const RMSEPlot = ({ data, height, hoverData, setHoverData, dateRange }) => {
  const plotRef = useRef(null); // Reference to the Plot component
  const containerRef = useRef(null); // Reference to the parent container
  const [containerWidth, setContainerWidth] = useState(0);

  // Monitor container width and update dynamically
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Debugging: Log parent container width
  useEffect(() => {
    console.log('Parent container width (middle):', containerWidth);
  }, [containerWidth]);

  // Prepare Plotly data
  const weeks = data.map((item) => item.week);

  const plotData = [
    {
      x: weeks,
      y: data.map((item) => item.baselineRMSE),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Baseline RMSE',
      line: { color: 'rgba(255, 255, 255, 0.3)' },
      marker: { color: 'rgba(255, 255, 255, 0.3)' },
      connectgaps: false,
    },
    {
      x: weeks,
      y: data.map((item) => item.enhancedRMSE),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Enhanced RMSE',
      line: { color: 'rgba(255, 255, 255, 0.6)' },
      marker: { color: 'rgba(255, 255, 255, 0.6)' },
      connectgaps: false,
    },
  ];

  const handleHover = (event) => {
    const point = event.points[0];
    setHoverData(point.x);
  };

  const handleUnhover = () => {
    setHoverData(null);
  };

  const layout = {
    title: {
      text: '',
      font: {
        color: 'white',
        size: 'clamp(12px, 1vw, 15px)',
      },
      x: 0.5,
      xanchor: 'center',
    },
    width: containerWidth, // Dynamically set width based on container
    height: height,
    responsive: true, // Ensure responsiveness
    paper_bgcolor: 'black',
    plot_bgcolor: 'black',
    hoverlabel: {
      bgcolor: 'black',
      font: {
        color: 'white',
        size: 12,
      },
    },
    xaxis: {
      range: dateRange,
      type: 'date',
      color: 'white',
      gridcolor: '#2f2f2f',
    },
    yaxis: {    
      color: 'white',
      gridcolor: '#2f2f2f',
      title: 'RMSE (error)',
    },
    margin: { t: 10, r: 10, b: 30, l: 40 },
    showlegend: false,
  };

  const config = {
    displayModeBar: false,
    displaylogo: false,
    staticPlot: false,
  };

  return (
    <div className="middle w-full" ref={containerRef} style={{ height: '100%' }}>
      <Plot
        ref={plotRef}
        data={plotData}
        layout={layout}
        config={config}
        onHover={handleHover}
        onUnhover={handleUnhover}
      />
    </div>
  );
};

export default RMSEPlot;
