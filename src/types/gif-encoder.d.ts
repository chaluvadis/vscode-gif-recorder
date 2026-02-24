declare module 'gif-encoder' {
  import { Readable } from 'stream';

  class GIFEncoder extends Readable {
    constructor(width: number, height: number, options?: { highWaterMark?: number });
    setRepeat(repeat: number): void;
    setDelay(delay: number): void;
    setQuality(quality: number): void;
    writeHeader(): void;
    addFrame(data: Buffer): void;
    finish(): void;
  }

  export = GIFEncoder;
}
