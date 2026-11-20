/**
 * AI Skill page data - local markdown-backed assets plus lightweight marketplace mocks.
 */

export const SKILL_CATEGORIES = [
  { value: 'Research & Analysis', label: 'Research & Analysis' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Creative Production', label: 'Creative Production' },
  { value: 'Campaign Execution', label: 'Campaign Execution' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Data & Automation', label: 'Data & Automation' },
];

export const SKILL_TRIGGERS = [
  { value: 'auto', label: 'Always On', desc: 'Skill is applied to every analysis automatically' },
  { value: 'manual', label: 'Manual', desc: 'User chooses when to apply this skill' },
];

export const KNOWLEDGE_CATEGORIES = [
  'Game & Product Context',
  'Audience & Market',
  'Channel & Platform',
  'Brand & Creative Guidelines',
  'Workflow & Process Rules',
  'Data & Tool Reference',
  'Case Study & Learnings',
];

export const SHARED_TAG_OPTIONS = {
  team: ['Product', 'Marketing', 'Community', 'Esports', 'Design', 'Video Editor', 'QA'],
  game: ['FF', 'AoV', 'DF', 'FCO', 'FCM', 'Cross-game'],
  asset: ['Copywrite', 'Image', 'Video', 'Report', 'Dashboard'],
};

export const SHARED_TAG_GROUPS = [
  { key: 'team', label: 'Team', options: SHARED_TAG_OPTIONS.team },
  { key: 'game', label: 'Game', options: SHARED_TAG_OPTIONS.game },
  { key: 'asset', label: 'Asset', options: SHARED_TAG_OPTIONS.asset },
];

export const GAME_OPTIONS = SHARED_TAG_OPTIONS.game;

const MARKDOWN_DATE = '2026-05-09';
const LOCAL_AUTHOR = 'Delta Force AI Pack';

const markdownSkillFiles = import.meta.glob('./aiSkillCatalog/skills/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const markdownKnowledgeFiles = import.meta.glob('./aiSkillCatalog/knowledge/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const SHARED_TAG_VALUE_ALIASES = {
  game: {
    AOV: 'AoV',
    Aov: 'AoV',
    'Cross-Game': 'Cross-game',
    'Cross Game': 'Cross-game',
  },
};

const trimQuotes = (value) => {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
};

const parseFrontmatterValue = (value) => {
  const trimmed = value.trim();

  if (!trimmed.length) {
    return '';
  }

  if (
    trimmed.startsWith('[')
    || trimmed.startsWith('{')
    || trimmed === 'true'
    || trimmed === 'false'
    || trimmed === 'null'
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimQuotes(trimmed);
    }
  }

  return trimQuotes(trimmed);
};

const parseMarkdownFrontmatter = (rawValue = '') => {
  const normalized = String(rawValue || '').replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) {
    return { attributes: {}, body: normalized.trim() };
  }

  const endIndex = normalized.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { attributes: {}, body: normalized.trim() };
  }

  const frontmatter = normalized.slice(4, endIndex).trim();
  const body = normalized.slice(endIndex + 5).trim();
  const attributes = {};

  frontmatter.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    attributes[key] = parseFrontmatterValue(value);
  });

  return { attributes, body };
};

const normalizeSharedTagValue = (groupKey, value) => {
  const alias = SHARED_TAG_VALUE_ALIASES[groupKey]?.[value];
  return alias || value;
};

const normalizeSharedTagValues = (groupKey, values, fallbackValues = []) => {
  const allowedValues = SHARED_TAG_OPTIONS[groupKey] || [];
  const sourceValues = Array.isArray(values) && values.length ? values : fallbackValues;
  return Array.from(
    new Set(
      (Array.isArray(sourceValues) ? sourceValues : [])
        .map((value) => normalizeSharedTagValue(groupKey, value))
        .filter((value) => allowedValues.includes(value)),
    ),
  );
};

export const createEmptySharedTags = () =>
  SHARED_TAG_GROUPS.reduce((result, group) => ({ ...result, [group.key]: [] }), {});

export const normalizeSharedTags = (value = {}, gameFallback = []) =>
  SHARED_TAG_GROUPS.reduce(
    (result, group) => ({
      ...result,
      [group.key]: normalizeSharedTagValues(group.key, value?.[group.key], group.key === 'game' ? gameFallback : []),
    }),
    createEmptySharedTags(),
  );

export const getSharedTagValues = (value = {}, gameFallback = []) => {
  const normalized = normalizeSharedTags(value, gameFallback);
  return SHARED_TAG_GROUPS.flatMap((group) => normalized[group.key]);
};

const getAuthorAvatar = (author = LOCAL_AUTHOR) => (
  String(author)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AI'
);

