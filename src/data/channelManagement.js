import { useEffect, useState } from 'react';

export const CHANNEL_MANAGEMENT_ROUTE = '/settings/channels';
export const CHANNEL_GROUP_MANAGEMENT_ROUTE = '/settings/channels?tab=groups';
export const CHANNEL_GROUPS_STORAGE_KEY = 'socialhub.channelGroups.v1';
export const CHANNEL_GROUPS_EVENT = 'socialhub:channel-groups-changed';
export const ACTIVE_CHANNEL_GROUP_STORAGE_KEY = 'socialhub.activeChannelGroup.v1';

// Terminology contract: Social Hub channel-management copy must match Settings > Channels.
export const CHANNEL_TERMINOLOGY = {
  singular: 'Channel',
  plural: 'Channels',
  lowerSingular: 'channel',
  lowerPlural: 'channels',
  groupSingular: 'Channel Group',
  groupPlural: 'Channel Groups',
  lowerGroupSingular: 'channel group',
  lowerGroupPlural: 'channel groups',
};

export const CHANNEL_GROUP_COLOR_OPTIONS = [
  {
    value: 'blue',
    label: 'Blue',
    solid: '#1677ff',
    bg: '#e6f4ff',
    border: '#91caff',
    text: '#0958d9',
    selectedBg: '#bae0ff',
    selectedBorder: '#69b1ff',
    selectedText: '#003eb3',
  },
  {
    value: 'geekblue',
    label: 'Geek Blue',
    solid: '#2f54eb',
    bg: '#f0f5ff',
    border: '#adc6ff',
    text: '#1d39c4',
    selectedBg: '#d6e4ff',
    selectedBorder: '#85a5ff',
    selectedText: '#10239e',
  },
  {
    value: 'cyan',
    label: 'Cyan',
    solid: '#13c2c2',
    bg: '#e6fffb',
    border: '#87e8de',
    text: '#08979c',
    selectedBg: '#b5f5ec',
    selectedBorder: '#5cdbd3',
    selectedText: '#006d75',
  },
  {
    value: 'green',
    label: 'Green',
    solid: '#52c41a',
    bg: '#f6ffed',
    border: '#b7eb8f',
    text: '#389e0d',
    selectedBg: '#d9f7be',
    selectedBorder: '#95de64',
    selectedText: '#237804',
  },
  {
    value: 'lime',
    label: 'Lime',
    solid: '#a0d911',
    bg: '#fcffe6',
    border: '#d3f261',
    text: '#7cb305',
    selectedBg: '#f4ffb8',
    selectedBorder: '#bae637',
    selectedText: '#5b8c00',
  },
  {
    value: 'gold',
    label: 'Gold',
    solid: '#faad14',
    bg: '#fffbe6',
    border: '#ffe58f',
    text: '#d48806',
    selectedBg: '#fff1b8',
    selectedBorder: '#ffd666',
    selectedText: '#ad6800',
  },
  {
    value: 'orange',
    label: 'Orange',
    solid: '#fa8c16',
    bg: '#fff7e6',
    border: '#ffd591',
    text: '#d46b08',
    selectedBg: '#ffe7ba',
    selectedBorder: '#ffc069',
    selectedText: '#ad4e00',
  },
  {
    value: 'volcano',
    label: 'Volcano',
    solid: '#fa541c',
    bg: '#fff2e8',
    border: '#ffbb96',
    text: '#d4380d',
    selectedBg: '#ffd8bf',
    selectedBorder: '#ff9c6e',
    selectedText: '#ad2102',
  },
  {
    value: 'red',
    label: 'Red',
    solid: '#f5222d',
    bg: '#fff1f0',
    border: '#ffa39e',
    text: '#cf1322',
    selectedBg: '#ffccc7',
    selectedBorder: '#ff7875',
    selectedText: '#a8071a',
  },
  {
    value: 'magenta',
    label: 'Magenta',
    solid: '#eb2f96',
    bg: '#fff0f6',
    border: '#ffadd2',
    text: '#c41d7f',
    selectedBg: '#ffd6e7',
    selectedBorder: '#ff85c0',
    selectedText: '#9e1068',
  },
  {
    value: 'purple',
    label: 'Purple',
    solid: '#722ed1',
    bg: '#f9f0ff',
    border: '#d3adf7',
    text: '#531dab',
    selectedBg: '#efdbff',
    selectedBorder: '#b37feb',
    selectedText: '#391085',
  },
];

