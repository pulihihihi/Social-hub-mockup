import { useEffect, useState } from 'react';
import { T } from '../../theme';

const toolbarSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: T.paddingSM,
  flexWrap: 'wrap',
};

const XL_BREAKPOINT = 1200;

const getIsWideViewport = () => (
  typeof window === 'undefined' ? true : window.innerWidth >= XL_BREAKPOINT
);

export const AppPageToolbar = ({ left, right, style, actionPlacement = 'end' }) => {
  const [isWideViewport, setIsWideViewport] = useState(getIsWideViewport);
  const shouldInlineActions = actionPlacement === 'inline' && left && right && isWideViewport;
  const justifyContent = left && right
    ? (shouldInlineActions ? 'flex-start' : 'space-between')
    : right
      ? 'flex-end'
      : 'flex-start';

  useEffect(() => {
    const handleResize = () => setIsWideViewport(getIsWideViewport());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      data-testid="app-page-toolbar"
      style={{
        display: 'flex',
        alignItems: isWideViewport ? 'center' : 'flex-start',
        justifyContent,
        gap: T.paddingSM,
        flexWrap: isWideViewport ? 'nowrap' : 'wrap',
        marginBottom: T.paddingSM,
        ...style,
      }}
    >
      {left ? (
        <div
          data-testid="app-page-toolbar-left"
          style={{
            ...toolbarSectionStyle,
            flex: left && right && !shouldInlineActions ? '1 1 auto' : '0 1 auto',
            minWidth: 0,
            width: left && right && !isWideViewport ? '100%' : undefined,
          }}
        >
          {left}
        </div>
      ) : null}
      {right ? (
        <div
          data-testid="app-page-toolbar-right"
          style={{
            ...toolbarSectionStyle,
            justifyContent: shouldInlineActions ? 'flex-start' : 'flex-end',
            marginLeft: left && right && isWideViewport && !shouldInlineActions ? 'auto' : undefined,
            width: left && right && !isWideViewport ? '100%' : undefined,
            flex: left && right && !isWideViewport ? '1 1 100%' : '0 0 auto',
          }}
        >
          {right}
        </div>
      ) : null}
    </div>
  );
};

export default AppPageToolbar;
