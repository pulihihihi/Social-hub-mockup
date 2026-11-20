const hasNetwork = (context = {}, networkKey) => (
  Array.isArray(context.selectedNetworks) && context.selectedNetworks.includes(networkKey)
);

const hasVideo = (context = {}) => Boolean(context.hasVideo);
const hasImage = (context = {}) => Boolean(context.hasImage);
const supportsFirstComment = (context = {}) => Boolean(context.supportsStandaloneFirstComment);

export const NEW_POST_AI_GROUPS = [
  {
    key: 'write',
    label: 'Write the post',
    description: 'Create the words people will read first.',
  },
  {
    key: 'media',
    label: 'Prepare media',
    description: 'Generate accessibility and subtitle support for your uploaded assets.',
  },
  {
    key: 'channels',
    label: 'Optimize for channels',
    description: 'Adjust the post for each network and apply channel-specific defaults.',
  },
  {
    key: 'publishing',
    label: 'Publishing setup',
    description: 'Recommend workflows, tags, and schedule choices.',
  },
  {
    key: 'final',
    label: 'Final check',
    description: 'Surface issues and review how the post will read before publishing.',
  },
];

export const NEW_POST_AI_PRESETS = [
  {
    key: 'basic',
    label: 'Basic post',
    description: 'Caption, first comment, and a final check.',
  },
  {
    key: 'publish-ready',
    label: 'Publish-ready',
    description: 'Use all recommended help for this post.',
  },
  {
    key: 'video',
    label: 'Video package',
    description: 'Focus on subtitles and video-specific channel setup.',
  },
  {
    key: 'custom',
    label: 'Custom',
    description: 'Pick each task yourself.',
  },
];

