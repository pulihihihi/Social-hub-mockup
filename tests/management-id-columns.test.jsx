import {
  render,
  screen,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppProLayout } from '../src/app/layout/AppProLayout';
import SettingsApprovalWorkflowsPage from '../src/pages/SettingsApprovalWorkflows';
import SystemPage from '../src/pages/System';

const renderPage = (ui, initialEntry) => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <AppProviders>
      <AppProLayout>
        {ui}
      </AppProLayout>
    </AppProviders>
  </MemoryRouter>,
);

const getHeaderLabels = () => within(screen.getByRole('table'))
  .getAllByRole('columnheader')
  .map((header) => header.textContent.trim())
  .filter((header) => header && header !== 'Select');

const getFirstRowId = () => {
  const firstRow = screen.getByRole('table').querySelector('tbody tr');
  return firstRow?.querySelectorAll('td')[1]?.textContent?.trim();
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('management table ID columns', () => {
  it('puts ID first on Access User and sorts newest user ID first', () => {
    renderPage(<SystemPage />, '/settings/system');

    expect(screen.getByRole('tab', { name: 'User' })).toHaveAttribute('aria-selected', 'true');
    expect(getHeaderLabels()[0]).toBe('ID');
    expect(getFirstRowId()).toBe('10');
  });

  it('puts ID first on Approval Workflows and sorts newest workflow ID first', () => {
    window.localStorage.setItem('socialhub.activeChannelGroup.v1', '2');
    window.localStorage.setItem('socialhub.approvalWorkflows.v2', JSON.stringify([
      {
        id: 'workflow-10',
        channelGroupId: 2,
        name: 'Older Workflow',
        lastEdited: '5 May 2026',
        externalApprovers: 0,
        enabled: true,
        default: false,
        skipEnabled: false,
        sortSequence: 10,
        steps: [{ id: 'workflow-10-step-1', name: 'Review', approvers: ['user-tran-hai-son'], requirement: 'any' }],
      },
      {
        id: 'workflow-30',
        channelGroupId: 2,
        name: 'Newest Workflow',
        lastEdited: '5 May 2026',
        externalApprovers: 0,
        enabled: true,
        default: true,
        skipEnabled: false,
        sortSequence: 30,
        steps: [{ id: 'workflow-30-step-1', name: 'Review', approvers: ['user-tran-hai-son'], requirement: 'any' }],
      },
    ]));

    renderPage(<SettingsApprovalWorkflowsPage />, '/settings/approval-workflows');

    expect(getHeaderLabels()[0]).toBe('ID');
    expect(getFirstRowId()).toBe('2');
  });
});
