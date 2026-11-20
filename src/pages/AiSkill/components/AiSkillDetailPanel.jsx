import { getItemSharedTags, getSkillCategoryLabel } from "../../../features/ai-assets/assetFilters";
import { formatDateLabel, getOriginLabel } from "../../../features/ai-assets/uiConstants";
import SkillDetailView from "./SkillDetailView";

const getDetailSourceKind = (sourceKind) => {
  if (sourceKind === "marketplace") return "marketplace";
  if (sourceKind === "approval") return "approval";
  return "local";
};

const AiSkillDetailPanel = ({ model }) => {
  const {
    approveSubmission,
    clearDetailView,
    copySkill,
    installedMpIds,
    installMarketplaceItem,
    knowledge,
    rejectSubmission,
    resolvedDetail,
    setEditingKnowledge,
    setEditingSkill,
    setPublishingAsset,
    skillCategories,
    skillTriggers,
    toggleKnowledge,
    toggleSkill,
    uninstallMarketplaceItem,
  } = model;

  if (!resolvedDetail?.item) return null;

  const item = resolvedDetail.item;

  return (
    <SkillDetailView
      item={item}
      originLabel={getOriginLabel(resolvedDetail.originTab)}
      sourceKind={getDetailSourceKind(resolvedDetail.sourceKind)}
      categoryLabel={item.type === "knowledge" ? item.category : getSkillCategoryLabel(skillCategories, item.category)}
      triggerLabel={item.type === "knowledge" ? null : skillTriggers.find((trigger) => trigger.value === item.trigger)?.label || item.trigger}
      updatedLabel={formatDateLabel(item.updatedAt)}
      sourceLabel={
        resolvedDetail.sourceKind === "approval"
          ? "Pending"
          : item.source === "marketplace" || resolvedDetail.sourceKind === "marketplace"
            ? "Marketplace"
            : "Personal"
      }
      linkedKnowledgeItems={
        resolvedDetail.sourceKind !== "marketplace"
          ? knowledge.filter((entry) => item.linkedKnowledge?.includes(entry.id))
          : []
      }
      isInstalled={
        resolvedDetail.sourceKind === "marketplace"
          ? installedMpIds.includes(item.id)
          : item.source === "marketplace"
      }
      onBack={clearDetailView}
      onEdit={() => {
        clearDetailView();
        if (item.type === "knowledge") setEditingKnowledge(item);
        else setEditingSkill(item);
      }}
      onToggle={() => {
        if (item.type === "knowledge") toggleKnowledge(item.id);
        else toggleSkill(item.id);
      }}
      onInstall={() => installMarketplaceItem(item)}
      onUninstall={() => uninstallMarketplaceItem(item)}
      onApprove={() => approveSubmission(item)}
      onReject={() => rejectSubmission(item)}
      onCopySkill={() => copySkill(item)}
      onPublish={() => setPublishingAsset(item)}
      gameLabels={getItemSharedTags(item).game}
    />
  );
};

export default AiSkillDetailPanel;
