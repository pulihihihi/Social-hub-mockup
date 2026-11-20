import { NETWORKS } from './publishingComposerConfig';

const getPlatformLabel = (platform) => (
  NETWORKS.find((network) => network.key === platform)?.label || platform
);

export const ASSET_RULE_MESSAGES = {
  mixedMedia: 'Images and videos can not be combined. Please remove either the image(s) or video(s).',
  singleVideoAllowed: '1 video allowed for selected network.',
  instagramImageAspect: '1 or more of your Instagram images is not within the 3:4 to 1.91:1 aspect ratio. Please crop your image(s) or choose use a publisher to use the Sprout Mobile App Flow.',
  instagramCarouselVideoDuration: 'Instagram videos within a carousel post cannot be longer than 1 minute.',
  instagramVideoWidth: 'Please make sure your video width is 1920 pixels or less.',
  instagramMediaRequired: 'Image or video required when posting to Instagram. Save post as a draft to add media later.',
  tiktokVideoRequired: 'Video is required when posting to TikTok. Save post as a draft to add media later.',
  videoStillUploading: 'Video is still uploading. Please wait.',
  youtubeAudienceRequired: 'Audience selection is required when posting to YouTube',
  youtubeTitleRequired: 'A title is required when posting a video',
  youtubeVideoRequired: 'Video is required when posting to YouTube. Save post as a draft to add media later.',
};

export const SINGLE_VIDEO_NETWORK_KEYS = ['facebook', 'threads', 'youtube', 'tiktok'];

export const PLATFORM_ASSET_RULES = {
  facebook: {
    label: 'Facebook',
    disallowMixedMedia: true,
  },
  instagram: {
    label: 'Instagram',
    imageAspectRatio: { min: '3:4', max: '1.91:1' },
    maxVideoWidth: 1920,
    requiresMedia: true,
  },
  threads: {
    label: 'Threads',
    disallowMixedMedia: true,
  },
  youtube: {
    label: 'YouTube',
    requiresVideo: true,
    requiresTitleForVideo: true,
  },
  tiktok: {
    label: 'TikTok',
    requiresVideo: true,
  },
};

const getMediaProfile = ({ contentType = 'empty', hasVideo = false, media = [] } = {}) => {
  const videos = media.filter((item) => item.type === 'video');
  const mediaHasImage = media.some((item) => item.type === 'image');
  const mediaHasVideo = videos.length > 0;
  const hasImageContent = mediaHasImage || contentType === 'image' || contentType === 'mixed';
  const hasVideoContent = mediaHasVideo || hasVideo || contentType === 'video' || contentType === 'mixed';

  return {
    hasAnyMedia: media.length > 0 || contentType !== 'empty',
    hasImage: hasImageContent,
    hasMixedMedia: hasImageContent && hasVideoContent,
    hasUploadingVideo: videos.some((item) => (
      item.uploadStatus === 'uploading'
      || item.isUploading
      || (item.isLocalUpload && item.uploadStatus !== 'ready')
    )),
    hasVideo: hasVideoContent,
    videoCount: videos.length,
    videos,
  };
};

const getDurationSeconds = (duration) => {
  if (Number.isFinite(duration)) {
    return duration;
  }

  if (typeof duration !== 'string') {
    return 0;
  }

  const parts = duration
    .split(':')
    .map((part) => Number(part.trim()))
    .filter((part) => Number.isFinite(part));

  if (!parts.length) {
    const numericDuration = Number.parseFloat(duration);
    return Number.isFinite(numericDuration) ? numericDuration : 0;
  }

  return parts.reduce((total, part) => (total * 60) + part, 0);
};

const hasInstagramCarouselVideoDurationIssue = (profile, media) => (
  media.length > 1
  && profile.videos.some((item) => getDurationSeconds(item.duration) > 60)
);

const hasInstagramVideoWidthIssue = (profile) => (
  profile.videos.some((item) => Number.isFinite(item.width) && item.width > 1920)
);

const makeValidationItem = ({ key, platform, description }) => ({
  key,
  type: 'error',
  message: getPlatformLabel(platform),
  description,
});

