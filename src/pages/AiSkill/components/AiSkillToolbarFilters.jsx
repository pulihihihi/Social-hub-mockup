import { Button, Input, Select } from "antd";
import { SearchIco } from "../../../components/icons";
import {
  AppToolbarFilter,
  AppToolbarFilters,
  AppToolbarSearch,
  AppToolbarUtility,
} from "../../../app/layout/AppToolbarFilters";

const TYPE_FILTER_OPTIONS = [
  { value: "skill", label: "Skills" },
  { value: "knowledge", label: "Knowledge" },
];

const MARKETPLACE_SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

const APPROVAL_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const SearchPlaceholderByTab = {
  marketplace: "Search marketplace",
  approvals: "Search approvals",
  knowledge: "Search knowledge",
  skills: "Search skills",
};

export const AiSkillToolbarFilters = ({
  activeTab,
  approvalCategoryFilter,
  approvalGameFilter,
  approvalSortBy,
  approvalTypeFilter,
  clearCurrentFilters,
  gameFilterOptions,
  hasActiveFilters,
  knowledgeCategoryFilter,
  knowledgeCategoryOptions,
  knowledgeGameFilter,
  marketplaceCategoryFilter,
  marketplaceCategoryOptions,
  marketplaceGameFilter,
  mpSortBy,
  mpTypeFilter,
  searchQ,
  setApprovalCategoryFilter,
  setApprovalGameFilter,
  setApprovalPage,
  setApprovalSortBy,
  setApprovalTypeFilter,
  setKnowledgeCategoryFilter,
  setKnowledgeGameFilter,
  setKnowledgePage,
  setMarketplaceCategoryFilter,
  setMarketplaceGameFilter,
  setMpPage,
  setMpSortBy,
  setMpTypeFilter,
  setSearchByTab,
  setSkillCategoryFilter,
  setSkillGameFilter,
  setSkillsPage,
  skillCategoryFilter,
  skillCategoryOptions,
  skillGameFilter,
}) => (
  <AppToolbarFilters>
    <AppToolbarSearch>
      <Input
        allowClear
        value={searchQ}
        onChange={(event) => {
          const nextValue = event.target.value;
          setSearchByTab((prev) => ({ ...prev, [activeTab]: nextValue }));
          if (activeTab === "skills") setSkillsPage(1);
          if (activeTab === "knowledge") setKnowledgePage(1);
          if (activeTab === "marketplace") setMpPage(1);
          if (activeTab === "approvals") setApprovalPage(1);
        }}
        placeholder={SearchPlaceholderByTab[activeTab] || SearchPlaceholderByTab.skills}
        prefix={<SearchIco s={12} />}
      />
    </AppToolbarSearch>

    {activeTab === "skills" ? (
      <>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Category"
            value={skillCategoryFilter}
            onChange={(value) => {
              setSkillCategoryFilter(value);
              setSkillsPage(1);
            }}
            style={{ width: "100%" }}
            options={skillCategoryOptions}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Game"
            value={skillGameFilter}
            onChange={(value) => {
              setSkillGameFilter(value);
              setSkillsPage(1);
            }}
            style={{ width: "100%" }}
            options={gameFilterOptions}
          />
        </AppToolbarFilter>
      </>
    ) : null}

    {activeTab === "knowledge" ? (
      <>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Category"
            value={knowledgeCategoryFilter}
            onChange={(value) => {
              setKnowledgeCategoryFilter(value);
              setKnowledgePage(1);
            }}
            style={{ width: "100%" }}
            options={knowledgeCategoryOptions}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Game"
            value={knowledgeGameFilter}
            onChange={(value) => {
              setKnowledgeGameFilter(value);
              setKnowledgePage(1);
            }}
            style={{ width: "100%" }}
            options={gameFilterOptions}
          />
        </AppToolbarFilter>
      </>
    ) : null}

    {activeTab === "marketplace" ? (
      <>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Category"
            value={marketplaceCategoryFilter}
            onChange={(value) => {
              setMarketplaceCategoryFilter(value);
              setMpPage(1);
            }}
            style={{ width: "100%" }}
            options={marketplaceCategoryOptions}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Game"
            value={marketplaceGameFilter}
            onChange={(value) => {
              setMarketplaceGameFilter(value);
              setMpPage(1);
            }}
            style={{ width: "100%" }}
            options={gameFilterOptions}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Type"
            value={mpTypeFilter}
            onChange={(value) => {
              setMpTypeFilter(value);
              setMpPage(1);
            }}
            style={{ width: "100%" }}
            options={TYPE_FILTER_OPTIONS}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            allowClear
            placeholder="Sort by"
            value={mpSortBy}
            onChange={(value) => {
              setMpSortBy(value);
              setMpPage(1);
            }}
            style={{ width: "100%" }}
            options={MARKETPLACE_SORT_OPTIONS}
          />
        </AppToolbarFilter>
      </>
    ) : null}

    {activeTab === "approvals" ? (
      <>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Category"
            value={approvalCategoryFilter}
            onChange={(value) => {
              setApprovalCategoryFilter(value);
              setApprovalPage(1);
            }}
            style={{ width: "100%" }}
            options={marketplaceCategoryOptions}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Game"
            value={approvalGameFilter}
            onChange={(value) => {
              setApprovalGameFilter(value);
              setApprovalPage(1);
            }}
            style={{ width: "100%" }}
            options={gameFilterOptions}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Type"
            value={approvalTypeFilter}
            onChange={(value) => {
              setApprovalTypeFilter(value);
              setApprovalPage(1);
            }}
            style={{ width: "100%" }}
            options={TYPE_FILTER_OPTIONS}
          />
        </AppToolbarFilter>
        <AppToolbarFilter>
          <Select
            allowClear
            placeholder="Sort by"
            value={approvalSortBy}
            onChange={(value) => {
              setApprovalSortBy(value);
              setApprovalPage(1);
            }}
            style={{ width: "100%" }}
            options={APPROVAL_SORT_OPTIONS}
          />
        </AppToolbarFilter>
      </>
    ) : null}

    {hasActiveFilters ? (
      <AppToolbarUtility>
        <Button onClick={clearCurrentFilters}>
          Clear all
        </Button>
      </AppToolbarUtility>
    ) : null}
  </AppToolbarFilters>
);

export default AiSkillToolbarFilters;
