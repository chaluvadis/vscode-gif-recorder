# VS Code GIF Recorder

Record VS Code workflows and export them as animated GIFs in seconds.

## Overview

VS Code GIF Recorder captures your editor workflow and converts the captured frames into an animated GIF. It is designed for demos, bug reports, and quick walkthroughs where a lightweight visual artifact is more convenient than a full video.

The extension uses `screenshot-desktop` to capture the primary display at a fixed frame rate, buffers the frames in memory, lets you inspect them in a dedicated preview panel, and finally encodes them into a GIF with `gif-encoder-2` and `pngjs`.

## Features

- Start, stop, pause, and resume recording directly from the command palette.
- Capture the active desktop at 10 FPS (configurable in code via DEFAULT_FPS).
- Live preview panel with frame slider, play/pause controls, and discard/save options.
- GIF export with progress reporting, automatic default filename, and open-on-complete prompt.
- Biome-powered linting and formatting for a consistent development workflow.

## Recording Flow

1. `GIF Recorder: Start Recording` sets up an interval that captures PNG screenshots on the primary display and streams them into memory.
2. `GIF Recorder: Pause Recording` toggles a flag so frames are temporarily skipped without clearing the buffered data.
3. `GIF Recorder: Stop Recording` opens an interactive preview webview. Closing the panel without saving discards the capture.
4. Selecting **Save as GIF** prompts for a destination, encodes the buffered frames with a 10 FPS delay and quality 10, and writes the file to disk.
5. A notification with progress feedback is shown during encoding, and you can open the resulting file immediately after completion.

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

1. Run `GIF Recorder: Start Recording` from the command palette.
2. Perform the actions you want to capture.
3. Optionally run `GIF Recorder: Pause Recording` and `GIF Recorder: Resume Recording` to skip unwanted segments.
4. Run `GIF Recorder: Stop Recording`. Review the capture in the preview panel, then choose **Save as GIF** or **Discard Recording**.
5. After saving, choose **Open File** in the notification to view the generated GIF.

## Development Tasks

```bash
npm run compile   # TypeScript build
npm run watch     # Incremental build
npm run lint      # Biome lint checks
npm run format    # Biome formatter (writes in place)
```
## Known Limitations

- Screenshots capture the whole primary desktop; window-only or region capture is not available.
- Frames are buffered entirely in memory which can consume significant RAM for long or high-resolution recordings.
- Capture and encoding run on the extension host thread, so very large sessions may temporarily impact VS Code responsiveness.
- Mouse cursor visibility depends on the underlying OS capabilities of `screenshot-desktop`.

## Future Enhancements

- Make FPS, quality, and destination defaults configurable through VS Code settings.
- Add region capture or window selection before recording starts.
- Support trimming or deleting frames from the preview before export.
- Offer optional downscaling to reduce GIF size without manual editing.

## License

MIT License. See [LICENSE](LICENSE) for details.