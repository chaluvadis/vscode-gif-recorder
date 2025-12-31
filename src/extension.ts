import * as vscode from 'vscode';
import { startRecording, stopRecording } from './recorder';
import { convertToGif } from './gifConverter';
import * as path from 'path';
import * as os from 'os';

/**
 * This method is called when the extension is activated.
 * The extension is activated the very first time a command is executed.
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('vscode-gif-recorder is now active!');

  // Register the start recording command
  const startRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.startRecording',
    () => {
      startRecording();
      vscode.window.showInformationMessage('GIF recording started! Capturing screen at 10 FPS...');
    }
  );

  // Register the stop recording command
  const stopRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.stopRecording',
    async () => {
      const frames = stopRecording();
      
      if (frames.length === 0) {
        vscode.window.showWarningMessage('No frames were captured. Recording may not have been started.');
        return;
      }

      vscode.window.showInformationMessage(`Recording stopped! Captured ${frames.length} frames.`);

      // Show save dialog for output file
      const defaultFileName = `recording-${Date.now()}.gif`;
      const defaultPath = path.join(os.homedir(), 'Downloads', defaultFileName);
      
      const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(defaultPath),
        filters: {
          'GIF files': ['gif']
        },
        saveLabel: 'Save GIF'
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
          cancellable: false
        },
        async (progress) => {
          progress.report({ increment: 0, message: 'Processing frames...' });
          
          try {
            const outputPath = await convertToGif(frames, {
              outputPath: saveUri.fsPath,
              fps: 10,
              quality: 10
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
  );

  context.subscriptions.push(startRecordingCommand);
  context.subscriptions.push(stopRecordingCommand);
}

/**
 * This method is called when the extension is deactivated.
 */
export function deactivate() {
  console.log('vscode-gif-recorder is now deactivated.');
}
