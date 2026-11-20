import { mockAiAssetRepository } from '../../mocks/repositories/mockAiAssetRepository';

const unique = (values = []) => Array.from(new Set(values.filter(Boolean)));

export const getAiAssetInitialStoreState = () => (
  mockAiAssetRepository.getStoreState()
);

export const getAiAssetTaxonomy = () => (
  mockAiAssetRepository.getTaxonomy()
);

export const getAiAssetInitialData = () => ({
  ...getAiAssetInitialStoreState(),
  taxonomy: getAiAssetTaxonomy(),
});

export const getInstalledMarketplaceIds = ({ skills = [], knowledge = [] } = {}) => unique([
  ...skills.map((item) => item.sourceId),
  ...knowledge.map((item) => item.sourceId),
]);

