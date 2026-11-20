import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';
import SettingsTagManagementPage from '../src/pages/SettingsTagManagement';

const renderPage = () => render(
  <MemoryRouter>
    <AppProviders>
      <AppProLayout>
        <SettingsTagManagementPage />
      </AppProLayout>
    </AppProviders>
  </MemoryRouter>,
);

const renderRoute = (initialEntry) => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <AppProviders>
      <AppProLayout>
        <SettingsTagManagementPage />
      </AppProLayout>
    </AppProviders>
  </MemoryRouter>,
);

beforeEach(() => {
  window.localStorage.clear();
});

describe('SettingsTagManagement Tag Groups', () => {
  it('shows Status as the filter label for Tags and Tag Groups while keeping status values in the menu', async () => {
    renderPage();

    const getStatusFilterShell = () => screen.getAllByRole('combobox')[0].closest('.ant-select');

    expect(getStatusFilterShell()?.textContent).toContain('Status');
    expect(getStatusFilterShell()?.textContent).not.toContain('All');

    fireEvent.mouseDown(getStatusFilterShell());
    expect(await screen.findByText('All')).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Archived').length).toBeGreaterThan(0);
    fireEvent.click(document.body);

    fireEvent.click(screen.getByRole('tab', { name: 'Tag Groups' }));
    expect(getStatusFilterShell()?.textContent).toContain('Status');
    expect(getStatusFilterShell()?.textContent).not.toContain('All');

    fireEvent.mouseDown(getStatusFilterShell());
    expect(await screen.findByText('All')).toBeInTheDocument();
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Archived').length).toBeGreaterThan(0);
  }, 15000);

  it('uses Tags, Tag Groups, and System Tags tabs without exposing Collection management', () => {
    renderPage();

    expect(screen.getByRole('tab', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tag Groups' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'System Tags' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Collections' })).not.toBeInTheDocument();
  });

  it('places ID first and sorts each Tag Management table by newest ID first', () => {
    window.localStorage.setItem('socialhub.tagTaxonomy.v1', JSON.stringify({
      tags: [
        { id: 'tag-1', name: 'Older Tag' },
        { id: 'tag-2', name: 'Middle Tag' },
        { id: 'tag-3', name: 'Newest Tag' },
      ],
      tagGroups: [
        { id: 'group-10', name: 'Older Group', tagIds: ['tag-1'] },
        { id: 'group-30', name: 'Newest Group', tagIds: ['tag-3'] },
      ],
    }));

    renderPage();

    const getHeaderLabels = () => within(screen.getByRole('table'))
      .getAllByRole('columnheader')
      .map((header) => header.textContent.trim())
      .filter((header) => header && header !== 'Select');
    const getFirstDataId = () => {
      const firstRow = screen.getByRole('table').querySelector('tbody tr');
      return firstRow?.querySelectorAll('td')[1]?.textContent?.trim();
    };

    expect(getHeaderLabels()[0]).toBe('ID');
    expect(getFirstDataId()).toBe('3');

    fireEvent.click(screen.getByRole('tab', { name: 'Tag Groups' }));
    expect(getHeaderLabels()[0]).toBe('ID');
    expect(getFirstDataId()).toBe('2');

    fireEvent.click(screen.getByRole('tab', { name: 'System Tags' }));
    expect(getHeaderLabels()[0]).toBe('ID');
  }, 15000);

  it('shows tag values and planner entry points directly in the Tag Groups table', () => {
    window.localStorage.setItem('socialhub.tagTaxonomy.v1', JSON.stringify({
      tags: [{ id: 'tag-alpha', name: 'Alpha' }],
      tagGroups: [
        { id: 'group-empty', name: 'Empty Group', tagIds: [], systemTagIds: [] },
        { id: 'group-filled', name: 'Filled Group', tagIds: ['tag-alpha'], systemTagIds: ['sentiment-positive'] },
      ],
    }));

    renderPage();

    fireEvent.click(screen.getByRole('tab', { name: 'Tag Groups' }));

    const table = screen.getByRole('table');
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((header) => header.textContent.trim().replace(/\s+/g, ' '))
      .filter((header) => header && header !== 'Select');

    expect(headers).toEqual(['ID', 'Tag Group', 'Status', 'Date Range', 'Tags', 'System Tags', 'Planner']);
    expect(table?.textContent).toContain('Tag Group');
    expect(table?.textContent).toContain('Planner');
    expect(table?.textContent).toContain('Open Planner');
    expect(table?.textContent).not.toContain('Preview');
    expect(table?.textContent).not.toContain('Used in Calendar');
    expect(table?.textContent).not.toContain('No tags');
    expect(table?.textContent).not.toContain('No system tags');
    expect(table?.querySelector('[data-icon="book"]')).toBeTruthy();

    const filledRow = screen.getByText('Filled Group').closest('tr');
    const filledCells = within(filledRow).getAllByRole('cell');
    expect(filledCells[5].textContent.trim()).toBe('Alpha');
    expect(filledCells[6].textContent.trim()).toBe('Message Positive');

    const emptyRow = screen.getByText('Empty Group').closest('tr');
    const emptyCells = within(emptyRow).getAllByRole('cell');
    expect(emptyCells[5].textContent.trim()).toBe('');
    expect(emptyCells[6].textContent.trim()).toBe('');
  }, 15000);

  it('allows creating an empty Tag Group', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('tab', { name: 'Tag Groups' }));
    fireEvent.click(screen.getByRole('button', { name: /Add/ }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).queryByText('Tags')).not.toBeInTheDocument();
    expect(within(dialog).getByText('Color')).toBeInTheDocument();
    expect(within(dialog).getByText('Date Range')).toBeInTheDocument();
    expect(dialog.querySelector('.settings-tag-group-date-range')).toBeTruthy();
    fireEvent.change(within(dialog).getByLabelText('Tag Group name *'), {
      target: { value: 'Seasonal Beats' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByText('Seasonal Beats')).toBeInTheDocument();
    });
    const seasonalRow = screen.getByText('Seasonal Beats').closest('tr');
    const seasonalCells = within(seasonalRow).getAllByRole('cell');
    expect(seasonalCells[5].textContent.trim()).toBe('');
  }, 15000);

  it('dedupes duplicate Tag Groups from stored local taxonomy', () => {
    window.localStorage.setItem('socialhub.tagTaxonomy.v1', JSON.stringify({
      tags: [],
      tagGroups: [
        { id: 'group-a', name: 'Duplicate Group' },
        { id: 'group-b', name: 'duplicate group' },
      ],
    }));

    renderPage();

    fireEvent.click(screen.getByRole('tab', { name: 'Tag Groups' }));

    expect(screen.getAllByText('Duplicate Group')).toHaveLength(1);
  }, 15000);

  it('opens the Tag Groups add dialog from the legacy create alias query', () => {
    renderRoute('/settings/tag-management?tab=groups&action=add');

    expect(screen.getByRole('tab', { name: 'Tag Groups' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('dialog')).toHaveTextContent('Add Tag Group');
  });
});
