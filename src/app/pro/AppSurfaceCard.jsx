import { ProCard } from '@ant-design/pro-components';
import { C, T } from '../../theme';

export const AppSurfaceCard = ({
  title,
  subtitle,
  extra,
  children,
  bodyStyle,
  headStyle,
  noPadding = false,
  style,
  styles,
  ...props
}) => {
  const resolvedTitle = title ? (
    <div style={{ display: 'grid', gap: subtitle ? 2 : 0 }}>
      <span style={{ fontWeight: T.fontWeightStrong, color: T.colorTextBase }}>{title}</span>
      {subtitle ? (
        <span style={{ fontSize: T.fontSizeSM, color: T.colorTextSecondary }}>{subtitle}</span>
      ) : null}
    </div>
  ) : undefined;

  return (
    <ProCard
      title={resolvedTitle}
      extra={extra}
      styles={{
        ...styles,
        body: {
          padding: noPadding ? 0 : 20,
          ...styles?.body,
          ...bodyStyle,
        },
        header: {
          padding: '16px 20px',
          borderBottom: title || extra ? `1px solid ${T.colorBorderSecondary}` : 'none',
          ...styles?.header,
          ...headStyle,
        },
      }}
      style={{
        background: C.white,
        borderColor: T.colorBorderSecondary,
        boxShadow: 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </ProCard>
  );
};

export default AppSurfaceCard;
