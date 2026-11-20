export const MESSAGE_TYPE_GROUPS = [
  {
    label: 'All Facebook',
    value: 'all-facebook',
    network: 'facebook',
    networkLabel: 'Facebook',
    options: [
      { label: 'Wall Posts', value: 'facebook-wall-posts' },
      { label: 'Comments', value: 'facebook-comments' },
      { label: 'Ad Comments', value: 'facebook-ad-comments' },
      { label: 'Private Messages', value: 'facebook-private-messages', private: true },
    ],
  },
  {
    label: 'All Instagram',
    value: 'all-instagram',
    network: 'instagram',
    networkLabel: 'Instagram',
    options: [
      { label: 'Comments', value: 'instagram-comments' },
      { label: 'Ad Comments', value: 'instagram-ad-comments' },
      { label: 'Mentions', value: 'instagram-mentions' },
      { label: 'Direct Messages', value: 'instagram-direct-messages', private: true },
    ],
  },
  {
    label: 'All YouTube',
    value: 'all-youtube',
    network: 'youtube',
    networkLabel: 'YouTube',
    options: [
      { label: 'Video Comments', value: 'youtube-video-comments' },
      { label: 'Channel Mentions', value: 'youtube-channel-mentions' },
    ],
  },
];

export const PRIVATE_MESSAGE_TYPE_GROUPS = MESSAGE_TYPE_GROUPS
  .map((group) => ({
    ...group,
    options: group.options.filter((option) => option.private),
  }))
  .filter((group) => group.options.length);

export const MESSAGE_TYPE_VALUES = MESSAGE_TYPE_GROUPS.flatMap((group) => [
  group.value,
  ...group.options.map((option) => option.value),
]);

export const getMessageTypeScopeLabel = (value) => {
  const group = MESSAGE_TYPE_GROUPS.find((item) => item.value === value);
  if (group) {
    return group.label;
  }

  for (const item of MESSAGE_TYPE_GROUPS) {
    const option = item.options.find((candidate) => candidate.value === value);
    if (option) {
      return `${item.networkLabel} ${option.label}`;
    }
  }

  return value;
};

export const isMessageTypeScope = (value) => MESSAGE_TYPE_VALUES.includes(value);

export const isMessageTypeCoveredByScope = (scope, messageType) => {
  if (scope === messageType) {
    return true;
  }

  const group = MESSAGE_TYPE_GROUPS.find((item) => item.value === scope);
  return Boolean(group?.options.some((option) => option.value === messageType));
};
