# VS Code GIF Recorder

Record VS Code workflows and export them as animated GIFs in seconds.

## Overview

VS Code GIF Recorder captures your editor workflow and converts the captured frames into an animated GIF. It is designed for demos, bug reports, and quick walkthroughs where a lightweight visual artifact is more convenient than a full video.

The extension uses `screenshot-desktop` to capture the primary display at a fixed frame rate, buffers the frames in memory, lets you inspect them in a dedicated preview panel, and finally encodes them into a GIF with `gif-encoder-2` and `pngjs`.

## Features

- **Recording Control Panel**: A dedicated UI panel with Record and Stop buttons for easy access
- **Visual Recording Indicator**: A prominent red status bar indicator shows when recording is active
- **Frame Counter**: Live frame count updates during recording
- Start, stop, pause, and resume recording directly from the command palette or control panel
- Capture the active desktop at 10 FPS (configurable in code via DEFAULT_FPS).
- Live preview panel with frame slider, play/pause controls, and discard/save options.
- GIF export with progress reporting, automatic default filename, and open-on-complete prompt.
- Biome-powered linting and formatting for a consistent development workflow.

## Recording Flow

1. Run `GIF Recorder: Show Recording Controls` to open the control panel with Record and Stop buttons.
2. Click **Start Recording** button (or use `GIF Recorder: Start Recording` command) to begin capturing. A red status bar indicator appears.
3. The control panel updates to show recording status with a Stop button and frame counter in the status bar.
4. `GIF Recorder: Pause Recording` toggles a flag so frames are temporarily skipped without clearing the buffered data.
5. Click **Stop Recording** button (or use `GIF Recorder: Stop Recording` command) to finish. The status bar indicator disappears and an interactive preview webview opens.
6. In the preview, review your recording using the frame slider and playback controls.
7. Selecting **Save as GIF** prompts for a destination, encodes the buffered frames with a 10 FPS delay and quality 10, and writes the file to disk.
8. A notification with progress feedback is shown during encoding, and you can open the resulting file immediately after completion.

## Preview Controls

- Frame slider requests specific frames from the extension via webview messaging.
- Play button loops through frames at the capture FPS and can be paused at any time.
- Save button confirms the preview and moves on to the GIF export step.
- Discard button closes the preview and drops the buffered frames.

## Installation

```bash
git clone https://github.com/chaluvadis/vscode-gif-recorder.git
cd vscode-gif-recorder
npm install
```

Launch the extension in a VS Code Extension Development Host by pressing `F5`.

## Usage in VS Code

### Method 1: Using the Control Panel (Recommended)
1. Run `GIF Recorder: Show Recording Controls` from the command palette to open the control panel.
2. Click the **Start Recording** button in the panel.
3. A red status bar indicator (🔴 Recording) appears, showing the recording is active.
4. Perform the actions you want to capture. The control panel will not appear in the recording.
5. Click the **Stop Recording** button when done.
6. Review the capture in the preview panel, then choose **Save as GIF** or **Discard Recording**.
7. Select your desired save location in the file dialog.
8. After saving, choose **Open File** in the notification to view the generated GIF.

## Configuration

- `vscode-gif-recorder.outputDirectory`: default folder suggested when saving a recording. Defaults to `~/Downloads`, but accepts any absolute path, `~`, or paths relative to the first workspace folder.

### Method 2: Using Command Palette
1. Run `GIF Recorder: Start Recording` from the command palette.
2. A red status bar indicator shows recording is active with frame count updates.
3. Perform the actions you want to capture.
4. Optionally run `GIF Recorder: Pause Recording` and `GIF Recorder: Resume Recording` to skip unwanted segments.
5. Run `GIF Recorder: Stop Recording`. Review the capture in the preview panel, then choose **Save as GIF** or **Discard Recording**.
6. Select your desired save location in the file dialog.
7. After saving, choose **Open File** in the notification to view the generated GIF.

## Future Enhancements

- Make FPS, quality, and destination defaults configurable through VS Code settings.
- Add region capture or window selection before recording starts.
- Support trimming or deleting frames from the preview before export.
- Offer optional downscaling to reduce GIF size without manual editing.

## License

MIT License. See [LICENSE](LICENSE) for details.