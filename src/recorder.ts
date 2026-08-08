/**
 * Recorder module for capturing VS Code screen activity.
 * Provides cross-platform screen capture via native tools (macOS) and screenshot-desktop (Windows/Linux).
 */

import { execFile } from 'node:child_process';
import { readFile, unlink } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { promisify } from 'node:util';
import screenshot from 'screenshot-desktop';
import type { Frame } from './gifConverter';

const execFileAsync = promisify(execFile);

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const TMP_SCREENSHOT_FILE = path.join(os.tmpdir(), 'vscode-gif-recorder-screenshot.png');

export const DEFAULT_FPS = 10;

class Recorder {
  private isRecording = false;
  private isPaused = false;
  private isCapturing = false;
  private captureInterval: NodeJS.Timeout | null = null;
  private frames: Frame[] = [];
  private onFrameCapturedCallback: ((frameCount: number) => void) | undefined;

  /**
   * Capture a screenshot using the platform-appropriate method.
   * macOS: uses native screencapture (fast, no dependencies)
   * Windows/Linux: uses screenshot-desktop
   */
  private async captureScreenshot(): Promise<Buffer> {
    if (process.platform === 'darwin') {
      return this.captureScreenshotMacOS();
    }
    return this.captureScreenshotCrossPlatform();
  }

  /**
   * Capture screenshot on macOS using native screencapture command.
   * Uses -x to suppress the shutter sound.
   */
  private async captureScreenshotMacOS(): Promise<Buffer> {
    try {
      await execFileAsync('screencapture', ['-x', '-t', 'png', TMP_SCREENSHOT_FILE]);
      const buffer = await readFile(TMP_SCREENSHOT_FILE);
      await unlink(TMP_SCREENSHOT_FILE).catch(() => {});
      return buffer;
    } catch (error) {
      await unlink(TMP_SCREENSHOT_FILE).catch(() => {});
      throw error;
    }
  }

  /**
   * Capture screenshot on Windows/Linux using screenshot-desktop.
   */
  private async captureScreenshotCrossPlatform(): Promise<Buffer> {
    return screenshot({ format: 'png' });
  }

  /**
   * Starts recording the VS Code window.
   * Captures screen frames at the specified frame rate and stores them in memory.
   */
  start(): void {
    if (this.isRecording) {
      return;
    }

    this.isRecording = true;
    this.isPaused = false;
    this.isCapturing = false;
    this.frames = [];

    const intervalMs = Math.floor(1000 / DEFAULT_FPS);

    this.captureInterval = setInterval(async () => {
      if (this.isPaused || this.isCapturing) {
        return;
      }

      this.isCapturing = true;
      try {
        const imageBuffer = await this.captureScreenshot();

        if (!imageBuffer || imageBuffer.length === 0) {
          return;
        }

        const isValidPng =
          imageBuffer.length >= 8 && Buffer.compare(imageBuffer.slice(0, 8), PNG_SIGNATURE) === 0;

        if (!isValidPng) {
          return;
        }

        this.frames.push({
          data: imageBuffer,
          timestamp: Date.now(),
          width: 0,
          height: 0,
        });

        // Warn if recording is getting long (memory consideration)
        const frameCount = this.frames.length;
        if (frameCount === 100) {
          console.error('Recording is over 100 frames — consider stopping soon to conserve memory');
        }

        this.onFrameCapturedCallback?.(frameCount);
      } catch (error) {
        console.error('Error capturing frame:', error);
      } finally {
        this.isCapturing = false;
      }
    }, intervalMs);
  }

  /**
   * Stops the ongoing recording and returns captured frames.
   * Clears the recording interval and resets the recording state.
   */
  stop(): Frame[] {
    if (!this.isRecording) {
      return [];
    }

    this.isRecording = false;
    this.isPaused = false;
    this.isCapturing = false;

    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }

    const capturedFrames = [...this.frames];
    this.frames = [];

    return capturedFrames;
  }

  /**
   * Pauses the ongoing recording.
   * The capture interval continues but frames are skipped while paused.
   */
  pause(): void {
    if (!this.isRecording || this.isPaused) {
      return;
    }
    this.isPaused = true;
  }

  /**
   * Resumes a paused recording.
   */
  resume(): void {
    if (!this.isRecording || !this.isPaused) {
      return;
    }
    this.isPaused = false;
  }

  /**
   * Sets a callback to be invoked when a new frame is captured.
   */
  setOnFrameCaptured(callback: (frameCount: number) => void): void {
    this.onFrameCapturedCallback = callback;
  }

  /**
   * Clears the frame capture callback.
   */
  clearOnFrameCaptured(): void {
    this.onFrameCapturedCallback = undefined;
  }
}

const recorder = new Recorder();

export const startRecording = () => recorder.start();
export const stopRecording = () => recorder.stop();
export const pauseRecording = () => recorder.pause();
export const resumeRecording = () => recorder.resume();
export const setOnFrameCaptured = (callback: (frameCount: number) => void) =>
  recorder.setOnFrameCaptured(callback);
export const clearOnFrameCaptured = () => recorder.clearOnFrameCaptured();
