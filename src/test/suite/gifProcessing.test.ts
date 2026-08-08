import * as assert from 'node:assert';
import { suite, test } from 'mocha';
import { calculateFrameSimilarity, scaleImage, isValidPng } from '../../gifProcessing';

suite('gifProcessing', () => {
  suite('calculateFrameSimilarity', () => {
    test('returns 100 for identical frames', () => {
      const size = 100 * 4;
      const frame1 = new Uint8Array(size).fill(255);
      const frame2 = new Uint8Array(size).fill(255);
      assert.strictEqual(calculateFrameSimilarity(frame1, frame2), 100);
    });

    test('returns 0 for completely different frames', () => {
      const size = 100 * 4;
      const frame1 = new Uint8Array(size).fill(0);
      const frame2 = new Uint8Array(size).fill(255);
      assert.strictEqual(calculateFrameSimilarity(frame1, frame2), 0);
    });

    test('returns 0 when frames have different lengths', () => {
      const frame1 = new Uint8Array(100);
      const frame2 = new Uint8Array(200);
      assert.strictEqual(calculateFrameSimilarity(frame1, frame2), 0);
    });

    test('returns partial similarity for partially matching frames', () => {
      const size = 100 * 4;
      const frame1 = new Uint8Array(size).fill(100);
      const frame2 = new Uint8Array(size).fill(100);
      // Make first pixel different
      frame2[0] = 200;
      const similarity = calculateFrameSimilarity(frame1, frame2);
      assert.ok(similarity < 100 && similarity > 0);
    });

    test('handles empty frames', () => {
      const frame1 = new Uint8Array(0);
      const frame2 = new Uint8Array(0);
      const result = calculateFrameSimilarity(frame1, frame2);
      assert.strictEqual(result, 100);
    });
  });

  suite('scaleImage', () => {
    test('returns original when maxWidth is 0', () => {
      const data = new Uint8Array(10 * 10 * 4).fill(128);
      const result = scaleImage(data, 10, 10, 0);
      assert.strictEqual(result.data, data);
      assert.strictEqual(result.width, 10);
      assert.strictEqual(result.height, 10);
    });

    test('returns original when width <= maxWidth', () => {
      const data = new Uint8Array(10 * 10 * 4).fill(128);
      const result = scaleImage(data, 10, 10, 20);
      assert.strictEqual(result.data, data);
      assert.strictEqual(result.width, 10);
      assert.strictEqual(result.height, 10);
    });

    test('scales down proportionally', () => {
      const data = new Uint8Array(100 * 100 * 4).fill(128);
      const result = scaleImage(data, 100, 100, 50);
      assert.strictEqual(result.width, 50);
      assert.strictEqual(result.height, 50);
      assert.strictEqual(result.data.length, 50 * 50 * 4);
    });

    test('maintains aspect ratio for non-square images', () => {
      const data = new Uint8Array(200 * 100 * 4).fill(128);
      const result = scaleImage(data, 200, 100, 100);
      assert.strictEqual(result.width, 100);
      assert.strictEqual(result.height, 50);
      assert.strictEqual(result.data.length, 100 * 50 * 4);
    });

    test('preserves pixel data from source for matching pixels', () => {
      const data = new Uint8Array(4 * 4 * 4);
      let i = 0;
      for (i = 0; i < data.length; i += 4) {
        data[i] = i;
        data[i + 1] = i + 1;
        data[i + 2] = i + 2;
        data[i + 3] = 255;
      }
      const result = scaleImage(data, 4, 4, 2);
      assert.strictEqual(result.width, 2);
      assert.strictEqual(result.height, 2);
      assert.strictEqual(result.data[3], 255);
    });

    test('handles scale factor that produces zero-sized output', () => {
      const data = new Uint8Array(1 * 1 * 4).fill(128);
      const result = scaleImage(data, 1, 1, 0);
      assert.strictEqual(result.width, 1);
      assert.strictEqual(result.height, 1);
    });
  });

  suite('isValidPng', () => {
    test('returns false for empty buffer', () => {
      assert.strictEqual(isValidPng(Buffer.alloc(0)), false);
    });

    test('returns false for short buffer', () => {
      assert.strictEqual(isValidPng(Buffer.alloc(5)), false);
    });

    test('returns false for non-PNG buffer', () => {
      assert.strictEqual(isValidPng(Buffer.alloc(8, 0)), false);
    });

    test('returns true for valid PNG header', () => {
      const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const buf = Buffer.concat([pngHeader, Buffer.alloc(100)]);
      assert.strictEqual(isValidPng(buf), true);
    });
  });
});
