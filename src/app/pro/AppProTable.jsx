import { isValidElement } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Empty } from 'antd';
import { T } from '../../theme';

const getNodeText = (node) => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (isValidElement(node)) return getNodeText(node.props.children);
  return '';
};

const resolveAlertActionTone = (label) => {
  if (/(delete|remove|reject|disable|off)/i.test(label)) {
    return { danger: true, type: 'default' };
  }

  if (/(approve|assign|connect|enable|submit|save|import|create|publish)/i.test(label)) {
    return { type: 'primary' };
  }

  return { type: 'default' };
};

const normalizeAlertAction = (action, index) => {
  if (!isValidElement(action)) return null;

  const label = getNodeText(action.props.children).trim() || `Action ${index + 1}`;
  const tone = resolveAlertActionTone(label);
  const actionClassName = [
    'app-pro-table-alert-action',
    tone.type === 'primary' ? 'app-pro-table-alert-action-primary' : null,
    tone.danger ? 'app-pro-table-alert-action-danger' : null,
    action.props.className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button
      key={action.key ?? `alert-action-${index}`}
      size="small"
      className={actionClassName}
      type={tone.type}
      danger={tone.danger}
      disabled={action.props.disabled}
      loading={action.props.loading}
      onClick={action.props.onClick}
      href={action.props.href}
      target={action.props.target}
      style={action.props.style}
    >
      {action.props.children}
    </Button>
  );
};

export const AppProTable = ({
  alertActions = [],
  className,
  emptyDescription = 'No data',
  locale,
  pagination,
  toolbar,
  ...props
}) => {
  const mergedClassName = ['app-pro-table', className].filter(Boolean).join(' ');
  const mergedPagination = pagination === false
    ? false
    : {
        pageSize: 10,
        showSizeChanger: false,
        size: 'small',
        ...pagination,
      };

  const renderAlertBar = ({ selectedRowKeys, onCleanSelected }) => {
    const selectedCount = selectedRowKeys?.length || 0;

    if (!selectedCount) return false;

    const normalizedActions = alertActions
      .map((action, index) => normalizeAlertAction(action, index))
      .filter(Boolean);

    return (
      <div
        data-testid="app-pro-table-alert"
        className="app-pro-table-alert-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: T.paddingXS,
          flexWrap: 'wrap',
          width: '100%',
          minHeight: 32,
          padding: `6px ${T.paddingSM}px`,
          marginBottom: 0,
          background: T.colorPrimaryBg,
          borderBottom: `1px solid ${T.colorPrimaryBorder}`,
        }}
      >
        <span
          className="app-pro-table-alert-count"
          style={{
            color: T.colorPrimary,
            fontSize: T.fontSizeSM,
            fontWeight: T.fontWeightStrong,
            whiteSpace: 'nowrap',
          }}
        >
          {selectedCount} selected
        </span>

        <div
          className="app-pro-table-alert-divider"
          style={{
            width: 1,
            height: 14,
            background: T.colorPrimaryBorder,
          }}
        />

        <div
          className="app-pro-table-alert-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: T.paddingXXS,
            flexWrap: 'wrap',
          }}
        >
          {normalizedActions}
          <Button
            type="link"
            size="small"
            className="app-pro-table-alert-clear"
            onClick={onCleanSelected}
            style={{ paddingInline: 4 }}
          >
            Deselect
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ProTable
      className={mergedClassName}
      search={false}
      options={false}
      cardBordered={false}
      rowKey="id"
      dateFormatter="string"
      toolbar={toolbar ?? false}
      pagination={mergedPagination}
      tableStyle={{ borderRadius: T.borderRadiusLG, overflow: 'hidden' }}
      locale={{
        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyDescription} />,
        ...locale,
      }}
      tableAlertRender={renderAlertBar}
      tableAlertOptionRender={false}
      {...props}
    />
  );
};

export default AppProTable;
