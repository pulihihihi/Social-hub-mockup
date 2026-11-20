import { ProDescriptions } from '@ant-design/pro-components';
import { T } from '../../theme';

export const AppMetaDescriptions = ({
  items = [],
  column = 1,
  emptyText = '--',
  style,
  ...props
}) => {
  const dataSource = items.reduce((accumulator, item, index) => {
    const key = item.key || `field_${index}`;
    accumulator[key] = item.value ?? emptyText;
    return accumulator;
  }, {});

  const columns = items.map((item, index) => {
    const key = item.key || `field_${index}`;

    return {
      title: item.label,
      dataIndex: key,
      ...item.columnProps,
    };
  });

  return (
    <ProDescriptions
      column={column}
      dataSource={dataSource}
      columns={columns}
      emptyText={emptyText}
      style={{
        width: '100%',
        ...style,
      }}
      labelStyle={{
        color: T.colorTextSecondary,
        fontSize: T.fontSizeSM,
      }}
      contentStyle={{
        color: T.colorTextBase,
        fontWeight: T.fontWeightStrong,
      }}
      {...props}
    />
  );
};

export default AppMetaDescriptions;
