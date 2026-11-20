import { T } from '../../theme';
import { APP_TOOLBAR_WIDTHS } from './AppToolbarFilters.constants';

const toolbarFiltersStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: T.paddingSM,
  flexWrap: 'wrap',
  minWidth: 0,
  width: '100%',
};

const buildItemStyle = (width) => ({
  flex: '0 0 auto',
  width,
  maxWidth: '100%',
  minWidth: 0,
});

export const AppToolbarFilters = ({ children, style }) => (
  <div data-testid="app-toolbar-filters" style={{ ...toolbarFiltersStyle, ...style }}>
    {children}
  </div>
);

export const AppToolbarSearch = ({ children, width = APP_TOOLBAR_WIDTHS.search, style }) => (
  <div data-testid="app-toolbar-search" style={{ ...buildItemStyle(width), order: 1, ...style }}>
    {children}
  </div>
);

export const AppToolbarFilter = ({ children, width = APP_TOOLBAR_WIDTHS.filter, style }) => (
  <div data-testid="app-toolbar-filter" style={{ ...buildItemStyle(width), ...style }}>
    {children}
  </div>
);

export const AppToolbarUtility = ({ children, style }) => (
  <div data-testid="app-toolbar-utility" style={{ flex: '0 0 auto', order: 2, ...style }}>
    {children}
  </div>
);

export default AppToolbarFilters;
