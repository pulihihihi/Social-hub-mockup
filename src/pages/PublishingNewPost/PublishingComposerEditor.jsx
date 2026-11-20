import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Divider,
  Input,
  Modal,
  Popover,
  Space,
  Switch,
  Typography,
} from 'antd';
import {
  AppleOutlined,
  BugOutlined,
  CameraOutlined,
  CheckOutlined,
  CloseOutlined,
  CarOutlined,
  DeleteOutlined,
  DribbbleOutlined,
  EditOutlined,
  FileOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
  LeftOutlined,
  PercentageOutlined,
  PictureOutlined,
  PlusOutlined,
  RetweetOutlined,
  RightOutlined,
  SearchOutlined,
  SmileOutlined,
  SyncOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  WarningOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { GripIco, SparkleIco } from '../../components/icons';
import { PlatformIcon } from '../../components/SharedBadges';
import { C } from '../../theme';
import { NewPostAiAssistActions } from './NewPostAiAssistActions';
import {
  EMOJI_GROUPS,
  NETWORKS,
  NEW_POST_TOOLTIPS,
  PLATFORM_CHAR_LIMITS,
} from './publishingComposerConfig';
import {
  canUploadImagesForNetworks,
  getCaptionForNetwork,
} from './publishingComposerUtils';
import {
  getPrimaryMediaAssetGuidance,
  getPublishingAssetValidationItems,
} from './publishingAssetRules';
import { TooltipContent, TooltipTarget } from './PublishingTooltip';

const { Text } = Typography;
const ALT_TEXT_NETWORK_ORDER = ['instagram', 'threads', 'facebook'];
const ALT_TEXT_AI_DELAY = 220;
const IS_JSDOM_ENV = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);
const UPLOAD_METADATA_TIMEOUT_MS = IS_JSDOM_ENV ? 1 : 800;
const VIDEO_UPLOAD_POSTER_TIMEOUT_MS = IS_JSDOM_ENV ? 1 : 1800;
const VIDEO_UPLOAD_POSTER_CAPTURE_MAX_WIDTH = 720;
const VIDEO_UPLOAD_POSTER_CAPTURE_QUALITY = 0.86;
const VIDEO_SUBTITLE_NETWORKS = new Set(['facebook', 'youtube']);
const MULTI_VIDEO_UPLOAD_NETWORKS = new Set(['instagram']);
const KNOWN_ASPECT_RATIOS = [
  { label: '9:16', value: 9 / 16 },
  { label: '4:5', value: 4 / 5 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '1.91:1', value: 1.91 },
];
const triggerUploadFilePicker = (inputRef) => {
  inputRef.current?.click();
};

const resetUploadInput = (event) => {
  event.target.value = '';
};

const createUploadObjectUrl = (file) => {
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    return URL.createObjectURL(file);
  }

  return `mock-upload://${encodeURIComponent(file.name)}`;
};

const canUploadMultipleVideosForNetworks = (networkKeys = []) => (
  networkKeys.length !== 1 || MULTI_VIDEO_UPLOAD_NETWORKS.has(networkKeys[0])
);

const hasSingleVideoUploadLimit = (networkKeys = []) => (
  networkKeys.length === 1 && !MULTI_VIDEO_UPLOAD_NETWORKS.has(networkKeys[0])
);

const getFileExtension = (fileName = '') => {
  const extension = fileName.split('.').pop();
  return extension && extension !== fileName ? extension.toUpperCase() : '';
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) {
    return '';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = size >= 10 || unitIndex === 0 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
};

