import {
  Button,
  Dropdown,
  Modal,
  Segmented,
  Space,
  Typography,
  message,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
  CloseOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import usePageTopBar from '../../app/layout/usePageTopBar';
import { SparkleIco } from '../../components/icons';
import { T } from '../../theme';
import { AiAssistPanel } from './PublishingAssistantPanel';
import { ChannelSelector } from './PublishingChannelSelector';
import { ComposerEditor } from './PublishingComposerEditor';
import { FirstCommentSection } from './PublishingFirstCommentSection';
import { FirstCommentAssetAddView } from './PublishingFirstCommentAssetView';
import { AssetSourcePicker, VideoOptionsModal } from './PublishingMediaModals';
import { PublishingOptions } from './PublishingOptions';
import { NetworkPreview } from './PublishingPreview';
import PublishingResourcePanel from './PublishingResourcePanel';
import { TooltipTarget } from './PublishingTooltip';
import {
  ASSET_LIBRARY_ITEMS,
  ASSET_SOURCE_META,
  DEFAULT_VIDEO_DETAILS,
  NEW_POST_TOOLTIPS,
} from './publishingComposerConfig';
import { useChannelGroup } from '../../app/providers/useChannelGroup';
import { useAiAssetStore } from '../../features/ai-assets/aiAssetStoreHooks';
import { useManagedApprovalWorkflows, getApprovalWorkflowOptions } from '../../data/approvalWorkflowStore';
import { useManagedTagCollections } from '../../data/tagManagementStore';
import { useManagedUsers, getMobilePublisherOptions } from '../../data/userManagement';
import {
  canUseInstagramStory,
  getEffectiveActiveNetwork,
  getMediaContentType,
  getNetworkKeysForChannels,
  getScheduleActionState,
  makeInitialCaptions,
  networkOrder,
} from './publishingComposerUtils';
import { usePublishingComposerState } from './usePublishingComposerState';
import {
  getNewPostAiPresetSectionKeys,
  NEW_POST_AI_DEFAULT_SECTION_KEYS,
} from '../../features/ai-assist/newPostAiRegistry';
import { resolveNewPostAiConfig } from '../../features/ai-assist/newPostAiConfigResolver';
import { applyAiPatch, createComposerSnapshot } from '../../features/ai-assist/newPostAiPatches';
import { runNewPostAiAssist } from '../../features/ai-assist/newPostAiRunner';
import './PublishingNewPost.css';

const { Text, Title } = Typography;

const scheduleMenuItems = [
  { key: 'draft', label: 'Save as Draft' },
  { key: 'queue', label: 'Add to Queue' },
  { key: 'approval', label: 'Send for Approval' },
];

const scheduleActionMessages = {
  draft: 'Draft saved.',
  queue: 'Post added to queue.',
  approval: 'Post sent for approval.',
};

const unique = (values = []) => Array.from(new Set(values.filter(Boolean)));

const haveSameKeys = (left = [], right = []) => (
  left.length === right.length && left.every((value, index) => value === right[index])
);

const PublishingNewPost = () => {
  const navigate = useNavigate();
  const [assetLibraryDraft, setAssetLibraryDraft] = useState(null);
  const [selectedVideoOptionsId, setSelectedVideoOptionsId] = useState(null);
  const [showCustomizeNetworkConfirm, setShowCustomizeNetworkConfirm] = useState(false);
  const {
    activeChannelIds,
    activeChannelGroupId,
    activeChannels,
    channelGroups,
  } = useChannelGroup();
  const activeChannelGroups = useMemo(
    () => channelGroups
      .filter((group) => String(group.id) === String(activeChannelGroupId))
      .map((group) => ({
        ...group,
        channelIds: group.channelIds.filter((channelId) => activeChannelIds.includes(channelId)),
      })),
    [activeChannelGroupId, activeChannelIds, channelGroups],
  );
  const [approvalWorkflows] = useManagedApprovalWorkflows();
  const [managedUsers] = useManagedUsers();
  const [managedTagCollections] = useManagedTagCollections();
  const { knowledge: aiKnowledge, skills: aiSkills } = useAiAssetStore();
  const [aiAssistBusy, setAiAssistBusy] = useState(false);
  const [aiAssistResults, setAiAssistResults] = useState([]);
  const [aiSelectedSectionKeys, setAiSelectedSectionKeys] = useState(NEW_POST_AI_DEFAULT_SECTION_KEYS);
  const {
    addMedia,
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
    mediaByNetwork,
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
    setActiveNetwork,
    setApprovalWorkflow,
    setFirstComment,
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
  } = usePublishingComposerState({
    channels: activeChannels,
    defaultVideoDetails: DEFAULT_VIDEO_DETAILS,
    getEffectiveActiveNetwork,
    getMediaContentType,
    getNetworkKeysForChannels,
    makeInitialCaptions,
    networkOrder,
    notifyInfo: message.info,
  });
  const workflowOptions = useMemo(
    () => getApprovalWorkflowOptions(approvalWorkflows),
    [approvalWorkflows],
  );
  const publisherOptions = useMemo(
    () => getMobilePublisherOptions(managedUsers),
    [managedUsers],
  );
  const allComposerMedia = useMemo(
    () => (mode === 'per_network'
      ? Object.values(mediaByNetwork || {}).flat()
      : media),
    [media, mediaByNetwork, mode],
  );
  const hasAiContextMedia = allComposerMedia.length > 0;
  const aiPanelContext = useMemo(() => ({
    hasImage: allComposerMedia.some((item) => item.type === 'image'),
    hasVideo: allComposerMedia.some((item) => item.type === 'video'),
    selectedNetworks: selectedNetworkKeys,
    supportsStandaloneFirstComment: shouldRenderStandaloneFirstComment,
  }), [allComposerMedia, selectedNetworkKeys, shouldRenderStandaloneFirstComment]);
  const aiResolvedConfig = useMemo(
    () => resolveNewPostAiConfig({
      context: aiPanelContext,
      knowledge: aiKnowledge,
      sectionKeys: NEW_POST_AI_DEFAULT_SECTION_KEYS,
      skills: aiSkills,
    }),
    [aiKnowledge, aiPanelContext, aiSkills],
  );
  const aiSections = useMemo(
    () => aiResolvedConfig.sections.filter((section) => section.isRelevant !== false),
    [aiResolvedConfig],
  );
  const aiDefaultSelection = useMemo(
    () => getNewPostAiPresetSectionKeys('publish-ready', aiSections),
    [aiSections],
  );
  const aiAllowedSectionKeys = useMemo(
    () => new Set(aiSections.map((section) => section.key)),
    [aiSections],
  );
  const sanitizedSelectedSectionKeys = useMemo(
    () => unique(aiSelectedSectionKeys.filter((sectionKey) => aiAllowedSectionKeys.has(sectionKey))),
    [aiAllowedSectionKeys, aiSelectedSectionKeys],
  );
  const composerSnapshot = useMemo(
    () => createComposerSnapshot({
      activeNetwork: effectiveActiveNetwork,
      approvalWorkflow,
      captions,
      firstComment,
      labels,
      mobilePublisher,
      mode,
      scheduleByNetwork,
      scheduleMode,
      scheduledTimes,
      videoDetails,
      youtubeAudience,
      youtubeTitle,
    }),
    [
      approvalWorkflow,
      captions,
      effectiveActiveNetwork,
      firstComment,
      labels,
      mobilePublisher,
      mode,
      scheduleByNetwork,
      scheduleMode,
      scheduledTimes,
      videoDetails,
      youtubeAudience,
      youtubeTitle,
    ],
  );
  useEffect(() => {
    setAiSelectedSectionKeys((currentKeys) => {
      const nextKeys = unique(currentKeys.filter((sectionKey) => aiAllowedSectionKeys.has(sectionKey)));

      if (nextKeys.length) {
        return haveSameKeys(nextKeys, currentKeys) ? currentKeys : nextKeys;
      }

      return haveSameKeys(aiDefaultSelection, currentKeys) ? currentKeys : aiDefaultSelection;
    });
  }, [aiAllowedSectionKeys, aiDefaultSelection]);
  const applyComposerAiPatch = (patch) => {
    const nextSnapshot = applyAiPatch(composerSnapshot, patch);

    if (patch.captions) {
      Object.entries(nextSnapshot.captions).forEach(([key, value]) => {
        if (captions[key] !== value) {
          updateCaption(key, value);
        }
      });
    }

    if ('firstComment' in patch && nextSnapshot.firstComment !== firstComment) {
      setFirstComment(nextSnapshot.firstComment);
    }

    if ('labels' in patch) {
      setLabels(nextSnapshot.labels);
    }

    if ('approvalWorkflow' in patch) {
      setApprovalWorkflow(nextSnapshot.approvalWorkflow);
    }

    if ('mobilePublisher' in patch) {
      setMobilePublisher(nextSnapshot.mobilePublisher);
    }

    if ('scheduleByNetwork' in patch) {
      setScheduleByNetwork(nextSnapshot.scheduleByNetwork);
    }

    if ('scheduleMode' in patch) {
      setScheduleMode(nextSnapshot.scheduleMode);
    }

    if ('scheduledTimes' in patch) {
      setScheduledTimes(nextSnapshot.scheduledTimes);
    }

    if ('youtubeTitle' in patch) {
      setYoutubeTitle(nextSnapshot.youtubeTitle);
    }

    if ('youtubeAudience' in patch) {
      setYoutubeAudience(nextSnapshot.youtubeAudience);
    }

    if (patch.videoDetails) {
      updateVideoDetails(patch.videoDetails);
    }
  };
  const openAiAssist = (sectionKeys = aiDefaultSelection) => {
    const nextKeys = unique((sectionKeys.length ? sectionKeys : aiDefaultSelection)
      .filter((sectionKey) => aiAllowedSectionKeys.has(sectionKey)));

    setAiSelectedSectionKeys(nextKeys.length ? nextKeys : aiDefaultSelection);
    setRightTab('ai');
  };
  const runAiAssist = (sectionKeys = sanitizedSelectedSectionKeys, refinementPrompt = '') => {
    if (!hasAiContextMedia || !sectionKeys.length) {
      return;
    }

    setAiAssistBusy(true);
    const resolvedConfig = resolveNewPostAiConfig({
      context: aiPanelContext,
      knowledge: aiKnowledge,
      sectionKeys,
      skills: aiSkills,
    });
    const result = runNewPostAiAssist({
      context: {
        ...composerSnapshot,
        isDraft,
        media: allComposerMedia,
        publisherOptions,
        scheduleByNetwork,
        scheduleMode,
        scheduledTimes,
        selectedChannels,
        selectedNetworks: selectedNetworkKeys,
        tagCollections: managedTagCollections,
        workflowOptions,
      },
      resolvedConfig,
      selectedSectionKeys: sectionKeys,
      refinementPrompt,
    });

    result.sections.forEach((sectionResult) => {
      if (sectionResult.status === 'applied' && sectionResult.patch) {
        applyComposerAiPatch(sectionResult.patch);
      }
    });

    setAiAssistResults(result.sections);
    setAiSelectedSectionKeys(sectionKeys);
    setRightTab('ai');
    setAiAssistBusy(false);
  };
  const regenerateAiSection = (sectionKey, refinementPrompt = '') => {
    if (!hasAiContextMedia) {
      return;
    }

    const resolvedConfig = resolveNewPostAiConfig({
      context: aiPanelContext,
      knowledge: aiKnowledge,
      sectionKeys: [sectionKey],
      skills: aiSkills,
    });
    const result = runNewPostAiAssist({
      context: {
        ...composerSnapshot,
        isDraft,
        media: allComposerMedia,
        publisherOptions,
        scheduleByNetwork,
        scheduleMode,
        scheduledTimes,
        selectedChannels,
        selectedNetworks: selectedNetworkKeys,
        tagCollections: managedTagCollections,
        workflowOptions,
      },
      resolvedConfig,
      selectedSectionKeys: [sectionKey],
      refinementPrompt,
    });

    result.sections.forEach((sectionResult) => {
      if (sectionResult.status === 'applied' && sectionResult.patch) {
        applyComposerAiPatch(sectionResult.patch);
      }
    });

    setAiAssistResults((currentResults) => {
      const currentByKey = new Map(currentResults.map((item) => [item.key, item]));
      result.sections.forEach((item) => currentByKey.set(item.key, item));
      return Array.from(currentByKey.values());
    });
  };
  const applyAiSectionResult = (sectionKey) => {
    const target = aiAssistResults.find((result) => result.key === sectionKey);
    if (!target?.patch) {
      return;
    }

    applyComposerAiPatch(target.patch);
    setAiAssistResults((currentResults) => currentResults.map((result) => (
      result.key === sectionKey ? { ...result, status: 'applied' } : result
    )));
  };
  const applyAiResultSet = (sectionKeys = []) => {
    const targetKeys = new Set(sectionKeys);

    if (!targetKeys.size) {
      return;
    }

    setAiAssistResults((currentResults) => currentResults.map((result) => {
      if (!targetKeys.has(result.key) || !result.patch || result.status === 'applied') {
        return result;
      }

      applyComposerAiPatch(result.patch);
      return { ...result, status: 'applied' };
    }));
  };
  const applySelectedAiResults = () => {
    applyAiResultSet(sanitizedSelectedSectionKeys);
  };
  const applyAllAiResults = () => {
    applyAiResultSet(aiAssistResults.map((result) => result.key));
  };
  const clearAiSession = () => {
    setAiAssistResults([]);
    setAiSelectedSectionKeys(aiDefaultSelection);
  };
  const { scheduleLabel, scheduleNeedsTime } = getScheduleActionState({
    isDraft,
    mode,
    networkKeys: selectedNetworkKeys,
    scheduleByNetwork,
    scheduleMode,
    scheduledTimes,
  });
  const canUseStory = canUseInstagramStory({
    networkKeys: selectedNetworkKeys,
    selectedChannels,
  });
  const selectedVideoForOptions = useMemo(
    () => media.find((item) => item.type === 'video' && item.id === selectedVideoOptionsId)
      || media.find((item) => item.type === 'video')
      || null,
    [media, selectedVideoOptionsId],
  );
  const scheduleButtonTooltip = scheduleNeedsTime ? NEW_POST_TOOLTIPS.scheduleTime : null;
  const handleScheduleMenuClick = ({ key }) => {
    message.success(scheduleActionMessages[key] || `${scheduleLabel} action is ready.`);
  };
  const handlePrimarySchedule = () => {
    message.success(isDraft ? 'Draft saved.' : `${scheduleLabel} action is ready.`);
  };
  const handleSaveFirstCommentToAssetLibrary = (value) => {
    if (!value?.trim()) {
      message.warning('Enter a first comment before saving to Asset Library.');
      return;
    }

    setAssetLibraryDraft({
      text: value,
    });
  };
  const closeAssetAddView = () => {
    setAssetLibraryDraft(null);
  };
  const handleAddFirstCommentAsset = () => {
    message.success('Asset added to Asset Library.');
    setAssetLibraryDraft(null);
  };
  const requestClose = () => {
    if (hasChanges) {
      setShowExitConfirm(true);
      return;
    }

    navigate('/publishing/calendar');
  };
  const requestCustomizePerNetwork = () => {
    setShowCustomizeNetworkConfirm(true);
  };
  const confirmCustomizePerNetwork = () => {
    setShowCustomizeNetworkConfirm(false);
    togglePerNetworkMode();
  };
  const customizeNetworkConfirm = mode === 'all_networks'
    ? {
      body: 'Switching to per-network editing can reset shared configuration from the All Networks view. Review your settings before continuing.',
      title: 'Customize post per network?',
    }
    : {
      body: 'Switching back to one shared post can reset per-network configuration. Review your settings before continuing.',
      title: 'Use same post across networks?',
    };

  const topBarPortal = usePageTopBar(
    assetLibraryDraft ? (
      <div className="publishing-new-post-asset-topbar">
        <Title level={4}>Add Asset</Title>
        <Space size={8}>
          <Text className="publishing-new-post-asset-esc">esc</Text>
          <Button type="text" onClick={closeAssetAddView}>to go back</Button>
          <Button aria-label="Close add asset" type="text" icon={<CloseOutlined />} onClick={closeAssetAddView} />
        </Space>
      </div>
    ) : (
      <div className={isDraft ? 'publishing-new-post-topbar is-draft' : 'publishing-new-post-topbar'}>
        <Title level={4}>{isDraft ? 'New Draft' : 'New Post'}</Title>
        <Space size={4}>
          <TooltipTarget title="Minimize composer">
            <Button type="text" icon={<MinusOutlined />} aria-label="Minimize composer" />
          </TooltipTarget>
          <TooltipTarget title="Close composer">
            <Button type="text" icon={<CloseOutlined />} aria-label="Close composer" onClick={requestClose} />
          </TooltipTarget>
        </Space>
      </div>
    ),
  );

  if (assetLibraryDraft) {
    return (
      <>
        {topBarPortal}
        <FirstCommentAssetAddView
          initialText={assetLibraryDraft.text}
          onAddAsset={handleAddFirstCommentAsset}
          onBack={closeAssetAddView}
        />
      </>
    );
  }

  return (
    <>
      {topBarPortal}
      <div className="publishing-new-post-page">
        <aside className="publishing-new-post-left">
          <div className="publishing-new-post-scroll">
            <ChannelSelector
              selectedChannelIds={selectedChannelIds}
              onChange={setSelectedChannelIds}
              channels={activeChannels}
              channelGroups={activeChannelGroups}
            />
            <ComposerEditor
              activeNetwork={effectiveActiveNetwork}
              availableNetworkKeys={selectedNetworkKeys}
              captions={captions}
              canUseStory={canUseStory}
              isDraft={isDraft}
              isStory={isStory}
              media={media}
              mediaByNetwork={mediaByNetwork}
              mode={mode}
              onAddMedia={addMedia}
              onAiAssist={openAiAssist}
              onCaptionChange={updateCaption}
              onCustomize={requestCustomizePerNetwork}
              onDraftChange={setIsDraft}
              onStoryChange={setIsStory}
              onNetworkChange={setActiveNetwork}
              onOpenSource={openSourcePicker}
              onOpenVideoOptions={(videoId) => {
                setSelectedVideoOptionsId(videoId || null);
                setVideoOptionsOpen(true);
              }}
              onRemoveMedia={removeMedia}
              onReorderMedia={reorderMedia}
              videoDetails={videoDetails}
              youtubeAudience={youtubeAudience}
              youtubeTitle={youtubeTitle}
            />

            {shouldRenderStandaloneFirstComment ? (
              <FirstCommentSection
                activeNetwork={effectiveActiveNetwork}
                firstComment={firstComment}
                mode={mode}
                onAiAssist={() => openAiAssist(['firstComment'])}
                onChange={setFirstComment}
                onSaveToAssetLibrary={handleSaveFirstCommentToAssetLibrary}
              />
            ) : null}

            <PublishingOptions
              activeNetwork={effectiveActiveNetwork}
              approvalWorkflow={approvalWorkflow}
              contentType={contentType}
              firstComment={firstComment}
              hasVideo={hasVideo}
              isDraft={isDraft}
              isStory={isStory}
              labels={labels}
              media={media}
              mobilePublisher={mobilePublisher}
              mode={mode}
              networkKeys={selectedNetworkKeys}
              onAiAssist={openAiAssist}
              onFirstCommentChange={setFirstComment}
              onOpenResource={setResourcePanelKey}
              onSaveFirstCommentToAssetLibrary={handleSaveFirstCommentToAssetLibrary}
              scheduleByNetwork={scheduleByNetwork}
              scheduleMode={scheduleMode}
              scheduledTimes={scheduledTimes}
              selectedChannels={selectedChannels}
              setApprovalWorkflow={setApprovalWorkflow}
              setLabels={setLabels}
              setMobilePublisher={setMobilePublisher}
              onVideoDetailsChange={updateVideoDetails}
              setScheduleByNetwork={setScheduleByNetwork}
              setScheduleMode={setScheduleMode}
              setScheduledTimes={setScheduledTimes}
              setYoutubeAudience={setYoutubeAudience}
              setYoutubeTitle={setYoutubeTitle}
              videoDetails={videoDetails}
              youtubeAudience={youtubeAudience}
              youtubeTitle={youtubeTitle}
            />
          </div>
          <div className="publishing-new-post-footer">
            <TooltipTarget title={scheduleButtonTooltip}>
              <Dropdown.Button
                type="primary"
                disabled={scheduleNeedsTime}
                menu={{
                  items: scheduleMenuItems,
                  onClick: handleScheduleMenuClick,
                }}
                icon={<DownOutlined />}
                onClick={handlePrimarySchedule}
              >
                {scheduleLabel}
              </Dropdown.Button>
            </TooltipTarget>
          </div>
        </aside>

        <aside className="publishing-new-post-right">
          <div className="publishing-new-post-right-tabs">
            <Segmented
              block
              className="publishing-new-post-right-tabs-segmented"
              value={rightTab}
              onChange={setRightTab}
              options={[
                {
                  value: 'preview',
                  label: (
                    <span className="publishing-new-post-segment-label">
                      <EyeOutlined />
                      Network Preview
                    </span>
                  ),
                },
                {
                  value: 'ai',
                  label: (
                    <span className="publishing-new-post-segment-label">
                      <SparkleIco s={14} color={rightTab === 'ai' ? T.colorPrimary : T.colorTextSecondary} />
                      AI Assist
                    </span>
                  ),
                },
              ]}
            />
          </div>
          {rightTab === 'preview' ? (
            <NetworkPreview
              activeNetwork={effectiveActiveNetwork}
              captions={captions}
              firstComment={firstComment}
              media={media}
              mediaByNetwork={mediaByNetwork}
              mode={mode}
              networkKeys={selectedNetworkKeys}
              selectedChannels={selectedChannels}
              videoDetails={videoDetails}
              youtubeTitle={youtubeTitle}
            />
          ) : (
            <AiAssistPanel
              busy={aiAssistBusy}
              hasMedia={hasAiContextMedia}
              onApplyAll={applyAllAiResults}
              onApplyResult={applyAiSectionResult}
              onApplySelected={applySelectedAiResults}
              onClearSession={clearAiSession}
              onRegenerateSection={regenerateAiSection}
              onRunAssist={runAiAssist}
              onSelectionChange={setAiSelectedSectionKeys}
              results={aiAssistResults}
              sections={aiSections}
              selectedSectionKeys={sanitizedSelectedSectionKeys}
            />
          )}
        </aside>
      </div>
      <AssetSourcePicker
        assetItems={ASSET_LIBRARY_ITEMS}
        open={sourcePicker.open}
        sourceMeta={ASSET_SOURCE_META}
        sourceKey={sourcePicker.sourceKey}
        onAddMedia={addMedia}
        onCancel={handleSourcePickerCancel}
      />
      <VideoOptionsModal
        open={videoOptionsOpen}
        onCancel={() => setVideoOptionsOpen(false)}
        onSave={() => {
          setVideoOptionsOpen(false);
          message.success('Video options saved.');
        }}
        onVideoDetailsChange={updateVideoDetails}
        setYoutubeTitle={setYoutubeTitle}
        video={selectedVideoForOptions}
        videoDetails={videoDetails}
        youtubeTitle={youtubeTitle}
      />
      <PublishingResourcePanel
        activeKey={resourcePanelKey}
        onClose={() => setResourcePanelKey(null)}
        open={Boolean(resourcePanelKey)}
      />
      <Modal
        title={(
          <Space align="start" size={10}>
            <ExclamationCircleOutlined className="publishing-new-post-confirm-icon" />
            <span>{customizeNetworkConfirm.title}</span>
          </Space>
        )}
        open={showCustomizeNetworkConfirm}
        destroyOnHidden
        onCancel={() => setShowCustomizeNetworkConfirm(false)}
        footer={(
          <Space>
            <Button onClick={() => setShowCustomizeNetworkConfirm(false)}>Cancel</Button>
            <Button type="primary" onClick={confirmCustomizePerNetwork}>
              Continue
            </Button>
          </Space>
        )}
      >
        <Text>{customizeNetworkConfirm.body}</Text>
      </Modal>
      <Modal
        title="Discard post?"
        open={showExitConfirm}
        onCancel={() => setShowExitConfirm(false)}
        footer={(
          <Space>
            <Button onClick={() => setShowExitConfirm(false)}>Keep editing</Button>
            <Button danger type="primary" onClick={() => navigate('/publishing/calendar')}>
              Discard
            </Button>
          </Space>
        )}
      >
        <Text>You have unsaved changes in this post. Closing now will discard the current draft.</Text>
      </Modal>
    </>
  );
};

export default PublishingNewPost;
