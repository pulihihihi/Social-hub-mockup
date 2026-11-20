import {
  CHANNEL_TERMINOLOGY,
  MANAGED_CHANNEL_GROUPS,
  MANAGED_CHANNELS,
} from '../../data/channelManagement';
import { MOCK_MEDIA_ASSETS } from '../../data/mockMediaAssets';

const emoji = (...codePoints) => String.fromCodePoint(...codePoints);

export const NETWORKS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'threads', label: 'Threads' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
];

export const PLATFORM_CHAR_LIMITS = {
  facebook: 5000,
  instagram: 2200,
  threads: 500,
  youtube: 5000,
  tiktok: 2000,
};

export const TOOLTIP_DELAY = 0.45;
export const DISCONNECTED_ACCOUNT_TOOLTIP = `This ${CHANNEL_TERMINOLOGY.lowerSingular} has been disconnected. Reconnect this ${CHANNEL_TERMINOLOGY.lowerSingular} to publish content.`;
export const DISCONNECTED_CHANNELS_TOOLTIP = `One or more of the selected ${CHANNEL_TERMINOLOGY.lowerPlural} are currently disconnected. Remove or reconnect them to publish content.`;
export const BRANDED_CONTENT_POLICY_URL = 'https://www.facebook.com/business/help/788160621327601/';
export const YOUTUBE_TERMS_URL = 'https://www.youtube.com/t/terms';
export const MOBILE_REMINDER_HELP_URL = 'https://support.sproutsocial.com/hc/en-us/articles/12548706472717';
export const AI_AUTOMATION_HELP_URL = 'https://support.sproutsocial.com/hc/categories/20104627776013-AI-and-Automation';

export const NEW_POST_TOOLTIPS = {
  emoji: 'Emoji',
  audienceTargeting: 'Audience Targeting',
  uploadMedia: 'Upload Media',
  importAsset: 'Import from Asset Library',
  location: 'Enter your location here',
  brandedContent: 'Brand Content Sponsors',
  productCatalog: 'Add product link',
  customVariable: 'Add custom post variable',
  aiAssist: 'Send to AI Assist',
  aiAssistDisabled: 'Upload at least one image or video to use AI Assist',
  storyUnavailable: 'Only available for one Instagram profile at a time',
  mediaMenu: 'Open Menu',
  playVideo: 'Click to play video',
  firstComment: 'Insert First Comment',
  saveFirstCommentToAssetLibrary: 'Save to Asset Library',
  scheduleTime: 'All Networks: Please choose a day or time to schedule this post.',
};

