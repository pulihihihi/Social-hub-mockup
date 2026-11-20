import { NETWORKS } from './publishingComposerConfig';

export const getPlatformMeta = (platform) => (
  NETWORKS.find((network) => network.key === platform)
  || { key: platform, label: platform }
);

export const makeInitialCaptions = () => (
  NETWORKS.reduce((accumulator, network) => {
    accumulator[network.key] = '';
    return accumulator;
  }, { all: '' })
);

export const networkOrder = NETWORKS.map((network) => network.key);

export const getNetworkKeysForChannels = (channels) => {
  const selectedPlatforms = new Set(channels.map((channel) => channel.platform));
  return networkOrder.filter((networkKey) => selectedPlatforms.has(networkKey));
};

export const canUseInstagramStory = ({ networkKeys = [], selectedChannels = [] }) => (
  selectedChannels.length === 1
  && selectedChannels[0]?.platform === 'instagram'
  && networkKeys.length === 1
  && networkKeys[0] === 'instagram'
);

export const FIRST_COMMENT_NETWORK_KEYS = ['facebook', 'instagram'];

export const canUseFirstCommentForNetworks = (networkKeys = []) => (
  networkKeys.some((networkKey) => FIRST_COMMENT_NETWORK_KEYS.includes(networkKey))
);

export const IMAGE_UPLOAD_NETWORK_KEYS = ['facebook', 'instagram', 'threads'];

export const canUploadImagesForNetworks = (networkKeys = []) => (
  networkKeys.length > 0
  && networkKeys.every((networkKey) => IMAGE_UPLOAD_NETWORK_KEYS.includes(networkKey))
);

export const getEffectiveActiveNetwork = (activeNetwork, networkKeys) => (
  networkKeys.includes(activeNetwork) ? activeNetwork : networkKeys[0] || 'facebook'
);

export const getCaptionForNetwork = ({ activeNetwork, captions, mode }) => (
  mode === 'per_network'
    ? captions[activeNetwork] ?? captions.all ?? ''
    : captions.all || ''
);

export const getMediaContentType = (media) => {
  const hasImage = media.some((item) => item.type === 'image');
  const hasVideo = media.some((item) => item.type === 'video');

  if (hasImage && hasVideo) return 'mixed';
  if (hasVideo) return 'video';
  if (hasImage) return 'image';
  return 'empty';
};

export const getActiveScheduledTimes = ({
  mode,
  networkKeys,
  scheduleByNetwork,
  scheduledTimes,
}) => {
  const shouldUseNetworkSchedule = mode === 'per_network'
    && networkKeys.length > 1
    && scheduleByNetwork;

  return shouldUseNetworkSchedule
    ? scheduledTimes.slice(0, Math.max(networkKeys.length, 1))
    : scheduledTimes;
};

export const getScheduleActionState = ({
  isDraft,
  mode,
  networkKeys,
  scheduleByNetwork,
  scheduleMode,
  scheduledTimes,
}) => {
  const scheduleLabel = isDraft
    ? (mode === 'per_network' && networkKeys.length > 1 ? 'Save all' : 'Save')
    : mode === 'per_network' && networkKeys.length > 1 ? 'Schedule all' : 'Schedule';
  const activeScheduledTimes = getActiveScheduledTimes({
    mode,
    networkKeys,
    scheduleByNetwork,
    scheduledTimes,
  });
  const scheduleNeedsTime = !isDraft
    && scheduleMode === 'specific'
    && activeScheduledTimes.some((time) => !time?.date || !time?.time);

  return {
    activeScheduledTimes,
    scheduleLabel,
    scheduleNeedsTime,
  };
};
