export async function fetchSignalsManifest() {
  const manifestUrl = `https://iwkdxowwcjknat9a.public.blob.vercel-storage.com/signals_manifest.json`;
  try {
    const response = await fetch(manifestUrl, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to fetch signals manifest: ${response.statusText}`);
    }
    const manifest = await response.json();
    return manifest;
  } catch (error) {
    console.error('Error fetching signals manifest:', error);
    return null;
  }
}

const normalizeKeys = (obj) => {
  // Handle arrays recursively
  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeKeys(item)); // Normalize each item in the array
  }

  // Handle objects by converting all keys to strings
  if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[String(key)] = normalizeKeys(value); // Ensure the key is a string and normalize the value
      return acc;
    }, {});
  }

  // Return primitive values (numbers, strings, null, etc.) as-is
  return obj;
};

export async function fetchSignalData(projectIdWithUnderscores, signalId, signalInfo) {
  const baseUrl = 'https://iwkdxowwcjknat9a.public.blob.vercel-storage.com';
  const folderPath = `${projectIdWithUnderscores}/${signalId}`;
  const files = {};

  // Collect URLs for general files
  for (const [key, filename] of Object.entries(signalInfo)) {
    if (key === 'baseline' || key === 'enhanced') {
      continue; // Skip baseline and enhanced here, they are handled separately
    }
    const fileUrl = `${baseUrl}/${folderPath}/${filename}`;
    files[key] = fileUrl;
    console.log(`General File URL [${key}]:`, fileUrl);
  }

  // Collect URLs for model files (baseline and enhanced)
  ['baseline', 'enhanced'].forEach((modelType) => {
    const modelInfo = signalInfo[modelType];
    if (modelInfo) {
      const modelFolderPath = `${folderPath}/${modelType}`;
      for (const [key, filename] of Object.entries(modelInfo)) {
        const fileKey = `${key}`;
        const fileUrl = `${baseUrl}/${modelFolderPath}/${filename}`;
        files[fileKey] = fileUrl;
        console.log(`Model File URL [${fileKey}]:`, fileUrl);
      }
    }
  });

  try {
    console.log(`Fetching files for signal ${signalId}:`, files);

    // Fetch all files concurrently
    const fileKeys = Object.keys(files);
    const responses = await Promise.all(
      fileKeys.map(async (key) => {
        try {
          const res = await fetch(files[key]);
          if (res.ok) {
            return { key, data: await res.json() };
          } else {
            console.warn(`Failed to fetch ${key}, status: ${res.status}`);
            return { key, data: null };
          }
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          return { key, data: null };
        }
      })
    );

    // Process fetched responses into a normalized data object
    const data = responses.reduce((acc, { key, data }) => {
      acc[key] = normalizeKeys(data); // Normalize keys for each fetched file
      return acc;
    }, {});

    // Separate featured table data for easier use
    const featuredTableKey = `${signalId}_featured_table`;
    const signalData = { ...data, featuredTable: data[featuredTableKey] };

    // Parse SHAP values from forecast results for baseline and enhanced models
    ['baseline', 'enhanced'].forEach((modelType) => {
      const forecastResultsKey = `${signalId}_${modelType}_forecast_results`;
      if (signalData[forecastResultsKey]) {
        const forecastResults = signalData[forecastResultsKey];

        const weeklyShapData = forecastResults.map((weekData) => {
          const { week, shap_values_test, aggregate_shap_stats } = weekData;

          // Extract mean SHAP values from aggregate_shap_stats
          const meanTrainingShap = aggregate_shap_stats.reduce((acc, stat) => {
            acc[stat.feature] = stat.mean_shap;
            return acc;
          }, {});

          // Extract singular test SHAP values
          const testShapValues = shap_values_test.reduce((acc, testShap) => {
            for (const [feature, value] of Object.entries(testShap)) {
              acc[feature] = value;
            }
            return acc;
          }, {});

          console.log(`[${modelType}] Week: ${week}`);
          return {
            week,
            meanTrainingShap,
            testShapValues,
          };
        });

        // Store processed SHAP data in signalData
        signalData[`${modelType}_shap_data`] = weeklyShapData;
      }
    });

    return signalData;
  } catch (error) {
    console.error(`Error fetching signal data for ${signalId}:`, error);
    return null;
  }
}
