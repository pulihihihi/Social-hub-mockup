import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Drawer,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { T } from "../../theme";
import { AppToolbarCard, AppTableCard } from "../../app/layout/AppCards";
import AdminPageLayout from "../../components/AdminPageLayout";
import { AppPageControls } from "../../app/layout/AppPageControls";
import { usePageSecondaryTopBar } from "../../app/layout/usePageSecondaryTopBar";
import {
  AppToolbarFilter,
  AppToolbarFilters,
  AppToolbarSearch,
  AppToolbarUtility,
} from "../../app/layout/AppToolbarFilters";
import { AppProTable } from "../../app/pro/AppProTable";
import { useTopicSession } from "../../app/providers/useTopicSession";
import { useChannelGroup } from "../../app/providers/useChannelGroup";
import {
  DEFAULT_TOPIC_UPDATE_FREQUENCY,
} from "../../domain/topic/contracts";
import { hasMultiSelectFilter, matchesMultiSelectFilter } from "../../utils/multiSelectFilter";
import { CreateAlertRuleModal } from "./CreateAlertRuleModal";
import {
  DEFAULT_RULE_VALUES,
  MOCK_ALERT_RULES,
  MOCK_TRIGGERED_ALERTS,
} from "./alertsData";
import {
  buildChannelSummary,
  buildRuleCondition,
  buildTopicFrequencyLookup,
  formatDateTime,
  getDateSortValue,
  sanitizeRecipients,
} from "./alertsUtils";

const { Paragraph, Text } = Typography;

