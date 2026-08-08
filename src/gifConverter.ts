import { Worker } from 'node:worker_threads';
import * as path from 'node:path';

export interface Frame {
  data: Buffer;
  timestamp: number;
  width: number;
  height: number;
}

export interface GifOptions {
  outputPath: string;
  fps?: number;
  quality?: number;
  useOptimizer?: boolean;
  threshold?: number;
  deduplicateFrames?: boolean;
  deduplicationThreshold?: number;
  maxWidth?: number;
}

export type ProgressCallback = (increment: number, message: string) => void;

const WORKER_TIMEOUT_MS = 5 * 60 * 1000;

let currentWorker: Worker | null = null;

export async function convertToGif(
  frames: Frame[],
  options: GifOptions,
  onProgress?: ProgressCallback,
  abortSignal?: AbortSignal
): Promise<string> {
  if (!frames || frames.length === 0) {
    throw new Error('No frames to convert');
  }

  if (abortSignal?.aborted) {
    throw new Error('GIF conversion was cancelled');
  }

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    let timeoutId: NodeJS.Timeout | undefined;

    const workerPath = path.join(__dirname, 'worker', 'gifConverterWorker.js');
    const worker = new Worker(workerPath);
    currentWorker = worker;

    const cleanup = (): void => {
      clearTimeout(timeoutId);
      worker.terminate();
      currentWorker = null;
    };

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        if (!settled) {
          settled = true;
          cleanup();
          reject(new Error('GIF conversion was cancelled'));
        }
      });
    }

    worker.on('message', (msg: unknown) => {
      const message = msg as
        | { type: 'progress'; increment: number; message: string }
        | { type: 'complete'; outputPath: string }
        | { type: 'error'; message: string };

      switch (message.type) {
        case 'progress':
          onProgress?.(message.increment, message.message);
          break;
        case 'complete':
          if (!settled) {
            settled = true;
            cleanup();
            resolve(message.outputPath);
          }
          break;
        case 'error':
          if (!settled) {
            settled = true;
            cleanup();
            reject(new Error(message.message));
          }
          break;
      }
    });

    worker.on('error', (error) => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(error);
      }
    });

    worker.on('exit', (code) => {
      if (!settled && code !== 0 && code !== null) {
        settled = true;
        cleanup();
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(new Error('GIF conversion timed out'));
      }
    }, WORKER_TIMEOUT_MS);

    const transferList: ArrayBuffer[] = frames.map((f) => f.data.buffer as ArrayBuffer);

    worker.postMessage({ type: 'convert', frames, options }, transferList);
  });
}

/**
 * Terminates the current GIF conversion worker if one is running.
 * Called during extension deactivation to prevent orphaned workers.
 */
export function terminateWorker(): void {
  if (currentWorker) {
    currentWorker.terminate();
    currentWorker = null;
  }
}
