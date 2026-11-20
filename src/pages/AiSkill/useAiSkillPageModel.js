import { useEffect, useMemo, useState } from "react";
import { Modal, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { getAiAssetTaxonomy } from "../../features/ai-assets/aiAssetDataSource";
import { installMarketplaceAsset, uninstallMarketplaceAsset } from "../../features/ai-assets/assetInstallers";
import { useRequiredAiAssetStore } from "../../features/ai-assets/aiAssetStoreHooks";
import { buildAiSkillRoute, parseAiSkillRoute } from "../../features/ai-assist/aiSkillRoutes";
import {
  APPROVAL_PAGE_SIZE,
  KNOWLEDGE_PAGE_SIZE,
  LOCAL_PAGE_SIZE,
  MP_PAGE_SIZE,
  getCardColumns,
  getItemSharedTags,
  getSkillCategoryLabel,
  hasSelectedValues,
  matchesArrayValues,
  matchesItemSearch,
  matchesSelectedValues,
  normalizeAssetTags,
} from "../../features/ai-assets/assetFilters";
import { GAME_OPTIONS } from "../../features/ai-assets/taxonomy";
import {
  buildAssetDownload,
  createApprovedMarketplaceAsset,
  createLocalAssetCopyDraft,
  createMarketplaceSkillCopyDraft,
  syncSkillKnowledgeLinks,
} from "./aiSkillPageActions";

const cardGridGap = 8;

const downloadMarkdown = ({ fileName, markdownValue }) => {
  const blob = new Blob([markdownValue], { type: "text/markdown;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
};

export const useAiSkillPageModel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    approvalItems,
    installedMpIds,
    knowledge,
    marketplaceItems,
    setApprovalItems,
    setKnowledge,
    setMarketplaceItems,
    setSkills,
    skillCategories,
    skillTriggers,
    skills,
    toggleKnowledge: toggleKnowledgeInStore,
    toggleSkill: toggleSkillInStore,
  } = useRequiredAiAssetStore();
  const [taxonomy] = useState(getAiAssetTaxonomy);
  const [activeTab, setActiveTab] = useState("skills");
  const [skillsPage, setSkillsPage] = useState(1);
  const [knowledgePage, setKnowledgePage] = useState(1);
  const [mpPage, setMpPage] = useState(1);
  const [approvalPage, setApprovalPage] = useState(1);
  const [showCreateSkill, setShowCreateSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showCreateKnowledge, setShowCreateKnowledge] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const [searchByTab, setSearchByTab] = useState({
    skills: "",
    knowledge: "",
    marketplace: "",
    approvals: "",
  });
  const [skillCategoryFilter, setSkillCategoryFilter] = useState([]);
  const [skillGameFilter, setSkillGameFilter] = useState([]);
  const [knowledgeCategoryFilter, setKnowledgeCategoryFilter] = useState([]);
  const [knowledgeGameFilter, setKnowledgeGameFilter] = useState([]);
  const [marketplaceCategoryFilter, setMarketplaceCategoryFilter] = useState([]);
  const [marketplaceGameFilter, setMarketplaceGameFilter] = useState([]);
  const [approvalCategoryFilter, setApprovalCategoryFilter] = useState([]);
  const [approvalGameFilter, setApprovalGameFilter] = useState([]);
  const [mpTypeFilter, setMpTypeFilter] = useState([]);
  const [approvalTypeFilter, setApprovalTypeFilter] = useState([]);
  const [mpSortBy, setMpSortBy] = useState();
  const [approvalSortBy, setApprovalSortBy] = useState();
  const [showImportFlow, setShowImportFlow] = useState(false);
  const [importTargetType, setImportTargetType] = useState("skill");
  const [publishingAsset, setPublishingAsset] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 1920 : window.innerWidth));

  const allMarketplaceItems = useMemo(() => marketplaceItems, [marketplaceItems]);
  const allApprovalItems = useMemo(() => approvalItems, [approvalItems]);
  const requestedRoute = useMemo(
    () => parseAiSkillRoute(location.search),
    [location.search],
  );
  const { knowledgeCategories } = taxonomy;
  const skillsSearchQ = searchByTab.skills;
  const knowledgeSearchQ = searchByTab.knowledge;
  const marketplaceSearchQ = searchByTab.marketplace;
  const approvalsSearchQ = searchByTab.approvals;
  const searchQ = searchByTab[activeTab];
  const resolvedMarketplaceSort = mpSortBy || "popular";
  const resolvedApprovalSort = approvalSortBy || "newest";

  const gameFilterOptions = useMemo(
    () => GAME_OPTIONS.map((item) => ({ value: item, label: item })),
    [],
  );
  const cardColumns = useMemo(() => getCardColumns(viewportWidth), [viewportWidth]);
  const cardGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${cardColumns}, minmax(0, 1fr))`,
      gap: cardGridGap,
      alignItems: "stretch",
    }),
    [cardColumns],
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!requestedRoute?.tab || requestedRoute.tab === activeTab) {
      return;
    }

    setActiveTab(requestedRoute.tab);
  }, [activeTab, requestedRoute?.tab]);

  useEffect(() => {
    if (!requestedRoute?.detailId || !requestedRoute.detailType) {
      return;
    }

    const nextDetailView = {
      sourceKind: requestedRoute.sourceKind || "local",
      itemId: requestedRoute.detailId,
      itemType: requestedRoute.detailType,
      originTab: requestedRoute.originTab || requestedRoute.tab || activeTab,
    };

    setDetailView((current) => {
      if (
        current?.sourceKind === nextDetailView.sourceKind
        && current?.itemId === nextDetailView.itemId
        && current?.itemType === nextDetailView.itemType
        && current?.originTab === nextDetailView.originTab
      ) {
        return current;
      }

      return nextDetailView;
    });
  }, [
    activeTab,
    requestedRoute?.detailId,
    requestedRoute?.detailType,
    requestedRoute?.originTab,
    requestedRoute?.sourceKind,
    requestedRoute?.tab,
  ]);

  const filteredSkills = useMemo(() => {
    let result = skills;
    result = result.filter((item) => matchesSelectedValues(item.category, skillCategoryFilter));
    result = result.filter((item) => matchesArrayValues(getItemSharedTags(item).game, skillGameFilter));
    if (skillsSearchQ) {
      result = result.filter((item) => matchesItemSearch(item, skillsSearchQ));
    }
    return result;
  }, [skillCategoryFilter, skillGameFilter, skills, skillsSearchQ]);

  const filteredKnowledge = useMemo(() => {
    let result = knowledge;
    result = result.filter((item) => matchesSelectedValues(item.category, knowledgeCategoryFilter));
    result = result.filter((item) => matchesArrayValues(getItemSharedTags(item).game, knowledgeGameFilter));
    if (knowledgeSearchQ) {
      result = result.filter((item) => matchesItemSearch(item, knowledgeSearchQ));
    }
    return result;
  }, [knowledge, knowledgeCategoryFilter, knowledgeGameFilter, knowledgeSearchQ]);

  const filteredMarketplace = useMemo(() => {
    let result = allMarketplaceItems;
    result = result.filter((item) => matchesSelectedValues(item.type, mpTypeFilter));
    result = result.filter((item) => matchesArrayValues(getItemSharedTags(item).game, marketplaceGameFilter));
    result = result.filter((item) => {
      const categoryValue = item.type === "skill" ? getSkillCategoryLabel(skillCategories, item.category) : item.category;
      return matchesSelectedValues(categoryValue, marketplaceCategoryFilter);
    });
    if (marketplaceSearchQ) {
      result = result.filter((item) => matchesItemSearch(item, marketplaceSearchQ));
    }

    if (resolvedMarketplaceSort === "popular") result = [...result].sort((a, b) => (b.installs || 0) - (a.installs || 0));
    if (resolvedMarketplaceSort === "rating") result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (resolvedMarketplaceSort === "newest") result = [...result].sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

    return result;
  }, [
    allMarketplaceItems,
    marketplaceCategoryFilter,
    marketplaceGameFilter,
    mpTypeFilter,
    resolvedMarketplaceSort,
    marketplaceSearchQ,
    skillCategories,
  ]);

  const filteredApprovals = useMemo(() => {
    let result = allApprovalItems;
    result = result.filter((item) => matchesSelectedValues(item.type, approvalTypeFilter));
    result = result.filter((item) => matchesArrayValues(getItemSharedTags(item).game, approvalGameFilter));
    result = result.filter((item) => {
      const categoryValue = item.type === "skill" ? getSkillCategoryLabel(skillCategories, item.category) : item.category;
      return matchesSelectedValues(categoryValue, approvalCategoryFilter);
    });
    if (approvalsSearchQ) {
      result = result.filter((item) => matchesItemSearch(item, approvalsSearchQ));
    }

    if (resolvedApprovalSort === "newest") result = [...result].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    if (resolvedApprovalSort === "oldest") result = [...result].sort((a, b) => (a.updatedAt || "").localeCompare(b.updatedAt || ""));

    return result;
  }, [
    allApprovalItems,
    approvalCategoryFilter,
    approvalGameFilter,
    approvalTypeFilter,
    resolvedApprovalSort,
    approvalsSearchQ,
    skillCategories,
  ]);

  const pagedSkills = useMemo(
    () => filteredSkills.slice((skillsPage - 1) * LOCAL_PAGE_SIZE, skillsPage * LOCAL_PAGE_SIZE),
    [filteredSkills, skillsPage],
  );
  const pagedKnowledge = useMemo(
    () => filteredKnowledge.slice((knowledgePage - 1) * KNOWLEDGE_PAGE_SIZE, knowledgePage * KNOWLEDGE_PAGE_SIZE),
    [filteredKnowledge, knowledgePage],
  );
  const pagedMarketplace = useMemo(
    () => filteredMarketplace.slice((mpPage - 1) * MP_PAGE_SIZE, mpPage * MP_PAGE_SIZE),
    [filteredMarketplace, mpPage],
  );
  const pagedApprovals = useMemo(
    () => filteredApprovals.slice((approvalPage - 1) * APPROVAL_PAGE_SIZE, approvalPage * APPROVAL_PAGE_SIZE),
    [approvalPage, filteredApprovals],
  );

  const resolvedDetail = useMemo(() => {
    if (!detailView) return null;

    if (detailView.sourceKind === "local") {
      if (detailView.itemType === "knowledge") {
        const knowledgeItem = knowledge.find((item) => item.id === detailView.itemId);
        return knowledgeItem ? { ...detailView, item: { ...knowledgeItem, type: "knowledge" } } : null;
      }
      const skill = skills.find((item) => item.id === detailView.itemId);
      return skill ? { ...detailView, item: skill } : null;
    }

    if (detailView.sourceKind === "approval") {
      const approvalItem = allApprovalItems.find((item) => item.id === detailView.itemId);
      return approvalItem ? { ...detailView, item: approvalItem } : null;
    }

    const marketplaceItem = allMarketplaceItems.find((item) => item.id === detailView.itemId);
    return marketplaceItem ? { ...detailView, item: marketplaceItem } : null;
  }, [allApprovalItems, allMarketplaceItems, detailView, knowledge, skills]);

  const skillCategoryOptions = useMemo(
    () => skillCategories.map((item) => ({ value: item.value, label: item.label })),
    [skillCategories],
  );
  const knowledgeCategoryOptions = useMemo(
    () => knowledgeCategories.map((item) => ({ value: item, label: item })),
    [knowledgeCategories],
  );
  const marketplaceCategoryOptions = useMemo(() => {
    const values = [...skillCategories.map((item) => item.label), ...knowledgeCategories];
    return Array.from(new Set(values)).map((item) => ({ value: item, label: item }));
  }, [knowledgeCategories, skillCategories]);

  const hasSkillFilters = Boolean(skillsSearchQ) || hasSelectedValues(skillCategoryFilter) || hasSelectedValues(skillGameFilter);
  const hasKnowledgeFilters =
    Boolean(knowledgeSearchQ) || hasSelectedValues(knowledgeCategoryFilter) || hasSelectedValues(knowledgeGameFilter);
  const hasMarketplaceFilters =
    Boolean(marketplaceSearchQ) ||
    hasSelectedValues(marketplaceCategoryFilter) ||
    hasSelectedValues(marketplaceGameFilter) ||
    hasSelectedValues(mpTypeFilter) ||
    Boolean(mpSortBy);
  const hasApprovalFilters =
    Boolean(approvalsSearchQ) ||
    hasSelectedValues(approvalCategoryFilter) ||
    hasSelectedValues(approvalGameFilter) ||
    hasSelectedValues(approvalTypeFilter) ||
    Boolean(approvalSortBy);
  const hasActiveFilters =
    activeTab === "skills"
      ? hasSkillFilters
      : activeTab === "knowledge"
        ? hasKnowledgeFilters
        : activeTab === "marketplace"
          ? hasMarketplaceFilters
          : hasApprovalFilters;

  const tabItems = useMemo(
    () => [
      { key: "skills", label: "My Skills", count: skills.length },
      { key: "knowledge", label: "My Knowledge", count: knowledge.length },
      { key: "marketplace", label: "Marketplace", count: allMarketplaceItems.length },
      { key: "approvals", label: "Approvals", count: allApprovalItems.length },
    ],
    [allApprovalItems.length, allMarketplaceItems.length, knowledge.length, skills.length],
  );

  const clearCurrentFilters = () => {
    setSearchByTab((prev) => ({ ...prev, [activeTab]: "" }));
    if (activeTab === "skills") {
      setSkillCategoryFilter([]);
      setSkillGameFilter([]);
      setSkillsPage(1);
      return;
    }
    if (activeTab === "knowledge") {
      setKnowledgeCategoryFilter([]);
      setKnowledgeGameFilter([]);
      setKnowledgePage(1);
      return;
    }
    if (activeTab === "approvals") {
      setApprovalCategoryFilter([]);
      setApprovalGameFilter([]);
      setApprovalTypeFilter([]);
      setApprovalSortBy(undefined);
      setApprovalPage(1);
      return;
    }
    setMarketplaceCategoryFilter([]);
    setMarketplaceGameFilter([]);
    setMpTypeFilter([]);
    setMpSortBy(undefined);
    setMpPage(1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (detailView) {
      setDetailView(null);
    }
    if (requestedRoute?.tab || requestedRoute?.detailId) {
      navigate(buildAiSkillRoute({ tab: key }), { replace: true });
    }
  };

  const openLocalSkillDetail = (skill) => {
    setDetailView({ sourceKind: "local", itemId: skill.id, itemType: "skill", originTab: activeTab });
  };

  const openKnowledgeDetail = (item) => {
    setDetailView({ sourceKind: "local", itemId: item.id, itemType: "knowledge", originTab: activeTab });
  };

  const openMarketplaceDetail = (item) => {
    setDetailView({ sourceKind: "marketplace", itemId: item.id, originTab: activeTab });
  };

  const openApprovalDetail = (item) => {
    setDetailView({ sourceKind: "approval", itemId: item.id, originTab: activeTab });
  };

  const openImportFlow = (targetType) => {
    setImportTargetType(targetType);
    setShowImportFlow(true);
  };

  const toggleSkill = (id) => {
    const target = skills.find((item) => item.id === id);
    if (!target) return;
    toggleSkillInStore(id);
    message.success(target.enabled ? `"${target.name}" disabled` : `"${target.name}" enabled`);
  };

  const toggleKnowledge = (id) => {
    const target = knowledge.find((item) => item.id === id);
    if (!target) return;
    toggleKnowledgeInStore(id);
    message.success(target.enabled ? `"${target.name}" disabled` : `"${target.name}" enabled`);
  };

  const deleteSkill = (id) => {
    const target = skills.find((item) => item.id === id);
    if (!target) return;

    setSkills((prev) => prev.filter((item) => item.id !== id));
    if (detailView?.sourceKind === "local" && detailView.itemId === id) setDetailView(null);
    if (editingSkill?.id === id) setEditingSkill(null);
    message.warning(`"${target.name}" deleted`);
  };

  const confirmDeleteSkill = (skill) => {
    Modal.confirm({
      title: `Delete "${skill.name}"?`,
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => deleteSkill(skill.id),
    });
  };

  const duplicateSkill = (skill) => {
    setEditingSkill(createLocalAssetCopyDraft({ item: skill }));
    setShowCreateSkill(false);
    message.info(`Review the copy of "${skill.name}" before saving`);
  };

  const deleteKnowledge = (id) => {
    const target = knowledge.find((item) => item.id === id);
    if (!target) return;

    setKnowledge((prev) => prev.filter((item) => item.id !== id));
    if (detailView?.sourceKind === "local" && detailView.itemId === id) setDetailView(null);
    if (editingKnowledge?.id === id) setEditingKnowledge(null);
    message.warning(`"${target.name}" deleted`);
  };

  const confirmDeleteKnowledge = (item) => {
    Modal.confirm({
      title: `Delete "${item.name}"?`,
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => deleteKnowledge(item.id),
    });
  };

  const duplicateKnowledge = (entry) => {
    setEditingKnowledge(createLocalAssetCopyDraft({ item: entry, type: "knowledge" }));
    setShowCreateKnowledge(false);
    message.info(`Review the copy of "${entry.name}" before saving`);
  };

  const downloadAsset = (item) => {
    downloadMarkdown(buildAssetDownload({ item, skillCategories, skillTriggers, knowledge }));
    message.success(`"${item.name}" downloaded`);
  };

  const installMarketplaceItem = (item) => {
    const nextState = installMarketplaceAsset({ item, installedIds: installedMpIds, skills, knowledge });
    setSkills(nextState.skills);
    setKnowledge(nextState.knowledge);
    message.success(`"${item.name}" installed`);
  };

  const uninstallMarketplaceItem = (item) => {
    const nextState = uninstallMarketplaceAsset({ item, installedIds: installedMpIds, skills, knowledge });
    setSkills(nextState.skills);
    setKnowledge(nextState.knowledge);
    message.warning(`"${item.name}" uninstalled`);
  };

  const approveSubmission = (item) => {
    const approvedItem = createApprovedMarketplaceAsset({ item });

    setApprovalItems((prev) => prev.filter((entry) => entry.id !== item.id));
    setMarketplaceItems((prev) => [approvedItem, ...prev]);
    if (detailView?.sourceKind === "approval" && detailView.itemId === item.id) setDetailView(null);
    message.success(`"${item.name}" approved and published to Marketplace`);
  };

  const rejectSubmission = (item) => {
    setApprovalItems((prev) => prev.filter((entry) => entry.id !== item.id));
    if (detailView?.sourceKind === "approval" && detailView.itemId === item.id) setDetailView(null);
    message.warning(`"${item.name}" rejected`);
  };

  const copySkill = (item) => {
    setEditingSkill(createMarketplaceSkillCopyDraft({ item, skillCategories }));
    message.info(`Editing copy of "${item.name}"`);
  };

  const handleSkillEditorSave = (newSkill, isEdit, previousLinkedKnowledge) => {
    const normalizedSkill = normalizeAssetTags({
      ...newSkill,
      enabled: typeof newSkill.enabled === "boolean" ? newSkill.enabled : false,
      linkedKnowledge: newSkill.linkedKnowledge || [],
      linkedTopics: newSkill.linkedTopics || [],
      source: newSkill.source || "local",
    });

    if (isEdit) {
      setSkills((prev) => prev.map((item) => (item.id === normalizedSkill.id ? normalizedSkill : item)));
      message.success(`"${normalizedSkill.name}" updated`);
    } else {
      setSkills((prev) => [normalizedSkill, ...prev]);
      message.success(`"${normalizedSkill.name}" created`);
    }

    setKnowledge((prev) =>
      syncSkillKnowledgeLinks({
        knowledge: prev,
        skillId: normalizedSkill.id,
        nextLinkedKnowledge: normalizedSkill.linkedKnowledge,
        previousLinkedKnowledge,
      }),
    );
    setShowCreateSkill(false);
    setEditingSkill(null);
  };

  const handleKnowledgeEditorSave = (newKnowledge) => {
    const isEdit = Boolean(editingKnowledge?.id);
    const normalizedKnowledge = normalizeAssetTags({
      ...newKnowledge,
      type: "knowledge",
      enabled: typeof newKnowledge.enabled === "boolean" ? newKnowledge.enabled : false,
      source: newKnowledge.source || "local",
    });

    if (isEdit) {
      setKnowledge((prev) => prev.map((item) => (item.id === normalizedKnowledge.id ? normalizedKnowledge : item)));
      message.success(`"${normalizedKnowledge.name}" updated`);
    } else {
      setKnowledge((prev) => [normalizedKnowledge, ...prev]);
      message.success(`"${normalizedKnowledge.name}" created`);
    }

    setShowCreateKnowledge(false);
    setEditingKnowledge(null);
  };

  const handleImportFlowSave = (newSkill) => {
    const normalizedAsset = normalizeAssetTags(newSkill);

    if (normalizedAsset.type === "knowledge") {
      setKnowledge((prev) => [{ ...normalizedAsset, type: "knowledge" }, ...prev]);
    } else {
      setSkills((prev) => [normalizedAsset, ...prev]);
    }
    message.success(`"${normalizedAsset.name}" imported`);
    setShowImportFlow(false);
  };

  const handleImportFlowEdit = (assetWithTemplate) => {
    const normalizedAsset = normalizeAssetTags(assetWithTemplate);
    if (normalizedAsset.type === "knowledge") setEditingKnowledge(normalizedAsset);
    else setEditingSkill(normalizedAsset);
    setShowImportFlow(false);
  };

  const handlePublishAsset = () => {
    message.success(`"${publishingAsset.name}" submitted for review`);
    setPublishingAsset(null);
  };

  const openSkillMenuAction = (action, skill) => {
    if (action === "edit") setEditingSkill(skill);
    if (action === "duplicate") duplicateSkill(skill);
    if (action === "download") downloadAsset(skill);
    if (action === "toggle") toggleSkill(skill.id);
    if (action === "publish") setPublishingAsset(skill);
    if (action === "delete") confirmDeleteSkill(skill);
  };

  const openKnowledgeMenuAction = (action, entry) => {
    if (action === "edit") setEditingKnowledge(entry);
    if (action === "duplicate") duplicateKnowledge(entry);
    if (action === "download") downloadAsset({ ...entry, type: "knowledge" });
    if (action === "toggle") toggleKnowledge(entry.id);
    if (action === "publish") setPublishingAsset({ ...entry, type: "knowledge" });
    if (action === "delete") confirmDeleteKnowledge(entry);
  };

  const clearDetailView = () => {
    setDetailView(null);

    if (requestedRoute?.detailId) {
      navigate(buildAiSkillRoute({
        tab: resolvedDetail?.originTab || requestedRoute.originTab || requestedRoute.tab || activeTab,
      }), { replace: true });
    }
  };

  return {
    activeTab,
    allApprovalItems,
    allMarketplaceItems,
    approvalCategoryFilter,
    approvalGameFilter,
    approvalPage,
    approvalSortBy,
    approvalTypeFilter,
    cardGridStyle,
    clearCurrentFilters,
    editingKnowledge,
    editingSkill,
    filteredApprovals,
    filteredKnowledge,
    filteredMarketplace,
    filteredSkills,
    gameFilterOptions,
    handleImportFlowEdit,
    handleImportFlowSave,
    handleKnowledgeEditorSave,
    handlePublishAsset,
    handleSkillEditorSave,
    handleTabChange,
    hasActiveFilters,
    hasApprovalFilters,
    hasKnowledgeFilters,
    hasMarketplaceFilters,
    hasSkillFilters,
    importTargetType,
    installedMpIds,
    knowledge,
    knowledgeCategoryFilter,
    knowledgeCategoryOptions,
    knowledgeGameFilter,
    marketplaceCategoryFilter,
    marketplaceCategoryOptions,
    marketplaceGameFilter,
    mpPage,
    mpSortBy,
    mpTypeFilter,
    openApprovalDetail,
    openImportFlow,
    openKnowledgeDetail,
    openKnowledgeMenuAction,
    openLocalSkillDetail,
    openMarketplaceDetail,
    openSkillMenuAction,
    pagedApprovals,
    pagedKnowledge,
    pagedMarketplace,
    pagedSkills,
    publishingAsset,
    resolvedDetail,
    searchQ,
    setApprovalCategoryFilter,
    setApprovalGameFilter,
    setApprovalPage,
    setApprovalSortBy,
    setApprovalTypeFilter,
    setDetailView,
    setEditingKnowledge,
    setEditingSkill,
    setKnowledgeCategoryFilter,
    setKnowledgeGameFilter,
    setKnowledgePage,
    setMarketplaceCategoryFilter,
    setMarketplaceGameFilter,
    setMpPage,
    setMpSortBy,
    setMpTypeFilter,
    setPublishingAsset,
    setSearchByTab,
    setShowCreateKnowledge,
    setShowCreateSkill,
    setShowImportFlow,
    setSkillCategoryFilter,
    setSkillGameFilter,
    setSkillsPage,
    showCreateKnowledge,
    showCreateSkill,
    showImportFlow,
    skillCategories,
    skillCategoryFilter,
    skillCategoryOptions,
    skillGameFilter,
    skillTriggers,
    tabItems,
    toggleKnowledge,
    toggleSkill,
    installMarketplaceItem,
    uninstallMarketplaceItem,
    approveSubmission,
    rejectSubmission,
    copySkill,
    clearDetailView,
    skillsPage,
    knowledgePage,
  };
};
