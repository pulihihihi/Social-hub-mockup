import { getMockMediaAsset } from '../../data/mockMediaAssets';

export const MAX_MEDIA_ITEMS = 5;

export const createMediaItem = ({
  asset = null,
  assetIndex = 0,
  createId = () => `media-${Date.now()}`,
  label = null,
  type = 'image',
} = {}) => {
  const mockAsset = asset || getMockMediaAsset(type, assetIndex);
  const baseItem = {
    id: createId(),
    type,
    label: label || (type === 'video' ? 'Video' : 'Image'),
    assetId: mockAsset.id || mockAsset.name,
    sourceName: mockAsset.name || label || (type === 'video' ? 'Video' : 'Image'),
    src: mockAsset.src,
    alt: mockAsset.alt || mockAsset.title || mockAsset.name || label,
    fileType: mockAsset.fileType,
    isLocalUpload: Boolean(mockAsset.isLocalUpload),
    meta: mockAsset.meta,
    poster: mockAsset.poster,
    sizeLabel: mockAsset.sizeLabel,
  };

  if (type !== 'video') {
    return {
      ...baseItem,
      aspectRatio: mockAsset.aspectRatio,
      format: mockAsset.format,
      height: mockAsset.height,
      width: mockAsset.width,
    };
  }

  return {
    ...baseItem,
    duration: mockAsset.duration || '0:15',
    aspectRatio: mockAsset.aspectRatio || '9:16',
    format: mockAsset.format || 'MP4',
    hasAudio: mockAsset.hasAudio,
    width: mockAsset.width,
    height: mockAsset.height,
  };
};

export const appendMediaItem = (media, options = {}) => {
  if (media.length >= MAX_MEDIA_ITEMS) {
    return {
      media,
      rejected: true,
    };
  }

  return {
    media: [
      ...media,
      createMediaItem({
        ...options,
        assetIndex: options.assetIndex ?? media.filter((item) => item.type === (options.type || 'image')).length,
      }),
    ],
    rejected: false,
  };
};

export const removeMediaItem = (media, mediaId) => (
  media.filter((item) => item.id !== mediaId)
);

export const cloneMediaForNetwork = (media, networkKey) => (
  media.map((item, index) => ({
    ...item,
    id: `${networkKey}-${item.sourceMediaId || item.id}-${index}`,
    sourceMediaId: item.sourceMediaId || item.id,
  }))
);

export const fillPerNetworkMedia = ({
  mediaByNetwork = {},
  networkKeys = [],
  sharedMedia = [],
} = {}) => {
  const nextMediaByNetwork = { ...mediaByNetwork };

  networkKeys.forEach((networkKey) => {
    if (!Array.isArray(nextMediaByNetwork[networkKey])) {
      nextMediaByNetwork[networkKey] = cloneMediaForNetwork(sharedMedia, networkKey);
    }
  });

  return nextMediaByNetwork;
};

export const collapsePerNetworkMedia = ({
  activeNetwork,
  mediaByNetwork = {},
  sharedMedia = [],
} = {}) => (
  Array.isArray(mediaByNetwork[activeNetwork]) ? mediaByNetwork[activeNetwork] : sharedMedia
);

export const reorderMediaItem = (media, sourceMediaId, targetMediaId) => {
  const sourceIndex = media.findIndex((item) => item.id === sourceMediaId);
  const targetIndex = media.findIndex((item) => item.id === targetMediaId);

  if (
    sourceIndex < 0
    || targetIndex < 0
    || sourceIndex === targetIndex
  ) {
    return media;
  }

  const nextMedia = [...media];
  const [movedItem] = nextMedia.splice(sourceIndex, 1);

  nextMedia.splice(targetIndex, 0, movedItem);

  return nextMedia;
};

export const fillPerNetworkCaptions = ({ captions, networkKeys }) => {
  const nextCaptions = { ...captions };

  networkKeys.forEach((networkKey) => {
    nextCaptions[networkKey] = nextCaptions[networkKey] || captions.all || '';
  });

  return nextCaptions;
};

export const collapsePerNetworkCaptions = ({ activeNetwork, captions }) => ({
  ...captions,
  all: captions[activeNetwork] ?? captions.all ?? '',
});

const hasScheduledTime = (scheduledTime) => (
  Boolean(scheduledTime?.date) || Boolean(scheduledTime?.time)
);

const differsFromDefault = (value, defaultValue) => (
  JSON.stringify(value) !== JSON.stringify(defaultValue)
);

export const hasComposerChanges = ({
  approvalWorkflow,
  captions,
  defaultVideoDetails,
  firstComment,
  isDraft,
  isStory,
  labels,
  media,
  mobilePublisher,
  mode,
  networkOrder,
  scheduleByNetwork,
  scheduleMode,
  scheduledTimes,
  videoDetails,
  youtubeAudience,
  youtubeTitle,
}) => (
  Boolean(captions.all)
  || networkOrder.some((network) => Boolean(captions[network]))
  || media.length > 0
  || Boolean(firstComment)
  || isDraft
  || isStory
  || mode === 'per_network'
  || labels.length > 0
  || Boolean(approvalWorkflow)
  || Boolean(mobilePublisher)
  || scheduleMode !== 'specific'
  || scheduleByNetwork
  || scheduledTimes.some(hasScheduledTime)
  || Boolean(youtubeTitle)
  || youtubeAudience !== 'not-made-for-kids'
  || differsFromDefault(videoDetails, defaultVideoDetails)
);
