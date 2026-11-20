/**
 * Platform and channel data for Social Hub.
 *
 * SOURCE_TYPES: The supported social channel source types.
 *   Facebook is broken into Fanpage vs Group (2 separate sources).
 *   FB Group has groupType: "public" | "private".
 *
 * PLATFORM_CONFIG: Centralized lookup for labels, colors, icons.
 *   Every component that shows a platform badge/tag/filter must use this config.
 */
import { FacebookIco, FbGroupIco, InstagramIco, ThreadsIco, TikTokIco, YouTubeIco } from '../components/icons';
import { C } from '../theme';

// Centralized Platform Config (single source of truth)
// Keys: fb_fanpage, fb_group, instagram, threads, tiktok, youtube
// Every PlatformBadge, PlatformTag, filter dropdown MUST use this.
export const PLATFORM_CONFIG = {
  fb_fanpage: { key: "fb_fanpage", label: "FB Fanpage", shortLabel: "Fanpage", icon: FacebookIco, color: C.facebook, bg: C.facebook + "18" },
  fb_group:   { key: "fb_group",   label: "FB Group",   shortLabel: "Group",   icon: FbGroupIco,  color: C.fbGroup,  bg: C.fbGroup + "18" },
  instagram:  { key: "instagram",  label: "Instagram",  shortLabel: "Instagram", icon: InstagramIco, color: C.instagram, bg: C.instagram + "18" },
  threads:    { key: "threads",    label: "Threads",    shortLabel: "Threads", icon: ThreadsIco, color: C.threads, bg: C.threads + "18" },
  tiktok:     { key: "tiktok",     label: "TikTok",     shortLabel: "TikTok",   icon: TikTokIco,   color: C.tiktok,   bg: C.tiktok + "18" },
  youtube:    { key: "youtube",    label: "YouTube",    shortLabel: "YouTube",  icon: YouTubeIco,  color: C.youtube,  bg: C.youtube + "18" },
};

// Array version for iteration (filters, dropdowns)
export const PLATFORM_LIST = Object.values(PLATFORM_CONFIG);

// Helper: resolve legacy "facebook" key to fb_fanpage (for backward compat in mock data)
export const resolvePlatformKey = (key) => {
  if (key === "facebook") return "fb_fanpage";
  return key;
};

export const getPlatformConfig = (key) => {
  const resolvedKey = resolvePlatformKey(key);
  return PLATFORM_CONFIG[resolvedKey] || {
    key: resolvedKey || "unknown",
    label: key || "Unknown",
    shortLabel: key || "Unknown",
    icon: null,
    color: "#8c8c8c",
    bg: "#f5f5f5",
  };
};

export const PLATFORM_FILTER_OPTIONS = PLATFORM_LIST.map((platform) => ({
  value: platform.key,
  label: platform.label,
}));

// SOCIAL_PLATFORMS powers channel source metadata in settings and mocks.
// NOTE: Facebook is one entry here because source helpers manage subType internally.
export const SOCIAL_PLATFORMS = [
  { key: "facebook", name: "Facebook", icon: FacebookIco, color: C.facebook, description: "Fanpages & Groups - Posts, Discussions, Comments", channelTypes: [{ key: "page", name: "Page", description: "Manage Business Pages and Messenger" }, { key: "ad_account", name: "Ad Account", description: "Brand management, Facebook posts, and monitor ad performance" }], connectedData: ["Posts", "Comments", "Share Comments", "Page Post Comments", "Tag Discussions"] },
  { key: "instagram", name: "Instagram", icon: InstagramIco, color: C.instagram, description: "Posts and Reels", channelTypes: [{ key: "creator", name: "Creator Channel", description: "Manage publishing, engagement, and analytics for your creator channel." }, { key: "business", name: "Business Channel", description: "Manage publishing, engagement, and analytics for your business channel." }], connectedData: ["Comments", "Caption Discussions", "Post & Reels"] },
  { key: "threads", name: "Threads", icon: ThreadsIco, color: C.threads, description: "Threads posts and replies", channelTypes: [], connectedData: ["Replies", "Posts"] },
  { key: "tiktok", name: "TikTok", icon: TikTokIco, color: C.tiktok, description: "User Posting Posts", channelTypes: [], connectedData: ["Video Comments", "Video Posts"] },
  { key: "youtube", name: "YouTube", icon: YouTubeIco, color: C.youtube, description: "Videos, Shorts, and Comments", channelTypes: [], connectedData: ["Video Comments", "Video Descriptions"] },
];

