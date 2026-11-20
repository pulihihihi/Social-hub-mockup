import { createContext } from 'react';
import { getAiAssetTaxonomy } from './aiAssetDataSource';
import {
  cloneAiAssetStoreState,
  getInstalledMarketplaceIdsFromState,
  toggleKnowledgeInState,
  toggleSkillInState,
  updateKnowledgeInState,
  updateSkillInState,
} from './aiAssetStore';

export const AiAssetStoreContext = createContext(null);

export const buildAiAssetStoreValue = ({ persist, state }) => {
  const taxonomy = getAiAssetTaxonomy();
  const applyState = (updater) => {
    if (!persist) {
      return;
    }

    persist((currentState) => (
      typeof updater === 'function'
        ? updater(cloneAiAssetStoreState(currentState))
        : updater
    ));
  };

  return {
    ...state,
    ...taxonomy,
    installedMpIds: getInstalledMarketplaceIdsFromState(state),
    setApprovalItems: (nextApprovalItems) => applyState((currentState) => ({
      ...currentState,
      approvalItems: typeof nextApprovalItems === 'function'
        ? nextApprovalItems(cloneAiAssetStoreState(currentState.approvalItems))
        : nextApprovalItems,
    })),
    setKnowledge: (nextKnowledge) => applyState((currentState) => ({
      ...currentState,
      knowledge: typeof nextKnowledge === 'function'
        ? nextKnowledge(cloneAiAssetStoreState(currentState.knowledge))
        : nextKnowledge,
    })),
    setMarketplaceItems: (nextMarketplaceItems) => applyState((currentState) => ({
      ...currentState,
      marketplaceItems: typeof nextMarketplaceItems === 'function'
        ? nextMarketplaceItems(cloneAiAssetStoreState(currentState.marketplaceItems))
        : nextMarketplaceItems,
    })),
    setSkills: (nextSkills) => applyState((currentState) => ({
      ...currentState,
      skills: typeof nextSkills === 'function'
        ? nextSkills(cloneAiAssetStoreState(currentState.skills))
        : nextSkills,
    })),
    toggleKnowledge: (knowledgeId) => applyState((currentState) => toggleKnowledgeInState(currentState, knowledgeId)),
    toggleSkill: (skillId) => applyState((currentState) => toggleSkillInState(currentState, skillId)),
    updateKnowledge: (nextKnowledge) => applyState((currentState) => updateKnowledgeInState(currentState, nextKnowledge)),
    updateSkill: (nextSkill) => applyState((currentState) => updateSkillInState(currentState, nextSkill)),
  };
};
