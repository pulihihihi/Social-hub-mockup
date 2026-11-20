import { useMemo, useState } from "react";
import { ArrowLeftOutlined, ClockCircleOutlined, CodeOutlined, FileTextOutlined, SaveOutlined, StarFilled } from "@ant-design/icons";
import { Button, Input, Select, Tabs, Tag, Typography } from "antd";
import { AppSurfaceCard } from "../../../app/pro/AppSurfaceCard";
import { T } from "../../../theme";
import { KNOWLEDGE_CATEGORIES, SHARED_TAG_GROUPS, SKILL_CATEGORIES, normalizeSharedTags } from "../../../data/aiSkill";
import {
  assetCodeBlockStyle,
  assetRailButtonProps,
  assetShellBodyStyle,
  assetShellCardStyle,
  buildAssetMarkdown,
  getAssetTypeTagProps,
} from "./assetPageHelpers";

const { Paragraph, Text, Title } = Typography;

const tabLabelStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const editorMetricStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "4px 10px",
  borderRadius: 999,
  background: T.colorFillQuaternary,
  border: `1px solid ${T.colorBorderSecondary}`,
  fontSize: T.fontSizeSM,
  color: T.colorTextSecondary,
};

const buildSampleEntriesText = (entries = []) =>
  entries.map((entry) => [entry.term, entry.aliases, entry.category, entry.sentiment].filter(Boolean).join(" | ")).join("\n");

const parseSampleEntriesText = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [term = "", aliases = "", category = "", sentiment = "neutral"] = line.split("|").map((part) => part.trim());
      return { term, aliases, category, sentiment };
    })
    .filter((entry) => entry.term);

const CORE_SHARED_TAG_KEYS = new Set(["team", "game"]);
const CORE_SHARED_TAG_GROUPS = SHARED_TAG_GROUPS.filter((group) => CORE_SHARED_TAG_KEYS.has(group.key));

