import {
  MANAGED_CHANNEL_GROUPS,
  MANAGED_CHANNELS,
  getManagedChannelGroupNamesForChannelId,
  getManagedChannelGroupNames,
} from "../../../data/channelManagement";

export const CHANNEL_MODE_OPTIONS = [
  { value: "API", label: "API" },
];

export const CHANNEL_MODE_FILTER_OPTIONS = [
  { value: "all", label: "All Modes" },
  ...CHANNEL_MODE_OPTIONS,
];

export const CHANNEL_API_STATUS_OPTIONS = [
  { value: "CONNECTED", label: "API connected" },
  { value: "DISCONNECTED", label: "API Disconnected" },
];

export const CHANNEL_API_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Connection Status" },
  ...CHANNEL_API_STATUS_OPTIONS,
];

export const CHANNEL_HEALTH_OPTIONS = {
  API: [
    { value: "CONNECTED", label: "Connected" },
    { value: "DISCONNECTED", label: "Disconnected" },
  ],
};

export const CHANNEL_HEALTH_FILTER_OPTIONS = [
  { value: "all", label: "All Health" },
  ...Object.values(CHANNEL_HEALTH_OPTIONS).flat(),
].filter((option, index, arr) => arr.findIndex((item) => item.value === option.value) === index);

export const CHANNEL_TAB_ITEMS = [
  { label: "All Channels", key: "channels" },
  { label: "Channel Group", key: "groups" },
];

export const DEFAULT_CHANNEL_GROUPS = MANAGED_CHANNEL_GROUPS.map((group) => ({
  id: group.id,
  name: group.name,
  color: group.color,
  channelIds: [...group.channelIds],
}));

export const normalizeChannelApiStatus = (status) => (
  CHANNEL_API_STATUS_OPTIONS.some((option) => option.value === status)
    ? status
    : "CONNECTED"
);

const getCleanChannelHandle = (channel) => (
  String(channel.channelId || channel.handle || channel.id || "")
    .trim()
    .replace(/^@+/, "")
);

export const getManagedChannelLink = (channel) => {
  const handle = getCleanChannelHandle(channel);

  if (!handle) return "";

  switch (channel.platformKey || channel.platform) {
    case "fb_fanpage":
    case "facebook":
      return `https://www.facebook.com/${handle}`;
    case "instagram":
      return `https://www.instagram.com/${handle}/`;
    case "threads":
      return `https://www.threads.net/@${handle}`;
    case "youtube":
      return `https://www.youtube.com/@${handle}`;
    case "tiktok":
      return `https://www.tiktok.com/@${handle}`;
    default:
      return "";
  }
};

export const buildMockChannels = (channelGroupsSource = DEFAULT_CHANNEL_GROUPS) => MANAGED_CHANNELS.map((channel, index) => {
  const channelGroups = getManagedChannelGroupNamesForChannelId(channel.id, channelGroupsSource);
  const fallbackGroups = channelGroups.length ? channelGroups : getManagedChannelGroupNames(channel, channelGroupsSource);

  return {
    id: index + 1,
    sourceChannelId: channel.id,
    name: channel.name,
    platform: channel.platformKey || channel.platform,
    channelId: channel.channelId || channel.handle?.replace("@", "") || channel.id,
    channelLink: getManagedChannelLink(channel),
    channelGroup: fallbackGroups[0] || "",
    channelGroups: fallbackGroups,
    mode: "API",
    health: normalizeChannelApiStatus(channel.disabled || channel.health === "DISCONNECTED" ? "DISCONNECTED" : "CONNECTED"),
    addedByUid: "user-tran-hai-son",
    editedByUid: "user-tran-hai-son",
  };
});

export const MOCK_CHANNELS = buildMockChannels();

export const getChannelApiStatusOptions = () => CHANNEL_API_STATUS_OPTIONS;

export const getChannelHealthOptions = () => CHANNEL_HEALTH_OPTIONS.API;

export const getDefaultChannelHealth = () => "CONNECTED";

export const normalizeChannelHealth = (_mode, health) => (
  getChannelHealthOptions().some((option) => option.value === health)
    ? health
    : getDefaultChannelHealth()
);
