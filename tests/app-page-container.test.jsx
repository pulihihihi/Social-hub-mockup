import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';
import { AppPageContainer } from '../src/app/layout/AppPageContainer';

describe('AppPageContainer', () => {
  it('renders title, actions, and header meta content in the app shell top bar', async () => {
    const onClick = vi.fn();

    render(
      <MemoryRouter initialEntries={['/settings/system']}>
        <AppProviders>
          <AppProLayout>
            <AppPageContainer
              title="Users"
              breadcrumb={{ parent: 'Settings', onClick }}
              headerExtra={<button type="button">Create</button>}
              headerMeta={<span>3 selected</span>}
            >
              <div>Page body</div>
            </AppPageContainer>
          </AppProLayout>
        </AppProviders>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(screen.getByText('Page body')).toBeInTheDocument();
  });

  it('can hide the page header while keeping secondary page controls', async () => {
    render(
      <MemoryRouter initialEntries={['/publishing/calendar']}>
        <AppProviders>
          <AppProLayout>
            <AppPageContainer
              title="Calendar"
              hidePageHeader
              topBarControls={<div>Calendar controls</div>}
            >
              <div>Calendar body</div>
            </AppPageContainer>
          </AppProLayout>
        </AppProviders>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Calendar controls')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Calendar' })).not.toBeInTheDocument();
    expect(screen.getByText('Calendar body')).toBeInTheDocument();
  });
});
