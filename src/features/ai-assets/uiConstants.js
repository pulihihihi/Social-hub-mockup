import { T, C } from '../../theme';

export const tabLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

export const countBadgeStyle = {
  minWidth: 20,
  height: 20,
  padding: '0 6px',
  borderRadius: 10,
  background: T.colorFillTertiary,
  color: T.colorTextSecondary,
  fontSize: T.fontSizeXS,
  lineHeight: '20px',
  textAlign: 'center',
};

export const emptyCardStyle = {
  padding: T.paddingLG,
  background: C.white,
  border: `1px solid ${T.colorBorderSecondary}`,
  borderRadius: T.borderRadiusLG,
};

export const knowledgeCardStyle = {
  borderColor: T.colorBorderSecondary,
  boxShadow: 'none',
};

export const knowledgeIconWrapStyle = {
  width: 40,
  height: 40,
  borderRadius: T.borderRadiusLG,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: T.colorWarningBg,
  flexShrink: 0,
};

export const getTypeLabel = (type) => (type === 'knowledge' ? 'Knowledge' : 'Skill');

export const formatNumber = (value) => (value || 0).toLocaleString();

export const formatDateLabel = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

export const getOriginLabel = (originTab) => {
  if (originTab === 'marketplace') return 'Back to Marketplace';
  if (originTab === 'approvals') return 'Back to Approvals';
  if (originTab === 'knowledge') return 'Back to My Knowledge';
  return 'Back to My Skills';
};
