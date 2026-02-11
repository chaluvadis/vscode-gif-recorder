# VS Code GIF Recorder

Quickly record your VS Code workflows and save them as animated GIFs—perfect for demos, tutorials, and bug reports.

## What is this?

Ever wanted to show someone exactly how to do something in VS Code without recording a full video? This extension lets you capture your screen activity and turn it into a lightweight animated GIF that's easy to share anywhere.

Whether you're creating a quick demo, documenting a bug, or making a tutorial, GIF Recorder makes it simple to capture and export your workflow in just a few clicks.

![Recording preview showing the control panel and captured frames](media/recording.gif)

## Key Features

- **Easy-to-use control panel** with big, obvious Start and Stop buttons
- **Clear visual feedback** with a red recording indicator in your status bar
- **Pause and resume** to skip parts you don't want to include
- **Preview before saving** with playback controls so you know exactly what you're getting
- **One-click export** to save your recording as a GIF file

## How to Use

### Quick Start (Recommended)

1. Open the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) and run **"GIF Recorder: Show Recording Controls"**
2. Click the **Start Recording** button—you'll see a red 🔴 indicator in your status bar
3. Do whatever you want to capture in VS Code
4. Click **Stop Recording** when you're done
5. Preview your recording, then click **Save as GIF**
6. Choose where to save it, and you're done!

### Using Commands

If you prefer using the command palette directly:

- **Start Recording**: Opens `GIF Recorder: Start Recording`
- **Pause/Resume**: Use `GIF Recorder: Pause Recording` and `GIF Recorder: Resume Recording` to skip unwanted parts
- **Stop Recording**: Run `GIF Recorder: Stop Recording` when finished

After stopping, you'll get a preview window where you can scrub through frames, play the animation, and either save or discard your recording.

## Installation (For Development)

Want to try it out or contribute? Here's how to get started:

```bash
git clone https://github.com/chaluvadis/vscode-gif-recorder.git
cd vscode-gif-recorder
pnpm install
```

Then press `F5` in VS Code to launch the extension in a development window.

## Configuration

You can customize various settings to optimize your GIF recordings:

### Output Directory
- **Setting**: `vscode-gif-recorder.outputDirectory`
- **Default**: `~/Downloads`
- **Accepts**: Absolute paths, `~` for home directory, or paths relative to your workspace folder

### Optimization Settings

The extension includes powerful optimization features to reduce GIF file sizes while maintaining quality:

#### Quality Preset (Recommended)
- **Setting**: `vscode-gif-recorder.qualityPreset`
- **Default**: `balanced`
- **Options**:
  - `highQuality` - Best visual quality, larger file size (Quality: 15, FPS: 15)
  - `balanced` - Good balance between quality and file size (Quality: 10, FPS: 10) - **Default**
  - `smallFile` - Smallest file size, acceptable quality (Quality: 5, FPS: 8)
  - `custom` - Use custom quality and FPS settings (see below)

**Tip**: Start with the default `balanced` preset. Switch to `smallFile` if you need to minimize file sizes (e.g., for frequent sharing), or `highQuality` for demos requiring crisp visuals.

#### Frame Rate (FPS)
- **Setting**: `vscode-gif-recorder.fps`
- **Default**: `10` (used when `qualityPreset` is set to `custom`)
- **Range**: 5-30 FPS
- **Description**: Higher FPS produces smoother animations but larger files. 10-15 FPS is typically ideal for screen recordings.

#### Quality
- **Setting**: `vscode-gif-recorder.quality`
- **Default**: `10` (used when `qualityPreset` is set to `custom`)
- **Range**: 1-20 (higher values improve quality at the cost of larger files)
- **Description**: Controls the precision of the GIF color quantization algorithm. Lower values use more aggressive quantization (smaller files but reduced color accuracy).

#### Algorithm Selection
- **Setting**: `vscode-gif-recorder.algorithm`
- **Default**: `octree`
- **Options**:
  - `octree` - Generally produces smaller files, ideal for screen recordings with solid colors and text
  - `neuquant` - Neural network based, better for photographic content

#### Frame Deduplication
- **Setting**: `vscode-gif-recorder.deduplicateFrames`
- **Default**: `true` (enabled)
- **Description**: Automatically skips duplicate or nearly-identical consecutive frames to significantly reduce file size. Highly recommended for screen recordings where content may remain static for periods.

#### Deduplication Threshold
- **Setting**: `vscode-gif-recorder.deduplicationThreshold`
- **Default**: `99`
- **Range**: 90-100
- **Description**: Frames that are more than this percentage similar will be considered duplicates and skipped. Higher values are more strict (99 = 99% similar to be considered duplicate).

#### Optimizer
- **Setting**: `vscode-gif-recorder.useOptimizer`
- **Default**: `true` (enabled)
- **Description**: Reduces file size by reusing color tables when consecutive frames are similar. Highly recommended for screen recordings.

#### Optimizer Threshold
- **Setting**: `vscode-gif-recorder.optimizerThreshold`
- **Default**: `90`
- **Range**: 0-100
- **Description**: Higher values enable more aggressive optimization. At 90%, the optimizer will reuse color tables when frames differ by less than 10%.

#### Maximum Width
- **Setting**: `vscode-gif-recorder.maxWidth`
- **Default**: `0` (no scaling)
- **Description**: Maximum width for the output GIF in pixels. If your captured frames exceed this width, they will be scaled down proportionally. Set to 0 to disable scaling. Useful for high-DPI displays where recordings may be unnecessarily large.

### Why These Optimizations Matter

Screen recordings often contain:
- **Static content**: Code editors, toolbars, and UI elements that don't change between frames
- **Repetitive patterns**: Similar color palettes across frames
- **High resolution**: Modern displays produce large frame sizes

With the default optimizations enabled, you can expect:

- **40-70% smaller file sizes** for typical VS Code screen recordings with frame deduplication
- **30-50% smaller files** compared to basic encoding without optimization
- Faster encoding times when frames have minimal changes
- No perceptible quality loss for most use cases

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