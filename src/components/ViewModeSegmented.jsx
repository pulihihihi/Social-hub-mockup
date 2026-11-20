import { Segmented, Tooltip } from 'antd';
import './ViewModeSegmented.css';

const joinClassNames = (...classNames) => classNames.filter(Boolean).join(' ');

const renderOptionLabel = ({ ariaLabel, icon, label, tooltip }) => {
  const hasVisibleText = label != null && label !== '';
  const accessibleLabel = ariaLabel || tooltip || (typeof label === 'string' ? label : undefined);
  const labelNode = (
    <span
      className={joinClassNames(
        'social-view-segmented-option',
        icon ? 'has-icon' : null,
        hasVisibleText ? 'has-text' : 'is-icon-only',
      )}
    >
      {icon ? <span className="social-view-segmented-icon" aria-hidden="true">{icon}</span> : null}
      {hasVisibleText ? (
        <span className="social-view-segmented-text">{label}</span>
      ) : (
        <span className="social-view-segmented-sr">{accessibleLabel}</span>
      )}
    </span>
  );

  return tooltip ? <Tooltip title={tooltip}>{labelNode}</Tooltip> : labelNode;
};

const normalizeOption = ({ ariaLabel, icon, label, tooltip, ...option }) => ({
  ...option,
  label: renderOptionLabel({ ariaLabel, icon, label, tooltip }),
});

export const ViewModeSegmented = ({
  ariaLabel,
  className,
  options,
  ...segmentedProps
}) => (
  <Segmented
    aria-label={ariaLabel}
    className={joinClassNames('social-view-segmented', className)}
    options={options.map(normalizeOption)}
    {...segmentedProps}
  />
);
