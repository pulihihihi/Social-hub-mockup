import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Modal, Select, Switch, Typography, message } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';
import { AppPageControls } from '../../app/layout/AppPageControls';
import { AppTableCard } from '../../app/layout/AppCards';
import { AppProTable } from '../../app/pro/AppProTable';
import { PlusIco } from '../../components/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  TODAY_LABEL,
  createWorkflowStep,
  filterApprovalWorkflowsByChannelGroup,
  sortApprovalWorkflows,
  useManagedApprovalWorkflows,
} from '../../data/approvalWorkflowStore';
import {
  getWorkflowApproverOptions,
  useManagedUsers,
} from '../../data/userManagement';
import {
  compareDisplayIdsAscending,
  sortByDisplayIdDescending,
  withNumericDisplayIds,
} from '../../utils/idSort';
import { useChannelGroup } from '../../app/providers/useChannelGroup';
import './SettingsApprovalWorkflows.css';

const { Text, Title } = Typography;

const getModalPopupContainer = (triggerNode) => (
  triggerNode?.closest('.ant-modal-content') || document.body
);

const countExternalApprovers = (steps, approverOptions) => {
  const knownApproverValues = new Set(approverOptions.map((option) => option.value));
  return new Set(
    steps.flatMap((step) => step.approvers)
      .filter((approver) => !knownApproverValues.has(approver)),
  ).size;
};

const normalizeComparableText = (value) => value.trim().toLowerCase();

const sanitizeWorkflowSteps = (steps) => steps.map((step, index) => ({
  ...step,
  name: step.name.trim() || `Step ${index + 1}`,
  approvers: Array.from(new Set(step.approvers.map((approver) => approver.trim()).filter(Boolean))),
}));

const buildWorkflowCopy = (workflow, offset = 0) => ({
  ...workflow,
  id: `workflow-copy-${Date.now()}-${offset}`,
  name: `${workflow.name} copy`,
  default: false,
  lastEdited: TODAY_LABEL,
  sortSequence: Date.now() + offset,
  steps: workflow.steps.map((step, index) => ({
    ...step,
    id: `workflow-copy-step-${Date.now()}-${offset}-${index}`,
  })),
});