export const DEFAULT_CHANNEL_GROUP_COLOR = 'blue';

export const CHANNEL_GROUP_DEFAULT_COLORS_BY_NAME = {
  'Chien Than Delta Force': 'volcano',
  'Garena Delta Force VN': 'blue',
  'Delta Force Launch': 'gold',
};

export const formatChannelCount = (count, { lower = false } = {}) => {
  const noun = count === 1
    ? (lower ? CHANNEL_TERMINOLOGY.lowerSingular : CHANNEL_TERMINOLOGY.singular)
    : (lower ? CHANNEL_TERMINOLOGY.lowerPlural : CHANNEL_TERMINOLOGY.plural);

  return `${count} ${noun}`;
};

export const formatChannelGroupCount = (count, { lower = false } = {}) => {
  const noun = count === 1
    ? (lower ? CHANNEL_TERMINOLOGY.lowerGroupSingular : CHANNEL_TERMINOLOGY.groupSingular)
    : (lower ? CHANNEL_TERMINOLOGY.lowerGroupPlural : CHANNEL_TERMINOLOGY.groupPlural);

  return `${count} ${noun}`;
};

export const MANAGED_CHANNEL_GROUPS = [
  {
    id: 1,
    name: 'Chien Than Delta Force',
    color: CHANNEL_GROUP_DEFAULT_COLORS_BY_NAME['Chien Than Delta Force'],
    channelIds: ['fb-warrior', 'ig-warrior', 'yt-warrior', 'tt-warrior'],
  },
  {
    id: 2,
    name: 'Garena Delta Force VN',
    color: CHANNEL_GROUP_DEFAULT_COLORS_BY_NAME['Garena Delta Force VN'],
    channelIds: ['fb-delta-main', 'ig-delta', 'yt-delta', 'tt-delta'],
  },
  {
    id: 3,
    name: 'Delta Force Launch',
    color: CHANNEL_GROUP_DEFAULT_COLORS_BY_NAME['Delta Force Launch'],
    channelIds: ['fb-delta-main', 'fb-warrior', 'ig-delta', 'yt-delta'],
  },
];

