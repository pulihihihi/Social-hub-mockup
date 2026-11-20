import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Button, Card, Descriptions, Divider, Empty, Grid, List, Space, Tag, Typography, message } from "antd";
import { normalizeSharedTags } from "../../../data/aiSkill";
import { ViewModeSegmented } from "../../../components/ViewModeSegmented";
import { T } from "../../../theme";
import { assetCodeBlockStyle, assetRailButtonProps, buildAssetMarkdown, getAssetTypeTagProps } from "./assetPageHelpers";

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const surfaceCardStyle = {
  borderColor: T.colorBorderSecondary,
  boxShadow: "none",
};

const compactCardBodyStyle = {
  padding: 16,
};

const getSourceTagColor = (sourceLabel) => {
  if (sourceLabel === "Personal") return "purple";
  if (sourceLabel === "Marketplace") return "blue";
  if (sourceLabel === "Pending") return "orange";
  return "default";
};

const renderTagList = (values) =>
  values.length ? (
    <Space size={[6, 6]} wrap>
      {values.map((value) => (
        <Tag key={value}>{value}</Tag>
      ))}
    </Space>
  ) : (
    <Text type="secondary">--</Text>
  );

const buildSummaryItems = ({ item, categoryLabel, sharedTags }) => [
  {
    key: "owner",
    label: "Owner",
    children: item.author || "Workspace",
  },
  {
    key: "category",
    label: "Category",
    children: categoryLabel || item.category || "--",
  },
  {
    key: "team",
    label: "Team",
    children: renderTagList(sharedTags.team),
  },
  {
    key: "game",
    label: "Game",
    children: renderTagList(sharedTags.game),
  },
];

const buildDependencySection = ({ item, linkedKnowledgeItems }) => {
  if (item.type === "skill") {
    return {
      title: "Dependencies",
      emptyText: "No linked knowledge yet.",
      items: linkedKnowledgeItems.map((knowledgeItem) => ({
        id: knowledgeItem.id,
        name: knowledgeItem.name,
        description: knowledgeItem.description || knowledgeItem.category,
      })),
    };
  }

  return {
    title: "Linked Skills",
    emptyText: "No linked skills yet.",
    items: (item.linkedSkills || []).map((skillName) => ({
      id: skillName,
      name: skillName,
      description: null,
    })),
  };
};

const getSourceValue = (item, markdownValue) => {
  if (item.type === "knowledge") return item.rawContent?.trim() || markdownValue;
  return item.instructions?.trim() || markdownValue;
};

const getSecondaryActions = ({ isMarketplace, isInstalled, isKnowledge, isActive, item, onCopySkill, onPublish, onToggle }) => {
  if (isMarketplace) {
    return !isKnowledge
      ? [
          {
            key: "duplicate",
            label: isInstalled ? "Duplicate" : "Use as template",
            onClick: onCopySkill,
          },
        ]
      : [];
  }

  const actions = [
    {
      key: "toggle",
      label: isActive ? "Deactivate" : "Activate",
      onClick: onToggle,
    },
    {
      key: "publish",
      label: "Publish",
      onClick: onPublish,
    },
  ];

  return item.source === "local" ? actions : [];
};

const getActionVisualProps = (actionKey) => {
  if (actionKey === "approve") {
    return {
      color: T.colorSuccess,
      borderColor: T.colorSuccess,
      background: T.colorSuccess,
      textColor: "#fff",
    };
  }

  if (actionKey === "activate") {
    return {
      color: T.colorSuccess,
      borderColor: T.colorSuccessBorder,
      background: T.colorSuccessBg,
      textColor: T.colorSuccess,
    };
  }

  if (actionKey === "deactivate") {
    return {
      color: T.colorWarning,
      borderColor: T.colorWarningBorder,
      background: T.colorWarningBg,
      textColor: T.colorWarning,
    };
  }

  return null;
};

