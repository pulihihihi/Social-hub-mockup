import { Typography } from 'antd';
import { T } from '../../theme';

const { Title, Text } = Typography;

const normalizeMetaNode = (meta) => {
  if (meta == null || meta === false) {
    return null;
  }

  return typeof meta === 'string' || typeof meta === 'number'
    ? <Text type="secondary">{meta}</Text>
    : meta;
};

export const AppPageTopBar = ({
  title,
  headerMeta,
  headerExtra,
  controls,
}) => {
  const metaNode = normalizeMetaNode(headerMeta);
  const hasHeaderRow = Boolean(title || metaNode || headerExtra);

  return (
    <div
      className="social-page-top-bar"
      style={{
        width: '100%',
        color: T.colorTextBase,
      }}
    >
      <div
        style={{
          width: '100%',
          padding: `0 ${T.paddingMD}px`,
        }}
      >
        {hasHeaderRow ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: T.padding,
              flexWrap: 'wrap',
              minHeight: T.headerHeight,
            }}
          >
            <div style={{ minWidth: 0, display: 'grid', gap: 0, flex: '1 1 auto' }}>
              {title ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: T.paddingXS, flexWrap: 'wrap', minWidth: 0 }}>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: T.colorTextBase,
                      fontSize: T.fontSizeXL + 2,
                      lineHeight: 1.2,
                      fontWeight: T.fontWeightStrong,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {title}
                  </Title>
                  {metaNode}
                </div>
              ) : metaNode}
            </div>
            {headerExtra ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: T.paddingSM,
                  flexWrap: 'wrap',
                  marginLeft: 'auto',
                }}
              >
                {headerExtra}
              </div>
            ) : null}
          </div>
        ) : null}

        {controls ? (
          <div
            style={{
              marginTop: hasHeaderRow ? -T.paddingXXS : 0,
              paddingBottom: hasHeaderRow ? 0 : T.paddingXS,
            }}
          >
            {controls}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AppPageTopBar;