export const MANAGED_CHANNELS = [
  {
    id: 'fb-delta-main',
    platform: 'facebook',
    platformKey: 'fb_fanpage',
    name: 'Garena Delta Force (VN - Vietnamese)',
    handle: 'GarenaDeltaForceVN',
    channelId: 'GarenaDeltaForceVN',
    channelGroupId: 2,
    channelGroupIds: [2, 3],
    selected: true,
    avatarColor: '#123f57',
    mode: 'API',
    health: 'CONNECTED',
  },
  {
    id: 'fb-warrior',
    platform: 'facebook',
    platformKey: 'fb_fanpage',
    name: 'Chien Than Delta Force',
    handle: 'chienthanDF',
    channelId: 'chienthanDF',
    channelGroupId: 1,
    channelGroupIds: [1, 3],
    selected: false,
    avatarColor: '#214c78',
    mode: 'API',
    health: 'CONNECTED',
  },
  {
    id: 'ig-warrior',
    platform: 'instagram',
    platformKey: 'instagram',
    name: 'Chien Than Delta Force',
    handle: '@chienthandf',
    channelId: 'chienthandf',
    channelGroupId: 1,
    channelGroupIds: [1],
    selected: true,
    disabled: true,
    issue: 'Reconnect required',
    avatarColor: '#d79bb7',
    mode: 'API',
    health: 'DISCONNECTED',
  },
  {
    id: 'ig-delta',
    platform: 'instagram',
    platformKey: 'instagram',
    name: 'Garena Delta Force VN',
    handle: '@garenadeltaforcevn',
    channelId: 'garenadeltaforcevn',
    channelGroupId: 2,
    channelGroupIds: [2, 3],
    selected: true,
    disabled: true,
    issue: 'Reconnect required',
    avatarColor: '#c9939a',
    mode: 'API',
    health: 'DISCONNECTED',
  },
  {
    id: 'ig-alt',
    platform: 'instagram',
    platformKey: 'instagram',
    name: '@garenadeltaforcevn',
    handle: 'Instagram Channel',
    channelId: 'garenadeltaforcevn-alt',
    channelGroupId: null,
    channelGroupIds: [],
    selected: false,
    avatarColor: '#29313a',
    mode: 'API',
    health: 'CONNECTED',
  },
  {
    id: 'threads-delta',
    platform: 'threads',
    platformKey: 'threads',
    name: 'Garena Delta Force VN',
    handle: 'Threads Channel',
    channelId: 'garenadeltaforcevn',
    channelGroupId: null,
    channelGroupIds: [],
    selected: false,
    avatarColor: '#111827',
    mode: 'API',
    health: 'CONNECTED',
  },
  {
    id: 'threads-warrior',
    platform: 'threads',
    platformKey: 'threads',
    name: 'Chien Than Delta Force',
    handle: '@chienthandf',
    channelId: 'chienthandf',
    channelGroupId: null,
    channelGroupIds: [],
    selected: false,
    avatarColor: '#24292f',
    mode: 'API',
    health: 'CONNECTED',
  },
  {
    id: 'yt-warrior',
    platform: 'youtube',
    platformKey: 'youtube',
    name: 'Chien Than Delta Force',
    handle: '@chienthandeltaforce',
    channelId: 'chienthandeltaforce',
    channelGroupId: 1,
    channelGroupIds: [1],
    selected: true,
    disabled: true,
    issue: 'Reconnect required',
    avatarColor: '#6a7788',
    mode: 'API',
    health: 'DISCONNECTED',
  },
  {
    id: 'yt-delta',
    platform: 'youtube',
    platformKey: 'youtube',
    name: 'Garena Delta Force VN',
    handle: '@garenadeltaforcevn',
    channelId: 'garenadeltaforcevn',
    channelGroupId: 2,
    channelGroupIds: [2, 3],
    selected: true,
    avatarColor: '#91a0ad',
    mode: 'API',
    health: 'CONNECTED',
  },
  {
    id: 'tt-warrior',
    platform: 'tiktok',
    platformKey: 'tiktok',
    name: 'Chien Than Delta Force',
    handle: '@chienthandf',
    channelId: 'chienthandf',
    channelGroupId: 1,
    channelGroupIds: [1],
    selected: true,
    avatarColor: '#111827',
    mode: 'API',
    health: 'CONNECTED',
  },
  {
    id: 'tt-delta',
    platform: 'tiktok',
    platformKey: 'tiktok',
    name: 'Garena Delta Force VN',
    handle: '@garenadeltaforcevn',
    channelId: 'garenadeltaforcevn',
    channelGroupId: 2,
    channelGroupIds: [2],
    selected: true,
    avatarColor: '#374151',
    mode: 'API',
    health: 'CONNECTED',
  },
];

export const getManagedChannelGroupName = (channelGroupId) => (
  getManagedChannelGroups().find((group) => String(group.id) === String(channelGroupId))?.name || ''
);

const resolveDefaultChannelGroupColor = (groupName) => (
  CHANNEL_GROUP_DEFAULT_COLORS_BY_NAME[groupName] || DEFAULT_CHANNEL_GROUP_COLOR
);

export const normalizeChannelGroupColor = (color, groupName = '') => (
  CHANNEL_GROUP_COLOR_OPTIONS.some((option) => option.value === color)
    ? color
    : resolveDefaultChannelGroupColor(groupName)
);

export const getChannelGroupColorMeta = (color, groupName = '') => {
  const normalizedColor = normalizeChannelGroupColor(color, groupName);

  return CHANNEL_GROUP_COLOR_OPTIONS.find((option) => option.value === normalizedColor)
    || CHANNEL_GROUP_COLOR_OPTIONS.find((option) => option.value === DEFAULT_CHANNEL_GROUP_COLOR);
};

export const getChannelGroupColorLabel = (color, groupName = '') => (
  getChannelGroupColorMeta(color, groupName)?.label || 'Blue'
);

export const getChannelGroupInitials = (groupName = '') => (
  String(groupName)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
);

const normalizeManagedChannelGroup = (group = {}) => ({
  ...group,
  color: normalizeChannelGroupColor(group.color, group.name),
  channelIds: Array.isArray(group.channelIds) ? [...new Set(group.channelIds)] : [],
});

export const cloneManagedChannelGroups = (groups = MANAGED_CHANNEL_GROUPS) => (
  groups.map((group) => normalizeManagedChannelGroup(group))
);

export const getManagedChannelGroups = () => {
  if (typeof window === 'undefined') {
    return cloneManagedChannelGroups();
  }

  try {
    const storedGroups = window.localStorage.getItem(CHANNEL_GROUPS_STORAGE_KEY);
    if (!storedGroups) {
      return cloneManagedChannelGroups();
    }

    const parsedGroups = JSON.parse(storedGroups);
    return Array.isArray(parsedGroups)
      ? cloneManagedChannelGroups(parsedGroups)
      : cloneManagedChannelGroups();
  } catch {
    return cloneManagedChannelGroups();
  }
};

