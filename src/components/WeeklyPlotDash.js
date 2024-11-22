// components/WeeklyPlotDash.js

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import { useContainerDimensions } from '../hooks/useContainerDimensions';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const WeeklyPlotDash = ({
  data,
  color,
  featuredSignalId = 'weekly_usage_hours',
  featuredSignalLabel = 'Usage Hours',
  hoverData,
  setHoverData,
  dateRange,
}) => {
  const containerRef = useRef(null);
  const { width } = useContainerDimensions(containerRef);

  // Prepare Plotly data and layout
  const yValues = [];
  data.forEach((item) => {
    if (item[featuredSignalId] != null) yValues.push(item[featuredSignalId]);
    if (item.baseline != null) yValues.push(item.baseline);
    if (item.enhanced != null) yValues.push(item.enhanced);
  });

  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  let yPadding = (maxY - minY) * 0.1;
  if (maxY - minY === 0) yPadding = maxY * 0.1 || 1;
  const adjustedMinY = minY - yPadding;
  const adjustedMaxY = maxY + yPadding;

  const plotData = [
    {
      x: data.map((item) => item.week),
      y: data.map((item) => item[featuredSignalId]),
      text: data.map((item) => item.description),
      type: 'scatter',
      mode: 'lines+markers',
      fill: 'tozeroy',
      hovertemplate: '%{x}<br>%{text}<extra></extra>',
      marker: { color: color },
      line: { color: color },
      connectgaps: false,
      showlegend: false,
    },
    {
      x: data.map((item) => item.week),
      y: data.map((item) => item.baseline),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Baseline Forecast',
      line: { color: 'rgba(255, 255, 255, 0.3)' },
      marker: { color: 'rgba(255, 255, 255, 0.3)' },
      connectgaps: false,
      showlegend: true,
    },
    {
      x: data.map((item) => item.week),
      y: data.map((item) => item.enhanced),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Enhanced Forecast',
      line: { color: 'rgba(255, 255, 255, 0.6)' },
      marker: { color: 'rgba(255, 255, 255, 0.6)' },
      connectgaps: false,
      showlegend: true,
    },
  ];

  const layout = {
    title: {
      text: featuredSignalLabel,
      font: {
        color: 'white',
        size: 'clamp(12px, 1vw, 15px)',
      },
      x: 0.5,
      xanchor: 'center',
    },
    width: width,
    height: 300,
    responsive: true,
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
      range: [adjustedMinY, adjustedMaxY],
    },
    margin: { t: 30, r: 20, b: 30, l: 40 },
    showlegend: false,
  };

  const config = {
    displayModeBar: false,
    displaylogo: false,
    staticPlot: false,
    responsive: true,
  };

  return (
    <div className="weekly-plot-dash" ref={containerRef} style={{ width: '100%' }}>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        onHover={(event) => setHoverData(event.points[0].x)}
        onUnhover={() => setHoverData(null)}
      />
    </div>
  );
};

export default WeeklyPlotDash;