export default function AssetEditorView({ type, item, knowledge = [], onBack, onSave }) {
  const isSkill = type === "skill";
  const isEdit = Boolean(item?.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [category, setCategory] = useState(item?.category || (isSkill ? SKILL_CATEGORIES[0]?.value : KNOWLEDGE_CATEGORIES[0]));
  const [sharedTags, setSharedTags] = useState(() => normalizeSharedTags(item?.sharedTags, item?.games));
  const [trigger] = useState(item?.trigger || "manual");
  const [instructions, setInstructions] = useState(item?.instructions || "");
  const [linkedKnowledge, setLinkedKnowledge] = useState(item?.linkedKnowledge || []);
  const [knowledgeContent, setKnowledgeContent] = useState(item?.rawContent || buildSampleEntriesText(item?.sampleEntries || []));
  const games = sharedTags.game;
  const typeTag = getAssetTypeTagProps(isSkill ? "skill" : "knowledge");

  const categoryLabel = useMemo(() => {
    if (isSkill) return SKILL_CATEGORIES.find((entry) => entry.value === category)?.label || SKILL_CATEGORIES[0]?.label || "--";
    return category;
  }, [category, isSkill]);

  const linkedKnowledgeNames = useMemo(
    () => knowledge.filter((entry) => linkedKnowledge.includes(entry.id)).map((entry) => entry.name),
    [knowledge, linkedKnowledge],
  );

  const draftItem = useMemo(
    () => ({
      ...(item || {}),
      type: isSkill ? "skill" : "knowledge",
      name: name.trim() || (isSkill ? "Untitled Skill" : "Untitled Knowledge"),
      description: description.trim() || (isSkill ? "Add a short summary for this skill." : "Add a short summary for this knowledge package."),
      category,
      sharedTags,
      games,
      trigger,
      instructions: instructions.trim(),
      linkedKnowledge,
      entries: parseSampleEntriesText(knowledgeContent).length || item?.entries || 0,
      sampleEntries: parseSampleEntriesText(knowledgeContent),
      rawContent: isSkill ? undefined : knowledgeContent.trim(),
      author: item?.author || "Hai-Son Tran",
      authorAvatar: item?.authorAvatar || "HT",
      version: item?.version || "1.0",
      usageCount: item?.usageCount || 0,
      enabled: typeof item?.enabled === "boolean" ? item.enabled : false,
      updatedAt: item?.updatedAt || "--",
    }),
    [category, description, games, instructions, isSkill, item, knowledgeContent, linkedKnowledge, name, sharedTags, trigger],
  );

  const markdownValue = useMemo(
    () =>
      buildAssetMarkdown({
        item: draftItem,
        categoryLabel,
        triggerLabel: null,
        linkedKnowledgeNames,
      }),
    [categoryLabel, draftItem, linkedKnowledgeNames],
  );

  const isValid = isSkill ? name.trim() && instructions.trim() : name.trim() && description.trim();

  const handleSave = () => {
    const baseData = {
      id: isEdit ? item.id : `${isSkill ? "sk" : "kn"}_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      sharedTags,
      games,
      author: item?.author || "Hai-Son Tran",
      authorAvatar: item?.authorAvatar || "HT",
      version: item?.version || "1.0",
      usageCount: item?.usageCount || 0,
      source: item?.source || "local",
      enabled: typeof item?.enabled === "boolean" ? item.enabled : false,
      createdAt: isEdit ? item.createdAt : new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    if (isSkill) {
      onSave({
        ...baseData,
        trigger,
        instructions: instructions.trim(),
        linkedKnowledge,
        linkedTopics: item?.linkedTopics || [],
      });
      return;
    }

    onSave({
      ...baseData,
      type: "knowledge",
      entries: parseSampleEntriesText(knowledgeContent).length || item?.entries || 0,
      format: item?.format || "manual",
      linkedSkills: item?.linkedSkills || [],
      sampleEntries: parseSampleEntriesText(knowledgeContent),
      rawContent: knowledgeContent.trim(),
    });
  };

  const handleSharedTagChange = (groupKey, values) => {
    setSharedTags((prev) => normalizeSharedTags({ ...prev, [groupKey]: values }));
  };

  const overviewTab = (
    <div style={{ display: "grid", gap: 12 }}>
      <AppSurfaceCard bodyStyle={assetShellBodyStyle} style={assetShellCardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>
              Name
            </Text>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={isSkill ? "Enter skill name" : "Enter knowledge name"} />
          </div>

          <div>
            <Text strong style={{ display: "block", marginBottom: 6 }}>
              Category
            </Text>
            <Select
              value={category}
              onChange={setCategory}
              style={{ width: "100%" }}
              options={
                isSkill
                  ? SKILL_CATEGORIES.map((entry) => ({ value: entry.value, label: entry.label }))
                  : KNOWLEDGE_CATEGORIES.map((entry) => ({ value: entry, label: entry }))
              }
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Text strong style={{ display: "block", marginBottom: 6 }}>
            Description
          </Text>
          <Input.TextArea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            autoSize={{ minRows: 3 }}
            placeholder="Describe what this asset does"
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <Text strong style={{ display: "block", marginBottom: 10 }}>
            Scope
          </Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {CORE_SHARED_TAG_GROUPS.map((group) => (
              <div key={group.key}>
                <Text strong style={{ display: "block", marginBottom: 6 }}>
                  {group.label}
                </Text>
                <Select
                  mode="multiple"
                  value={sharedTags[group.key]}
                  onChange={(values) => handleSharedTagChange(group.key, values)}
                  maxTagCount="responsive"
                  style={{ width: "100%" }}
                  placeholder={`Select ${group.label.toLowerCase()}`}
                  options={group.options.map((entry) => ({ value: entry, label: entry }))}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.colorBorderSecondary}` }}>
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            {isSkill ? "Dependencies" : "Knowledge Notes"}
          </Text>
          {isSkill ? (
            <Select
              mode="multiple"
              value={linkedKnowledge}
              onChange={setLinkedKnowledge}
              style={{ width: "100%" }}
              placeholder="Select related knowledge packs"
              options={knowledge.map((entry) => ({ value: entry.id, label: entry.name }))}
              optionFilterProp="label"
            />
          ) : (
            <Paragraph style={{ margin: 0, color: T.colorTextSecondary, lineHeight: 1.7 }}>
              Keep the category and structure aligned so this knowledge pack is ready for reuse across workflows.
            </Paragraph>
          )}
        </div>
      </AppSurfaceCard>
    </div>
  );

  const previewTab = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
      <AppSurfaceCard
        title={isSkill ? "Instructions" : "Content"}
        bodyStyle={assetShellBodyStyle}
        style={assetShellCardStyle}
      >
        {isSkill ? (
          <Input.TextArea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            autoSize={{ minRows: 14 }}
            placeholder="Write the instruction set that AI should follow"
            style={{ fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace" }}
          />
        ) : (
          <Input.TextArea
            value={knowledgeContent}
            onChange={(event) => setKnowledgeContent(event.target.value)}
            autoSize={{ minRows: 14 }}
            placeholder={"Paste raw text or markdown here.\n\nExample:\nrefund wave | chargeback | Revenue | very_negative"}
            style={{ fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace" }}
          />
        )}
      </AppSurfaceCard>

      <AppSurfaceCard title="Preview" bodyStyle={assetShellBodyStyle} style={assetShellCardStyle}>
        <pre style={assetCodeBlockStyle}>{markdownValue}</pre>
      </AppSurfaceCard>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ paddingInline: 0, alignSelf: "flex-start" }}>
        Back
      </Button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>
        <div
          style={{
            ...assetShellCardStyle,
            flex: "999 1 760px",
            alignSelf: "flex-start",
            background: T.colorBgContainer,
            border: `1px solid ${T.colorBorderSecondary}`,
            borderRadius: T.borderRadiusLG,
            padding: 14,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <Tag color={typeTag.color} style={{ margin: 0 }}>
                {isSkill ? "My Skill" : "My Knowledge"}
              </Tag>
              <Tag style={{ margin: 0 }}>{categoryLabel}</Tag>
              {games.map((game) => (
                <Tag key={game} style={{ margin: 0 }}>
                  {game}
                </Tag>
              ))}
              <Tag style={{ margin: 0 }}>{isEdit ? "Edit" : "Add"}</Tag>
            </div>

            <Title level={1} style={{ margin: 0, fontSize: 28, lineHeight: 1.15, color: T.colorTextBase }}>
              {draftItem.name}
            </Title>

            <Paragraph style={{ margin: 0, color: T.colorTextSecondary, fontSize: 14, lineHeight: 1.5 }}>
              {draftItem.description}
            </Paragraph>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <span style={editorMetricStyle}>
                <StarFilled style={{ color: "#f4b400" }} />
                {(item?.usageCount || 0).toLocaleString()} uses
              </span>
              <span style={editorMetricStyle}>
                <ClockCircleOutlined />
                {item?.updatedAt || "--"}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            ...assetShellCardStyle,
            flex: "1 1 280px",
            minWidth: 280,
            alignSelf: "flex-start",
            background: T.colorBgContainer,
            border: `1px solid ${T.colorBorderSecondary}`,
            borderRadius: T.borderRadiusLG,
            padding: 14,
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <Button {...assetRailButtonProps} type="primary" icon={<SaveOutlined />} block onClick={handleSave} disabled={!isValid}>
              {isEdit ? `Update ${isSkill ? "skill" : "knowledge"}` : `Create ${isSkill ? "skill" : "knowledge"}`}
            </Button>
            <Button {...assetRailButtonProps} block onClick={onBack}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        size="small"
        activeKey={activeTab}
        onChange={setActiveTab}
        animated={false}
        items={[
          {
            key: "overview",
            label: (
              <span style={tabLabelStyle}>
                <FileTextOutlined />
                <span>Overview</span>
              </span>
            ),
            children: overviewTab,
          },
          {
            key: "preview",
            label: (
              <span style={tabLabelStyle}>
                <CodeOutlined />
                <span>Preview</span>
              </span>
            ),
            children: previewTab,
          },
        ]}
      />
    </div>
  );
}
