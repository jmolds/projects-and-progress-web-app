
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import Link from 'next/link'; 

const ProjectCard = ({
  title,
  projectId,
  color,
  isVisible,
  lastUpdate,
  description,
  videoUrl,
  projectIndex,
  onClick,
  selected,
  isExpanded,
  featuredData,
  featuredTableData = {}, // default empty object if not passed
  featuredSignalId,
  featuredSignalLabel,
}) => {
  const topTabRef = useRef(null);
  const svgContainerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({ width: 140, height: 100 });

  const projectIdForUrl = projectId.replace(/ /g, '_');

  function isValidValue(value) {
    return value !== null && value !== undefined && value !== "";
  }

  // Debugging logs to ensure props are being passed correctly
  // console.log('featuredData:', featuredData);
  // console.log('FeaturedTableData:', featuredTableData);
  // console.log('featuredSignalId:', featuredSignalId);

  const animationProps = {
    initial: { opacity: 0, x: 300 },
    animate: isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 300 },
    transition: { duration: 1.0, ease: "easeOut" },
  };

  const dynamicStyle = {
    backgroundColor: '#000000',
    height: '100%',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: '30px',
    paddingRight: '10px',
    paddingTop: '10px',
    paddingBottom: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: selected ? '2px solid #fff' : '2px solid transparent',
    position: 'relative',
  };


  const colorRectangleStyle = (position) => {
    let style = {
      backgroundColor: color,
      color: 'black',
      borderRadius: '6px',
      position: 'absolute',
      padding: '2px 6px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    };

    if (position === 'top') {
      style.top = '0';
      style.left = '0';
      style.transformOrigin = '0% 0%';
      style.transform = 'rotate(-90deg)';
    } else if (position === 'bottom') {
      style.bottom = '2px';
      style.right = '22px';
      style.transformOrigin = '100% 100%';
      style.transform = 'rotate(90deg)';
    } else if (position === 'dashboard') {
      style.bottom = '3px';
      style.left = '3px';
      style.transformOrigin = '0% 100%';
      style.transform = 'rotate(0deg)';
      style.border = '1px solid gray';
      style.borderRadius = '4px';
      style.padding = '5px 10px';
      style.cursor = selected ? 'pointer' : 'default';

      if (selected) {
        // Active state styles
        style.backgroundColor = 'black';
        style.color = 'white';
        style.borderColor = 'white';
        style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        style.transform = 'scale(1.02)';
        style.transition = 'all 0.2s ease';
      } else {
        // Inactive state styles
        style.transition = 'all 0.15s ease';
        style.backgroundColor = 'black';
        style.color = 'gray';
        style.borderColor = 'gray';
        style.boxShadow = 'none';
      }
    }

    return style;
  };

  useEffect(() => {
    const adjustTopTabPosition = () => {
      if (topTabRef.current) {
        const tab = topTabRef.current;
        const tabRect = tab.getBoundingClientRect();
        const leftPosition = 2;
        const topPosition = tabRect.height + 2;
        tab.style.left = `${leftPosition}px`;
        tab.style.top = `${topPosition}px`;
      }
    };

    adjustTopTabPosition();
    window.addEventListener('resize', adjustTopTabPosition);
    return () => window.removeEventListener('resize', adjustTopTabPosition);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === svgContainerRef.current) {
          const { width, height } = entry.contentRect;
          setSvgDimensions({ width, height });
        }
      }
    });

    const currentRef = svgContainerRef.current;
    if (currentRef) {
      resizeObserver.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
    };
  }, []);

  const descriptionStyle = {
    border: '1px solid white',
    padding: '1%',
    margin: '5px 0',
    borderRadius: '4px',
    minHeight: '75px',
    maxHeight: '75px',
    overflow: 'hidden',
    width: 'calc(100% - 0px)',
    marginLeft: '-5px',
    alignContent: 'center',
    fontSize: 'clamp(12px, 1vw, 15px)',
  };

  const featuredDataFigureStyle = {
    border: '1px solid gray',
    width: '100%',
    height: '140px',
    margin: '-5px 5px 0px 0px',
    borderRadius: '8px',
    marginRight: '20px',
    overflow: 'hidden',
  };

  const tableContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: '-30px',
    width: 'calc(100% + 0px)',
  };
  
  const createSvgPath = () => {
    if (!featuredData || featuredData.length === 0) {
      // Create a default flat line if no data is available
      const defaultY = svgDimensions.height * 0.5; // Adjust this multiplier to position the line vertically within the SVG
      const defaultPath = `M 0,${defaultY} L ${svgDimensions.width},${defaultY}`;
      return (
        <>
          <path d={defaultPath} stroke={color} strokeWidth="2" fill="none" />
          <path d={`M0,${svgDimensions.height} L${svgDimensions.width},${svgDimensions.height} L${svgDimensions.width},${defaultY} L0,${defaultY} Z`} fill={color} fillOpacity="0.3" />
        </>
      );
    }
  
    // Finding indices to handle alignment and rendering correctly
    const firstNonNullIndex = featuredData.findIndex(d => d[featuredSignalId] !== null);
    const lastSignalIndex = featuredData.length - 1 - [...featuredData].reverse().findIndex(d => d[featuredSignalId] !== null);

        // Collect all Y values from the data
    const yValues = featuredData.flatMap(d => [
      d[featuredSignalId],
      d.baseline_forecast,
      d.enhanced_forecast
    ]).filter(v => v != null);

    // Calculate min and max Y values
    const minY = d3.min(yValues);
    const maxY = d3.max(yValues);

    // Add padding to Y values
    const yPadding = (maxY - minY) * 0.05; // Adjust the multiplier as needed
    const adjustedMinY = minY - yPadding;
    const adjustedMaxY = maxY + yPadding;

    // Update the yScale to use the new domain
    const yScale = d3.scaleLinear()
      .domain([adjustedMinY, adjustedMaxY])
      .range([svgDimensions.height, 0]);

  
    // Scales for the graph
    const xScale = d3.scaleLinear()
      .domain([0, featuredData.length - 1])
      .range([0, svgDimensions.width]);
  
    // const yScale = d3.scaleLinear()
    //   .domain([0, d3.max(featuredData, d => Math.max(d[featuredSignalId] || 0, d.baseline_forecast || 0, d.enhanced_forecast || 0))])
    //   .range([svgDimensions.height, 0]);
  
    // Helper function to generate lines with consistent behavior
    const lineGenerator = (dataField, definedCheck) => d3.line()
      .defined((d, i) => i >= firstNonNullIndex && definedCheck(d))
      .x((d, i) => xScale(i))
      .y(d => yScale(d[dataField]))
      .curve(d3.curveMonotoneX);
  
    // Specific line generators
    const lineSignal = lineGenerator(featuredSignalId, d => d[featuredSignalId] !== null);
    const lineBaseline = lineGenerator('baseline_forecast', d => d.baseline_forecast !== null);
    const lineEnhanced = lineGenerator('enhanced_forecast', d => d.enhanced_forecast !== null);
  
    // Area under the signal line
    const areaSignal = d3.area()
      .defined((d, i) => i >= firstNonNullIndex && d[featuredSignalId] !== null)
      .x((d, i) => xScale(i))
      .y0(svgDimensions.height)
      .y1(d => yScale(d[featuredSignalId]))
      .curve(d3.curveMonotoneX);
  
    return (
      <>
        <path d={areaSignal(featuredData)} fill={color} opacity="0.3" />
        <path d={lineSignal(featuredData)} stroke={color} fill="none" strokeWidth="2" />
        <path d={lineBaseline(featuredData)} stroke="white" fill="none" strokeWidth="1" opacity="0.5" />
        <path d={lineEnhanced(featuredData)} stroke="white" fill="none" strokeWidth="2" opacity="0.8" />
  
        {/* Circles for last valid data points */}
        <circle
          cx={xScale(lastSignalIndex)}
          cy={yScale(featuredData[lastSignalIndex][featuredSignalId])}
          r={5}
          fill={color}
        />
        {isValidValue(featuredData[lastSignalIndex].baseline_forecast) && (
          <circle
            cx={xScale(lastSignalIndex)}
            cy={yScale(featuredData[lastSignalIndex].baseline_forecast)}
            r={5}
            fill="white"
            opacity="0.5"
          />
        )}
        {isValidValue(featuredData[lastSignalIndex].enhanced_forecast) && (
          <circle
            cx={xScale(lastSignalIndex)}
            cy={yScale(featuredData[lastSignalIndex].enhanced_forecast)}
            r={5}
            fill="white"
            opacity="0.8"
          />
        )}
      </>
    );
  };
    
  
  const trunTwoDec = (value) => {
    if (value === null || value === "" || isNaN(value)) return "";
    return parseFloat(value).toFixed(2);
  };
  
  const formatPercentage = (value) => {
    if (value === null || value === "" || isNaN(value)) return "";
    const formatted = parseFloat(value).toFixed(2);
    // Check if the value starts with "0." or "-0."
    if (formatted.startsWith("0.")) {
      return formatted.slice(1); // Removes leading 0 for positive values
    } else if (formatted.startsWith("-0.")) {
      return "-" + formatted.slice(2); // Removes leading 0 for negative values
    }
    return formatted; // No need to modify if it doesn't start with "0." or "-0."
  };
  
  
  
  // Default structure for featuredDataTable if not provided
  const defaultFeaturedDataTable = {
  'Forecast Weeks N': null,
    signal: {
      sd: null,
      runningMean: null,
      percentDiffRunningVsFourWeek: null,
      fourWeekRollingMean: null,
      percentDiffFourWeekVsLast: null,
      lastWeek: null,
      currentWeek: null,
    },
    baseline: {
      rmse: null,
      runningMean: null,
      percentDiffRunningVsFourWeek: null,
      fourWeekRollingMean: null,
      percentDiffFourWeekVsLast: null,
      lastWeek: null,
      currentWeek: null,
    },
    enhanced: {
      rmse: null,
      runningMean: null,
      percentDiffRunningVsFourWeek: null,
      fourWeekRollingMean: null,
      percentDiffFourWeekVsLast: null,
      lastWeek: null,
      currentWeek: null,
    },
  };

  // Merge the default values with the actual FeaturedTableData
  const finalDataTable = { ...defaultFeaturedDataTable, ...featuredTableData };
  // console.log('finalDataTable:', finalDataTable); // Debugging

  const forecastWeeksN = finalDataTable['Forecast Weeks N'];
  const currentWeekStartDate = finalDataTable["Current Week Date"]
  const lastWeekStartDate = finalDataTable["Last Week Date"]
  

  return (
    <motion.div 
      {...animationProps}
      style={dynamicStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >  
      <div ref={topTabRef} style={colorRectangleStyle('top')}>
        {projectId}
      </div>

      <h3 style={{ paddingRight: '7px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="text-lg font-bold text-right w-full">
    {title}
</h3>


      {/* <div style={descriptionStyle} className="card-description" >
        <p className="description-text">{description}</p>
      </div> */}
      <div style={descriptionStyle} className="card-description" >
  <p className="description-text">
    {description}
    {projectId === 'WEB DEV' && (
      <>
        {' '}
        {selected ? (
          <a
            href="https://github.com/jmolds/projects-and-progress2"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: color , textDecoration: 'underline'}}
          >
            [Code Repo]
          </a>
        ) : (
          <span style={{ color: color }}>
            [Code Repo]
          </span>
        )}
      </>
    )}
  </p>
</div>

      <h1 style={{ marginLeft: '-10px' }} className="text-md font-bold text-left w-full pb-1">
        Featured Signal: {featuredSignalLabel}
      </h1>
      <div style={featuredDataFigureStyle} className="text-sm" ref={svgContainerRef}> 
        <svg width={svgDimensions.width} height={svgDimensions.height} >
          {createSvgPath()}
        </svg>
      </div>
      
      <div>
  <table className="stats-table">
    <thead>
      <tr>
        <th></th> {/* This will be the dot column */}
        <th>Forecast Weeks N={forecastWeeksN}</th>
        <th>Running Avg</th>
        <th>% Diff</th>
        <th>3-Week Avg</th>
        <th>% Diff</th>
        <th>{lastWeekStartDate} Last Week</th>
        <th>{currentWeekStartDate} Current Week</th>
      </tr>
    </thead>
    <tbody>
      {/* Signal Values Row */}
      <tr>
        <td className="dot-column">
          <svg width="10" height="10" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <circle cx="5" cy="5" r="5" fill={color} />
          </svg>
          {featuredSignalLabel}
        </td>
        <td>SD: {trunTwoDec(finalDataTable.signal.sd)}</td>
        <td>{trunTwoDec(finalDataTable.signal["Running Mean"])}</td>
        <td>{formatPercentage(finalDataTable.signal["% diff [Running Mean vs 3-week Rolling Mean]"])}</td>
        <td>{trunTwoDec(finalDataTable.signal["3-Week Rolling Mean"])}</td>
        <td>{formatPercentage(finalDataTable.signal["% diff [3-week Rolling Mean vs t-1]"])}</td>
        <td>{trunTwoDec(finalDataTable.signal["Last Week t-1"])}</td>
        <td>{trunTwoDec(finalDataTable.signal["Current Week"])}</td>
      </tr>

      {/* Baseline Forecasts Row */}
      <tr>
        <td className="dot-column">
          <svg width="10" height="10" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <circle cx="5" cy="5" r="5" fill="white" opacity="0.5" />
          </svg>
          Baseline Forecasts
        </td>
        <td>RMSE: {trunTwoDec(finalDataTable.baseline.rmse)}</td>
        <td>{trunTwoDec(finalDataTable.baseline["Running Mean"])}</td>
        <td>{formatPercentage(finalDataTable.baseline["% diff [Running Mean vs 3-week Rolling Mean]"])}</td>
        <td>{trunTwoDec(finalDataTable.baseline["3-Week Rolling Mean"])}</td>
        <td>{formatPercentage(finalDataTable.baseline["% diff [3-week Rolling Mean vs t-1]"])}</td>
        <td>{trunTwoDec(finalDataTable.baseline["Last Week t-1"])}</td>
        <td>{trunTwoDec(finalDataTable.baseline["Current Week"])}</td>
      </tr>

      {/* Enhanced Forecasts Row */}
      <tr>
        <td className="dot-column">
          <svg width="10" height="10" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}>
            <circle cx="5" cy="5" r="5" fill="white" opacity="0.8" />
          </svg>
          Enhanced Forecasts
        </td>
        <td>RMSE: {trunTwoDec(finalDataTable.enhanced.rmse)}</td>
        <td>{trunTwoDec(finalDataTable.enhanced["Running Mean"])}</td>
        <td>{formatPercentage(finalDataTable.enhanced["% diff [Running Mean vs 3-week Rolling Mean]"])}</td>
        <td>{trunTwoDec(finalDataTable.enhanced["3-Week Rolling Mean"])}</td>
        <td>{formatPercentage(finalDataTable.enhanced["% diff [3-week Rolling Mean vs t-1]"])}</td>
        <td>{trunTwoDec(finalDataTable.enhanced["Last Week t-1"])}</td>
        <td>{trunTwoDec(finalDataTable.enhanced["Current Week"])}</td>
      </tr>
    </tbody>
  </table>
</div>



      <div style={colorRectangleStyle('bottom')}>
        {projectId}
      </div>

      {/* Modified 'Go To Dashboard' button */}
      {selected ? (
        <Link href={`/dashboard/${projectIdForUrl}?color=${encodeURIComponent(color)}`}>
          <div
            style={colorRectangleStyle('dashboard')}
            onClick={(event) => event.stopPropagation()} // Prevent parent onClick
          >
            Go To Dashboard
          </div>
        </Link>
      ) : (
        <div style={colorRectangleStyle('dashboard')}>
          Go To Dashboard
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;

  //   // Navigate to the dashboard page with color as a query parameter
  //   router.push({
  //     pathname: `/dashboard/${projectId}`,
  //     query: { color: color },
  //   });
  // }
