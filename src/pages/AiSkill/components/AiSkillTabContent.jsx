import { Button, Pagination } from "antd";
import { BookIco, PlusIco, SearchIco } from "../../../components/icons";
import {
  APPROVAL_PAGE_SIZE,
  KNOWLEDGE_PAGE_SIZE,
  LOCAL_PAGE_SIZE,
  MP_PAGE_SIZE,
  getItemSharedTags,
  getSkillCategoryLabel,
} from "../../../features/ai-assets/assetFilters";
import { formatDateLabel } from "../../../features/ai-assets/uiConstants";
import EmptyState from "./AiSkillEmptyState";
import SkillCard from "./SkillCard";

const cardGridItemStyle = { minWidth: 0, display: "flex" };

const AiSkillPagination = ({ current, onChange, pageSize, total }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 0 }}>
    <Pagination current={current} total={total} pageSize={pageSize} onChange={onChange} showSizeChanger={false} />
  </div>
);

const SkillGrid = ({ model }) => {
  const {
    cardGridStyle,
    filteredSkills,
    handleTabChange,
    hasSkillFilters,
    openImportFlow,
    openLocalSkillDetail,
    openSkillMenuAction,
    pagedSkills,
    setShowCreateSkill,
    setSkillsPage,
    skillCategories,
    skillsPage,
    toggleSkill,
  } = model;

  if (filteredSkills.length === 0) {
    return (
      <EmptyState
        icon={<SearchIco s={40} />}
        title="No skills found"
        description={hasSkillFilters ? "Try a different search or category." : "Create a skill or install one from the marketplace."}
        action={
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <Button type="primary" onClick={() => setShowCreateSkill(true)}>
              <PlusIco s={12} /> Add Skill
            </Button>
            <Button onClick={() => openImportFlow("skill")}>Import Skill</Button>
            <Button onClick={() => handleTabChange("marketplace")}>Browse Marketplace</Button>
          </div>
        }
      />
    );
  }

  return (
    <>
      <div data-ai-skill-grid="skills" style={cardGridStyle}>
        {pagedSkills.map((item) => (
          <div key={item.id} style={cardGridItemStyle}>
            <SkillCard
              variant="local"
              item={item}
              categoryLabel={getSkillCategoryLabel(skillCategories, item.category)}
              gameLabels={getItemSharedTags(item).game}
              metaItems={[getSkillCategoryLabel(skillCategories, item.category), `${item.linkedKnowledge?.length || 0} linked knowledge`]}
              updatedLabel={formatDateLabel(item.updatedAt)}
              sourceLabel={item.source === "marketplace" ? "Marketplace" : "Personal"}
              isInstalled={item.source === "marketplace"}
              onOpen={openLocalSkillDetail}
              onToggleActive={(skill) => toggleSkill(skill.id)}
              onMoreAction={openSkillMenuAction}
            />
          </div>
        ))}
      </div>

      {filteredSkills.length > LOCAL_PAGE_SIZE ? (
        <AiSkillPagination current={skillsPage} total={filteredSkills.length} pageSize={LOCAL_PAGE_SIZE} onChange={setSkillsPage} />
      ) : null}
    </>
  );
};

