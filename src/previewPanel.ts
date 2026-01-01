/**
 * Preview panel module for displaying recorded frames before saving.
 */

import * as vscode from 'vscode';
import { Frame } from './gifConverter';

let currentPanel: vscode.WebviewPanel | undefined;
let currentFrames: Frame[] = [];
let previewCallback: ((action: 'save' | 'discard') => void) | undefined;

/**
 * Shows a preview of the recorded frames in a webview panel.
 * 
 * @param frames - Array of captured frames to preview
 * @returns Promise that resolves with 'save' or 'discard' based on user action
 */
export async function showPreview(frames: Frame[]): Promise<'save' | 'discard'> {
  return new Promise((resolve) => {
    currentFrames = frames;
    previewCallback = resolve;

    if (currentPanel) {
      // If panel already exists, reveal it
      currentPanel.reveal(vscode.ViewColumn.One);
    } else {
      // Create new panel
      currentPanel = vscode.window.createWebviewPanel(
        'gifPreview',
        'GIF Recording Preview',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      // Handle panel disposal
      currentPanel.onDidDispose(() => {
        currentPanel = undefined;
        if (previewCallback) {
          previewCallback('discard');
          previewCallback = undefined;
        }
      });

      // Handle messages from the webview
      currentPanel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case 'save':
              if (previewCallback) {
                previewCallback('save');
                previewCallback = undefined;
              }
              currentPanel?.dispose();
              break;
            case 'discard':
              if (previewCallback) {
                previewCallback('discard');
                previewCallback = undefined;
              }
              currentPanel?.dispose();
              break;
            case 'getFrame':
              sendFrameToWebview(message.index);
              break;
          }
        }
      );
    }

    // Set the webview content
    currentPanel.webview.html = getWebviewContent(currentPanel.webview, frames.length);

    // Send first frame
    sendFrameToWebview(0);
  });
}

/**
 * Sends a specific frame to the webview for display.
 */
function sendFrameToWebview(index: number): void {
  if (!currentPanel || index < 0 || index >= currentFrames.length) {
    return;
  }

  const frame = currentFrames[index];
  const base64Image = frame.data.toString('base64');
  
  currentPanel.webview.postMessage({
    command: 'displayFrame',
    index: index,
    data: `data:image/png;base64,${base64Image}`,
    totalFrames: currentFrames.length
  });
}

/**
 * Generates the HTML content for the webview.
 */
function getWebviewContent(webview: vscode.Webview, frameCount: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GIF Recording Preview</title>
    <style>
        body {
            padding: 0;
            margin: 0;
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        
        .header {
            padding: 20px;
            background-color: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .header p {
            margin: 0;
            color: var(--vscode-descriptionForeground);
            font-size: 14px;
        }
        
        .preview-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow: auto;
            background-color: var(--vscode-editor-background);
        }
        
        .preview-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border: 1px solid var(--vscode-panel-border);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .controls {
            padding: 20px;
            background-color: var(--vscode-editor-background);
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .playback-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .slider-container {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .frame-slider {
            flex: 1;
            height: 4px;
            -webkit-appearance: none;
            appearance: none;
            background: var(--vscode-input-background);
            outline: none;
            border-radius: 2px;
        }
        
        .frame-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: var(--vscode-button-background);
            cursor: pointer;
            border-radius: 50%;
        }
        
        .frame-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: var(--vscode-button-background);
            cursor: pointer;
            border-radius: 50%;
            border: none;
        }
        
        .frame-info {
            color: var(--vscode-descriptionForeground);
            font-size: 13px;
            min-width: 100px;
            text-align: right;
        }
        
        .action-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        button {
            padding: 8px 16px;
            font-size: 13px;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-family: var(--vscode-font-family);
            transition: background-color 0.1s;
        }
        
        .play-button {
            padding: 8px 20px;
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .play-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        .save-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }
        
        .save-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .discard-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .discard-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        .loading {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            padding: 40px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎬 Recording Preview</h1>
        <p>Review your recording before saving. Use the slider to navigate through frames or play the animation.</p>
    </div>
    
    <div class="preview-container">
        <img id="previewImage" class="preview-image" alt="Preview frame" />
        <div id="loading" class="loading">Loading preview...</div>
    </div>
    
    <div class="controls">
        <div class="playback-controls">
            <button id="playButton" class="play-button">▶ Play</button>
            <div class="slider-container">
                <input type="range" id="frameSlider" class="frame-slider" min="0" max="${frameCount - 1}" value="0" />
                <span id="frameInfo" class="frame-info">Frame 1 / ${frameCount}</span>
            </div>
        </div>
        
        <div class="action-buttons">
            <button id="discardButton" class="discard-button">Discard Recording</button>
            <button id="saveButton" class="save-button">Save as GIF</button>
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        let currentFrameIndex = 0;
        let totalFrames = ${frameCount};
        let isPlaying = false;
        let playInterval = null;
        
        const previewImage = document.getElementById('previewImage');
        const loading = document.getElementById('loading');
        const frameSlider = document.getElementById('frameSlider');
        const frameInfo = document.getElementById('frameInfo');
        const playButton = document.getElementById('playButton');
        const saveButton = document.getElementById('saveButton');
        const discardButton = document.getElementById('discardButton');
        
        // Handle messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'displayFrame') {
                previewImage.src = message.data;
                previewImage.style.display = 'block';
                loading.style.display = 'none';
                currentFrameIndex = message.index;
                totalFrames = message.totalFrames;
                updateFrameInfo();
            }
        });
        
        // Request initial frame
        vscode.postMessage({ command: 'getFrame', index: 0 });
        
        // Frame slider handler
        frameSlider.addEventListener('input', (e) => {
            const index = parseInt(e.target.value);
            requestFrame(index);
        });
        
        // Play/Pause button handler
        playButton.addEventListener('click', () => {
            if (isPlaying) {
                stopPlayback();
            } else {
                startPlayback();
            }
        });
        
        // Save button handler
        saveButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'save' });
        });
        
        // Discard button handler
        discardButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'discard' });
        });
        
        function requestFrame(index) {
            vscode.postMessage({ command: 'getFrame', index: index });
        }
        
        function updateFrameInfo() {
            frameInfo.textContent = \`Frame \${currentFrameIndex + 1} / \${totalFrames}\`;
            frameSlider.value = currentFrameIndex;
        }
        
        function startPlayback() {
            isPlaying = true;
            playButton.textContent = '⏸ Pause';
            
            playInterval = setInterval(() => {
                currentFrameIndex = (currentFrameIndex + 1) % totalFrames;
                requestFrame(currentFrameIndex);
                updateFrameInfo();
            }, 100); // 10 FPS playback
        }
        
        function stopPlayback() {
            isPlaying = false;
            playButton.textContent = '▶ Play';
            if (playInterval) {
                clearInterval(playInterval);
                playInterval = null;
            }
        }
    </script>
</body>
</html>`;
}
