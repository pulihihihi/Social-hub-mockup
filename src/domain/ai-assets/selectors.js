export const selectInstalledAssets = ({ skills = [], knowledge = [] }) => [
  ...skills.filter((item) => item.source === 'marketplace'),
  ...knowledge.filter((item) => item.source === 'marketplace'),
];