export const getPublishingAssetValidationItems = ({
  contentType = 'empty',
  hasVideo = false,
  isDraft = false,
  media = [],
  networkKeys = [],
  youtubeAudience = 'not-made-for-kids',
  youtubeTitle = '',
} = {}) => {
  const profile = getMediaProfile({ contentType, hasVideo, media });
  const items = [];

  networkKeys.forEach((networkKey) => {
    const rule = PLATFORM_ASSET_RULES[networkKey];

    if (!rule) {
      return;
    }

    if (SINGLE_VIDEO_NETWORK_KEYS.includes(networkKey) && profile.videoCount > 1) {
      items.push(makeValidationItem({
        key: `${networkKey}-single-video`,
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.singleVideoAllowed,
      }));
    }

    if (rule.disallowMixedMedia && profile.hasMixedMedia) {
      items.push(makeValidationItem({
        key: `${networkKey}-mixed-media`,
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.mixedMedia,
      }));
    }

    if (networkKey === 'instagram' && !isDraft && rule.requiresMedia && !profile.hasAnyMedia) {
      items.push(makeValidationItem({
        key: 'instagram-media',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.instagramMediaRequired,
      }));
    }

    if (networkKey === 'instagram' && hasInstagramCarouselVideoDurationIssue(profile, media)) {
      items.push(makeValidationItem({
        key: 'instagram-carousel-video-duration',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.instagramCarouselVideoDuration,
      }));
    }

    if (networkKey === 'instagram' && hasInstagramVideoWidthIssue(profile)) {
      items.push(makeValidationItem({
        key: 'instagram-video-width',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.instagramVideoWidth,
      }));
    }

    if (networkKey === 'instagram' && !isDraft && profile.hasImage) {
      items.push(makeValidationItem({
        key: 'instagram-image-aspect',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.instagramImageAspect,
      }));
    }

    if (networkKey === 'youtube' && !isDraft && rule.requiresTitleForVideo && profile.hasVideo && !youtubeTitle.trim()) {
      items.push(makeValidationItem({
        key: 'youtube-title',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.youtubeTitleRequired,
      }));
    }

    if (networkKey === 'youtube' && !isDraft && profile.hasVideo && !youtubeAudience) {
      items.push(makeValidationItem({
        key: 'youtube-audience',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.youtubeAudienceRequired,
      }));
    }

    if (networkKey === 'youtube' && !isDraft && rule.requiresVideo && !profile.hasVideo) {
      items.push(makeValidationItem({
        key: 'youtube-video',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.youtubeVideoRequired,
      }));
    }

    if (networkKey === 'tiktok' && !isDraft && rule.requiresVideo && !profile.hasVideo) {
      items.push(makeValidationItem({
        key: 'tiktok-video',
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.tiktokVideoRequired,
      }));
    }

    if (profile.hasUploadingVideo) {
      items.push(makeValidationItem({
        key: `${networkKey}-video-uploading`,
        platform: networkKey,
        description: ASSET_RULE_MESSAGES.videoStillUploading,
      }));
    }
  });

  return items;
};

export const getMediaAssetGuidanceItems = ({
  media = [],
  mediaItem,
  networkKeys = [],
} = {}) => {
  if (!mediaItem) {
    return [];
  }

  const profile = getMediaProfile({ media });
  const items = [];

  if (networkKeys.includes('instagram') && mediaItem.type === 'image') {
    items.push({
      key: 'instagram-image-aspect',
      message: getPlatformLabel('instagram'),
      description: ASSET_RULE_MESSAGES.instagramImageAspect,
    });
  }

  if (networkKeys.includes('instagram') && mediaItem.type === 'video') {
    items.push({
      key: 'instagram-video-width',
      message: getPlatformLabel('instagram'),
      description: ASSET_RULE_MESSAGES.instagramVideoWidth,
    });
  }

  if (profile.hasMixedMedia) {
    ['facebook', 'threads'].forEach((networkKey) => {
      if (networkKeys.includes(networkKey)) {
        items.push({
          key: `${networkKey}-mixed-media`,
          message: getPlatformLabel(networkKey),
          description: ASSET_RULE_MESSAGES.mixedMedia,
        });
      }
    });
  }

  return items;
};

export const getPrimaryMediaAssetGuidance = (params) => (
  getMediaAssetGuidanceItems(params)[0] || null
);
