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

[]

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
npm install
```

Then press `F5` in VS Code to launch the extension in a development window.

## Configuration

You can customize various settings to optimize your GIF recordings:

### Output Directory
- **Setting**: `vscode-gif-recorder.outputDirectory`
- **Default**: `~/Downloads`
- **Accepts**: Absolute paths, `~` for home directory, or paths relative to your workspace folder

### Optimization Settings

The extension now includes powerful optimization features to reduce GIF file sizes without sacrificing quality:

#### Algorithm Selection
- **Setting**: `vscode-gif-recorder.algorithm`
- **Default**: `octree`
- **Options**: 
  - `octree` - Generally produces smaller files, ideal for screen recordings with solid colors and text
  - `neuquant` - Neural network based, better for photographic content

#### Optimizer
- **Setting**: `vscode-gif-recorder.useOptimizer`
- **Default**: `true` (enabled)
- **Description**: Reduces file size by reusing color tables when consecutive frames are similar. Highly recommended for screen recordings where many frames contain similar content.

#### Optimizer Threshold
- **Setting**: `vscode-gif-recorder.optimizerThreshold`
- **Default**: `90`
- **Range**: 0-100
- **Description**: Higher values enable more aggressive optimization. At 90%, the optimizer will reuse color tables when frames differ by less than 10%.

#### Quality
- **Setting**: `vscode-gif-recorder.quality`
- **Default**: `10`
- **Range**: 1-20 (lower is better)
- **Description**: Controls the GIF encoding quality. Lower values produce smaller files but may reduce visual quality slightly.

### Why These Optimizations Matter

Screen recordings often have many similar frames, making them ideal candidates for optimization. With the optimizer enabled (default), you can expect:

- **30-70% smaller file sizes** for typical VS Code screen recordings
- Faster encoding times when frames have minimal changes
- No perceptible quality loss for most use cases

The default settings are optimized for the best balance between file size and quality for screen recordings.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the VS Code community. Found a bug or have a suggestion? [Open an issue](https://github.com/chaluvadis/vscode-gif-recorder/issues)!