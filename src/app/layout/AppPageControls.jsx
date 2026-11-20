import { T } from '../../theme';
import { AppPageToolbar } from './AppPageToolbar';

const actionClusterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: T.paddingSM,
  flexWrap: 'wrap',
};

const renderToolbarActions = (secondaryActions, primaryAction) => {
  if (!secondaryActions && !primaryAction) return null;

  return (
    <div style={actionClusterStyle}>
      {secondaryActions}
      {primaryAction}
    </div>
  );
};

export const AppPageControls = ({
  layout = 'toolbar-only',
  tabs,
  filters,
  primaryAction,
  secondaryActions,
  actionPlacement,
  children,
  style,
  toolbarStyle,
  stackGap,
  marginBottom,
}) => {
  if (layout === 'none') {
    return children ? <div style={style}>{children}</div> : null;
  }

  const toolbar =
    filters || primaryAction || secondaryActions ? (
      <AppPageToolbar
        left={filters}
        right={renderToolbarActions(secondaryActions, primaryAction)}
        actionPlacement={actionPlacement}
        style={{ marginBottom: 0, ...toolbarStyle }}
      />
    ) : null;

  const rows = [];

  if (layout === 'tabs-first' && tabs) {
    rows.push(tabs);
  }

  if ((layout === 'toolbar-only' || layout === 'tabs-first' || layout === 'workspace') && toolbar) {
    rows.push(toolbar);
  }

  if ((layout === 'workspace' || layout === 'tabs-first') && children) {
    rows.push(children);
  }

  if (!rows.length) return null;

  const resolvedMarginBottom =
    marginBottom ?? (layout === 'tabs-first' && !toolbar ? T.paddingXS : T.padding);

  return (
    <div
      style={{
        display: 'grid',
        gap: stackGap ?? (layout === 'toolbar-only' ? 0 : T.paddingXS),
        marginBottom: resolvedMarginBottom,
        ...style,
      }}
    >
      {rows.map((row, index) => (
        <div key={index}>{row}</div>
      ))}
    </div>
  );
};

export default AppPageControls;
