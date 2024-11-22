// // components/SignalSection.js

// import { useState, useEffect, useRef } from 'react';
// import dynamic from 'next/dynamic';
// import FeaturedTable from './FeaturedTable';

// const WeeklyPlotDash = dynamic(() => import('./WeeklyPlotDash'), { ssr: false });
// const RMSEPlot = dynamic(() => import('./RMSEPlot'), { ssr: false });
// const FeaturesPlot = dynamic(() => import('./FeaturesPlot'), { ssr: false });
// const SHAPPlot = dynamic(() => import('./SHAPPlot'), { ssr: false });

// const SignalSection = ({ signalId, projectId, signalData, color }) => {
//   const [data, setData] = useState(null);
//   const [hoverData, setHoverData] = useState(null);
//   const [dateRange, setDateRange] = useState(null);
//   const [featureColorMap, setFeatureColorMap] = useState({});
//   const [showBaseline, setShowBaseline] = useState(true);
//   const [showEnhanced, setShowEnhanced] = useState(true);
//   const [featureType, setFeatureType] = useState('scaled');
//   const [shapType, setShapType] = useState('training_avg');

//   const leftRef = useRef(null);
//   const rightRef = useRef(null);
//   const [maxHeight, setMaxHeight] = useState(0);

//   useEffect(() => {
//     if (signalData) {
//       setData(signalData['weekly_usage_hours_with_forecasts']);
//       const weeks = signalData['weekly_usage_hours_with_forecasts'].map(item => new Date(item.week));
//       const minDate = new Date(Math.min(...weeks));
//       const maxDate = new Date(Math.max(...weeks));
//       setDateRange([minDate.toISOString().split('T')[0], maxDate.toISOString().split('T')[0]]);

//       const baselineFeatureData = signalData[`baseline_weekly_usage_hours_df_scaled_baseline`];
//       if (baselineFeatureData && baselineFeatureData.length > 0) {
//         const featureNames = Object.keys(baselineFeatureData[0]).filter(
//           key => key !== 'week' && key !== 'weekly_usage_hours'
//         );
//         const colorPalette = [
//           '#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb',
//           '#b5ead7', '#c7ceea', '#f6d6ad', '#f6ead4',
//           '#f0efef', '#b8d5cd', '#c9c9ff', '#e4c1f9',
//           '#cfcfe6', '#c2f0fc', '#a0ced9', '#f0b7a4',
//           '#f7d8ba', '#d5c6e0', '#f0e1f0', '#d4bac0'
//         ];
//         const featureColorMap = {};
//         featureNames.forEach((feature, index) => {
//           featureColorMap[feature] = colorPalette[index % colorPalette.length];
//         });
//         setFeatureColorMap(featureColorMap);
//       }
//     }
//   }, [signalData]);

//   // Synchronize the heights of the left and right components
//   useEffect(() => {
//     const updateMaxHeight = () => {
//       const leftHeight = leftRef.current ? leftRef.current.scrollHeight : 0;
//       const rightHeight = rightRef.current ? rightRef.current.scrollHeight : 0;
//       const contentHeights = [leftHeight, rightHeight, 200]; // Include 220px as a cap
//       setMaxHeight(Math.min(Math.max(...contentHeights), 200));
//     };
  
//     updateMaxHeight();
  
//     window.addEventListener('resize', updateMaxHeight);
//     return () => window.removeEventListener('resize', updateMaxHeight);
//   }, []);

//   if (!data || !signalData) {
//     return <div>Loading...</div>;
//   }

//   const baselineFeatureData = signalData[`baseline_weekly_usage_hours_df_${featureType}_baseline`];
//   const enhancedFeatureData = signalData[`enhanced_weekly_usage_hours_df_${featureType}_enhanced`];

//   const baselineShapData = shapType === 'training_avg'
//     ? signalData[`baseline_aggregate_shap_stats`]
//     : signalData[`baseline_shap_values_test`];
//   const enhancedShapData = shapType === 'training_avg'
//     ? signalData[`enhanced_aggregate_shap_stats`]
//     : signalData[`enhanced_shap_values_test`];

