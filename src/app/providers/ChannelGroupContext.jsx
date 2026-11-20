import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MANAGED_CHANNELS,
  getActiveChannelGroupId,
  getActiveChannelIds,
  getDefaultChannelGroupId,
  setActiveChannelGroupId as persistActiveChannelGroupId,
  useManagedChannelGroups,
} from '../../data/channelManagement';
import { ChannelGroupContext } from './ChannelGroupContextValue';

export const ChannelGroupProvider = ({ children }) => {
  const [channelGroups, setChannelGroups] = useManagedChannelGroups();
  const [activeChannelGroupId, setActiveChannelGroupIdState] = useState(() => (
    getActiveChannelGroupId(channelGroups)
  ));

  useEffect(() => {
    if (!channelGroups.length) {
      setActiveChannelGroupIdState(null);
      return;
    }

    const activeGroupExists = channelGroups.some((group) => (
      String(group.id) === String(activeChannelGroupId)
    ));

    if (!activeGroupExists) {
      const nextGroupId = getDefaultChannelGroupId(channelGroups);
      persistActiveChannelGroupId(nextGroupId);
      setActiveChannelGroupIdState(nextGroupId);
    }
  }, [activeChannelGroupId, channelGroups]);

  const setActiveChannelGroupId = useCallback((groupId) => {
    persistActiveChannelGroupId(groupId);
    setActiveChannelGroupIdState(groupId);
  }, []);

  const activeChannelGroup = useMemo(
    () => channelGroups.find((group) => String(group.id) === String(activeChannelGroupId)) || null,
    [activeChannelGroupId, channelGroups],
  );
  const activeChannelIds = useMemo(
    () => getActiveChannelIds(activeChannelGroupId, channelGroups),
    [activeChannelGroupId, channelGroups],
  );
  const activeChannels = useMemo(
    () => MANAGED_CHANNELS.filter((channel) => activeChannelIds.includes(channel.id)),
    [activeChannelIds],
  );

  const value = useMemo(() => ({
    activeChannelGroup,
    activeChannelGroupId,
    activeChannelIds,
    activeChannels,
    channelGroups,
    setActiveChannelGroupId,
    setChannelGroups,
  }), [
    activeChannelGroup,
    activeChannelGroupId,
    activeChannelIds,
    activeChannels,
    channelGroups,
    setActiveChannelGroupId,
    setChannelGroups,
  ]);

  return (
    <ChannelGroupContext.Provider value={value}>
      {children}
    </ChannelGroupContext.Provider>
  );
};
