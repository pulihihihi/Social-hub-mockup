import { SHARED_TAG_GROUPS, normalizeSharedTags } from "../../../data/aiSkill";
import { T } from "../../../theme";

const CORE_SHARED_TAG_KEYS = new Set(["team", "game"]);
const CORE_SHARED_TAG_GROUPS = SHARED_TAG_GROUPS.filter(({ key }) => CORE_SHARED_TAG_KEYS.has(key));

export const assetShellCardStyle = {
  borderColor: T.colorBorderSecondary,
  boxShadow: "none",
};

export const assetShellBodyStyle = {
  padding: 14,
};

export const assetRailButtonProps = {
  size: "large",
  style: {
    height: 44,
    fontWeight: T.fontWeightStrong,
  },
};

export const assetMetricPillStyle = {
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

export const assetCodeBlockStyle = {
  margin: 0,
  padding: 14,
  borderRadius: T.borderRadiusLG,
  background: T.colorFillQuaternary,
  border: `1px solid ${T.colorBorderSecondary}`,
  whiteSpace: "pre-wrap",
  fontSize: T.fontSizeSM,
  lineHeight: 1.6,
  fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
  color: T.colorTextBase,
  overflowX: "auto",
};

export const getAssetTypeTagProps = (type) => {
  if (type === "knowledge") {
    return {
      color: "gold",
      label: "Knowledge",
    };
  }

  return {
    color: "blue",
    label: "Skill",
  };
};

const indentMultiline = (value, fallback) =>
  (value || fallback)
    .split(/\r?\n/)
    .filter((line, index, lines) => line.trim() || lines.length === 1 || index !== lines.length - 1)
    .map((line) => `  ${line}`);

const parseKnowledgeContent = (value) =>
  String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [term = "", aliases = "", category = "", sentiment = "neutral"] = line.split("|").map((part) => part.trim());
      return { term, aliases, category, sentiment };
    })
    .filter((entry) => entry.term && (entry.aliases || entry.category || entry.sentiment !== "neutral"));

export const buildAssetMarkdown = ({ item, categoryLabel, linkedKnowledgeNames = [] }) => {
  const isKnowledge = item.type === "knowledge";
  const linkedLabel = linkedKnowledgeNames.length ? linkedKnowledgeNames.join(", ") : "None";
  const sharedTags = normalizeSharedTags(item.sharedTags, item.games);
  const gamesLabel = sharedTags.game.length ? sharedTags.game.join(", ") : "None";
  const sharedTagLines = CORE_SHARED_TAG_GROUPS.map(({ key, label }) => {
    const values = sharedTags[key];
    return `- ${label}: ${values.length ? values.join(", ") : "None"}`;
  });
  const parsedKnowledgeContent = parseKnowledgeContent(item.rawContent);
  const knowledgeContent = item.rawContent?.trim();

  const frontmatter = [
    "---",
    `name: ${item.name || (isKnowledge ? "untitled-knowledge" : "untitled-skill")}`,
    `type: ${isKnowledge ? "knowledge" : "skill"}`,
    `author: ${item.author || "Workspace"}`,
    `category: ${categoryLabel || item.category || "--"}`,
    `games: ${gamesLabel}`,
    `version: ${item.version || "1.0"}`,
    isKnowledge ? "format: knowledge-package" : "format: skill-package",
    "description: |",
    ...indentMultiline(
      item.description,
      isKnowledge ? "Structured knowledge package for AI context." : "Reusable instruction package for AI tasks.",
    ),
    "---",
    "",
  ];

  const body = isKnowledge
    ? [
        "## Coverage",
        item.description || "This knowledge package adds structured reference context to the workspace.",
        "",
        "## Snapshot",
        `- Category: ${categoryLabel || item.category || "--"}`,
        `- Games: ${gamesLabel}`,
        `- Linked skills: ${(item.linkedSkills || []).length}`,
        "",
        "## Shared Tags",
        ...sharedTagLines,
        "",
        "## Knowledge Content",
        ...(knowledgeContent
          ? parsedKnowledgeContent.length
            ? parsedKnowledgeContent.slice(0, 6).map((entry) => {
                const details = [entry.aliases, entry.category, entry.sentiment].filter(Boolean).join(" | ");
                return `- ${entry.term}${details ? ` - ${details}` : ""}`;
              })
            : knowledgeContent.split(/\r?\n/)
          : item.sampleEntries?.length
            ? item.sampleEntries.slice(0, 6).map((entry) => {
                const details = [entry.aliases, entry.category, entry.sentiment].filter(Boolean).join(" | ");
                return `- ${entry.term}${details ? ` - ${details}` : ""}`;
              })
            : ["Add knowledge content to preview this package."]),
      ]
    : [
        "## Scope",
        `- Category: ${categoryLabel || item.category || "--"}`,
        `- Games: ${gamesLabel}`,
        `- Linked knowledge: ${linkedLabel}`,
        "",
        "## Shared Tags",
        ...sharedTagLines,
        "",
        "## Instructions",
        item.instructions || "Add the instruction set for this skill.",
        "",
        "## Expected Output",
        "- Keep output concise, structured, and directly usable.",
        "- Surface key findings, risk signals, and recommendations when relevant.",
      ];

  return [...frontmatter, ...body].join("\n");
};
