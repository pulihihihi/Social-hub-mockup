import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppShell } from '../providers/useAppShell';

export const usePageTopBar = (content) => {
  const { topBarHost } = useAppShell();

  return useMemo(() => {
    if (!content || !topBarHost) {
      return null;
    }

    return createPortal(content, topBarHost);
  }, [content, topBarHost]);
};

export default usePageTopBar;
