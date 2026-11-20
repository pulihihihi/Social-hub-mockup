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
import SettingsTagManagementPage from '../src/pages/SettingsTagManagement';

const renderPage = (ui) => render(
  <MemoryRouter>
    <AppProviders>
      {ui}
    </AppProviders>
  </MemoryRouter>,
);

beforeEach(() => {
  window.localStorage.clear();
});

describe('SettingsTagManagement system tags', () => {
  it('shows description as the column after System Tag without the retired summary blocks', async () => {
    renderPage(<SettingsTagManagementPage initialTagView="system" />);

    expect(screen.queryByText('System tags are generated automatically and enabled by default.')).not.toBeInTheDocument();
    expect(screen.queryByText('7 enabled')).not.toBeInTheDocument();
    expect(screen.queryByText('7 system tags available')).not.toBeInTheDocument();

    const table = screen.getByRole('table');
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((header) => header.textContent.trim().replace(/\s+/g, ' '))
      .filter((header) => header && header !== 'Select');

    expect(headers.slice(0, 3)).toEqual(['ID', 'Tag', 'Description']);
    expect(headers).toContain('Tag Groups');
    expect(headers).not.toContain('Example');
    expect(within(table).getByText('Automatically marks messages where the detected audience sentiment is positive.')).toBeInTheDocument();
    expect(within(table).getAllByText('All Facebook').length).toBeGreaterThan(0);
    expect(within(table).getAllByText('Instagram Direct Messages').length).toBeGreaterThan(0);
    expect(within(table).getByRole('switch', { name: 'Toggle Message Positive' })).toBeInTheDocument();
    expect(within(table).queryByText('On')).not.toBeInTheDocument();
    expect(within(table).queryByText('Off')).not.toBeInTheDocument();
  });

  it('uses the shared selection toolbar contract for system tags', async () => {
    renderPage(<SettingsTagManagementPage initialTagView="system" />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    const alertBar = screen.getByTestId('app-pro-table-alert');
    expect(within(alertBar).getByText('1 selected')).toBeInTheDocument();
    expect(within(alertBar).getByRole('button', { name: 'Enable' })).toBeInTheDocument();
    expect(within(alertBar).getByRole('button', { name: 'Disable' })).toBeInTheDocument();
    expect(within(alertBar).getByRole('button', { name: 'Deselect' })).toBeInTheDocument();
  });

  it('allows system tags to be attached to Tag Groups', async () => {
    window.localStorage.setItem('socialhub.tagTaxonomy.v1', JSON.stringify({
      tags: [],
      tagGroups: [{ id: 'group-launch', name: 'Launch Tags' }],
    }));

    renderPage(<SettingsTagManagementPage initialTagView="system" />);

    const table = screen.getByRole('table');
    const tagGroupSelect = within(table).getAllByRole('combobox')[0];
    fireEvent.mouseDown(tagGroupSelect.closest('.ant-select')?.querySelector('.ant-select-selector') || tagGroupSelect);
    fireEvent.click(await screen.findByText('Launch Tags'));

    await waitFor(() => {
      const storedTaxonomy = JSON.parse(window.localStorage.getItem('socialhub.tagTaxonomy.v1'));
      const launchGroup = storedTaxonomy.tagGroups.find((group) => group.name === 'Launch Tags');

      expect(launchGroup.systemTagIds.length).toBeGreaterThan(0);
    });
  }, 15000);
});
