# VS Code GIF Recorder

A Visual Studio Code extension for recording your coding sessions and exporting them as GIF animations.

## Overview

VS Code GIF Recorder allows you to capture your development workflow in VS Code and convert it into shareable GIF files. Perfect for creating tutorials, showcasing features, or documenting bug reproductions.

## Features (Planned)

- 🎥 Record VS Code window activities
- 🎨 Convert recordings to high-quality GIF files
- ⚙️ Configurable frame rate and quality settings
- 📦 Easy export and sharing

## Project Structure

```plaintext
vscode-gif-recorder/
├── .vscode/
│   ├── launch.json           # Debug configuration for VS Code
│   └── tasks.json            # Tasks (e.g., build, lint)
├── src/
│   ├── extension.ts          # Main entry point
│   ├── recorder.ts           # Implements recording logic
│   └── gifConverter.ts       # Logic for converting frames to GIFs
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
   - `GIF Recorder: Stop Recording` - Stop recording

### Available Commands

- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and recompile automatically
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

## Current Status

This extension is currently in the **initial development phase**. The following components have been scaffolded:

### ✅ Completed
- Project structure and configuration files
- Basic extension activation lifecycle
- Command registration (start/stop recording)
- Stub implementations for core functionality

### 🚧 To Be Implemented
- Actual screen capture mechanism
- Frame buffering and management
- GIF encoding and conversion
- User settings and preferences
- UI for recording controls
- Progress indicators
- File save dialog integration

## Usage (Future)

Once fully implemented, the extension will work as follows:

1. **Start Recording**: Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run `GIF Recorder: Start Recording`
2. **Perform Actions**: Work in VS Code as normal - your actions will be recorded
3. **Stop Recording**: Run `GIF Recorder: Stop Recording` from the Command Palette
4. **Save GIF**: Choose a location to save your GIF file

## Architecture

### extension.ts
The main entry point that handles:
- Extension activation/deactivation
- Command registration
- Integration between recorder and converter modules

### recorder.ts
Handles the recording logic:
- `startRecording()`: Initiates screen capture
- `stopRecording()`: Ends capture and triggers conversion
- Frame capture and buffering (to be implemented)

### gifConverter.ts
Manages GIF creation:
- `convertToGif()`: Converts frame data to GIF format
- Configurable quality and frame rate options
- File I/O operations

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Implement screen capture using native APIs
- [ ] Add GIF encoding library integration
- [ ] Create settings page for customization
- [ ] Add recording preview
- [ ] Implement pause/resume functionality
- [ ] Add support for custom frame rates
- [ ] Add support for region selection
- [ ] Publish to VS Code Marketplace

## Acknowledgments

This extension is built using:
- [TypeScript](https://www.typescriptlang.org/)
- [VS Code Extension API](https://code.visualstudio.com/api)
