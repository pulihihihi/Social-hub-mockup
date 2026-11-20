import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { SYSTEM_TAGS } from '../src/data/tagManagement';
import { setManagedSystemTags } from '../src/data/tagManagementStore';
import SmartInboxAllMessagesPage from '../src/pages/SmartInboxAllMessages';

const renderAllMessages = () => render(
  <MemoryRouter>
    <AppProviders>
      <SmartInboxAllMessagesPage />
    </AppProviders>
  </MemoryRouter>,
);

describe('Smart Inbox system tags', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders message system tags from Tag Management system tag data', async () => {
    renderAllMessages();

    expect(await screen.findByText('Message Positive')).toBeInTheDocument();
    expect(screen.getAllByText('Needs CS escalation').length).toBeGreaterThan(0);
  });

  it('hides Smart Inbox system tags when the owning system tag is disabled', async () => {
    setManagedSystemTags(SYSTEM_TAGS.map((tag) => (
      tag.id === 'sentiment-positive' ? { ...tag, enabled: false } : tag
    )));

    renderAllMessages();

    expect((await screen.findAllByText('Needs CS escalation')).length).toBeGreaterThan(0);
    expect(screen.queryByText('Message Positive')).not.toBeInTheDocument();
  });
});