//   return (
//     <section className="signal-section">
//       {/* Outer container with project color border */}
//       <div
//         style={{
//           border: `3px solid ${color}`,
//           borderRadius: '10px',
//           padding: '5px',
//           marginBottom: '10px',
//         }}
//       >
//         {/* Header Section */}
//         <div
//           className="header grid"
//           style={{
//             display: 'grid',
//             gridTemplateColumns: '200px 2fr 520px',
//             gap: '10px',
//             alignItems: 'center',
//             maxHeight: '200px', // Set the max height here
//           }}
//         >
//           {/* Left: Condensed Labels */}
//           <div ref={leftRef} className="left-labels content-evenly" style={{ fontSize: '12px', height: '100%' }}>
//             <h2 style={{ marginBottom: '10px', fontSize: '14px' }}>Signal: {signalId}</h2>
//             <div className="toggle-section" style={{ marginBottom: '5px' }}>
//               <span>Models: </span>
//               <button
//                 className={showBaseline ? 'active' : ''}
//                 onClick={() => setShowBaseline(!showBaseline)}
//                 style={{ marginLeft: '5px', fontSize: '10px', height: '100%',  padding: '3px 5px' }}
//               >
//                 Baseline
//               </button>
//               <button
//                 className={showEnhanced ? 'active' : ''}
//                 onClick={() => setShowEnhanced(!showEnhanced)}
//                 style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
//               >
//                 Enhanced
//               </button>
//             </div>
//             <div className="toggle-section" style={{ marginBottom: '5px' }}>
//               <span>Features: </span>
//               <button
//                 className={featureType === 'orig' ? 'active' : ''}
//                 onClick={() => setFeatureType('orig')}
//                 style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
//               >
//                 Orig
//               </button>
//               <button
//                 className={featureType === 'scaled' ? 'active' : ''}
//                 onClick={() => setFeatureType('scaled')}
//                 style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
//               >
//                 Scaled
//               </button>
//             </div>
//             <div className="toggle-section">
//               <span>SHAP Values: </span>
//               <button
//                 className={shapType === 'training_avg' ? 'active' : ''}
//                 onClick={() => setShapType('training_avg')}
//                 style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
//               >
//                 Training Avg
//               </button>
//               <button
//                 className={shapType === 'test' ? 'active' : ''}
//                 onClick={() => setShapType('test')}
//                 style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
//               >
//                 Test
//               </button>
//             </div>
//           </div>

//           {/* Middle: RMSE Over Time */}
//           <div className="middle w-full">
//             <RMSEPlot
//               data={data}
//               hoverData={hoverData}
//               setHoverData={setHoverData}
//               dateRange={dateRange}
//               height={maxHeight}
//             />
//           </div>

//           {/* Right: Featured Stats */}
//           <div
//             ref={rightRef}
//             className="right-side"
//             style={{
//               width: '100%',
//               height: '200px',
//               overflow: 'auto',
//             }}
//           >
//             <FeaturedTable
//               signalData={signalData}
//               color={color}
//               featuredSignalLabel=""
//             />
//           </div>
//         </div>

//         {/* Weekly Plot Section */}
//         <div
//           style={{
//             padding: '10px',
//             marginBottom: '20px',
//             width: '100%',
//           }}
//         >
//           <WeeklyPlotDash
//             data={data}
//             color={color}
//             featuredSignalId={signalId}
//             featuredSignalLabel={'Weekly Usage Hours'}
//             hoverData={hoverData}
//             setHoverData={setHoverData}
//             dateRange={dateRange}
//           />
//         </div>

//         {/* Baseline and Enhanced Plots */}
//         {showBaseline && (
//           <div
//             style={{
//               border: '2px solid rgba(255,255,255,0.5)',
//               borderRadius: '10px',
//               padding: '10px',
//               marginBottom: '20px',
//             }}
//           >
//             {/* Baseline Feature Plot */}
//             <div style={{ marginBottom: '2px', width: '100%' }}>
//               <FeaturesPlot
//                 data={baselineFeatureData}
//                 featureType={featureType}
//                 modelType="Baseline"
//                 hoverData={hoverData}
//                 setHoverData={setHoverData}
//                 dateRange={dateRange}
//                 featureColorMap={featureColorMap}
//               />
//             </div>
//             {/* Baseline SHAP Plot */}
//             <div style={{ width: '100%' }}>
//               <SHAPPlot
//                 shapValues={baselineShapData}
//                 shapType={shapType}
//                 modelType="Baseline"
//                 featureColorMap={featureColorMap}
//               />
//             </div>
//           </div>
//         )}

