import { describe, expect, it } from 'vitest';
import {
  assetTypeValue,
  matchesAssetFilters,
  matchesFolderFilters,
} from '../src/pages/PublishingAssetLibrary/assetLibraryUtils';

describe('publishing asset library helpers', () => {
  it('normalizes template assets into post-template filter values', () => {
    expect(assetTypeValue('template')).toBe('post-template');
    expect(assetTypeValue('image')).toBe('image');
  });

  it('matches asset context, type, tags, and author filters', () => {
    const asset = {
      type: 'template',
      context: ['compose'],
      tags: ['Campaign'],
      author: 'MXT',
    };

    expect(matchesAssetFilters(asset, { context: ['compose', 'post-template'], tags: ['Campaign'], authors: ['mxt'] })).toBe(true);
    expect(matchesAssetFilters(asset, { context: ['reply'], tags: ['Campaign'], authors: ['mxt'] })).toBe(false);
    expect(matchesAssetFilters(asset, { context: ['compose'], tags: ['__no_tags_applied__'], authors: [] })).toBe(false);
  });

  it('hides folders when content filters apply and matches author filters only', () => {
    const folder = { author: 'DFV' };

    expect(matchesFolderFilters(folder, { context: [], tags: [], authors: ['dfv'] })).toBe(true);
    expect(matchesFolderFilters(folder, { context: ['image'], tags: [], authors: [] })).toBe(false);
    expect(matchesFolderFilters(folder, { context: [], tags: ['Campaign'], authors: [] })).toBe(false);
  });
});