const AlertsPage = () => {
  const { topics } = useTopicSession();
  const { activeChannelGroupId } = useChannelGroup();
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState(MOCK_ALERT_RULES);
  const [alerts, setAlerts] = useState(MOCK_TRIGGERED_ALERTS);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editRule, setEditRule] = useState(null);
  const [ruleSearch, setRuleSearch] = useState("");
  const [ruleStatusFilter, setRuleStatusFilter] = useState([]);
  const [ruleTopicFilter, setRuleTopicFilter] = useState([]);
  const [selectedRuleKeys, setSelectedRuleKeys] = useState([]);
  const [detailRuleId, setDetailRuleId] = useState(null);
  const [snoozeConfirm, setSnoozeConfirm] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [savingCell, setSavingCell] = useState(null);
  const topicFrequencyLookup = useMemo(() => buildTopicFrequencyLookup(topics), [topics]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const scopedRules = useMemo(
    () => rules.filter((rule) => String(rule.channelGroupId ?? activeChannelGroupId) === String(activeChannelGroupId)),
    [activeChannelGroupId, rules],
  );
  const scopedAlerts = useMemo(
    () => alerts.filter((alert) => String(alert.channelGroupId ?? activeChannelGroupId) === String(activeChannelGroupId)),
    [activeChannelGroupId, alerts],
  );

  const alertsByRuleId = useMemo(() => (
    scopedAlerts.reduce((accumulator, alert) => {
      if (!accumulator[alert.ruleId]) {
        accumulator[alert.ruleId] = [];
      }

      accumulator[alert.ruleId].push(alert);
      return accumulator;
    }, {})
  ), [scopedAlerts]);

  const topicOptions = useMemo(
    () =>
      topics.map((topic) => ({
        label: topic.name,
        value: topic.name,
      })),
    [topics],
  );

  const filteredRules = useMemo(
    () =>
      scopedRules.filter((rule) => {
        const matchesSearch = !ruleSearch || rule.name.toLowerCase().includes(ruleSearch.toLowerCase());
        const matchesStatus = matchesMultiSelectFilter(rule.status, ruleStatusFilter);
        const matchesTopic = matchesMultiSelectFilter(rule.topic, ruleTopicFilter);
        return matchesSearch && matchesStatus && matchesTopic;
      }),
    [ruleSearch, ruleStatusFilter, ruleTopicFilter, scopedRules],
  );

  const selectedRules = useMemo(
    () => scopedRules.filter((rule) => selectedRuleKeys.includes(rule.id)),
    [scopedRules, selectedRuleKeys],
  );

  const selectedRule = useMemo(
    () => scopedRules.find((rule) => rule.id === detailRuleId) || null,
    [detailRuleId, scopedRules],
  );

  const selectedRuleAlerts = useMemo(
    () => (
      [...(alertsByRuleId[detailRuleId] || [])].sort(
        (left, right) => getDateSortValue(right.triggeredAt) - getDateSortValue(left.triggeredAt),
      )
    ),
    [alertsByRuleId, detailRuleId],
  );

  const canBulkPauseRules =
    selectedRules.length > 0 && selectedRules.every((rule) => rule.status === "active");
  const canBulkResumeRules =
    selectedRules.length > 0 && selectedRules.every((rule) => rule.status === "paused");
  const isSavingField = (ruleId, field) => savingCell?.ruleId === ruleId && savingCell?.field === field;
  const hasActiveFilters =
    Boolean(ruleSearch) ||
    hasMultiSelectFilter(ruleStatusFilter) ||
    hasMultiSelectFilter(ruleTopicFilter);

  const closeRuleModal = () => {
    setShowRuleModal(false);
    setEditRule(null);
  };

  const openRuleDetail = (ruleId) => {
    setDetailRuleId(ruleId);
  };

  const saveRule = (values) => {
    const nextRecipients = sanitizeRecipients(values.recipients);
    const syncedUpdateFrequency =
      topicFrequencyLookup[values.topic] || values.updateFrequency || DEFAULT_TOPIC_UPDATE_FREQUENCY;

    if (editRule) {
      setRules((previous) =>
        previous.map((rule) =>
          rule.id === editRule.id
            ? {
                ...rule,
                ...values,
                channelGroupId: rule.channelGroupId ?? activeChannelGroupId,
                updateFrequency: syncedUpdateFrequency,
                recipients: nextRecipients,
              }
            : rule,
        ),
      );
      setAlerts((previous) =>
        previous.map((alert) =>
          alert.ruleId === editRule.id
            ? {
                ...alert,
                ruleName: values.name,
              }
            : alert,
        ),
      );
      message.success("Rule updated");
    } else {
      setRules((previous) => [
        ...previous,
        {
          ...DEFAULT_RULE_VALUES,
          ...values,
          id: `a${Date.now()}`,
          channelGroupId: activeChannelGroupId,
          status: "active",
          lastTriggered: null,
          updateFrequency: syncedUpdateFrequency,
          recipients: nextRecipients,
        },
      ]);
      message.success("Rule created");
    }

    closeRuleModal();
  };

  const updateRuleStatuses = (ids, status) => {
    setRules((previous) =>
      previous.map((rule) => (ids.includes(rule.id) ? { ...rule, status } : rule)),
    );
    setSelectedRuleKeys([]);
    message.success(status === "active" ? "Rule resumed" : "Rule paused");
  };

  const updateRuleStatusInline = (ruleId, status) => {
    setSavingCell({ ruleId, field: "status" });

    try {
      setRules((previous) =>
        previous.map((rule) => (rule.id === ruleId ? { ...rule, status } : rule)),
      );
      message.success(status === "active" ? "Rule resumed" : "Rule paused");
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setSavingCell(null);
    }
  };

  const deleteRules = (ids) => {
    setRules((previous) => previous.filter((rule) => !ids.includes(rule.id)));
    setAlerts((previous) => previous.filter((alert) => !ids.includes(alert.ruleId)));
    setSelectedRuleKeys((previous) => previous.filter((key) => !ids.includes(key)));
    setDetailRuleId((previous) => (previous && ids.includes(previous) ? null : previous));
    setSnoozeConfirm((previous) => {
      if (!previous) {
        return null;
      }

      const targetAlert = alerts.find((alert) => alert.id === previous);
      return targetAlert && ids.includes(targetAlert.ruleId) ? null : previous;
    });
    setNoteModal((previous) => {
      if (!previous) {
        return null;
      }

      const targetAlert = alerts.find((alert) => alert.id === previous);
      return targetAlert && ids.includes(targetAlert.ruleId) ? null : previous;
    });
    message.success(ids.length === 1 ? "Rule deleted" : `${ids.length} rules deleted`);
  };

  const confirmDeleteRules = (ids, label) => {
    Modal.confirm({
      title: ids.length === 1 ? "Delete rule?" : "Delete selected rules?",
      content: label,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => deleteRules(ids),
    });
  };

  const updateAlertStatus = (id, status, extraPatch = {}) => {
    const now = dayjs().format("YYYY-MM-DD HH:mm");

    setAlerts((previous) =>
      previous.map((alert) => {
        if (alert.id !== id) {
          return alert;
        }

        const patch =
          status === "resolved" || status === "false_alarm"
            ? { resolvedAt: now, snoozedUntil: null }
            : status === "snoozed"
              ? { resolvedAt: null }
              : {};

        return {
          ...alert,
          ...patch,
          ...extraPatch,
          status,
        };
      }),
    );

    if (status === "resolved") {
      message.success("Alert resolved");
    } else if (status === "false_alarm") {
      message.success("Marked as false alarm");
    } else if (status === "snoozed") {
      message.success("Alert snoozed");
    }
  };

  const saveNote = (id, text) => {
    setAlerts((previous) =>
      previous.map((alert) => (alert.id === id ? { ...alert, note: text.trim() } : alert)),
    );
    setNoteModal(null);
    setNoteText("");
    message.success("Note saved");
  };

  const openNoteEditor = (alert) => {
    setNoteModal(alert.id);
    setNoteText(alert.note || "");
  };

  const renderActivitySummary = (alert) => {
    if (alert.snoozedUntil) {
      return `Snoozed until ${formatDateTime(alert.snoozedUntil)}`;
    }

    if (alert.resolvedAt) {
      return alert.status === "false_alarm"
        ? `Marked false alarm ${formatDateTime(alert.resolvedAt)}`
        : `Resolved ${formatDateTime(alert.resolvedAt)}`;
    }

    return "Waiting for follow-up";
  };

  const getActivitySummaryColor = (alert) => {
    if (alert.snoozedUntil) {
      return T.colorWarning;
    }

    if (alert.status === "false_alarm") {
      return T.colorTextTertiary;
    }

    if (alert.resolvedAt) {
      return T.colorSuccess;
    }

    return T.colorError;
  };

  const renderEditableRuleStatusCell = (rule) => {
    const isSaving = isSavingField(rule.id, "status");

    return (
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Switch
          checked={rule.status === "active"}
          loading={isSaving}
          onChange={(checked) => updateRuleStatusInline(rule.id, checked ? "active" : "paused")}
          aria-label={`Toggle status for ${rule.name}`}
        />
      </div>
    );
  };

  const rulesFilters = rules.length ? (
    <AppToolbarFilters>
      <AppToolbarSearch>
        <Input
          allowClear
          value={ruleSearch}
          onChange={(event) => setRuleSearch(event.target.value)}
          placeholder="Search rules"
          prefix={<SearchOutlined />}
        />
      </AppToolbarSearch>
      <AppToolbarFilter>
        <Select
          mode="multiple"
          allowClear
          maxTagCount="responsive"
          placeholder="Status"
          value={ruleStatusFilter}
          onChange={setRuleStatusFilter}
          style={{ width: "100%" }}
          options={[
            { label: "Active", value: "active" },
            { label: "Paused", value: "paused" },
          ]}
        />
      </AppToolbarFilter>
      <AppToolbarFilter>
        <Select
          mode="multiple"
          allowClear
          maxTagCount="responsive"
          placeholder="Topic"
          value={ruleTopicFilter}
          onChange={setRuleTopicFilter}
          style={{ width: "100%" }}
          options={topicOptions}
        />
      </AppToolbarFilter>
      {hasActiveFilters ? (
        <AppToolbarUtility>
          <Button
            onClick={() => {
              setRuleSearch("");
              setRuleStatusFilter([]);
              setRuleTopicFilter([]);
            }}
          >
            Clear all
          </Button>
        </AppToolbarUtility>
      ) : null}
    </AppToolbarFilters>
  ) : null;

  const rulesPageControls = (
    <AppToolbarCard>
    <AppPageControls
      layout="toolbar-only"
      filters={rulesFilters}
      marginBottom={0}
      primaryAction={
        <Button
          type="primary"
          onClick={() => {
            setEditRule(null);
            setShowRuleModal(true);
          }}
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      }
    />
    </AppToolbarCard>
  );

  const toolbarPortal = usePageSecondaryTopBar(rulesPageControls);

  const ruleColumns = [
    {
      title: "Rule",
      dataIndex: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Topic",
      dataIndex: "topic",
      width: 180,
      sorter: (a, b) => (a.topic || "").localeCompare(b.topic || ""),
    },
    {
      title: "Condition",
      width: 220,
      sorter: (a, b) => buildRuleCondition(a, topicFrequencyLookup).localeCompare(buildRuleCondition(b, topicFrequencyLookup)),
      render: (_, rule) => <Text>{buildRuleCondition(rule, topicFrequencyLookup)}</Text>,
    },
    {
      title: "Delivery",
      width: 140,
      sorter: (a, b) => buildChannelSummary(a.channels).localeCompare(buildChannelSummary(b.channels)),
      render: (_, rule) => <Text>{buildChannelSummary(rule.channels)}</Text>,
    },
    {
      title: "Last Triggered",
      dataIndex: "lastTriggered",
      width: 180,
      sorter: (a, b) => getDateSortValue(a.lastTriggered) - getDateSortValue(b.lastTriggered),
      render: (value) => <Text type={value ? undefined : "secondary"}>{value ? formatDateTime(value) : "Never"}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 160,
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      render: (_, rule) => renderEditableRuleStatusCell(rule),
    },
  ];

  const renderRuleActivityItem = (alert, isLast) => (
    <div
      key={alert.id}
      style={{
        paddingBottom: isLast ? 0 : T.paddingMD,
        marginBottom: isLast ? 0 : T.paddingMD,
        borderBottom: isLast ? "none" : `1px solid ${T.colorBorderSecondary}`,
      }}
    >
      <Space direction="vertical" size={8} style={{ display: "flex" }}>
        <div>
          <Text strong style={{ color: T.colorPrimary }}>
            {formatDateTime(alert.triggeredAt)}
          </Text>
        </div>
        <Paragraph style={{ marginBottom: 0, color: T.colorTextBase }}>{alert.reason}</Paragraph>
        <Text strong style={{ color: getActivitySummaryColor(alert) }}>
          {renderActivitySummary(alert)}
        </Text>
        {alert.note ? (
          <div>
            <Text strong style={{ color: T.colorTextHeading }}>Note</Text>
            <Paragraph style={{ marginTop: 4, marginBottom: 0, color: T.colorTextSecondary }}>{alert.note}</Paragraph>
          </div>
        ) : null}
        <Space wrap size={8}>
          {alert.status === "triggered" ? (
            <>
              <Button
                type="primary"
                size="small"
                onClick={() => updateAlertStatus(alert.id, "resolved")}
              >
                Mark Resolved
              </Button>
              <Button size="small" onClick={() => updateAlertStatus(alert.id, "false_alarm")}>
                False Alarm
              </Button>
              <Button size="small" onClick={() => setSnoozeConfirm(alert.id)}>Snooze</Button>
            </>
          ) : null}
          <Button size="small" onClick={() => openNoteEditor(alert)}>
            {alert.note ? "Edit Note" : "Add Note"}
          </Button>
        </Space>
      </Space>
    </div>
  );

  return (
    <>
      {toolbarPortal}
      <AdminPageLayout
        title="Alerts"
        contentPadding={`${T.paddingXS}px ${T.paddingLG}px ${T.paddingLG}px`}
      >
      {loading ? (
        <Space direction="vertical" size={16} style={{ display: "flex" }}>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} active paragraph={{ rows: 2 }} />
          ))}
        </Space>
      ) : (
        <AppTableCard>
        <AppProTable
          dataSource={filteredRules}
          columns={ruleColumns}
          rowKey="id"
          pagination={false}
          emptyDescription="No alert rules yet"
          rowSelection={{
            selectedRowKeys: selectedRuleKeys,
            onChange: setSelectedRuleKeys,
          }}
          onRow={(record) => ({
            onClick: () => openRuleDetail(record.id),
            style: { cursor: "pointer" },
          })}
          alertActions={[
            selectedRuleKeys.length === 1 ? (
              <Button
                key="edit"
                onClick={() => {
                  const currentRule = rules.find((rule) => rule.id === selectedRuleKeys[0]);
                  if (!currentRule) {
                    return;
                  }

                  setEditRule(currentRule);
                  setShowRuleModal(true);
                  setSelectedRuleKeys([]);
                }}
              >
                Edit
              </Button>
            ) : null,
            canBulkPauseRules ? (
              <Button key="pause" onClick={() => updateRuleStatuses(selectedRuleKeys, "paused")}>
                Pause
              </Button>
            ) : null,
            canBulkResumeRules ? (
              <Button key="resume" onClick={() => updateRuleStatuses(selectedRuleKeys, "active")}>
                Resume
              </Button>
            ) : null,
            selectedRuleKeys.length ? (
              <Button
                key="delete"
                onClick={() =>
                  confirmDeleteRules(
                    selectedRuleKeys,
                    `${selectedRuleKeys.length} selected rule(s) will be removed.`,
                  )
                }
              >
                Delete
              </Button>
            ) : null,
          ]}
        />
        </AppTableCard>
      )}

      <CreateAlertRuleModal
        open={showRuleModal}
        editRule={editRule}
        onClose={closeRuleModal}
        onSave={saveRule}
        topicFrequencyLookup={topicFrequencyLookup}
        topicOptions={topicOptions}
      />

      <Drawer
        title={selectedRule ? selectedRule.name : "Alert Rule"}
        open={Boolean(selectedRule)}
        onClose={() => setDetailRuleId(null)}
        width={520}
      >
        {selectedRule ? (
          <Space direction="vertical" size={20} style={{ display: "flex" }}>
            <div>
              <Text strong>Recent Activity</Text>
              <div style={{ display: "grid", gap: T.paddingSM, marginTop: 12 }}>
                {selectedRuleAlerts.length ? (
                  selectedRuleAlerts.map((alert, index) => renderRuleActivityItem(alert, index === selectedRuleAlerts.length - 1))
                ) : (
                  <Text type="secondary">No recent activity for this rule.</Text>
                )}
              </div>
            </div>
          </Space>
        ) : null}
      </Drawer>

      {snoozeConfirm ? (
        <Modal
          title="Snooze Alert"
          open={true}
          onCancel={() => setSnoozeConfirm(null)}
          footer={null}
          width={360}
        >
          <Space direction="vertical" size={12} style={{ display: "flex" }}>
            <Text type="secondary">Mute this alert for a short period.</Text>
            <Space wrap>
              {[1, 4, 24].map((hours) => (
                <Button
                  key={hours}
                  onClick={() => {
                    updateAlertStatus(snoozeConfirm, "snoozed", {
                      snoozedUntil: dayjs().add(hours, "hour").format("YYYY-MM-DD HH:mm"),
                    });
                    setSnoozeConfirm(null);
                  }}
                >
                  {hours === 1 ? "1 hour" : `${hours} hours`}
                </Button>
              ))}
            </Space>
          </Space>
        </Modal>
      ) : null}

      {noteModal ? (
        <Modal
          title="Alert Note"
          open={true}
          onCancel={() => {
            setNoteModal(null);
            setNoteText("");
          }}
          footer={null}
          width={440}
        >
          <Space direction="vertical" size={12} style={{ display: "flex" }}>
            <Input.TextArea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Add a note"
              autoSize={{ minRows: 4 }}
            />
            <Space style={{ justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setNoteModal(null);
                  setNoteText("");
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={() => saveNote(noteModal, noteText)}>
                Save Note
              </Button>
            </Space>
          </Space>
        </Modal>
      ) : null}
      </AdminPageLayout>
    </>
  );
};

export default AlertsPage;
