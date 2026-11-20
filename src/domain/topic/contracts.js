/**
 * @typedef {'active' | 'draft' | 'paused'} TopicStatus
 */

/**
 * @typedef {'daily' | '1h' | '4h'} TopicUpdateFrequency
 */

/**
 * @typedef {object} Topic
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {TopicStatus} status
 * @property {TopicUpdateFrequency} updateFrequency
 * @property {string} dateRange
 * @property {Array<object>} channels
 * @property {string[]} keywords
 * @property {Array<object>} alertRules
 */

/**
 * @typedef {object} TopicDraft
 * @property {string} name
 * @property {string} description
 * @property {TopicStatus} status
 * @property {TopicUpdateFrequency} updateFrequency
 * @property {Array<object>} channels
 * @property {string[]} keywords
 * @property {Array<object>} alertRules
 */

/**
 * @typedef {object} FilterSnapshot
 * @property {string[]} platform
 * @property {string} timeRange
 * @property {string[]} sentiment
 * @property {string[]} contentType
 * @property {string[]} discussionType
 * @property {string[]} spamClass
 */

export const TOPIC_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  PAUSED: 'paused',
};

export const TOPIC_UPDATE_FREQUENCY = {
  DAILY: 'daily',
  ONE_HOUR: '1h',
  FOUR_HOURS: '4h',
};

export const DEFAULT_TOPIC_UPDATE_FREQUENCY = TOPIC_UPDATE_FREQUENCY.DAILY;

export const TOPIC_UPDATE_FREQUENCY_LABELS = {
  [TOPIC_UPDATE_FREQUENCY.DAILY]: 'Daily',
  [TOPIC_UPDATE_FREQUENCY.ONE_HOUR]: '1 hour',
  [TOPIC_UPDATE_FREQUENCY.FOUR_HOURS]: '4 hours',
};

export const TOPIC_CHANNEL_LIMIT_BY_FREQUENCY = {
  [TOPIC_UPDATE_FREQUENCY.DAILY]: 100,
  [TOPIC_UPDATE_FREQUENCY.ONE_HOUR]: 20,
  [TOPIC_UPDATE_FREQUENCY.FOUR_HOURS]: 20,
};

export const TOPIC_UPDATE_FREQUENCY_OPTIONS = [
  { label: TOPIC_UPDATE_FREQUENCY_LABELS[TOPIC_UPDATE_FREQUENCY.ONE_HOUR], value: TOPIC_UPDATE_FREQUENCY.ONE_HOUR },
  { label: TOPIC_UPDATE_FREQUENCY_LABELS[TOPIC_UPDATE_FREQUENCY.FOUR_HOURS], value: TOPIC_UPDATE_FREQUENCY.FOUR_HOURS },
  { label: TOPIC_UPDATE_FREQUENCY_LABELS[TOPIC_UPDATE_FREQUENCY.DAILY], value: TOPIC_UPDATE_FREQUENCY.DAILY },
];

export const getTopicChannelLimit = (updateFrequency = DEFAULT_TOPIC_UPDATE_FREQUENCY) =>
  TOPIC_CHANNEL_LIMIT_BY_FREQUENCY[updateFrequency] ?? TOPIC_CHANNEL_LIMIT_BY_FREQUENCY[DEFAULT_TOPIC_UPDATE_FREQUENCY];

export const getTopicUpdateFrequencyLabel = (updateFrequency = DEFAULT_TOPIC_UPDATE_FREQUENCY) =>
  TOPIC_UPDATE_FREQUENCY_LABELS[updateFrequency] ?? TOPIC_UPDATE_FREQUENCY_LABELS[DEFAULT_TOPIC_UPDATE_FREQUENCY];

export const isNearRealTimeTopicFrequency = (updateFrequency) =>
  updateFrequency === TOPIC_UPDATE_FREQUENCY.ONE_HOUR || updateFrequency === TOPIC_UPDATE_FREQUENCY.FOUR_HOURS;

export const DEFAULT_FILTER_SNAPSHOT = {
  platform: [],
  timeRange: '30d',
  sentiment: [],
  contentType: [],
  discussionType: [],
  spamClass: [],
};