const buildSharedTags = (attributes = {}) => normalizeSharedTags({
  team: attributes.shared_tags_team,
  game: attributes.games,
  asset: attributes.shared_tags_asset,
}, attributes.games || ['DF']);

const firstParagraph = (body = '') => {
  const lines = body.split('\n').map((line) => line.trim());
  const paragraphLines = [];

  for (const line of lines) {
    if (!line) {
      if (paragraphLines.length) {
        break;
      }
      continue;
    }

    if (line.startsWith('#')) {
      continue;
    }

    if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
      if (paragraphLines.length) {
        break;
      }
      continue;
    }

    paragraphLines.push(line);
  }

  return paragraphLines.join(' ').trim();
};

const extractSectionBullets = (body, heading) => {
  const normalizedHeading = heading.toLowerCase();
  const lines = body.split('\n');
  const values = [];
  let inSection = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith('## ')) {
      inSection = line.slice(3).trim().toLowerCase() === normalizedHeading;
      continue;
    }

    if (!inSection) {
      continue;
    }

    if (line.startsWith('- ')) {
      values.push(line.slice(2).trim());
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      values.push(line.replace(/^\d+\.\s*/, '').trim());
      continue;
    }
  }

  return values;
};

const sortByName = (left, right) => left.name.localeCompare(right.name);

const mapSkillMarkdownAsset = ([filePath, rawValue]) => {
  const { attributes, body } = parseMarkdownFrontmatter(rawValue);
  const sharedTags = buildSharedTags(attributes);
  const description = firstParagraph(body) || 'Reusable Delta Force publishing skill.';
  const sectionsSupported = Array.isArray(attributes.sections_supported) ? attributes.sections_supported : [];
  const requiredInputs = Array.isArray(attributes.required_inputs) ? attributes.required_inputs : [];
  const outputs = Array.isArray(attributes.outputs) ? attributes.outputs : [];
  const researchBasisUrls = Array.isArray(attributes.research_basis_urls) ? attributes.research_basis_urls : [];
  const dependsOnSkills = Array.isArray(attributes.depends_on_skills) ? attributes.depends_on_skills : [];
  const linkedKnowledge = Array.isArray(attributes.depends_on_knowledge) ? attributes.depends_on_knowledge : [];

  return {
    id: attributes.id || filePath.split('/').at(-1).replace(/\.md$/, ''),
    name: attributes.title || 'Untitled skill',
    description,
    category: attributes.category || 'Planning',
    trigger: attributes.trigger || 'manual',
    enabled: true,
    instructions: body,
    linkedTopics: sectionsSupported,
    linkedKnowledge,
    author: attributes.author || LOCAL_AUTHOR,
    authorAvatar: getAuthorAvatar(attributes.author),
    version: attributes.version || '1.0',
    usageCount: 0,
    source: 'local',
    createdAt: attributes.verified_on || MARKDOWN_DATE,
    updatedAt: attributes.verified_on || MARKDOWN_DATE,
    verificationTier: attributes.verification_tier || (researchBasisUrls.length ? 'research-backed' : 'draft-unverified'),
    status: attributes.status || 'active',
    sharedTags,
    games: [...sharedTags.game],
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    sectionsSupported,
    requiredInputs,
    outputs,
    dependsOnSkills,
    dependsOnKnowledge: linkedKnowledge,
    researchBasisUrls,
    rawMarkdown: rawValue,
  };
};

const mapKnowledgeMarkdownAsset = ([filePath, rawValue]) => {
  const { attributes, body } = parseMarkdownFrontmatter(rawValue);
  const sharedTags = buildSharedTags(attributes);
  const description = firstParagraph(body) || 'Structured Delta Force knowledge package.';
  const facts = extractSectionBullets(body, 'Key Facts');
  const linkedSkills = Array.isArray(attributes.linked_skills) ? attributes.linked_skills : [];
  const sourceUrls = Array.isArray(attributes.source_urls) ? attributes.source_urls : [];

  return {
    id: attributes.id || filePath.split('/').at(-1).replace(/\.md$/, ''),
    type: 'knowledge',
    name: attributes.title || 'Untitled knowledge',
    description,
    category: attributes.category || 'Game & Product Context',
    enabled: true,
    entries: facts.length || Math.max(body.split('\n').filter((line) => line.trim()).length - 1, 1),
    format: 'markdown',
    linkedSkills,
    author: attributes.author || LOCAL_AUTHOR,
    authorAvatar: getAuthorAvatar(attributes.author),
    version: attributes.version || '1.0',
    usageCount: 0,
    source: 'local',
    createdAt: attributes.verified_on || MARKDOWN_DATE,
    updatedAt: attributes.verified_on || MARKDOWN_DATE,
    sharedTags,
    games: [...sharedTags.game],
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    rawContent: body,
    sampleEntries: facts.slice(0, 3).map((fact, index) => ({
      term: `Fact ${index + 1}`,
      aliases: '',
      category: attributes.category || 'Knowledge',
      sentiment: 'neutral',
      description: fact,
    })),
    verificationTier: attributes.verification_tier || 'draft-unverified',
    status: attributes.status || 'seeded',
    sourceUrls,
    rawMarkdown: rawValue,
  };
};

