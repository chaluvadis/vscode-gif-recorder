/**
 * Recorder module for capturing VS Code screen activity.
 */

import screenshot from 'screenshot-desktop';
import { Frame } from './gifConverter';

let isRecording = false;
let captureInterval: NodeJS.Timeout | null = null;
let frames: Frame[] = [];
export const DEFAULT_FPS = 10;

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
  frames = []; // Clear any existing frames

  // Calculate interval based on desired FPS
  const intervalMs = Math.floor(1000 / DEFAULT_FPS);

  // Set up recording interval to capture frames
  captureInterval = setInterval(async () => {
    try {
      // Capture screenshot as PNG buffer
      const imageBuffer = await screenshot({ format: 'png' });
      
      // Store frame with timestamp
      // Width and height are set to 0 and will be determined during GIF conversion
      const frame: Frame = {
        data: imageBuffer,
        timestamp: Date.now(),
        width: 0,
        height: 0
      };
      
      frames.push(frame);
      console.log(`Captured frame ${frames.length}`);
    } catch (error) {
      console.error('Error capturing frame:', error);
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
 * Returns the current recording status.
 */
export function getRecordingStatus(): boolean {
  return isRecording;
}

/**
 * Returns the number of frames captured so far.
 */
export function getFrameCount(): number {
  return frames.length;
}
