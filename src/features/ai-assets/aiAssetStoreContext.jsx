import { useEffect, useMemo, useState } from 'react';
import {
  AI_ASSET_STORE_EVENT,
  AI_ASSET_STORE_STORAGE_KEY,
  cloneAiAssetStoreState,
  getManagedAiAssetStoreState,
  normalizeAiAssetStoreState,
  setManagedAiAssetStoreState,
} from './aiAssetStore';
import { AiAssetStoreContext, buildAiAssetStoreValue } from './aiAssetStoreShared';

export const AiAssetStoreProvider = ({ children }) => {
  const [state, setState] = useState(getManagedAiAssetStoreState);

  useEffect(() => {
    const syncState = (event) => {
      if (event.type === 'storage' && event.key !== AI_ASSET_STORE_STORAGE_KEY) {
        return;
      }

      setState(
        event.detail?.state
          ? normalizeAiAssetStoreState(event.detail.state)
          : getManagedAiAssetStoreState(),
      );
    };

    window.addEventListener(AI_ASSET_STORE_EVENT, syncState);
    window.addEventListener('storage', syncState);

    return () => {
      window.removeEventListener(AI_ASSET_STORE_EVENT, syncState);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  const persistState = (updater) => {
    setState((currentState) => {
      const nextState = typeof updater === 'function'
        ? updater(cloneAiAssetStoreState(currentState))
        : updater;

      return setManagedAiAssetStoreState(nextState);
    });
  };

  const value = useMemo(
    () => buildAiAssetStoreValue({ persist: persistState, state }),
    [state],
  );

  return (
    <AiAssetStoreContext.Provider value={value}>
      {children}
    </AiAssetStoreContext.Provider>
  );
};
