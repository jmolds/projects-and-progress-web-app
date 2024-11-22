// components/FeaturesPlot.js

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import { useContainerDimensions } from '../hooks/useContainerDimensions';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const FeaturesPlot = ({
  data,
  featureType,
  modelType,
  hoverData,
  setHoverData,
  dateRange,
  featureColorMap,
  signalId,
}) => {
  const containerRef = useRef(null);
  const { width } = useContainerDimensions(containerRef);

  // Extract features from data
  const featureNames = Object.keys(data[0]).filter(key => key !== 'week' && key !== signalId);

  const plotData = featureNames.map(feature => ({
    x: data.map(item => item.week),
    y: data.map(item => item[feature]),
    type: 'scatter',
    mode: 'lines',
    name: feature,
    line: { color: featureColorMap[feature] || 'blue' },
  }));

  const handleHover = (event) => {
    const point = event.points[0];
    setHoverData(point.x);
  };

  const handleUnhover = () => {
    setHoverData(null);
  };

  const layout = {
    title: {
      text: `${modelType} Features (${featureType})`,
      font: {
        color: 'white',
        size: 'clamp(12px, 1vw, 15px)',
      },
      x: 0.5,
      xanchor: 'center',
    },
    width: width,
    height: 300,
    paper_bgcolor: 'black',
    plot_bgcolor: 'black',
    xaxis: {
      range: dateRange,
      type: 'date',
      color: 'white',
      gridcolor: '#2f2f2f',
    },
    yaxis: {
      color: 'white',
      gridcolor: '#2f2f2f',
    },
    margin: { t: 30, r: 20, b: 30, l: 40 },
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
      font: {
        color: 'white',
      },
    },
    shapes: hoverData
      ? [
          {
            type: 'line',
            x0: hoverData,
            x1: hoverData,
            xref: 'x',
            y0: 0,
            y1: 1,
            yref: 'paper',
            line: {
              color: 'yellow',
              width: 1,
              dash: 'dot',
            },
          },
        ]
      : [],
  };

  const config = {
    displayModeBar: false,
    displaylogo: false,
    staticPlot: false,
    responsive: true,
  };

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <Plot
        data={plotData}
        signalId={signalId}
        // signalLabel={signalLabel}
        layout={layout}
        config={config}
        onHover={handleHover}
        onUnhover={handleUnhover}
      />
    </div>
  );
};

export default FeaturesPlot;

// import React from 'react';

// const FeaturesPlot = ({ data, signalId }) => {
//   if (!data || !Array.isArray(data) || data.length === 0) {
//     console.error("FeaturesPlot: Invalid or empty data received.");
//     return <div>No data available for plotting.</div>;
//   }

//   const featureNames = Object.keys(data[0] || {}).filter(
//     (key) => key !== "week" && key !== signalId
//   );

//   const plotData = featureNames.map((feature) => ({
//     x: data.map((item) => item.week),
//     y: data.map((item) => item[feature]),
//     name: feature,
//   }));

//   return (
//     <div>
//       <h3>Feature Plot</h3>
//       <pre>{JSON.stringify(plotData, null, 2)}</pre> {/* Debugging purpose */}
//       {/* Replace with your plotting library/component */}
//     </div>
//   );
// };

// export default FeaturesPlot;
