import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Input,
  Popover,
  Radio,
  Select,
  Typography,
} from 'antd';
import {
  ExportOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { CHANNEL_TERMINOLOGY } from '../../data/channelManagement';
import { FirstCommentComposer } from './PublishingFirstCommentSection';

const { Text } = Typography;

const SPROUTLINK_IN_BIO_URL = 'https://app.sproutsocial.com/publishing/link_in_bio/';
const COLLABORATORS_HELP_URL = 'https://support.sproutsocial.com/hc/en-us/articles/28825824263565/';
const FACEBOOK_REELS_HELP_URL = 'https://support.sproutsocial.com/hc/en-us/articles/8488491930893-How-can-I-use-Facebook-Reels-in-Sprout';
const YOUTUBE_PUBLISHING_HELP_URL = 'https://support.sproutsocial.com/hc/en-us/articles/360024633771-How-do-I-publish-videos-to-YouTube';

const normalizeYoutubeTags = (rawValue) => (
  rawValue
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
);

const YouTubeVideoTagsInput = ({ value = [], onChange }) => {
  const [draftTag, setDraftTag] = useState('');
  const inputRef = useRef(null);
  const tags = Array.isArray(value) ? value : [];

  const commitTags = (rawValue) => {
    const nextTags = normalizeYoutubeTags(rawValue);

    if (!nextTags.length) {
      setDraftTag('');
      return;
    }

    const seenTags = new Set(tags.map((tag) => tag.toLowerCase()));
    const mergedTags = [...tags];

    nextTags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();

      if (!seenTags.has(normalizedTag)) {
        mergedTags.push(tag);
        seenTags.add(normalizedTag);
      }
    });

    onChange(mergedTags);
    setDraftTag('');
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commitTags(event.currentTarget.value);
      return;
    }

    if (event.key === 'Backspace' && !draftTag && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const handlePaste = (event) => {
    const pastedText = event.clipboardData.getData('text');

    if (!pastedText.includes(',')) {
      return;
    }

    event.preventDefault();
    commitTags(`${draftTag}${pastedText}`);
  };

  return (
    <div
      className="publishing-new-post-youtube-tags-input"
      role="group"
      aria-label="YouTube Video Tags"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span className="publishing-new-post-youtube-tag" key={tag}>
          <span>{tag}</span>
          <button
            type="button"
            aria-label={`Remove YouTube tag ${tag}`}
            onClick={(event) => {
              event.stopPropagation();
              removeTag(tag);
            }}
          >
            x
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draftTag}
        className="publishing-new-post-youtube-tag-entry"
        aria-label="Enter YouTube video tag"
        placeholder="Enter comma-separated values"
        onBlur={(event) => commitTags(event.currentTarget.value)}
        onChange={(event) => setDraftTag(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  );
};

const FACEBOOK_CATEGORIES = [
  'Beauty & Fashion',
  'Business',
  'Cars & Trucks',
  'Comedy',
  'Cute Animals',
  'Entertainment',
  'Family',
  'Food & Health',
  'Home',
  'Lifestyle',
  'Music',
  'News',
  'Other',
  'Politics',
  'Science',
  'Sports',
  'Technology',
  'Video Games',
];

const YOUTUBE_CATEGORIES = [
  'Film & Animation',
  'Autos & Vehicles',
  'Music',
  'Pets & Animals',
  'Sports',
  'Travel & Events',
  'Gaming',
  'People & Blogs',
  'Comedy',
  'Entertainment',
  'News & Politics',
  'Howto & Style',
  'Education',
  'Science & Technology',
];

const InstagramCollaboratorsPopover = () => {
  const content = (
    <div className="publishing-new-post-instagram-collaborators-popover-content">
      <div className="publishing-new-post-instagram-collaborators-header">
        <div>
          <Text strong>Collaborators</Text>
          <Text type="secondary">Add up to 3 profiles.</Text>
        </div>
        <Button type="link" className="publishing-new-post-inline-link">
          Clear All
        </Button>
      </div>
      <div className="publishing-new-post-instagram-collaborators-body">
        <Input
          autoFocus
          maxLength={30}
          showCount={{ formatter: ({ count, maxLength }) => maxLength - count }}
          placeholder="Add an Instagram profile..."
          aria-label="Add an Instagram profile"
        />
        <div className="publishing-new-post-instagram-collaborators-empty">
          <span className="publishing-new-post-instagram-collaborators-empty-icon">
            <UserAddOutlined />
          </span>
          <Text type="secondary">
            If the collaborators accept, your post will be shared with their followers.
            <br />
            Tagging private accounts or incorrect usernames may cause your post to fail.
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement="rightTop"
      content={content}
      overlayClassName="publishing-new-post-instagram-collaborators-popover"
    >
      <Button className="publishing-new-post-inline-button">
        Invite Collaborators
      </Button>
    </Popover>
  );
};

export const PlatformSpecificOptions = ({
  activeNetwork,
  firstComment,
  hasVideo,
  includeFirstComment = true,
  onFirstCommentChange,
  onSaveFirstCommentToAssetLibrary,
  onVideoDetailsChange,
  onYoutubeAdvancedToggle,
  setYoutubeAudience,
  setYoutubeTitle,
  videoDetails,
  youtubeAdvancedOpen,
  youtubeAudience,
  youtubeTitle,
}) => {
  if (activeNetwork === 'facebook' && hasVideo) {
    const isFacebookReel = videoDetails.facebookPlacement === 'reel';

    return {
      key: 'facebook-video',
      label: 'Facebook Video Options',
      children: (
        <div className="publishing-new-post-option-grid publishing-new-post-facebook-video-options">
          <label>
            <Text strong>Publish video as</Text>
            <Radio.Group
              value={videoDetails.facebookPlacement}
              onChange={(event) => onVideoDetailsChange({ facebookPlacement: event.target.value })}
              className="publishing-new-post-radio-row"
            >
              <Radio value="standard">Standard post</Radio>
              <Radio value="reel">Reel</Radio>
            </Radio.Group>
          </label>
          {isFacebookReel ? (
            <Button
              type="link"
              className="publishing-new-post-facebook-reel-help"
              href={FACEBOOK_REELS_HELP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Who can see my reels?
            </Button>
          ) : (
            <label>
              <Text strong>Category <Text type="secondary">(Facebook Only)</Text></Text>
              <Select
                value={videoDetails.facebookCategory || undefined}
                onChange={(facebookCategory) => onVideoDetailsChange({ facebookCategory })}
                placeholder="Select a category"
                options={FACEBOOK_CATEGORIES.map((category) => ({ value: category, label: category }))}
              />
            </label>
          )}
        </div>
      ),
    };
  }

  if (activeNetwork === 'instagram') {
    const trialReelEnabled = Boolean(videoDetails.instagramTrialReel);
    const trialAutoPublishEnabled = Boolean(videoDetails.instagramTrialReelAutoPublish);
    const handleTrialReelChange = (event) => onVideoDetailsChange({
      instagramTrialReel: event.target.checked,
      ...(event.target.checked ? {} : { instagramTrialReelAutoPublish: false }),
    });

    return {
      key: 'instagram',
      label: 'Instagram Options',
      children: (
        <div className="publishing-new-post-option-grid publishing-new-post-instagram-options">
          {hasVideo ? (
            <div className="publishing-new-post-instagram-video-options">
              <div className="publishing-new-post-instagram-trial-block">
                <Checkbox
                  checked={trialReelEnabled}
                  onChange={handleTrialReelChange}
                >
                  Trial Reel <InfoCircleOutlined />
                </Checkbox>
                <Text type="secondary" className="publishing-new-post-instagram-trial-copy">
                  Test content with non-followers before sharing widely.
                </Text>
                {trialReelEnabled ? (
                  <>
                    <Checkbox
                      className="publishing-new-post-instagram-nested-checkbox"
                      checked={trialAutoPublishEnabled}
                      onChange={(event) => onVideoDetailsChange({ instagramTrialReelAutoPublish: event.target.checked })}
                    >
                      Publish automatically to everyone based on 72 hour performance
                    </Checkbox>
                    {!trialAutoPublishEnabled ? (
                      <Alert
                        type="warning"
                        showIcon
                        className="publishing-new-post-instagram-trial-alert"
                        description={'Your followers won\'t see your video in feed or Reels unless "share to everyone" is enabled from the Instagram app.'}
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
              <Checkbox
                checked={videoDetails.instagramShareToFeed}
                onChange={(event) => onVideoDetailsChange({ instagramShareToFeed: event.target.checked })}
              >
                {trialReelEnabled
                  ? 'Share Reel to your profile feed (if trial is published to everyone)'
                  : 'Share Reel to your profile feed'}
              </Checkbox>
            </div>
          ) : null}
          {includeFirstComment ? (
            <label>
              <Text strong>Instagram First Comment</Text>
              <FirstCommentComposer
                label="Instagram First Comment"
                maxLength={1500}
                onChange={onFirstCommentChange}
                onSaveToAssetLibrary={onSaveFirstCommentToAssetLibrary}
                value={firstComment}
              />
            </label>
          ) : null}
          <div className="publishing-new-post-platform-note">
            <Text strong>Post Link <InfoCircleOutlined /></Text>
            <Button
              type="link"
              className="publishing-new-post-inline-link"
              href={SPROUTLINK_IN_BIO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enable SproutLink in Bio
              {' '}
              <ExportOutlined />
            </Button>
          </div>
          <div className="publishing-new-post-platform-note">
            <Text strong>Collaborators</Text>
            <Text type="secondary">
              Invite up to 3 {CHANNEL_TERMINOLOGY.lowerPlural}.{' '}
              <Button
                type="link"
                className="publishing-new-post-inline-link"
                href={COLLABORATORS_HELP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more in the Help Center about Collaborators
                {' '}
                <ExportOutlined />
              </Button>
            </Text>
            <InstagramCollaboratorsPopover />
          </div>
        </div>
      ),
    };
  }

  if (activeNetwork === 'threads' && hasVideo) {
    return {
      key: 'threads-video',
      label: 'Threads Video Options',
      children: (
        <div className="publishing-new-post-option-grid publishing-new-post-threads-video-options">
          <label>
            <Text strong>Who can reply</Text>
            <Select
              value={videoDetails.threadsReplyControl}
              onChange={(threadsReplyControl) => onVideoDetailsChange({ threadsReplyControl })}
              options={[
                { value: 'anyone', label: 'Anyone' },
                { value: 'channels-you-follow', label: 'Channels you follow' },
                { value: 'mentioned-only', label: 'Mentioned only' },
              ]}
            />
          </label>
          <label>
            <Text strong>Video alt text</Text>
            <Input
              value={videoDetails.threadsAltText}
              onChange={(event) => onVideoDetailsChange({ threadsAltText: event.target.value })}
              placeholder="Describe this video for accessibility"
            />
          </label>
        </div>
      ),
    };
  }

  if (activeNetwork === 'youtube' && hasVideo) {
    return {
      key: 'youtube-video',
      label: 'YouTube Video Options',
      children: (
        <div className="publishing-new-post-option-grid">
          <Alert
            type="info"
            showIcon
            className="publishing-new-post-youtube-short-alert"
            title={(
              <span>
                Any video with a square or vertical aspect ratio that is 3 minutes or less will automatically be posted as a Short.{' '}
                <a
                  href={YOUTUBE_PUBLISHING_HELP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more about posting to YouTube
                </a>
              </span>
            )}
          />
          <div className="publishing-new-post-option-field">
            <Text strong>YouTube Video Tags</Text>
            <YouTubeVideoTagsInput
              value={videoDetails.youtubeTags}
              onChange={(youtubeTags) => onVideoDetailsChange({ youtubeTags })}
            />
          </div>
          <label>
            <Text strong>Video Title (Required)</Text>
            <Input
              value={youtubeTitle}
              onChange={(event) => setYoutubeTitle(event.target.value)}
              placeholder="Add a video title"
              status={hasVideo && !youtubeTitle.trim() ? 'error' : undefined}
            />
          </label>
          <div className="publishing-new-post-option-grid two">
            <label>
              <Text strong>Privacy</Text>
              <Select
                value={videoDetails.youtubePrivacy}
                onChange={(youtubePrivacy) => onVideoDetailsChange({ youtubePrivacy })}
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'private', label: 'Private' },
                  { value: 'unlisted', label: 'Unlisted' },
                ]}
              />
            </label>
            <label>
              <Text strong>Category</Text>
              <Select
                value={videoDetails.youtubeCategory}
                onChange={(youtubeCategory) => onVideoDetailsChange({ youtubeCategory })}
                options={YOUTUBE_CATEGORIES.map((category) => ({ value: category, label: category }))}
              />
            </label>
          </div>
          <label>
            <Text strong>Playlist <Text type="secondary">(optional)</Text></Text>
            <Select
              placeholder="Select a playlist"
              options={[
                { value: 'ban-do', label: 'Ban do | Garena Delta Force' },
                { value: 'cinematic', label: 'Cinematic | Garena Delta Force' },
                { value: 'cong-dong', label: 'Cong dong | Garena Delta Force' },
                { value: 'giai-dau', label: 'Giai dau - Showmatch | Garena Delta Force' },
                { value: 'ho-so', label: 'Ho so Dac Vu | Garena Delta Force' },
                { value: 'huong-dan', label: 'Huong dan | Garena Delta Force' },
              ]}
            />
          </label>
          <div className="publishing-new-post-youtube-radio-block">
            <Text strong>Audience <InfoCircleOutlined /></Text>
            <Text type="secondary">Is this video made for kids? (required)</Text>
            <Radio.Group
              value={youtubeAudience}
              onChange={(event) => setYoutubeAudience(event.target.value)}
            >
              <Radio value="made-for-kids">Yes, it's made for kids</Radio>
              <Radio value="not-made-for-kids">No, it's not made for kids</Radio>
            </Radio.Group>
          </div>
          <div className="publishing-new-post-youtube-radio-block">
            <Text strong>Age restriction</Text>
            <Text type="secondary">Do you want to restrict your video to an adult audience?</Text>
            <Radio.Group
              value={videoDetails.youtubeAgeRestriction || 'not-restricted'}
              onChange={(event) => onVideoDetailsChange({ youtubeAgeRestriction: event.target.value })}
            >
              <Radio value="restricted">Yes, restrict my video to viewers over 18</Radio>
              <Radio value="not-restricted">No, don't restrict my video to viewers over 18 only</Radio>
            </Radio.Group>
          </div>
          {youtubeAdvancedOpen ? (
            <div className="publishing-new-post-youtube-advanced">
              <label>
                <Text strong>License Rights &amp; Ownership <InfoCircleOutlined /></Text>
                <Select
                  value={videoDetails.youtubeLicense}
                  onChange={(youtubeLicense) => onVideoDetailsChange({ youtubeLicense })}
                  options={[
                    { value: 'standard', label: 'Standard YouTube License' },
                    { value: 'creative-commons', label: 'Creative Commons - Attribution' },
                  ]}
                />
              </label>
              <Checkbox
                checked={videoDetails.youtubeEmbedding}
                onChange={(event) => onVideoDetailsChange({ youtubeEmbedding: event.target.checked })}
              >
                Allow embedding
              </Checkbox>
              <Checkbox
                checked={videoDetails.youtubeNotifySubscribers}
                onChange={(event) => onVideoDetailsChange({ youtubeNotifySubscribers: event.target.checked })}
              >
                Publish to subscriptions feed and notify subscribers
              </Checkbox>
              <Button className="publishing-new-post-inline-button" onClick={onYoutubeAdvancedToggle}>
                Hide Advanced Settings
              </Button>
            </div>
          ) : (
            <Button className="publishing-new-post-inline-button" onClick={onYoutubeAdvancedToggle}>
              Show Advanced Settings
            </Button>
          )}
        </div>
      ),
    };
  }

  if (activeNetwork === 'tiktok') {
    return {
      key: 'tiktok',
      label: 'TikTok Options',
      children: (
        <div className="publishing-new-post-option-grid publishing-new-post-tiktok-options">
          <Checkbox
            checked={videoDetails.tiktokAllowComments}
            onChange={(event) => onVideoDetailsChange({ tiktokAllowComments: event.target.checked })}
          >
            Allow comments
          </Checkbox>
          <Checkbox
            checked={videoDetails.tiktokAllowDuets}
            onChange={(event) => onVideoDetailsChange({ tiktokAllowDuets: event.target.checked })}
          >
            Allow duets
          </Checkbox>
          <Checkbox
            checked={videoDetails.tiktokAllowStitches}
            onChange={(event) => onVideoDetailsChange({ tiktokAllowStitches: event.target.checked })}
          >
            Allow stitches
          </Checkbox>
        </div>
      ),
    };
  }

  return null;
};
