/**
 * GIF Converter module for converting captured frames to GIF format.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import GIFEncoder from 'gif-encoder-2';
import { PNG } from 'pngjs';

/**
 * Frame data structure representing a single captured frame.
 */
export interface Frame {
  data: Buffer;
  timestamp: number;
  width: number;
  height: number;
}

/**
 * Options for GIF conversion.
 */
export interface GifOptions {
  outputPath: string;
  fps?: number;
  quality?: number;
  algorithm?: 'neuquant' | 'octree';
  useOptimizer?: boolean;
  threshold?: number;
}

/**
 * Converts an array of frames to a GIF file.
 * Uses GIF encoding library to process frames with user-specified options.
 *
 * @param frames - Array of captured frames to convert
 * @param options - Options for GIF generation (FPS, Quality, Output Path)
 * @returns Promise that resolves to the path of the generated GIF
 */
export async function convertToGif(frames: Frame[], options: GifOptions): Promise<string> {
  if (!frames || frames.length === 0) {
    throw new Error('No frames to convert');
  }

  const fps = options.fps || 10;
  const quality = options.quality || 10; // Lower is better (1-20)
  const algorithm = options.algorithm || 'octree'; // octree generally produces smaller files
  const useOptimizer = options.useOptimizer ?? true; // Enable optimizer by default
  const threshold = options.threshold ?? 90; // Optimizer threshold (0-100, higher = more optimization)
  const delay = Math.floor(1000 / fps); // Delay between frames in ms

  console.log(`Converting ${frames.length} frames to GIF...`);
  console.log(`Output path: ${options.outputPath}`);
  console.log(`FPS: ${fps}`);
  console.log(`Quality: ${quality}`);
  console.log(`Algorithm: ${algorithm}`);
  console.log(`Optimizer: ${useOptimizer ? 'enabled' : 'disabled'}`);
  if (useOptimizer) {
    console.log(`Threshold: ${threshold}%`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(options.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Decode the first frame to get dimensions
  const firstPng = PNG.sync.read(frames[0].data);
  const width = firstPng.width;
  const height = firstPng.height;

  console.log(`GIF dimensions: ${width}x${height}`);

  // Create GIF encoder with optimizer enabled for better compression
  const encoder = new GIFEncoder(width, height, algorithm, useOptimizer, frames.length);

  // Create write stream
  const writeStream = fs.createWriteStream(options.outputPath);

  // Start the encoder and pipe to file
  encoder.createReadStream().pipe(writeStream);
  encoder.start();
  encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(delay);
  encoder.setQuality(quality);
  
  // Set optimizer threshold if optimizer is enabled
  if (useOptimizer) {
    encoder.setThreshold(threshold);
  }

  // Process and add each frame
  let framesAdded = 0;
  for (let i = 0; i < frames.length; i++) {
    try {
      const png = PNG.sync.read(frames[i].data);

      // Ensure frame has the same dimensions
      if (png.width !== width || png.height !== height) {
        console.warn(
          `Frame ${i} has different dimensions (${png.width}x${png.height} vs ${width}x${height}), skipping...`
        );
        continue;
      }

      // Add frame to encoder (data is RGBA format)
      encoder.addFrame(png.data);
      framesAdded++;
      console.log(`Added frame ${framesAdded}/${frames.length}`);
    } catch (error) {
      console.error(`Error processing frame ${i}:`, error);
    }
  }

  // Ensure at least some frames were successfully added
  if (framesAdded === 0) {
    throw new Error('No frames could be processed for GIF conversion');
  }

  encoder.finish();

  // Wait for the write stream to finish
  await new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`GIF successfully created at: ${options.outputPath}`);
      resolve();
    });
    writeStream.on('error', (error) => {
      console.error('Error writing GIF:', error);
      reject(error);
    });
  });

  return options.outputPath;
}
