import { createElement, useEffect, useMemo, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppShell } from '../providers/useAppShell';
import { DEFAULT_ROUTE_PATH } from '../routes';
import GlobalOperationalNotice from '../../components/GlobalOperationalNotice';
import {
  CHANNEL_MANAGEMENT_ROUTE,
  getDisconnectedManagedChannelCount,
} from '../../data/channelManagement';
import { C, T } from '../../theme';
import { ChannelGroupSwitcher } from './ChannelGroupSwitcher';
import { getSidebarMenuTree, getSidebarOpenKeys } from './sidebarMenu';

const socialHubLogoMark = `${import.meta.env.BASE_URL}assets/social-hub-logo-mark.png`;

const shellCss = `
  html[data-card-surface] .social-shell-layout .ant-pro-layout-content {
    background: #e9ebef !important;
  }

  .social-shell-layout .ant-pro-layout-bg-list {
    display: none;
  }

  .social-shell-layout .ant-layout-sider {
    box-shadow: none;
    z-index: 3;
  }

  .social-shell-layout .ant-pro-layout-content {
    padding-block: 0 24px;
    padding-inline: 0;
  }

  .social-page-secondary-host {
    width: 100%;
    min-width: 0;
    padding: ${T.padding}px ${T.paddingLG}px 0;
  }

  .social-page-secondary-host.is-page-header-hidden {
    padding-top: ${T.paddingXS}px;
  }

  .social-page-secondary-host:empty {
    display: none;
    padding: 0;
  }

  .social-shell-layout .ant-layout-sider .ant-menu-item,
  .social-shell-layout .ant-layout-sider .ant-menu-submenu-title {
    border-radius: 12px !important;
    margin-inline: 14px !important;
    width: calc(100% - 28px) !important;
  }

  .social-shell-layout .ant-layout-sider .ant-menu-sub.ant-menu-inline .ant-menu-item {
    padding-inline-start: 42px !important;
  }

  .social-shell-brand {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-width: 0;
    height: 40px;
    cursor: pointer;
  }

  .social-shell-brand.is-collapsed {
    justify-content: center;
  }

  .social-shell-brand-logo-mark {
    display: block;
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  .social-shell-brand-wordmark {
    display: inline-flex;
    align-items: baseline;
    min-width: 0;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
  }

  .social-shell-brand-wordmark-social {
    color: #fff;
  }

  .social-shell-brand-wordmark-hub {
    color: ${T.colorPrimary};
    margin-left: 4px;
  }

  .social-shell-brand-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-item,
  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-submenu-title {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 40px !important;
    height: 40px !important;
    margin-inline: 16px !important;
    padding-inline: 0 !important;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-item .anticon,
  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-submenu-title .anticon {
    margin-inline: 0 !important;
    font-size: 16px;
    line-height: 1;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-title-content,
  .social-shell-layout .ant-layout-sider-collapsed .ant-pro-base-menu-vertical-item-title-collapsed {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    min-width: 0;
    margin-inline: 0 !important;
    overflow: visible;
  }

  .social-shell-layout .ant-layout-sider-collapsed .ant-pro-base-menu-vertical-item-text,
  .social-shell-layout .ant-layout-sider-collapsed .ant-menu-submenu-arrow {
    display: none !important;
  }

  .social-shell-layout .ant-pro-sider-extra {
    width: 100% !important;
    margin-inline: 0 !important;
  }

  .social-channel-group-extra {
    padding: 0 14px 8px 6px;
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-btn.ant-btn:not(.ant-btn-sm):not(.ant-btn-lg):not(.ant-btn-link) {
    display: grid !important;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: auto !important;
    min-height: 50px;
    padding: 7px 10px 7px 7px !important;
    border-radius: 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.26) !important;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06)),
      rgba(255, 255, 255, 0.07) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.28) !important;
    color: rgba(255, 255, 255, 0.9) !important;
    cursor: pointer;
    text-align: left;
    transition:
      background 0.16s ease,
      border-color 0.16s ease,
      box-shadow 0.16s ease,
      transform 0.16s ease;
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-btn.ant-btn:not(.ant-btn-sm):not(.ant-btn-lg):not(.ant-btn-link):hover,
  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-btn.ant-btn:not(.ant-btn-sm):not(.ant-btn-lg):not(.ant-btn-link).ant-dropdown-open {
    border-color: rgba(47, 112, 255, 0.86) !important;
    background:
      linear-gradient(135deg, rgba(47, 112, 255, 0.24), rgba(255, 255, 255, 0.08)),
      rgba(47, 112, 255, 0.18) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 6px 18px rgba(0, 0, 0, 0.36) !important;
    color: #fff !important;
    transform: translateY(-1px);
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger:focus-visible {
    outline: 2px solid ${T.colorPrimary};
    outline-offset: 2px;
  }

  .social-channel-group-trigger-badge {
    line-height: 1;
  }

  .social-channel-group-trigger-badge .ant-badge-dot {
    width: 7px;
    min-width: 7px;
    height: 7px;
    background: #e044a7;
    box-shadow: 0 0 0 1px #141414;
  }

  .social-channel-group-trigger-icon {
    flex: 0 0 auto;
    width: 34px !important;
    height: 34px !important;
    border-radius: 9px !important;
    background: ${T.colorBgContainer} !important;
    color: ${T.colorPrimary} !important;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.24);
  }

  .social-channel-group-trigger-title.ant-typography {
    margin: 0;
    overflow: hidden;
    color: #fff;
    font-size: 13px;
    font-weight: ${T.fontWeightStrong};
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .social-channel-group-trigger-arrow {
    color: rgba(255, 255, 255, 0.72);
    font-size: 11px;
    transition: color 0.16s ease, transform 0.16s ease;
  }

  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger:hover .social-channel-group-trigger-arrow,
  body .social-shell-layout .ant-layout-sider .social-channel-group-trigger.ant-dropdown-open .social-channel-group-trigger-arrow {
    color: #fff;
    transform: translateX(1px);
  }

  .social-channel-group-dropdown .ant-dropdown-menu {
    width: 300px;
    max-height: 360px;
    overflow: auto;
    padding: 6px;
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item {
    min-height: 40px;
    padding: 6px 8px !important;
    border-radius: 8px !important;
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item-icon {
    color: ${T.colorPrimary};
  }

  .social-channel-group-menu-chip.ant-tag {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    max-width: 100%;
    margin: 0;
    padding: 3px 8px;
    overflow: hidden;
    border-color: ${T.colorBorderSecondary};
    border-radius: 6px;
    background: ${T.colorFillQuaternary};
    color: ${T.colorText};
    line-height: 20px;
  }

  .social-channel-group-menu-chip .anticon {
    flex: 0 0 auto;
    color: ${T.colorPrimary};
    font-size: 12px;
  }

  .social-channel-group-menu-chip-text {
    min-width: 0;
    overflow: hidden;
    color: inherit;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item-selected .social-channel-group-menu-chip.ant-tag,
  .social-channel-group-dropdown .ant-dropdown-menu-item:hover .social-channel-group-menu-chip.ant-tag {
    border-color: ${T.colorPrimaryBorder};
    background: ${T.colorPrimaryBg};
    color: ${T.colorPrimary};
  }

  .social-channel-group-dropdown .ant-dropdown-menu-item-selected .social-channel-group-menu-chip .anticon,
  .social-channel-group-dropdown .ant-dropdown-menu-item:hover .social-channel-group-menu-chip .anticon {
    color: ${T.colorPrimary};
  }

  .social-page-top-slot .ant-tabs {
    margin: 0;
  }

  .social-page-top-slot .ant-tabs-nav {
    margin: 0 !important;
  }

  .social-page-top-slot .ant-tabs-nav::before {
    border-bottom: 1px solid ${T.colorBorderSecondary};
  }

  .social-page-top-slot .ant-tabs-tab {
    padding: 18px 0 16px !important;
    font-size: ${T.fontSizeLG}px;
  }

  .social-page-top-slot .ant-tabs-content-holder {
    display: none;
  }

  .social-page-top-slot .ant-tabs-extra-content,
  .social-page-top-slot .ant-tabs-nav-wrap {
    min-width: 0;
  }

  @media (max-width: 767px) {
    .social-shell-layout .ant-pro-layout-content {
      padding-bottom: 16px;
    }

    .social-page-secondary-host {
      padding-inline: ${T.paddingSM}px;
    }

    .social-page-top-slot .ant-tabs-tab {
      padding: 14px 0 12px !important;
      font-size: ${T.fontSize}px;
    }
  }
`;

