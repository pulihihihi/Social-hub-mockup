import AssetEditorView from "./AssetEditorView";

const AiSkillEditorPanel = ({ model }) => {
  const {
    editingKnowledge,
    editingSkill,
    handleKnowledgeEditorSave,
    handleSkillEditorSave,
    knowledge,
    setEditingKnowledge,
    setEditingSkill,
    setShowCreateKnowledge,
    setShowCreateSkill,
    showCreateKnowledge,
    showCreateSkill,
  } = model;

  if (showCreateSkill || editingSkill) {
    return (
      <AssetEditorView
        type="skill"
        item={editingSkill || null}
        knowledge={knowledge}
        onBack={() => {
          setShowCreateSkill(false);
          setEditingSkill(null);
        }}
        onSave={(newSkill) => handleSkillEditorSave(newSkill, Boolean(editingSkill?.id), editingSkill?.linkedKnowledge || [])}
      />
    );
  }

  if (showCreateKnowledge || editingKnowledge) {
    return (
      <AssetEditorView
        type="knowledge"
        item={editingKnowledge || null}
        knowledge={knowledge}
        onBack={() => {
          setShowCreateKnowledge(false);
          setEditingKnowledge(null);
        }}
        onSave={handleKnowledgeEditorSave}
      />
    );
  }

  return null;
};

export default AiSkillEditorPanel;
