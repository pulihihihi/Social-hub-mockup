import { describe, expect, it } from 'vitest';
import {
  getCardColumns,
  getItemSharedTags,
  matchesItemSearch,
  normalizeAssetTags,
  sanitizeFileName,
} from '../src/features/ai-assets/assetFilters';

describe('AI asset filter helpers', () => {
  it('chooses responsive card columns for the internal tool grid', () => {
    expect(getCardColumns(1440)).toBe(3);
    expect(getCardColumns(900)).toBe(2);
    expect(getCardColumns(480)).toBe(1);
  });

  it('normalizes legacy game tags through shared tag groups', () => {
    const item = normalizeAssetTags({ games: ['FF'], sharedTags: {} });

    expect(getItemSharedTags(item).game).toEqual(['FF']);
    expect(item.games).toEqual(['FF']);
  });

  it('matches search over asset name, category, tags, and shared tags', () => {
    const item = {
      name: 'Campaign Assistant',
      category: 'Publishing',
      description: 'Drafts launch posts',
      tags: ['workflow'],
      sharedTags: { game: ['FF'] },
    };

    expect(matchesItemSearch(item, 'ff')).toBe(true);
    expect(matchesItemSearch(item, 'workflow')).toBe(true);
    expect(matchesItemSearch(item, 'finance')).toBe(false);
  });

  it('sanitizes exported file names', () => {
    expect(sanitizeFileName('Campaign Assistant v2')).toBe('campaign-assistant-v2');
    expect(sanitizeFileName('!!!')).toBe('asset');
  });
});