export const MOCK_CHANNELS = [
  { id: 1, name: "Garena Vietnam", platform: "fb_fanpage", type: "page" },
  { id: 2, name: "Garena VN Official", platform: "instagram", type: "business" },
  { id: 3, name: "GarenaVN", platform: "tiktok", type: "business" },
];

export const MOCK_PAGES = {
  facebook: [
    { id: "fb1", name: "Garena Free Fire Vietnam", verified: true, subType: "fanpage", categoryId: null },
    { id: "fb2", name: "Garena Lien Quan Mobile", verified: true, subType: "fanpage", categoryId: null },
    { id: "fb3", name: "Garena Speed Drifters", verified: false, subType: "fanpage", categoryId: null },
    { id: "fb4", name: "Garena FC Online Vietnam", verified: true, subType: "fanpage", categoryId: null },
    { id: "fb5", name: "Delta Force Vietnam", verified: true, subType: "fanpage", categoryId: null },
    { id: "fb6", name: "Lien Quan AI", verified: false, subType: "group", groupType: "public", categoryId: 227 },
    { id: "fb7", name: "Hoc Vien Lien Quan", verified: false, subType: "group", groupType: "public", categoryId: 36 },
    { id: "fb8", name: "Cosplay Lien Quan", verified: false, subType: "group", groupType: "public", categoryId: 32 },
    { id: "fb9", name: "Esports VN - Lien Quan", verified: false, subType: "group", groupType: "private", categoryId: 50 },
    { id: "fb10", name: "Garena Creators Hub", verified: false, subType: "fanpage", categoryId: 196 },
  ],
  instagram: [
    { id: "ig1", name: "Garena Vietnam Official", verified: true, subType: "business", categoryId: null },
    { id: "ig2", name: "Free Fire Vietnam", verified: true, subType: "creator", categoryId: null },
    { id: "ig3", name: "Lien Quan Mobile VN", verified: false, subType: "business", categoryId: null },
    { id: "ig4", name: "Delta Force VN", verified: false, subType: "business", categoryId: null },
    { id: "ig5", name: "FC Online Vietnam", verified: false, subType: "business", categoryId: null },
  ],
  threads: [
    { id: "th1", name: "Garena Delta Force VN", verified: true, subType: "account", categoryId: null },
    { id: "th2", name: "Chien Than Delta Force", verified: false, subType: "account", categoryId: null },
  ],
  tiktok: [
    { id: "tt1", name: "Garena Vietnam", verified: true, subType: "account", categoryId: null },
    { id: "tt2", name: "Free Fire Vietnam Official", verified: true, subType: "account", categoryId: null },
    { id: "tt3", name: "Lien Quan Mobile", verified: false, subType: "account", categoryId: null },
    { id: "tt4", name: "Delta Force Vietnam", verified: false, subType: "account", categoryId: null },
    { id: "tt5", name: "FC Online VN", verified: false, subType: "account", categoryId: null },
  ],
  youtube: [
    { id: "yt1", name: "Garena Free Fire Vietnam", verified: true, subType: "channel", categoryId: null },
    { id: "yt2", name: "Lien Quan Mobile", verified: true, subType: "channel", categoryId: null },
    { id: "yt3", name: "Garena Vietnam", verified: false, subType: "channel", categoryId: null },
    { id: "yt4", name: "Delta Force Vietnam Official", verified: false, subType: "channel", categoryId: null },
    { id: "yt5", name: "FC Online Vietnam", verified: false, subType: "channel", categoryId: null },
  ],
};

export const MAX_CHANNELS = 100;

export const SOURCE_CATEGORIES = [
  { id: 227, name: "AI Creator", count: 1 },
  { id: 196, name: "Creator Warmup", count: 1 },
  { id: 50, name: "Esports FB Group", count: 2 },
  { id: 36, name: "Community Fb Group", count: 4 },
  { id: 35, name: "Caster", count: 0 },
  { id: 34, name: "Booking_General KOLs & Pages", count: 0 },
  { id: 33, name: "Booking_Gaming KOLs", count: 0 },
  { id: 32, name: "Artist Sang Tao 247", count: 1 },
];

