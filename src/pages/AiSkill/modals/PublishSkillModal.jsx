import { useMemo, useState } from "react";
import { Alert, Button, Card, Input, Modal, Result, Select, Space, Steps, Tag, Typography, message } from "antd";
import { GAME_OPTIONS, KNOWLEDGE_CATEGORIES, PUBLISH_TAGS_OPTIONS, SKILL_CATEGORIES } from "../../../data/aiSkill";
import { getAssetTypeTagProps } from "../components/assetPageHelpers";

const { Paragraph, Text, Title } = Typography;

const buildPublishChecks = (asset) => {
  const isKnowledge = asset?.type === "knowledge";
  const contentLength = isKnowledge ? asset?.rawContent?.trim()?.length || 0 : asset?.instructions?.trim()?.length || 0;
  const hasValidCategory = isKnowledge
    ? KNOWLEDGE_CATEGORIES.includes(asset?.category)
    : Boolean(SKILL_CATEGORIES.find((item) => item.value === asset?.category));

  return [
    { key: "name", label: `${isKnowledge ? "Knowledge" : "Skill"} name is set`, pass: Boolean(asset?.name?.trim()) },
    { key: "desc", label: "Description is filled (min 20 chars)", pass: (asset?.description?.trim()?.length || 0) >= 20 },
    { key: "category", label: "Category is selected", pass: hasValidCategory },
    { key: "game", label: "Game is selected", pass: Boolean(asset?.publishGame) },
    {
      key: "content",
      label: "Skill/ Knowledge content is detailed (min 100 chars)",
      pass: contentLength >= 100,
    },
  ];
};

const getPreviewName = (value) =>
  String(value || "")
    .replace(/(\s*\(Copy\))+$/i, " (Copy)")
    .trim();

const PublishSkillModal = ({ asset, onClose, onPublish }) => {
  const [step, setStep] = useState(0);
  const [pubTags, setPubTags] = useState(asset?.tags || []);
  const [pubCategory, setPubCategory] = useState(
    asset?.category || (asset?.type === "knowledge" ? KNOWLEDGE_CATEGORIES[0] : SKILL_CATEGORIES[0]?.value),
  );
  const [pubGame, setPubGame] = useState(asset?.games?.[0] || "Cross-game");
  const [pubDesc, setPubDesc] = useState(asset?.description || "");
  const [submitted, setSubmitted] = useState(false);

  const isKnowledge = asset?.type === "knowledge";

  const draftAsset = useMemo(
    () => ({
      ...asset,
      category: pubCategory,
      description: pubDesc,
      publishGame: pubGame,
    }),
    [asset, pubCategory, pubDesc, pubGame],
  );

  const checks = useMemo(() => buildPublishChecks(draftAsset), [draftAsset]);
  const allPass = checks.every((entry) => entry.pass);
  const descCheck = pubDesc.trim().length >= 20;
  const catCheck = isKnowledge
    ? KNOWLEDGE_CATEGORIES.includes(pubCategory)
    : Boolean(SKILL_CATEGORIES.find((item) => item.value === pubCategory));
  const gameCheck = GAME_OPTIONS.includes(pubGame);
  const canContinue = allPass && descCheck && catCheck && gameCheck;
  const failedChecks = checks.filter((entry) => !entry.pass);
  const previewCategory = isKnowledge
    ? pubCategory
    : SKILL_CATEGORIES.find((item) => item.value === pubCategory)?.label || pubCategory;
  const previewName = getPreviewName(asset?.name);
  const typeTag = getAssetTypeTagProps(asset?.type);

  const handleSubmit = () => {
    setSubmitted(true);
    message.success(`"${asset.name}" submitted for review`);

    window.setTimeout(() => {
      onPublish({ tags: pubTags, category: pubCategory, description: pubDesc, game: pubGame });
      onClose();
    }, 700);
  };

  return (
    <Modal open title="Publish" onCancel={onClose} footer={null} width={720} destroyOnHidden>
      <Space direction="vertical" size={20} style={{ display: "flex" }}>
        <Steps current={step} size="small" items={[{ title: "Details" }, { title: "Review" }]} />

        {step === 0 ? (
          <Space direction="vertical" size={16} style={{ display: "flex" }}>
            <Text type="secondary">Complete the listing details. Checks update as you edit.</Text>

            <div>
              <Text strong>Description</Text>
              <Input.TextArea
                value={pubDesc}
                onChange={(event) => setPubDesc(event.target.value)}
                autoSize={{ minRows: 3 }}
                placeholder={`Describe what this ${isKnowledge ? "knowledge pack" : "skill"} does and when teams should use it.`}
                status={descCheck ? "" : "error"}
                style={{ marginTop: 6 }}
              />
              <div style={{ marginTop: 4 }}>
                <Text type={descCheck ? "secondary" : "danger"}>{pubDesc.length}/20 min characters</Text>
              </div>
            </div>

            <div>
              <Text strong>Category</Text>
              <Select
                value={pubCategory}
                onChange={setPubCategory}
                style={{ width: "100%", marginTop: 6 }}
                status={catCheck ? undefined : "error"}
                options={
                  isKnowledge
                    ? KNOWLEDGE_CATEGORIES.map((item) => ({ value: item, label: item }))
                    : SKILL_CATEGORIES.map((item) => ({ value: item.value, label: item.label }))
                }
              />
            </div>

            <div>
              <Text strong>Game</Text>
              <Select
                value={pubGame}
                onChange={setPubGame}
                style={{ width: "100%", marginTop: 6 }}
                status={gameCheck ? undefined : "error"}
                options={GAME_OPTIONS.map((item) => ({ value: item, label: item }))}
              />
            </div>

            <div>
              <Text strong>Tags</Text>
              <Select
                mode="multiple"
                maxCount={5}
                value={pubTags}
                onChange={setPubTags}
                style={{ width: "100%", marginTop: 6 }}
                placeholder="Add up to 5 tags"
                options={PUBLISH_TAGS_OPTIONS.map((item) => ({ value: item, label: item }))}
              />
            </div>

            <Card size="small" title="Checks">
              <Space direction="vertical" size={8} style={{ display: "flex" }}>
                {checks.map((entry) => (
                  <Alert key={entry.key} type={entry.pass ? "success" : "error"} showIcon message={entry.label} />
                ))}
              </Space>
            </Card>

            {failedChecks.length ? <Alert type="warning" showIcon message="Complete the remaining checks before continuing." /> : null}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={() => setStep(1)} disabled={!canContinue}>
                Continue
              </Button>
            </div>
          </Space>
        ) : null}

        {step === 1 ? (
          submitted ? (
            <Result status="success" title="Submitted" subTitle="The asset is now waiting for review." />
          ) : (
            <Space direction="vertical" size={16} style={{ display: "flex" }}>
              <Card size="small">
                <Space direction="vertical" size={10} style={{ display: "flex" }}>
                  <div>
                    <Title level={5} style={{ marginBottom: 4 }}>
                      {previewName}
                    </Title>
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
                      {pubDesc}
                    </Paragraph>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Tag color={typeTag.color}>{typeTag.label}</Tag>
                    <Tag>{previewCategory}</Tag>
                    <Tag>{pubGame}</Tag>
                    {pubTags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </Space>
              </Card>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <Button onClick={() => setStep(0)}>Back</Button>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Space>
          )
        ) : null}
      </Space>
    </Modal>
  );
};

export default PublishSkillModal;