export const EMOJI_GROUPS = {
  smileys: [
    [emoji(0x1f600), 'grinning face'], [emoji(0x1f603), 'smiley face'], [emoji(0x1f604), 'smile'], [emoji(0x1f601), 'beaming face'],
    [emoji(0x1f606), 'laughing'], [emoji(0x1f605), 'sweat smile'], [emoji(0x1f923), 'rolling on the floor laughing'], [emoji(0x1f602), 'joy'],
    [emoji(0x1f642), 'slight smile'], [emoji(0x1f643), 'upside down'], [emoji(0x1fae0), 'melting face'], [emoji(0x1f609), 'wink'],
    [emoji(0x1f60a), 'blush'], [emoji(0x1f607), 'innocent'], [emoji(0x1f970), 'smiling hearts'], [emoji(0x1f60d), 'heart eyes'],
    [emoji(0x1f929), 'star struck'], [emoji(0x1f618), 'kiss'], [emoji(0x1f617), 'kissing'], [emoji(0x263a, 0xfe0f), 'relaxed'],
    [emoji(0x1f61a), 'kissing closed eyes'], [emoji(0x1f619), 'kissing smiling eyes'], [emoji(0x1f972), 'happy tear'], [emoji(0x1f60b), 'yum'],
    [emoji(0x1f61b), 'tongue'], [emoji(0x1f61c), 'wink tongue'], [emoji(0x1f92a), 'zany face'], [emoji(0x1f61d), 'squint tongue'],
    [emoji(0x1f911), 'money mouth'], [emoji(0x1f917), 'hugging'], [emoji(0x1f92d), 'hand over mouth'], [emoji(0x1fae2), 'open eyes hand'],
    [emoji(0x1fae3), 'peeking'], [emoji(0x1f92b), 'shushing'], [emoji(0x1f914), 'thinking'], [emoji(0x1fae1), 'salute'],
  ],
  animals: [
    [emoji(0x1f436), 'dog'], [emoji(0x1f431), 'cat'], [emoji(0x1f42d), 'mouse'], [emoji(0x1f439), 'hamster'],
    [emoji(0x1f430), 'rabbit'], [emoji(0x1f98a), 'fox'], [emoji(0x1f43b), 'bear'], [emoji(0x1f43c), 'panda'],
    [emoji(0x1f428), 'koala'], [emoji(0x1f42f), 'tiger'], [emoji(0x1f981), 'lion'], [emoji(0x1f42e), 'cow'],
    [emoji(0x1f437), 'pig'], [emoji(0x1f438), 'frog'], [emoji(0x1f435), 'monkey'], [emoji(0x1f414), 'chicken'],
    [emoji(0x1f427), 'penguin'], [emoji(0x1f426), 'bird'], [emoji(0x1f424), 'chick'], [emoji(0x1f986), 'duck'],
    [emoji(0x1f985), 'eagle'], [emoji(0x1f989), 'owl'], [emoji(0x1f98b), 'butterfly'], [emoji(0x1f33f), 'herb'],
  ],
  food: [
    [emoji(0x1f34f), 'green apple'], [emoji(0x1f34e), 'red apple'], [emoji(0x1f350), 'pear'], [emoji(0x1f34a), 'orange'],
    [emoji(0x1f34b), 'lemon'], [emoji(0x1f34c), 'banana'], [emoji(0x1f349), 'watermelon'], [emoji(0x1f347), 'grapes'],
    [emoji(0x1f353), 'strawberry'], [emoji(0x1fad0), 'blueberries'], [emoji(0x1f352), 'cherries'], [emoji(0x1f95d), 'kiwi'],
    [emoji(0x1f345), 'tomato'], [emoji(0x1f951), 'avocado'], [emoji(0x1f354), 'burger'], [emoji(0x1f355), 'pizza'],
    [emoji(0x1f35f), 'fries'], [emoji(0x1f32d), 'hot dog'], [emoji(0x1f96a), 'sandwich'], [emoji(0x1f32e), 'taco'],
    [emoji(0x1f363), 'sushi'], [emoji(0x1f35c), 'ramen'], [emoji(0x1f370), 'cake'], [emoji(0x2615), 'coffee'],
  ],
  activities: [
    [emoji(0x26bd), 'soccer'], [emoji(0x1f3c0), 'basketball'], [emoji(0x1f3c8), 'football'], [emoji(0x26be), 'baseball'],
    [emoji(0x1f3be), 'tennis'], [emoji(0x1f3d0), 'volleyball'], [emoji(0x1f3b1), 'pool'], [emoji(0x1f3d3), 'ping pong'],
    [emoji(0x1f3ae), 'video game'], [emoji(0x1f3b2), 'game die'], [emoji(0x1f3af), 'dart'], [emoji(0x1f3c6), 'trophy'],
    [emoji(0x1f947), 'gold medal'], [emoji(0x1f3ac), 'movie'], [emoji(0x1f3a4), 'microphone'], [emoji(0x1f3a7), 'headphones'],
  ],
  travel: [
    [emoji(0x1f697), 'car'], [emoji(0x1f695), 'taxi'], [emoji(0x1f68c), 'bus'], [emoji(0x1f68e), 'trolleybus'],
    [emoji(0x1f3ce, 0xfe0f), 'race car'], [emoji(0x1f693), 'police car'], [emoji(0x1f691), 'ambulance'], [emoji(0x1f692), 'fire engine'],
    [emoji(0x2708, 0xfe0f), 'airplane'], [emoji(0x1f680), 'rocket'], [emoji(0x1f6f6), 'canoe'], [emoji(0x26f5), 'sailboat'],
    [emoji(0x1f3dd, 0xfe0f), 'island'], [emoji(0x1f3d4, 0xfe0f), 'mountain'], [emoji(0x1f3e0), 'house'], [emoji(0x1f307), 'sunset city'],
  ],
  objects: [
    [emoji(0x231a), 'watch'], [emoji(0x1f4f1), 'mobile phone'], [emoji(0x1f4bb), 'laptop'], [emoji(0x2328, 0xfe0f), 'keyboard'],
    [emoji(0x1f5a5, 0xfe0f), 'desktop'], [emoji(0x1f5a8, 0xfe0f), 'printer'], [emoji(0x1f4f7), 'camera'], [emoji(0x1f3a5), 'movie camera'],
    [emoji(0x1f4a1), 'light bulb'], [emoji(0x1f526), 'flashlight'], [emoji(0x1f4e6), 'package'], [emoji(0x1f6d2), 'cart'],
    [emoji(0x1f381), 'gift'], [emoji(0x1f511), 'key'], [emoji(0x1f512), 'lock'], [emoji(0x1f4dd), 'memo'],
  ],
  symbols: [
    [emoji(0x2764, 0xfe0f), 'red heart'], [emoji(0x1f9e1), 'orange heart'], [emoji(0x1f49b), 'yellow heart'], [emoji(0x1f49a), 'green heart'],
    [emoji(0x1f499), 'blue heart'], [emoji(0x1f49c), 'purple heart'], [emoji(0x1f5a4), 'black heart'], [emoji(0x1f90d), 'white heart'],
    [emoji(0x2728), 'sparkles'], [emoji(0x2b50), 'star'], [emoji(0x1f525), 'fire'], [emoji(0x1f4af), 'hundred'],
    [emoji(0x2705), 'check'], [emoji(0x274c), 'cross'], [emoji(0x26a0, 0xfe0f), 'warning'], [emoji(0x1f514), 'bell'],
  ],
  flags: [
    [emoji(0x1f1fb, 0x1f1f3), 'Vietnam'], [emoji(0x1f1f8, 0x1f1ec), 'Singapore'], [emoji(0x1f1f9, 0x1f1ed), 'Thailand'], [emoji(0x1f1ee, 0x1f1e9), 'Indonesia'],
    [emoji(0x1f1f2, 0x1f1fe), 'Malaysia'], [emoji(0x1f1f5, 0x1f1ed), 'Philippines'], [emoji(0x1f1f9, 0x1f1fc), 'Taiwan'], [emoji(0x1f1e7, 0x1f1f7), 'Brazil'],
    [emoji(0x1f1fa, 0x1f1f8), 'United States'], [emoji(0x1f1ec, 0x1f1e7), 'United Kingdom'], [emoji(0x1f1ef, 0x1f1f5), 'Japan'], [emoji(0x1f1f0, 0x1f1f7), 'South Korea'],
    [emoji(0x1f1eb, 0x1f1f7), 'France'], [emoji(0x1f1e9, 0x1f1ea), 'Germany'], [emoji(0x1f1ea, 0x1f1f8), 'Spain'], [emoji(0x1f1ee, 0x1f1f9), 'Italy'],
  ],
};

