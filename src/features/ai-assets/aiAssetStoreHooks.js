import { useContext, useMemo } from 'react';
import { getManagedAiAssetStoreState } from './aiAssetStore';
import { AiAssetStoreContext, buildAiAssetStoreValue } from './aiAssetStoreShared';

export const useAiAssetStore = () => {
  const contextValue = useContext(AiAssetStoreContext);

  return useMemo(
    () => contextValue || buildAiAssetStoreValue({ persist: null, state: getManagedAiAssetStoreState() }),
    [contextValue],
  );
};

export const useRequiredAiAssetStore = () => {
  const contextValue = useContext(AiAssetStoreContext);

  if (!contextValue) {
    throw new Error('useRequiredAiAssetStore must be used within AiAssetStoreProvider');
  }

  return contextValue;
};