//         {showEnhanced && (
//           <div
//             style={{
//               border: '2px solid rgba(255,255,255,0.8)',
//               borderRadius: '10px',
//               padding: '10px',
//               marginBottom: '20px',
//             }}
//           >
//             {/* Enhanced Feature Plot */}
//             <div style={{ marginBottom: '20px', width: '100%' }}>
//               <FeaturesPlot
//                 data={enhancedFeatureData}
//                 featureType={featureType}
//                 modelType="Enhanced"
//                 hoverData={hoverData}
//                 setHoverData={setHoverData}
//                 dateRange={dateRange}
//                 featureColorMap={featureColorMap}
//               />
//             </div>
//             {/* Enhanced SHAP Plot */}
//             <div style={{ width: '100%' }}>
//               <SHAPPlot
//                 shapValues={enhancedShapData}
//                 shapType={shapType}
//                 modelType="Enhanced"
//                 featureColorMap={featureColorMap}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default SignalSection;




// components/SignalSection.js

import { useState, useEffect, useRef, useCallback , useMemo} from 'react';
import dynamic from 'next/dynamic';
import FeaturedTable from './FeaturedTable';

const WeeklyPlotDash = dynamic(() => import('./WeeklyPlotDash'), { ssr: false });
const RMSEPlot = dynamic(() => import('./RMSEPlot'), { ssr: false });
const FeaturesPlot = dynamic(() => import('./FeaturesPlot'), { ssr: false });
const SHAPPlot = dynamic(() => import('./ShapPlot'), { ssr: false });

