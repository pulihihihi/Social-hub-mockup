import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { afterEach } from 'vitest';

vi.mock('@ant-design/pro-components', () => {
  const h = React.createElement;

  const PageContainer = ({ title, breadcrumb, extra, content, children }) => h(
    'div',
    { 'data-testid': 'mock-page-container' },
    breadcrumb?.items?.length
      ? h(
          'nav',
          { 'aria-label': 'Breadcrumb' },
          breadcrumb.items
            .filter((item) => item.title !== title)
            .map((item, index) =>
            h('span', { key: `${item.title}-${index}` }, item.title),
            ),
        )
      : null,
    title ? h('h1', null, title) : null,
    extra ? h('div', null, extra) : null,
    content ? h('div', null, content) : null,
    h('div', null, children),
  );

  const ProCard = ({ title, extra, children }) => h(
    'section',
    { 'data-testid': 'mock-pro-card' },
    title ? h('div', null, title) : null,
    extra ? h('div', null, extra) : null,
    h('div', null, children),
  );

  const StatisticCard = ({ statistic, children }) => h(
    'section',
    { 'data-testid': 'mock-statistic-card' },
    statistic?.title ? h('div', null, statistic.title) : null,
    statistic?.value !== undefined ? h('div', null, statistic.value) : null,
    statistic?.description ? h('div', null, statistic.description) : null,
    h('div', null, children),
  );

  StatisticCard.Group = ({ children }) => h('div', { 'data-testid': 'mock-statistic-card-group' }, children);

  const QueryFilter = ({ children }) => h('section', { 'data-testid': 'mock-query-filter' }, children);

  const ProDescriptions = ({ columns = [], dataSource = {} }) => h(
    'dl',
    { 'data-testid': 'mock-pro-descriptions' },
    columns.map((column) =>
      h(
        React.Fragment,
        { key: column.dataIndex || column.title },
        h('dt', null, column.title),
        h('dd', null, dataSource[column.dataIndex]),
      ),
    ),
  );

  const ProLayout = ({
    children,
    headerContentRender,
    layout,
    logo,
    menuExtraRender,
    menuHeaderRender,
    menuProps,
    navTheme,
    route,
    menuItemRender,
    token,
    title,
  }) => {
    const renderMenuItems = (items = []) => (
      items.flatMap((item) => {
        const key = item.path || item.name;
        const renderedItem = menuItemRender
          ? menuItemRender(item, h('span', null, item.name))
          : h('span', null, item.name);
        const childItems = item.routes?.length && menuProps?.openKeys?.includes(item.path)
          ? h('div', { 'data-testid': `mock-pro-layout-submenu-${item.path}` }, renderMenuItems(item.routes))
          : null;

        return [
          h('div', { key }, renderedItem),
          childItems ? h(React.Fragment, { key: `${key}-children` }, childItems) : null,
        ].filter(Boolean);
      })
    );

    const headerNode = menuHeaderRender
      ? h('div', { 'data-testid': 'mock-pro-layout-header-content' }, menuHeaderRender(logo))
      : h(
          React.Fragment,
          null,
          h('div', null, logo),
          title ? h('span', null, title) : null,
        );

    return h(
      'div',
      {
        'data-testid': 'mock-pro-layout',
        'data-nav-theme': navTheme || '',
        'data-sider-bg': token?.layout?.sider?.colorMenuBackground || '',
      },
      h(
        'header',
        { 'data-testid': 'mock-pro-layout-header' },
        headerNode,
        layout === 'mix' && headerContentRender
          ? h('div', { 'data-testid': 'mock-pro-layout-mix-header-content' }, headerContentRender({}, null))
          : null,
      ),
      h(
        'nav',
        { 'aria-label': 'App navigation' },
        menuExtraRender ? h('div', { 'data-testid': 'mock-pro-layout-menu-extra' }, menuExtraRender({}, null)) : null,
        renderMenuItems(route?.routes || []),
      ),
      layout === 'side'
        ? h('aside', { 'data-testid': 'mock-pro-layout-sider-actions' })
        : null,
      h('main', null, children),
    );
  };

  const ProTable = ({
    columns = [],
    dataSource = [],
    locale,
    rowKey = 'id',
    rowSelection,
    tableAlertOptionRender,
    tableAlertRender,
  }) => {
    const [internalKeys, setInternalKeys] = React.useState(rowSelection?.selectedRowKeys || []);
    const selectedRowKeys = rowSelection?.selectedRowKeys ?? internalKeys;

    const getRowKey = (record) => (
      typeof rowKey === 'function' ? rowKey(record) : record?.[rowKey]
    );

    const updateSelection = (nextKeys, nextRows) => {
      if (!rowSelection?.selectedRowKeys) {
        setInternalKeys(nextKeys);
      }

      rowSelection?.onChange?.(nextKeys, nextRows);
    };

    const toggleRow = (record, checked) => {
      const key = getRowKey(record);
      const nextKeys = checked
        ? [...selectedRowKeys, key]
        : selectedRowKeys.filter((selectedKey) => selectedKey !== key);
      const nextRows = dataSource.filter((item) => nextKeys.includes(getRowKey(item)));

      updateSelection(nextKeys, nextRows);
    };

    const onCleanSelected = () => updateSelection([], []);
    const alertText = typeof tableAlertRender === 'function'
      ? tableAlertRender({ selectedRowKeys, onCleanSelected })
      : null;
    const alertOptions = typeof tableAlertOptionRender === 'function'
      ? tableAlertOptionRender({ selectedRowKeys, onCleanSelected })
      : null;

    if (!dataSource.length) {
      return h('div', null, locale?.emptyText || 'No data');
    }

    return h(
      'div',
      null,
      selectedRowKeys.length
        ? h(
            'div',
            { 'data-testid': 'mock-pro-table-alert-wrapper' },
            alertText || null,
            alertOptions ? h('div', null, alertOptions) : null,
          )
        : null,
      h(
        'table',
        null,
        h(
          'thead',
          null,
          h(
            'tr',
            null,
            rowSelection ? h('th', null, 'Select') : null,
            columns.map((column) =>
              h('th', { key: column.key || column.dataIndex || column.title }, column.title),
            ),
          ),
        ),
        h(
          'tbody',
          null,
          dataSource.map((record, rowIndex) => {
            const key = getRowKey(record);

            return h(
              'tr',
              { key },
              rowSelection
                ? h(
                    'td',
                    null,
                    h('input', {
                      'aria-label': `select-row-${key}`,
                      checked: selectedRowKeys.includes(key),
                      onChange: (event) => toggleRow(record, event.target.checked),
                      type: 'checkbox',
                    }),
                  )
                : null,
              columns.map((column) => {
                const value = column.dataIndex ? record[column.dataIndex] : undefined;
                const content = column.render
                  ? column.render(value, record, rowIndex)
                  : value;

                return h(
                  'td',
                  { key: column.key || column.dataIndex || column.title },
                  content ?? null,
                );
              }),
            );
          }),
        ),
      ),
    );
  };

  const createOverlayForm = (displayName) => {
    const OverlayForm = ({
      cancelText = 'Cancel',
      children,
      onFinish,
      onOpenChange,
      open,
      submitText = 'Save',
      title,
    }) => {
      if (!open) return null;

      return h(
        'div',
        { 'data-testid': displayName },
        h('h2', null, title),
        h('div', null, children),
        h(
          'button',
          { onClick: () => onOpenChange?.(false), type: 'button' },
          cancelText,
        ),
        h(
          'button',
          { onClick: () => onFinish?.({}), type: 'button' },
          submitText,
        ),
      );
    };

    return OverlayForm;
  };

  const StepForm = ({ children }) => h('div', null, children);

  const StepsForm = ({ children, onFinish, stepsFormRender, submitter }) => {
    const stepChildren = React.Children.toArray(children);
    const [current, setCurrent] = React.useState(0);
    const isLastStep = current === stepChildren.length - 1;
    const dom = stepChildren[current] ?? null;

    const defaultButtons = h(
      React.Fragment,
      null,
      current > 0
        ? h(
            'button',
            { onClick: () => setCurrent(current - 1), type: 'button' },
            submitter?.searchConfig?.resetText || 'Back',
          )
        : null,
      h(
        'button',
        {
          onClick: () => {
            if (isLastStep) {
              onFinish?.({});
              return;
            }

            setCurrent(current + 1);
          },
          type: 'button',
        },
        isLastStep ? submitter?.searchConfig?.submitText || 'Submit' : 'Next',
      ),
    );

    return stepsFormRender
      ? stepsFormRender(dom, defaultButtons)
      : h('div', null, dom, defaultButtons);
  };

  StepsForm.StepForm = StepForm;

  const ProFormText = () => null;
  const ProFormTextArea = () => null;
  const ProFormDigit = () => null;
  const ProFormSelect = () => null;
  const ProFormGroup = ({ children }) => h('div', null, children);
  const ProFormDependency = ({ children }) => h('div', null, typeof children === 'function' ? children({}) : children);
  const ProFormCheckbox = () => null;
  ProFormCheckbox.Group = () => null;

  return {
    DrawerForm: createOverlayForm('mock-drawer-form'),
    ModalForm: createOverlayForm('mock-modal-form'),
    PageContainer,
    ProFormCheckbox,
    ProFormDependency,
    ProFormDigit,
    ProFormGroup,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProCard,
    ProDescriptions,
    ProLayout,
    ProTable,
    QueryFilter,
    StatisticCard,
    StepsForm,
  };
});

if (!globalThis.matchMedia) {
  globalThis.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!globalThis.scrollTo) {
  globalThis.scrollTo = () => {};
}

afterEach(() => {
  cleanup();
});
