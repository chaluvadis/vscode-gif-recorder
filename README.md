# VS Code GIF Recorder

Quickly record your VS Code workflows and save them as animated GIFs—perfect for demos, tutorials, and bug reports.

## What is this?

Ever wanted to show someone exactly how to do something in VS Code without recording a full video? This extension lets you capture your screen activity and turn it into a lightweight animated GIF that's easy to share anywhere.

Whether you're creating a quick demo, documenting a bug, or making a tutorial, GIF Recorder makes it simple to capture and export your workflow in just a few clicks.

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
npm install
```

Then press `F5` in VS Code to launch the extension in a development window.

## Configuration

You can customize where your GIFs are saved by default:

- **Setting**: `vscode-gif-recorder.outputDirectory`
- **Default**: `~/Downloads`
- **Accepts**: Absolute paths, `~` for home directory, or paths relative to your workspace folder

## What's Next?

We're working on making this extension even better! Planned improvements include:

- Configurable frame rate and quality settings
- Ability to select specific windows or regions to record
- Frame trimming and editing in the preview
- Automatic GIF optimization to reduce file size

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the VS Code community. Found a bug or have a suggestion? [Open an issue](https://github.com/chaluvadis/vscode-gif-recorder/issues)!