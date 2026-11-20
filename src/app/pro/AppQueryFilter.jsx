import { QueryFilter } from '@ant-design/pro-components';
import { T } from '../../theme';

export const AppQueryFilter = ({ children, style, ...props }) => (
  <QueryFilter
    defaultCollapsed={false}
    collapseRender={false}
    submitter={false}
    style={{
      marginBottom: T.paddingMD,
      ...style,
    }}
    {...props}
  >
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      {children}
    </div>
  </QueryFilter>
);

export default AppQueryFilter;