export const getManagedChannelGroupByName = (
  groupName,
  channelGroups = getManagedChannelGroups(),
) => channelGroups.find((group) => group.name === groupName) || null;

export const getManagedChannelGroupById = (
  groupId,
  channelGroups = getManagedChannelGroups(),
) => channelGroups.find((group) => String(group.id) === String(groupId)) || null;

export const setManagedChannelGroups = (groups) => {
  const nextGroups = cloneManagedChannelGroups(groups);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CHANNEL_GROUPS_STORAGE_KEY, JSON.stringify(nextGroups));
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(CHANNEL_GROUPS_EVENT, {
        detail: { channelGroups: nextGroups },
      }));
    }, 0);
  }

  return nextGroups;
};

export const useManagedChannelGroups = () => {
  const [channelGroups, setChannelGroupsState] = useState(getManagedChannelGroups);

  useEffect(() => {
    const syncChannelGroups = (event) => {
      if (event.type === 'storage' && event.key !== CHANNEL_GROUPS_STORAGE_KEY) {
        return;
      }

      setChannelGroupsState(
        event.detail?.channelGroups
          ? cloneManagedChannelGroups(event.detail.channelGroups)
          : getManagedChannelGroups(),
      );
    };

    window.addEventListener(CHANNEL_GROUPS_EVENT, syncChannelGroups);
    window.addEventListener('storage', syncChannelGroups);

    return () => {
      window.removeEventListener(CHANNEL_GROUPS_EVENT, syncChannelGroups);
      window.removeEventListener('storage', syncChannelGroups);
    };
  }, []);

  const setChannelGroups = (updater) => {
    setChannelGroupsState((currentGroups) => {
      const nextGroups = typeof updater === 'function'
        ? updater(cloneManagedChannelGroups(currentGroups))
        : updater;

      return setManagedChannelGroups(nextGroups);
    });
  };

  return [channelGroups, setChannelGroups];
};

export const normalizeManagedChannelGroupIds = (channel, channelGroups = getManagedChannelGroups()) => {
  const groupIds = Array.isArray(channel?.channelGroupIds)
    ? channel.channelGroupIds
    : (channel?.channelGroupId !== undefined && channel?.channelGroupId !== null ? [channel.channelGroupId] : []);
  const explicitGroupIds = [...new Set(groupIds.filter((groupId) => groupId !== undefined && groupId !== null))];

  if (explicitGroupIds.length) {
    return explicitGroupIds;
  }

  return channelGroups
    .filter((group) => (group.channelIds || []).includes(channel?.id))
    .map((group) => group.id);
};

export const getManagedChannelGroupNames = (channel, channelGroups = getManagedChannelGroups()) => (
  normalizeManagedChannelGroupIds(channel, channelGroups)
    .map((groupId) => channelGroups.find((group) => String(group.id) === String(groupId))?.name || '')
    .filter(Boolean)
);

export const getManagedChannelGroupNamesForChannelId = (channelId, channelGroups = getManagedChannelGroups()) => (
  channelGroups
    .filter((group) => (group.channelIds || []).includes(channelId))
    .map((group) => group.name)
);

export const getDefaultChannelGroupId = (channelGroups = getManagedChannelGroups()) => {
  const preferredGroup = channelGroups.find((group) => /Garena Delta Force VN/i.test(group.name));
  return preferredGroup?.id ?? channelGroups[0]?.id ?? null;
};

export const getActiveChannelGroupId = (channelGroups = getManagedChannelGroups()) => {
  if (!channelGroups.length) {
    return null;
  }

  if (typeof window === 'undefined') {
    return getDefaultChannelGroupId(channelGroups);
  }

  const storedGroupId = window.localStorage.getItem(ACTIVE_CHANNEL_GROUP_STORAGE_KEY);
  const matchingGroup = channelGroups.find((group) => String(group.id) === String(storedGroupId));
  return matchingGroup?.id ?? getDefaultChannelGroupId(channelGroups);
};

export const setActiveChannelGroupId = (channelGroupId) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ACTIVE_CHANNEL_GROUP_STORAGE_KEY, String(channelGroupId));
  }

  return channelGroupId;
};

export const isManagedChannelDisconnected = (channel) => (
  Boolean(channel?.disabled || channel?.health === 'DISCONNECTED')
);

