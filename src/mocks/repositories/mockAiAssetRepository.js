import { AI_ASSET_SEED } from '../seeds/aiAssetSeed';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const mockAiAssetRepository = {
  getLocalAssets() {
    return {
      skills: clone(AI_ASSET_SEED.skills),
      knowledge: clone(AI_ASSET_SEED.knowledge),
    };
  },
  getMarketplaceAssets() {
    return [
      ...clone(AI_ASSET_SEED.marketplaceSkills),
      ...clone(AI_ASSET_SEED.marketplaceKnowledge),
    ];
  },
  getApprovalAssets() {
    return clone(AI_ASSET_SEED.approvalItems);
  },
  getStoreState() {
    return {
      ...this.getLocalAssets(),
      marketplaceItems: this.getMarketplaceAssets(),
      approvalItems: this.getApprovalAssets(),
    };
  },
  getTaxonomy() {
    return {
      skillCategories: clone(AI_ASSET_SEED.skillCategories),
      skillTriggers: clone(AI_ASSET_SEED.skillTriggers),
      knowledgeCategories: clone(AI_ASSET_SEED.knowledgeCategories),
    };
  },
};
