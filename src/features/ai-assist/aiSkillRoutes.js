export const AI_SKILL_ROUTE = '/settings/ai-skill';

export const getAiSkillTabForType = (detailType = 'skill') => (
  detailType === 'knowledge' ? 'knowledge' : 'skills'
);

export const buildAiSkillRoute = ({ tab = 'skills' } = {}) => {
  const params = new URLSearchParams();

  if (tab) {
    params.set('tab', tab);
  }

  const search = params.toString();
  return search ? `${AI_SKILL_ROUTE}?${search}` : AI_SKILL_ROUTE;
};

export const buildAiSkillDetailRoute = ({
  detailId,
  detailType = 'skill',
  sourceKind = 'local',
  tab = getAiSkillTabForType(detailType),
  originTab = tab,
} = {}) => {
  const params = new URLSearchParams();

  if (tab) {
    params.set('tab', tab);
  }

  if (detailType) {
    params.set('detailType', detailType);
  }

  if (detailId) {
    params.set('detailId', detailId);
  }

  if (sourceKind) {
    params.set('sourceKind', sourceKind);
  }

  if (originTab) {
    params.set('originTab', originTab);
  }

  return `${AI_SKILL_ROUTE}?${params.toString()}`;
};

export const parseAiSkillRoute = (search = '') => {
  const params = new URLSearchParams(search || '');
  const detailId = params.get('detailId');
  const detailType = params.get('detailType');
  const sourceKind = params.get('sourceKind') || 'local';
  const requestedTab = params.get('tab');
  const tab = requestedTab || (detailType ? getAiSkillTabForType(detailType) : null);

  if (!tab && !detailId && !detailType) {
    return null;
  }

  return {
    tab,
    detailId,
    detailType,
    sourceKind,
    originTab: params.get('originTab') || tab,
  };
};
