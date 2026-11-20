import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Typography } from 'antd';
import {
  CaretRightFilled,
  CommentOutlined,
  DownOutlined,
  EditOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  LikeOutlined,
  MoreOutlined,
  PictureOutlined,
  RetweetOutlined,
  RightOutlined,
  SendOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { PlatformIcon } from '../../components/SharedBadges';
import { T } from '../../theme';

const { Text, Title } = Typography;

const PREVIEW_FEEDBACK_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdkrujPQ009gYT1raNgK13Qt7gBazDChRO_vleWZZCsWKbgjA/viewform';
const VIDEO_POSTER_CAPTURE_MAX_WIDTH = 640;
const VIDEO_POSTER_CAPTURE_QUALITY = 0.82;
const VIDEO_POSTER_CACHE = new Map();
const PREVIEW_NETWORKS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'threads', label: 'Threads' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
];

const getPlatformMeta = (platform) => (
  PREVIEW_NETWORKS.find((network) => network.key === platform)
  || { key: platform, label: platform }
);

const getMediaByType = (media, type) => media.filter((item) => item.type === type);

const getFirstVideo = (media) => media.find((item) => item.type === 'video');

const limitMultipleVideosForSingleVideoNetworks = (media) => {
  const videoItems = getMediaByType(media, 'video');

  if (videoItems.length <= 1) {
    return media;
  }

  return media.filter((item) => item.type !== 'video' || item.id === videoItems[0].id);
};

const parseRatioValue = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const match = value.match(/(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0
    ? `${width} / ${height}`
    : null;
};

const getMediaAspectRatio = (item) => {
  const width = Number(item?.width);
  const height = Number(item?.height);

  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    return `${width} / ${height}`;
  }

  return parseRatioValue(item?.aspectRatio);
};

const getMediaAspectStyle = (item) => {
  const ratio = getMediaAspectRatio(item);

  return ratio ? { '--preview-media-aspect-ratio': ratio } : undefined;
};

const clampMediaAspectRatio = (item, { min, max, fallback }) => {
  const dimensions = getMediaDimensions(item);

  if (!dimensions) {
    return fallback;
  }

  const ratio = dimensions.width / dimensions.height;

  if (!Number.isFinite(ratio) || ratio <= 0) {
    return fallback;
  }

  if (ratio < min) {
    return `${min} / 1`;
  }

  if (ratio > max) {
    return `${max} / 1`;
  }

  return `${dimensions.width} / ${dimensions.height}`;
};

const getInstagramFeedMediaStyle = (item) => {
  if (item?.type === 'video') {
    return { '--preview-media-aspect-ratio': '16 / 9' };
  }

  return {
    '--preview-media-aspect-ratio': clampMediaAspectRatio(item, {
      min: 3 / 4,
      max: 1.91,
      fallback: '4 / 5',
    }),
  };
};

const getThreadsPostMediaStyle = (item) => {
  const dimensions = getMediaDimensions(item);

  if (!dimensions) {
    return {
      '--preview-media-aspect-ratio': '16 / 9',
      '--threads-post-media-width': '244px',
    };
  }

  const ratio = dimensions.width / dimensions.height;
  const mediaWidth = ratio < 0.8 ? 204 : Math.round(Math.min(Math.max(ratio * 138, 212), 244));

  return {
    '--preview-media-aspect-ratio': `${dimensions.width} / ${dimensions.height}`,
    '--threads-post-media-width': `${mediaWidth}px`,
  };
};

const getMediaDimensions = (item) => {
  const width = Number(item?.width);
  const height = Number(item?.height);

  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    return { width, height };
  }

  const match = typeof item?.aspectRatio === 'string'
    ? item.aspectRatio.match(/(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)/)
    : null;

  if (!match) {
    return null;
  }

  const ratioWidth = Number(match[1]);
  const ratioHeight = Number(match[2]);

  return Number.isFinite(ratioWidth) && Number.isFinite(ratioHeight) && ratioWidth > 0 && ratioHeight > 0
    ? { width: ratioWidth, height: ratioHeight }
    : null;
};

