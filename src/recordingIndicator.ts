/**
 * Recording indicator module for visually indicating recording status.
 * Shows a prominent recording status bar item during recording.
 */

import * as vscode from 'vscode';

class RecordingIndicator {
  private statusBarItem: vscode.StatusBarItem | undefined;

  /**
   * Shows a visual indicator that recording is in progress.
   * This uses a status bar item to provide a clear visual cue.
   */
  show(): void {
    if (!this.statusBarItem) {
      this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
    }

    this.statusBarItem.text = '$(circle-filled) Recording';
    this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
    this.statusBarItem.tooltip = 'GIF Recording in Progress - Click to stop';
    this.statusBarItem.command = 'vscode-gif-recorder.stopRecording';
    this.statusBarItem.show();
  }

  /**
   * Hides the recording status bar indicator.
   */
  hide(): void {
    if (this.statusBarItem) {
      this.statusBarItem.dispose();
      this.statusBarItem = undefined;
    }
  }

  /**
   * Updates the recording indicator with frame count.
   */
  update(frameCount: number): void {
    if (this.statusBarItem) {
      this.statusBarItem.text = `$(circle-filled) Recording (${frameCount} frames)`;
    }
  }
}

const indicator = new RecordingIndicator();

export const showRecordingIndicator = () => indicator.show();
export const hideRecordingIndicator = () => indicator.hide();
export const updateRecordingIndicator = (frameCount: number) => indicator.update(frameCount);