const siderThemeToken = {
  layout: {
    bgLayout: T.colorBgLayout,
    sider: {
      colorMenuBackground: C.sidebarBg,
      colorMenuItemDivider: C.sidebarBorder,
      colorTextMenu: 'rgba(255,255,255,0.85)',
      colorTextMenuSecondary: C.sidebarWhite60,
      colorTextMenuTitle: '#fff',
      colorTextMenuItemHover: '#fff',
      colorTextMenuSelected: '#fff',
      colorBgMenuItemHover: C.sidebarOverlay10,
      colorBgMenuItemActive: C.sidebarOverlay10,
      colorBgMenuItemSelected: T.colorPrimary,
      paddingBlockLayoutMenu: T.paddingSM,
      paddingInlineLayoutMenu: T.paddingXS,
    },
  },
};

const siderStylish = (token) => ({
  backgroundColor: C.sidebarBg,
  [`& ${token.antCls}-layout-sider-children`]: {
    backgroundColor: C.sidebarBg,
    borderInlineEnd: `1px solid ${C.sidebarBorder}`,
  },
  [`& ${token.antCls}-menu, & ${token.antCls}-menu-sub`]: {
    background: 'transparent !important',
  },
  [`& ${token.antCls}-menu-item, & ${token.antCls}-menu-submenu-title`]: {
    color: 'rgba(255,255,255,0.85)',
  },
  [`& ${token.antCls}-menu-item:hover, & ${token.antCls}-menu-submenu-title:hover`]: {
    color: '#fff !important',
    backgroundColor: C.sidebarOverlay10,
  },
  [`& ${token.antCls}-menu-item-selected`]: {
    color: '#fff !important',
    backgroundColor: `${T.colorPrimary} !important`,
  },
  [`& ${token.antCls}-menu-submenu-selected > ${token.antCls}-menu-submenu-title`]: {
    color: '#fff !important',
    backgroundColor: C.sidebarOverlay10,
  },
  [`& ${token.antCls}-menu-item .anticon, & ${token.antCls}-menu-submenu-title .anticon`]: {
    color: 'inherit',
  },
});

