export const selectTopics = (state) => state.topics;

export const selectActiveTopic = (state) =>
  state.topics.find((topic) => topic.id === state.activeTopicId) || null;

export const selectTopicById = (state, id) =>
  state.topics.find((topic) => topic.id === id) || null;