export const NEW_POST_AI_SECTIONS = [
  {
    key: 'captionBase',
    groupKey: 'write',
    label: 'Caption',
    description: 'Write the main Delta Force post caption.',
    userDescription: 'Write the main post caption.',
    skills: ['delta-force-post-orchestrator', 'media-context-reader', 'caption-writer', 'cta-checker'],
    knowledge: ['delta-force-overview', 'delta-force-content-pillars', 'delta-force-publishing-objectives'],
  },
  {
    key: 'captionPerNetwork',
    groupKey: 'write',
    label: 'Adjust caption for each channel',
    description: 'Adapt copy for the selected networks.',
    userDescription: 'Adjust the caption for each selected channel.',
    skills: ['network-variant-adapter', 'caption-shortener', 'tiktok-hook-and-caption-adapter'],
    knowledge: ['cross-platform-hashtag-guardrails', 'tiktok-creative-best-practices', 'youtube-title-description-tag-rules'],
  },
  {
    key: 'hashtags',
    groupKey: 'write',
    label: 'Hashtags',
    description: 'Generate a compact hashtag set.',
    userDescription: 'Suggest a compact hashtag set.',
    skills: ['hashtag-writer'],
    knowledge: ['cross-platform-hashtag-guardrails', 'delta-force-core-terms'],
  },
  {
    key: 'firstComment',
    groupKey: 'write',
    label: 'First comment',
    description: 'Draft a reply-driving first comment.',
    userDescription: 'Draft a first comment to drive replies.',
    isRelevant: supportsFirstComment,
    skills: ['first-comment-writer', 'cta-checker'],
    knowledge: ['delta-force-publishing-objectives'],
  },
  {
    key: 'imageAltText',
    groupKey: 'media',
    label: 'Describe images for accessibility',
    description: 'Generate accessible alt text for images.',
    userDescription: 'Describe uploaded images for accessibility.',
    isRelevant: hasImage,
    skills: ['image-context-reader', 'alt-text-writer'],
    knowledge: ['alt-text-guidelines'],
  },
  {
    key: 'threadsAltText',
    groupKey: 'media',
    label: 'Describe Threads video',
    description: 'Generate Threads video alt text.',
    userDescription: 'Describe the Threads video for accessibility.',
    isRelevant: (context) => hasVideo(context) && hasNetwork(context, 'threads'),
    skills: ['video-context-reader', 'threads-alt-text-writer'],
    knowledge: ['alt-text-guidelines', 'threads-reply-quote-rules'],
  },
  {
    key: 'subtitles',
    groupKey: 'media',
    label: 'Subtitles',
    description: 'Generate an editable subtitle draft.',
    userDescription: 'Generate an editable subtitle draft.',
    isRelevant: hasVideo,
    skills: ['video-context-reader', 'subtitle-generator', 'subtitle-reviewer'],
    knowledge: ['subtitle-accessibility-guidelines'],
  },
  {
    key: 'youtubeTitle',
    groupKey: 'channels',
    label: 'YouTube title',
    description: 'Write a title for the YouTube upload.',
    userDescription: 'Write a title for the YouTube upload.',
    isRelevant: (context) => hasVideo(context) && hasNetwork(context, 'youtube'),
    skills: ['video-context-reader', 'youtube-title-writer'],
    knowledge: ['youtube-gaming-metadata-rules', 'youtube-title-description-tag-rules'],
  },
  {
    key: 'youtubeTags',
    groupKey: 'channels',
    label: 'YouTube tags',
    description: 'Generate concise YouTube tags and keywords.',
    userDescription: 'Suggest YouTube tags and keywords.',
    isRelevant: (context) => hasVideo(context) && hasNetwork(context, 'youtube'),
    skills: ['youtube-description-keyword-writer', 'youtube-tag-writer'],
    knowledge: ['youtube-title-description-tag-rules'],
  },
  {
    key: 'facebookVideoOptions',
    groupKey: 'channels',
    label: 'Facebook settings',
    description: 'Set Facebook placement and category defaults.',
    userDescription: 'Set Facebook video defaults.',
    isRelevant: (context) => hasVideo(context) && hasNetwork(context, 'facebook'),
    skills: ['facebook-video-option-automation', 'facebook-category-recommender'],
    knowledge: ['facebook-video-posting-rules'],
  },
  {
    key: 'instagramOptions',
    groupKey: 'channels',
    label: 'Instagram settings',
    description: 'Recommend Instagram reel option defaults.',
    userDescription: 'Set Instagram reel defaults.',
    isRelevant: (context) => hasVideo(context) && hasNetwork(context, 'instagram'),
    skills: ['instagram-option-automation', 'instagram-feed-share-decider'],
    knowledge: ['instagram-reel-posting-rules'],
  },
  {
    key: 'threadsOptions',
    groupKey: 'channels',
    label: 'Threads settings',
    description: 'Recommend reply controls for Threads.',
    userDescription: 'Set reply controls for Threads.',
    isRelevant: (context) => hasNetwork(context, 'threads'),
    skills: ['threads-reply-control-recommender'],
    knowledge: ['threads-reply-quote-rules'],
  },
  {
    key: 'youtubeOptions',
    groupKey: 'channels',
    label: 'YouTube settings',
    description: 'Complete audience, category, and advanced YouTube settings.',
    userDescription: 'Set audience, category, and advanced YouTube settings.',
    isRelevant: (context) => hasVideo(context) && hasNetwork(context, 'youtube'),
    skills: [
      'youtube-category-game-mapper',
      'youtube-audience-checker',
      'youtube-age-restriction-checker',
      'youtube-license-embedding-notify-automation',
    ],
    knowledge: ['youtube-gaming-metadata-rules', 'youtube-audience-age-restriction-rules'],
  },
  {
    key: 'tiktokOptions',
    groupKey: 'channels',
    label: 'TikTok settings',
    description: 'Apply Delta Force TikTok option defaults.',
    userDescription: 'Apply TikTok defaults.',
    isRelevant: (context) => hasVideo(context) && hasNetwork(context, 'tiktok'),
    skills: ['tiktok-option-automation'],
    knowledge: ['tiktok-post-option-rules'],
  },
  {
    key: 'approvalWorkflow',
    groupKey: 'publishing',
    label: 'Approval workflow',
    description: 'Recommend the workflow route for this post.',
    userDescription: 'Recommend the approval workflow.',
    skills: ['approval-workflow-recommender'],
    knowledge: ['delta-force-approval-mobile-publisher-rules', 'delta-force-workstream-scope'],
  },
  {
    key: 'mobilePublisher',
    groupKey: 'publishing',
    label: 'Assign mobile publisher if needed',
    description: 'Recommend a mobile publisher when needed.',
    userDescription: 'Assign a mobile publisher if needed.',
    skills: ['mobile-publisher-recommender'],
    knowledge: ['delta-force-approval-mobile-publisher-rules'],
  },
  {
    key: 'labels',
    groupKey: 'publishing',
    label: 'Tags',
    description: 'Recommend existing local tags.',
    userDescription: 'Recommend existing tags.',
    skills: ['labels-recommender'],
    knowledge: ['delta-force-labels-and-campaign-usage', 'delta-force-dau-event-taxonomy'],
  },
  {
    key: 'schedule',
    groupKey: 'publishing',
    label: 'Schedule',
    description: 'Suggest a schedule baseline.',
    userDescription: 'Suggest a schedule baseline.',
    skills: ['schedule-strategy-suggester', 'schedule-by-network-adapter', 'optimal-time-assistant'],
    knowledge: ['delta-force-audience-segments', 'delta-force-public-season-event-patterns'],
  },
  {
    key: 'validation',
    groupKey: 'final',
    label: 'Check missing setup',
    description: 'Explain missing or risky post settings.',
    userDescription: 'Check for missing or risky setup.',
    skills: ['validation-fixer', 'metadata-completeness-checker', 'compliance-risk-checker', 'story-eligibility-checker'],
    knowledge: ['socialhub-new-post-module-map', 'youtube-audience-age-restriction-rules'],
  },
  {
    key: 'previewQA',
    groupKey: 'final',
    label: 'Final preview check',
    description: 'Review how the generated output will read in preview.',
    userDescription: 'Review how the post will read in preview.',
    skills: ['preview-qa-checker'],
    knowledge: ['socialhub-new-post-module-map', 'cross-platform-hashtag-guardrails'],
  },
];

