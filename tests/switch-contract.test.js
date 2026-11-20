import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = path.join(repoRoot, 'src');
const globalSwitchContractPath = 'src/action-control-contract.css';

const readProjectFiles = (directory) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return readProjectFiles(absolutePath);
    }

    if (!/\.(css|jsx?|tsx?)$/.test(entry.name)) {
      return [];
    }

    return [absolutePath];
  });
};

describe('global switch contract', () => {
  it('keeps switches unlabeled and styled only by the global action-control contract', () => {
    const violations = readProjectFiles(srcRoot)
      .flatMap((absolutePath) => {
        const relativePath = path.relative(repoRoot, absolutePath).replace(/\\/g, '/');
        const source = fs.readFileSync(absolutePath, 'utf8');
        const fileViolations = [];

        if (/checkedChildren\s*=|unCheckedChildren\s*=/.test(source)) {
          fileViolations.push(`${relativePath}: switch track labels are not allowed`);
        }

        if (relativePath !== globalSwitchContractPath && /\.ant-switch\b/.test(source)) {
          fileViolations.push(`${relativePath}: page-local .ant-switch CSS is not allowed`);
        }

        return fileViolations;
      });

    expect(violations).toEqual([]);
  });
});
