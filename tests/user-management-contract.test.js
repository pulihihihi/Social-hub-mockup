import { describe, expect, it } from 'vitest';
import {
  DEFAULT_APPROVAL_WORKFLOWS,
  describeApprovalWorkflow,
} from '../src/data/approvalWorkflowStore';
import {
  DEFAULT_MANAGED_USERS,
  USER_ROLES_OPTIONS,
  getMobilePublisherOptions,
  getUserFilterOptions,
  getWorkflowApproverOptions,
} from '../src/data/userManagement';

describe('managed user contract', () => {
  it('uses Access users as the source for workflow approvers and user filters', () => {
    const workflowApprovers = getWorkflowApproverOptions(DEFAULT_MANAGED_USERS);
    const authorFilters = getUserFilterOptions(DEFAULT_MANAGED_USERS);

    expect(workflowApprovers.map((option) => option.value)).toContain('user-pham-my-linh');
    expect(authorFilters.map((option) => option.label)).toContain('Tran Hai Son');
    expect(describeApprovalWorkflow(DEFAULT_APPROVAL_WORKFLOWS[0], workflowApprovers))
      .toContain('Pham My Linh (Publishing Admin)');
  });

  it('limits mobile publishers to users with publishing permission groups', () => {
    const mobilePublishers = getMobilePublisherOptions(DEFAULT_MANAGED_USERS);

    expect(mobilePublishers.map((option) => option.value)).toEqual([
      'user-tran-hai-son',
      'user-pham-my-linh',
      'user-nguyen-hoai-son',
      'user-tran-hoa',
    ]);
  });

  it('keeps user role options aligned with the current permission groups', () => {
    expect(USER_ROLES_OPTIONS.map((option) => option.value)).toContain('PublishingAdmin');
    expect(USER_ROLES_OPTIONS.map((option) => option.value)).not.toContain('Admin');
    expect(USER_ROLES_OPTIONS.map((option) => option.value)).not.toContain('DataAnalyst');
    expect(USER_ROLES_OPTIONS.map((option) => option.value)).not.toContain('ContentModerator');
  });
});
