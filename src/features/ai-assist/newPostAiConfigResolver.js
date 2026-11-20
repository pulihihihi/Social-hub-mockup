import { getManagedAiAssetStoreState } from '../ai-assets/aiAssetStore';
import { attachNewPostAiGroupMeta, getNewPostAiSections } from './newPostAiRegistry';

const unique = (values = []) => Array.from(new Set(values.filter(Boolean)));

const dedupeById = (items = []) => Array.from(
  items.reduce((map, item) => map.set(item.id, item), new Map()).values(),
);

const getAssetState = ({ skills, knowledge } = {}) => {
  if (Array.isArray(skills) || Array.isArray(knowledge)) {
    return {
      skills: Array.isArray(skills) ? skills : [],
      knowledge: Array.isArray(knowledge) ? knowledge : [],
    };
  }

  return getManagedAiAssetStoreState();
};

const buildSectionReason = (section) => `Used for ${section.label}`;

const buildLinkedAsset = (asset, section) => ({
  ...asset,
  linkedReasons: [buildSectionReason(section)],
  linkedSectionKeys: [section.key],
});

const appendLinkedReason = (items = []) => dedupeById(items).map((item) => ({
  ...item,
  linkedReasons: unique(item.linkedReasons),
  linkedSectionKeys: unique(item.linkedSectionKeys),
}));

const findLinkedAssets = ({ ids = [], pool = [], section }) => appendLinkedReason(
  ids
    .map((id) => pool.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => buildLinkedAsset(item, section)),
);

const buildSetupWarnings = ({ activeSkills, activeKnowledge, section }) => {
  const warnings = [];

  if (!activeSkills.length) {
    warnings.push(`No active skills are enabled for ${section.label}.`);
  }

  if (!activeKnowledge.length) {
    warnings.push(`No active knowledge packs are enabled for ${section.label}.`);
  }

  return warnings;
};

const evaluateSectionRelevance = (section, context) => {
  if (typeof section.isRelevant === 'function') {
    return section.isRelevant(context);
  }

  if (typeof section.isRelevant === 'boolean') {
    return section.isRelevant;
  }

  return true;
};

const indexBySectionKey = (sections, field) => Object.fromEntries(
  sections.map((section) => [section.key, section[field]]),
);

export const summarizeNewPostAiConfig = (resolvedConfig = {}) => {
  const sections = (resolvedConfig.sections || []).filter((section) => section.isRelevant !== false);

  return {
    activeKnowledgeCount: dedupeById(sections.flatMap((section) => section.activeKnowledge || [])).length,
    activeSkillCount: dedupeById(sections.flatMap((section) => section.activeSkills || [])).length,
    readySectionCount: sections.filter((section) => section.hasRequiredAssets).length,
    sectionsNeedingSetup: sections.filter((section) => !section.hasRequiredAssets).length,
    totalSectionCount: sections.length,
  };
};

export const resolveNewPostAiConfig = ({
  context,
  knowledge,
  sectionKeys = [],
  skills,
} = {}) => {
  const assetState = getAssetState({ skills, knowledge });
  const sections = getNewPostAiSections(sectionKeys).map(attachNewPostAiGroupMeta);

  const resolvedSections = sections.map((section) => {
    const isRelevant = evaluateSectionRelevance(section, context);
    const linkedSkills = findLinkedAssets({
      ids: section.skills || [],
      pool: assetState.skills,
      section,
    });
    const linkedKnowledge = findLinkedAssets({
      ids: section.knowledge || [],
      pool: assetState.knowledge,
      section,
    });
    const activeSkills = linkedSkills.filter((item) => item.enabled !== false);
    const activeKnowledge = linkedKnowledge.filter((item) => item.enabled !== false);
    const disabledSkills = linkedSkills.filter((item) => item.enabled === false);
    const disabledKnowledge = linkedKnowledge.filter((item) => item.enabled === false);
    const setupWarnings = buildSetupWarnings({
      activeKnowledge,
      activeSkills,
      section,
    });

    return {
      ...section,
      activeKnowledge,
      activeSkills,
      disabledKnowledge,
      disabledSkills,
      hasRequiredAssets: setupWarnings.length === 0,
      isRelevant,
      linkedKnowledge,
      linkedSkills,
      missingRequiredAssets: {
        knowledge: activeKnowledge.length === 0,
        skills: activeSkills.length === 0,
      },
      setupWarnings,
    };
  });

  return {
    activeKnowledgeBySection: indexBySectionKey(resolvedSections, 'activeKnowledge'),
    activeSkillsBySection: indexBySectionKey(resolvedSections, 'activeSkills'),
    disabledKnowledgeBySection: indexBySectionKey(resolvedSections, 'disabledKnowledge'),
    disabledSkillsBySection: indexBySectionKey(resolvedSections, 'disabledSkills'),
    linkedKnowledgeBySection: indexBySectionKey(resolvedSections, 'linkedKnowledge'),
    linkedSkillsBySection: indexBySectionKey(resolvedSections, 'linkedSkills'),
    missingRequiredAssetsBySection: Object.fromEntries(
      resolvedSections.map((section) => [
        section.key,
        {
          ...section.missingRequiredAssets,
          warnings: section.setupWarnings,
        },
      ]),
    ),
    sections: resolvedSections,
    summary: summarizeNewPostAiConfig({ sections: resolvedSections }),
  };
};
