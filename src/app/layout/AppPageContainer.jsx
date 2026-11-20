import { cloneElement, isValidElement, useEffect, useMemo } from 'react';
import { T } from '../../theme';
import { AppPageControls } from './AppPageControls';
import { AppPageTopBar } from './AppPageTopBar';
import { useAppShell } from '../providers/useAppShell';
import { usePageSecondaryTopBar } from './usePageSecondaryTopBar';
import { usePageTopBar } from './usePageTopBar';

export const AppPageContainer = ({
  title,
  headerExtra,
  headerMeta,
  topBarControls,
  hidePageHeader = false,
  maxWidth = 'none',
  contentPadding = `${T.padding}px ${T.paddingLG}px ${T.paddingLG}px`,
  children,
}) => {
  const { setPageHeaderHidden } = useAppShell();
  const isTabsFirstTopBar =
    isValidElement(topBarControls) &&
    topBarControls.type === AppPageControls &&
    topBarControls.props.layout === 'tabs-first';

  useEffect(() => {
    setPageHeaderHidden(Boolean(hidePageHeader));

    return () => setPageHeaderHidden(false);
  }, [hidePageHeader, setPageHeaderHidden]);

  const resolvedTopBarControls = useMemo(() => {
    if (!topBarControls) {
      return null;
    }

    if (isValidElement(topBarControls) && topBarControls.type === AppPageControls) {
      return cloneElement(topBarControls, { marginBottom: 0 });
    }

    return topBarControls;
  }, [topBarControls]);

  const primaryTopBarControls = isTabsFirstTopBar ? resolvedTopBarControls : null;
  const secondaryTopBarControls = isTabsFirstTopBar ? null : resolvedTopBarControls;

  const topBarContent = useMemo(() => {
    if (hidePageHeader) {
      return null;
    }

    const resolvedTitle = isTabsFirstTopBar ? null : title;
    const resolvedHeaderExtra = isTabsFirstTopBar ? null : headerExtra;
    const resolvedHeaderMeta = isTabsFirstTopBar ? null : headerMeta;

    if (!resolvedTitle && !resolvedHeaderExtra && !resolvedHeaderMeta && !primaryTopBarControls) {
      return null;
    }

    return (
      <AppPageTopBar
        title={resolvedTitle}
        headerMeta={resolvedHeaderMeta}
        headerExtra={resolvedHeaderExtra}
        controls={primaryTopBarControls}
        maxWidth={maxWidth}
      />
    );
  }, [headerExtra, headerMeta, hidePageHeader, isTabsFirstTopBar, maxWidth, primaryTopBarControls, title]);

  const topBarPortal = usePageTopBar(topBarContent);
  const secondaryTopBarPortal = usePageSecondaryTopBar(secondaryTopBarControls, { maxWidth });

  return (
    <>
      {topBarPortal}
      {secondaryTopBarPortal}
      <div
        style={{
          width: '100%',
          color: T.colorTextBase,
        }}
      >
        <div
          style={{
            padding: contentPadding,
            maxWidth,
            width: '100%',
            marginInline: 'auto',
            color: T.colorTextBase,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default AppPageContainer;
