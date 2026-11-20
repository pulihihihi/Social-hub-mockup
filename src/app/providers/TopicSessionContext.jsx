import { useMemo, useReducer } from 'react';
import { TopicSessionContext } from './TopicSessionContextValue';
import { mockTopicRepository } from '../../mocks/repositories/mockTopicRepository';
import { selectActiveTopic, selectTopicById, selectTopics } from '../../domain/topic/selectors';
import { createTopicState, topicReducer, TOPIC_ACTIONS } from '../../domain/topic/topicReducer';

export const TopicSessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    topicReducer,
    mockTopicRepository.getTopics(),
    createTopicState,
  );

  const value = useMemo(() => ({
    state,
    topics: selectTopics(state),
    activeTopic: state.activeTopicId,
    activeTopicEntity: selectActiveTopic(state),
    setActiveTopic: (topicId) => dispatch({ type: TOPIC_ACTIONS.SET_ACTIVE_TOPIC, payload: topicId }),
    addTopic: (topicDraft) => {
      dispatch({ type: TOPIC_ACTIONS.ADD_TOPIC, payload: topicDraft });
    },
    updateTopic: (topicDraft) => {
      dispatch({ type: TOPIC_ACTIONS.UPDATE_TOPIC, payload: topicDraft });
    },
    setTopicStatus: (topicId, status) => {
      dispatch({ type: TOPIC_ACTIONS.SET_TOPIC_STATUS, payload: { id: topicId, status } });
    },
    deleteTopic: (topicId) => {
      dispatch({ type: TOPIC_ACTIONS.DELETE_TOPIC, payload: topicId });
    },
    getTopicById: (topicId) => selectTopicById(state, topicId),
  }), [state]);

  return (
    <TopicSessionContext.Provider value={value}>
      {children}
    </TopicSessionContext.Provider>
  );
};
