import { ACTIVE_CAMPAIGNS, ARCHIVED_CAMPAIGNS } from './publishingCampaigns';
import { TAG_COLLECTIONS } from './tagManagement';

export const TAG_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
};

export const TAG_GROUP_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
};

const LEGACY_GROUP_NAME_OVERRIDES = {
  campaigns: 'Launch Tags',
  campaign: 'Content Type',
};

const normalizeComparableText = (value = '') => value.trim().toLowerCase();

export const slugifyTagValue = (value = '') => (
  normalizeComparableText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
);

const makeUniqueId = (baseId, usedIds) => {
  let nextId = baseId;
  let suffix = 2;

  while (usedIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(nextId);
  return nextId;
};

export const makeTagId = (name, usedIds = new Set()) => (
  makeUniqueId(`tag-${slugifyTagValue(name) || 'untitled'}`, usedIds)
);

export const makeTagGroupId = (name, usedIds = new Set()) => (
  makeUniqueId(`tag-group-${slugifyTagValue(name) || 'untitled'}`, usedIds)
);

const defaultCampaignStats = (group) => (
  group.stats || [
    { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
    { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
    { label: 'Sent Posts', value: group.sentPosts || '0' },
    { label: 'Impressions', value: group.impressions || '0' },
  ]
);

const normalizeStatus = (status, archived = false) => (
  status === TAG_STATUS.ARCHIVED || archived ? TAG_STATUS.ARCHIVED : TAG_STATUS.ACTIVE
);

const uniqueStringValues = (values = []) => (
  Array.from(new Set(
    values
      .map((value) => String(value || '').trim())
      .filter(Boolean),
  ))
);

const mergeStatus = (leftStatus, rightStatus) => (
  normalizeStatus(leftStatus) === TAG_STATUS.ACTIVE || normalizeStatus(rightStatus) === TAG_STATUS.ACTIVE
    ? TAG_STATUS.ACTIVE
    : TAG_STATUS.ARCHIVED
);

export const createTagEntity = ({ id, name, status = TAG_STATUS.ACTIVE } = {}) => ({
  id: id || `tag-${Date.now()}`,
  name: String(name || '').trim(),
  status: normalizeStatus(status),
});

export const createTagGroupEntity = ({
  accent = '#e6f4ff',
  dateRange = '',
  id,
  name,
  sortSequence = Date.now(),
  status = TAG_GROUP_STATUS.ACTIVE,
  systemTagIds = [],
  tagIds = [],
  ...rest
} = {}) => ({
  id: id || `tag-group-${Date.now()}`,
  name: String(name || '').trim(),
  status: normalizeStatus(status),
  tagIds: uniqueStringValues(tagIds),
  systemTagIds: uniqueStringValues(systemTagIds),
  dateRange,
  sortSequence,
  accent,
  ...rest,
  icon: 'book',
});

export const normalizeTagTaxonomy = (taxonomy = {}) => {
  const usedTagIds = new Set();
  const tagIdRedirect = new Map();
  const tagsByName = new Map();
  const tags = [];

  (Array.isArray(taxonomy.tags) ? taxonomy.tags : []).forEach((tag) => {
    const sourceTagId = String(tag?.id || '').trim();
    const normalizedTag = createTagEntity({
      ...tag,
      id: makeUniqueId(tag?.id || `tag-${slugifyTagValue(tag?.name) || 'untitled'}`, usedTagIds),
    });

    if (!normalizedTag.name) {
      return;
    }

    const key = normalizeComparableText(normalizedTag.name);
    const existingTag = tagsByName.get(key);

    if (existingTag) {
      existingTag.status = mergeStatus(existingTag.status, normalizedTag.status);
      tagIdRedirect.set(normalizedTag.id, existingTag.id);
      if (sourceTagId) {
        tagIdRedirect.set(sourceTagId, existingTag.id);
      }
      return;
    }

    tagsByName.set(key, normalizedTag);
    tags.push(normalizedTag);
    tagIdRedirect.set(normalizedTag.id, normalizedTag.id);
    if (sourceTagId) {
      tagIdRedirect.set(sourceTagId, normalizedTag.id);
    }
  });

  const tagIdSet = new Set(tags.map((tag) => tag.id));
  const usedGroupIds = new Set();
  const tagGroupsByName = new Map();
  const tagGroups = [];

  const mergeTagGroup = (existingGroup, nextGroup) => {
    existingGroup.status = mergeStatus(existingGroup.status, nextGroup.status);
    existingGroup.tagIds = uniqueStringValues([
      ...(existingGroup.tagIds || []),
      ...(nextGroup.tagIds || []),
    ]);
    existingGroup.systemTagIds = uniqueStringValues([
      ...(existingGroup.systemTagIds || []),
      ...(nextGroup.systemTagIds || []),
    ]);

    if (!existingGroup.dateRange && nextGroup.dateRange) {
      existingGroup.dateRange = nextGroup.dateRange;
    }
    if (!existingGroup.stats && nextGroup.stats) {
      existingGroup.stats = nextGroup.stats;
    }
    if (!existingGroup.plannerLabel && nextGroup.plannerLabel) {
      existingGroup.plannerLabel = nextGroup.plannerLabel;
    }
    if (!existingGroup.color && nextGroup.color) {
      existingGroup.color = nextGroup.color;
    }
    if ((!existingGroup.accent || existingGroup.accent === '#e6f4ff') && nextGroup.accent) {
      existingGroup.accent = nextGroup.accent;
    }
    if (existingGroup.legacySource !== 'campaign' && nextGroup.legacySource) {
      existingGroup.legacySource = nextGroup.legacySource;
    }
  };

  (Array.isArray(taxonomy.tagGroups) ? taxonomy.tagGroups : []).forEach((group) => {
    const tagIds = uniqueStringValues(group?.tagIds || [])
      .map((tagId) => tagIdRedirect.get(tagId) || tagId)
      .filter((tagId) => tagIdSet.has(tagId));
    const normalizedGroup = createTagGroupEntity({
      ...group,
      id: makeUniqueId(group?.id || `tag-group-${slugifyTagValue(group?.name) || 'untitled'}`, usedGroupIds),
      tagIds,
      systemTagIds: group?.systemTagIds || [],
    });

    if (!normalizedGroup.name) {
      return;
    }

    const key = normalizeComparableText(normalizedGroup.name);
    const existingGroup = tagGroupsByName.get(key);

    if (existingGroup) {
      mergeTagGroup(existingGroup, normalizedGroup);
      return;
    }

    tagGroupsByName.set(key, normalizedGroup);
    tagGroups.push(normalizedGroup);
  });

  return { tags, tagGroups };
};

export const buildTagTaxonomyFromLegacy = ({
  activeCampaigns = ACTIVE_CAMPAIGNS,
  archivedCampaigns = ARCHIVED_CAMPAIGNS,
  collections = TAG_COLLECTIONS,
} = {}) => {
  const usedTagIds = new Set();
  const tagsByName = new Map();
  const tagGroups = [];

  const upsertTag = (tagName, status = TAG_STATUS.ACTIVE) => {
    const name = String(tagName || '').trim();
    if (!name) {
      return null;
    }

    const key = normalizeComparableText(name);
    const existingTag = tagsByName.get(key);
    if (existingTag) {
      if (status === TAG_STATUS.ACTIVE) {
        existingTag.status = TAG_STATUS.ACTIVE;
      }
      return existingTag;
    }

    const tag = createTagEntity({
      id: makeTagId(name, usedTagIds),
      name,
      status,
    });
    tagsByName.set(key, tag);
    return tag;
  };

  collections.forEach((collection) => {
    const groupStatus = collection.archived ? TAG_GROUP_STATUS.ARCHIVED : TAG_GROUP_STATUS.ACTIVE;
    const tagIds = (collection.tags || [])
      .map((tagName) => upsertTag(tagName, groupStatus)?.id)
      .filter(Boolean);

    if (collection.archived && collection.id === 'archived') {
      return;
    }

    tagGroups.push(createTagGroupEntity({
      id: collection.id,
      name: LEGACY_GROUP_NAME_OVERRIDES[collection.id] || collection.name,
      icon: 'book',
      status: groupStatus,
      tagIds,
      legacySource: 'collection',
    }));
  });

  activeCampaigns.forEach((group) => {
    const groupTag = upsertTag(group.name, TAG_STATUS.ACTIVE);

    tagGroups.push(createTagGroupEntity({
      ...group,
      icon: 'book',
      status: TAG_GROUP_STATUS.ACTIVE,
      tagIds: groupTag ? [groupTag.id] : [],
      plannerLabel: 'Open tag group planner',
      stats: defaultCampaignStats(group),
      legacySource: 'campaign',
    }));
  });

  archivedCampaigns.forEach((group) => {
    const groupTag = upsertTag(group.name, TAG_STATUS.ARCHIVED);

    tagGroups.push(createTagGroupEntity({
      ...group,
      icon: 'book',
      status: TAG_GROUP_STATUS.ARCHIVED,
      tagIds: groupTag ? [groupTag.id] : [],
      plannerLabel: 'Open archived tag group planner',
      stats: defaultCampaignStats(group),
      legacySource: 'campaign',
    }));
  });

  return normalizeTagTaxonomy({
    tags: Array.from(tagsByName.values()),
    tagGroups,
  });
};

export const getTagById = (taxonomy) => (
  new Map((taxonomy.tags || []).map((tag) => [tag.id, tag]))
);

export const getTagGroupsWithTags = (
  taxonomy,
  {
    includeArchivedGroups = true,
    includeArchivedTags = false,
  } = {},
) => {
  const tagsById = getTagById(taxonomy);

  return (taxonomy.tagGroups || [])
    .filter((group) => includeArchivedGroups || group.status !== TAG_GROUP_STATUS.ARCHIVED)
    .map((group) => ({
      ...group,
      archived: group.status === TAG_GROUP_STATUS.ARCHIVED,
      tags: (group.tagIds || [])
        .map((tagId) => tagsById.get(tagId))
        .filter(Boolean)
        .filter((tag) => includeArchivedTags || tag.status !== TAG_STATUS.ARCHIVED)
        .map((tag) => tag.name),
    }));
};

export const getTagGroupIdsForTagName = (taxonomy, tagName) => {
  const key = normalizeComparableText(tagName);
  const tagIds = new Set(
    (taxonomy.tags || [])
      .filter((tag) => normalizeComparableText(tag.name) === key)
      .filter((tag) => tag.status !== TAG_STATUS.ARCHIVED)
      .map((tag) => tag.id),
  );

  return (taxonomy.tagGroups || [])
    .filter((group) => group.status !== TAG_GROUP_STATUS.ARCHIVED)
    .filter((group) => (group.tagIds || []).some((tagId) => tagIds.has(tagId)))
    .map((group) => group.id);
};

export const getTagGroupsForTagNames = (taxonomy, tagNames = []) => {
  const groupIds = new Set(tagNames.flatMap((tagName) => getTagGroupIdsForTagName(taxonomy, tagName)));

  return (taxonomy.tagGroups || [])
    .filter((group) => groupIds.has(group.id));
};

export const getUniqueActiveTagNames = (taxonomy) => (
  (taxonomy.tags || [])
    .filter((tag) => tag.status !== TAG_STATUS.ARCHIVED)
    .map((tag) => tag.name)
    .sort((left, right) => left.localeCompare(right))
);

export const tagTaxonomyToCollections = (taxonomy) => (
  getTagGroupsWithTags(taxonomy, { includeArchivedGroups: true, includeArchivedTags: false })
    .map((group) => ({
      ...group,
      archived: group.status === TAG_GROUP_STATUS.ARCHIVED,
    }))
);

export const collectionsToTagTaxonomy = (collections = []) => (
  buildTagTaxonomyFromLegacy({ collections, activeCampaigns: [], archivedCampaigns: [] })
);