export const CHANNEL_GROUP_FILTERS = [
  { id: 352, name: "PENDING UGC APPLICATION", channelIds: [] },
  { id: 227, name: "AI Creator", channelIds: ["tt2", "tt3"] },
  { id: 196, name: "Creator Warmup", channelIds: ["fb10", "tt1"] },
  { id: 193, name: "Creator Esports", channelIds: ["yt1", "yt2", "ig3"] },
  { id: 188, name: "MLBB CC", channelIds: [] },
  { id: 187, name: "MLBB official", channelIds: [] },
  { id: 401, name: "Free Fire Official", channelIds: ["fb1", "ig2", "tt2", "yt1"] },
  { id: 402, name: "Lien Quan Official", channelIds: ["fb2", "ig3", "tt3", "yt2"] },
  { id: 403, name: "Delta Force Official", channelIds: ["fb5", "ig4", "tt4", "yt4"] },
  { id: 404, name: "FC Online Official", channelIds: ["fb4", "ig5", "tt5", "yt5"] },
  { id: 405, name: "Garena Corporate", channelIds: ["fb10", "ig1", "tt1", "yt3"] },
  { id: 406, name: "Community Public", channelIds: ["fb6", "fb7", "fb8"] },
  { id: 407, name: "Community Private", channelIds: ["fb9"] },
  { id: 408, name: "TikTok Gaming KOL", channelIds: ["tt2", "tt3", "tt4"] },
  { id: 409, name: "YouTube Gaming KOL", channelIds: ["yt1", "yt2", "yt4"] },
  { id: 410, name: "Instagram Gaming Hub", channelIds: ["ig2", "ig3", "ig4"] },
  { id: 411, name: "Caster Network", channelIds: ["fb7", "yt2"] },
  { id: 412, name: "Community Mods", channelIds: ["fb6", "fb8", "fb9"] },
  { id: 413, name: "Garena Brand Watch", channelIds: ["fb1", "fb4", "fb5", "ig1", "yt3"] },
  { id: 414, name: "Campaign Watchlist", channelIds: ["fb3", "tt5", "yt5"] },
];

export const getChannelGroupFilterChannels = (groupId) => {
  const group = CHANNEL_GROUP_FILTERS.find(item => item.id === groupId);
  if (!group) return [];

  const allPages = Object.entries(MOCK_PAGES).flatMap(([platformKey, pages]) =>
    pages.map(page => ({ ...page, platformKey }))
  );

  return group.channelIds
    .map(id => allPages.find(page => page.id === id))
    .filter(Boolean);
};

// Channel Groups (managed in Admin > Channels page)
// Each group contains a set of channel IDs across platforms
export const MOCK_CHANNEL_GROUPS = [
  { id: "grp1", name: "Free Fire Vietnam", channelIds: ["fb1", "ig2", "tt2", "yt1"], color: "#ff6b35" },
  { id: "grp2", name: "Lien Quan Mobile", channelIds: ["fb2", "fb6", "fb7", "fb8", "ig3", "tt3", "yt2"], color: "#1677ff" },
  { id: "grp3", name: "Delta Force VN", channelIds: ["fb5", "ig4", "tt4", "yt4"], color: "#52c41a" },
  { id: "grp4", name: "FC Online Vietnam", channelIds: ["fb4", "ig5", "tt5", "yt5"], color: "#722ed1" },
  { id: "grp5", name: "Garena Corporate", channelIds: ["fb1", "fb10", "ig1", "tt1", "yt3"], color: "#eb2f96" },
  { id: "grp6", name: "Community & Esports", channelIds: ["fb6", "fb7", "fb8", "fb9"], color: "#faad14" },
];

// Helper: get all channels from a group
export const getGroupChannels = (groupId) => {
  const group = MOCK_CHANNEL_GROUPS.find(g => g.id === groupId);
  if (!group) return [];
  const allPages = Object.values(MOCK_PAGES).flat();
  return group.channelIds.map(id => allPages.find(p => p.id === id)).filter(Boolean);
};

// Helper: get platform key from channel id prefix
export const getChannelPlatform = (channelId) => {
  if (channelId.startsWith("fb")) return "facebook";
  if (channelId.startsWith("ig")) return "instagram";
  if (channelId.startsWith("th")) return "threads";
  if (channelId.startsWith("tt")) return "tiktok";
  if (channelId.startsWith("yt")) return "youtube";
  return "facebook";
};

export const SUB_TYPE_CONFIG = {
  fanpage: { label: "Fanpage", color: C.facebook, bg: "#e7f3ff" },
  group: { label: "Group", color: C.fbGroup, bg: "#f0f2f5" },
  group_public: { label: "Public", color: C.fbGroup, bg: "#f0f2f5" },
  group_private: { label: "Private", color: "#8b5cf6", bg: "#f5f3ff" },
  business: { label: "Business", color: C.instagram, bg: "#fce4ec" },
  creator: { label: "Creator", color: C.instagram, bg: "#f3e5f5" },
  account: { label: "Account", color: C.tiktok, bg: "#f5f5f5" },
  channel: { label: "Channel", color: C.youtube, bg: "#ffebee" },
};
