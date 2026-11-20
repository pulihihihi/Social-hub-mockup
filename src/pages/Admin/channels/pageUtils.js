export const resolveChannelsInitialTab = (search, initialTab = "channels") => {
  const tab = new URLSearchParams(search).get("tab");
  return tab === "groups" ? "groups" : initialTab;
};

export const normalizeChannelGroupNames = (value) => {
  const rawGroups = Array.isArray(value)
    ? value
    : (value ? [value] : []);

  return [...new Set(rawGroups.map((groupName) => String(groupName).trim()).filter(Boolean))];
};

export const getChannelGroupNames = (channelOrGroups) => {
  if (channelOrGroups && typeof channelOrGroups === "object" && !Array.isArray(channelOrGroups)) {
    return normalizeChannelGroupNames(channelOrGroups.channelGroups ?? channelOrGroups.channelGroup);
  }

  return normalizeChannelGroupNames(channelOrGroups);
};

export const buildChannelCountMap = (channels) => (
  channels.reduce((accumulator, channel) => {
    getChannelGroupNames(channel).forEach((channelGroup) => {
      accumulator[channelGroup] = (accumulator[channelGroup] || 0) + 1;
    });

    return accumulator;
  }, {})
);

export const getChannelLinkLabel = (link) => {
  try {
    const url = new URL(link);
    const path = url.pathname.replace(/\/$/, "");
    return `${url.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return link;
  }
};

export const getFilteredChannelGroupRows = ({ channelCountMap, channelGroups, query }) => (
  channelGroups
    .filter((group) => !query || group.name.toLowerCase().includes(query.toLowerCase()))
    .map((group) => ({
      ...group,
      channelCount: channelCountMap[group.name] || 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
);

export const hasValidChannelGroup = (channelGroup, channelGroups) => (
  getChannelGroupNames(channelGroup).some((groupName) => channelGroups.some((item) => item.name === groupName))
);

export const getChannelGroupValue = (channelGroup, channelGroups) => (
  getChannelGroupNames(channelGroup).filter((groupName) => channelGroups.some((item) => item.name === groupName))
);

export const getChannelGroupDisplay = (channelGroup, channelGroups) => (
  getChannelGroupValue(channelGroup, channelGroups)
    .map((groupName) => channelGroups.find((group) => group.name === groupName))
    .filter(Boolean)
);

export const matchesChannelGroupFilter = (channelGroup, selectedGroups) => {
  if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) {
    return true;
  }

  const channelGroupSet = new Set(getChannelGroupNames(channelGroup));
  return selectedGroups.some((groupName) => channelGroupSet.has(groupName));
};

export const removeChannelGroupValues = (channelGroup, groupNames) => {
  const removeSet = groupNames instanceof Set ? groupNames : new Set(groupNames);
  return getChannelGroupNames(channelGroup).filter((groupName) => !removeSet.has(groupName));
};

export const renameChannelGroupValues = (channelGroup, previousName, nextName) => (
  getChannelGroupNames(channelGroup).map((groupName) => (groupName === previousName ? nextName : groupName))
);

export const renameChannelGroupFilterValue = (selectedGroups, previousName, nextName) => (
  selectedGroups.map((groupName) => (groupName === previousName ? nextName : groupName))
);
