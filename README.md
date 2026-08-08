# VS Code GIF Recorder

Quickly record your VS Code workflows and save them as animated GIFs—perfect for demos, tutorials, and bug reports.

## What is this?

Ever wanted to show someone exactly how to do something in VS Code without recording a full video? This extension lets you capture your screen activity and turn it into a lightweight animated GIF that's easy to share anywhere.

Whether you're creating a quick demo, documenting a bug, or making a tutorial, GIF Recorder makes it simple to capture and export your workflow in just a few clicks.

## Key Features

- **Pause and resume** to skip parts you don't want to include
- **Preview before saving** with playback controls so you know exactly what you're getting
- **One-click export** to save your recording as a GIF file
- **Frame deduplication** to reduce file size by skipping near-identical consecutive frames
- **Max width scaling** for high-DPI displays
- **Background conversion** via worker threads—keeps VS Code responsive
- **Cancellation support** to abort long-running conversions

## How to Use

### Quick Start

1. Open the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. Run **"GIF Recorder: Start Recording"**—you'll see a red recording indicator
3. Do whatever you want to capture in VS Code
4. Optionally use **"GIF Recorder: Pause Recording"** / **"GIF Recorder: Resume Recording"** to skip unwanted parts
5. Run **"GIF Recorder: Stop Recording"** when you're done
6. Preview your recording, then click **Save as GIF**
7. Choose where to save it, and you're done!

### Commands

| Command | Description |
|---------|-------------|
| `GIF Recorder: Start Recording` | Begins capturing screen frames |
| `GIF Recorder: Pause Recording` | Pauses frame capture |
| `GIF Recorder: Resume Recording` | Resumes frame capture after pause |
| `GIF Recorder: Stop Recording` | Stops capture and opens the preview panel |

## Installation (For Development)

Want to try it out or contribute?

```bash
git clone https://github.com/chaluvadis/vscode-gif-recorder.git
cd vscode-gif-recorder
pnpm install
```

Then press `F5` in VS Code to launch the extension in a development window.

## Building from Source

```bash
pnpm run compile       # TypeScript type-checking
pnpm run esbuild:prod  # Production bundles (extension + worker)
pnpm run package       # Build + package into a .vsix file
```

> **Note**: When using `vsce package` directly, pass `--no-dependencies` since this project uses pnpm and `vsce`'s default npm dependency check does not resolve pnpm's `node_modules` structure.

## Configuration

All settings are optional. Defaults are chosen to produce good-quality GIFs with reasonable file sizes.

### Output Directory
- **Setting**: `vscode-gif-recorder.outputDirectory`
- **Default**: `~/Downloads`
- **Accepts**: Absolute paths, `~` for home directory, or paths relative to your workspace folder

### Quality Preset (Recommended)
- **Setting**: `vscode-gif-recorder.qualityPreset`
- **Default**: `balanced`
- **Options**:
  - `highQuality` — Best visual quality, larger file size (Quality: 15, FPS: 15)
  - `balanced` — Good balance between quality and file size (Quality: 10, FPS: 10) — **Default**
  - `smallFile` — Smallest file size, acceptable quality (Quality: 5, FPS: 8)
  - `custom` — Use individual quality and FPS settings below

**Tip**: Start with the default `balanced` preset. Switch to `smallFile` if you need to minimize file sizes, or `highQuality` for demos requiring crisp visuals.

### Frame Rate (FPS)
- **Setting**: `vscode-gif-recorder.fps`
- **Default**: `10` (used when `qualityPreset` is `custom`)
- **Range**: 5–30 FPS
- Higher FPS produces smoother animations but larger files. 10–15 FPS is typically ideal for screen recordings.

### Quality
- **Setting**: `vscode-gif-recorder.quality`
- **Default**: `10` (used when `qualityPreset` is `custom`)
- **Range**: 1–20 (higher values improve quality at the cost of larger files)
- Controls the precision of the GIF color quantization algorithm.

### Frame Deduplication
- **Setting**: `vscode-gif-recorder.deduplicateFrames`
- **Default**: `true` (enabled)
- Automatically skips duplicate or nearly-identical consecutive frames to significantly reduce file size.

### Deduplication Threshold
- **Setting**: `vscode-gif-recorder.deduplicationThreshold`
- **Default**: `99`
- **Range**: 90–100
- Frames more similar than this threshold percentage are considered duplicates and skipped.

### Optimizer
- **Setting**: `vscode-gif-recorder.useOptimizer`
- **Default**: `true`
- **Status**: *Feature pending implementation* — intended to reuse color tables when consecutive frames are similar.

### Optimizer Threshold
- **Setting**: `vscode-gif-recorder.optimizerThreshold`
- **Default**: `90`
- **Range**: 0–100
- **Status**: *Feature pending implementation* — intended to control color-table reuse aggressiveness.

### Maximum Width
- **Setting**: `vscode-gif-recorder.maxWidth`
- **Default**: `0` (no scaling)
- Maximum width for the output GIF in pixels. If captured frames exceed this width, they are scaled down proportionally. Set to `0` to disable. Useful for high-DPI displays.

### Example Configurations

**For Documentation/Tutorials** (best quality):
```json
{
  "vscode-gif-recorder.qualityPreset": "highQuality"
}
```

**For Quick Sharing** (smallest files):
```json
{
  "vscode-gif-recorder.qualityPreset": "smallFile",
  "vscode-gif-recorder.maxWidth": 1280
}
```

**Custom Fine-tuning**:
```json
{
  "vscode-gif-recorder.qualityPreset": "custom",
  "vscode-gif-recorder.fps": 12,
  "vscode-gif-recorder.quality": 8,
  "vscode-gif-recorder.deduplicateFrames": true,
  "vscode-gif-recorder.maxWidth": 1920
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the VS Code community. Found a bug or have a suggestion? [Open an issue](https://github.com/chaluvadis/vscode-gif-recorder/issues)!
