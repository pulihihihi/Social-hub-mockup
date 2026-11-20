import { Button } from 'antd';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CHANNEL_TERMINOLOGY } from '../data/channelManagement';
import './GlobalOperationalNotice.css';

const GlobalOperationalNotice = ({
  actionLabel = 'View more',
  count,
  description,
  onAction,
  onClose,
  open = true,
  title,
}) => {
  if (!open) {
    return null;
  }

  const channelCount = count ?? 0;
  const noticeTitle = title || `${channelCount} of your ${CHANNEL_TERMINOLOGY.lowerPlural} have been disconnected`;
  const noticeDescription = description
    || `It looks like ${channelCount} of your selected ${CHANNEL_TERMINOLOGY.lowerPlural} need reauthorization.`;

  return (
    <div className="global-operational-notice" role="alert" aria-live="assertive">
      <span className="global-operational-notice-accent" aria-hidden="true" />
      <ExclamationCircleOutlined className="global-operational-notice-icon" />
      <div className="global-operational-notice-content">
        <div className="global-operational-notice-title">{noticeTitle}</div>
        <div className="global-operational-notice-description">{noticeDescription}</div>
        {actionLabel ? (
          <Button type="link" className="global-operational-notice-action" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
      <Button
        aria-label="Dismiss notification"
        className="global-operational-notice-close"
        icon={<CloseOutlined />}
        onClick={onClose}
        type="text"
      />
    </div>
  );
};

export default GlobalOperationalNotice;
