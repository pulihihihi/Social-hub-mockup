import { useContext } from 'react';
import { ChannelGroupContext } from './ChannelGroupContextValue';

export const useChannelGroup = () => {
  const context = useContext(ChannelGroupContext);
  if (!context) {
    throw new Error('useChannelGroup must be used within ChannelGroupProvider');
  }
  return context;
};
