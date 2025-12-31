declare module 'gif-encoder-2' {
  import { Readable } from 'stream';

  class GIFEncoder {
    constructor(width: number, height: number);
    
    createReadStream(): Readable;
    start(): void;
    setRepeat(repeat: number): void;
    setDelay(delay: number): void;
    setQuality(quality: number): void;
    setTransparent(color: number | string): void;
    addFrame(data: Buffer | Uint8Array): void;
    finish(): void;
  }

  export = GIFEncoder;
}
