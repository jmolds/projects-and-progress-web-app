// utils/fetchSignalData.js

import { parser } from 'stream-json';
import { streamArray, streamObject } from 'stream-json/streamers/StreamArray';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';

/**
 * Processes a JSON stream based on the expected structure.
 * @param {ReadableStream} stream - The JSON stream to process.
 * @param {string} expectedType - The expected JSON structure ('array' or 'object').
 * @returns {Promise<Array|Object>} - Parsed JSON data.
 */
async function processJsonStream(stream, expectedType) {
  if (expectedType === 'array') {
    return await processJsonArrayStream(stream);
  } else if (expectedType === 'object') {
    return await processJsonObjectStream(stream);
  } else {
    throw new Error(`Unknown expected type: ${expectedType}`);
  }
}

async function processJsonArrayStream(stream) {
  const result = [];

  const writable = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
      result.push(chunk.value);
      callback();
    }
  });

  try {
    await pipeline(
      stream,
      parser(),
      streamArray(),
      writable
    );
    return result;
  } catch (error) {
    console.error('Error processing JSON array stream:', error);
    throw error;
  }
}

async function processJsonObjectStream(stream) {
  const result = {};

  const writable = new Writable({
    objectMode: true,
    write({ key, value }, encoding, callback) {
      result[key] = value;
      callback();
    }
  });

  try {
    await pipeline(
      stream,
      parser(),
      streamObject(),
      writable
    );
    return result;
  } catch (error) {
    console.error('Error processing JSON object stream:', error);
    throw error;
  }
}

/**
 * Fetches and processes all relevant files for a given project and signal.
 * @param {string} projectId - The project ID.
 * @param {string} signalId - The signal ID.
 * @param {Object} manifest - The signals manifest.
 * @returns {Object} - An object containing all fetched and processed data.
 */

function normalizeKeys(data) {
    // Placeholder implementation: return data as-is
    // Implement key normalization if required
    return data;
  }
  
    

export async function fetchSignalData(projectId, signalId, manifest) {
  if (!manifest || !manifest[projectId] || !manifest[projectId].signals[signalId]) {
    console.error(`Manifest does not contain data for project "${projectId}" and signal "${signalId}".`);
    return null;
  }

  const baseUrl = 'https://iwkdxowwcjknat9a.public.blob.vercel-storage.com';
  const signalInfo = manifest[projectId].signals[signalId];
  const folderPath = `${projectId}/${signalId}`;
  const files = {};

  // Define expected types for each key
  const fileTypes = {
    'with_forecasts': 'array',
    'featured_table': 'object',
    'baseline_forecast_results': 'array',
    'df_scaled_baseline': 'array',
    'df_orig_baseline': 'array',
    'enhanced_forecast_results': 'array',
    'df_scaled_enhanced': 'array',
    'df_orig_enhanced': 'array'
  };

  // Collect URLs for general files (exclude non-file keys like signalLabel and signalName)
  for (const [key, filename] of Object.entries(signalInfo)) {
    if (key === 'signalLabel' || key === 'signalName') continue; // Skip non-file keys

    if (key === 'baseline' || key === 'enhanced') {
      // Handle nested baseline and enhanced files
      for (const [subKey, subFilename] of Object.entries(filename)) {
        const cleanedKey = subKey.replace(`${signalId}_`, ''); // Remove signalId prefix
        files[`${key}_${cleanedKey}`] = {
          url: `${baseUrl}/${folderPath}/${key}/${subFilename}`,
          type: fileTypes[cleanedKey] || 'array' // Default to 'array' if type not specified
        };
      }
    } else {
      // Handle top-level files like with_forecasts and featured_table
      const fileKey = key.replace(`${signalId}_`, ''); // Remove signalId prefix
      files[fileKey] = {
        url: `${baseUrl}/${folderPath}/${filename}`,
        type: fileTypes[fileKey] || 'array' // Default to 'array' if type not specified
      };
    }
  }

  try {
    console.log(`Fetching files for signal "${signalId}" in project "${projectId}":`, files);

    const responses = await Promise.all(
      Object.entries(files).map(async ([key, { url, type }]) => {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (!response.ok) {
            console.warn(`Failed to fetch ${key}, status: ${response.status}`);
            return { key, data: null };
          }

          // Stream JSON directly without saving to disk
          const data = await processJsonStream(response.body, type);
          return { key, data };
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          return { key, data: null };
        }
      })
    );

    const data = responses.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {});

    // Include featuredTable
    if (data['featured_table']) {
      data['featuredTable'] = data['featured_table'];
    } else {
      console.warn(`featured_table key not found in fetched data for signal "${signalId}".`);
    }

    // Process SHAP Data from streamed results
    ['baseline', 'enhanced'].forEach((modelType) => {
      const forecastResultsKey = `${modelType}_forecast_results`;
      if (data[forecastResultsKey]) {
        const forecastResults = data[forecastResultsKey];
        const shapDataByWeek = forecastResults.map((item) => ({
          week: item.week,
          shap_values_test: item.shap_values_test || {},
          aggregate_shap_stats: item.aggregate_shap_stats || [],
        }));
        data[`${modelType}_shap_data_by_${signalId}`] = shapDataByWeek;
      }
    });

    // Optionally include feature data if needed
    // Example:
    data['baseline_features'] = data['df_scaled_baseline'] || data['df_orig_baseline'];
    data['enhanced_features'] = data['df_scaled_enhanced'] || data['df_orig_enhanced'];

    console.log('Final Fetched Data:', data); // For debugging

    return data;
  } catch (error) {
    console.error(`Error fetching signal data for "${signalId}" in project "${projectId}":`, error);
    return null;
  }
}