const KnowledgeGrid = ({ model }) => {
  const {
    cardGridStyle,
    filteredKnowledge,
    handleTabChange,
    hasKnowledgeFilters,
    knowledgePage,
    openImportFlow,
    openKnowledgeDetail,
    openKnowledgeMenuAction,
    pagedKnowledge,
    setKnowledgePage,
    setMpTypeFilter,
    setShowCreateKnowledge,
    toggleKnowledge,
  } = model;

  if (filteredKnowledge.length === 0) {
    return (
      <EmptyState
        icon={<BookIco s={40} />}
        title="No knowledge found"
        description={hasKnowledgeFilters ? "Try a different search or category." : "Add domain knowledge or install a curated pack from the marketplace."}
        action={
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <Button type="primary" onClick={() => setShowCreateKnowledge(true)}>
              <PlusIco s={12} /> Add Knowledge
            </Button>
            <Button onClick={() => openImportFlow("knowledge")}>Import Knowledge</Button>
            <Button
              onClick={() => {
                handleTabChange("marketplace");
                setMpTypeFilter(["knowledge"]);
              }}
            >
              Browse Marketplace
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <>
      <div data-ai-skill-grid="knowledge" style={cardGridStyle}>
        {pagedKnowledge.map((item) => (
          <div key={item.id} style={cardGridItemStyle}>
            <SkillCard
              variant="local"
              item={{ ...item, type: "knowledge" }}
              categoryLabel={item.category}
              gameLabels={getItemSharedTags(item).game}
              metaItems={[item.category, `${item.linkedSkills?.length || 0} linked skills`]}
              updatedLabel={formatDateLabel(item.updatedAt)}
              sourceLabel={item.source === "marketplace" ? "Marketplace" : "Personal"}
              isInstalled={item.source === "marketplace"}
              onOpen={openKnowledgeDetail}
              onToggleActive={(entry) => toggleKnowledge(entry.id)}
              onMoreAction={openKnowledgeMenuAction}
            />
          </div>
        ))}
      </div>

      {filteredKnowledge.length > KNOWLEDGE_PAGE_SIZE ? (
        <AiSkillPagination current={knowledgePage} total={filteredKnowledge.length} pageSize={KNOWLEDGE_PAGE_SIZE} onChange={setKnowledgePage} />
      ) : null}
    </>
  );
};

const MarketplaceGrid = ({ model }) => {
  const {
    cardGridStyle,
    filteredMarketplace,
    hasMarketplaceFilters,
    installMarketplaceItem,
    installedMpIds,
    mpPage,
    openMarketplaceDetail,
    pagedMarketplace,
    setMpPage,
    skillCategories,
  } = model;

  if (filteredMarketplace.length === 0) {
    return (
      <EmptyState
        icon={<SearchIco s={40} />}
        title="No results found"
        description={hasMarketplaceFilters ? "Try a different search, type, or category." : "Adjust the sort or browse a broader set of marketplace assets."}
      />
    );
  }

  return (
    <>
      <div data-ai-skill-grid="marketplace" style={cardGridStyle}>
        {pagedMarketplace.map((item) => (
          <div key={item.id} style={cardGridItemStyle}>
            <SkillCard
              variant="marketplace"
              item={item}
              categoryLabel={item.type === "skill" ? getSkillCategoryLabel(skillCategories, item.category) : item.category}
              gameLabels={getItemSharedTags(item).game}
              metaItems={[item.type === "skill" ? getSkillCategoryLabel(skillCategories, item.category) : item.category]}
              updatedLabel={formatDateLabel(item.updatedAt)}
              sourceLabel="Marketplace"
              isInstalled={installedMpIds.includes(item.id)}
              onOpen={openMarketplaceDetail}
              onInstall={installMarketplaceItem}
            />
          </div>
        ))}
      </div>

      {filteredMarketplace.length > MP_PAGE_SIZE ? (
        <AiSkillPagination current={mpPage} total={filteredMarketplace.length} pageSize={MP_PAGE_SIZE} onChange={setMpPage} />
      ) : null}
    </>
  );
};

const ApprovalsGrid = ({ model }) => {
  const {
    approvalPage,
    cardGridStyle,
    filteredApprovals,
    hasApprovalFilters,
    openApprovalDetail,
    pagedApprovals,
    setApprovalPage,
    skillCategories,
  } = model;

  if (filteredApprovals.length === 0) {
    return (
      <EmptyState
        icon={<SearchIco s={40} />}
        title="No approvals pending"
        description={hasApprovalFilters ? "Try a different search, type, or category." : "Submitted skills and knowledge waiting for review will appear here."}
      />
    );
  }

  return (
    <>
      <div data-ai-skill-grid="approvals" style={cardGridStyle}>
        {pagedApprovals.map((item) => (
          <div key={item.id} style={cardGridItemStyle}>
            <SkillCard
              variant="approval"
              item={item}
              categoryLabel={item.type === "skill" ? getSkillCategoryLabel(skillCategories, item.category) : item.category}
              gameLabels={getItemSharedTags(item).game}
              metaItems={[item.type === "skill" ? getSkillCategoryLabel(skillCategories, item.category) : item.category]}
              updatedLabel={formatDateLabel(item.updatedAt)}
              sourceLabel="Pending"
              onOpen={openApprovalDetail}
            />
          </div>
        ))}
      </div>

      {filteredApprovals.length > APPROVAL_PAGE_SIZE ? (
        <AiSkillPagination current={approvalPage} total={filteredApprovals.length} pageSize={APPROVAL_PAGE_SIZE} onChange={setApprovalPage} />
      ) : null}
    </>
  );
};

const AiSkillTabContent = ({ model }) => {
  if (model.activeTab === "skills") return <SkillGrid model={model} />;
  if (model.activeTab === "knowledge") return <KnowledgeGrid model={model} />;
  if (model.activeTab === "marketplace") return <MarketplaceGrid model={model} />;
  return <ApprovalsGrid model={model} />;
};

export default AiSkillTabContent;
