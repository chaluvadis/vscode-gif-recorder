declare module 'screenshot-desktop' {
  interface ScreenshotOptions {
    format?: 'png' | 'jpg' | 'jpeg';
    screen?: number | number[];
    childProcess?: boolean;
  }

  interface ScreenshotDesktop {
    (options?: ScreenshotOptions | string): Promise<Buffer>;
    all(options?: ScreenshotOptions): Promise<Buffer[]>;
    listDisplays(): Promise<string[]>;
    parseDisplaysOutput(output: string): unknown;
  }

  const screenshotDesktop: ScreenshotDesktop;
  export = screenshotDesktop;
}
