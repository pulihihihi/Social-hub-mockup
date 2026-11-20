import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppShell } from '../providers/useAppShell';

export const usePageSecondaryTopBar = (content, options = {}) => {
  const { topBarSecondaryHost } = useAppShell();
  const {
    maxWidth = 'none',
    paddingInline = 24,
  } = options;
  const contentWidth = typeof maxWidth === 'number'
    ? Math.max(maxWidth - (paddingInline * 2), 0)
    : maxWidth;

  return useMemo(() => {
    if (!content || !topBarSecondaryHost) {
      return null;
    }

    return createPortal(
      (
        <div
          style={{
            width: '100%',
            maxWidth: contentWidth,
            minWidth: 0,
          }}
        >
          {content}
        </div>
      ),
      topBarSecondaryHost,
    );
  }, [content, contentWidth, topBarSecondaryHost]);
};

export default usePageSecondaryTopBar;
