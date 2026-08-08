import type { Frame, GifOptions } from '../gifConverter';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { parentPort } from 'node:worker_threads';
import GIFEncoder from 'gif-encoder';
import { calculateFrameSimilarity, decodePng, isValidPng, scaleImage } from '../gifProcessing';

interface ConvertRequest {
  type: 'convert';
  frames: Frame[];
  options: GifOptions;
}

function postProgress(progress: { increment: number; message: string }): void {
  parentPort?.postMessage({
    type: 'progress',
    ...progress,
  });
}

function postResult(outputPath: string): void {
  parentPort?.postMessage({ type: 'complete', outputPath });
}

function postError(message: string): void {
  parentPort?.postMessage({ type: 'error', message });
}

async function convertFrames(frames: Frame[], options: GifOptions): Promise<void> {
  if (!frames || frames.length === 0) {
    throw new Error('No frames to convert');
  }

  const fps = options.fps || 10;
  const quality = options.quality || 10;
  const deduplicateFrames = options.deduplicateFrames ?? true;
  const deduplicationThreshold = options.deduplicationThreshold ?? 99;
  const maxWidth = options.maxWidth ?? 0;
  const delay = Math.floor(1000 / fps);

  postProgress({ increment: 5, message: 'Preparing output...' });

  const outputDir = path.dirname(options.outputPath);
  await fs.promises.mkdir(outputDir, { recursive: true });

  postProgress({ increment: 10, message: 'Decoding first frame...' });

  const firstFrameEntry = frames[0];
  if (!firstFrameEntry) {
    throw new Error('No frames available for conversion');
  }
  let firstFrame = decodePng(firstFrameEntry.data);

  if (maxWidth > 0 && firstFrame.width > maxWidth) {
    firstFrame = scaleImage(firstFrame.data, firstFrame.width, firstFrame.height, maxWidth);
  }

  const width = firstFrame.width;
  const height = firstFrame.height;

  postProgress({ increment: 5, message: 'Encoding setup...' });

  const encoder = new GIFEncoder(width, height, { highWaterMark: 1024 * 1024 * 64 });
  const writeStream = fs.createWriteStream(options.outputPath);

  encoder.pipe(writeStream);
  encoder.setRepeat(0);
  encoder.setDelay(delay);
  encoder.setQuality(quality);
  encoder.writeHeader();

  let framesAdded = 0;
  let framesSkipped = 0;
  let framesDimensionMismatch = 0;
  let framesWithError = 0;
  let lastFrameData: Uint8Array | null = null;

  postProgress({ increment: 0, message: 'Processing frames...' });

  const frameProgress = 75 / frames.length;

  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    if (!frame) {
      framesWithError++;
      continue;
    }
    try {
      if (!frame.data || frame.data.length === 0) {
        framesWithError++;
        continue;
      }

      if (frame.data.length < 8 || !isValidPng(frame.data)) {
        framesWithError++;
        continue;
      }

      let decoded = decodePng(frame.data);

      if (maxWidth > 0 && decoded.width > maxWidth) {
        decoded = scaleImage(decoded.data, decoded.width, decoded.height, maxWidth);
      }

      if (decoded.width !== width || decoded.height !== height) {
        framesDimensionMismatch++;
        continue;
      }

      if (deduplicateFrames && lastFrameData !== null) {
        const similarity = calculateFrameSimilarity(decoded.data, lastFrameData);
        if (similarity >= deduplicationThreshold) {
          framesSkipped++;
          continue;
        }
      }

      encoder.addFrame(Buffer.from(decoded.data));
      lastFrameData = decoded.data;
      framesAdded++;

      postProgress({
        increment: Math.round(frameProgress),
        message: `Processing frame ${framesAdded}/${frames.length}`,
      });
    } catch {
      framesWithError++;
    }
  }

  if (framesAdded === 0) {
    if (framesWithError > 0) {
      throw new Error(`No frames could be processed. ${framesWithError} frames had errors.`);
    }
    if (framesSkipped > 0 && framesSkipped === frames.length) {
      throw new Error(`All ${frames.length} frames were skipped as duplicates.`);
    }
    if (framesDimensionMismatch > 0 && framesDimensionMismatch === frames.length) {
      throw new Error(`All frames had dimension mismatches.`);
    }
    throw new Error('No frames could be processed for GIF conversion');
  }

  postProgress({ increment: 5, message: 'Finalizing GIF...' });

  encoder.finish();

  await new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => {
      resolve();
    });
    writeStream.on('error', (error) => {
      reject(error);
    });
  });

  postProgress({ increment: 0, message: 'Complete!' });
  postResult(options.outputPath);
}

parentPort?.on('message', (request: ConvertRequest) => {
  if (request.type === 'convert') {
    convertFrames(request.frames, request.options).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      postError(message);
    });
  }
});
