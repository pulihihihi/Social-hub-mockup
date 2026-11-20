import { useEffect, useState } from 'react';
import { getWorkflowApproverOptions } from './userManagement';

export const TODAY_LABEL = '5 May 2026';

export const APPROVER_OPTIONS = getWorkflowApproverOptions();

export const DEFAULT_APPROVAL_WORKFLOWS = [
  {
    id: 'marketing-review',
    channelGroupId: 2,
    name: 'Marketing Review',
    lastEdited: TODAY_LABEL,
    externalApprovers: 0,
    enabled: true,
    default: true,
    skipEnabled: false,
    sortSequence: 10,
    steps: [
      {
        id: 'marketing-review-step-1',
        name: 'Marketing review',
        approvers: ['user-pham-my-linh'],
        requirement: 'any',
      },
    ],
  },
  {
    id: 'brand-legal',
    channelGroupId: 2,
    name: 'Brand + Legal Approval',
    lastEdited: TODAY_LABEL,
    externalApprovers: 0,
    enabled: true,
    default: false,
    skipEnabled: false,
    sortSequence: 20,
    steps: [
      {
        id: 'brand-legal-step-1',
        name: 'Brand review',
        approvers: ['user-nguyen-ngoc-linh'],
        requirement: 'any',
      },
      {
        id: 'brand-legal-step-2',
        name: 'Legal approval',
        approvers: ['user-pham-linh'],
        requirement: 'any',
      },
    ],
  },
  {
    id: 'creator-ops-review',
    channelGroupId: 1,
    name: 'Creator Ops Review',
    lastEdited: TODAY_LABEL,
    externalApprovers: 0,
    enabled: true,
    default: false,
    skipEnabled: false,
    sortSequence: 30,
    steps: [
      {
        id: 'creator-ops-review-step-1',
        name: 'Creator ops review',
        approvers: ['user-tran-hai-son'],
        requirement: 'any',
      },
    ],
  },
];

const APPROVAL_WORKFLOWS_STORAGE_KEY = 'socialhub.approvalWorkflows.v2';
const APPROVAL_WORKFLOWS_EVENT = 'socialhub:approval-workflows-changed';

export const createWorkflowStep = (index) => ({
  id: `step-${Date.now()}-${index}`,
  name: `Step ${index}`,
  approvers: [],
  requirement: 'any',
});

const cloneWorkflows = (workflows) => workflows.map((workflow, index) => ({
  ...workflow,
  channelGroupId: workflow.channelGroupId ?? 1,
  sortSequence: workflow.sortSequence ?? (index + 1) * 10,
  steps: (workflow.steps || []).map((step) => ({ ...step })),
}));

export const filterApprovalWorkflowsByChannelGroup = (workflows, channelGroupId) => (
  workflows.filter((workflow) => String(workflow.channelGroupId ?? 1) === String(channelGroupId))
);

export const getManagedApprovalWorkflows = () => {
  if (typeof window === 'undefined') {
    return cloneWorkflows(DEFAULT_APPROVAL_WORKFLOWS);
  }

  try {
    const storedWorkflows = window.localStorage.getItem(APPROVAL_WORKFLOWS_STORAGE_KEY);
    if (!storedWorkflows) {
      return cloneWorkflows(DEFAULT_APPROVAL_WORKFLOWS);
    }

    const parsedWorkflows = JSON.parse(storedWorkflows);
    return Array.isArray(parsedWorkflows)
      ? cloneWorkflows(parsedWorkflows)
      : cloneWorkflows(DEFAULT_APPROVAL_WORKFLOWS);
  } catch {
    return cloneWorkflows(DEFAULT_APPROVAL_WORKFLOWS);
  }
};

export const setManagedApprovalWorkflows = (workflows) => {
  const nextWorkflows = cloneWorkflows(workflows);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(APPROVAL_WORKFLOWS_STORAGE_KEY, JSON.stringify(nextWorkflows));
    window.dispatchEvent(new CustomEvent(APPROVAL_WORKFLOWS_EVENT, {
      detail: { workflows: nextWorkflows },
    }));
  }

  return nextWorkflows;
};

export const sortApprovalWorkflows = (workflows) => (
  [...workflows].sort((left, right) => (
    (left.sortSequence ?? 0) - (right.sortSequence ?? 0) ||
    left.name.localeCompare(right.name)
  ))
);

export const getEnabledApprovalWorkflows = (workflows) => (
  sortApprovalWorkflows(workflows).filter((workflow) => workflow.enabled)
);

export const getApprovalWorkflowOptions = (workflows) => (
  getEnabledApprovalWorkflows(workflows).map((workflow) => ({
    label: workflow.name,
    value: workflow.id,
  }))
);

export const getApprovalWorkflowById = (workflows, workflowId) => (
  workflows.find((workflow) => workflow.id === workflowId) || null
);

export const describeApprovalWorkflow = (workflow, approverOptions = getWorkflowApproverOptions()) => {
  if (!workflow) {
    return '';
  }

  const approverMap = new Map(approverOptions.map((option) => [option.value, option.label]));
  return workflow.steps.map((step) => {
    const approvers = step.approvers
      .map((approver) => approverMap.get(approver) || approver)
      .join(', ');

    return `${step.name}: ${approvers || 'No approvers assigned'}`;
  }).join(' -> ');
};

export const useManagedApprovalWorkflows = () => {
  const [workflows, setWorkflowsState] = useState(getManagedApprovalWorkflows);

  useEffect(() => {
    const syncWorkflows = (event) => {
      if (event.type === 'storage' && event.key !== APPROVAL_WORKFLOWS_STORAGE_KEY) {
        return;
      }

      setWorkflowsState(
        event.detail?.workflows
          ? cloneWorkflows(event.detail.workflows)
          : getManagedApprovalWorkflows(),
      );
    };

    window.addEventListener(APPROVAL_WORKFLOWS_EVENT, syncWorkflows);
    window.addEventListener('storage', syncWorkflows);

    return () => {
      window.removeEventListener(APPROVAL_WORKFLOWS_EVENT, syncWorkflows);
      window.removeEventListener('storage', syncWorkflows);
    };
  }, []);

  const setWorkflows = (updater) => {
    setWorkflowsState((currentWorkflows) => {
      const nextWorkflows = typeof updater === 'function'
        ? updater(cloneWorkflows(currentWorkflows))
        : updater;

      return setManagedApprovalWorkflows(nextWorkflows);
    });
  };

  return [workflows, setWorkflows];
};
