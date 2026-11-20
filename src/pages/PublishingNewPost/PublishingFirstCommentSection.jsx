import {
  Button,
  Collapse,
  Input,
  Typography,
} from 'antd';
import {
  CommentOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { NEW_POST_TOOLTIPS } from './publishingComposerConfig';
import { NewPostAiAssistActions } from './NewPostAiAssistActions';
import { getPlatformMeta } from './publishingComposerUtils';
import { TooltipContent } from './PublishingTooltip';

const { Text } = Typography;

export const FirstCommentComposer = ({
  label,
  maxLength,
  onChange,
  onSaveToAssetLibrary,
  value,
}) => (
  <div className="publishing-new-post-comment-box">
    <Input.TextArea
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder=""
    />
    <div className="publishing-new-post-comment-actions">
      <TooltipContent title={NEW_POST_TOOLTIPS.firstComment}>
        <Button
          aria-label="Insert First Comment"
          className="publishing-new-post-comment-action"
          icon={<CommentOutlined />}
          type="text"
        />
      </TooltipContent>
      <TooltipContent title={NEW_POST_TOOLTIPS.saveFirstCommentToAssetLibrary}>
        <Button
          aria-label="Save to Asset Library"
          className="publishing-new-post-comment-action"
          icon={<PlusSquareOutlined />}
          onClick={() => onSaveToAssetLibrary?.(value, { label })}
          type="text"
        />
      </TooltipContent>
    </div>
    <Text>{Math.max(maxLength - value.length, 0)}</Text>
  </div>
);

export const FirstCommentSection = ({
  activeNetwork,
  firstComment,
  mode,
  onChange,
  onAiAssist,
  onSaveToAssetLibrary,
}) => {
  const label = mode === 'per_network'
    ? `${getPlatformMeta(activeNetwork).label} First Comment`
    : 'First Comment';
  const maxLength = mode === 'all_networks' ? 1500 : 8000;

  return (
    <Collapse
      defaultActiveKey={['first-comment']}
      expandIconPosition="end"
      className="publishing-new-post-section-collapse"
      items={[
        {
          key: 'first-comment',
          label,
          extra: (
            <NewPostAiAssistActions
              configLabel="First Comment"
              onAiAssist={onAiAssist}
              primaryButtonType="link"
              sectionKeys={['firstComment']}
              size="small"
              stopPropagation
            />
          ),
          children: (
            <div className="publishing-new-post-first-comment">
              {mode === 'all_networks' ? (
                <Text>
                  Add a first comment for selected Instagram, Facebook, and LinkedIn channels. Use customize post per network to edit or limit first comment to specific networks.
                </Text>
              ) : null}
              <FirstCommentComposer
                label={label}
                maxLength={maxLength}
                onChange={onChange}
                onSaveToAssetLibrary={onSaveToAssetLibrary}
                value={firstComment}
              />
            </div>
          ),
        },
      ]}
    />
  );
};
