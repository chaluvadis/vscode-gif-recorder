import * as vscode from 'vscode';
import { startRecording, stopRecording } from './recorder';

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
      vscode.window.showInformationMessage('GIF recording started!');
    }
  );

  // Register the stop recording command
  const stopRecordingCommand = vscode.commands.registerCommand(
    'vscode-gif-recorder.stopRecording',
    () => {
      stopRecording();
      vscode.window.showInformationMessage('GIF recording stopped!');
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
