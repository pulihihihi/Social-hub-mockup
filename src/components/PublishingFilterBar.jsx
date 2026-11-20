import { Button, Popover, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import './PublishingFilterBar.css';

const { Text } = Typography;

export function PublishingFilterBar({
  ariaLabel,
  actions = null,
  children,
  activeCount = 0,
  onClearAll,
  clearText = 'Clear All',
  disableClearWhenInactive = true,
  showClearAll = false,
  className = '',
}) {
  const canClear = activeCount > 0;
  const shouldRenderClear = onClearAll && (canClear || showClearAll);
  const hasActions = shouldRenderClear || actions;

  return (
    <div className={`publishing-filterbar ${className}`.trim()} aria-label={ariaLabel}>
      {children}
      {hasActions ? (
        <div className="publishing-filterbar-actions">
          {shouldRenderClear ? (
            <Button
              type="link"
              className="publishing-filterbar-clear"
              onClick={onClearAll}
              disabled={disableClearWhenInactive && !canClear}
            >
              {clearText}
            </Button>
          ) : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export function PublishingFilterCell({
  title,
  summary,
  activeCount = 0,
  children,
  popoverWidth = 260,
  placement = 'bottomLeft',
}) {
  const hasActive = activeCount > 0;

  return (
    <Popover
      trigger="click"
      placement={placement}
      content={<div style={{ width: popoverWidth }}>{children}</div>}
      overlayClassName="publishing-filterbar-overlay"
    >
      <Button type="text" className={hasActive ? 'publishing-filter-cell is-active' : 'publishing-filter-cell'}>
        <span className="publishing-filter-cell-inner">
          <span className="publishing-filter-cell-copy">
            <span className="publishing-filter-cell-title-row">
              <Text className="publishing-filter-cell-title">{title}</Text>
              {hasActive ? <span className="publishing-filter-cell-count">{activeCount}</span> : null}
            </span>
            <Text className="publishing-filter-cell-summary">{summary}</Text>
          </span>
          <DownOutlined className="publishing-filter-cell-chevron" />
        </span>
      </Button>
    </Popover>
  );
}

export default PublishingFilterBar;
