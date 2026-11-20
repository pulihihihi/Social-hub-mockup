const uniqueSortedTags = (tags = []) => (
  Array.from(new Set(tags)).sort((left, right) => left.localeCompare(right))
);

export const getTagGroupOptionGroups = (
  tagGroups,
  {
    excludedTagGroupIds = [],
    includeArchived = false,
    includeEmpty = false,
  } = {},
) => {
  const excludedIds = new Set(excludedTagGroupIds);

  return tagGroups
    .filter((tagGroup) => includeArchived || !tagGroup.archived)
    .filter((tagGroup) => !excludedIds.has(tagGroup.id))
    .map((tagGroup) => ({
      label: tagGroup.name,
      options: uniqueSortedTags(tagGroup.tags).map((tag) => ({
        label: tag,
        value: tag,
      })),
    }))
    .filter((group) => includeEmpty || group.options.length);
};

export const getTagCollectionOptionGroups = (collections, options = {}) => (
  getTagGroupOptionGroups(collections, {
    ...options,
    excludedTagGroupIds: options.excludedTagGroupIds || options.excludedCollectionIds,
  })
);

export const getActiveCampaignOptionGroup = (campaigns, { valueKey = 'name' } = {}) => ({
  label: 'Tag Groups',
  options: [...campaigns]
    .sort((left, right) => (left.sortSequence || 0) - (right.sortSequence || 0))
    .map((campaign) => ({
      label: campaign.name,
      value: valueKey === 'id' ? campaign.id : campaign.name,
      dateRange: campaign.dateRange,
    })),
});

export const getPublishingTagFilterGroups = (
  tagGroups,
  legacyCampaignsOrOptions = {},
  options = {},
) => {
  const normalizedOptions = Array.isArray(legacyCampaignsOrOptions)
    ? options
    : legacyCampaignsOrOptions;
  const {
    includeNoTagsApplied = false,
  } = normalizedOptions;
  const groups = [
    ...getTagGroupOptionGroups(tagGroups),
  ];

  if (includeNoTagsApplied) {
    groups.push({
      label: 'System',
      options: [{ label: 'No tags applied', value: '__no_tags_applied__' }],
    });
  }

  return groups;
};

export const flattenOptionGroups = (groupsOrOptions) => (
  groupsOrOptions.flatMap((entry) => entry.options ?? entry)
);

export const getSmartInboxTagCategories = (tagGroups) => {
  const groupedTags = getPublishingTagFilterGroups(tagGroups, {
    includeNoTagsApplied: true,
  });

  return groupedTags
    .filter((group) => group.options.length || group.label === 'System')
    .map((group) => group.label === 'System' ? 'No tags applied' : group.label);
};
