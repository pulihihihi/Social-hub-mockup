import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');

  const Select = ({ mode, options = [], value, onChange, placeholder, style }) => {
    const isMultiple = mode === 'multiple';
    const normalizedValue = isMultiple
      ? (Array.isArray(value) ? value : [])
      : (value ?? '');

    return (
    <select
      aria-label={placeholder || 'select'}
      multiple={isMultiple}
      role="combobox"
      style={style}
      value={normalizedValue}
      onChange={(event) => {
        if (isMultiple) {
          onChange?.([...event.target.selectedOptions].map((option) => option.value));
          return;
        }

        onChange?.(event.target.value);
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {typeof option.label === 'string' ? option.label : option.value}
        </option>
      ))}
    </select>
    );
  };

  return {
    ...actual,
    Select,
  };
});

import ChannelsPage from '../src/pages/Admin/ChannelsPage';

const CHANNELS_PAGE_TEST_TIMEOUT = 20000;

const renderChannels = () => render(
  <MemoryRouter>
    <AppProviders>
      <AppProLayout>
        <ChannelsPage />
      </AppProLayout>
    </AppProviders>
  </MemoryRouter>,
);

describe('ChannelsPage inline editing', () => {
  it('keeps connection status read-only while allowing channel group inline edit', async () => {
    const user = userEvent.setup();

    renderChannels();

    expect(await screen.findByRole('tab', { name: 'All Channels' }, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add$/ })).toBeInTheDocument();

    const getTargetRow = () => screen.getByText('Garena Delta Force (VN - Vietnamese)').closest('tr');

    const initialRow = getTargetRow();
    expect(initialRow).not.toBeNull();
    expect(within(initialRow).getByText('Garena Delta Force VN')).toBeInTheDocument();
    expect(within(initialRow).getByText('Delta Force Launch')).toBeInTheDocument();

    await user.click(within(initialRow).getByRole('button', { name: /edit channel group/i }));
    await user.selectOptions(within(getTargetRow()).getByRole('combobox'), 'Chien Than Delta Force');
    expect(within(getTargetRow()).getByText('Chien Than Delta Force')).toBeInTheDocument();

    expect(within(getTargetRow()).getByText('API connected')).toBeInTheDocument();
    expect(within(getTargetRow()).queryByRole('button', { name: /edit channel mode/i })).not.toBeInTheDocument();
    expect(within(getTargetRow()).queryByRole('button', { name: /edit channel health/i })).not.toBeInTheDocument();

    const statusCell = [...getTargetRow().querySelectorAll('td')]
      .find((cell) => /API connected|API Disconnected/.test(cell.textContent));
    expect(statusCell).toBeDefined();
    expect(within(statusCell).queryByRole('combobox')).not.toBeInTheDocument();

    await user.click(within(getTargetRow()).getByRole('checkbox'));
    expect(screen.getByRole('button', { name: 'Assign Group' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Connection Status/i })).not.toBeInTheDocument();
  }, CHANNELS_PAGE_TEST_TIMEOUT);

  it('uses a table-driven management view for channel groups', async () => {
    const user = userEvent.setup();

    renderChannels();

    await user.click(await screen.findByRole('tab', { name: 'Channel Group' }, { timeout: 3000 }));

    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Group Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Color' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Team Member' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Channels' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Actions' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Add$/ }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Add Group');
    expect(screen.getByRole('combobox', { name: /color/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    const getChannelGroupRow = () => screen.getByText('Chien Than Delta Force').closest('tr');
    const channelGroupRow = getChannelGroupRow();
    expect(channelGroupRow).not.toBeNull();
    await user.click(within(channelGroupRow).getByRole('checkbox'));
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    await user.click(screen.getByText('Edit'));
    expect(screen.getByRole('dialog')).toHaveTextContent('Edit Group');
    await user.selectOptions(screen.getByRole('combobox', { name: /select color/i }), 'purple');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(within(getChannelGroupRow()).getByText('Purple')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  }, CHANNELS_PAGE_TEST_TIMEOUT);
});
