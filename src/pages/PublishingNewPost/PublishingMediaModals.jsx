import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from 'antd';
import {
  AppstoreOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  SearchOutlined,
  TableOutlined,
  TranslationOutlined,
  VideoCameraOutlined,
  FilterOutlined,
  FolderOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import { ViewModeSegmented } from '../../components/ViewModeSegmented';
import {
  assets,
  authorOptions,
  contextOptions,
  folders,
  sortOptions,
} from '../PublishingAssetLibrary/assetLibraryData';
import {
  matchesAssetFilters,
  matchesFolderFilters,
} from '../PublishingAssetLibrary/assetLibraryUtils';
import { NewPostAiAssistActions } from './NewPostAiAssistActions';
import { TooltipContent } from './PublishingTooltip';

const { Text } = Typography;

const VIDEO_OPTION_TOOLTIPS = {
  subtitleFiles: 'Subtitle file upload supported for X, Facebook, LinkedIn, LinkedIn Company, and YouTube only.',
  thumbnailFrame: 'Choosing a thumbnail frame is not supported by Threads.',
  videoTitle: 'Video title is required for YouTube videos.',
};
const MAX_VIDEO_OPTION_FRAMES = 20;
const DEFAULT_SUBTITLE_LANGUAGE = 'English (United States)';
const SUBTITLE_LANGUAGE_OPTIONS = [
  DEFAULT_SUBTITLE_LANGUAGE,
  'Spanish (Mexico)',
  'French (France)',
  'Italian (Italy)',
  'Portuguese (Brazil)',
  'Arabic (Saudi Arabia)',
  'Chinese (China)',
  'Vietnamese (Vietnam)',
].map((language) => ({ label: language, value: language }));
const MOCK_AI_SUBTITLE_TEXT = `1
00:00:00,000 --> 00:00:02,000
Hay subscribe cho kenh Ghien Mi Go De khong bo lo nhung video hap dan

2
00:00:30,000 --> 00:00:32,000
Hay subscribe cho kenh Ghien Mi Go De khong bo lo nhung video hap dan

3
00:01:00,000 --> 00:01:02,000
Hay subscribe cho kenh Ghien Mi Go De khong bo lo nhung video hap dan

4
00:01:30,000 --> 00:01:32,000
Hay subscribe cho kenh Ghien Mi Go De khong bo lo nhung video hap dan

5
00:02:00,000 --> 00:02:02,000
Hay subscribe cho kenh Ghien Mi Go De khong bo lo nhung video hap dan`;

const getTranslatedSubtitleText = (language) => `1
00:00:00,000 --> 00:00:02,000
Translated subtitle preview for ${language}.

2
00:00:30,000 --> 00:00:32,000
Translated subtitle preview for ${language}.`;

const assetIconByType = {
  image: FileImageOutlined,
  video: VideoCameraOutlined,
  text: FileTextOutlined,
  template: AppstoreOutlined,
};

const tagOptions = Array.from(new Set(assets.flatMap((asset) => asset.tags || [])))
  .map((tag) => ({ label: tag, value: tag }));

const getSummary = (values, options) => {
  if (!values.length) {
    return 'Viewing all';
  }

  const labels = values.map((value) => options.find((option) => option.value === value)?.label || value);
  return labels.length > 1 ? `${labels[0]} +${labels.length - 1}` : labels[0];
};

const AssetLibraryTypeIcon = ({ type }) => {
  const Icon = assetIconByType[type] || FileTextOutlined;
  return <Icon className="publishing-new-post-asset-library-icon" />;
};

const AssetLibraryFolderCard = ({ folder }) => (
  <button type="button" className="publishing-new-post-asset-library-folder">
    <FolderOutlined />
    <span>{folder.name}</span>
  </button>
);

const AssetLibraryCard = ({ asset, selected, onToggle }) => (
  <article
    role="button"
    tabIndex={0}
    aria-pressed={selected}
    className={[
      'publishing-new-post-asset-library-card',
      selected ? 'is-selected' : '',
    ].filter(Boolean).join(' ')}
    onClick={() => onToggle(asset.id)}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onToggle(asset.id);
      }
    }}
  >
    <header>
      <span>
        <AssetLibraryTypeIcon type={asset.type} />
        <Text strong>{asset.name}</Text>
      </span>
      <Checkbox checked={selected} aria-label={`Select ${asset.name}`} onChange={() => onToggle(asset.id)} onClick={(event) => event.stopPropagation()} />
    </header>
    {asset.src ? (
      <div className={`publishing-new-post-asset-library-media is-${asset.type}`}>
        {asset.type === 'video' ? (
          <video src={asset.src} muted playsInline preload="metadata" aria-label={asset.name} />
        ) : (
          <img src={asset.src} alt={asset.name} loading="lazy" />
        )}
      </div>
    ) : (
      <p>{asset.content}</p>
    )}
  </article>
);

