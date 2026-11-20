import { Dropdown, Tabs } from "antd";
import { AppToolbarCard } from "../../../app/layout/AppCards";
import { AppPageControls } from "../../../app/layout/AppPageControls";
import { usePageSecondaryTopBar } from "../../../app/layout/usePageSecondaryTopBar";
import { PlusIco } from "../../../components/icons";
import { T } from "../../../theme";
import { countBadgeStyle, tabLabelStyle } from "../../../features/ai-assets/uiConstants";
import AiSkillToolbarFilters from "./AiSkillToolbarFilters";

const AiSkillPageAction = ({ model, hasEditorOrDetail }) => {
  if (
    hasEditorOrDetail ||
    model.activeTab === "marketplace" ||
    model.activeTab === "approvals"
  ) {
    return null;
  }

  if (model.activeTab === "skills") {
    return (
      <Dropdown.Button
        type="primary"
        onClick={() => model.setShowCreateSkill(true)}
        menu={{
          items: [
            { key: "create-skill", label: "Create manually" },
            { key: "import-skill", label: "Import" },
          ],
          onClick: ({ key }) => {
            if (key === "create-skill") model.setShowCreateSkill(true);
            if (key === "import-skill") model.openImportFlow("skill");
          },
        }}
      >
        <PlusIco s={12} /> Add Skill
      </Dropdown.Button>
    );
  }

  return (
    <Dropdown.Button
      type="primary"
      onClick={() => model.setShowCreateKnowledge(true)}
      menu={{
        items: [
          { key: "create-knowledge", label: "Create manually" },
          { key: "import-knowledge", label: "Import" },
        ],
        onClick: ({ key }) => {
          if (key === "create-knowledge") model.setShowCreateKnowledge(true);
          if (key === "import-knowledge") model.openImportFlow("knowledge");
        },
      }}
    >
      <PlusIco s={12} /> Add Knowledge
    </Dropdown.Button>
  );
};

const AiSkillFilters = ({ model }) => (
  <AiSkillToolbarFilters
    activeTab={model.activeTab}
    approvalCategoryFilter={model.approvalCategoryFilter}
    approvalGameFilter={model.approvalGameFilter}
    approvalSortBy={model.approvalSortBy}
    approvalTypeFilter={model.approvalTypeFilter}
    clearCurrentFilters={model.clearCurrentFilters}
    gameFilterOptions={model.gameFilterOptions}
    hasActiveFilters={model.hasActiveFilters}
    knowledgeCategoryFilter={model.knowledgeCategoryFilter}
    knowledgeCategoryOptions={model.knowledgeCategoryOptions}
    knowledgeGameFilter={model.knowledgeGameFilter}
    marketplaceCategoryFilter={model.marketplaceCategoryFilter}
    marketplaceCategoryOptions={model.marketplaceCategoryOptions}
    marketplaceGameFilter={model.marketplaceGameFilter}
    mpSortBy={model.mpSortBy}
    mpTypeFilter={model.mpTypeFilter}
    searchQ={model.searchQ}
    setApprovalCategoryFilter={model.setApprovalCategoryFilter}
    setApprovalGameFilter={model.setApprovalGameFilter}
    setApprovalPage={model.setApprovalPage}
    setApprovalSortBy={model.setApprovalSortBy}
    setApprovalTypeFilter={model.setApprovalTypeFilter}
    setKnowledgeCategoryFilter={model.setKnowledgeCategoryFilter}
    setKnowledgeGameFilter={model.setKnowledgeGameFilter}
    setKnowledgePage={model.setKnowledgePage}
    setMarketplaceCategoryFilter={model.setMarketplaceCategoryFilter}
    setMarketplaceGameFilter={model.setMarketplaceGameFilter}
    setMpPage={model.setMpPage}
    setMpSortBy={model.setMpSortBy}
    setMpTypeFilter={model.setMpTypeFilter}
    setSearchByTab={model.setSearchByTab}
    setSkillCategoryFilter={model.setSkillCategoryFilter}
    setSkillGameFilter={model.setSkillGameFilter}
    setSkillsPage={model.setSkillsPage}
    skillCategoryFilter={model.skillCategoryFilter}
    skillCategoryOptions={model.skillCategoryOptions}
    skillGameFilter={model.skillGameFilter}
  />
);

export const AiSkillTabsControls = ({ hasEditorOrDetail, model }) => {
  if (hasEditorOrDetail) return null;

  return (
    <AppPageControls
      layout="tabs-first"
      tabs={
        <Tabs
          activeKey={model.activeTab}
          onChange={model.handleTabChange}
          tabBarStyle={{ marginBottom: T.paddingXS }}
          items={model.tabItems.map((tab) => ({
            key: tab.key,
            label: (
              <span style={tabLabelStyle}>
                <span>{tab.label}</span>
                <span style={countBadgeStyle}>{tab.count}</span>
              </span>
            ),
          }))}
          style={{ marginBottom: 0 }}
        />
      }
      marginBottom={0}
    />
  );
};

export const AiSkillSecondaryToolbar = ({ hasEditorOrDetail, model }) =>
  usePageSecondaryTopBar(
    !hasEditorOrDetail ? (
      <AppToolbarCard>
        <AppPageControls
          layout="toolbar-only"
          filters={<AiSkillFilters model={model} />}
          primaryAction={<AiSkillPageAction model={model} hasEditorOrDetail={hasEditorOrDetail} />}
          marginBottom={0}
        />
      </AppToolbarCard>
    ) : null,
  );
