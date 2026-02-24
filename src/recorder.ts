/**
 * Recorder module for capturing VS Code screen activity.
 */

import { execFile } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';
import type { Frame } from './gifConverter';

const execFileAsync = promisify(execFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

let isRecording = false;
let isPaused = false;
let isCapturing = false; // Flag to prevent overlapping captures
let captureInterval: NodeJS.Timeout | null = null;
let frames: Frame[] = [];
export const DEFAULT_FPS = 10;

// Callback for frame capture events
let onFrameCapturedCallback: ((frameCount: number) => void) | undefined;

/**
 * Capture screenshot on macOS using native screencapture command.
 * Returns PNG buffer directly without using temp library.
 */
async function captureScreenshotMacOS(): Promise<Buffer> {
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(
    tmpDir,
    `screenshot-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
  );

  try {
    console.log(`Capturing screenshot to: ${tmpFile}`);

    // Capture screenshot to temp file
    const { stdout, stderr } = await execFileAsync('screencapture', ['-x', '-t', 'png', tmpFile]);

    if (stderr) {
      console.warn(`screencapture stderr: ${stderr}`);
    }

    // Check if file exists
    if (!fs.existsSync(tmpFile)) {
      throw new Error(`Screenshot file was not created: ${tmpFile}`);
    }

    // Read the file
    const buffer = await readFileAsync(tmpFile);
    console.log(`Read ${buffer.length} bytes from ${tmpFile}`);

    // Delete the temp file
    await unlinkAsync(tmpFile).catch(() => {}); // Ignore cleanup errors

    return buffer;
  } catch (error) {
    console.error(
      `Screenshot capture error: ${error instanceof Error ? error.message : String(error)}`
    );
    // Try to clean up on error
    await unlinkAsync(tmpFile).catch(() => {});
    throw error;
  }
}

/**
 * Starts recording the VS Code window.
 * Captures screen frames at the specified frame rate and stores them in memory.
 */
export function startRecording(): void {
  if (isRecording) {
    console.log('Recording is already in progress.');
    return;
  }

  console.log('Starting GIF recording...');
  isRecording = true;
  isPaused = false;
  isCapturing = false;
  frames = []; // Clear any existing frames

  // Calculate interval based on desired FPS
  const intervalMs = Math.floor(1000 / DEFAULT_FPS);

  // Set up recording interval to capture frames
  captureInterval = setInterval(async () => {
    // Skip capturing if recording is paused or a capture is already in progress
    if (isPaused || isCapturing) {
      return;
    }

    isCapturing = true;
    try {
      // Capture screenshot as PNG buffer using native method
      const imageBuffer = await captureScreenshotMacOS();

      // Validate the captured buffer
      if (!imageBuffer) {
        console.error('Screenshot returned null/undefined');
        return;
      }

      if (imageBuffer.length === 0) {
        console.error('Screenshot returned empty buffer');
        return;
      }

      // Check PNG signature (first 8 bytes)
      const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const isValidPng =
        imageBuffer.length >= 8 && Buffer.compare(imageBuffer.slice(0, 8), pngSignature) === 0;

      if (!isValidPng) {
        console.error(
          `Invalid PNG signature. First 8 bytes: ${imageBuffer.slice(0, 8).toString('hex')}`
        );
        return;
      }

      // Store frame with timestamp
      // Width and height are set to 0 and will be determined during GIF conversion
      const frame: Frame = {
        data: imageBuffer,
        timestamp: Date.now(),
        width: 0,
        height: 0,
      };

      frames.push(frame);
      console.log(
        `Captured frame ${frames.length}, buffer size: ${imageBuffer.length} bytes, valid PNG: ${isValidPng}`
      );

      // Notify callback of new frame
      if (onFrameCapturedCallback) {
        try {
          onFrameCapturedCallback(frames.length);
        } catch (callbackError) {
          console.error('Error in onFrameCapturedCallback:', callbackError);
        }
      }
    } catch (error) {
      console.error('Error capturing frame:', error);
    } finally {
      isCapturing = false;
    }
  }, intervalMs);
}

/**
 * Stops the ongoing recording and returns captured frames.
 * Clears the recording interval and resets the recording state.
 *
 * @returns Array of captured frames
 */
export function stopRecording(): Frame[] {
  if (!isRecording) {
    console.log('No recording in progress.');
    return [];
  }

  console.log('Stopping GIF recording...');
  isRecording = false;
  isPaused = false;
  isCapturing = false;

  // Stop capturing frames
  if (captureInterval) {
    clearInterval(captureInterval);
    captureInterval = null;
  }

  console.log(`Recording stopped. Captured ${frames.length} frames.`);

  // Return frames and reset for next recording
  const capturedFrames = [...frames];
  frames = [];

  return capturedFrames;
}

/**
 * Pauses the ongoing recording.
 * The capture interval continues but frames are skipped while paused.
 */
export function pauseRecording(): void {
  if (!isRecording) {
    console.log('No recording in progress to pause.');
    return;
  }

  if (isPaused) {
    console.log('Recording is already paused.');
    return;
  }

  console.log('Pausing GIF recording...');
  isPaused = true;
}

/**
 * Resumes a paused recording.
 */
export function resumeRecording(): void {
  if (!isRecording) {
    console.log('No recording in progress to resume.');
    return;
  }

  if (!isPaused) {
    console.log('Recording is not paused.');
    return;
  }

  console.log('Resuming GIF recording...');
  isPaused = false;
}

/**
 * Sets a callback to be invoked when a new frame is captured.
 */
export function setOnFrameCaptured(callback: (frameCount: number) => void): void {
  onFrameCapturedCallback = callback;
}

/**
 * Clears the frame capture callback.
 */
export function clearOnFrameCaptured(): void {
  onFrameCapturedCallback = undefined;
}
