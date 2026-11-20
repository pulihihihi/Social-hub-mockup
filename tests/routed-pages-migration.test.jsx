import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppRouter } from '../src/app/AppRouter';

const renderRoute = (initialEntry) => (
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </MemoryRouter>,
  )
);

describe('routed pages after migration cleanup', () => {
  it.each([
    ['/messages/smart', 'All Messages'],
    ['/messages/saved', 'Saved Messages'],
    ['/messages/reply-approvals', 'Reply Approvals'],
    ['/publishing/new-post', 'New Post'],
    ['/publishing/calendar', 'Thu, 7 May 2026'],
    ['/publishing/drafts', 'Drafts'],
    ['/publishing/needs-approval', 'Needs Approval'],
    ['/publishing/rejected', 'Rejected'],
    ['/publishing/failedposts', 'Failed Posts'],
    ['/publishing/deletedposts', 'Recently Deleted Posts'],
    ['/publishing/campaigns/active', 'Tag Management'],
    ['/publishing/campaigns/archived', 'Tag Management'],
    ['/publishing/campaigns/planner/treasure-hunt', 'Treasure Hunt'],
    ['/bots', 'Bots'],
    ['/alerts', 'Alerts'],
    ['/settings/channels', 'Channel'],
    ['/settings/tag-management', 'Tag Management'],
    ['/settings/approval-workflows', 'Approval Workflows'],
    ['/settings/notifications', 'Notifications'],
    ['/settings/ai-skill', 'AI Skill'],
    ['/settings/system', 'Access'],
  ])('renders %s without sidebar compatibility props', async (routePath, pageTitle) => {
    renderRoute(routePath);

    if (routePath === '/publishing/calendar') {
      expect((await screen.findAllByText(pageTitle, {}, { timeout: 5000 })).length).toBeGreaterThan(0);
      return;
    }

    if (routePath === '/settings/channels') {
      expect(await screen.findByRole('tab', { name: 'All Channels' }, { timeout: 5000 })).toBeInTheDocument();
      return;
    }

    if (routePath === '/settings/ai-skill') {
      expect(await screen.findByRole('tab', { name: /My Skills/ }, { timeout: 5000 })).toBeInTheDocument();
      return;
    }

    if (routePath === '/settings/system') {
      expect(await screen.findByRole('tab', { name: 'User' }, { timeout: 5000 })).toBeInTheDocument();
      return;
    }

    if (routePath === '/settings/tag-management' || routePath.startsWith('/publishing/campaigns/active') || routePath.startsWith('/publishing/campaigns/archived')) {
      expect(await screen.findByRole('tab', { name: 'Tags' }, { timeout: 5000 })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tag Groups' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'System Tags' })).toBeInTheDocument();
      if (routePath.startsWith('/publishing/campaigns/')) {
        expect(screen.getByRole('tab', { name: 'Tag Groups' })).toHaveAttribute('aria-selected', 'true');
      }
      return;
    }

    expect(await screen.findByRole('heading', { name: pageTitle }, { timeout: 5000 })).toBeInTheDocument();
  }, 15000);

  it('redirects the retired credentials route to Channels', async () => {
    renderRoute('/settings/credentials');

    expect(await screen.findByRole('tab', { name: 'All Channels' }, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Credentials' })).not.toBeInTheDocument();
  });

  it('redirects the deprecated users route to Access', async () => {
    renderRoute('/settings/users');

    expect(await screen.findByRole('tab', { name: 'User' }, { timeout: 3000 })).toBeInTheDocument();
  });

  it.each(['/reports', '/topics/active', '/topics/create', '/topics/t1/edit'])(
    'redirects retired route %s to the default publishing calendar',
    async (routePath) => {
      renderRoute(routePath);

      expect((await screen.findAllByText('Thu, 7 May 2026', {}, { timeout: 3000 })).length).toBeGreaterThan(0);
    },
  );
});