const getVideoPosterKey = (item) => (
  item?.src ? `${item.src}|${item.thumbnailFrame || ''}|${item.thumbnailTime || ''}` : ''
);

const getVideoPreviewTime = (item, duration) => {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? Math.max(duration - 0.05, 0) : 0;
  const explicitTime = Number(item?.thumbnailTime);

  if (Number.isFinite(explicitTime) && explicitTime >= 0) {
    return safeDuration ? Math.min(explicitTime, safeDuration) : explicitTime;
  }

  const frame = Number(item?.thumbnailFrame);
  if (Number.isFinite(frame) && frame >= 1 && safeDuration) {
    return Math.min(((Math.min(frame, 20) - 1) / 19) * safeDuration, safeDuration);
  }

  if (!safeDuration) {
    return 0;
  }

  return Math.min(Math.max(safeDuration * 0.22, 0.5), 4, safeDuration);
};

const capturePosterFromVideo = (video) => {
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height || typeof document === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  const scale = Math.min(1, VIDEO_POSTER_CAPTURE_MAX_WIDTH / width);
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', VIDEO_POSTER_CAPTURE_QUALITY);
};

const useVideoPoster = (item) => {
  const providedPoster = item?.poster;
  const posterSource = item?.src;
  const thumbnailFrame = item?.thumbnailFrame;
  const thumbnailTime = item?.thumbnailTime;
  const cacheKey = getVideoPosterKey(item);
  const [poster, setPoster] = useState(() => (
    providedPoster || (cacheKey ? VIDEO_POSTER_CACHE.get(cacheKey) : null) || null
  ));

  useEffect(() => {
    if (providedPoster) {
      setPoster(providedPoster);
      return undefined;
    }

    if (!cacheKey || !posterSource || typeof document === 'undefined') {
      setPoster(null);
      return undefined;
    }

    const cachedPoster = VIDEO_POSTER_CACHE.get(cacheKey);
    if (cachedPoster) {
      setPoster(cachedPoster);
      return undefined;
    }

    let mounted = true;
    let settled = false;
    const video = document.createElement('video');
    const settle = (nextPoster = null) => {
      if (settled) {
        return;
      }

      settled = true;
      if (nextPoster) {
        VIDEO_POSTER_CACHE.set(cacheKey, nextPoster);
      }
      if (mounted) {
        setPoster(nextPoster);
      }
    };
    const handleSeeked = () => {
      try {
        settle(capturePosterFromVideo(video));
      } catch {
        settle(null);
      }
    };
    const handleMetadata = () => {
      try {
        video.currentTime = getVideoPreviewTime({ thumbnailFrame, thumbnailTime }, video.duration);
      } catch {
        settle(null);
      }
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', () => settle(null), { once: true });
    video.src = posterSource;
    video.load?.();

    const fallbackTimer = window.setTimeout(() => {
      try {
        settle(capturePosterFromVideo(video));
      } catch {
        settle(null);
      }
    }, 1800);

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
      video.pause?.();
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('seeked', handleSeeked);
      video.removeAttribute('src');
      video.load?.();
    };
  }, [cacheKey, posterSource, providedPoster, thumbnailFrame, thumbnailTime]);

  return poster;
};

const getPreviewMediaLabel = ({ item, networkKey, index, total }) => (
  `${getPlatformMeta(networkKey).label} preview ${item.type} ${index + 1} of ${total}`
);

const getAvatarInitial = (channel, fallback) => {
  const rawLabel = channel?.name || channel?.handle || fallback;
  const normalizedLabel = String(rawLabel).replace(/^@/, '').trim();

  return (normalizedLabel || fallback).slice(0, 1).toUpperCase();
};

const PreviewAvatar = ({
  channel,
  className = '',
  fallback = 'G',
  fallbackColor = '#d9d9d9',
  size,
}) => (
  <Avatar
    className={['publishing-new-post-preview-avatar', className].filter(Boolean).join(' ')}
    size={size}
    src={channel?.avatarUrl || channel?.avatarSrc}
    style={{ background: channel?.avatarColor || fallbackColor }}
  >
    {getAvatarInitial(channel, fallback)}
  </Avatar>
);

