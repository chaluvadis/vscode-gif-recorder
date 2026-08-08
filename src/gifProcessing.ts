/**
 * Pure image/GIF processing utilities extracted from the worker for testability.
 * These functions have no side effects and no external dependencies beyond UPNG.
 */

import UPNG from 'upng-js';

export interface DecodedFrame {
  data: Uint8Array;
  width: number;
  height: number;
}

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Decodes a PNG buffer into RGBA pixel data.
 */
export function decodePng(buffer: Buffer): DecodedFrame {
  const png = UPNG.decode(buffer);
  const rgba = UPNG.toRGBA8(png);
  const frameData = rgba[0];
  if (!frameData) {
    throw new Error('Failed to decode PNG: no RGBA data');
  }
  return {
    data: new Uint8Array(frameData),
    width: png.width,
    height: png.height,
  };
}

/**
 * Validates that a buffer starts with the PNG signature.
 */
export function isValidPng(buffer: Buffer): boolean {
  return buffer.length >= 8 && Buffer.compare(buffer.slice(0, 8), pngSignature) === 0;
}

/**
 * Calculates the similarity percentage between two frames by sampling pixels.
 * Uses sub-sampling for performance on large images.
 * Returns 0-100, where 100 means identical.
 */
export function calculateFrameSimilarity(frame1: Uint8Array, frame2: Uint8Array): number {
  if (frame1.length !== frame2.length) {
    return 0;
  }

  if (frame1.length === 0) {
    return 100;
  }

  let matchingPixels = 0;
  const totalPixels = frame1.length / 4;

  const step = Math.max(1, Math.floor(totalPixels / 10000));
  const sampledPixels = Math.floor(totalPixels / step);

  for (let i = 0; i < frame1.length; i += step * 4) {
    if (
      (frame1[i] ?? 0) === (frame2[i] ?? 0) &&
      (frame1[i + 1] ?? 0) === (frame2[i + 1] ?? 0) &&
      (frame1[i + 2] ?? 0) === (frame2[i + 2] ?? 0)
    ) {
      matchingPixels++;
    }
  }

  return (matchingPixels / sampledPixels) * 100;
}

/**
 * Scales image data down to the specified maximum width while maintaining aspect ratio.
 * Uses nearest-neighbor interpolation for simplicity and speed.
 */
export function scaleImage(
  data: Uint8Array,
  width: number,
  height: number,
  maxWidth: number
): DecodedFrame {
  if (maxWidth <= 0 || width <= maxWidth) {
    return { data, width, height };
  }

  const scale = maxWidth / width;
  const newWidth = Math.floor(width * scale);
  const newHeight = Math.floor(height * scale);

  const scaledData = new Uint8Array(newWidth * newHeight * 4);

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.floor(x / scale);
      const srcY = Math.floor(y / scale);
      const srcIdx = (srcY * width + srcX) * 4;
      const dstIdx = (y * newWidth + x) * 4;

      scaledData[dstIdx] = data[srcIdx] ?? 0;
      scaledData[dstIdx + 1] = data[srcIdx + 1] ?? 0;
      scaledData[dstIdx + 2] = data[srcIdx + 2] ?? 0;
      scaledData[dstIdx + 3] = data[srcIdx + 3] ?? 0;
    }
  }

  return { data: scaledData, width: newWidth, height: newHeight };
}
