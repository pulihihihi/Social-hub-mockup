// @vitest-environment node

import { describe, expect, it } from 'vitest';
import viteConfig from '../vite.config.js';

const resolveConfig = (mode) => (typeof viteConfig === 'function' ? viteConfig({ mode }) : viteConfig);

describe('vite config', () => {
  it('uses root base in development', () => {
    expect(resolveConfig('development').base).toBe('/');
  });

  it('uses the Social Hub subpath for production assets', () => {
    expect(resolveConfig('production').base).toBe('/social-hub/');
  });
});
