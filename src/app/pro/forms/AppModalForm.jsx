import { ModalForm } from '@ant-design/pro-components';

export const AppModalForm = ({
  cancelText = 'Cancel',
  open,
  onOpenChange,
  submitText = 'Save',
  submitter,
  width = 520,
  ...props
}) => (
  <ModalForm
    open={open}
    onOpenChange={onOpenChange}
    width={width}
    modalProps={{ destroyOnHidden: true }}
    submitter={submitter ?? {
      searchConfig: { submitText, resetText: cancelText },
    }}
    {...props}
  />
);

export default AppModalForm;
