# VS Code GIF Recorder

<div align="center">
  <img src="media/logo.svg" alt="VS Code GIF Recorder Logo" width="128" height="128">
  
  <p><strong>A Visual Studio Code extension for recording your coding sessions and exporting them as GIF animations.</strong></p>
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
- **File save dialog integration**
- **Progress indicators during conversion**
- **Representative logo for the extension**
- **TypeScript type definitions organized in dedicated types folder**
- **Pause/resume functionality for recordings**

### 🚧 Future Enhancements
- User settings and preferences for FPS and quality
- Enhanced UI for recording controls
- Region selection for partial screen recording
- Recording preview
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
   - A save dialog will appear

5. **Save Your GIF**: 
   - Choose a location and filename for your GIF
   - The extension will process the frames and create your GIF
   - Once complete, you'll get an option to open the file

## Architecture

### extension.ts
The main entry point that handles:
- Extension activation/deactivation
- Command registration
- Integration between recorder and converter modules
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

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.

## Roadmap

- [x] Implement screen capture using native APIs
- [x] Add GIF encoding library integration
- [x] Implement pause/resume functionality
- [ ] Create settings page for customization
- [ ] Add recording preview
- [ ] Add support for custom frame rates via settings
- [ ] Add support for region selection
- [ ] Publish to VS Code Marketplace

## 📝 Credits

**Extension Enhancement (2025):**
This extension was enhanced with full implementation of recording and GIF conversion features, including:
- Complete screen capture functionality
- GIF encoding with configurable quality
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
