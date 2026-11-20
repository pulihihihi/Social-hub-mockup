import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  appendMediaItem,
  collapsePerNetworkMedia,
  collapsePerNetworkCaptions,
  fillPerNetworkMedia,
  fillPerNetworkCaptions,
  hasComposerChanges,
  removeMediaItem,
  reorderMediaItem,
} from './composerState';
import { canUseFirstCommentForNetworks } from './publishingComposerUtils';

const getDefaultSelectedChannelIds = (channels = []) => (
  channels
    .filter((channel) => !channel.disabled)
    .map((channel) => channel.id)
);

export const usePublishingComposerState = ({
  channels,
  defaultVideoDetails,
  getEffectiveActiveNetwork,
  getMediaContentType,
  getNetworkKeysForChannels,
  makeInitialCaptions,
  networkOrder,
  notifyInfo,
}) => {
  const [selectedChannelIds, setSelectedChannelIds] = useState(
    () => getDefaultSelectedChannelIds(channels),
  );
  const [mode, setMode] = useState('all_networks');
  const [activeNetwork, setActiveNetwork] = useState('facebook');
  const [captions, setCaptions] = useState(makeInitialCaptions);
  const [sharedMedia, setSharedMedia] = useState([]);
  const [mediaByNetwork, setMediaByNetwork] = useState({});
  const [firstComments, setFirstComments] = useState({ all: '' });
  const [isDraft, setIsDraft] = useState(false);
  const [isStory, setIsStory] = useState(false);
  const [rightTab, setRightTab] = useState('preview');
  const [labels, setLabels] = useState([]);
  const [approvalWorkflow, setApprovalWorkflow] = useState(null);
  const [mobilePublisher, setMobilePublisher] = useState(null);
  const [scheduleMode, setScheduleMode] = useState('specific');
  const [scheduleByNetwork, setScheduleByNetwork] = useState(false);
  const [scheduledTimes, setScheduledTimes] = useState([{ date: null, time: null }]);
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeAudience, setYoutubeAudience] = useState('not-made-for-kids');
  const [videoDetails, setVideoDetails] = useState(defaultVideoDetails);
  const [sourcePicker, setSourcePicker] = useState({ open: false, sourceKey: 'assetLibrary' });
  const [videoOptionsOpen, setVideoOptionsOpen] = useState(false);
  const [aiActionKey, setAiActionKey] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [resourcePanelKey, setResourcePanelKey] = useState(null);
  const availableChannelIds = useMemo(() => new Set(channels.map((channel) => channel.id)), [channels]);

  useEffect(() => {
    setSelectedChannelIds((currentIds) => {
      const nextIds = currentIds.filter((channelId) => availableChannelIds.has(channelId));

      if (nextIds.length === currentIds.length) {
        return currentIds;
      }

      if (nextIds.length) {
        return nextIds;
      }

      if (!currentIds.length) {
        return currentIds;
      }

      return getDefaultSelectedChannelIds(channels);
    });
  }, [availableChannelIds, channels]);

  const selectedChannels = useMemo(
    () => channels.filter((channel) => selectedChannelIds.includes(channel.id)),
    [channels, selectedChannelIds],
  );
  const selectedNetworkKeys = useMemo(
    () => getNetworkKeysForChannels(selectedChannels),
    [getNetworkKeysForChannels, selectedChannels],
  );
  const effectiveActiveNetwork = getEffectiveActiveNetwork(activeNetwork, selectedNetworkKeys);
  const media = useMemo(() => (
    mode === 'per_network'
      ? mediaByNetwork[effectiveActiveNetwork] || []
      : sharedMedia
  ), [effectiveActiveNetwork, mediaByNetwork, mode, sharedMedia]);
  const mediaByNetworkForPreview = useMemo(() => {
    if (mode !== 'per_network') {
      return null;
    }

    return selectedNetworkKeys.reduce((accumulator, networkKey) => {
      accumulator[networkKey] = mediaByNetwork[networkKey] || [];
      return accumulator;
    }, {});
  }, [mediaByNetwork, mode, selectedNetworkKeys]);
  const allMediaForChanges = useMemo(() => (
    mode === 'per_network'
      ? selectedNetworkKeys.flatMap((networkKey) => mediaByNetwork[networkKey] || [])
      : sharedMedia
  ), [mediaByNetwork, mode, selectedNetworkKeys, sharedMedia]);
  const firstComment = mode === 'per_network'
    ? firstComments[effectiveActiveNetwork] ?? ''
    : firstComments.all ?? '';
  const firstCommentForChanges = mode === 'per_network'
    ? selectedNetworkKeys.map((networkKey) => firstComments[networkKey] || '').join('')
    : firstComments.all ?? '';
  const hasVideo = media.some((item) => item.type === 'video');
  const contentType = getMediaContentType(media);
  const shouldRenderStandaloneFirstComment =
    !isStory && (
      (mode === 'all_networks' && canUseFirstCommentForNetworks(selectedNetworkKeys))
      || (mode === 'per_network' && effectiveActiveNetwork === 'facebook')
    );

  useEffect(() => {
    if (!selectedNetworkKeys.length) {
      if (mode === 'per_network') {
        setMode('all_networks');
      }

      if (activeNetwork !== 'facebook') {
        setActiveNetwork('facebook');
      }

      if (scheduleByNetwork) {
        setScheduleByNetwork(false);
      }

      return;
    }

    if (!selectedNetworkKeys.includes(activeNetwork)) {
      setActiveNetwork(selectedNetworkKeys[0]);
    }

    if (scheduleByNetwork && selectedNetworkKeys.length <= 1) {
      setScheduleByNetwork(false);
    }
  }, [activeNetwork, mode, scheduleByNetwork, selectedNetworkKeys]);

  const updateScopedMedia = useCallback((updater) => {
    if (mode === 'per_network') {
      setMediaByNetwork((current) => {
        const currentMedia = current[effectiveActiveNetwork] || [];
        const nextMedia = updater(currentMedia);

        if (nextMedia === currentMedia) {
          return current;
        }

        return {
          ...current,
          [effectiveActiveNetwork]: nextMedia,
        };
      });
      return;
    }

    setSharedMedia(updater);
  }, [effectiveActiveNetwork, mode]);

  const addMedia = useCallback((type = 'image', label = null, asset = null) => {
    const scopeKey = mode === 'per_network' ? effectiveActiveNetwork : 'all';

    updateScopedMedia((currentMedia) => {
      const result = appendMediaItem(currentMedia, {
        asset,
        createId: () => `${scopeKey}-media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label,
        type,
      });

      if (result.rejected) {
        notifyInfo?.('Up to 5 media items can be attached.');
      }

      return result.media;
    });
  }, [effectiveActiveNetwork, mode, notifyInfo, updateScopedMedia]);

  const removeMedia = useCallback((mediaId) => {
    updateScopedMedia((currentMedia) => removeMediaItem(currentMedia, mediaId));
  }, [updateScopedMedia]);

  const reorderMedia = useCallback((sourceMediaId, targetMediaId) => {
    updateScopedMedia((currentMedia) => reorderMediaItem(currentMedia, sourceMediaId, targetMediaId));
  }, [updateScopedMedia]);

  const updateVideoDetails = useCallback((patch) => {
    setVideoDetails((current) => ({ ...current, ...patch }));
  }, []);

  const updateCaption = useCallback((key, value) => {
    setCaptions((current) => ({ ...current, [key]: value }));
  }, []);

  const updateFirstComment = useCallback((value) => {
    const commentKey = mode === 'per_network' ? effectiveActiveNetwork : 'all';

    setFirstComments((current) => ({ ...current, [commentKey]: value }));
  }, [effectiveActiveNetwork, mode]);

  const togglePerNetworkMode = useCallback(() => {
    if (!selectedNetworkKeys.length) {
      return;
    }

    if (mode === 'per_network') {
      setCaptions((current) => collapsePerNetworkCaptions({
        activeNetwork: effectiveActiveNetwork,
        captions: current,
      }));
      setFirstComments((current) => ({
        ...current,
        all: current[effectiveActiveNetwork] ?? current.all ?? '',
      }));
      setSharedMedia((currentSharedMedia) => collapsePerNetworkMedia({
        activeNetwork: effectiveActiveNetwork,
        mediaByNetwork,
        sharedMedia: currentSharedMedia,
      }));
      setMode('all_networks');
      return;
    }

    setCaptions((current) => fillPerNetworkCaptions({
      captions: current,
      networkKeys: selectedNetworkKeys,
    }));
    setFirstComments((current) => {
      const nextComments = { ...current };

      selectedNetworkKeys.forEach((networkKey) => {
        if (nextComments[networkKey] === undefined) {
          nextComments[networkKey] = current.all ?? '';
        }
      });

      return nextComments;
    });
    setMediaByNetwork((current) => fillPerNetworkMedia({
      mediaByNetwork: current,
      networkKeys: selectedNetworkKeys,
      sharedMedia,
    }));
    setActiveNetwork((current) => (
      selectedNetworkKeys.includes(current) ? current : selectedNetworkKeys[0]
    ));
    setMode('per_network');
  }, [effectiveActiveNetwork, mediaByNetwork, mode, selectedNetworkKeys, sharedMedia]);

  const openSourcePicker = useCallback((sourceKey) => {
    setSourcePicker({ open: true, sourceKey });
  }, []);

  const handleSourcePickerCancel = useCallback((nextSourceKey) => {
    if (typeof nextSourceKey === 'string') {
      setSourcePicker({ open: true, sourceKey: nextSourceKey });
      return;
    }

    setSourcePicker((current) => ({ ...current, open: false }));
  }, []);

  const sendToAiAssist = useCallback((actionKey) => {
    setAiActionKey(actionKey);
    setRightTab('ai');
  }, []);

  const hasChanges = hasComposerChanges({
    approvalWorkflow,
    captions,
    defaultVideoDetails,
    firstComment: firstCommentForChanges,
    isDraft,
    isStory,
    labels,
    media: allMediaForChanges,
    mobilePublisher,
    mode,
    networkOrder,
    scheduleByNetwork,
    scheduleMode,
    scheduledTimes,
    videoDetails,
    youtubeAudience,
    youtubeTitle,
  });

  return {
    activeNetwork,
    addMedia,
    aiActionKey,
    approvalWorkflow,
    captions,
    contentType,
    effectiveActiveNetwork,
    firstComment,
    handleSourcePickerCancel,
    hasChanges,
    hasVideo,
    isDraft,
    isStory,
    labels,
    media,
    mediaByNetwork: mediaByNetworkForPreview,
    mobilePublisher,
    mode,
    openSourcePicker,
    removeMedia,
    reorderMedia,
    resourcePanelKey,
    rightTab,
    scheduleByNetwork,
    scheduleMode,
    scheduledTimes,
    selectedChannelIds,
    selectedChannels,
    selectedNetworkKeys,
    sendToAiAssist,
    setActiveNetwork,
    setAiActionKey,
    setApprovalWorkflow,
    setFirstComment: updateFirstComment,
    setIsDraft,
    setIsStory,
    setLabels,
    setMobilePublisher,
    setResourcePanelKey,
    setRightTab,
    setScheduleByNetwork,
    setScheduleMode,
    setScheduledTimes,
    setSelectedChannelIds,
    setShowExitConfirm,
    setSourcePicker,
    setVideoOptionsOpen,
    setYoutubeAudience,
    setYoutubeTitle,
    shouldRenderStandaloneFirstComment,
    showExitConfirm,
    sourcePicker,
    togglePerNetworkMode,
    updateCaption,
    updateVideoDetails,
    videoDetails,
    videoOptionsOpen,
    youtubeAudience,
    youtubeTitle,
  };
};

export default usePublishingComposerState;
