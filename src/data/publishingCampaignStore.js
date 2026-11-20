import {
  getManagedTagTaxonomy,
  setManagedTagTaxonomy,
  useManagedTagTaxonomy,
} from './tagManagementStore';
import {
  createTagEntity,
  createTagGroupEntity,
  makeTagGroupId,
  makeTagId,
  TAG_GROUP_STATUS,
  TAG_STATUS,
} from './tagGroupModel';

const toCampaignCompat = (group) => ({
  ...group,
  archived: group.status === TAG_GROUP_STATUS.ARCHIVED,
  plannerLabel: group.plannerLabel || 'Open tag group planner',
  stats: group.stats || [
    { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
    { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
    { label: 'Sent Posts', value: '0' },
    { label: 'Impressions', value: '0' },
  ],
});

const activeTagGroupsAsCampaignCompat = (taxonomy) => (
  (taxonomy.tagGroups || [])
    .filter((group) => group.status !== TAG_GROUP_STATUS.ARCHIVED)
    .filter((group) => group.legacySource === 'campaign' || group.dateRange || group.stats)
    .map(toCampaignCompat)
);

export const getManagedActiveCampaigns = () => (
  activeTagGroupsAsCampaignCompat(getManagedTagTaxonomy())
);

export const setManagedActiveCampaigns = (campaigns) => {
  const taxonomy = getManagedTagTaxonomy();
  const campaignIds = new Set((campaigns || []).map((campaign) => campaign.id));
  const existingCampaignGroupIds = new Set(
    taxonomy.tagGroups
      .filter((group) => group.legacySource === 'campaign' || group.dateRange || group.stats)
      .map((group) => group.id),
  );
  const existingTagsByName = new Map(
    taxonomy.tags.map((tag) => [tag.name.trim().toLowerCase(), tag]),
  );
  const usedTagIds = new Set(taxonomy.tags.map((tag) => tag.id));
  const usedGroupIds = new Set(taxonomy.tagGroups.map((group) => group.id));
  const nextTags = [...taxonomy.tags];

  const upsertTag = (name) => {
    const key = name.trim().toLowerCase();
    const existingTag = existingTagsByName.get(key);
    if (existingTag) {
      return existingTag;
    }

    const tag = createTagEntity({
      id: makeTagId(name, usedTagIds),
      name,
      status: TAG_STATUS.ACTIVE,
    });
    existingTagsByName.set(key, tag);
    nextTags.push(tag);
    return tag;
  };

  const campaignGroups = (campaigns || []).map((campaign) => {
    const tag = upsertTag(campaign.name);

    return createTagGroupEntity({
      ...campaign,
      id: campaign.id || makeTagGroupId(campaign.name, usedGroupIds),
      icon: 'book',
      legacySource: 'campaign',
      status: campaignIds.has(campaign.id) ? TAG_GROUP_STATUS.ACTIVE : campaign.status || TAG_GROUP_STATUS.ACTIVE,
      tagIds: Array.from(new Set([...(campaign.tagIds || []), tag.id])),
      plannerLabel: campaign.plannerLabel || 'Open tag group planner',
    });
  });

  const nextTagGroups = [
    ...taxonomy.tagGroups.filter((group) => !existingCampaignGroupIds.has(group.id)),
    ...campaignGroups,
  ];

  const nextTaxonomy = setManagedTagTaxonomy({
    tags: nextTags,
    tagGroups: nextTagGroups,
  });

  return activeTagGroupsAsCampaignCompat(nextTaxonomy);
};

export const makeLocalCampaign = ({ accent = '#e6f4ff', dateRange = '', name }) => {
  const normalizedName = name.trim();

  return createTagGroupEntity({
    id: `${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tag-group'}-${Date.now()}`,
    name: normalizedName,
    dateRange,
    sortSequence: Date.now(),
    accent,
    icon: 'book',
    legacySource: 'campaign',
    plannerLabel: 'Open tag group planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  });
};

export const useManagedActiveCampaigns = () => {
  const [taxonomy, setTaxonomy] = useManagedTagTaxonomy();
  const campaigns = activeTagGroupsAsCampaignCompat(taxonomy);

  const setCampaigns = (updater) => {
    const nextCampaigns = typeof updater === 'function'
      ? updater(campaigns)
      : updater;

    setManagedActiveCampaigns(nextCampaigns);
    setTaxonomy(getManagedTagTaxonomy());
  };

  return [campaigns, setCampaigns];
};
