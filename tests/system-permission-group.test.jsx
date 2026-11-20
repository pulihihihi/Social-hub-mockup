import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';
import SystemPage from '../src/pages/System';

const renderPage = () => render(
  <MemoryRouter initialEntries={['/settings/system']}>
    <AppProviders>
      <AppProLayout>
        <SystemPage />
      </AppProLayout>
    </AppProviders>
  </MemoryRouter>,
);

describe('permission group actions', () => {
  it('shows a delete action for the selected permission group', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('tab', { name: 'Permission Group' }));
    fireEvent.click(await screen.findByText('Publishing Admin'));

    expect(await screen.findByRole('button', { name: /Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit info/i })).toBeInTheDocument();
  }, 10000);

  it('hides the delete action for Super Admin', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('tab', { name: 'Permission Group' }));

    expect(await screen.findByRole('heading', { name: 'Super Admin' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit info/i })).toBeInTheDocument();
  });

  it('matches the current website modules and omits retired surfaces', async () => {
    const { container } = renderPage();

    fireEvent.click(screen.getByRole('tab', { name: 'Permission Group' }));

    expect(await screen.findByText('SMART INBOX')).toBeInTheDocument();
    expect(screen.getByText('PUBLISHING')).toBeInTheDocument();
    expect(screen.getByText('TAG GROUPS')).toBeInTheDocument();
    expect(screen.getByText('AUTOMATION')).toBeInTheDocument();
    expect(screen.getByText('SETTINGS')).toBeInTheDocument();
    expect(screen.getByText('ACCESS')).toBeInTheDocument();

    const hasPermissionRow = (name) => (
      Array.from(container.querySelectorAll('td')).some((cell) => cell.textContent?.trim() === name)
    );

    expect(hasPermissionRow('All Messages')).toBe(true);
    expect(hasPermissionRow('New Post')).toBe(true);
    expect(hasPermissionRow('Tag Groups')).toBe(true);
    expect(hasPermissionRow('Bots')).toBe(true);
    expect(hasPermissionRow('Channels')).toBe(true);
    expect(hasPermissionRow('Permission Group')).toBe(true);

    expect(screen.queryByText('REPORTS')).not.toBeInTheDocument();
    expect(screen.queryByText('Topics')).not.toBeInTheDocument();
    expect(screen.queryByText('Scheduled Reports')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Discussion')).not.toBeInTheDocument();
    expect(screen.queryByText('System Params')).not.toBeInTheDocument();
  });
});
