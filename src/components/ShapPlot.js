// components/SHAPPlot.js

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import { useContainerDimensions } from '../hooks/useContainerDimensions';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const SHAPPlot = ({
  shapValues,
  shapType,
  modelType,
  hoverData,
  setHoverData,
  dateRange,
  featureColorMap,
}) => {
  const containerRef = useRef(null);
  const { width } = useContainerDimensions(containerRef);

  // Log the received shapValues
  console.log(`SHAPPlot (${modelType} - ${shapType}) shapValues:`, shapValues);

  // Defensive Coding: Check if shapValues is valid
  if (!shapValues || shapValues.length === 0) {
    console.error('No valid weeks found in the data.');
    return <div style={{ color: 'red' }}>No valid weeks found in the data.</div>;
  }

  // Ensure all entries have 'week' and 'aggregate_shap_stats'
  const hasValidWeeks = shapValues.every(item => item.week && Array.isArray(item.aggregate_shap_stats));
  if (!hasValidWeeks) {
    console.error('Invalid SHAP data structure. Each entry must have a "week" and "aggregate_shap_stats".');
    return <div style={{ color: 'red' }}>Invalid SHAP data structure.</div>;
  }

  // Extract all unique features
  const allFeatures = [...new Set(shapValues.flatMap(weekData => weekData.aggregate_shap_stats.map(stat => stat.feature)))];

  if (allFeatures.length === 0) {
    console.error('No features found in SHAP data.');
    return <div style={{ color: 'red' }}>No features found in SHAP data.</div>;
  }

  // Prepare plot data for each feature
  const plotData = allFeatures.map(feature => ({
    x: shapValues.map(item => item.week),
    y: shapValues.map(item => {
      const stat = item.aggregate_shap_stats.find(s => s.feature === feature);
      return stat ? stat.mean_shap : 0;
    }),
    type: 'scatter',
    mode: 'lines+markers',
    name: feature,
    line: { color: featureColorMap[feature] || 'blue' },
  }));

  // Log plotData for debugging
  console.log('Plot Data:', plotData);

  const layout = {
    title: {
      text: `${modelType} SHAP Values (${shapType === 'training_avg' ? 'Training Avg' : 'Test'})`,
      font: {
        color: 'white',
        size: 14,
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
    margin: { t: 50, r: 20, b: 50, l: 40 },
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
      font: {
        color: 'white',
      },
    },
  };

  const config = {
    displayModeBar: false,
    displaylogo: false,
    staticPlot: false,
    responsive: true,
  };

  const handleHover = (event) => {
    if (event.points && event.points.length > 0) {
      const point = event.points[0];
      setHoverData(point.x); // Use week for hover coordination
    }
  };

  const handleUnhover = () => {
    setHoverData(null);
  };

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        onHover={handleHover}
        onUnhover={handleUnhover}
      />
    </div>
  );
};

export default SHAPPlot;