export const CHANNELS = MANAGED_CHANNELS;
export const CHANNEL_GROUPS = MANAGED_CHANNEL_GROUPS;

export const ASSET_SOURCE_META = {
  assetLibrary: {
    label: 'Asset Library',
    section: 'Shared Media',
    description: 'Browse shared brand assets approved for publishing.',
  },
  bynder: {
    label: 'Bynder',
    section: 'My Media',
    description: 'Choose assets from the connected Bynder DAM workspace.',
  },
  dropbox: {
    label: 'Dropbox',
    section: 'My Media',
    description: 'Pick files from connected Dropbox folders.',
  },
  googleDrive: {
    label: 'Google Drive',
    section: 'My Media',
    description: 'Pick files from connected Drive folders.',
  },
};

export const ASSET_LIBRARY_ITEMS = [
  {
    id: 'brand-kv',
    type: 'image',
    title: 'Season Launch Key Visual',
    source: 'Asset Library',
    meta: '1080 x 1080 PNG',
  },
  {
    id: 'event-recap',
    type: 'image',
    title: 'Community Night Recap',
    source: 'Bynder',
    meta: '4 approved images',
  },
  {
    id: 'short-gameplay',
    type: 'video',
    title: 'Gameplay Short 15s',
    source: 'Dropbox',
    meta: '9:16 MP4',
  },
  {
    id: 'creator-cut',
    type: 'video',
    title: 'Creator Cutdown',
    source: 'Google Drive',
    meta: 'Ready for TikTok',
  },
  ...MOCK_MEDIA_ASSETS.map((asset, index) => ({
    id: `source-${asset.id}`,
    type: asset.type,
    title: asset.name,
    source: ['Asset Library', 'Bynder', 'Dropbox', 'Google Drive'][index % 4],
    meta: asset.meta,
    src: asset.src,
    mediaAsset: asset,
  })),
];

export const DEFAULT_VIDEO_DETAILS = {
  thumbnail: 'auto',
  subtitles: 'not-added',
  subtitleFileName: '',
  subtitleLanguage: '',
  subtitleText: '',
  facebookPlacement: 'standard',
  facebookTitle: '',
  facebookCategory: undefined,
  facebookCaptions: true,
  instagramTrialReel: false,
  instagramTrialReelAutoPublish: false,
  instagramShareToFeed: true,
  instagramRemixing: true,
  threadsReplyControl: 'anyone',
  threadsAltText: '',
  youtubeTags: [],
  youtubePrivacy: 'public',
  youtubeCategory: 'People & Blogs',
  youtubeAgeRestriction: 'not-restricted',
  youtubeLicense: 'standard',
  youtubeEmbedding: true,
  youtubeNotifySubscribers: true,
  youtubePaidPromotion: false,
  tiktokAllowComments: true,
  tiktokAllowDuets: true,
  tiktokAllowStitches: true,
  tiktokPrivacy: 'public',
  tiktokCover: 'auto',
};

export const SCHEDULE_HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => {
  const hour = String(index + 1);
  return { value: hour, label: hour };
});

export const SCHEDULE_MINUTE_OPTIONS = ['00', '15', '30', '45'].map((minute) => ({
  value: minute,
  label: minute,
}));

export const SCHEDULE_PERIOD_OPTIONS = ['AM', 'PM'].map((period) => ({
  value: period,
  label: period,
}));