export const getDisconnectedManagedChannelCount = (channels = MANAGED_CHANNELS) => (
  channels.filter(isManagedChannelDisconnected).length
);

export const getManagedChannelGroupChannels = (
  channelGroupId,
  channels = MANAGED_CHANNELS,
  channelGroups = getManagedChannelGroups(),
) => {
  const group = channelGroups.find((item) => String(item.id) === String(channelGroupId));
  if (!group) return [];

  return group.channelIds
    .map((channelId) => channels.find((channel) => channel.id === channelId))
    .filter(Boolean);
};

export const getActiveChannelIds = (
  channelGroupId = getActiveChannelGroupId(),
  channelGroups = getManagedChannelGroups(),
) => (
  channelGroups.find((group) => String(group.id) === String(channelGroupId))?.channelIds || []
);

export const getManagedChannelById = (channelId, channels = MANAGED_CHANNELS) => (
  channels.find((channel) => channel.id === channelId) || null
);

const normalizePlatformKey = (platform) => (
  platform === 'fb_fanpage' ? 'facebook' : platform
);

const normalizeReferenceText = (value) => (
  String(value || '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
);

export const resolveManagedChannelId = (item, channels = MANAGED_CHANNELS) => {
  if (!item) {
    return null;
  }

  const directId = item.sourceChannelId || item.channelValue || item.channelId || item.id;
  if (directId && channels.some((channel) => channel.id === directId)) {
    return directId;
  }

  const network = normalizePlatformKey(item.platform || item.network || item.platformKey);
  const label = normalizeReferenceText(item.channelName || item.account || item.channel || item.name);
  const handle = normalizeReferenceText(item.handle || item.accountHandle);

  const matchingChannel = channels.find((channel) => {
    const sameNetwork = !network || normalizePlatformKey(channel.platformKey || channel.platform) === network;
    const channelLabels = [
      channel.id,
      channel.name,
      channel.channelId,
      channel.handle,
    ].map(normalizeReferenceText);

    return sameNetwork && (channelLabels.includes(label) || channelLabels.includes(handle));
  });

  return matchingChannel?.id || null;
};

export const filterItemsByChannelIds = (items, channelIds, channels = MANAGED_CHANNELS) => {
  const channelIdSet = new Set(channelIds || []);
  if (!channelIdSet.size) {
    return [];
  }

  return items.filter((item) => {
    const channelId = resolveManagedChannelId(item, channels);
    return channelId ? channelIdSet.has(channelId) : true;
  });
};

export const getPublishingChannelFilterGroups = ({
  channelGroups = getManagedChannelGroups(),
  channels = MANAGED_CHANNELS,
  visibleChannelIds = null,
} = {}) => {
  const networkOrder = ['facebook', 'instagram', 'threads', 'youtube', 'tiktok'];
  const networkLabels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    threads: 'Threads',
    youtube: 'YouTube',
    tiktok: 'TikTok',
  };

  const visibleChannelIdSet = visibleChannelIds ? new Set(visibleChannelIds) : null;
  const visibleChannels = visibleChannelIdSet
    ? channels.filter((channel) => visibleChannelIdSet.has(channel.id))
    : channels;

  const groupOptions = channelGroups.map((group) => ({
    label: group.name,
    value: `channel-group-${group.id}`,
    initials: getChannelGroupInitials(group.name),
    color: getChannelGroupColorMeta(group.color, group.name).solid,
    channelGroup: group,
    channelIds: visibleChannelIdSet
      ? group.channelIds.filter((channelId) => visibleChannelIdSet.has(channelId))
      : group.channelIds,
  })).filter((group) => group.channelIds.length);

  return [
    {
      label: 'Channel Groups',
      value: 'group-channel-groups',
      options: groupOptions,
    },
    ...networkOrder.map((network) => ({
      label: networkLabels[network],
      value: `group-${network}`,
      network,
      options: visibleChannels
        .filter((channel) => channel.platform === network)
        .map((channel) => ({
          label: channel.name,
          value: channel.id,
          initials: channel.name.replace('@', '').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
          color: channel.avatarColor,
          platform: channel.platform,
        })),
    })).filter((group) => group.options.length),
  ];
};

export const getPublishingChannelFilterOptions = (options = {}) => (
  getPublishingChannelFilterGroups(options).flatMap((group) => [
    { label: group.label, value: group.value },
    ...group.options,
  ])
);