function ApprovalWorkflowBuilder({ open, mode = 'create', initialWorkflow, approverOptions, onClose, onSave }) {
  const [workflowName, setWorkflowName] = useState('');
  const [steps, setSteps] = useState([createWorkflowStep(1)]);
  const [skipEnabled, setSkipEnabled] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialWorkflow) {
      setWorkflowName(initialWorkflow.name);
      setSteps(initialWorkflow.steps.map((step) => ({ ...step })));
      setSkipEnabled(initialWorkflow.skipEnabled);
      return;
    }

    setWorkflowName('');
    setSteps([createWorkflowStep(1)]);
    setSkipEnabled(false);
  }, [initialWorkflow, open]);

  const canSave = workflowName.trim().length > 0 && steps.every((step) => (
    step.name.trim().length > 0 && step.approvers.length > 0
  ));
  const dialogTitle = mode === 'edit' ? 'Edit Approval Workflow' : 'Create Approval Workflow';
  const submitLabel = mode === 'edit' ? 'Save' : 'Add';

  const updateStep = (stepId, patch) => {
    setSteps((currentSteps) => currentSteps.map((step) => (
      step.id === stepId ? { ...step, ...patch } : step
    )));
  };

  const addStep = () => {
    setSteps((currentSteps) => [...currentSteps, createWorkflowStep(currentSteps.length + 1)]);
  };

  const deleteStep = (stepId) => {
    setSteps((currentSteps) => (
      currentSteps.length === 1 ? currentSteps : currentSteps.filter((step) => step.id !== stepId)
    ));
  };

  return (
    <Modal
      className="settings-approval-modal"
      destroyOnHidden
      maskClosable={false}
      open={open}
      title={dialogTitle}
      width={1100}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!canSave}
          onClick={() => onSave({
            id: initialWorkflow?.id,
            name: workflowName.trim(),
            steps,
            skipEnabled,
          })}
        >
          {submitLabel}
        </Button>,
      ]}
    >
      <div className="settings-approval-modal-top">
        <label htmlFor="settings-approval-workflow-name">Workflow Name</label>
        <Input
          id="settings-approval-workflow-name"
          value={workflowName}
          maxLength={100}
          showCount={{ formatter: ({ count, maxLength }) => maxLength - count }}
          placeholder="Enter a workflow name"
          onChange={(event) => setWorkflowName(event.target.value)}
        />
      </div>

      <div className="settings-approval-modal-grid">
        <section className="settings-approval-modal-section settings-approval-modal-steps">
          <Title level={5}>Workflow steps and approvers</Title>
          <div className="settings-approval-step-list">
            {steps.map((step, index) => (
              <div key={step.id} className="settings-approval-step-row">
                <div className="settings-approval-step-index">{index + 1}</div>
                <div className="settings-approval-step-card">
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    className="settings-approval-step-delete"
                    disabled={steps.length === 1}
                    aria-label={`Delete step ${index + 1}`}
                    onClick={() => deleteStep(step.id)}
                  />

                  <label htmlFor={`${step.id}-name`}>Step {index + 1} Name</label>
                  <Input
                    id={`${step.id}-name`}
                    value={step.name}
                    maxLength={100}
                    showCount={{ formatter: ({ count, maxLength }) => maxLength - count }}
                    onChange={(event) => updateStep(step.id, { name: event.target.value })}
                  />

                  <label htmlFor={`${step.id}-approvers`}>Approver(s)</label>
                  <Text type="secondary" className="settings-approval-approver-help">
                    Choose existing team members, or enter an email address to add an external approver.
                  </Text>
                  <Select
                    id={`${step.id}-approvers`}
                    mode="tags"
                    value={step.approvers}
                    options={approverOptions}
                    maxTagCount="responsive"
                    getPopupContainer={getModalPopupContainer}
                    tokenSeparators={[',']}
                    onChange={(values) => updateStep(step.id, { approvers: values })}
                  />

                  <div className="settings-approval-step-requirement">
                    <Text>Require approval from</Text>
                    <Select
                      value={step.requirement}
                      getPopupContainer={getModalPopupContainer}
                      options={[
                        { label: 'Any', value: 'any' },
                        { label: 'All', value: 'all' },
                      ]}
                      onChange={(value) => updateStep(step.id, { requirement: value })}
                    />
                    <Text>of these approvers.</Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button type="link" icon={<PlusOutlined />} className="settings-approval-add-step" onClick={addStep}>
            Add Another Step
          </Button>
        </section>

        <aside className="settings-approval-modal-section settings-approval-modal-settings">
          <Title level={5}>Workflow settings</Title>
          <div className="settings-approval-skip-setting">
            <Switch checked={skipEnabled} onChange={setSkipEnabled} />
            <div>
              <Text strong>Allow users with Full Publishing permission to skip steps on this workflow</Text>
              <Text type="secondary">
                Users with &quot;Full Publishing&quot; permission can skip steps. All skips are recorded in the post&apos;s audit trail.
              </Text>
            </div>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

export default function SettingsApprovalWorkflowsPage() {
  const [workflows, setWorkflows] = useManagedApprovalWorkflows();
  const [users] = useManagedUsers();
  const { activeChannelGroupId } = useChannelGroup();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const sortedWorkflows = sortApprovalWorkflows(
    filterApprovalWorkflowsByChannelGroup(workflows, activeChannelGroupId),
  );
  const workflowRows = useMemo(
    () => sortByDisplayIdDescending(withNumericDisplayIds(sortedWorkflows)),
    [sortedWorkflows],
  );
  const approverOptions = getWorkflowApproverOptions(users);
  const selectedWorkflows = useMemo(
    () => workflowRows.filter((workflow) => selectedRowKeys.includes(workflow.id)),
    [selectedRowKeys, workflowRows],
  );

  const openBuilder = (workflow = null) => {
    setEditingWorkflow(workflow);
    setBuilderOpen(true);
  };

  const closeBuilder = () => {
    setBuilderOpen(false);
    setEditingWorkflow(null);
  };

  const saveWorkflow = (workflowDraft) => {
    const nextName = workflowDraft.name.trim();
    const nextSteps = sanitizeWorkflowSteps(workflowDraft.steps);
    const hasDuplicateName = sortedWorkflows.some((workflow) => (
      workflow.id !== workflowDraft.id
      && normalizeComparableText(workflow.name) === normalizeComparableText(nextName)
    ));

    if (hasDuplicateName) {
      message.error('Workflow name already exists in this channel group');
      return;
    }

    const savedWorkflow = {
      ...workflowDraft,
      name: nextName,
      steps: nextSteps,
      id: workflowDraft.id || `workflow-${Date.now()}`,
      channelGroupId: editingWorkflow?.channelGroupId ?? activeChannelGroupId,
      lastEdited: TODAY_LABEL,
      externalApprovers: countExternalApprovers(nextSteps, approverOptions),
      enabled: editingWorkflow?.enabled ?? true,
      default: editingWorkflow?.default ?? false,
      skipEnabled: editingWorkflow?.skipEnabled ?? workflowDraft.skipEnabled,
      sortSequence: editingWorkflow?.sortSequence ?? Date.now(),
    };

    setWorkflows((currentWorkflows) => {
      if (workflowDraft.id) {
        return currentWorkflows.map((workflow) => (
          workflow.id === workflowDraft.id ? savedWorkflow : workflow
        ));
      }

      return [...currentWorkflows, savedWorkflow];
    });
    closeBuilder();
  };

  const duplicateSelectedWorkflows = () => {
    if (!selectedWorkflows.length) {
      return;
    }

    setWorkflows((currentWorkflows) => [
      ...currentWorkflows,
      ...selectedWorkflows.map((workflow, index) => buildWorkflowCopy(workflow, index)),
    ]);
    message.success(
      selectedWorkflows.length === 1
        ? 'Workflow duplicated'
        : `${selectedWorkflows.length} workflows duplicated`,
    );
    setSelectedRowKeys([]);
  };

  const toggleDefaultWorkflow = (workflowId) => {
    setWorkflows((currentWorkflows) => currentWorkflows.map((workflow) => ({
      ...workflow,
      default: String(workflow.channelGroupId) === String(activeChannelGroupId)
        ? workflow.id === workflowId
        : workflow.default,
    })));
  };

  const toggleWorkflowEnabled = (workflowId, enabled) => {
    setWorkflows((currentWorkflows) => currentWorkflows.map((workflow) => (
      workflow.id === workflowId ? { ...workflow, enabled } : workflow
    )));
  };

  const deleteSelectedWorkflows = () => {
    if (!selectedWorkflows.length) {
      return;
    }

    const selectedIds = new Set(selectedWorkflows.map((workflow) => workflow.id));
    setWorkflows((currentWorkflows) => {
      const remainingWorkflows = currentWorkflows.filter((workflow) => !selectedIds.has(workflow.id));
      const activeGroupWorkflows = remainingWorkflows.filter((workflow) => (
        String(workflow.channelGroupId ?? 1) === String(activeChannelGroupId)
      ));

      if (activeGroupWorkflows.length > 0 && !activeGroupWorkflows.some((workflow) => workflow.default)) {
        const fallbackWorkflowId = sortApprovalWorkflows(activeGroupWorkflows)[0]?.id;
        return remainingWorkflows.map((workflow) => ({
          ...workflow,
          default: workflow.id === fallbackWorkflowId
            ? true
            : String(workflow.channelGroupId ?? 1) === String(activeChannelGroupId)
              ? false
              : workflow.default,
        }));
      }

      return remainingWorkflows;
    });
    message.success(
      selectedWorkflows.length === 1
        ? 'Workflow deleted'
        : `${selectedWorkflows.length} workflows deleted`,
    );
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'displayId',
      width: 88,
      defaultSortOrder: 'descend',
      sorter: compareDisplayIdsAscending,
      render: (id) => <span className="settings-approval-id-cell">{id}</span>,
    },
    {
      title: 'Default',
      dataIndex: 'default',
      width: 88,
      align: 'center',
      render: (_defaultValue, workflow) => (
        <Button
          type="text"
          size="small"
          className="settings-approval-icon-button"
          icon={workflow.default ? <StarFilled /> : <StarOutlined />}
          aria-label={workflow.default ? 'Default workflow' : 'Set as default workflow'}
          onClick={() => toggleDefaultWorkflow(workflow.id)}
        />
      ),
    },
    {
      title: 'Workflow Name',
      dataIndex: 'name',
      sorter: (left, right) => left.name.localeCompare(right.name),
      render: (name) => <span className="settings-approval-name-cell">{name}</span>,
    },
    {
      title: 'Last Edited',
      dataIndex: 'lastEdited',
      width: 160,
      sorter: (left, right) => left.lastEdited.localeCompare(right.lastEdited),
    },
    {
      title: 'External Approvers',
      dataIndex: 'externalApprovers',
      width: 168,
      sorter: (left, right) => left.externalApprovers - right.externalApprovers,
      render: (externalApprovers) => <span className="settings-approval-count-cell">{externalApprovers}</span>,
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      width: 88,
      sorter: (left, right) => left.steps.length - right.steps.length,
      render: (steps) => <span className="settings-approval-count-cell">{steps.length}</span>,
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      width: 112,
      align: 'center',
      render: (enabled, workflow) => (
        <Switch
          checked={enabled}
          aria-label={`${workflow.name} enabled`}
          onChange={(checked) => toggleWorkflowEnabled(workflow.id, checked)}
        />
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Approval Workflows"
      breadcrumb="Settings"
      maxWidth="none"
      contentPadding="16px 24px 24px"
      pageControls={(
        <AppPageControls
          layout="toolbar-only"
          primaryAction={(
            <Button type="primary" onClick={() => openBuilder()}>
              <PlusIco s={12} /> Add
            </Button>
          )}
          marginBottom={0}
        />
      )}
    >
      <div className="settings-approval-page">
        <AppTableCard>
        <AppProTable
          className="settings-approval-table"
          dataSource={workflowRows}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          alertActions={[
            <Button
              key="edit-workflow"
              type="link"
              disabled={selectedWorkflows.length !== 1}
              onClick={() => {
                if (selectedWorkflows.length === 1) {
                  openBuilder(selectedWorkflows[0]);
                }
              }}
            >
              Edit
            </Button>,
            <Button
              key="duplicate-workflow"
              type="link"
              disabled={!selectedWorkflows.length}
              onClick={duplicateSelectedWorkflows}
            >
              Duplicate
            </Button>,
            <Button
              key="delete-workflow"
              type="link"
              disabled={!selectedWorkflows.length}
              onClick={deleteSelectedWorkflows}
            >
              Delete
            </Button>,
          ]}
          emptyDescription="Add your first workflow to get started."
          columns={columns}
        />
        </AppTableCard>
      </div>

      <ApprovalWorkflowBuilder
        open={builderOpen}
        mode={editingWorkflow ? 'edit' : 'create'}
        initialWorkflow={editingWorkflow}
        approverOptions={approverOptions}
        onClose={closeBuilder}
        onSave={saveWorkflow}
      />
    </AdminPageLayout>
  );
}
