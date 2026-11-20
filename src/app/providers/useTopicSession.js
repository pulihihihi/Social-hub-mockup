import { useContext } from 'react';
import { TopicSessionContext } from './TopicSessionContextValue';

export const useTopicSession = () => {
  const context = useContext(TopicSessionContext);
  if (!context) {
    throw new Error('useTopicSession must be used within TopicSessionProvider');
  }
  return context;
};
