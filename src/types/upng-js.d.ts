declare module 'upng-js' {
  interface UPNGImage {
    width: number;
    height: number;
    depth: number;
    ctype: number;
    tabs: Record<string, unknown>;
    frames: Array<{
      rect: { x: number; y: number; w: number; h: number };
      blend: number;
      dispose: number;
      bbox: number[];
    }>;
    data: ArrayBuffer;
  }

  interface UPNG {
    decode(buffer: Buffer | ArrayBuffer): UPNGImage;
    toRGBA8(img: UPNGImage): ArrayBuffer[];
    encode(imgs: ArrayBuffer[], w: number, h: number, ps?: number, dels?: number[]): ArrayBuffer;
    encodeLL(imgs: Uint8Array[], w: number, h: number, cc: number, ac: number, depth: number, dels?: number[]): ArrayBuffer;
  }

  const UPNG: UPNG;
  export default UPNG;
}
