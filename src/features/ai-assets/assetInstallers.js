const createMarketplaceId = (prefix) => `${prefix}_${Date.now()}`;
const getDateStamp = (now = () => new Date()) => now().toISOString().slice(0, 10);

export const installMarketplaceAsset = ({
  item,
  installedIds,
  skills,
  knowledge,
  createId = createMarketplaceId,
  now,
}) => {
  if (installedIds.includes(item.id)) {
    return { installedIds, skills, knowledge };
  }

  const nextInstalledIds = [...installedIds, item.id];
  const dateStamp = getDateStamp(now);

  if (item.type === 'skill') {
    const newSkill = {
      ...item,
      id: createId('sk_mp'),
      enabled: true,
      usageCount: item.installs || 0,
      source: 'marketplace',
      sourceId: item.id,
      linkedTopics: [],
      linkedKnowledge: [],
      createdAt: dateStamp,
      updatedAt: dateStamp,
    };

    return {
      installedIds: nextInstalledIds,
      skills: [newSkill, ...skills],
      knowledge,
    };
  }

  const newKnowledge = {
    ...item,
    id: createId('kn_mp'),
    enabled: true,
    usageCount: item.installs || 0,
    source: 'marketplace',
    sourceId: item.id,
    linkedSkills: [],
    sampleEntries: [],
    createdAt: dateStamp,
    updatedAt: dateStamp,
  };

  return {
    installedIds: nextInstalledIds,
    skills,
    knowledge: [newKnowledge, ...knowledge],
  };
};

export const uninstallMarketplaceAsset = ({ item, installedIds, skills, knowledge }) => ({
  installedIds: installedIds.filter((id) => id !== item.id),
  skills: skills.filter((skill) => skill.sourceId !== item.id),
  knowledge: knowledge.filter((entry) => entry.sourceId !== item.id),
});
