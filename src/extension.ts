import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import {
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  DEFAULT_FPS,
  setOnFrameCaptured,
  clearOnFrameCaptured,
  getRecordingStatus,
} from './recorder';
import { convertToGif } from './gifConverter';
import { showPreview } from './previewPanel';
import {
  showRecordingControlPanel,
  setRecordingState,
  closeRecordingControlPanel,
} from './recordingControlPanel';
import {
  showRecordingBorder,
  hideRecordingBorder,
  updateRecordingIndicator,
} from './recordingBorder';

/**
 * Helper function to set up and start recording with visual indicators.
 */
function handleStartRecording(): void {
  // Set up frame capture callback for visual updates
  setOnFrameCaptured((frameCount) => {
    updateRecordingIndicator(frameCount);
  });

  startRecording();
  
  // Show visual indicators
  showRecordingBorder();
  setRecordingState(true);
  
  vscode.window.showInformationMessage(
    `GIF recording started! Capturing screen at ${DEFAULT_FPS} FPS...`
  );
}

/**
 * Helper function to handle the complete stop recording workflow.
 */
async function handleStopRecording(): Promise<void> {
  const frames = stopRecording();

  // Clear frame capture callback and hide visual indicators
  clearOnFrameCaptured();
  hideRecordingBorder();
  setRecordingState(false);

  if (frames.length === 0) {
    vscode.window.showWarningMessage(
      'No frames were captured. Recording may not have been started.'
    );
    return;
  }

  vscode.window.showInformationMessage(`Recording stopped! Captured ${frames.length} frames.`);

  // Show preview and wait for user decision
  const userAction = await showPreview(frames);

  if (userAction === 'discard') {
    vscode.window.showInformationMessage('Recording discarded.');
    return;
  }

  // Show save dialog for output file
  const defaultFileName = `recording-${Date.now()}.gif`;
  const defaultPath = path.join(os.homedir(), 'Downloads', defaultFileName);

  const saveUri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(defaultPath),
    filters: {
      'GIF files': ['gif'],
    },
    saveLabel: 'Save GIF',
  });

  if (!saveUri) {
    vscode.window.showInformationMessage('GIF save cancelled.');
    return;
  }

  // Show progress while converting
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Converting to GIF',
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0, message: 'Processing frames...' });

      try {
        const outputPath = await convertToGif(frames, {
          outputPath: saveUri.fsPath,
          fps: 10,
          quality: 10,
        });

        progress.report({ increment: 100, message: 'Complete!' });

        const openAction = 'Open File';
        const result = await vscode.window.showInformationMessage(
          `GIF saved successfully to ${outputPath}`,
          openAction
        );

        if (result === openAction) {
          vscode.env.openExternal(vscode.Uri.file(outputPath));
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to create GIF: ${error instanceof Error ? error.message : String(error)}`
        );
        console.error('GIF conversion error:', error);
      }
    }
  );
}

/**
 * This method is called when the extension is activated.
 * The extension is activated the very first time a command is executed.
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('vscode-gif-recorder is now active!');

  // Register command to show recording controls
  const showControlsCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.showControls',
    () => {
      showRecordingControlPanel(
        handleStartRecording,
        handleStopRecording,
        getRecordingStatus()
      );
    }
  );

  // Register the start recording command
  const startRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.startRecording',
    handleStartRecording
  );

  // Register the stop recording command
  const stopRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.stopRecording',
    handleStopRecording
  );

  // Register the pause recording command
  const pauseRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.pauseRecording',
    () => {
      pauseRecording();
      vscode.window.showInformationMessage('GIF recording paused.');
    }
  );

  // Register the resume recording command
  const resumeRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.resumeRecording',
    () => {
      resumeRecording();
      vscode.window.showInformationMessage('GIF recording resumed!');
    }
  );

  context.subscriptions.push(showControlsCommand);
  context.subscriptions.push(startRecordingCommand);
  context.subscriptions.push(stopRecordingCommand);
  context.subscriptions.push(pauseRecordingCommand);
  context.subscriptions.push(resumeRecordingCommand);
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate() {
  // Stop any active recording to prevent memory leaks
  stopRecording();
  
  // Clean up resources
  hideRecordingBorder();
  closeRecordingControlPanel();
  clearOnFrameCaptured();
  
  console.log('vscode-gif-recorder is now deactivated.');
}
