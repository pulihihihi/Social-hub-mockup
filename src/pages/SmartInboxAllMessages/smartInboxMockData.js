import { MANAGED_CHANNELS } from '../../data/channelManagement';

const networkLabels = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  threads: 'Threads',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

export const getSourceGroupsForChannels = (channelIds = MANAGED_CHANNELS.map((channel) => channel.id)) => {
  const channelIdSet = new Set(channelIds);
  const visibleChannels = MANAGED_CHANNELS.filter((channel) => channelIdSet.has(channel.id));

  return Object.entries(networkLabels)
    .map(([network, label]) => {
      const options = visibleChannels
        .filter((channel) => channel.platform === network)
        .map((channel) => ({
          label: channel.name,
          value: channel.id,
        }));

      return {
        label: `All ${label}`,
        value: network,
        network,
        options,
      };
    })
    .filter((group) => group.options.length);
};

export const SOURCE_GROUPS = getSourceGroupsForChannels();

export const getMessageTypeValues = (groups) => (
  groups.flatMap((group) => group.options.map((option) => option.value))
);

export const getMessageTagOptions = (messages) => (
  [...new Set(messages.flatMap((message) => message.tags || []))].sort((a, b) => a.localeCompare(b))
);

export const getMessageSentimentOptions = (messages) => (
  [...new Set(messages.map((message) => message.sentiment).filter(Boolean))].sort((a, b) => a.localeCompare(b))
);

export const getMessageIntentOptions = (messages) => (
  [...new Set(messages.map((message) => message.messageIntent).filter(Boolean))].sort((a, b) => a.localeCompare(b))
);

export function filterSmartInboxMessages(messages, filters = {}) {
  const {
    query = '',
    sourceChannelIds = null,
    messageTypes = null,
    tags = [],
    sentiments = [],
    messageIntents = [],
  } = filters;
  const normalizedQuery = query.trim().toLowerCase();
  const hasSourceFilter = Array.isArray(sourceChannelIds);
  const hasMessageTypeFilter = Array.isArray(messageTypes);
  const sourceSet = new Set(sourceChannelIds || []);
  const typeSet = new Set(messageTypes || []);
  const tagSet = new Set(tags);
  const sentimentSet = new Set(sentiments);
  const intentSet = new Set(messageIntents);

  return messages.filter((message) => {
    if (hasSourceFilter && !sourceSet.has(message.sourceChannelId)) {
      return false;
    }

    if (hasMessageTypeFilter && !typeSet.has(message.messageType)) {
      return false;
    }

    if (tagSet.size && !(message.tags || []).some((tag) => tagSet.has(tag))) {
      return false;
    }

    if (sentimentSet.size && !sentimentSet.has(message.sentiment)) {
      return false;
    }

    if (intentSet.size && !intentSet.has(message.messageIntent)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableValues = [
      message.author,
      message.handle,
      message.account,
      message.accountHandle,
      message.context,
      message.postTitle,
      message.message,
      message.detail,
      message.sentiment,
      message.messageIntent,
      ...(message.tags || []),
    ];

    return searchableValues.some((value) => String(value || '').toLowerCase().includes(normalizedQuery));
  });
}

export function applySmartInboxMessageAction(messages, messageId, action, payload = {}) {
  return messages.map((message) => {
    if (message.id !== messageId) {
      return message;
    }

    if (action === 'complete') {
      return { ...message, completed: true };
    }

    if (action === 'save') {
      return { ...message, saved: !message.saved };
    }

    if (action === 'sentiment') {
      return { ...message, sentiment: payload.sentiment || message.sentiment };
    }

    if (action === 'tags') {
      return { ...message, tags: payload.tags || [] };
    }

    if (action === 'case') {
      return { ...message, caseCreated: true };
    }

    return message;
  });
}

export const MESSAGES = [
  {
    id: 'm-1',
    sourceChannelId: 'ig-delta',
    author: 'Phat Jade',
    handle: 'jadephat',
    initials: 'PJ',
    network: 'instagram',
    messageType: 'instagram-direct-messages',
    context: 'Direct Message to Garena Delta Force VN',
    time: '2 days ago',
    message: 'https://vt.tiktok.com/ZS9FeFDy3ksgg-DzD64/',
    isLinkBubble: true,
    sentiment: 'Unclassified',
    responseRecommended: false,
    tags: ['Community'],
    systemTagIds: ['sentiment-neutral'],
    actions: ['Like', 'Apply Macro', 'Start Team Conversation', 'Tags', 'Mark Complete', 'Pin', 'Reply'],
  },
  {
    id: 'm-2',
    sourceChannelId: 'fb-delta-main',
    author: 'Son Dinh',
    handle: 'sondinh',
    initials: 'SD',
    network: 'facebook',
    messageType: 'facebook-comments',
    context: 'Commented on Garena Delta Force (VN - Vietnamese) Wall Post',
    postTitle: 'Test new post',
    time: '2 days ago',
    message: 'quay lai a:))',
    sentiment: 'Positive',
    responseRecommended: true,
    tags: ['Campaign'],
    systemTagIds: ['sentiment-positive', 'campaign-risk'],
    actions: ['Like', 'Apply Macro', 'Start Team Conversation', 'Tags', 'Mark Complete', 'Pin', 'Reply'],
  },
  {
    id: 'm-3',
    sourceChannelId: 'fb-delta-main',
    author: 'Thanh Nguyen',
    handle: 'thanhnguyen',
    initials: 'TN',
    network: 'facebook',
    messageType: 'facebook-private-messages',
    context: 'Sent a Private Message to Garena Delta Force (VN - Vietnamese)',
    time: '3 days ago',
    message: 'Minh can kiem tra tinh trang don hang va chinh sach hoan tien.',
    hasMedia: true,
    sentiment: 'Unclassified',
    responseRecommended: true,
    tags: ['Always On'],
    systemTagIds: ['sentiment-negative', 'alert-cs-escalation'],
    actions: ['Like', 'Apply Macro', 'Start Team Conversation', 'Tags', 'Mark Complete', 'Create Case', 'Reply'],
  },
  {
    id: 'm-4',
    sourceChannelId: 'fb-warrior',
    author: 'Tran Van Tan',
    handle: 'tantran',
    initials: 'TT',
    network: 'facebook',
    messageType: 'facebook-comments',
    context: 'Commented on Chien Than Delta Force Wall Post',
    postTitle: 'Customer service update',
    time: '4 days ago',
    message: 'Can gap nhan vien ho tro truc tiep.',
    sentiment: 'Neutral',
    responseRecommended: false,
    tags: [],
    systemTagIds: ['sentiment-neutral', 'alert-cs-escalation'],
    actions: ['Apply Macro', 'Start Team Conversation', 'Tags', 'Mark Complete', 'Reply'],
  },
];
