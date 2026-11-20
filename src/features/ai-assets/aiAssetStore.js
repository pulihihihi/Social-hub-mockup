import { getAiAssetInitialStoreState, getInstalledMarketplaceIds } from './aiAssetDataSource';

export const AI_ASSET_STORE_STORAGE_KEY = 'socialhub.aiAssets.v1';
export const AI_ASSET_STORE_EVENT = 'socialhub:ai-assets-changed';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const cloneAiAssetStoreState = (state) => clone(state);

export const normalizeAiAssetStoreState = (state = {}) => {
  const seedState = getAiAssetInitialStoreState();

  return {
    skills: clone(Array.isArray(state.skills) ? state.skills : seedState.skills),
    knowledge: clone(Array.isArray(state.knowledge) ? state.knowledge : seedState.knowledge),
    marketplaceItems: clone(Array.isArray(state.marketplaceItems) ? state.marketplaceItems : seedState.marketplaceItems),
    approvalItems: clone(Array.isArray(state.approvalItems) ? state.approvalItems : seedState.approvalItems),
  };
};

export const getManagedAiAssetStoreState = () => {
  if (typeof window === 'undefined') {
    return normalizeAiAssetStoreState();
  }

  try {
    const storedState = window.localStorage.getItem(AI_ASSET_STORE_STORAGE_KEY);
    if (!storedState) {
      return normalizeAiAssetStoreState();
    }

    return normalizeAiAssetStoreState(JSON.parse(storedState));
  } catch {
    return normalizeAiAssetStoreState();
  }
};

export const setManagedAiAssetStoreState = (state) => {
  const nextState = normalizeAiAssetStoreState(state);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AI_ASSET_STORE_STORAGE_KEY, JSON.stringify(nextState));
    window.dispatchEvent(new CustomEvent(AI_ASSET_STORE_EVENT, {
      detail: { state: nextState },
    }));
  }

  return nextState;
};

export const getInstalledMarketplaceIdsFromState = (state) => (
  getInstalledMarketplaceIds(state)
);

export const toggleSkillInState = (state, skillId) => ({
  ...state,
  skills: state.skills.map((item) => (
    item.id === skillId ? { ...item, enabled: !item.enabled } : item
  )),
});

export const toggleKnowledgeInState = (state, knowledgeId) => ({
  ...state,
  knowledge: state.knowledge.map((item) => (
    item.id === knowledgeId ? { ...item, enabled: !item.enabled } : item
  )),
});

export const updateSkillInState = (state, nextSkill) => ({
  ...state,
  skills: state.skills.map((item) => (
    item.id === nextSkill.id ? clone(nextSkill) : item
  )),
});

export const updateKnowledgeInState = (state, nextKnowledge) => ({
  ...state,
  knowledge: state.knowledge.map((item) => (
    item.id === nextKnowledge.id ? clone(nextKnowledge) : item
  )),
});
