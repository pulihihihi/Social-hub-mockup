import { Typography } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
} from '@ant-design/icons';

const { Text } = Typography;

export const ValidationList = ({ items }) => {
  const groupedItems = items.reduce((groups, item) => {
    const existingGroup = groups.find((group) => group.title === item.message);
    if (existingGroup) {
      existingGroup.items.push(item);
      return groups;
    }

    return [...groups, { title: item.message, items: [item] }];
  }, []);

  if (!groupedItems.length) {
    return (
      <div className="publishing-new-post-validation-empty">
        <CheckCircleFilled />
        <Text>No publishing issues found.</Text>
      </div>
    );
  }

  return (
    <div className="publishing-new-post-validation-list">
      {groupedItems.map((group) => (
        <div key={group.title} className="publishing-new-post-validation-group">
          <Text strong>{group.title}</Text>
          {group.items.map((item) => (
            <div key={item.key} className={`publishing-new-post-validation-line is-${item.type}`}>
              <span className="publishing-new-post-validation-icon">
                {item.type === 'error' ? <CloseCircleFilled /> : <WarningFilled />}
              </span>
              <Text>{item.description}</Text>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
