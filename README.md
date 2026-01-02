# VS Code GIF Recorder

<div align="center">
  <img src="media/logo.svg" alt="VS Code GIF Recorder Logo" width="128" height="128">
  
  <p><strong>A Visual Studio Code extension for recording your coding sessions and exporting them as GIF animations.</strong></p>
  
  ![License](https://img.shields.io/github/license/chaluvadis/vscode-gif-recorder)
  ![Version](https://img.shields.io/github/package-json/v/chaluvadis/vscode-gif-recorder)
  ![VS Code](https://img.shields.io/badge/VS%20Code-1.80.0+-007ACC?logo=visual-studio-code)
  ![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?logo=node.js)
</div>

## Overview

VS Code GIF Recorder allows you to capture your development workflow in VS Code and convert it into shareable GIF files. Perfect for creating tutorials, showcasing features, or documenting bug reproductions.

## ✨ Features

- 🎥 **Screen Recording** - Captures your VS Code window at 10 FPS
- ⏸️ **Pause/Resume** - Pause and resume recordings on the fly
- 🎨 **GIF Conversion** - Converts recordings to high-quality GIF files
- ⚙️ **Configurable Quality** - Adjustable quality settings for optimal file size
- 💾 **Easy Export** - Save dialog integration for convenient file saving
- 📊 **Progress Tracking** - Real-time feedback during recording and conversion

## Project Structure

```plaintext
vscode-gif-recorder/
├── .vscode/
│   ├── launch.json           # Debug configuration for VS Code
│   └── tasks.json            # Tasks (e.g., build, lint)
├── src/
│   ├── extension.ts          # Main entry point
│   ├── recorder.ts           # Implements recording logic
│   ├── gifConverter.ts       # Logic for converting frames to GIFs
│   ├── previewPanel.ts       # Preview webview panel for recordings
│   └── types/
│       ├── gif-encoder-2.d.ts    # Type definitions for gif-encoder-2
│       └── screenshot-desktop.d.ts # Type definitions for screenshot-desktop
├── media/
│   └── icon.png              # Extension icon or other media
├── out/                      # Compiled output
├── package.json              # Extension's metadata
├── tsconfig.json             # TypeScript configuration
├── .eslintrc.json            # Linting configuration
├── .prettierrc               # Formatting rules
├── .gitignore                # Gitignore file
└── README.md                 # Documentation for the extension
```

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Visual Studio Code

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chaluvadis/vscode-gif-recorder.git
   cd vscode-gif-recorder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

### Running the Extension

1. Open the project in VS Code
2. Press `F5` to start debugging
3. A new Extension Development Host window will open
4. Use the commands:
   - `GIF Recorder: Start Recording` - Begin recording
   - `GIF Recorder: Pause Recording` - Pause recording
   - `GIF Recorder: Resume Recording` - Resume recording
   - `GIF Recorder: Stop Recording` - Stop recording

### Available Commands

- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and recompile automatically
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

## Current Status

This extension is now **fully functional** with the following features implemented:

### ✅ Completed
- Project structure and configuration files
- Extension activation lifecycle
- Command registration (start/stop/pause/resume recording)
- **Screen capture mechanism using screenshot-desktop**
- **Frame buffering and management in memory**
- **GIF encoding and conversion with gif-encoder-2**
- **Recording preview with interactive playback controls**
- **File save dialog integration**
- **Progress indicators during conversion**
- **Representative logo for the extension**
- **TypeScript type definitions organized in dedicated types folder**
- **Pause/resume functionality for recordings**

### 🚧 Future Enhancements
- User settings and preferences for FPS and quality
- Enhanced UI for recording controls
- Region selection for partial screen recording
- Pause/resume functionality
- Support for custom frame rates via settings

## 🚀 Usage

1. **Start Recording**: 
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
   - Run `GIF Recorder: Start Recording`
   - Your screen will start being captured at 10 frames per second

2. **Perform Actions**: 
   - Work in VS Code as normal - all your actions are being recorded
   - The extension captures your entire screen

3. **Pause/Resume** (Optional):
   - Open the Command Palette
   - Run `GIF Recorder: Pause Recording` to temporarily pause capture
   - Run `GIF Recorder: Resume Recording` to continue capturing
   - Use this feature to exclude unwanted portions from your recording

4. **Stop Recording**: 
   - Open the Command Palette again
   - Run `GIF Recorder: Stop Recording`
   - A preview panel will open showing your recording

4. **Preview Your Recording**:
   - Use the slider to navigate through individual frames
   - Click the Play button to see the animation
   - Review the recording before deciding to save or discard

5. **Save Your GIF**: 
   - Click "Save as GIF" in the preview panel
   - A save dialog will appear
   - Choose a location and filename for your GIF
   - The extension will process the frames and create your GIF
   - Once complete, you'll get an option to open the file

## Architecture

### extension.ts
The main entry point that handles:
- Extension activation/deactivation
- Command registration
- Integration between recorder, preview, and converter modules
- File save dialog and user interaction
- Progress reporting during GIF conversion

### recorder.ts
Handles the recording logic:
- `startRecording()`: Initiates screen capture at 10 FPS
- `stopRecording()`: Ends capture and returns captured frames
- Frame capture using screenshot-desktop library
- Frame buffering in memory with timestamp tracking

### gifConverter.ts
Manages GIF creation:
- `convertToGif()`: Converts frame data to GIF format using gif-encoder-2
- Processes PNG frames and encodes them into GIF
- Configurable quality and frame rate options
- File I/O operations with proper error handling

### previewPanel.ts
Handles the recording preview functionality:
- `showPreview()`: Displays recorded frames in a webview panel
- Interactive frame navigation with slider control
- Playback functionality to preview the animation
- Save or discard actions with user feedback

## Contributing

We welcome contributions from the community! Whether it's bug reports, feature requests, or code contributions, your input helps make this extension better.

### How to Contribute

Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up your development environment
- Our code of conduct
- The process for submitting pull requests
- Coding standards and best practices

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

For questions or discussions, feel free to open an issue or start a discussion on GitHub.

## Known Issues

### Current Limitations

- **Platform Compatibility**: Screen capture currently works best on Windows and macOS. Linux support may have limitations depending on the desktop environment.
- **Performance**: Recording at high frame rates (>15 FPS) may impact VS Code performance on lower-end systems.
- **File Size**: GIF files can become large for long recordings. Consider keeping recordings under 30 seconds for optimal file sizes.
- **Screen Resolution**: Very high resolution displays may result in larger GIF files. A settings feature for resolution scaling is planned.

### Known Bugs

- Recording may not capture cursor movements in some scenarios
- Stop recording command may require a second invocation if the first attempt times out

If you encounter any issues not listed here, please [report them on GitHub](https://github.com/chaluvadis/vscode-gif-recorder/issues).

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 chaluvadis

## Roadmap

- [x] Implement screen capture using native APIs
- [x] Add GIF encoding library integration
- [x] Add recording preview
- [ ] Create settings page for customization
- [ ] Implement pause/resume functionality
- [ ] Add support for custom frame rates via settings
- [ ] Add support for region selection
- [ ] Publish to VS Code Marketplace

## 📝 Credits

**Extension Enhancement (2025):**
This extension was enhanced with full implementation of recording and GIF conversion features, including:
- Complete screen capture functionality
- GIF encoding with configurable quality
- Interactive preview with playback controls
- User-friendly file save dialog
- Progress tracking and error handling
- Extension logo design

## Acknowledgments

This extension is built using:
- [TypeScript](https://www.typescriptlang.org/)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [screenshot-desktop](https://www.npmjs.com/package/screenshot-desktop) - For screen capture
- [gif-encoder-2](https://www.npmjs.com/package/gif-encoder-2) - For GIF encoding
- [pngjs](https://www.npmjs.com/package/pngjs) - For PNG processing
