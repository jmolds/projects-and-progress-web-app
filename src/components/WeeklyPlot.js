import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const WeeklyPlot = ({
  data,
  config,
  layout,
  width,
  height,
  color,
  forecastColor = "white",
  featuredSignalId = 'weekly_usage_hours',
  featuredSignalLabel = 'Usage Hours'
}) => {
  const [annotations, setAnnotations] = useState([]);
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPhone(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute the min and max week for the x-axis range
  const minWeek = Math.min(...data.map(item => new Date(item.week).getTime())) - 604800000; // Subtract one week in milliseconds
  const maxWeek = Math.max(...data.map(item => new Date(item.week).getTime())) + 604800000; // Add one week in milliseconds

  // Collect all Y values from the data
  const yValues = [];

  data.forEach(item => {
    if (item[featuredSignalId] != null) yValues.push(item[featuredSignalId]);
    if (item.baseline_forecast != null) yValues.push(item.baseline_forecast);
    if (item.enhanced_forecast != null) yValues.push(item.enhanced_forecast);
  });

  // Calculate min and max Y values
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Add padding to Y values
  let yPadding = (maxY - minY) * 0.1; // 10% padding

  // Handle cases where all Y values are the same
  if (maxY - minY === 0) {
    yPadding = maxY * 0.1 || 1; // Default to 1 if maxY is zero
  }

  const adjustedMinY = minY - yPadding;
  const adjustedMaxY = maxY + yPadding;

  const plotData = [
    {
      x: data.map(item => item.week),
      y: data.map(item => item[featuredSignalId]),
      text: data.map(item => item.description),
      type: 'scatter',
      mode: 'lines+markers',
      fill: 'tozeroy',
      hoverinfo: 'text',
      marker: { color: color },
      line: { color: color },
      showlegend: false
    },
    {
      x: data.map(item => item.week),
      y: data.map(item => item.baseline_forecast),
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: `rgba(255, 255, 255, 0.3)` },
      marker: { color: `rgba(255, 255, 255, 0.3)` },
      hoverinfo: 'text',
      showlegend: false,
    },
    {
      x: data.map(item => item.week),
      y: data.map(item => item.enhanced_forecast),
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: `rgba(255, 255, 255, 0.6)` },
      marker: { color: `rgba(255, 255, 255, 0.6)` },
      hoverinfo: 'text',
      showlegend: false,
    }
  ];

  const handleHover = (event) => {
    const point = event.points[0];
    const xval = point.x;
    const yval = point.y;

    let xOffset = xval === data[0].week ? 20 : xval === data[data.length - 1].week ? -20 : 0;
    let xAnchor = xval === data[0].week ? 'left' : xval === data[data.length - 1].week ? 'right' : 'center';

    setAnnotations([
      {
        x: xval,
        y: 0,
        xref: 'x',
        yref: 'paper',
        text: `${xval}`,
        showarrow: false,
        ax: 0,
        ay: 30,
        xanchor: xAnchor,
        bgcolor: color,
        font: { color: 'black' },
      },
      {
        x: 0,
        y: yval,
        xref: 'paper',
        yref: 'y',
        text: `${yval.toFixed(2)}`,
        showarrow: false,
        ax: -30,
        ay: 30,
        yanchor: 'bottom',
        bgcolor: color,
        font: { color: 'black' },
      }
    ]);
  };

  const customLayout = {
    ...layout,
    title: {
      text: featuredSignalLabel,
      font: {
        color: 'white',
        size: 'clamp(12px, 1vw, 15px)',
      },
      x: 0.5,
      xanchor: 'center',
      y: 0.9,
      yanchor: 'top',
      pad: { t: 0, r: 0, b: 0, l: 0 }
    },
    annotations: annotations,
    width: width,
    height: height,
    paper_bgcolor: 'black',
    plot_bgcolor: 'black',
    hoverlabel: {
      bgcolor: 'black',
      font: {
        color: 'white',
        size: isPhone ? 8 : 12,
      }
    },
    xaxis: {
      range: [minWeek, maxWeek],
      type: 'date',
      color: 'white',
      gridcolor: '#2f2f2f',
    },
    yaxis: {
      color: 'white',
      gridcolor: '#2f2f2f',
      range: [adjustedMinY, adjustedMaxY], // Set the Y-axis range here
    },
    margin: { t: 30, r: 20, b: 30, l: 22 },
    showlegend: false
  };

  const customConfig = {
    ...config,
    displayModeBar: false,
    displaylogo: false,
    staticPlot: false,
  };

  return (
    <Plot
      data={plotData}
      layout={customLayout}
      config={customConfig}
      onHover={handleHover}
    />
  );
};

export default WeeklyPlot;
