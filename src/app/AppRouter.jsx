import { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { Spin } from 'antd';
import { AppProLayout } from './layout/AppProLayout';
import { DEFAULT_ROUTE_PATH, PAGE_KEYS, ROUTE_ALIASES, ROUTE_PATH_BY_KEY } from './routes';
import { APP_ROUTE_META } from './routes/routeConfig';

const fallback = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

const RoutedPage = ({ route }) => {
  const PageComponent = route.component;

  return (
    <Suspense fallback={fallback}>
      <PageComponent />
    </Suspense>
  );
};

export const AppRouter = () => {
  const routeElements = useRoutes([
    { path: '/', element: <Navigate to={DEFAULT_ROUTE_PATH} replace /> },
    { path: '/settings/users', element: <Navigate to={ROUTE_PATH_BY_KEY[PAGE_KEYS.SYSTEM]} replace /> },
    ...Object.entries(ROUTE_ALIASES).map(([aliasPath, targetPath]) => ({
      path: aliasPath,
      element: <Navigate to={targetPath} replace />,
    })),
    ...APP_ROUTE_META.map((route) => ({
      path: route.path,
      element: <RoutedPage route={route} />,
    })),
    { path: '*', element: <Navigate to={DEFAULT_ROUTE_PATH} replace /> },
  ]);

  return <AppProLayout>{routeElements}</AppProLayout>;
};
