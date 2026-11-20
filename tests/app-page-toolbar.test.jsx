import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppPageControls } from '../src/app/layout/AppPageControls';
import {
  AppToolbarFilter,
  AppToolbarFilters,
  AppToolbarSearch,
  AppToolbarUtility,
} from '../src/app/layout/AppToolbarFilters';

const renderToolbar = () => render(
  <AppPageControls
    layout="toolbar-only"
    filters={(
      <AppToolbarFilters>
        <AppToolbarSearch>
          <input aria-label="Search" type="text" />
        </AppToolbarSearch>
        <AppToolbarFilter>
          <button type="button">Platform</button>
        </AppToolbarFilter>
        <AppToolbarUtility>
          <button type="button">Clear all</button>
        </AppToolbarUtility>
      </AppToolbarFilters>
    )}
    secondaryActions={<button type="button">Add Group</button>}
    primaryAction={<button type="button">Add</button>}
  />
);

describe('AppPageToolbar', () => {
  it('keeps the toolbar on one row at xl widths and applies standard control widths', () => {
    window.innerWidth = 1400;

    renderToolbar();

    expect(screen.getByTestId('app-page-toolbar')).toHaveStyle({ flexWrap: 'nowrap' });
    expect(screen.getByTestId('app-toolbar-search')).toHaveStyle({ width: '280px' });
    expect(screen.getByTestId('app-toolbar-filter')).toHaveStyle({ width: '152px' });
    expect(screen.getByTestId('app-page-toolbar-right')).not.toHaveStyle({ width: '100%' });
  });

  it('wraps actions below the filters below xl widths', () => {
    window.innerWidth = 1024;

    renderToolbar();

    expect(screen.getByTestId('app-page-toolbar')).toHaveStyle({ flexWrap: 'wrap' });
    expect(screen.getByTestId('app-page-toolbar-left')).toHaveStyle({ width: '100%' });
    expect(screen.getByTestId('app-page-toolbar-right')).toHaveStyle({ width: '100%' });
  });

  it('uses compact spacing between tabs and toolbar rows', () => {
    window.innerWidth = 1400;

    render(
      <AppPageControls
        layout="tabs-first"
        tabs={<div>Tabs row</div>}
        filters={(
          <AppToolbarFilters>
            <AppToolbarSearch>
              <input aria-label="Search compact" type="text" />
            </AppToolbarSearch>
          </AppToolbarFilters>
        )}
      />,
    );

    expect(screen.getByText('Tabs row').parentElement.parentElement).toHaveStyle({ gap: '8px' });
  });

  it('uses compact bottom spacing for tabs-only page controls', () => {
    render(
      <AppPageControls
        layout="tabs-first"
        tabs={<div>Tabs only</div>}
      />,
    );

    expect(screen.getByText('Tabs only').parentElement.parentElement).toHaveStyle({ marginBottom: '8px' });
  });
});