const PRESET_SECTION_KEYS = {
  basic: ['captionBase', 'hashtags', 'firstComment', 'validation', 'previewQA'],
  'publish-ready': NEW_POST_AI_SECTIONS.map((section) => section.key),
  video: [
    'captionBase',
    'captionPerNetwork',
    'subtitles',
    'threadsAltText',
    'youtubeTitle',
    'youtubeTags',
    'facebookVideoOptions',
    'instagramOptions',
    'threadsOptions',
    'youtubeOptions',
    'tiktokOptions',
    'validation',
    'previewQA',
  ],
};

export const NEW_POST_AI_DEFAULT_SECTION_KEYS = PRESET_SECTION_KEYS['publish-ready'];

export const NEW_POST_AI_BUTTON_GROUPS = {
  caption: ['captionBase', 'captionPerNetwork', 'hashtags'],
  firstComment: ['firstComment'],
  imageAltText: ['imageAltText'],
  subtitles: ['subtitles'],
  facebookVideo: ['facebookVideoOptions'],
  instagram: ['instagramOptions'],
  threads: ['threadsAltText', 'threadsOptions'],
  youtube: ['youtubeTitle', 'youtubeTags', 'youtubeOptions'],
  tiktok: ['tiktokOptions'],
  workflow: ['approvalWorkflow', 'mobilePublisher'],
  taxonomy: ['labels'],
  schedule: ['schedule'],
  validation: ['validation', 'previewQA'],
};

const groupMap = new Map(NEW_POST_AI_GROUPS.map((group) => [group.key, group]));
const sectionMap = new Map(NEW_POST_AI_SECTIONS.map((section) => [section.key, section]));

export const getNewPostAiSection = (sectionKey) => (
  sectionMap.get(sectionKey) || null
);

export const getNewPostAiSections = (sectionKeys = []) => (
  sectionKeys
    .map((sectionKey) => getNewPostAiSection(sectionKey))
    .filter(Boolean)
);

export const getNewPostAiGroup = (groupKey) => groupMap.get(groupKey) || null;

export const getNewPostAiPresetSectionKeys = (presetKey, sections = NEW_POST_AI_SECTIONS) => {
  if (presetKey === 'custom') {
    return sections
      .filter((section) => section.isRelevant !== false)
      .map((section) => section.key);
  }

  const allowedKeys = new Set((PRESET_SECTION_KEYS[presetKey] || PRESET_SECTION_KEYS['publish-ready']));

  return sections
    .filter((section) => section.isRelevant !== false && allowedKeys.has(section.key))
    .map((section) => section.key);
};

export const matchNewPostAiPreset = (sectionKeys = [], sections = NEW_POST_AI_SECTIONS) => {
  const normalizedKeys = [...new Set(sectionKeys)].sort().join('|');

  const matchedPreset = NEW_POST_AI_PRESETS
    .filter((preset) => preset.key !== 'custom')
    .find((preset) => (
      getNewPostAiPresetSectionKeys(preset.key, sections)
        .sort()
        .join('|') === normalizedKeys
    ));

  return matchedPreset?.key || 'custom';
};

export const attachNewPostAiGroupMeta = (section) => ({
  ...section,
  group: getNewPostAiGroup(section.groupKey),
});
