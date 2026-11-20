import { isMessageTypeCoveredByScope } from './messageTypes';

export const TAG_COLLECTIONS = [
  {
    id: 'campaigns',
    name: 'Campaigns',
    icon: 'book',
    tags: [
      '7th anniversary',
      '8 Aniversario',
      '9 Anniversary',
      'AirDrop',
      'BLUE LOCK',
      'Bunnyverse',
      'Bunnywarrior',
      'Cifras de Fuego',
      'Coachella',
      'Cuackmania',
      'Delta Force VN',
      'Dia Booyah',
      'Digimon',
      'DoD',
      'Duo Perfecto',
      'Campaign',
    ],
  },
  {
    id: 'always-on',
    name: 'Always On',
    icon: 'book',
    tags: ['Always On', 'Community', 'Event'],
  },
  {
    id: 'aov',
    name: 'AOV',
    icon: 'book',
    tags: ['AOV', 'Esports', 'Tips', 'Video'],
  },
  {
    id: 'campaign',
    name: 'Campaign',
    icon: 'book',
    tags: ['Campaign', 'Commerce', 'Editorial'],
  },
  {
    id: 'country',
    name: 'Country',
    icon: 'book',
    tags: ['LATAM', 'Regional', 'Vietnam'],
  },
  {
    id: 'delta-force-vn',
    name: 'Delta Force VN',
    icon: 'book',
    tags: ['Delta Force VN'],
  },
  {
    id: 'esports',
    name: 'Esports',
    icon: 'book',
    tags: ['Esports', 'Video'],
  },
  {
    id: 'kols',
    name: 'KOLs',
    icon: 'book',
    tags: ['KOLs'],
  },
  {
    id: 'latam',
    name: 'LATAM',
    icon: 'book',
    tags: ['LATAM', 'LATAM / [Product] We heard you', 'Regional'],
  },
  {
    id: 'regional',
    name: 'Regional',
    icon: 'book',
    tags: ['Regional'],
  },
  {
    id: 'unclassified',
    name: 'Tags (unclassified)',
    icon: 'book',
    tags: ['announcement', 'Livestream', 'Food'],
  },
  {
    id: 'archived',
    name: 'Archived',
    icon: 'book',
    archived: true,
    tags: [],
  },
];

export const SYSTEM_TAGS = [
  {
    id: 'sentiment-positive',
    name: 'Message Positive',
    category: 'Sentiment',
    sourceSystem: 'Social Hub',
    appliesTo: ['all-facebook', 'all-instagram', 'all-youtube'],
    description: 'Automatically marks messages where the detected audience sentiment is positive.',
    example: 'Player praises event rewards, gameplay, or support response.',
    usageCount: 128,
    enabled: true,
  },
  {
    id: 'sentiment-negative',
    name: 'Message Negative',
    category: 'Sentiment',
    sourceSystem: 'Social Hub',
    appliesTo: ['all-facebook', 'all-instagram', 'all-youtube'],
    description: 'Automatically marks messages where the detected audience sentiment is negative.',
    example: 'Player complains about matchmaking, bugs, latency, revenue events, or pricing.',
    usageCount: 74,
    enabled: true,
  },
  {
    id: 'sentiment-neutral',
    name: 'Message Neutral',
    category: 'Sentiment',
    sourceSystem: 'Social Hub',
    appliesTo: ['all-facebook', 'all-instagram', 'all-youtube'],
    description: 'Automatically marks messages that are informational, questions, or neutral feedback.',
    example: 'Player asks when a new event starts or where to claim rewards.',
    usageCount: 216,
    enabled: true,
  },
  {
    id: 'alert-revenue-event-complaint',
    name: 'Complaint about Revenue event XXX',
    category: 'Alert',
    sourceSystem: 'Social Listening',
    appliesTo: [
      'facebook-comments',
      'facebook-ad-comments',
      'instagram-comments',
      'instagram-ad-comments',
      'youtube-video-comments',
    ],
    description: 'Imported alert tag for messages linked to complaint spikes about a revenue event.',
    example: 'Audience reports that Revenue event XXX pricing or rewards feel unfair.',
    usageCount: 32,
    enabled: true,
  },
  {
    id: 'alert-cs-escalation',
    name: 'Needs CS escalation',
    category: 'Alert',
    sourceSystem: 'Social Hub',
    appliesTo: ['facebook-comments', 'facebook-private-messages', 'instagram-comments', 'instagram-direct-messages'],
    description: 'Automatically marks messages that mention account, payment, ban, or recovery issues.',
    example: 'Player asks support to recover a banned account or failed payment.',
    usageCount: 19,
    enabled: true,
  },
  {
    id: 'post-performance-drop',
    name: 'Post Performance Drop',
    category: 'Performance',
    sourceSystem: 'Social Hub',
    appliesTo: ['facebook-wall-posts', 'youtube-video-comments'],
    description: 'Automatically marks published posts whose engagement is materially below baseline.',
    example: 'A scheduled campaign post underperforms the last 30-day average.',
    usageCount: 11,
    enabled: true,
  },
  {
    id: 'campaign-risk',
    name: 'Campaign Risk',
    category: 'Campaign',
    sourceSystem: 'Social Listening',
    appliesTo: ['facebook-wall-posts', 'facebook-comments', 'instagram-mentions', 'youtube-video-comments'],
    description: 'Imported risk signal for content connected to an active campaign or launch window.',
    example: 'Negative discussion starts increasing around a campaign keyword.',
    usageCount: 27,
    enabled: true,
  },
];

export const getUniqueManagedTags = (collections = TAG_COLLECTIONS) => (
  Array.from(new Set(
    collections
      .filter((collection) => !collection.archived)
      .flatMap((collection) => collection.tags),
  )).sort((left, right) => (
    left.localeCompare(right)
  ))
);

export const getCalendarTagOptions = (posts, collections = TAG_COLLECTIONS) => {
  const postTags = new Set(posts.flatMap((post) => post.tags));
  return getUniqueManagedTags(collections)
    .filter((tag) => postTags.has(tag))
    .map((tag) => ({ label: tag, value: tag }));
};

export const getTagUsageByName = (posts) => posts.reduce((usage, post) => {
  post.tags.forEach((tag) => {
    usage[tag] = (usage[tag] || 0) + 1;
  });

  return usage;
}, {});

export const getEnabledSystemTags = (systemTags = SYSTEM_TAGS) => (
  systemTags.filter((tag) => tag.enabled)
);

export const resolveMessageSystemTags = (message, systemTags = SYSTEM_TAGS) => {
  const tagsById = new Map(getEnabledSystemTags(systemTags).map((tag) => [tag.id, tag]));

  return (message.systemTagIds || [])
    .map((tagId) => tagsById.get(tagId))
    .filter(Boolean)
    .filter((tag) => (
      !message.messageType
      || tag.appliesTo.some((scope) => isMessageTypeCoveredByScope(scope, message.messageType))
    ));
};