const PreviewPlayIcon = () => (
  <span className="publishing-new-post-preview-play" aria-hidden="true">
    <CaretRightFilled />
  </span>
);

const getProfileHandleLabel = (channel, fallback = 'channel') => {
  const candidates = [
    channel?.channelId,
    channel?.handle,
    channel?.name,
  ].filter(Boolean);
  const label = candidates.find((item) => !/channel/i.test(String(item))) || candidates[0] || fallback;

  return String(label).replace(/^@/, '').trim() || fallback;
};

const getMockImageClass = (index) => `is-image-${(index % 5) + 1}`;

const MockPreviewThumb = ({ index, item, label }) => {
  const classes = [
    'publishing-new-post-image-thumb',
    'publishing-new-post-preview-image-thumb',
    getMockImageClass(index),
  ].join(' ');

  return item.src ? (
    <img className={classes} src={item.src} alt={label} loading="lazy" />
  ) : (
    <span role="img" aria-label={label} className={classes} />
  );
};

const MockPreviewVideo = ({ item, label }) => {
  const poster = useVideoPoster(item);
  const handleLoadedMetadata = (event) => {
    if (poster) {
      return;
    }

    const video = event.currentTarget;
    try {
      video.pause();
      video.currentTime = getVideoPreviewTime(item, video.duration);
    } catch {
      // Some browsers block seeking until enough data is buffered. The generated poster is still the primary path.
    }
  };

  return item.src ? (
    <video
      className="publishing-new-post-preview-video-thumb"
      src={item.src}
      poster={poster || undefined}
      muted
      playsInline
      preload="auto"
      onLoadedMetadata={handleLoadedMetadata}
      aria-label={label || item.alt || item.sourceName || item.label}
    />
  ) : (
    <span className="publishing-new-post-preview-video-thumb" aria-label={label || item.label || 'Preview video'} role="img" />
  );
};

const PreviewMediaCell = ({ item, index, label, style }) => (
  <div
    className={`publishing-new-post-preview-media-cell is-${item.type}`}
    style={style || getMediaAspectStyle(item)}
  >
    {item.type === 'video' ? (
      <MockPreviewVideo item={item} label={label || `Preview video ${index + 1}`} />
    ) : (
      <MockPreviewThumb item={item} index={index} label={label || `Preview image ${index + 1}`} />
    )}
    {item.type === 'video' ? <PreviewPlayIcon /> : null}
  </div>
);

