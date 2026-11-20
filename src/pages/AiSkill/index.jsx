import AdminPageLayout from "../../components/AdminPageLayout";
import { T } from "../../theme";
import AiSkillDetailPanel from "./components/AiSkillDetailPanel";
import AiSkillEditorPanel from "./components/AiSkillEditorPanel";
import AiSkillModals from "./components/AiSkillModals";
import { AiSkillSecondaryToolbar, AiSkillTabsControls } from "./components/AiSkillPageControls";
import AiSkillTabContent from "./components/AiSkillTabContent";
import { useAiSkillPageModel } from "./useAiSkillPageModel";

const AiSkillPage = () => {
  const model = useAiSkillPageModel();
  const hasEditorOrDetail = Boolean(
    model.showCreateSkill ||
      model.editingSkill ||
      model.showCreateKnowledge ||
      model.editingKnowledge ||
      model.resolvedDetail,
  );
  const editorContent =
    model.showCreateSkill || model.editingSkill || model.showCreateKnowledge || model.editingKnowledge ? (
      <AiSkillEditorPanel model={model} />
    ) : null;
  const detailContent = !editorContent && model.resolvedDetail ? <AiSkillDetailPanel model={model} /> : null;

  return (
    <>
      <AiSkillSecondaryToolbar model={model} hasEditorOrDetail={hasEditorOrDetail} />
      <AdminPageLayout
        title="AI Skill"
        contentPadding={`${T.paddingXS}px ${T.paddingLG}px ${T.paddingXS}px`}
        pageControls={<AiSkillTabsControls model={model} hasEditorOrDetail={hasEditorOrDetail} />}
      >
        {editorContent || detailContent || <AiSkillTabContent model={model} />}
        <AiSkillModals model={model} />
      </AdminPageLayout>
    </>
  );
};

export { AiSkillPage };
export default AiSkillPage;
