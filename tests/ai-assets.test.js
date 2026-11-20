import { describe, expect, it } from 'vitest';
import { selectInstalledAssets } from '../src/domain/ai-assets/selectors';
import { installMarketplaceAsset, uninstallMarketplaceAsset } from '../src/features/ai-assets/assetInstallers';
import { mockAiAssetRepository } from '../src/mocks/repositories/mockAiAssetRepository';

describe('AI asset marketplace mapping', () => {
  it('exposes active-state flags for both local skills and local knowledge assets', () => {
    const { skills, knowledge } = mockAiAssetRepository.getLocalAssets();

    expect(skills.every((skill) => typeof skill.enabled === 'boolean')).toBe(true);
    expect(knowledge.every((entry) => typeof entry.enabled === 'boolean')).toBe(true);
  });

  it('installs and uninstalls marketplace skills through the adapter helpers', () => {
    const { skills, knowledge } = mockAiAssetRepository.getLocalAssets();
    const item = mockAiAssetRepository.getMarketplaceAssets().find((asset) => asset.type === 'skill');

    const installed = installMarketplaceAsset({
      item,
      installedIds: [],
      skills,
      knowledge,
    });

    expect(installed.installedIds).toContain(item.id);
    expect(installed.skills[0]).toMatchObject({
      source: 'marketplace',
      sourceId: item.id,
      enabled: true,
    });
    expect(selectInstalledAssets(installed)).toHaveLength(1);

    const uninstalled = uninstallMarketplaceAsset({
      item,
      installedIds: installed.installedIds,
      skills: installed.skills,
      knowledge: installed.knowledge,
    });

    expect(uninstalled.installedIds).not.toContain(item.id);
    expect(uninstalled.skills.find((skill) => skill.sourceId === item.id)).toBeUndefined();
  });

  it('installs marketplace knowledge as a linked knowledge asset', () => {
    const { skills, knowledge } = mockAiAssetRepository.getLocalAssets();
    const item = mockAiAssetRepository.getMarketplaceAssets().find((asset) => asset.type === 'knowledge');

    const installed = installMarketplaceAsset({
      item,
      installedIds: [],
      skills,
      knowledge,
    });

    expect(installed.knowledge[0]).toMatchObject({
      source: 'marketplace',
      sourceId: item.id,
      enabled: true,
    });
    expect(selectInstalledAssets(installed)).toHaveLength(1);
  });
});