const MediaPreviewGrid = ({ album = false, media, networkKey, tall = false }) => {
  if (!media.length) {
    return null;
  }

  const visibleItems = media.slice(0, 4);
  const hiddenCount = album && media.length > 4
    ? media.length - 3
    : Math.max(media.length - visibleItems.length, 0);
  const singleMediaStyle = media.length === 1 ? getMediaAspectStyle(media[0]) : undefined;
  const albumCountClass = album ? `is-facebook-album-count-${Math.min(media.length, 5)}` : '';

  return (
    <div className={[
      'publishing-new-post-preview-media-grid',
      album ? 'is-facebook-album' : '',
      albumCountClass,
      tall ? 'is-tall' : '',
      media.length === 1 ? 'is-single' : '',
      `is-${networkKey}`,
    ].filter(Boolean).join(' ')}
    style={singleMediaStyle}
    >
      {visibleItems.map((item, index) => (
        <div key={item.id} className="publishing-new-post-preview-media-cell-wrap">
          <PreviewMediaCell
            item={item}
            index={index}
            label={getPreviewMediaLabel({ item, networkKey, index, total: media.length })}
          />
          {hiddenCount && index === visibleItems.length - 1 ? (
            <span className="publishing-new-post-preview-more">+{hiddenCount}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

const FacebookFirstCommentPreview = ({ channel, firstComment }) => {
  const comment = firstComment?.trim();

  if (!comment) {
    return null;
  }

  return (
    <div className="publishing-new-post-facebook-first-comment-preview" aria-label="Facebook first comment preview">
      <PreviewAvatar
        channel={channel}
        className="publishing-new-post-facebook-first-comment-avatar"
        fallback="G"
        fallbackColor={T.colorPrimary}
        size={24}
      />
      <div className="publishing-new-post-facebook-first-comment-bubble">
        <span className="publishing-new-post-facebook-first-comment-author">
          <EditOutlined />
          <Text type="secondary">Author</Text>
        </span>
        <Text strong>{channel?.name || 'Garena Delta Force (VN - Vietnamese)'}</Text>
        <Text>{comment}</Text>
      </div>
    </div>
  );
};

const FacebookReelPreviewCard = ({ caption, media, channel }) => {
  const videoMedia = media.find((item) => item.type === 'video');

  return (
    <div className="publishing-new-post-facebook-reel-card">
      {videoMedia ? (
        <div className="publishing-new-post-preview-media is-facebook-reel is-video">
          <MockPreviewVideo item={videoMedia} label="Facebook preview video 1 of 1" />
          <span className="publishing-new-post-facebook-reel-rail">
            <span aria-label="Like"><LikeOutlined /></span>
            <span aria-label="Comment"><CommentOutlined /></span>
            <span aria-label="Share"><SendOutlined /></span>
          </span>
          <span className="publishing-new-post-facebook-reel-caption">
            <PreviewAvatar channel={channel} fallback="G" fallbackColor={T.colorPrimary} size={26} />
            <span>
              <Text strong>{channel?.name || 'Garena Delta Force (VN - Vietnamese)'}</Text>
              <Text>{caption}</Text>
            </span>
          </span>
          <span className="publishing-new-post-facebook-reel-more">
            <MoreOutlined />
          </span>
        </div>
      ) : (
        <Alert type="error" showIcon message="A video is required to preview Facebook Reel." />
      )}
    </div>
  );
};

const FacebookVideoPreviewCard = ({ caption, firstComment, media, channel }) => {
  const videoMedia = getFirstVideo(media);

  return (
    <div className="publishing-new-post-facebook-card">
      <div className="publishing-new-post-preview-channel">
        <PreviewAvatar channel={channel} fallback="G" fallbackColor={T.colorPrimary} />
        <span>
          <span className="publishing-new-post-facebook-headline">
            <Text strong>{channel?.name || 'Garena Delta Force (VN - Vietnamese)'}</Text>
            <Text> shared a video.</Text>
          </span>
          <Text type="secondary">{dayjs().format('D MMM')}</Text>
        </span>
      </div>
      <ParagraphPreview caption={caption} showFallback={!media.length} />
      {videoMedia ? (
        <div className="publishing-new-post-facebook-video-media">
          <PreviewMediaCell
            item={videoMedia}
            index={0}
            label="Facebook preview video 1 of 1"
          />
        </div>
      ) : null}
      <div className="publishing-new-post-preview-actions">
        <span>Like</span>
        <span>Comment</span>
        <span>Share</span>
      </div>
      <FacebookFirstCommentPreview channel={channel} firstComment={firstComment} />
    </div>
  );
};

const FacebookPreviewCardMixed = ({ caption, firstComment, media, channel, videoDetails }) => {
  const imageMedia = getMediaByType(media, 'image');
  const videoMedia = getFirstVideo(media);

  if (videoDetails.facebookPlacement === 'reel' && videoMedia) {
    return <FacebookReelPreviewCard caption={caption} media={media} channel={channel} />;
  }

  if (videoMedia) {
    return (
      <FacebookVideoPreviewCard
        caption={caption}
        channel={channel}
        firstComment={firstComment}
        media={media}
      />
    );
  }

  return (
    <div className="publishing-new-post-facebook-card">
      <div className="publishing-new-post-preview-channel">
        <PreviewAvatar channel={channel} fallback="G" fallbackColor={T.colorPrimary} />
        <span>
          <span className="publishing-new-post-facebook-headline">
            <Text strong>{channel?.name || 'Garena Delta Force (VN - Vietnamese)'}</Text>
            {imageMedia.length > 1 ? <Text> added {imageMedia.length} new photos.</Text> : null}
          </span>
          <Text type="secondary">{dayjs().format('D MMM')}</Text>
        </span>
      </div>
      <ParagraphPreview caption={caption} showFallback={!imageMedia.length} />
      <MediaPreviewGrid album={imageMedia.length > 1} media={imageMedia} networkKey="facebook" />
      <div className="publishing-new-post-preview-actions">
        <span>Like</span>
        <span>Comment</span>
        <span>Share</span>
      </div>
      <FacebookFirstCommentPreview channel={channel} firstComment={firstComment} />
    </div>
  );
};

const InstagramVideoPreviewCard = ({
  caption,
  channel,
  currentIndex,
  media,
  onNext,
  onPrevious,
  videoMedia,
}) => (
  <div className="publishing-new-post-instagram-reel-card">
    <div className="publishing-new-post-preview-media is-instagram-reel is-video">
      <MockPreviewVideo
        item={videoMedia}
        label={getPreviewMediaLabel({
          item: videoMedia,
          networkKey: 'instagram',
          index: currentIndex,
          total: media.length,
        })}
      />
      <PreviewPlayIcon />
      <span className="publishing-new-post-instagram-reel-rail">
        <span aria-label="Like"><LikeOutlined /></span>
        <span aria-label="Comment"><CommentOutlined /></span>
        <span aria-label="Share"><SendOutlined /></span>
        <span aria-label="More"><MoreOutlined /></span>
      </span>
      <span className="publishing-new-post-instagram-reel-caption">
        <PreviewAvatar channel={channel} fallback="I" size={26} />
        <span>
          <Text strong>{channel?.handle || channel?.name || 'instagram'}</Text>
          <Text>{caption}</Text>
          {caption ? <Text underline>Show More</Text> : null}
        </span>
      </span>
      {media.length > 1 ? (
        <>
          <Button
            type="text"
            shape="circle"
            className="publishing-new-post-instagram-nav is-prev"
            aria-label="Previous Instagram media item"
            icon={<LeftOutlined />}
            onClick={onPrevious}
          />
          <Button
            type="text"
            shape="circle"
            className="publishing-new-post-instagram-nav is-next"
            aria-label="Next Instagram media item"
            icon={<RightOutlined />}
            onClick={onNext}
          />
        </>
      ) : null}
    </div>
  </div>
);

const InstagramPreviewCardMixed = ({
  caption,
  firstComment = '',
  media,
  channel,
  videoDetails,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentIndex = media.length ? activeIndex % media.length : 0;
  const currentMedia = media[currentIndex];
  const videoCount = getMediaByType(media, 'video').length;
  const shouldPreviewAsFeed = videoDetails?.instagramShareToFeed !== false;
  const profileLabel = (channel?.name || channel?.handle || 'instagram').replace(/^@/, '');
  const firstCommentText = firstComment.trim();
  const goPrevious = () => setActiveIndex((index) => (index + media.length - 1) % media.length);
  const goNext = () => setActiveIndex((index) => (index + 1) % media.length);

  if (currentMedia?.type === 'video' && videoCount <= 1 && !shouldPreviewAsFeed) {
    return (
      <InstagramVideoPreviewCard
        caption={caption}
        channel={channel}
        currentIndex={currentIndex}
        media={media}
        onNext={goNext}
        onPrevious={goPrevious}
        videoMedia={currentMedia}
      />
    );
  }

  return (
    <div className="publishing-new-post-instagram-card">
      <div className="publishing-new-post-preview-channel">
        <PreviewAvatar channel={channel} fallback="I" />
        <Text strong>{channel?.name || 'Instagram Channel'}</Text>
      </div>
      {currentMedia ? (
        <div className="publishing-new-post-instagram-carousel">
          <PreviewMediaCell
            item={currentMedia}
            index={currentIndex}
            style={getInstagramFeedMediaStyle(currentMedia)}
            label={getPreviewMediaLabel({
              item: currentMedia,
              networkKey: 'instagram',
              index: currentIndex,
              total: media.length,
            })}
          />
          {media.length > 1 ? (
            <>
              <Button
                type="text"
                shape="circle"
                className="publishing-new-post-instagram-nav is-prev"
                aria-label="Previous Instagram media item"
                icon={<LeftOutlined />}
                onClick={goPrevious}
              />
              <Button
                type="text"
                shape="circle"
                className="publishing-new-post-instagram-nav is-next"
                aria-label="Next Instagram media item"
                icon={<RightOutlined />}
                onClick={goNext}
              />
            </>
          ) : null}
        </div>
      ) : null}
      {media.length > 1 ? (
        <div className="publishing-new-post-instagram-dots">
          {media.map((item, index) => <span key={item.id} className={index === currentIndex ? 'is-active' : ''} />)}
        </div>
      ) : null}
      <div className="publishing-new-post-instagram-actions" aria-label="Instagram post actions">
        <span aria-label="Like"><HeartOutlined /></span>
        <span aria-label="Comment"><CommentOutlined /></span>
      </div>
      <div className="publishing-new-post-instagram-meta">
        <p className="publishing-new-post-instagram-caption-line">
          <Text strong>{profileLabel}</Text>
          {caption ? <Text>{caption}</Text> : null}
        </p>
        {firstCommentText ? (
          <div className="publishing-new-post-instagram-first-comment-preview" aria-label="Instagram first comment preview">
            <Text strong>{profileLabel}</Text>
            <Text>{firstCommentText}</Text>
          </div>
        ) : null}
        <Text type="secondary">{dayjs().format('D MMM').toUpperCase()}</Text>
      </div>
    </div>
  );
};

const ThreadsPreviewCardMixed = ({ caption, media, channel }) => {
  const previewMedia = limitMultipleVideosForSingleVideoNetworks(media);
  const primaryMedia = getFirstVideo(previewMedia) || previewMedia[0] || null;
  const profileLabel = getProfileHandleLabel(channel, 'threads');

  return (
    <div className="publishing-new-post-threads-card">
      <div className="publishing-new-post-threads-post">
        <PreviewAvatar
          channel={channel}
          className="publishing-new-post-threads-avatar"
          fallback="T"
          fallbackColor="#111827"
          size={34}
        />
        <div className="publishing-new-post-threads-body">
          <Text strong className="publishing-new-post-threads-author">{profileLabel}</Text>
          {caption ? <Text className="publishing-new-post-threads-caption">{caption}</Text> : null}
          {primaryMedia ? (
            <div
              className="publishing-new-post-threads-media-frame"
              style={getThreadsPostMediaStyle(primaryMedia)}
            >
            <PreviewMediaCell
              item={primaryMedia}
              index={0}
              label={getPreviewMediaLabel({ item: primaryMedia, networkKey: 'threads', index: 0, total: 1 })}
            />
              {primaryMedia.type === 'video' ? (
                <span className="publishing-new-post-threads-volume" aria-hidden="true">
                  <SoundOutlined />
                </span>
              ) : null}
          </div>
          ) : null}
          <div className="publishing-new-post-threads-actions" aria-label="Threads post actions">
            <span aria-label="Like"><HeartOutlined /></span>
            <span aria-label="Comment"><CommentOutlined /></span>
            <span aria-label="Repost"><RetweetOutlined /></span>
            <span aria-label="Share"><SendOutlined /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const YouTubeStandardPreviewCard = ({
  caption,
  channel,
  videoMedia,
  youtubeTitle,
}) => {
  const title = (youtubeTitle || caption || '').trim();

  return (
    <div className="publishing-new-post-youtube-card is-standard">
      <div className="publishing-new-post-preview-media is-youtube-standard is-video">
        <MockPreviewVideo item={videoMedia} label="YouTube preview video 1 of 1" />
      </div>
      <div className="publishing-new-post-youtube-standard-meta">
        <PreviewAvatar channel={channel} fallback="Y" size={28} />
        <span className="publishing-new-post-youtube-standard-copy">
          {title ? (
            <Text className="publishing-new-post-youtube-standard-title">{title}</Text>
          ) : null}
          <Text type={title ? 'secondary' : undefined}>{channel?.name || 'YouTube Channel'}</Text>
        </span>
      </div>
    </div>
  );
};

const YouTubePreviewCardMixed = ({
  caption,
  media,
  channel,
  youtubeTitle,
}) => {
  const videoMedia = getFirstVideo(media);

  return (
    videoMedia ? (
      <YouTubeStandardPreviewCard
        caption={caption}
        channel={channel}
        videoMedia={videoMedia}
        youtubeTitle={youtubeTitle}
      />
    ) : (
      <Alert type="error" showIcon message="A video is required to preview YouTube." />
    )
  );
};

const TikTokPreviewCardMixed = ({ caption, media, channel }) => {
  const videoMedia = getFirstVideo(media);
  const profileLabel = getProfileHandleLabel(channel, 'channel');

  return (
    <div className="publishing-new-post-tiktok-card">
      {videoMedia ? (
        <div className="publishing-new-post-preview-media is-tiktok is-video">
          <MockPreviewVideo item={videoMedia} label="TikTok preview video 1 of 1" />
          <PreviewPlayIcon />
          <span className="publishing-new-post-tiktok-rail" aria-label="TikTok post actions">
            <PreviewAvatar
              channel={channel}
              className="publishing-new-post-tiktok-profile-avatar"
              fallback="K"
              fallbackColor="#1677ff"
              size={34}
            />
            <span aria-label="Like"><HeartOutlined /></span>
            <span aria-label="Comment"><CommentOutlined /></span>
            <span aria-label="Share"><SendOutlined /></span>
            <PreviewAvatar
              channel={channel}
              className="publishing-new-post-tiktok-sound-avatar"
              fallback="K"
              fallbackColor="#1677ff"
              size={28}
            />
          </span>
          <span className="publishing-new-post-tiktok-caption">
            <Text strong>{profileLabel}</Text>
            {caption ? <Text>{caption}</Text> : null}
          </span>
        </div>
      ) : (
        <Alert type="error" showIcon message="A video is required to preview TikTok." />
      )}
    </div>
  );
};

const ParagraphPreview = ({ caption, showFallback = true }) => (
  <p className="publishing-new-post-preview-caption">
    {caption || (showFallback ? 'Select a channel and start adding content in the left panel.' : '')}
  </p>
);

export const NetworkPreview = ({
  activeNetwork,
  captions,
  firstComment = '',
  media,
  mediaByNetwork = null,
  mode,
  networkKeys,
  selectedChannels,
  videoDetails,
  youtubeTitle = '',
}) => {
  const networksToPreview = mode === 'per_network' && networkKeys.includes(activeNetwork)
    ? [activeNetwork]
    : networkKeys;
  const getMediaForNetwork = (networkKey) => (
    mode === 'per_network'
      ? mediaByNetwork?.[networkKey] || []
      : media
  );
  const getCaptionForPreview = (networkKey) => (
    mode === 'per_network'
      ? captions[networkKey] ?? captions.all ?? ''
      : captions.all || ''
  );
  const hasContent = networksToPreview.some((networkKey) => (
    getMediaForNetwork(networkKey).length > 0
    || Boolean(getCaptionForPreview(networkKey))
    || (networkKey === 'facebook' && Boolean(firstComment.trim()))
    || (networkKey === 'instagram' && Boolean(firstComment.trim()))
    || (networkKey === 'youtube' && Boolean(youtubeTitle.trim()))
  ));
  const hasChannels = selectedChannels.length > 0;
  const [collapsedNetworkKeys, setCollapsedNetworkKeys] = useState({});
  const toggleNetworkPreview = (networkKey) => {
    setCollapsedNetworkKeys((current) => ({
      ...current,
      [networkKey]: !current[networkKey],
    }));
  };

  return (
    <div className="publishing-new-post-preview-panel">
      <Title level={5}>Network Preview</Title>
      <div className="publishing-new-post-preview-note">
        <InfoCircleOutlined />
        <Text>
          Preview approximates how your content will display when published. Tests and updates by social networks may affect the final appearance.
          {' '}
          <Button type="link" href={PREVIEW_FEEDBACK_URL} target="_blank">
            Report a difference you notice.
          </Button>
        </Text>
      </div>

      {!hasChannels || !hasContent ? (
        <div className="publishing-new-post-preview-empty">
          <Text>{hasChannels ? 'Select a channel and start adding content in the left panel.' : 'Select at least one channel to preview this post.'}</Text>
          <div className="publishing-new-post-preview-skeleton">
            <span className="publishing-new-post-preview-skeleton-avatar" />
            <span className="publishing-new-post-preview-skeleton-line short" />
            <span className="publishing-new-post-preview-skeleton-line" />
            <span className="publishing-new-post-preview-skeleton-line" />
            <span className="publishing-new-post-preview-skeleton-line medium" />
            <span className="publishing-new-post-preview-skeleton-media" />
          </div>
        </div>
      ) : networksToPreview.map((networkKey) => {
        const network = getPlatformMeta(networkKey);
        const channel = selectedChannels.find((item) => item.platform === networkKey) || selectedChannels[0];
        const caption = getCaptionForPreview(networkKey);
        const previewMedia = getMediaForNetwork(networkKey);
        const isCollapsed = Boolean(collapsedNetworkKeys[networkKey]);
        const previewBodyId = `publishing-new-post-preview-${networkKey}-body`;

        return (
          <section
            key={networkKey}
            className={[
              'publishing-new-post-preview-network',
              isCollapsed ? 'is-collapsed' : '',
            ].filter(Boolean).join(' ')}
          >
            <div className="publishing-new-post-preview-network-title">
              <span><PlatformIcon platform={network.key} size="preview" /></span>
              <Text strong>{network.label}</Text>
              <Button
                type="text"
                aria-controls={previewBodyId}
                aria-expanded={!isCollapsed}
                aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${network.label} preview`}
                className="publishing-new-post-preview-network-toggle"
                icon={<DownOutlined />}
                onClick={() => toggleNetworkPreview(networkKey)}
              />
            </div>
            {!isCollapsed ? (
              <div id={previewBodyId} className="publishing-new-post-preview-network-body">
                {networkKey === 'facebook' ? (
                  <FacebookPreviewCardMixed
                    caption={caption}
                    channel={channel}
                    firstComment={firstComment}
                    media={previewMedia}
                    videoDetails={videoDetails}
                  />
                ) : networkKey === 'instagram' ? (
                  <InstagramPreviewCardMixed
                    caption={caption}
                    channel={channel}
                    firstComment={firstComment}
                    media={previewMedia}
                    videoDetails={videoDetails}
                  />
                ) : networkKey === 'threads' ? (
                  <ThreadsPreviewCardMixed caption={caption} media={previewMedia} channel={channel} />
                ) : networkKey === 'youtube' ? (
                  <YouTubePreviewCardMixed
                    caption={caption}
                    media={previewMedia}
                    channel={channel}
                    youtubeTitle={youtubeTitle}
                  />
                ) : networkKey === 'tiktok' ? (
                  <TikTokPreviewCardMixed caption={caption} media={previewMedia} channel={channel} />
                ) : (
                  <div className={`publishing-new-post-generic-preview is-${networkKey}`}>
                    <div className="publishing-new-post-preview-channel">
                      <PreviewAvatar channel={channel} fallback="G" />
                      <span>
                        <Text strong>{channel?.name || network.label}</Text>
                        <Text type="secondary">{channel?.handle || '@channel'}</Text>
                      </span>
                    </div>
                    <ParagraphPreview caption={caption} />
                    <div className="publishing-new-post-preview-media">
                      {networkKey === 'youtube' || networkKey === 'tiktok' ? <VideoCameraOutlined /> : <PictureOutlined />}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
};
