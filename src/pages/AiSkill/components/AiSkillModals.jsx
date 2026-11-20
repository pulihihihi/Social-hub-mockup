import ImportFlowModal from "../modals/ImportFlowModal";
import PublishSkillModal from "../modals/PublishSkillModal";

const AiSkillModals = ({ model }) => (
  <>
    <ImportFlowModal
      visible={model.showImportFlow}
      targetType={model.importTargetType}
      onClose={() => model.setShowImportFlow(false)}
      onImport={model.handleImportFlowSave}
      onEdit={model.handleImportFlowEdit}
    />

    {model.publishingAsset ? (
      <PublishSkillModal
        asset={model.publishingAsset}
        onClose={() => model.setPublishingAsset(null)}
        onPublish={model.handlePublishAsset}
      />
    ) : null}
  </>
);

export default AiSkillModals;