const formatDuration = (duration = 0) => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return '0:15';
  }

  const totalSeconds = Math.round(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const getAspectRatioLabel = ({ height, width }) => {
  if (!width || !height) {
    return undefined;
  }

  const value = width / height;
  const closeKnownRatio = KNOWN_ASPECT_RATIOS.find((ratio) => Math.abs(ratio.value - value) <= 0.03);

  if (closeKnownRatio) {
    return closeKnownRatio.label;
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const divisor = gcd(Math.round(width), Math.round(height));

  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
};

const loadImageMetadata = (src) => new Promise((resolve) => {
  if (typeof Image === 'undefined') {
    resolve({});
    return;
  }

  const image = new Image();
  let settled = false;
  const settle = (metadata = {}) => {
    if (settled) {
      return;
    }

    settled = true;
    resolve(metadata);
  };

  image.onload = () => settle({
    height: image.naturalHeight,
    width: image.naturalWidth,
  });
  image.onerror = () => settle({});
  image.src = src;
  window.setTimeout(() => settle({}), UPLOAD_METADATA_TIMEOUT_MS);
});

const getUploadVideoPosterTime = (duration) => {
  const safeDuration = Number.isFinite(duration) && duration > 0
    ? Math.max(duration - 0.05, 0)
    : 0;

  if (!safeDuration) {
    return 0;
  }

  return Math.min(Math.max(safeDuration * 0.22, 0.5), 4, safeDuration);
};

const captureUploadVideoPoster = (video) => {
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height || typeof document === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  const scale = Math.min(1, VIDEO_UPLOAD_POSTER_CAPTURE_MAX_WIDTH / width);
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', VIDEO_UPLOAD_POSTER_CAPTURE_QUALITY);
};

const loadVideoMetadata = (src) => new Promise((resolve) => {
  if (typeof document === 'undefined') {
    resolve({});
    return;
  }

  const video = document.createElement('video');
  let settled = false;
  let metadata = {};
  const settle = (nextMetadata = {}) => {
    if (settled) {
      return;
    }

    settled = true;
    resolve(nextMetadata);
  };
  const captureAndSettle = () => {
    try {
      settle({
        ...metadata,
        poster: captureUploadVideoPoster(video) || undefined,
      });
    } catch {
      settle(metadata);
    }
  };

  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;
  video.onloadedmetadata = () => {
    metadata = {
      duration: video.duration,
      height: video.videoHeight,
      width: video.videoWidth,
    };

    if (IS_JSDOM_ENV) {
      settle(metadata);
      return;
    }

    const posterTime = getUploadVideoPosterTime(video.duration);

    if (!posterTime) {
      captureAndSettle();
      return;
    }

    try {
      video.currentTime = posterTime;
    } catch {
      settle(metadata);
    }
  };
  video.onseeked = captureAndSettle;
  video.onerror = () => settle(metadata);
  video.src = src;
  if (!IS_JSDOM_ENV) {
    video.load?.();
  }
  window.setTimeout(() => settle(metadata), VIDEO_UPLOAD_POSTER_TIMEOUT_MS);
});

const createUploadedMediaAsset = async ({ file, index, type }) => {
  const src = createUploadObjectUrl(file);
  const format = getFileExtension(file.name) || (type === 'video' ? 'MP4' : 'IMAGE');
  const metadata = type === 'video'
    ? await loadVideoMetadata(src)
    : await loadImageMetadata(src);
  const dimensions = metadata.width && metadata.height ? `${metadata.width} x ${metadata.height}` : '';
  const sizeLabel = formatFileSize(file.size);
  const meta = [dimensions, format, sizeLabel].filter(Boolean).join(' ');

  return {
    id: `local-${type}-${Date.now()}-${index}-${file.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    type,
    name: file.name,
    title: file.name,
    src,
    alt: file.name,
    aspectRatio: getAspectRatioLabel(metadata),
    duration: type === 'video' ? formatDuration(metadata.duration) : undefined,
    fileType: file.type,
    format,
    height: metadata.height,
    isLocalUpload: true,
    meta,
    poster: type === 'video' ? metadata.poster : undefined,
    sizeLabel,
    width: metadata.width,
  };
};

const ALT_TEXT_AI_SUGGESTIONS = [
  'A hand holds a light blue rectangular color swatch over a marble table. Nearby are neutral-tone paper samples, dried floral stems, and textured stone pieces.',
  'Neutral creative materials are arranged on a marble surface with paper cards, textured samples, and soft natural light.',
  'A close-up composition of design swatches, paper textures, and dried stems on a light workspace.',
];

const ALT_TEXT_TRANSLATIONS = {
  Spanish: [
    'Una mano sostiene una muestra rectangular azul claro sobre una mesa de marmol. Cerca hay papeles en tonos neutros, tallos florales secos y piezas de piedra texturizada.',
    'Materiales creativos neutros estan organizados sobre una superficie de marmol con tarjetas de papel, muestras texturizadas y luz natural suave.',
    'Una composicion de cerca con muestras de diseno, texturas de papel y tallos secos sobre un espacio de trabajo claro.',
  ],
  French: [
    'Une main tient un echantillon rectangulaire bleu clair au-dessus d une table en marbre. Des papiers neutres, des tiges florales sechees et des pieces de pierre texturee sont a proximite.',
    'Des materiaux creatifs neutres sont disposes sur une surface en marbre avec des cartes papier, des echantillons textures et une lumiere naturelle douce.',
    'Une composition rapprochee de nuanciers, de textures de papier et de tiges sechees sur un espace de travail clair.',
  ],
  Italian: [
    'Una mano tiene un campione rettangolare azzurro sopra un tavolo di marmo. Vicino ci sono carte dai toni neutri, steli floreali secchi e pezzi di pietra testurizzata.',
    'Materiali creativi neutri sono disposti su una superficie di marmo con cartoncini, campioni testurizzati e luce naturale morbida.',
    'Una composizione ravvicinata di campioni di design, texture di carta e steli secchi su una postazione chiara.',
  ],
  Portuguese: [
    'Uma mao segura uma amostra retangular azul clara sobre uma mesa de marmore. Perto dela ha papeis em tons neutros, hastes florais secas e pecas de pedra texturizada.',
    'Materiais criativos neutros estao organizados sobre uma superficie de marmore com cartoes de papel, amostras texturizadas e luz natural suave.',
    'Uma composicao em close de amostras de design, texturas de papel e hastes secas em uma area de trabalho clara.',
  ],
};

const ALT_TEXT_TRANSLATE_LANGUAGES = Object.keys(ALT_TEXT_TRANSLATIONS);

const EMOJI_CATEGORIES = [
  { key: 'smileys', label: 'Smileys & People', icon: <SmileOutlined /> },
  { key: 'animals', label: 'Animals & Nature', icon: <BugOutlined /> },
  { key: 'food', label: 'Food & Drink', icon: <AppleOutlined /> },
  { key: 'activities', label: 'Activities', icon: <DribbbleOutlined /> },
  { key: 'travel', label: 'Travel & Places', icon: <CarOutlined /> },
  { key: 'objects', label: 'Objects', icon: <BulbOutlined /> },
  { key: 'symbols', label: 'Symbols', icon: <PercentageOutlined /> },
  { key: 'flags', label: 'Flags', icon: <FlagOutlined /> },
];

const getMockImageClass = (index) => `is-image-${(index % 5) + 1}`;

const MockImageThumb = ({ alt = '', index, className = '', src = null }) => {
  const classes = [
    'publishing-new-post-image-thumb',
    getMockImageClass(index),
    className,
  ].filter(Boolean).join(' ');

  return src ? (
    <img className={classes} src={src} alt={alt} loading="lazy" />
  ) : (
    <span className={classes} aria-hidden="true" />
  );
};

const MockVideoThumb = ({ item }) => (
  item.src ? (
    <video
      className="publishing-new-post-video-thumb"
      src={item.src}
      poster={item.poster || undefined}
      muted
      playsInline
      preload="auto"
      aria-label={item.alt || item.sourceName || item.label}
    />
  ) : (
    <span className="publishing-new-post-video-thumb" aria-hidden="true">
      <span className="publishing-new-post-video-thumb-person" />
      <span className="publishing-new-post-video-thumb-card" />
    </span>
  )
);

const formatAltTextNetworkLabel = (networkKeys = []) => {
  const labels = ALT_TEXT_NETWORK_ORDER
    .filter((networkKey) => networkKeys.includes(networkKey))
    .map((networkKey) => NETWORKS.find((network) => network.key === networkKey)?.label || networkKey);

  if (!labels.length) {
    return 'selected channels';
  }

  if (labels.length === 1) {
    return labels[0];
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(', ')}, and ${labels.at(-1)}`;
};

const EmojiPickerMenu = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [query, setQuery] = useState('');
  const activeMeta = EMOJI_CATEGORIES.find((category) => category.key === activeCategory) || EMOJI_CATEGORIES[0];
  const normalizedQuery = query.trim().toLowerCase();
  const emojiItems = normalizedQuery
    ? Object.values(EMOJI_GROUPS).flat().filter(([, name]) => name.includes(normalizedQuery))
    : EMOJI_GROUPS[activeCategory];

  const handleSelect = (emoji) => {
    onSelect(emoji);
    setOpen(false);
  };

  const pickerContent = (
    <div className="publishing-new-post-emoji-picker">
      <div className="publishing-new-post-emoji-header">
        <Text strong>Add Emoji</Text>
      </div>
      <div className="publishing-new-post-emoji-categories" role="tablist" aria-label="Emoji categories">
        {EMOJI_CATEGORIES.map((category) => (
          <Button
            key={category.key}
            type="text"
            role="tab"
            aria-label={category.label}
            aria-selected={activeCategory === category.key}
            className={[
              'publishing-new-post-emoji-category',
              activeCategory === category.key ? 'is-active' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => {
              setActiveCategory(category.key);
              setQuery('');
            }}
          >
            {category.icon}
          </Button>
        ))}
      </div>
      <div className="publishing-new-post-emoji-search">
        <Input
          autoFocus
          aria-label="Search emojis"
          placeholder="Search"
          suffix={<SearchOutlined />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="publishing-new-post-emoji-scroll">
        <Text className="publishing-new-post-emoji-group-title">{normalizedQuery ? 'Search Results' : activeMeta.label}</Text>
        <div className="publishing-new-post-emoji-grid">
          {emojiItems.map(([emoji, name]) => (
            <Button
              key={`${emoji}-${name}`}
              type="text"
              className="publishing-new-post-emoji-option"
              aria-label={name}
              onClick={() => handleSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>
      <div className="publishing-new-post-emoji-footer">
        <Text>Skin Tones</Text>
        <span className="publishing-new-post-emoji-skin-tone" aria-hidden="true" />
      </div>
    </div>
  );

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
      content={pickerContent}
      overlayClassName="publishing-new-post-emoji-popover"
      align={{ offset: [-2, 10] }}
    >
      <TooltipTarget title={open ? null : NEW_POST_TOOLTIPS.emoji}>
        <Button
          type="text"
          className={[
            'publishing-new-post-emoji-trigger',
            open ? 'is-open' : '',
          ].filter(Boolean).join(' ')}
          icon={<SmileOutlined />}
          aria-label={NEW_POST_TOOLTIPS.emoji}
        />
      </TooltipTarget>
    </Popover>
  );
};

const MediaUploadMenu = ({
  canUploadImages,
  canUploadMultipleVideos = true,
  canUploadVideo = true,
  children,
  onAddMedia,
  onOpenSource,
}) => {
  const [open, setOpen] = useState(false);
  const imageUploadInputRef = useRef(null);
  const videoUploadInputRef = useRef(null);

  const handleAction = (actionKey) => {
    if (actionKey === 'image' && !canUploadImages) {
      return;
    }

    if (actionKey === 'image') {
      triggerUploadFilePicker(imageUploadInputRef);
      return;
    }

    if (actionKey === 'video') {
      if (!canUploadVideo) {
        return;
      }

      triggerUploadFilePicker(videoUploadInputRef);
      return;
    }

    onOpenSource(actionKey);
    setOpen(false);
  };
  const handleLocalUpload = async (event, type) => {
    const selectedFiles = Array.from(event.target.files || []);
    const files = type === 'video' && !canUploadMultipleVideos
      ? selectedFiles.slice(0, 1)
      : selectedFiles;

    const uploadedAssets = await Promise.all(
      files.map((file, index) => createUploadedMediaAsset({ file, index, type })),
    );

    uploadedAssets.forEach((asset) => onAddMedia(type, asset.title, asset));
    resetUploadInput(event);
    setOpen(false);
  };

  const menuContent = (
    <div className="publishing-new-post-upload-menu">
      <input
        ref={imageUploadInputRef}
        aria-label="Choose image file"
        className="publishing-new-post-hidden-file-input"
        accept="image/*"
        multiple
        onChange={(event) => handleLocalUpload(event, 'image')}
        type="file"
      />
      <input
        ref={videoUploadInputRef}
        aria-label="Choose video file"
        className="publishing-new-post-hidden-file-input"
        accept="video/*"
        multiple={canUploadMultipleVideos}
        onChange={(event) => handleLocalUpload(event, 'video')}
        type="file"
      />
      <Text strong className="publishing-new-post-upload-section">My Media</Text>
      <Button type="text" block disabled className="publishing-new-post-upload-option" icon={<FileOutlined />}>
        <span>Upload Document</span>
      </Button>
      <Button
        type="text"
        block
        disabled={!canUploadImages}
        className="publishing-new-post-upload-option"
        icon={<PictureOutlined />}
        onClick={() => handleAction('image')}
      >
        <span>Upload Image(s)</span>
      </Button>
      <Button
        type="text"
        block
        disabled={!canUploadVideo}
        className="publishing-new-post-upload-option"
        icon={<VideoCameraOutlined />}
        onClick={() => handleAction('video')}
      >
        <span>Upload Video</span>
      </Button>
      <Button type="text" block className="publishing-new-post-upload-option" onClick={() => handleAction('bynder')}>
        <span className="publishing-new-post-upload-brand bynder" aria-hidden="true">B</span>
        <span>Bynder</span>
      </Button>
      <Button type="text" block className="publishing-new-post-upload-option" onClick={() => handleAction('dropbox')}>
        <span className="publishing-new-post-upload-brand dropbox" aria-hidden="true">D</span>
        <span>Dropbox</span>
      </Button>
      <Button type="text" block className="publishing-new-post-upload-option" onClick={() => handleAction('googleDrive')}>
        <span className="publishing-new-post-upload-brand drive" aria-hidden="true">G</span>
        <span>Google Drive</span>
      </Button>
      <Divider className="publishing-new-post-upload-divider" />
      <Text strong className="publishing-new-post-upload-section">Shared Media</Text>
      <Button type="text" block className="publishing-new-post-upload-option" icon={<FolderOpenOutlined />} onClick={() => handleAction('assetLibrary')}>
        <span>Asset Library</span>
      </Button>
    </div>
  );

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
      content={menuContent}
      overlayClassName="publishing-new-post-upload-popover"
      align={{ offset: [0, 12] }}
    >
      {children}
    </Popover>
  );
};

const ImageActionMenu = ({
  imageId,
  index,
  onAddAltText,
  onRemoveImage,
}) => {
  const [open, setOpen] = useState(false);
  const handleAddAltText = () => {
    setOpen(false);
    onAddAltText(imageId);
  };
  const handleRemoveImage = () => {
    setOpen(false);
    onRemoveImage(imageId);
  };
  const menuContent = (
    <div className="publishing-new-post-popover-action-list publishing-new-post-image-action-menu">
      <Button
        type="text"
        block
        aria-label="Add Alt Text"
        className="publishing-new-post-popover-action"
        icon={<EditOutlined />}
        onClick={handleAddAltText}
      >
        <span>Add Alt Text</span>
      </Button>
      <Button
        type="text"
        block
        danger
        aria-label="Remove Image"
        className="publishing-new-post-popover-action"
        icon={<DeleteOutlined />}
        onClick={handleRemoveImage}
      >
        <span>Remove Image</span>
      </Button>
    </div>
  );

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      content={menuContent}
      overlayClassName="publishing-new-post-image-action-popover"
      align={{ offset: [54, 8] }}
    >
      <Button
        type="text"
        shape="circle"
        className="publishing-new-post-media-edit"
        aria-label={`Edit image ${index + 1}`}
        icon={<EditOutlined />}
      />
    </Popover>
  );
};

const VideoActionMenu = ({
  canAddSubtitles,
  index,
  onOpenAssetLibrary,
  onOpenVideoOptions,
  onRemoveVideo,
  videoId,
}) => {
  const [open, setOpen] = useState(false);
  const thumbnailUploadInputRef = useRef(null);
  const handleOpenVideoOptions = () => {
    setOpen(false);
    onOpenVideoOptions(videoId);
  };
  const handleUploadThumbnail = () => {
    triggerUploadFilePicker(thumbnailUploadInputRef);
  };
  const handleThumbnailFileChange = (event) => {
    resetUploadInput(event);
    setOpen(false);
  };
  const handleOpenAssetLibrary = () => {
    setOpen(false);
    onOpenAssetLibrary();
  };
  const handleRemoveVideo = () => {
    setOpen(false);
    onRemoveVideo(videoId);
  };
  const menuContent = (
    <div className="publishing-new-post-popover-action-list publishing-new-post-video-action-menu">
      <input
        ref={thumbnailUploadInputRef}
        aria-label="Choose video thumbnail file"
        className="publishing-new-post-hidden-file-input"
        accept="image/*"
        onChange={handleThumbnailFileChange}
        type="file"
      />
      <Button
        type="text"
        block
        aria-label="Add video title"
        className="publishing-new-post-popover-action"
        icon={<VideoCameraOutlined />}
        onClick={handleOpenVideoOptions}
      >
        <span>Add video title</span>
      </Button>
      <Button
        type="text"
        block
        aria-label="Upload thumbnail"
        className="publishing-new-post-popover-action"
        icon={<UploadOutlined />}
        onClick={handleUploadThumbnail}
      >
        <span>Upload thumbnail</span>
      </Button>
      <Button
        type="text"
        block
        aria-label="Add thumbnail from Asset Library"
        className="publishing-new-post-popover-action"
        icon={<FolderOpenOutlined />}
        onClick={handleOpenAssetLibrary}
      >
        <span>Add thumbnail from Asset Library</span>
      </Button>
      <Button
        type="text"
        block
        aria-label="Choose a new thumbnail frame"
        className="publishing-new-post-popover-action"
        icon={<PictureOutlined />}
        onClick={handleOpenVideoOptions}
      >
        <span>Choose a new thumbnail frame</span>
      </Button>
      {canAddSubtitles ? (
        <Button
          type="text"
          block
          aria-label="Add subtitles to video"
          className="publishing-new-post-popover-action"
          icon={<FileOutlined />}
          onClick={handleOpenVideoOptions}
        >
          <span>Add subtitles to video</span>
        </Button>
      ) : null}
      <Button
        type="text"
        block
        danger
        aria-label="Remove video"
        className="publishing-new-post-popover-action"
        icon={<DeleteOutlined />}
        onClick={handleRemoveVideo}
      >
        <span>Remove video</span>
      </Button>
    </div>
  );

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      content={menuContent}
      overlayClassName="publishing-new-post-video-action-popover"
      align={{ offset: [54, 8] }}
    >
      <Button
        type="text"
        shape="circle"
        className="publishing-new-post-media-edit"
        aria-label={`Edit video ${index + 1}`}
        icon={<EditOutlined />}
      />
    </Popover>
  );
};

const MediaAssetGuidanceTooltip = ({ guidance }) => (
  guidance ? (
    <span className="publishing-new-post-media-guidance-tooltip">
      <Text strong>{guidance.message}:</Text>
      {' '}
      {guidance.description}
    </span>
  ) : null
);

const MediaTile = ({
  canUploadImages,
  media,
  networkKeys,
  onAddMedia,
  onAddAltText,
  onEditVideo,
  onOpenSource,
  onRemoveMedia,
  onReorderMedia,
}) => {
  const [draggedMediaId, setDraggedMediaId] = useState(null);
  const [dragOverMediaId, setDragOverMediaId] = useState(null);
  const canReorder = media.length > 1;
  const hasVideo = media.some((item) => item.type === 'video');
  const canUploadMultipleVideos = canUploadMultipleVideosForNetworks(networkKeys);
  const canUploadVideo = !(hasSingleVideoUploadLimit(networkKeys) && hasVideo);
  const showInlineUpload = canUploadVideo;
  const canAddVideoSubtitles = networkKeys.some((networkKey) => VIDEO_SUBTITLE_NETWORKS.has(networkKey));
  const clearDragState = () => {
    setDraggedMediaId(null);
    setDragOverMediaId(null);
  };
  const handleDragStart = (event, mediaId) => {
    if (!canReorder) {
      return;
    }

    setDraggedMediaId(mediaId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', mediaId);
  };
  const handleDragOver = (event, mediaId) => {
    if (!canReorder) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverMediaId(mediaId);
  };
  const handleDragLeave = (event, mediaId) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setDragOverMediaId((currentId) => (currentId === mediaId ? null : currentId));
  };
  const handleDrop = (event, targetMediaId) => {
    if (!canReorder) {
      return;
    }

    event.preventDefault();
    const sourceMediaId = event.dataTransfer.getData('text/plain') || draggedMediaId;

    if (sourceMediaId && sourceMediaId !== targetMediaId) {
      onReorderMedia?.(sourceMediaId, targetMediaId);
    }

    clearDragState();
  };

  return (
    <div
      className={[
        'publishing-new-post-media-row',
        media.length ? 'has-media' : 'is-empty',
        hasVideo ? 'has-video' : '',
      ].filter(Boolean).join(' ')}
      role={media.length ? 'list' : undefined}
      aria-label={media.length ? 'Attached media' : undefined}
    >
      {media.map((item, index) => {
        const guidance = getPrimaryMediaAssetGuidance({
          media,
          mediaItem: item,
          networkKeys,
        });
        const isDragTarget = dragOverMediaId === item.id && draggedMediaId !== item.id;

        return (
          <div
            key={item.id}
            className={[
              'publishing-new-post-media-tile',
              `is-${item.type}`,
              canReorder ? 'is-reorderable' : '',
              draggedMediaId === item.id ? 'is-dragging' : '',
              isDragTarget ? 'is-drag-over' : '',
            ].filter(Boolean).join(' ')}
            role="listitem"
            aria-label={`${item.label} media item ${index + 1}`}
            draggable={canReorder}
            onDragStart={(event) => handleDragStart(event, item.id)}
            onDragOver={(event) => handleDragOver(event, item.id)}
            onDragLeave={(event) => handleDragLeave(event, item.id)}
            onDrop={(event) => handleDrop(event, item.id)}
            onDragEnd={clearDragState}
          >
            {item.type === 'video' ? (
              <>
                <MockVideoThumb item={item} />
                {guidance ? (
                  <TooltipContent title={<MediaAssetGuidanceTooltip guidance={guidance} />}>
                    <span className="publishing-new-post-media-warning">
                      <WarningOutlined />
                    </span>
                  </TooltipContent>
                ) : null}
                <VideoActionMenu
                  canAddSubtitles={canAddVideoSubtitles}
                  index={index}
                  videoId={item.id}
                  onOpenVideoOptions={onEditVideo}
                  onOpenAssetLibrary={() => onOpenSource('assetLibrary')}
                  onRemoveVideo={onRemoveMedia}
                />
                <TooltipContent title={NEW_POST_TOOLTIPS.playVideo}>
                  <span className="publishing-new-post-media-play">{'>'}</span>
                </TooltipContent>
              </>
            ) : (
              <>
                <MockImageThumb index={index} src={item.src} alt={item.alt} />
                {guidance ? (
                  <TooltipContent title={<MediaAssetGuidanceTooltip guidance={guidance} />}>
                    <span className="publishing-new-post-media-warning">
                      <WarningOutlined />
                    </span>
                  </TooltipContent>
                ) : null}
                <ImageActionMenu
                  imageId={item.id}
                  index={index}
                  onAddAltText={onAddAltText}
                  onRemoveImage={onRemoveMedia}
                />
              </>
            )}
            {canReorder ? (
              <TooltipContent title="Move">
                <Button
                  type="text"
                  shape="circle"
                  draggable
                  className="publishing-new-post-media-move"
                  aria-label={`Move ${item.type} ${index + 1}`}
                  icon={<GripIco s={16} />}
                  onDragStart={(event) => handleDragStart(event, item.id)}
                  onDragEnd={clearDragState}
                />
              </TooltipContent>
            ) : null}
            <span>{item.label}</span>
            {item.type === 'video' ? (
              <span className="publishing-new-post-media-meta">
                {item.duration || '0:15'} | {item.aspectRatio || '9:16'} | {item.format || 'MP4'}
              </span>
            ) : null}
          </div>
        );
      })}
      {showInlineUpload ? (
        <TooltipTarget title={NEW_POST_TOOLTIPS.uploadMedia}>
          <MediaUploadMenu
            canUploadImages={canUploadImages}
            canUploadMultipleVideos={canUploadMultipleVideos}
            canUploadVideo={canUploadVideo}
            onAddMedia={onAddMedia}
            onOpenSource={onOpenSource}
          >
            <Button
              type="dashed"
              className="publishing-new-post-media-add"
              aria-label={NEW_POST_TOOLTIPS.uploadMedia}
            >
              <PlusOutlined />
            </Button>
          </MediaUploadMenu>
        </TooltipTarget>
      ) : null}
    </div>
  );
};

const ImageAltTextStatus = ({ imageCount, onAiAssist, onEditFirstImage }) => (
  <div className="publishing-new-post-alt-text-row">
    <Space size={0}>
      <Button type="link" onClick={onEditFirstImage}>
        Add alt text
      </Button>
      <NewPostAiAssistActions
        configLabel="Image Alt Text"
        onAiAssist={onAiAssist}
        primaryButtonType="link"
        sectionKeys={['imageAltText']}
      />
    </Space>
    <Text type="secondary">
      Alt text is missing for {imageCount} out of {imageCount} {imageCount === 1 ? 'image' : 'images'}
      {' '}
      <Button type="link" href="https://support.sproutsocial.com/" target="_blank">
        Learn more
      </Button>
    </Text>
  </div>
);

const AltTextTranslateMenu = ({ onSelectLanguage }) => {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const languages = normalizedQuery
    ? ALT_TEXT_TRANSLATE_LANGUAGES.filter((language) => language.toLowerCase().includes(normalizedQuery))
    : ALT_TEXT_TRANSLATE_LANGUAGES;

  return (
    <div className="publishing-new-post-alt-text-translate-menu">
      <Text strong>Translate to</Text>
      <Input
        autoFocus
        aria-label="Search translation language"
        placeholder="Search or type a language"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Text type="secondary">Recommendations</Text>
      <div>
        {languages.map((language) => (
          <Button
            key={language}
            type="text"
            block
            className="publishing-new-post-popover-action is-text-only"
            onClick={() => onSelectLanguage(language)}
          >
            <span>{language}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

const EditorToolbar = ({
  aiDisabled,
  canUploadImages,
  canUploadMultipleVideos,
  canUploadVideo,
  onAddMedia,
  onAiAssist,
  onEmojiSelect,
  onOpenSource,
}) => {
  const aiTooltip = aiDisabled ? NEW_POST_TOOLTIPS.aiAssistDisabled : NEW_POST_TOOLTIPS.aiAssist;

  return (
    <div className="publishing-new-post-editor-tools">
      <EmojiPickerMenu onSelect={onEmojiSelect} />
      <TooltipTarget title={NEW_POST_TOOLTIPS.uploadMedia}>
        <MediaUploadMenu
          canUploadImages={canUploadImages}
          canUploadMultipleVideos={canUploadMultipleVideos}
          canUploadVideo={canUploadVideo}
          onAddMedia={onAddMedia}
          onOpenSource={onOpenSource}
        >
          <Button type="text" icon={<CameraOutlined />} aria-label={NEW_POST_TOOLTIPS.uploadMedia} />
        </MediaUploadMenu>
      </TooltipTarget>
      <TooltipTarget title={NEW_POST_TOOLTIPS.importAsset}>
        <Button type="text" icon={<PictureOutlined />} aria-label={NEW_POST_TOOLTIPS.importAsset} onClick={() => onOpenSource('assetLibrary')} />
      </TooltipTarget>
      <TooltipTarget title={aiTooltip}>
        <NewPostAiAssistActions
          configLabel="Caption"
          disabled={aiDisabled}
          iconOnly
          moreButtonType="text"
          moreAriaLabel="Open AI configuration for Caption toolbar"
          onAiAssist={onAiAssist}
          popoverPlacement="bottomRight"
          primaryAriaLabel={NEW_POST_TOOLTIPS.aiAssist}
          primaryButtonType="text"
          sectionKeys={['captionBase', 'captionPerNetwork', 'hashtags']}
        />
      </TooltipTarget>
    </div>
  );
};

export const ComposerEditor = ({
  activeNetwork,
  availableNetworkKeys,
  captions,
  canUseStory = false,
  isDraft,
  isStory = false,
  media,
  mediaByNetwork = null,
  mode,
  onAddMedia,
  onAiAssist,
  onCaptionChange,
  onCustomize,
  onDraftChange,
  onStoryChange = () => {},
  onNetworkChange,
  onOpenSource,
  onOpenVideoOptions,
  onRemoveMedia,
  onReorderMedia,
  videoDetails,
  youtubeAudience = 'not-made-for-kids',
  youtubeTitle = '',
}) => {
  const [editingImageId, setEditingImageId] = useState(null);
  const [imageAltTextById, setImageAltTextById] = useState({});
  const [altTextAiState, setAltTextAiState] = useState({
    language: null,
    status: 'idle',
    suggestion: '',
    variant: 0,
  });
  const [altTextTranslateOpen, setAltTextTranslateOpen] = useState(false);
  const altTextAiTimerRef = useRef(null);
  const currentCaption = getCaptionForNetwork({ activeNetwork, captions, mode });
  const canSendToAiAssist = media.length > 0;
  const getMediaForNetwork = (networkKey) => (
    mode === 'per_network'
      ? mediaByNetwork?.[networkKey] || []
      : media
  );
  const hasVideo = media.some((item) => item.type === 'video');
  const imageMedia = media.filter((item) => item.type === 'image');
  const editingImageMediaIndex = imageMedia.findIndex((item) => item.id === editingImageId);
  const editingImage = imageMedia[editingImageMediaIndex] || null;
  const editingImageDisplayIndex = editingImage ? media.findIndex((item) => item.id === editingImage.id) : -1;
  const editingImageAltText = editingImage ? imageAltTextById[editingImage.id] || '' : '';
  const scopedNetworkKeys = mode === 'per_network' ? [activeNetwork] : availableNetworkKeys;
  const altTextNetworkLabel = formatAltTextNetworkLabel(scopedNetworkKeys);
  const maxLength = mode === 'per_network'
    ? PLATFORM_CHAR_LIMITS[activeNetwork] || 5000
    : 500;
  const remaining = Math.max(maxLength - currentCaption.length, 0);
  const visibleNetworks = NETWORKS.filter((network) => availableNetworkKeys.includes(network.key));
  const networkValidationItemsByKey = visibleNetworks.reduce((accumulator, network) => {
    accumulator[network.key] = getPublishingAssetValidationItems({
      isDraft,
      media: getMediaForNetwork(network.key),
      networkKeys: [network.key],
      youtubeAudience,
      youtubeTitle,
    });
    return accumulator;
  }, {});
  const uploadImageNetworkKeys = mode === 'per_network'
    ? [activeNetwork]
    : availableNetworkKeys;
  const canUploadImages = canUploadImagesForNetworks(uploadImageNetworkKeys);
  const hasVideoUploadLimit = hasSingleVideoUploadLimit(scopedNetworkKeys);
  const canUploadMultipleVideos = canUploadMultipleVideosForNetworks(scopedNetworkKeys);
  const canUploadVideo = !(hasVideoUploadLimit && hasVideo);
  const canAddVideoSubtitles = scopedNetworkKeys.some((networkKey) => VIDEO_SUBTITLE_NETWORKS.has(networkKey));
  const updateCaptionValue = (value) => {
    const nextKey = mode === 'per_network' ? activeNetwork : 'all';
    onCaptionChange(nextKey, value);
  };
  const appendEmoji = (selectedEmoji) => {
    updateCaptionValue(`${currentCaption}${selectedEmoji}`);
  };
  const clearAltTextAiTimer = () => {
    if (altTextAiTimerRef.current) {
      window.clearTimeout(altTextAiTimerRef.current);
      altTextAiTimerRef.current = null;
    }
  };
  useEffect(() => {
    if (!canUseStory && isStory) {
      onStoryChange(false);
    }
  }, [canUseStory, isStory, onStoryChange]);
  useEffect(() => () => clearAltTextAiTimer(), []);
  useEffect(() => {
    clearAltTextAiTimer();
    setAltTextAiState({
      language: null,
      status: 'idle',
      suggestion: '',
      variant: editingImageMediaIndex >= 0 ? editingImageMediaIndex : 0,
    });
    setAltTextTranslateOpen(false);
  }, [editingImageId, editingImageMediaIndex]);
  useEffect(() => {
    if (editingImageId && !media.some((item) => item.id === editingImageId)) {
      setEditingImageId(null);
    }
  }, [editingImageId, media]);
  useEffect(() => {
    const imageIds = new Set(media.filter((item) => item.type === 'image').map((item) => item.id));

    setImageAltTextById((current) => {
      const nextEntries = Object.entries(current).filter(([imageId]) => imageIds.has(imageId));

      if (nextEntries.length === Object.keys(current).length) {
        return current;
      }

      return Object.fromEntries(nextEntries);
    });
  }, [media]);
  const handleImageAltTextChange = (value) => {
    if (!editingImage) {
      return;
    }

    setImageAltTextById((current) => ({ ...current, [editingImage.id]: value }));
  };
  const runAltTextAiAssist = ({ language = null, variant = 0 } = {}) => {
    if (!editingImage) {
      return;
    }

    clearAltTextAiTimer();
    setAltTextTranslateOpen(false);
    setAltTextAiState((current) => ({
      ...current,
      language,
      status: 'loading',
      suggestion: '',
      variant,
    }));

    altTextAiTimerRef.current = window.setTimeout(() => {
      const suggestions = language
        ? ALT_TEXT_TRANSLATIONS[language] || ALT_TEXT_AI_SUGGESTIONS
        : ALT_TEXT_AI_SUGGESTIONS;

      setAltTextAiState({
        language,
        status: 'ready',
        suggestion: suggestions[Math.abs(variant) % suggestions.length],
        variant,
      });
      altTextAiTimerRef.current = null;
    }, ALT_TEXT_AI_DELAY);
  };
  const handleAltTextAiGenerate = () => {
    runAltTextAiAssist({
      language: null,
      variant: editingImageMediaIndex >= 0 ? editingImageMediaIndex : 0,
    });
  };
  const handleAltTextAiRegenerate = () => {
    runAltTextAiAssist({
      language: altTextAiState.language,
      variant: altTextAiState.variant + 1,
    });
  };
  const handleAltTextAiTranslate = (language) => {
    runAltTextAiAssist({
      language,
      variant: altTextAiState.variant,
    });
  };
  const handleAltTextAiApprove = () => {
    if (altTextAiState.status === 'ready' && altTextAiState.suggestion) {
      handleImageAltTextChange(altTextAiState.suggestion);
    }
  };
  const closeAltTextAiAssist = () => {
    clearAltTextAiTimer();
    setAltTextTranslateOpen(false);
    setAltTextAiState((current) => ({
      ...current,
      status: 'idle',
      suggestion: '',
    }));
  };
  const handleRemoveImage = (mediaId) => {
    onRemoveMedia(mediaId);

    if (editingImageId === mediaId) {
      setEditingImageId(null);
    }
  };
  const moveAltTextImage = (direction) => {
    if (!imageMedia.length) {
      return;
    }

    const currentIndex = editingImageMediaIndex >= 0 ? editingImageMediaIndex : 0;
    const nextIndex = (currentIndex + direction + imageMedia.length) % imageMedia.length;
    setEditingImageId(imageMedia[nextIndex].id);
  };
  const handleStoryChange = (checked) => {
    if (!canUseStory) {
      return;
    }

    onStoryChange(checked);
  };
  const getNetworkTabTooltip = (networkKey, label) => {
    const firstIssue = networkValidationItemsByKey[networkKey]?.[0];
    return firstIssue?.description || label;
  };

  return (
    <>
      <div
        className={`publishing-new-post-network-tabs ${mode === 'per_network' ? 'is-platform-tabs' : 'is-all-networks'}`}
        role={mode === 'per_network' ? 'tablist' : undefined}
        aria-label={mode === 'per_network' ? 'Customize post per network' : undefined}
      >
        {mode === 'all_networks' ? (
          <Button type="text" className="publishing-new-post-network-tab-button is-active">
            {availableNetworkKeys.length ? 'All Networks' : 'No Channels'}
          </Button>
        ) : visibleNetworks.map((network) => (
          <TooltipContent
            key={network.key}
            title={getNetworkTabTooltip(network.key, network.label)}
            classNames={{
              root: 'publishing-new-post-network-tab-tooltip',
              container: 'publishing-new-post-network-tab-tooltip-inner',
              arrow: 'publishing-new-post-network-tab-tooltip-arrow',
            }}
          >
            <Button
              type="text"
              role="tab"
              aria-selected={activeNetwork === network.key}
              aria-label={`Customize post for ${network.label}`}
              title={network.label}
              className={[
                'publishing-new-post-network-tab-button',
                activeNetwork === network.key ? 'is-active' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onNetworkChange(network.key)}
            >
              <span className="publishing-new-post-network-tab-icon">
                <PlatformIcon platform={network.key} size="tab" />
              </span>
              {networkValidationItemsByKey[network.key]?.length ? (
                <span className="publishing-new-post-network-tab-dot" aria-hidden="true" />
              ) : null}
            </Button>
          </TooltipContent>
        ))}
      </div>
      <div className="publishing-new-post-editor">
        {mode === 'all_networks' ? (
          <div className="publishing-new-post-story-row">
            <Text strong>This is a story</Text>
            <TooltipTarget title={canUseStory ? null : NEW_POST_TOOLTIPS.storyUnavailable}>
              <Switch
                aria-label="This is a story"
                checked={isStory}
                disabled={!canUseStory}
                onChange={handleStoryChange}
              />
            </TooltipTarget>
          </div>
        ) : null}
        {!isStory ? (
          <>
            <div className="publishing-new-post-caption-header">
              <Text strong>Caption</Text>
              <NewPostAiAssistActions
                configLabel="Caption"
                disabled={!canSendToAiAssist}
                onAiAssist={() => onAiAssist?.(['captionBase', 'captionPerNetwork', 'hashtags'])}
                primaryButtonType="link"
                sectionKeys={['captionBase', 'captionPerNetwork', 'hashtags']}
              />
            </div>
            <Input.TextArea
              value={currentCaption}
              onChange={(event) => updateCaptionValue(event.target.value)}
              autoSize={false}
              placeholder="Start writing your post..."
              className="publishing-new-post-caption"
            />
            <Divider style={{ margin: '0 14px' }} />
          </>
        ) : null}
        <MediaTile
          canUploadImages={canUploadImages}
          media={media}
          networkKeys={scopedNetworkKeys}
          onAddMedia={onAddMedia}
          onAddAltText={setEditingImageId}
          onEditVideo={onOpenVideoOptions}
          onOpenSource={onOpenSource}
          onRemoveMedia={handleRemoveImage}
          onReorderMedia={onReorderMedia}
        />
        {imageMedia.length ? (
          <ImageAltTextStatus
            imageCount={imageMedia.length}
            onAiAssist={() => onAiAssist?.(['imageAltText'])}
            onEditFirstImage={() => setEditingImageId(imageMedia[0].id)}
          />
        ) : null}
        {hasVideo && canAddVideoSubtitles ? (
          <div className="publishing-new-post-video-caption-row">
            <Space size={0}>
              <Button type="link" onClick={onOpenVideoOptions}>
                Add video subtitles
              </Button>
              <NewPostAiAssistActions
                configLabel="Subtitles"
                onAiAssist={() => onAiAssist?.(['subtitles'])}
                primaryButtonType="link"
                sectionKeys={['subtitles']}
              />
            </Space>
            <Text type="secondary">
              {videoDetails.subtitles === 'not-added' ? 'Subtitles are missing for your video.' : 'Subtitles are ready for this video.'}
            </Text>
          </div>
        ) : null}
        {!isStory ? (
          <div className="publishing-new-post-editor-footer">
            <EditorToolbar
              aiDisabled={!canSendToAiAssist}
              canUploadImages={canUploadImages}
              canUploadMultipleVideos={canUploadMultipleVideos}
              canUploadVideo={canUploadVideo}
              onAddMedia={onAddMedia}
              onAiAssist={() => onAiAssist?.(['captionBase', 'captionPerNetwork', 'hashtags'])}
              onEmojiSelect={appendEmoji}
              onOpenSource={onOpenSource}
            />
            <Text>{remaining}</Text>
          </div>
        ) : null}
      </div>
      <div className="publishing-new-post-composer-action-row">
        <Button
          className={mode === 'per_network' ? 'publishing-new-post-customize is-active' : 'publishing-new-post-customize'}
          disabled={!availableNetworkKeys.length || isStory}
          icon={<RetweetOutlined />}
          onClick={onCustomize}
        >
          {mode === 'per_network' ? 'Use same post across networks' : 'Customize post per network'}
        </Button>
        <Space>
          <Text>This is a Draft</Text>
          <Switch aria-label="This is a Draft" checked={isDraft} onChange={onDraftChange} />
        </Space>
      </div>
      <Modal
        title={(
          <div className="publishing-new-post-alt-text-title">
            <Text strong>Edit Alt Text for {altTextNetworkLabel}</Text>
            <Text type="secondary">Alt text describes the contents of the image making it more accessible.</Text>
          </div>
        )}
        open={Boolean(editingImage)}
        onCancel={() => setEditingImageId(null)}
        width={720}
        className="publishing-new-post-alt-text-modal"
        footer={(
          <div className="publishing-new-post-alt-text-footer">
            <Space>
              <Button type="text" onClick={() => setEditingImageId(null)}>Cancel All</Button>
              <Button type="primary" onClick={() => setEditingImageId(null)}>Save All</Button>
            </Space>
          </div>
        )}
      >
        {editingImage ? (
          <>
            <Button
              type="text"
              shape="circle"
              className="publishing-new-post-alt-text-side-nav is-prev"
              aria-label="Previous image preview"
              disabled={imageMedia.length < 2}
              icon={<LeftOutlined />}
              onClick={() => moveAltTextImage(-1)}
            />
            <Button
              type="text"
              shape="circle"
              className="publishing-new-post-alt-text-side-nav is-next"
              aria-label="Next image preview"
              disabled={imageMedia.length < 2}
              icon={<RightOutlined />}
              onClick={() => moveAltTextImage(1)}
            />
            <div className="publishing-new-post-alt-text-editor">
              <div className="publishing-new-post-alt-text-preview">
                <div className="publishing-new-post-alt-text-preview-frame">
                  <MockImageThumb
                    index={editingImageDisplayIndex}
                    src={editingImage.src}
                    alt={editingImage.alt}
                  />
                </div>
                <Text type="secondary">
                  pexels-karola-g... ({editingImageMediaIndex + 1}/{imageMedia.length})
                </Text>
              </div>
              <label className="publishing-new-post-alt-text-field">
                <Input.TextArea
                  value={editingImageAltText}
                  maxLength={1000}
                  onChange={(event) => handleImageAltTextChange(event.target.value)}
                  autoSize={false}
                  placeholder="Describe this image for accessibility"
                />
                <span className="publishing-new-post-alt-text-field-footer">
                  <NewPostAiAssistActions
                    configLabel="Image Alt Text"
                    onAiAssist={handleAltTextAiGenerate}
                    primaryButtonType="link"
                    primaryLabel="Generate by AI Assist"
                    sectionKeys={['imageAltText']}
                  />
                  <Text type="secondary">{1000 - editingImageAltText.length}</Text>
                </span>
            </label>
            {altTextAiState.status !== 'idle' ? (
              <div className={`publishing-new-post-alt-text-ai-card is-${altTextAiState.status}`}>
                <div>
                  <SparkleIco s={16} color={C.aiBlue} />
                  <Text strong>Generate by AI Assist</Text>
                  <Button
                    type="text"
                    shape="circle"
                    aria-label="Close AI Assist suggestion"
                    icon={<CloseOutlined />}
                    onClick={closeAltTextAiAssist}
                  />
                </div>
                {altTextAiState.status === 'loading' ? (
                  <div className="publishing-new-post-alt-text-ai-loading" aria-label="Generating alt text">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <>
                    <p className="publishing-new-post-alt-text-ai-suggestion">
                      {altTextAiState.suggestion}
                    </p>
                    <Text type="secondary">
                      Review AI-generated content before saving alt text.
                    </Text>
                    <div className="publishing-new-post-alt-text-ai-actions">
                      <Button
                        type="text"
                        aria-label="Approve"
                        icon={<CheckOutlined />}
                        onClick={handleAltTextAiApprove}
                      >
                        Approve
                      </Button>
                      <Button
                        type="text"
                        aria-label="Regenerate"
                        icon={<SyncOutlined />}
                        onClick={handleAltTextAiRegenerate}
                      >
                        Regenerate
                      </Button>
                      <Popover
                        trigger="click"
                        placement="bottomLeft"
                        open={altTextTranslateOpen}
                        onOpenChange={setAltTextTranslateOpen}
                        overlayClassName="publishing-new-post-alt-text-translate-popover"
                        content={<AltTextTranslateMenu onSelectLanguage={handleAltTextAiTranslate} />}
                      >
                        <Button type="text" aria-label="Translate" icon={<GlobalOutlined />}>
                          Translate
                        </Button>
                      </Popover>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
      </Modal>
    </>
  );
};
