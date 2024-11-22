/**
 * Function to process SHAP data
 * @param {string} modelType - 'baseline' or 'enhanced'
 * @returns {Array} - Processed SHAP data
 */
const processShapData = (modelType) => {
  const shapData = signalData[`${modelType}_shap_data`];
  const usageData = signalData['weekly_usage_hours_with_forecasts'];
  
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
  shapData.forEach(item => {
    if (item.week) {
      shapMap.set(item.week, item);
    } else {
      console.warn(`Missing 'week' in ${modelType} shap data item:`, item);
    }
  });
  
  // Iterate over usageData and find corresponding shapData by week
  const processedData = usageData.map(usageItem => {
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
    } else { // shapType === 'test'
      return {
        week: week,
        aggregate_shap_stats: Object.entries(shapItem.testShapValues).map(([feature, shap_value]) => ({
          feature,
          mean_shap: shap_value,
        })),
      };
    }
  }).filter(item => item !== null); // Remove null entries

  return processedData;
};
