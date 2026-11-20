import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';
import ChannelsPage from '../src/pages/Admin/ChannelsPage';
import SystemPage from '../src/pages/System';
import AiSkillPage from '../src/pages/AiSkill';
import AlertsPage from '../src/pages/Alerts';

const renderInApp = (ui, route = '/') => render(
  <MemoryRouter initialEntries={[route]}>
    <AppProviders>
      <AppProLayout>
        {ui}
      </AppProLayout>
    </AppProviders>
  </MemoryRouter>
);

describe('toolbar copy regression', () => {
  it('uses Add wording across standardized list and settings surfaces', async () => {
    let view = renderInApp(<ChannelsPage />);
    expect(await screen.findByRole('button', { name: /Add$/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Channel Group' }));
    expect(await screen.findByRole('button', { name: /Add$/ })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Credentials' })).not.toBeInTheDocument();
    view.unmount();

    view = renderInApp(<SystemPage />);
    expect(await screen.findByRole('button', { name: /Add$/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Permission Group' }));
    expect(await screen.findByRole('button', { name: /Add$/ })).toBeInTheDocument();
    view.unmount();

    view = renderInApp(<AiSkillPage />);
    expect(await screen.findByRole('button', { name: /Add Skill$/ })).toBeInTheDocument();
    view.unmount();
  }, 30000);

  it('uses standardized Add wording on remaining workflow list surfaces', async () => {
    const view = renderInApp(<AlertsPage />);
    expect(await screen.findByRole('button', { name: /Add$/ })).toBeInTheDocument();
    view.unmount();
  });
});
