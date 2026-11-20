import { AppPageContainer } from '../app/layout/AppPageContainer';

export default function AdminPageLayout({
  title,
  children,
  breadcrumb,
  headerExtra,
  headerMeta,
  badge,
  pageControls,
  hidePageHeader,
  maxWidth,
  contentPadding,
}) {
  return (
    <AppPageContainer
      title={title}
      breadcrumb={breadcrumb}
      headerExtra={headerExtra}
      headerMeta={headerMeta ?? badge}
      topBarControls={pageControls}
      hidePageHeader={hidePageHeader}
      maxWidth={maxWidth}
      contentPadding={contentPadding}
    >
      {children}
    </AppPageContainer>
  );
}
