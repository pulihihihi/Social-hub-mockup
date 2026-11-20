import { useCallback, useMemo, useState } from 'react';
import { AppShellContext } from './AppShellContextValue';

export const AppShellProvider = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageHeaderHidden, setPageHeaderHidden] = useState(false);
  const [topBarHost, setTopBarHost] = useState(null);
  const [topBarSecondaryHost, setTopBarSecondaryHost] = useState(null);

  const registerTopBarHost = useCallback((node) => {
    setTopBarHost((current) => (current === node ? current : node));
  }, []);

  const registerTopBarSecondaryHost = useCallback((node) => {
    setTopBarSecondaryHost((current) => (current === node ? current : node));
  }, []);

  const value = useMemo(() => ({
    pageHeaderHidden,
    sidebarCollapsed,
    topBarHost,
    topBarSecondaryHost,
    setPageHeaderHidden,
    setSidebarCollapsed,
    registerTopBarHost,
    registerTopBarSecondaryHost,
    toggleSidebar: () => setSidebarCollapsed((collapsed) => !collapsed),
  }), [pageHeaderHidden, registerTopBarHost, registerTopBarSecondaryHost, sidebarCollapsed, topBarHost, topBarSecondaryHost]);

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
};