const AssetLibraryPicker = ({
  onAddMedia,
  onCancel,
  open,
}) => {
  const [viewMode, setViewMode] = useState('tiles');
  const [showAllFolders, setShowAllFolders] = useState(false);
  const [sortOrder, setSortOrder] = useState('date-newest');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [filters, setFilters] = useState({ context: [], tags: [], authors: [] });
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const visibleFolders = useMemo(
    () => folders.filter((folder) => matchesFolderFilters(folder, filters)),
    [filters],
  );
  const visibleAssets = useMemo(
    () => assets.filter((asset) => matchesAssetFilters(asset, filters)),
    [filters],
  );
  const activeFilterCount = filters.context.length + filters.tags.length + filters.authors.length;
  const updateFilter = (key, values) => {
    setFilters((current) => ({ ...current, [key]: values }));
  };
  const clearFilters = () => setFilters({ context: [], tags: [], authors: [] });
  const toggleSelectedAsset = (assetId) => {
    setSelectedAssetIds((current) => (
      current.includes(assetId)
        ? current.filter((id) => id !== assetId)
        : [...current, assetId]
    ));
  };
  const attachSelectedAssets = () => {
    selectedAssetIds
      .map((assetId) => assets.find((asset) => asset.id === assetId))
      .filter(Boolean)
      .forEach((asset) => {
        const mediaType = asset.type === 'video' ? 'video' : 'image';
        onAddMedia(mediaType, asset.name, asset.mediaAsset);
      });

    setSelectedAssetIds([]);
    onCancel();
  };

  return (
    <Modal
      title="Choose From Asset Library"
      open={open}
      width={760}
      onCancel={onCancel}
      className="publishing-new-post-asset-library-modal"
      footer={(
        <div className="publishing-new-post-asset-library-footer">
          <Text>{selectedAssetIds.length} selected</Text>
          <Space>
            <Button type="text" onClick={onCancel}>Cancel</Button>
            <Button type="primary" disabled={!selectedAssetIds.length} onClick={attachSelectedAssets}>Attach</Button>
          </Space>
        </div>
      )}
    >
      <div className="publishing-new-post-asset-library">
        <div className="publishing-new-post-asset-library-toolbar">
          <Input prefix={<SearchOutlined />} placeholder="Search all assets for..." />
          <Space size={6}>
            <ViewModeSegmented
              ariaLabel="Select how you want to display assets"
              value={viewMode}
              onChange={setViewMode}
              options={[
                {
                  ariaLabel: 'Display assets in table',
                  icon: <TableOutlined />,
                  tooltip: 'Display assets in table',
                  value: 'table',
                },
                {
                  ariaLabel: 'Display assets in tiles',
                  icon: <AppstoreOutlined />,
                  tooltip: 'Display assets in tiles',
                  value: 'tiles',
                },
              ]}
            />
            <Button
              className="publishing-new-post-asset-library-filter-button"
              icon={<FilterOutlined />}
              onClick={() => setFiltersVisible((visible) => !visible)}
            >
              Filters
            </Button>
          </Space>
        </div>

        {filtersVisible ? (
          <PublishingFilterBar
            ariaLabel="Asset Library Filters"
            activeCount={activeFilterCount}
            onClearAll={clearFilters}
            showClearAll
            disableClearWhenInactive={false}
            className="publishing-new-post-asset-library-filters"
          >
            <PublishingFilterCell
              title="Asset Type"
              summary={getSummary(filters.context, contextOptions)}
              activeCount={filters.context.length}
              popoverWidth={260}
            >
              <Checkbox.Group
                value={filters.context}
                onChange={(values) => updateFilter('context', values)}
                className="publishing-new-post-asset-library-checkboxes"
              >
                {contextOptions.map((option) => (
                  <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                ))}
              </Checkbox.Group>
            </PublishingFilterCell>
            <PublishingFilterCell
              title="Tags"
              summary={getSummary(filters.tags, tagOptions)}
              activeCount={filters.tags.length}
              popoverWidth={260}
            >
              <Checkbox.Group
                value={filters.tags}
                onChange={(values) => updateFilter('tags', values)}
                className="publishing-new-post-asset-library-checkboxes"
              >
                {tagOptions.map((option) => (
                  <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                ))}
              </Checkbox.Group>
            </PublishingFilterCell>
            <PublishingFilterCell
              title="Asset Authors"
              summary={getSummary(filters.authors, authorOptions)}
              activeCount={filters.authors.length}
              popoverWidth={240}
            >
              <Checkbox.Group
                value={filters.authors}
                onChange={(values) => updateFilter('authors', values)}
                className="publishing-new-post-asset-library-checkboxes"
              >
                {authorOptions.map((option) => (
                  <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                ))}
              </Checkbox.Group>
            </PublishingFilterCell>
          </PublishingFilterBar>
        ) : null}

        <div className="publishing-new-post-asset-library-controls">
          <Select
            aria-label="Sort assets"
            value={sortOrder}
            options={sortOptions}
            onChange={setSortOrder}
          />
          <label>
            <Text>Show assets from all folders</Text>
            <Switch checked={showAllFolders} onChange={setShowAllFolders} />
          </label>
        </div>

        <section className="publishing-new-post-asset-library-section">
          <Text strong>Folders ({visibleFolders.length})</Text>
          <div className="publishing-new-post-asset-library-folder-grid">
            {visibleFolders.map((folder) => <AssetLibraryFolderCard key={folder.id} folder={folder} />)}
          </div>
        </section>

        <section className="publishing-new-post-asset-library-section">
          <Text strong>Assets ({visibleAssets.length})</Text>
          <div className="publishing-new-post-asset-library-grid">
            {visibleAssets.map((asset) => (
              <AssetLibraryCard
                key={asset.id}
                asset={asset}
                selected={selectedAssetIds.includes(asset.id)}
                onToggle={toggleSelectedAsset}
              />
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
};

export const AssetSourcePicker = ({
  assetItems,
  onAddMedia,
  onCancel,
  open,
  sourceKey,
  sourceMeta,
}) => {
  const source = sourceMeta[sourceKey] || sourceMeta.assetLibrary;
  const sourceItems = assetItems.filter((item) => (
    sourceKey === 'assetLibrary' || item.source === source.label
  ));

  if (sourceKey === 'assetLibrary') {
    return (
      <AssetLibraryPicker
        onAddMedia={onAddMedia}
        onCancel={onCancel}
        open={open}
      />
    );
  }

  return (
    <Modal
      title={source.label}
      open={open}
      width={760}
      onCancel={onCancel}
      footer={null}
    >
      <div className="publishing-new-post-asset-picker">
        <aside className="publishing-new-post-asset-picker-nav">
          {Object.entries(sourceMeta).map(([key, item]) => (
            <button
              key={key}
              type="button"
              className={key === sourceKey ? 'is-active' : ''}
              onClick={() => onCancel(key)}
            >
              <Text strong={key === sourceKey}>{item.label}</Text>
              <Text type="secondary">{item.section}</Text>
            </button>
          ))}
        </aside>
        <section className="publishing-new-post-asset-picker-body">
          <Text type="secondary">{source.description}</Text>
          <Input placeholder={`Search ${source.label}`} />
          <div className="publishing-new-post-asset-grid">
            {sourceItems.map((item) => (
              <div key={item.id} className={`publishing-new-post-asset-card is-${item.type}`}>
                <div className="publishing-new-post-asset-thumb">
                  {item.src && item.type === 'image' ? <img src={item.src} alt={item.title} loading="lazy" /> : null}
                  {item.src && item.type === 'video' ? <video src={item.src} muted playsInline preload="metadata" aria-label={item.title} /> : null}
                  {!item.src && (item.type === 'video' ? <VideoCameraOutlined /> : <PictureOutlined />)}
                  {item.type === 'video' ? <span className="publishing-new-post-media-play">{'>'}</span> : null}
                </div>
                <Text strong>{item.title}</Text>
                <Text type="secondary">{item.meta}</Text>
                <Button
                  block
                  onClick={() => {
                    onAddMedia(item.type, item.title, item.mediaAsset);
                    onCancel();
                  }}
                >
                  Insert
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Modal>
  );
};

export const VideoOptionsModal = ({
  onCancel,
  onSave,
  onVideoDetailsChange,
  open,
  setYoutubeTitle,
  video,
  videoDetails,
  youtubeTitle,
}) => {
  const subtitleFileInputRef = useRef(null);
  const videoFrameRef = useRef(null);
  const [selectedFrame, setSelectedFrame] = useState(1);
  const [videoFrameDuration, setVideoFrameDuration] = useState(0);
  const [subtitleStatus, setSubtitleStatus] = useState(videoDetails.subtitles || 'not-added');
  const [subtitleLanguage, setSubtitleLanguage] = useState(videoDetails.subtitleLanguage || DEFAULT_SUBTITLE_LANGUAGE);
  const [subtitleFileName, setSubtitleFileName] = useState(videoDetails.subtitleFileName || '');
  const [subtitleDraft, setSubtitleDraft] = useState(videoDetails.subtitleText || MOCK_AI_SUBTITLE_TEXT);
  const [reviewSubtitleStatus, setReviewSubtitleStatus] = useState(videoDetails.subtitles || 'uploaded');
  const [reviewSubtitleLanguage, setReviewSubtitleLanguage] = useState(videoDetails.subtitleLanguage || DEFAULT_SUBTITLE_LANGUAGE);
  const [reviewSubtitleFileName, setReviewSubtitleFileName] = useState(videoDetails.subtitleFileName || '');
  const [reviewSubtitleDraft, setReviewSubtitleDraft] = useState(videoDetails.subtitleText || MOCK_AI_SUBTITLE_TEXT);
  const [finishUploadOpen, setFinishUploadOpen] = useState(false);
  const [translationPanelOpen, setTranslationPanelOpen] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState(undefined);
  const subtitlesReady = subtitleStatus !== 'not-added';
  const shouldShowSubtitleRow = subtitlesReady;
  const frameProgress = ((selectedFrame - 1) / (MAX_VIDEO_OPTION_FRAMES - 1)) * 100;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setSelectedFrame(1);
    setVideoFrameDuration(0);

    return undefined;
  }, [open, video?.src]);

  useEffect(() => {
    const videoNode = videoFrameRef.current;

    if (!videoNode || !video?.src || !videoFrameDuration) {
      return undefined;
    }

    const safeDuration = Math.max(videoFrameDuration - 0.05, 0);
    const nextTime = ((selectedFrame - 1) / (MAX_VIDEO_OPTION_FRAMES - 1)) * safeDuration;

    try {
      videoNode.pause();
      videoNode.currentTime = nextTime;
    } catch {
      // Browser media seeking can be temporarily blocked until metadata is ready.
    }

    return undefined;
  }, [selectedFrame, video?.src, videoFrameDuration]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setSubtitleStatus(videoDetails.subtitles || 'not-added');
    setSubtitleLanguage(videoDetails.subtitleLanguage || DEFAULT_SUBTITLE_LANGUAGE);
    setSubtitleFileName(videoDetails.subtitleFileName || '');
    setSubtitleDraft(videoDetails.subtitleText || MOCK_AI_SUBTITLE_TEXT);
    setReviewSubtitleStatus(videoDetails.subtitles || 'uploaded');
    setReviewSubtitleLanguage(videoDetails.subtitleLanguage || DEFAULT_SUBTITLE_LANGUAGE);
    setReviewSubtitleFileName(videoDetails.subtitleFileName || '');
    setReviewSubtitleDraft(videoDetails.subtitleText || MOCK_AI_SUBTITLE_TEXT);
    setFinishUploadOpen(false);
    setTranslationPanelOpen(false);
    setTranslationLanguage(undefined);

    return undefined;
  }, [open, videoDetails.subtitleFileName, videoDetails.subtitleLanguage, videoDetails.subtitleText, videoDetails.subtitles]);

  const updateSelectedFrame = (value) => {
    const nextFrame = Math.min(MAX_VIDEO_OPTION_FRAMES, Math.max(1, Number(value)));
    setSelectedFrame(nextFrame);
  };
  const handleFrameVideoMetadata = (event) => {
    const duration = Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0;

    setVideoFrameDuration(duration);

    try {
      event.currentTarget.pause();
      event.currentTarget.currentTime = 0;
    } catch {
      // Keep the modal usable if the browser has not made the stream seekable yet.
    }
  };
  const moveFrame = (step) => updateSelectedFrame(selectedFrame + step);
  const openSubtitleFilePicker = () => {
    subtitleFileInputRef.current?.click();
  };
  const openSubtitleReview = ({
    fileName,
    language = DEFAULT_SUBTITLE_LANGUAGE,
    status,
    text = MOCK_AI_SUBTITLE_TEXT,
  }) => {
    setReviewSubtitleStatus(status);
    setReviewSubtitleLanguage(language);
    setReviewSubtitleFileName(fileName);
    setReviewSubtitleDraft(text);
    setFinishUploadOpen(true);
  };
  const handleSubtitleFileChange = (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    openSubtitleReview({
      fileName: file.name,
      status: 'uploaded',
    });
    event.target.value = '';
  };
  const handleGenerateAiSubtitles = () => {
    openSubtitleReview({
      fileName: 'generated-caption.srt',
      status: 'auto',
      text: MOCK_AI_SUBTITLE_TEXT,
    });
    setTranslationPanelOpen(false);
  };
  const handleDeleteSubtitles = () => {
    setSubtitleStatus('not-added');
    setSubtitleLanguage(DEFAULT_SUBTITLE_LANGUAGE);
    setSubtitleFileName('');
    setSubtitleDraft(MOCK_AI_SUBTITLE_TEXT);
    setFinishUploadOpen(false);
    setTranslationPanelOpen(false);
    setTranslationLanguage(undefined);
    onVideoDetailsChange({
      subtitleFileName: '',
      subtitleLanguage: '',
      subtitleText: '',
      subtitles: 'not-added',
    });
  };
  const handleDownloadSubtitles = () => {
    message.success(`${subtitleFileName || 'generated-caption.srt'} is ready to download.`);
  };
  const handleOpenSubtitleReview = () => {
    openSubtitleReview({
      fileName: subtitleFileName || 'generated-caption.srt',
      language: subtitleLanguage,
      status: subtitleStatus === 'not-added' ? 'uploaded' : subtitleStatus,
      text: subtitleDraft,
    });
  };
  const handleCancelSubtitleReview = () => {
    setFinishUploadOpen(false);
  };
  const handleSaveSubtitleReview = () => {
    setSubtitleStatus(reviewSubtitleStatus);
    setSubtitleLanguage(reviewSubtitleLanguage);
    setSubtitleFileName(reviewSubtitleFileName);
    setSubtitleDraft(reviewSubtitleDraft);
    onVideoDetailsChange({
      subtitleFileName: reviewSubtitleFileName || 'generated-caption.srt',
      subtitleLanguage: reviewSubtitleLanguage,
      subtitleText: reviewSubtitleDraft,
      subtitles: reviewSubtitleStatus,
    });
    setFinishUploadOpen(false);
    message.success('Subtitle file saved.');
  };
  const handleTranslateSubtitles = () => {
    if (!translationLanguage) {
      return;
    }

    const translatedText = getTranslatedSubtitleText(translationLanguage);
    setSubtitleLanguage(translationLanguage);
    setSubtitleDraft(translatedText);
    setSubtitleStatus('translated');
    setSubtitleFileName('generated-caption-translated.srt');
    setTranslationPanelOpen(false);
    onVideoDetailsChange({
      subtitleFileName: 'generated-caption-translated.srt',
      subtitleLanguage: translationLanguage,
      subtitleText: translatedText,
      subtitles: 'translated',
    });
    message.success(`Subtitle file translated to ${translationLanguage}.`);
  };

  return (
    <>
      <Modal
        title="Video Options"
        open={open}
        width={760}
        onCancel={onCancel}
        className="publishing-new-post-video-options-modal"
        footer={(
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={onSave}>Save</Button>
          </Space>
        )}
      >
        <div className="publishing-new-post-video-options">
          <div className="publishing-new-post-video-options-preview">
            <div
              className={[
                'publishing-new-post-video-options-frame',
                video?.src ? 'has-video' : '',
              ].filter(Boolean).join(' ')}
              style={{
                '--video-frame-pan': `${(selectedFrame - 1) * -6}px`,
                '--video-frame-progress': `${frameProgress}%`,
              }}
            >
              {video?.src ? (
                <video
                  key={video.src}
                  ref={videoFrameRef}
                  className="publishing-new-post-video-options-frame-video"
                  src={video.src}
                  poster={video.poster || undefined}
                  muted
                  playsInline
                  preload="auto"
                  onLoadedMetadata={handleFrameVideoMetadata}
                  aria-label={video.label || video.sourceName || 'Selected video preview'}
                />
              ) : null}
            <TooltipContent title={VIDEO_OPTION_TOOLTIPS.thumbnailFrame}>
              <span
                className="publishing-new-post-video-options-frame-info"
                aria-label="Thumbnail frame support information"
                role="img"
                tabIndex={0}
              >
                <InfoCircleOutlined />
              </span>
            </TooltipContent>
              <span className="publishing-new-post-video-options-play" aria-hidden="true">
                <VideoCameraOutlined />
              </span>
            </div>
            <input
              aria-label="Select generated video thumbnail frame"
              className="publishing-new-post-video-options-scrubber"
              max={MAX_VIDEO_OPTION_FRAMES}
              min={1}
              onChange={(event) => updateSelectedFrame(event.target.value)}
              style={{ '--video-frame-progress': `${frameProgress}%` }}
              type="range"
              value={selectedFrame}
            />
            <div className="publishing-new-post-video-options-pager">
              <Button
                aria-label="Previous generated video frame"
                disabled={selectedFrame === 1}
                onClick={() => moveFrame(-1)}
                size="small"
                type="text"
              >
                {'<'}
              </Button>
              <Text type="secondary">{selectedFrame} / {MAX_VIDEO_OPTION_FRAMES}</Text>
              <Button
                aria-label="Next generated video frame"
                disabled={selectedFrame === MAX_VIDEO_OPTION_FRAMES}
                onClick={() => moveFrame(1)}
                size="small"
                type="text"
              >
                {'>'}
              </Button>
            </div>
          </div>

          <div className="publishing-new-post-video-options-fields">
            <label>
              <Text strong className="publishing-new-post-video-options-label">
                Video Title (Required)
                <TooltipContent title={VIDEO_OPTION_TOOLTIPS.videoTitle}>
                  <InfoCircleOutlined
                    aria-label="Video title information"
                    className="publishing-new-post-video-options-info"
                    tabIndex={0}
                  />
                </TooltipContent>
              </Text>
              <Input
                value={youtubeTitle}
                onChange={(event) => setYoutubeTitle(event.target.value)}
                placeholder="Add a title for your video"
              />
            </label>

            <div className="publishing-new-post-subtitle-files">
              <Text strong className="publishing-new-post-video-options-label">
                Subtitle Files
                <TooltipContent title={VIDEO_OPTION_TOOLTIPS.subtitleFiles}>
                  <InfoCircleOutlined
                    aria-label="Subtitle file upload information"
                    className="publishing-new-post-video-options-info"
                    tabIndex={0}
                  />
                </TooltipContent>
              </Text>
              <div className="publishing-new-post-subtitle-actions">
                <input
                  ref={subtitleFileInputRef}
                  aria-label="Choose subtitle file"
                  className="publishing-new-post-hidden-file-input"
                  accept=".srt,.vtt,.sbv,.sub,.ttml,.dfxp"
                  onChange={handleSubtitleFileChange}
                  type="file"
                />
                <Button
                  aria-label="Upload subtitle file"
                  disabled={shouldShowSubtitleRow}
                  icon={<FileOutlined />}
                  onClick={openSubtitleFilePicker}
                >
                  Upload
                </Button>
                <NewPostAiAssistActions
                  configLabel="Subtitles"
                  disabled={shouldShowSubtitleRow}
                  moreButtonType="default"
                  onAiAssist={handleGenerateAiSubtitles}
                  popoverPlacement="bottomRight"
                  primaryButtonType="default"
                  primaryLabel="Generate by AI Assist"
                  sectionKeys={['subtitles']}
                  size="middle"
                />
              </div>
              {shouldShowSubtitleRow ? (
                <div className="publishing-new-post-subtitle-card">
                  <div className="publishing-new-post-subtitle-card-main">
                    <Text>{subtitleLanguage}</Text>
                    <Space size={8}>
                      <TooltipContent title="Translate">
                        <Button
                          aria-label="Translate subtitle file"
                          icon={<TranslationOutlined />}
                          shape="circle"
                          type="text"
                          onClick={() => setTranslationPanelOpen((current) => !current)}
                        />
                      </TooltipContent>
                      <TooltipContent title="Edit subtitle file">
                        <Button
                          aria-label="Edit subtitle file"
                          icon={<EditOutlined />}
                          shape="circle"
                          type="text"
                          onClick={handleOpenSubtitleReview}
                        />
                      </TooltipContent>
                      <TooltipContent title="Download">
                        <Button
                          aria-label="Download subtitle file"
                          icon={<DownloadOutlined />}
                          shape="circle"
                          type="text"
                          onClick={handleDownloadSubtitles}
                        />
                      </TooltipContent>
                      <TooltipContent title="Remove subtitle file">
                        <Button
                          aria-label="Remove subtitle file"
                          icon={<DeleteOutlined />}
                          shape="circle"
                          type="text"
                          onClick={handleDeleteSubtitles}
                        />
                      </TooltipContent>
                    </Space>
                  </div>
                </div>
              ) : (
                <Text type="secondary">Subtitles are missing for your video.</Text>
              )}
              {translationPanelOpen ? (
                <div className="publishing-new-post-subtitle-translate-panel">
                  <Text strong>Select translation language</Text>
                  <Select
                    aria-label="Select subtitle translation language"
                    placeholder="Select a language for your SRT file"
                    value={translationLanguage}
                    options={SUBTITLE_LANGUAGE_OPTIONS}
                    onChange={setTranslationLanguage}
                  />
                  <Space className="publishing-new-post-subtitle-translate-actions">
                    <Button type="text" onClick={() => setTranslationPanelOpen(false)}>Cancel</Button>
                    <Button type="primary" disabled={!translationLanguage} onClick={handleTranslateSubtitles}>Translate</Button>
                  </Space>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title={reviewSubtitleFileName ? `Edit ${reviewSubtitleFileName}` : 'Finish Upload'}
        open={finishUploadOpen}
        width={1080}
        destroyOnHidden
        onCancel={handleCancelSubtitleReview}
        className="publishing-new-post-subtitle-review-modal"
        footer={(
          <Space>
            <Button aria-label="Cancel subtitle review" onClick={handleCancelSubtitleReview}>Cancel</Button>
            <Button aria-label="Save subtitle review" type="primary" onClick={handleSaveSubtitleReview}>Save</Button>
          </Space>
        )}
      >
        <Text type="secondary">Select your video language and review the file</Text>
        <div className="publishing-new-post-subtitle-review">
          <section className="publishing-new-post-subtitle-review-editor">
            <label>
              <Text strong>Select Language*</Text>
              <Select
                aria-label="Select subtitle file language"
                value={reviewSubtitleLanguage}
                options={SUBTITLE_LANGUAGE_OPTIONS}
                onChange={setReviewSubtitleLanguage}
              />
            </label>
            <Input.TextArea
              aria-label="Subtitle file content"
              value={reviewSubtitleDraft}
              onChange={(event) => setReviewSubtitleDraft(event.target.value)}
            />
          </section>
          <aside className="publishing-new-post-subtitle-review-preview">
            <Text strong>Video Preview</Text>
            <div className="publishing-new-post-subtitle-review-video">
              {video?.src ? (
                <video src={video.src} poster={video.poster || undefined} controls preload="metadata" />
              ) : (
                <span className="publishing-new-post-subtitle-review-placeholder">
                  <VideoCameraOutlined />
                </span>
              )}
            </div>
          </aside>
        </div>
      </Modal>
    </>
  );
};

