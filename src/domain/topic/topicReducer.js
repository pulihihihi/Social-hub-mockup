import dayjs from 'dayjs';
import { DEFAULT_TOPIC_UPDATE_FREQUENCY, TOPIC_STATUS } from './contracts';
import { formatUiShortDate } from '../../shared/format/date';

export const TOPIC_ACTIONS = {
  HYDRATE: 'HYDRATE',
  ADD_TOPIC: 'ADD_TOPIC',
  UPDATE_TOPIC: 'UPDATE_TOPIC',
  SET_TOPIC_STATUS: 'SET_TOPIC_STATUS',
  DELETE_TOPIC: 'DELETE_TOPIC',
  SET_ACTIVE_TOPIC: 'SET_ACTIVE_TOPIC',
};

export const createTopicEntity = (topicDraft) => {
  const dateStr = formatUiShortDate(dayjs());
  return {
    id: `t${Date.now()}`,
    name: topicDraft.name,
    description: topicDraft.description || '',
    status: topicDraft.status || TOPIC_STATUS.ACTIVE,
    updateFrequency: topicDraft.updateFrequency || DEFAULT_TOPIC_UPDATE_FREQUENCY,
    dateRange: `${dateStr} - Present`,
    channels: topicDraft.channels || [],
    keywords: topicDraft.keywords || [],
    alertRules: topicDraft.alertRules || [],
  };
};

export const createTopicState = (topics) => ({
  topics,
  activeTopicId: topics[0]?.id || null,
});

const buildNextActiveTopicId = (topics, previousActiveTopicId, removedTopicId) => {
  if (!topics.length) {
    return null;
  }

  if (previousActiveTopicId !== removedTopicId) {
    return previousActiveTopicId;
  }

  return topics[0].id;
};

export const buildDuplicateTopicName = (topics, sourceName) => {
  const baseName = `${sourceName} Copy`;
  const existingNames = new Set(topics.map((topic) => topic.name));

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let copyIndex = 2;
  while (existingNames.has(`${sourceName} Copy ${copyIndex}`)) {
    copyIndex += 1;
  }

  return `${sourceName} Copy ${copyIndex}`;
};

export const topicReducer = (state, action) => {
  switch (action.type) {
    case TOPIC_ACTIONS.HYDRATE:
      return createTopicState(action.payload || []);
    case TOPIC_ACTIONS.ADD_TOPIC: {
      const newTopic = createTopicEntity(action.payload);
      return {
        topics: [...state.topics, newTopic],
        activeTopicId: newTopic.id,
      };
    }
    case TOPIC_ACTIONS.UPDATE_TOPIC: {
      const existingTopic = state.topics.find((topic) => topic.id === action.payload.id);

      if (!existingTopic) {
        return state;
      }

      const updatedTopic = {
        ...existingTopic,
        ...action.payload,
        id: existingTopic.id,
        dateRange: action.payload.dateRange ?? existingTopic.dateRange,
        channels: action.payload.channels ?? existingTopic.channels,
        keywords: action.payload.keywords ?? existingTopic.keywords,
        alertRules: action.payload.alertRules ?? existingTopic.alertRules,
      };

      return {
        topics: state.topics.map((topic) => (topic.id === existingTopic.id ? updatedTopic : topic)),
        activeTopicId: existingTopic.id,
      };
    }
    case TOPIC_ACTIONS.SET_TOPIC_STATUS: {
      const existingTopic = state.topics.find((topic) => topic.id === action.payload.id);

      if (!existingTopic) {
        return state;
      }

      return {
        topics: state.topics.map((topic) => (
          topic.id === existingTopic.id ? { ...topic, status: action.payload.status } : topic
        )),
        activeTopicId: existingTopic.id,
      };
    }
    case TOPIC_ACTIONS.DELETE_TOPIC: {
      const remainingTopics = state.topics.filter((topic) => topic.id !== action.payload);

      if (remainingTopics.length === state.topics.length) {
        return state;
      }

      return {
        topics: remainingTopics,
        activeTopicId: buildNextActiveTopicId(remainingTopics, state.activeTopicId, action.payload),
      };
    }
    case TOPIC_ACTIONS.SET_ACTIVE_TOPIC:
      return {
        ...state,
        activeTopicId: action.payload,
      };
    default:
      return state;
  }
};
