/**
 * Recording Border module for visually indicating recording status.
 * Displays a highlighted border around the editor during recording.
 */

import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem | undefined;
let decorationType: vscode.TextEditorDecorationType | undefined;

/**
 * Shows a visual border/indicator that recording is in progress.
 * This uses a status bar item to provide a clear visual cue.
 */
export function showRecordingBorder(): void {
  // Create status bar item with prominent recording indicator
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      1000 // High priority to appear first
    );
  }

  statusBarItem.text = '$(circle-filled) Recording';
  statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
  statusBarItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
  statusBarItem.tooltip = 'GIF Recording in Progress - Click to stop';
  statusBarItem.command = 'vscode-gif-recorder.stopRecording';
  statusBarItem.show();

  // Create a visual effect in the editor as well
  if (!decorationType) {
    decorationType = vscode.window.createTextEditorDecorationType({
      isWholeLine: true,
      backgroundColor: 'rgba(255, 0, 0, 0.05)',
      border: '1px solid rgba(255, 0, 0, 0.3)',
    });
  }

  // Show notification with recording border theme
  vscode.window.showInformationMessage(
    '🔴 Recording Started - Your screen is being captured',
    { modal: false }
  );
}

/**
 * Hides the recording border/indicator.
 */
export function hideRecordingBorder(): void {
  if (statusBarItem) {
    statusBarItem.hide();
    statusBarItem.dispose();
    statusBarItem = undefined;
  }

  if (decorationType) {
    decorationType.dispose();
    decorationType = undefined;
  }
}

/**
 * Updates the recording indicator with frame count.
 */
export function updateRecordingIndicator(frameCount: number): void {
  if (statusBarItem) {
    statusBarItem.text = `$(circle-filled) Recording (${frameCount} frames)`;
  }
}
