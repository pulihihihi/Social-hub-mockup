export const FAILED_POSTS = [
  {
    id: 'failed-youtube-video-content',
    channelValue: 'yt-delta',
    network: 'youtube',
    account: 'Garena Delta Force VN',
    handle: '@garenadeltaforcevn',
    status: 'Failed Post',
    channelState: 'Disconnected Channel',
    timestamp: 'Wed, May 6, 2026 9:05 AM',
    author: 'Publishing Ops',
    authorInitials: 'PO',
    body: 'Regional hiring spotlight: meet the teams building player communities across Southeast Asia.\n\nInside the post: hiring priorities, creator program support, and a reminder for regional teams to keep channel access up to date.\n\n#LifeAtGarena #CommunityOps #SoutheastAsia',
    issue: 'LinkedIn Company Content Issue.',
    details: 'LinkedIn rejected the post because the attached creative did not meet the network content requirements. Revise the media or caption, then resend the post.',
    tags: ['Community', 'Regional'],
  },
  {
    id: 'failed-facebook-permissions',
    channelValue: 'fb-delta-main',
    network: 'facebook',
    account: 'Garena Delta Force (VN - Vietnamese)',
    handle: 'GarenaDeltaForceVN',
    status: 'Failed Post',
    timestamp: 'Tue, May 5, 2026 6:40 PM',
    author: 'Hai-Son Tran',
    authorInitials: 'HT',
    body: 'Reminder post for the weekend tournament bracket and livestream schedule.',
    issue: 'Facebook Channel Permission Issue.',
    details: 'Sprout could not publish because this channel needs to be reauthorized by a user with full publishing access.',
    tags: ['Campaign'],
  },
];

export const DELETED_POSTS = [
  {
    id: 'deleted-draft-story',
    channelValue: 'fb-warrior',
    network: 'facebook',
    account: 'Chien Than Delta Force',
    handle: 'chienthanDF',
    status: 'Draft Post',
    deletedAt: 'Deleted on May 6, 2026 at 8:09 AM',
    author: 'Campaign Ops',
    authorInitials: 'CO',
    body: 'Top 5 balance changes creators may want to mention in this week\'s update.',
    tone: 'warm',
    tags: ['AOV', 'Tips'],
  },
];

export const FAILED_SORT_OPTIONS = [
  { label: 'Last Modified Newest', value: 'last-modified-newest' },
  { label: 'Last Modified Oldest', value: 'last-modified-oldest' },
];

export const DELETED_SORT_OPTIONS = [
  { label: 'Deleted date - Most recent', value: 'deleted-most-recent' },
  { label: 'Deleted date - Oldest', value: 'deleted-oldest' },
];

export const initialFilters = {
  channels: [],
  tags: [],
};
