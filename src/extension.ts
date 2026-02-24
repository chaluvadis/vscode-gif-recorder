import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import {
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  setOnFrameCaptured,
  clearOnFrameCaptured,
} from './recorder';
import { convertToGif } from './gifConverter';
import { showPreview } from './previewPanel';
import {
  showRecordingBorder,
  hideRecordingBorder,
  updateRecordingIndicator,
} from './recordingBorder';

// Status bar items for recording controls
let startRecordingStatusBarItem: vscode.StatusBarItem;
let stopRecordingStatusBarItem: vscode.StatusBarItem;

/**
 * Update status bar items based on recording state.
 */
function updateStatusBarItems(isRecording: boolean): void {
  if (isRecording) {
    startRecordingStatusBarItem.hide();
    stopRecordingStatusBarItem.show();
  } else {
    startRecordingStatusBarItem.show();
    stopRecordingStatusBarItem.hide();
  }
}

function getDefaultOutputDirectory(): string {
  const configuration = vscode.workspace.getConfiguration('vscode-gif-recorder');
  const configuredPath = configuration.get<string>('outputDirectory') ?? '~/Downloads';

  if (configuredPath) {
    const trimmed = configuredPath.trim();
    if (trimmed.length > 0) {
      let resolved = trimmed;

      if (trimmed.startsWith('~')) {
        resolved = path.join(os.homedir(), trimmed.slice(1));
      } else if (!path.isAbsolute(trimmed)) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
          resolved = path.join(workspaceFolders[0].uri.fsPath, trimmed);
        } else {
          resolved = path.join(os.homedir(), trimmed);
        }
      }

      return path.normalize(resolved);
    }
  }

  return path.join(os.homedir(), 'Downloads');
}

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
  updateStatusBarItems(true);
  // Notification removed to prevent it from being captured in the recording
}

/**
 * Helper function to get quality settings based on the selected preset.
 */
function getQualitySettings(configuration: vscode.WorkspaceConfiguration): {
  quality: number;
  fps: number;
} {
  const preset = configuration.get<string>('qualityPreset') ?? 'balanced';

  switch (preset) {
    case 'highQuality':
      return { quality: 15, fps: 15 };
    case 'smallFile':
      return { quality: 5, fps: 8 };
    case 'balanced':
      return { quality: 10, fps: 10 };
    case 'custom':
      return {
        quality: configuration.get<number>('quality') ?? 10,
        fps: configuration.get<number>('fps') ?? 10,
      };
    default:
      return { quality: 10, fps: 10 };
  }
}

/**
 * Helper function to handle the complete stop recording workflow.
 */
async function handleStopRecording(): Promise<void> {
  const frames = stopRecording();

  // Clear frame capture callback and hide visual indicators
  clearOnFrameCaptured();
  hideRecordingBorder();
  updateStatusBarItems(false);

  if (frames.length === 0) {
    vscode.window.showWarningMessage(
      'No frames were captured. Recording may not have been started.'
    );
    return;
  }

  // Notification removed to prevent it from being captured if a new recording starts

  // Show preview and wait for user decision
  const userAction = await showPreview(frames);

  if (userAction === 'discard') {
    vscode.window.showInformationMessage('Recording discarded.');
    return;
  }

  // Show save dialog for output file
  const defaultFileName = `recording-${Date.now()}.gif`;
  const defaultDirectory = getDefaultOutputDirectory();
  const defaultPath = path.join(defaultDirectory, defaultFileName);

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

  // Get configuration settings
  const configuration = vscode.workspace.getConfiguration('vscode-gif-recorder');
  const algorithm = configuration.get<'octree' | 'neuquant'>('algorithm') ?? 'octree';
  const useOptimizer = configuration.get<boolean>('useOptimizer') ?? true;
  const threshold = configuration.get<number>('optimizerThreshold') ?? 90;
  const deduplicateFrames = configuration.get<boolean>('deduplicateFrames') ?? true;
  const deduplicationThreshold = configuration.get<number>('deduplicationThreshold') ?? 99;
  const maxWidth = configuration.get<number>('maxWidth') ?? 0;

  // Get quality and FPS from preset or custom settings
  const { quality, fps: targetFps } = getQualitySettings(configuration);

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
          fps: targetFps,
          quality: quality,
          algorithm: algorithm,
          useOptimizer: useOptimizer,
          threshold: threshold,
          deduplicateFrames: deduplicateFrames,
          deduplicationThreshold: deduplicationThreshold,
          maxWidth: maxWidth,
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

  // Create status bar items for recording controls
  // Start recording button
  startRecordingStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  startRecordingStatusBarItem.text = '$(record) Start Recording';
  startRecordingStatusBarItem.tooltip = 'Start GIF Recording';
  startRecordingStatusBarItem.command = 'vscode-gif-recorder.startRecording';
  startRecordingStatusBarItem.show();

  // Stop recording button
  stopRecordingStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  stopRecordingStatusBarItem.text = '$(debug-stop) Stop Recording';
  stopRecordingStatusBarItem.tooltip = 'Stop GIF Recording';
  stopRecordingStatusBarItem.command = 'vscode-gif-recorder.stopRecording';
  stopRecordingStatusBarItem.backgroundColor = new vscode.ThemeColor(
    'statusBarItem.errorBackground'
  );
  stopRecordingStatusBarItem.hide();

  context.subscriptions.push(startRecordingStatusBarItem);
  context.subscriptions.push(stopRecordingStatusBarItem);

  // Register the start recording command
  const startRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.startRecording',
    handleStartRecording
  );

  // Register the stop recording command
  const stopRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.stopRecording',
    async () => {
      try {
        await handleStopRecording();
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to stop recording: ${error instanceof Error ? error.message : String(error)}`
        );
        console.error('Stop recording error:', error);
      }
    }
  );

  // Register the pause recording command
  const pauseRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.pauseRecording',
    () => {
      pauseRecording();
      // Notification removed to prevent it from being captured in the recording
    }
  );

  // Register the resume recording command
  const resumeRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.resumeRecording',
    () => {
      resumeRecording();
      // Notification removed to prevent it from being captured in the recording
    }
  );

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
  clearOnFrameCaptured();

  // Dispose status bar items
  startRecordingStatusBarItem?.dispose();
  stopRecordingStatusBarItem?.dispose();

  console.log('vscode-gif-recorder is now deactivated.');
}
