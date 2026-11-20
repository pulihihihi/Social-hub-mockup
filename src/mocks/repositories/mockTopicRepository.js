import { TOPIC_SEED } from '../seeds/topicSeed';

const clone = (value) => JSON.parse(JSON.stringify(value));

/**
 * @typedef {object} TopicRepository
 * @property {() => import('../../domain/topic/contracts').Topic[]} getTopics
 */

/** @type {TopicRepository} */
export const mockTopicRepository = {
  getTopics() {
    return clone(TOPIC_SEED);
  },
};
