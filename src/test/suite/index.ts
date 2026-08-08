import * as path from 'node:path';
import { readdirSync } from 'node:fs';

export function run(): Promise<void> {
  const mocha = new (require('mocha'))({
    ui: 'tdd',
    color: true,
    timeout: 60000,
  });

  const testsPath = path.resolve(__dirname, './suite');

  function addTestsRecursively(dir: string): void {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        addTestsRecursively(fullPath);
      } else if (entry.name.endsWith('.test.js')) {
        mocha.addFile(fullPath);
      }
    }
  }

  addTestsRecursively(testsPath);

  return new Promise((resolve, reject) => {
    try {
      mocha.run((failures: number) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