export const MOCK_SKILLS = Object.entries(markdownSkillFiles)
  .map(mapSkillMarkdownAsset)
  .sort(sortByName);

export const MOCK_KNOWLEDGE = Object.entries(markdownKnowledgeFiles)
  .map(mapKnowledgeMarkdownAsset)
  .sort(sortByName);

const makeMarketplaceSkill = ({
  id,
  name,
  description,
  category,
  trigger = 'manual',
  games = ['DF'],
  instructions,
  tags = [],
  version = '1.0',
  installs = 0,
  rating = 4.6,
  reviewCount = 20,
  author = 'Publishing Ops Lab',
  sharedTags = {},
}) => ({
  id,
  type: 'skill',
  name,
  description,
  category,
  trigger,
  author,
  authorAvatar: getAuthorAvatar(author),
  version,
  rating,
  reviewCount,
  installs,
  tags,
  instructions,
  publishedAt: MARKDOWN_DATE,
  updatedAt: MARKDOWN_DATE,
  sharedTags: normalizeSharedTags(sharedTags, games),
  games,
});

const makeMarketplaceKnowledge = ({
  id,
  name,
  description,
  category,
  games = ['DF'],
  tags = [],
  version = '1.0',
  installs = 0,
  rating = 4.7,
  reviewCount = 20,
  author = 'Publishing Ops Lab',
  entries = 12,
  sharedTags = {},
}) => ({
  id,
  type: 'knowledge',
  name,
  description,
  category,
  entries,
  format: 'curated',
  author,
  authorAvatar: getAuthorAvatar(author),
  version,
  rating,
  reviewCount,
  installs,
  tags,
  publishedAt: MARKDOWN_DATE,
  updatedAt: MARKDOWN_DATE,
  sharedTags: normalizeSharedTags(sharedTags, games),
  games,
});

export const MOCK_MARKETPLACE_SKILLS = [
  makeMarketplaceSkill({
    id: 'mp-df-1',
    name: 'Delta Force Launch Copy Accelerator',
    description: 'Generate launch-day post variants across feed, short video, and reply-driving formats.',
    category: 'Creative Production',
    installs: 1820,
    reviewCount: 114,
    tags: ['delta-force', 'launch', 'copy'],
    instructions:
      'Turn one launch asset into a headline, feed caption, short-form hook, and first-comment CTA while preserving the same game promise.',
    sharedTags: {
      team: ['Marketing', 'Community'],
      game: ['DF'],
      asset: ['Copywrite', 'Video'],
    },
  }),
  makeMarketplaceSkill({
    id: 'mp-df-2',
    name: 'Shooter Metadata QA',
    description: 'Check YouTube and TikTok metadata for tactical shooter uploads before publishing.',
    category: 'Operations',
    trigger: 'auto',
    installs: 1260,
    reviewCount: 72,
    tags: ['metadata', 'youtube', 'tiktok'],
    instructions:
      'Validate title, category, audience, tags, and platform toggles. Return the missing metadata first and keep the fix list short.',
    sharedTags: {
      team: ['Marketing', 'Video Editor'],
      game: ['DF'],
      asset: ['Dashboard', 'Video'],
    },
  }),
  makeMarketplaceSkill({
    id: 'mp-df-3',
    name: 'Community Reply Prompt Builder',
    description: 'Convert gameplay clips into first-comment prompts and CTA variants for community managers.',
    category: 'Campaign Execution',
    installs: 930,
    reviewCount: 41,
    tags: ['community', 'first-comment'],
    instructions:
      'Write one concise pinned comment prompt, one poll-style prompt, and one reaction CTA based on the upload context.',
    sharedTags: {
      team: ['Community', 'Marketing'],
      game: ['DF'],
      asset: ['Copywrite'],
    },
  }),
];

