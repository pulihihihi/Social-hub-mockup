import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';
import { C } from '../src/theme';

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location-probe">{location.pathname}</div>;
};

describe('AppProLayout', () => {
  it('renders the workflow-first top-level menu without retired pages', () => {
    render(
      <MemoryRouter initialEntries={['/messages/smart']}>
        <AppProviders>
          <AppProLayout>
            <div>Page body</div>
          </AppProLayout>
        </AppProviders>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('mock-pro-layout')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'App navigation' });
    const navTexts = within(nav)
      .getAllByText(/Smart Inbox|Publishing|Bots|Alerts|Settings/)
      .map((node) => node.textContent);

    expect(navTexts).toEqual(['Publishing', 'Smart Inbox', 'Bots', 'Alerts', 'Settings']);
    expect(within(nav).queryByText('Create Topic')).not.toBeInTheDocument();
    expect(within(nav).queryByText('Active Topics')).not.toBeInTheDocument();
    expect(within(nav).queryByText('Reports')).not.toBeInTheDocument();
    expect(within(nav).queryByText('Channels')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-pro-layout-header-content')).toHaveTextContent('Social Hub');
    expect(screen.getByText('Page body')).toBeInTheDocument();
    expect(screen.getByText('3 of your channels have been disconnected')).toBeInTheDocument();
    expect(screen.getByText('It looks like 3 of your selected channels need reauthorization.')).toBeInTheDocument();
  });

  it('expands Settings and keeps its child order on a settings route', () => {
    render(
      <MemoryRouter initialEntries={['/settings/channels']}>
        <AppProviders>
          <AppProLayout>
            <div>Settings page</div>
          </AppProLayout>
        </AppProviders>
      </MemoryRouter>,
    );

    const nav = screen.getByRole('navigation', { name: 'App navigation' });
    const submenu = screen.getByTestId('mock-pro-layout-submenu-/settings');
    const submenuTexts = within(submenu)
      .getAllByText(/Channels|Notifications|AI Skill|Access/)
      .map((node) => node.textContent);

    expect(within(nav).getByText('Settings')).toBeInTheDocument();
    expect(submenuTexts).toEqual([
      'Channels',
      'Notifications',
      'AI Skill',
      'Access',
    ]);
    expect(within(nav).queryByText('Create Topic')).not.toBeInTheDocument();
  });

  it('navigates back to the publishing calendar when the menu header is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/alerts']}>
        <AppProviders>
          <AppProLayout>
            <LocationProbe />
          </AppProLayout>
        </AppProviders>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('location-probe')).toHaveTextContent('/alerts');

    await user.click(screen.getByText('Social Hub'));

    expect(screen.getByTestId('location-probe')).toHaveTextContent('/publishing/calendar');
  });

  it('keeps a light content theme while forcing a dark Ant-style sider', () => {
    render(
      <MemoryRouter initialEntries={['/messages/smart']}>
        <AppProviders>
          <AppProLayout>
            <div>Page body</div>
          </AppProLayout>
        </AppProviders>
      </MemoryRouter>,
    );

    const layout = screen.getByTestId('mock-pro-layout');

    expect(layout).toHaveAttribute('data-nav-theme', 'light');
    expect(layout).toHaveAttribute('data-sider-bg', C.sidebarBg);
  });
});
