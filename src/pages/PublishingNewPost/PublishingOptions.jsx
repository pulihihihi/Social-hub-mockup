import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Collapse,
  Select,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  describeApprovalWorkflow,
  getApprovalWorkflowById,
  getApprovalWorkflowOptions,
  useManagedApprovalWorkflows,
} from '../../data/approvalWorkflowStore';
import {
  getMobilePublisherOptions,
  getWorkflowApproverOptions,
  useManagedUsers,
} from '../../data/userManagement';
import { PlatformSpecificOptions } from './PublishingPlatformOptions';
import { TagsPickerPopover } from './PublishingTaxonomyPickers';
import {
  BRANDED_CONTENT_POLICY_URL,
  MOBILE_REMINDER_HELP_URL,
  YOUTUBE_TERMS_URL,
} from './publishingComposerConfig';
import { NewPostAiAssistActions } from './NewPostAiAssistActions';
import { getPublishingAssetValidationItems } from './publishingAssetRules';
import { getActiveScheduledTimes, getPlatformMeta } from './publishingComposerUtils';
import { PublishingScheduleHeader, PublishingScheduleSection } from './PublishingScheduleSection';
import { ValidationList } from './PublishingValidationList';

const { Text } = Typography;

export const PublishingOptions = ({
  activeNetwork,
  approvalWorkflow,
  contentType,
  firstComment,
  hasVideo,
  isDraft,
  isStory,
  labels,
  media = [],
  mobilePublisher,
  mode,
  networkKeys,
  onFirstCommentChange,
  onAiAssist,
  onOpenResource,
  onSaveFirstCommentToAssetLibrary,
  scheduleMode,
  scheduleByNetwork,
  scheduledTimes,
  selectedChannels = [],
  setApprovalWorkflow,
  setLabels,
  setMobilePublisher,
  setScheduleByNetwork,
  setScheduleMode,
  setScheduledTimes,
  setYoutubeAudience,
  setYoutubeTitle,
  onVideoDetailsChange,
  videoDetails,
  youtubeAudience,
  youtubeTitle,
}) => {
  const navigate = useNavigate();
  const [youtubeAdvancedOpen, setYoutubeAdvancedOpen] = useState(false);
  const [approvalWorkflows] = useManagedApprovalWorkflows();
  const [users] = useManagedUsers();
  const workflowOptions = useMemo(
    () => getApprovalWorkflowOptions(approvalWorkflows),
    [approvalWorkflows],
  );
  const workflowApproverOptions = useMemo(
    () => getWorkflowApproverOptions(users),
    [users],
  );
  const mobilePublisherOptions = useMemo(
    () => getMobilePublisherOptions(users),
    [users],
  );
  const hasVideoContent = useMemo(() => (
    hasVideo
    || contentType === 'video'
    || contentType === 'mixed'
    || media.some((item) => item.type === 'video')
  ), [contentType, hasVideo, media]);
  const selectedWorkflow = useMemo(
    () => getApprovalWorkflowById(approvalWorkflows, approvalWorkflow),
    [approvalWorkflow, approvalWorkflows],
  );
  const renderAiExtra = (sectionKeys, configLabel) => (
    <NewPostAiAssistActions
      configLabel={configLabel}
      onAiAssist={() => onAiAssist?.(sectionKeys)}
      primaryButtonType="link"
      sectionKeys={sectionKeys}
      size="small"
      stopPropagation
    />
  );
  const makePlatformItem = (networkKey, includeFirstComment = true) => PlatformSpecificOptions({
    activeNetwork: networkKey,
    firstComment,
    hasVideo: hasVideoContent,
    includeFirstComment,
    onFirstCommentChange,
    onOpenResource,
    onSaveFirstCommentToAssetLibrary,
    onVideoDetailsChange,
    onYoutubeAdvancedToggle: () => setYoutubeAdvancedOpen((current) => !current),
    setYoutubeAudience,
    setYoutubeTitle,
    videoDetails,
    youtubeAdvancedOpen,
    youtubeAudience,
    youtubeTitle,
  });
  const allNetworksOptionKeys = hasVideoContent
    ? ['facebook', 'instagram', 'threads', 'youtube', 'tiktok']
    : ['instagram', 'tiktok'];
  const platformItems = isStory
    ? []
    : mode === 'per_network'
      ? (networkKeys.includes(activeNetwork) ? [makePlatformItem(activeNetwork)].filter(Boolean) : [])
      : allNetworksOptionKeys
        .filter((networkKey) => networkKeys.includes(networkKey))
        .map((networkKey) => makePlatformItem(networkKey, false))
        .filter(Boolean);
  const platformItemsWithAi = platformItems.map((item) => {
    if (item.key === 'facebook-video') {
      return { ...item, extra: renderAiExtra(['facebookVideoOptions'], 'Facebook Video Options') };
    }

    if (item.key === 'instagram') {
      return { ...item, extra: renderAiExtra(['instagramOptions'], 'Instagram Options') };
    }

    if (item.key === 'threads-video') {
      return { ...item, extra: renderAiExtra(['threadsAltText', 'threadsOptions'], 'Threads Video Options') };
    }

    if (item.key === 'youtube-video') {
      return { ...item, extra: renderAiExtra(['youtubeTitle', 'youtubeTags', 'youtubeOptions'], 'YouTube Video Options') };
    }

    if (item.key === 'tiktok') {
      return { ...item, extra: renderAiExtra(['tiktokOptions'], 'TikTok Options') };
    }

    return item;
  });
  const activeScheduledTimes = getActiveScheduledTimes({
    mode,
    networkKeys,
    scheduleByNetwork,
    scheduledTimes,
  });
  const scheduleNeedsTime = scheduleMode === 'specific'
    && activeScheduledTimes.some((time) => !time?.date || !time?.time);
  const hasDisconnectedInstagram = selectedChannels.some((channel) => (
    channel.platform === 'instagram' && channel.disabled
  ));
  const hasDisconnectedYouTube = selectedChannels.some((channel) => (
    channel.platform === 'youtube' && channel.disabled
  ));
  const hasVerifiedFacebook = selectedChannels.some((channel) => (
    channel.platform === 'facebook' && channel.verified
  ));
  const validationNetworkKeys = mode === 'per_network' ? [activeNetwork] : networkKeys;
  const assetValidationItems = getPublishingAssetValidationItems({
    contentType,
    hasVideo: hasVideoContent,
    isDraft,
    media,
    networkKeys: validationNetworkKeys,
    youtubeAudience,
    youtubeTitle,
  });
  const validationItems = [
    ...assetValidationItems,
    networkKeys.includes('facebook') && hasVerifiedFacebook ? {
      key: 'facebook',
      type: 'warning',
      message: 'Facebook',
      description: (
        <>
          Reminder: Because you've selected a verified Facebook page, you may need to add a sponsor to this post to comply with Facebook's{' '}
          <a href={BRANDED_CONTENT_POLICY_URL} target="_blank" rel="noopener noreferrer">
            Branded Content policy
          </a>.
        </>
      ),
    } : null,
    networkKeys.includes('instagram') && hasDisconnectedInstagram ? {
      key: 'instagram-disconnected',
      type: 'error',
      message: 'Instagram',
      description: 'One or more of the selected channels are currently disconnected. Remove or reconnect them to publish content.',
    } : null,
    isStory && networkKeys.includes('instagram') ? {
      key: 'instagram-story-mobile-publisher',
      type: 'warning',
      message: 'Instagram',
      description: 'Editing this story post on your Sprout mobile app requires a mobile publisher.',
    } : null,
    networkKeys.includes('youtube') && hasDisconnectedYouTube ? {
      key: 'youtube-disconnected',
      type: 'error',
      message: 'YouTube',
      description: 'One or more of the selected channels are currently disconnected. Remove or reconnect them to publish content.',
    } : null,
    networkKeys.includes('youtube') ? {
      key: 'youtube-certification',
      type: 'warning',
      message: 'YouTube',
      description: (
        <>
          By saving this post, you certify that the content you are uploading complies with the YouTube Terms of Service (including the YouTube Community Guidelines) at{' '}
          <a href={YOUTUBE_TERMS_URL} target="_blank" rel="noopener noreferrer nofollow">
            {YOUTUBE_TERMS_URL}
          </a>. Please be sure not to violate others' copyright or privacy rights.
        </>
      ),
    } : null,
    !isDraft && scheduleNeedsTime ? {
      key: 'schedule-time',
      type: 'error',
      message: 'All Networks',
      description: 'Please choose a day or time to schedule this post.',
    } : null,
  ].filter(Boolean);
  const errorCount = validationItems.filter((item) => item.type === 'error').length;
  const warningCount = validationItems.filter((item) => item.type === 'warning').length;
  const validationLabel = [
    errorCount ? `${errorCount} ${errorCount === 1 ? 'error' : 'errors'}` : null,
    warningCount ? `${warningCount} ${warningCount === 1 ? 'warning' : 'warnings'}` : null,
  ].filter(Boolean).join(' and ') || 'No issues';
  const mobilePublisherNetworkLabels = ['instagram', 'tiktok']
    .filter((networkKey) => networkKeys.includes(networkKey))
    .map((networkKey) => getPlatformMeta(networkKey).label);
  const mobilePublisherNetworkCopy = mobilePublisherNetworkLabels.length > 1
    ? `${mobilePublisherNetworkLabels.slice(0, -1).join(', ')} and ${mobilePublisherNetworkLabels.at(-1)}`
    : mobilePublisherNetworkLabels[0] || 'Instagram and TikTok';

  useEffect(() => {
    if (approvalWorkflow && !selectedWorkflow?.enabled) {
      setApprovalWorkflow(null);
    }
  }, [approvalWorkflow, selectedWorkflow, setApprovalWorkflow]);

  useEffect(() => {
    if (mobilePublisher && !mobilePublisherOptions.some((option) => option.value === mobilePublisher)) {
      setMobilePublisher(null);
    }
  }, [mobilePublisher, mobilePublisherOptions, setMobilePublisher]);

  const defaultActiveKeys = [
    ...platformItems.map((item) => item.key),
    'workflow',
    'taxonomy',
    'promote',
    'schedule',
    'validation',
  ].filter(Boolean);

  return (
    <div className="publishing-new-post-options">
      <Collapse
        key={`${activeNetwork}-${contentType}-${mode}`}
        className="publishing-new-post-section-collapse"
        expandIconPosition="end"
        defaultActiveKey={defaultActiveKeys}
        items={[
          ...platformItemsWithAi,
          {
            key: 'workflow',
            label: 'Publishing Workflows',
            extra: renderAiExtra(['approvalWorkflow', 'mobilePublisher'], 'Publishing Workflows'),
            children: (
              <div className="publishing-new-post-option-grid">
                <div className="publishing-new-post-option-field">
                  <Text strong>Approval Workflow</Text>
                  <Select
                    value={approvalWorkflow}
                    onChange={(value) => setApprovalWorkflow(value || null)}
                    placeholder="Select Workflow"
                    allowClear
                    options={workflowOptions}
                  />
                  {selectedWorkflow ? (
                    <div className="publishing-new-post-workflow-status">
                      <Text strong>{selectedWorkflow.name}</Text>
                      <Text type="secondary">{describeApprovalWorkflow(selectedWorkflow, workflowApproverOptions)}</Text>
                      <Text type="secondary">The post will be routed to reviewers before it can be scheduled.</Text>
                    </div>
                  ) : null}
                  <Button
                    type="link"
                    className="publishing-new-post-inline-link"
                    onClick={() => navigate('/settings/approval-workflows')}
                  >
                    Manage approval workflows
                  </Button>
                </div>
                <div className="publishing-new-post-option-field">
                  <Text strong>Mobile Publisher</Text>
                  <Text type="secondary">
                    Choose who will get the{' '}
                    <a href={MOBILE_REMINDER_HELP_URL} target="_blank" rel="noopener noreferrer">
                      push notification reminder
                    </a>{' '}
                    {isStory ? 'to post story via the mobile app.' : `to post via the mobile app for ${mobilePublisherNetworkCopy}.`}
                  </Text>
                  <Select
                    value={mobilePublisher}
                    onChange={setMobilePublisher}
                    placeholder="Select Publisher"
                    options={mobilePublisherOptions}
                  />
                  {networkKeys.includes('tiktok') && !mobilePublisher ? (
                    <Alert type="warning" showIcon message="Select a mobile publisher for TikTok reminders." />
                  ) : null}
                  {mobilePublisher ? (
                    <Text type="secondary">A mobile reminder will be sent 15 minutes before the scheduled time.</Text>
                  ) : null}
                </div>
              </div>
            ),
          },
            {
              key: 'taxonomy',
              label: 'Tags',
              extra: renderAiExtra(['labels'], 'Tags'),
              children: (
                <div className="publishing-new-post-option-grid publishing-new-post-taxonomy-section">
                  <div className="publishing-new-post-taxonomy-field">
                    <div className="publishing-new-post-taxonomy-field-header">
                      <span>
                        <Text strong>Tags</Text>
                        <Text type="secondary">Use tags to organize, filter and report on your content.</Text>
                      </span>
                      <Button type="link" disabled={!labels.length} onClick={() => setLabels([])}>
                        Remove All
                      </Button>
                    </div>
                    <TagsPickerPopover labels={labels} onChange={setLabels} />
                  </div>
                </div>
              ),
            },
          {
            key: 'promote',
            label: 'Promote',
            children: (
              <div className="publishing-new-post-promote">
                <Text>
                  Promote this post to a larger audience by connecting an ad account.{' '}
                  <Button type="link" onClick={() => onOpenResource?.('paidPromotion')}>
                    Learn More
                  </Button>
                </Text>
                <Button block>Connect Ad Manager</Button>
              </div>
            ),
          },
          {
            key: 'schedule',
            label: (
              <PublishingScheduleHeader
                isDraft={isDraft}
                scheduleMode={scheduleMode}
                onScheduleModeChange={setScheduleMode}
              />
            ),
            extra: renderAiExtra(['schedule'], 'Schedule'),
            children: (
              <PublishingScheduleSection
                mode={mode}
                isDraft={isDraft}
                networkKeys={networkKeys}
                onOpenResource={onOpenResource}
                scheduleByNetwork={scheduleByNetwork}
                scheduleMode={scheduleMode}
                scheduledTimes={scheduledTimes}
                setScheduleByNetwork={setScheduleByNetwork}
                setScheduledTimes={setScheduledTimes}
              />
            ),
          },
          {
            key: 'validation',
            label: validationLabel,
            extra: renderAiExtra(['validation', 'previewQA'], 'Validation'),
            children: (
              <ValidationList items={validationItems} />
            ),
          },
        ]}
      />
    </div>
  );
};
