/**
 * Recording Control Panel module for managing recording UI.
 * Provides Record/Stop buttons and visual recording indicators.
 */

import * as vscode from 'vscode';

let controlPanel: vscode.WebviewPanel | undefined;
let onRecordingStartCallback: (() => void) | undefined;
let onRecordingStopCallback: (() => void) | undefined;

/**
 * Shows the recording control panel with Record/Stop buttons.
 * 
 * @param onStart - Callback when user clicks Record button
 * @param onStop - Callback when user clicks Stop button
 * @param isRecording - Current recording state to display
 */
export function showRecordingControlPanel(
  onStart: () => void,
  onStop: () => void,
  isRecording: boolean = false
): void {
  onRecordingStartCallback = onStart;
  onRecordingStopCallback = onStop;

  if (controlPanel) {
    controlPanel.reveal(vscode.ViewColumn.One);
    // Ensure the panel UI reflects the current recording state when revealed
    setRecordingState(isRecording);
    return;
  }

  controlPanel = vscode.window.createWebviewPanel(
    'gifRecordingControls',
    'GIF Recording Controls',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  controlPanel.webview.html = getControlPanelContent(false);

  controlPanel.onDidDispose(() => {
    controlPanel = undefined;
    // Clear callbacks when panel is disposed
    onRecordingStartCallback = undefined;
    onRecordingStopCallback = undefined;
  });

  controlPanel.webview.onDidReceiveMessage(
    message => {
      try {
        switch (message.command) {
          case 'startRecording':
            if (onRecordingStartCallback) {
              onRecordingStartCallback();
            }
            break;
          case 'stopRecording':
            if (onRecordingStopCallback) {
              onRecordingStopCallback();
            }
            break;
        }
      } catch (error) {
        console.error('Error while handling recording control panel message:', error);
        vscode.window.showErrorMessage('An error occurred while handling a recording command. Please check the extension logs for details.');
      }
    }
  );
}

/**
 * Updates the control panel to show recording state.
 */
export function setRecordingState(isRecording: boolean): void {
  if (controlPanel) {
    // Use postMessage to update UI state instead of replacing HTML
    controlPanel.webview.postMessage({ 
      command: 'updateRecordingState', 
      isRecording 
    });
  }
}

/**
 * Closes the recording control panel.
 */
export function closeRecordingControlPanel(): void {
  if (controlPanel) {
    controlPanel.dispose();
    controlPanel = undefined;
  }
}

/**
 * Generates the HTML content for the control panel.
 */
function getControlPanelContent(isRecording: boolean): string {
  const recordingIndicator = isRecording 
    ? `
      <div class="recording-indicator">
        <div class="recording-dot"></div>
        <span>Recording in Progress...</span>
      </div>
      <div class="recording-border-hint">
        <p>🎬 Your screen is being recorded</p>
        <p class="hint-text">A status bar indicator shows recording status</p>
      </div>
    `
    : '';

  const mainButton = isRecording
    ? `<button id="stopButton" class="stop-button">⏹ Stop Recording</button>`
    : `<button id="recordButton" class="record-button">⏺ Start Recording</button>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <title>GIF Recording Controls</title>
    <style>
        body {
            padding: 20px;
            margin: 0;
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        .container {
            text-align: center;
            max-width: 400px;
            width: 100%;
        }

        h1 {
            margin: 0 0 20px 0;
            font-size: 24px;
            font-weight: 600;
        }

        .recording-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
            padding: 15px;
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 4px;
            animation: pulse 2s ease-in-out infinite;
        }

        .recording-dot {
            width: 12px;
            height: 12px;
            background-color: #ff0000;
            border-radius: 50%;
            animation: blink 1s ease-in-out infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        .recording-border-hint {
            margin-bottom: 20px;
            padding: 15px;
            background-color: var(--vscode-inputValidation-infoBackground);
            border: 1px solid var(--vscode-inputValidation-infoBorder);
            border-radius: 4px;
        }

        .recording-border-hint p {
            margin: 5px 0;
        }

        .hint-text {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }

        button {
            padding: 12px 24px;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: var(--vscode-font-family);
            font-weight: 600;
            transition: all 0.2s;
            min-width: 200px;
        }

        .record-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }

        .record-button:hover {
            background-color: var(--vscode-button-hoverBackground);
            transform: scale(1.05);
        }

        .stop-button {
            background-color: #d73a49;
            color: white;
        }

        .stop-button:hover {
            background-color: #cb2431;
            transform: scale(1.05);
        }

        .instructions {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 3px solid var(--vscode-textBlockQuote-border);
            text-align: left;
            font-size: 13px;
            line-height: 1.6;
        }

        .instructions h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
        }

        .instructions ul {
            margin: 5px 0;
            padding-left: 20px;
        }

        .instructions li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 GIF Recorder</h1>
        
        ${recordingIndicator}
        
        ${mainButton}

        ${!isRecording ? `
        <div class="instructions">
            <h3>How to Record:</h3>
            <ul>
                <li>Click "Start Recording" to begin</li>
                <li>A status bar indicator will show recording status</li>
                <li>This control panel will not appear in the recording</li>
                <li>Click "Stop Recording" when done</li>
            </ul>
        </div>
        ` : ''}
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        const recordButton = document.getElementById('recordButton');
        const stopButton = document.getElementById('stopButton');

        if (recordButton) {
            recordButton.addEventListener('click', () => {
                vscode.postMessage({ command: 'startRecording' });
            });
        }

        if (stopButton) {
            stopButton.addEventListener('click', () => {
                vscode.postMessage({ command: 'stopRecording' });
            });
        }

        // Listen for state updates from extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'updateRecordingState') {
                updateUIForRecordingState(message.isRecording);
            }
        });

        function updateUIForRecordingState(isRecording) {
            const container = document.querySelector('.container');
            if (!container) return;

            const recordingIndicator = isRecording 
                ? \`
                  <div class="recording-indicator">
                    <div class="recording-dot"></div>
                    <span>Recording in Progress...</span>
                  </div>
                  <div class="recording-border-hint">
                    <p>🎬 Your screen is being recorded</p>
                    <p class="hint-text">A status bar indicator shows recording status</p>
                  </div>
                \`
                : '';

            const mainButton = isRecording
                ? \`<button id="stopButton" class="stop-button">⏹ Stop Recording</button>\`
                : \`<button id="recordButton" class="record-button">⏺ Start Recording</button>\`;

            const instructions = !isRecording ? \`
                <div class="instructions">
                    <h3>How to Record:</h3>
                    <ul>
                        <li>Click "Start Recording" to begin</li>
                        <li>A status bar indicator will show recording status</li>
                        <li>This control panel will not appear in the recording</li>
                        <li>Click "Stop Recording" when done</li>
                    </ul>
                </div>
            \` : '';

            container.innerHTML = \`
                <h1>🎬 GIF Recorder</h1>
                \${recordingIndicator}
                \${mainButton}
                \${instructions}
            \`;

            // Reattach event listeners
            const newRecordButton = document.getElementById('recordButton');
            const newStopButton = document.getElementById('stopButton');

            if (newRecordButton) {
                newRecordButton.addEventListener('click', () => {
                    vscode.postMessage({ command: 'startRecording' });
                });
            }

            if (newStopButton) {
                newStopButton.addEventListener('click', () => {
                    vscode.postMessage({ command: 'stopRecording' });
                });
            }
        }
    </script>
</body>
</html>`;
}