export default function SkillDetailView({
  item,
  originLabel,
  sourceKind,
  categoryLabel,
  triggerLabel,
  updatedLabel,
  sourceLabel,
  linkedKnowledgeItems = [],
  isInstalled = false,
  onBack,
  onEdit,
  onToggle,
  onInstall,
  onUninstall,
  onApprove,
  onReject,
  onCopySkill,
  onPublish,
}) {
  const screens = useBreakpoint();
  const isRailLayout = Boolean(screens.xl);
  const summaryColumns = screens.lg ? 2 : 1;

  const [previewMode, setPreviewMode] = useState("source");

  const isMarketplace = sourceKind === "marketplace";
  const isApproval = sourceKind === "approval";
  const isKnowledge = item.type === "knowledge";
  const isActive = Boolean(item.enabled);
  const usageValue = isMarketplace ? item.installs || 0 : item.usageCount || 0;
  const typeTag = getAssetTypeTagProps(item.type);
  const sharedTags = useMemo(() => normalizeSharedTags(item.sharedTags, item.games), [item.games, item.sharedTags]);
  const linkedKnowledgeNames = linkedKnowledgeItems.map((entry) => entry.name);

  useEffect(() => {
    setPreviewMode("source");
  }, [item.id, sourceKind]);

  const markdownValue = useMemo(
    () =>
      buildAssetMarkdown({
        item,
        categoryLabel,
        triggerLabel,
        linkedKnowledgeNames,
      }),
    [categoryLabel, item, linkedKnowledgeNames, triggerLabel],
  );

  const sourceValue = useMemo(() => getSourceValue(item, markdownValue), [item, markdownValue]);
  const summaryItems = useMemo(() => buildSummaryItems({ item, categoryLabel, sharedTags }), [categoryLabel, item, sharedTags]);
  const dependencySection = useMemo(
    () => buildDependencySection({ item, linkedKnowledgeItems }),
    [item, linkedKnowledgeItems],
  );

  const secondaryActions = useMemo(
    () =>
      getSecondaryActions({
        isMarketplace,
        isInstalled,
        isKnowledge,
        isActive,
        item,
        onCopySkill,
        onPublish,
        onToggle,
      }),
    [isActive, isInstalled, isKnowledge, isMarketplace, item, onCopySkill, onPublish, onToggle],
  );

  const handleCopyPreview = async () => {
    const visibleValue = previewMode === "source" ? sourceValue : markdownValue;

    try {
      await navigator.clipboard.writeText(visibleValue);
      message.success("Preview copied");
    } catch {
      message.error("Unable to copy preview");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdownValue], { type: "text/markdown;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${String(item.name || "asset")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
    message.success("Downloaded");
  };

  const primaryAction = isApproval
    ? { key: "approve", label: "Approve", action: onApprove, danger: false }
    : isMarketplace
      ? { key: isInstalled ? "uninstall" : "install", label: isInstalled ? "Uninstall" : "Install", action: isInstalled ? onUninstall : onInstall, danger: isInstalled }
      : { key: "edit", label: "Edit", action: onEdit, danger: false };

  const primaryVisual = getActionVisualProps(primaryAction.key);

  const headerTags = (
    <Space size={[8, 8]} wrap>
      <Tag color={typeTag.color}>{typeTag.label}</Tag>
      {sourceLabel ? <Tag color={getSourceTagColor(sourceLabel)}>{sourceLabel}</Tag> : null}
      {categoryLabel ? <Tag>{categoryLabel}</Tag> : null}
      {sharedTags.game.map((game) => (
        <Tag key={game}>{game}</Tag>
      ))}
      {!isMarketplace && !isApproval ? <Tag color={isActive ? "success" : "default"}>{isActive ? "Active" : "Inactive"}</Tag> : null}
      {isMarketplace && isInstalled ? <Tag color="success">Installed</Tag> : null}
    </Space>
  );

  const headerMeta = (
    <Space size={12} split={<Divider type="vertical" style={{ margin: 0, borderColor: T.colorBorderSecondary }} />}>
      <Text type="secondary">
        <StarFilled style={{ color: "#f4b400", marginRight: 8 }} />
        {usageValue.toLocaleString()} {isMarketplace ? "downloads" : "uses"}
      </Text>
      <Text type="secondary">
        <ClockCircleOutlined style={{ marginRight: 8 }} />
        {updatedLabel || "--"}
      </Text>
    </Space>
  );

  const previewValue = previewMode === "source" ? sourceValue : markdownValue;
  const previewTitle = previewMode === "source" ? "Raw Content" : "Export Preview";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ paddingInline: 0, alignSelf: "flex-start" }}>
        {originLabel}
      </Button>

      <div style={{ display: "grid", gridTemplateColumns: isRailLayout ? "minmax(0, 1fr) 312px" : "1fr", gap: 12, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <Card size="small" style={surfaceCardStyle} styles={{ body: compactCardBodyStyle }}>
            <Space direction="vertical" size={12} style={{ display: "flex" }}>
              {headerTags}
              <div>
                <Title level={2} style={{ margin: 0, fontSize: isRailLayout ? 28 : 24, lineHeight: 1.15 }}>
                  {item.name}
                </Title>
              </div>
              <Paragraph
                ellipsis={{ rows: 1, tooltip: item.description }}
                style={{ margin: 0, color: T.colorTextSecondary, fontSize: 14, lineHeight: 1.5 }}
              >
                {item.description}
              </Paragraph>
              {headerMeta}
            </Space>
          </Card>

          <Card title="Summary" size="small" style={surfaceCardStyle} styles={{ body: compactCardBodyStyle }}>
            <Descriptions
              size="small"
              column={summaryColumns}
              items={summaryItems}
              styles={{
                label: { color: T.colorTextSecondary, width: 88 },
                content: { color: T.colorTextBase, fontWeight: T.fontWeightStrong },
              }}
            />
          </Card>

          <Card title={dependencySection.title} size="small" style={surfaceCardStyle} styles={{ body: compactCardBodyStyle }}>
            {dependencySection.items.length ? (
              <List
                size="small"
                dataSource={dependencySection.items}
                renderItem={(dependency) => (
                  <List.Item style={{ paddingInline: 0 }}>
                    <List.Item.Meta
                      title={<Text strong>{dependency.name}</Text>}
                      description={dependency.description || undefined}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={dependencySection.emptyText} />
            )}
          </Card>

          <Card
            title="Preview"
            size="small"
            style={surfaceCardStyle}
            styles={{ body: compactCardBodyStyle }}
            extra={
              <Space wrap>
                <ViewModeSegmented
                  ariaLabel="Preview mode"
                  size="small"
                  value={previewMode}
                  onChange={setPreviewMode}
                  options={[
                    { label: "Raw Content", value: "source" },
                    { label: "Export Preview", value: "package" },
                  ]}
                />
                <Button size="small" icon={<CopyOutlined />} onClick={handleCopyPreview}>
                  Copy
                </Button>
                <Button size="small" icon={<DownloadOutlined />} onClick={handleDownload}>
                  Download
                </Button>
              </Space>
            }
          >
            <Space direction="vertical" size={10} style={{ display: "flex" }}>
              <Text type="secondary">{previewTitle === "Raw Content" ? (isKnowledge ? "Content" : "Instructions") : "Export preview"}</Text>
              <pre style={assetCodeBlockStyle}>{previewValue}</pre>
            </Space>
          </Card>
        </div>

        <div style={{ position: isRailLayout ? "sticky" : "static", top: isRailLayout ? 0 : undefined }}>
          <Space direction="vertical" size={12} style={{ display: "flex" }}>
            <Card size="small" style={surfaceCardStyle} styles={{ body: compactCardBodyStyle }}>
              <Space direction="vertical" size={8} style={{ display: "flex" }}>
                <Button
                  {...assetRailButtonProps}
                  type="primary"
                  danger={primaryAction.danger && !primaryVisual}
                  block
                  onClick={primaryAction.action}
                  style={{
                    ...assetRailButtonProps.style,
                    ...(primaryVisual
                      ? {
                          background: primaryVisual.background,
                          borderColor: primaryVisual.borderColor,
                          color: primaryVisual.textColor,
                          boxShadow: "none",
                        }
                      : null),
                  }}
                >
                  {primaryAction.label}
                </Button>

                {isApproval ? (
                  <Button {...assetRailButtonProps} danger block onClick={onReject}>
                    Reject
                  </Button>
                ) : null}

                {!isApproval
                  ? secondaryActions.map((action) => (
                      <Button
                        key={action.key}
                        {...assetRailButtonProps}
                        block
                        onClick={action.onClick}
                        style={{
                          ...assetRailButtonProps.style,
                          ...(getActionVisualProps(action.key)
                            ? {
                                background: getActionVisualProps(action.key).background,
                                borderColor: getActionVisualProps(action.key).borderColor,
                                color: getActionVisualProps(action.key).textColor,
                              }
                            : null),
                        }}
                      >
                        {action.label}
                      </Button>
                    ))
                  : null}
              </Space>
            </Card>

            {isApproval ? (
              <Card title="Review context" size="small" style={surfaceCardStyle} styles={{ body: compactCardBodyStyle }}>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: "submitter",
                      label: "Submitter",
                      children: item.author || "Workspace",
                    },
                    {
                      key: "updated",
                      label: "Updated",
                      children: updatedLabel || "--",
                    },
                  ]}
                  styles={{
                    label: { color: T.colorTextSecondary, width: 72 },
                  }}
                />
              </Card>
            ) : null}
          </Space>
        </div>
      </div>
    </div>
  );
}
