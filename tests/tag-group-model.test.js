import { describe, expect, it } from 'vitest';
import {
  buildTagTaxonomyFromLegacy,
  getTagGroupIdsForTagName,
  getTagGroupsForTagNames,
  getTagGroupsWithTags,
  normalizeTagTaxonomy,
  TAG_GROUP_STATUS,
  TAG_STATUS,
} from '../src/data/tagGroupModel';

describe('tag group taxonomy model', () => {
  it('migrates campaigns and collections into one Tag Group taxonomy without losing seed data', () => {
    const taxonomy = buildTagTaxonomyFromLegacy({
      activeCampaigns: [
        { id: 'launch', name: 'Launch Week', dateRange: 'May 1-7' },
      ],
      archivedCampaigns: [
        { id: 'winter', name: 'Winter Push' },
      ],
      collections: [
        { id: 'content-type', name: 'Content Type', tags: ['Video', 'video', 'Image'] },
        { id: 'empty-group', name: 'Empty Group', tags: [] },
        { id: 'archived', name: 'Archived Tags', archived: true, tags: ['Legacy Only'] },
      ],
    });

    expect(taxonomy.tagGroups.map((group) => group.name)).toEqual([
      'Content Type',
      'Empty Group',
      'Launch Week',
      'Winter Push',
    ]);
    expect(taxonomy.tagGroups.find((group) => group.id === 'empty-group')?.tagIds).toEqual([]);
    expect(taxonomy.tagGroups.find((group) => group.id === 'winter')?.status).toBe(TAG_GROUP_STATUS.ARCHIVED);
    expect(taxonomy.tags.filter((tag) => tag.name.toLowerCase() === 'video')).toHaveLength(1);
    expect(taxonomy.tags.find((tag) => tag.name === 'Legacy Only')?.status).toBe(TAG_STATUS.ARCHIVED);
  });

  it('supports many-to-many membership, empty groups, and ungrouped tags', () => {
    const taxonomy = normalizeTagTaxonomy({
      tags: [
        { id: 'tag-video', name: 'Video' },
        { id: 'tag-launch', name: 'Launch' },
        { id: 'tag-ungrouped', name: 'Ungrouped' },
      ],
      tagGroups: [
        { id: 'group-format', name: 'Format', tagIds: ['tag-video'] },
        { id: 'group-marketing', name: 'Marketing', tagIds: ['tag-video', 'tag-launch'] },
        { id: 'group-empty', name: 'Empty', tagIds: [] },
      ],
    });

    expect(getTagGroupIdsForTagName(taxonomy, 'video')).toEqual(['group-format', 'group-marketing']);
    expect(getTagGroupsForTagNames(taxonomy, ['Video', 'Ungrouped']).map((group) => group.name)).toEqual([
      'Format',
      'Marketing',
    ]);
    expect(getTagGroupsWithTags(taxonomy).find((group) => group.id === 'group-empty')?.tags).toEqual([]);
    expect(getTagGroupIdsForTagName(taxonomy, 'Ungrouped')).toEqual([]);
  });

  it('dedupes stored tags and Tag Groups while preserving merged memberships', () => {
    const taxonomy = normalizeTagTaxonomy({
      tags: [
        { id: 'tag-launch', name: 'Launch' },
        { id: 'tag-launch-duplicate', name: ' launch ', status: TAG_STATUS.ARCHIVED },
        { id: 'tag-video', name: 'Video' },
      ],
      tagGroups: [
        {
          id: 'group-campaign',
          name: 'Campaign',
          tagIds: ['tag-launch'],
          systemTagIds: ['system-positive'],
        },
        {
          id: 'group-campaign-duplicate',
          name: 'campaign',
          tagIds: ['tag-launch-duplicate', 'tag-video'],
          systemTagIds: ['system-positive', 'system-risk'],
          dateRange: 'May 1, 2026 - May 7, 2026',
          color: 'green',
        },
      ],
    });

    expect(taxonomy.tags.map((tag) => tag.name)).toEqual(['Launch', 'Video']);
    expect(taxonomy.tagGroups).toHaveLength(1);
    expect(taxonomy.tagGroups[0]).toMatchObject({
      id: 'group-campaign',
      name: 'Campaign',
      color: 'green',
      dateRange: 'May 1, 2026 - May 7, 2026',
      systemTagIds: ['system-positive', 'system-risk'],
      tagIds: ['tag-launch', 'tag-video'],
    });
  });

  it('excludes archived tags and archived Tag Groups from inferred grouping', () => {
    const taxonomy = normalizeTagTaxonomy({
      tags: [
        { id: 'tag-active', name: 'Active Tag' },
        { id: 'tag-archived', name: 'Archived Tag', status: TAG_STATUS.ARCHIVED },
      ],
      tagGroups: [
        { id: 'group-active', name: 'Active Group', tagIds: ['tag-active', 'tag-archived'] },
        { id: 'group-archived', name: 'Archived Group', status: TAG_GROUP_STATUS.ARCHIVED, tagIds: ['tag-active'] },
      ],
    });

    expect(getTagGroupIdsForTagName(taxonomy, 'Active Tag')).toEqual(['group-active']);
    expect(getTagGroupIdsForTagName(taxonomy, 'Archived Tag')).toEqual([]);
  });
});
