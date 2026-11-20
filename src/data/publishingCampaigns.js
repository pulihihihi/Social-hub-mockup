export const ACTIVE_CAMPAIGN_SORT_OPTIONS = [
  { label: 'Start date - oldest first', value: 'start-date-oldest' },
  { label: 'Start date - newest first', value: 'start-date-newest' },
  { label: 'Campaign name - A to Z', value: 'name-asc' },
];

export const ACTIVE_CAMPAIGNS = [
  {
    id: 'treasure-hunt',
    name: 'Treasure Hunt',
    dateRange: 'Mar 2, 2026 - Mar 23, 2026',
    sortSequence: 1,
    accent: '#ece9ff',
    plannerLabel: 'See campaign planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '0', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '0', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  },
  {
    id: 'problemas-paraiso',
    name: 'Problemas en el Paraiso',
    dateRange: 'Mar 24, 2026 - Apr 8, 2026',
    sortSequence: 2,
    accent: '#e7efff',
    plannerLabel: 'See campaign planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  },
  {
    id: 'airdrop',
    name: 'AirDrop',
    dateRange: 'Apr 9, 2026 - Apr 30, 2026',
    sortSequence: 3,
    accent: '#e6f4ff',
    plannerLabel: 'See campaign planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  },
  {
    id: '7th-anniversary',
    name: '7th anniversary',
    dateRange: '',
    sortSequence: 4,
    accent: '#f3f0ff',
    plannerLabel: 'See campaign planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  },
  {
    id: 'dia-booyah',
    name: 'Dia Booyah',
    dateRange: '',
    sortSequence: 5,
    accent: '#fff1f0',
    plannerLabel: 'See campaign planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  },
  {
    id: 'ffws-latam-2024',
    name: 'FFWS Latam 2024',
    dateRange: '',
    sortSequence: 6,
    accent: '#fff7e6',
    plannerLabel: 'See campaign planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  },
  {
    id: 'operation-densho',
    name: 'Operation Densho',
    dateRange: '',
    sortSequence: 7,
    accent: '#e6fffb',
    plannerLabel: 'See campaign planner',
    stats: [
      { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
      { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
      { label: 'Sent Posts', value: '0' },
      { label: 'Impressions', value: '0' },
    ],
  },
];

export const ARCHIVED_CAMPAIGNS = [
  {
    id: 'demon-slayer',
    name: 'Demon Slayer',
    dateRange: '',
    archivedAt: '',
    accent: '#fde3cf',
    plannerLabel: 'Open archived planner',
    sentPosts: '0',
    impressions: '0',
  },
  {
    id: 'demon-hunters',
    name: 'Demon Hunters',
    dateRange: '',
    archivedAt: '',
    accent: '#d9e8ff',
    plannerLabel: 'Open archived planner',
    sentPosts: '0',
    impressions: '0',
  },
  {
    id: 'bs-counter',
    name: 'BS Counter',
    dateRange: '',
    archivedAt: '',
    accent: '#d9e8ff',
    plannerLabel: 'Open archived planner',
    sentPosts: '0',
    impressions: '0',
  },
];

const withStatus = (campaign, status) => ({ ...campaign, status });

export const CAMPAIGN_PLANNER_ROUTE_PREFIX = '/publishing/campaigns/planner';

export const ALL_CAMPAIGNS = [
  ...ACTIVE_CAMPAIGNS.map((campaign) => withStatus(campaign, 'active')),
  ...ARCHIVED_CAMPAIGNS.map((campaign) => withStatus(campaign, 'archived')),
];

export const findCampaignById = (campaignId) => (
  ALL_CAMPAIGNS.find((campaign) => campaign.id === campaignId) || null
);
