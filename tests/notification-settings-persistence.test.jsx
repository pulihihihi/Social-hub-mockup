import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';
import NotificationSettingsPage from '../src/pages/Notifications';

const STORAGE_KEY = 'social-hub-notification-settings-v1';

const renderPage = () => render(
  <MemoryRouter initialEntries={['/settings/notifications']}>
    <AppProviders>
      <AppProLayout>
        <NotificationSettingsPage />
      </AppProLayout>
    </AppProviders>
  </MemoryRouter>,
);

const waitForNotificationsPage = async () => {
  expect(await screen.findByRole('heading', { name: 'Notifications' }, { timeout: 3000 })).toBeInTheDocument();
  expect(await screen.findByText('Delivery Channel', {}, { timeout: 3000 })).toBeInTheDocument();
};

const getChannelCard = (label) => screen.getByText(label).parentElement?.parentElement;

const openFrequencySelect = (channelKey) => {
  const select = screen.getByRole('combobox', { name: `Crisis alert triggered-${channelKey}` });
  fireEvent.mouseDown(select);
  return select;
};

describe('notification settings persistence', () => {
  beforeEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it('saves distinct values per delivery channel and restores them after reload', async () => {
    const user = userEvent.setup();
    const view = renderPage();

    await waitForNotificationsPage();

    await user.click(screen.getByText('Email'));
    openFrequencySelect('email');
    await user.click(await screen.findByRole('option', { name: 'Stop' }));

    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    const storedSettings = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    expect(storedSettings.crisis_triggered_email).toBe('stop');
    expect(storedSettings.crisis_triggered_web).toBe('immediately');
    expect(getChannelCard('Email')).toHaveTextContent('8 imm');
    expect(getChannelCard('Email')).toHaveTextContent('1 stop');

    await user.click(screen.getByText('Web'));
    expect(getChannelCard('Web')).toHaveTextContent('9 imm');
    expect(getChannelCard('Web')).toHaveTextContent('0 stop');

    view.unmount();

    renderPage();
    await waitForNotificationsPage();

    expect(getChannelCard('Email')).toHaveTextContent('8 imm');
    expect(getChannelCard('Email')).toHaveTextContent('1 stop');
    expect(getChannelCard('Web')).toHaveTextContent('9 imm');
    expect(getChannelCard('Web')).toHaveTextContent('0 stop');
  }, 15000);
});