const mapMenuNodeToRoute = (node) => ({
  path: node.path,
  name: node.name,
  icon: node.icon ? createElement(node.icon) : null,
  routes: node.children?.map(mapMenuNodeToRoute),
});

export const AppProLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    pageHeaderHidden,
    sidebarCollapsed,
    setSidebarCollapsed,
    registerTopBarHost,
    registerTopBarSecondaryHost,
  } = useAppShell();

  const menuRoutes = useMemo(
    () => getSidebarMenuTree().map(mapMenuNodeToRoute),
    [],
  );
  const [openKeys, setOpenKeys] = useState(() => getSidebarOpenKeys(location.pathname));
  const [showDisconnectedNotice, setShowDisconnectedNotice] = useState(true);
  const disconnectedChannelCount = useMemo(() => getDisconnectedManagedChannelCount(), []);
  const hasDisconnectedChannels = disconnectedChannelCount > 0;
  const handleMenuHeaderClick = () => navigate(DEFAULT_ROUTE_PATH);

  useEffect(() => {
    const nextOpenKeys = getSidebarOpenKeys(location.pathname);

    if (nextOpenKeys.length === 0) {
      return;
    }

    setOpenKeys((currentKeys) => (
      nextOpenKeys.every((key) => currentKeys.includes(key))
        ? currentKeys
        : [...new Set([...currentKeys, ...nextOpenKeys])]
    ));
  }, [location.pathname]);

  return (
    <>
      <style>{shellCss}</style>
      <ProLayout
        className="social-shell-layout"
        layout="side"
        navTheme="light"
        splitMenus={false}
        stylish={{ sider: siderStylish }}
        fixSiderbar
        headerRender={false}
        siderWidth={232}
        collapsedWidth={72}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        token={siderThemeToken}
        location={{ pathname: location.pathname }}
        route={{ routes: menuRoutes }}
        menuProps={{
          selectedKeys: [location.pathname],
          openKeys,
          onOpenChange: (keys) => setOpenKeys(keys),
        }}
        menuExtraRender={() => (
          sidebarCollapsed ? null : (
            <div className="social-channel-group-extra">
              <ChannelGroupSwitcher />
            </div>
          )
        )}
        title={false}
        logo={null}
        menuHeaderRender={() => (
          <div
            className={sidebarCollapsed ? 'social-shell-brand is-collapsed' : 'social-shell-brand'}
            onClick={handleMenuHeaderClick}
          >
            <img
              src={socialHubLogoMark}
              alt=""
              aria-hidden="true"
              className="social-shell-brand-logo-mark"
            />
            {!sidebarCollapsed ? (
              <span className="social-shell-brand-wordmark" aria-hidden="true">
                <span className="social-shell-brand-wordmark-social">Social</span>
                <span className="social-shell-brand-wordmark-hub">Hub</span>
              </span>
            ) : null}
            <span className="social-shell-brand-sr">Social Hub</span>
          </div>
        )}
        menuItemRender={(item, dom) => (
          item.routes?.length
            ? dom
            : (
              <span
                onClick={() => item.path && navigate(item.path)}
                style={{ display: 'inline-flex', width: '100%' }}
              >
                {dom}
              </span>
            )
        )}
        contentStyle={{
          background: T.colorBgLayout,
          minHeight: '100vh',
          color: T.colorTextBase,
        }}
      >
        <div
          className={pageHeaderHidden ? 'social-page-top-slot is-page-header-hidden' : 'social-page-top-slot'}
          style={{
            position: 'relative',
            background: pageHeaderHidden ? 'transparent' : T.colorBgContainer,
            borderBottom: pageHeaderHidden ? 0 : `1px solid ${T.colorBorderSecondary}`,
            boxShadow: pageHeaderHidden ? 'none' : '0 1px 2px rgba(0,0,0,0.02)',
            minHeight: pageHeaderHidden ? 0 : T.headerHeight,
            height: pageHeaderHidden ? 0 : undefined,
            display: 'flex',
            alignItems: 'stretch',
            overflow: 'visible',
          }}
        >
          <button
            type="button"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            style={{
              position: 'absolute',
              top: 10,
              left: 0,
              transform: 'translateX(-50%)',
              width: 36,
              height: 36,
              border: 'none',
              borderRadius: '50%',
              background: T.colorBgContainer,
              color: T.colorTextSecondary,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              zIndex: T.zHeader + 1,
            }}
          >
            {sidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
          </button>
          <div
            ref={registerTopBarHost}
            style={{
              width: '100%',
              minWidth: 0,
            }}
          />
        </div>
        <div
          ref={registerTopBarSecondaryHost}
          className={pageHeaderHidden ? 'social-page-secondary-host is-page-header-hidden' : 'social-page-secondary-host'}
        />
        {children}
      </ProLayout>
      <GlobalOperationalNotice
        count={disconnectedChannelCount}
        onAction={() => navigate(CHANNEL_MANAGEMENT_ROUTE)}
        onClose={() => setShowDisconnectedNotice(false)}
        open={showDisconnectedNotice && hasDisconnectedChannels}
      />
    </>
  );
};

export default AppProLayout;
