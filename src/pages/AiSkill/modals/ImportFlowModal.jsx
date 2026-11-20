import { useMemo, useState } from "react";
import { Alert, Button, Card, Descriptions, Input, Modal, Space, Spin, Tabs, Tag, Typography, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { KNOWLEDGE_CATEGORIES, SKILL_CATEGORIES, normalizeSharedTags } from "../../../data/aiSkill";
import { getAssetTypeTagProps } from "../components/assetPageHelpers";

const { Text, Paragraph } = Typography;
const { Dragger } = Upload;

const IMPORT_SOURCES = [
  {
    key: "url",
    label: "URL",
    description: "Paste a direct link to markdown, YAML, JSON, or a page that contains the asset.",
  },
  {
    key: "file",
    label: "File",
    description: "Upload a local markdown, YAML, or JSON file.",
  },
  {
    key: "outline",
    label: "wiki.odp.garena.vn",
    description: "Paste an Outline page URL and review the imported draft before saving.",
  },
];

const buildPreviewAsset = ({ targetType, source, input, fileName }) => {
  const sourceRef = input || fileName;

  if (targetType === "knowledge") {
    return {
      type: "knowledge",
      name:
        source === "outline"
          ? "Imported Knowledge from Outline"
          : source === "url"
            ? "Imported Knowledge from URL"
            : "Imported Knowledge",
      description: `Knowledge imported from ${sourceRef}. Review the draft before saving it to the workspace.`,
      category: KNOWLEDGE_CATEGORIES[0],
      sharedTags: normalizeSharedTags(),
      games: [],
      entries: 12,
      sampleEntries: [
        { term: "signal 1", aliases: "alias one", category: "Imported", sentiment: "neutral" },
        { term: "signal 2", aliases: "alias two", category: "Imported", sentiment: "positive" },
        { term: "signal 3", aliases: "alias three", category: "Imported", sentiment: "negative" },
      ],
      source: `imported-${source}`,
      sourceUrl: input || "",
    };
  }

  return {
    type: "skill",
    name:
      source === "outline" ? "Imported Skill from Outline" : source === "url" ? "Imported Skill from URL" : "Imported Skill",
    description: `Skill imported from ${sourceRef}. Review the instructions before saving it to the workspace.`,
    category: SKILL_CATEGORIES[0]?.value,
    sharedTags: normalizeSharedTags(),
    games: [],
    trigger: "manual",
    instructions: `# Imported Skill\n\nSource: ${sourceRef}\n\n## Instructions\nUpdate this draft to fit the workflow before saving.\n\n## Output\n- Keep the result concise\n- Highlight the key signal\n- Note any follow-up needed`,
    source: `imported-${source}`,
    sourceUrl: input || "",
  };
};

const getPreviewSnippet = (asset) => {
  if (!asset) return "";

  if (asset.type === "knowledge") {
    return asset.sampleEntries
      ?.map((entry) => [entry.term, entry.aliases, entry.category, entry.sentiment].filter(Boolean).join(" | "))
      .join("\n");
  }

  return asset.instructions || "";
};

const buildCategoryLabel = (targetType, category) => {
  if (targetType === "knowledge") return category || KNOWLEDGE_CATEGORIES[0];
  return SKILL_CATEGORIES.find((item) => item.value === category)?.label || SKILL_CATEGORIES[0]?.label || "--";
};

const ImportFlowModal = ({ visible, targetType = "skill", onClose, onImport, onEdit }) => {
  const assetLabel = targetType === "knowledge" ? "Knowledge" : "Skill";
  const [activeSource, setActiveSource] = useState("url");
  const [urlInput, setUrlInput] = useState("");
  const [outlineInput, setOutlineInput] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewAsset, setPreviewAsset] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const activeInputValue = activeSource === "url" ? urlInput : activeSource === "outline" ? outlineInput : fileList[0]?.name || "";
  const fileName = fileList[0]?.name || "";

  const resetState = () => {
    setUrlInput("");
    setOutlineInput("");
    setFileList([]);
    setPreviewAsset(null);
    setImportError("");
    setImporting(false);
    setActiveSource("url");
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  const runImport = () => {
    if (!activeInputValue || activeInputValue.trim().length < 5) {
      setImportError("Enter a valid source before importing.");
      return;
    }

    setImporting(true);
    setImportError("");
    setPreviewAsset(null);

    window.setTimeout(() => {
      setPreviewAsset(
        buildPreviewAsset({
          targetType,
          source: activeSource,
          input: activeInputValue,
          fileName,
        }),
      );
      setImporting(false);
    }, 500);
  };

  const handleSaveImported = () => {
    if (!previewAsset) return;

    const normalizedAsset = normalizeSharedTags(previewAsset.sharedTags, previewAsset.games);
    const baseData = {
      ...previewAsset,
      sharedTags: normalizedAsset,
      games: normalizedAsset.game,
      enabled: false,
      author: "Hai-Son Tran",
      authorAvatar: "HT",
      version: "1.0",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const nextAsset =
      targetType === "knowledge"
        ? {
            id: `kn_imp_${Date.now()}`,
            ...baseData,
            type: "knowledge",
            entries: previewAsset.entries || previewAsset.sampleEntries?.length || 0,
            format: "manual",
            linkedSkills: [],
          }
        : {
            id: `sk_imp_${Date.now()}`,
            ...baseData,
            type: "skill",
            trigger: previewAsset.trigger || "manual",
            instructions: previewAsset.instructions || "",
            linkedTopics: [],
            linkedKnowledge: [],
          };

    onImport(nextAsset);
    handleClose();
  };

  const handleEditImported = () => {
    if (!previewAsset) return;
    onEdit({ ...previewAsset, isTemplate: true });
    handleClose();
  };

  const previewSnippet = useMemo(() => getPreviewSnippet(previewAsset), [previewAsset]);
  const typeTag = getAssetTypeTagProps(targetType);

  if (!visible) return null;

  return (
    <Modal open title={`Import ${assetLabel}`} onCancel={handleClose} footer={null} width={720} destroyOnHidden>
      <Space direction="vertical" size={16} style={{ display: "flex" }}>
        <Tabs
          activeKey={activeSource}
          onChange={(key) => {
            setActiveSource(key);
            setImportError("");
            setPreviewAsset(null);
          }}
          items={IMPORT_SOURCES.map((source) => ({
            key: source.key,
            label: source.label,
            children: (
              <Space direction="vertical" size={12} style={{ display: "flex" }}>
                <Text type="secondary">{source.description}</Text>

                {source.key === "url" ? (
                  <Input
                    value={urlInput}
                    onChange={(event) => setUrlInput(event.target.value)}
                    placeholder="https://example.com/skill.md"
                  />
                ) : null}

                {source.key === "outline" ? (
                  <>
                    <Input
                      value={outlineInput}
                      onChange={(event) => setOutlineInput(event.target.value)}
                      placeholder="https://wiki.odp.garena.vn/doc/..."
                    />
                    <Alert type="info" showIcon message="Outline import creates a draft. Review it before saving." />
                  </>
                ) : null}

                {source.key === "file" ? (
                  <Dragger
                    accept=".md,.yaml,.yml,.json"
                    multiple={false}
                    beforeUpload={(file) => {
                      setFileList([file]);
                      setPreviewAsset(null);
                      setImportError("");
                      return false;
                    }}
                    fileList={fileList}
                    onRemove={() => {
                      setFileList([]);
                      setPreviewAsset(null);
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Drop a file here or click to browse</p>
                    <p className="ant-upload-hint">Supported: .md, .yaml, .yml, .json</p>
                  </Dragger>
                ) : null}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="primary" onClick={runImport} loading={importing} disabled={!activeInputValue.trim()}>
                    Import
                  </Button>
                </div>
              </Space>
            ),
          }))}
        />

        {importError ? <Alert type="error" showIcon message={importError} /> : null}

        {importing ? (
          <Card>
            <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
              <Spin tip="Preparing preview" />
            </div>
          </Card>
        ) : null}

        {previewAsset ? (
          <Card
            title="Preview"
            extra={
              <Space size={8}>
                <Button onClick={handleEditImported}>Edit</Button>
                <Button type="primary" onClick={handleSaveImported}>
                  Save
                </Button>
              </Space>
            }
          >
            <Space direction="vertical" size={12} style={{ display: "flex" }}>
              <div>
                <Typography.Title level={5} style={{ marginBottom: 4 }}>
                  {previewAsset.name}
                </Typography.Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {previewAsset.description}
                </Paragraph>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Tag color={typeTag.color}>{typeTag.label}</Tag>
                <Tag>{buildCategoryLabel(targetType, previewAsset.category)}</Tag>
                <Tag>{activeSource === "outline" ? "Outline" : activeSource === "url" ? "URL" : "File"}</Tag>
              </div>

              <Descriptions
                size="small"
                column={2}
                items={[
                  { key: "type", label: "Type", children: assetLabel },
                  { key: "source", label: "Source", children: activeInputValue },
                ]}
              />

              <Card size="small" title={targetType === "knowledge" ? "Content" : "Instructions"}>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
                    fontSize: 12,
                    lineHeight: 1.6,
                    maxHeight: 180,
                    overflow: "auto",
                  }}
                >
                  {previewSnippet}
                </pre>
              </Card>
            </Space>
          </Card>
        ) : null}
      </Space>
    </Modal>
  );
};

export default ImportFlowModal;
