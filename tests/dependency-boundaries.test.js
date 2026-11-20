import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const listFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listFiles(resolved);
    }
    return resolved;
  });

describe('dependency boundaries', () => {
  it('keeps retired topic and report pages out of the page tree', () => {
    const retiredPageDirs = [
      'src/pages/ActiveTopics',
      'src/pages/CreateTopic',
      'src/pages/Reports',
    ];

    retiredPageDirs.forEach((dir) => {
      expect(fs.existsSync(path.resolve(process.cwd(), dir))).toBe(false);
    });
  });

  it('prevents page modules from importing mock seeds directly', () => {
    const pageFiles = listFiles(path.resolve(process.cwd(), 'src/pages')).filter((file) => /\.(js|jsx)$/.test(file));
    const offenders = pageFiles.filter((file) => /mocks[\\/]+seeds/.test(fs.readFileSync(file, 'utf8')));

    expect(offenders).toEqual([]);
  });

  it('prevents page modules from importing mock repositories directly', () => {
    const pageFiles = listFiles(path.resolve(process.cwd(), 'src/pages')).filter((file) => /\.(js|jsx)$/.test(file));
    const offenders = pageFiles.filter((file) => /mocks[\\/]+repositories/.test(fs.readFileSync(file, 'utf8')));

    expect(offenders).toEqual([]);
  });
});