const SignalSection = ({ signalId, projectId, signalData, signalLabel, color }) => {
  // State Hooks
  const [data, setData] = useState(null);
  const [hoverData, setHoverData] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [featureColorMap, setFeatureColorMap] = useState({});
  const [showBaseline, setShowBaseline] = useState(true);
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [featureType, setFeatureType] = useState('scaled');
  const [shapType, setShapType] = useState('training_avg');

  // Refs
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // State for maxHeight
  const [maxHeight, setMaxHeight] = useState(0);

  /**
   * Function to process SHAP data
   * @param {string} modelType - 'baseline' or 'enhanced'
   * @returns {Array} - Processed SHAP data
   */


  
const processShapData = useCallback(
  (modelType) => {
    const shapData = signalData[`${modelType}_shap_data`];
    const usageData = signalData[`${signalId}_with_forecasts`];

    if (!shapData || shapData.length === 0) {
      console.warn(`No shapData found for modelType: ${modelType}`);
      return [];
    }

    if (!usageData || usageData.length === 0) {
      console.warn(`No usageData found.`);
      return [];
    }

    // Create a map from week to shapData
    const shapMap = new Map();
    shapData.forEach((item) => {
      if (item.week) {
        shapMap.set(item.week, item);
      } else {
        console.warn(`Missing 'week' in ${modelType} shap data item:`, item);
      }
    });

    // Iterate over usageData and find corresponding shapData by week
    return usageData
      .map((usageItem) => {
        const week = usageItem.week;
        if (!week) {
          console.warn('Missing week in usageData item:', usageItem);
          return null;
        }
        const shapItem = shapMap.get(week);
        if (!shapItem) {
          console.warn(`No shapData found for week: ${week} in modelType: ${modelType}`);
          return null;
        }

        if (shapType === 'training_avg') {
          return {
            week: week,
            aggregate_shap_stats: Object.entries(shapItem.meanTrainingShap).map(([feature, mean_shap]) => ({
              feature,
              mean_shap,
            })),
          };
        } else {
          return {
            week: week,
            aggregate_shap_stats: Object.entries(shapItem.testShapValues).map(([feature, shap_value]) => ({
              feature,
              mean_shap: shap_value,
            })),
          };
        }
      })
      .filter((item) => item !== null); // Remove null entries
  },
  [signalData, signalId, shapType] // Dependencies
);


  // Effect to set data and featureColorMap
  useEffect(() => {
    if (signalData) {
      setData(signalData[`${signalId}_with_forecasts`]);
      const weeks = signalData[`${signalId}_with_forecasts`].map(item => new Date(item.week));
      const minDate = new Date(Math.min(...weeks));
      const maxDate = new Date(Math.max(...weeks));
      setDateRange([minDate.toISOString().split('T')[0], maxDate.toISOString().split('T')[0]]);

      // Process feature color map
      const baselineFeatureData = signalData[`${signalId}_df_scaled_baseline`];
      if (baselineFeatureData && baselineFeatureData.length > 0) {
        const featureNames = Object.keys(baselineFeatureData[0]).filter(
          key => key !== 'week' && key !== signalId
        );
        const colorPalette = [
          '#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb',
          '#b5ead7', '#c7ceea', '#f6d6ad', '#f6ead4',
          '#f0efef', '#b8d5cd', '#c9c9ff', '#e4c1f9',
          '#cfcfe6', '#c2f0fc', '#a0ced9', '#f0b7a4',
          '#f7d8ba', '#d5c6e0', '#f0e1f0', '#d4bac0'
        ];
        const featureColorMapTemp = {};
        featureNames.forEach((feature, index) => {
          featureColorMapTemp[feature] = colorPalette[index % colorPalette.length];
        });
        setFeatureColorMap(featureColorMapTemp);
      }
    }
  }, [signalData, signalId]);

  // Effect to synchronize heights of left and right components
  useEffect(() => {
    const updateMaxHeight = () => {
      const leftHeight = leftRef.current ? leftRef.current.scrollHeight : 0;
      const rightHeight = rightRef.current ? rightRef.current.scrollHeight : 0;
      const contentHeights = [leftHeight, rightHeight, 150]; // Include 200px as a cap
      setMaxHeight(Math.min(Math.max(...contentHeights), 150));
    };
  
    updateMaxHeight();
  
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  // Memoize processed SHAP data
  const baselineShapData = useMemo(() => {
    return showBaseline ? processShapData('baseline') : [];
  }, [showBaseline, processShapData]);

  const enhancedShapData = useMemo(() => {
    return showEnhanced ? processShapData('enhanced') : [];
  }, [showEnhanced, processShapData]);

  // Effect to log SHAP data
  // useEffect(() => {
  //   console.log('Baseline SHAP Data:', baselineShapData);
  //   console.log('Enhanced SHAP Data:', enhancedShapData);
  // }, [baselineShapData, enhancedShapData]);

  // Early return if data is not ready
  if (!data || !signalData) {
    return <div>Loading...</div>;
  }

  // Extract feature data
  const baselineFeatureData = signalData[`${signalId}_df_${featureType}_baseline`];
  const enhancedFeatureData = signalData[`${signalId}_df_${featureType}_enhanced`];

  return (
    <section className="signal-section">
      {/* Outer container with project color border */}
      <div
        style={{
          border: `3px solid ${color}`,
          borderRadius: '10px',
          padding: '5px',
          marginBottom: '10px',
        }}
      >
        {/* Header Section */}
        <div
          className="header grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 2fr 520px',
            gap: '10px',
            alignItems: 'center',
            maxHeight: '200px', // Set the max height here
          }}
        >
          {/* Left: Condensed Labels */}
          <div ref={leftRef} className="left-labels content-evenly" style={{ fontSize: '12px', height: '100%' }}>
            <h2 style={{ marginBottom: '10px', fontSize: '14px' }}>Signal: {signalLabel}</h2>
            <div className="toggle-section" style={{ marginBottom: '5px' }}>
              <span>Models: </span>
              <button
                className={showBaseline ? 'active' : ''}
                onClick={() => setShowBaseline(!showBaseline)}
                style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
              >
                Baseline
              </button>
              <button
                className={showEnhanced ? 'active' : ''}
                onClick={() => setShowEnhanced(!showEnhanced)}
                style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
              >
                Enhanced
              </button>
            </div>
            <div className="toggle-section" style={{ marginBottom: '5px' }}>
              <span>Features: </span>
              <button
                className={featureType === 'orig' ? 'active' : ''}
                onClick={() => setFeatureType('orig')}
                style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
              >
                Orig
              </button>
              <button
                className={featureType === 'scaled' ? 'active' : ''}
                onClick={() => setFeatureType('scaled')}
                style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
              >
                Scaled
              </button>
            </div>
            <div className="toggle-section">
              <span>SHAP Values: </span>
              <button
                className={shapType === 'training_avg' ? 'active' : ''}
                onClick={() => setShapType('training_avg')}
                style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
              >
                Training Avg
              </button>
              <button
                className={shapType === 'test' ? 'active' : ''}
                onClick={() => setShapType('test')}
                style={{ marginLeft: '5px', fontSize: '10px', height: '100%', padding: '3px 5px' }}
              >
                Test
              </button>
            </div>
          </div>

          {/* Middle: RMSE Over Time */}
          <div className="middle w-full">
            <RMSEPlot
              data={data}
              hoverData={hoverData}
              setHoverData={setHoverData}
              dateRange={dateRange}
              height={maxHeight}
            />
          </div>

          {/* Right: Featured Stats */}
          <div
            ref={rightRef}
            className="right-side"
            style={{
              width: '100%',
              height: '200px',
              overflow: 'auto',
            }}
          >
            <FeaturedTable
              signalData={signalData}
              color={color}
              signalLabel= {signalLabel}
            />
          </div>
        </div>

        {/* Weekly Plot Section */}
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            width: '100%',
          }}
        >
          <WeeklyPlotDash
            data={data}
            color={color}
            featuredSignalId={signalId}
            featuredSignalLabel={signalLabel}
            hoverData={hoverData}
            setHoverData={setHoverData}
            dateRange={dateRange}
          />
        </div>

        {/* Baseline and Enhanced Plots */}
        {showBaseline && baselineShapData.length > 0 && (
          <div
            style={{
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '10px',
              padding: '10px',
              marginBottom: '20px',
            }}
          >
            {/* Baseline Feature Plot */}
            <div style={{ marginBottom: '2px', width: '100%' }}>
              <FeaturesPlot
                data={baselineFeatureData}
                featureType={featureType}
                modelType="Baseline"
                hoverData={hoverData}
                setHoverData={setHoverData}
                dateRange={dateRange}
                featureColorMap={featureColorMap}
                signalId={signalId}
                signalLabel={signalLabel}
              />
            </div>
            {/* Baseline SHAP Plot */}
            <div style={{ width: '100%' }}>
              <SHAPPlot
                shapValues={baselineShapData}
                shapType={shapType}
                modelType="Baseline"
                featureColorMap={featureColorMap}
                hoverData={hoverData}
                setHoverData={setHoverData}
                dateRange={dateRange}
              />
            </div>
          </div>
        )}

        {showEnhanced && enhancedShapData.length > 0 && (
          <div
            style={{
              border: '2px solid rgba(255,255,255,0.8)',
              borderRadius: '10px',
              padding: '10px',
              marginBottom: '20px',
            }}
          >
            {/* Enhanced Feature Plot */}
            <div style={{ marginBottom: '20px', width: '100%' }}>
              <FeaturesPlot
                data={enhancedFeatureData}
                featureType={featureType}
                modelType="Enhanced"
                hoverData={hoverData}
                setHoverData={setHoverData}
                dateRange={dateRange}
                featureColorMap={featureColorMap}
                signalId={signalId}
                signalLabel={signalLabel}
              />
            </div>
            {/* Enhanced SHAP Plot */}
            <div style={{ width: '100%' }}>
              <SHAPPlot
                shapValues={enhancedShapData}
                shapType={shapType}
                modelType="Enhanced"
                featureColorMap={featureColorMap}
                hoverData={hoverData}
                setHoverData={setHoverData}
                dateRange={dateRange}
                signalId={signalId}
                signalLabel={signalLabel}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SignalSection;
