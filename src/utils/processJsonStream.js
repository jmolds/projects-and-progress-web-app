// utils/processJsonStream.js

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
export async function processJsonStream(stream, expectedType) {
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
