import { useEffect } from 'react';
import { T } from '../../theme';

// Pages that use these cards get a darker page surface (see shellCss in AppProLayout).
let mountedCardCount = 0;

const useCardSurface = () => {
  useEffect(() => {
    mountedCardCount += 1;
    document.documentElement.dataset.cardSurface = 'true';
    return () => {
      mountedCardCount -= 1;
      if (mountedCardCount <= 0) {
        delete document.documentElement.dataset.cardSurface;
      }
    };
  }, []);
};

const cardStyle = {
  background: T.colorBgContainer,
  borderRadius: 16,
  boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
};

export const AppToolbarCard = ({ children, style }) => {
  useCardSurface();
  return (
  <div style={{ ...cardStyle, padding: T.paddingSM, marginBottom: 16, ...style }}>{children}</div>
  );
};

export const AppTableCard = ({ children, style }) => {
  useCardSurface();
  return (
  <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', ...style }}>{children}</div>
  );
};
