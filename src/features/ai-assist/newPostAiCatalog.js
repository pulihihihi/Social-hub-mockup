import { resolveNewPostAiConfig } from './newPostAiConfigResolver';

const unique = (values = []) => Array.from(new Set(values.filter(Boolean)));

const dedupeById = (items = []) => Array.from(
  items.reduce((map, item) => {
    const currentItem = map.get(item.id);

    if (!currentItem) {
      map.set(item.id, item);
      return map;
    }

    map.set(item.id, {
      ...currentItem,
      linkedReasons: unique([...(currentItem.linkedReasons || []), ...(item.linkedReasons || [])]),
      linkedSectionKeys: unique([...(currentItem.linkedSectionKeys || []), ...(item.linkedSectionKeys || [])]),
    });
    return map;
  }, new Map()),
  ([, item]) => item,
);

export const getNewPostAiAssetsForSections = (sectionKeys = [], assetState = {}) => {
  const resolvedConfig = resolveNewPostAiConfig({
    sectionKeys,
    ...assetState,
  });
  const sections = resolvedConfig.sections || [];

  return {
    configSummary: resolvedConfig.summary,
    disabledKnowledge: dedupeById(sections.flatMap((section) => section.disabledKnowledge || [])),
    disabledSkills: dedupeById(sections.flatMap((section) => section.disabledSkills || [])),
    missingRequiredAssetsBySection: resolvedConfig.missingRequiredAssetsBySection,
    sections,
    skills: dedupeById(
      sections.flatMap((section) => section.activeSkills || []),
    ),
    knowledge: dedupeById(
      sections.flatMap((section) => section.activeKnowledge || []),
    ),
  };
};