export const MOCK_MARKETPLACE_KNOWLEDGE = [
  makeMarketplaceKnowledge({
    id: 'mkn-df-1',
    name: 'Delta Force Seasonal Phrase Pack',
    description: 'Reusable seasonal wording and reward vocabulary for Delta Force campaign publishing.',
    category: 'Brand & Creative Guidelines',
    installs: 1430,
    reviewCount: 63,
    tags: ['delta-force', 'seasonal'],
    sharedTags: {
      team: ['Marketing'],
      game: ['DF'],
      asset: ['Copywrite', 'Report'],
    },
  }),
  makeMarketplaceKnowledge({
    id: 'mkn-df-2',
    name: 'Shooter Platform Rules Reference',
    description: 'Compact platform metadata and option rules for short-form and long-form shooter publishing.',
    category: 'Channel & Platform',
    installs: 1980,
    reviewCount: 88,
    tags: ['platform', 'rules'],
    sharedTags: {
      team: ['Marketing', 'Video Editor'],
      game: ['DF'],
      asset: ['Dashboard', 'Report'],
    },
  }),
];

export const MOCK_APPROVAL_ITEMS = [
  {
    ...makeMarketplaceSkill({
      id: 'ap-df-1',
      name: 'Revenue Event Copy Guardrail',
      description: 'Pending review skill for offer, reward, and monetization copy safety.',
      category: 'Operations',
      tags: ['revenue', 'safety'],
      instructions:
        'Check captions for overclaims, missing disclaimers, or reward ambiguity. Return approve, revise, or escalate with the reason.',
      sharedTags: {
        team: ['Marketing', 'Product'],
        game: ['DF'],
        asset: ['Copywrite', 'Report'],
      },
    }),
    enabled: false,
    source: 'approval',
    usageCount: 4,
  },
  {
    ...makeMarketplaceKnowledge({
      id: 'ap-df-2',
      name: 'Delta Force Creator Brief Glossary',
      description: 'Pending knowledge pack of creator-facing tactical shooter language and formatting notes.',
      category: 'Brand & Creative Guidelines',
      tags: ['creator', 'brief'],
      sharedTags: {
        team: ['Marketing', 'Video Editor'],
        game: ['DF'],
        asset: ['Copywrite', 'Report'],
      },
    }),
    enabled: false,
    source: 'approval',
    usageCount: 2,
    rawContent: 'Pending glossary of creator-facing Delta Force language and packaging rules.',
    sampleEntries: [
      {
        term: 'Hook',
        aliases: '',
        category: 'Creator brief',
        sentiment: 'neutral',
      },
    ],
  },
];

export const STARTER_SKILL_TEMPLATES = [
  {
    id: 'tpl-df-1',
    name: 'Delta Force Caption Assistant',
    category: 'Creative Production',
    desc: 'Generate a clean gameplay caption and CTA from one uploaded asset.',
    defaultInstructions:
      'Read the uploaded Delta Force asset, identify the main gameplay or campaign angle, write one concise caption, and end with one community-facing CTA.',
  },
  {
    id: 'tpl-df-2',
    name: 'YouTube Metadata Helper',
    category: 'Operations',
    desc: 'Fill title, tags, category, and audience recommendations for gameplay uploads.',
    defaultInstructions:
      'Generate a YouTube-ready title, concise tags, category suggestion, and audience recommendation for a Delta Force gameplay post.',
  },
  {
    id: 'tpl-df-3',
    name: 'First Comment Prompt Writer',
    category: 'Campaign Execution',
    desc: 'Create a short first comment prompt that drives replies.',
    defaultInstructions:
      'Write one pinned comment prompt that asks the audience to react, vote, or answer with their squad preference.',
  },
];

export const MOCK_VERSION_HISTORY = {
  mp1: [
    { version: '1.0', date: MARKDOWN_DATE, changes: 'Initial marketplace release.' },
  ],
  _default: [
    { version: '1.0', date: MARKDOWN_DATE, changes: 'Initial release.' },
  ],
};

export const PUBLISH_CHECKS = [
  { key: 'name', label: 'Skill name is set', check: (skill) => Boolean(skill?.name?.trim()) },
  { key: 'desc', label: 'Description is filled (min 20 chars)', check: (skill) => (skill?.description?.length || 0) >= 20 },
  { key: 'category', label: 'Category is selected', check: (skill) => Boolean(SKILL_CATEGORIES.find((item) => item.value === skill?.category)) },
  { key: 'instructions', label: 'Instructions are detailed (min 100 chars)', check: (skill) => (skill?.instructions?.length || 0) >= 100 },
  { key: 'version', label: 'Version number is set', check: (skill) => Boolean(skill?.version) },
];

export const PUBLISH_TAGS_OPTIONS = [
  'social-hub',
  'delta-force',
  'new-post',
  'youtube',
  'tiktok',
  'instagram',
  'threads',
  'workflow',
  'metadata',
  'automation',
];
