import { Tooltip } from 'antd';
import { TOOLTIP_DELAY } from './publishingComposerConfig';

export const TooltipContent = ({ children, title, ...props }) => (
  <Tooltip mouseEnterDelay={TOOLTIP_DELAY} title={title} {...props}>
    {children}
  </Tooltip>
);

export const TooltipTarget = ({ children, title, ...props }) => (
  <TooltipContent title={title} {...props}>
    <span className="publishing-new-post-tooltip-target">{children}</span>
  </TooltipContent>
);
